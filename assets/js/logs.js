/* ============================================================
   Project Logs — "Stark-style" video log feed + in-browser recorder
   - Data-driven feed (edit the LOGS array below to add entries)
   - Each log plays a self-hosted file OR a YouTube/Vimeo embed
   - Built-in Log Studio records webcam video locally (MediaRecorder)
     and lets you download it; nothing is uploaded.
   All camera/mic access is local to the device.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1) LOG DATA  —  add your entries here.
        Each entry supports ONE video source:
          video:   "assets/video/log-01.webm"     (self-hosted file)
          youtube: "VIDEO_ID"                       (the id after v=)
          vimeo:   "VIDEO_ID"
        Omit all three to show a styled "coming soon" card.
        `project` must be one of: MIMIC | Stories | General
     ---------------------------------------------------------- */
  /* NOTE: the two MIMIC clips have browser-compat issues (mp4v codec /
     .MOV container) and are TEMPORARILY disabled for launch. Their paths are
     preserved below as `_video` / `_videoType` — to re-enable a clip once a
     web-friendly H.264 .mp4 exists, rename `_video` back to `video` (and
     `_videoType` to `videoType`). Entries without an active `video` render the
     understated "Footage coming soon" placeholder (no play button, no modal). */
  var LOGS = [
    {
      n: 1,
      title: 'From hand tracking to robotic motion',
      date: '',
      project: 'MIMIC',
      blurb: 'A build log for the MIMIC robotic hand — the computer-vision hand-tracking pipeline driving the servo-actuated hand.',
      _video: 'assets/img/Mimic_log1.MP4',
      _videoType: 'video/mp4',
      duration: ''
    },
    {
      n: 2,
      title: 'Teaching a robotic hand to grasp',
      date: '',
      project: 'MIMIC',
      blurb: 'Footage of the MIMIC robotic hand grasping / following along with hand movement.',
      _video: 'assets/img/Hand_Grasping_Movie.MOV',
      _videoType: 'video/quicktime',
      duration: ''
    },
    {
      n: 3,
      title: 'Stories Illuminated: first light',
      date: '',
      project: 'Stories',
      blurb: 'Early bench test of the projection-mapped animatronic storybook. Recording coming soon.',
      duration: ''
    }
  ];

  var PROJECT_LABEL = {
    MIMIC: 'Project MIMIC', Stories: 'Stories Illuminated', General: 'General'
  };

  // ----------------------------------------------------------
  //  2) RENDER THE FEED
  // ----------------------------------------------------------
  var feed = document.getElementById('logs-feed');
  var emptyMsg = document.getElementById('logs-empty');
  if (!feed) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function hasVideo(log) { return !!(log.video || log.youtube || log.vimeo); }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function buildCard(log) {
    var card = document.createElement('article');
    card.className = 'log-card';
    card.setAttribute('data-project', log.project || 'General');

    var media =
      '<div class="log-media' + (hasVideo(log) ? ' is-playable' : ' is-empty') + '"' +
        (hasVideo(log) ? ' role="button" tabindex="0" aria-label="Play log ' + log.n + '"' : '') + '>' +
        '<div class="log-media-bg"></div>' +
        (hasVideo(log)
          ? '<span class="log-play">▶</span>'
          : '<span class="log-soon">Footage coming soon</span>') +
        '<span class="log-num">LOG ' + pad(log.n) + '</span>' +
        (log.duration ? '<span class="log-dur">' + esc(log.duration) + '</span>' : '') +
      '</div>';

    var meta =
      '<div class="log-body">' +
        '<div class="log-tags">' +
          '<span class="tag">' + esc(PROJECT_LABEL[log.project] || 'General') + '</span>' +
          (log.date ? '<span class="log-date">' + esc(log.date) + '</span>' : '') +
        '</div>' +
        '<h3 class="log-title">' + esc(log.title) + '</h3>' +
        '<p class="log-blurb">' + esc(log.blurb) + '</p>' +
      '</div>';

    card.innerHTML = media + meta;

    if (hasVideo(log)) {
      var m = card.querySelector('.log-media');
      m.addEventListener('click', function () { openVideo(log); });
      m.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(log); }
      });
    }
    return card;
  }

  var currentFilter = 'all';
  function render() {
    feed.innerHTML = '';
    var shown = 0;
    LOGS.forEach(function (log) {
      if (currentFilter !== 'all' && log.project !== currentFilter) return;
      feed.appendChild(buildCard(log));
      shown++;
    });
    if (emptyMsg) emptyMsg.hidden = shown !== 0;
  }

  // Filters
  var filterBar = document.getElementById('logs-filter');
  if (filterBar) {
    filterBar.querySelectorAll('.logs-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterBar.querySelectorAll('.logs-chip').forEach(function (c) {
          c.classList.remove('is-active'); c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('is-active'); chip.setAttribute('aria-selected', 'true');
        currentFilter = chip.getAttribute('data-filter');
        render();
      });
    });
  }

  render();

  // ----------------------------------------------------------
  //  3) VIDEO LIGHTBOX (plays file or embed)
  // ----------------------------------------------------------
  var vlb = document.getElementById('vlightbox');
  var vlbInner = document.getElementById('vlightbox-inner');
  var vlbClose = vlb ? vlb.querySelector('.lightbox-close') : null;

  function openVideo(log) {
    if (!vlb) return;
    var html = '';
    if (log.youtube) {
      html = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(log.youtube) +
             '?autoplay=1" title="' + esc(log.title) + '" frameborder="0" ' +
             'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
             'allowfullscreen></iframe>';
    } else if (log.vimeo) {
      html = '<iframe src="https://player.vimeo.com/video/' + encodeURIComponent(log.vimeo) +
             '?autoplay=1" title="' + esc(log.title) + '" frameborder="0" ' +
             'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (log.video) {
      var typeAttr = log.videoType ? ' type="' + esc(log.videoType) + '"' : '';
      html = '<video controls autoplay playsinline preload="metadata"' +
             (log.poster ? ' poster="' + esc(log.poster) + '"' : '') + '>' +
             '<source src="' + esc(log.video) + '"' + typeAttr + '>' +
             'Your browser can\u2019t play this video format. ' +
             '<a href="' + esc(log.video) + '" download>Download the clip</a> instead.' +
             '</video>';
    }
    vlbInner.innerHTML = html;
    vlb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeVideo() {
    if (!vlb) return;
    vlbInner.innerHTML = '';   // stops playback
    vlb.hidden = true;
    document.body.style.overflow = '';
  }
  if (vlbClose) vlbClose.addEventListener('click', closeVideo);
  if (vlb) vlb.addEventListener('click', function (e) { if (e.target === vlb) closeVideo(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && vlb && !vlb.hidden) closeVideo();
  });

  // ----------------------------------------------------------
  //  4) LOG STUDIO — in-browser webcam recorder
  // ----------------------------------------------------------
  var launch = document.getElementById('recorder-launch');
  var panel = document.getElementById('recorder');
  if (!launch || !panel) return;

  var preview   = document.getElementById('rec-preview');
  var overlay   = document.getElementById('recorder-overlay');
  var enableBtn = document.getElementById('rec-enable');
  var startBtn  = document.getElementById('rec-start');
  var pauseBtn  = document.getElementById('rec-pause');
  var stopBtn   = document.getElementById('rec-stop');
  var micChk    = document.getElementById('rec-mic');
  var notes     = document.getElementById('rec-notes');
  var badge     = document.getElementById('rec-badge');
  var timerEl   = document.getElementById('rec-timer');
  var result    = document.getElementById('rec-result');
  var playback  = document.getElementById('rec-playback');
  var dl        = document.getElementById('rec-download');
  var discard   = document.getElementById('rec-discard');
  var sizeEl    = document.getElementById('rec-size');

  var stream = null, recorder = null, chunks = [], blobUrl = null;
  var tStart = 0, tElapsed = 0, timerId = null;

  launch.addEventListener('click', function () {
    panel.hidden = !panel.hidden;
    launch.setAttribute('aria-expanded', String(!panel.hidden));
    launch.innerHTML = panel.hidden ? '● Record a log' : '▲ Close studio';
  });

  // Restore teleprompter notes locally
  try {
    var saved = localStorage.getItem('logStudioNotes');
    if (saved && notes) notes.value = saved;
    if (notes) notes.addEventListener('input', function () {
      try { localStorage.setItem('logStudioNotes', notes.value); } catch (e) {}
    });
  } catch (e) {}

  function supported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  function enableCamera() {
    if (!supported()) {
      overlay.innerHTML = '<p>Recording isn\u2019t supported in this browser.</p>';
      return;
    }
    overlay.innerHTML = '<p>Starting camera\u2026</p>';
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: micChk ? micChk.checked : true
    }).then(function (s) {
      stream = s;
      preview.srcObject = s;
      preview.muted = true;              // avoid echo on preview
      return preview.play();
    }).then(function () {
      overlay.hidden = true;
      startBtn.disabled = false;
    }).catch(function (err) {
      console.error(err);
      overlay.hidden = false;
      overlay.innerHTML = '<p>Camera/mic blocked or unavailable.</p>' +
        '<button class="btn btn-small btn-ghost" id="rec-enable">Try again</button>';
      wireEnable();
    });
  }

  function wireEnable() {
    var b = document.getElementById('rec-enable');
    if (b) b.addEventListener('click', enableCamera);
  }
  wireEnable();

  function pickMime() {
    var types = ['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];
    for (var i = 0; i < types.length; i++) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(types[i])) return types[i];
    }
    return '';
  }

  function fmt(ms) {
    var s = Math.floor(ms / 1000);
    return pad(Math.floor(s / 60)) + ':' + pad(s % 60);
  }
  function tick() { timerEl.textContent = fmt(tElapsed + (Date.now() - tStart)); }

  function startRec() {
    if (!stream) return;
    chunks = [];
    var mime = pickMime();
    try {
      recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch (e) { console.error(e); return; }

    recorder.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = function () {
      var blob = new Blob(chunks, { type: (recorder.mimeType || 'video/webm') });
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      blobUrl = URL.createObjectURL(blob);
      playback.src = blobUrl;
      dl.href = blobUrl;
      dl.download = 'project-log-' + new Date().toISOString().slice(0,10) + '.webm';
      sizeEl.textContent = (blob.size / 1048576).toFixed(1) + ' MB';
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    recorder.start();
    tStart = Date.now(); tElapsed = 0;
    timerId = setInterval(tick, 250); tick();
    badge.hidden = false;
    startBtn.disabled = true; pauseBtn.disabled = false; stopBtn.disabled = false;
    pauseBtn.innerHTML = '\u275a\u275a Pause';
  }

  function pauseRec() {
    if (!recorder) return;
    if (recorder.state === 'recording') {
      recorder.pause();
      tElapsed += Date.now() - tStart;
      clearInterval(timerId);
      pauseBtn.innerHTML = '\u25b6 Resume';
      badge.classList.add('is-paused');
    } else if (recorder.state === 'paused') {
      recorder.resume();
      tStart = Date.now();
      timerId = setInterval(tick, 250);
      pauseBtn.innerHTML = '\u275a\u275a Pause';
      badge.classList.remove('is-paused');
    }
  }

  function stopRec() {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    clearInterval(timerId);
    badge.hidden = true; badge.classList.remove('is-paused');
    startBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true;
  }

  if (enableBtn) enableBtn.addEventListener('click', enableCamera);
  startBtn.addEventListener('click', startRec);
  pauseBtn.addEventListener('click', pauseRec);
  stopBtn.addEventListener('click', stopRec);
  if (discard) discard.addEventListener('click', function () {
    result.hidden = true;
    if (blobUrl) { URL.revokeObjectURL(blobUrl); blobUrl = null; }
    playback.removeAttribute('src'); playback.load();
  });

  // Toggle mic live if user flips it before recording
  if (micChk) micChk.addEventListener('change', function () {
    if (stream) {   // re-acquire so the audio track matches the choice
      stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null; overlay.hidden = false; startBtn.disabled = true;
      overlay.innerHTML = '<p>Mic setting changed</p>' +
        '<button class="btn btn-small btn-ghost" id="rec-enable">Restart camera</button>';
      wireEnable();
    }
  });

  // Clean up camera when the studio is closed
  launch.addEventListener('click', function () {
    if (panel.hidden && stream) {
      if (recorder && recorder.state !== 'inactive') stopRec();
      stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null; preview.srcObject = null;
      overlay.hidden = false; startBtn.disabled = true; pauseBtn.disabled = true; stopBtn.disabled = true;
      overlay.innerHTML = '<p>Camera is off</p>' +
        '<button class="btn btn-small btn-ghost" id="rec-enable">Enable camera</button>';
      wireEnable();
    }
  });
})();
