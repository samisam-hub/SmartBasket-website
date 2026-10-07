/* SmartBasket Familienbeispiel: Beispielhaushalt, Vorrat und Preise sind Beispieldaten. */
(function () {
'use strict';

var SB_PEOPLE = [{ id: 'anna', name: 'Anna', kcal: 2000 }, { id: 'alex', name: 'Alex', kcal: 2400 }, { id: 'mia', name: 'Mia', kcal: 1400 }];
var SB_SLOTS = {
  breakfast: { label: 'Frühstück', share: 0.25, q: 'Was gibt es zum Frühstück?' },
  lunch: { label: 'Mittagessen', share: 0.32, q: 'Was gibt es mittags?' },
  dinner: { label: 'Abendessen', share: 0.30, q: 'Was gibt es am Abend?' }
};
var SB_DAYS = [{ id: 'mon', label: 'Montag', slots: ['breakfast', 'lunch', 'dinner'] }, { id: 'tue', label: 'Dienstag', slots: ['breakfast', 'lunch', 'dinner'] }];
var SB_DISHES = {
  sunny: { name: 'Spiegelei auf Sauerteigbrot', parts: 'Ei · Sauerteigbrot · Kirschtomaten', img: '../assets/breakfast.webp', kcal: 389, ing: [['eggs', 100], ['sourdough', 70], ['cherrytom', 100], ['spinach', 30], ['oil', 5]] },
  muesli: { name: 'Joghurt-Müsli mit Beeren', parts: 'Joghurt · Haferflocken · Beeren', img: '../assets/yogurtbowl.webp', kcal: 428, ing: [['yogurt', 250], ['oats', 50], ['berries', 120]] },
  oat: { name: 'Haferbrei mit Beeren', parts: 'Haferflocken · Beeren · Banane', img: '../assets/oats.webp', kcal: 423, ing: [['oats', 70], ['berries', 150], ['banana', 100]] },
  chickpot: { name: 'Hähnchen mit Kartoffeln und Brokkoli', parts: 'Hähnchen · Kartoffeln · Brokkoli', img: '../assets/chickenpotato.webp', kcal: 588, ing: [['chicken', 180], ['potatoes', 300], ['broccoli', 150], ['oil', 10]] },
  tunapasta: { name: 'Nudeln mit Tomaten-Thunfisch-Soße', parts: 'Nudeln · Tomaten · Thunfisch', img: '../assets/tunapasta.webp', kcal: 583, ing: [['tuna', 150], ['pasta', 85], ['tomatoes', 180], ['oil', 8]] },
  lentil: { name: 'Linsen-Pasta mit Tomaten', parts: 'Linsen · Nudeln · Tomaten', img: '../assets/lentilpasta.webp', kcal: 527, ing: [['lentils', 60], ['pasta', 65], ['tomatoes', 200], ['oil', 5]] },
  stroganoff: { name: 'Hähnchen-Geschnetzeltes mit Nudeln', parts: 'Hähnchen · Bandnudeln · Champignons', img: '../assets/stroganoff.webp', kcal: 632, ing: [['chicken', 180], ['noodles', 65], ['mushrooms', 100], ['onion', 40], ['cream', 70], ['oil', 5]] },
  eggs: { name: 'Rührei mit Kartoffeln und Spinat', parts: 'Eier · Kartoffeln · Spinat', img: '../assets/scrambled.webp', kcal: 465, ing: [['eggs', 180], ['spinach', 100], ['potatoes', 180], ['oil', 5]] },
  lasagne: { name: 'Lasagne zum Aufwärmen', parts: 'Fertiggericht · 5 Minuten', img: '../assets/heatandeat.webp', tag: 'Aufwärmen', kcal: 620, ing: [['lasagne', 400]] },
  toast: { name: 'Abendbrot mit Ei und Hähnchenschinken', parts: 'Vollkornbrot · Eier · Hähnchenschinken', img: '../assets/hamtoast.webp', kcal: 344, ing: [['eggs', 100], ['bread', 60], ['ham', 50]] },
  salmon: { name: 'Lachs mit Reis und Brokkoli', parts: 'Lachs · Reis · Brokkoli', img: '../assets/salmonrice.webp', kcal: 689, ing: [['salmon', 150], ['rice', 75], ['broccoli', 180], ['oil', 5]] },
  out: { name: 'Auswärts essen', parts: 'Heute kocht jemand anderes', img: '../assets/eatout.webp', tag: 'Auswärts', out: true }
};
var SB_DECKS = { breakfast: ['sunny', 'muesli', 'oat'], lunch: ['chickpot', 'tunapasta', 'lentil', 'stroganoff', 'eggs', 'lasagne'], dinner: ['toast', 'stroganoff', 'salmon', 'tunapasta', 'out'] };
var SB_OWN = {
  cottage: { name: 'Brot mit Hüttenkäse und Karotten', parts: 'Vollkornbrot · Hüttenkäse · Karotten', kcal: 354, ing: [['bread', 100], ['cottage', 100], ['carrots', 100]] },
  lunchbox: { name: 'Lunchbox mit Hähnchenschinken, Apfel und Karotten', parts: 'Vollkornbrot · Hähnchenschinken · Apfel · Karotten', kcal: 353, ing: [['bread', 80], ['ham', 60], ['apple', 150], ['carrots', 100]] }
};
var SB_ITEMS = {
  eggs: { name: 'Eier', unit: 'Stück', size: 10, price: 2.49, gramsPerPiece: 60 },
  sourdough: { name: 'Sauerteigbrot', unit: 'g', size: 750, price: 2.49 },
  bread: { name: 'Vollkornbrot', unit: 'g', size: 500, price: 1.39 },
  cherrytom: { name: 'Kirschtomaten', unit: 'g', size: 250, price: 1.19 },
  yogurt: { name: 'Naturjoghurt', unit: 'g', size: 500, price: 0.89 },
  oats: { name: 'Haferflocken', unit: 'g', size: 500, price: 0.59 },
  berries: { name: 'Beeren, tiefgekühlt', unit: 'g', size: 750, price: 2.49 },
  banana: { name: 'Bananen', unit: 'g', size: 1000, price: 1.59 },
  chicken: { name: 'Hähnchenbrust', unit: 'g', size: 400, price: 4.49 },
  potatoes: { name: 'Kartoffeln', unit: 'g', size: 2000, price: 2.19 },
  broccoli: { name: 'Brokkoli, tiefgekühlt', unit: 'g', size: 1000, price: 1.99 },
  spinach: { name: 'Spinat, tiefgekühlt', unit: 'g', size: 450, price: 1.29 },
  tuna: { name: 'Thunfisch in der Dose, abgetropft', unit: 'g', size: 140, price: 1.49 },
  pasta: { name: 'Nudeln', unit: 'g', size: 500, price: 0.79 },
  tomatoes: { name: 'Gehackte Tomaten', unit: 'g', size: 400, price: 0.59 },
  lentils: { name: 'Rote Linsen', unit: 'g', size: 500, price: 1.49 },
  noodles: { name: 'Bandnudeln', unit: 'g', size: 500, price: 1.19 },
  mushrooms: { name: 'Champignons', unit: 'g', size: 400, price: 1.69 },
  onion: { name: 'Zwiebeln', unit: 'g', size: 1000, price: 1.29 },
  cream: { name: 'Pflanzliche Kochcreme', unit: 'ml', size: 200, price: 0.79 },
  salmon: { name: 'Lachs, tiefgekühlt', unit: 'g', size: 250, price: 3.99 },
  rice: { name: 'Reis', unit: 'g', size: 1000, price: 1.49 },
  lasagne: { name: 'Fertiglasagne', unit: 'g', size: 400, price: 2.79 },
  ham: { name: 'Hähnchenschinken', unit: 'g', size: 100, price: 1.29 },
  cottage: { name: 'Hüttenkäse', unit: 'g', size: 200, price: 0.99 },
  carrots: { name: 'Karotten', unit: 'g', size: 1000, price: 0.99 },
  apple: { name: 'Äpfel', unit: 'g', size: 1000, price: 1.99 },
  oil: { name: 'Olivenöl', unit: 'ml', size: 500, price: 3.99 }
};
var SB_ITEM_ORDER = Object.keys(SB_ITEMS);
function sbMeal(dish) { return { dish: dish, skipped: false, present: { anna: true, alex: true, mia: true }, own: null, ownOpen: false, choosing: !dish, cand: 0, rejected: [] }; }
function sbInitial() {
  return { day: 'mon', tueIntro: true, active: { mon: 'breakfast', tue: 'breakfast' },
    meals: { mon: { breakfast: sbMeal(null), lunch: sbMeal(null), dinner: sbMeal(null) }, tue: { breakfast: sbMeal(null), lunch: sbMeal(null), dinner: sbMeal(null) } },
    pantry: { potatoes: 1000, oil: 250, oats: 300 }, pantryErr: {}, pantryText: {}, pantryOpen: {}, checked: {}, notice: '', prev: null, drag: 0 };
}
function sbNum(v, digits) { return v.toLocaleString('de-DE', { maximumFractionDigits: digits, minimumFractionDigits: 0 }); }
function sbQty(v, unit) {
  if (unit === 'Stück') return Math.ceil(v - 1e-6) + ' Stück';
  if (v >= 1000) return sbNum(v / 1000, 2) + ' ' + (unit === 'g' ? 'kg' : 'l');
  return Math.round(v) + ' ' + unit;
}
function sbPack(item) { return item.unit === 'Stück' ? item.size + ' Stück' : sbQty(item.size, item.unit); }
function sbEur(n) { return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }); }
function sbJoin(names) { return names.length <= 1 ? names.join('') : names.slice(0, -1).join(', ') + ' und ' + names[names.length - 1]; }
function sbWho(list) { return list.length === 3 ? 'alle drei' : sbJoin(list.map(function (p) { return p.name; })); }
function sbFamilyEaters(m) { return SB_PEOPLE.filter(function (p) { return m.present[p.id] && !(m.own && p.id === 'mia'); }); }
function sbAmount(k, grams) { var it = SB_ITEMS[k]; return it.gramsPerPiece ? grams / it.gramsPerPiece : grams; }
function sbSlotPhrase(dayLabel, slot) { return slot === 'lunch' ? dayLabel + 'mittag' : slot === 'breakfast' ? 'Das Frühstück am ' + dayLabel : 'Das Abendessen am ' + dayLabel; }
function sbCalc(st) {
  var need = {}, perDay = {}, lines = [];
  SB_DAYS.forEach(function (d) {
    var groups = [];
    perDay[d.id] = groups;
    d.slots.forEach(function (slot) {
      var m = st.meals[d.id][slot], sl = SB_SLOTS[slot];
      if (m.skipped || m.choosing || !m.dish) return;
      var dish = SB_DISHES[m.dish];
      if (dish.out) { groups.push({ title: sl.label + ' · Auswärts essen', note: 'Nichts einzukaufen.', hasNote: true, items: [] }); return; }
      var eaters = sbFamilyEaters(m);
      if (eaters.length) {
        var kcal = eaters.reduce(function (s, p) { return s + sl.share * p.kcal; }, 0), f = kcal / dish.kcal;
        var items = dish.ing.map(function (x) { var a = sbAmount(x[0], x[1] * f); need[x[0]] = (need[x[0]] || 0) + a; return { name: SB_ITEMS[x[0]].name, qty: sbQty(a, SB_ITEMS[x[0]].unit) }; });
        groups.push({ title: sl.label + ' · für ' + sbWho(eaters) + ' · ' + dish.name, note: '', hasNote: false, items: items });
        lines.push({ text: d.label + ', ' + sl.label + ' (' + Math.round(sl.share * 100) + ' %) · ' + dish.name + ': ' + eaters.map(function (p) { return p.name + ' ' + sbNum(sl.share * p.kcal, 0) + ' kcal'; }).join(' + ') + ' = ' + sbNum(kcal, 0) + ' kcal. Rezeptportion ' + dish.kcal + ' kcal, Skalierungsfaktor ' + sbNum(f, 2) + '.' });
      }
      if (m.own) {
        var own = SB_OWN[m.own], k2 = sl.share * SB_PEOPLE[2].kcal, f2 = k2 / own.kcal;
        var items2 = own.ing.map(function (x) { var a = sbAmount(x[0], x[1] * f2); need[x[0]] = (need[x[0]] || 0) + a; return { name: SB_ITEMS[x[0]].name, qty: sbQty(a, SB_ITEMS[x[0]].unit) }; });
        groups.push({ title: sl.label + ' · für Mia · ' + own.name, note: '', hasNote: false, items: items2 });
        lines.push({ text: d.label + ', ' + sl.label + ' · ' + own.name + ': Mia ' + sbNum(k2, 0) + ' kcal. Rezeptportion ' + own.kcal + ' kcal, Skalierungsfaktor ' + sbNum(f2, 2) + '.' });
      }
    });
  });
  var rows = [], total = 0;
  SB_ITEM_ORDER.forEach(function (k) {
    if (!need[k]) return;
    var it = SB_ITEMS[k], n = need[k], have = Math.max(0, st.pantry[k] || 0);
    var used = Math.min(n, have), buy = Math.max(0, n - used), packs = Math.max(0, Math.ceil(buy / it.size - 1e-9));
    var price = packs * it.price;
    total += price;
    rows.push({ key: k, need: n, used: used, packs: packs, price: price, left: packs * it.size - buy });
  });
  return { need: need, perDay: perDay, rows: rows, total: total, lines: lines };
}
function sbSnapshot(st) { var s = {}; sbCalc(st).rows.forEach(function (r) { s[r.key] = { need: r.need, packs: r.packs }; }); return s; }
function sbMealDone(m) {
  if (m.skipped) return true;
  if (m.choosing || !m.dish) return false;
  if (SB_DISHES[m.dish].out) return true;
  return sbFamilyEaters(m).length > 0 || !!m.own;
}
function sbDayDone(st, d) { return d.slots.every(function (s) { return sbMealDone(st.meals[d.id][s]); }); }


