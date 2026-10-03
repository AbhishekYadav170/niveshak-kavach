# /api/analyze JSON contract (LOCKED)

POST /api/analyze   { "text": "...", "lang": "hi" | "en" }

200 response:
{
  "risk": { "score": 0-100, "level": "low|medium|high", "confidence": "low|medium|high" },
  "flags": [ { "id", "concept", "matchedText", "weight", "why_hi", "why_en", "actions": [] } ],
  "contentType": { "label": "promotion|education|unclear", "uncertainty": "honest line (lang ke hisaab se)" },
  "concepts": ["guaranteed_return", ...],   // GET /api/concepts ke id
  "actions": ["verify_sebi", ...],          // GET /api/actions ke id
  "journey": null | { "current": 1-5, "stages": [{ "id", "name_hi", "name_en", "hit" }], "now_hi", "now_en", "next_hi", "next_en" },
  "sebiCheck": { "numbers": [], "claimsSebiWithoutNumber": false, "verifyLink": "..." },
  "disclaimer": true,
  "stored": false
}

GET /api/concepts -> [ { id, title_hi, title_en, explain_hi, example_hi, explain_en } ]
GET /api/actions  -> [ { id, title_hi, title_en, detail_hi, link? } ]
GET /api/health

Errors: 400 invalid_input / too_long, 429 too_many_requests, 500 server_error (message_hi saath me)
