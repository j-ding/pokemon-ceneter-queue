// Notify background script that page has loaded
chrome.runtime.sendMessage({ type: 'PAGE_LOAD' });

// Track if we've seen queue activity
let queueDetected = false;
let queueCheckTimeout;

// Intercept XHR responses to get queue data
(function() {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    this._method = method;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
      if (this._url && this._url.includes('Incapsula_Resource')) {
        try {
          const data = JSON.parse(this.responseText);
          if (data.pos !== undefined) {
            queueDetected = true;
            
            // Clear any existing timeout
            if (queueCheckTimeout) {
              clearTimeout(queueCheckTimeout);
            }
            
            // Send to background script
            chrome.runtime.sendMessage({
              type: 'QUEUE_UPDATE',
              position: data.pos,
              pending: data.pending,
              ttw: data.ttw
            });
            
            // Log to console for debugging
            console.log(`Pokemon Center Queue Position: ${data.pos}`);
          }
        } catch (e) {
          // Not JSON or not queue data
        }
      }
    });
    return originalSend.apply(this, arguments);
  };
})();

// After 5 seconds, if no queue detected, notify that we're on the site
setTimeout(() => {
  if (!queueDetected) {
    chrome.runtime.sendMessage({ type: 'PAGE_LOAD' });
  }
}, 5000);