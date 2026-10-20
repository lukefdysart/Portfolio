/* ===========================================================================
 * CALCIFER — Logo Lab · v4  (anatomical heart × Calcifer-the-fire-demon,
 *                            in the portfolio house style)
 *
 * The project is named after Calcifer, the little fire demon in Howl's Moving
 * Castle: warm glow, two wide expressive eyes, a small open mouth, lots of
 * personality. The brief now: give THAT character to an ANATOMICALLY ACCURATE
 * human heart (the real project subject) — a living heart-creature — while
 * keeping the portfolio house style so it sits beside MIMIC / MARY / Stories.
 *
 * House formula (copied from the reference logos):
 *   • viewBox 0 0 128 128
 *   • rounded-square badge: <rect x=12 y=12 w=104 h=104 rx=30> on a diagonal
 *     gradient (x1=20 y1=12 -> x2=108 y2=116) + a white 0.05 sheen rect
 *   • light/warm line-art foreground, round caps/joins
 *   • small "DYS" monogram, bottom-right, Inter 800
 *   • subtle, tasteful animation
 *
 * Calcifer-the-demon cues (kept tasteful, not cartoonish):
 *   • two round eyes with dark pupils (his signature look)
 *   • a small open mouth
 *   • a warm ember glow behind the heart (the "fire" feeling WITHOUT a flame)
 * Anatomy stays the foundation: paired ventricles, apex down, atrial auricles,
 * aortic arch / pulmonary trunk / vena cava.
 *
 * Three takes on the SAME idea:
 *   A  The Heart-Spirit     — warm filled heart + glow + Calcifer face (hero)
 *   B  Clean Line Character — white line-art version, face as fine lines
 *   C  Heart-Spirit + ECG   — the character over a pulse line (rhymes w/ MARY)
 * =========================================================================== */

/* badge shell + sheen + DYS, exactly like the reference logos */
function badge(idbg, inner, dysOpacity) {
  return `
      <rect x="12" y="12" width="104" height="104" rx="30" fill="url(#${idbg})" />
      <rect x="12" y="12" width="104" height="104" rx="30" fill="#ffffff" opacity="0.05" />
      ${inner}
      <text x="104" y="110" text-anchor="end" font-family="Inter, 'Segoe UI', sans-serif"
        font-size="11" font-weight="800" fill="#ffffff" opacity="${dysOpacity}" letter-spacing="1">DYS</text>`;
}

/* ---------------------------------------------------------------------------
 * ANATOMICAL HEART BODY — the organ silhouette + vessels, as a reusable group.
 * `mode`:
 *   'fill'  -> painted warm body with darker outline (hero look)
 *   'line'  -> white line-art only (house-style match)
 * The whole organ lives in <g class="heart-core"> so it can beat.
 * ------------------------------------------------------------------------- */
function heartBody(id, mode) {
  const bodyFill  = mode === "fill" ? `url(#cf-body-${id})` : "none";
  const line      = mode === "fill" ? "#5e1512" : `url(#cf-line-${id})`;
  const sw        = mode === "fill" ? 2.4 : 2.8;
  const vesselOp  = mode === "fill" ? 0.9 : 0.95;

  // Shared anatomical silhouette: broad base up top, two ventricles,
  // apex pointing down slightly left (real-heart orientation).
  const SIL = `M64 50
               C 57 42, 46 41, 40 47
               C 33 54, 34 66, 42 78
               C 49 88, 57 97, 63 104
               C 64 105, 65 105, 66 103
               C 73 93, 83 82, 88 72
               C 94 61, 91 48, 83 47
               C 76 46, 69 49, 66 54 Z`;

  return `
    <g class="heart-core" style="transform-origin:64px 74px">
      <!-- body -->
      <path d="${SIL}" fill="${bodyFill}" stroke="${line}" stroke-width="${sw}"
            stroke-linejoin="round" stroke-linecap="round"/>

      <!-- interventricular groove -->
      <path d="M64 56 C 60 68, 61 86, 64 102"
            fill="none" stroke="${line}" stroke-width="${sw - 0.8}"
            stroke-linecap="round" opacity="0.6"/>

      <!-- atrial auricles (left/right ear-like bulges at the base) -->
      <path d="M44 48 C 38 44, 32 46, 32 53 C 32 58, 37 60, 42 58"
            fill="${bodyFill}" stroke="${line}" stroke-width="${sw}"
            stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M84 48 C 90 44, 96 47, 95 54 C 94 59, 89 60, 85 57"
            fill="${bodyFill}" stroke="${line}" stroke-width="${sw}"
            stroke-linecap="round" stroke-linejoin="round"/>

      <!-- GREAT VESSELS rising from the base -->
      <path d="M64 50 C 64 36, 66 28, 72 25 C 79 22, 85 26, 85 33"
            fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round" opacity="${vesselOp}"/>
      <path d="M57 50 C 55 38, 53 31, 49 27 C 46 29, 44 31, 43 34"
            fill="none" stroke="${line}" stroke-width="${sw}" stroke-linecap="round" opacity="${vesselOp}"/>
      <path d="M76 48 C 78 38, 79 31, 79 26"
            fill="none" stroke="${line}" stroke-width="${sw - 0.6}" stroke-linecap="round" opacity="${vesselOp - 0.1}"/>

      <!-- faint coronary vessels (surface detail) -->
      <path d="M52 58 C 56 66, 58 80, 56 92" fill="none" stroke="${line}" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>
      <path d="M78 60 C 76 68, 72 78, 70 88" fill="none" stroke="${line}" stroke-width="1.2" stroke-linecap="round" opacity="0.38"/>
    </g>`;
}

