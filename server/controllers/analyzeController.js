const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyze = async (req, res) => {
  try {
    const { url, title, content } = req.body;

    if (!content || content.length === 0) {
      return res.status(400).json({ success: false, error: "No content provided" });
    }

    const prompt = `You are a dark pattern detector. Analyze the following website content and find any manipulative UI/UX patterns.

Website: ${url}
Title: ${title}

Content:
${content.join("\n")}

Look for these dark patterns:
- Scarcity (fake "only X left" messages)
- Urgency (fake countdowns, "hurry" messages)
- Social Proof (fake "X people bought this" messages)
- Confirmshaming (guilt-tripping opt-out text)
- Hidden Costs (fees shown late)
- Forced Action (requiring unnecessary steps)
- Misleading Language (confusing wording)
- Subscription Traps (hard to cancel)

Return a JSON response in this exact format:
{
  "patterns": [
    {
      "type": "pattern type",
      "text": "the exact text from the website",
      "confidence": 85,
      "description": "why this is a dark pattern"
    }
  ],
  "riskLevel": "high/medium/low/none",
  "totalFound": 0
}

If no dark patterns found, return empty patterns array with riskLevel "none" and totalFound 0.
Return ONLY valid JSON, nothing else.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const analysis = JSON.parse(cleanedText);

    res.json({
      success: true,
      url,
      timestamp: new Date().toISOString(),
      patterns: analysis.patterns || [],
      riskLevel: analysis.riskLevel || "none",
      totalFound: analysis.totalFound || 0,
    });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to analyze page" });
  }
};

module.exports = { analyze };
