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
      textArea: '[data-testid="tweetTextarea_0"]'
      // Note: seeMore selector removed - we use keyword-based detection instead
    };
  }

  getExpandKeywords() {
    return ['Show more', 'Show this thread', 'Show replies'];
  }

  /**
   * Override: Twitter-specific "see more" detection
   * Twitter's "Show more" buttons can be outside the immediate tweet container
   * in threads, so we search more broadly
   */
  findSeeMoreButtonsInPost(post) {
    const buttons = [];
    const expandKeywords = this.getExpandKeywords();

    // Strategy 1: Search within the post container
    // Twitter's "Show more" is often just a plain <span> with specific styling/color
    // We need to search ALL spans, not just those with role="button"
    const clickableInPost = post.querySelectorAll(`
      span,
      div[role="button"],
      a
    `);

    clickableInPost.forEach(element => {
      const text = element.textContent.trim();

      // Filter: Only check elements with reasonable text length
      // Skip elements with very long text (full tweet content) or empty
      if (text.length > 0 && text.length < 50) {
        // Exact match for Twitter keywords
        if (expandKeywords.some(keyword => text === keyword)) {
          buttons.push(element);
        }
      }
    });

    // Strategy 2: If nothing found, search in parent container (for threads)
    // Twitter threads often have "Show more" buttons in parent article elements
    if (buttons.length === 0) {
      const parentArticle = post.closest('article') || post.parentElement;
      if (parentArticle) {
        const clickableInParent = parentArticle.querySelectorAll(`
          span,
          div[role="button"],
          a
        `);

        clickableInParent.forEach(element => {
          const text = element.textContent.trim();

          // Same filtering: reasonable text length only
          if (text.length > 0 && text.length < 50) {
            // Exact match for Twitter keywords
            if (expandKeywords.some(keyword => text === keyword)) {
              // Make sure this element is visually near our post
              const rect = element.getBoundingClientRect();
              const postRect = post.getBoundingClientRect();
              const verticalDistance = Math.abs(rect.top - postRect.top);

              // Only include if within ~500px vertically (same visual context)
              if (verticalDistance < 500) {
                buttons.push(element);
              }
            }
          }
        });
      }
    }

    return buttons;
  }

  findSubmitButton(textArea) {
    // Twitter-specific submit button selector
    const btn = document.querySelector('[data-testid="tweetButton"]');
    if (btn && !btn.disabled) {
      console.log('[Twitter Submit] Found tweet button');
      return btn;
    }

    console.log('[Twitter Submit] Tweet button not found or disabled');
    return null;
  }
};