/* ---------------------------------------------------------------------------
 * CALCIFER FACE — his signature two round eyes + small open mouth, placed on
 * the upper ventricular mass. `mode` 'fill' => solid pale eyes w/ dark pupils;
 * 'line' => drawn with fine strokes so it stays in the line-art language.
 * Eyes live in <g class="blink"> so they can blink.
 * ------------------------------------------------------------------------- */
function calciferFace(id, mode) {
  if (mode === "line") {
    const c = `url(#cf-line-${id})`;
    return `
      <g class="face">
        <g class="blink" style="transform-origin:64px 68px">
          <circle cx="55" cy="68" r="5.2" fill="none" stroke="${c}" stroke-width="2.2"/>
          <circle cx="73" cy="68" r="5.2" fill="none" stroke="${c}" stroke-width="2.2"/>
          <circle cx="55.6" cy="68.6" r="1.9" fill="${c}"/>
          <circle cx="73.6" cy="68.6" r="1.9" fill="${c}"/>
        </g>
        <!-- small open mouth (Calcifer's wobbly grin) -->
        <path d="M57 80 Q 64 88 71 80 Q 64 83 57 80 Z"
              fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
      </g>`;
  }
  // fill mode: pale glowing eyes + dark pupils, soft mouth
  return `
      <g class="face">
        <g class="blink" style="transform-origin:64px 68px">
          <ellipse cx="55" cy="68" rx="5.6" ry="6" fill="#fff3e2" stroke="#5e1512" stroke-width="1.6"/>
          <ellipse cx="73" cy="68" rx="5.6" ry="6" fill="#fff3e2" stroke="#5e1512" stroke-width="1.6"/>
          <circle cx="55.8" cy="68.8" r="2.3" fill="#2a0d0b"/>
          <circle cx="73.8" cy="68.8" r="2.3" fill="#2a0d0b"/>
          <circle cx="54.6" cy="67.4" r="0.8" fill="#ffffff"/>
          <circle cx="72.6" cy="67.4" r="0.8" fill="#ffffff"/>
        </g>
        <!-- open mouth with a warm interior -->
        <path d="M56 80 Q 64 90 72 80 Q 64 84 56 80 Z"
              fill="#7d1c17" stroke="#4a0f0d" stroke-width="1.4" stroke-linejoin="round"/>
      </g>`;
}

/* Calcifer gradients (its color slot: ember crimson -> warm coral). */
function calciferDefs(id, withGlow) {
  return `
    <defs>
      <linearGradient id="cf-bg-${id}" x1="20" y1="12" x2="108" y2="116" gradientUnits="userSpaceOnUse">
        <stop stop-color="#e2663f" /><stop offset="1" stop-color="#8f2220" />
      </linearGradient>
      <linearGradient id="cf-body-${id}" x1="40" y1="46" x2="90" y2="104" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffb15c" /><stop offset="0.5" stop-color="#f0603f" /><stop offset="1" stop-color="#b22e26" />
      </linearGradient>
      <linearGradient id="cf-line-${id}" x1="40" y1="28" x2="90" y2="104" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffffff" /><stop offset="1" stop-color="#ffe3d8" />
      </linearGradient>
      ${withGlow ? `
      <radialGradient id="cf-glow-${id}" cx="50%" cy="56%" r="52%">
        <stop offset="0" stop-color="#ffd27a" stop-opacity="0.9"/>
        <stop offset="0.5" stop-color="#ff9a4d" stop-opacity="0.4"/>
        <stop offset="1" stop-color="#ff9a4d" stop-opacity="0"/>
      </radialGradient>` : ``}
    </defs>`;
}

