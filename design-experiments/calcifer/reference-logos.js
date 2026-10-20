/* ===========================================================================
 * Reference logos — EXACT markup copied from the live portfolio index.html
 * (MIMIC, MARY, Stories Illuminated), reproduced here READ-ONLY so the Calcifer
 * concepts can be compared against them for dimensions, styling & visual weight.
 *
 * These are COPIES for side-by-side comparison only. The originals in
 * ../../index.html are NOT modified. Animation classes/driver classes are kept
 * as data attributes but the live CSS/JS that animates them is not loaded here,
 * so they render in their resting state.
 *
 * Shared spec observed across all three portfolio logos:
 *   • viewBox 0 0 128 128
 *   • rounded-square badge: <rect x=12 y=12 w=104 h=104 rx=30> + gradient bg
 *   • light foreground artwork on a saturated gradient card
 *   • a small "DYS" monogram in the lower-right corner
 * =========================================================================== */

const REFERENCE_LOGOS = [
  {
    key: "mimic",
    title: "Project MIMIC",
    accent: "#1f82c7",
    svg: `
    <svg viewBox="0 0 128 128" fill="none" role="img" aria-label="Project MIMIC logo (reference copy)">
      <defs>
        <linearGradient id="ref-miBg" x1="20" y1="12" x2="108" y2="116" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3ec6f0" /><stop offset="1" stop-color="#1f82c7" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="104" height="104" rx="30" fill="url(#ref-miBg)" />
      <rect x="12" y="12" width="104" height="104" rx="30" fill="#ffffff" opacity="0.05" />
      <line x1="26" y1="64" x2="102" y2="64" stroke="#ffffff" stroke-opacity=".45" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="64" y="54" text-anchor="middle"
        font-family="'Space Grotesk','Segoe UI',sans-serif" font-weight="700" font-size="22"
        letter-spacing="1" fill="#ffffff">MIMIC</text>
      <text x="64" y="54" text-anchor="middle"
        font-family="'Space Grotesk','Segoe UI',sans-serif" font-weight="700" font-size="22"
        letter-spacing="1" fill="#ffffff" opacity=".55"
        transform="translate(0,128) scale(1,-1)">MIMIC</text>
      <text x="104" y="110" text-anchor="end" font-family="Inter, 'Segoe UI', sans-serif"
        font-size="11" font-weight="800" fill="#ffffff" opacity="0.75" letter-spacing="1">DYS</text>
    </svg>`,
  },
  {
    key: "mary",
    title: "MARY",
    accent: "#5B6CFF",
    svg: `
    <svg viewBox="0 0 128 128" fill="none" role="img" aria-label="Mary logo (reference copy)">
      <defs>
        <linearGradient id="ref-mlBg" x1="20" y1="12" x2="108" y2="116" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8273FF" /><stop offset="1" stop-color="#5B6CFF" />
        </linearGradient>
        <linearGradient id="ref-mlPulse" x1="24" y1="64" x2="104" y2="64" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffffff" /><stop offset="1" stop-color="#E4E8FF" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="104" height="104" rx="30" fill="url(#ref-mlBg)" />
      <rect x="12" y="12" width="104" height="104" rx="30" fill="#ffffff" opacity="0.05" />
      <path d="M24 72 L40 72 L50 44 L64 92 L78 44 L88 72 L104 72"
        stroke="#ffffff" stroke-opacity="0.18" stroke-width="8"
        stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M24 72 L40 72 L50 44 L64 92 L78 44 L88 72 L104 72"
        stroke="url(#ref-mlPulse)" stroke-width="8"
        stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <text x="104" y="108" text-anchor="end" font-family="Inter, 'Segoe UI', sans-serif"
        font-size="12" font-weight="800" fill="#ffffff" opacity="0.7" letter-spacing="1">DYS</text>
    </svg>`,
  },
  {
    key: "stories",
    title: "Stories Illuminated",
    accent: "#141a28",
    svg: `
    <svg viewBox="0 0 128 128" fill="none" role="img" aria-label="Stories Illuminated logo (reference copy)">
      <defs>
        <linearGradient id="ref-stBg" x1="20" y1="12" x2="108" y2="116" gradientUnits="userSpaceOnUse">
          <stop stop-color="#20283c" /><stop offset="1" stop-color="#141a28" />
        </linearGradient>
        <linearGradient id="ref-stLight" x1="64" y1="86" x2="64" y2="20" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffe6a8" stop-opacity=".55" /><stop offset="1" stop-color="#ffe6a8" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="ref-stPool" cx="50%" cy="100%" r="70%">
          <stop stop-color="#ffe6a8" stop-opacity=".9" /><stop offset="1" stop-color="#ffe6a8" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect x="12" y="12" width="104" height="104" rx="30" fill="url(#ref-stBg)" />
      <path d="M50 86 L40 24 L88 24 L78 86 Z" fill="url(#ref-stLight)" />
      <ellipse cx="64" cy="86" rx="26" ry="7" fill="url(#ref-stPool)" />
      <g stroke="#ffe6a8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M50 50 q8 -8 14 -1 q6 -7 14 1" />
      </g>
      <circle cx="60" cy="62" r="1.4" fill="#ffe6a8"/>
      <circle cx="70" cy="58" r="1.1" fill="#ffe6a8"/>
      <g stroke="#eef1f8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M64 90 C54 82 42 82 34 85 L34 72 C42 69 54 69 64 77 Z" />
        <path d="M64 90 C74 82 86 82 94 85 L94 72 C86 69 74 69 64 77 Z" />
        <path d="M64 77 V90" stroke-opacity=".6" />
      </g>
      <text x="104" y="110" text-anchor="end" font-family="Inter, 'Segoe UI', sans-serif"
        font-size="11" font-weight="800" fill="#ffffff" opacity="0.6" letter-spacing="1">DYS</text>
    </svg>`,
  },
];
