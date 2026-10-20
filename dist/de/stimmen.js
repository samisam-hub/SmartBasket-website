/* Stimmen aus der Beta: liest testimonials.json und zeigt den Abschnitt nur,
   wenn es freigegebene Einträge gibt (consent === true). Texte werden als Text gesetzt, nie als HTML. */
(function () {
  var section = document.getElementById('stimmen');
  var list = document.getElementById('b2c-quotes');
  if (!section || !list || !window.fetch) return;
  fetch('testimonials.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : { items: [] }; })
    .then(function (data) {
      var items = (data && data.items || []).filter(function (t) {
        return t && t.consent === true && typeof t.quote === 'string' && t.quote.trim() && typeof t.name === 'string' && t.name.trim();
      }).slice(0, 6);
      if (!items.length) return;
      items.forEach(function (t) {
        var li = document.createElement('li');
        var q = document.createElement('blockquote'); q.textContent = '„' + t.quote.trim() + '“';
        var c = document.createElement('p'); c.className = 'b2c-quote-by';
        c.textContent = t.name.trim() + (t.context ? ' · ' + String(t.context).trim() : '');
        li.appendChild(q); li.appendChild(c); list.appendChild(li);
      });
      section.hidden = false;
    })
    .catch(function () { /* ohne Daten bleibt der Abschnitt verborgen */ });
})();
