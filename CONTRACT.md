<!-- # /api/analyze JSON contract (teeno ke liye LOCKED)

## Request
POST /api/analyze
{ "text": "message yahan", "lang": "hi" | "en" }

## Response 200
{
  "risk": { "score": 0-100, "level": "low|medium|high", "confidence": "low|medium|high" },
  "flags": [ { "id": "guaranteed_return", "matchedText": "100% guaranteed", "weight": 25, "why_hi": "..." } ],
  "contentType": { "label": "promotion|education|unclear", "uncertainty": "honest line" },
  "concepts": ["guaranteed_return", "apk_fraud"],     // concepts.json ke ids
  "actions": ["verify_sebi", "dont_send_money", "call_1930"], // actions.json ke ids
  "sebiCheck": { "numbers": [], "claimsSebiWithoutNumber": false, "verifyLink": "..." },
  "disclaimer": true,
  "stored": false
}

## Errors
400 { "error": "invalid_input", "message_hi": "..." }
429 { "error": "too_many_requests", "message_hi": "..." }
500 { "error": "server_error", "message_hi": "..." }

## Rule: id naam teeno jagah same (rules.json / concepts.json / actions.json) -->








<!-- 

# /api/analyze JSON contract (LOCKED)

POST /api/analyze   { "text": "...", "lang": "hi" | "en" }

200 response:
{
  "risk": { "score": 0-100, "level": "low|medium|high", "confidence": "low|medium|high" },
  "flags": [ { "id", "concept", "matchedText", "weight", "why_hi", "why_en", "actions": [] } ],
  "contentType": { "label": "promotion|education|unclear", "uncertainty": "honest line (lang ke hisaab se)" },
  "concepts": ["guaranteed_return", ...],   // GET /api/concepts ke id
  "actions": ["verify_sebi", ...],          // GET /api/actions ke id
  "sebiCheck": { "numbers": [], "claimsSebiWithoutNumber": false, "verifyLink": "..." },
  "disclaimer": true,
  "stored": false
}

GET /api/concepts -> [ { id, title_hi, title_en, explain_hi, example_hi, explain_en } ]
GET /api/actions  -> [ { id, title_hi, title_en, detail_hi, link? } ]
GET /api/health

Errors: 400 invalid_input / too_long, 429 too_many_requests, 500 server_error (message_hi saath me) -->





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
