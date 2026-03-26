chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    const targetUrls = ["*://*.twitter.com/*", "*://*.x.com/*"];
    chrome.tabs.query({ url: targetUrls }, (tabs) => {
      for (let tab of tabs) {
        chrome.scripting
          .insertCSS({ target: { tabId: tab.id }, files: ["override.css"] })
          .catch(() => {});
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            files: ["override.js"],
            world: "MAIN",
          })
          .catch(() => {});
      }
    });
  }
});
