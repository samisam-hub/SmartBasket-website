/* Interaktiver App-Entwurf: rendert die Screens aus app-entwurf-screens.js in einen Handy-Rahmen.
   CSP-konform: keine Inline-Styles im Markup – Stile werden per CSSOM (el.style.cssText) gesetzt,
   Ereignisse per addEventListener. Unterstützt {{…}}, <sc-for>, <sc-if> und Links zwischen Screens. */
(function () {
  var SCREENS = window.SB_APP_SCREENS, ORDER = window.SB_APP_ORDER;
  var root = document.getElementById('app-entwurf-screen');
  var frame = document.getElementById('app-entwurf-frame');
  var nav = document.getElementById('app-entwurf-nav');
  var live = document.getElementById('app-entwurf-live');
  if (!SCREENS || !root || !frame || !nav) return;

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) { Object.assign(this.state, patch); render(true); };

  // ---------- Gemeinsamer Plan über alle Screens (bleibt beim Neuladen erhalten) ----------
  var KEY = 'sb-app-entwurf-v1';
  function initialData() {
    return {
      people: [{ name: 'Anna', kid: false }, { name: 'Alex', kid: false }, { name: 'Mia', kid: true }],
      standard: { breakfast: true, lunch: true, dinner: true, snack: false },
      days: [0, 1, 2, 3], events: { bake: true },
      dayPos: 0, dayMeals: {}, plan: {}, slotPos: 0, offset: {},
      extras: { juice: true, milk: true }
    };
  }
  function load() {
    try { var raw = window.localStorage.getItem(KEY); if (raw) { var d = JSON.parse(raw); if (d && d.people && d.plan) return d; } } catch (e) {}
    return initialData();
  }
  var store = {
    data: load(),
    set: function (patch) { Object.assign(store.data, patch); save(); render(true); },
    reset: function () { store.data = initialData(); try { window.localStorage.removeItem(KEY); } catch (e) {} }
  };
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(store.data)); } catch (e) {} }

  var LIB = window.SB_APP_LIB = (function () {
    var DAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    var SHORT = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    var SLOTS = [{ id: 'breakfast', label: 'Frühstück', short: 'Frühstück', q: 'Was gibt es zum Frühstück?' },
      { id: 'lunch', label: 'Mittagessen', short: 'Mittag', q: 'Was gibt es zum Mittagessen?' },
      { id: 'dinner', label: 'Abendessen', short: 'Abend', q: 'Was gibt es zum Abendessen?' },
      { id: 'snack', label: 'Snack', short: 'Snack', q: 'Welcher Snack darf es sein?' }];
    // Mengen je erwachsene Person; Kinder bekommen 60 %
    var DISHES = {
      oats: { name: 'Haferbrei mit Beeren', parts: 'Haferflocken · Beeren · Banane', img: '../assets/oats.webp', ing: [['Haferflocken', 70, 'g'], ['Beeren', 120, 'g'], ['Bananen', 0.5, 'Stk.']] },
      toast: { name: 'Ei-Toast mit Hähnchenschinken', parts: 'Eier · Brot · Hähnchenschinken', img: '../assets/hamtoast.webp', ing: [['Vollkornbrot', 2, 'Scheiben'], ['Eier', 1, 'Stk.'], ['Hähnchenschinken', 40, 'g']] },
      yogurt: { name: 'Joghurt mit Beeren und Hafer', parts: 'Joghurt · Beeren · Haferflocken', img: '../assets/yogurtbowl.webp', ing: [['Joghurt', 200, 'g'], ['Beeren', 80, 'g'], ['Haferflocken', 30, 'g']] },
      chick: { name: 'Hähnchen mit Kartoffeln und Brokkoli', parts: 'Hähnchen · Kartoffeln · Brokkoli', img: '../assets/chickenpotato.webp', ing: [['Hähnchenbrust', 150, 'g'], ['Kartoffeln', 250, 'g'], ['Brokkoli', 150, 'g']] },
      tuna: { name: 'Nudeln mit Tomaten-Thunfisch-Soße', parts: 'Nudeln · Tomaten · Thunfisch', img: '../assets/tunapasta.webp', ing: [['Nudeln', 90, 'g'], ['Passierte Tomaten', 150, 'g'], ['Thunfisch', 80, 'g']] },
      lentil: { name: 'Linsen-Pasta mit Tomaten', parts: 'Linsennudeln · Tomaten', img: '../assets/lentilpasta.webp', ing: [['Linsennudeln', 90, 'g'], ['Passierte Tomaten', 150, 'g']] },
      salmon: { name: 'Lachs mit Reis und Brokkoli', parts: 'Lachs · Reis · Brokkoli', img: '../assets/salmonrice.webp', ing: [['Lachs', 125, 'g'], ['Reis', 75, 'g'], ['Brokkoli', 150, 'g']] },
      strog: { name: 'Hähnchen-Geschnetzeltes mit Nudeln', parts: 'Hähnchen · Bandnudeln · Champignons', img: '../assets/stroganoff.webp', ing: [['Hähnchenbrust', 130, 'g'], ['Bandnudeln', 90, 'g'], ['Champignons', 120, 'g']] },
      eggs: { name: 'Rührei mit Kartoffeln und Spinat', parts: 'Eier · Kartoffeln · Spinat', img: '../assets/scrambled.webp', ing: [['Eier', 2, 'Stk.'], ['Kartoffeln', 200, 'g'], ['Spinat', 80, 'g']] },
      snackyog: { name: 'Joghurt mit Beeren', parts: 'Joghurt · Beeren', img: '../assets/yogurtbowl.webp', ing: [['Joghurt', 150, 'g'], ['Beeren', 50, 'g']] },
      apple: { name: 'Apfel und Nüsse', parts: 'Äpfel · Walnüsse', img: '', ing: [['Äpfel', 1, 'Stk.'], ['Walnüsse', 25, 'g']] }
    };
    var CHOICES = { breakfast: ['oats', 'toast', 'yogurt'], lunch: ['chick', 'tuna', 'lentil'], dinner: ['salmon', 'strog', 'eggs'], snack: ['snackyog', 'apple'] };
    var MODES = { heat: 'Aufwärmen', out: 'Auswärts essen', skip: 'Ausgelassen' };
    function d() { return store.data; }
    function selectedDays() { return d().days.slice().sort(function (a, b) { return a - b; }); }
    function currentDay() { var s = selectedDays(); return s.length ? s[Math.min(d().dayPos, s.length - 1)] : 0; }
    function mealsFor(day) {
      var o = d().dayMeals[day] || d().standard;
      return SLOTS.filter(function (s) { return o[s.id]; });
    }
    function entryText(e) { return !e ? 'noch offen' : e.kind === 'cook' ? DISHES[e.dish].name : MODES[e.kind]; }
    function dayDone(day) { var p = d().plan[day] || {}; var m = mealsFor(day); return m.length > 0 && m.every(function (s) { return p[s.id]; }); }
    function eaters() { var a = 0, k = 0; d().people.forEach(function (p) { if (p.kid) k++; else a++; }); return { adults: a, kids: k, factor: a + 0.6 * k }; }
    function basket() {
      var f = eaters().factor, items = {}, ready = 0;
      selectedDays().forEach(function (day) {
        var p = d().plan[day] || {};
        SLOTS.forEach(function (s) {
          var e = p[s.id]; if (!e) return;
          if (e.kind === 'heat') { ready += 1; return; }
          if (e.kind !== 'cook') return;
          DISHES[e.dish].ing.forEach(function (i) {
            var key = i[0]; if (!items[key]) items[key] = { name: key, qty: 0, unit: i[2], uses: [] };
            items[key].qty += i[1] * f;
            var use = SHORT[day] + ' ' + s.short; if (items[key].uses.indexOf(use) < 0) items[key].uses.push(use);
          });
        });
      });
      var list = Object.keys(items).map(function (k) {
        var it = items[k], q = it.unit === 'g' ? Math.ceil(it.qty / 10) * 10 : Math.ceil(it.qty);
        var qty = it.unit === 'g' && q >= 1000 ? (q / 1000).toString().replace('.', ',') + ' kg' : q + ' ' + it.unit;
        return { name: it.name, qty: qty, for: it.uses.join(', ') };
      }).sort(function (a, b) { return a.name.localeCompare(b.name, 'de'); });
      return { items: list, ready: ready };
    }
    return { DAY_NAMES: DAY_NAMES, SHORT: SHORT, SLOTS: SLOTS, DISHES: DISHES, CHOICES: CHOICES, MODES: MODES,
      selectedDays: selectedDays, currentDay: currentDay, mealsFor: mealsFor, entryText: entryText, dayDone: dayDone, eaters: eaters, basket: basket };
  })();

  var current = null, comp = null, instances = {};

  function get(scope, path) {
    return path.trim().split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, scope);
  }
  function subst(str, scope) {
    return str.replace(/\{\{([^}]+)\}\}/g, function (_, e) { var v = get(scope, e); return (typeof v === 'function' || v == null) ? '' : String(v); });
  }
  function bare(attr) { return attr.replace(/[{}\s]/g, ''); }

  function walk(node, scope) {
    Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
      if (ch.nodeType === 3) { ch.textContent = subst(ch.textContent, scope); return; }
      if (ch.nodeType !== 1) return;
      var tag = ch.tagName.toLowerCase();
      if (tag === 'sc-for') {
        var list = get(scope, bare(ch.getAttribute('list'))) || [], as = ch.getAttribute('as');
        var frag = document.createDocumentFragment();
        list.forEach(function (item) {
          var clone = ch.cloneNode(true), s = Object.assign({}, scope); s[as] = item;
          walk(clone, s); while (clone.firstChild) frag.appendChild(clone.firstChild);
        });
        ch.parentNode.replaceChild(frag, ch); return;
      }
      if (tag === 'sc-if') {
        if (!get(scope, bare(ch.getAttribute('value')))) { ch.parentNode.removeChild(ch); return; }
        walk(ch, scope);
        var f2 = document.createDocumentFragment(); while (ch.firstChild) f2.appendChild(ch.firstChild);
        ch.parentNode.replaceChild(f2, ch); return;
      }
      Array.prototype.slice.call(ch.attributes).forEach(function (a) {
        if (a.name === 'data-s') { ch.style.cssText = subst(a.value, scope); ch.removeAttribute('data-s'); return; }
        if (a.name === 'data-on-click') {
          var fn = get(scope, bare(a.value)); ch.removeAttribute('data-on-click');
          if (typeof fn === 'function') ch.addEventListener('click', function (e) { e.preventDefault(); fn(); });
          return;
        }
        var val = subst(a.value, scope);
        if ((a.name === 'disabled' || a.name === 'hidden') && (val === '' || val === 'false')) { ch.removeAttribute(a.name); return; }
        ch.setAttribute(a.name, val);
      });
      if (tag === 'a') {
        var href = ch.getAttribute('href') || '';
        var m = href.match(/^([A-Za-z]+)\.dc\.html$/);
        ch.setAttribute('href', '#app-entwurf');
        if (m && SCREENS[m[1]]) ch.setAttribute('data-goto', m[1]);
      }
      if (tag === 'button' && !ch.hasAttribute('type')) ch.setAttribute('type', 'button');
      walk(ch, scope);
    });
  }

  // Inline-Stile und Handler vor dem Parsen in data-Attribute umschreiben (CSP blockiert style-Attribute)
  function prepare(html) {
    // Screen-Titel sind auf der Webseite Unterüberschriften des Abschnitts (h3 statt h1)
    return html.replace(/\sstyle="/g, ' data-s="').replace(/\sonClick="/g, ' data-on-click="')
      .replace(/<h1(\s|>)/g, '<h3$1').replace(/<\/h1>/g, '</h3>');
  }

  function focusPath() {
    var el = document.activeElement, path = [];
    if (!el || !root.contains(el)) return null;
    while (el && el !== root) { path.unshift(Array.prototype.indexOf.call(el.parentNode.children, el)); el = el.parentNode; }
    return path;
  }
  function restoreFocus(path) {
    if (!path) return;
    var el = root;
    for (var i = 0; i < path.length && el; i++) el = el.children[path[i]];
    if (el && el.focus) el.focus({ preventScroll: true });
  }

  function render(keepFocus) {
    var path = keepFocus ? focusPath() : null;
    var tpl = document.createElement('template');
    tpl.innerHTML = prepare(SCREENS[current].html);
    walk(tpl.content, comp.renderVals());
    root.textContent = '';
    root.appendChild(tpl.content);
    restoreFocus(path);
  }

  function go(name, announce) {
    if (!SCREENS[name]) return;
    current = name;
    if (!instances[name]) { var C = SCREENS[name].make(DCLogic); instances[name] = new C({ store: store, lib: LIB, go: function (to) { go(to, true); } }); }
    comp = instances[name];
    render(false);
    var btns = nav.querySelectorAll('button[data-screen]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-current', btns[i].getAttribute('data-screen') === name ? 'step' : 'false');
    var idx = ORDER.indexOf(name) + 1;
    if (live && announce) live.textContent = 'Screen ' + idx + ' von ' + ORDER.length + ': ' + SCREENS[name].title;
    root.scrollTop = 0;
  }

  // Navigation unter dem Handy
  ORDER.forEach(function (name, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('data-screen', name);
    var n = document.createElement('span'); n.className = 'app-entwurf-nr'; n.textContent = String(i + 1);
    var t = document.createElement('span'); t.textContent = SCREENS[name].label;
    b.appendChild(n); b.appendChild(t);
    b.addEventListener('click', function () { go(name, true); });
    nav.appendChild(b);
  });
  var reset = document.getElementById('app-entwurf-reset');
  if (reset) reset.addEventListener('click', function () { store.reset(); instances = {}; go(ORDER[0], true); });

  root.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !root.contains(a)) return;
    e.preventDefault();
    var to = a.getAttribute('data-goto');
    if (to) go(to, true);
  });

  // Handy-Bildschirm (390 × 844) passend skalieren
  function fit() {
    var avail = frame.parentNode.clientWidth - 20; // 2 × 10px Rahmen
    var w = Math.max(240, Math.min(avail, 360));
    var scale = w / 390;
    frame.style.width = Math.round(390 * scale) + 'px';
    frame.style.height = Math.round(844 * scale) + 'px';
    root.style.transform = 'scale(' + scale + ')';
  }
  window.addEventListener('resize', fit);
  fit();
  go(ORDER[0], false);
})();
