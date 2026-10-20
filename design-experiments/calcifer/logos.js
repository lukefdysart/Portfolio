/* ===========================================================================
 * CALCIFER — Logo Lab · v5  (ONE logo, final direction)
 *
 * The brief, distilled:
 *   • ONE mark, not a set.
 *   • A detailed, REALISTIC anatomical heart (like a pen sketch): full organ,
 *     great-vessel bundle fanning from the top, bulging ventricles, and a
 *     branching CORONARY VESSEL TREE tracing down the surface.
 *   • A FIREPLACE / HEARTH feel: the heart glows like embers in a dark hearth,
 *     warm light radiating from within.
 *   • Strong CONTRAST in the animation between a dim/dark background and the
 *     glowing flame-heart — the heart flares bright against the dark like a
 *     fire catching, then settles. (Not a flat scale pulse.)
 *   • The DYS maker's tag.
 *   • Calcifer himself, worked in as the glowing LIFE inside the heart — his
 *     two eyes as embers deep in the organ — only as far as it fits tastefully.
 *
 * Still nods to the portfolio house style: 128 viewBox, the rounded-square
 * badge (rx 30) + 0.05 sheen, and the corner DYS monogram — but the card is a
 * dark hearth here (that's the point: contrast), with Calcifer's warm palette.
 *
 * Animation hooks (driven by CSS @keyframes in index.html):
 *   .hearth-dark  — the dim card; dips darker between flares for contrast
 *   .ember-glow   — radial hearth glow behind the heart; flares bright on beat
 *   .heart-core   — the organ; a real two-part lub-dub contraction
 *   .heart-lit    — warm fill overlay whose opacity surges on the flare
 *   .cal-eyes     — Calcifer's ember eyes; brighten with the flare + blink
 *   .spark        — tiny rising hearth sparks
 * =========================================================================== */

/* ---------------------------------------------------------------------------
 * THE ANATOMICAL HEART (detailed, sketch-like).
 * Built from: the main ventricular mass, two atrial auricles, the great-vessel
 * bundle (aorta, pulmonary trunk + branch, SVC, a couple of arch vessels), and
 * a branching coronary tree. Rendered as line-art so it reads as a drawing;
 * a warm fill sits beneath so it can "light up" like an ember.
 * Coordinates tuned to the 104x104 card, apex pointing down-slightly-left.
 * ------------------------------------------------------------------------- */
