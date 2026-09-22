/* Site search (search.html?q=…): results grouped by category, using only information on this website –
   the verified catalogue (doctors, clinics, conditions, patient comments) plus text of the site's own pages. */
(function () {
  var results = document.getElementById('sr-results');
  if (!results || typeof diseases === 'undefined') return;
  var esc = window.MAH ? MAH.esc : function (t) { return String(t); };
  var params = new URLSearchParams(location.search);
  var q = (params.get('q') || '').trim().slice(0, 80);
  var input = document.getElementById('sr-q'), tabs = document.getElementById('sr-tabs'), summary = document.getElementById('sr-summary');
  input.value = q;

  var norm = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  var terms = norm(q).split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1 || /\d/.test(t); });

  // Score: every term must appear somewhere; matches in the title count most.
  function score(title, body) {
    var T = norm(title), B = norm(body), s = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (T.indexOf(t) > -1) s += (new RegExp('\\b' + t).test(T) ? 10 : 6);
      else if (B.indexOf(t) > -1) s += (new RegExp('\\b' + t).test(B) ? 3 : 1);
      else return 0;
    }
    return s;
  }
  function hl(text) {
    var out = esc(text);
    terms.forEach(function (t) { out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark class="find-hit">$1</mark>'); });
    return out;
  }
  function snippet(text, n) {
    text = String(text || '').replace(/\s+/g, ' ').trim(); n = n || 180;
    var i = -1, T = norm(text); terms.some(function (t) { i = T.indexOf(t); return i > -1; });
    var start = Math.max(0, i - 60), s = text.slice(start, start + n);
    return (start > 0 ? '…' : '') + s + (start + n < text.length ? '…' : '');
  }

  // ---------------------------------------------------------------- index
  var CAT = { doctors: 'Doctors', clinics: 'Clinics', conditions: 'Conditions', stories: 'Patient stories', pages: 'Site pages & FAQs' };
  var items = [];
  var CLINIC = MAH.CLINIC, DOCTOR = MAH.DOCTOR;
  Object.keys(DOCTOR).forEach(function (k) {
    var d = DOCTOR[k], c = CLINIC[d.clinicId], dis = diseases.find(function (x) { return x.id === d.diseases[0]; });
    items.push({ cat: 'doctors', title: d.name + ', ' + d.credentials, body: [d.specialty, c.name, c.city, c.address, dis && dis.name, d.sourceName].join(' · '), url: 'doctors.html#doctor-' + d.id,
      render: function () {
        return '<div class="row">' + MAH.avatarFor(d.name, 48) + '<div><h3><a href="doctors.html#doctor-' + d.id + '">' + hl(d.name + ', ' + d.credentials) + '</a></h3>' +
          '<p class="meta">' + hl(d.specialty) + ' · ' + hl(c.name) + ' · ' + hl(c.city) + ', MA</p><p class="meta">' + MAH.ratingLine(d) + '</p></div></div>' +
          MAH.src('Profile', d.sourceName, d.profileUrl);
      } });
  });
  Object.keys(CLINIC).forEach(function (k) {
    var c = CLINIC[k], dis = diseases.find(function (x) { return x.id === c.diseaseId; }), docs = (doctorsByClinic[c.id] || []).map(function (d) { return d.name; });
    items.push({ cat: 'clinics', title: c.name, body: [c.address, c.city, c.phone, dis && dis.name, docs.join(' ')].join(' · '), url: 'clinics.html#clinic-' + c.id,
      render: function () {
        return '<h3><a href="clinics.html#clinic-' + c.id + '">' + hl(c.name) + '</a></h3><p class="meta">' + hl(c.address) + (c.phone ? ' · ' + esc(c.phone) : '') + '</p>' +
          '<p class="meta">' + hl(dis ? dis.name : '') + ' · Doctors: ' + hl(docs.join(', ')) + '</p>' + MAH.src('Clinic details', c.sourceName, c.sourceUrl);
      } });
  });
  diseases.concat(typeof moreConditions !== 'undefined' ? moreConditions : []).forEach(function (d) {
    var bookable = diseases.indexOf(d) > -1;
    items.push({ cat: 'conditions', title: d.name, body: [d.desc, d.specialty, d.about, 'Symptoms: ' + d.symptoms].join(' '), url: 'diseases.html#disease-' + d.id,
      render: function () {
        return '<div class="row"><img class="sr-thumb" src="' + esc(d.image || d.imageFallback) + '" onerror="this.onerror=null;this.src=\'' + esc(d.imageFallback) + '\'" alt="" loading="lazy">' +
          '<div><h3><a href="diseases.html#disease-' + d.id + '">' + hl(d.name) + '</a></h3><p class="meta">' + hl(d.about) + '</p>' +
          '<p class="meta"><b>Symptoms:</b> ' + hl(d.symptoms) + '</p>' + (bookable ? '<p class="meta"><a href="index.html?disease=' + d.id + '#search">Find clinics for ' + esc(d.name) + ' →</a></p>' : '') + '</div></div>';
      } });
  });
  (typeof patientStories !== 'undefined' ? patientStories : []).forEach(function (st) {
    var d = DOCTOR[st.doctorId]; if (!d) return;
    items.push({ cat: 'stories', title: 'About ' + d.name, body: st.quote + ' ' + CLINIC[d.clinicId].name, url: 'patient-stories.html',
      render: function () {
        return '<p class="sr-quote">“' + hl(st.quote) + '”</p><p class="meta"><a href="patient-stories.html">About ' + hl(d.name) + '</a> · ' + esc(CLINIC[d.clinicId].name) + '</p>' +
          '<p class="src">Anonymous patient' + (st.date ? ' · ' + esc(st.date) : '') + ' · Source: <a href="' + esc(st.sourceUrl) + '" target="_blank" rel="noopener">' + esc(st.sourceName) + '</a></p>';
      } });
  });

  // Text of the site's own pages (About sections, home-page FAQs), read from the pages themselves.
  function pageItems() {
    var pages = [{ url: 'about.html', label: 'About' }, { url: 'index.html', label: 'Home' }];
    return Promise.all(pages.map(function (p) {
      return fetch(p.url).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html'), out = [];
        doc.querySelectorAll('details').forEach(function (dt) {
          var sm = dt.querySelector('summary'); if (!sm) return;
          var ans = dt.textContent.replace(sm.textContent, '').trim();
          out.push({ cat: 'pages', title: sm.textContent.trim(), body: ans, url: 'index.html#help', where: 'FAQ' });
        });
        if (p.url === 'about.html') {
          doc.querySelectorAll('main h2, main h3').forEach(function (h) {
            var txt = '', n = h.nextElementSibling;
            while (n && !/^H[23]$/.test(n.tagName)) { txt += ' ' + n.textContent; n = n.nextElementSibling; }
            out.push({ cat: 'pages', title: h.textContent.trim(), body: txt.trim(), url: 'about.html', where: 'About' });
          });
          var intro = doc.querySelector('.page-head p'); if (intro) out.push({ cat: 'pages', title: 'About MA Health', body: intro.textContent, url: 'about.html', where: 'About' });
        }
        return out;
      }).catch(function () { return []; });
    })).then(function (lists) {
      return [].concat.apply([], lists).map(function (it) {
        it.render = function () { return '<h3><a href="' + it.url + '">' + hl(it.title) + '</a></h3><p class="meta">' + hl(snippet(it.body)) + '</p><p class="src">' + esc(it.where) + ' page</p>'; };
        return it;
      });
    });
  }

  // ---------------------------------------------------------------- render
  var active = 'all';
  function draw(hits) {
    var byCat = {}; Object.keys(CAT).forEach(function (c) { byCat[c] = []; });
    hits.forEach(function (h) { byCat[h.cat].push(h); });
    var total = hits.length;
    tabs.innerHTML = '<button type="button" role="tab" data-cat="all" aria-selected="' + (active === 'all') + '">All <span>' + total + '</span></button>' +
      Object.keys(CAT).map(function (c) {
        return '<button type="button" role="tab" data-cat="' + c + '" aria-selected="' + (active === c) + '"' + (byCat[c].length ? '' : ' disabled') + '>' + CAT[c] + ' <span>' + byCat[c].length + '</span></button>';
      }).join('');
    results.innerHTML = total ? Object.keys(CAT).filter(function (c) { return byCat[c].length && (active === 'all' || active === c); }).map(function (c) {
      return '<section class="sr-group" aria-labelledby="sr-h-' + c + '"><h2 id="sr-h-' + c + '">' + CAT[c] + ' <span class="sr-count">' + byCat[c].length + '</span></h2>' +
        '<div class="g12">' + byCat[c].map(function (h) { return '<article class="card c6 sr-item"><div class="card-body">' + h.render() + '</div></article>'; }).join('') + '</div></section>';
    }).join('') : '<p class="sr-none">No results for “' + esc(q) + '” on MA Health. Try a doctor’s name, a condition such as <a href="search.html?q=asthma">asthma</a>, a symptom such as <a href="search.html?q=wheezing">wheezing</a>, or a city such as <a href="search.html?q=worcester">Worcester</a>.</p>';
    summary.textContent = total + ' result' + (total === 1 ? '' : 's') + ' for “' + q + '”';
    document.title = (q ? q + ' – ' : '') + 'Search results – MA Health';
  }
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-cat]'); if (!b || b.disabled) return;
    active = b.dataset.cat; draw(current);
  });

  var current = [];
  if (!terms.length) { results.innerHTML = '<p class="sr-none">Type a doctor, clinic, condition, symptom or city above.</p>'; input.focus(); return; }
  function search(list) {
    return list.map(function (it) { it.s = score(it.title, it.body); return it; }).filter(function (it) { return it.s > 0; })
      .sort(function (a, b) { return b.s - a.s || a.title.localeCompare(b.title); });
  }
  current = search(items); draw(current);                        // catalogue results immediately
  pageItems().then(function (extra) { current = search(items.concat(extra)); draw(current); }); // then add page text
})();
