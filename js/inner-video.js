/* Inner-page header video (same file as the home page): small file on phones; WebM with MP4 fallback;
   still poster for "reduce motion"; pauses when scrolled out of view. */
(function () {
  var v = document.getElementById('page-video'); if (!v) return;
  var small = window.matchMedia('(max-width: 768px)').matches || (navigator.connection && navigator.connection.saveData);
  var ext = v.canPlayType('video/webm; codecs="vp9"') ? 'webm' : 'mp4';   // same choice as the home page, so the browser reuses its cached copy
  v.src = 'video/hero' + (small ? '-mobile' : '') + '.' + ext;   // same video as the home page
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function apply() { if (reduce.matches) v.pause(); else { var p = v.play(); if (p && p.catch) p.catch(function () {}); } }
  v.addEventListener('loadeddata', apply);
  if (reduce.addEventListener) reduce.addEventListener('change', apply);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) apply(); else v.pause(); });
  }).observe(v);
})();
