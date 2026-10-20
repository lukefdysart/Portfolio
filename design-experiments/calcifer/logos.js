/* ===========================================================================
 * CALCIFER — Logo Lab · v3  (match the portfolio house style)
 *
 * Direction: make Calcifer sit in the SAME SET as MIMIC / MARY / Stories.
 * Same construction formula, same visual weight — just an anatomically
 * accurate human heart as the subject, with Calcifer's own color slot.
 *
 * House formula (copied from the reference logos):
 *   • viewBox 0 0 128 128
 *   • rounded-square badge: <rect x=12 y=12 w=104 h=104 rx=30> on a diagonal
 *     gradient (x1=20 y1=12 -> x2=108 y2=116), + a white 0.05 sheen rect
 *   • light (white/pale) line-art foreground, round caps/joins
 *   • small "DYS" monogram, bottom-right, Inter 800, white ~0.65 opacity
 *   • subtle, tasteful animation (here: a gentle heartbeat)
 *
 * Calcifer's color slot: deep crimson -> warm coral (its own identity among
 * MIMIC blue, MARY indigo, Stories navy).
 *
 * Three variations on the SAME house-style idea (not wildly different icons —
 * the brief is "same spirit as the others"):
 *   A  Anatomical line-art heart        (pure white medical line drawing)
 *   B  Heart + fine servo linkage       (one quiet mechanical detail)
 *   C  Heart with an ECG tie-in         (nods to MARY's pulse language)
 * =========================================================================== */

/* The badge shell + sheen + DYS, shared exactly like the reference logos. */
function badge(idbg, inner, dysOpacity) {
  return `
      <rect x="12" y="12" width="104" height="104" rx="30" fill="url(#${idbg})" />
      <rect x="12" y="12" width="104" height="104" rx="30" fill="#ffffff" opacity="0.05" />
      ${inner}
      <text x="104" y="110" text-anchor="end" font-family="Inter, 'Segoe UI', sans-serif"
        font-size="11" font-weight="800" fill="#ffffff" opacity="${dysOpacity}" letter-spacing="1">DYS</text>`;
}

/* ---------------------------------------------------------------------------
 * ANATOMICAL HEART — a single, carefully drawn white line-art heart that reads
 * as a real human heart (not a Valentine): paired ventricles with the apex
 * down-left, atria up top, and the great vessels rising from the base —
 * aortic arch, pulmonary trunk, superior vena cava. Coordinates tuned to sit
 * nicely inside the 104x104 card. `stroke` + `sw` let each concept restyle it.
 * The whole organ lives in a <g class="heart-core"> so it can beat.
 * ------------------------------------------------------------------------- */
function anatomicalHeart(stroke, sw, glowStroke) {
  return `
    <g class="heart-core" style="transform-origin:64px 70px">
      <!-- soft inner glow copy (sits behind, slightly heavier, low opacity) -->
      <path d="M63 54
               C 58 46, 48 44, 42 49
               C 35 55, 36 66, 44 77
               C 51 86, 58 94, 63 101
               C 64 102, 65 102, 66 100
               C 73 90, 83 80, 88 70
               C 93 60, 90 49, 82 48
               C 75 47, 68 50, 65 56 Z"
            fill="none" stroke="${glowStroke}" stroke-width="${sw + 4}"
            stroke-linejoin="round" stroke-linecap="round" opacity="0.18"/>

      <!-- ventricular mass: apex points down toward lower-left (anatomical) -->
      <path d="M63 54
               C 58 46, 48 44, 42 49
               C 35 55, 36 66, 44 77
               C 51 86, 58 94, 63 101
               C 64 102, 65 102, 66 100
               C 73 90, 83 80, 88 70
               C 93 60, 90 49, 82 48
               C 75 47, 68 50, 65 56 Z"
            fill="none" stroke="${stroke}" stroke-width="${sw}"
            stroke-linejoin="round" stroke-linecap="round"/>

      <!-- interventricular sulcus (groove between the two ventricles) -->
      <path d="M64 58 C 60 70, 61 86, 64 99"
            fill="none" stroke="${stroke}" stroke-width="${sw - 0.8}"
            stroke-linecap="round" opacity="0.7"/>

      <!-- right atrium / auricle bulge (upper left of the base) -->
      <path d="M46 50 C 40 46, 34 48, 34 55 C 34 60, 39 62, 44 60"
            fill="none" stroke="${stroke}" stroke-width="${sw}"
            stroke-linecap="round" stroke-linejoin="round"/>
      <!-- left atrium / auricle bulge (upper right of the base) -->
      <path d="M82 50 C 88 46, 94 49, 93 56 C 92 61, 87 62, 83 59"
            fill="none" stroke="${stroke}" stroke-width="${sw}"
            stroke-linecap="round" stroke-linejoin="round"/>

      <!-- GREAT VESSELS rising from the base -->
      <!-- aortic arch (center, curving over to the right) -->
      <path d="M64 52 C 64 38, 66 30, 72 27 C 79 24, 85 28, 85 35"
            fill="none" stroke="${stroke}" stroke-width="${sw}"
            stroke-linecap="round"/>
      <!-- pulmonary trunk (just left of the aorta, splitting) -->
      <path d="M58 52 C 56 40, 54 33, 50 29"
            fill="none" stroke="${stroke}" stroke-width="${sw}"
            stroke-linecap="round"/>
      <path d="M50 29 C 47 31, 45 33, 44 36"
            fill="none" stroke="${stroke}" stroke-width="${sw - 0.8}"
            stroke-linecap="round" opacity="0.85"/>
      <!-- superior vena cava (to the right of the aorta, straighter) -->
      <path d="M76 50 C 78 40, 79 33, 79 28"
            fill="none" stroke="${stroke}" stroke-width="${sw - 0.6}"
            stroke-linecap="round" opacity="0.9"/>

      <!-- a couple of coronary vessels tracing the surface (anatomical detail) -->
      <path d="M52 60 C 56 68, 58 80, 56 90"
            fill="none" stroke="${stroke}" stroke-width="1.3"
            stroke-linecap="round" opacity="0.55"/>
      <path d="M78 62 C 76 70, 72 78, 70 86"
            fill="none" stroke="${stroke}" stroke-width="1.3"
            stroke-linecap="round" opacity="0.5"/>
    </g>`;
}

