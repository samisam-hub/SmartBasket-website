/* Inline-Anmeldung zur Android-Beta: prüft Eingaben, sendet an /api/beta-signup,
   zeigt Lade-, Erfolgs- und Fehlerzustand. Bei Störungen bleibt das Google-Formular als Ausweg. */
(function () {
  var form = document.getElementById('beta-anmeldung');
  if (!form) return;
  var FALLBACK = 'https://forms.gle/D3PrMx7ugt5bA5MHA';
  var email = form.querySelector('#beta-email');
  var consent = form.querySelector('input[name="consent"]');
  var hp = form.querySelector('#beta-website');
  var btn = form.querySelector('button[type="submit"]');
  var status = form.querySelector('#beta-status');
  var RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/;

  function say(text, kind, withFallback) {
    status.textContent = text;
    status.className = 'b2c-status' + (kind ? ' is-' + kind : '');
    if (withFallback) {
      status.appendChild(document.createTextNode(' '));
      var a = document.createElement('a');
      a.href = FALLBACK; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = 'Zum Google-Formular';
      status.appendChild(a);
    }
  }
  function invalid(el, on) { el.setAttribute('aria-invalid', on ? 'true' : 'false'); }

  // Sprunglinks auf das Formular setzen den Fokus ins E-Mail-Feld
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#beta-anmeldung"]');
    if (a) setTimeout(function () { email.focus({ preventScroll: true }); }, 450);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = email.value.trim();
    invalid(email, false); invalid(consent, false);
    if (!RE.test(value)) { invalid(email, true); say('Bitte gib eine gültige E-Mail-Adresse ein.', 'error'); email.focus(); return; }
    if (!consent.checked) { invalid(consent, true); say('Bitte bestätige die Einwilligung, damit wir dich einladen können.', 'error'); consent.focus(); return; }

    btn.disabled = true; form.setAttribute('aria-busy', 'true');
    var label = btn.textContent; btn.textContent = 'Wird gesendet …';
    say('', '');
    fetch('/api/beta-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: value, consent: true, website: hp ? hp.value : '' })
    }).then(function (r) {
      if (r.ok) {
        form.reset();
        say('Danke! Wir nehmen dich in die Testliste auf und schicken dir den Google-Play-Link per E-Mail.', 'ok');
        return;
      }
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (d && d.error === 'invalid_email') { invalid(email, true); say('Bitte gib eine gültige E-Mail-Adresse ein.', 'error'); }
        else if (d && d.error === 'consent_required') { invalid(consent, true); say('Bitte bestätige die Einwilligung.', 'error'); }
        else say('Die Anmeldung hat gerade nicht geklappt. Bitte versuch es später noch einmal oder nutze das Google-Formular.', 'error', true);
      });
    }).catch(function () {
      say('Keine Verbindung. Bitte versuch es später noch einmal oder nutze das Google-Formular.', 'error', true);
    }).then(function () {
      btn.disabled = false; form.removeAttribute('aria-busy'); btn.textContent = label;
    });
  });
})();
