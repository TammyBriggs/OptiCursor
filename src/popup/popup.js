// src/popup/popup.js
document.getElementById('toggle-tracking').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['src/content/content.js']
      });
    });
  });
  