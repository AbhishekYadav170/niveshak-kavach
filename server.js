require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const analyzeRoute = require("./routes/analyze");

const app = express();
app.set("trust proxy", 1); // Render proxy ke peeche rate limit sahi chale

const origins = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);

app.use(helmet());
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json({ limit: "20kb" })); // message text chhota hi hota hai

// PRIVACY: yahan koi request-body logger nahi lagana. Message kabhi log/store nahi hota.

app.use(
  "/api/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too_many_requests", message_hi: "Bahut zyada requests. Thodi der baad try karein." },
  })
);

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
app.use("/api/analyze", analyzeRoute);

app.use((req, res) => res.status(404).json({ error: "not_found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // err.message me user ka text nahi hota, phir bhi sirf generic message bhejo
  res.status(err.status || 500).json({ error: "server_error", message_hi: "Kuch gadbad hui. Dobara try karein." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Niveshak Kavach API running on :${PORT}`));
