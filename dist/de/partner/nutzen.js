/* Nutzen-Karussell: Reiter, Pfeile, Pfeiltasten und Wischen. Ohne JS stehen alle Themen untereinander. */
(function () {
  var root = document.querySelector('.nz-carousel');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.nz-tabs [role="tab"]'));
  var count = root.querySelector('.nz-count');
  var cur = 0;
  root.classList.add('nz-js');
  function show(i, focus, dir) {
    i = (i + tabs.length) % tabs.length;
    tabs.forEach(function (t, k) {
      var on = k === i, p = document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (p) {
        p.hidden = !on;
        p.classList.remove('nz-from-left', 'nz-from-right');
        if (on && dir) { void p.offsetWidth; p.classList.add(dir > 0 ? 'nz-from-right' : 'nz-from-left'); }
      }
    });
    cur = i;
    if (count) count.textContent = (i + 1) + ' / ' + tabs.length;
    if (focus) tabs[i].focus();
    tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { show(k, false, k - cur); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = k + 1; else if (e.key === 'ArrowLeft') n = k - 1;
      else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); show(n, true, n - k); }
    });
  });
  root.querySelector('.nz-prev').addEventListener('click', function () { show(cur - 1, false, -1); });
  root.querySelector('.nz-next').addEventListener('click', function () { show(cur + 1, false, 1); });
  var x0 = null, y0 = null, panels = root.querySelector('.nz-panels');
  panels.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  panels.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && !e.target.closest('.ps-tabs')) show(cur + (dx < 0 ? 1 : -1), false, dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });
  show(0, false, 0);
})();
