(function () {
  var root = document.querySelector('.sbe');
  if (!root) return;
  var IMG = root.getAttribute('data-img') || '';
  var PLAN_URL = root.getAttribute('data-planner') || '/de/wochenplaner/';
  function img(f) { return /^https?:/.test(f) ? f : IMG + f; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var HEART = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.6 1.1 4.2 2.6C11.6 6.1 13.2 5 15.2 5c3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z"/></svg>';
  var TICK = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

  var NUT = {
    'Overnight Oats mit Beeren': [423, 12], 'Hüttenkäse-Bowl': [479, 33], 'Mildes Linsencurry': [623, 31],
    'Ofenlachs mit Kartoffeln': [608, 40], 'Lachs mit Kartoffeln': [608, 40], 'Hähnchen-Wraps mit Gemüse': [666, 48],
    'Piroggen mit Kartoffel & Pilzen': [663, 16], 'Borschtsch mit Rind': [500, 38], 'Linsennudeln': [527, 25], 'Linsennudeln mit Tomaten': [527, 25],
    'Rührei mit Gemüse': [465, 30], 'Brötchen mit Käse und Marmelade': [555, 18], 'Chili sin Carne mit Reis': [721, 24], 'Käsespätzle mit Zwiebeln': [728, 31],
    'Griechischer Joghurt mit Beeren': [140, 16], 'Banane mit dunkler Schokolade': [113, 1], 'Hummusbrot mit Gurke': [396, 15], 'Brokkoli-Käse-Bites': [210, 14]
  };

  /* ---------- recipes ---------- */
  var ALL = {
    'Frühstück': [
      { name: 'Overnight Oats mit Beeren', img: 'oat-berries.webp', meta: 'Frühstück · vegetarisch', info: '10 Min. · 3–4 Tage im Kühlschrank', isNew: true },
      { name: 'Rührei mit Gemüse', img: 'scrambled-eggs.webp', meta: 'Frühstück · proteinreich', info: '15 Min.' },
      { name: 'Brötchen mit Käse und Marmelade', img: 'de-brotchen-mit-kase-und-marmelade.webp', meta: 'Frühstück · klassisch', info: '5 Min.' },
      { name: 'Hüttenkäse-Bowl', img: 'cottage-bowl.webp', meta: 'Frühstück · proteinreich', info: '5 Min.' }
    ],
    'Mittag': [
      { name: 'Mildes Linsencurry', img: 'lentil-curry.webp', meta: 'Mittag · vegan', info: '35 Min. · gut einzufrieren', isNew: true },
      { name: 'Ofenlachs mit Kartoffeln', img: 'salmon-potato.webp', meta: 'Mittag · Abend', info: '50 Min.' },
      { name: 'Hähnchen-Wraps mit Gemüse', img: 'de-wraps-mit-hahnchen-und-gemuse.webp', meta: 'Mittag · Lunchbox', info: '25 Min.' },
      { name: 'Piroggen mit Kartoffel & Pilzen', img: 'pirozhki-kartoffeln-pilze-gebraten.webp', meta: 'Mittag · osteuropäisch', info: '2 Std. inkl. Gehzeit', isNew: true }
    ],
    'Abend': [
      { name: 'Borschtsch mit Rind', img: 'borschtsch-rind-ohne-bohnen.webp', meta: 'Abend · osteuropäisch', info: '2 Std. · am zweiten Tag noch besser', isNew: true },
      { name: 'Linsennudeln', img: 'lentil-pasta.webp', meta: 'Abend · vegetarisch', info: '25 Min.' },
      { name: 'Chili sin Carne mit Reis', img: 'de-chili-sin-carne-mit-reis.webp', meta: 'Abend · vegan', info: '40 Min. · gut einzufrieren' },
      { name: 'Käsespätzle mit Zwiebeln', img: 'de-kasespatzle-mit-zwiebeln.webp', meta: 'Abend · vegetarisch', info: '30 Min.' }
    ],
    Snacks: [
      { name: 'Griechischer Joghurt mit Beeren', img: 'snack-yogurt.webp', meta: 'Snack · proteinreich', info: '2 Min.' },
      { name: 'Banane mit dunkler Schokolade', img: 'snack-banana-chocolate.webp', meta: 'Snack · süß', info: '2 Min.' },
      { name: 'Hummusbrot mit Gurke', img: 'de-hummusbrot-mit-gurke.webp', meta: 'Snack · vegan', info: '5 Min.' },
      { name: 'Brokkoli-Käse-Bites', img: 'https://meal-prep.tech/wp-content/uploads/2026/10/cheesy-roasted-broccoli-bites-1024x683.webp', meta: 'Snack · Low Carb', info: '25 Min.', isNew: true }
    ]
  };
  var tab = 'Mittag';
  var tabsEl = root.querySelector('[data-rtabs]'), gridEl = root.querySelector('[data-rgrid]');
  function renderRecipes() {
    tabsEl.innerHTML = Object.keys(ALL).map(function (k) {
      return '<button type="button" role="tab" aria-selected="' + (k === tab) + '" data-tab="' + k + '">' + k + '</button>';
    }).join('');
    gridEl.innerHTML = ALL[tab].map(function (c) {
      var n = NUT[c.name] || [0, 0];
      return '<article class="sbe-rc"><div class="im"><img src="' + img(c.img) + '" alt="' + esc(c.name) + '" loading="lazy" width="480" height="480">' +
        (c.isNew ? '<span class="new">Neu</span>' : '') + '</div><div class="bd"><span class="mt">' + esc(c.meta) + '</span><h3>' + esc(c.name) + '</h3>' +
        '<span class="in">' + esc(c.info) + '</span><div class="nu"><span>' + n[0] + ' kcal</span><span>' + n[1] + ' g Protein</span></div>' +
        '<a class="add" href="' + PLAN_URL + '">+ In den Plan</a></div></article>';
    }).join('');
  }
  tabsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { tab = b.getAttribute('data-tab'); renderRecipes(); } });
  renderRecipes();

  /* ---------- phone: swipe ---------- */
  var DECK = [
    { cat: 'Frühstück', name: 'Overnight Oats mit Beeren', ing: 'Haferflocken · Beeren · Joghurt', img: 'oat-berries.webp' },
    { cat: 'Frühstück', name: 'Hüttenkäse-Bowl', ing: 'Hüttenkäse · Obst · Nüsse', img: 'cottage-bowl.webp' },
    { cat: 'Mittag', name: 'Mildes Linsencurry', ing: 'Linsen · Kokosmilch · Reis', img: 'lentil-curry.webp' },
    { cat: 'Mittag', name: 'Linsennudeln mit Tomaten', ing: 'Linsennudeln · Tomaten', img: 'lentil-pasta.webp' },
    { cat: 'Abend', name: 'Lachs mit Kartoffeln', ing: 'Lachs · Kartoffeln · Kräuter', img: 'salmon-potato.webp' },
    { cat: 'Abend', name: 'Hähnchen-Wraps mit Gemüse', ing: 'Hähnchen · Tortillas · Paprika', img: 'de-wraps-mit-hahnchen-und-gemuse.webp' }
  ];
  var swI = 0, added = 8, liked = [], slide = 0, ticked = [0, 1];
  var BASE = [
    ['Mo', '5', ['Overnight Oats mit Beeren', 'Mildes Linsencurry', 'Hähnchen-Wraps mit Gemüse']],
    ['Di', '6', ['Overnight Oats mit Beeren', 'Mildes Linsencurry', 'Hähnchen-Wraps mit Gemüse']],
    ['Mi', '7', ['Hüttenkäse-Bowl', 'Linsennudeln mit Tomaten', 'Lachs mit Kartoffeln']],
    ['Do', '8', ['Hüttenkäse-Bowl', 'Linsennudeln mit Tomaten', 'Auswärts essen']],
    ['Fr', '9', ['Overnight Oats mit Beeren', 'Mildes Linsencurry', 'Lachs mit Kartoffeln']]
  ];
  var SHOP = [
    { n: 'Beeren', f: 'für Mo, Di, Fr Frühstück', q: '900 g' }, { n: 'Haferflocken', f: 'für Mo, Di, Fr Frühstück', q: '480 g' },
    { n: 'Rote Linsen', f: 'für Mo, Di, Fr Mittag', q: '540 g' }, { n: 'Lachsfilet', f: 'für Mi, Fr Abend', q: '750 g' },
    { n: 'Kartoffeln', f: 'für Mi, Fr Abend', q: '1,5 kg' }, { n: 'Hüttenkäse', f: 'für Mi, Do Frühstück', q: '800 g' }
  ];
  var swEl = root.querySelector('[data-swipe]'), weekEl = root.querySelector('[data-week]'), shopEl = root.querySelector('[data-shop]');
  var screens = root.querySelectorAll('.sbe-screen'), stepTabs = root.querySelector('[data-steps]');

  function renderSwipe() {
    var sw = DECK[swI % DECK.length];
    var inCat = DECK.filter(function (d) { return d.cat === sw.cat; });
    var n = NUT[sw.name];
    var bars = '';
    for (var b = 0; b < 5; b++) bars += '<span style="background:' + (b < added % 5 ? 'var(--g)' : b === added % 5 ? 'var(--o)' : '#E6E1D9') + '"></span>';
    swEl.innerHTML = '<div><span class="sbe-k">' + sw.cat + ' · ' + (inCat.indexOf(sw) + 1) + ' von ' + inCat.length + '</span><strong class="sbe-st">Was magst du?</strong><div class="sbe-bars">' + bars + '</div></div>' +
      '<div class="sbe-card"><img src="' + img(sw.img) + '" alt="' + esc(sw.name) + '" width="480" height="480"><div><b>' + esc(sw.name) + '</b><small>' + esc(sw.ing) + '</small><em>' + n[0] + ' kcal · ' + n[1] + ' g protein</em></div></div>' +
      '<div class="sbe-act"><button type="button" class="sbe-no" aria-label="Gericht überspringen" data-skip>✕</button><button type="button" class="sbe-yes" aria-label="Gericht merken" data-like>' + HEART + '</button></div>';
  }
  function renderWeek() {
    var base = BASE.map(function (d) { return [d[0], d[1], d[2].slice()]; });
    var changed = {}, cursor = [0, 0, 0], lastDay = 1, col = { 'Frühstück': 0, 'Mittag': 1, 'Abend': 2 };
    liked.forEach(function (l) {
      var c = col[l.cat], d = cursor[c] % 5;
      if (base[d][2][c] === 'Auswärts essen') d = (d + 1) % 5;
      base[d][2][c] = l.name; changed[d + '-' + c] = true; cursor[c] = d + 1; lastDay = d;
    });
    var labels = ['Frühstück', 'Mittag', 'Abend'];
    weekEl.innerHTML = '<div><span class="sbe-k">KW 41 · automatisch geplant</span><strong class="sbe-st">Deine Woche</strong></div>' +
      '<span class="sbe-pill"><span style="color:var(--g);font-weight:800">✦</span>Aus ' + added + ' gemerkten Gerichten · 80–110 €</span>' +
      base.map(function (d, di) {
        var k = 0, p = 0;
        d[2].forEach(function (nm) { if (NUT[nm]) { k += NUT[nm][0]; p += NUT[nm][1]; } });
        return '<div class="sbe-day' + (di === lastDay ? ' hl' : '') + '"><div class="sbe-dc"><span>' + d[0] + '</span><strong>' + d[1] + '</strong><span class="kc">' + k + ' kcal</span><span class="pr">' + p + ' g Prot.</span></div><div class="sbe-rows">' +
          d[2].map(function (nm, ci) {
            var ch = !!changed[di + '-' + ci];
            return '<div class="sbe-row"><span class="lb">' + labels[ci] + '</span><span class="dot' + (nm === 'Auswärts essen' || ch ? ' o' : '') + '"></span><span class="nm">' + esc(nm) + '</span>' + (ch ? '<span class="ch">changed</span>' : '') + '</div>';
          }).join('') + '</div></div>';
      }).join('') +
      '<a class="sbe-gbtn" href="' + PLAN_URL + '">Einkaufskorb erstellen</a>';
  }
  function renderShop() {
    shopEl.innerHTML = '<div><span class="sbe-k">Mo – Fr · Oktober</span><strong class="sbe-st">Dein Einkauf</strong><span style="font-size:12px;color:#666">Mengen für 2 Erwachsene und 1 Kind</span></div>' +
      '<div class="sbe-list">' + SHOP.map(function (x, k) {
        var done = ticked.indexOf(k) > -1;
        return '<div class="sbe-li' + (done ? ' done' : '') + '" data-tick="' + k + '" role="checkbox" aria-checked="' + done + '" tabindex="0"><span class="bx">' + (done ? TICK : '') + '</span><div style="flex:1;min-width:0"><span class="n">' + x.n + '</span><span class="f">' + x.f + '</span></div><span class="q">' + x.q + '</span></div>';
      }).join('') + '<span class="sbe-more">+ 14 weitere Zutaten</span></div>' +
      '<span class="sbe-note"><span style="width:7px;height:7px;border-radius:999px;background:var(--o)"></span>Donnerstag auswärts – nichts einzukaufen</span>' +
      '<span class="sbe-order">Jetzt bestellen<span style="font-size:12px;font-weight:500">20 Artikel</span></span>' +
      '<div class="sbe-fmt"><span>In der App</span><span>PDF</span><span>Excel</span></div>';
  }
  function renderSteps() {
    stepTabs.innerHTML = ['Swipen', 'Deine Woche', 'Einkauf'].map(function (t, k) {
      return '<button type="button" role="tab" aria-selected="' + (k === slide) + '" data-slide="' + k + '">' + t + '</button>';
    }).join('');
    for (var i = 0; i < screens.length; i++) screens[i].classList.toggle('on', i === slide);
  }
  function renderPhone() { renderSwipe(); renderWeek(); renderShop(); renderSteps(); }

  var auto = setInterval(function () { slide = (slide + 1) % 3; renderSteps(); }, 6000);
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  root.querySelector('.sbe-visual').addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-slide]')) { stopAuto(); slide = +t.closest('[data-slide]').getAttribute('data-slide'); renderSteps(); return; }
    if (t.closest('[data-skip]')) { stopAuto(); swI++; renderSwipe(); return; }
    if (t.closest('[data-like]')) { stopAuto(); var sw = DECK[swI % DECK.length]; liked.push({ name: sw.name, cat: sw.cat }); added++; swI++; renderSwipe(); renderWeek(); return; }
    var li = t.closest('[data-tick]');
    if (li) { stopAuto(); var k = +li.getAttribute('data-tick'), p = ticked.indexOf(k); if (p > -1) ticked.splice(p, 1); else ticked.push(k); renderShop(); }
  });
  /* touch swipe on the dish card */
  var sx = null;
  swEl.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  swEl.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) < 50) return; stopAuto();
    if (dx > 0) { var sw = DECK[swI % DECK.length]; liked.push({ name: sw.name, cat: sw.cat }); added++; }
    swI++; renderSwipe(); renderWeek();
  });
  renderPhone();
})();
