/**
 * LinkedInAutoSurfer - LinkedIn-specific automation
 * Extends BaseAutoSurfer with LinkedIn's DOM structure and selectors
 */

window.LinkedInAutoSurfer = class LinkedInAutoSurfer extends window.BaseAutoSurfer {
  constructor() {
    super();
    this.platform = 'linkedin';
  }

  getPlatformSelectors() {
    return {
      posts: '.feed-shared-update-v2',
      likeButton: '[aria-label*="Like"]',
      commentButton: '[aria-label*="Comment"]',
      commentBoxContainer: '.editor-container.relative, .comments-comment-box',
      textArea: '.ql-editor, [role="textbox"], .comments-comment-box-comment__text-editor',
      seeMore: '.feed-shared-update-v2 button:contains("see more"), .feed-shared-update-v2 [aria-label*="see more"]'
    };
  }

  getExpandKeywords() {
    return ['see more', 'See more', 'Show more'];
  }

  findSubmitButton(textArea) {
    // LinkedIn-specific submit button selectors
    const selectors = [
      '.comments-comment-box__submit-button--cr', // Primary selector (most specific)
      'button.comments-comment-box__submit-button--cr', // With button tag
      '.comments-comment-box button.artdeco-button--primary', // Primary button in comment box
      'button[class*="comments-comment-box__submit-button"]', // Pattern match
      '.comments-comment-box button[class*="submit-button"]' // Generic pattern
    ];

    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn && !btn.disabled) {
        console.log(`[LinkedIn Submit] Found button with selector: ${selector}`);
        console.log(`[LinkedIn Submit] Button text: "${btn.textContent.trim()}"`);
        return btn;
      }
    }

    console.log('[LinkedIn Submit] No submit button found');
    return null;
  }
};
