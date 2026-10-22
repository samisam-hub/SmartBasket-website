/* Ablauf: Kacheln spielen ihre Animation ab, sobald der Abschnitt sichtbar ist. */
(function () {
  var sec = document.querySelector('.ab-section');
  if (!sec) return;
  sec.classList.add('ab-js');
  if (!('IntersectionObserver' in window)) { sec.classList.add('ab-in'); return; }
  new IntersectionObserver(function (entries, obs) {
    if (entries[0].isIntersecting) { sec.classList.add('ab-in'); obs.disconnect(); }
  }, { threshold: 0.25 }).observe(sec.querySelector('.ab-row'));
})();
