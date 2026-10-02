const express = require("express");
const router = express.Router();

// Frontend ke liye: concepts (Samjho tiles / Learn page) aur actions (Ab kya karein)
router.get("/concepts", (req, res) => res.json(require("../data/concepts.json")));
router.get("/actions", (req, res) => res.json(require("../data/actions.json")));

module.exports = router;