function anatomicalHeart(id) {
  const line = "#2a0f0c";          // dark ink outline (reads on the warm fill)
  const SIL = `M62 48
               C 55 40, 43 39, 37 46
               C 30 54, 32 67, 41 79
               C 48 89, 56 98, 62 105
               C 63 106, 65 106, 66 104
               C 73 94, 84 83, 89 73
               C 95 62, 92 48, 83 47
               C 76 46, 68 49, 64 54 Z`;
  return `
    <g class="heart-core" style="transform-origin:63px 76px">

      <!-- warm base fill of the organ (the ember body) -->
      <path d="${SIL}" fill="url(#cf-body-${id})"/>
      <!-- lit overlay: surges brighter on the flare for the fire feeling -->
      <path class="heart-lit" d="${SIL}" fill="url(#cf-lit-${id})"/>

      <!-- organ outline -->
      <path d="${SIL}" fill="none" stroke="${line}" stroke-width="2.2"
            stroke-linejoin="round" stroke-linecap="round"/>

      <!-- atrial auricles (the two ear-like flaps at the base) -->
      <path d="M41 47 C 34 43, 28 46, 29 53 C 30 59, 36 60, 41 57"
            fill="url(#cf-body-${id})" stroke="${line}" stroke-width="2.1"
            stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M84 47 C 90 42, 97 45, 96 53 C 95 59, 89 61, 84 57"
            fill="url(#cf-body-${id})" stroke="${line}" stroke-width="2.1"
            stroke-linejoin="round" stroke-linecap="round"/>

      <!-- GREAT-VESSEL BUNDLE fanning from the top (the sketch's crown) -->
      <!-- aortic arch -->
      <path d="M64 48 C 64 33, 66 24, 72 21 C 79 18, 86 23, 85 31"
            fill="none" stroke="${line}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M85 31 C 85 25, 84 20, 82 17" fill="none" stroke="${line}" stroke-width="2.2" stroke-linecap="round"/>
      <!-- pulmonary trunk + branch -->
      <path d="M57 48 C 55 36, 53 28, 49 23" fill="none" stroke="${line}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M49 23 C 46 25, 44 28, 43 32" fill="none" stroke="${line}" stroke-width="2" stroke-linecap="round"/>
      <!-- superior vena cava + a brachiocephalic stub -->
      <path d="M76 46 C 78 35, 79 27, 79 21" fill="none" stroke="${line}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M70 46 C 71 36, 70 29, 68 24" fill="none" stroke="${line}" stroke-width="1.9" stroke-linecap="round" opacity="0.9"/>
      <!-- vessel lumen openings (little rings at the cut tops) -->
      <ellipse cx="82" cy="17.5" rx="2.4" ry="1.4" fill="none" stroke="${line}" stroke-width="1.3"/>
      <ellipse cx="49"  cy="22.5" rx="2.2" ry="1.3" fill="none" stroke="${line}" stroke-width="1.3"/>
      <ellipse cx="79"  cy="21"   rx="2"   ry="1.2" fill="none" stroke="${line}" stroke-width="1.2"/>

      <!-- CORONARY VESSEL TREE tracing down the surface (the sketch detail) -->
      <g stroke="${line}" fill="none" stroke-linecap="round" opacity="0.85">
        <!-- left anterior descending, down the interventricular groove -->
        <path d="M63 56 C 60 66, 61 82, 63 100" stroke-width="1.8"/>
        <path d="M63 70 C 58 74, 54 80, 52 88" stroke-width="1.3"/>
        <path d="M63 82 C 59 86, 56 92, 55 98" stroke-width="1.1"/>
        <!-- a right coronary sweeping around the right side -->
        <path d="M74 56 C 78 62, 79 72, 76 84" stroke-width="1.6"/>
        <path d="M76 70 C 72 74, 69 80, 68 88" stroke-width="1.2"/>
        <path d="M77 62 C 81 64, 84 67, 85 71" stroke-width="1.1"/>
        <!-- left circumflex-ish branch on the upper-left body -->
        <path d="M50 58 C 46 64, 46 72, 49 80" stroke-width="1.3"/>
      </g>
    </g>`;
}

/* Calcifer's ember eyes, deep inside the organ (only if tasteful). */
function calciferEyes() {
  return `
    <g class="cal-eyes" style="transform-origin:63px 70px">
      <g class="cal-blink" style="transform-origin:63px 70px">
        <ellipse cx="55" cy="70" rx="3.2" ry="3.6" fill="#fff3d6"/>
        <ellipse cx="71" cy="70" rx="3.2" ry="3.6" fill="#fff3d6"/>
        <circle cx="55.4" cy="70.6" r="1.3" fill="#2a0d0b"/>
        <circle cx="71.4" cy="70.6" r="1.3" fill="#2a0d0b"/>
      </g>
    </g>`;
}

