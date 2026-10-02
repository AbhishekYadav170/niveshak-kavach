# Niveshak Kavach Server (Person 2)

## Local
npm install
cp .env.example .env
npm run dev
curl -X POST localhost:5000/api/analyze -H "Content-Type: application/json" \
  -d '{"text":"100% guaranteed return, sirf aaj join karo, APK install karo","lang":"hi"}'

## Render deploy
1. Repo GitHub pe push karo
2. Render > New > Web Service > repo select
3. Build: npm install   Start: npm start
4. Env var: ALLOWED_ORIGINS = <vercel frontend url>,http://localhost:3000
5. Deploy ke baad /api/health check karo

## Privacy rules
- Request body kabhi log/store nahi (morgan jaisa logger body ke saath mat lagana)
- DB/login nahi
