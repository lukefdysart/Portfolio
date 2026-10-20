# Calcifer — Logo Lab (EXPERIMENTAL · NOT PUBLISHED)

> ⚠️ **This directory is intentionally excluded from the published website.**
> It lives in the repo on `main` for versioning, but it is **excluded from the
> GitHub Pages output** (see `../../_config.yml` → `exclude:`), so it is **not**
> reachable at `https://lukedysart.com/`. It is a private design exploration for
> the future **Calcifer** project and must not be linked from the site,
> navigation, or any public project list.

## What this is

A standalone visual design board exploring **three distinct logo concepts** for *Calcifer* —
a physical, servo-driven model of a human heart that beats in sync with a live human pulse.

| # | Concept       | Idea |
|---|---------------|------|
| 1 | **Anatomical** | Simplified human heart with a subtle engineered/mechanical element. |
| 2 | **Heartbeat**  | Heart that reads as rhythm + synchronization with a real pulse. |
| 3 | **Characterful** | Distinctive, lightly playful mark riffing on the name "Calcifer". |

Each concept is shown at a **large hero size** and a **small project-icon size**, with the
`CALCIFER` wordmark underneath. The board also places the concepts **side-by-side with the
real portfolio logos** (MIMIC, MARY, Stories Illuminated) so dimensions, styling, and visual
weight can be compared directly.

## How to open the design board locally

The board is a single self-contained HTML file — no build step, no server required.

**Option A — Kiro preview / browser:** open `index.html` directly.

**Option B — local static server:**
```bash
cd design-experiments/calcifer
python3 -m http.server 4321
# then open http://localhost:4321/
```

## Why this is safe to keep in the repo

The site is served by GitHub Pages from `main` at `path: /`. A root `_config.yml`
lists `design-experiments` under `exclude:`, so Jekyll copies every existing page
verbatim (the site has no Liquid/front-matter) **except** this folder, which is
dropped from the published output. Nothing here is linked from `index.html` or any
public page.

## Editing

Every logo is **inline, editable SVG** defined in `logos.js` (one function per concept).
Colors live in CSS custom properties at the top of `index.html` (`:root`) so you can
re-tint the whole board from one place. Nothing is rasterized — scale freely.
