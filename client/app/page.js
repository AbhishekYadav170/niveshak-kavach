"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://niveshak-kavach.onrender.com";

const T = {
  hi: {
    title: "निवेशक कवच", sub: "कोई भी संदिग्ध निवेश संदेश यहाँ डालें। 10 सेकंड में जानें कि वह कितना खतरनाक है।",
    placeholder: "WhatsApp / Telegram का मैसेज यहाँ पेस्ट करें...", analyze: "जाँचें", checking: "जाँच हो रही है...",
    wake: "पहली बार में 30-50 सेकंड लग सकते हैं। कृपया रुकें।", sampleScam: "नकली मैसेज का उदाहरण", sampleSafe: "सही SEBI संदेश का उदाहरण",
    risk: "खतरा", high: "बहुत ज़्यादा खतरा", medium: "सावधान रहें", low: "कोई साफ खतरा नहीं मिला",
    why: "यह खतरनाक क्यों है?", noflags: "कोई खतरे का संकेत नहीं मिला।", type: "यह क्या है?",
    promotion: "प्रचार/बिक्री जैसा", education: "जानकारी जैसा", unclear: "साफ नहीं",
    learn: "समझिए", todo: "अब क्या करें?", share: "परिवार को भेजें", listen: "सुनें",
    sebiNote: "SEBI नंबर की जाँच सिर्फ फॉर्मेट देखती है। असली पुष्टि के लिए SEBI की वेबसाइट पर खुद जाँचें।",
    disclaimer: "यह निवेश सलाह नहीं है। यह सिर्फ जागरूकता के लिए है। आपका मैसेज कहीं सेव नहीं होता।",
    error: "कुछ गड़बड़ हुई। इंटरनेट देखें और दोबारा कोशिश करें.", tooShort: "कम से कम 5 अक्षर का मैसेज डालें।",
  },
  en: {
    title: "Niveshak Kavach", sub: "Paste any suspicious investment message. Know in 10 seconds how risky it is.",
    placeholder: "Paste the WhatsApp / Telegram message here...", analyze: "Check", checking: "Checking...",
    wake: "First request can take 30-50 seconds. Please wait.", sampleScam: "Sample scam message", sampleSafe: "Sample genuine SEBI message",
    risk: "Risk", high: "Very high risk", medium: "Be careful", low: "No clear risk found",
    why: "Why is this risky?", noflags: "No warning signs found.", type: "What is this?",
    promotion: "Looks like promotion", education: "Looks like information", unclear: "Unclear",
    learn: "Understand", todo: "What to do now?", share: "Send to family", listen: "Listen",
    sebiNote: "SEBI number check only looks at the format. Verify on SEBI's website yourself.",
    disclaimer: "This is not investment advice, only awareness. Your message is not stored anywhere.",
    error: "Something went wrong. Check your internet and try again.", tooShort: "Enter a message of at least 5 characters.",
  },
};

const SAMPLES = {
  scam: "SEBI registered expert! 100% guaranteed 40% return per month. Sirf aaj join karo Telegram group, APK install karo aur UPI pe 5000 bhejo.",
  safe: "SEBI Investor Awareness: Never share your OTP or PIN with anyone. Beware of guaranteed return schemes. Verify intermediaries on sebi.gov.in",
};

const COLORS = { high: "bg-red-600", medium: "bg-amber-500", low: "bg-green-600" };
const TEXTC = { high: "text-red-700", medium: "text-amber-700", low: "text-green-700" };

function speak(text, lang) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "hi" ? "hi-IN" : "en-IN";
  window.speechSynthesis.speak(u);
}

function Speak({ text, lang, label }) {
  return (
    <button onClick={() => speak(text, lang)} aria-label={label} className="ml-2 shrink-0 rounded-full bg-orange-100 px-3 py-1 text-base">
      🔊
    </button>
  );
}

