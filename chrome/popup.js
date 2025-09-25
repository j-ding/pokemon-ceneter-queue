// Load and display queue status
function updateDisplay() {
  chrome.storage.local.get(['queuePosition', 'pending', 'ttw', 'lastUpdate', 'inQueue'], function(data) {
    const statusDiv = document.getElementById('queue-status');
    
    // Check if we have any stored data
    if (data.queuePosition !== undefined) {
      // If position is 0 or we're not in queue, show success
      if (data.queuePosition === 0 || data.inQueue === false) {
        statusDiv.innerHTML = `
          <div class="in-store">
            <div class="checkmark">✓</div>
            <div>No Queue - You're in!</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Happy shopping!</div>
          </div>
        `;
      } else {
        // Show queue position
        const lastUpdate = data.lastUpdate ? new Date(data.lastUpdate) : null;
        const timeAgo = lastUpdate ? getTimeAgo(lastUpdate) : 'Unknown';
        
        statusDiv.innerHTML = `
          <div class="queue-info">
            <div style="text-align: center; color: #6c757d; font-size: 14px;">Your Position</div>
            <div class="position-display">#${data.queuePosition.toLocaleString()}</div>
            
            <div class="status-row">
              <span class="status-label">Status:</span>
              <span>${data.pending === 1 ? 'In Queue' : 'Waiting'}</span>
            </div>
            
            ${data.ttw ? `
            <div class="status-row">
              <span class="status-label">Est. Wait:</span>
              <span>${data.ttw} min</span>
            </div>
            ` : ''}
            
            <div class="last-update">
              Updated: ${timeAgo}
            </div>
          </div>
        `;
      }
    } else {
      // No data yet - check if we're on Pokemon Center
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].url && tabs[0].url.includes('pokemoncenter.com')) {
          // We're on Pokemon Center but no queue data
          statusDiv.innerHTML = `
            <div class="in-store">
              <div class="checkmark">✓</div>
              <div>No Queue Detected</div>
              <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Site is accessible</div>
            </div>
          `;
        } else {
          // Not on Pokemon Center
          statusDiv.innerHTML = `
            <div class="no-queue">
              <div class="no-queue-icon">PC</div>
              <div>Pokemon Center Queue Monitor</div>
              <div style="font-size: 12px; margin-top: 10px;">
                Navigate to pokemoncenter.com to monitor queue status
              </div>
            </div>
          `;
        }
      });
    }
  });
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 10) return 'just now';
  if (seconds < 60) return seconds + ' seconds ago';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
  
  const hours = Math.floor(minutes / 60);
  return hours + ' hour' + (hours === 1 ? '' : 's') + ' ago';
}

// Initial load
updateDisplay();

// Auto-refresh every 2 seconds
setInterval(updateDisplay, 2000);