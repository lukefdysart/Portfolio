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
- **Creative Art** — gallery with lightbox (opens full artwork on click)
- **LinkedIn** — external link

> **Media note:** The About portrait and the *Sea Turtle* gallery piece are
> rendered as **inline SVG** — self-contained vector art with no external image
> files and no pixel-size limits. You can drop in real raster images later (see
> below), but nothing is "missing" by default.

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
`main` branch root.

---

© Luke Dysart. Built from scratch, code owned.
