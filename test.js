const { analyzeText } = require("./services/analyzeService");
const cases = [
 ["SCAM-1 hinglish", "SEBI registered expert! 100% guaranteed 40% return per month, sirf aaj join karo Telegram group, APK install karo, UPI pe 5000 bhejo"],
 ["SCAM-2 hindi", "सेबी रजिस्टर्ड INH12345678 एक्सपर्ट। पक्का मुनाफा, आज ही जॉइन करो, किसी को मत बताना, OTP बताओ"],
 ["SCAM-3 withdrawal", "Aapka profit 2 lakh ho gaya. Withdraw karne ke liye 20% tax jama karo."],
 ["SCAM-4 kyc", "Dear user your demat account will be blocked. KYC update now: bit.ly/xyz"],
 ["SAFE-1 awareness", "SEBI Investor Awareness: Never share your OTP or PIN with anyone. Beware of guaranteed return schemes. Verify intermediaries on sebi.gov.in"],
 ["SAFE-2 hindi awareness", "निवेशक जागरूकता: सावधान रहें। कभी न बताएं अपना OTP। गारंटीड रिटर्न का वादा करने वालों से बचें। sebi.gov.in पर जाँचें।"],
 ["NORMAL", "Bhai kal shaam ko chai pe milte hain, mutual fund ke baare me samjhana."],
];
(async () => {
  for (const [name, t] of cases) {
    const r = await analyzeText(t, "hi");
    console.log(`${name.padEnd(22)} score=${String(r.risk.score).padStart(3)} ${r.risk.level.padEnd(6)} tag=${r.contentType.label.padEnd(9)} flags=[${r.flags.map(f=>f.id).join(",")}]`);
  }
})();
