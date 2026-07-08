// background.js

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log("Dark Pattern Detector installed successfully.");
});

// Listen for messages from the Popup or Content Script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeText") {
        console.log("Background worker received text to analyze:", request.data);

        // TODO for Member 3: Send request.data to the AI API here.

        // Simulate AI response for testing
        sendResponse({ status: "success", mockAIResult: "Found a scarcity timer!" });
    }

    // Return true to indicate you wish to send a response asynchronously
    return true;
});