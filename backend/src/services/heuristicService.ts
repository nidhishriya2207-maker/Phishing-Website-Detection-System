import { URL } from 'url';

export interface HeuristicResult {
  url_length: number;
  is_length_suspicious: boolean;
  has_ip_address: boolean;
  subdomain_count: number;
  is_subdomain_depth_suspicious: boolean;
  has_at_symbol: boolean;
  hyphen_count_in_domain: number;
  suspicious_keywords_count: number;
  is_idn_attack: boolean;
  score: number; // calculated local heuristics subscore (0-100)
}

export const analyzeHeuristics = (urlString: string): HeuristicResult => {
  let urlObj: URL;
  let hostname = '';
  let isValidUrl = true;

  try {
    let formattedUrl = urlString;
    if (!/^https?:\/\//i.test(urlString)) {
      formattedUrl = 'http://' + urlString;
    }
    urlObj = new URL(formattedUrl);
    hostname = urlObj.hostname;
  } catch (err) {
    isValidUrl = false;
    // Extract hostname manually from malformed URL
    const parts = urlString.split('/')[2] || urlString;
    hostname = parts.split(':')[0];
  }

  const urlLength = urlString.length;
  const isLengthSuspicious = urlLength > 75;
  const hasAtSymbol = urlString.includes('@');

  // ✅ ALWAYS check for keywords even if URL parsing failed
  const keywords = [
    'login', 'secure', 'verify', 'update', 'signin', 'banking', 'paypal', 
    'netflix', 'amazon', 'auth', 'account', 'wallet', 'recover', 'scam', 
    'fake', 'phish', 'support', 'billing', 'confirm', 'free', 'gift', 
    'bonus', 'claim', 'service', 'security', 'official', 'webscr'
  ];
  
  let suspicious_keywords_count = 0;
  const lowercaseUrl = urlString.toLowerCase();
  keywords.forEach(keyword => {
    if (lowercaseUrl.includes(keyword)) {
      suspicious_keywords_count++;
    }
  });

  // If URL parsing failed, return with keywords still counted
  if (!isValidUrl) {
    return {
      url_length: urlLength,
      is_length_suspicious: isLengthSuspicious,
      has_ip_address: false,
      subdomain_count: 0,
      is_subdomain_depth_suspicious: false,
      has_at_symbol: hasAtSymbol,
      hyphen_count_in_domain: hostname.split('-').length - 1,
      suspicious_keywords_count: suspicious_keywords_count,  // ✅ NOW COUNTED!
      is_idn_attack: false,
      score: (hasAtSymbol ? 40 : 0) + (suspicious_keywords_count > 0 ? 20 : 0) + (isLengthSuspicious ? 15 : 0)
    };
  }

  // ... rest of normal parsing
  const parts = hostname.split('.');
  const subdomainCount = parts.length > 2 ? parts.length - 2 : 0;
  const isSubdomainDepthSuspicious = parts.length > 4;
  
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const hasIPAddress = ipv4Regex.test(hostname);
  
  const hyphenCountInDomain = (hostname.match(/-/g) || []).length;
  const isIDNAttack = hostname.toLowerCase().startsWith('xn--');

  let score = 0;
  if (hasAtSymbol) score += 40;
  if (hasIPAddress) score += 30;
  if (isLengthSuspicious) score += 15;
  if (isSubdomainDepthSuspicious) score += 15;
  if (hyphenCountInDomain >= 3) score += 15;
  if (isIDNAttack) score += 20;
  score += suspicious_keywords_count * 10;
  score = Math.min(score, 100);

  return {
    url_length: urlLength,
    is_length_suspicious: isLengthSuspicious,
    has_ip_address: hasIPAddress,
    subdomain_count: subdomainCount,
    is_subdomain_depth_suspicious: isSubdomainDepthSuspicious,
    has_at_symbol: hasAtSymbol,
    hyphen_count_in_domain: hyphenCountInDomain,
    suspicious_keywords_count: suspicious_keywords_count,  // ✅ ALWAYS COUNTED
    is_idn_attack: isIDNAttack,
    score
  };
};