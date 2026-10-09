# Luke Dysart — Portfolio

A hand-built personal portfolio for **Luke Dysart** — Electrical & Computer and
Biomedical Engineering student at Vanderbilt University, working at the
intersection of art and engineering.

Plain **HTML + CSS + JavaScript** — no build step, no framework lock-in. Just
open `index.html` or deploy the folder as-is.

## Sections

- **About** — bio and focus areas
- **Engineering** — featured projects:
  - **Mary** — offline medical AR interface
  - **Project MIMIC** — hand-mimicry robotics, with a **live in-browser webcam
    hand-tracking demo** (MediaPipe) that reproduces the Python project's
    finger-bend pipeline and drives an animated robotic hand
  - **Stories Illuminated** — projection-mapped animatronic storybook *(in development)*
- **Project Logs** — a "Stark-style" video log feed with filtering, plus a
  built-in **Log Studio** that records webcam video right in the browser
- **Creative Art** — gallery with lightbox (opens full artwork on click)
- **LinkedIn** — external link

> **Media note:** The About portrait, the *Sea Turtle* gallery piece, and the
> three **animated project logos** (Mary, Project MIMIC, Stories Illuminated) are
> all rendered as **inline SVG** — self-contained vector art with no external
> image files and no pixel-size limits. The Mary mark is ported from the Mary
> repo (a heartbeat pulse that reads as an "M", drawing itself on load); MIMIC is
> an animated robotic hand that flexes; Stories is an open book lit by a sweeping
> projection beam. All animations respect `prefers-reduced-motion`.

## Project Logs (video updates)

The **Project Logs** section is a video feed you control from one data array,
plus a recorder for making the clips.

### Recording a log (Log Studio)

1. Open the site, go to **Project Logs**, click **● Record a log**.
2. Click **Enable camera**, optionally write teleprompter notes (saved locally
   in your browser), then **● Start / ❚❚ Pause / ■ Stop**.
3. Hit **⤓ Download .webm** to save the clip. The video is **never uploaded** —
   it stays on your device until you download it.

> Works in Chrome, Edge, and Firefox. Camera/mic permission is required, and the
> page must be served over `http://localhost` or `https://` (not opened as a
> `file://` path) for the browser to grant camera access.

### Publishing a log to the feed

Edit the `LOGS` array at the top of **`assets/js/logs.js`**. Each entry takes
**one** video source:

```js
{
  n: 1,                        // log number (shows as "LOG 01")
  title: 'Why Mary exists',
  date: '2026-10-08',
  project: 'Mary',             // Mary | MIMIC | Stories | General  (drives the filter)
  blurb: 'One-line description.',
  duration: '1:12',            // optional label

  // pick ONE:
  youtube: 'VIDEO_ID',         // the id after watch?v=   (recommended for long clips)
  // vimeo: 'VIDEO_ID',
  // video: 'assets/video/log-01.webm',   // self-hosted file committed to the repo
}
```

- **YouTube/Vimeo (recommended):** upload there (unlisted is fine), paste the id.
  Zero repo bloat, best playback.
- **Self-hosted file:** drop the file in `assets/video/` and point `video:` at it.
  Keep clips short so the repo stays small.
- **No source yet?** Omit all three and the card shows a tidy "Recording soon"
  state — great placeholders until the real video is ready.

## Run locally

No dependencies to install. Serve the folder with any static server:

```bash
# Python
python3 -m http.server 8000
# then open http://localhost:8000
```

> The webcam demo and the Google Fonts / MediaPipe libraries load from a CDN, so
> an internet connection is needed when viewing. The webcam feed is processed
> entirely in your browser and never leaves your device.

## Adding your content

Everything marked as a placeholder is easy to swap:

| What | Where |
|------|-------|
| Your photo (optional) | replace the `.photo-monogram` block in the About section with `<img class="about-photo-img" src="assets/img/luke.jpg" alt="Luke Dysart" />` |
| Sea turtle art | the current piece is an inline SVG; to use a raster version instead, swap the `.art-svg` figure for `<figure class="gallery-item" data-full="assets/img/sea-turtle.jpg">` with an `<img>` |
| More artwork | add either an inline-SVG `<figure class="gallery-item" data-svg="...">` or a raster `<figure class="gallery-item" data-full="assets/img/your-art.jpg">` block in the gallery |
| New engineering project | copy an `<article class="project">` block in `index.html` |

> If you add raster images, keep each file within **2000 px on every side** —
> oversized images will be rejected on upload.
| Mary live demo URL | update the `project-link-demo` link in `index.html` |
| LinkedIn URL | update the two LinkedIn links in `index.html` |

## Deploy

Works out of the box on **GitHub Pages**, Netlify, or Vercel — it's static.
For GitHub Pages: push to the repo, then Settings → Pages → deploy from the
`main` branch root. The site is set up for the URL
`https://lukefdysart.github.io/Portfolio/` (used in the canonical + social tags);
a `.nojekyll` file and a custom `404.html` are included.

## SEO & sharing

- Open Graph + Twitter card meta tags are set, with a social preview image at
  `assets/img/social-preview.png` (1200×630, generated from
  `assets/img/social-preview.svg`).
- Inline SVG favicon, `theme-color`, canonical URL, and a skip-to-content link
  for accessibility.
- `prefers-reduced-motion` is respected (animations disabled for users who ask).

---

© Luke Dysart. Built from scratch, code owned.
