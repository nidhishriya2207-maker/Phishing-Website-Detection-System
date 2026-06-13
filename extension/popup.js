document.addEventListener('DOMContentLoaded', () => {
  // Query active tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url) {
      showError('No active tab found');
      return;
    }

    const currentUrl = activeTab.url;
    document.getElementById('current-url').innerText = currentUrl;

    // Skip scanning chrome extensions or internal pages
    if (currentUrl.startsWith('chrome://') || currentUrl.startsWith('chrome-extension://') || currentUrl.startsWith('about:') || currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      showLocalSafeState(currentUrl);
      return;
    }

    // Request scan results from background service worker
    chrome.runtime.sendMessage({ action: 'getScanResult', url: currentUrl }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Service worker unreachable. Verify backend is running.');
        console.error(chrome.runtime.lastError);
        return;
      }

      if (response && response.status === 'success' && response.data) {
        updateUI(response.data);
      } else {
        showError(response ? response.message : 'Scan failed');
      }
    });

    // Set up full report click handler
    document.getElementById('report-btn').addEventListener('click', () => {
      const reportUrl = `http://localhost:5173/?url=${encodeURIComponent(currentUrl)}`;
      chrome.tabs.create({ url: reportUrl });
    });
  });
});

function updateUI(data) {
  const card = document.getElementById('status-card');
  const icon = document.getElementById('status-icon');
  const title = document.getElementById('status-title');
  const desc = document.getElementById('status-desc');
  const riskPercentText = document.getElementById('risk-percentage');
  const riskBar = document.getElementById('risk-bar-fill');
  const warningBox = document.getElementById('warning-box');

  // Clear scanning classes
  card.className = 'status-card';
  warningBox.classList.remove('show');

  // Set risk text and progress bar width
  riskPercentText.innerText = `${data.riskScore}%`;
  riskBar.style.width = `${data.riskScore}%`;

  // Render values in stats grid
  const sslVal = data.metrics.ssl.valid ? 'Valid' : 'Invalid';
  const httpsVal = data.metrics.ssl.httpsEnabled ? 'Yes' : 'No';
  const ageVal = data.metrics.domainInfo.ageDays !== null 
    ? formatAge(data.metrics.domainInfo.ageDays) 
    : 'Unknown';

  const sslEl = document.getElementById('ssl-status');
  const httpsEl = document.getElementById('https-status');
  const ageEl = document.getElementById('domain-age');
  const ratingEl = document.getElementById('risk-rating');

  sslEl.innerText = sslVal;
  sslEl.className = `stat-value ${data.metrics.ssl.valid ? 'green' : 'red'}`;

  httpsEl.innerText = httpsVal;
  httpsEl.className = `stat-value ${data.metrics.ssl.httpsEnabled ? 'green' : 'red'}`;

  ageEl.innerText = ageVal;
  ageEl.className = `stat-value ${data.metrics.domainInfo.ageDays && data.metrics.domainInfo.ageDays > 180 ? 'green' : 'red'}`;

  // Evaluate risk category layout
  if (data.riskScore > 80) {
    // Phishing Detected
    card.classList.add('phishing');
    title.innerText = 'Phishing Detected';
    desc.innerText = 'Do not enter personal information';
    ratingEl.innerText = 'High Risk';
    ratingEl.className = 'stat-value red';
    warningBox.classList.add('show');
    
    // Set X symbol SVG icon
    icon.innerHTML = `
      <path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (data.riskScore >= 40) {
    // Suspicious Site
    card.classList.add('suspicious');
    title.innerText = 'Suspicious Site';
    desc.innerText = 'Proceed with caution';
    ratingEl.innerText = 'Average Risk';
    ratingEl.className = 'stat-value yellow';
    
    // Set Alert symbol SVG icon
    icon.innerHTML = `
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="#F59E0B" stroke-width="2.5"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#F59E0B" stroke-width="2.5"/>
    `;
  } else {
    // Safe Site
    card.classList.add('safe');
    title.innerText = 'This site is Safe';
    desc.innerText = 'No phishing indicators detected';
    ratingEl.innerText = 'Low Risk';
    ratingEl.className = 'stat-value green';

    // Set Checkmark symbol SVG icon
    icon.innerHTML = `
      <polyline points="20 6 9 17 4 12" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }
}

function showLocalSafeState(url) {
  const data = {
    riskScore: 0,
    status: 'safe',
    reasons: [],
    metrics: {
      ssl: { valid: true, httpsEnabled: true },
      domainInfo: { ageDays: 1825 } // Mock 5 years
    }
  };
  updateUI(data);
  document.getElementById('current-url').innerText = 'Internal Page / Developer Mode';
  document.getElementById('report-btn').style.display = 'none';
}

function showError(msg) {
  const card = document.getElementById('status-card');
  const title = document.getElementById('status-title');
  const desc = document.getElementById('status-desc');
  const icon = document.getElementById('status-icon');

  card.className = 'status-card phishing';
  title.innerText = 'Scan Error';
  desc.innerText = msg;
  icon.innerHTML = `
    <line x1="12" y1="8" x2="12" y2="12" stroke="#EF4444" stroke-width="2.5"/>
    <line x1="12" y1="16" x2="12.01" y2="16" stroke="#EF4444" stroke-width="2.5"/>
  `;
}

function formatAge(days) {
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} yr${years > 1 ? 's' : ''} ${remainingMonths} mo`;
}
