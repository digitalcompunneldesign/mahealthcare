/* MA Health – shared 2D line-icon set (24px grid, 1.75 stroke). Usage: ICON('search') */
(function (g) {
  var P = {
 "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/>",
 "reset": "<path d=\"M3 12a9 9 0 1 0 2.6-6.4L3 8\"/><path d=\"M3 3v5h5\"/>",
 "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"1.5\"/><path d=\"m3.5 6.5 8.5 6.5 8.5-6.5\"/>",
 "pin": "<path d=\"M12 21s-7-6.2-7-11.2A7 7 0 0 1 19 9.8C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"10\" r=\"2.6\"/>",
 "stethoscope": "<path d=\"M5 3H4a1 1 0 0 0-1 1v5a6 6 0 0 0 12 0V4a1 1 0 0 0-1-1h-1\"/><path d=\"M9 15a6 6 0 0 0 12 0v-3\"/><circle cx=\"21\" cy=\"10\" r=\"2\"/>",
 "trending": "<path d=\"m3 17 6-6 4 4 8-8\"/><path d=\"M15 7h6v6\"/>",
 "grid": "<rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"1\"/>",
 "building": "<rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"1\"/><path d=\"M12 7v6M9 10h6\"/><path d=\"M10 21v-4h4v4\"/>",
 "user": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21a8 8 0 0 1 16 0\"/>",
 "star": "<path d=\"m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z\"/>",
 "shield": "<path d=\"M12 3 20 6v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z\"/><path d=\"m9 12 2 2 4-4\"/>",
 "heart": "<path d=\"M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1z\"/>",
 "heartpulse": "<path d=\"M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1z\"/><path d=\"M3.5 12H8l1.5-2.5 3 5 1.5-2.5h6.5\"/>",
 "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3.5 2\"/>",
 "checkcircle": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m8 12.5 2.8 2.8L16.5 9\"/>",
 "check": "<path d=\"m5 12.5 4.5 4.5L19 7.5\"/>",
 "arrowup": "<path d=\"M12 19V5M6 11l6-6 6 6\"/>",
 "arrowright": "<path d=\"M5 12h14M13 6l6 6-6 6\"/>",
 "x": "<path d=\"M18 6 6 18M6 6l12 12\"/>",
 "link": "<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1\"/><path d=\"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>",
 "phone": "<path d=\"M5 4h3.5l2 5-2.3 1.4a11 11 0 0 0 5.4 5.4L15 13.5l5 2V19a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z\"/>",
 "droplet": "<path d=\"M12 3s6.5 6.8 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.8 12 3 12 3z\"/><path d=\"M9 15a3 3 0 0 0 3 3\"/>",
 "gauge": "<path d=\"M3.5 17a9 9 0 1 1 17 0\"/><path d=\"m12 15 4.5-5\"/><circle cx=\"12\" cy=\"15\" r=\"1.4\"/><path d=\"M6.5 13h1M16.5 13h1M12 7.5v1\"/>",
 "wind": "<path d=\"M3 8h10a3 3 0 1 0-3-3\"/><path d=\"M3 12h15a3 3 0 1 1-3 3\"/><path d=\"M3 16h7\"/>",
 "brain": "<path d=\"M11 4.5A3 3 0 0 0 5.5 6 3 3 0 0 0 4 11a3 3 0 0 0 1 5 3 3 0 0 0 3.5 3.5A2.5 2.5 0 0 0 11 18z\"/><path d=\"M13 4.5A3 3 0 0 1 18.5 6 3 3 0 0 1 20 11a3 3 0 0 1-1 5 3 3 0 0 1-3.5 3.5A2.5 2.5 0 0 1 13 18z\"/><path d=\"M11 4.5V18M13 4.5V18\"/>",
 "bone": "<path d=\"M8.5 15.5l7-7\"/><path d=\"M6.2 13.8a2.3 2.3 0 1 0-1.5 3.9 2.3 2.3 0 1 0 3.9-1.5\"/><path d=\"M17.8 10.2a2.3 2.3 0 1 0 1.5-3.9 2.3 2.3 0 1 0-3.9 1.5\"/>",
 "spine": "<rect x=\"8.5\" y=\"2.5\" width=\"7\" height=\"4\" rx=\"1\"/><rect x=\"8.5\" y=\"10\" width=\"7\" height=\"4\" rx=\"1\"/><rect x=\"8.5\" y=\"17.5\" width=\"7\" height=\"4\" rx=\"1\"/><path d=\"M12 6.5V10M12 14v3.5M5 8.5h2M17 8.5h2M5 16h2M17 16h2\"/>",
 "skin": "<path d=\"M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z\"/><path d=\"M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z\"/><path d=\"M5 16.5l.6 1.4 1.4.6-1.4.6L5 20.5l-.6-1.4-1.4-.6 1.4-.6z\"/>",
 "clipboard": "<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"1.2\"/><path d=\"M9 4V2.8h6V4\"/><path d=\"m9 13 2 2 4-4\"/>",
 "contrast": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 3v18\"/><path d=\"M12 7h4M12 11h5.5M12 15h5M12 19h2.5\"/>",
 "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4\"/>",
 "moon": "<path d=\"M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z\"/>",
 "type": "<path d=\"M4 7V5h10v2M9 5v14M7 19h4\"/><path d=\"M14 13v-1.5h6V13M17 11.5V19M15.5 19h3\"/>",
 "spacing": "<path d=\"M3 12h18M6.5 8.5 3 12l3.5 3.5M17.5 8.5 21 12l-3.5 3.5\"/>",
 "pausecircle": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M10 9v6M14 9v6\"/>",
 "play": "<path d=\"M7 4.5v15l12-7.5z\"/>",
 "pause": "<path d=\"M8 5v14M16 5v14\"/>",
 "stop": "<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"1\"/>",
 "info": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11v5.5M12 7.8v.2\"/>",
 "a11y": "<circle cx=\"12\" cy=\"4.5\" r=\"1.8\"/><path d=\"M5 8.5l7 1.5 7-1.5\"/><path d=\"M12 10v4l-3.2 6.5M12 14l3.2 6.5\"/>"
};
  g.ICON = function (name, cls) {
    return '<svg class="' + (cls || 'ic') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || P.grid) + '</svg>';
  };
})(window);
