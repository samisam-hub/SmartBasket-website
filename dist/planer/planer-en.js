/* Meal Prep Weekly Planner (EN) – generated from planer.js by build_en.py. (meal-prep.tech): Rezepte aus der SmartBasket-App und dem Blog,
   Suche nach Zutaten, Wischen nach Kategorie, automatische Wochenplan-Vorlage und PDF-Download.
   Daten: window.SB_REZEPTE, Bilder: window.SB_IMG_BASE, PDF-Dateien: window.SB_PDF_ASSET_BASE. */
(function () {
  'use strict';
  var R = window.SB_REZEPTE || [];
  var root = document.getElementById('sb-planer');
  if (!root || !R.length) return;
  var IMG = window.SB_IMG_BASE || '';
  var ASSET = window.SB_PDF_ASSET_BASE || '';
  var KEY = 'sb-weekly-planner-v1';

  var SLOTS = [{ id: 'f', l: 'Breakfast', s: 'Breakfast' }, { id: 'm', l: 'Lunch', s: 'Lunch' },
    { id: 'a', l: 'Dinner', s: 'Dinner' }, { id: 's', l: 'Snack', s: 'Snack' }];
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var DIETS = [{ id: 'vegetarian', l: 'Vegetarian' }, { id: 'vegan', l: 'Vegan' }, { id: 'gluten_free', l: 'Gluten-free' }, { id: 'lactose_free', l: 'Lactose-free' }];
  var BASICS = ['salt', 'pepper', 'olive oil', 'sunflower oil', 'rapeseed oil', 'sugar', 'water', 'stock powder', 'vegetable stock'];
  var SUGGEST = ['Potatoes', 'Eggs', 'Pasta', 'Rice', 'Chicken breast', 'Lentils', 'Broccoli', 'Spinach', 'Rolled oats', 'Tomato', 'Salmon fillet', 'Plain tofu'];

  var byId = {}; R.forEach(function (r) { byId[r.id] = r; });
  var ING = []; (function () { var seen = {}; R.forEach(function (r) { r.i.forEach(function (i) { var k = i[0].toLowerCase(); if (!seen[k]) { seen[k] = 1; ING.push(i[0]); } }); }); ING.sort(function (a, b) { return a.localeCompare(b, 'de'); }); })();

  function defaults() { return { adults: 2, kids: 0, days: [0, 1, 2, 3, 4], slots: ['f', 'm', 'a'], diets: [], plan: {}, have: [], q: '', tab: 'search', fslot: '', swipeSlot: 'm', queue: {}, shown: 12 }; }
  var st = defaults();
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) Object.keys(st).forEach(function (k) { if (k in saved) st[k] = saved[k]; }); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  // ---------- Helfer ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function imgSrc(r) { return r.img ? (/^https?:/.test(r.img) ? r.img : IMG + r.img) : ''; }
  function imgTag(r, cls) { var s = imgSrc(r); return s ? '<img src="' + esc(s) + '" alt="" loading="lazy" decoding="async"' + (cls ? ' class="' + cls + '"' : '') + '>' : '<div class="sp-noimg' + (cls ? ' ' + cls : '') + '"></div>'; }
  function slot(id) { for (var i = 0; i < SLOTS.length; i++) if (SLOTS[i].id === id) return SLOTS[i]; }
  function allowed(r) { return st.diets.every(function (d) { return r.d.indexOf(d) >= 0; }); }
  function factor() { return Math.max(0.6, st.adults + 0.6 * st.kids); }
  function who() { var p = []; if (st.adults) p.push(st.adults + (st.adults === 1 ? ' adult' : ' adults')); if (st.kids) p.push(st.kids + (st.kids === 1 ? ' child' : ' children')); return p.join(' and ') || '1 person'; }
  function isBasic(name) { var n = name.toLowerCase(); return BASICS.some(function (b) { return n.indexOf(b) >= 0; }); }
  function fmtQty(q, unit) {
    if (unit === 'g' || unit === 'ml') {
      var v = q < 20 ? Math.ceil(q) : Math.ceil(q / 10) * 10;
      if (v >= 1000) return (Math.round(v / 100) / 10).toString() + (unit === 'g' ? ' kg' : ' l');
      return v + ' ' + unit;
    }
    return (Math.ceil(q * 2) / 2).toString() + ' ' + unit;
  }
  function days() { return st.days.slice().sort(function (a, b) { return a - b; }); }
  function slots() { return SLOTS.filter(function (s) { return st.slots.indexOf(s.id) >= 0; }); }
  function cellKey(d, s) { return d + '-' + s; }
  function freeCell(s) { var ds = days(); for (var i = 0; i < ds.length; i++) if (!st.plan[cellKey(ds[i], s)]) return ds[i]; return -1; }
  function planCount() { var n = 0; days().forEach(function (d) { st.slots.forEach(function (s) { if (st.plan[cellKey(d, s)]) n++; }); }); return n; }
  function totalCells() { return days().length * st.slots.length; }
  function matches(r) { if (!st.have.length) return []; var out = []; st.have.forEach(function (h) { var t = h.toLowerCase(); if (r.i.some(function (i) { return i[0].toLowerCase().indexOf(t) >= 0; })) out.push(h); }); return out; }
  function missing(r) { return r.i.filter(function (i) { if (isBasic(i[0])) return false; var n = i[0].toLowerCase(); return !st.have.some(function (h) { return n.indexOf(h.toLowerCase()) >= 0; }); }); }

  var toastEl, toastT;
  function toast(t) { toastEl.textContent = t; toastEl.classList.add('sp-show'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('sp-show'); }, 2600); }

  function addToPlan(id, s) {
    if (st.slots.indexOf(s) < 0) { st.slots.push(s); }
    var d = freeCell(s);
    if (d < 0) { toast('All ' + slot(s).s.toLowerCase() + ' slots are taken. Remove a dish or choose more days.'); return false; }
    st.plan[cellKey(d, s)] = id; save(); renderPlan(); renderSetup();
    toast(byId[id].n + ' → ' + DAYS[d] + ', ' + slot(s).s);
    return true;
  }
  function autoFill() {
    var used = {}; Object.keys(st.plan).forEach(function (k) { used[st.plan[k]] = (used[st.plan[k]] || 0) + 1; });
    var filled = 0;
    days().forEach(function (d) {
      slots().forEach(function (s) {
        var k = cellKey(d, s.id); if (st.plan[k]) return;
        var pool = R.filter(function (r) { return allowed(r) && r.s.indexOf(s.id) >= 0; });
        if (!pool.length) return;
        pool.sort(function (a, b) { return (used[a.id] || 0) - (used[b.id] || 0) || matches(b).length - matches(a).length || Math.random() - 0.5; });
        st.plan[k] = pool[0].id; used[pool[0].id] = (used[pool[0].id] || 0) + 1; filled++;
      });
    });
    save(); renderPlan();
    toast(filled ? filled + (filled === 1 ? ' slot' : ' slots') + ' filled automatically.' : 'Your plan is already full.');
  }

  // ---------- Grundgerüst ----------
  root.innerHTML =
    '<div class="sp-wrap">' +
    '<header class="sp-head"><span class="sp-eyebrow">Free · no sign-up</span><h1>Meal Prep Weekly Planner Template</h1>' +
    '<p class="sp-lead">Build your weekly meal plan for free: search recipes by the ingredients you have at home, or swipe through breakfast, lunch and dinner ideas. Every dish goes straight into your weekly planner template – with a shopping list as a downloadable PDF.</p></header>' +
    '<section class="sp-card" aria-labelledby="sp-h1"><div class="sp-step"><span class="sp-nr">1</span><h2 id="sp-h1">Who and when?</h2></div><div class="sp-setup" id="sp-setup"></div></section>' +
    '<section class="sp-card" aria-labelledby="sp-h2"><div class="sp-step"><span class="sp-nr">2</span><h2 id="sp-h2">Find recipes</h2></div>' +
    '<div class="sp-tabs" role="tablist"><button class="sp-tab" role="tab" id="sp-t-search" aria-controls="sp-p-search">Search by ingredients</button><button class="sp-tab" role="tab" id="sp-t-swipe" aria-controls="sp-p-swipe">Swipe by category</button></div>' +
    '<div id="sp-p-search" role="tabpanel" aria-labelledby="sp-t-search"></div><div id="sp-p-swipe" role="tabpanel" aria-labelledby="sp-t-swipe"></div></section>' +
    '<section class="sp-card" aria-labelledby="sp-h3" id="sp-plan"><div class="sp-plan-head"><div><div class="sp-step" style="margin-bottom:6px"><span class="sp-nr">3</span><h2 id="sp-h3">Your weekly plan</h2></div><p class="sp-status" id="sp-count"></p></div></div>' +
    '<div class="sp-scroll"><table class="sp-grid" id="sp-grid"></table></div>' +
    '<div class="sp-plan-actions"><button class="sp-btn" id="sp-pdf">Download weekly plan as PDF</button><button class="sp-btn sp-sec" id="sp-fill">Fill empty slots automatically</button><button class="sp-btn sp-sec" id="sp-clear">Clear plan</button><span class="sp-status" id="sp-pdf-status" aria-live="polite"></span></div></section>' +
    '<aside class="sp-teaser"><div><h3>Even easier in the app</h3><p>Prepello plans the week for your household and turns the shopping list into whole packs.</p></div><a href="https://forms.gle/D3PrMx7ugt5bA5MHA" target="_blank" rel="noopener">Try the free beta ↗</a></aside>' +
    '<footer class="sp-foot"><span>© 2026 Prepello</span><a href="/">Home</a><a href="https://smartbasket.samisam.org/de/impressum/">Impressum</a><a href="https://smartbasket.samisam.org/de/datenschutz/">Datenschutz</a></footer>' +
    '</div><div class="sp-modal" id="sp-modal" hidden><div class="sp-dialog" role="dialog" aria-modal="true" aria-labelledby="sp-mt" id="sp-dialog"></div></div><div class="sp-toast" role="status" aria-live="polite"></div>';
  toastEl = root.querySelector('.sp-toast');
  var $ = function (id) { return document.getElementById(id); };

  // ---------- 1. Setup ----------
  function renderSetup() {
    var h = '<div><span class="sp-label">Who is eating?</span>' +
      '<div class="sp-counter"><span class="sp-cname">Adults</span><button class="sp-round" data-c="adults" data-v="-1" aria-label="Fewer adults"' + (st.adults <= 0 || st.adults + st.kids <= 1 ? ' disabled' : '') + '>−</button><output>' + st.adults + '</output><button class="sp-round" data-c="adults" data-v="1" aria-label="More adults"' + (st.adults >= 8 ? ' disabled' : '') + '>+</button></div>' +
      '<div class="sp-counter"><span class="sp-cname">Children</span><button class="sp-round" data-c="kids" data-v="-1" aria-label="Fewer children"' + (st.kids <= 0 || st.adults + st.kids <= 1 ? ' disabled' : '') + '>−</button><output>' + st.kids + '</output><button class="sp-round" data-c="kids" data-v="1" aria-label="More children"' + (st.kids >= 8 ? ' disabled' : '') + '>+</button></div></div>';
    h += '<div><span class="sp-label">Which days?</span><div class="sp-row">' + SHORT.map(function (s, i) { return '<button class="sp-chip" data-day="' + i + '" aria-pressed="' + (st.days.indexOf(i) >= 0) + '" aria-label="' + DAYS[i] + '">' + s + '</button>'; }).join('') + '</div></div>';
    h += '<div><span class="sp-label">Which meals?</span><div class="sp-row">' + SLOTS.map(function (s) { return '<button class="sp-chip" data-slot="' + s.id + '" aria-pressed="' + (st.slots.indexOf(s.id) >= 0) + '">' + s.l + '</button>'; }).join('') + '</div></div>';
    h += '<div><span class="sp-label">Diet</span><div class="sp-row">' + DIETS.map(function (d) { return '<button class="sp-chip" data-diet="' + d.id + '" aria-pressed="' + (st.diets.indexOf(d.id) >= 0) + '">' + d.l + '</button>'; }).join('') + '</div></div>';
    $('sp-setup').innerHTML = h;
  }
  $('sp-setup').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.c) { st[b.dataset.c] = Math.max(0, Math.min(8, st[b.dataset.c] + +b.dataset.v)); }
    else if (b.dataset.day) { var d = +b.dataset.day, i = st.days.indexOf(d); if (i >= 0) { if (st.days.length > 1) st.days.splice(i, 1); } else st.days.push(d); }
    else if (b.dataset.slot) { var s = b.dataset.slot, j = st.slots.indexOf(s); if (j >= 0) { if (st.slots.length > 1) st.slots.splice(j, 1); } else st.slots.push(s); st.slots.sort(function (a, c) { return 'fmas'.indexOf(a) - 'fmas'.indexOf(c); }); if (st.slots.indexOf(st.swipeSlot) < 0) st.swipeSlot = st.slots[0]; }
    else if (b.dataset.diet) { var x = b.dataset.diet, k = st.diets.indexOf(x); if (k >= 0) st.diets.splice(k, 1); else st.diets.push(x); st.queue = {}; }
    save(); renderSetup(); renderTab(); renderPlan();
  });

  // ---------- 2a. Suche ----------
  function renderSearch() {
    var p = $('sp-p-search');
    p.innerHTML = '<form class="sp-search" id="sp-form" autocomplete="off"><label class="sp-sr" for="sp-q">Ingredient or dish</label>' +
      '<input class="sp-input" id="sp-q" list="sp-ing" placeholder="Type an ingredient, e.g. potatoes" value="' + esc(st.q) + '"><datalist id="sp-ing">' + ING.map(function (n) { return '<option value="' + esc(n) + '">'; }).join('') + '</datalist>' +
      '<button class="sp-btn" type="submit">Add</button></form>' +
      '<div class="sp-have" id="sp-have">' + st.have.map(function (h, i) { return '<button data-rm="' + i + '" aria-label="' + esc(h) + ' remove">' + esc(h) + ' ✕</button>'; }).join('') + '</div>' +
      (st.have.length ? '' : '<div class="sp-sugg"><span>Quick add:</span>' + SUGGEST.map(function (s) { return '<button data-sg="' + esc(s) + '">+ ' + esc(s) + '</button>'; }).join('') + '</div>') +
      '<div class="sp-row" style="margin-top:14px" id="sp-fslot"><button class="sp-chip" data-fs="" aria-pressed="' + (!st.fslot) + '">All categories</button>' + SLOTS.map(function (s) { return '<button class="sp-chip" data-fs="' + s.id + '" aria-pressed="' + (st.fslot === s.id) + '">' + s.l + '</button>'; }).join('') + '</div>' +
      '<div id="sp-res"></div>';
    renderResults();
  }
  function renderResults() {
    var list = R.filter(function (r) { return allowed(r) && (!st.fslot || r.s.indexOf(st.fslot) >= 0); });
    var q = (st.q || '').trim().toLowerCase();
    if (q) list = list.filter(function (r) { return r.n.toLowerCase().indexOf(q) >= 0 || r.i.some(function (i) { return i[0].toLowerCase().indexOf(q) >= 0; }); });
    var scored = list.map(function (r) { return { r: r, m: matches(r), x: missing(r).length }; });
    if (st.have.length) scored = scored.filter(function (o) { return o.m.length; });
    scored.sort(function (a, b) { return b.m.length - a.m.length || a.x - b.x || (a.r.src === 'blog' ? -1 : 0) - (b.r.src === 'blog' ? -1 : 0) || a.r.n.localeCompare(b.r.n, 'de'); });
    var head = st.have.length ? '<p class="sp-status" style="margin-top:14px">' + scored.length + ' recipes with ' + esc(st.have.join(', ')) + '</p>' : '<p class="sp-status" style="margin-top:14px">' + scored.length + ' recipes' + (q ? ' for "' + esc(st.q) + '"' : '') + '</p>';
    var cards = scored.slice(0, st.shown).map(function (o) { return card(o.r, o.m, o.x); }).join('');
    $('sp-res').innerHTML = head + (scored.length ? '<div class="sp-results">' + cards + '</div>' : '<p class="sp-empty" style="margin-top:12px;height:auto">No matching recipes. Remove an ingredient or a diet filter.</p>') +
      (scored.length > st.shown ? '<div class="sp-more"><button class="sp-btn sp-sec" id="sp-more">Show more recipes</button></div>' : '');
  }
  function card(r, m, x) {
    var add = r.s.map(function (s) { return '<button data-add="' + r.id + '" data-s="' + s + '">+ ' + slot(s).s + '</button>'; }).join('');
    var meta = [r.s.map(function (s) { return slot(s).s; }).join(' · ')]; if (r.t) meta.push(r.t + ' min'); if (r.kcal) meta.push(r.kcal + ' kcal');
    return '<article class="sp-rc">' + imgTag(r) + '<div class="sp-rb">' + (r.src === 'blog' ? '<span class="sp-blog">From the blog</span>' : '') +
      '<button class="sp-rn" data-open="' + r.id + '">' + esc(r.n) + '</button><span class="sp-meta">' + esc(meta.join(' · ')) + '</span>' +
      (m && m.length ? '<span class="sp-match">✓ ' + esc(m.join(', ')) + '</span>' + (x ? '<span class="sp-miss">' + x + (x === 1 ? ' more ingredient' : ' more ingredients') + '</span>' : '<span class="sp-miss">You have everything (except basics)</span>') : '') +
      '<div class="sp-add">' + add + '</div></div></article>';
  }
  function addHave(v) {
    v = (v || '').trim(); if (!v) return;
    var exact = ING.filter(function (n) { return n.toLowerCase() === v.toLowerCase(); })[0];
    var short = (exact || v).replace(/\s+\d.*$/, '');
    if (st.have.map(function (h) { return h.toLowerCase(); }).indexOf(short.toLowerCase()) < 0) st.have.push(short);
    st.q = ''; st.shown = 12; save(); renderSearch(); var q = $('sp-q'); if (q) q.focus();
  }
  $('sp-p-search').addEventListener('submit', function (e) { e.preventDefault(); addHave($('sp-q').value); });
  $('sp-p-search').addEventListener('input', function (e) {
    if (e.target.id !== 'sp-q') return;
    var v = e.target.value;
    // Auswahl aus der Vorschlagsliste direkt übernehmen
    if (ING.some(function (n) { return n === v; })) { addHave(v); return; }
    st.q = v; st.shown = 12; renderResults();
  });
  $('sp-p-search').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.rm) { st.have.splice(+b.dataset.rm, 1); save(); renderSearch(); }
    else if (b.dataset.sg) addHave(b.dataset.sg);
    else if ('fs' in b.dataset) { st.fslot = b.dataset.fs; st.shown = 12; save(); renderSearch(); }
    else if (b.id === 'sp-more') { st.shown += 12; renderResults(); }
  });

  // ---------- 2b. Wischen ----------
  function queue(s) {
    var q = st.queue[s];
    var pool = R.filter(function (r) { return allowed(r) && r.s.indexOf(s) >= 0; }).map(function (r) { return r.id; });
    if (!q || !q.length || q.some(function (id) { return pool.indexOf(id) < 0; })) {
      q = pool.slice(); for (var i = q.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = q[i]; q[i] = q[j]; q[j] = t; }
      // Blog-Rezepte zuerst zeigen
      q.sort(function (a, b) { return (byId[b].src === 'blog') - (byId[a].src === 'blog'); });
      st.queue[s] = q; save();
    }
    return q;
  }
  function renderSwipe() {
    if (st.slots.indexOf(st.swipeSlot) < 0) st.swipeSlot = st.slots[0];
    var s = st.swipeSlot, q = queue(s), free = 0;
    days().forEach(function (d) { if (!st.plan[cellKey(d, s)]) free++; });
    var top = byId[q[0]], next = byId[q[1]];
    var deck = top ? (next ? swipeCard(next, 'sp-back') : '') + swipeCard(top, '') : '<div class="sp-empty">No recipes for this selection.</div>';
    $('sp-p-swipe').innerHTML = '<div class="sp-swipe"><div><div class="sp-deck" id="sp-deck">' + deck + '</div>' +
      '<div class="sp-actions"><button class="sp-act sp-no" id="sp-nope" aria-label="Skip">✕</button><button class="sp-act sp-info" id="sp-info" aria-label="View recipe">i</button><button class="sp-act sp-yes" id="sp-like" aria-label="Add to plan">♥</button></div>' +
      '<p class="sp-hint">Swipe right = add to plan · left = skip · arrow keys work too</p></div>' +
      '<div class="sp-side"><h3>Category</h3><p>Choose which meal you are looking for.</p><div class="sp-row" id="sp-sw-slots">' +
      slots().map(function (x) { return '<button class="sp-chip" data-sw="' + x.id + '" aria-pressed="' + (x.id === s) + '">' + x.l + '</button>'; }).join('') + '</div>' +
      '<p style="margin-top:16px">' + (free ? '<strong>' + free + '</strong> free ' + slot(s).s + ' slots left this week.' : 'All ' + slot(s).s.toLowerCase() + ' slots are taken.') + '</p></div></div>';
    bindDrag();
  }
  function swipeCard(r, cls) {
    var meta = []; if (r.t) meta.push(r.t + ' min'); if (r.kcal) meta.push(r.kcal + ' kcal per serving'); if (r.src === 'blog') meta.unshift('From the blog');
    return '<div class="sp-sc ' + cls + '"' + (cls ? ' aria-hidden="true"' : ' data-id="' + r.id + '"') + '>' + imgTag(r) + '<div class="sp-sb"><h3>' + esc(r.n) + '</h3><span class="sp-meta">' + esc(meta.join(' · ')) + '</span>' +
      '<p class="sp-ing">' + esc(r.i.filter(function (i) { return !isBasic(i[0]); }).map(function (i) { return i[0]; }).join(' · ')) + '</p></div>' +
      '<span class="sp-stamp sp-yes">ADD TO PLAN</span><span class="sp-stamp sp-no">SKIP</span></div>';
  }
  function decide(like) {
    var s = st.swipeSlot, q = queue(s), id = q[0]; if (!id) return;
    if (like && !addToPlan(id, s)) return;
    q.push(q.shift()); st.queue[s] = q; save();
    var el = root.querySelector('.sp-sc[data-id]');
    if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = 'translateX(' + (like ? 140 : -140) + '%) rotate(' + (like ? 18 : -18) + 'deg)'; el.style.opacity = '0';
      setTimeout(renderSwipe, 220);
    } else renderSwipe();
  }
  function bindDrag() {
    var el = root.querySelector('.sp-sc[data-id]'); if (!el) return;
    var x0 = null, dx = 0, yes = el.querySelector('.sp-stamp.sp-yes'), no = el.querySelector('.sp-stamp.sp-no');
    el.addEventListener('pointerdown', function (e) { x0 = e.clientX; dx = 0; el.classList.add('sp-drag'); el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', function (e) { if (x0 === null) return; dx = e.clientX - x0; el.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 18 + 'deg)'; yes.style.opacity = Math.max(0, Math.min(1, dx / 100)); no.style.opacity = Math.max(0, Math.min(1, -dx / 100)); });
    function end() { if (x0 === null) return; x0 = null; el.classList.remove('sp-drag'); if (Math.abs(dx) > 100) decide(dx > 0); else { el.style.transform = ''; yes.style.opacity = 0; no.style.opacity = 0; if (Math.abs(dx) < 5) openRecipe(el.dataset.id); } }
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
  $('sp-p-swipe').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'sp-like') decide(true); else if (b.id === 'sp-nope') decide(false);
    else if (b.id === 'sp-info') { var q = queue(st.swipeSlot); if (q[0]) openRecipe(q[0]); }
    else if (b.dataset.sw) { st.swipeSlot = b.dataset.sw; save(); renderSwipe(); }
  });
  document.addEventListener('keydown', function (e) {
    if (st.tab !== 'swipe' || !$('sp-modal').hidden || /input|textarea|select/i.test(e.target.tagName)) return;
    var r = $('sp-deck') && $('sp-deck').getBoundingClientRect(); if (!r || r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); decide(true); } else if (e.key === 'ArrowLeft') { e.preventDefault(); decide(false); }
  });

  function renderTab() {
    var s = st.tab === 'search';
    $('sp-t-search').setAttribute('aria-selected', s); $('sp-t-swipe').setAttribute('aria-selected', !s);
    $('sp-p-search').hidden = !s; $('sp-p-swipe').hidden = s;
    if (s) renderSearch(); else renderSwipe();
  }
  $('sp-t-search').addEventListener('click', function () { st.tab = 'search'; save(); renderTab(); });
  $('sp-t-swipe').addEventListener('click', function () { st.tab = 'swipe'; save(); renderTab(); });

  // ---------- 3. Wochenplan ----------
  function renderPlan() {
    var ds = days(), ss = slots();
    var h = '<thead><tr><th class="sp-sl" scope="col"><span class="sp-sr">Mahlzeit</span></th>' + ds.map(function (d) { return '<th scope="col"' + (d > 4 ? ' class="sp-we"' : '') + '>' + DAYS[d] + '</th>'; }).join('') + '</tr></thead><tbody>';
    ss.forEach(function (s) {
      h += '<tr><th class="sp-sl" scope="row">' + s.l + '</th>';
      ds.forEach(function (d) {
        var id = st.plan[cellKey(d, s.id)], r = id && byId[id];
        h += '<td>' + (r ? '<div class="sp-cell"><button class="sp-cn" data-open="' + r.id + '">' + esc(r.n) + '</button><button class="sp-x" data-del="' + cellKey(d, s.id) + '" aria-label="' + esc(r.n) + ' on ' + DAYS[d] + ': remove">×</button></div>' : '<span class="sp-free">free</span>') + '</td>';
      });
      h += '</tr>';
    });
    $('sp-grid').innerHTML = h + '</tbody>';
    var n = planCount(), t = totalCells();
    $('sp-count').textContent = n + ' of ' + t + ' slots planned · for ' + who();
  }
  $('sp-grid').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.del) { delete st.plan[b.dataset.del]; save(); renderPlan(); if (st.tab === 'swipe') renderSwipe(); }
  });
  $('sp-fill').addEventListener('click', function () { autoFill(); if (st.tab === 'swipe') renderSwipe(); });
  $('sp-clear').addEventListener('click', function () { st.plan = {}; save(); renderPlan(); if (st.tab === 'swipe') renderSwipe(); toast('Plan cleared.'); });

  // ---------- Rezept-Details ----------
  var lastFocus = null;
  function openRecipe(id) {
    var r = byId[id]; if (!r) return; lastFocus = document.activeElement;
    var f = factor();
    var meta = [r.s.map(function (s) { return slot(s).l; }).join(', ')]; if (r.t) meta.push(r.t + ' min'); if (r.kcal) meta.push(r.kcal + ' kcal / ' + r.p + ' g protein per serving');
    $('sp-dialog').innerHTML = '<button class="sp-close" id="sp-close" aria-label="Close">×</button>' + imgTag(r) + '<div class="sp-dbody">' +
      (r.src === 'blog' ? '<span class="sp-blog">From the blog</span>' : '') + '<h2 id="sp-mt">' + esc(r.n) + '</h2><span class="sp-meta">' + esc(meta.join(' · ')) + '</span>' +
      '<h3>Ingredients for ' + esc(who()) + '</h3><ul>' + r.i.map(function (i) { return '<li><strong>' + esc(fmtQty(i[1] * f, i[2])) + '</strong> ' + esc(i[0]) + '</li>'; }).join('') + '</ul>' +
      (r.z ? '<h3>Method</h3><p>' + esc(r.z) + '</p>' : '') +
      (r.url ? '<p><a href="' + esc(r.url) + '">Full recipe on the blog (German) →</a></p>' : '') +
      '<div class="sp-add">' + r.s.map(function (s) { return '<button data-add="' + r.id + '" data-s="' + s + '">+ ' + slot(s).l + '</button>'; }).join('') + '</div></div>';
    $('sp-modal').hidden = false; $('sp-close').focus();
  }
  function closeModal() { $('sp-modal').hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $('sp-modal').addEventListener('click', function (e) { if (e.target.id === 'sp-modal' || e.target.closest('#sp-close')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('sp-modal').hidden) closeModal(); });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.open) openRecipe(b.dataset.open);
    else if (b.dataset.add) { if (addToPlan(b.dataset.add, b.dataset.s) && !$('sp-modal').hidden) closeModal(); if (st.tab === 'swipe') renderSwipe(); }
  });

  // ---------- PDF ----------
  var C = { green: [15, 107, 63], deep: [11, 61, 42], accent: [217, 105, 42], ivory: [250, 247, 242], tint: [238, 245, 240], line: [213, 229, 218], text: [17, 24, 39], muted: [95, 102, 112], white: [255, 255, 255] };
  var FONTS = [['Inter', 'normal', 'assets/fonts/pdf/inter-latin-400-normal.ttf'], ['Inter', 'semibold', 'assets/fonts/pdf/inter-latin-600-normal.ttf'],
    ['Inter', 'bold', 'assets/fonts/pdf/inter-latin-700-normal.ttf'], ['Playfair', 'bold', 'assets/fonts/pdf/playfair-display-latin-700-normal.ttf']];
  var libP = null, fontData = null;
  function loadLib() {
    if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
    if (libP) return libP;
    libP = new Promise(function (res, rej) { var s = document.createElement('script'); s.src = ASSET + 'de/vendor/jspdf.umd.min.js'; s.onload = function () { window.jspdf ? res(window.jspdf.jsPDF) : rej(); }; s.onerror = function () { libP = null; rej(); }; document.head.appendChild(s); });
    return libP;
  }
  function b64(buf) { var a = new Uint8Array(buf), s = ''; for (var i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); }
  function loadFonts() {
    if (fontData) return Promise.resolve(fontData);
    return Promise.all(FONTS.map(function (f) { return fetch(ASSET + f[2]).then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(function (b) { return { n: f[0], s: f[1], file: f[2].split('/').pop(), d: b64(b) }; }); }))
      .then(function (l) { fontData = l; return l; });
  }
  function shopping() {
    var f = factor(), items = {};
    days().forEach(function (d) { st.slots.forEach(function (s) { var r = byId[st.plan[cellKey(d, s)]]; if (!r) return;
      r.i.forEach(function (i) { var k = i[0] + '|' + i[2]; if (!items[k]) items[k] = { n: i[0], u: i[2], q: 0, w: [] }; items[k].q += i[1] * f; var w = SHORT[d]; if (items[k].w.indexOf(w) < 0) items[k].w.push(w); }); }); });
    return Object.keys(items).map(function (k) { return items[k]; }).sort(function (a, b) { return isBasic(a.n) - isBasic(b.n) || a.n.localeCompare(b.n, 'de'); });
  }
  function buildPdf(jsPDF, fonts) {
    var doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4', compress: true });
    fonts.forEach(function (f) { doc.addFileToVFS(f.file, f.d); doc.addFont(f.file, f.n, f.s); });
    doc.setProperties({ title: 'My Meal Prep Weekly Plan', author: 'meal-prep.tech', creator: 'meal-prep.tech' });
    var page = 0;
    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); } function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); } function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function font(n, s, z) { doc.setFont(n, s); doc.setFontSize(z); }
    function W() { return doc.internal.pageSize.getWidth(); } function H() { return doc.internal.pageSize.getHeight(); }
    function bg() { fill(C.ivory); doc.rect(0, 0, W(), H(), 'F'); }
    function footer() { page++; font('Inter', 'normal', 9); color(C.muted); doc.text('Made with the weekly planner on meal-prep.tech', 36, H() - 20); doc.text('Page ' + page, W() - 36, H() - 20, { align: 'right' }); }
    function title(t, sub, x) { fill(C.accent); doc.rect(x, 30, 28, 2.5, 'F'); font('Playfair', 'bold', 30); color(C.deep); doc.text(t, x, 64); font('Inter', 'normal', 12.5); color(C.muted); doc.text(sub, x, 84); }
    function wrapWords(text, maxW) {
      var tokens = []; text.split(/\s+/).forEach(function (w, wi) { var parts = doc.getTextWidth(w) > maxW ? w.split(/(?<=-)/) : [w]; parts.forEach(function (p, pi) { tokens.push({ t: p, sp: wi > 0 && pi === 0 }); }); });
      var lines = [], cur = ''; tokens.forEach(function (tk) { var nx = cur ? cur + (tk.sp ? ' ' : '') + tk.t : tk.t; if (cur && doc.getTextWidth(nx) > maxW) { lines.push(cur); cur = tk.t; } else cur = nx; }); if (cur) lines.push(cur); return lines;
    }
    // Seite 1: Wochenplan
    bg(); var ds = days(), ss = slots();
    title('My Meal Prep Weekly Plan', 'for ' + who() + (st.diets.length ? '  ·  ' + DIETS.filter(function (d) { return st.diets.indexOf(d.id) >= 0; }).map(function (d) { return d.l.toLowerCase(); }).join(', ') : ''), 36);
    font('Inter', 'normal', 11.5); color(C.text); doc.text('Week from ____________ to ____________', W() - 36, 60, { align: 'right' }); doc.text('Prep day: ____________', W() - 36, 80, { align: 'right' });
    var left = 36, top = 104, labelW = 92, colW = (W() - 2 * left - labelW) / ds.length, headH = 28, rowH = Math.min(120, (H() - top - 90 - headH) / ss.length);
    ds.forEach(function (d, i) { var x = left + labelW + i * colW; fill(d < 5 ? C.green : C.deep); doc.rect(x + 1, top, colW - 2, headH, 'F'); font('Playfair', 'bold', 13); color(C.white); doc.text(DAYS[d], x + colW / 2, top + 18.5, { align: 'center' }); });
    ss.forEach(function (s, ri) {
      var y0 = top + headH + ri * rowH; fill(ri % 2 ? C.white : C.tint); doc.rect(left, y0, W() - 2 * left, rowH, 'F');
      font('Playfair', 'bold', 13); color(C.deep); doc.text(s.l, left + 10, y0 + rowH / 2 + 4);
      ds.forEach(function (d, i) {
        var x = left + labelW + i * colW; stroke(C.line); doc.setLineWidth(0.6); doc.rect(x, y0, colW, rowH, 'S');
        var r = byId[st.plan[cellKey(d, s.id)]]; var txt = r ? r.n : ''; if (!txt) return;
        var size = 12, maxW = colW - 16; font('Inter', 'semibold', size); color(C.text);
        var lines = wrapWords(txt, maxW), wid = lines.reduce(function (m, l) { return Math.max(m, doc.getTextWidth(l)); }, 0);
        if (wid > maxW) { size = Math.max(9, size * maxW / wid); doc.setFontSize(size); lines = wrapWords(txt, maxW); }
        doc.text(lines.slice(0, Math.floor((rowH - 14) / (size * 1.3))), x + 8, y0 + 22, { lineHeightFactor: 1.3 });
      });
    });
    stroke(C.line); doc.rect(left, top, W() - 2 * left, headH + ss.length * rowH, 'S');
    var ny = top + headH + ss.length * rowH + 26; font('Playfair', 'bold', 13); color(C.deep); doc.text('Notes', 36, ny); stroke([201, 214, 205]); doc.setLineWidth(0.5); if (ny + 18 < H() - 34) doc.line(36, ny + 18, W() - 36, ny + 18);
    footer();
    // Seite 2: Einkaufsliste
    doc.addPage('a4', 'portrait'); bg(); title('Shopping list', 'Amounts for ' + who() + ', combined for the week.', 48);
    var items = shopping(), colX = [48, W() / 2 + 6], cw = W() / 2 - 54, y = 124, col = 0, startY = 124, lh = 34, per = Math.floor((H() - startY - 60) / lh);
    items.forEach(function (it, i) {
      if (i && i % per === 0) { col++; y = startY; if (col > 1) { footer(); doc.addPage('a4', 'portrait'); bg(); col = 0; y = startY = 60; per = Math.floor((H() - startY - 60) / lh); } }
      var x = colX[col]; stroke(C.green); doc.setLineWidth(0.8); doc.roundedRect(x, y - 8, 8.5, 8.5, 1.5, 1.5, 'S');
      font('Inter', 'bold', 11.5); color(C.text); doc.text(fmtQty(it.q, it.u), x + 18, y);
      font('Inter', 'normal', 11.5); doc.text(doc.splitTextToSize(it.n, cw - 104)[0], x + 98, y);
      font('Inter', 'normal', 9); color(C.muted); doc.text((isBasic(it.n) ? 'Basics · ' : '') + it.w.join(', '), x + 98, y + 12);
      stroke(C.line); doc.setLineWidth(0.4); doc.line(x, y + 20, x + cw, y + 20); y += lh;
    });
    if (!items.length) { font('Inter', 'normal', 12); color(C.muted); doc.text('No dishes in your plan yet.', 48, y); }
    footer();
    // Rezepte
    var ids = []; days().forEach(function (d) { st.slots.forEach(function (s) { var id = st.plan[cellKey(d, s)]; if (id && ids.indexOf(id) < 0) ids.push(id); }); });
    if (ids.length) {
      doc.addPage('a4', 'portrait'); bg(); title('This week\'s recipes', 'Amounts per meal for ' + who() + '.', 48); y = 112;
      var f = factor();
      ids.forEach(function (id) {
        var r = byId[id]; font('Inter', 'normal', 11); var zl = r.z ? doc.splitTextToSize(r.z, W() - 140) : [];
        var ingRows = Math.ceil(r.i.length / 2), bh = 60 + ingRows * 17 + (zl.length ? 20 + zl.length * 14.5 : 0) + (r.url ? 18 : 0);
        if (y + bh > H() - 48) { footer(); doc.addPage('a4', 'portrait'); bg(); y = 48; }
        fill(C.white); stroke(C.line); doc.setLineWidth(0.8); doc.roundedRect(48, y, W() - 96, bh, 8, 8, 'FD');
        font('Playfair', 'bold', 17); color(C.deep); doc.text(doc.splitTextToSize(r.n, W() - 140)[0], 64, y + 26);
        var meta = r.s.map(function (s) { return slot(s).s; }).join(' · ') + (r.t ? ' · ' + r.t + ' min' : '') + (r.src === 'blog' ? ' · from the blog' : '');
        font('Inter', 'semibold', 9.5); color(C.accent); doc.text(meta.toUpperCase(), 64, y + 42);
        var iy = y + 62, half = (W() - 128) / 2;
        r.i.forEach(function (i, k) { var cx = 64 + (k % 2) * half, cy = iy + Math.floor(k / 2) * 17; font('Inter', 'bold', 11); color(C.text); doc.text(fmtQty(i[1] * f, i[2]), cx, cy); font('Inter', 'normal', 11); doc.text(doc.splitTextToSize(i[0], half - 80)[0], cx + 66, cy); });
        var zy = iy + ingRows * 17 + 8;
        if (zl.length) { font('Inter', 'semibold', 10.5); color(C.green); doc.text('Method', 64, zy); font('Inter', 'normal', 11); color(C.text); doc.text(zl, 64, zy + 16, { lineHeightFactor: 1.32 }); zy += 20 + zl.length * 14.5; }
        if (r.url) { font('Inter', 'semibold', 10); color(C.accent); doc.textWithLink('Full recipe on meal-prep.tech', 64, zy + 4, { url: r.url }); }
        y += bh + 12;
      });
      footer();
    }
    return doc;
  }
  $('sp-pdf').addEventListener('click', function () {
    var b = this, stEl = $('sp-pdf-status');
    if (!planCount()) { autoFill(); }
    b.disabled = true; var lbl = b.textContent; b.textContent = 'Creating PDF …';
    Promise.all([loadLib(), loadFonts()]).then(function (r) { buildPdf(r[0], r[1]).save('meal-prep-weekly-plan.pdf'); stEl.textContent = 'Done – your weekly plan has been downloaded.'; })
      .catch(function () { stEl.textContent = 'The PDF could not be created. Please try again.'; })
      .then(function () { b.disabled = false; b.textContent = lbl; });
  });

  renderSetup(); renderTab(); renderPlan();
})();
