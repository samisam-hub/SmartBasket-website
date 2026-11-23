/* Meal Prep Wochenplaner (meal-prep.tech): Rezepte aus der SmartBasket-App und dem Blog,
   Suche nach Zutaten, Wischen nach Kategorie, automatische Wochenplan-Vorlage und PDF-Download.
   Daten: window.SB_REZEPTE, Bilder: window.SB_IMG_BASE, PDF-Dateien: window.SB_PDF_ASSET_BASE. */
(function () {
  'use strict';
  var R = window.SB_REZEPTE || [];
  var root = document.getElementById('sb-planer');
  if (!root || !R.length) return;
  var IMG = window.SB_IMG_BASE || '';
  var ASSET = window.SB_PDF_ASSET_BASE || '';
  var KEY = 'sb-wochenplaner-v1';

  var SLOTS = [{ id: 'f', l: 'Frühstück', s: 'Frühstück' }, { id: 'm', l: 'Mittagessen', s: 'Mittag' },
    { id: 'a', l: 'Abendessen', s: 'Abend' }, { id: 's', l: 'Snack', s: 'Snack' }];
  var DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  var SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  var DIETS = [{ id: 'vegetarian', l: 'Vegetarisch' }, { id: 'vegan', l: 'Vegan' }, { id: 'gluten_free', l: 'Glutenfrei' }, { id: 'lactose_free', l: 'Laktosefrei' }];
  var BASICS = ['salz', 'pfeffer', 'olivenöl', 'sonnenblumenöl', 'rapsöl', 'zucker', 'wasser', 'gemüsebrühe pulver'];
  var SUGGEST = ['Kartoffeln', 'Eier', 'Nudeln', 'Reis', 'Hähnchenbrust', 'Linsen', 'Brokkoli', 'Spinat', 'Haferflocken', 'Tomate', 'Lachsfilet', 'Naturtofu'];

  // Automatische Meal-Prep-Einordnung für Rezepte ohne Handangabe (z. B. neue Blog-Rezepte).
  // Handangaben (mp/k/fz in den Rezeptdaten) haben immer Vorrang.
  function autoMp(r) {
    var name = (r.n || '').toLowerCase(), all = (name + ' ' + r.i.map(function (i) { return i[0]; }).join(' ')).toLowerCase(), t = r.t || 0;
    var main = r.s.indexOf('m') >= 0 || r.s.indexOf('a') >= 0, bf = r.s.indexOf('f') >= 0 && !main;
    // 1) Nur frisch gut (aufgewärmt matschig/zäh)
    if (/schnitzel|paniert|panko|pfannkuchen|pancake|pizza|flammkuchen|tarte flamb|steak|reibekuchen|fritter|arme ritter|french toast|omelett|omelette|spätzle|spaetzle|gnocchi|wrap|fischstäbchen|fish finger|bratkartoffel|fried potato|bratwurst|pesto|milchreis|rice pudding|grießbrei|semolina|ente|duck|gratin|maultasche|dumpling|tortellini|mozzarella|caprese/.test(name) || (main && /spiegelei|fried egg|mit ei\b|with egg\b|and egg\b/.test(name))) return { mp: 'f' };
    // 2) Frühstück
    if (bf) {
      if (/über nacht|übernacht|eingeweicht|overnight|chia/.test(name)) return { mp: 'p', k: 3 };
      if (t > 30 && /brötchen|muffin|bun|roll|bake|backen|brot/.test(name)) return { mp: 'p', k: 3, fz: 1 };
      if (/tofu|linsen|lentil|kartoffel|potato|bohnen|bean/.test(all) && !/brot|bread|toast/.test(name)) return { mp: 'p', k: 3 };
      return { mp: !t || t <= 25 ? 'q' : 'f' };
    }
    if (/blattsalat|lettuce|rucola|rocket/.test(all)) return { mp: 'f' };
    // 3) Hauptgerichte
    if (main && /lachs|salmon|thunfisch|tuna|forelle|trout|kabeljau|\bcod\b|garnele|shrimp|prawn|fisch|fish/.test(all)) return { mp: 'p', k: 2 };
    if (/eintopf|stew|curry|chili|suppe|soup|gulasch|goulash|bolognese|lasagne|auflauf|\bbake\b|borschtsch|borscht|\bdal\b|ragout|frikadelle|patties|meatball|kotlety|pirozhki|piroggen/.test(name)) return { mp: 'p', k: 4, fz: 1 };
    if (/brot|brötchen|toast|sandwich|lunchbox|brotdose|brotzeit|bread plate/.test(name)) return { mp: 'q' };
    if (r.s.indexOf('s') >= 0 && !main) return t > 20 ? { mp: 'p', k: 3 } : { mp: 'q' };
    if (main && /reis|rice|nudel|pasta|spaghetti|noodle|hähnchen|chicken|pute|turkey|linsen|lentil|kichererbsen|chickpea|kartoffel|potato|tofu|bohnen|bean|rind|beef|lamm|lamb/.test(all)) return { mp: 'p', k: 3 };
    return { mp: t && t <= 15 ? 'q' : 'f' };
  }
  R.forEach(function (r) { if (!r.mp) { var a = autoMp(r); r.mp = a.mp; if (a.k) r.k = a.k; if (a.fz) r.fz = 1; r.mpAuto = 1; } });
  var byId = {}; R.forEach(function (r) { byId[r.id] = r; });
  var T = { modeL: 'Planungsmodus', modes: [{ id: 'prep', l: 'Meal Prep', h: 'Wenige Kochtage, Gerichte reichen für 2–3 Mahlzeiten.' }, { id: 'mix', l: 'Gemischt', h: 'Mittags Meal Prep, an 2–3 Abenden frisch kochen.' }],
    cookL: 'Kochtage', cookH: 'An diesen Tagen wird vorgekocht.', favL: 'Deine Favoriten', favNone: 'Noch keine Favoriten. Wisch nach rechts oder tippe ♥ – der Planer nimmt dann passende Gerichte für dich.',
    favAdd: '♥ Merken', favOn: '♥ Gemerkt', favToast: ' gemerkt', favOff: ' entfernt', planBtn: 'Woche automatisch planen',
    tagP: 'vom ', tagF: 'frisch', tagQ: 'schnell', cookTitle: 'Dein Kochplan', cookOn: 'kochen', fresh: 'Frisch', meals: ' Mahlzeiten', meal: ' Mahlzeit',
    sumA: 'Du kochst ', sumB: '× für ', sumC: ' Haupt-Mahlzeiten', freeze: 'lässt sich einfrieren', moreCook: 'Tipp: Wähle einen weiteren Kochtag – sonst wären manche Portionen älter als ihre Haltbarkeit.',
    planned: 'Woche geplant: ', likeHint: 'Nach rechts wischen = merken · nach links = überspringen · Pfeiltasten gehen auch', favCount: ' Favoriten gemerkt', stamp: 'MERKEN', kcalL: 'kcal pro Erwachsenem', goal: 'Ziel ', portion: 'Portion ', offH: 'Weicht über 10 % vom Ziel ab – Portionen sind auf 60–160 % begrenzt. Ein weiteres Gericht oder einen Snack einplanen.', tgtL: 'Kalorienziel pro Tag', tgtA: 'Erwachsene', tgtK: 'Kinder', tgtH: 'Grobe Orientierung: Frauen ca. 1.900, Männer ca. 2.400 kcal, Kinder je nach Alter 1.200–2.000 kcal. Die Portionen werden pro Tag passend skaliert – Einkaufsliste und Kosten rechnen mit.', costL: 'Kosten ca.', costH: 'Geschätzte Lebensmittelkosten für deinen Haushalt, anteilig nach Rezeptmenge (Durchschnittspreise, ohne Basics wie Salz).', weekC: ' · ca. ', weekC2: ' € pro Woche', loc: 'de-DE', dockT: 'Zum Einplanen ziehen', dockHint: 'Gericht auf ein Feld ziehen = ersetzen · Felder aufeinander ziehen = tauschen · Feld auf die Leiste ziehen = entfernen. Auf dem Handy: ⠿ antippen, dann Ziel antippen.', dockNone: 'Merk dir Gerichte (♥), dann erscheinen sie hier.', swapped: 'Getauscht', placed: ' eingesetzt', removedT: 'Aus dem Plan genommen', tooOld: 'länger als haltbar', grip: 'Verschieben', dropOut: 'Hierher ziehen zum Entfernen', mpP: 'Meal Prep geeignet', mpQ: 'schnell frisch gemacht', mpF: 'nur frisch', keepT: ' Tage haltbar', autoT: 'automatisch eingeschätzt', onlyMix: 'frisch – im Modus Gemischt', fill: 'Leere Plätze werden mit passenden Gerichten ergänzt.' };
  Object.assign(T, { calcBtn: 'Aus Körperdaten berechnen', calcDone: 'Fertig', pers: 'Person ', kidL: 'Kind ', sexL: 'Geschlecht', sexes: [['w', 'weiblich'], ['m', 'männlich']], ageL: 'Alter', hL: 'Größe (cm)', wL: 'Gewicht (kg)', actL: 'Aktivität',
    acts: [[1.2, 'überwiegend sitzend'], [1.375, 'leicht aktiv (1–3× Sport/Woche)'], [1.55, 'mäßig aktiv (3–5× Sport/Woche)'], [1.725, 'sehr aktiv (6–7× Sport/Woche)'], [1.9, 'körperliche Arbeit + Sport']],
    goalL: 'Ziel', goals: [[0, 'Gewicht halten'], [-400, 'leicht abnehmen'], [300, 'zunehmen']], perDay: ' kcal/Tag',
    calcH: 'Berechnet mit der Mifflin-St-Jeor-Formel × Aktivitätsfaktor – eine Schätzung, keine medizinische Beratung. Kinder: grobe Richtwerte nach Alter. Für die Portionen zählt der Durchschnitt der Erwachsenen, die Einkaufsliste rechnet mit der Summe.' });
  function typ(r) { return (r && r.mp) || 'f'; }
  function keepD(r) { return (r && r.k) || 0; }
  function isFav(id) { return st.fav.indexOf(id) >= 0; }
  function setFav(id, on) { var i = st.fav.indexOf(id); if (on && i < 0) st.fav.push(id); if (!on && i >= 0) st.fav.splice(i, 1); save(); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var STAPLE = /nudel|spaghetti|pasta|reis|rice|kartoffel|potato|brot|bread|toast|tortilla|mehl|flour|zwiebel|onion|knoblauch|garlic|petersilie|parsley|pfeffer|pepper|salz|salt|öl|oil|butter|milch|milk/i;
  function ingSet(r) { var o = {}; r.i.forEach(function (i) { if (!isBasic(i[0]) && !STAPLE.test(i[0])) o[i[0].toLowerCase()] = 1; }); return o; }
  function base(r) { return (r.n.split(/[\s-]/)[0] || '').toLowerCase(); }
  function overlap(r, pool) { var a = ingSet(r), n = 0; Object.keys(pool).forEach(function (k) { if (a[k]) n++; }); return n; }
  // Tage seit dem Kochtag c bis zum Tag d (0 = am Kochtag selbst)
  function since(d, c) { return ((d - c) % 7 + 7) % 7; }
  function cpos(c) { return c === 6 ? -1 : c; } // Sonntag kocht für die kommende Woche
  function age(d, c, s) { var o = d - cpos(c); if (o < 0 || (o === 0 && s !== 'a')) o += 7; return o; }
  var ING = []; (function () { var seen = {}; R.forEach(function (r) { r.i.forEach(function (i) { var k = i[0].toLowerCase(); if (!seen[k]) { seen[k] = 1; ING.push(i[0]); } }); }); ING.sort(function (a, b) { return a.localeCompare(b, 'de'); }); })();

  function defaults() { return { adults: 2, kids: 0, days: [0, 1, 2, 3, 4], slots: ['f', 'm', 'a'], diets: [], plan: {}, meta: {}, fav: [], kcalA: 2000, kcalK: 1500, prof: { a: [], k: [] }, calc: false, mode: 'prep', cook: [6, 2], have: [], q: '', tab: 'swipe', fslot: '', swipeSlot: 'm', queue: {}, shown: 12 }; }
  var st = defaults();
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) Object.keys(st).forEach(function (k) { if (k in saved) st[k] = saved[k]; }); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  // ---------- Helfer ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function imgSrc(r) { return r.img ? (/^https?:/.test(r.img) ? r.img : IMG + r.img) : ''; }
  function imgTag(r, cls) { var s = imgSrc(r); return s ? '<img src="' + esc(s) + '" alt="" loading="lazy" decoding="async"' + (cls ? ' class="' + cls + '"' : '') + '>' : '<div class="sp-noimg' + (cls ? ' ' + cls : '') + '"></div>'; }
  function slot(id) { for (var i = 0; i < SLOTS.length; i++) if (SLOTS[i].id === id) return SLOTS[i]; }
  function allowed(r) { return st.diets.every(function (d) { return r.d.indexOf(d) >= 0; }); }
  function factor() { return Math.max(0.6, st.adults + st.kids * kidShare()); }
  function kidShare() { return Math.min(1, Math.max(0.3, (st.kcalK || 1500) / (st.kcalA || 2000))); }
  // Portionsgröße je Tag so skalieren, dass die geplanten Mahlzeiten zum Kalorienziel passen
  function dayKcal(d) { var k = 0; st.slots.forEach(function (s) { var r = byId[st.plan[cellKey(d, s)]]; if (r && r.kcal) k += r.kcal; }); return k; }
  function dayMult(d) { var k = dayKcal(d); return k ? Math.min(1.6, Math.max(0.6, (st.kcalA || 2000) / k)) : 1; }
  // Kalorienbedarf aus Körperdaten (Mifflin-St Jeor × Aktivitätsfaktor); Kinder: grobe Richtwerte nach Alter
  function adultNeed(p) { var bmr = 10 * p.w + 6.25 * p.h - 5 * p.age + (p.sx === 'm' ? 5 : -161); return Math.round((bmr * p.act + (p.goal || 0)) / 10) * 10; }
  function kidNeed(p) { var a = p.age; return a <= 3 ? 1100 : a <= 6 ? 1400 : a <= 9 ? 1700 : a <= 12 ? 2000 : a <= 14 ? 2300 : 2500; }
  function syncProf() {
    var pa = st.prof.a, pk = st.prof.k;
    while (pa.length < st.adults) pa.push(pa.length % 2 ? { sx: 'm', age: 35, h: 180, w: 80, act: 1.375, goal: 0 } : { sx: 'w', age: 35, h: 168, w: 65, act: 1.375, goal: 0 });
    while (pk.length < st.kids) pk.push({ age: 8 });
  }
  function applyProf() {
    syncProf(); var a = st.prof.a.slice(0, st.adults), k = st.prof.k.slice(0, st.kids);
    if (a.length) st.kcalA = Math.max(1200, Math.min(4000, Math.round(a.reduce(function (s, p) { return s + adultNeed(p); }, 0) / a.length / 50) * 50));
    if (k.length) st.kcalK = Math.max(800, Math.min(3000, Math.round(k.reduce(function (s, p) { return s + kidNeed(p); }, 0) / k.length / 50) * 50));
  }
  function calcForm() {
    syncProf(); var sel = function (f, i, opts, v) { return '<select data-pf="' + f + '" data-i="' + i + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(o[0]) === String(v) ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>'; };
    var num = function (f, i, v, mn, mx, g) { return '<input type="number" inputmode="numeric" data-pf="' + f + '" data-i="' + i + '" data-g="' + g + '" value="' + v + '" min="' + mn + '" max="' + mx + '">'; };
    var h = '<div class="sp-calc"><div class="sp-calc-grid">';
    st.prof.a.slice(0, st.adults).forEach(function (p, i) {
      h += '<fieldset><legend>' + T.pers + (i + 1) + ' · <strong data-res="a' + i + '">' + adultNeed(p).toLocaleString(T.loc) + T.perDay + '</strong></legend>' +
        '<label>' + T.sexL + sel('sx', i, T.sexes, p.sx) + '</label><label>' + T.ageL + num('age', i, p.age, 16, 100, 'a') + '</label>' +
        '<label>' + T.hL + num('h', i, p.h, 120, 220, 'a') + '</label><label>' + T.wL + num('w', i, p.w, 35, 250, 'a') + '</label>' +
        '<label class="sp-wide">' + T.actL + sel('act', i, T.acts, p.act) + '</label><label class="sp-wide">' + T.goalL + sel('goal', i, T.goals, p.goal || 0) + '</label></fieldset>';
    });
    st.prof.k.slice(0, st.kids).forEach(function (p, i) {
      h += '<fieldset><legend>' + T.kidL + (i + 1) + ' · <strong data-res="k' + i + '">' + kidNeed(p).toLocaleString(T.loc) + T.perDay + '</strong></legend><label>' + T.ageL + '<input type="number" inputmode="numeric" data-pf="age" data-i="' + i + '" data-g="k" value="' + p.age + '" min="1" max="17"></label></fieldset>';
    });
    return h + '</div><p class="sp-mini">' + T.calcH + '</p><button class="sp-btn sp-sec" data-calc="0">' + T.calcDone + '</button></div>';
  }
  function who() { var p = []; if (st.adults) p.push(st.adults + (st.adults === 1 ? ' erwachsene Person' : ' Erwachsene')); if (st.kids) p.push(st.kids + (st.kids === 1 ? ' Kind' : ' Kinder')); return p.join(' und ') || '1 Person'; }
  function isBasic(name) { var n = name.toLowerCase(); return BASICS.some(function (b) { return n.indexOf(b) >= 0; }); }
  function fmtQty(q, unit) {
    if (unit === 'g' || unit === 'ml') {
      var v = q < 20 ? Math.ceil(q) : Math.ceil(q / 10) * 10;
      if (v >= 1000) return (Math.round(v / 100) / 10).toString().replace('.', ',') + (unit === 'g' ? ' kg' : ' l');
      return v + ' ' + unit;
    }
    return (Math.ceil(q * 2) / 2).toString().replace('.', ',') + ' ' + unit;
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
    if (d < 0) { toast('Alle ' + slot(s).s + '-Plätze sind belegt. Entferne ein Gericht oder wähle mehr Tage.'); return false; }
    st.plan[cellKey(d, s)] = id; st.meta[cellKey(d, s)] = typ(byId[id]) === 'p' ? {} : { t: typ(byId[id]) }; save(); renderPlan(); renderSetup();
    toast(byId[id].n + ' → ' + DAYS[d] + ', ' + slot(s).s);
    return true;
  }
  // ---------- Plan bearbeiten: Leiste + Ziehen/Tauschen ----------
  var dnd = { sel: null };
  function srcCook(d, s) { var best = null, bo = 99; (st.cook.length ? st.cook : [6]).forEach(function (c) { var o = age(d, c, s); if (o < bo) { bo = o; best = c; } }); return best; }
  function metaFor(id, k) { var r = byId[id], p = k.split('-'), d = +p[0], s = p[1]; return typ(r) === 'p' && (s === 'm' || s === 'a' || s === 'f' || s === 's') ? { t: 'p', c: srcCook(d, s) } : { t: typ(r) }; }
  function applyDrop(src, key) {
    if (!src) return;
    if (key === 'out') { if (src.cell && st.plan[src.cell]) { delete st.plan[src.cell]; delete st.meta[src.cell]; toast(T.removedT); } }
    else if (src.cell) { if (src.cell === key) return; var a = st.plan[src.cell], am = st.meta[src.cell], b = st.plan[key], bm = st.meta[key];
      if (b) { st.plan[src.cell] = b; st.meta[src.cell] = bm || {}; } else { delete st.plan[src.cell]; delete st.meta[src.cell]; }
      st.plan[key] = a; st.meta[key] = am || {}; toast(T.swapped); }
    else if (src.id) { st.plan[key] = src.id; st.meta[key] = metaFor(src.id, key); toast(byId[src.id].n + T.placed); }
    dnd.sel = null; save(); renderPlan();
  }
  function renderDock() {
    var el = $('sp-dock'); if (!el) return;
    el.innerHTML = '<h3>' + T.dockT + '</h3><div class="sp-dock-list" data-drop="out" title="' + T.dropOut + '">' + (st.fav.length ? st.fav.map(function (id) { var r = byId[id]; if (!r) return '';
      return '<div class="sp-di' + (dnd.sel && dnd.sel.id === id ? ' sp-sel' : '') + '" data-drag-id="' + id + '">' + imgTag(r, 'sp-dimg') + '<span class="sp-dn">' + esc(r.n) + '</span><span class="sp-grip" role="button" tabindex="0" aria-label="' + esc(r.n) + ': ' + T.grip + '">⠿</span></div>'; }).join('') : '<p class="sp-mini">' + T.dockNone + '</p>') + '</div><p class="sp-mini">' + T.dockHint + '</p>';
  }
  (function () {
    var drag = null, ghost = null, over = null, suppress = false;
    root.addEventListener('click', function (e) { if (suppress) { e.stopPropagation(); e.preventDefault(); suppress = false; } }, true);
    function srcOf(el) { var c = el.closest('[data-drag-cell]'), i = el.closest('[data-drag-id]'); return c ? { cell: c.dataset.dragCell, el: c } : i ? { id: i.dataset.dragId, el: i } : null; }
    function targetAt(x, y) { var e = document.elementFromPoint(x, y); if (!e) return null; var td = e.closest('#sp-grid td[data-cell]'); if (td) return td; var o = e.closest('[data-drop="out"]'); return o || null; }
    function mark(t) { if (over === t) return; if (over) over.classList.remove('sp-over'); over = t; if (over) over.classList.add('sp-over'); }
    function end() { if (ghost) ghost.remove(); ghost = null; mark(null); document.body.classList.remove('sp-dragging'); drag = null; }
    root.addEventListener('pointerdown', function (e) {
      if (e.button) return; var grip = e.target.closest('.sp-grip'); var s = srcOf(e.target); if (!s) return;
      if (!grip && (e.pointerType !== 'mouse' || e.target.closest('.sp-x,.sp-favb'))) return; // Touch: nur über ⠿ ziehen, damit Scrollen geht
      drag = { s: s, x: e.clientX, y: e.clientY, moved: false, grip: !!grip, pid: e.pointerId };
      if (grip) e.preventDefault();
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pid) return;
      if (!drag.moved) { if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return; drag.moved = true;
        var r = byId[drag.s.cell ? st.plan[drag.s.cell] : drag.s.id]; ghost = document.createElement('div'); ghost.className = 'sp-ghost'; ghost.textContent = r ? r.n : ''; document.body.appendChild(ghost); document.body.classList.add('sp-dragging'); }
      e.preventDefault(); ghost.style.left = e.clientX + 12 + 'px'; ghost.style.top = e.clientY + 12 + 'px'; mark(targetAt(e.clientX, e.clientY));
    }, { passive: false });
    window.addEventListener('pointerup', function (e) {
      if (!drag || e.pointerId !== drag.pid) return; var d = drag, t = d.moved ? targetAt(e.clientX, e.clientY) : null; end();
      if (d.moved) { suppress = true; setTimeout(function () { suppress = false; }, 0); if (t) applyDrop(d.s, t.dataset.cell || 'out'); return; }
      if (d.grip) { // Antippen: auswählen, dann Ziel antippen
        var cur = dnd.sel; if (cur && ((cur.cell && cur.cell === d.s.cell) || (cur.id && cur.id === d.s.id))) dnd.sel = null; else if (cur && d.s.cell) { applyDrop(cur, d.s.cell); return; } else dnd.sel = d.s.cell ? { cell: d.s.cell } : { id: d.s.id };
        renderPlan();
      }
    });
    window.addEventListener('pointercancel', end);
    root.addEventListener('click', function (e) { // ausgewähltes Gericht: Tippen auf ein beliebiges Feld setzt/tauscht es
      if (!dnd.sel) return; var td = e.target.closest('#sp-grid td[data-cell]'); if (!td || e.target.closest('.sp-grip,.sp-x')) return;
      e.preventDefault(); e.stopPropagation(); applyDrop(dnd.sel, td.dataset.cell);
    }, true);
    root.addEventListener('keydown', function (e) { var g = e.target.closest && e.target.closest('.sp-grip'); if (!g || (e.key !== 'Enter' && e.key !== ' ')) return; e.preventDefault();
      var s = srcOf(g); if (!s) return; if (dnd.sel && s.cell && !(dnd.sel.cell === s.cell)) { applyDrop(dnd.sel, s.cell); return; } dnd.sel = dnd.sel ? null : (s.cell ? { cell: s.cell } : { id: s.id }); renderPlan(); });
  })();

  function planWeek(quiet) {
    var ds = days(), cooks = (st.cook.length ? st.cook : [6]).slice(), plan = {}, meta = {}, used = {}, chosenIng = {}, warn = false;
    var mainS = ['m', 'a'].filter(function (x) { return st.slots.indexOf(x) >= 0; });
    function src(d, s) { // zuständiger Kochtag: Mittag nur aus vorher Gekochtem, Abend auch frisch vom selben Tag
      var best = null, bo = 99; cooks.forEach(function (c) { var o = age(d, c, s); if (o < bo) { bo = o; best = c; } }); return { c: best, o: bo };
    }
    var chosenBase = {};
    function note(r) { Object.keys(ingSet(r)).forEach(function (k) { chosenIng[k] = 1; }); chosenBase[base(r)] = 1; }
    function pool(slotIds, types) { return R.filter(function (r) { return allowed(r) && types.indexOf(typ(r)) >= 0 && r.s.some(function (x) { return slotIds.indexOf(x) >= 0; }); }); }
    function ranked(list) { // Favoriten zuerst (in Reihenfolge), dann passende Zutaten, dann Zufall
      var fav = st.fav.map(function (id) { return byId[id]; }).filter(function (r) { return r && list.indexOf(r) >= 0; });
      var rest = shuffle(list.filter(function (r) { return fav.indexOf(r) < 0; })).sort(function (a, b) { return ((a.t || 30) > 90) - ((b.t || 30) > 90) || (chosenBase[base(a)] ? 1 : 0) - (chosenBase[base(b)] ? 1 : 0) || overlap(b, chosenIng) - overlap(a, chosenIng) || matches(b).length - matches(a).length; });
      return fav.concat(rest);
    }
    function byFresh(list) { var f = list.filter(function (r) { return isFav(r.id); }).sort(function (a, b) { return (typ(a) === 'f' ? 0 : 1) - (typ(b) === 'f' ? 0 : 1) || st.fav.indexOf(a.id) - st.fav.indexOf(b.id); });
      var rest = shuffle(list.filter(function (r) { return !isFav(r.id); })).sort(function (a, b) { return (typ(a) === 'q' ? 0 : 1) - (typ(b) === 'q' ? 0 : 1) || (a.t || 30) - (b.t || 30); });
      return f.concat(rest.filter(function (r) { return (r.t || 30) <= 60; }), rest.filter(function (r) { return (r.t || 30) > 60; })); }
    // 1) Frische Abende im Modus „Gemischt“
    var freshCells = {};
    if (st.mode === 'mix' && mainS.indexOf('a') >= 0) {
      var n = Math.min(3, Math.max(1, Math.round(ds.length / 2.5))), fp = byFresh(pool(['a'], ['f', 'q']).filter(function (r) { return r.s.indexOf('a') >= 0; }));
      for (var i = 0; i < n && i < fp.length; i++) { var d = ds[Math.min(ds.length - 1, Math.floor((i + 0.5) * ds.length / n))], k = cellKey(d, 'a'); if (freshCells[k]) continue; freshCells[k] = 1; plan[k] = fp[i].id; meta[k] = { t: 'f' }; used[fp[i].id] = 1; note(fp[i]); }
    }
    // 2) Meal Prep für Mittag/Abend je Kochtag
    var blocks = {};
    ds.forEach(function (d) { mainS.forEach(function (s) { var k = cellKey(d, s); if (plan[k]) return; var b = src(d, s); (blocks[b.c] = blocks[b.c] || []).push({ d: d, s: s, k: k, o: b.o }); }); });
    var prepPool = pool(['m', 'a'], ['p']);
    cooks.slice().sort(function (a, b) { return cpos(a) - cpos(b); }).forEach(function (c) {
      var cells = (blocks[c] || []).sort(function (a, b) { return a.o - b.o || 'fmas'.indexOf(a.s) - 'fmas'.indexOf(b.s); }); if (!cells.length) return;
      var fit = cells.filter(function (x) { return x.o <= 4; }).length || 1, need = Math.max(1, Math.ceil(fit / 3)), cap = Math.ceil(fit / need), maxO = Math.min(4, cells[cells.length - 1].o);
      var cand = ranked(prepPool.filter(function (r) { return !used[r.id]; })), picks = [];
      if (maxO > 3) cand = cand.filter(function (r) { return isFav(r.id); }).concat(cand.filter(function (r) { return !isFav(r.id) && keepD(r) >= 4; }), cand.filter(function (r) { return !isFav(r.id) && keepD(r) < 4; }));
      for (var i = 0; i < cand.length && picks.length < need; i++) { if (keepD(cand[i]) >= Math.min(maxO, 2)) { var within = cells.filter(function (x) { return x.o <= keepD(cand[i]); }).length; picks.push({ r: cand[i], left: keepD(cand[i]) < maxO ? Math.min(cap, Math.max(1, Math.floor(within / 2))) : cap }); used[cand[i].id] = 1; note(cand[i]); } }
      var tot = picks.reduce(function (a, p) { return a + p.left; }, 0);
      for (var j = 0; tot < fit && j < cand.length; j++) { if (used[cand[j].id] || keepD(cand[j]) < maxO) continue; picks.push({ r: cand[j], left: Math.min(cap, fit - tot) }); tot += picks[picks.length - 1].left; used[cand[j].id] = 1; note(cand[j]); }
      picks.sort(function (a, b) { return keepD(a.r) - keepD(b.r); }); // Verderbliches zuerst essen
      cells.forEach(function (cell) {
        var sameDay = cells.filter(function (x) { return x.d === cell.d && plan[x.k]; }).map(function (x) { return plan[x.k]; });
        var ok = picks.filter(function (p) { return p.left > 0 && keepD(p.r) >= cell.o && sameDay.indexOf(p.r.id) < 0; });
        if (!ok.length) ok = picks.filter(function (p) { return p.left > 0 && keepD(p.r) >= cell.o; });
        // Abwechseln: nicht dasselbe wie gestern zur gleichen Mahlzeit – außer eine Portion wäre sonst zu alt
        var pi = ds.indexOf(cell.d), yest = pi > 0 ? plan[cellKey(ds[pi - 1], cell.s)] : null;
        ok.sort(function (a, b) { var ua = keepD(a.r) - cell.o <= 0 && a.left > 0, ub = keepD(b.r) - cell.o <= 0 && b.left > 0;
          return (ub - ua) || ((a.r.id === yest) - (b.r.id === yest)) || (b.left - a.left) || (keepD(a.r) - keepD(b.r)); });
        if (ok.length) { var p = ok[0]; p.left--; plan[cell.k] = p.r.id; meta[cell.k] = { t: 'p', c: c }; return; }
        warn = warn || picks.some(function (p) { return p.left > 0; });
        var fb = byFresh(pool([cell.s], ['q', 'f']).filter(function (r) { return r.s.indexOf(cell.s) >= 0 && !used[r.id]; }))[0];
        if (fb) { plan[cell.k] = fb.id; meta[cell.k] = { t: typ(fb) }; used[fb.id] = 1; }
      });
    });
    // 3) Frühstück & Snacks: dürfen sich wiederholen, Vorbereitetes (z. B. Overnight Oats) nur innerhalb der Haltbarkeit
    ['f', 's'].forEach(function (s) {
      if (st.slots.indexOf(s) < 0) return;
      var list = ranked(pool([s], st.mode === 'mix' ? ['p', 'q', 'f'] : ['p', 'q']).filter(function (r) { return r.s.indexOf(s) >= 0; }));
      if (s === 'f') list.sort(function (a, b) { return (isFav(b.id) - isFav(a.id)) || (/oat|hafer|overnight/i.test(b.id) - /oat|hafer|overnight/i.test(a.id)); });
      var favs = list.filter(function (r) { return isFav(r.id); }), opts = favs.slice(0, 3);
      if (opts.length < 2) ['p', 'q'].forEach(function (t) { if (opts.length >= 2 || opts.some(function (o) { return typ(o) === t; })) return; var x = list.filter(function (r) { return opts.indexOf(r) < 0 && typ(r) === t; })[0]; if (x) opts.push(x); });
      if (opts.length < 2) opts = opts.concat(list.filter(function (r) { return opts.indexOf(r) < 0 && typ(r) !== 'f'; }).slice(0, 2 - opts.length));
      opts.sort(function (a, b) { return (typ(a) === 'p' ? 0 : 1) - (typ(b) === 'p' ? 0 : 1); });
      if (!opts.length) return;
      var run = Math.max(2, Math.ceil(ds.length / opts.length)), freshUsed = false;
      ds.forEach(function (d, i) {
        var k = cellKey(d, s), r = opts[Math.floor(i / run) % opts.length], b = src(d, 'm');
        if (typ(r) === 'f' && (freshUsed || d < 5)) r = opts.filter(function (x) { return typ(x) !== 'f'; })[0] || r;
        if (typ(r) === 'p' && b.o > keepD(r)) r = opts.filter(function (x) { return typ(x) === 'q'; })[0] || list.filter(function (x) { return typ(x) === 'q'; })[0] || r;
        if (typ(r) === 'f') freshUsed = true;
        plan[k] = r.id; meta[k] = typ(r) === 'p' ? { t: 'p', c: b.c } : { t: typ(r) };
      });
    });
    st.plan = plan; st.meta = meta; st.warn = warn; save(); renderPlan(); if (st.tab === 'swipe') renderSwipe();
    toast(T.planned + planCount() + ' / ' + totalCells());
    var pl = $('sp-plan'); if (!quiet && pl && pl.scrollIntoView) pl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function autoFill() { planWeek(); }
  function cookPlan() {
    var by = {}, fresh = [], mains = 0, cooked = {};
    days().forEach(function (d) { st.slots.forEach(function (s) {
      var k = cellKey(d, s), id = st.plan[k], m = st.meta[k] || {}; if (!id) return;
      if (s === 'm' || s === 'a') mains++;
      if (m.t === 'p') { var c = m.c; by[c] = by[c] || {}; by[c][id] = (by[c][id] || 0) + 1; if (s === 'm' || s === 'a') cooked[c + '|' + id] = 1; }
      else if (m.t === 'f' && (s === 'm' || s === 'a')) { fresh.push({ d: d, s: s, id: id }); }
    }); });
    return { by: by, fresh: fresh, mains: mains, n: Object.keys(cooked).length + fresh.length };
  }

  // ---------- Grundgerüst ----------
  root.innerHTML =
    '<div class="sp-wrap">' +
    '<header class="sp-head"><span class="sp-eyebrow">Kostenlos · ohne Anmeldung</span><h1>Meal Prep Wochenplan Vorlage</h1>' +
    '<p class="sp-lead">Stell dir deinen Wochenplan kostenlos zusammen: Merk dir deine Lieblingsgerichte per Wischen oder Zutatensuche – der Planer macht daraus eine Meal-Prep-Woche mit wenigen Kochtagen, inklusive Einkaufsliste als PDF zum Herunterladen.</p></header>' +
    '<section class="sp-card" aria-labelledby="sp-h1"><div class="sp-step"><span class="sp-nr">1</span><h2 id="sp-h1">Für wen und wann?</h2></div><div class="sp-setup" id="sp-setup"></div></section>' +
    '<section class="sp-card" aria-labelledby="sp-h2"><div class="sp-step"><span class="sp-nr">2</span><h2 id="sp-h2">Rezepte finden</h2></div>' +
    '<div class="sp-tabs" role="tablist"><button class="sp-tab" role="tab" id="sp-t-search" aria-controls="sp-p-search">Mit Zutaten suchen</button><button class="sp-tab" role="tab" id="sp-t-swipe" aria-controls="sp-p-swipe">Nach Kategorie wischen</button></div>' +
    '<div id="sp-p-search" role="tabpanel" aria-labelledby="sp-t-search"></div><div id="sp-p-swipe" role="tabpanel" aria-labelledby="sp-t-swipe"></div></section>' +
    '<section class="sp-card" aria-labelledby="sp-h3" id="sp-plan"><div class="sp-plan-head"><div><div class="sp-step" style="margin-bottom:6px"><span class="sp-nr">3</span><h2 id="sp-h3">Deine Wochenplan-Vorlage</h2></div><p class="sp-status" id="sp-count"></p></div></div>' +
    '<div class="sp-favs" id="sp-favs"></div><div class="sp-plan-go"><button class="sp-btn" id="sp-go">' + T.planBtn + '</button></div><div class="sp-cook" id="sp-cook"></div>' +
    '<div class="sp-board"><div class="sp-scroll"><table class="sp-grid" id="sp-grid"></table></div><aside class="sp-dock" id="sp-dock" aria-label="Favoriten"></aside></div>' +
    '<div class="sp-plan-actions"><button class="sp-btn" id="sp-pdf">Wochenplan als PDF herunterladen</button><button class="sp-btn sp-sec" id="sp-clear">Plan leeren</button><span class="sp-status" id="sp-pdf-status" aria-live="polite"></span></div></section>' +
    '<aside class="sp-teaser"><div><h3>Noch einfacher in der App</h3><p>Prepello plant die Woche für deinen Haushalt und rechnet die Einkaufsliste in ganze Packungen um.</p></div><a href="https://forms.gle/D3PrMx7ugt5bA5MHA" target="_blank" rel="noopener">Kostenlos Beta testen ↗</a></aside>' +
    '<footer class="sp-foot"><span>© 2026 Prepello</span><a href="/">Startseite</a><a href="/category/rezepte/">Rezepte</a><a href="https://smartbasket.samisam.org/de/impressum/">Impressum</a><a href="https://smartbasket.samisam.org/de/datenschutz/">Datenschutz</a></footer>' +
    '</div><div class="sp-modal" id="sp-modal" hidden><div class="sp-dialog" role="dialog" aria-modal="true" aria-labelledby="sp-mt" id="sp-dialog"></div></div><div class="sp-toast" role="status" aria-live="polite"></div>';
  toastEl = root.querySelector('.sp-toast');
  var $ = function (id) { return document.getElementById(id); };

  // ---------- 1. Setup ----------
  function renderSetup() {
    var h = '<div><span class="sp-label">Wer isst mit?</span>' +
      '<div class="sp-counter"><span class="sp-cname">Erwachsene</span><button class="sp-round" data-c="adults" data-v="-1" aria-label="Weniger Erwachsene"' + (st.adults <= 0 || st.adults + st.kids <= 1 ? ' disabled' : '') + '>−</button><output>' + st.adults + '</output><button class="sp-round" data-c="adults" data-v="1" aria-label="Mehr Erwachsene"' + (st.adults >= 8 ? ' disabled' : '') + '>+</button></div>' +
      '<div class="sp-counter"><span class="sp-cname">Kinder</span><button class="sp-round" data-c="kids" data-v="-1" aria-label="Weniger Kinder"' + (st.kids <= 0 || st.adults + st.kids <= 1 ? ' disabled' : '') + '>−</button><output>' + st.kids + '</output><button class="sp-round" data-c="kids" data-v="1" aria-label="Mehr Kinder"' + (st.kids >= 8 ? ' disabled' : '') + '>+</button></div></div>';
    h += '<div><span class="sp-label">' + T.tgtL + '</span>' +
      '<div class="sp-counter"><span class="sp-cname">' + T.tgtA + '</span><button class="sp-round" data-kc="kcalA" data-v="-100" aria-label="' + T.tgtA + ' −100"' + (st.kcalA <= 1200 ? ' disabled' : '') + '>−</button><output class="sp-kc">' + st.kcalA.toLocaleString(T.loc) + '</output><button class="sp-round" data-kc="kcalA" data-v="100" aria-label="' + T.tgtA + ' +100"' + (st.kcalA >= 4000 ? ' disabled' : '') + '>+</button></div>' +
      (st.kids ? '<div class="sp-counter"><span class="sp-cname">' + T.tgtK + '</span><button class="sp-round" data-kc="kcalK" data-v="-100" aria-label="' + T.tgtK + ' −100"' + (st.kcalK <= 800 ? ' disabled' : '') + '>−</button><output class="sp-kc">' + st.kcalK.toLocaleString(T.loc) + '</output><button class="sp-round" data-kc="kcalK" data-v="100" aria-label="' + T.tgtK + ' +100"' + (st.kcalK >= 3000 ? ' disabled' : '') + '>+</button></div>' : '') +
      '<p class="sp-mini">' + T.tgtH + '</p><button class="sp-chip sp-calcb" data-calc="' + (st.calc ? 0 : 1) + '" aria-expanded="' + !!st.calc + '">' + T.calcBtn + '</button></div>';
    h += '<div><span class="sp-label">Welche Tage?</span><div class="sp-row">' + SHORT.map(function (s, i) { return '<button class="sp-chip" data-day="' + i + '" aria-pressed="' + (st.days.indexOf(i) >= 0) + '" aria-label="' + DAYS[i] + '">' + s + '</button>'; }).join('') + '</div></div>';
    h += '<div><span class="sp-label">Welche Mahlzeiten?</span><div class="sp-row">' + SLOTS.map(function (s) { return '<button class="sp-chip" data-slot="' + s.id + '" aria-pressed="' + (st.slots.indexOf(s.id) >= 0) + '">' + s.l + '</button>'; }).join('') + '</div></div>';
    h += '<div><span class="sp-label">' + T.modeL + '</span><div class="sp-row">' + T.modes.map(function (m) { return '<button class="sp-chip" data-mode="' + m.id + '" aria-pressed="' + (st.mode === m.id) + '">' + m.l + '</button>'; }).join('') + '</div><p class="sp-mini">' + T.modes.filter(function (m) { return m.id === st.mode; })[0].h + '</p></div>';
    h += '<div><span class="sp-label">' + T.cookL + '</span><div class="sp-row">' + SHORT.map(function (s, i) { return '<button class="sp-chip" data-cook="' + i + '" aria-pressed="' + (st.cook.indexOf(i) >= 0) + '" aria-label="' + DAYS[i] + '">' + s + '</button>'; }).join('') + '</div><p class="sp-mini">' + T.cookH + '</p></div>';
    h += '<div><span class="sp-label">Ernährung</span><div class="sp-row">' + DIETS.map(function (d) { return '<button class="sp-chip" data-diet="' + d.id + '" aria-pressed="' + (st.diets.indexOf(d.id) >= 0) + '">' + d.l + '</button>'; }).join('') + '</div></div>';
    if (st.calc) h += calcForm();
    $('sp-setup').innerHTML = h;
  }
  $('sp-setup').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.calc) { st.calc = b.dataset.calc === '1'; if (st.calc) applyProf(); save(); renderSetup(); renderPlan(); return; }
    if (b.dataset.kc) { var kk = b.dataset.kc; st[kk] = Math.max(kk === 'kcalA' ? 1200 : 800, Math.min(kk === 'kcalA' ? 4000 : 3000, st[kk] + +b.dataset.v)); save(); renderSetup(); renderPlan(); return; }
    if (b.dataset.c) { st[b.dataset.c] = Math.max(0, Math.min(8, st[b.dataset.c] + +b.dataset.v)); if (st.calc) applyProf(); }
    else if (b.dataset.day) { var d = +b.dataset.day, i = st.days.indexOf(d); if (i >= 0) { if (st.days.length > 1) st.days.splice(i, 1); } else st.days.push(d); }
    else if (b.dataset.slot) { var s = b.dataset.slot, j = st.slots.indexOf(s); if (j >= 0) { if (st.slots.length > 1) st.slots.splice(j, 1); } else st.slots.push(s); st.slots.sort(function (a, c) { return 'fmas'.indexOf(a) - 'fmas'.indexOf(c); }); if (st.slots.indexOf(st.swipeSlot) < 0) st.swipeSlot = st.slots[0]; }
    else if (b.dataset.mode) { st.mode = b.dataset.mode; }
    else if (b.dataset.cook) { var cd = +b.dataset.cook, ci = st.cook.indexOf(cd); if (ci >= 0) { if (st.cook.length > 1) st.cook.splice(ci, 1); } else st.cook.push(cd); }
    else if (b.dataset.diet) { var x = b.dataset.diet, k = st.diets.indexOf(x); if (k >= 0) st.diets.splice(k, 1); else st.diets.push(x); st.queue = {}; }
    save(); renderSetup(); renderTab(); if (Object.keys(st.meta).length) planWeek(true); else renderPlan();
  });

  $('sp-setup').addEventListener('change', function (e) {
    var el = e.target; if (!el.dataset || !el.dataset.pf) return; var g = el.dataset.g === 'k' ? st.prof.k : st.prof.a, p = g[+el.dataset.i]; if (!p) return;
    var f = el.dataset.pf, v = f === 'sx' ? el.value : +el.value;
    if (f !== 'sx' && f !== 'act' && f !== 'goal') { var mn = +el.min, mx = +el.max; if (!isFinite(v) || !v) v = p[f]; v = Math.max(mn, Math.min(mx, v)); el.value = v; }
    p[f] = v; applyProf(); save();
    root.querySelectorAll('[data-res]').forEach(function (r) { var id = r.dataset.res, q = id[0] === 'k' ? st.prof.k[+id.slice(1)] : st.prof.a[+id.slice(1)]; if (q) r.textContent = (id[0] === 'k' ? kidNeed(q) : adultNeed(q)).toLocaleString(T.loc) + T.perDay; });
    root.querySelectorAll('output.sp-kc').forEach(function (o, i) { o.textContent = (i === 0 ? st.kcalA : st.kcalK).toLocaleString(T.loc); });
    renderPlan();
  });

  // ---------- 2a. Suche ----------
  function renderSearch() {
    var p = $('sp-p-search');
    p.innerHTML = '<form class="sp-search" id="sp-form" autocomplete="off"><label class="sp-sr" for="sp-q">Zutat oder Gericht</label>' +
      '<input class="sp-input" id="sp-q" list="sp-ing" placeholder="Zutat eingeben, z. B. Kartoffeln" value="' + esc(st.q) + '"><datalist id="sp-ing">' + ING.map(function (n) { return '<option value="' + esc(n) + '">'; }).join('') + '</datalist>' +
      '<button class="sp-btn" type="submit">Hinzufügen</button></form>' +
      '<div class="sp-have" id="sp-have">' + st.have.map(function (h, i) { return '<button data-rm="' + i + '" aria-label="' + esc(h) + ' entfernen">' + esc(h) + ' ✕</button>'; }).join('') + '</div>' +
      (st.have.length ? '' : '<div class="sp-sugg"><span>Schnell hinzufügen:</span>' + SUGGEST.map(function (s) { return '<button data-sg="' + esc(s) + '">+ ' + esc(s) + '</button>'; }).join('') + '</div>') +
      '<div class="sp-row" style="margin-top:14px" id="sp-fslot"><button class="sp-chip" data-fs="" aria-pressed="' + (!st.fslot) + '">Alle Kategorien</button>' + SLOTS.map(function (s) { return '<button class="sp-chip" data-fs="' + s.id + '" aria-pressed="' + (st.fslot === s.id) + '">' + s.l + '</button>'; }).join('') + '</div>' +
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
    var head = st.have.length ? '<p class="sp-status" style="margin-top:14px">' + scored.length + ' Rezepte mit ' + esc(st.have.join(', ')) + '</p>' : '<p class="sp-status" style="margin-top:14px">' + scored.length + ' Rezepte' + (q ? ' für „' + esc(st.q) + '“' : '') + '</p>';
    var cards = scored.slice(0, st.shown).map(function (o) { return card(o.r, o.m, o.x); }).join('');
    $('sp-res').innerHTML = head + (scored.length ? '<div class="sp-results">' + cards + '</div>' : '<p class="sp-empty" style="margin-top:12px;height:auto">Keine passenden Rezepte. Entferne eine Zutat oder einen Ernährungsfilter.</p>') +
      (scored.length > st.shown ? '<div class="sp-more"><button class="sp-btn sp-sec" id="sp-more">Weitere Rezepte anzeigen</button></div>' : '');
  }
  function card(r, m, x) {
    var add = '<button data-fav="' + r.id + '" aria-pressed="' + isFav(r.id) + '" class="sp-favb">' + (isFav(r.id) ? T.favOn : T.favAdd) + '</button>';
    var meta = [r.s.map(function (s) { return slot(s).s; }).join(' · ')]; if (r.t) meta.push(r.t + ' Min.'); if (r.kcal) meta.push(r.kcal + ' kcal');
    return '<article class="sp-rc">' + imgTag(r) + '<div class="sp-rb">' + (r.src === 'blog' ? '<span class="sp-blog">Aus dem Blog</span>' : '') +
      '<button class="sp-rn" data-open="' + r.id + '">' + esc(r.n) + '</button><span class="sp-meta">' + esc(meta.join(' · ')) + '</span>' +
      (m && m.length ? '<span class="sp-match">✓ ' + esc(m.join(', ')) + '</span>' + (x ? '<span class="sp-miss">' + x + (x === 1 ? ' weitere Zutat' : ' weitere Zutaten') + '</span>' : '<span class="sp-miss">Alles da (außer Basics)</span>') : '') +
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
    var deck = top ? (next ? swipeCard(next, 'sp-back') : '') + swipeCard(top, '') : '<div class="sp-empty">Keine Rezepte für diese Auswahl.</div>';
    $('sp-p-swipe').innerHTML = '<div class="sp-swipe"><div><div class="sp-deck" id="sp-deck">' + deck + '</div>' +
      '<div class="sp-actions"><button class="sp-act sp-no" id="sp-nope" aria-label="Überspringen">✕</button><button class="sp-act sp-info" id="sp-info" aria-label="Rezept ansehen">i</button><button class="sp-act sp-yes" id="sp-like" aria-label="In den Wochenplan">♥</button></div>' +
      '<p class="sp-hint">' + T.likeHint + '</p></div>' +
      '<div class="sp-side"><h3>Kategorie</h3><p>Wähle, wofür du gerade Gerichte suchst.</p><div class="sp-row" id="sp-sw-slots">' +
      slots().map(function (x) { return '<button class="sp-chip" data-sw="' + x.id + '" aria-pressed="' + (x.id === s) + '">' + x.l + '</button>'; }).join('') + '</div>' +
      '<p style="margin-top:16px"><strong>' + st.fav.length + '</strong>' + T.favCount + '</p></div></div>';
    bindDrag();
  }
  function swipeCard(r, cls) {
    var meta = []; if (r.t) meta.push(r.t + ' Min.'); if (r.kcal) meta.push(r.kcal + ' kcal pro Portion'); if (r.src === 'blog') meta.unshift('Aus dem Blog');
    return '<div class="sp-sc ' + cls + '"' + (cls ? ' aria-hidden="true"' : ' data-id="' + r.id + '"') + '>' + imgTag(r) + '<div class="sp-sb"><h3>' + esc(r.n) + '</h3><span class="sp-meta">' + esc(meta.join(' · ')) + '</span>' +
      '<p class="sp-ing">' + esc(r.i.filter(function (i) { return !isBasic(i[0]); }).map(function (i) { return i[0]; }).join(' · ')) + '</p></div>' +
      '<span class="sp-stamp sp-yes">' + T.stamp + '</span><span class="sp-stamp sp-no">NÄCHSTES</span></div>';
  }
  function decide(like) {
    var s = st.swipeSlot, q = queue(s), id = q[0]; if (!id) return;
    if (like) { setFav(id, true); renderFavs(); toast(byId[id].n + T.favToast); }
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
        var ck = cellKey(d, s.id), mt = st.meta[ck] || {}, old = mt.t === 'p' && r && age(d, mt.c, s.id) > keepD(r);
        var tag = mt.t === 'p' ? '<span class="sp-tag ' + (old ? 'sp-twarn" title="' + T.tooOld : 'sp-tp') + '">' + T.tagP + SHORT[mt.c] + (old ? ' ⚠' : '') + '</span>' : mt.t === 'f' ? '<span class="sp-tag sp-tf">' + T.tagF + '</span>' : mt.t === 'q' ? '<span class="sp-tag sp-tq">' + T.tagQ + '</span>' : '';
        h += '<td data-cell="' + ck + '"' + (dnd.sel && dnd.sel.cell === ck ? ' class="sp-sel"' : '') + '>' + (r ? '<div class="sp-cell" data-drag-cell="' + ck + '"><span class="sp-grip" role="button" tabindex="0" aria-label="' + esc(r.n) + ': ' + T.grip + '">⠿</span>' + tag + '<button class="sp-cn" data-open="' + r.id + '">' + esc(r.n) + '</button><button class="sp-x" data-del="' + cellKey(d, s.id) + '" aria-label="' + esc(r.n) + ' am ' + DAYS[d] + ' entfernen">×</button></div>' : '<span class="sp-free">frei</span>') + '</td>';
      });
      h += '</tr>';
    });
    var eur = function (v) { return v.toLocaleString(T.loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }, wk = 0;
    var kc = ds.map(function (d) { var k = 0; ss.forEach(function (s) { var r = byId[st.plan[cellKey(d, s.id)]]; if (r && r.kcal) k += r.kcal; }); return k; });
    var co = ds.map(function (d) { var c = 0, m = dayMult(d) * factor(); ss.forEach(function (s) { var r = byId[st.plan[cellKey(d, s.id)]]; if (r && r.eur) c += r.eur * m; }); wk += c; return c; });
    h += '</tbody><tfoot><tr class="sp-sumrow"><th class="sp-sl" scope="row">' + T.kcalL + '<br><small>' + T.goal + st.kcalA.toLocaleString(T.loc) + '</small></th>' + kc.map(function (k, i) { if (!k) return '<td>–</td>'; var m = dayMult(ds[i]), v = Math.round(k * m / 10) * 10, off = Math.abs(v - st.kcalA) / st.kcalA > 0.1;
      return '<td' + (off ? ' class="sp-off" title="' + T.offH + '"' : '') + '><strong>' + v.toLocaleString(T.loc) + '</strong> kcal<br><small>' + T.portion + Math.round(m * 100) + ' %</small></td>'; }).join('') + '</tr>' +
      '<tr class="sp-sumrow"><th class="sp-sl" scope="row" title="' + T.costH + '">' + T.costL + ' <span class="sp-info" aria-hidden="true">ⓘ</span></th>' + co.map(function (c) { return '<td>' + (c ? '<strong>' + eur(c) + '</strong>' : '–') + '</td>'; }).join('') + '</tr></tfoot>';
    $('sp-grid').innerHTML = h; st.week = wk; renderFavs(); renderCook(); renderDock();
    var n = planCount(), t = totalCells();
    $('sp-count').textContent = n + ' von ' + t + ' Plätzen geplant · für ' + who() + (wk ? T.weekC + Math.round(wk) + T.weekC2 : '');
  }
  $('sp-grid').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.del) { delete st.plan[b.dataset.del]; delete st.meta[b.dataset.del]; save(); renderPlan(); if (st.tab === 'swipe') renderSwipe(); }
  });
  $('sp-go').addEventListener('click', function () { planWeek(false); });
  function renderFavs() {
    var el = $('sp-favs'); if (!el) return;
    el.innerHTML = '<span class="sp-label">' + T.favL + ' (' + st.fav.length + ')</span>' + (st.fav.length ? '<div class="sp-have">' + st.fav.map(function (id) { var r = byId[id]; return r ? '<button data-unfav="' + id + '" aria-label="' + esc(r.n) + T.favOff + '">♥ ' + esc(r.n) + (typ(r) === 'f' && st.mode === 'prep' && (r.s.indexOf('m') >= 0 || r.s.indexOf('a') >= 0) ? ' <small>(' + T.onlyMix + ')</small>' : '') + ' ✕</button>' : ''; }).join('') + '</div>' : '<p class="sp-mini">' + T.favNone + '</p>');
  }
  function renderCook() {
    var el = $('sp-cook'); if (!el) return; var cp = cookPlan(), keys = Object.keys(cp.by);
    if (!keys.length && !cp.fresh.length) { el.innerHTML = ''; return; }
    keys.sort(function (a, b) { return cpos(+a) - cpos(+b); });
    var h = '<h3>' + T.cookTitle + '</h3><ul>';
    keys.forEach(function (c) { h += '<li><strong>' + DAYS[c] + ' ' + T.cookOn + ':</strong> ' + Object.keys(cp.by[c]).map(function (id) { var r = byId[id], n = cp.by[c][id]; return esc(r.n) + ' <span class="sp-x3">×' + n + '</span>' + (r.fz ? ' <span class="sp-fz" title="' + T.freeze + '">❄</span>' : ''); }).join(' · ') + '</li>'; });
    if (cp.fresh.length) h += '<li><strong>' + T.fresh + ':</strong> ' + cp.fresh.map(function (f) { return SHORT[f.d] + ' ' + slot(f.s).s + ' – ' + esc(byId[f.id].n); }).join(' · ') + '</li>';
    h += '</ul><p class="sp-sum">' + T.sumA + cp.n + T.sumB + cp.mains + T.sumC + '</p>' + (st.warn ? '<p class="sp-mini">' + T.moreCook + '</p>' : '');
    el.innerHTML = h;
  }
  $('sp-favs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.unfav) { setFav(b.dataset.unfav, false); renderFavs(); if (st.tab === 'search') renderResults(); else renderSwipe(); } });
  $('sp-clear').addEventListener('click', function () { st.plan = {}; st.meta = {}; save(); renderPlan(); if (st.tab === 'swipe') renderSwipe(); toast('Plan geleert.'); });

  // ---------- Rezept-Details ----------
  var lastFocus = null;
  function openRecipe(id) {
    var r = byId[id]; if (!r) return; lastFocus = document.activeElement;
    var f = factor();
    var meta = [r.s.map(function (s) { return slot(s).l; }).join(', ')]; if (r.t) meta.push(r.t + ' Min.'); if (r.kcal) meta.push(r.kcal + ' kcal / ' + r.p + ' g Eiweiß pro Portion');
    $('sp-dialog').innerHTML = '<button class="sp-close" id="sp-close" aria-label="Schließen">×</button>' + imgTag(r) + '<div class="sp-dbody">' +
      (r.src === 'blog' ? '<span class="sp-blog">Aus dem Blog</span>' : '') + '<h2 id="sp-mt">' + esc(r.n) + '</h2><span class="sp-meta">' + esc(meta.join(' · ')) + '</span>' +
      '<p class="sp-mpinfo"><span class="sp-tag ' + (typ(r) === 'p' ? 'sp-tp' : typ(r) === 'f' ? 'sp-tf' : 'sp-tq') + '">' + (typ(r) === 'p' ? T.mpP : typ(r) === 'f' ? T.mpF : T.mpQ) + '</span>' + (typ(r) === 'p' && r.k ? ' ' + r.k + T.keepT : '') + (r.fz ? ' · ❄ ' + T.freeze : '') + (r.mpAuto ? ' · <em>' + T.autoT + '</em>' : '') + '</p>' +
      '<h3>Zutaten für ' + esc(who()) + '</h3><ul>' + r.i.map(function (i) { return '<li><strong>' + esc(fmtQty(i[1] * f, i[2])) + '</strong> ' + esc(i[0]) + '</li>'; }).join('') + '</ul>' +
      (r.z ? '<h3>Zubereitung</h3><p>' + esc(r.z) + '</p>' : '') +
      (r.url ? '<p><a href="' + esc(r.url) + '">Zum ausführlichen Rezept im Blog →</a></p>' : '') +
      '<div class="sp-add"><button data-fav="' + r.id + '" aria-pressed="' + isFav(r.id) + '" class="sp-favb">' + (isFav(r.id) ? T.favOn : T.favAdd) + '</button>' + r.s.map(function (s) { return '<button data-add="' + r.id + '" data-s="' + s + '">+ ' + slot(s).l + '</button>'; }).join('') + '</div></div>';
    $('sp-modal').hidden = false; $('sp-close').focus();
  }
  function closeModal() { $('sp-modal').hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $('sp-modal').addEventListener('click', function (e) { if (e.target.id === 'sp-modal' || e.target.closest('#sp-close')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('sp-modal').hidden) closeModal(); });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.fav) { var on = !isFav(b.dataset.fav); setFav(b.dataset.fav, on); b.setAttribute('aria-pressed', on); b.textContent = on ? T.favOn : T.favAdd; renderFavs(); toast(byId[b.dataset.fav].n + (on ? T.favToast : T.favOff)); if (st.tab === 'swipe') renderSwipe(); }
    else if (b.dataset.open) openRecipe(b.dataset.open);
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
      var fd = f * dayMult(d); r.i.forEach(function (i) { var k = i[0] + '|' + i[2]; if (!items[k]) items[k] = { n: i[0], u: i[2], q: 0, w: [] }; items[k].q += i[1] * fd; var w = SHORT[d]; if (items[k].w.indexOf(w) < 0) items[k].w.push(w); }); }); });
    return Object.keys(items).map(function (k) { return items[k]; }).sort(function (a, b) { return isBasic(a.n) - isBasic(b.n) || a.n.localeCompare(b.n, 'de'); });
  }
  function buildPdf(jsPDF, fonts) {
    var doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4', compress: true });
    fonts.forEach(function (f) { doc.addFileToVFS(f.file, f.d); doc.addFont(f.file, f.n, f.s); });
    doc.setProperties({ title: 'Mein Meal Prep Wochenplan', author: 'meal-prep.tech', creator: 'meal-prep.tech' });
    var page = 0;
    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); } function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); } function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function font(n, s, z) { doc.setFont(n, s); doc.setFontSize(z); }
    function W() { return doc.internal.pageSize.getWidth(); } function H() { return doc.internal.pageSize.getHeight(); }
    function bg() { fill(C.ivory); doc.rect(0, 0, W(), H(), 'F'); }
    function footer() { page++; font('Inter', 'normal', 9); color(C.muted); doc.text('Erstellt mit dem Wochenplaner auf meal-prep.tech', 36, H() - 20); doc.text('Seite ' + page, W() - 36, H() - 20, { align: 'right' }); }
    function title(t, sub, x) { fill(C.accent); doc.rect(x, 30, 28, 2.5, 'F'); font('Playfair', 'bold', 30); color(C.deep); doc.text(t, x, 64); font('Inter', 'normal', 12.5); color(C.muted); doc.text(sub, x, 84); }
    function wrapWords(text, maxW) {
      var tokens = []; text.split(/\s+/).forEach(function (w, wi) { var parts = doc.getTextWidth(w) > maxW ? w.split(/(?<=-)/) : [w]; parts.forEach(function (p, pi) { tokens.push({ t: p, sp: wi > 0 && pi === 0 }); }); });
      var lines = [], cur = ''; tokens.forEach(function (tk) { var nx = cur ? cur + (tk.sp ? ' ' : '') + tk.t : tk.t; if (cur && doc.getTextWidth(nx) > maxW) { lines.push(cur); cur = tk.t; } else cur = nx; }); if (cur) lines.push(cur); return lines;
    }
    // Seite 1: Wochenplan
    bg(); var ds = days(), ss = slots();
    title('Mein Meal Prep Wochenplan', 'für ' + who() + (st.diets.length ? '  ·  ' + DIETS.filter(function (d) { return st.diets.indexOf(d.id) >= 0; }).map(function (d) { return d.l.toLowerCase(); }).join(', ') : ''), 36);
    font('Inter', 'normal', 11.5); color(C.text); doc.text('Woche vom ____________ bis ____________', W() - 36, 60, { align: 'right' }); var cpp = cookPlan(); doc.text('Vorkochen am: ' + (Object.keys(cpp.by).length ? Object.keys(cpp.by).sort(function (a, b) { return cpos(+a) - cpos(+b); }).map(function (c) { return DAYS[c]; }).join(', ') : '____________'), W() - 36, 80, { align: 'right' });
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
    var ny = top + headH + ss.length * rowH + 26, cks = Object.keys(cpp.by).sort(function (a, b) { return cpos(+a) - cpos(+b); });
    if (cks.length || cpp.fresh.length) { font('Playfair', 'bold', 13); color(C.deep); doc.text(T.cookTitle, 36, ny); font('Inter', 'normal', 10.5); color(C.text);
      var cl = cks.map(function (c) { return DAYS[c] + ' ' + T.cookOn + ': ' + Object.keys(cpp.by[c]).map(function (id) { return byId[id].n + ' ×' + cpp.by[c][id]; }).join(' · '); });
      if (cpp.fresh.length) cl.push(T.fresh + ': ' + cpp.fresh.map(function (f) { return SHORT[f.d] + ' ' + slot(f.s).s + ' – ' + byId[f.id].n; }).join(' · '));
      cl.forEach(function (l, i) { if (ny + 16 + i * 14 < H() - 34) doc.text(doc.splitTextToSize(l, W() - 72)[0], 36, ny + 16 + i * 14); });
      ny = H(); }
    if (ny < H() - 40) { font('Playfair', 'bold', 13); color(C.deep); doc.text('Notizen', 36, ny); } stroke([201, 214, 205]); doc.setLineWidth(0.5); if (ny + 18 < H() - 34) doc.line(36, ny + 18, W() - 36, ny + 18);
    footer();
    // Seite 2: Einkaufsliste
    doc.addPage('a4', 'portrait'); bg(); title('Einkaufsliste', 'Mengen für ' + who() + ', über die Woche zusammengefasst.', 48);
    var items = shopping(), colX = [48, W() / 2 + 6], cw = W() / 2 - 54, y = 124, col = 0, startY = 124, lh = 34, per = Math.floor((H() - startY - 60) / lh);
    items.forEach(function (it, i) {
      if (i && i % per === 0) { col++; y = startY; if (col > 1) { footer(); doc.addPage('a4', 'portrait'); bg(); col = 0; y = startY = 60; per = Math.floor((H() - startY - 60) / lh); } }
      var x = colX[col]; stroke(C.green); doc.setLineWidth(0.8); doc.roundedRect(x, y - 8, 8.5, 8.5, 1.5, 1.5, 'S');
      font('Inter', 'bold', 11.5); color(C.text); doc.text(fmtQty(it.q, it.u), x + 18, y);
      font('Inter', 'normal', 11.5); doc.text(doc.splitTextToSize(it.n, cw - 104)[0], x + 98, y);
      font('Inter', 'normal', 9); color(C.muted); doc.text((isBasic(it.n) ? 'Basics · ' : '') + it.w.join(', '), x + 98, y + 12);
      stroke(C.line); doc.setLineWidth(0.4); doc.line(x, y + 20, x + cw, y + 20); y += lh;
    });
    if (!items.length) { font('Inter', 'normal', 12); color(C.muted); doc.text('Noch keine Gerichte im Plan.', 48, y); }
    footer();
    // Rezepte
    var ids = []; days().forEach(function (d) { st.slots.forEach(function (s) { var id = st.plan[cellKey(d, s)]; if (id && ids.indexOf(id) < 0) ids.push(id); }); });
    if (ids.length) {
      doc.addPage('a4', 'portrait'); bg(); title('Rezepte dieser Woche', 'Mengen pro Mahlzeit für ' + who() + '.', 48); y = 112;
      var f = factor();
      ids.forEach(function (id) {
        var r = byId[id]; font('Inter', 'normal', 11); var zl = r.z ? doc.splitTextToSize(r.z, W() - 140) : [];
        var ingRows = Math.ceil(r.i.length / 2), bh = 60 + ingRows * 17 + (zl.length ? 20 + zl.length * 14.5 : 0) + (r.url ? 18 : 0);
        if (y + bh > H() - 48) { footer(); doc.addPage('a4', 'portrait'); bg(); y = 48; }
        fill(C.white); stroke(C.line); doc.setLineWidth(0.8); doc.roundedRect(48, y, W() - 96, bh, 8, 8, 'FD');
        font('Playfair', 'bold', 17); color(C.deep); doc.text(doc.splitTextToSize(r.n, W() - 140)[0], 64, y + 26);
        var meta = r.s.map(function (s) { return slot(s).s; }).join(' · ') + (r.t ? ' · ' + r.t + ' Min.' : '') + (r.src === 'blog' ? ' · aus dem Blog' : '');
        font('Inter', 'semibold', 9.5); color(C.accent); doc.text(meta.toUpperCase(), 64, y + 42);
        var iy = y + 62, half = (W() - 128) / 2;
        r.i.forEach(function (i, k) { var cx = 64 + (k % 2) * half, cy = iy + Math.floor(k / 2) * 17; font('Inter', 'bold', 11); color(C.text); doc.text(fmtQty(i[1] * f, i[2]), cx, cy); font('Inter', 'normal', 11); doc.text(doc.splitTextToSize(i[0], half - 80)[0], cx + 66, cy); });
        var zy = iy + ingRows * 17 + 8;
        if (zl.length) { font('Inter', 'semibold', 10.5); color(C.green); doc.text('Zubereitung', 64, zy); font('Inter', 'normal', 11); color(C.text); doc.text(zl, 64, zy + 16, { lineHeightFactor: 1.32 }); zy += 20 + zl.length * 14.5; }
        if (r.url) { font('Inter', 'semibold', 10); color(C.accent); doc.textWithLink('Ausführliches Rezept auf meal-prep.tech', 64, zy + 4, { url: r.url }); }
        y += bh + 12;
      });
      footer();
    }
    return doc;
  }
  $('sp-pdf').addEventListener('click', function () {
    var b = this, stEl = $('sp-pdf-status');
    if (!planCount()) { planWeek(); }
    b.disabled = true; var lbl = b.textContent; b.textContent = 'PDF wird erstellt …';
    Promise.all([loadLib(), loadFonts()]).then(function (r) { buildPdf(r[0], r[1]).save('meal-prep-wochenplan.pdf'); stEl.textContent = 'Fertig – dein Wochenplan wurde heruntergeladen.'; })
      .catch(function () { stEl.textContent = 'Das PDF konnte nicht erstellt werden. Bitte versuch es noch einmal.'; })
      .then(function () { b.disabled = false; b.textContent = lbl; });
  });

  (function () { var css = '#sb-planer .sp-mini{margin:6px 0 0;font-size:13px;color:var(--mu)}#sb-planer .sp-favs{margin:6px 0 14px}#sb-planer .sp-favs .sp-have{margin-top:8px}' +
    '#sb-planer .sp-plan-go{margin:0 0 16px}#sb-planer .sp-cook{margin:0 0 18px;padding:16px 18px;border-radius:14px;background:var(--ti);border:1px solid var(--tl)}#sb-planer .sp-cook:empty{display:none}' +
    '#sb-planer .sp-cook h3{margin:0 0 8px;font-size:17px}#sb-planer .sp-cook ul{margin:0;padding-left:18px}#sb-planer .sp-cook li{margin:4px 0;font-size:14.5px}#sb-planer .sp-x3{font-weight:700;color:var(--g)}#sb-planer .sp-sum{margin:10px 0 0;font-weight:600}' +
    '#sb-planer .sp-tag{align-self:flex-start;font-size:11px;font-weight:600;line-height:1;padding:4px 7px;border-radius:999px;background:var(--ti);color:var(--gd)}#sb-planer .sp-tf{background:#FDECEA;color:#9A3412}#sb-planer .sp-tq{background:#F1F5F9;color:#475569}' +
    '#sb-planer .sp-calcb{margin-top:8px}#sb-planer .sp-calc{grid-column:1/-1;background:var(--iv);border:1px solid var(--li);border-radius:14px;padding:16px}#sb-planer .sp-calc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}' +
    '#sb-planer .sp-calc fieldset{margin:0;border:1px solid var(--li);border-radius:12px;padding:10px 12px 12px;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:8px}#sb-planer .sp-calc legend{padding:0 4px;font-size:14px}#sb-planer .sp-calc legend strong{color:var(--g)}' +
    '#sb-planer .sp-calc label{display:flex;flex-direction:column;gap:3px;font-size:12.5px;color:var(--mu)}#sb-planer .sp-calc .sp-wide{grid-column:1/-1}#sb-planer .sp-calc input,#sb-planer .sp-calc select{height:38px;border:1px solid var(--li);border-radius:9px;padding:0 8px;font:inherit;font-size:14px;color:var(--tx);background:#fff;width:100%}#sb-planer .sp-calc .sp-btn{margin-top:12px}' +
    '#sb-planer tr.sp-sumrow td.sp-off strong{color:#B45309}#sb-planer tr.sp-sumrow small{font-size:11.5px;color:var(--mu)}#sb-planer output.sp-kc{min-width:56px}' +
    '#sb-planer tr.sp-sumrow td,#sb-planer tr.sp-sumrow th{height:auto!important;min-height:0!important;vertical-align:middle!important;padding-top:7px!important;padding-bottom:7px!important}#sb-planer tr.sp-sumrow td{background:#fff;border-top:2px solid var(--tl);font-size:13px;color:var(--mu);text-align:center;padding:8px 4px}#sb-planer tr.sp-sumrow td strong{color:var(--tx);font-size:14px}#sb-planer tr.sp-sumrow th{font-size:13px}#sb-planer .sp-info{cursor:help;color:var(--mu)}' +
    '#sb-planer .sp-board{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:14px;align-items:start}#sb-planer .sp-dock{position:sticky;top:12px;background:#fff;border:1px solid var(--li);border-radius:14px;padding:12px;max-height:80vh;overflow:auto}#sb-planer .sp-dock h3{margin:0 0 8px;font-size:15px}' +
    '#sb-planer .sp-dock-list{display:flex;flex-direction:column;gap:6px;min-height:60px;border-radius:10px;padding:2px}#sb-planer .sp-di{display:flex;align-items:center;gap:8px;padding:6px;border:1px solid var(--li);border-radius:10px;background:var(--iv);cursor:grab;user-select:none}#sb-planer .sp-di .sp-dimg{width:34px;height:34px;border-radius:8px;object-fit:cover;flex:0 0 34px}#sb-planer .sp-dn{flex:1;font-size:13px;font-weight:600;line-height:1.25}' +
    '#sb-planer .sp-grip{cursor:grab;touch-action:none;user-select:none;color:var(--mu);font-size:16px;line-height:1;padding:4px;border-radius:6px}#sb-planer .sp-grip:hover{background:var(--ti);color:var(--gd)}#sb-planer .sp-cell{position:relative;cursor:grab;user-select:none;-webkit-user-select:none}#sb-planer .sp-cell .sp-grip{position:absolute;bottom:2px;right:2px}' +
    '#sb-planer td.sp-over,#sb-planer .sp-dock-list.sp-over{outline:2px dashed var(--g);outline-offset:-2px;background:var(--ti)}#sb-planer .sp-sel,#sb-planer td.sp-sel{outline:2px solid var(--ac);outline-offset:-2px}#sb-planer .sp-twarn{background:#FEF3C7;color:#92400E}' +
    '.sp-ghost{position:fixed;z-index:99999;pointer-events:none;padding:8px 12px;border-radius:10px;background:#111827;color:#fff;font:600 13px/1.3 Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:220px}body.sp-dragging{cursor:grabbing;user-select:none}' +
    '@media (max-width:900px){#sb-planer .sp-board{grid-template-columns:1fr}#sb-planer .sp-dock{position:static;max-height:none;order:-1}#sb-planer .sp-dock-list{flex-direction:row;overflow-x:auto}#sb-planer .sp-di{flex:0 0 190px}}' +
    '#sb-planer .sp-mpinfo{margin:8px 0 0;font-size:13.5px;color:var(--mu);display:flex;flex-wrap:wrap;gap:6px;align-items:center}#sb-planer .sp-favb[aria-pressed=true]{background:var(--g);color:#fff;border-color:var(--g)}';
    var el = document.createElement('style'); el.textContent = css; document.head.appendChild(el); })();
  renderSetup(); renderTab(); renderPlan();
})();
