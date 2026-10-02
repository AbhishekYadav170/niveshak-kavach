// const engine = require("../engine");
// const { checkSebiNumbers } = require("./sebiFormat");

// async function analyzeText(text, lang) {
//   const base = await engine.analyze(text, lang);
//   const sebi = checkSebiNumbers(text);

//   // "SEBI registered" ka daava par number nahi => extra flag
//   if (sebi.claimsSebiWithoutNumber) {
//     base.flags.push({
//       id: "sebi_claim_no_number",
//       matchedText: "SEBI registered",
//       weight: 10,
//       why_hi: "SEBI registered bola gaya par registration number nahi diya.",
//     });
//     base.risk.score = Math.min(100, base.risk.score + 10);
//   }

//   return {
//     ...base,
//     sebiCheck: sebi,
//     disclaimer: true, // UI me "ye salah nahi, jaankari hai" dikhane ke liye
//     stored: false, // privacy: server ne kuch store nahi kiya
//   };
// }

// module.exports = { analyzeText };




const engine = require("../engine");
const { checkSebiNumbers } = require("./sebiFormat");

function addFlag(base, flag) {
  base.flags.push(flag);
  base.risk.score = Math.min(100, base.risk.score + flag.weight);
  base.risk.level = base.risk.score >= 60 ? "high" : base.risk.score >= 30 ? "medium" : "low";
  if (!base.concepts.includes(flag.concept)) base.concepts.push(flag.concept);
  for (const a of flag.actions) if (!base.actions.includes(a)) base.actions.push(a);
}

async function analyzeText(text, lang) {
  const base = await engine.analyze(text, lang);
  const sebi = checkSebiNumbers(text);

  if (sebi.claimsSebiWithoutNumber) {
    addFlag(base, {
      id: "sebi_claim_no_number", concept: "sebi_registration", matchedText: "SEBI registered", weight: 10,
      why_hi: "'SEBI registered' लिखा है पर रजिस्ट्रेशन नंबर नहीं दिया।",
      why_en: "Claims SEBI registration but gives no registration number.", actions: ["verify_sebi"],
    });
  }
  if (sebi.numbers.some((n) => !n.formatValid)) {
    addFlag(base, {
      id: "sebi_bad_format", concept: "sebi_registration", matchedText: sebi.numbers.find((n) => !n.formatValid).number, weight: 20,
      why_hi: "दिया गया रजिस्ट्रेशन नंबर SEBI के सही फॉर्मेट में नहीं है।",
      why_en: "The registration number is not in a valid SEBI format.", actions: ["verify_sebi"],
    });
  }

  return { ...base, sebiCheck: sebi, disclaimer: true, stored: false };
}

module.exports = { analyzeText };
