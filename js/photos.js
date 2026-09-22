/* Swaps the generic clinic/hospital image for a real building photo from Wikimedia Commons (via our
   server), with the credit its licence requires. Anything without a suitable photo keeps the generic image. */
(function (g) {
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function credit(p) {
    var who = p.artist ? esc(p.artist) : 'Wikimedia Commons contributor';
    var lic = p.license ? (p.licenseUrl ? '<a href="' + esc(p.licenseUrl) + '" target="_blank" rel="noopener">' + esc(p.license) + '</a>' : esc(p.license)) : '';
    return '<p class="src photo-credit">Photo of ' + esc(p.article) + ': ' + who + (lic ? ' · ' + lic : '') +
      ' · <a href="' + esc(p.filePage) + '" target="_blank" rel="noopener">Wikimedia Commons</a></p>';
  }
  function apply(img, p, creditHost) {
    if (!img || !p) return;
    img.src = p.url; img.alt = 'Photo of ' + p.article; img.classList.add('real-photo');
    img.onerror = function () { this.onerror = null; this.src = 'images/generic-clinic.svg'; this.classList.remove('real-photo'); };
    if (creditHost && !creditHost.querySelector('.photo-credit')) creditHost.insertAdjacentHTML('beforeend', credit(p));
  }
  g.MAHPhotos = { apply: apply, credit: credit };

  // verified clinics (home featured cards + clinics page)
  if (!document.querySelector('#featured-clinics, #clinic-list')) return;
  fetch('/api/photos/clinics').then(function (r) { return r.ok ? r.json() : { photos: {} }; }).then(function (b) {
    Object.keys(b.photos || {}).forEach(function (id) {
      var p = b.photos[id];
      var card = document.getElementById('clinic-' + id);
      if (card) apply(card.querySelector('img.clinic-photo'), p, card.querySelector('.card-body > .src') ? card.querySelector('.card-body') : card);
      var f = document.querySelector('#featured-clinics [data-clinic="' + id + '"]');
      if (f) apply(f.querySelector('.ccard-img img'), p, f.querySelector('.ccard-src'));
    });
  }).catch(function () { /* no server (opened as a file): generic images stay */ });
})(window);
