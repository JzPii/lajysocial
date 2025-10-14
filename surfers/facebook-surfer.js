/**
 * FacebookAutoSurfer - Facebook-specific automation
 * Extends BaseAutoSurfer with Facebook's DOM structure and selectors
 */

window.FacebookAutoSurfer = class FacebookAutoSurfer extends window.BaseAutoSurfer {
  constructor() {
    super();
    this.platform = 'facebook';
  }

  getPlatformSelectors() {
    return {
      posts: '[role="main"] div.x78zum5.xdt5ytf[data-virtualized="false"]',
      likeButton: '[aria-label*="Like"]',
      commentButton: '[aria-label*="Comment"]',
      textArea: '[role="textbox"], [contenteditable="true"]',
      seeMore: '[role="button"]'
    };
  }

  getExpandKeywords() {
    return ['See more', 'See More', 'Continue reading', 'Read more', 'Show more'];
  }

  /**
   * Facebook-specific "see more" detection
   * Facebook requires broader DOM searching and exact text matching
   */
  findSeeMoreButtonsInPost(post) {
    const buttons = [];
    const expandKeywords = this.getExpandKeywords();

    const clickableElements = post.querySelectorAll(`
      button,
      span[role="button"],
      div[role="button"],
      a[role="button"],
      [tabindex="0"],
      span[data-testid],
      div[data-testid]
    `);

    clickableElements.forEach(element => {
      const text = element.textContent.trim();
      const ariaLabel = (element.getAttribute('aria-label') || '');

      // Facebook requires exact matching
      const matchesKeyword = expandKeywords.some(keyword => {
        return text === keyword || ariaLabel === keyword;
      });

      if (matchesKeyword) {
        buttons.push(element);
      }
    });

    return buttons;
  }

  /**
   * Facebook-specific global "see more" detection for testing
   * Searches entire page, not just detected posts
   */
  findSeeMoreButtons() {
    const buttons = [];

    console.log(`=== FINDING SEE MORE BUTTONS FOR ${this.platform.toUpperCase()} ===`);
    console.log('Using Facebook-specific detection...');

    const allClickableElements = document.querySelectorAll(`
      div[role="button"],
      span[role="button"],
      button,
      a[role="button"],
      [tabindex="0"]:not(input):not(textarea),
      div[aria-label],
      span[aria-label]
    `);

    console.log(`Facebook: Found ${allClickableElements.length} total clickable elements on page`);

    const fbPatterns = [
      'See more',
      'See More',
      'Continue reading',
      'Show more',
      '...more',
      'Read more'
    ];

    allClickableElements.forEach((element, elemIndex) => {
      const text = element.textContent.trim();
      const ariaLabel = element.getAttribute('aria-label') || '';

      const matchesPattern = fbPatterns.some(pattern => {
        return text === pattern ||
               text.includes(pattern) ||
               ariaLabel === pattern ||
               ariaLabel.includes(pattern);
      });

      if (matchesPattern) {
        console.log(`[Facebook] Found potential button #${elemIndex}: "${text}" (aria: "${ariaLabel}")`);
        buttons.push(element);
      }
    });

    console.log(`Total buttons found: ${buttons.length}`);
    return buttons;
  }

  findSubmitButton(textArea) {
    // Facebook-specific submit button selectors
    const selectors = [
      '[aria-label*="Comment"]',
      '[aria-label*="Post comment"]',
      'div[role="button"][aria-label*="Post"]',
      '[type="submit"]'
    ];

    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn && !btn.disabled) {
        console.log(`[Facebook Submit] Found button with selector: ${selector}`);
        return btn;
      }
    }

    console.log('[Facebook Submit] No submit button found');
    return null;
  }
};
