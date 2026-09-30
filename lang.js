// Spanish for Spanish-speaking phones, English for everyone else.
(function () {
  var es = (navigator.language || '').toLowerCase().indexOf('es') === 0;
  if (!es) return;
  document.documentElement.lang = 'es';
  document.querySelectorAll('[data-es]').forEach(function (el) {
    el.textContent = el.getAttribute('data-es');
  });
})();
