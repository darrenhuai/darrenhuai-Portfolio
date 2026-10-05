# Darren Huai Portfolio

My portfolio: a static site with no build step. Plain HTML, CSS and ES modules. The front page has the
intro, experience and a grid of projects; each project opens its own page. The ChessTan card carries a
three.js hex board that is a 3D take on [ChessTan](https://store.steampowered.com/app/5099860/ChessTan/).

**Live:** https://darrenhuai.github.io/darrenhuai-Portfolio/

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page. All copy lives here. |
| `styles.css` | Tokens (light and dark), layout, motion. |
| `js/main.js` | Menu, current-section state, scroll reveals, the demo recording, hero mount. |
| `js/hero-scene.js` | The three.js ChessTan board on the project card. Loaded only near the card, with WebGL and motion allowed. |
| `resume.html`, `Darren-Huai-Resume.pdf` | The resume as a page, and the PDF it links to. Update both together. |
| `projects/` | One page per project. Generated; do not edit by hand. |
| `tools/build_projects.py` | Project data and templates. Edit it, then run `python tools/build_projects.py` to rewrite `projects/` and the cards in `index.html`. |
| `fonts/` | Archivo and Geist Mono, subset to Latin, self-hosted under the OFL (licences alongside). |
| `img/work/` | Real screenshots and the watchglass demo recording. |
| `tools/hero-still.html` | Renders the board at 1600x1200 to regenerate `img/hero-board-*.webp`. |
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
