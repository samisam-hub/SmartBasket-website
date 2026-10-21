/* Hero-Video: bei „Bewegung reduzieren“ nicht automatisch abspielen; außerhalb des Bildschirms pausieren. */
(function () {
  var v = document.querySelector('.hero-video');
  if (!v) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; return; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    }).observe(v);
  }
})();
