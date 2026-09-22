/* Slide-in navigation drawer (all pages).
   Hamburger opens the menu from the right; close with ✕, the dark overlay,
   Escape, or by choosing a link. Focus stays inside the drawer while open. */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('site-nav');
  var overlay = document.getElementById('nav-overlay');
  var closeBtn = document.getElementById('nav-close');
  if (!btn || !nav) return;

  function focusables() { return nav.querySelectorAll('a[href], button:not([disabled])'); }
  function setOpen(open) {
    root.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.setAttribute('aria-hidden', !open);
    if (open) { setTimeout(function () { (nav.querySelector('a.active') || closeBtn || focusables()[0]).focus(); }, 60); }
    else btn.focus();
  }
  var isOpen = function () { return root.classList.contains('nav-open'); };

  btn.addEventListener('click', function () { setOpen(!isOpen()); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
  if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) { root.classList.remove('nav-open'); btn.setAttribute('aria-expanded', 'false'); nav.setAttribute('aria-hidden', 'true'); } });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); setOpen(false); return; }
    if (e.key === 'Tab') {
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);
  nav.setAttribute('aria-hidden', 'true');
})();
