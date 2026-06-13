chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'showWarning') {
    const result = message.result;
    
    // Remove any existing warning banners first
    const existingBanner = document.getElementById('techflora-warning-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    if (result.riskScore > 80) {
      injectBanner(
        'Phishing Detected',
        `Warning: This website appears to be a phishing or malicious website. Proceed with caution. (TechFlora Alert: ${result.riskScore}% Risk)`,
        '#EF4444', // Red color
        '#FFFFFF'
      );
    } else if (result.riskScore >= 40) {
      injectBanner(
        'Suspicious Site',
        `Caution: This website has suspicious characteristics. Proceed with care. (TechFlora Alert: ${result.riskScore}% Risk)`,
        '#F59E0B', // Yellow/Orange color
        '#FFFFFF'
      );
    }
  }
});

function injectBanner(title, message, bgColor, textColor) {
  const banner = document.createElement('div');
  banner.id = 'techflora-warning-banner';
  
  // Style the banner to float on top of all page elements
  Object.assign(banner.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    backgroundColor: bgColor,
    color: textColor,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '12px 24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
    zIndex: '2147483647',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box'
  });

  const textContainer = document.createElement('div');
  textContainer.style.display = 'flex';
  textContainer.style.alignItems = 'center';
  textContainer.style.gap = '8px';

  // Warning Symbol SVG
  textContainer.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <span><strong>[${title}]</strong> ${message}</span>
  `;

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Dismiss';
  Object.assign(closeButton.style, {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    color: textColor,
    padding: '4px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    outline: 'none'
  });

  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
  });
  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
  });
  closeButton.addEventListener('click', () => {
    banner.remove();
    // Re-adjust page body top margin if we modified it
    document.body.style.marginTop = '0px';
  });

  banner.appendChild(textContainer);
  banner.appendChild(closeButton);
  
  // Append to document body once DOM is interactive
  if (document.body) {
    document.body.appendChild(banner);
    // Push the webpage content down so the banner doesn't overlap header elements
    document.body.style.marginTop = banner.offsetHeight + 'px';
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(banner);
      document.body.style.marginTop = banner.offsetHeight + 'px';
    });
  }
}
