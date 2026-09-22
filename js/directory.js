/* MA Health – renders every clinic/doctor listing from js/catalog.js so the same
   facts (names, ratings, addresses, sources) appear identically on every page.
   Rule: a rating is only shown when the hospital itself publishes it, always with its source. */
(function (g) {
  if (typeof clinicsByDisease === 'undefined') return;

  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var star = typeof ICON === 'function' ? ICON('star') : '★';

  var CLINICS = [], CLINIC = {}, DISEASE = {}, DOCTOR = {};
  diseases.forEach(function (d) { DISEASE[d.id] = d; });
  Object.keys(clinicsByDisease).forEach(function (did) {
    clinicsByDisease[did].forEach(function (c) { c.diseaseId = +did; CLINICS.push(c); CLINIC[c.id] = c; });
  });
  Object.keys(doctorsByClinic).forEach(function (cid) {
    doctorsByClinic[cid].forEach(function (d) { d.clinicId = +cid; DOCTOR[d.id] = d; });
  });
  var docsOf = function (cid) { return doctorsByClinic[cid] || []; };

  // ---- building blocks -------------------------------------------------------
  function link(name, url) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(name) + '</a>'; }
  function src(label, name, url, plain) {
    return '<p class="src">' + esc(label) + ': ' + (plain ? esc(name) : link(name, url)) + ' · checked ' + esc(VERIFIED_ON) + '</p>';
  }
  function ratingLine(d) {
    if (!d.rating) return '<span class="rating none">No public rating</span>';
    return '<span class="rating">' + star + ' ' + d.rating.value.toFixed(1) + ' <small>(' + d.rating.count + ' ratings)</small></span>';
  }
  function ratingSrc(d, plain) {
    return d.rating ? src('Rating', d.rating.sourceName, d.rating.sourceUrl, plain) : '';
  }
  function recognition(d) {
    return d.recognition ? '<p class="src">' + esc(d.recognition.label) + ' — ' + link(d.recognition.sourceName, d.recognition.sourceUrl) + '</p>' : '';
  }
  // First letter of the first name + first letter of the last name, e.g. "Dr. Shaina A. Lipa" -> "SL".
  function initials(n) {
    var w = n.replace(/^Dr\.?\s*/i, '').replace(/,.*$/, '').split(/\s+/).filter(function (x) { return /^[A-Za-z]/.test(x) && !/^[A-Z]\.?$/.test(x); });
    if (!w.length) return '';
    return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
  }

  // Official photo (hot-linked from the source, credited) with an initials fallback.
  function avatar(d, size) {
    var ini = '<span class="dav-ini">' + esc(initials(d.name)) + '</span>';
    if (!d.photoUrl) return '<span class="dav" style="--s:' + (size / 16) + 'em" aria-hidden="true">' + ini + '</span>';
    return '<span class="dav" style="--s:' + (size / 16) + 'em">' + ini + '<img src="' + esc(d.photoUrl) + '" alt="Photo of ' + esc(d.name) + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()"></span>';
  }
  function photoSrc(d) { return d.photoUrl ? src('Photo', d.photoSourceName, d.photoSourceUrl) : ''; }
  function status(d) { return d.acceptingNew === false ? '<span class="dstatus">Not accepting new patients (per source)</span>' : ''; }
  function actionBtn(d) {
    return d.acceptingNew === false
      ? '<a class="btn-sm btn-sm-ghost" href="' + esc(d.profileUrl) + '" target="_blank" rel="noopener" aria-label="View ' + esc(d.name) + '’s official profile (opens in a new tab)">Profile</a>'
      : '<button class="btn-sm" type="button" onclick="bookDoctor(' + d.id + ')" aria-label="Book with ' + esc(d.name) + '">Book</button>';
  }

  // A–Z helpers: doctors by surname, everything else by name (ignoring a leading "The").
  function surname(n) { var w = n.replace(/^Dr\.?\s*/i, '').replace(/,.*$/, '').split(/\s+/); return w[w.length - 1] || n; }
  function letterOf(t) { var m = String(t).replace(/^the\s+/i, '').match(/[A-Za-z]/); return m ? m[0].toUpperCase() : '#'; }
  var GENERIC_CLINIC = 'images/generic-clinic.svg';
  function clinicImg(c, cls) {
    var src = c.photoUrl || GENERIC_CLINIC;
    return '<img class="' + cls + '" src="' + esc(src) + '" alt="' + (c.photoUrl ? 'Photo of ' + esc(c.name) : '') + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'' + GENERIC_CLINIC + '\'">';
  }
  function clinicPhotoSrc(c) { return c.photoUrl ? src('Photo', c.photoSourceName, c.photoSourceUrl) : ''; }

  // Book a specific doctor on the home page (pre-selects condition, clinic and doctor).
  g.bookDoctor = function (id) {
    var d = DOCTOR[id], c = d && CLINIC[d.clinicId];
    if (!d || typeof selectDisease !== 'function') { location.href = 'index.html?disease=' + (d ? d.diseases[0] : '') + '#search'; return; }
    selectDisease(c.diseaseId, DISEASE[c.diseaseId].name);
    selectClinic(c.id, c.name);
    selectDoctor(d.name);
    if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
    openBookingForm();
  };

  // ---- home: care team -----------------------------------------------------
  function careTeam(el, ids) {
    el.innerHTML = ids.map(function (id, i) {
      var d = DOCTOR[id], c = CLINIC[d.clinicId];
      return '<article class="dcard c3 reveal' + (i % 4 ? ' d' + (i % 4) : '') + ' deck-item"><div class="dcard-body">' +
        '<div class="dcard-head">' + avatar(d, 64) + '<div><h3 class="dcard-name">' + esc(d.name) + ', ' + esc(d.credentials) + '</h3>' +
        '<div class="dcard-role">' + esc(d.specialty) + '</div></div></div>' +
        '<div class="dcard-clinic">' + esc(c.name) + '</div>' + status(d) +
        '<div class="dcard-meta">' + ratingLine(d) + actionBtn(d) + '</div>' +
        src('Profile', d.sourceName, d.profileUrl) + ratingSrc(d) + photoSrc(d) +
        '</div></article>';
    }).join('');
  }

  // ---- home: featured clinics ----------------------------------------------
  function featured(el, items) {
    el.innerHTML = items.map(function (it, i) {
      var c = CLINIC[it.id], ds = docsOf(c.id), rated = ds.filter(function (d) { return d.rating; }).length;
      return '<article class="ccard c3 reveal' + (i ? ' d' + i : '') + ' deck-item" data-clinic="' + c.id + '">' +
        '<button class="ccard-hit" type="button" onclick="quickPick(' + c.diseaseId + ')" aria-label="' + esc(c.name) + ' – find doctors">' +
        '<div class="ccard-img">' + clinicImg(c, '') + '<span class="ccard-badge">' + esc(c.city) + ', MA</span></div>' +
        '<div class="ccard-bar"><span>' + esc(c.phone ? 'Tel. ' + c.phone : 'Contact via source') + '</span></div>' +
        '<div class="ccard-body"><h3 class="ccard-title">' + esc(c.name) + '</h3><div class="ccard-tags">' + esc(DISEASE[c.diseaseId].name) + ' · ' + esc(c.address) + '</div></div>' +
        '<div class="ccard-stats"><div><b data-count="' + ds.length + '">0</b><small>Doctors listed</small></div><div><b data-count="' + rated + '">0</b><small>With public rating</small></div><div><b data-count="1">0</b><small>Condition</small></div></div>' +
        '</button>' +
        '<div class="ccard-src">' + src('Source', c.sourceName, c.sourceUrl) + clinicPhotoSrc(c) + '</div>' +
        '</article>';
    }).join('');
  }

  // ---- clinics page ---------------------------------------------------------
  function clinicsPage(el) {
    var list = CLINICS.slice().sort(function (a, b) { return a.name.replace(/^the\s+/i, '').localeCompare(b.name.replace(/^the\s+/i, '')); });
    el.innerHTML = list.map(function (c, i) {
      var ds = docsOf(c.id);
      return '<article class="card c6 dir-item' + (i >= 6 ? ' hidden' : '') + '" id="clinic-' + c.id + '" data-az="' + letterOf(c.name) + '">' +
        clinicImg(c, 'clinic-photo') + '<div class="card-body">' +
        '<h2>' + esc(c.name) + '</h2>' +
        '<p class="meta">' + esc(c.address) + (c.phone ? ' · ' + esc(c.phone) : '') + ' · ' + link('Website', c.website) + '</p>' +
        src('Clinic details', c.sourceName, c.sourceUrl) + clinicPhotoSrc(c) +
        '<div class="badges"><span class="badge">' + esc(DISEASE[c.diseaseId].name) + '</span></div>' +
        '<h3 class="dir-h">Doctors</h3>' +
        ds.map(function (d) {
          return '<div class="doc-row"><div class="row">' + avatar(d, 44) + '<div><b>' + esc(d.name) + ', ' + esc(d.credentials) + '</b><br><span class="meta">' + esc(d.specialty) + '</span> · ' + ratingLine(d) + status(d) +
            src('Profile', d.sourceName, d.profileUrl) + ratingSrc(d) + photoSrc(d) + recognition(d) + '</div></div></div>';
        }).join('') +
        '<a class="btn" href="index.html?disease=' + c.diseaseId + '#search">Find doctors &amp; book</a>' +
        '</div></article>';
    }).join('');
  }

  // ---- doctors page ---------------------------------------------------------
  var COLORS = ['#00857A', '#0B4F8A', '#7A3E9D', '#B5462F', '#2E6B30', '#8A5A00'];
  function doctorsPage(el) {
    var all = Object.keys(DOCTOR).map(function (k) { return DOCTOR[k]; }).sort(function (a, b) { return surname(a.name).localeCompare(surname(b.name)); });
    el.innerHTML = all.map(function (d, i) {
      var c = CLINIC[d.clinicId];
      return '<article class="card c6 dir-item' + (i >= 6 ? ' hidden' : '') + '" id="doctor-' + d.id + '" data-az="' + letterOf(surname(d.name)) + '"><div class="card-body">' +
        '<div class="row">' + avatar(d, 56) +
        '<div><h2>' + esc(d.name) + ', ' + esc(d.credentials) + '</h2><p class="meta" style="margin:0">' + esc(d.specialty) + '<br>' + esc(c.name) + '</p></div></div>' +
        '<p class="meta" style="margin:10px 0 0">' + ratingLine(d) + '</p>' + status(d) +
        src('Profile', d.sourceName, d.profileUrl) + ratingSrc(d) + photoSrc(d) + recognition(d) +
        '<div class="badges"><span class="badge">' + esc(DISEASE[d.diseases[0]].name) + '</span><span class="badge">' + esc(c.city) + ', MA</span></div>' +
        '<a class="btn" href="index.html?disease=' + d.diseases[0] + '#search">Book via MA Health</a>' +
        '</div></article>';
    }).join('');
  }

  // ---- diseases page (same images and text as the home page condition cards) ------
  function diseasesPage(el) {
    var extra = typeof moreConditions !== 'undefined' ? moreConditions : [];
    var all = diseases.map(function (d) { return { d: d, clinics: clinicsByDisease[d.id] || [], direct: true }; })
      .concat(extra.map(function (d) { return { d: d, clinics: d.relatedDiseaseId ? (clinicsByDisease[d.relatedDiseaseId] || []) : [], direct: false }; }))
      .sort(function (a, b) { return a.d.name.localeCompare(b.d.name); });
    el.innerHTML = all.map(function (x) {
      var d = x.d, cl = x.clinics, bookId = x.direct ? d.id : d.relatedDiseaseId;
      var img = d.image || d.imageFallback;
      var clinicsHTML = cl.length
        ? '<p class="dz-label">' + (x.direct ? 'Verified clinics in Massachusetts' : 'Verified ' + esc(DISEASE[bookId].name.toLowerCase()) + ' specialists who may help (' + esc(d.specialty) + ')') + '</p>' +
          '<div class="badges">' + cl.map(function (c) { return '<a class="badge" href="clinics.html#clinic-' + c.id + '">' + esc(c.name) + '</a>'; }).join('') + '</div>' +
          '<a class="btn" href="index.html?disease=' + bookId + '#search">Find clinics' + (x.direct ? ' for ' + esc(d.name) : '') + '</a>'
        : '<p class="dz-none">No verified doctor or clinic information found for ' + esc(d.name) + ' in Massachusetts yet.' +
          (d.specialty ? ' Look for a <b>' + esc(d.specialty) + '</b> specialist, or see <a href="clinics.html#live-hospitals">all active Massachusetts hospitals</a>.' : '') + '</p>';
      return '<article class="card c6 dir-item" id="disease-' + d.id + '" data-az="' + letterOf(d.name) + '"><div class="card-body">' +
        '<div class="row"><img class="thumb" src="' + esc(img) + '" onerror="this.onerror=null;this.src=\'' + esc(d.imageFallback) + '\'" alt="" loading="lazy">' +
        '<div><h2>' + esc(d.name) + '</h2>' + (d.specialty ? '<p class="meta" style="margin:0 0 .2em">' + esc(d.specialty) + '</p>' : '') +
        '<p class="meta" style="margin:0">' + esc(d.about) + '</p></div></div>' +
        '<p class="meta"><b>Symptoms:</b> ' + esc(d.symptoms) + '</p>' + clinicsHTML +
        '</div></article>';
    }).join('');
  }

  // ---- patient stories (real, sourced) ------------------------------------------
  function stories(el, cols) {
    var list = (typeof patientStories !== 'undefined' ? patientStories : []).filter(function (st) { return DOCTOR[st.doctorId]; });
    el.innerHTML = list.map(function (st, i) {
      var d = DOCTOR[st.doctorId], c = CLINIC[d.clinicId];
      return '<blockquote class="tcard ' + cols + ' reveal' + (i % 4 ? ' d' + (i % 4) : '') + ' deck-item">' +
        '<p>“' + esc(st.quote) + '”</p>' +
        '<div class="tperson">' + avatar(d, 48) + '<div><b>About ' + esc(d.name) + '</b><small>' + esc(c.name) + '</small></div></div>' +
        '<p class="src">Anonymous patient' + (st.date ? ' · ' + esc(st.date) : '') + ' · Source: ' + link(st.sourceName, st.sourceUrl) + '</p>' +
        '</blockquote>';
    }).join('');
  }

  g.MAH = { CLINIC: CLINIC, DOCTOR: DOCTOR, esc: esc, src: src, ratingLine: ratingLine, ratingSrc: ratingSrc, initials: initials, avatarFor: function (name, size) { return avatar({ name: name }, size); } };

  // Render whatever containers exist on this page (runs before the page's own scripts).
  var el;
  if ((el = document.getElementById('care-team'))) careTeam(el, [121, 221, 321, 421, 511, 611, 712, 821].filter(function (id) { return DOCTOR[id]; }));
  if ((el = document.getElementById('featured-clinics'))) featured(el, [
    { id: 12, img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=75', fallback: 'images/clinic-1.png' },
    { id: 22, img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=75', fallback: 'images/clinic-2.png' },
    { id: 41, img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=75', fallback: 'images/clinic-3.png' },
    { id: 51, img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=75', fallback: 'images/clinic-4.png' }
  ]);
  if ((el = document.getElementById('stories-list'))) stories(el, el.dataset.cols || 'c3');
  if ((el = document.getElementById('clinic-list'))) clinicsPage(el);
  if ((el = document.getElementById('doctor-list'))) doctorsPage(el);
  if ((el = document.getElementById('disease-list'))) diseasesPage(el);

  // Arriving from a search result (#doctor-111, #clinic-12, #disease-4): reveal, scroll to and flash that card.
  function focusHash() {
    var id = decodeURIComponent(location.hash.slice(1)); if (!/^(doctor|clinic|disease)-\d+$/.test(id)) return;
    var t = document.getElementById(id); if (!t) return;
    t.classList.remove('hidden', 'find-hidden'); t.classList.add('hash-target');
    setTimeout(function () { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
    setTimeout(function () { t.classList.remove('hash-target'); }, 2600);
  }
  focusHash(); window.addEventListener('hashchange', focusHash);
})(window);
