// Vercel-Function: speichert Beta-Anmeldungen in Supabase.
// Benötigte Umgebungsvariablen in Vercel: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optional (nur für Tests): BETA_EXTRA_ORIGINS, kommagetrennt
// Antwortet absichtlich gleich für neue und bereits bekannte Adressen (keine Auskunft, wer angemeldet ist).
const CONSENT_TEXT = 'Ich bin einverstanden, dass SmartBasket meine E-Mail-Adresse speichert, um mich zum Android-Test einzuladen.';
const ALLOWED_ORIGINS = ['https://smartbasket.samisam.org'];
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 2048) throw new Error('too_large'); }
  return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { error: 'method_not_allowed' }); }
  const origin = req.headers.origin || '';
  const previewOk = /^https:\/\/smart-basket-website-[a-z0-9-]+\.vercel\.app$/.test(origin);
  const extra = (process.env.BETA_EXTRA_ORIGINS || '').split(',').map(function (o) { return o.trim(); }).filter(Boolean);
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !extra.includes(origin) && !previewOk) return send(res, 403, { error: 'forbidden' });

  let body;
  try { body = await readJson(req); } catch (e) { return send(res, 400, { error: 'invalid_body' }); }

  // Honeypot: echte Menschen füllen dieses versteckte Feld nicht aus.
  if (body.website) return send(res, 200, { ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return send(res, 422, { error: 'invalid_email' });
  if (body.consent !== true) return send(res, 422, { error: 'consent_required' });

  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return send(res, 503, { error: 'not_configured' });

  try {
    const r = await fetch(url.replace(/\/$/, '') + '/rest/v1/beta_signups?on_conflict=email', {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ email, consent_text: CONSENT_TEXT, source: 'website-de' })
    });
    if (!r.ok) return send(res, 502, { error: 'storage_failed' });
    return send(res, 201, { ok: true });
  } catch (e) {
    return send(res, 502, { error: 'storage_failed' });
  }
};
module.exports.CONSENT_TEXT = CONSENT_TEXT;
