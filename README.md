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
- **Creative Art** — image gallery with lightbox
- **LinkedIn** — external link

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
| Your photo | drop `assets/img/luke.jpg` (About section auto-uses it) |
| Sea turtle art | drop `assets/img/sea-turtle.jpg` |
| More artwork | add a `<figure class="gallery-item" data-full="assets/img/your-art.jpg">` block in the gallery, replace the placeholder divs with `<img>` |
| New engineering project | copy an `<article class="project">` block in `index.html` |
| Mary live demo URL | update the `project-link-demo` link in `index.html` |
| LinkedIn URL | update the two LinkedIn links in `index.html` |

## Deploy

Works out of the box on **GitHub Pages**, Netlify, or Vercel — it's static.
For GitHub Pages: push to the repo, then Settings → Pages → deploy from the
`main` branch root.

---

© Luke Dysart. Built from scratch, code owned.
