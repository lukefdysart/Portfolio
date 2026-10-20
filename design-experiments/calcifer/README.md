# Calcifer — Logo Lab v2 (EXPERIMENTAL · NOT PUBLISHED)

> ⚠️ **This directory is intentionally excluded from the published website.**
> It lives in the repo on `main` for versioning, but it is **excluded from the
> GitHub Pages output** (see `../../_config.yml` → `exclude:`), so it is **not**
> reachable at `https://lukedysart.com/`. Private design exploration for the
> future **Calcifer** project — do not link it from the site, navigation, or
> any public project list.

## What Calcifer is

A working physical model of a human heart, driven by servo motors connected to
the maker's **real heart rate** — biomedical engineering + electronics +
mechanical motion + creative design.

## This board (v2 — full creative reset)

The three earlier concepts were rejected. These are three new, deliberately
distinct directions in a **Studio-Ghibli "eccentric inventor's workshop"** key —
warm, crafted, alive — with **anatomy as the foundation** (not a Valentine
heart, not a flame character):

| # | Concept | Idea |
|---|---------|------|
| A | **The Clockwork Heart** | Anatomical heart as a brass scientific instrument: servo bracket + pushrod linkage + a gear at the aortic root. |
| B | **The Living Heart** | Soft hand-drawn/painterly heart with one honest brass servo reveal behind it. Most warmth; no cartoon face. |
| C | **The Inventor's Emblem** | Vintage brass insignia: heart in an engraved dial-ring, sage sprig, base servo+gear, DYS banner. |

Every mark includes:
- recognizable **anatomy** (two ventricles + interventricular groove, atria, great vessels),
- believable **brass servo mechanics** that move with the beat,
- an integrated **DYS** maker's mark (engraved plate / wax seal / banner),
- a gentle **two-part "lub-dub" + rest** heartbeat loop (respecting `prefers-reduced-motion`),
- **warm light backgrounds** (parchment/cream) — no black tiles; also works transparent.

Palette: terracotta / muted crimson / coral (heart), aged brass (mechanics),
parchment/cream (ground), soft brown ink (outlines), a touch of sage.

## How to open the design board locally

No build step, no server required.

**Option A — open directly:** open `index.html` in a browser.

**Option B — local static server:**
```bash
cd design-experiments/calcifer
python3 -m http.server 4321
# then open http://localhost:4321/
```

A **⏸ Pause / ▶ Play** button toggles the heartbeat; motion auto-disables under
the OS "reduce motion" setting.

## Files

- `index.html` — the design board (layout, scale previews, animation CSS).
- `logos.js` — the three concepts as layered, editable inline SVG (one function each).
- `reference-logos.js` — read-only copies of MIMIC/MARY/Stories for scale + DYS reference.
- `README.md` — this file.

## Why this is safe to keep in the repo

The site is served by GitHub Pages from `main` at `path: /`. The root
`_config.yml` lists `design-experiments` under `exclude:`, so Jekyll drops this
folder from the published output while copying every existing (Liquid-free,
front-matter-free) page verbatim. Nothing here is linked from `index.html` or
any public page.
