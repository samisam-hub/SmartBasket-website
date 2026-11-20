/* Wochenplan als PDF: baut aus dem Plan im App-Entwurf ein gestaltetes PDF (Wochenplan, Einkaufsliste, Gerichte).
   jsPDF und die Schriften werden erst beim Klick geladen, damit die Startseite schlank bleibt.
   CSP-konform: nur Dateien vom eigenen Server, keine Inline-Skripte. */
(function () {
  var btn = document.getElementById('app-entwurf-pdf');
  var status = document.getElementById('app-entwurf-pdf-status');
  if (!btn) return;

  // Pfade relativ zu dieser Datei auflösen, damit es auch eingebettet (z. B. im WordPress-Plugin) funktioniert
  var self = document.currentScript && document.currentScript.src;
  function url(rel) { return new URL(rel, self || document.baseURI).href; }
  var FONTS = [
    ['Inter', 'normal', '../assets/fonts/pdf/inter-latin-400-normal.ttf'],
    ['Inter', 'semibold', '../assets/fonts/pdf/inter-latin-600-normal.ttf'],
    ['Inter', 'bold', '../assets/fonts/pdf/inter-latin-700-normal.ttf'],
    ['Playfair', 'bold', '../assets/fonts/pdf/playfair-display-latin-700-normal.ttf']
  ];

  var C = {
    green: [15, 107, 63], deep: [11, 61, 42], accent: [217, 105, 42], ivory: [250, 247, 242],
    tint: [238, 245, 240], line: [213, 229, 218], text: [17, 24, 39], muted: [95, 102, 112], white: [255, 255, 255]
  };

  var libPromise = null;
  function loadJsPDF() {
    if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = url('vendor/jspdf.umd.min.js');
      s.onload = function () { window.jspdf ? resolve(window.jspdf.jsPDF) : reject(new Error('jsPDF fehlt')); };
      s.onerror = function () { libPromise = null; reject(new Error('jsPDF konnte nicht geladen werden')); };
      document.head.appendChild(s);
    });
    return libPromise;
  }
  function toBase64(buf) {
    var bytes = new Uint8Array(buf), bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  }
  var fontData = null;
  function loadFonts() {
    if (fontData) return Promise.resolve(fontData);
    return Promise.all(FONTS.map(function (f) {
      return fetch(url(f[2])).then(function (r) { if (!r.ok) throw new Error('Schrift fehlt'); return r.arrayBuffer(); })
        .then(function (b) { return { name: f[0], style: f[1], file: f[2].split('/').pop(), data: toBase64(b) }; });
    })).then(function (list) { fontData = list; return list; });
  }

  // ---------- Daten aus dem App-Entwurf ----------
  function collect() {
    var LIB = window.SB_APP_LIB, store = window.SB_APP_STORE;
    var data = store.data;
    if (!data.generated || !Object.keys(data.plan || {}).length) {
      // Noch kein Plan: automatisch erstellen, so wie es der Entwurf auch tun würde
      store.set({ plan: LIB.generate(), generated: true });
      data = store.data;
    }
    var days = LIB.selectedDays();
    var usedSlots = LIB.SLOTS.filter(function (s) {
      return days.some(function (d) { return data.plan[d] && data.plan[d][s.id]; });
    });
    var e = LIB.eaters(), who = [];
    if (e.adults) who.push(e.adults + (e.adults === 1 ? ' erwachsene Person' : ' Erwachsene'));
    if (e.kids) who.push(e.kids + (e.kids === 1 ? ' Kind' : ' Kinder'));
    var avoids = LIB.AVOIDS.filter(function (a) { return data.avoids.indexOf(a.id) >= 0; }).map(function (a) { return a.label; });
    // Gerichte der Woche mit Mengen pro Mahlzeit für den ganzen Haushalt
    var dishes = {}, order = [];
    days.forEach(function (d) {
      usedSlots.forEach(function (s) {
        var en = data.plan[d] && data.plan[d][s.id];
        if (!en || en.kind !== 'cook') return;
        if (!dishes[en.dish]) { dishes[en.dish] = { id: en.dish, when: [] }; order.push(en.dish); }
        dishes[en.dish].when.push(LIB.SHORT[d] + ' ' + s.short);
      });
    });
    var fmt = function (q, unit) {
      if (unit === 'g') { var g = Math.ceil(q / 10) * 10; return g >= 1000 ? (g / 1000).toString().replace('.', ',') + ' kg' : g + ' g'; }
      var r = Math.round(q * 2) / 2; return r.toString().replace('.', ',') + ' ' + unit;
    };
    return {
      days: days, slots: usedSlots, plan: data.plan, lib: LIB,
      who: who.join(' und ') || '1 Person', budget: data.budget, avoids: avoids,
      basket: LIB.basket(),
      dishes: order.map(function (id) {
        var d = LIB.DISHES[id];
        return { name: d.name, parts: d.parts, when: dishes[id].when,
          ing: d.ing.map(function (i) { return [fmt(i[1] * e.factor, i[2]), i[0]]; }) };
      })
    };
  }

  // ---------- PDF zeichnen ----------
  function build(jsPDF, fonts, P) {
    var doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4', compress: true });
    fonts.forEach(function (f) { doc.addFileToVFS(f.file, f.data); doc.addFont(f.file, f.name, f.style); });
    doc.setProperties({ title: 'Mein Meal Prep Wochenplan', subject: 'Wochenplan und Einkaufsliste', author: 'SmartBasket · meal-prep.tech', creator: 'meal-prep.tech' });

    var page = 0;
    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function font(name, style, size) { doc.setFont(name, style); doc.setFontSize(size); }
    function bg() { var w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight(); fill(C.ivory); doc.rect(0, 0, w, h, 'F'); return [w, h]; }
    function footer() {
      page++;
      var w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight();
      font('Inter', 'normal', 9); color(C.muted);
      doc.text('Erstellt mit SmartBasket · meal-prep.tech', 36, h - 20);
      doc.text('Seite ' + page, w - 36, h - 20, { align: 'right' });
    }
    // Zeilenumbruch an Leerzeichen und – wenn nötig – nach Bindestrichen („Tomaten-|Thunfisch-Soße“)
    function wrapWords(text, maxW) {
      var tokens = [];
      text.split(/\s+/).forEach(function (w, wi) {
        var parts = doc.getTextWidth(w) > maxW ? w.split(/(?<=-)/) : [w];
        parts.forEach(function (p, pi) { tokens.push({ t: p, space: wi > 0 && pi === 0 }); });
      });
      var lines = [], cur = '';
      tokens.forEach(function (tk) {
        var next = cur ? cur + (tk.space ? ' ' : '') + tk.t : tk.t;
        if (cur && doc.getTextWidth(next) > maxW) { lines.push(cur); cur = tk.t; } else cur = next;
      });
      if (cur) lines.push(cur);
      return lines;
    }
    function checkbox(x, y) { stroke(C.green); doc.setLineWidth(0.8); doc.roundedRect(x, y - 7.5, 8, 8, 1.5, 1.5, 'S'); }

    // Seite 1: Wochenplan (Querformat)
    var wh = bg(), W = wh[0], H = wh[1];
    fill(C.accent); doc.rect(36, 26, 28, 2.5, 'F');
    font('Playfair', 'bold', 30); color(C.deep); doc.text('Mein Meal Prep Wochenplan', 36, 58);
    var meta = 'für ' + P.who + '  ·  Budget ' + P.budget + (P.avoids.length ? '  ·  ohne ' + P.avoids.join(', ') : '');
    font('Inter', 'normal', 13); color(C.muted); doc.text(meta, 36, 80);
    font('Inter', 'normal', 11.5); color(C.text);
    doc.text('Woche vom ____________ bis ____________', W - 36, 56, { align: 'right' });
    doc.text('Vorkochen am: ____________', W - 36, 76, { align: 'right' });

    var left = 36, top = 100, bottom = 96, labelW = 92;
    var cols = P.days.length, colW = (W - 2 * left - labelW) / cols;
    var headH = 28, rows = P.slots.length || 1, rowH = Math.min(130, (H - top - bottom - headH) / rows);
    P.days.forEach(function (d, i) {
      var x = left + labelW + i * colW;
      fill(d < 5 ? C.green : C.deep); doc.rect(x + 1, top, colW - 2, headH, 'F');
      font('Playfair', 'bold', 13); color(C.white); doc.text(P.lib.DAY_NAMES[d], x + colW / 2, top + 18.5, { align: 'center' });
    });
    P.slots.forEach(function (s, r) {
      var y0 = top + headH + r * rowH;
      fill(r % 2 ? C.white : C.tint); doc.rect(left, y0, W - 2 * left, rowH, 'F');
      font('Playfair', 'bold', 13); color(C.deep); doc.text(s.label, left + 10, y0 + rowH / 2 + 4);
      P.days.forEach(function (d, i) {
        var x = left + labelW + i * colW;
        stroke(C.line); doc.setLineWidth(0.6); doc.rect(x, y0, colW, rowH, 'S');
        var en = P.plan[d] && P.plan[d][s.id];
        var txt = P.lib.entryText(en), cook = en && en.kind === 'cook';
        var size = cook ? 12 : 11.5, maxW = colW - 16;
        font('Inter', cook ? 'semibold' : 'normal', size); color(cook ? C.text : C.muted);
        var lines = wrapWords(txt, maxW);
        // Passt ein Wortteil trotzdem nicht (sehr schmale Spalten), Schrift etwas verkleinern
        var widest = lines.reduce(function (m, l) { return Math.max(m, doc.getTextWidth(l)); }, 0);
        if (widest > maxW) { size = Math.max(9, size * maxW / widest); doc.setFontSize(size); lines = wrapWords(txt, maxW); }
        lines = lines.slice(0, Math.max(1, Math.floor((rowH - 16) / (size * 1.3))));
        doc.text(lines, x + 8, y0 + 22, { lineHeightFactor: 1.3 });
      });
    });
    stroke(C.line); doc.rect(left, top, W - 2 * left, headH + rows * rowH, 'S');
    var ty = top + headH + rows * rowH + 26;
    font('Playfair', 'bold', 13); color(C.deep); doc.text('Notizen', 36, ty);
    stroke([201, 214, 205]); doc.setLineWidth(0.5);
    for (var n = 0; n < 2 && ty + 20 + n * 20 < H - 34; n++) doc.line(36, ty + 18 + n * 20, W - 36, ty + 18 + n * 20);
    footer();

    // Seite 2: Einkaufsliste (Hochformat)
    doc.addPage('a4', 'portrait');
    wh = bg(); W = wh[0]; H = wh[1];
    fill(C.accent); doc.rect(48, 34, 28, 2.5, 'F');
    font('Playfair', 'bold', 30); color(C.deep); doc.text('Einkaufsliste', 48, 68);
    font('Inter', 'normal', 12.5); color(C.muted);
    doc.text('Mengen für ' + P.who + ', aufgerundet und über die Woche zusammengefasst.', 48, 88);
    var items = P.basket.items, colX = [48, W / 2 + 6], colWidth = W / 2 - 54;
    var y = 124, col = 0, startY = 124, lineH = 36;
    var perCol = Math.floor((H - startY - 60) / lineH);
    items.forEach(function (it, i) {
      if (i && i % perCol === 0) {
        col++; y = startY;
        if (col > 1) { footer(); doc.addPage('a4', 'portrait'); bg(); col = 0; y = startY = 64; perCol = Math.floor((H - startY - 60) / lineH); }
      }
      var x = colX[col];
      checkbox(x, y);
      font('Inter', 'bold', 12); color(C.text);
      var qtyW = 84; doc.text(it.qty, x + 18, y);
      font('Inter', 'normal', 12); doc.text(doc.splitTextToSize(it.name, colWidth - qtyW - 22)[0], x + 18 + qtyW, y);
      font('Inter', 'normal', 9.5); color(C.muted); doc.text(doc.splitTextToSize('für ' + it.for, colWidth - qtyW - 22)[0], x + 18 + qtyW, y + 13);
      stroke(C.line); doc.setLineWidth(0.4); doc.line(x, y + 22, x + colWidth, y + 22);
      y += lineH;
    });
    if (!items.length) { font('Inter', 'normal', 11); color(C.muted); doc.text('Noch keine Gerichte zum Kochen im Plan.', 48, y); }
    if (P.basket.ready) {
      var ny = Math.min(H - 70, startY + Math.min(items.length, perCol) * lineH + 10);
      font('Inter', 'normal', 11); color(C.muted);
      doc.text(P.basket.ready + (P.basket.ready === 1 ? ' Mahlzeit wird' : ' Mahlzeiten werden') + ' aufgewärmt – dafür brauchst du nichts extra einzukaufen.', 48, ny);
    }
    footer();

    // Seite 3: Gerichte der Woche
    if (P.dishes.length) {
      doc.addPage('a4', 'portrait');
      wh = bg(); W = wh[0]; H = wh[1];
      fill(C.accent); doc.rect(48, 34, 28, 2.5, 'F');
      font('Playfair', 'bold', 30); color(C.deep); doc.text('Gerichte dieser Woche', 48, 68);
      font('Inter', 'normal', 12.5); color(C.muted); doc.text('Zutaten pro Mahlzeit für ' + P.who + '.', 48, 88);
      y = 112;
      P.dishes.forEach(function (d) {
        var ingLines = d.ing.length, boxH = 64 + ingLines * 19;
        if (y + boxH > H - 50) { footer(); doc.addPage('a4', 'portrait'); bg(); y = 52; }
        fill(C.white); stroke(C.line); doc.setLineWidth(0.8); doc.roundedRect(48, y, W - 96, boxH, 8, 8, 'FD');
        font('Playfair', 'bold', 18); color(C.deep); doc.text(d.name, 64, y + 27);
        font('Inter', 'semibold', 9.5); color(C.accent); doc.setCharSpace(0.5);
        doc.text(doc.splitTextToSize('IM PLAN: ' + d.when.join(', ').toUpperCase(), W - 150)[0], 64, y + 44);
        doc.setCharSpace(0);
        font('Inter', 'normal', 10); color(C.text);
        d.ing.forEach(function (g, k) {
          var iy = y + 66 + k * 19;
          fill(C.green); doc.circle(67, iy - 4, 2, 'F');
          font('Inter', 'bold', 12); doc.text(g[0], 78, iy);
          font('Inter', 'normal', 12); doc.text(g[1], 160, iy);
        });
        y += boxH + 12;
      });
      footer();
    }

    // Abschluss-Hinweis auf der letzten Seite
    W = doc.internal.pageSize.getWidth(); H = doc.internal.pageSize.getHeight();
    var by = H - 140;
    if (y < by - 10) {
      fill(C.deep); doc.roundedRect(48, by, W - 96, 92, 8, 8, 'F');
      font('Playfair', 'bold', 18); color(C.white); doc.text('Plan ändern oder neu erstellen?', 68, by + 31);
      font('Inter', 'normal', 11.5); color([230, 240, 234]);
      doc.text('Stell deinen nächsten Wochenplan auf meal-prep.tech zusammen.', 68, by + 52);
      font('Inter', 'bold', 12); color(C.accent); doc.textWithLink('meal-prep.tech', 68, by + 72, { url: 'https://meal-prep.tech/#app-entwurf' });
    }
    return doc;
  }

  function setStatus(t) { if (status) status.textContent = t; }
  btn.addEventListener('click', function () {
    if (btn.getAttribute('aria-busy') === 'true') return;
    if (!window.SB_APP_LIB || !window.SB_APP_STORE) { setStatus('Der Wochenplan ist noch nicht bereit. Bitte lade die Seite neu.'); return; }
    var label = btn.textContent;
    btn.setAttribute('aria-busy', 'true'); btn.disabled = true; btn.textContent = 'PDF wird erstellt …';
    var P;
    try { P = collect(); } catch (e) { P = null; }
    Promise.all([loadJsPDF(), loadFonts()]).then(function (r) {
      if (!P) throw new Error('Plan fehlt');
      build(r[0], r[1], P).save('meal-prep-wochenplan.pdf');
      setStatus('Fertig – dein Wochenplan wurde heruntergeladen.');
    }).catch(function () {
      setStatus('Das PDF konnte nicht erstellt werden. Bitte versuch es noch einmal.');
    }).then(function () {
      btn.removeAttribute('aria-busy'); btn.disabled = false; btn.textContent = label;
    });
  });
})();
