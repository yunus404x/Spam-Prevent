require("dotenv").config();
const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "running" });
});

app.use("/api/analyze", analyzeRoute);

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
