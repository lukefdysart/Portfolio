/* ===========================================================================
 * Calcifer — Logo Lab
 * Each concept is a single editable inline SVG returned from a function.
 * Keep strokes/paths named & commented so the artwork stays easy to refine.
 *
 * Palette is driven by CSS custom properties where possible; a few core
 * accents are passed in so a mark can be re-tinted without touching geometry.
 * =========================================================================== */

/* Shared tokens ----------------------------------------------------------- */
const INK = "#161a1d"; // near-black engineering ink
const PAPER = "#f7f4ef"; // warm off-white
const DEEP_RED = "#b4232a"; // Calcifer deep red
const CORAL = "#ff6a5b"; // warm coral accent
const STEEL = "#6b7a86"; // muted steel / mechanical grey

/* ===========================================================================
 * CONCEPT 1 — ANATOMICAL
 * A simplified anatomical heart (ventricle body + two great-vessel arcs),
 * with ONE subtle engineered element: a servo-horn pivot + hairline motion
 * arc where a vessel meets the chamber. Reads as "anatomy, but actuated."
 * Silhouette: organic, asymmetric, vessel stubs at top.
 * =========================================================================== */
function conceptAnatomical(id) {
  return `
  <svg viewBox="0 0 120 120" role="img" aria-label="Calcifer anatomical heart logo"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- soft interior shading for the chamber -->
      <linearGradient id="ana-fill-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0"   stop-color="${CORAL}"/>
        <stop offset="1"   stop-color="${DEEP_RED}"/>
      </linearGradient>
    </defs>

    <!-- Chamber body: a slightly lopsided ventricle, not a valentine heart -->
    <path d="M60 34
             C 52 22, 34 20, 28 34
             C 22 47, 30 62, 44 76
             C 52 84, 58 92, 60 100
             C 64 90, 74 80, 84 68
             C 96 53, 94 34, 80 29
             C 72 26, 64 29, 60 34 Z"
          fill="url(#ana-fill-${id})" stroke="${INK}" stroke-width="2.4"
          stroke-linejoin="round"/>

    <!-- Great-vessel stubs (aorta / pulmonary) — anatomical cue -->
    <path d="M58 34 C 55 24, 50 18, 46 14" fill="none" stroke="${INK}"
          stroke-width="2.4" stroke-linecap="round"/>
    <path d="M66 32 C 68 23, 73 18, 79 16" fill="none" stroke="${INK}"
          stroke-width="2.4" stroke-linecap="round"/>

    <!-- Hairline chamber contour (interior anatomy hint) -->
    <path d="M54 44 C 48 54, 52 66, 60 76" fill="none"
          stroke="${PAPER}" stroke-width="1.6" stroke-linecap="round"
          opacity="0.65"/>

    <!-- ENGINEERED ELEMENT: servo pivot + motion arc at the lower chamber.
         Subtle, single, intentional — the "driven" cue. -->
    <g stroke="${INK}" stroke-width="2.2" fill="${PAPER}">
      <circle cx="60" cy="72" r="6.5"/>
      <circle cx="60" cy="72" r="1.8" fill="${INK}" stroke="none"/>
    </g>
    <!-- servo horn -->
    <path d="M60 72 L 74 64" stroke="${INK}" stroke-width="2.6"
          stroke-linecap="round"/>
    <circle cx="74" cy="64" r="2.2" fill="${INK}"/>
    <!-- faint motion arc = actuation -->
    <path d="M78 60 A 20 20 0 0 1 80 80" fill="none" stroke="${STEEL}"
          stroke-width="1.8" stroke-linecap="round" stroke-dasharray="1.5 4"/>
  </svg>`;
}

/* ===========================================================================
 * CONCEPT 2 — HEARTBEAT
 * The heart IS the pulse: an ECG/heartbeat trace folds into a heart outline,
 * entering and exiting as a flat baseline. Communicates rhythm, movement,
 * and "synced to a real person's pulse."
 * Silhouette: a strong horizontal line with a heart peak in the middle.
 * =========================================================================== */
