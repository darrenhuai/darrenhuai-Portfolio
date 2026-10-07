# Darren Huai Portfolio

My portfolio: a static site with no build step. Plain HTML, CSS and ES modules. The front page has the
intro, experience and a grid of projects; each project opens its own page. The ChessTan card carries a
three.js hex board that is a 3D take on [ChessTan](https://store.steampowered.com/app/5099860/ChessTan/).

**Live:** https://darrenhuai.github.io/darrenhuai-Portfolio/

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | The page. The hand-written copy lives here; the project cards and the open-source lists are generated into it (see below). The About paragraph that starts "As of" is dated: rewrite it whenever it changes. |
| `styles.css` | Tokens (light and dark), layout, motion. |
| `js/main.js` | Menu, current-section state, scroll reveals, the demo recording buttons, the hover clip on the watchglass row, the tick-mark field, the board mount. |
| `js/field.js` | The field of drifting tick marks in the hero (a canvas with value noise). One static frame under reduced motion. |
| `js/hero-scene.js` | The three.js ChessTan board on its work row. Loaded only near the row, with WebGL and motion allowed. |
| `resume.html`, `Darren-Huai-Resume.pdf` | The resume page embeds the PDF; `img/resume-page-1*.webp` is the rendered fallback. Update all three together. |
| `projects/` | One page per project. Generated; do not edit by hand. |
| `tools/build_projects.py` | Project data, the open-source pull request lists (`OSS_PROJECTS`, `OSS_SINGLES`, `OSS_OPEN`), the smaller repositories (`SMALL_REPOS`) and the templates. Edit it, then run `python tools/build_projects.py` to rewrite `projects/` and the generated blocks in `index.html`. |
| `fonts/` | Playfair Display (headlines) and Geist Mono (everything else), subset to Latin, self-hosted under the OFL (licences alongside). |
| `img/pro_pic*.jpg`, `img/pro_pic*.webp` | The portrait at 960 and 480 wide, cut from the original photo. |
| `img/work/` | Real screenshots, the watchglass demo recording, and the ChessTan Steam trailer (muted). |
| `img/og.png` | The social preview: a 1200x630 screenshot of the hero in the light theme. Retake it when the hero changes. |
| `tools/hero-still.html` | Renders the board at 1600x1200 to regenerate `img/hero-board-*.webp`. |
| `docs/design/`, `DESIGN.md` | The design spec and tokens the page was built from. |

The open-source counts are hand-updated from GitHub (`gh search prs --author=darrenhuai --merged`); check them before each rebuild.

## Running locally

ES modules do not load from `file://`, so serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000/.

## Deploying

Pushing to `main` runs `.github/workflows/deploy-pages.yml`, which checks the copy and publishes the
repository root to GitHub Pages.
