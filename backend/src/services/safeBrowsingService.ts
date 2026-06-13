import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface SafeBrowsingResult {
  is_malicious: boolean;
  threat_type?: string;
  error?: string;
}

const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

export const checkGoogleSafeBrowsing = async (url: string): Promise<SafeBrowsingResult> => {
  if (!API_KEY) {
    // Graceful fallback if no API key is provided
    console.warn('Google Safe Browsing API Key is not configured. Skipping live threat lookup.');
    return { is_malicious: false };
  }

  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;
    const payload = {
      client: {
        clientId: 'techflora-phishing-detector',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    const response = await axios.post(endpoint, payload);

    if (response.data && response.data.matches && response.data.matches.length > 0) {
      const match = response.data.matches[0];
      return {
        is_malicious: true,
        threat_type: match.threatType
      };
    }

    return { is_malicious: false };
  } catch (err: any) {
    console.error('Error querying Google Safe Browsing API:', err.message);
    return {
      is_malicious: false,
      error: err.message
    };
  }
};