function conceptHeartbeat(id) {
  return `
  <svg viewBox="0 0 120 120" role="img" aria-label="Calcifer heartbeat logo"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="beat-${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0"    stop-color="${CORAL}"/>
        <stop offset="0.55" stop-color="${DEEP_RED}"/>
        <stop offset="1"    stop-color="${DEEP_RED}"/>
      </linearGradient>
    </defs>

    <!-- Baseline + ECG blip entering from the left -->
    <path d="M8 62
             L 30 62
             L 36 62
             L 40 50
             L 45 74
             L 49 62
             L 54 62"
          fill="none" stroke="${INK}" stroke-width="2.6"
          stroke-linecap="round" stroke-linejoin="round"/>

    <!-- The HEART formed by the trace: a continuous stroke that bumps up into
         two lobes then dives to the apex, then returns to baseline right. -->
    <path d="M54 62
             C 54 50, 62 46, 68 54
             C 74 46, 82 50, 82 62
             C 82 72, 72 80, 68 88
             C 64 80, 54 72, 54 62 Z"
          fill="url(#beat-${id})" stroke="${INK}" stroke-width="2.6"
          stroke-linejoin="round"/>

    <!-- Trace exits the heart back to a flat baseline on the right -->
    <path d="M82 62 L 90 62 L 96 62 L 112 62"
          fill="none" stroke="${INK}" stroke-width="2.6"
          stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Sync node: a small filled dot on the baseline = the live pulse source -->
    <circle cx="112" cy="62" r="3.2" fill="${DEEP_RED}" stroke="${INK}"
            stroke-width="1.4"/>
    <circle cx="8"   cy="62" r="3.2" fill="${PAPER}" stroke="${INK}"
            stroke-width="1.4"/>
  </svg>`;
}

/* ===========================================================================
 * CONCEPT 3 — CHARACTERFUL
 * "Calcifer" → cipher/key + a spark of life (Calcifer-ish warmth, kept
 * subtle & serious). A rounded heart "creature" with a keyhole heart-core:
 * the keyhole doubles as (a) a cipher/lock motif and (b) a tiny face,
 * giving personality without clip-art. Two small "ear" nubs = the great
 * vessels, repurposed as a character silhouette.
 * Silhouette: compact, rounded, friendly but geometric.
 * =========================================================================== */
function conceptCharacterful(id) {
  return `
  <svg viewBox="0 0 120 120" role="img" aria-label="Calcifer characterful logo"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="char-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${DEEP_RED}"/>
        <stop offset="1" stop-color="#8c1a20"/>
      </linearGradient>
    </defs>

    <!-- Rounded "body": a heart with squared shoulders = steadier, device-like -->
    <path d="M60 32
             C 54 22, 40 20, 33 29
             C 27 37, 29 50, 40 62
             C 48 71, 55 80, 60 92
             C 65 80, 72 71, 80 62
             C 91 50, 93 37, 87 29
             C 80 20, 66 22, 60 32 Z"
          fill="url(#char-${id})" stroke="${INK}" stroke-width="2.6"
          stroke-linejoin="round"/>

    <!-- Vessel "ear" nubs give it a character head-shape -->
    <circle cx="42" cy="24" r="4.5" fill="url(#char-${id})" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="78" cy="24" r="4.5" fill="url(#char-${id})" stroke="${INK}" stroke-width="2.4"/>

    <!-- KEYHOLE CORE = cipher motif + a hint of a face.
         Circle "eye" + slot = a keyhole; reads as lock/decode = "cipher". -->
    <g fill="${PAPER}">
      <circle cx="60" cy="52" r="8"/>
      <path d="M56 56 L 64 56 L 66 70 L 54 70 Z"/>
    </g>
    <!-- tiny pupil / spark of life: the warm coral glint -->
    <circle cx="60" cy="51" r="3" fill="${CORAL}"/>

    <!-- subtle friendly cue: two small highlight dashes (not eyes-literal) -->
    <path d="M48 42 q 3 -3 6 0" fill="none" stroke="${PAPER}" stroke-width="1.6"
          stroke-linecap="round" opacity="0.7"/>
    <path d="M66 42 q 3 -3 6 0" fill="none" stroke="${PAPER}" stroke-width="1.6"
          stroke-linecap="round" opacity="0.7"/>
  </svg>`;
}

/* Registry ---------------------------------------------------------------- */
const CALCIFER_CONCEPTS = [
  {
    key: "anatomical",
    title: "Anatomical",
    tagline: "Simplified heart + a single engineered pivot",
    render: conceptAnatomical,
    reasoning:
      "A deliberately lopsided ventricle (not a valentine) with great-vessel stubs reads as real anatomy. One restrained engineered element — a servo pivot, horn, and a hairline dashed motion arc — says 'this heart is driven,' without tipping into circuitry clip-art.",
  },
  {
    key: "heartbeat",
    title: "Heartbeat",
    tagline: "The pulse trace becomes the heart",
    render: conceptHeartbeat,
    reasoning:
      "A single ECG line enters as a flat baseline, spikes once, folds into the heart body, then exits flat again — ending on a filled 'sync node.' It literally draws the heart out of a live pulse, communicating rhythm and synchronization with a real person.",
  },
  {
    key: "characterful",
    title: "Characterful",
    tagline: "A keyhole 'cipher' core with a spark of life",
    render: conceptCharacterful,
    reasoning:
      "Squared heart shoulders + two vessel 'ear' nubs give a compact creature silhouette that still reads device-like and serious. The keyhole core nods to 'cipher' (decode/key) while doubling as a face with a warm coral glint — personality without becoming cartoonish.",
  },
];
