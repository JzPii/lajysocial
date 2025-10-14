/**
 * Surfer Factory - Platform detection and singleton guard
 *
 * This factory:
 * 1. Prevents duplicate injection with window.__lajySocialInjected guard
 * 2. Detects current platform from URL
 * 3. Instantiates the correct platform-specific surfer class
 * 4. Returns singleton instance
 *
 * IMPORTANT: This file should be loaded LAST in manifest.json after all surfer classes
 */

(function() {
  'use strict';

  // Singleton guard - prevent duplicate injection
  if (window.__lajySocialInjected) {
    console.log('[LajySocial] Already injected, skipping...');
    return;
  }

  console.log('[LajySocial] Initializing...');

  // Detect platform from hostname
  const hostname = window.location.hostname;
  let SurferClass = null;
  let platformName = 'unknown';

  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    platformName = 'twitter';
    SurferClass = window.TwitterAutoSurfer;
  } else if (hostname.includes('facebook.com')) {
    platformName = 'facebook';
    SurferClass = window.FacebookAutoSurfer;
  } else if (hostname.includes('instagram.com')) {
    platformName = 'instagram';
    SurferClass = window.InstagramAutoSurfer;
  } else if (hostname.includes('linkedin.com')) {
    platformName = 'linkedin';
    SurferClass = window.LinkedInAutoSurfer;
  } else if (hostname.includes('reddit.com')) {
    platformName = 'reddit';
    SurferClass = window.RedditAutoSurfer;
  }

  // Check if we found a valid platform
  if (!SurferClass) {
    console.log(`[LajySocial] Unsupported platform: ${hostname}`);
    return;
  }

  // Check if the class is available
  if (typeof SurferClass !== 'function') {
    console.error(`[LajySocial] ${platformName} surfer class not found! Check script load order.`);
    return;
  }

  // Instantiate the platform-specific surfer
  console.log(`[LajySocial] Detected platform: ${platformName}`);
  console.log(`[LajySocial] Creating ${SurferClass.name} instance...`);

  try {
    window.autoSurfer = new SurferClass();
    window.__lajySocialInjected = true;
    console.log(`[LajySocial] ✓ ${platformName} auto-surfer initialized successfully`);
  } catch (error) {
    console.error('[LajySocial] Failed to initialize surfer:', error);
  }
})();
