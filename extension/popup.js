const websiteEl = document.getElementById("website");
const patternsFoundEl = document.getElementById("patterns-found");
const confidenceEl = document.getElementById("confidence");
const statusEl = document.getElementById("status");
const rescanBtn = document.getElementById("rescan-btn");

async function updateUI() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const url = new URL(tab.url);
  websiteEl.textContent = url.hostname;

  chrome.storage.local.get("current_tab", (data) => {
    const results = data["current_tab"];
    if (results && results.url === tab.url) {
      patternsFoundEl.textContent = results.totalFound;
      
      if (results.patterns && results.patterns.length > 0) {
        const totalConf = results.patterns.reduce((sum, p) => sum + p.confidence, 0);
        const avgConf = Math.round(totalConf / results.patterns.length);
        confidenceEl.textContent = `${avgConf}%`;
        statusEl.textContent = `Alert: ${results.riskLevel.toUpperCase()}`;
        statusEl.style.color = results.riskLevel === "high" ? "red" : "orange";
      } else {
        confidenceEl.textContent = "N/A";
        statusEl.textContent = "Clean";
        statusEl.style.color = "green";
      }
    } else {
      patternsFoundEl.textContent = "-";
      confidenceEl.textContent = "-";
      statusEl.textContent = "Not scanned";
      statusEl.style.color = "#555";
    }
  });
}

rescanBtn.addEventListener("click", async () => {
  statusEl.textContent = "Scanning...";
  statusEl.style.color = "#007bff";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.tabs.sendMessage(tab.id, { type: "TRIGGER_SCAN" }, (response) => {
    setTimeout(updateUI, 1000);
  });
});

updateUI();
window.addEventListener("focus", updateUI);
