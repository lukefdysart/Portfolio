/* ============================================================
   Project MIMIC — live in-browser hand-tracking demo
   Ports the finger-bend math from the Python project (fingers.py)
   to JavaScript. Webcam -> MediaPipe Hands -> per-finger bend %
   -> animated robotic hand + bend bars.
   All processing is local; the video never leaves the device.
   ============================================================ */

(function () {
  'use strict';

  var launchBtn = document.getElementById('mimic-launch');
  var demo = document.getElementById('mimic-demo');
  var video = document.getElementById('mimic-video');
  var overlay = document.getElementById('mimic-overlay');
  var handCanvas = document.getElementById('mimic-hand');
  var statusEl = document.getElementById('mimic-status');
  var fpsEl = document.getElementById('mimic-fps');
  var startBtn = document.getElementById('mimic-start');
  var stopBtn = document.getElementById('mimic-stop');
  var bars = document.getElementById('mimic-bars');

  if (!launchBtn || !demo) return;

  var hands = null;
  var camera = null;
  var running = false;
  var lastTime = performance.now();

  // Current + smoothed finger values (0..100)
  var bend = { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
  var shown = { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };

  // ---------- Reveal / launch ----------
  launchBtn.addEventListener('click', function () {
    demo.hidden = !demo.hidden;
    launchBtn.textContent = demo.hidden ? '▶ See it in action' : '▼ Hide demo';
    if (!demo.hidden) {
      sizeCanvases();
      // Prewarm the hand-tracking model as soon as the demo is opened, so the
      // ~9MB of MediaPipe assets download while the user reads — WITHOUT
      // touching the camera (no permission prompt). By the time they press
      // Start, the model is usually already initialized.
      prewarm();
    }
  });

  // ============================================================
  //  Math ported from fingers.py
  // ============================================================
  function calcAngle(a, b, c) {
    var abx = a.x - b.x, aby = a.y - b.y, abz = (a.z||0) - (b.z||0);
    var cbx = c.x - b.x, cby = c.y - b.y, cbz = (c.z||0) - (b.z||0);
    var dot = abx*cbx + aby*cby + abz*cbz;
    var magAb = Math.sqrt(abx*abx + aby*aby + abz*abz);
    var magCb = Math.sqrt(cbx*cbx + cby*cby + cbz*cbz);
    if (magAb === 0 || magCb === 0) return 180;
    var cos = dot / (magAb * magCb);
    cos = Math.max(-1, Math.min(1, cos));
    return cos === 0 ? 90 : (Math.acos(cos) * 180 / Math.PI);
  }

  function angleToBend(angle, straight, bent) {
    if (straight === bent) return 0;
    var b = (straight - angle) / (straight - bent) * 100;
    return Math.round(Math.max(0, Math.min(100, b)));
  }

  function standardFinger(lm, mcp, pip, dip, tip) {
    var pipAngle = calcAngle(lm[mcp], lm[pip], lm[dip]);
    var dipAngle = calcAngle(lm[pip], lm[dip], lm[tip]);
    var pipBend = angleToBend(pipAngle, 175, 60);
    var dipBend = angleToBend(dipAngle, 175, 70);
    return Math.round(Math.max(0, Math.min(100, pipBend * 0.65 + dipBend * 0.35)));
  }

  function thumbBend(lm) {
    var mcpAngle = calcAngle(lm[1], lm[2], lm[3]);
    var ipAngle = calcAngle(lm[2], lm[3], lm[4]);
    var mcpBend = angleToBend(mcpAngle, 170, 75);
    var ipBend = angleToBend(ipAngle, 175, 80);
    return Math.round(Math.max(0, Math.min(100, mcpBend * 0.55 + ipBend * 0.45)));
  }

  function getFingerBends(lm) {
    return {
      thumb:  thumbBend(lm),
      index:  standardFinger(lm, 5, 6, 7, 8),
      middle: standardFinger(lm, 9, 10, 11, 12),
      ring:   standardFinger(lm, 13, 14, 15, 16),
      pinky:  standardFinger(lm, 17, 18, 19, 20)
    };
  }

  // ============================================================
  //  Canvas sizing
  // ============================================================
  function sizeCanvases() {
    [overlay, handCanvas].forEach(function (c) {
      if (!c) return;
      var r = c.parentElement.getBoundingClientRect();
      c.width = Math.max(2, Math.round(r.width));
      c.height = Math.max(2, Math.round(r.height));
    });
  }
  window.addEventListener('resize', function () { if (!demo.hidden) sizeCanvases(); });

  // ============================================================
  //  Webcam overlay — "hand scan" effect (from main.py)
  // ============================================================
  var SCAN_CONNECTIONS = (window.HAND_CONNECTIONS) || [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [5,9],[9,10],[10,11],[11,12],
    [9,13],[13,14],[14,15],[15,16],
    [13,17],[17,18],[18,19],[19,20],[0,17]
  ];

  // Map a normalized MediaPipe landmark (0..1, relative to the SOURCE video
  // frame) to a pixel on the overlay canvas, accounting for:
  //   - object-fit: cover  (the video is scaled to fill the box, cropping the
  //     overflowing axis — so normalized coords do NOT map linearly to the box)
  //   - the CSS horizontal mirror on the <video> (transform: scaleX(-1))
  // Without this, the overlay drifts off the hand (worst near the edges and on
  // non-4:3 containers), which is the misalignment being fixed here.
  function mapPoint(p, w, h) {
    var vw = video.videoWidth || 640;
    var vh = video.videoHeight || 480;
    // object-fit: cover scale = max so the frame fills the box
    var scale = Math.max(w / vw, h / vh);
    var dispW = vw * scale;        // displayed (pre-crop) frame size
    var dispH = vh * scale;
    var offX = (w - dispW) / 2;    // centered → negative when cropped
    var offY = (h - dispH) / 2;
    var x = p.x * dispW + offX;    // source-frame px → canvas px
    var y = p.y * dispH + offY;
    return { x: w - x, y: y };     // mirror X to match the flipped video
  }

  function drawScan(landmarks) {
    var ctx = overlay.getContext('2d');
    var w = overlay.width, h = overlay.height;
    ctx.clearRect(0, 0, w, h);
    if (!landmarks) return;

    function px(p) { return mapPoint(p, w, h); }

    // connections — glow then bright core
    SCAN_CONNECTIONS.forEach(function (pair) {
      var a = px(landmarks[pair[0]]), b = px(landmarks[pair[1]]);
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,120,20,0.85)'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,220,120,0.95)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    // joints
    landmarks.forEach(function (p) {
      var q = px(p);
      ctx.fillStyle = 'rgba(255,120,20,0.9)';
      ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(q.x, q.y, 3, 0, Math.PI*2); ctx.fill();
    });
  }

  // ============================================================
  //  Robotic hand renderer (driven by bend %)
  // ============================================================
  function drawRoboHand() {
    if (!handCanvas) return;   // robotic-hand panel removed from the demo
    var ctx = handCanvas.getContext('2d');
    var w = handCanvas.width, h = handCanvas.height;
    ctx.clearRect(0, 0, w, h);

    var cx = w * 0.5;
    var palmY = h * 0.78;
    var palmW = w * 0.34;
    var palmH = h * 0.2;

    // palm
    ctx.fillStyle = '#1e2531';
    ctx.strokeStyle = '#39465a';
    ctx.lineWidth = 2;
    roundRect(ctx, cx - palmW/2, palmY - palmH/2, palmW, palmH, 14);
    ctx.fill(); ctx.stroke();

    // four fingers
    var fingerDefs = [
      { key: 'index',  x: -0.33, len: 0.34 },
      { key: 'middle', x: -0.11, len: 0.40 },
      { key: 'ring',   x:  0.11, len: 0.36 },
      { key: 'pinky',  x:  0.33, len: 0.28 }
    ];
    fingerDefs.forEach(function (f) {
      var baseX = cx + f.x * palmW;
      var baseY = palmY - palmH/2;
      drawFinger(ctx, baseX, baseY, f.len * h, shown[f.key], w);
    });

    // thumb (angled)
    drawThumb(ctx, cx - palmW/2, palmY, h * 0.26, shown.thumb);

    // fps
    if (fpsEl) fpsEl.textContent = running ? (currentFps + ' fps') : '';
  }

  function drawFinger(ctx, x, y, totalLen, bendPct, w) {
    var segs = 3;
    var segLen = totalLen / segs;
    var t = bendPct / 100;             // 0 straight .. 1 fully bent
    var curlPerSeg = t * (Math.PI * 0.42);  // radians each joint curls
    var angle = -Math.PI / 2;          // pointing up
    var px = x, py = y;
    var segWidth = Math.max(6, w * 0.028);

    for (var i = 0; i < segs; i++) {
      angle += curlPerSeg;             // progressively curl inward
      var nx = px + Math.cos(angle) * segLen;
      var ny = py + Math.sin(angle) * segLen;

      ctx.strokeStyle = lerpColor(t);
      ctx.lineWidth = segWidth * (1 - i * 0.12);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();

      // knuckle
      ctx.fillStyle = '#0d1119';
      ctx.beginPath(); ctx.arc(px, py, segWidth*0.42, 0, Math.PI*2); ctx.fill();

      px = nx; py = ny;
    }
    // fingertip
    ctx.fillStyle = lerpColor(t);
    ctx.beginPath(); ctx.arc(px, py, segWidth*0.42, 0, Math.PI*2); ctx.fill();
  }

  function drawThumb(ctx, x, y, len, bendPct) {
    var t = bendPct / 100;
    var segs = 2, segLen = len / segs;
    var angle = Math.PI * 0.92;        // pointing left-ish
    var curl = t * (Math.PI * 0.33);
    var px = x, py = y;
    var segWidth = Math.max(7, handCanvas.width * 0.032);
    for (var i = 0; i < segs; i++) {
      angle -= curl;
      var nx = px + Math.cos(angle) * segLen;
      var ny = py + Math.sin(angle) * segLen;
      ctx.strokeStyle = lerpColor(t);
      ctx.lineWidth = segWidth;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
      ctx.fillStyle = '#0d1119';
      ctx.beginPath(); ctx.arc(px, py, segWidth*0.4, 0, Math.PI*2); ctx.fill();
      px = nx; py = ny;
    }
    ctx.fillStyle = lerpColor(t);
    ctx.beginPath(); ctx.arc(px, py, segWidth*0.4, 0, Math.PI*2); ctx.fill();
  }

  function lerpColor(t) {
    // dim steel (straight) -> hot orange (bent)
    var r = Math.round(90 + (255 - 90) * t);
    var g = Math.round(110 + (120 - 110) * t);
    var b = Math.round(140 + (20 - 140) * t);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ============================================================
  //  Bend bars + smoothing loop
  // ============================================================
  function updateBars() {
    ['thumb','index','middle','ring','pinky'].forEach(function (k) {
      var fill = bars.querySelector('[data-finger="' + k + '"]');
      var val = bars.querySelector('[data-val="' + k + '"]');
      if (fill) fill.style.width = shown[k] + '%';
      if (val) val.textContent = Math.round(shown[k]) + '%';
    });
  }

  var currentFps = 0;
  function animate() {
    if (!running) return;
    // smooth toward target
    ['thumb','index','middle','ring','pinky'].forEach(function (k) {
      shown[k] += (bend[k] - shown[k]) * 0.35;
    });
    drawRoboHand();
    updateBars();
    if (fpsEl) fpsEl.textContent = running ? (currentFps + ' fps') : '';
    requestAnimationFrame(animate);
  }

  // ============================================================
  //  MediaPipe wiring
  // ============================================================
  function onResults(results) {
    var now = performance.now();
    var dt = now - lastTime; lastTime = now;
    if (dt > 0) currentFps = Math.round(1000 / dt);

    if (!firstResult) { firstResult = true; mark('first inference / model live'); }

    if (results.multiHandLandmarks && results.multiHandLandmarks.length) {
      var lm = results.multiHandLandmarks[0];
      bend = getFingerBends(lm);
      drawScan(lm);
      statusEl.textContent = 'Hand scan active';
      statusEl.style.color = 'var(--accent-soft)';
    } else {
      drawScan(null);
      statusEl.textContent = 'Show your hand';
      statusEl.style.color = 'var(--text-dim)';
    }
  }

  // ---- status helpers ----
  function setStatus(text, color) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = color || 'var(--text-dim)';
  }
  // lightweight timestamped instrumentation (visible in the console)
  var T0 = 0;
  function mark(label) {
    try { console.log('[MIMIC] ' + label + ': +' + Math.round(performance.now() - T0) + 'ms'); } catch (e) {}
  }

  // Version-pinned asset URL — a stable, cacheable path so the browser can
  // reuse the ~9MB model across visits instead of re-resolving 'latest'.
  var MP_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/';

  var firstResult = false;  // set true on the first onResults (model is live)

  // Create the Hands instance (once) and configure it.
  // IMPORTANT: we do NOT call hands.initialize() — the pinned WASM build
  // aborts on the explicit initialize() path ("Module.arguments has been
  // replaced with plain arguments"). The reliable path is to let the FIRST
  // hands.send() initialize the solution lazily, exactly as it did before.
  function createHands() {
    if (hands) return hands;
    if (typeof Hands === 'undefined') return null;
    hands = new Hands({ locateFile: function (file) { return MP_BASE + file; } });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);
    return hands;
  }

  // Prewarm = warm the HTTP cache for the big WASM/model assets so the first
  // send() is fast — WITHOUT instantiating the WASM (no camera, no
  // initialize()). Just fetches the files into cache.
  var prewarmed = false;
  function prewarm() {
    if (prewarmed) return;
    prewarmed = true;
    var assets = [
      'hands_solution_simd_wasm_bin.js',
      'hands_solution_simd_wasm_bin.wasm',
      'hands_solution_packed_assets.data',
      'hands.binarypb'
    ];
    assets.forEach(function (f) {
      try { fetch(MP_BASE + f, { mode: 'cors', cache: 'force-cache' }).catch(function () {}); }
      catch (e) {}
    });
  }

  function start() {
    if (running) return;
    sizeCanvases();
    T0 = performance.now();

    if (typeof Hands === 'undefined') {
      setStatus('Tracking library failed to load — check your connection', '#ff6b6b');
      showRetry();
      return;
    }
    if (!createHands()) {
      setStatus('Couldn’t start hand tracking', '#ff6b6b');
      showRetry();
      return;
    }

    setStatus('Requesting camera access…');
    firstResult = false;

    // Camera up first (fast); the first onFrame -> hands.send() lazily
    // initializes the model. Status reflects the real phase.
    var camP;
    if (typeof Camera !== 'undefined') {
      camera = new Camera(video, {
        onFrame: async function () {
          try { await hands.send({ image: video }); }
          catch (e) { handleInitError(e); }
        },
        width: 640, height: 480
      });
      camP = camera.start();
    } else {
      camP = navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(function (stream) { video.srcObject = stream; return video.play(); })
        .then(function () {
          (function pump() {
            if (!running) return;
            hands.send({ image: video })
              .then(function () { requestAnimationFrame(pump); })
              .catch(handleInitError);
          })();
        });
    }

    camP.then(function () {
      mark('camera ready');
      running = true; lastTime = performance.now(); animate();
      setStatus('Loading hand-tracking model…');
      // onResults() will flip to 'Hand scan active' once the model is live.
    }).catch(cameraError);
  }

  // Surfaces a genuine WASM/model init failure (not a camera issue).
  var initFailed = false;
  function handleInitError(e) {
    if (initFailed) return;
    initFailed = true;
    console.error('[MIMIC] hand-tracking init failed:', e);
    running = false;
    if (camera && camera.stop) { try { camera.stop(); } catch (x) {} }
    setStatus('Couldn’t start hand tracking', '#ff6b6b');
    showRetry();
  }

  function cameraError(err) {
    console.error(err);
    var msg = (err && err.name === 'NotAllowedError')
      ? 'Camera access was blocked — allow it and retry'
      : 'Camera unavailable';
    setStatus(msg, '#ff6b6b');
    showRetry();
  }

  // Tear down the current Hands instance so the next start() builds a fresh
  // one (used by Retry — never reuse a tracker that failed to initialize).
  function destroyHands() {
    if (camera && camera.stop) { try { camera.stop(); } catch (e) {} }
    camera = null;
    if (hands && hands.close) { try { hands.close(); } catch (e) {} }
    hands = null;
  }

  // Inline retry button inside the controls (created once, on demand)
  function showRetry() {
    if (document.getElementById('mimic-retry')) return;
    var b = document.createElement('button');
    b.id = 'mimic-retry';
    b.className = 'btn btn-small btn-ghost';
    b.textContent = 'Retry';
    b.addEventListener('click', function () {
      b.remove();
      // genuinely rebuild: drop the broken instance, reset failure state
      running = false;
      initFailed = false;
      destroyHands();
      start();
    });
    if (startBtn && startBtn.parentNode) startBtn.parentNode.insertBefore(b, startBtn.nextSibling);
  }

  function stop() {
    running = false;
    if (camera && camera.stop) { try { camera.stop(); } catch (e) {} }
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(function (t) { t.stop(); });
      video.srcObject = null;
    }
    // Keep a WORKING `hands` model in memory so a normal restart reuses it
    // (no re-download / re-init). A failed instance is torn down by Retry.
    initFailed = false;
    setStatus('Camera off');
    if (fpsEl) fpsEl.textContent = '';
    bend = { thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 };
    drawScan(null);
    drawRoboHand();
    updateBars();
  }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);

  // draw an idle hand once the demo is first opened
  launchBtn.addEventListener('click', function () {
    if (!demo.hidden) { sizeCanvases(); drawRoboHand(); updateBars(); }
  });
})();
