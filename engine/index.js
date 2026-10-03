// Person 3 engine: rules.json based, explainable. LLM baad me optional (classifier fallback yahi hai).
const rules = require("../data/rules.json").map((r) => ({ ...r, re: new RegExp(r.pattern, "i") }));

// Match se pehle ke 25 akshar me inkaar/savdhani ho to flag mat lagao (awareness messages false alarm na ho)
const NEGATION = /\b(never|not|no|don'?t|dont|cannot|can'?t|avoid|beware|mat|nahi|nahin|na\s*kare[ni]?)\b|नहीं|मत|कभी\s*न|सावधान|बचें|न\s*करें/i;

const EDU_SIGNS = /sebi\.gov\.in|investor\s*(awareness|education|alert)|beware|be\s*careful|verify\s*(before|on|from)|निवेशक\s*(जागरूकता|शिक्षा)|सावधान|सतर्क|शिकायत\s*दर्ज|scores\.sebi|never\s*share|कभी\s*(न|नहीं)\s*(बताएं|साझा)/i;
const PROMO_SIGNS = /\b(join|offer|call\s*now|contact\s*us|whatsapp\s*(me|us)|dm\s*me|buy\s*now|subscribe|plan|package|membership)\b|जॉइन|ऑफर|संपर्क\s*करें|खरीदें/i;

function analyze(text, lang = "hi") {
  const flags = [];
  for (const r of rules) {
    const m = r.re.exec(text);
    if (!m) continue;
    const before = text.slice(Math.max(0, m.index - 25), m.index);
    if (NEGATION.test(before)) continue;
    // "guarantee nahi hoti" jaise baad wale inkaar (sirf nahi/not, "no" nahi: "guaranteed, no risk" scam hai)
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 16);
    if (/\b(nahi|nahin|not)\b|नहीं/i.test(after)) continue;
    flags.push({
      id: r.id, concept: r.concept, matchedText: m[0], weight: r.weight,
      why_hi: r.why_hi, why_en: r.why_en, actions: r.actions,
    });
  }

  const score = Math.min(100, flags.reduce((s, f) => s + f.weight, 0));
  const level = score >= 60 ? "high" : score >= 30 ? "medium" : "low";
  const confidence = flags.length >= 4 ? "high" : flags.length >= 2 ? "medium" : "low";

  const edu = EDU_SIGNS.test(text);
  const promo = PROMO_SIGNS.test(text) || flags.length >= 2;
  let label = "unclear";
  if (promo && (score >= 30 || !edu)) label = flags.length ? "promotion" : "unclear";
  if (edu && flags.length === 0) label = "education";

  const hi = lang !== "en";
  const uncertainty = {
    promotion: hi ? `हम पक्का नहीं कह सकते कि यह ठगी है, पर इसमें ${flags.length} खतरे के संकेत हैं और यह सलाह से ज़्यादा बेचने जैसा लगता है।` : `We can't be sure it's a scam, but ${flags.length} warning signs make it look more like selling than educating.`,
    education: hi ? "यह जानकारी देने वाला लगता है और कोई खतरे का संकेत नहीं मिला। फिर भी स्रोत खुद जाँचें।" : "This looks informational and no warning signs were found. Still verify the source.",
    unclear: hi ? "कोई साफ संकेत नहीं मिला। इसका मतलब यह नहीं कि यह सुरक्षित है। पैसा भेजने से पहले खुद जाँचें।" : "No clear signals found. That does not mean it's safe. Verify before sending money.",
  }[label];

  const actionIds = [...new Set(flags.flatMap((f) => f.actions))];
  if (score >= 30) actionIds.push("show_family");
  if (score >= 60 && !actionIds.includes("call_1930")) actionIds.push("call_1930");
  if (!actionIds.includes("verify_sebi")) actionIds.unshift("verify_sebi");

  return {
    risk: { score, level, confidence },
    flags,
    contentType: { label, uncertainty },
    concepts: [...new Set(flags.map((f) => f.concept))],
    actions: [...new Set(actionIds)],
  };
}

module.exports = { analyze };
