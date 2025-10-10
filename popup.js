document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const testSeeMoreBtn = document.getElementById('testSeeMoreBtn');
  const testLikeBtn = document.getElementById('testLikeBtn');
  const testCommentBtn = document.getElementById('testCommentBtn');
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

  let currentTab = null;

  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async function updateStatus() {
    try {
      currentTab = await getCurrentTab();

      const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'getStatus' });

      if (response.isActive) {
        statusDiv.className = 'status active';
        statusText.textContent = 'Active - Auto Surfing';
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        statusDiv.className = 'status inactive';
        statusText.textContent = 'Inactive';
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }

      if (response.platform) {
        platformText.textContent = `Platform: ${response.platform.charAt(0).toUpperCase() + response.platform.slice(1)}`;
      } else {
        platformText.textContent = 'Platform not supported';
        startBtn.disabled = true;
      }
    } catch (error) {
      statusDiv.className = 'status inactive';
      statusText.textContent = 'Content script not loaded';
      platformText.textContent = 'Please refresh the page';
      startBtn.disabled = true;
      stopBtn.disabled = true;
    }
  }

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['surfSettings']);
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

  loadSettings();
  updateStatus();
});