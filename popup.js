document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const testSeeMoreBtn = document.getElementById('testSeeMoreBtn');
  const testLikeBtn = document.getElementById('testLikeBtn');
  const testCommentBtn = document.getElementById('testCommentBtn');
  const supportBtn = document.getElementById('supportBtn');
  const supportQRContainer = document.getElementById('supportQRContainer');
  const statusDiv = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  const platformText = document.getElementById('platform-text');
  
  const scrollSpeedMinSlider = document.getElementById('scrollSpeedMin');
  const scrollSpeedMaxSlider = document.getElementById('scrollSpeedMax');
  const scrollSpeedValue = document.getElementById('scrollSpeedValue');
  const scrollSpeedMinValue = document.getElementById('scrollSpeedMinValue');
  const scrollSpeedMaxValue = document.getElementById('scrollSpeedMaxValue');

  const enableAutoLikeCheckbox = document.getElementById('enableAutoLike');
  const likeDelaySlider = document.getElementById('likeDelay');
  const likeDelayValue = document.getElementById('likeDelayValue');
  const likeProbabilitySlider = document.getElementById('likeProbability');
  const likeProbabilityValue = document.getElementById('likeProbabilityValue');

  const enableAutoCommentCheckbox = document.getElementById('enableAutoComment');
  const commentDelaySlider = document.getElementById('commentDelay');
  const commentDelayValue = document.getElementById('commentDelayValue');
  const commentProbabilitySlider = document.getElementById('commentProbability');
  const commentProbabilityValue = document.getElementById('commentProbabilityValue');

  const enableSeeMoreCheckbox = document.getElementById('enableSeeMore');
  const seeMoreDelaySlider = document.getElementById('seeMoreDelay');
  const seeMoreDelayValue = document.getElementById('seeMoreDelayValue');

  const langBtn = document.getElementById('langBtn');
  const themeBtn = document.getElementById('themeBtn');

  let currentTab = null;
  let currentLang = 'en';
  let currentTheme = 'dark';

  const translations = {
    en: {
      title: "Auto Surfer",
      startBtn: "Start Surfing",
      stopBtn: "Stop",
      statusActive: "Active - Auto Surfing",
      statusInactive: "Inactive",
      detectingPlatform: "Detecting platform...",
      platform: "Platform",
      contentScriptNotLoaded: "Content script not loaded",
      pleaseRefresh: "Please refresh the page",
      platformNotSupported: "Platform not supported",
      autoScrolling: "Auto Scrolling",
      expandContent: "Expand Content",
      autoLike: "Auto Like",
      autoComment: "Auto Comment",
      testingTools: "Testing Tools",
      scrollSpeedRange: "Scroll Speed Range",
      clickDelay: "Click Delay",
      likeDelay: "Like Delay",
      likeProbability: "Like Probability",
      commentDelay: "Comment Delay",
      commentProbability: "Comment Probability",
      min: "Min",
      max: "Max",
      fasterSlower: "Faster ← → Slower",
      moreFrequent: "More Frequent ← → Less Frequent",
      neverAlways: "Never ← → Always",
      testSeeMore: 'Test "See More"',
      testLike: 'Test "Like Post"',
      testComment: 'Test "Comment"',
      supportMe: "Support Me",
      buyMeAPhin: "Buy me a phin ☕",
      hideQRCode: "Thank YOU so much"
    },
    vi: {
      title: "Lướt Tự Động",
      startBtn: "Bắt Đầu",
      stopBtn: "Dừng",
      statusActive: "Ai đang lướt mệt rã rời 😪",
      statusInactive: "Tool Ai đã sẵn sàng!! Ấn nút Bắt đầu để lướt hoy",
      detectingPlatform: "Đang nhận diện nền tảng...",
      platform: "Nền tảng",
      contentScriptNotLoaded: "Vội thế! Chưa tải xong web đã mở tool rồi",
      pleaseRefresh: "Làm ơn F5/tải lại web giùm tui",
      platformNotSupported: "Nền tảng không được hỗ trợ",
      autoScrolling: "Tự lướt",
      expandContent: "Tự ấn xem thêm",
      autoLike: "Tự thả tim",
      autoComment: "Bình Luận Tự Động",
      testingTools: "Công Cụ Kiểm Tra",
      scrollSpeedRange: "Phạm Vi Tốc Độ Cuộn",
      clickDelay: "Độ Trễ Click",
      likeDelay: "Độ Trễ Thích",
      likeProbability: "Xác Suất Thích",
      commentDelay: "Độ Trễ Bình Luận",
      commentProbability: "Xác Suất Bình Luận",
      min: "Tối thiểu",
      max: "Tối đa",
      fasterSlower: "Nhanh hơn ← → Chậm hơn",
      moreFrequent: "Thường xuyên hơn ← → Ít hơn",
      neverAlways: "Không bao giờ ← → Luôn luôn",
      testSeeMore: 'test Xem thêm',
      testLike: 'test Tự thả like',
      testComment: 'test Tự bình luận',
      supportMe: "Ủng Hộ Tui",
      buyMeAPhin: "Ủng hộ tui ly phin ☕",
      hideQRCode: "Xin cảm ơn rất nhiềuu"
    }
  };

  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async function updateStatus() {
    const t = translations[currentLang];

    try {
      currentTab = await getCurrentTab();

      const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'getStatus' });

      if (response.isActive) {
        statusDiv.className = 'status active';
        statusText.textContent = t.statusActive;
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        statusDiv.className = 'status inactive';
        statusText.textContent = t.statusInactive;
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }

      if (response.platform) {
        platformText.textContent = `${t.platform}: ${response.platform.charAt(0).toUpperCase() + response.platform.slice(1)}`;
      } else {
        platformText.textContent = t.platformNotSupported;
        startBtn.disabled = true;
      }
    } catch (error) {
      statusDiv.className = 'status inactive';
      statusText.textContent = t.contentScriptNotLoaded;
      platformText.textContent = t.pleaseRefresh;
      startBtn.disabled = true;
      stopBtn.disabled = true;
    }
  }

  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
      themeBtn.textContent = '🌙';
    } else {
      document.body.classList.remove('light-mode');
      themeBtn.textContent = '☀️';
    }

    chrome.storage.sync.set({ theme: currentTheme });
  }

  function updateLanguage() {
    const t = translations[currentLang];

    // Update title and buttons
    document.getElementById('title').textContent = `🌊 ${t.title}`;
    startBtn.textContent = t.startBtn;
    stopBtn.textContent = t.stopBtn;

    // Update card headers
    document.getElementById('autoScrollingLabel').textContent = t.autoScrolling;
    document.getElementById('expandContentLabel').textContent = t.expandContent;
    document.getElementById('autoLikeLabel').textContent = t.autoLike;
    document.getElementById('autoCommentLabel').textContent = t.autoComment;
    document.getElementById('testingToolsLabel').textContent = t.testingTools;
    document.getElementById('supportLabel').textContent = t.supportMe;

    // Update support button text based on current state
    if (supportQRContainer.style.display === 'none') {
      supportBtn.textContent = t.buyMeAPhin;
    } else {
      supportBtn.textContent = t.hideQRCode;
    }

    // Update labels
    document.getElementById('scrollSpeedRangeLabel').textContent = t.scrollSpeedRange;
    document.getElementById('minLabel').textContent = t.min;
    document.getElementById('maxLabel').textContent = t.max;
    document.getElementById('clickDelayLabel').textContent = t.clickDelay;
    document.getElementById('fasterSlowerLabel').textContent = t.fasterSlower;
    document.getElementById('likeDelayLabel').textContent = t.likeDelay;
    document.getElementById('likeProbabilityLabel').textContent = t.likeProbability;
    document.getElementById('moreFrequentLabel1').textContent = t.moreFrequent;
    document.getElementById('neverAlwaysLabel1').textContent = t.neverAlways;
    document.getElementById('commentDelayLabel').textContent = t.commentDelay;
    document.getElementById('commentProbabilityLabel').textContent = t.commentProbability;
    document.getElementById('moreFrequentLabel2').textContent = t.moreFrequent;
    document.getElementById('neverAlwaysLabel2').textContent = t.neverAlways;

    // Update test buttons
    testSeeMoreBtn.textContent = t.testSeeMore;
    testLikeBtn.textContent = t.testLike;
    testCommentBtn.textContent = t.testComment;

    // Update status text if needed
    updateStatus();
  }

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'vi' : 'en';
    langBtn.textContent = currentLang === 'en' ? '🇻🇳' : 'EN';
    updateLanguage();
    chrome.storage.sync.set({ language: currentLang });
  }

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['surfSettings', 'theme', 'language']);

      if (result.theme) {
        currentTheme = result.theme;
        if (currentTheme === 'light') {
          document.body.classList.add('light-mode');
          themeBtn.textContent = '🌙';
        }
      }

      if (result.language) {
        currentLang = result.language;
        langBtn.textContent = currentLang === 'en' ? '🇻🇳' : 'EN';
        updateLanguage();
      }

      if (result.surfSettings) {
        const settings = result.surfSettings;
        scrollSpeedMinSlider.value = settings.scrollSpeedMin || 2000;
        scrollSpeedMaxSlider.value = settings.scrollSpeedMax || 4000;

        enableAutoLikeCheckbox.checked = settings.enableAutoLike || false;
        likeDelaySlider.value = settings.likeDelay || 5000;
        likeProbabilitySlider.value = settings.likeProbability || 70;

        enableAutoCommentCheckbox.checked = settings.enableAutoComment || false;
        commentDelaySlider.value = settings.commentDelay || 8000;
        commentProbabilitySlider.value = settings.commentProbability || 30;

        enableSeeMoreCheckbox.checked = settings.enableSeeMore || false;
        seeMoreDelaySlider.value = settings.seeMoreDelay || 2000;

        updateSliderValues();
      }
    } catch (error) {
      console.log('Could not load settings');
    }
  }

  function updateSliderValues() {
    const minSpeed = parseInt(scrollSpeedMinSlider.value);
    const maxSpeed = parseInt(scrollSpeedMaxSlider.value);

    if (minSpeed > maxSpeed) {
      scrollSpeedMaxSlider.value = minSpeed;
    }

    scrollSpeedMinValue.textContent = (scrollSpeedMinSlider.value / 1000) + 's';
    scrollSpeedMaxValue.textContent = (scrollSpeedMaxSlider.value / 1000) + 's';
    scrollSpeedValue.textContent = (scrollSpeedMinSlider.value / 1000) + 's - ' + (scrollSpeedMaxSlider.value / 1000) + 's';
    likeDelayValue.textContent = (likeDelaySlider.value / 1000) + 's';
    likeProbabilityValue.textContent = likeProbabilitySlider.value + '%';
    commentDelayValue.textContent = (commentDelaySlider.value / 1000) + 's';
    commentProbabilityValue.textContent = commentProbabilitySlider.value + '%';
    seeMoreDelayValue.textContent = (seeMoreDelaySlider.value / 1000) + 's';
  }

  async function saveSettings() {
    const settings = {
      scrollSpeedMin: parseInt(scrollSpeedMinSlider.value),
      scrollSpeedMax: parseInt(scrollSpeedMaxSlider.value),
      enableAutoLike: enableAutoLikeCheckbox.checked,
      likeDelay: parseInt(likeDelaySlider.value),
      likeProbability: parseInt(likeProbabilitySlider.value),
      enableAutoComment: enableAutoCommentCheckbox.checked,
      commentDelay: parseInt(commentDelaySlider.value),
      commentProbability: parseInt(commentProbabilitySlider.value),
      enableSeeMore: enableSeeMoreCheckbox.checked,
      seeMoreDelay: parseInt(seeMoreDelaySlider.value)
    };

    try {
      await chrome.storage.sync.set({ surfSettings: settings });
      
      if (currentTab) {
        chrome.tabs.sendMessage(currentTab.id, { 
          action: 'updateSettings', 
          settings: settings 
        });
      }
    } catch (error) {
      console.log('Could not save settings');
    }
  }

  startBtn.addEventListener('click', async function() {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'start' });
      setTimeout(updateStatus, 500);
    }
  });

  stopBtn.addEventListener('click', async function() {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'stop' });
      setTimeout(updateStatus, 500);
    }
  });

  testSeeMoreBtn.addEventListener('click', async function() {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'testSeeMore' });
    }
  });

  testLikeBtn.addEventListener('click', async function() {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'testLike' });
    }
  });

  testCommentBtn.addEventListener('click', async function() {
    if (currentTab) {
      chrome.tabs.sendMessage(currentTab.id, { action: 'testComment' });
    }
  });

  supportBtn.addEventListener('click', function() {
    const t = translations[currentLang];
    // Toggle QR code visibility
    if (supportQRContainer.style.display === 'none') {
      supportQRContainer.style.display = 'block';
      supportBtn.textContent = t.hideQRCode;
    } else {
      supportQRContainer.style.display = 'none';
      supportBtn.textContent = t.buyMeAPhin;
    }
  });

  scrollSpeedMinSlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  scrollSpeedMaxSlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  enableAutoLikeCheckbox.addEventListener('change', function() {
    saveSettings();
  });

  likeDelaySlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  likeProbabilitySlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  enableAutoCommentCheckbox.addEventListener('change', function() {
    saveSettings();
  });

  commentDelaySlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  commentProbabilitySlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  enableSeeMoreCheckbox.addEventListener('change', function() {
    saveSettings();
  });

  seeMoreDelaySlider.addEventListener('input', function() {
    updateSliderValues();
    saveSettings();
  });

  langBtn.addEventListener('click', toggleLanguage);
  themeBtn.addEventListener('click', toggleTheme);

  loadSettings();
  updateStatus();
});