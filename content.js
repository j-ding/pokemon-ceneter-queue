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