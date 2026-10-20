/* ===========================================================================
 * CALCIFER — Logo Lab · v2 (full creative reset)
 *
 * CALCIFER is a working physical model of a human heart, driven by servo
 * motors connected to the maker's real heart rate. The marks below pursue a
 * Studio-Ghibli-inspired "eccentric inventor's workshop" feeling — warm,
 * crafted, alive — while keeping ANATOMY as the foundation (NOT a Valentine
 * heart, NOT a flame character).
 *
 * Three genuinely distinct directions:
 *   A — The Clockwork Heart   (brass instrument, intricate linkages)
 *   B — The Living Heart      (soft organic ink, warmth & personality)
 *   C — The Inventor's Emblem (vintage illustrated insignia + DYS stamp)
 *
 * Craft notes:
 *   • Every mark is layered, editable SVG (no emoji / icon fonts / stock).
 *   • Anatomy = two ventricles with an interventricular groove + atria, plus
 *     simplified great vessels (aorta arch, pulmonary trunk, venae cavae).
 *   • Mechanics = believable brass servo parts: a servo body, horn, pushrod
 *     linkage and pivots that MOVE WITH the contraction (not decoration).
 *   • DYS appears as a small engraved brass maker's plate / stamp.
 *   • Animation hooks: classes consumed by styles.css (see .heart-core,
 *     .linkage-rock, .servo-horn, .breath). Two-part "lub-dub" + rest loop,
 *     gated by prefers-reduced-motion.
 *
 * Palette tokens (kept consistent across concepts) ------------------------- */
const PAL = {
  parchment:  "#f3e7d2", // warm background wash
  parchment2: "#e9d8bc",
  ink:        "#3a2c24", // soft dark brown outline
  inkSoft:    "#6a5444",
  terracotta: "#c75d44", // heart mid
  crimson:    "#a23a39", // heart deep
  coral:      "#e8886b", // heart highlight
  brass:      "#c69a4c", // mechanical
  brassDeep:  "#9a7332",
  brassHi:    "#edcf8e",
  sage:       "#8aa07f", // tiny contrast accent
  dustyBlue:  "#7d93a6",
};

/* --- shared helper: a reusable anatomical heart body path -----------------
 * Built once so all three concepts share a believable anatomy baseline while
 * styling it differently. Coordinate space is a 128 viewBox.
 * The silhouette: broad base of two ventricles, a dip for the interventricular
 * sulcus, left/right atrial bulges up top, tapering to the apex bottom-right.
 */
function heartBody(fill, stroke, sw) {
  return `
    <path class="heart-outline"
      d="M64 34
         C 58 24, 44 20, 35 27
         C 25 35, 25 50, 33 64
         C 39 75, 50 88, 62 102
         C 64 104, 66 104, 68 101
         C 78 86, 90 72, 96 59
         C 102 46, 100 31, 88 27
         C 79 24, 70 27, 66 35 Z"
      fill="${fill}" stroke="${stroke}" stroke-width="${sw}"
      stroke-linejoin="round"/>`;
}

/* ===========================================================================
 * CONCEPT A — THE CLOCKWORK HEART
 * A handcrafted brass scientific instrument. Polished brass servo bracket on
 * the right flank drives a pushrod linkage into the ventricle wall; a toothed
 * brass gear nests where the atrium meets the aorta. Anatomy stays legible;
 * brass is precise and jewel-like, not cluttered.
 * =========================================================================== */
