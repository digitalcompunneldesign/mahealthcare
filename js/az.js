/* A–Z index for the Doctors, Clinics and Diseases pages.
   Letters with nothing listed on the page are disabled. Doctors are indexed by surname.
   On the Clinics page it also filters the live hospital list (live.js reports its letters). */
(function () {
  var list = document.getElementById('doctor-list') || document.getElementById('clinic-list') || document.getElementById('disease-list');
  if (!list) return;
  var what = list.id === 'doctor-list' ? 'doctors (by surname)' : list.id === 'clinic-list' ? 'clinics and hospitals' : 'conditions';
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var extra = {};           // letters contributed by other lists on the page (live hospitals)
  var current = '';

  var bar = document.createElement('nav');
  bar.className = 'az-bar'; bar.setAttribute('aria-label', 'Browse ' + what + ' A to Z');
  bar.innerHTML = '<button type="button" class="az-all" data-l="" aria-pressed="true">All</button>' +
    LETTERS.map(function (l) { return '<button type="button" data-l="' + l + '" aria-pressed="false">' + l + '</button>'; }).join('');
  list.parentNode.insertBefore(bar, list);
  var status = document.createElement('p'); status.className = 'az-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  bar.parentNode.insertBefore(status, bar.nextSibling);

  function items() { return [].slice.call(list.querySelectorAll('[data-az]')); }
  function available() {
    var set = {}; items().forEach(function (el) { set[el.dataset.az] = 1; });
    Object.keys(extra).forEach(function (l) { set[l] = 1; });
    return set;
  }
  function refresh() {
    var set = available();
    [].forEach.call(bar.querySelectorAll('button[data-l]'), function (b) {
      var l = b.dataset.l; if (!l) return;
      var on = !!set[l];
      b.disabled = !on; b.setAttribute('aria-disabled', String(!on));
      b.title = on ? 'Show ' + what + ' starting with ' + l : 'Nothing listed under ' + l;
    });
  }

  var hiddenBefore = null;
  function choose(l) {
    current = l;
    [].forEach.call(bar.querySelectorAll('button[data-l]'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.l === l)); });
    var els = items();
    if (l) {
      if (!hiddenBefore) hiddenBefore = els.filter(function (el) { return el.classList.contains('hidden'); });
      var n = 0;
      els.forEach(function (el) { el.classList.remove('hidden'); var hit = el.dataset.az === l; el.classList.toggle('az-hidden', !hit); if (hit) n++; });
      status.textContent = n ? n + ' listed under “' + l + '”' : '';
    } else {
      els.forEach(function (el) { el.classList.remove('az-hidden'); });
      if (hiddenBefore) hiddenBefore.forEach(function (el) { el.classList.add('hidden'); });
      hiddenBefore = null; status.textContent = '';
    }
    var lm = document.getElementById('load-more');
    if (lm) lm.parentNode.classList.toggle('az-hidden', !!l || !list.querySelector('.dir-item.hidden'));
    document.dispatchEvent(new CustomEvent('az:change', { detail: { letter: l } }));
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-l]'); if (!b || b.disabled) return;
    choose(b.dataset.l === current ? '' : b.dataset.l);
  });
  // other lists on the page (e.g. live hospitals) announce the letters they contain
  document.addEventListener('az:letters', function (e) { (e.detail.letters || []).forEach(function (l) { extra[l] = 1; }); refresh(); });
  refresh();
})();
