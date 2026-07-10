# Dark Pattern Detector

A simple Chrome Extension and Node.js backend that uses Google Gemini AI to find manipulative UI/UX patterns on websites.

## Project Structure

```
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   └── assets/
│
└── server/
    ├── package.json
    ├── server.js
    ├── .env
    ├── routes/
    │   └── analyze.js
    └── controllers/
        └── analyzeController.js
```

## Setup Instructions

### 1. Backend Server Setup
- Go into the `server/` directory: `cd server`
- Install the required dependencies: `npm install`
- Open `.env` and replace `your_api_key_here` with your real Gemini API key
- Start the server: `npm start` (or `npm run dev`)

### 2. Chrome Extension Installation
- Open Google Chrome and navigate to `chrome://extensions`
- Turn on "Developer mode" in the top right corner
- Click the "Load unpacked" button in the top left corner
- Select the `extension/` directory of this project
- The extension is now loaded and ready!
