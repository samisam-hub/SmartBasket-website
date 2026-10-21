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
        ch.setAttribute(a.name, subst(a.value, scope));
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
    return html.replace(/\sstyle="/g, ' data-s="').replace(/\sonClick="/g, ' data-on-click="');
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
    if (!instances[name]) { var C = SCREENS[name].make(DCLogic); instances[name] = new C({}); }
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
  if (reset) reset.addEventListener('click', function () { instances = {}; go(ORDER[0], true); });

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
