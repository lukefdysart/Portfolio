/* ============================================================
   Luke Dysart — Portfolio : site interactions
   Nav, scroll effects, reveal-on-scroll, gallery lightbox.
   ============================================================ */

(function () {
  'use strict';

  // ----- Year in footer -----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- Header shadow on scroll -----
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Mobile nav toggle -----
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // close menu when a link is clicked (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ----- Reveal on scroll -----
  var revealTargets = document.querySelectorAll('.section, .project, .gallery-item');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('visible'); });
  }

  // ----- MARY logo: trigger its animation when it scrolls into view -----
  // On touch devices there's no hover, and in this tabbed SPA the on-load
  // draw-in finishes before the user reaches Engineering. Toggling .in-view
  // when the logo is actually visible lets the CSS run the "traveling pulse"
  // for mobile (see @media (hover:none) .logo-mary.in-view). Replays on
  // re-entry; skipped under prefers-reduced-motion.
  (function () {
    var maryLogo = document.querySelector('.logo-mary');
    if (!maryLogo || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var maryIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // toggle so the animation restarts each time the logo re-enters view
        maryLogo.classList.toggle('in-view', entry.isIntersecting && entry.intersectionRatio > 0.4);
      });
    }, { threshold: [0, 0.4, 0.75] });
    maryIO.observe(maryLogo);

    // In the tabbed SPA the panel is hidden until navigated to; re-check on
    // tab change so the observer re-evaluates once Engineering is shown.
    document.addEventListener('tabchange', function (e) {
      if (e.detail && e.detail.id === 'engineering') {
        maryLogo.classList.remove('in-view');
        // next frame, let the observer re-fire against the now-visible panel
        requestAnimationFrame(function () { maryIO.unobserve(maryLogo); maryIO.observe(maryLogo); });
      }
    });
  })();

  // ----- Gallery lightbox -----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.querySelector('.lightbox-close');

  var lightboxSvgHost = document.getElementById('lightbox-svg');

  // Raster artwork (opens only if the real file is present)
  document.querySelectorAll('.gallery-item[data-full]').forEach(function (item) {
    item.addEventListener('click', function () {
      var src = item.getAttribute('data-full');
      var probe = new Image();
      probe.onload = function () {
        if (lightboxSvgHost) { lightboxSvgHost.hidden = true; lightboxSvgHost.innerHTML = ''; }
        lightboxImg.hidden = false;
        lightboxImg.src = src;
        lightbox.hidden = false;
      };
      probe.onerror = function () {
        // image not added yet — gently do nothing
      };
      probe.src = src;
    });
  });

  // Inline-SVG artwork (self-contained, always available)
  document.querySelectorAll('.gallery-item[data-svg]').forEach(function (item) {
    item.addEventListener('click', function () {
      var svg = item.querySelector('.art-svg svg');
      if (!svg || !lightboxSvgHost) return;
      lightboxImg.hidden = true;
      lightboxImg.src = '';
      lightboxSvgHost.innerHTML = svg.outerHTML;
      lightboxSvgHost.hidden = false;
      lightbox.hidden = false;
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    lightboxImg.hidden = false;
    if (lightboxSvgHost) { lightboxSvgHost.hidden = true; lightboxSvgHost.innerHTML = ''; }
  }
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  // ----- Guard demo links that still need a URL -----
  document.querySelectorAll('[data-needs-url]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (el.getAttribute('href') === '#') {
        e.preventDefault();
        alert('Add the deployed demo URL for this project in index.html.');
      }
    });
  });

  // ----- Animation D: subtle pointer parallax on the hero collage (desktop only) -----
  var collage = document.querySelector('[data-parallax]');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var okMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (collage && fine && okMotion) {
    var frames = Array.prototype.slice.call(collage.querySelectorAll('[data-depth]'));
    var raf = null, tx = 0, ty = 0;
    window.addEventListener('pointermove', function (e) {
      // normalized -1..1 from viewport center
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    function apply() {
      raf = null;
      frames.forEach(function (f) {
        var d = parseFloat(f.getAttribute('data-depth')) || 2;  // 2..4 px-ish
        f.style.transform = f.getAttribute('data-base') +
          ' translate3d(' + (tx * d) + 'px,' + (ty * d) + 'px,0)';
      });
    }
    // capture each frame's static rotation as its base transform
    frames.forEach(function (f) {
      f.setAttribute('data-base', getComputedStyle(f).transform === 'none' ? '' : getComputedStyle(f).transform);
    });
  }
})();