var sbState = sbInitial(), sbDragX = null, sbDrag = 0;
function sbEsc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function sbDay(st) { return SB_DAYS.filter(function (d) { return d.id === st.day; })[0]; }
function sbCur(st) { return st.meals[st.day][st.active[st.day]]; }
function sbIntro(st) { return st.day === 'tue' && st.tueIntro; }
function sbNextCand(deck, m, from) { for (var i = 1; i <= deck.length; i++) { var j = (from + i) % deck.length; if (m.rejected.indexOf(deck[j]) < 0) return j; } return -1; }
function sbAdvanceFrom(st, cur) { var d = sbDay(st); for (var i = 1; i <= d.slots.length; i++) { var s = d.slots[(cur + i + d.slots.length) % d.slots.length]; if (!sbMealDone(st.meals[st.day][s])) { st.active[st.day] = s; return; } } }
function sbAdvance(st) { sbAdvanceFrom(st, sbDay(st).slots.indexOf(st.active[st.day])); }

function sbChange(mutate, quiet) {
  var st = JSON.parse(JSON.stringify(sbState));
  mutate(st);
  st.prev = sbSnapshot(sbState);
  var after = sbCalc(st), changed = JSON.stringify(sbSnapshot(st)) !== JSON.stringify(st.prev);
  st.notice = quiet ? sbState.notice : (changed ? 'Einkaufsliste aktualisiert · geschätzt ' + sbEur(after.total) + '.' : 'Plan geändert. Die Einkaufsliste bleibt gleich.');
  sbState = st; sbDrag = 0; sbRender();
}
function sbTake() {
  if (sbIntro(sbState)) return sbChange(function (st) {
    ['breakfast', 'lunch', 'dinner'].forEach(function (sl) { var mm = st.meals.mon[sl]; if (!sbMealDone(mm)) return; var t = st.meals.tue[sl]; t.dish = mm.dish; t.skipped = mm.skipped; t.present = Object.assign({}, mm.present); t.choosing = false; t.rejected = []; t.cand = 0; t.own = null; t.ownOpen = false; });
    st.tueIntro = false; st.active.tue = 'breakfast'; sbAdvanceFrom(st, -1);
  });
  sbChange(function (st) { var m = sbCur(st), deck = SB_DECKS[st.active[st.day]]; if (!m.choosing || m.cand < 0) return; m.dish = deck[m.cand]; m.choosing = false; m.rejected = []; if (SB_DISHES[m.dish].out) { m.own = null; m.ownOpen = false; } sbAdvance(st); });
}
function sbReject() {
  if (sbIntro(sbState)) return sbChange(function (st) { st.tueIntro = false; st.active.tue = 'breakfast'; }, true);
  sbChange(function (st) { var m = sbCur(st), deck = SB_DECKS[st.active[st.day]]; if (!m.choosing || m.cand < 0) return; m.rejected.push(deck[m.cand]); m.cand = sbNextCand(deck, m, m.cand); }, true);
}
var SB_ACTIONS = {
  day: function (v) { sbState.day = v; sbDrag = 0; sbRender(); },
  slot: function (v) { sbState.active[sbState.day] = v; if (sbState.day === 'tue') sbState.tueIntro = false; sbDrag = 0; sbRender(); },
  take: sbTake, reject: sbReject,
  change: function () { sbChange(function (s) { var mm = sbCur(s), dk = SB_DECKS[s.active[s.day]]; mm.choosing = true; mm.rejected = []; mm.cand = (dk.indexOf(mm.dish) + 1) % dk.length; mm.dish = null; }); },
  restart: function () { sbChange(function (s) { var mm = sbCur(s); mm.rejected = []; mm.cand = 0; }, true); },
  skip: function () { sbChange(function (s) { var mm = sbCur(s); mm.skipped = true; mm.choosing = false; mm.dish = null; mm.own = null; mm.ownOpen = false; mm.present.mia = true; sbAdvance(s); }); },
  unskip: function () { sbChange(function (s) { var mm = sbCur(s); mm.skipped = false; mm.choosing = true; mm.dish = null; mm.rejected = []; mm.cand = 0; }, true); },
  person: function (v) { sbChange(function (s) { var mm = sbCur(s); mm.present[v] = !mm.present[v]; }); },
  openOwn: function () { sbChange(function (s) { sbCur(s).ownOpen = true; }, true); },
  closeOwn: function () { sbChange(function (s) { sbCur(s).ownOpen = false; }, true); },
  pickOwn: function (v) { sbChange(function (s) { var mm = sbCur(s); mm.own = v; mm.ownOpen = false; mm.present.mia = true; }); },
  ownBack: function () { sbChange(function (s) { var mm = sbCur(s); mm.own = null; mm.present.mia = true; }); },
  reset: function () { sbState = sbInitial(); sbState.notice = 'Beispiel zurückgesetzt.'; sbDrag = 0; sbRender(); },
  check: function (v) { sbState.checked[v] = !sbState.checked[v]; sbRender(); },
  pantry: function (v) { sbState.pantryOpen[v] = !sbState.pantryOpen[v]; sbRender(); }
};

