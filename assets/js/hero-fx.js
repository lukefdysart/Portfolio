/* ============================================================
   Hero FX — a living particle/constellation field on canvas.
   Drifting nodes connected by faint lines (circuit/network vibe),
   gently reacting to the pointer. Palette: gold / blue / purple.
   Pauses when the Home tab isn't visible; respects reduced motion.
   ============================================================ */

(function () {
  'use strict';
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, nodes = [], raf = null, running = true;
  var mouse = { x: -9999, y: -9999 };
  var COLORS = ['199,150,47', '59,111,212', '123,92,196'];

  function size() {
    var r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function build() {
    var count = Math.round(Math.min(120, Math.max(44, (W * H) / 14000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      });
    }
  }

  function step() {
    if (!running) { raf = null; return; }
    ctx.clearRect(0, 0, W, H);
    var i, j, a, b, dx, dy, dist, max = 128;

    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      // pointer attraction (subtle)
      dx = mouse.x - a.x; dy = mouse.y - a.y; dist = Math.hypot(dx, dy);
      if (dist < 160) { a.vx += (dx / dist) * 0.015; a.vy += (dy / dist) * 0.015; }
      a.vx *= 0.99; a.vy *= 0.99;
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
      a.x = Math.max(0, Math.min(W, a.x));
      a.y = Math.max(0, Math.min(H, a.y));

      // node dot
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + a.c + ',0.55)';
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // connecting lines
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; dist = Math.hypot(dx, dy);
        if (dist < max) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + a.c + ',' + (0.16 * (1 - dist / max)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(step);
  }

  function start() { if (!raf && running) { running = true; raf = requestAnimationFrame(step); } }
  function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  // pointer
  window.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  window.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
  window.addEventListener('resize', size);

  // Pause when Home tab not active (tabs.js dispatches 'tabchange')
  document.addEventListener('tabchange', function (e) {
    if (e.detail && e.detail.id === 'home') { running = true; size(); start(); }
    else stop();
  });
  // Pause when the page/tab is hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else { running = true; start(); }
  });

  size();
  start();
})();
