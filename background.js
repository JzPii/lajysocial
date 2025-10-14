chrome.runtime.onInstalled.addListener(() => {
  console.log('LajySocial installed');
});

// ============================================================================
// IMPORTANT: Content script injection is now handled by manifest.json
// ============================================================================
//
// The extension has been refactored to use a multi-file architecture:
//   - surfers/base-surfer.js (shared utilities)
//   - surfers/{platform}-surfer.js (platform-specific implementations)
//   - surfers/surfer-factory.js (platform detection + singleton guard)
//
// The old monolithic content.js has been:
//   - DELETED (it's dead code and should not be re-injected)
//   - Backed up to content.js.backup (for emergency rollback only)
//
// DO NOT re-enable the code below unless you're debugging and understand
// that it will NOT work with the old content.js path (file deleted).
// ============================================================================

/*
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [
      'surfers/base-surfer.js',
      'surfers/facebook-surfer.js',
      'surfers/linkedin-surfer.js',
      'surfers/twitter-surfer.js',
      'surfers/instagram-surfer.js',
      'surfers/reddit-surfer.js',
      'surfers/surfer-factory.js'
    ]
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const supportedDomains = [
      'twitter.com',
      'x.com',
      'facebook.com',
      'instagram.com',
      'linkedin.com',
      'reddit.com'
    ];

    const isSupported = supportedDomains.some(domain => tab.url.includes(domain));

    if (isSupported) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: [
          'surfers/base-surfer.js',
          'surfers/facebook-surfer.js',
          'surfers/linkedin-surfer.js',
          'surfers/twitter-surfer.js',
          'surfers/instagram-surfer.js',
          'surfers/reddit-surfer.js',
          'surfers/surfer-factory.js'
        ]
      }).catch(() => {
        console.log('Could not inject content script');
      });
    }
  }
});
*/