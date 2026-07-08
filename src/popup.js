// popup.js
document.getElementById('scan-btn').addEventListener('click', async () => {
    // Get the current active tab in the browser
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send a message to the content script running on that specific tab
    chrome.tabs.sendMessage(tab.id, { action: "scanPage" }, (response) => {
        console.log("Content script acknowledged:", response);
    });
});