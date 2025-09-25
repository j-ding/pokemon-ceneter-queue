// Listen for responses from Incapsula queue
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.includes('Incapsula_Resource') && details.method === 'GET') {
      // Fetch the response to get queue position
      fetch(details.url, {
        credentials: 'include',
        headers: {
          'Accept': '*/*'
        }
      })
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          if (data.pos !== undefined) {
            // Update badge with position
            const position = data.pos;
            updateBadge(position);
            
            // Store queue data
            chrome.storage.local.set({
              queuePosition: position,
              pending: data.pending,
              ttw: data.ttw,
              lastUpdate: new Date().toISOString()
            });
          }
        } catch (e) {
          console.log('Not JSON queue data');
        }
      })
      .catch(err => console.error('Error fetching queue status:', err));
    }
  },
  {urls: ["*://*.pokemoncenter.com/*Incapsula_Resource*"]},
  ["responseHeaders"]
);

function updateBadge(position) {
  if (position === 0) {
    chrome.action.setBadgeText({text: '✓'});
    chrome.action.setBadgeBackgroundColor({color: '#00C851'});
  } else if (position > 0) {
    // Format number for badge (shorten if needed)
    let badgeText = position.toString();
    if (position > 9999) {
      badgeText = Math.floor(position / 1000) + 'k';
    }
    chrome.action.setBadgeText({text: badgeText});
    chrome.action.setBadgeBackgroundColor({color: '#FF6B6B'});
  } else {
    chrome.action.setBadgeText({text: ''});
  }
}

// Clear badge when tab is closed or navigated away
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({text: ''});
});

// Message handler for content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'QUEUE_UPDATE') {
    updateBadge(request.position);
    chrome.storage.local.set({
      queuePosition: request.position,
      pending: request.pending,
      ttw: request.ttw,
      lastUpdate: new Date().toISOString()
    });
  }
});