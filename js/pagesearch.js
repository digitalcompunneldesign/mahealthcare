/* Find on this page – filters the cards/sections of whichever page is open and highlights matches.
   Open with the header search icon or the "/" key; Esc closes and restores the page. */
(function () {
  var btn = document.getElementById('find-btn');
  if (!btn) return;
  var icon = typeof ICON === 'function' ? ICON('search') : '';

  // What counts as one "result" on each page (first selector list that exists wins).
  var ITEM_SELECTORS = [
    '.dir-item, .live-item',                                   // clinics & doctors pages (verified + live results)
    '#care-team .dcard, #featured-clinics .ccard, #cond-grid .cond, #stories-list .tcard, main details', // home
    'main .card, main .tcard',
    'main section, main article, main p, main li'
  ];
  function items() {
    for (var i = 0; i < ITEM_SELECTORS.length; i++) {
      var list = [].slice.call(document.querySelectorAll(ITEM_SELECTORS[i]))
        .filter(function (el) { return !el.closest('.find-bar, header, footer, .modal, [aria-hidden="true"]'); });
      // avoid counting nested matches twice
      list = list.filter(function (el) { return !list.some(function (o) { return o !== el && o.contains(el); }); });
      if (list.length) return list;
    }
    return [];
  }

  // ---- UI ------------------------------------------------------------------
  var bar = document.createElement('div');
  bar.className = 'find-bar'; bar.id = 'find-bar'; bar.setAttribute('role', 'search');
  bar.innerHTML = '<div class="find-inner">' + icon +
    '<label for="find-input" class="sr-only">Find on this page</label>' +
    '<input id="find-input" type="search" autocomplete="off" placeholder="Find on this page — press Enter to search the whole site">' +
    '<span class="find-count" id="find-count" aria-live="polite"></span>' +
    '<button type="button" class="find-close" id="find-close" aria-label="Close search">&times;</button></div>';
  var header = document.querySelector('header');
  header.parentNode.insertBefore(bar, header.nextSibling);
  var input = bar.querySelector('#find-input'), count = bar.querySelector('#find-count');
  var empty = document.createElement('p'); empty.className = 'find-empty find-hidden'; empty.setAttribute('role', 'status');
  var main = document.querySelector('main') || document.querySelector('#main') || document.body;
  main.insertBefore(empty, main.firstChild);

  // ---- highlighting ---------------------------------------------------------
  function clearMarks() {
    [].forEach.call(document.querySelectorAll('mark.find-hit'), function (m) {
      var p = m.parentNode; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize();
    });
  }
  function mark(el, q) {
    var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.nodeValue.trim() && !n.parentNode.closest('script,style,svg,button,input,select,textarea') ? 1 : 3; }
    });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      if (!re.test(n.nodeValue)) return; re.lastIndex = 0;
      var frag = document.createDocumentFragment(), last = 0, m;
      while ((m = re.exec(n.nodeValue))) {
        frag.appendChild(document.createTextNode(n.nodeValue.slice(last, m.index)));
        var mk = document.createElement('mark'); mk.className = 'find-hit'; mk.textContent = m[0]; frag.appendChild(mk);
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(n.nodeValue.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  }

  // ---- filtering ------------------------------------------------------------
  var wasHidden = null; // remembers "load more" state so closing restores it
  function run() {
    var q = input.value.trim();
    clearMarks();
    var list = items();
    if (!q) { restore(list); return; }
    if (!wasHidden) wasHidden = list.filter(function (el) { return el.classList.contains('hidden'); });
    var terms = q.toLowerCase().split(/\s+/), n = 0, first = null;
    list.forEach(function (el) {
      el.classList.remove('hidden');
      var text = el.textContent.toLowerCase();
      var hit = terms.every(function (t) { return text.indexOf(t) > -1; });
      el.classList.toggle('find-hidden', !hit);
      if (hit) { n++; terms.forEach(function (t) { mark(el, t); }); if (!first) first = el; }
    });
    toggleLoadMore(false);
    count.textContent = n + (n === 1 ? ' match' : ' matches');
    empty.textContent = n ? '' : 'Nothing on this page matches “' + q + '”.';
    empty.classList.toggle('find-hidden', !!n);
    if (first) { var y = first.getBoundingClientRect().top + window.scrollY - bar.offsetHeight - 90; if (Math.abs(y - window.scrollY) > 200) window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); }
  }
  function restore(list) {
    (list || items()).forEach(function (el) { el.classList.remove('find-hidden'); });
    if (wasHidden) wasHidden.forEach(function (el) { el.classList.add('hidden'); });
    wasHidden = null; count.textContent = ''; empty.classList.add('find-hidden'); toggleLoadMore(true);
  }
  function toggleLoadMore(show) {
    var lm = document.getElementById('load-more');
    if (lm) lm.parentNode.classList.toggle('find-hidden', !show || !document.querySelector('.dir-item.hidden'));
  }

  var t;
  input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 120); });
  // Enter opens the full, categorised results page for the whole site
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && input.value.trim()) { e.preventDefault(); location.href = 'search.html?q=' + encodeURIComponent(input.value.trim()); }
  });
  function open() { bar.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); input.focus(); input.select(); }
  function close() { input.value = ''; clearMarks(); restore(); bar.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
  btn.addEventListener('click', function () { bar.classList.contains('open') ? close() : open(); });
  bar.querySelector('#find-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if (e.key === '/' && !typing) { e.preventDefault(); open(); }
    else if (e.key === 'Escape' && bar.classList.contains('open') && document.activeElement === input) { close(); }
  });
})();
