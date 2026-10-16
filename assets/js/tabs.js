/* ============================================================
   Tabbed navigation — one section visible at a time.
   Clicking a nav item (or a [data-tab] control) swaps the active
   panel with an animated transition. Hero ('home') is the default.
   Falls back gracefully: if JS is off, all sections just stack.
   ============================================================ */

(function () {
  'use strict';

  var PANELS = ['home', 'about', 'engineering', 'logs', 'art'];
  var panels = {};
  PANELS.forEach(function (id) {
    panels[id] = document.querySelector('.tab-panel[data-panel="' + id + '"]');
  });

  var navTabs = Array.prototype.slice.call(document.querySelectorAll('.nav-tab'));
  var header = document.getElementById('site-header');
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelector('.nav-links');
  var navToggle = document.querySelector('.nav-toggle');
  var current = null;

  if (!panels.home) return;   // markup not present — bail, leave page as-is

  // Enable tab mode (CSS hides inactive panels only when this class is on <body>)
  document.body.classList.add('tabs-enabled');

  function setActiveNav(id) {
    navTabs.forEach(function (a) {
      var on = a.getAttribute('data-tab') === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function show(id, opts) {
    opts = opts || {};
    if (!panels[id] || id === current) {
      // still handle closing mobile menu / scroll reset
      if (navLinks) navLinks.classList.remove('open');
      return;
    }
    var prev = current;
    current = id;

    PANELS.forEach(function (pid) {
      var p = panels[pid];
      if (!p) return;
      if (pid === id) {
        p.hidden = false;
        // retrigger entrance animation
        p.classList.remove('panel-enter');
        // force reflow so the animation restarts
        void p.offsetWidth;
        p.classList.add('panel-enter');
      } else {
        p.hidden = true;
        p.classList.remove('panel-enter');
      }
    });

    setActiveNav(id);

    // Update hash without jumping the page
    if (!opts.noHash) {
      try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ }
    }

    // Reset scroll to the top of the new panel (below the fixed header)
    window.scrollTo({ top: 0, behavior: opts.instant ? 'auto' : 'smooth' });

    // Close mobile menu
    if (navLinks) navLinks.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');

    // Let other scripts know (e.g. re-init canvases) 
    document.dispatchEvent(new CustomEvent('tabchange', { detail: { id: id, prev: prev } }));
  }

  // Wire up every [data-tab] control
  navTabs.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('data-tab');
      if (panels[id]) { e.preventDefault(); show(id); }
    });
  });

  // Brand click -> home
  var brand = document.querySelector('.brand');
  if (brand) brand.addEventListener('click', function (e) {
    e.preventDefault(); show('home');
  });

  // Deep-link support: open the panel named in the URL hash on load
  var initial = (location.hash || '').replace('#', '');
  if (PANELS.indexOf(initial) === -1) initial = 'home';
  show(initial, { noHash: true, instant: true });

  // Back/forward buttons
  window.addEventListener('hashchange', function () {
    var id = (location.hash || '').replace('#', '') || 'home';
    if (panels[id]) show(id, { noHash: true });
  });
})();
