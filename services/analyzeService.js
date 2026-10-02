const engine = require("../engine");
const { checkSebiNumbers } = require("./sebiFormat");

async function analyzeText(text, lang) {
  const base = await engine.analyze(text, lang);
  const sebi = checkSebiNumbers(text);

  // "SEBI registered" ka daava par number nahi => extra flag
  if (sebi.claimsSebiWithoutNumber) {
    base.flags.push({
      id: "sebi_claim_no_number",
      matchedText: "SEBI registered",
      weight: 10,
      why_hi: "SEBI registered bola gaya par registration number nahi diya.",
    });
    base.risk.score = Math.min(100, base.risk.score + 10);
  }

  return {
    ...base,
    sebiCheck: sebi,
    disclaimer: true, // UI me "ye salah nahi, jaankari hai" dikhane ke liye
    stored: false, // privacy: server ne kuch store nahi kiya
  };
}

module.exports = { analyzeText };
