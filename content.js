class SocialMediaAutoSurfer {
  constructor() {
    this.isActive = false;
    this.engagementTimeout = null;
    this.cursor = null;
    this.settings = {
      scrollSpeedMin: 2000,
      scrollSpeedMax: 4000,
      enableAutoLike: false,
      likeDelay: 5000,
      likeProbability: 70, // Percentage chance to like (0-100)
      enableAutoComment: false,
      commentDelay: 8000,
      commentProbability: 30, // Percentage chance to comment (0-100)
      enableSeeMore: false,
      seeMoreDelay: 2000,
      postEngagementDelay: 3000 // Delay between finishing one post and starting next
    };
    this.positiveResponses = [
      "Great post! 👍",
      "Love this! ❤️",
      "So inspiring! ✨",
      "Amazing content! 🔥",
      "This made my day! 😊",
      "Fantastic! 🌟",
      "Absolutely wonderful! 💯",
      "Keep it up! 🚀"
    ];
    // Session statistics
    this.sessionStats = {
      totalPostsViewed: 0,
      totalSeeMoreClicked: 0,
      totalPostsLiked: 0,
      totalComments: 0
    };
    this.init();
    this.createCursor();
  }

  init() {
    this.loadSettings();
    this.detectPlatform();
    this.listenForMessages();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['surfSettings']);
      if (result.surfSettings) {
        this.settings = { ...this.settings, ...result.surfSettings };
      }
    } catch (error) {
      console.log('Using default settings');
    }
  }

  detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      this.platform = 'twitter';
      this.selectors = {
        posts: '[data-testid="tweet"]',
        likeButton: '[data-testid="like"]',
        replyButton: '[data-testid="reply"]',
        textArea: '[data-testid="tweetTextarea_0"]',
        seeMore: '[data-testid="tweet"] span:contains("Show more"), [data-testid="tweet"] span:contains("Show this thread")'
      };
    } else if (hostname.includes('facebook.com')) {
      this.platform = 'facebook';
      this.selectors = {
        posts: '[role="article"], [data-pagelet="FeedUnit"]',
        likeButton: '[aria-label*="Like"]',
        commentButton: '[aria-label*="Comment"]',
        textArea: '[role="textbox"], [contenteditable="true"]',
        seeMore: '[role="article"] [role="button"], [data-pagelet="FeedUnit"] [role="button"]'
      };
    } else if (hostname.includes('instagram.com')) {
      this.platform = 'instagram';
      this.selectors = {
        posts: 'article',
        likeButton: '[aria-label*="Like"]',
        commentButton: '[aria-label*="Comment"]',
        textArea: 'textarea[placeholder*="comment" i], [role="textbox"]',
        seeMore: 'article button:contains("more"), article span:contains("more")'
      };
    } else if (hostname.includes('linkedin.com')) {
      this.platform = 'linkedin';
      this.selectors = {
        posts: '.feed-shared-update-v2',
        likeButton: '[aria-label*="Like"]',
        commentButton: '[aria-label*="Comment"]',
        commentBoxContainer: '.editor-container.relative, .comments-comment-box',
        textArea: '.ql-editor, [role="textbox"], .comments-comment-box-comment__text-editor',
        seeMore: '.feed-shared-update-v2 button:contains("see more"), .feed-shared-update-v2 [aria-label*="see more"]'
      };
    } else if (hostname.includes('reddit.com')) {
      this.platform = 'reddit';
      this.selectors = {
        posts: '[data-testid="post-container"]',
        upvoteButton: '[aria-label*="upvote"]',
        commentButton: '[data-testid="comment-button"]',
        seeMore: '[data-testid="post-container"] button:contains("Read more"), [data-testid="post-container"] button:contains("Continue this thread")'
      };
    }
  }

  listenForMessages() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case 'start':
          this.start();
          break;
        case 'stop':
          this.stop();
          break;
        case 'updateSettings':
          console.log('Updating settings:', message.settings);
          this.settings = { ...this.settings, ...message.settings };
          console.log('New settings:', this.settings);
          this.saveSettings();
          break;
        case 'getStatus':
          sendResponse({
            isActive: this.isActive,
            platform: this.platform,
            stats: this.sessionStats
          });
          break;
        case 'testSeeMore':
          this.testSeeMoreButtons();
          break;
        case 'testLike':
          this.testLikePost();
          break;
        case 'testComment':
          this.testCommentPost();
          break;
      }
    });
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({ surfSettings: this.settings });
    } catch (error) {
      console.log('Could not save settings');
    }
  }


  start() {
    if (this.isActive) return;

    this.isActive = true;

    // Reset session statistics
    this.sessionStats = {
      totalPostsViewed: 0,
      totalSeeMoreClicked: 0,
      totalPostsLiked: 0,
      totalComments: 0
    };

    console.log('=== SESSION STARTED ===');
    console.log('Session statistics reset');
    console.log('Settings:', this.settings);
    console.log('Auto Like:', this.settings.enableAutoLike);
    console.log('Auto Comment:', this.settings.enableAutoComment);
    console.log('See More:', this.settings.enableSeeMore);

    // Start sequential engagement cycle
    this.startSequentialEngagement();

    this.showNotification('Auto surfing started! Using sequential engagement.', 'success');
  }

  stop() {
    this.isActive = false;

    if (this.engagementTimeout) {
      clearTimeout(this.engagementTimeout);
      this.engagementTimeout = null;
    }

    // Print session summary
    console.log('=== SESSION ENDED ===');
    console.log('📊 Session Statistics:');
    console.log(`  Total Posts Viewed: ${this.sessionStats.totalPostsViewed}`);
    console.log(`  Total "See More" Clicked: ${this.sessionStats.totalSeeMoreClicked}`);
    console.log(`  Total Posts Liked: ${this.sessionStats.totalPostsLiked}`);
    console.log(`  Total Comments Added: ${this.sessionStats.totalComments}`);
    console.log('======================');

    // Show final stats notification
    this.showNotification(
      `Session ended! Posts: ${this.sessionStats.totalPostsViewed}, Liked: ${this.sessionStats.totalSeeMoreClicked}`,
      'info'
    );
  }

  async startSequentialEngagement() {
    const engagementCycle = async () => {
      if (!this.isActive) return;

      console.log('\n=== Starting New Engagement Cycle ===');

      // Step 1: Scroll to bring new posts into view
      console.log('Step 1: Scrolling...');
      await this.performScroll();
      await this.sleep(this.getRandomScrollDelay());

      // Step 2: Pick one visible post
      const posts = document.querySelectorAll(this.selectors.posts);
      const visiblePosts = Array.from(posts).filter(post =>
        this.isElementInViewport(post) && !post.getAttribute('data-surfer-engaged')
      );

      console.log(`Step 2: Found ${visiblePosts.length} unengaged visible posts`);

      if (visiblePosts.length === 0) {
        console.log('No unengaged posts found, scrolling to top and continuing...');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.sleep(2000);

        // Schedule next cycle
        this.scheduleNextCycle();
        return;
      }

      // Pick a random visible post
      const targetPost = visiblePosts[Math.floor(Math.random() * visiblePosts.length)];
      targetPost.setAttribute('data-surfer-engaged', 'true');
      this.sessionStats.totalPostsViewed++;

      console.log(`Engaging with post #${this.sessionStats.totalPostsViewed}`);

      // Step 3: Click "see more" if enabled
      if (this.settings.enableSeeMore) {
        console.log('Step 3: Looking for "See More" button...');
        await this.clickSeeMoreOnPost(targetPost);
        await this.sleep(this.settings.seeMoreDelay);
      } else {
        console.log('Step 3: Skipped (See More disabled)');
      }

      // Step 4: Auto like if enabled and passes probability check
      if (this.settings.enableAutoLike) {
        const likeRoll = Math.random() * 100;
        const shouldLike = likeRoll < this.settings.likeProbability;
        console.log(`Step 4: Like check - Roll: ${likeRoll.toFixed(1)}%, Threshold: ${this.settings.likeProbability}%, Result: ${shouldLike ? 'LIKE' : 'SKIP'}`);

        if (shouldLike) {
          await this.likePost(targetPost);
          await this.sleep(this.settings.likeDelay);
        } else {
          console.log('Step 4: Skipped (Probability check failed)');
        }
      } else {
        console.log('Step 4: Skipped (Auto Like disabled)');
      }

      // Step 5: Auto comment if enabled and passes probability check
      if (this.settings.enableAutoComment) {
        const commentRoll = Math.random() * 100;
        const shouldComment = commentRoll < this.settings.commentProbability;
        console.log(`Step 5: Comment check - Roll: ${commentRoll.toFixed(1)}%, Threshold: ${this.settings.commentProbability}%, Result: ${shouldComment ? 'COMMENT' : 'SKIP'}`);

        if (shouldComment) {
          await this.commentPost(targetPost);
          await this.sleep(this.settings.commentDelay);
        } else {
          console.log('Step 5: Skipped (Probability check failed)');
        }
      } else {
        console.log('Step 5: Skipped (Auto Comment disabled)');
      }

      console.log('=== Engagement Cycle Complete ===\n');

      // Step 6: Wait, then repeat with next post
      await this.sleep(this.settings.postEngagementDelay);

      // Schedule next cycle
      this.scheduleNextCycle();
    };

    // Start the first cycle
    engagementCycle();
  }

  scheduleNextCycle() {
    if (!this.isActive) return;

    this.engagementTimeout = setTimeout(() => {
      this.startSequentialEngagement();
    }, 100);
  }

  async performScroll() {
    const scrollHeight = Math.floor(window.innerHeight * 0.8);
    window.scrollBy({
      top: scrollHeight,
      behavior: 'smooth'
    });

    // Reset to top if near bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      console.log('Near bottom of page, scrolling to top...');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async clickSeeMoreOnPost(post) {
    try {
      const seeMoreButtons = this.findSeeMoreButtonsInPost(post);
      const visibleButtons = seeMoreButtons.filter(button =>
        this.isElementInViewport(button) && !button.getAttribute('data-surfer-clicked')
      );

      if (visibleButtons.length > 0) {
        const button = visibleButtons[0]; // Take first visible button in this post
        button.setAttribute('data-surfer-clicked', 'true');
        this.sessionStats.totalSeeMoreClicked++;
        await this.humanLikeClick(button, `Clicked "${button.textContent.trim()}" 👁️`);
        console.log('✓ See More clicked');
      } else {
        console.log('✗ No See More button found in this post');
      }
    } catch (error) {
      console.log('Error clicking See More:', error);
    }
  }

  findSeeMoreButtonsInPost(post) {
    const buttons = [];

    // Platform-specific keywords
    let expandKeywords = [];

    if (this.platform === 'facebook') {
      expandKeywords = ['See more', 'See More', 'Continue reading', 'Read more', 'Show more'];
    } else if (this.platform === 'twitter') {
      expandKeywords = ['Show more', 'Show this thread', 'Show replies'];
    } else if (this.platform === 'linkedin') {
      expandKeywords = ['see more', 'See more', 'Show more'];
    } else {
      expandKeywords = ['show more', 'see more', 'See more', 'Show more', 'read more', 'Read more'];
    }

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
      const textLower = text.toLowerCase();
      const ariaLabel = (element.getAttribute('aria-label') || '');
      const ariaLabelLower = ariaLabel.toLowerCase();

      const matchesKeyword = expandKeywords.some(keyword => {
        if (this.platform === 'facebook') {
          return text === keyword || ariaLabel === keyword;
        }
        return textLower.includes(keyword.toLowerCase()) ||
               ariaLabelLower.includes(keyword.toLowerCase());
      });

      if (matchesKeyword) {
        buttons.push(element);
      }
    });

    return buttons;
  }

  getRandomScrollDelay() {
    const min = this.settings.scrollSpeedMin || 2000;
    const max = this.settings.scrollSpeedMax || 4000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Old global findSeeMoreButtons - kept for testSeeMoreButtons() compatibility
  findSeeMoreButtons() {
    const buttons = [];
    
    console.log(`=== FINDING SEE MORE BUTTONS FOR ${this.platform.toUpperCase()} ===`);
    
    // Get posts first
    const posts = document.querySelectorAll(this.selectors.posts);
    console.log(`Found ${posts.length} posts using selector: ${this.selectors.posts}`);
    
    if (posts.length === 0) {
      // Try alternative Facebook selectors
      if (this.platform === 'facebook') {
        const altSelectors = [
          'div[data-pagelet="FeedUnit"]',
          '[role="main"] > div > div',
          'div[data-testid="story-subtilte"]',
          'div[aria-posinset]',
          '.story_body_container'
        ];
        
        for (let selector of altSelectors) {
          const altPosts = document.querySelectorAll(selector);
          console.log(`Trying alternative selector "${selector}": found ${altPosts.length} elements`);
          if (altPosts.length > 0) {
            posts.push(...altPosts);
            break;
          }
        }
      }
    }
    
    // Platform-specific exact keywords
    let expandKeywords = [];
    
    if (this.platform === 'facebook') {
      expandKeywords = [
        'See more', // Facebook uses exact "See more" with capital S
        'See More', // Try with capital M too
        'Continue reading',
        'Continue Reading',
        'Show more comments',
        'View more comments',
        'Read more',
        'Show more'
      ];
    } else if (this.platform === 'twitter') {
      expandKeywords = [
        'Show more', // Twitter uses "Show more" 
        'Show this thread',
        'Show replies'
      ];
    } else if (this.platform === 'linkedin') {
      expandKeywords = [
        'see more', // LinkedIn uses lowercase "see more"
        'See more',
        'Show more'
      ];
    } else {
      // Generic fallback
      expandKeywords = [
        'show more', 'see more', 'See more', 'Show more', 'read more', 'Read more',
        'continue reading', 'Continue reading', 'show this thread', 'Show this thread',
        'continue this thread', 'show replies', 'view more', 'expand'
      ];
    }
    
    // Special Facebook handling
    if (this.platform === 'facebook') {
      console.log('Using Facebook-specific detection...');
      
      // Search everywhere on Facebook, not just in detected posts
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
      
      allClickableElements.forEach((element, elemIndex) => {
        const text = element.textContent.trim();
        const ariaLabel = element.getAttribute('aria-label') || '';
        
        // Look for Facebook's "See more" patterns
        const fbPatterns = [
          'See more',
          'See More', 
          'Continue reading',
          'Show more',
          '...more',
          'Read more'
        ];
        
        const matchesPattern = fbPatterns.some(pattern => {
          return text === pattern || 
                 text.includes(pattern) || 
                 ariaLabel === pattern || 
                 ariaLabel.includes(pattern);
        });
        
        if (matchesPattern) {
          console.log(`[Facebook] Found potential button #${elemIndex}: "${text}" (aria: "${ariaLabel}")`);
          console.log('Element:', element);
          console.log('Parent:', element.parentElement);
          buttons.push(element);
        }
      });
      
      return buttons;
    }
    
    // Original logic for other platforms
    posts.forEach((post, postIndex) => {
      // Get all clickable elements
      const clickableElements = post.querySelectorAll(`
        button,
        span[role="button"],
        div[role="button"],
        a[role="button"],
        [tabindex="0"],
        span[data-testid],
        div[data-testid]
      `);
      
      console.log(`Post ${postIndex}: Found ${clickableElements.length} clickable elements`);
      
      clickableElements.forEach((element, elemIndex) => {
        const text = element.textContent.trim(); // Keep original case
        const textLower = text.toLowerCase();
        const ariaLabel = (element.getAttribute('aria-label') || '');
        const ariaLabelLower = ariaLabel.toLowerCase();
        
        // Exact and case-sensitive matching for better accuracy
        const matchesKeyword = expandKeywords.some(keyword => {
          // For Facebook, do exact matching
          if (this.platform === 'facebook') {
            return text === keyword || ariaLabel === keyword;
          }
          // For other platforms, use contains matching
          return textLower.includes(keyword.toLowerCase()) || 
                 ariaLabelLower.includes(keyword.toLowerCase());
        });
        
        // Special patterns (less aggressive for Facebook)
        let isEllipsis = false;
        let hasExpandPattern = false;
        
        if (this.platform !== 'facebook') {
          isEllipsis = text === '...' || text === '…' || /^\.\.\.$/.test(text);
          hasExpandPattern = text.includes('...') || ariaLabelLower.includes('expand');
        }
        
        if (matchesKeyword || isEllipsis || hasExpandPattern) {
          console.log(`[${this.platform}] Found button: "${text}" (aria: "${ariaLabel}") in post ${postIndex}, element ${elemIndex}`);
          buttons.push(element);
        }
      });
    });
    
    console.log(`Total buttons found: ${buttons.length}`);
    return buttons;
  }

  // Test function to manually trigger see more detection
  async testSeeMoreButtons() {
    console.log('=== TESTING SEE MORE BUTTONS ===');
    console.log('Platform:', this.platform);
    console.log('Post selector:', this.selectors.posts);

    const buttons = this.findSeeMoreButtons();
    console.log(`Found ${buttons.length} see more buttons`);

    if (buttons.length > 0) {
      const visibleButtons = buttons.filter(button => this.isElementInViewport(button));
      console.log(`${visibleButtons.length} are visible`);

      if (visibleButtons.length > 0) {
        const testButton = visibleButtons[0];
        console.log('Testing first visible button:', testButton);
        console.log('Button text:', testButton.textContent.trim());
        console.log('Button aria-label:', testButton.getAttribute('aria-label'));

        // Highlight the button for testing
        testButton.style.border = '3px solid red';
        testButton.style.backgroundColor = 'yellow';

        setTimeout(() => {
          testButton.style.border = '';
          testButton.style.backgroundColor = '';
        }, 3000);

        this.showNotification(`Found button: "${testButton.textContent.trim()}"`, 'info');
      }
    } else {
      this.showNotification('No see more buttons found!', 'error');
    }
  }

  // Test function to manually trigger like detection
  async testLikePost() {
    console.log('=== TESTING LIKE POST ===');
    console.log('Platform:', this.platform);
    console.log('Post selector:', this.selectors.posts);
    console.log('Like button selector:', this.selectors.likeButton);

    const posts = document.querySelectorAll(this.selectors.posts);
    const visiblePosts = Array.from(posts).filter(post => this.isElementInViewport(post));

    console.log(`Found ${posts.length} total posts, ${visiblePosts.length} visible posts`);

    if (visiblePosts.length > 0) {
      const testPost = visiblePosts[0];
      console.log('Testing first visible post:', testPost);

      const likeButton = testPost.querySelector(this.selectors.likeButton);
      console.log('Like button found:', !!likeButton);

      if (likeButton) {
        console.log('Like button element:', likeButton);
        console.log('Like button aria-label:', likeButton.getAttribute('aria-label'));
        console.log('Like button aria-pressed:', likeButton.getAttribute('aria-pressed'));
        console.log('Like button data-surfer-clicked:', likeButton.getAttribute('data-surfer-clicked'));

        // Highlight the button for testing
        likeButton.style.border = '3px solid red';
        likeButton.style.backgroundColor = 'yellow';

        setTimeout(() => {
          likeButton.style.border = '';
          likeButton.style.backgroundColor = '';
        }, 3000);

        // Try clicking it
        console.log('Attempting to click like button...');
        await this.humanLikeClick(likeButton, 'Test liked a post! ❤️');

        this.showNotification('Like button clicked!', 'success');
      } else {
        this.showNotification('No like button found in first visible post!', 'error');
      }
    } else {
      this.showNotification('No visible posts found!', 'error');
    }
  }

  // Test function to manually trigger comment detection
  async testCommentPost() {
    console.log('=== TESTING COMMENT POST ===');
    console.log('Platform:', this.platform);
    console.log('Post selector:', this.selectors.posts);
    console.log('Comment button selector:', this.selectors.commentButton || this.selectors.replyButton);

    const posts = document.querySelectorAll(this.selectors.posts);
    const visiblePosts = Array.from(posts).filter(post => this.isElementInViewport(post));

    console.log(`Found ${posts.length} total posts, ${visiblePosts.length} visible posts`);

    if (visiblePosts.length > 0) {
      const testPost = visiblePosts[0];
      console.log('Testing first visible post:', testPost);

      const commentButton = testPost.querySelector(this.selectors.commentButton || this.selectors.replyButton);
      console.log('Comment button found:', !!commentButton);

      if (commentButton) {
        console.log('Comment button element:', commentButton);
        console.log('Comment button aria-label:', commentButton.getAttribute('aria-label'));
        console.log('Comment button data-surfer-commented:', commentButton.getAttribute('data-surfer-commented'));

        // Highlight the button for testing
        commentButton.style.border = '3px solid red';
        commentButton.style.backgroundColor = 'yellow';

        setTimeout(() => {
          commentButton.style.border = '';
          commentButton.style.backgroundColor = '';
        }, 3000);

        // Try clicking it and typing comment (but NOT submitting)
        console.log('Attempting to open comment box and type...');
        await this.testAddPositiveComment(testPost);

        this.showNotification('Comment typed (not submitted)!', 'success');
      } else {
        this.showNotification('No comment button found in first visible post!', 'error');
      }
    } else {
      this.showNotification('No visible posts found!', 'error');
    }
  }

  async testAddPositiveComment(post) {
    try {
      const commentButton = post.querySelector(this.selectors.commentButton || this.selectors.replyButton);
      if (!commentButton) {
        console.log('No comment button found');
        return false;
      }

      console.log('Step 1: Clicking comment button...');
      await this.humanLikeClick(commentButton, 'Opening comment box...');

      // Wait for comment box to appear
      console.log('Step 2: Waiting for comment box to appear...');
      await this.sleep(2000);

      // For LinkedIn, manually click into the comment area
      if (this.platform === 'linkedin') {
        console.log('Step 3: LinkedIn detected - looking for comment input area...');

        // Try to find the "Add a comment" placeholder or input area
        const commentInputs = [
          '.comments-comment-box__form',
          '.comments-comment-texteditor',
          '.ql-editor[data-placeholder]',
          '[data-placeholder="Add a comment…"]',
          '.editor-container'
        ];

        let commentInput = null;
        for (const selector of commentInputs) {
          const el = document.querySelector(selector);
          if (el) {
            console.log(`Found comment input with selector: ${selector}`, el);
            commentInput = el;
            break;
          }
        }

        if (commentInput) {
          console.log('Step 4: Clicking into LinkedIn comment input area...');
          await this.humanLikeClick(commentInput, 'Activating comment field...');
          await this.sleep(1000);
        }
      }

      // Now find the actual editable text area
      console.log('Step 5: Searching for editable text area...');
      let textArea = null;
      const selectors = [
        '.ql-editor[contenteditable="true"]',
        '.comments-comment-box-comment__text-editor',
        '[role="textbox"]',
        '[contenteditable="true"]',
        'textarea',
        '.ql-editor'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Selector "${selector}" found ${elements.length} elements`);

        for (const el of elements) {
          // Check if visible and actually editable
          const isVisible = (this.isElementInViewport(el) || el.offsetParent !== null);
          const isEditable = el.contentEditable === 'true' || el.getAttribute('contenteditable') === 'true' || el.tagName === 'TEXTAREA';

          console.log(`  Element: visible=${isVisible}, editable=${isEditable}`, el);

          if (isVisible && isEditable) {
            textArea = el;
            console.log('✓ Found visible & editable text area:', el);
            break;
          }
        }

        if (textArea) break;
      }

      if (!textArea) {
        console.log('✗ Could not find editable text area');
        this.showNotification('Could not find text area!', 'error');
        return false;
      }

      console.log('Step 6: Text area found!');
      console.log('  Tag:', textArea.tagName);
      console.log('  Classes:', textArea.className);
      console.log('  ContentEditable:', textArea.contentEditable);
      console.log('  Placeholder:', textArea.getAttribute('data-placeholder'));

      // Final click to ensure focus
      console.log('Step 7: Clicking text area to ensure focus...');
      textArea.click();
      textArea.focus();
      await this.sleep(500);

      const randomResponse = this.positiveResponses[Math.floor(Math.random() * this.positiveResponses.length)];
      console.log('Step 8: Typing comment:', randomResponse);

      // Type text character by character
      await this.typeText(textArea, randomResponse);

      console.log('✓ Comment typed successfully (NOT submitted - this is a test)');
      this.showNotification(`Typed: "${randomResponse}" (not submitted)`, 'info');
      return true;

    } catch (error) {
      console.log('[Test Comment] Error:', error);
      return false;
    }
  }

  createCursor() {
    if (this.cursor) return;

    this.cursor = document.createElement('div');
    this.cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: rgba(255, 0, 0, 0.6);
      border: 2px solid rgba(255, 0, 0, 0.9);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      transition: all 0.1s ease-out;
      display: block;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      left: 50%;
      top: 50%;
    `;
    document.body.appendChild(this.cursor);
  }

  showCursor() {
    if (this.cursor) {
      this.cursor.style.opacity = '1';
    }
  }

  hideCursor() {
    if (this.cursor) {
      // Don't hide, just make slightly transparent
      this.cursor.style.opacity = '0.3';
    }
  }

  async moveCursorTo(element) {
    if (!this.cursor) return;
    
    const rect = element.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    
    const currentX = parseFloat(this.cursor.style.left) || Math.random() * window.innerWidth;
    const currentY = parseFloat(this.cursor.style.top) || Math.random() * window.innerHeight;
    
    const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
    const duration = Math.max(300, Math.min(1500, distance * 2)); // Dynamic duration based on distance
    
    this.showCursor();
    
    // Animate cursor movement with human-like curve
    await this.animateCursorMovement(currentX, currentY, targetX, targetY, duration);
  }

  async animateCursorMovement(startX, startY, endX, endY, duration) {
    return new Promise(resolve => {
      const startTime = Date.now();
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Add some human-like curve to movement
      const controlPointX = startX + deltaX * 0.5 + (Math.random() - 0.5) * 100;
      const controlPointY = startY + deltaY * 0.5 + (Math.random() - 0.5) * 100;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for natural movement
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // Bezier curve calculation
        const t = easeProgress;
        const invT = 1 - t;
        
        const x = invT * invT * startX + 2 * invT * t * controlPointX + t * t * endX;
        const y = invT * invT * startY + 2 * invT * t * controlPointY + t * t * endY;
        
        this.cursor.style.left = x + 'px';
        this.cursor.style.top = y + 'px';
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  }

  async humanLikeClick(element, notificationText = 'Clicked element') {
    try {
      // Move cursor to element
      await this.moveCursorTo(element);
      
      // Random pre-click delay
      await this.sleep(Math.random() * 200 + 100);
      
      // Visual click feedback
      this.cursor.style.transform = 'scale(0.8)';
      this.cursor.style.background = 'rgba(255, 100, 100, 0.8)';
      
      // Actually click the element
      element.click();
      
      await this.sleep(100);
      
      // Reset cursor appearance
      this.cursor.style.transform = 'scale(1)';
      this.cursor.style.background = 'rgba(255, 0, 0, 0.6)';
      
      // Make cursor slightly transparent after click
      setTimeout(() => this.hideCursor(), 500);
      
      this.showNotification(notificationText, 'success');
      
      // Random post-click delay
      await this.sleep(Math.random() * 500 + 200);
      
    } catch (error) {
      console.log('Error in humanLikeClick:', error);
      this.hideCursor();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    // Check if element is at least partially visible
    return (
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right > 0
    );
  }

  async likePost(post) {
    try {
      const postNumber = this.sessionStats.totalPostsViewed;
      let didLike = false;

      const likeButton = post.querySelector(this.selectors.likeButton);
      console.log('[Like] Button found:', !!likeButton);

      if (likeButton) {
        const ariaPressed = likeButton.getAttribute('aria-pressed');
        const alreadyClicked = likeButton.getAttribute('data-surfer-liked');
        console.log('[Like] aria-pressed:', ariaPressed, 'already-clicked:', alreadyClicked);

        const isNotLiked = ariaPressed !== 'true';
        const notClickedByUs = !alreadyClicked;

        if (isNotLiked && notClickedByUs) {
          likeButton.setAttribute('data-surfer-liked', 'true');
          await this.sleep(Math.random() * 1000 + 500);

          console.log('[Like] Attempting to click like button...');
          await this.humanLikeClick(likeButton, 'Liked a post! ❤️');
          didLike = true;
          this.sessionStats.totalPostsLiked++;
        }
      }

      console.log(`Post #${postNumber}: Liked: ${didLike ? 'YES' : 'NO'}`);
    } catch (error) {
      console.log('[Like] Error:', error);
    }
  }

  async commentPost(post) {
    try {
      const postNumber = this.sessionStats.totalPostsViewed;
      let didComment = false;

      const commented = await this.addPositiveComment(post);
      if (commented) {
        didComment = true;
        this.sessionStats.totalComments++;
      }

      console.log(`Post #${postNumber}: Commented: ${didComment ? 'YES' : 'NO'}`);
    } catch (error) {
      console.log('[Comment] Error:', error);
    }
  }

  async addPositiveComment(post) {
    try {
      const commentButton = post.querySelector(this.selectors.commentButton || this.selectors.replyButton);
      if (!commentButton || commentButton.getAttribute('data-surfer-commented')) return false;

      commentButton.setAttribute('data-surfer-commented', 'true');
      console.log('[Comment] Clicking comment button...');
      await this.humanLikeClick(commentButton, 'Opening comment box...');

      await this.sleep(2000);

      // For LinkedIn, click into the comment area first
      if (this.platform === 'linkedin') {
        console.log('[Comment] LinkedIn detected - looking for comment input area...');
        const commentInputs = [
          '.comments-comment-box__form',
          '.comments-comment-texteditor',
          '.ql-editor[data-placeholder]',
          '[data-placeholder="Add a comment…"]',
          '.editor-container'
        ];

        let commentInput = null;
        for (const selector of commentInputs) {
          const el = document.querySelector(selector);
          if (el) {
            commentInput = el;
            break;
          }
        }

        if (commentInput) {
          console.log('[Comment] Clicking LinkedIn comment input area...');
          await this.humanLikeClick(commentInput, 'Activating comment field...');
          await this.sleep(1000);
        }
      }

      // Find the actual editable text area
      let textArea = null;
      const selectors = [
        '.ql-editor[contenteditable="true"]',
        '.comments-comment-box-comment__text-editor',
        '[role="textbox"]',
        '[contenteditable="true"]',
        'textarea',
        '.ql-editor'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const isVisible = (this.isElementInViewport(el) || el.offsetParent !== null);
          const isEditable = el.contentEditable === 'true' || el.getAttribute('contenteditable') === 'true' || el.tagName === 'TEXTAREA';

          if (isVisible && isEditable) {
            textArea = el;
            break;
          }
        }
        if (textArea) break;
      }

      if (textArea) {
        console.log('[Comment] Text area found, clicking to focus...');
        textArea.click();
        textArea.focus();
        await this.sleep(500);

        const randomResponse = this.positiveResponses[Math.floor(Math.random() * this.positiveResponses.length)];
        console.log('[Comment] Typing:', randomResponse);

        // Type text character by character
        await this.typeText(textArea, randomResponse);

        await this.sleep(1000 + Math.random() * 1000);

        const submitButton = document.querySelector('[data-testid="tweetButton"], [type="submit"]');
        if (submitButton && !submitButton.disabled) {
          await this.humanLikeClick(submitButton, 'Added positive comment! 💬');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log('[Comment] Could not add comment:', error);
      return false;
    }
  }

  async typeText(textArea, text) {
    // Focus the element
    textArea.focus();

    // Check if it's a contenteditable div (like LinkedIn) or a regular textarea/input
    const isContentEditable = textArea.contentEditable === 'true' || textArea.getAttribute('contenteditable') === 'true';

    if (isContentEditable) {
      console.log('Detected contenteditable element, using execCommand/innerHTML method');

      // Focus and ensure it's active
      textArea.focus();

      // Click the element to ensure it's focused
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      textArea.dispatchEvent(clickEvent);

      await this.sleep(300);

      // Clear existing content
      textArea.innerHTML = '';
      textArea.textContent = '';

      // Select all and delete (in case there's content)
      if (document.execCommand) {
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
      }

      await this.sleep(200);

      console.log('Starting to type character by character...');

      // Try using execCommand to insert text (more reliable for contenteditable)
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Method 1: Try execCommand (works in most browsers)
        if (document.execCommand) {
          document.execCommand('insertText', false, char);
        } else {
          // Method 2: Fallback to direct manipulation
          textArea.textContent += char;
          textArea.innerHTML = textArea.textContent;
        }

        // Dispatch input event
        textArea.dispatchEvent(new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          inputType: 'insertText',
          data: char
        }));

        console.log(`Typed character ${i + 1}/${text.length}: "${char}"`);

        // Random typing delay between 50-150ms
        await this.sleep(Math.random() * 100 + 50);

        // Occasional longer pauses (like thinking)
        if (Math.random() < 0.1) {
          await this.sleep(Math.random() * 500 + 200);
        }
      }

      console.log('Finished typing. Final content:', textArea.textContent);

      // Final events to ensure the content is registered
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
      textArea.dispatchEvent(new Event('change', { bubbles: true }));
      textArea.blur();
      textArea.focus();

    } else {
      console.log('Detected regular textarea/input, using value method');

      // Clear existing content
      textArea.value = '';

      // Type character by character
      for (let i = 0; i < text.length; i++) {
        textArea.value += text[i];
        textArea.dispatchEvent(new Event('input', { bubbles: true }));

        // Random typing delay between 50-150ms
        await this.sleep(Math.random() * 100 + 50);

        // Occasional longer pauses (like thinking)
        if (Math.random() < 0.1) {
          await this.sleep(Math.random() * 500 + 200);
        }
      }
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

const autoSurfer = new SocialMediaAutoSurfer();