// SIRF FORMAT CHECK. Ye registry confirmation NAHI hai.
// SEBI registration number: 3 letters (category) + 9 digits. Jaise INZ000012345
const CATEGORY = {
  INZ: "Stock broker",
  INH: "Research analyst",
  INA: "Investment adviser",
  INP: "Portfolio manager",
  INM: "Merchant banker",
  INB: "Stock broker (exchange)",
  INF: "Mutual fund related",
};

const PATTERN = /\bIN[A-Z]\s?-?\d{9}\b/gi;
const OFFICIAL_LINK = "https://www.sebi.gov.in";

function checkSebiNumbers(text) {
  const found = [];
  const matches = text.match(PATTERN) || [];
  for (const raw of matches) {
    const clean = raw.replace(/[\s-]/g, "").toUpperCase();
    const prefix = clean.slice(0, 3);
    found.push({
      number: clean,
      formatValid: Boolean(CATEGORY[prefix]),
      category: CATEGORY[prefix] || null,
      note_hi: "Ye sirf format check hai. Asli registration SEBI ki official website pe khud verify karein.",
    });
  }
  const claimsSebi = /sebi\s*(registered|approved|certified|regd)/i.test(text);
  return { numbers: found, claimsSebiWithoutNumber: claimsSebi && found.length === 0, verifyLink: OFFICIAL_LINK };
}

module.exports = { checkSebiNumbers };
