// content.js
console.log("Content script loaded into the webpage.");

// Listen for messages from the popup (e.g., when the user clicks 'Scan')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanPage") {
        console.log("Scanning page for text...");

        // Member 2: Grab the actual text from the webpage DOM here
        const pageText = document.body.innerText.substring(0, 500); // Grabbing first 500 chars for testing

        // Send the scraped text to the background worker to give to the AI
        chrome.runtime.sendMessage({ action: "analyzeText", data: pageText }, (response) => {
            console.log("Response from Background Worker/AI:", response);
        });

        sendResponse({ status: "Scan initiated" });
    }
});