function sbBtn(cls, action, value, label, extra) { return '<button type="button" class="' + cls + '" data-action="' + action + '"' + (value !== undefined && value !== null ? ' data-value="' + sbEsc(value) + '"' : '') + ' data-key="' + action + '-' + sbEsc(value || '') + '"' + (extra || '') + '>' + label + '</button>'; }
function sbCardInner(d, tagText, okTag) {
  return '<div class="img"><img src="' + d.img + '" alt="' + sbEsc(d.name) + '" draggable="false" width="280" height="230">' + (tagText ? '<span class="tag' + (okTag ? ' ok' : '') + '">' + sbEsc(tagText) + '</span>' : '') + '</div><div class="txt"><b>' + sbEsc(d.name) + '</b><span>' + sbEsc(d.parts) + '</span></div>';
}
function sbSwipeButtons(noLabel, yesLabel) {
  return '<div class="swipe-btns">' + sbBtn('round', 'reject', null, '<i aria-hidden="true">✕</i>' + noLabel) + sbBtn('round yes', 'take', null, '<i aria-hidden="true">✓</i>' + yesLabel) + '</div>';
}

function sbEditor(st) {
  var day = st.day, slot = st.active[day], m = st.meals[day][slot], dayObj = sbDay(st), sl = SB_SLOTS[slot];
  var deck = SB_DECKS[slot], eaters = sbFamilyEaters(m), intro = sbIntro(st), h = '';
  var isOut = !intro && !m.skipped && !m.choosing && !!m.dish && !!SB_DISHES[m.dish].out;
  h += '<span class="panel-title">' + (intro ? 'DIENSTAG · ZUERST' : sbEsc(dayObj.label.toUpperCase() + ' · ' + sl.label.toUpperCase())) + '</span>';
  if (intro) {
    var monOpen = !SB_DAYS[0].slots.every(function (s) { return sbMealDone(st.meals.mon[s]); });
    h += '<p class="muted">Übernimm den geplanten Montag mit einem Wisch oder plane den Dienstag neu.</p>';
    h += '<div class="deck auto"><div class="card repeat" id="sb-card" tabindex="0" role="group" aria-label="Montag wiederholen. Pfeiltaste nach vorn übernimmt den Montag, Pfeiltaste zurück plant neu."><div class="repeat-head"><i aria-hidden="true">↻</i>Montag wiederholen</div><span class="muted">Dieselben Gerichte und dieselbe Anwesenheit wie am Montag:</span>';
    ['breakfast', 'lunch', 'dinner'].forEach(function (s) { var mm = st.meals.mon[s]; h += '<div class="mini"><small>' + SB_SLOTS[s].label.toUpperCase() + '</small><b>' + sbEsc(mm.skipped ? 'Ausgelassen' : !sbMealDone(mm) ? 'Noch offen' : SB_DISHES[mm.dish].name) + '</b></div>'; });
    h += '</div></div>' + sbSwipeButtons('Neu planen', 'Montag übernehmen');
    if (monOpen) h += '<p class="error center">Am Montag sind noch Mahlzeiten offen. Sie bleiben am Dienstag ebenfalls offen.</p>';
    return h;
  }
  if (m.skipped) {
    return h + '<div class="box"><b>Diese Mahlzeit ist ausgelassen.</b><span class="muted">Dafür wird nichts eingekauft. Andere Mahlzeiten bleiben unverändert.</span><div class="row">' + sbBtn('small-btn', 'unskip', null, 'Doch ein Gericht wählen') + '</div></div>';
  }
  if (m.choosing && m.cand < 0) {
    return h + '<div class="box warm" role="status"><span class="open-label">Noch kein Gericht gewählt</span><p>Keines davon passt? Du kannst die Vorschläge erneut ansehen oder diese Mahlzeit auslassen.</p><div class="row">' + sbBtn('small-btn primary', 'restart', null, 'Vorschläge erneut ansehen') + sbBtn('small-btn', 'skip', null, 'Mahlzeit auslassen') + '</div></div>' + sbPeople(st, m, eaters, false);
  }
  if (m.choosing) {
    var cand = SB_DISHES[deck[m.cand]], ni = sbNextCand(deck, m, m.cand);
    h += '<span class="open-label">Noch kein Gericht gewählt</span><p class="muted">' + sbEsc(sl.q) + ' Lass dir andere passende Gerichte zeigen. Vorschlag ' + (m.rejected.length + 1) + ' von ' + deck.length + '.</p>';
    h += '<div class="deck">' + (ni >= 0 && ni !== m.cand ? '<div class="card peek" aria-hidden="true"><div class="img"><img src="' + SB_DISHES[deck[ni]].img + '" alt="" width="280" height="230"></div></div>' : '');
    h += '<div class="card" id="sb-card" tabindex="0" role="group" aria-label="Vorschlag: ' + sbEsc(cand.name) + '. Pfeiltaste nach vorn nimmt das Gericht, Pfeiltaste zurück zeigt ein anderes.">' + sbCardInner(cand, cand.tag, false) + '</div></div>';
    h += sbSwipeButtons('Anderes Gericht', 'Dieses Gericht nehmen');
    h += '<p class="muted center">Wische die Karte oder nutze die Buttons. Bei ausgewählter Karte gehen auch die Pfeiltasten.</p><div class="row centered">' + sbBtn('small-btn quiet', 'skip', null, 'Diese Mahlzeit auslassen') + '</div>';
    return h + sbPeople(st, m, eaters, false);
  }
  var dish = SB_DISHES[m.dish], kind = isOut ? 'Auswärts' : dish.tag === 'Aufwärmen' ? 'Aufwärmen' : 'Familiengericht';
  h += '<div class="chosen">' + sbCardInner(dish, '✓ Gewählt · ' + kind, true) + '</div>';
  h += '<div class="row centered">' + sbBtn('small-btn', 'change', null, 'Gericht ändern') + sbBtn('small-btn quiet', 'skip', null, 'Diese Mahlzeit auslassen') + '</div>';
  if (isOut) return h + '<p class="muted">Ihr esst auswärts. Für diese Mahlzeit wird nichts eingekauft.</p>';
  return h + sbPeople(st, m, eaters, true);
}
function sbPeople(st, m, eaters, chosen) {
  var day = st.day, slot = st.active[day], dayObj = sbDay(st), h = '<div class="people">';
  if (day === 'mon' && slot === 'lunch') h += '<span class="school">Mia isst montags mittags in der Schule.</span>';
  h += '<b>Wer isst mit?</b><div class="row" role="group" aria-label="Wer isst mit?">';
  SB_PEOPLE.forEach(function (p) {
    var ownMia = !!m.own && p.id === 'mia', on = !!m.present[p.id] && !ownMia;
    h += ownMia ? '<button type="button" class="person own" disabled aria-pressed="false">Mia · eigenes Gericht</button>'
      : sbBtn('person', 'person', p.id, sbEsc(on ? '✓ ' + p.name + ' · isst mit' : p.name + ' · isst nicht mit'), ' aria-pressed="' + on + '"');
  });
  h += '</div>';
  if (chosen) {
    if (m.own) h += '<p class="planned">' + sbEsc((eaters.length ? sbJoin(eaters.map(function (p) { return p.name; })) + (eaters.length > 1 ? ' essen' : ' isst') + ' das Familiengericht. ' : '') + 'Mia bekommt ihr eigenes Gericht. Der Einkauf enthält die Zutaten für beide.') + '</p>';
    else if (eaters.length) h += '<p class="planned">' + sbEsc(sbSlotPhrase(dayObj.label, slot) + ' ist für ' + sbWho(eaters) + ' geplant.') + '</p>';
    else h += '<p class="error" role="alert">Für dieses Gericht ist niemand ausgewählt. Wähle mindestens eine Person aus oder lass die Mahlzeit aus.</p>';
  }
  if (day === 'tue' && slot === 'lunch') {
    if (m.own) h += '<div class="own-card"><small>EIGENES GERICHT · MIA</small><b>' + sbEsc(SB_OWN[m.own].name) + '</b><span>' + sbEsc(SB_OWN[m.own].parts) + '</span></div><div class="row">' + sbBtn('small-btn', 'ownBack', null, 'Mia isst wieder mit') + '</div>';
    else if (m.ownOpen) {
      h += '<b>Eigenes Gericht für Mia wählen</b>';
      Object.keys(SB_OWN).forEach(function (k) { h += '<div class="own-opt"><div><b>' + sbEsc(SB_OWN[k].name) + '</b><span>' + sbEsc(SB_OWN[k].parts) + '</span></div>' + sbBtn('small-btn primary', 'pickOwn', k, 'Für Mia wählen') + '</div>'; });
      h += '<div class="row">' + sbBtn('small-btn quiet', 'closeOwn', null, 'Abbrechen') + '</div>';
    } else h += '<div class="row">' + sbBtn('small-btn accent', 'openOwn', null, 'Eigenes Gericht für Mia') + '</div>';
  }
  return h + '</div>';
}

