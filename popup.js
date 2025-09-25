// Load and display queue status
chrome.storage.local.get(['queuePosition', 'pending', 'ttw', 'lastUpdate'], function(data) {
  const statusDiv = document.getElementById('queue-status');
  
  if (data.queuePosition !== undefined) {
    if (data.queuePosition === 0) {
      statusDiv.innerHTML = `
        <div class="in-store">
          You're in the store!
        </div>
      `;
    } else {
      const lastUpdate = data.lastUpdate ? new Date(data.lastUpdate) : null;
      const timeAgo = lastUpdate ? getTimeAgo(lastUpdate) : 'Unknown';
      
      statusDiv.innerHTML = `
        <div class="queue-info">
          <div style="text-align: center; color: #6c757d; font-size: 14px;">Your Position</div>
          <div class="position-display">#${data.queuePosition.toLocaleString()}</div>
          
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span>${data.pending === 1 ? 'In Queue' : 'Unknown'}</span>
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
  }
});

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 10) return 'just now';
  if (seconds < 60) return seconds + ' seconds ago';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
  
  const hours = Math.floor(minutes / 60);
  return hours + ' hour' + (hours === 1 ? '' : 's') + ' ago';
}

// Auto-refresh every 2 seconds
setInterval(() => {
  chrome.storage.local.get(['queuePosition', 'pending', 'ttw', 'lastUpdate'], function(data) {
    if (data.queuePosition !== undefined) {
      window.location.reload();
    }
  });
}, 2000);