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
    launchBtn.textContent = demo.hidden ? '▶ Try the live demo' : '▼ Hide demo';
    if (!demo.hidden) sizeCanvases();
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

  function drawScan(landmarks) {
    var ctx = overlay.getContext('2d');
    var w = overlay.width, h = overlay.height;
    ctx.clearRect(0, 0, w, h);
    if (!landmarks) return;

    // Mirror X to match the mirrored video feed
    function px(p) { return { x: (1 - p.x) * w, y: p.y * h }; }

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
    requestAnimationFrame(animate);
  }

  // ============================================================
  //  MediaPipe wiring
  // ============================================================
  function onResults(results) {
    var now = performance.now();
    var dt = now - lastTime; lastTime = now;
    if (dt > 0) currentFps = Math.round(1000 / dt);

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

  function initHands() {
    if (typeof Hands === 'undefined') {
      statusEl.textContent = 'Tracking library failed to load (needs internet)';
      return false;
    }
    hands = new Hands({
      locateFile: function (file) {
        return 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/' + file;
      }
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);
    return true;
  }

  function start() {
    if (running) return;
    sizeCanvases();
    if (!hands && !initHands()) return;

    statusEl.textContent = 'Starting camera…';

    if (typeof Camera !== 'undefined') {
      camera = new Camera(video, {
        onFrame: async function () { await hands.send({ image: video }); },
        width: 640, height: 480
      });
      camera.start().then(function () {
        running = true; lastTime = performance.now(); animate();
      }).catch(cameraError);
    } else {
      // fallback: raw getUserMedia + manual pump
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(function (stream) {
          video.srcObject = stream;
          return video.play();
        })
        .then(function () {
          running = true; lastTime = performance.now();
          (function pump() {
            if (!running) return;
            hands.send({ image: video }).then(function () { requestAnimationFrame(pump); });
          })();
          animate();
        })
        .catch(cameraError);
    }
  }

  function cameraError(err) {
    console.error(err);
    statusEl.textContent = 'Camera access denied or unavailable';
    statusEl.style.color = '#ff6b6b';
  }

  function stop() {
    running = false;
    if (camera && camera.stop) { try { camera.stop(); } catch (e) {} }
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(function (t) { t.stop(); });
      video.srcObject = null;
    }
    statusEl.textContent = 'Camera off';
    statusEl.style.color = 'var(--text-dim)';
    if (fpsEl) fpsEl.textContent = '';
    // reset visuals gently
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