/* ===========================================================================
 * CONCEPT A — THE HEART-SPIRIT (hero)
 * A warm painted anatomical heart with an ember glow behind it and Calcifer's
 * face — a living heart-creature. Reads as biomedical + alive + Ghibli-warm.
 * =========================================================================== */
function conceptSpirit(id) {
  const inner = `
    <!-- ember glow (the "fire" feeling, no flame) -->
    <ellipse class="ember" cx="64" cy="72" rx="40" ry="42" fill="url(#cf-glow-${id})" style="transform-origin:64px 72px"/>
    ${heartBody(id, "fill")}
    ${calciferFace(id, "fill")}`;
  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — an anatomical human heart as a living fire-spirit character"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id, true)}
    ${badge(`cf-bg-${id}`, inner, 0.75)}
  </svg>`;
}

/* ===========================================================================
 * CONCEPT B — CLEAN LINE CHARACTER
 * The exact house-style white line-art heart, with the Calcifer face rendered
 * in the same fine line weight. The most restrained, best at tiny sizes.
 * =========================================================================== */
function conceptLine(id) {
  const inner = `
    ${heartBody(id, "line")}
    ${calciferFace(id, "line")}`;
  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — line-art anatomical heart with a Calcifer face"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id, false)}
    ${badge(`cf-bg-${id}`, inner, 0.7)}
  </svg>`;
}

/* ===========================================================================
 * CONCEPT C — HEART-SPIRIT + ECG (ties to MARY + the live-heart-rate idea)
 * The warm heart-creature over a thin ECG baseline with one QRS spike.
 * =========================================================================== */
function conceptSpiritEcg(id) {
  const inner = `
    <ellipse class="ember" cx="64" cy="70" rx="38" ry="40" fill="url(#cf-glow-${id})" style="transform-origin:64px 70px"/>
    <path class="ecg-line" d="M22 94 L48 94 L54 94 L58 80 L62 104 L66 94 L74 94 L106 94"
          fill="none" stroke="#ffe3d8" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
    ${heartBody(id, "fill")}
    ${calciferFace(id, "fill")}`;
  return `
  <svg viewBox="0 0 128 128" fill="none" role="img"
       aria-label="Calcifer logo — heart-spirit character over an ECG pulse line"
       xmlns="http://www.w3.org/2000/svg">
    ${calciferDefs(id, true)}
    ${badge(`cf-bg-${id}`, inner, 0.75)}
  </svg>`;
}

/* Registry ---------------------------------------------------------------- */
const CALCIFER_CONCEPTS = [
  {
    key: "spirit",
    letter: "A",
    title: "The Heart-Spirit",
    tagline: "An anatomical heart that's alive — Calcifer as a heart-creature",
    render: conceptSpirit,
    reasoning:
      "The direct fusion you asked for: a warm, painted anatomical human heart (paired ventricles, apex down, atrial auricles, aortic arch / pulmonary trunk / vena cava) given Calcifer's signature life — two wide pale eyes with dark pupils and a small open mouth — over a soft ember glow that reads as his warmth WITHOUT turning into a flame. It stays in the house style (128 badge, diagonal gradient card, 0.05 sheen, corner DYS) with Calcifer's own crimson-to-coral slot. The heart beats and the eyes blink.",
  },
  {
    key: "line",
    letter: "B",
    title: "Clean Line Character",
    tagline: "The house line-art heart, with Calcifer's face in fine lines",
    render: conceptLine,
    reasoning:
      "The most restrained take and the tightest match to MIMIC / MARY / Stories: the same white line-art treatment and weights, with the anatomical heart and Calcifer's eyes + mouth all drawn as fine lines. Keeps the character personality while reading cleanly at 32 px. Best if you want Calcifer to sit most quietly among the other marks.",
  },
  {
    key: "spiritEcg",
    letter: "C",
    title: "Heart-Spirit + ECG",
    tagline: "The living heart-creature over a pulse line — rhymes with MARY",
    render: conceptSpiritEcg,
    reasoning:
      "The warm heart-spirit sitting over a thin ECG baseline with a single QRS spike — a nod to the live-heart-rate concept and a deliberate visual rhyme with MARY's pulse logo, so the two biomedical projects feel like siblings. The spike fires on each beat alongside the blink.",
  },
];