function sbRender() {
  var st = sbState, c = sbCalc(st), active = document.activeElement, focusKey = active && active.getAttribute ? active.getAttribute('data-key') : null, wasCard = active && active.id === 'sb-card';
  var allDone = SB_DAYS.every(function (d) { return sbDayDone(st, d); });
  var $ = function (id) { return document.getElementById(id); };
  $('sb-days').innerHTML = SB_DAYS.map(function (d) { return '<button type="button" class="day-tab" data-action="day" data-value="' + d.id + '" data-key="day-' + d.id + '" aria-pressed="' + (d.id === st.day) + '"><b>' + d.label + '</b><small>' + (sbDayDone(st, d) ? 'Geplant' : 'Noch offen') + '</small></button>'; }).join('');
  $('sb-status').textContent = allDone ? 'Geplant: Alle Mahlzeiten von Montag und Dienstag sind entschieden.' : 'Dein Plan ist noch nicht vollständig.';
  $('sb-status').className = 'plan-status' + (allDone ? ' done' : '');
  $('sb-slots').innerHTML = sbDay(st).slots.map(function (s) {
    var mm = st.meals[st.day][s], done = sbMealDone(mm);
    var status = mm.skipped ? 'Ausgelassen' : (mm.choosing || !mm.dish) ? 'Noch kein Gericht gewählt' : SB_DISHES[mm.dish].name + (mm.own ? ' · Mia: eigenes Gericht' : '');
    if (!mm.skipped && !mm.choosing && mm.dish && !SB_DISHES[mm.dish].out && !sbFamilyEaters(mm).length && !mm.own) status = 'Niemand ausgewählt';
    return '<button type="button" class="slot-btn" data-action="slot" data-value="' + s + '" data-key="slot-' + s + '" aria-pressed="' + (s === st.active[st.day]) + '"><b>' + SB_SLOTS[s].label + '</b><span class="' + (done ? '' : 'open') + '">' + sbEsc(status) + '</span></button>';
  }).join('');
  $('sb-editor').innerHTML = sbEditor(st) + '<p class="notice" aria-live="polite">' + sbEsc(st.notice) + '</p>';
  var groups = c.perDay[st.day];
  $('sb-amounts').innerHTML = '<h3>Mengen für ' + sbDay(st).label + '</h3>' + (groups.length ? groups.map(function (g) { return '<div class="qty-group"><b>' + sbEsc(g.title) + '</b>' + (g.note ? '<span class="muted">' + sbEsc(g.note) + '</span>' : '') + g.items.map(function (it) { return '<div class="qty-line"><span>' + sbEsc(it.name) + '</span><strong>' + sbEsc(it.qty) + '</strong></div>'; }).join('') + '</div>'; }).join('') : '<p class="muted">Noch kein Gericht gewählt. Sobald ein Gericht feststeht, erscheinen hier die Mengen.</p>');
  var packsTxt = function (r) { var it = SB_ITEMS[r.key]; return r.packs ? r.packs + ' × ' + sbPack(it) : 'Nichts zu kaufen, Vorrat reicht'; };
  $('sb-short').innerHTML = '<h3>Einkaufsliste für Montag und Dienstag</h3>' + (c.rows.length ? c.rows.map(function (r) { return '<div class="qty-line"><span>' + sbEsc(SB_ITEMS[r.key].name) + '</span><strong>' + sbEsc(packsTxt(r)) + '</strong></div>'; }).join('') : '<p>Noch leer. Wähle ein Gericht aus.</p>') + '<div class="qty-line"><small>Geschätzter Betrag für diesen Einkauf</small></div><span class="big">' + sbEur(c.total) + '</span><a href="#einkauf">Ganze Einkaufsliste mit Vorrat ansehen</a>';
  $('sb-calc').innerHTML = (c.lines.length ? c.lines : [{ text: 'Im Moment ist kein Gericht gewählt.' }]).map(function (l) { return '<p class="calc-line">' + sbEsc(l.text) + '</p>'; }).join('');
  $('sb-notice2').textContent = st.notice;
  $('sb-total2').textContent = sbEur(c.total);
  var prev = st.prev || {};
  $('sb-list').innerHTML = c.rows.length ? c.rows.map(function (r) {
    var it = SB_ITEMS[r.key], p = prev[r.key], checked = !!st.checked[r.key], open = !!st.pantryOpen[r.key];
    var same = !!p && r.packs > 0 && r.need < p.need - 0.5 && r.packs === p.packs, hasLeft = r.packs > 0 && r.left >= (it.unit === 'Stück' ? 1 : 5);
    var val = st.pantryText[r.key] !== undefined ? st.pantryText[r.key] : String(st.pantry[r.key] || 0);
    return '<div class="item' + (checked ? ' checked' : '') + '"><div class="item-top"><label><input type="checkbox" data-action="check" data-value="' + r.key + '" data-key="check-' + r.key + '"' + (checked ? ' checked' : '') + '><span class="names"><b>' + sbEsc(it.name) + '</b><strong>' + sbEsc(packsTxt(r)) + '</strong><span>' + (checked ? 'Abgehakt · liegt im Wagen' : 'Noch nicht abgehakt') + '</span></span></label><span class="price">' + sbEur(r.price) + '</span></div>'
      + '<div class="facts"><span>Benötigt: ' + sbEsc(sbQty(r.need, it.unit)) + '</span>' + (r.used > 0 ? '<span>Vorrat berücksichtigt: ' + sbEsc(sbQty(r.used, it.unit)) + '</span>' : '') + (hasLeft ? '<span>Voraussichtlich übrig nach dem Kochen: ' + sbEsc(it.unit === 'Stück' ? Math.floor(r.left + 1e-6) + ' Stück' : sbQty(r.left, it.unit)) + '</span>' : '') + (same ? '<span class="same">Ihr braucht weniger, dieselbe Packung reicht weiterhin.</span>' : '') + '</div>'
      + '<div class="pantry">' + sbBtn('link-btn', 'pantry', r.key, 'Schon vorhanden?', ' aria-expanded="' + open + '" aria-controls="sb-pf-' + r.key + '"')
      + (open ? '<div class="pantry-form" id="sb-pf-' + r.key + '"><label for="sb-pantry-' + r.key + '">Vorhanden in ' + it.unit + '</label><input id="sb-pantry-' + r.key + '" type="number" min="0" step="' + (it.unit === 'Stück' ? 1 : 50) + '" inputmode="numeric" value="' + sbEsc(val) + '" data-pantry="' + r.key + '" data-key="pantryinput-' + r.key + '"><small>Ändert nur den Beispielvorrat dieser Demo.</small>' + (st.pantryErr[r.key] ? '<span class="field-error" role="alert">' + sbEsc(st.pantryErr[r.key]) + '</span>' : '') + '</div>' : '') + '</div></div>';
  }).join('') : '<p class="noscript-box">Für die gewählten Mahlzeiten wird gerade nichts gebraucht.</p>';
  if (focusKey) { var el = document.querySelector('[data-key="' + focusKey + '"]'); if (el) el.focus({ preventScroll: true }); }
  else if (wasCard) { var cd = document.getElementById('sb-card'); if (cd) cd.focus({ preventScroll: true }); }
}

