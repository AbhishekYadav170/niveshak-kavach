// ============================================================
// PERSON 3 YAHAN APNA ENGINE LAGAYEGA.
// Contract: analyze(text, lang) -> { risk, flags, contentType, concepts, actions }
// Neeche sirf placeholder hai taaki end-to-end chal sake.
// ============================================================
const PLACEHOLDER_RULES = [
  { id: "guaranteed_return", re: /guarantee|100%\s*(profit|return)|pakka\s*munafa|गारंटी/i, weight: 30, why_hi: "Koi regulated product return ki guarantee nahi deta." },
  { id: "urgency", re: /sirf\s*aaj|jaldi|last\s*chance|abhi\s*join|आज ही/i, weight: 15, why_hi: "Jaldi karne ka dabaav scam ki nishani hai." },
  { id: "apk_fraud", re: /\.apk|apk\s*install|anydesk|teamviewer/i, weight: 25, why_hi: "Unknown app ya remote access app kabhi install na karein." },
  { id: "payment_request", re: /upi|paytm|phonepe|gpay|₹\s?\d+/i, weight: 15, why_hi: "Personal account/UPI me paisa maangna khatarnak hai." },
  { id: "telegram_redirect", re: /telegram|t\.me\/|whatsapp\s*group|join\s*group/i, weight: 10, why_hi: "Private group me bulana pump-and-dump ka tareeka ho sakta hai." },
];

function analyze(text /*, lang */) {
  const flags = [];
  let score = 0;
  for (const r of PLACEHOLDER_RULES) {
    const m = text.match(r.re);
    if (m) {
      flags.push({ id: r.id, matchedText: m[0], weight: r.weight, why_hi: r.why_hi });
      score += r.weight;
    }
  }
  score = Math.min(100, score);
  const level = score >= 60 ? "high" : score >= 30 ? "medium" : "low";
  return {
    risk: { score, level, confidence: "low" },
    flags,
    contentType: { label: "unclear", uncertainty: "Placeholder engine. Person 3 ka classifier abhi judna baaki hai." },
    concepts: flags.map((f) => f.id),
    actions: score >= 30 ? ["verify_sebi", "dont_send_money", "call_1930"] : ["verify_sebi"],
  };
}

module.exports = { analyze };
