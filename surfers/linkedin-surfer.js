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
};