function conceptClockwork(id) {
  return `
  <svg viewBox="0 0 128 128" role="img"
       aria-label="Calcifer — the Clockwork Heart: an anatomical heart with brass servo linkages"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cw-heart-${id}" x1="30" y1="24" x2="96" y2="104" gradientUnits="userSpaceOnUse">
        <stop offset="0"   stop-color="${PAL.coral}"/>
        <stop offset="0.55" stop-color="${PAL.terracotta}"/>
        <stop offset="1"   stop-color="${PAL.crimson}"/>
      </linearGradient>
      <linearGradient id="cw-brass-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${PAL.brassHi}"/>
        <stop offset="0.5" stop-color="${PAL.brass}"/>
        <stop offset="1" stop-color="${PAL.brassDeep}"/>
      </linearGradient>
      <radialGradient id="cw-sheen-${id}" cx="38%" cy="30%" r="60%">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- subtle cast shadow grounding the instrument -->
    <ellipse cx="64" cy="110" rx="34" ry="5" fill="${PAL.ink}" opacity="0.10"/>

    <!-- ====== HEART CORE (this group breathes) ====== -->
    <g class="heart-core" style="transform-origin:64px 66px">
      ${heartBody(`url(#cw-heart-${id})`, PAL.ink, 2.6)}

      <!-- interventricular sulcus (the groove between ventricles) -->
      <path d="M62 44 C 56 60, 58 80, 63 99" fill="none"
            stroke="${PAL.crimson}" stroke-width="2" stroke-linecap="round" opacity="0.55"/>
      <!-- left-ventricle inner shading -->
      <path d="M48 42 C 40 54, 44 72, 56 90" fill="none"
            stroke="${PAL.coral}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>

      <!-- great vessels: aorta arch + pulmonary trunk + a vena-cava stub -->
      <path d="M66 35 C 68 22, 82 18, 88 26 C 92 31, 90 38, 84 40" fill="none"
            stroke="${PAL.ink}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M58 34 C 54 23, 46 20, 42 24" fill="none"
            stroke="${PAL.ink}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M74 33 C 78 26, 83 25, 86 28" fill="none"
            stroke="${PAL.ink}" stroke-width="2.2" stroke-linecap="round" opacity="0.8"/>
      <!-- specular sheen -->
      ${heartBody(`url(#cw-sheen-${id})`, "none", 0)}
    </g>

    <!-- ====== BRASS MECHANISM ====== -->
    <!-- toothed gear nestled at the aortic root -->
    <g class="gear-spin" style="transform-origin:84px 34px">
      <g fill="url(#cw-brass-${id})" stroke="${PAL.brassDeep}" stroke-width="1">
        <circle cx="84" cy="34" r="8.5"/>
        <!-- gear teeth -->
        <g>
          <rect x="82.6" y="23" width="2.8" height="4" rx="0.6"/>
          <rect x="82.6" y="41" width="2.8" height="4" rx="0.6"/>
          <rect x="73" y="32.6" width="4" height="2.8" rx="0.6"/>
          <rect x="91" y="32.6" width="4" height="2.8" rx="0.6"/>
          <rect x="75.5" y="25.5" width="3.4" height="2.8" rx="0.6" transform="rotate(-45 77 27)"/>
          <rect x="89" y="39.5" width="3.4" height="2.8" rx="0.6" transform="rotate(-45 90.7 41)"/>
          <rect x="89" y="25.5" width="3.4" height="2.8" rx="0.6" transform="rotate(45 90.7 27)"/>
          <rect x="75.5" y="39.5" width="3.4" height="2.8" rx="0.6" transform="rotate(45 77 41)"/>
        </g>
      </g>
      <circle cx="84" cy="34" r="2.6" fill="${PAL.brassDeep}"/>
    </g>

    <!-- servo body bracket mounted on the right flank -->
    <g>
      <rect x="92" y="56" width="20" height="26" rx="3" fill="url(#cw-brass-${id})"
            stroke="${PAL.brassDeep}" stroke-width="1.4"/>
      <rect x="95" y="60" width="14" height="7" rx="1.4" fill="${PAL.parchment}" opacity="0.55"/>
      <circle cx="99" cy="76" r="1.3" fill="${PAL.brassDeep}"/>
      <circle cx="105" cy="76" r="1.3" fill="${PAL.brassDeep}"/>
      <!-- output shaft pivot -->
      <circle cx="92" cy="63" r="3" fill="${PAL.brassHi}" stroke="${PAL.brassDeep}" stroke-width="1.2"/>
    </g>

    <!-- servo horn + pushrod linkage into the ventricle wall (MOVES) -->
    <g class="linkage-rock" style="transform-origin:92px 63px">
      <!-- horn -->
      <path d="M92 63 L 80 58" stroke="url(#cw-brass-${id})" stroke-width="4"
            stroke-linecap="round"/>
      <circle cx="80" cy="58" r="2.6" fill="${PAL.brassHi}" stroke="${PAL.brassDeep}" stroke-width="1"/>
      <!-- pushrod to the heart wall -->
      <path d="M80 58 L 70 72" stroke="url(#cw-brass-${id})" stroke-width="3.2"
            stroke-linecap="round"/>
      <circle cx="70" cy="72" r="2.6" fill="${PAL.crimson}" stroke="${PAL.ink}" stroke-width="1.2"/>
    </g>

    <!-- engraved DYS maker's plate riveted to the base -->
    <g class="dys-plate">
      <rect x="46" y="104" width="36" height="13" rx="2.5"
            fill="url(#cw-brass-${id})" stroke="${PAL.brassDeep}" stroke-width="1.2"/>
      <circle cx="49.5" cy="110.5" r="1" fill="${PAL.brassDeep}"/>
      <circle cx="78.5" cy="110.5" r="1" fill="${PAL.brassDeep}"/>
      <text x="64" y="114" text-anchor="middle"
        font-family="'Space Grotesk','Georgia',serif" font-weight="700" font-size="9"
        letter-spacing="2.5" fill="${PAL.ink}">DYS</text>
    </g>
  </svg>`;
}

/* ===========================================================================
 * CONCEPT B — THE LIVING HEART
 * The warmest, most hand-drawn direction. Loose ink outline with a painterly
 * terracotta wash, visible brush character, and a single honest mechanical
 * reveal: a small brass servo + pushrod tucked behind the heart, as if the
 * organ were a living thing gently helped to beat. No cartoon face.
 * =========================================================================== */
function conceptLiving(id) {
  return `
  <svg viewBox="0 0 128 128" role="img"
       aria-label="Calcifer — the Living Heart: a soft hand-drawn anatomical heart with one brass servo reveal"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lv-wash-${id}" cx="42%" cy="38%" r="68%">
        <stop offset="0"   stop-color="${PAL.coral}"/>
        <stop offset="0.5" stop-color="${PAL.terracotta}"/>
        <stop offset="1"   stop-color="${PAL.crimson}"/>
      </radialGradient>
      <linearGradient id="lv-brass-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${PAL.brassHi}"/>
        <stop offset="1" stop-color="${PAL.brassDeep}"/>
      </linearGradient>
      <filter id="lv-paper-${id}" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"/>
        <feComposite operator="over" in2="SourceGraphic"/>
      </filter>
    </defs>

    <ellipse cx="64" cy="110" rx="30" ry="4.5" fill="${PAL.ink}" opacity="0.09"/>

    <!-- mechanical reveal sits BEHIND the heart (drawn first) -->
    <g class="servo-back">
      <!-- small servo tucked lower-right behind the apex -->
      <rect x="84" y="72" width="16" height="22" rx="3" fill="url(#lv-brass-${id})"
            stroke="${PAL.brassDeep}" stroke-width="1.3" opacity="0.96"/>
      <circle cx="84" cy="78" r="2.6" fill="${PAL.brassHi}" stroke="${PAL.brassDeep}" stroke-width="1"/>
      <!-- pushrod reaching into the ventricle (MOVES with the beat) -->
      <g class="linkage-rock" style="transform-origin:84px 78px">
        <path d="M84 78 L 70 68" stroke="url(#lv-brass-${id})" stroke-width="3.4"
              stroke-linecap="round"/>
        <circle cx="70" cy="68" r="2.4" fill="${PAL.brassHi}" stroke="${PAL.brassDeep}" stroke-width="1"/>
      </g>
    </g>

    <!-- ====== HEART CORE (breathes) ====== -->
    <g class="heart-core" style="transform-origin:62px 64px" filter="url(#lv-paper-${id})">
      <!-- painterly fill with a slightly looser, softer outline -->
      <path class="heart-outline"
        d="M62 32
           C 55 21, 40 19, 31 28
           C 22 37, 23 52, 32 66
           C 39 78, 50 90, 60 103
           C 62 105, 64 105, 66 102
           C 76 88, 88 74, 93 60
           C 98 47, 95 31, 83 28
           C 74 26, 66 30, 63 36 Z"
        fill="url(#lv-wash-${id})" stroke="${PAL.ink}" stroke-width="3"
        stroke-linejoin="round" stroke-linecap="round"/>

      <!-- hand-drawn interior gesture lines (chambers suggested, not clinical) -->
      <path d="M60 42 C 52 56, 55 76, 61 98" fill="none"
            stroke="${PAL.crimson}" stroke-width="2.4" stroke-linecap="round" opacity="0.5"/>
      <path d="M46 44 C 39 56, 43 72, 54 86" fill="none"
            stroke="${PAL.ink}" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>

      <!-- great vessels, soft and organic -->
      <path d="M63 34 C 65 21, 80 17, 86 26 C 90 32, 87 40, 80 41" fill="none"
            stroke="${PAL.ink}" stroke-width="3" stroke-linecap="round"/>
      <path d="M54 32 C 50 21, 42 19, 38 24" fill="none"
            stroke="${PAL.ink}" stroke-width="2.8" stroke-linecap="round"/>

      <!-- warm highlight (gives it life) -->
      <path d="M40 40 C 34 48, 36 60, 42 70" fill="none"
            stroke="${PAL.coral}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    </g>

    <!-- DYS as a small hand-stamped wax/ink seal, lower-left -->
    <g class="dys-plate">
      <circle cx="34" cy="96" r="10" fill="${PAL.brass}" stroke="${PAL.brassDeep}" stroke-width="1.4"/>
      <circle cx="34" cy="96" r="7.5" fill="none" stroke="${PAL.parchment}" stroke-width="1" opacity="0.6"/>
      <text x="34" y="99.5" text-anchor="middle"
        font-family="'Space Grotesk','Georgia',serif" font-weight="700" font-size="7.5"
        letter-spacing="1.5" fill="${PAL.ink}">DYS</text>
    </g>
  </svg>`;
}

/* ===========================================================================
 * CONCEPT C — THE INVENTOR'S EMBLEM
 * A composed vintage insignia: the anatomical heart centered within a thin
 * brass ring/banner, a small servo + gear detail at the base, a sprig of
 * sage for the "living" note, and DYS set into an engraved banner — like an
 * old scientific-society seal reimagined by a whimsical inventor.
 * =========================================================================== */
function conceptEmblem(id) {
  return `
  <svg viewBox="0 0 128 128" role="img"
       aria-label="Calcifer — the Inventor's Emblem: an anatomical heart in a vintage brass insignia with a DYS banner"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="em-heart-${id}" x1="40" y1="34" x2="88" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${PAL.coral}"/>
        <stop offset="0.6" stop-color="${PAL.terracotta}"/>
        <stop offset="1" stop-color="${PAL.crimson}"/>
      </linearGradient>
      <linearGradient id="em-brass-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${PAL.brassHi}"/>
        <stop offset="0.5" stop-color="${PAL.brass}"/>
        <stop offset="1" stop-color="${PAL.brassDeep}"/>
      </linearGradient>
    </defs>

    <!-- outer engraved brass ring (the insignia frame) -->
    <circle cx="64" cy="60" r="50" fill="none" stroke="url(#em-brass-${id})" stroke-width="3.5"/>
    <circle cx="64" cy="60" r="45" fill="none" stroke="${PAL.brassDeep}" stroke-width="1" opacity="0.5"/>
    <!-- tick engraving around the ring (instrument dial feel) -->
    <g stroke="${PAL.brassDeep}" stroke-width="1.1" opacity="0.65">
      <line x1="64" y1="12" x2="64" y2="16"/>
      <line x1="64" y1="104" x2="64" y2="108"/>
      <line x1="16" y1="60" x2="20" y2="60"/>
      <line x1="108" y1="60" x2="112" y2="60"/>
      <line x1="30" y1="26" x2="33" y2="29"/>
      <line x1="95" y1="26" x2="98" y2="29"/>
      <line x1="30" y1="94" x2="33" y2="91"/>
      <line x1="95" y1="94" x2="98" y2="91"/>
    </g>

    <!-- small sage sprig (the living note) nestled upper-left in the ring -->
    <g class="sprig" stroke="${PAL.sage}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.9">
      <path d="M30 44 q 6 -5 12 -3"/>
      <path d="M34 42 q 1 -4 4 -5"/>
      <path d="M38 42 q 1 -4 4 -4.5"/>
    </g>

    <!-- ====== HEART CORE (breathes), centered & slightly smaller for the frame ====== -->
    <g class="heart-core" style="transform-origin:64px 58px">
      <g transform="translate(64 58) scale(0.72) translate(-64 -62)">
        ${heartBody(`url(#em-heart-${id})`, PAL.ink, 3)}
        <path d="M62 44 C 56 60, 58 80, 63 99" fill="none"
              stroke="${PAL.crimson}" stroke-width="2.4" stroke-linecap="round" opacity="0.5"/>
        <path d="M66 35 C 68 22, 82 18, 88 26 C 92 31, 90 38, 84 40" fill="none"
              stroke="${PAL.ink}" stroke-width="3" stroke-linecap="round"/>
        <path d="M58 34 C 54 23, 46 20, 42 24" fill="none"
              stroke="${PAL.ink}" stroke-width="3" stroke-linecap="round"/>
      </g>
    </g>

    <!-- small servo + gear detail at the base of the frame -->
    <g class="gear-spin" style="transform-origin:50px 92px">
      <circle cx="50" cy="92" r="5.5" fill="url(#em-brass-${id})" stroke="${PAL.brassDeep}" stroke-width="1"/>
      <g fill="${PAL.brassDeep}">
        <rect x="48.8" y="85" width="2.4" height="3" rx="0.5"/>
        <rect x="48.8" y="96" width="2.4" height="3" rx="0.5"/>
        <rect x="43" y="90.8" width="3" height="2.4" rx="0.5"/>
        <rect x="55" y="90.8" width="3" height="2.4" rx="0.5"/>
      </g>
      <circle cx="50" cy="92" r="1.8" fill="${PAL.parchment}"/>
    </g>
    <g class="linkage-rock" style="transform-origin:50px 92px">
      <path d="M50 92 L 60 86" stroke="url(#em-brass-${id})" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="60" cy="86" r="2" fill="${PAL.brassHi}" stroke="${PAL.brassDeep}" stroke-width="0.9"/>
    </g>

    <!-- DYS engraved banner across the bottom of the insignia -->
    <g class="dys-plate">
      <path d="M34 104 L 94 104 L 90 116 L 38 116 Z"
            fill="url(#em-brass-${id})" stroke="${PAL.brassDeep}" stroke-width="1.3"/>
      <path d="M34 104 L 28 108 L 38 116 Z" fill="${PAL.brassDeep}"/>
      <path d="M94 104 L 100 108 L 90 116 Z" fill="${PAL.brassDeep}"/>
      <text x="64" y="113.5" text-anchor="middle"
        font-family="'Space Grotesk','Georgia',serif" font-weight="700" font-size="9.5"
        letter-spacing="4" fill="${PAL.ink}">DYS</text>
    </g>
  </svg>`;
}

/* Registry ---------------------------------------------------------------- */
const CALCIFER_CONCEPTS = [
  {
    key: "clockwork",
    letter: "A",
    title: "The Clockwork Heart",
    tagline: "A handcrafted brass instrument that happens to be alive",
    render: conceptClockwork,
    reasoning:
      "The anatomical heart is treated as a jewel-like scientific instrument: a brass servo bracket on the right flank drives a pushrod into the ventricle wall, and a toothed gear nests at the aortic root. The brass is precise and restrained so the two-ventricle anatomy and great vessels stay legible even at icon size. On the beat, the servo horn and pushrod rock inward with the contraction — the mechanism visibly does the work.",
  },
  {
    key: "living",
    letter: "B",
    title: "The Living Heart",
    tagline: "Hand-drawn warmth with one honest mechanical reveal",
    render: conceptLiving,
    reasoning:
      "The warmest, most painterly direction: a loose ink outline over a terracotta wash with a faint paper grain, and gestural interior lines that suggest chambers without turning clinical. A single brass servo + pushrod is tucked behind the organ — the 'reveal' of how a living thing is gently helped to beat. No face, but plenty of character. The whole body breathes with a soft two-part rhythm.",
  },
  {
    key: "emblem",
    letter: "C",
    title: "The Inventor's Emblem",
    tagline: "A vintage scientific insignia with a DYS banner",
    render: conceptEmblem,
    reasoning:
      "A composed, badge-like insignia: the anatomical heart centered in an engraved brass dial-ring, a sage sprig for the living note, a small servo + gear at the base, and DYS set into an engraved banner — an old scientific-society seal reimagined by a whimsical inventor. It reads as a crafted artifact/emblem rather than an app icon, and the heart inside the ring still gives a subtle beat.",
  },
];
