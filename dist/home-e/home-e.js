(function () {
  var root = document.querySelector('.sbe');
  if (!root) return;
  var IMG = root.getAttribute('data-img') || '';
  var PLAN_URL = root.getAttribute('data-planner') || '/weekly-planner/';
  function img(f) { return /^https?:/.test(f) ? f : IMG + f; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var HEART = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.6 1.1 4.2 2.6C11.6 6.1 13.2 5 15.2 5c3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z"/></svg>';
  var TICK = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

  var NUT = {
    'Overnight oats with berries': [423, 12], 'Cottage cheese bowl': [479, 33], 'Mild lentil curry': [623, 31],
    'Baked salmon with potatoes': [608, 40], 'Salmon with potatoes': [608, 40], 'Chicken wraps with vegetables': [666, 48],
    'Pirozhki with potato & mushroom': [663, 16], 'Borscht with beef': [500, 38], 'Lentil pasta': [527, 25], 'Lentil pasta with tomatoes': [527, 25],
    'Scrambled eggs with vegetables': [465, 30], 'Bread roll with cheese & jam': [555, 18], 'Chili sin carne with rice': [721, 24], 'Cheese spaetzle with onions': [728, 31],
    'Greek yogurt with berries': [140, 16], 'Banana with dark chocolate': [113, 1], 'Hummus bread with cucumber': [396, 15], 'Broccoli cheese bites': [210, 14]
  };

  /* ---------- recipes ---------- */
  var ALL = {
    Breakfast: [
      { name: 'Overnight oats with berries', img: 'oat-berries.webp', meta: 'Breakfast · vegetarian', info: '10 min · 3–4 days in the fridge', isNew: true },
      { name: 'Scrambled eggs with vegetables', img: 'scrambled-eggs.webp', meta: 'Breakfast · high protein', info: '15 min' },
      { name: 'Bread roll with cheese & jam', img: 'de-brotchen-mit-kase-und-marmelade.webp', meta: 'Breakfast · classic', info: '5 min' },
      { name: 'Cottage cheese bowl', img: 'cottage-bowl.webp', meta: 'Breakfast · high protein', info: '5 min' }
    ],
    Lunch: [
      { name: 'Mild lentil curry', img: 'lentil-curry.webp', meta: 'Lunch · vegan', info: '35 min · freezes well', isNew: true },
      { name: 'Baked salmon with potatoes', img: 'salmon-potato.webp', meta: 'Lunch · dinner', info: '50 min' },
      { name: 'Chicken wraps with vegetables', img: 'de-wraps-mit-hahnchen-und-gemuse.webp', meta: 'Lunch · lunchbox', info: '25 min' },
      { name: 'Pirozhki with potato & mushroom', img: 'pirozhki-kartoffeln-pilze-gebraten.webp', meta: 'Lunch · Eastern European', info: '2 h incl. rising', isNew: true }
    ],
    Dinner: [
      { name: 'Borscht with beef', img: 'borschtsch-rind-ohne-bohnen.webp', meta: 'Dinner · Eastern European', info: '2 h · better on day two', isNew: true },
      { name: 'Lentil pasta', img: 'lentil-pasta.webp', meta: 'Dinner · vegetarian', info: '25 min' },
      { name: 'Chili sin carne with rice', img: 'de-chili-sin-carne-mit-reis.webp', meta: 'Dinner · vegan', info: '40 min · freezes well' },
      { name: 'Cheese spaetzle with onions', img: 'de-kasespatzle-mit-zwiebeln.webp', meta: 'Dinner · vegetarian', info: '30 min' }
    ],
    Snacks: [
      { name: 'Greek yogurt with berries', img: 'snack-yogurt.webp', meta: 'Snack · high protein', info: '2 min' },
      { name: 'Banana with dark chocolate', img: 'snack-banana-chocolate.webp', meta: 'Snack · sweet', info: '2 min' },
      { name: 'Hummus bread with cucumber', img: 'de-hummusbrot-mit-gurke.webp', meta: 'Snack · vegan', info: '5 min' },
      { name: 'Broccoli cheese bites', img: 'https://meal-prep.tech/wp-content/uploads/2026/10/cheesy-roasted-broccoli-bites-1024x683.webp', meta: 'Snack · low carb', info: '25 min', isNew: true }
    ]
  };
  var tab = 'Lunch';
  var tabsEl = root.querySelector('[data-rtabs]'), gridEl = root.querySelector('[data-rgrid]');
  function renderRecipes() {
    tabsEl.innerHTML = Object.keys(ALL).map(function (k) {
      return '<button type="button" role="tab" aria-selected="' + (k === tab) + '" data-tab="' + k + '">' + k + '</button>';
    }).join('');
    gridEl.innerHTML = ALL[tab].map(function (c) {
      var n = NUT[c.name] || [0, 0];
      return '<article class="sbe-rc"><div class="im"><img src="' + img(c.img) + '" alt="' + esc(c.name) + '" loading="lazy" width="480" height="480">' +
        (c.isNew ? '<span class="new">New</span>' : '') + '</div><div class="bd"><span class="mt">' + esc(c.meta) + '</span><h3>' + esc(c.name) + '</h3>' +
        '<span class="in">' + esc(c.info) + '</span><div class="nu"><span>' + n[0] + ' kcal</span><span>' + n[1] + ' g protein</span></div>' +
        '<a class="add" href="' + PLAN_URL + '">+ Add to plan</a></div></article>';
    }).join('');
  }
  tabsEl.addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { tab = b.getAttribute('data-tab'); renderRecipes(); } });
  renderRecipes();

  /* ---------- phone: swipe ---------- */
  var DECK = [
    { cat: 'Breakfast', name: 'Overnight oats with berries', ing: 'Oats · Berries · Yogurt', img: 'oat-berries.webp' },
    { cat: 'Breakfast', name: 'Cottage cheese bowl', ing: 'Cottage cheese · Fruit · Nuts', img: 'cottage-bowl.webp' },
    { cat: 'Lunch', name: 'Mild lentil curry', ing: 'Lentils · Coconut milk · Rice', img: 'lentil-curry.webp' },
    { cat: 'Lunch', name: 'Lentil pasta with tomatoes', ing: 'Lentil pasta · Tomatoes', img: 'lentil-pasta.webp' },
    { cat: 'Dinner', name: 'Salmon with potatoes', ing: 'Salmon · Potatoes · Herbs', img: 'salmon-potato.webp' },
    { cat: 'Dinner', name: 'Chicken wraps with vegetables', ing: 'Chicken · Tortillas · Peppers', img: 'de-wraps-mit-hahnchen-und-gemuse.webp' }
  ];
  var swI = 0, added = 8, liked = [], slide = 0, ticked = [0, 1];
  var BASE = [
    ['Mon', '5', ['Overnight oats with berries', 'Mild lentil curry', 'Chicken wraps with vegetables']],
    ['Tue', '6', ['Overnight oats with berries', 'Mild lentil curry', 'Chicken wraps with vegetables']],
    ['Wed', '7', ['Cottage cheese bowl', 'Lentil pasta with tomatoes', 'Salmon with potatoes']],
    ['Thu', '8', ['Cottage cheese bowl', 'Lentil pasta with tomatoes', 'Eating out']],
    ['Fri', '9', ['Overnight oats with berries', 'Mild lentil curry', 'Salmon with potatoes']]
  ];
  var SHOP = [
    { n: 'Berries', f: 'for Mon, Tue, Fri breakfast', q: '900 g' }, { n: 'Rolled oats', f: 'for Mon, Tue, Fri breakfast', q: '480 g' },
    { n: 'Red lentils', f: 'for Mon, Tue, Fri lunch', q: '540 g' }, { n: 'Salmon fillet', f: 'for Wed, Fri dinner', q: '750 g' },
    { n: 'Potatoes', f: 'for Wed, Fri dinner', q: '1.5 kg' }, { n: 'Cottage cheese', f: 'for Wed, Thu breakfast', q: '800 g' }
  ];
  var swEl = root.querySelector('[data-swipe]'), weekEl = root.querySelector('[data-week]'), shopEl = root.querySelector('[data-shop]');
  var screens = root.querySelectorAll('.sbe-screen'), stepTabs = root.querySelector('[data-steps]');

  function renderSwipe() {
    var sw = DECK[swI % DECK.length];
    var inCat = DECK.filter(function (d) { return d.cat === sw.cat; });
    var n = NUT[sw.name];
    var bars = '';
    for (var b = 0; b < 5; b++) bars += '<span style="background:' + (b < added % 5 ? 'var(--g)' : b === added % 5 ? 'var(--o)' : '#E6E1D9') + '"></span>';
    swEl.innerHTML = '<div><span class="sbe-k">' + sw.cat + ' · ' + (inCat.indexOf(sw) + 1) + ' of ' + inCat.length + '</span><strong class="sbe-st">What do you like?</strong><div class="sbe-bars">' + bars + '</div></div>' +
      '<div class="sbe-card"><img src="' + img(sw.img) + '" alt="' + esc(sw.name) + '" width="480" height="480"><div><b>' + esc(sw.name) + '</b><small>' + esc(sw.ing) + '</small><em>' + n[0] + ' kcal · ' + n[1] + ' g protein</em></div></div>' +
      '<div class="sbe-act"><button type="button" class="sbe-no" aria-label="Skip dish" data-skip>✕</button><button type="button" class="sbe-yes" aria-label="Like dish" data-like>' + HEART + '</button></div>';
  }
  function renderWeek() {
    var base = BASE.map(function (d) { return [d[0], d[1], d[2].slice()]; });
    var changed = {}, cursor = [0, 0, 0], lastDay = 1, col = { Breakfast: 0, Lunch: 1, Dinner: 2 };
    liked.forEach(function (l) {
      var c = col[l.cat], d = cursor[c] % 5;
      if (base[d][2][c] === 'Eating out') d = (d + 1) % 5;
      base[d][2][c] = l.name; changed[d + '-' + c] = true; cursor[c] = d + 1; lastDay = d;
    });
    var labels = ['Breakfast', 'Lunch', 'Dinner'];
    weekEl.innerHTML = '<div><span class="sbe-k">CW 41 · Planned automatically</span><strong class="sbe-st">Your week</strong></div>' +
      '<span class="sbe-pill"><span style="color:var(--g);font-weight:800">✦</span>From ' + added + ' liked dishes · €80–110</span>' +
      base.map(function (d, di) {
        var k = 0, p = 0;
        d[2].forEach(function (nm) { if (NUT[nm]) { k += NUT[nm][0]; p += NUT[nm][1]; } });
        return '<div class="sbe-day' + (di === lastDay ? ' hl' : '') + '"><div class="sbe-dc"><span>' + d[0] + '</span><strong>' + d[1] + '</strong><span class="kc">' + k + ' kcal</span><span class="pr">' + p + ' g prot.</span></div><div class="sbe-rows">' +
          d[2].map(function (nm, ci) {
            var ch = !!changed[di + '-' + ci];
            return '<div class="sbe-row"><span class="lb">' + labels[ci] + '</span><span class="dot' + (nm === 'Eating out' || ch ? ' o' : '') + '"></span><span class="nm">' + esc(nm) + '</span>' + (ch ? '<span class="ch">changed</span>' : '') + '</div>';
          }).join('') + '</div></div>';
      }).join('') +
      '<a class="sbe-gbtn" href="' + PLAN_URL + '">Create shopping basket</a>';
  }
  function renderShop() {
    shopEl.innerHTML = '<div><span class="sbe-k">Mon – Fri · October</span><strong class="sbe-st">Your shopping</strong><span style="font-size:12px;color:#666">Amounts for 2 adults and 1 child</span></div>' +
      '<div class="sbe-list">' + SHOP.map(function (x, k) {
        var done = ticked.indexOf(k) > -1;
        return '<div class="sbe-li' + (done ? ' done' : '') + '" data-tick="' + k + '" role="checkbox" aria-checked="' + done + '" tabindex="0"><span class="bx">' + (done ? TICK : '') + '</span><div style="flex:1;min-width:0"><span class="n">' + x.n + '</span><span class="f">' + x.f + '</span></div><span class="q">' + x.q + '</span></div>';
      }).join('') + '<span class="sbe-more">+ 14 more ingredients</span></div>' +
      '<span class="sbe-note"><span style="width:7px;height:7px;border-radius:999px;background:var(--o)"></span>Eating out on Thursday – nothing to buy</span>' +
      '<span class="sbe-order">Order now<span style="font-size:12px;font-weight:500">20 items</span></span>' +
      '<div class="sbe-fmt"><span>In app</span><span>PDF</span><span>Excel</span></div>';
  }
  function renderSteps() {
    stepTabs.innerHTML = ['Swipe', 'Your week', 'Shopping'].map(function (t, k) {
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
