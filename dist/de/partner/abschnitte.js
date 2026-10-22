/* Unternavigation: markiert den Abschnitt, der gerade im Blick ist. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.sx-nav a'));
  if (!links.length) return;
  var items = links.map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; }).filter(function (x) { return x.el; });
  var ticking = false, last = null;
  function update() {
    ticking = false;
    var line = window.innerHeight * 0.35, cur = null;
    items.forEach(function (x) { if (x.el.getBoundingClientRect().top <= line) cur = x; });
    if (cur === last) return;
    last = cur;
    items.forEach(function (x) { x.a.removeAttribute('aria-current'); });
    if (cur) { cur.a.setAttribute('aria-current', 'true'); var ul = cur.a.closest('ul'), l = cur.a.parentNode.offsetLeft; if (l < ul.scrollLeft || l + cur.a.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollLeft = l - 16; }
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
