# Darren Huai Portfolio

My portfolio: one static page, no build step. Plain HTML, CSS and ES modules, with a three.js
hex board in the hero that is a 3D take on [ChessTan](https://store.steampowered.com/app/5099860/ChessTan/).

**Live:** https://darrenhuai.github.io/darrenhuai-Portfolio/

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page. All copy lives here. |
| `styles.css` | Tokens (light and dark), layout, motion. |
| `js/main.js` | Menu, current-section state, scroll reveals, the demo recording, hero mount. |
| `js/hero-scene.js` | The three.js scene. Loaded only when WebGL is available and motion is allowed. |
| `fonts/` | Archivo and Geist Mono, subset to Latin, self-hosted under the OFL (licences alongside). |
| `img/work/` | Real screenshots and the watchglass demo recording. |
| `tools/hero-still.html` | Renders the hero at 1600x1200 to regenerate `img/hero-board-*.webp`. |
| `docs/design/`, `DESIGN.md` | The design spec and tokens the page was built from. |

## Running locally

ES modules do not load from `file://`, so serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000/.

## Deploying

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which checks the copy and publishes the
repository root to GitHub Pages.
