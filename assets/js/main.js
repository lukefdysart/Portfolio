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
})();