function calciferDefs(id) {
  return `
    <defs>
      <!-- dark HEARTH card: near-black with a warm cast (contrast baseline) -->
      <linearGradient id="cf-bg-${id}" x1="20" y1="12" x2="108" y2="116" gradientUnits="userSpaceOnUse">
        <stop stop-color="#2a1410" /><stop offset="1" stop-color="#120807" />
      </linearGradient>
      <!-- the hearth ember glow behind the heart -->
      <radialGradient id="cf-glow-${id}" cx="50%" cy="58%" r="54%">
        <stop offset="0"   stop-color="#ffd27a" stop-opacity="0.95"/>
        <stop offset="0.45" stop-color="#ff7a2e" stop-opacity="0.55"/>
        <stop offset="1"   stop-color="#ff7a2e" stop-opacity="0"/>
      </radialGradient>
      <!-- the organ's ember body -->
      <linearGradient id="cf-body-${id}" x1="38" y1="44" x2="92" y2="106" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ff9b45" /><stop offset="0.5" stop-color="#e8502a" /><stop offset="1" stop-color="#9c2016" />
      </linearGradient>
      <!-- lit overlay (surges on the flare) -->
      <radialGradient id="cf-lit-${id}" cx="48%" cy="52%" r="55%">
        <stop offset="0" stop-color="#ffe08a" stop-opacity="0.95"/>
        <stop offset="0.6" stop-color="#ff8a3a" stop-opacity="0.25"/>
        <stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
}

/* ===========================================================================
 * THE CALCIFER MARK (single logo)
 * =========================================================================== */
function calciferMark(id) {
  const inner = `
    <!-- dark hearth card (dips darker between flares -> contrast) -->
    <rect class="hearth-dark" x="12" y="12" width="104" height="104" rx="30" fill="url(#cf-bg-${id})"/>
    <!-- faint hearth back-wall texture: a couple of soft brick seams -->
    <g stroke="#000000" stroke-opacity="0.18" stroke-width="1.4">
      <line x1="26" y1="40" x2="102" y2="40"/>
      <line x1="26" y1="88" x2="102" y2="88"/>
      <line x1="52" y1="18" x2="52" y2="40"/>
      <line x1="80" y1="40" x2="80" y2="64"/>
    </g>
    <!-- hearth floor / ember bed glow at the base -->
    <ellipse class="ember-floor" cx="64" cy="104" rx="34" ry="8" fill="url(#cf-glow-${id})" opacity="0.7"/>

    <!-- the big ember glow that flares with the beat (the fireplace light) -->
    <ellipse class="ember-glow" cx="63" cy="74" rx="46" ry="48" fill="url(#cf-glow-${id})"
             style="transform-origin:63px 74px"/>

    <!-- rising sparks -->
    <g fill="#ffcf7a">
      <circle class="spark s1" cx="50" cy="56" r="1.2"/>
      <circle class="spark s2" cx="78" cy="50" r="1"/>
      <circle class="spark s3" cx="64" cy="44" r="0.9"/>
    </g>

    <!-- the detailed anatomical heart, glowing like an ember -->
    ${anatomicalHeart(id)}
    <!-- Calcifer's eyes as the life deep inside -->
    ${calciferEyes()}

    <!-- the sheen + DYS, matching the house style -->
    <rect x="12" y="12" width="104" height="104" rx="30" fill="#ffffff" opacity="0.04"/>
    <text x="104" y="110" text-anchor="end" font-family="Inter, 'Segoe UI', sans-serif"
      font-size="11" font-weight="800" fill="#ffe3c4" opacity="0.8" letter-spacing="1">DYS</text>`;

  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — a glowing anatomical heart burning like an ember in a dark hearth"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id)}
    ${inner}
  </svg>`;
}

/* Registry — a single concept now. ---------------------------------------- */
const CALCIFER_CONCEPTS = [
  {
    key: "hearth",
    letter: "",
    title: "Calcifer — The Hearth-Heart",
    tagline: "A realistic anatomical heart glowing like an ember in a dark fireplace",
    render: calciferMark,
    reasoning:
      "One focused mark. A detailed, sketch-style anatomical heart — full great-vessel bundle fanning from the crown, bulging ventricles, and a branching coronary tree down the surface — set inside a dark hearth with soft brick seams and an ember bed. The organ itself burns like a coal: a warm body with a 'lit' overlay and a radial hearth glow that FLARE bright on each heartbeat while the dark card dips darker, giving the strong background-vs-flame contrast of a fire catching. Calcifer is present as two ember eyes glowing from deep inside the heart, with a slow blink, plus a few rising sparks. The corner DYS tag and the rounded-badge/sheen keep it tied to MIMIC / MARY / Stories.",
  },
];
