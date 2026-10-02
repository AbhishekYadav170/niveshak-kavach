# /api/analyze JSON contract (teeno ke liye LOCKED)

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

## Rule: id naam teeno jagah same (rules.json / concepts.json / actions.json)
