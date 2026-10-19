/* Schritte-Karussell (nur mobil sichtbar): Punkte zeigen den aktuellen Schritt und springen per Klick dorthin. */
(function () {
  var list = document.getElementById('b2c-steps');
  var dots = document.getElementById('b2c-dots');
  if (!list || !dots) return;
  var items = Array.prototype.slice.call(list.children);
  items.forEach(function (li, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Schritt ' + (i + 1) + ' zeigen');
    b.addEventListener('click', function () {
      list.scrollTo({ left: li.offsetLeft - list.offsetLeft - parseFloat(getComputedStyle(list).scrollPaddingLeft || 0), behavior: 'smooth' });
    });
    dots.appendChild(b);
  });
  var buttons = dots.children;
  function update() {
    var mid = list.scrollLeft + list.clientWidth / 2, best = 0, dist = Infinity;
    items.forEach(function (li, i) {
      var c = li.offsetLeft - list.offsetLeft + li.offsetWidth / 2, d = Math.abs(c - mid);
      if (d < dist) { dist = d; best = i; }
    });
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-current', i === best ? 'step' : 'false');
  }
  var t; list.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
