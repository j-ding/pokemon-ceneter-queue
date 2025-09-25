// Track if we're monitoring a tab
let monitoringTabId = null;
let lastQueueCheck = 0;

// Listen for responses from Incapsula queue
chrome.webRequest.onCompleted.addListener(
  function(details) {
    if (details.url.includes('Incapsula_Resource') && details.method === 'GET') {
      lastQueueCheck = Date.now();
      monitoringTabId = details.tabId;
      
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
              lastUpdate: new Date().toISOString(),
              inQueue: true
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

// Monitor navigation to detect when user is on the site
chrome.webNavigation.onCompleted.addListener(function(details) {
  if (details.url.includes('pokemoncenter.com') && details.frameId === 0) {
    // Check if we've seen queue activity recently (within last 10 seconds)
    const timeSinceQueue = Date.now() - lastQueueCheck;
    
    if (timeSinceQueue > 10000) {
      // No recent queue activity, user is likely on the site
      clearQueueStatus();
    }
  }
}, {url: [{hostSuffix: 'pokemoncenter.com'}]});

function updateBadge(position) {
  if (position === 0 || position === undefined) {
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

function clearQueueStatus() {
  chrome.action.setBadgeText({text: '✓'});
  chrome.action.setBadgeBackgroundColor({color: '#00C851'});
  chrome.storage.local.set({
    queuePosition: 0,
    pending: 0,
    ttw: 0,
    lastUpdate: new Date().toISOString(),
    inQueue: false
  });
}

// Clear badge when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === monitoringTabId) {
    chrome.action.setBadgeText({text: ''});
    monitoringTabId = null;
    lastQueueCheck = 0;
  }
});

// Message handler for content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'QUEUE_UPDATE') {
    lastQueueCheck = Date.now();
    monitoringTabId = sender.tab.id;
    updateBadge(request.position);
    chrome.storage.local.set({
      queuePosition: request.position,
      pending: request.pending,
      ttw: request.ttw,
      lastUpdate: new Date().toISOString(),
      inQueue: true
    });
  } else if (request.type === 'PAGE_LOAD') {
    // Check if there's been recent queue activity
    const timeSinceQueue = Date.now() - lastQueueCheck;
    if (timeSinceQueue > 10000) {
      clearQueueStatus();
    }
  }
});