function sbInit() {
  var root = document.getElementById('main');
  if (!root || !document.getElementById('sb-demo')) return;
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action]');
    if (!b || b.disabled || b.tagName === 'INPUT') return;
    var fn = SB_ACTIONS[b.getAttribute('data-action')];
    if (fn) { e.preventDefault(); fn(b.getAttribute('data-value')); }
  });
  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[type=checkbox][data-action=check]')) { SB_ACTIONS.check(t.getAttribute('data-value')); return; }
    if (t.matches('input[data-pantry]')) {
      var k = t.getAttribute('data-pantry'), raw = t.value, v = Number(raw), unit = SB_ITEMS[k].unit;
      sbState.pantryText[k] = raw;
      if (raw === '' || !isFinite(v) || v < 0) { sbState.pantryErr[k] = 'Bitte eine Zahl ab 0 eingeben.'; sbRender(); return; }
      sbChange(function (s) { s.pantry[k] = unit === 'Stück' ? Math.floor(v) : v; s.pantryText[k] = raw; delete s.pantryErr[k]; });
    }
  });
  root.addEventListener('keydown', function (e) {
    if (!e.target || e.target.id !== 'sb-card') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); sbTake(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); sbReject(); }
  });
  root.addEventListener('pointerdown', function (e) {
    var card = e.target.closest('#sb-card'); if (!card) return;
    sbDragX = e.clientX; card.classList.add('dragging'); if (card.setPointerCapture) card.setPointerCapture(e.pointerId);
  });
  root.addEventListener('pointermove', function (e) {
    if (sbDragX === null) return; var card = document.getElementById('sb-card'); if (!card) return;
    sbDrag = e.clientX - sbDragX; card.style.transform = 'translateX(' + sbDrag + 'px) rotate(' + (sbDrag / 25) + 'deg)';
  });
  var end = function (e, cancel) {
    if (sbDragX === null) return; var dx = cancel ? 0 : e.clientX - sbDragX; sbDragX = null;
    var card = document.getElementById('sb-card');
    if (dx > 90) sbTake(); else if (dx < -90) sbReject(); else if (card) { card.classList.remove('dragging'); card.style.transform = ''; }
  };
  root.addEventListener('pointerup', function (e) { end(e, false); });
  root.addEventListener('pointercancel', function (e) { end(e, true); });
  sbRender();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sbInit); else sbInit();

})();
