console.log("Background Service Worker Started");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Spam Prevent Installed Successfully");
});