/* The three shared Calcifer gradients (its color slot). */
function calciferDefs(id) {
  return `
    <defs>
      <linearGradient id="cf-bg-${id}" x1="20" y1="12" x2="108" y2="116" gradientUnits="userSpaceOnUse">
        <stop stop-color="#e26d5a" /><stop offset="1" stop-color="#9e2a2b" />
      </linearGradient>
      <linearGradient id="cf-line-${id}" x1="40" y1="30" x2="90" y2="100" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffffff" /><stop offset="1" stop-color="#ffe3d8" />
      </linearGradient>
    </defs>`;
}

/* ===========================================================================
 * CONCEPT A — Anatomical line-art heart (the cleanest house-style match)
 * =========================================================================== */
function conceptAnatomy(id) {
  const inner = anatomicalHeart(`url(#cf-line-${id})`, 2.8, "#ffffff");
  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — anatomical human heart line drawing"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id)}
    ${badge(`cf-bg-${id}`, inner, 0.7)}
  </svg>`;
}

/* ===========================================================================
 * CONCEPT B — Anatomical heart + ONE quiet servo linkage (the project's story)
 * A fine white/pale linkage pin on the ventricle, driven from a small pivot —
 * same line-art weight so it reads as part of the drawing, not a gadget.
 * The linkage rocks with the beat.
 * =========================================================================== */
function conceptServo(id) {
  const inner = `
    ${anatomicalHeart(`url(#cf-line-${id})`, 2.8, "#ffffff")}
    <!-- quiet mechanical detail: a small servo pivot + linkage on the heart -->
    <g>
      <!-- pivot anchored to the card, lower-right of the heart -->
      <circle cx="92" cy="84" r="3.4" fill="none" stroke="url(#cf-line-${id})" stroke-width="2.4"/>
      <circle cx="92" cy="84" r="0.9" fill="#ffffff"/>
    </g>
    <g class="linkage-rock" style="transform-origin:92px 84px">
      <!-- rigid link from pivot to a point on the ventricle wall -->
      <line x1="92" y1="84" x2="74" y2="78"
            stroke="url(#cf-line-${id})" stroke-width="2.4" stroke-linecap="round"/>
      <!-- the attachment node on the heart -->
      <circle cx="74" cy="78" r="2.4" fill="#ffffff" opacity="0.95"/>
    </g>`;
  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — anatomical heart with a servo linkage"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id)}
    ${badge(`cf-bg-${id}`, inner, 0.7)}
  </svg>`;
}

/* ===========================================================================
 * CONCEPT C — Anatomical heart with an ECG trace tie-in (echoes MARY's pulse)
 * A thin baseline crosses behind the heart with one QRS spike, tying Calcifer
 * to the live-heart-rate idea and visually rhyming with MARY's pulse logo.
 * The spike "fires" on each beat.
 * =========================================================================== */
function conceptEcg(id) {
  const inner = `
    <!-- faint ECG baseline behind the heart -->
    <path class="ecg-line" d="M22 92 L48 92 L54 92 L58 78 L62 102 L66 92 L74 92 L106 92"
          fill="none" stroke="url(#cf-line-${id})" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
    ${anatomicalHeart(`url(#cf-line-${id})`, 2.8, "#ffffff")}`;
  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — anatomical heart over an ECG pulse line"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id)}
    ${badge(`cf-bg-${id}`, inner, 0.7)}
  </svg>`;
}

/* Registry ---------------------------------------------------------------- */
const CALCIFER_CONCEPTS = [
  {
    key: "anatomy",
    letter: "A",
    title: "Anatomical Heart",
    tagline: "Clean white line-art heart — the pure house-style match",
    render: conceptAnatomy,
    reasoning:
      "The straightest fit with the existing set: the same 128 badge, the same diagonal gradient card and 0.05 sheen, the same light line-art treatment and corner DYS monogram as MIMIC / MARY / Stories — just an anatomically accurate human heart (paired ventricles with the apex down-left, atrial auricles, and the aortic arch / pulmonary trunk / vena cava rising from the base). Calcifer takes its own crimson-to-coral color slot. The organ gives a subtle, real two-part heartbeat.",
  },
  {
    key: "servo",
    letter: "B",
    title: "Heart + Servo Linkage",
    tagline: "The same heart, with one quiet mechanical linkage",
    render: conceptServo,
    reasoning:
      "Identical house-style heart, plus a single fine servo pivot-and-linkage drawn in the same line weight so it reads as part of the illustration rather than a bolted-on gadget. It tells the actual Calcifer story (a servo-driven heart) without clutter. The linkage rocks in time with the contraction.",
  },
  {
    key: "ecg",
    letter: "C",
    title: "Heart + ECG Pulse",
    tagline: "Anatomical heart over a pulse line — rhymes with MARY",
    render: conceptEcg,
    reasoning:
      "The anatomical heart sits over a thin ECG baseline with a single QRS spike — a direct nod to the live-heart-rate concept and a deliberate visual rhyme with MARY's heartbeat logo, so the two biomedical projects feel related. The spike fires on each beat.",
  },
];
