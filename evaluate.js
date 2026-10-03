// Internal sanity test: 30 hand-written messages. Scam hone ka matlab: score >= 30.
// NOTE: ye hamara apna likha hua set hai, rules isi tarah ke udaharno se banaye gaye hain. Real-world accuracy nahi.
const { analyzeText } = require("./services/analyzeService");

const SCAM = [
  "Guaranteed 50% profit every month. Join our Telegram group t.me/xyz. Pay Rs 10000 on UPI today.",
  "सेबी रजिस्टर्ड एक्सपर्ट से जुड़ें। रोज़ कमाओ, पक्का मुनाफा, आज ही जॉइन करो।",
  "Bhai insider tip hai, kal upper circuit lagega. VIP group me aao, sureshot calls milengi.",
  "IPO ka guaranteed allotment chahiye? Registration fee 3000 bhejo, pakka allotment.",
  "Dear customer your demat account will be blocked. Update KYC now http://bit.ly/kyc123",
  "Aapka trading profit 3 lakh ho gaya. Withdraw karne ke liye pehle 15% tax jama karo.",
  "Install AnyDesk and share the code so our expert can set up your trading account.",
  "Send OTP to activate your bonus. Last chance, only today!",
  "Ambani ji ne video me bataya ye app 2x return deta hai. Abhi invest karo.",
  "Crypto trading signals, USDT daily profit, refer and earn bonus. Ghar baithe kamao.",
  "Apne doobe hue paise wapas chahiye? Fund recovery agent se contact karo, fee jama karo.",
  "Make your money double in 30 days. Zero risk, 100% safe returns. WhatsApp group join karo.",
  "Download this APK to trade at lower brokerage: trade-pro.apk. Deposit via PhonePe to our account number.",
  "निवेश करो, महीने के 40% रिटर्न, किसी को मत बताना, सिर्फ आज बचे हैं कुछ सीट",
  "Hello sir, I am a SEBI registered advisor. My clients earned big profits last month. Message me for the next multibagger stock.",
  "Join my premium calls, 90% accuracy, DM me for details.",
];
const SAFE = [
  "SEBI Investor Awareness: Never share your OTP or PIN with anyone. Beware of guaranteed return schemes.",
  "निवेशक जागरूकता: सावधान रहें। गारंटीड रिटर्न का वादा करने वालों से बचें। sebi.gov.in पर जाँचें।",
  "Mutual fund SIP me 500 rupaye se shuru kar sakte hain. Returns market par depend karte hain, guarantee nahi hoti.",
  "Your OTP is 482913. Do not share it with anyone. - HDFC Bank",
  "Bhai kal shaam ko chai pe milte hain, mutual fund ke baare me samjhana.",
  "Your SIP of Rs 1000 for Flexi Cap fund has been processed on 05-Oct. Units allotted at NAV 78.12.",
  "Contract note for your trade on NSE dated 03-Oct has been sent to your registered email.",
  "RBI warns: no bank will ask for your PIN or OTP over phone. Report fraud on cybercrime.gov.in or call 1930.",
  "IPO opens on Monday. Read the red herring prospectus on sebi.gov.in before applying. Allotment is by lottery.",
  "Dividend of Rs 5 per share credited to your bank account ending 4417.",
  "Papa, mutual fund ka form bhar diya, nominee me mummy ka naam daal diya hai.",
  "Market aaj 300 points gira. Ghabraiye mat, long term ke liye SIP jaari rakhein. Ye salah nahi, jaankari hai.",
  "To update your nominee, log in to your broker's official app. We never ask for OTP or send links on WhatsApp.",
  "Zerodha Kite: Your order to buy 10 shares has been executed. Brokerage Rs 20 will be charged.",
];

(async () => {
  let tp = 0, fn = 0, fp = 0, tn = 0; const misses = [], falseAlarms = [];
  for (const t of SCAM) { const r = await analyzeText(t, "hi"); if (r.risk.score >= 30) tp++; else { fn++; misses.push([r.risk.score, t]); } }
  for (const t of SAFE) { const r = await analyzeText(t, "hi"); if (r.risk.score >= 30) { fp++; falseAlarms.push([r.risk.score, t]); } else tn++; }
  console.log(`scam: ${SCAM.length}  caught: ${tp}  missed: ${fn}`);
  console.log(`genuine: ${SAFE.length}  correctly low: ${tn}  false alarms: ${fp}`);
  console.log("MISSED:", misses); console.log("FALSE ALARMS:", falseAlarms);
})();