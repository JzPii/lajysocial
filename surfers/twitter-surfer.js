/**
 * TwitterAutoSurfer - Twitter/X-specific automation
 * Extends BaseAutoSurfer with Twitter's DOM structure and selectors
 */

window.TwitterAutoSurfer = class TwitterAutoSurfer extends window.BaseAutoSurfer {
  constructor() {
    super();
    this.platform = 'twitter';
  }

  getPlatformSelectors() {
    return {
      posts: '[data-testid="tweet"]',
      likeButton: '[data-testid="like"]',
      replyButton: '[data-testid="reply"]',
      textArea: '[data-testid="tweetTextarea_0"]',
      seeMore: '[data-testid="tweet"] span:contains("Show more"), [data-testid="tweet"] span:contains("Show this thread")'
    };
  }

  getExpandKeywords() {
    return ['Show more', 'Show this thread', 'Show replies'];
  }
};
