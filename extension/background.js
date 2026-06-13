const BACKEND_URL = 'http://localhost:5000/api/scan';
const scanCache = {};

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    handleNavigation(tabId, tab.url);
  }
});

// Listen for tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      handleNavigation(activeInfo.tabId, tab.url);
    }
  });
});

// Handle incoming request messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getScanResult') {
    const url = request.url;
    if (scanCache[url]) {
      sendResponse({ status: 'success', data: scanCache[url] });
    } else {
      // Trigger scan in background and return scanning state
      scanUrl(url).then(result => {
        sendResponse({ status: 'success', data: result });
      }).catch(err => {
        sendResponse({ status: 'error', message: err.message });
      });
      return true; // Keep channel open for async response
    }
  }
});

async function handleNavigation(tabId, url) {
  // Skip internal chrome pages or localhost/dev instances
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:') || url.includes('localhost') || url.includes('127.0.0.1')) {
    return;
  }

  try {
    const scanResult = await scanUrl(url);
    
    // Send message to content script to render page warnings if needed
    chrome.tabs.sendMessage(tabId, {
      action: 'showWarning',
      result: scanResult
    }).catch(err => {
      // Content script may not be loaded yet, this is expected for fast transitions
      console.log('Content script message failed: ', err.message);
    });

    // Handle system notifications for critical phishing threats (> 80 risk score)
    if (scanResult.riskScore > 80) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        title: 'Phishing Detected! (TechFlora)',
        message: `Warning: ${new URL(url).hostname} appears to be dangerous. Proceed with caution.`,
        priority: 2
      });
    }
  } catch (error) {
    console.error('Background scanning error:', error);
  }
}

async function scanUrl(url) {
  // Return cached result if available
  if (scanCache[url]) {
    return scanCache[url];
  }

  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url,
      source: 'extension'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to scan URL from backend');
  }

  const result = await response.json();
  scanCache[url] = result;
  return result;
}
