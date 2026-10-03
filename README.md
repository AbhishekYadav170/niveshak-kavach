# Niveshak Kavach (निवेशक कवच)

**SANGYAN Investor Resilience Hackathon** (SEBI x NSDL x SNTC, IIT BHU) | Tracks A + E + C

Paste, speak or screenshot a suspicious investment message and learn in 10 seconds how risky it is, why, and what to do next. Hindi-first, voice-enabled, nothing stored.

- **Live demo:** https://niveshak-kavach-app.vercel.app
- **API:** https://niveshak-kavach.onrender.com (free tier, first request can take 30-50 seconds to wake up)

## The problem
India's retail investor base is growing fastest outside the metros, but access has outrun confidence. First-time investors, especially senior citizens, are targeted with fake "SEBI registered" claims, guaranteed-return promises, Telegram/WhatsApp tip groups and APK links. They usually realise only when withdrawals stop.

## What it does
One journey in four steps:

| Step | Track | What the user gets |
|---|---|---|
| Jaanch | A (fraud) | 0-100 risk meter with named red flags |
| Parakh | E (misinformation) | "Promotion or education?" label with honest uncertainty, never a bare true/false |
| Samjho | C (education) | 15 plain-Hindi explainers with voice |
| Bachao | B (light) | Verify on SEBI, SCORES, call 1930, send result to family |

Also: scam journey map (5 stages: bait, trust, money, trap, withdrawal block), voice input, screenshot OCR, "pause before you pay" checklist, listen-to-full-result, large-text toggle, installable PWA, Hindi/English toggle.

## Guardrails
- No stock tips, buy/sell signals or broker promotion. No monetisation.
- No database, no login. Messages are analysed and discarded (API returns `stored: false`). Request bodies are never logged.
- OCR and voice run in the browser; screenshots never reach the server.
- No SMS/OTP access.
- Results state uncertainty. A low score never means "safe".

## How it works
```
Input (text / voice / screenshot OCR in browser)
        |
POST /api/analyze  ->  rule engine (25 weighted patterns, Hindi + Hinglish + English)
        |                  + SEBI registration number format check
        |                  + promotion / education / unclear tag with uncertainty line
        |                  + scam journey stage
        v
Result JSON -> meter, flags (with voice), journey, explainers, actions
```
The rule engine is deliberately explainable: every point of the score maps to a named red flag in `data/rules.json`. The API contract is in `CONTRACT.md`.

## Repo layout
```
server.js              Express app (helmet, CORS, rate limit, no body logging)
routes/                /api/analyze, /api/concepts, /api/actions
services/              analyzeService.js (engine + SEBI check + journey), sebiFormat.js
engine/index.js        rule engine
data/                  rules.json, concepts.json, actions.json, journey.json
test.js                7 smoke-test messages
evaluate.js            30-message internal sanity test
client/                Next.js + Tailwind frontend (PWA)
```

## Run locally
Backend:
```bash
npm install
cp .env.example .env      # PORT=5000, ALLOWED_ORIGINS=http://localhost:3000
npm run dev
```
Frontend:
```bash
cd client
npm install
npm run dev               # http://localhost:3000, uses the live API by default
```
To use a local backend, create `client/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000`.

## Tests
```bash
node test.js        # smoke test
node evaluate.js    # 30 hand-written messages: 13/16 scam-style flagged, 0/14 genuine flagged
```
`evaluate.js` is an internal sanity check on messages we wrote ourselves. It is not a claim of real-world accuracy. Known misses: reversed phrasing ("महीने के 40% रिटर्न"), a blunt negation guard, and soft pitches without strong signals.

## Tech
Next.js 14, Tailwind CSS, Express, Tesseract.js (on-device OCR), Web Speech API (voice in/out). Hosted on Vercel (frontend) and Render (backend).

## Limitations
- The SEBI registration check is format-only. It does not confirm the registry; the app links users to SEBI to verify.
- Rules can miss new scam wording.
- Hindi OCR needs a clear screenshot.
- Hindi and English only for now.

## Roadmap
Bhashini for more Indian languages, IVR/missed-call verification for feature-phone users, a WhatsApp bot, official SEBI intermediary lookup, community fraud reporting.

## Team
Team Niveshak Kavach