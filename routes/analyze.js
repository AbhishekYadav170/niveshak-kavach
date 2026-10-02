const express = require("express");
const router = express.Router();
const { analyzeText } = require("../services/analyzeService");

// POST /api/analyze   body: { text: string, lang?: "hi" | "en" }
router.post("/", async (req, res, next) => {
  try {
    const { text, lang = "hi" } = req.body || {};
    if (typeof text !== "string" || text.trim().length < 5) {
      return res.status(400).json({ error: "invalid_input", message_hi: "Kam se kam 5 akshar ka message daalein." });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: "too_long", message_hi: "Message bahut lamba hai (max 5000 akshar)." });
    }
    const result = await analyzeText(text.trim(), lang === "en" ? "en" : "hi");
    res.json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