export default function Home() {
  const [lang, setLang] = useState("hi");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [actions, setActions] = useState([]);
  const [open, setOpen] = useState(null);
  const t = T[lang];

  useEffect(() => {
    fetch(`${API}/api/concepts`).then((r) => r.json()).then(setConcepts).catch(() => {});
    fetch(`${API}/api/actions`).then((r) => r.json()).then(setActions).catch(() => {});
  }, []);

  async function analyze() {
    setErr(""); setOpen(null);
    if (text.trim().length < 5) { setErr(t.tooShort); return; }
    setLoading(true); setResult(null);
    try {
      const r = await fetch(`${API}/api/analyze`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      if (!r.ok) throw new Error("bad");
      setResult(await r.json());
    } catch (e) { setErr(t.error); }
    setLoading(false);
  }

  const L = (hi, en) => (lang === "hi" ? hi : en);
  const conceptList = result ? result.concepts.map((id) => concepts.find((c) => c.id === id)).filter(Boolean) : [];
  const actionList = result ? result.actions.map((id) => actions.find((a) => a.id === id)).filter(Boolean) : [];

  function shareText() {
    const lvl = t[result.risk.level];
    const top = result.flags.slice(0, 3).map((f) => "- " + L(f.why_hi, f.why_en)).join("\n");
    return `${t.title}\n${t.risk}: ${result.risk.score}/100 (${lvl})\n${top}\n${result.contentType.uncertainty}\n${t.disclaimer}`;
  }

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-900">🛡️ {t.title}</h1>
        <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} className="rounded-full border border-red-900 px-4 py-1 text-base font-semibold text-red-900">
          {lang === "hi" ? "English" : "हिन्दी"}
        </button>
      </div>
      <p className="mt-2 text-gray-700">{t.sub}</p>

      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} rows={6}
        className="mt-4 w-full rounded-xl border-2 border-orange-300 bg-white p-3 text-lg focus:border-red-800 focus:outline-none" />
      <div className="mt-2 flex flex-wrap gap-2 text-sm">
        <button onClick={() => setText(SAMPLES.scam)} className="rounded-full bg-orange-100 px-3 py-1">{t.sampleScam}</button>
        <button onClick={() => setText(SAMPLES.safe)} className="rounded-full bg-orange-100 px-3 py-1">{t.sampleSafe}</button>
      </div>
      <button onClick={analyze} disabled={loading} className="mt-4 w-full rounded-xl bg-red-800 py-4 text-xl font-bold text-white disabled:opacity-60">
        {loading ? t.checking : "🔍 " + t.analyze}
      </button>
      {loading && <p className="mt-2 text-sm text-gray-600">{t.wake}</p>}
      {err && <p className="mt-3 rounded-lg bg-red-100 p-3 text-red-800">{err}</p>}

      {result && (
        <section className="mt-6 space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm text-gray-500">{t.risk}</div>
                <div className={`text-5xl font-extrabold ${TEXTC[result.risk.level]}`}>{result.risk.score}<span className="text-xl">/100</span></div>
              </div>
              <div className={`text-lg font-bold ${TEXTC[result.risk.level]}`}>{t[result.risk.level]}</div>
            </div>
            <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div className={`h-full ${COLORS[result.risk.level]}`} style={{ width: `${result.risk.score}%` }} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow">
            <h2 className="mb-2 text-xl font-bold">🚩 {t.why}</h2>
            {result.flags.length === 0 && <p className="text-gray-600">{t.noflags}</p>}
            <ul className="space-y-3">
              {result.flags.map((f) => (
                <li key={f.id} className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-500">&ldquo;{f.matchedText}&rdquo;</div>
                    <div>{L(f.why_hi, f.why_en)}</div>
                  </div>
                  <Speak text={L(f.why_hi, f.why_en)} lang={lang} label={t.listen} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow">
            <h2 className="mb-1 text-xl font-bold">🏷️ {t.type}: {t[result.contentType.label]}</h2>
            <div className="flex items-start justify-between">
              <p className="text-gray-700">{result.contentType.uncertainty}</p>
              <Speak text={result.contentType.uncertainty} lang={lang} label={t.listen} />
            </div>
            {result.sebiCheck.numbers.length > 0 && <p className="mt-2 text-sm text-gray-600">{t.sebiNote}</p>}
          </div>

          {conceptList.length > 0 && (
            <div className="rounded-2xl bg-white p-4 shadow">
              <h2 className="mb-2 text-xl font-bold">📘 {t.learn}</h2>
              <div className="space-y-2">
                {conceptList.map((c) => (
                  <div key={c.id} className="rounded-xl border border-orange-200">
                    <button onClick={() => setOpen(open === c.id ? null : c.id)} className="w-full p-3 text-left font-semibold">
                      {L(c.title_hi, c.title_en)}
                    </button>
                    {open === c.id && (
                      <div className="border-t border-orange-200 p-3">
                        <div className="flex items-start justify-between">
                          <p>{L(c.explain_hi, c.explain_en)}</p>
                          <Speak text={L(c.explain_hi + " " + c.example_hi, c.explain_en)} lang={lang} label={t.listen} />
                        </div>
                        {lang === "hi" && <p className="mt-2 rounded-lg bg-orange-50 p-2 text-gray-700">💡 {c.example_hi}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white p-4 shadow">
            <h2 className="mb-2 text-xl font-bold">✅ {t.todo}</h2>
            <ul className="space-y-3">
              {actionList.map((a) => (
                <li key={a.id}>
                  <div className="font-semibold">{L(a.title_hi, a.title_en)}</div>
                  <div className="text-gray-700">{a.detail_hi}</div>
                  {a.link && <a href={a.link} target="_blank" rel="noreferrer" className="text-blue-700 underline">{a.link.replace("https://", "")}</a>}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gray-600">📞 1930 (Cyber Crime Helpline)</p>
          </div>

          <a href={`https://wa.me/?text=${encodeURIComponent(shareText())}`} target="_blank" rel="noreferrer"
            className="block rounded-xl bg-green-600 py-3 text-center text-lg font-bold text-white">
            📲 {t.share}
          </a>
          <p className="text-center text-sm text-gray-500">{t.disclaimer}</p>
        </section>
      )}
    </main>
  );
}
