/**
 * RedditAutoSurfer - Reddit-specific automation
 * Extends BaseAutoSurfer with Reddit's DOM structure and selectors
 */

window.RedditAutoSurfer = class RedditAutoSurfer extends window.BaseAutoSurfer {
  constructor() {
    super();
    this.platform = 'reddit';
  }

  getPlatformSelectors() {
    return {
      posts: '[data-testid="post-container"]',
      upvoteButton: '[aria-label*="upvote"]',
      commentButton: '[data-testid="comment-button"]',
      seeMore: '[data-testid="post-container"] button:contains("Read more"), [data-testid="post-container"] button:contains("Continue this thread")'
    };
  }

  getExpandKeywords() {
    return ['Read more', 'Continue this thread', 'show more', 'Show more'];
  }
};
