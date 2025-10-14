/**
 * InstagramAutoSurfer - Instagram-specific automation
 * Extends BaseAutoSurfer with Instagram's DOM structure and selectors
 */

window.InstagramAutoSurfer = class InstagramAutoSurfer extends window.BaseAutoSurfer {
  constructor() {
    super();
    this.platform = 'instagram';
  }

  getPlatformSelectors() {
    return {
      posts: 'article',
      likeButton: '[aria-label*="Like"]',
      commentButton: '[aria-label*="Comment"]',
      textArea: 'textarea[placeholder*="comment" i], [role="textbox"]',
      seeMore: 'article button:contains("more"), article span:contains("more")'
    };
  }

  getExpandKeywords() {
    return ['more', 'show more', 'see more', 'Show more', 'See more'];
  }
};
