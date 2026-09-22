/* Live Massachusetts directory UI (doctors page: all licensed providers; clinics page: all hospitals
   plus clinics/practices). Data comes from our server, which queries official CMS sources. */
(function () {
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var star = typeof ICON === 'function' ? ICON('star') : '★';
  var fmtDate = function (iso) { try { return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
  var avatar = function (name) { return window.MAH ? MAH.avatarFor(name, 48) : ''; };
  var srcLine = function (name, url, when) { return '<p class="src">Source: <a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(name) + '</a>' + (when ? ' · retrieved ' + esc(when) : '') + '</p>'; };
  var noServer = 'The live directory needs the MA Health server (run <code>npm start</code>). It can’t load when the page is opened as a file.';

  function getJSON(url) {
    return fetch(url, { headers: { accept: 'application/json' } }).then(function (r) {
      return r.json().then(function (b) { if (!r.ok || !b.success) throw new Error(b.error || 'Request failed'); return b; },
        function () { throw new Error(noServer); });
    }, function () { throw new Error(noServer); });
  }

  // ---------------------------------------------------------------- providers
  var SPECIALTIES = ['Family Medicine', 'Internal Medicine', 'Pediatrics', 'Cardiovascular Disease', 'Endocrinology, Diabetes & Metabolism',
    'Pulmonary Disease', 'Psychiatry', 'Orthopaedic Surgery', 'Dermatology', 'Physical Medicine & Rehabilitation',
    'Obstetrics & Gynecology', 'Neurology', 'Gastroenterology', 'Allergy & Immunology', 'Rheumatology', 'Nephrology', 'Oncology', 'Urology', 'Ophthalmology'];
  var ORG_TYPES = ['Clinic/Center', 'Community Health', 'Federally Qualified Health Center', 'Urgent Care', 'Primary Care', 'Rural Health', 'Mental Health'];

  function providerSearch(root, type) {
    var isOrg = type === 'organization';
    var opts = (isOrg ? ORG_TYPES : SPECIALTIES).map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
    root.innerHTML =
      '<h2>' + (isOrg ? 'Search all clinics &amp; practices in Massachusetts' : 'Search every licensed provider in Massachusetts') + '</h2>' +
      '<p class="live-note">Live from the official <b>CMS NPI Registry</b>. It lists every active, registered ' + (isOrg ? 'practice and clinic' : 'provider') +
      ' — deactivated registrations are excluded. The registry does not show whether a provider is accepting new patients, so please call to confirm.</p>' +
      '<form class="live-form" novalidate>' +
      '<label>' + (isOrg ? 'Type' : 'Specialty') + '<select name="specialty"><option value="">Any</option>' + opts + '</select></label>' +
      '<label>City<input name="city" placeholder="e.g. Worcester" maxlength="40"></label>' +
      '<label>' + (isOrg ? 'Name' : 'Last name') + '<input name="name" placeholder="' + (isOrg ? 'e.g. Community' : 'e.g. Patel') + '" maxlength="40"></label>' +
      '<button class="btn" type="submit">Search</button></form>' +
      '<p class="live-status" role="status" aria-live="polite">Choose a ' + (isOrg ? 'type' : 'specialty') + ', city or name, then search.</p>' +
      '<div class="g12 live-results"></div>' +
      '<p class="center live-more-wrap find-hidden"><button class="btn ghost live-more" type="button">Load more</button></p>';
    var form = root.querySelector('form'), status = root.querySelector('.live-status'), out = root.querySelector('.live-results'),
      moreWrap = root.querySelector('.live-more-wrap'), more = root.querySelector('.live-more'), last = null;

    function card(p) {
      return '<article class="card c6 live-item"><div class="card-body">' +
        '<div class="row">' + avatar(p.name) + '<div><h3>' + esc(p.name) + (p.credential ? ', ' + esc(p.credential) : '') + '</h3>' +
        '<p class="meta">' + esc(p.specialty || '') + '</p></div></div>' +
        '<p class="meta">' + esc(p.address) + (p.phone ? ' · <a href="tel:' + esc(p.phone.replace(/\D/g, '')) + '">' + esc(p.phone) + '</a>' : '') + '</p>' +
        '<p class="meta">NPI ' + esc(p.npi) + (p.lastUpdated ? ' · record updated ' + esc(p.lastUpdated) : '') + '</p>' +
        srcLine(p.sourceName, p.sourceUrl, last && fmtDate(last.retrieved)) +
        '</div></article>';
    }
    function run(skip) {
      var fd = new FormData(form), q = new URLSearchParams({ type: type, specialty: fd.get('specialty') || '', city: fd.get('city') || '', name: fd.get('name') || '', skip: skip || 0 });
      status.textContent = 'Searching the official registry…'; if (!skip) out.innerHTML = ''; moreWrap.classList.add('find-hidden');
      getJSON('/api/live/providers?' + q.toString()).then(function (b) {
        last = b;
        out.insertAdjacentHTML('beforeend', b.results.map(card).join(''));
        var shown = out.children.length;
        status.textContent = shown ? shown + ' active ' + (isOrg ? (shown === 1 ? 'practice' : 'practices') : (shown === 1 ? 'provider' : 'providers')) + ' shown · retrieved ' + fmtDate(b.retrieved) : 'No active matches in Massachusetts. Try a broader search.';
        moreWrap.classList.toggle('find-hidden', !b.more);
        more.onclick = function () { run(b.skip + 50); };
      }).catch(function (e) { status.innerHTML = esc(e.message).replace('npm start', '<code>npm start</code>'); });
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(0); });
  }

  // ---------------------------------------------------------------- hospitals
  function hospitals(root) {
    root.innerHTML = '<h2>All active hospitals in Massachusetts</h2>' +
      '<p class="live-note">Loaded live from <b>CMS Care Compare</b>, the federal list of hospitals currently enrolled in Medicare, with the official CMS overall star rating (1–5) where CMS publishes one.</p>' +
      '<form class="live-form" novalidate><label>Filter by name or city<input name="q" placeholder="e.g. Springfield" maxlength="40"></label>' +
      '<label><span>Emergency department</span><select name="er"><option value="">Any</option><option value="1">Has emergency services</option></select></label></form>' +
      '<p class="live-status" role="status" aria-live="polite">Loading the official hospital list…</p><div class="g12 live-results"></div>' +
      '<p class="center live-more-wrap find-hidden"><button class="btn ghost live-more" type="button">Show more hospitals</button></p>';
    var status = root.querySelector('.live-status'), out = root.querySelector('.live-results'), form = root.querySelector('form'),
      moreWrap = root.querySelector('.live-more-wrap'), more = root.querySelector('.live-more'), data = null, limit = 12, az = '';
    var letterOf = function (t) { var m = String(t).replace(/^the\s+/i, '').match(/[A-Za-z]/); return m ? m[0].toUpperCase() : '#'; };
    function card(h) {
      return '<article class="card c6 live-item" data-az-live="' + letterOf(h.name) + '"><img class="clinic-photo" src="images/generic-clinic.svg" alt="" loading="lazy"><div class="card-body">' +
        '<h3>' + esc(h.name) + '</h3><p class="meta">' + esc(h.type || 'Hospital') + (h.emergency ? ' · Emergency services' : '') + '</p>' +
        '<p class="meta">' + esc(h.address) + (h.phone ? ' · <a href="tel:' + esc(h.phone.replace(/\D/g, '')) + '">' + esc(h.phone) + '</a>' : '') + '</p>' +
        '<p class="meta">' + (h.rating ? '<span class="live-rating">' + star + ' ' + h.rating + ' of 5</span> · CMS overall hospital rating' : 'No CMS overall rating published') + '</p>' +
        srcLine(h.sourceName, h.sourceUrl, fmtDate(data.retrieved)) + '</div></article>';
    }
    function render() {
      var fd = new FormData(form), q = String(fd.get('q') || '').toLowerCase().trim(), er = fd.get('er') === '1';
      var list = data.results.filter(function (h) { return (!q || (h.name + ' ' + h.city).toLowerCase().indexOf(q) > -1) && (!er || h.emergency) && (!az || letterOf(h.name) === az); });
      var shown = list.slice(0, limit);
      out.innerHTML = shown.map(card).join('');
      loadPhotos(shown);
      status.textContent = list.length + ' of ' + data.count + ' active Massachusetts hospital' + (data.count === 1 ? '' : 's') + ' · retrieved ' + fmtDate(data.retrieved);
      moreWrap.classList.toggle('find-hidden', list.length <= limit);
    }
    var photoCache = {};
    function loadPhotos(shown) {
      var need = shown.map(function (h) { return h.name; }).filter(function (n) { return !(n in photoCache); });
      var put = function () {
        [].forEach.call(out.querySelectorAll('.live-item'), function (el, i) {
          var h = shown[i], p = h && photoCache[h.name];
          if (p && window.MAHPhotos && !el.querySelector('.photo-credit')) MAHPhotos.apply(el.querySelector('img.clinic-photo'), p, el.querySelector('.card-body'));
        });
      };
      if (!need.length) return put();
      fetch('/api/photos/hospitals?names=' + encodeURIComponent(need.slice(0, 12).join('|'))).then(function (r) { return r.ok ? r.json() : { photos: {} }; })
        .then(function (b) { need.slice(0, 12).forEach(function (n) { photoCache[n] = (b.photos || {})[n] || null; }); put(); })
        .catch(function () {});
    }
    more.onclick = function () { limit += 12; render(); };
    form.addEventListener('input', function () { limit = 12; if (data) render(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    document.addEventListener('az:change', function (e) { az = e.detail.letter || ''; limit = 12; if (data) render(); });
    getJSON('/api/live/hospitals').then(function (b) {
      data = b; render();
      var L = {}; b.results.forEach(function (h) { L[letterOf(h.name)] = 1; });
      document.dispatchEvent(new CustomEvent('az:letters', { detail: { letters: Object.keys(L) } }));
    })
      .catch(function (e) { status.innerHTML = esc(e.message).replace('npm start', '<code>npm start</code>'); });
  }

  var el;
  if ((el = document.getElementById('live-providers'))) providerSearch(el, 'individual');
  if ((el = document.getElementById('live-hospitals'))) hospitals(el);
  if ((el = document.getElementById('live-orgs'))) providerSearch(el, 'organization');
})();
