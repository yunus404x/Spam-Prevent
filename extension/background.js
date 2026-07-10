chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_RESULTS") {
    chrome.storage.local.set({ [message.tabId]: message.results }, () => {
      sendResponse({ status: "saved" });
    });
    return true;
  }
});
