async function runScan() {
  const visibleTexts = [];
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const style = window.getComputedStyle(parent);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          parent.tagName === "SCRIPT" ||
          parent.tagName === "STYLE" ||
          parent.tagName === "NOSCRIPT"
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  while (textNodes.nextNode()) {
    const text = textNodes.currentNode.textContent.trim();
    if (text.length > 5 && text.length < 500) {
      visibleTexts.push(text);
    }
  }

  const uniqueTexts = Array.from(new Set(visibleTexts)).slice(0, 150);

  try {
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: window.location.href,
        title: document.title,
        content: uniqueTexts
      })
    });

    const data = await response.json();
    if (data.success && data.patterns) {
      chrome.runtime.sendMessage({
        type: "SAVE_RESULTS",
        tabId: "current_tab",
        results: data
      });
      highlightPatterns(data.patterns);
    }
  } catch (error) {
    console.error("Scan error:", error);
  }
}

function highlightPatterns(patterns) {
  removeHighlights();

  patterns.forEach((pattern) => {
    const text = pattern.text.toLowerCase().trim();
    if (text.length < 3) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );

    const matches = [];
    while (walker.nextNode()) {
      const nodeText = walker.currentNode.textContent.toLowerCase();
      if (nodeText.includes(text)) {
        matches.push(walker.currentNode.parentElement);
      }
    }

    matches.forEach((el) => {
      if (el.classList.contains("dp-highlighted")) return;

      el.classList.add("dp-highlighted");
      el.style.outline = "2px dashed red";
      el.style.position = "relative";
      el.style.backgroundColor = "rgba(255, 0, 0, 0.1)";

      const tooltip = document.createElement("span");
      tooltip.className = "dp-tooltip-text";
      tooltip.innerText = `${pattern.type}: ${pattern.description} (${pattern.confidence}%)`;
      tooltip.style.visibility = "hidden";
      tooltip.style.width = "220px";
      tooltip.style.backgroundColor = "black";
      tooltip.style.color = "#fff";
      tooltip.style.textAlign = "center";
      tooltip.style.borderRadius = "6px";
      tooltip.style.padding = "5px";
      tooltip.style.position = "absolute";
      tooltip.style.zIndex = "99999";
      tooltip.style.bottom = "125%";
      tooltip.style.left = "50%";
      tooltip.style.marginLeft = "-110px";
      tooltip.style.opacity = "0";
      tooltip.style.transition = "opacity 0.3s";
      tooltip.style.fontSize = "11px";
      tooltip.style.lineHeight = "1.4";

      el.appendChild(tooltip);

      el.addEventListener("mouseenter", () => {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
      });

      el.addEventListener("mouseleave", () => {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
      });
    });
  });
}

function removeHighlights() {
  const elements = document.querySelectorAll(".dp-highlighted");
  elements.forEach((el) => {
    el.classList.remove("dp-highlighted");
    el.style.outline = "";
    el.style.backgroundColor = "";
    const tooltips = el.querySelectorAll(".dp-tooltip-text");
    tooltips.forEach((t) => t.remove());
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TRIGGER_SCAN") {
    runScan().then(() => sendResponse({ status: "done" }));
    return true;
  }
});

setTimeout(runScan, 2000);
