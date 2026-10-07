# Portfolio redesign specification

Site: https://darrenhuai.github.io/darrenhuai-Portfolio/
Repo: C:\dev\darrenhuai-Portfolio, branch redesign-2026-09
Date: 2026-09-29
Status: buildable. An engineer can build the whole page from this document without asking questions. Where a value must be produced at build time (a capture, an export, a font subset) the exact command or procedure is given.

Provenance. Four directions were judged by three lenses (hiring manager, anti-slop art director, static-site builder). D1 "Drafting table" won the tally (21.8). This document is D1 with every judge's fatal item fixed and the grafts that strengthen it taken from D2, D3 and D4. Appendix A lists each graft taken or rejected and why; Appendix B lists each fatal and its fix.

Conventions in this document: hyphens only, no em or en dashes anywhere (this file and the page are both grep-gated); sentence case; every number on the page comes from the brief or the resume.

---

## 1. Design read, dials, lane

Reading this as: redesign-overhaul of a one-page developer portfolio for SWE recruiters and hiring managers who give it 20 to 60 seconds, in an engineering-drawing language (drawing sheet, title block, instrument readout) executed warmly, built in native HTML, CSS and ES modules with a Three.js hero, one self-hosted variable sans for everything you read and one aerospace mono used only where a string is a value.

Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 6, VISUAL_DENSITY 5. Asymmetric but gridded (7/5 and 8/4 splits, a plate that spans the sheet, a board that bleeds off the right edge, a matrix); one load choreography, one cinematic beat in the hero, IntersectionObserver reveals, hover and active physics, two data drawings that draw themselves once; denser than a gallery because the page carries real information (four case sheets, eleven pull requests, a skills matrix).

Lane: engineering drafting table. Physical references: a drawing sheet with a title block, a Braun instrument panel, Teenage Engineering's product pages (aluminium-grey ground, one orange indicator, the numbers doing the decorating). Site references for "technical but human": together.ai (sentence-case sans carries the narrative, mono only where a string is a value) and HashiCorp (one family carries the hierarchy through weight; surface lift instead of shadows; nothing floats). Dark mode is ChessTan's own in-game panel (navy ground, cream text, gold frame pushed to amber). The hero object is the game's board.

Reflex checks (impeccable). First-order "dev portfolio" reflex (Inter or Space Grotesk, slate dark mode, purple gradient, chips, dot timeline): rejected. Second-order editorial-typographic reflex (italic serif, tiny mono labels, ruled columns, no imagery): guarded by rules, no serif, rules only where they organise real content, mono only for values, every case sheet image-led. Third-order "blueprint" reflex (crosshair corner marks, big figure tiles, label-over-value grids): the corner registration marks and the figure tiles that D1 carried are removed by this spec; the title block survives because every cell holds a fact a screener needs and it is the one full grid on the page.

Competitor sentence. Modal page: "A clean, modern developer portfolio: hero with my photo and a typing effect, project cards with tech tags, a timeline of experience, a skills grid, a contact form." This page: "A one-page drawing set: a pointer-reactive 3D hex board from the game I shipped on Steam, four screenshot-led case sheets with the numbers inside the sentences, eleven upstream merges plotted on a September date axis, a skills-to-evidence matrix, and a title block instead of a bio." Passes.

Retired from the live site (all of it): cream page, indigo blobs, gradient-clipped name, typewriter cycler, floating avatar card with the purple-to-amber border, pill chips, uppercase eyebrow above every section, equal cards with gradient top bars, dot timeline, chip soup, Karla and Sora, runtime Google Fonts link, the /DH/ Open Graph URLs, the gradient favicon.

---

## 2. Colour

Strategy: committed. One accent, burnt amber, used identically in every section: primary button fill, matrix marks, axis markers, hover underline, focus ring, the hovered hex edge in the hero. Nothing else on the page is coloured; the screenshots supply the saturation. Light theme reference: Teenage Engineering aluminium grey cooled toward drafting vellum (not cream; the #f5f1ea family and its brass and oxblood partners are avoided on purpose). Dark theme reference: the ChessTan in-game panel, sampled from screenshots/01_hero.png (table #0a1417, panel text #dbcfb3, frame #bd944c), with the gold moved to amber.

### 2.1 Tokens

Declared on `:root` in OKLCH with a hex fallback on the same property for browsers without OKLCH support. Theme switches on `prefers-color-scheme`; no toggle. Also set `color-scheme: light dark` on `:root`.

| Token | Light OKLCH | Light hex | Dark OKLCH | Dark hex | Role |
|---|---|---|---|---|---|
| `--bg` | oklch(0.965 0.006 240) | #f0f4f7 | oklch(0.17 0.014 250) | #0b1015 | page ground |
| `--surface` | oklch(0.985 0.003 240) | #f8fafc | oklch(0.21 0.015 250) | #13191f | title-block cells, ledger blocks |
| `--surface-2` | oklch(0.935 0.008 240) | #e5eaee | oklch(0.25 0.015 250) | #1c2229 | the Experience band |
| `--ink` | oklch(0.22 0.02 250) | #141b24 | oklch(0.94 0.012 80) | #efeae2 | headings, body |
| `--ink-2` | oklch(0.42 0.02 250) | #454e58 | oklch(0.78 0.012 80) | #bbb7af | secondary text, labels, secondary button border |
| `--muted` | oklch(0.5 0.015 250) | #5d646c | oklch(0.68 0.012 80) | #9c9890 | captions, footer, resting link underline |
| `--accent` | oklch(0.53 0.13 55) | #a35303 | oklch(0.78 0.14 65) | #f4a34b | the one colour |
| `--accent-hover` | oklch(0.47 0.115 55) | #8a4603 | oklch(0.83 0.12 65) | #fdb770 | primary button hover fill |
| `--accent-ink` | oklch(0.985 0.01 80) | #fefaf3 | oklch(0.18 0.02 60) | #180f09 | text on accent |
| `--line` | oklch(0.85 0.01 240) | #c8cfd4 | oklch(0.32 0.015 250) | #2d343a | hairlines, plate frames, title-block grid |

Every value above is inside the sRGB gamut (checked by converting through OKLab; D1's light accent at chroma 0.15 clipped and was lowered to 0.13). The hex column is the sRGB conversion of the OKLCH value and is what the contrast proof uses.

Twin hex custom properties for the scene (the Three.js scene cannot parse `oklch()`): declare `--bg-hex`, `--surface-2-hex`, `--ink-hex`, `--line-hex`, `--accent-hex`, `--accent-ink-hex` beside the tokens in both themes, holding the hex strings from the table. Tile and piece colours for the scene, published as custom properties and never used by page chrome: `--tile-wheat-hex: #dcb832`, `--tile-water-hex: #49afda`, `--tile-sand-hex: #cac3b5`, `--tile-brown-hex: #8e602b`, `--tile-lavender-hex: #6e7a9c`, `--piece-blue-hex: #408cf3`, `--piece-red-hex: #e64746` (sampled from the game's own screenshots; identical in both themes).

Selection: `::selection { background: color-mix(in oklch, var(--accent) 25%, var(--bg)); color: var(--ink); }` (light #ddccba, ink on it 11.07:1); dark uses 30% (#513c25, ink on it 8.67:1).

### 2.2 Contrast proof (WCAG 2.x, computed from the hex column)

| Pair | Use | Light | Dark |
|---|---|---|---|
| ink on bg | body and headings on the page | 15.67:1 | 15.96:1 |
| ink on surface | body on title-block cells and ledgers | 16.56:1 | 14.78:1 |
| ink on surface-2 | body on the Experience band | 14.30:1 | 13.39:1 |
| ink-2 on bg | secondary text on the page | 7.65:1 | 9.56:1 |
| ink-2 on surface-2 | secondary text on the Experience band | 6.98:1 | 8.02:1 |
| muted on bg | captions and footer | 5.42:1 | 6.65:1 |
| muted on surface | captions on surface | 5.73:1 | 6.16:1 |
| muted on surface-2 | captions on the Experience band (worst case) | 4.95:1 | 5.58:1 |
| accent on bg | accent as text on the page | 5.00:1 | 9.27:1 |
| accent on surface | accent as text on surface | 5.29:1 | 8.59:1 |
| accent on surface-2 | accent as text on the Experience band (worst case) | 4.57:1 | 7.78:1 |
| accent-ink on accent | primary button label | 5.32:1 | 9.17:1 |
| accent-ink on accent-hover | primary button label, hovered | 6.82:1 | 10.97:1 |
| accent on bg | focus ring, matrix marks, axis markers (non-text, needs 3:1) | 5.00:1 | 9.27:1 |
| accent on surface-2 | focus ring on the band (non-text) | 4.57:1 | 7.78:1 |
| muted on bg | resting link underline (non-text) | 5.42:1 | 6.65:1 |
| muted on surface-2 | resting link underline on the band (non-text) | 4.95:1 | 5.58:1 |
| ink-2 on bg | secondary button and Menu button border (non-text) | 7.65:1 | 9.56:1 |
| line on bg | hairlines and plate frames (decorative, no requirement) | 1.42:1 | 1.51:1 |

Body copy clears AAA in both themes; every text pair clears AA on every surface it appears on; every interactive boundary clears 3:1. `--line` is decorative only: any boundary that must be perceived (the secondary button, the Menu button, the video Replay button) is drawn in `--ink-2`.

### 2.3 Colour rules (build-time checks)

1. `--accent` may appear only in: `.button-primary` background, `.mark` (matrix), `.axis-marker` fill or stroke, `a:hover` text-decoration-color, `:focus-visible` outline-color, the nav active underline, `::selection`, and the scene via `--accent-hex`. A grep for `var(--accent)` in styles.css must return only those rules.
2. No gradient anywhere (`grep -c gradient styles.css` returns 0).
3. No `box-shadow` anywhere (`grep -c box-shadow styles.css` returns 0). Depth is the surface ladder and the 1px frame.
4. No `backdrop-filter` anywhere.
5. No colour literal outside the `:root` token blocks and the scene hex twins.

---

## 3. Typography

### 3.1 Families (verified 2026-09-29 by fetching the Google Fonts CSS)

Display and text: **Archivo** (Omnibus-Type, OFL). Variable, `wght 100..900`, `wdth 62..125`. `https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap` returned 210 `@font-face` blocks, `font-stretch` extra-condensed through expanded, weights 100 to 900, roman and italic. Only the roman file is shipped; the page uses no italics.

Values only: **B612 Mono** (Airbus and Intactile Design, OFL). `https://fonts.googleapis.com/css2?family=B612+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap` returned 4 blocks. Only weight 400 roman is shipped (the figure tiles that used 700 are gone). Register reason: it is a cockpit-display face for a candidate writing cFS flight software; it is not on any reject list; it never sets a heading, label, button or sentence. If review still reads it as costume, the verified swap is Sometype Mono 400 (same subsetting), and nothing else changes.

Source files, from github.com/google/fonts (verified directory listings):
- `ofl/archivo/Archivo[wdth,wght].ttf`
- `ofl/b612mono/B612Mono-Regular.ttf`

### 3.2 Self-hosting

```
uv tool run --from "fonttools[woff]" pyftsubset "Archivo[wdth,wght].ttf" --flavor=woff2 --output-file=fonts/archivo-var.woff2 --unicodes="U+0020-007E,U+00A0-00FF,U+2018-201D,U+2026,U+2212" --layout-features="*"
uv tool run --from "fonttools[woff]" pyftsubset B612Mono-Regular.ttf --flavor=woff2 --output-file=fonts/b612mono-400.woff2 --unicodes="U+0020-007E,U+00A0-00FF" --layout-features="*"
```

pyftsubset keeps `fvar`/`gvar`, so both axes survive. Expected sizes: about 100 KB and 20 KB. Add `fonts/OFL-Archivo.txt` and `fonts/OFL-B612Mono.txt` (the licence texts) next to the files.

```css
@font-face {
  font-family: "Archivo";
  src: url("fonts/archivo-var.woff2") format("woff2");
  font-weight: 100 900;
  font-stretch: 62% 125%;
  font-display: swap;
}
@font-face {
  font-family: "B612 Mono";
  src: url("fonts/b612mono-400.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
/* CLS insurance for the LCP headline: metric-matched fallback */
@font-face {
  font-family: "Archivo Fallback";
  src: local("Arial"), local("Liberation Sans");
  size-adjust: 96%;      /* replace the four values with the output of: npx fontpie fonts/archivo-var.woff2 --name "Archivo Fallback" */
  ascent-override: 88%;
  descent-override: 22%;
  line-gap-override: 0%;
}
:root {
  --font-sans: "Archivo", "Archivo Fallback", Arial, sans-serif;
  --font-mono: "B612 Mono", ui-monospace, "Cascadia Mono", Consolas, monospace;
}
```

Preload the Archivo file only: `<link rel="preload" href="fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>`. Never link the Google Fonts CSS at runtime.

### 3.3 Instances (one family, width and weight do the hierarchy)

| Instance | Family | wdth | wght | Where |
|---|---|---|---|---|
| display | Archivo | 108 | 600 | hero h1 |
| heading | Archivo | 108 | 600 | h2 section headings, case-sheet titles |
| title | Archivo | 100 | 600 | employer names, repo names, project names in Earlier projects, wordmark (700) |
| body | Archivo | 100 | 400 | everything you read |
| label | Archivo | 88 | 500 | field labels (Role, Stack, The problem, What I built), matrix heads, title-block labels, nav |
| value | B612 Mono | n/a | 400 | `.val` only |

`.val` is the only rule that references `--font-mono`: `font-family: var(--font-mono); font-size: 0.92em; font-variant-numeric: tabular-nums; letter-spacing: 0;`. A string is set in `.val` only if someone could paste it into a form or a terminal: `45%`, `2.5 s`, `#537`, `2026-09-15`, `Godot 4.7`, `55 MB`, `--demo`, `npm run web`, a repo slug, an email address. Build check: `grep -n "font-mono" styles.css` returns exactly one rule.

### 3.4 Fluid scale (root 16px; every step at least 1.25 apart at the large end)

| Token | clamp() | Range | Use |
|---|---|---|---|
| `--t-1` | `clamp(0.8125rem, 0.784rem + 0.121vw, 0.875rem)` | 13 to 14px | labels, captions, matrix heads, footer, dates |
| `--t0` | `clamp(1rem, 0.957rem + 0.182vw, 1.094rem)` | 16 to 17.5px | body |
| `--t1` | `clamp(1.25rem, 1.193rem + 0.242vw, 1.375rem)` | 20 to 22px | hero subtext, section lead sentences, employer and repo names |
| `--t2` | `clamp(1.5625rem, 1.477rem + 0.364vw, 1.75rem)` | 25 to 28px | case-sheet titles, the contact email button |
| `--t3` | `clamp(2rem, 1.886rem + 0.485vw, 2.25rem)` | 32 to 36px | section headings (h2) |
| `--t4` | `clamp(2.5rem, 2.273rem + 0.97vw, 3rem)` | 40 to 48px | hero h1 only |

Ratios at the large end: 1.25, 1.26, 1.27, 1.29, 1.33. The h1 tops out at 48px because it shares the fold with the canvas and must hold two lines in a six-column measure; at 48px, wdth 108, the 32-character headline breaks as "I write flight" / "software at NASA." with `text-wrap: balance` (longest line 17 characters, about 470px in a 548px column).

Line-height: h1 1.05; h2 1.1; t2 1.15; t1 1.3; body 1.55 light and 1.62 dark (light type on dark gets more air); `.val` 1.3.

Letter-spacing: display and heading at wdth 108: -0.012em; t2: -0.01em; body 0; label at wdth 88: +0.01em, sentence case, never uppercase; `.val` 0. `text-wrap: balance` on h1 and h2; `text-wrap: pretty` on paragraphs. Body measure 62ch. No uppercase anywhere except acronyms that are uppercase in life (NASA, USC, UCLA, cFS, HPSC, RAVEN, RLHF, PID, API, OCR, MQTT, ETL, SQL). No italics.

---

## 4. Spacing, grid, shape, depth, layers

Spacing scale (4px base): `--s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 24px; --s6: 32px; --s7: 48px; --s8: 64px; --s9: 96px`. Section rhythm: `--section-y: clamp(4.5rem, 3rem + 5vw, 8rem)`; every section has `padding-block: var(--section-y) calc(var(--section-y) * 1.15)` (bottom one step larger). Gutter: `--gutter: clamp(1rem, 4vw, 2.5rem)`.

Sheet (container): `max-width: 1200px; margin-inline: auto; padding-inline: var(--gutter)`. Grid: `display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: var(--s5)` at 1024px and up. Breakpoints: 640, 768, 1024, 1280. Below 768 every multi-column section is one column with 16px side padding, as stated per section in section 5.

Radius: 0 on every element (all-sharp system: a drawing sheet has no rounded corners). Build check: `grep -c border-radius styles.css` returns 0.

Shadow: none anywhere. The open mobile menu panel is `--bg` with a 1px `--line` rule beneath it.

Borders and rules: 1px `--line` for hairlines, plate frames, the title-block grid, the matrix's one vertical rule, the Experience row rules, the footer rule. 1px `--ink-2` for boundaries that must be perceived (secondary button, Menu button, Replay button).

Focus: `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`. On accent-filled controls (the primary button, the email button) the outline colour is `var(--ink)` so the ring is visible against the fill (the 2px offset shows page bg between ring and fill).

Z-index scale (the only z-index values allowed): `--z-base: 0; --z-canvas: 1; --z-menu: 40; --z-nav: 50; --z-skip: 100`.

Viewport: `100dvh` in calcs, never `100vh`. Skip link: "Skip to content" to `#main`, first focusable element, visually hidden until focused, `z-index: var(--z-skip)`.

---

## 5. Page architecture

Nine sections, nine layout families, no family repeated. Anchor ids `projects`, `experience`, `skills`, `about`, `contact` are kept for external links; `#main` wraps everything after the nav; `#open-source` is new. Ids `home`, `typewriter` and `year` go.

| # | Section | id | Layout family |
|---|---|---|---|
| 1 | Nav | | single hairline bar |
| 2 | Hero | | asymmetric split with an edge-bleed canvas |
| 3 | Selected work | `#projects` | drawing sheets (lead plate with filmstrip, unequal two-up, split, text pair) |
| 4 | Open source | `#open-source` | data chart over two grouped ledgers |
| 5 | Experience | `#experience` | ledger rows on a surface band |
| 6 | Skills | `#skills` | evidence matrix (semantic table) |
| 7 | About | `#about` | title block (bordered cell grid with portrait) |
| 8 | Contact | `#contact` | single-statement strip |
| 9 | Footer | | colophon line |

Eyebrows on the page: zero. Icons: none; every affordance is text. Cards: none; the only bordered containers are image plates and title-block cells.

### 5.1 Nav

Family: single hairline bar. `position: sticky; top: 0; height: 64px; background: var(--bg); border-bottom: 1px solid var(--line); z-index: var(--z-nav)`. No blur, no transparency.

Desktop (768px and up): left, wordmark "Darren Huai" (Archivo 700, wdth 108, 18px, ink, links to the top of the page). Right, in this order at t-1 Archivo 500 wdth 100, ink-2, 24px gaps, one line: Projects, Open source, Experience, Skills, About, Contact, Resume, GitHub. Eight labels total about 60 characters; with the wordmark the bar needs about 780px and holds one line at 1024. Resume opens `Darren-Huai-Resume.pdf` in a new tab (`target="_blank" rel="noopener"`); GitHub opens `https://github.com/darrenhuai` the same way. Section links are plain anchors; `scroll-behavior: smooth` on `html` under no-preference only; `scroll-margin-top: 80px` on every section.

Current section: the link for the section in view is ink with a 2px `--accent` underline at 6px offset, set by an IntersectionObserver over the seven sections (`rootMargin: "-40% 0px -55% 0px"`), never a scroll listener. Hover on any nav link: the same underline in `--muted`, 120ms.

Mobile (below 768px): wordmark plus a text button "Menu" at the right (44px tall, 1px `--ink-2` border, Archivo 500, t-1), with `aria-expanded`, `aria-controls="primary-nav"`. Open: the label reads "Close", `aria-expanded="true"`, a full-width panel slides down under the bar (`background: var(--bg)`, 1px `--line` bottom rule, `z-index: var(--z-menu)`) with the eight links stacked in 56px rows at t1 Archivo 500, separated by spacing not rules; `body { overflow: hidden }` while open. Close on: the button, Escape (focus returns to the button), a link click, a click outside the panel. Below 360px nothing changes.

### 5.2 Hero

Family: asymmetric split with an edge-bleed canvas. `min-height: min(calc(100dvh - 64px), 860px); padding-top: clamp(2rem, 5vw, 5rem); overflow-x: clip; align-items: center`.

Desktop (1024px and up): the 12-column sheet; copy in columns 1 to 6, canvas box in columns 7 to 12 with `margin-right: calc(50% - 50vw)` so the board runs off the right edge of the viewport while the copy keeps the sheet margin. The canvas box: `aspect-ratio: 4 / 3; position: relative; width: 100%` (no min-height, so CLS is 0 and the picture and canvas share one box). Resulting canvas widths (six columns plus the bleed): about 500px at 1024, 628px at 1280, 708px at 1440, which is 49 percent of the viewport at each size, inside the brief's 45 to 55. The copy column is about 548px at 1200.

Copy stack, three text elements, no eyebrow, no name line, no tagline:

1. h1, display instance, `--t4`, `text-wrap: balance`, `max-inline-size: 18ch`: **I write flight software at NASA.**
2. Subtext, `--t1` Archivo 400, ink-2, `max-inline-size: 42ch`, 20 words: **M.S. Computer Science at USC, May 2027. I shipped ChessTan on Steam and landed eleven fixes in platformdirs and virtualenv.**
3. Two buttons on one row, 12px apart: primary **See the work** (to `#projects`), secondary **Resume** (to `Darren-Huai-Resume.pdf`, new tab).

Vertical spacing: h1 to subtext `--s5`, subtext to buttons `--s6`.

The name is not repeated in the hero: it is the wordmark in the always-visible bar, the document title, the Open Graph title and the About title block. "M.S. Computer Science at USC, May 2027" must survive any later copy edit; if anything is cut from the subtext, cut the open-source clause, never the degree.

Canvas box contents (see section 8 for the full contract): a `<picture>` with the static still fills the box; the script inserts a `<canvas>` over it only when motion and WebGL are allowed, then cross-fades it in.

Mobile (below 1024px): one column, the canvas box first at full width (`aspect-ratio: 4 / 3; max-height: 38dvh; object-fit: cover` on the still), then h1, subtext, buttons. Buttons stay on one row (both labels fit at 375px; `flex-wrap: wrap` as the safety net). At 375 by 812 the stack (nav 64, canvas 281, h1 two lines at 40px, subtext three lines at 20px, buttons 48, gaps) ends at about 700px, so the buttons are inside the first viewport; at 360 by 640 the canvas caps at 243px and the buttons still land inside the viewport.

### 5.3 Selected work (`#projects`)

Family: drawing sheets. Heading h2 **Selected work**, `--t3`, no lead sentence, no eyebrow. Four case sheets in three compositions, then two earlier projects. Sheets are separated by `--s9` on desktop and `--s8` on mobile; no rules between sheets.

The case block (identical fields on every sheet, placed differently per sheet):
- Title: heading instance, `--t2`.
- Lead: one sentence, `--t1` Archivo 400, ink-2, `max-inline-size: 48ch`.
- Role: label "Role" (label instance, t-1, ink-2) then the value on the same line (body, t0).
- Stack: label "Stack" then the values in `.val`, comma separated, wrapping.
- The problem: label "The problem" inline at the start of the paragraph (Archivo 500, ink), then the sentences (body, ink, 62ch).
- What I built: label "What I built" inline, then the sentences. Every number is set inline as `.val` inside its sentence. There are no figure tiles anywhere on the page.
- Links: text links ("Steam", "Play in browser", "Source"), 1px `--muted` underline at rest, 2px `--accent` on hover. External links get `rel="noopener"` and a visually hidden " (opens in a new tab)".

Plates (every raster): `border: 1px solid var(--line); background: var(--surface); overflow: hidden; aspect-ratio` declared; `<img>` with `width`, `height`, `loading="lazy"`, `decoding="async"`, `object-fit: cover`. No corner marks, no radius, no shadow, nothing overlaid on the image. Captions only where they add information: Archivo t-1, muted, below the plate, `margin-top: var(--s2)`.

#### Sheet A, lead plate with filmstrip: ChessTan

Desktop: plate spans columns 1 to 12: `img/work/chesstan-board.webp` (1600x900) with `chesstan-board-800.webp` as the 800w candidate, `sizes="(min-width: 1280px) 1200px, 100vw"`, cropped in CSS to `aspect-ratio: 21 / 9` with `object-position: 50% 45%` (about 480px tall at 1200; the board stays centred, the player panel stays at the left). Alt: "ChessTan mid-game: blue and red chess pieces on a hex board of yellow, blue, sand and brown tiles, with both players' resource panels at the left." Under the plate, `--s4` down, a filmstrip: three 16:9 plates in a row (`grid-template-columns: repeat(3, 1fr); gap: var(--s4)`), each about 360px wide at 1200, `sizes="(min-width: 1024px) 33vw, 80vw"`:
- `img/work/chesstan-capture.webp` (1600x900), alt "A capture in progress: a highlighted blue knight beside red pieces on yellow tiles, with End Turn at the bottom."
- `img/work/chesstan-lobby.webp` (1600x900), alt "The multiplayer lobby: relay server address, a room code to share, seats for 2 to 4 players, and a turn timer."
- `img/work/chesstan-victory.webp` (1600x900), alt "The victory screen: Player 1 (Blue) wins by capturing the enemy king, with army strength and kills for both players."
No captions on the filmstrip. Under the filmstrip, `--s7` down, the text strip on the 12-column grid: columns 1 to 4 hold title, lead, role, stack and links; columns 5 to 11 hold the problem and what I built (column 12 empty). Row gap `--s4`.

Copy, verbatim:

- Title: **ChessTan**
- Lead: **Hex-grid strategy: a settle-and-trade economy under chess-style movement and capture, for 2 to 4 players, hot-seat, against the AI, or online.**
- Role: **Solo developer. Design, rules engine, netcode, the relay server, and the Steam launch.**
- Stack (each item `.val`): **Godot 4.7, GDScript, WebSocket relay on Render.com, Steam, Discord Activity**
- The problem: **Two systems that usually live in different games share one board, so a good economy can still lose to a bad position. Online, the hard part is a player whose connection drops mid-turn: two clients that disagree about the board end the game, and a relay that forgets state loses the match.**
- What I built: **The game runs host-authoritative: one client owns the board and the relay carries the moves, so the players cannot desync. A dropped player reconnects and resyncs from the host's state instead of restarting. The same codebase ships as a Steam release, a browser build, and a Discord Activity. Free on Steam since 19 September 2026.** (`2 to 4` in the lead and the date are plain text; `Godot 4.7` and the stack are `.val`.)
- Links: **Steam** (https://store.steampowered.com/app/5099860/ChessTan/), **Play in browser** (https://darrenhuai.github.io/chesstan-web/).

Mobile: plate at `aspect-ratio: 16 / 9` (no crop), then the filmstrip as a horizontal scroll-snap row (`overflow-x: auto; scroll-snap-type: x mandatory; grid-auto-flow: column; grid-auto-columns: 80vw`), then title, lead, role, stack, the problem, what I built, links, in that order, one column.

#### Sheet B, unequal two-up: watchglass and Prediction Market Bot

Desktop: watchglass in columns 1 to 7, Prediction Market Bot in columns 8 to 12; each has its plate on top and the case block beneath (`margin-top: var(--s5)`). The 7/5 split gives two plate sizes on one row, which is the section's asymmetry.

watchglass plate: a play-once recording. `<video muted playsinline preload="metadata" poster="img/work/watchglass-demo-still.webp" width="960" height="640">` with `src="img/work/watchglass-demo.mp4"` (and an optional `img/work/watchglass-demo.webm` source first). Produce the MP4 from the vendored `img/work/watchglass-demo.gif` (960x640, 142 frames at 100ms, about 14 s): `ffmpeg -i img/work/watchglass-demo.gif -movflags faststart -pix_fmt yuv420p -vf "scale=960:640" -an img/work/watchglass-demo.mp4` (expected under 1 MB). The `muted` attribute stays in the markup so the script's `play()` is allowed by autoplay policy. Under the video, right-aligned, a real `<button type="button">` labelled **Replay** (1px `--ink-2` border, t-1, hidden until the recording has ended); under reduced motion the button reads **Play demo** and is visible from the start. Poster alt (on the video's `aria-label`): "watchglass region editor: a camera view of a printer status panel with the read region outlined and the decoded text PRINT COMPLETE beside it." Caption: **Demo recording, 14 seconds.** The GIF itself is not embedded anywhere.

Prediction Market Bot plate: `img/work/kalshi-opportunities.webp` (1440x900), `aspect-ratio: 16 / 10`, `sizes="(min-width: 1024px) 40vw, 100vw"`. Alt: "The bot's Opportunities tab: three market cards with the expected value per contract, an arbitrage group, and the balance and market count in the header." Caption: **The local web app in `--demo` mode.** (`--demo` in `.val`.)

Copy, verbatim:

- Title: **watchglass**
- Lead: **Some screens will never get an API. watchglass points a camera at them and reads the numbers.**
- Role: **Solo developer and maintainer. Public repo; v0.1.8 released 29 September 2026.**
- Stack: **Go, single binary, Docker (amd64, arm64, armv7), Tesseract OCR, MQTT**
- The problem: **Heat pump panels, 3D printers and bench scales show their state on a screen and nowhere else. The number is right there, and nothing on the network can read it.**
- What I built: **A single Go binary that watches one region of a camera frame per watch, reads it with OCR or a built-in seven-segment decoder, and fires on a pattern or a threshold. Alerts go out over ntfy, Discord, Telegram, Slack, Pushover, email, webhooks, or Home Assistant over MQTT. It runs in 55 MB of RAM with no GPU and ships as a Docker image for amd64, arm64 and armv7.** (`55 MB` in `.val`.)
- Links: **Source** (https://github.com/darrenhuai/watchglass).

- Title: **Prediction Market Bot**
- Lead: **A scanner that reads 300-plus live Kalshi markets every five minutes and emails me when one is worth a look.**
- Role: **Solo developer.**
- Stack: **Python, Kalshi REST API, RSA key auth, DuckDB, CI**
- The problem: **Kalshi prices move every few minutes across hundreds of markets, and the signal I wanted is in the trade flow, who is taking and at what average price, not in the last print. Watching that by hand does not scale.**
- What I built: **A Python service that authenticates with an RSA key, pulls every live market into a DuckDB pipeline, and scores trade flow by taker-side imbalance and VWAP. Email alerts on the outliers, and a local web app with Opportunities and Markets tabs that runs on demo data with a `--demo` flag, under CI.** (`300+`, `5 minutes` and `--demo` in `.val`.)
- Links: **Source** (https://github.com/darrenhuai/Prediction-market-bot).

Mobile: one column, watchglass first, each as plate then block.

#### Sheet C, split: Kinetic Analyzer

Desktop: the case block in columns 1 to 7; two portrait plates side by side in columns 8 to 12 (`grid-template-columns: 1fr 1fr; gap: var(--s5)`, each about 214px wide at 1200, `aspect-ratio: 390 / 844`, no device frame): `img/work/kinetic-results-phone.webp` (390x844) then `img/work/kinetic-analyse-phone.webp` (390x844). At 214px the 390px source is 1.8x; if a 780x1688 capture is made later (iOS Simulator at 2x, status bar cropped), drop it in with the same name. Alts: "Results screen: the wrist's path through a strike drawn over a dark trace and coloured by speed, with joint toggles and a speed build list for hip, shoulder and elbow." and "Analyse screen: sport, strike and stance selectors above a footage picker." One caption under the pair: **Results and set-up screens, iOS build.** This is the section's only image-beside-text split.

Copy, verbatim:

- Title: **Kinetic Analyzer**
- Lead: **Film a punch or a kick and get the kinetic chain back in milliseconds: hip, shoulder, elbow, fist.**
- Role: **Solo developer. App, pose service, and backend.**
- Stack: **Expo, React Native, TypeScript, Supabase, cloud pose service, TestFlight**
- The problem: **Coaches talk about the kinetic chain, but a phone clip of a strike only shows the result. To know whether the hip fired before the shoulder you need the timing of each joint, not a slow-motion replay.**
- What I built: **The app uploads a clip to a pose service, extracts joint positions, and returns kinetic-chain timing in milliseconds, a joint-speed ranking, rep consistency, balance, and coaching cues. Supabase holds sessions and progress. The iOS build is on TestFlight, and a web preview runs with `npm run web`.** (`npm run web` in `.val`.)
- Links: **Source** (https://github.com/darrenhuai/kinetic-analyzer).

Mobile: the two plates first as a horizontal scroll-snap row (each `62vw` wide, so the second peeks), then the block.

#### Earlier projects (text pair)

h3 **Earlier projects** (title instance, `--t1`), one 1px `--line` rule above the row, then two text entries in columns 1 to 6 and 7 to 12 (`padding-top: var(--s5)`). Each entry: name (title instance, `--t1`), one paragraph (body), a Stack line (`.val`), and a **Source** link. No plates, no placeholder, no generated image.

- **Petrarchan GPT**: **A GPT written from scratch in PyTorch and NumPy in under 200 lines: tokenizer, self-attention, feed-forward. Trained on Petrarch's sonnets to about 1.8 perplexity in 15 minutes on an RTX 4070; gradient checkpointing and mixed precision cut GPU memory 30% and training time 20%.** Stack: **Python, PyTorch, NumPy**. Source: https://github.com/darrenhuai/darrenhuai-GPT
- **GreetBot**: **A Python and TensorFlow greeting robot with face and gesture recognition at about 95% accuracy, and PID tuning so the servos land in the same place every time.** Stack: **Python, TensorFlow, PID control**. Source: https://github.com/darrenhuai/darrenhuai-GreetBot

Numbers in these paragraphs (`200`, `1.8`, `15 minutes`, `30%`, `20%`, `95%`) are `.val` inline. Mobile: stacked, `--s6` apart.

Composition rhythm across the section: full plate, two-up, split, text pair. One image-beside-text split on the whole page.

### 5.4 Open source (`#open-source`)

Family: data chart over two grouped ledgers.

h2 **Eleven pull requests merged upstream in September 2026** (`--t3`, `text-wrap: balance`, wraps to two lines at 1200). Lead, `--t1` ink-2, 62ch: **Fixes to two libraries under most Python tooling: platformdirs, which pip vendors, and virtualenv. Each entry links to the merged pull request.**

#### The merge-date axis

A `<figure>` spanning columns 1 to 12, `margin-block: var(--s6) var(--s7)`. Inside, an inline `<svg viewBox="0 0 1200 88" role="group" aria-labelledby="axis-caption">` (height 88px on desktop; `preserveAspectRatio="none"` is not used; the SVG scales with width and the markers keep their aspect because they are drawn in user units with `vector-effect: non-scaling-stroke`). `<figcaption id="axis-caption">` in Archivo t-1 muted, below: **Merge dates, September 2026. Filled marks are platformdirs, outlined marks are virtualenv.**

Geometry (user units, 1200 wide): x-axis line at y = 44 from x = 40 to x = 1160, 1px `--line`. Day scale: 1 September at x = 40, 30 September at x = 1160 (about 38.6 units per day). Day ticks every day, 4 units tall, `--line`. Labels in `.val` t-1 ink-2 under the line at Sep 1, Sep 8, Sep 15, Sep 22, Sep 29 (`text-anchor: middle`, y = 68). platformdirs merges: 12x12 filled `--accent` squares centred above the line at y = 30; virtualenv merges: 12x12 squares with a 1.5px `--accent` stroke and `--bg` fill centred below the line at y = 58. Same-day stacking: a second merge on the same day and side sits 16 units further from the line (y = 14 above, y = 74 below); this happens on 09-15 (two platformdirs above, two virtualenv below) and 09-09 (two virtualenv below).

The eleven records, in DOM order:

| Repo | Number | Date | Title (as printed) | URL |
|---|---|---|---|---|
| platformdirs | #537 | 2026-09-01 | Accept use_site_for_root in the bin functions | https://github.com/tox-dev/platformdirs/pull/537 |
| platformdirs | #538 | 2026-09-08 | Return one user path for root under multipath | https://github.com/tox-dev/platformdirs/pull/538 |
| virtualenv | #3229 | 2026-09-09 | Replace a stale symlink instead of writing through it | https://github.com/pypa/virtualenv/pull/3229 |
| virtualenv | #3230 | 2026-09-09 | Ignore a config file that fails to parse instead of crashing | https://github.com/pypa/virtualenv/pull/3230 |
| platformdirs | #544 | 2026-09-15 | Accept multipath in the site cache functions | https://github.com/tox-dev/platformdirs/pull/544 |
| platformdirs | #545 | 2026-09-15 | Read user-dirs.dirs as shell assignments, not INI | https://github.com/tox-dev/platformdirs/pull/545 |
| virtualenv | #3233 | 2026-09-15 | Restore PKG_CONFIG_PATH that was not set before | https://github.com/pypa/virtualenv/pull/3233 |
| virtualenv | #3234 | 2026-09-15 | Keep and restore the user's TCL_LIBRARY and TK_LIBRARY | https://github.com/pypa/virtualenv/pull/3234 |
| virtualenv | #3245 | 2026-09-17 | Undo a live activation before activate.bat saves values | https://github.com/pypa/virtualenv/pull/3245 |
| platformdirs | #550 | 2026-09-18 | Only create the site dirs a call hands back | https://github.com/tox-dev/platformdirs/pull/550 |
| platformdirs | #554 | 2026-09-22 | Ignore relative XDG user directory environment variables | https://github.com/tox-dev/platformdirs/pull/554 |

Every marker is an SVG `<a href="..." class="axis-marker">` containing a transparent 24x24 `<rect>` hit area centred on the visible 12x12 square (so the target meets the 24px minimum), the visible square, and a `<title>` equal to the accessible name, which is also set as `aria-label` on the `<a>`: "#544, accept multipath in the site cache functions, merged 2026-09-15". Focus: `.axis-marker:focus-visible rect.visible { stroke: var(--ink); stroke-width: 2px }` (outline on SVG anchors is unreliable, so focus is a stroke change). Hover: the visible square scales to 1.25 about its centre (`transform-box: fill-box; transform-origin: center`) and the `<title>` shows as the native tooltip. The markers are in DOM order of the table above.

Mobile (below 768px): the same SVG at full width; labels reduce to Sep 1, Sep 15, Sep 30 (the others get `display: none` via a class); markers stay 12 units visible with the 24-unit hit area (the SVG is 343 CSS px wide at 375, so a unit is 0.29px and the visible square is 3.4px: too small to read as data). Because of that, below 768px the axis is rendered at `viewBox="0 0 600 88"` with the same layout recomputed (day = 18.6 units, squares 10 units, hit rects 24 units), which the script selects by swapping the `viewBox` and marker positions from one data array. Simpler alternative that is also acceptable: hide the SVG below 768px (`display: none`, so it leaves the accessibility tree) and rely on the ledgers, which carry the same eleven links. The builder chooses; the first is preferred.

#### Two ledgers

Below the figure, columns 1 to 6 and 7 to 12, each with a 1px `--line` top rule and `padding-top: var(--s5)`. Header row: repo slug in `.val` t1 as a link (**tox-dev/platformdirs** to https://github.com/tox-dev/platformdirs; **pypa/virtualenv** to https://github.com/pypa/virtualenv), then the count on the same line in t-1 ink-2 (**6 merged** / **5 merged**), then one line in body ink-2: **Platform-correct user and site directories for Python programs.** / **Creates isolated Python environments; the library behind the virtualenv command.**

Then the PRs in groups. A group is a heading in Archivo 500 t0 ink (sentence case, not uppercase) followed by its entries; groups are `--s6` apart; entries are `--s4` apart; no per-row hairlines, no bullets. An entry is two lines: line one is `#537  2026-09-01` in `.val` t-1 ink-2 (two spaces between number and date, `white-space: pre`); line two is the title in body t0 as the link (1px `--muted` underline, `--accent` 2px on hover). Two entries carry a two-sentence explanation beneath the title in body ink-2, `margin-top: var(--s2)`, 58ch.

platformdirs groups and order:
- **Root and multipath handling**: #537, #538, #544.
- **Config and environment parsing**: #545, then its explanation: **user-dirs.dirs is a shell fragment, and platformdirs read it with ConfigParser: duplicate keys and stray lines crashed it, and escapes and trailing comments corrupted the paths. The fix parses it as shell assignments.** Then #554.
- **Filesystem side effects**: #550.

virtualenv groups and order:
- **Activation scripts**: #3233, #3234, #3245, then #3245's explanation: **Running activate.bat twice saved the already-modified PKG_CONFIG_PATH, TCL_LIBRARY and TK_LIBRARY as the originals, so deactivate leaked them. The fix undoes the live activation before saving.**
- **Robustness**: #3229, #3230.

Eleven entries in five groups across two columns; nothing here is a table. Mobile: the ledgers stack, platformdirs first; the entry format is unchanged.

### 5.5 Experience (`#experience`)

Family: ledger rows on a surface band. The section is full-bleed `--surface-2` (same theme, one tint darker; no other section uses a band). h2 **Experience**. Four rows, newest first, each `grid-template-columns: repeat(12, minmax(0, 1fr))` with a 1px `--line` rule above the row and `padding-block: var(--s6)`; no rule under the last row, no dots, no vertical line, no cards.

Per row: columns 1 to 4 hold the employer (title instance, `--t1`, ink), the role on the next line (body, ink-2), and the dates on a third line in `.val` t-1 ink-2, with the NASA row carrying the plain word **Current** after the dates in Archivo 500 t-1 ink (the only status word on the page). Columns 5 to 12 hold the paragraph (body, ink, `max-inline-size: 62ch`) with every number inline in `.val`.

Copy, verbatim:

1. **NASA Armstrong Flight Research Center** / Software Engineer Intern / `Aug 2026 - Dec 2026` **Current**. **Flight software on NASA's core Flight System for the High-Performance Spaceflight Computing processor: cFS apps and message-bus integrations in C, with Python benchmarking and regression testing across 30+ configurations. Python ETL for flight-test telemetry from the RAVEN eVTOL research aircraft. That pipeline cut manual processing time 45% across 12 flights.**
2. **iTradeNetwork** / Software Engineer Intern / `Jun 2026 - Aug 2026`. **A full-stack AI agent (LLM tool calling and API orchestration) that automates software-license lifecycle management across 500+ accounts, in React, Python and SQL, for 40% less manual effort. AI features in an enterprise SaaS platform through Python backend services and REST APIs across 5+ product modules, with 30% faster response times.**
3. **Mercor (Series C AI startup)** / Software Engineer / `Feb 2025 - Jun 2026`. **React client apps and REST integrations powering internal RLHF tooling. RLHF pipelines and evaluation workflows in Python, 40% faster processing. Benchmark accuracy on engineering and math tasks up 18% across 80+ model evaluations.**
4. **California Air Resources Board** / Data Engineer Intern / `Aug 2023 - Aug 2024`. **Ran an aftermarket-parts compliance program with 80+ manufacturers: reviews 30% faster and $120M+ of products to market. Refactored the MySQL, PHP and Drupal database infrastructure; queries 2.5 s faster.**

Inline `.val` strings: `30+`, `45%`, `12`, `500+`, `40%`, `5+`, `30%`, `18%`, `80+`, `$120M+`, `2.5 s`. Date ranges use a spaced hyphen.

Mobile: one column per row: employer, role, dates (and Current), paragraph; rows keep their top rule.

### 5.6 Skills (`#skills`)

Family: evidence matrix. h2 **What I have used, and where**. Lead, `--t1` ink-2: **Ranked by how much I have shipped with it. Each mark is a role or project on this page.**

Two renderings of one data set, never both visible: the matrix at 1024px and up, the list below 1024px (each hidden with `display: none` at the other size, so only one is in the accessibility tree).

Matrix (1024px and up): a real `<table class="matrix">` with `<caption class="visually-hidden">Skills by role and project</caption>`, `<th scope="col">` heads and `<th scope="row">` labels; add `role="table"`, `role="row"`, `role="columnheader"`, `role="rowheader"` and `role="cell"` explicitly so semantics survive any display change. `table-layout: fixed`; label column 168px; nine data columns share the rest (about 106px each at 1200, 86px at 1024). Heads: label instance at 13px (`--t-1` minimum), wdth 84, two lines at most, `hyphens: manual`, bottom-aligned; the longest single word ("iTradeNetwork") measures about 81px at 13px wdth 84. Rows separate by spacing (`padding-block: var(--s3)`), no horizontal grid lines; one 1px `--line` vertical rule between the label column and the marks; heads have a 1px `--line` rule beneath. A mark is a 12x12 `--accent` square (`.mark`, a `<span aria-hidden="true">`) centred in its cell; every marked cell also contains `<span class="visually-hidden">Yes</span>` so a screen reader hears "Python, NASA Armstrong, Yes". Unmarked cells are empty. Under the table, one sentence in body ink-2: **Also used: C++, Java, C#, Rust, MATLAB, Svelte, Node.js, AWS, Unity, Unreal, Tableau.**

Columns, in order: NASA Armstrong; iTradeNetwork; Mercor; Air Resources Board; ChessTan; watchglass; Prediction Market Bot; Kinetic Analyzer; Earlier projects (head text "Earlier projects" with a visually hidden " (Petrarchan GPT, GreetBot)").

Rows and marks (derived only from the brief and the resume; where use is not verifiable the cell stays empty):

| Skill (row head) | Marks |
|---|---|
| Python | NASA Armstrong, iTradeNetwork, Mercor, Prediction Market Bot, Earlier projects |
| C, cFS and embedded Linux | NASA Armstrong |
| JavaScript, TypeScript and React | iTradeNetwork, Mercor, Kinetic Analyzer |
| SQL (PostgreSQL, MySQL, DuckDB) | iTradeNetwork, Air Resources Board, Prediction Market Bot |
| Go | watchglass |
| GDScript and Godot | ChessTan |
| Docker and CI | watchglass, Prediction Market Bot |
| PyTorch and TensorFlow | Earlier projects |

List (below 1024px): a `<dl class="matrix-list">` with one `<dt>` per skill (Archivo 500, t0) and one `<dd>` (body, ink-2) naming the marks with full names, in this order, comma separated, ending with a period; Earlier projects expands to "Petrarchan GPT, GreetBot". Example: **Python**: NASA Armstrong, iTradeNetwork, Mercor, Prediction Market Bot, Petrarchan GPT, GreetBot. The same "Also used" sentence follows.

### 5.7 About (`#about`)

Family: title block. h2 **About**. Then the title block: a bordered cell grid spanning columns 1 to 12 (`display: grid; grid-template-columns: 3fr 3fr 3fr 3fr; border: 1px solid var(--line); background: var(--surface)`), cells separated by 1px `--line` rules (`gap: 1px; background: var(--line)` on the grid with `background: var(--surface)` on the cells), each cell `padding: var(--s4) var(--s5)` holding a label (label instance, t-1, ink-2) over a value (body, t0, ink). Every cell holds a fact.

- Row 1: Photo (column 1, spans rows 1 and 2; `img/pro_pic.jpg` 480x600 at `aspect-ratio: 4 / 5; object-fit: cover; width: 100%`, no border of its own, natural colour, alt "Darren Huai"); Name: **Darren Huai** (value at `--t1`); Based in: **Los Angeles, California**; Citizenship: **US citizen**.
- Row 2: Now: **Software Engineer Intern, NASA Armstrong Flight Research Center, through December 2026**; Education: **USC, M.S. Computer Science, May 2027** and on a second line **UCLA, B.S. Mechanical and Aerospace Engineering, computer science concentration, June 2024**; the fourth cell of row 2 is merged into Education (`grid-column: span 2`) so there is no empty cell.
- Row 3, spanning all four columns: the paragraph (body, ink, 68ch), verbatim: **I studied mechanical and aerospace engineering at UCLA, with a concentration in computer science, and moved into software through a data engineering internship at the California Air Resources Board. I spent sixteen months at Mercor on RLHF tooling, then a summer at iTradeNetwork building an AI agent for license management. I now write cFS flight software at NASA Armstrong and finish the M.S. in Computer Science at USC in May 2027.**

Certifications are omitted from the page (the linked resume does not list them; the page and the PDF stay in parity).

Mobile: one column; photo first at `max-width: 240px`; cells stack with top rules only (`border-top: 1px solid var(--line)`), the paragraph last.

### 5.8 Contact (`#contact`)

Family: single-statement strip, left-aligned in columns 1 to 8; columns 9 to 12 intentionally empty. h2 **Contact**. One line, `--t1` ink-2: **Looking for software engineering roles starting 2027. Email is fastest.** Then the primary button: the address **darrenhuai@gmail.com** as a `mailto:darrenhuai@gmail.com` link styled as the primary button at `--t2` (`.val`, `overflow-wrap: anywhere` as the phone-width safety net; 20 characters, one line at any desktop width). Beside it, `--s5` apart, text links **GitHub** (https://github.com/darrenhuai) and **LinkedIn** (https://www.linkedin.com/in/darrenhuai). The phone number does not appear anywhere.

Mobile: stacked; the email button is full width; the two links sit on one line beneath it.

### 5.9 Footer

Family: colophon line. One row under a 1px `--line` top rule, `padding-block: var(--s6)`, t-1 muted, verbatim: **Darren Huai, Los Angeles. HTML, CSS, JavaScript and three.js, no build step. Source on GitHub.** with "Source on GitHub" linking to https://github.com/darrenhuai/darrenhuai-Portfolio. No columns, no year, no version string, no locale strip (the city is the single permitted contact-address mention outside the title block). Mobile: the sentence wraps naturally.

### 5.10 CTA and copy audit

Intents and their single labels: portfolio ("See the work", hero only); resume ("Resume", hero secondary and nav); GitHub ("GitHub", nav and Contact); contact (the address itself, once); LinkedIn ("LinkedIn", once). Longest button label is the address at 20 characters. No label wraps at desktop. Every visible string on the page is in this document; anything not here goes through the copy self-audit (no "passionate", "seamless", "elevate", no greeting, no rule-of-three flourish, no dashes, no middle dots, no exclamation marks, no emoji).

---

## 6. Head, meta, favicon, CI gate

```html
<title>Darren Huai</title>
<meta name="description" content="Software engineer in Los Angeles. Flight software at NASA Armstrong, ChessTan on Steam, and merged fixes in platformdirs and virtualenv. M.S. Computer Science, USC, May 2027.">
<meta name="color-scheme" content="light dark">
<link rel="canonical" href="https://darrenhuai.github.io/darrenhuai-Portfolio/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://darrenhuai.github.io/darrenhuai-Portfolio/">
<meta property="og:title" content="Darren Huai">
<meta property="og:description" content="Flight software at NASA Armstrong, ChessTan on Steam, and merged fixes in platformdirs and virtualenv.">
<meta property="og:image" content="https://darrenhuai.github.io/darrenhuai-Portfolio/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Darren Huai, software engineer: a three-dimensional hex board from ChessTan beside the headline.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Darren Huai">
<meta name="twitter:image" content="https://darrenhuai.github.io/darrenhuai-Portfolio/img/og.png">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="img/hero-board-light.webp" media="(prefers-color-scheme: light)">
<link rel="preload" as="image" href="img/hero-board-dark.webp" media="(prefers-color-scheme: dark)">
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>
```

three@0.170.0 on jsdelivr was verified (package.json resolves; `.` exports `./build/three.module.js`, `./addons/*` maps to `./examples/jsm/*`).

Favicon `img/favicon.svg`: a 32x32 square filled with `#141b24` carrying the letters "DH" in `font-family: Arial, sans-serif; font-weight: 700` in `#f0f4f7`, with an embedded `@media (prefers-color-scheme: dark)` rule that swaps the two colours. A wordmark in type, not a drawn icon. `img/og.png` 1200x630: a Playwright screenshot of the built hero in the dark theme at 1200x630 (`page.emulateMedia({ colorScheme: "dark" })`, `page.setViewportSize({ width: 1200, height: 630 })`).

Deploy gate (add to `.github/workflows/deploy-pages.yml` after checkout, before `configure-pages`):

```yaml
      - name: Copy gate (no em or en dashes, no middle dots, no greeting)
        run: |
          if grep -nP '[\x{2013}\x{2014}\x{00B7}]' index.html; then echo "dash or middle dot found"; exit 1; fi
          if grep -n 'Hi, I' index.html; then echo "greeting found"; exit 1; fi
          if grep -c 'fonts.googleapis.com' index.html | grep -qv '^0$'; then echo "runtime Google Fonts link found"; exit 1; fi
```

---

## 7. Imagery plan

Assets already in the repo under `img/work/` (verified 2026-09-29 with their pixel sizes). Every plate follows section 5.3's plate rule. Nothing is overlaid on any image. No stock, no picsum, no generated imagery, no mock-ups built from divs.

| Slot | File(s) | Native size | Shown | Treatment |
|---|---|---|---|---|
| Hero, live | Three.js canvas (section 8) | DPR up to 1.5 | 4:3 box, columns 7 to 12 bleeding right | no frame, transparent clear colour |
| Hero, still | `img/hero-board-light.webp`, `img/hero-board-light-800.webp`, `img/hero-board-dark.webp`, `img/hero-board-dark-800.webp`, plus `.png` twins of the 1600 files | 1600x1200 and 800x600 | same box | exported from the scene at its idle pose in each theme (section 8.6); `<picture>` chooses by scheme; preloaded by scheme; alt "A three-dimensional hex board from ChessTan, tiles in yellow, blue, sand and brown, with chess pieces standing on it." |
| Open Graph | `img/og.png` | 1200x630 | | screenshot of the built dark hero |
| ChessTan plate | `img/work/chesstan-board.webp` (+ `chesstan-board-800.webp`) | 1600x900, 800x450 | 12 columns, 21:9 crop | source: store_assets/steam/screenshots/01_hero.png |
| ChessTan filmstrip | `img/work/chesstan-capture.webp`, `chesstan-lobby.webp`, `chesstan-victory.webp` | 1600x900 each | three 16:9 plates, one third width | sources: 03_capture_highlight.png, 07_multiplayer_lobby.png, 09_victory.png; generate 800w twins (`-800.webp`) for srcset |
| watchglass plate | `img/work/watchglass-demo.mp4` (make from `watchglass-demo.gif`), poster `watchglass-demo-still.webp` | 960x640 | 7 columns, 3:2 | play-once video with Replay; poster under reduced motion |
| watchglass reserve | `watchglass-dashboard.webp` 1160x587, `watchglass-sevenseg.webp` 1160x900, `watchglass-region-editor.webp` 1160x900 | | not placed | available if the video fails a review; sevenseg is the first substitute |
| Prediction Market Bot plate | `img/work/kalshi-opportunities.webp` | 1440x900 | 5 columns, 16:10 | `kalshi-markets.webp` and `kalshi-tall.webp` stay unused |
| Kinetic Analyzer plates | `img/work/kinetic-results-phone.webp`, `kinetic-analyse-phone.webp` | 390x844 each | two portraits, about 214px each | `kinetic-home-phone.webp` and `kinetic-results-desktop.webp` stay unused |
| Portrait | `img/pro_pic.jpg` | 480x600 | title-block cell, 4:5 | natural colour, no border of its own |
| Not used, on purpose | `img/work/chesstan-capsule.webp`, `chesstan-logo.webp` | | | the capsule's indigo-to-orange sunset is the gradient family the brief bans and it reads as an ad; the case-sheet title is text |

Petrarchan GPT and GreetBot have no imagery and get none: text entries under Earlier projects. If a real photograph of the GreetBot robot exists later, it becomes a 4:3 plate in that entry; nothing else is added.

Weight budget above the fold: Archivo about 100 KB, hero still about 120 KB (WebP), three.js module about 150 KB gzipped loaded after first paint; everything else lazy.

---

## 8. Motion and the hero integration contract

All motion is `transform`, `opacity` or `clip-path`; easing `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out`); no scroll listener anywhere; the only loop is the hero idle. Durations: `--dur-fast: 120ms; --dur-base: 160ms; --dur-reveal: 600ms; --dur-canvas: 300ms`.

### 8.1 Load choreography (about 1.1 s)

1. 0 ms: nav fades in over 200 ms. Reason: the frame appears before the drawing.
2. 80 ms: the h1's lines reveal with a `clip-path: inset(0 100% 0 0)` to `inset(0)` wipe, 420 ms, the second line 90 ms after the first, like a plotter drawing a line (wrap each line in a `<span>` after layout, or apply the wipe to the whole h1 as one block if line splitting proves fragile). Reason: hierarchy.
3. 320 ms: subtext, then the buttons, rise 12px and fade in over 360 ms, 80 ms apart. Reason: reading order.
4. 200 to 1100 ms: the board appears as amber wireframe edges and fills to shaded hexes ring by ring from the centre (18 ms per ring), pieces settling last with a 6px drop. Reason: storytelling; the drawing becomes the object. This is the page's single cinematic beat.

### 8.2 Scroll reveals (IntersectionObserver, `threshold: 0.25`, `rootMargin: "0px 0px -10% 0px"`, fire once, then `unobserve`)

- Plates: `clip-path` wipe from the left over 600 ms; the sheet's text blocks then fade and rise 10px with a 40 ms stagger. Reason: the image is the subject and lands first.
- Date axis: the axis line draws left to right (`stroke-dashoffset`, 500 ms), then markers pop in date order (scale 0.6 to 1, 40 ms apart). Reason: the eleven merges are read chronologically.
- Matrix: marks fade in row by row, 30 ms per row. Reason: it shows the ranking top-down and signals the marks are data.
- Experience rows, About block, Contact: one fade-and-rise of the section content, 400 ms. Reason: continuity.
- Nav current-section state: a second observer (`rootMargin: "-40% 0px -55% 0px"`) on the seven sections. Reason: state.

### 8.3 Hover and active

- Buttons: `translateY(-1px)` on hover, `scale(0.98)` on active, 160 ms; the primary fill moves to `--accent-hover`; the secondary border steps from `--ink-2` to `--ink` and the background to `--surface`.
- Text links: underline from 1px `--muted` to 2px `--accent`, 120 ms.
- Plates: image scales to 1.02 inside the clipped frame, 300 ms.
- Nav links: `--muted` underline slides in from the left, 120 ms; the current section holds the `--accent` underline.
- Axis markers: scale 1.25, 120 ms, with the `<title>` tooltip.
- Replay: colour change only.

### 8.4 The watchglass recording

An observer (`threshold: 0.5`, once) calls `video.play()` when the plate is half visible; `ended` reveals the Replay button; Replay calls `currentTime = 0; play()`. The video never loops. Under reduced motion no observer is attached; the poster shows with a visible "Play demo" button that starts playback on demand.

### 8.5 Reduced motion, no WebGL, constrained devices

Under `prefers-reduced-motion: reduce`: every `animation` and `transition` is removed (`animation: none; transition: none`), the reveal classes are applied at load so nothing is hidden, the h1 renders complete, the hero `<picture>` stays and three.js is never requested, the recording shows its poster with "Play demo", hover states fall back to colour changes only. The static hero path is also taken when `!window.WebGLRenderingContext` or `canvas.getContext("webgl2") || canvas.getContext("webgl")` returns null, when `navigator.connection && navigator.connection.saveData`, and when `navigator.deviceMemory && navigator.deviceMemory < 4`.

### 8.6 Hero scene contract (for the scene track)

- Module: `js/hero-scene.js`, an ES module importing `three` from the import map; dynamically imported by `js/main.js` (`import("./hero-scene.js")`) only after the gates in 8.5 pass and after `window.requestIdleCallback` (or a 1 s timeout fallback) so it never competes with first paint.
- Mount: `#hero-canvas-box` (the 4:3 box). The module creates `<canvas>` absolutely positioned over the `<picture>` (`inset: 0; width: 100%; height: 100%; opacity: 0; z-index: var(--z-canvas)`), renders the first frame, then sets opacity 1 over 300 ms. The picture stays underneath; there is never a blank frame.
- Size: the box's CSS size, `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))`, resized on `ResizeObserver` of the box.
- Renderer: `alpha: true`, `antialias: true`, `renderer.setClearColor(0x000000, 0)` so the page bg shows through; `renderer.outputColorSpace = THREE.SRGBColorSpace`.
- Colour hooks: read `getComputedStyle(document.documentElement).getPropertyValue("--accent-hex")` and the `--tile-*-hex`, `--piece-*-hex`, `--line-hex` twins at init; subscribe to `matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ...)` and re-read them, updating material colours in place. Tile fills: the five tile hexes; tile edges: `--line-hex`; hovered hex edge: `--accent-hex`; pieces: `--piece-blue-hex` and `--piece-red-hex`, flat-shaded low-poly silhouettes of the game's knight, tower and settlement.
- Geometry: a radius-3 hex board (the game's layout), extruded flat hexes with 2px bevel, about forty merged meshes plus six pieces; no post-processing, no bloom, no shadows maps (one directional key light warmed toward `--accent-hex` at 20% mix, one cool hemisphere fill).
- Camera: 35 degrees elevation, framed so the board fills 80% of the box width at rest, slightly right of centre so the bleed edge cuts the board's right rim.
- Interaction: `pointermove` on the hero section only (never `window`, never scroll): the board tilts up to 6 degrees toward the pointer, lerped at 0.08 per frame; the hex under the pointer (raycast) lifts 4px with an accent edge, eased 120 ms; on touch, tilt from the last touch point and skip the lift. Idle: yaw 0.02 rad/s, the page's only loop.
- Pausing: the RAF loop stops on `visibilitychange` (hidden) and when an IntersectionObserver on the box reports the hero out of view (`threshold: 0`), and resumes on the inverse; `pagehide` disposes the renderer.
- Stills: `hero-board-light.png` and `hero-board-dark.png` are exported from this same scene at the idle pose (t = 0 after the load beat) at 1600x1200 using `renderer.domElement.toDataURL()` from a one-off export flag (`?export=1`) in each colour scheme, then converted to WebP (`cwebp -q 82`) and resized to 800x600 twins. Fallback and live frame are the same picture.
- Fallback markup in `index.html`:

```html
<div id="hero-canvas-box" class="hero-canvas">
  <picture>
    <source media="(prefers-color-scheme: dark)" type="image/webp" srcset="img/hero-board-dark.webp 1600w, img/hero-board-dark-800.webp 800w" sizes="(min-width: 1024px) 52vw, 100vw">
    <source media="(prefers-color-scheme: dark)" type="image/png" srcset="img/hero-board-dark.png">
    <source type="image/webp" srcset="img/hero-board-light.webp 1600w, img/hero-board-light-800.webp 800w" sizes="(min-width: 1024px) 52vw, 100vw">
    <img src="img/hero-board-light.png" width="1600" height="1200" alt="A three-dimensional hex board from ChessTan, tiles in yellow, blue, sand and brown, with chess pieces standing on it." fetchpriority="high" decoding="async">
  </picture>
</div>
```

LCP is the preloaded hero still or the h1, never the canvas.

---

## 9. Build-time checks (mechanical)

1. `grep -nP '[\x{2013}\x{2014}\x{00B7}]' index.html styles.css js/*.js docs/design/*.md DESIGN.md` returns nothing.
2. `grep -c box-shadow styles.css` = 0; `grep -c gradient styles.css` = 0; `grep -c backdrop-filter styles.css` = 0; `grep -c border-radius styles.css` = 0; `grep -c "text-transform: uppercase" styles.css` = 0.
3. `grep -n "font-mono" styles.css` returns exactly the `.val` rule.
4. `grep -n "var(--accent)" styles.css` returns only the rules listed in 2.3.
5. `grep -n "addEventListener('scroll'\|addEventListener(\"scroll\"" js/*.js index.html` returns nothing.
6. `grep -c "<svg" index.html` equals 1 (the axis); `grep -c "<img" index.html` equals 9 (hero still, ChessTan plate, three filmstrip, Prediction Market Bot, two Kinetic, portrait; none for Earlier projects; adjust only if a GreetBot photo is added).
7. Nav items count: 8; eyebrow count: 0 (`grep -c "eyebrow" index.html` = 0).
8. Every `<img>` has `width`, `height` and `alt`; every image below the fold has `loading="lazy"`.
9. Lighthouse on the deployed page, mobile: LCP under 2.5 s, CLS 0, no accessibility failures; run in both colour schemes.
10. Keyboard pass: Tab reaches skip link, wordmark, eight nav links, two hero buttons, every plate link, eleven axis markers, eleven ledger links, Replay, the email button, GitHub, LinkedIn, Source on GitHub; Escape closes the menu and returns focus.

## 10. Pre-launch checklist (owner-gated)

1. Resume parity. `Darren-Huai-Resume.pdf` (1 page, extracted 2026-09-29) contains NASA Armstrong, iTradeNetwork, Mercor, CARB, ChessTan, the Kalshi bot, the personal GPT and the 2027 date, but not platformdirs, virtualenv, watchglass, Kinetic Analyzer, GreetBot, or "US citizen", and it describes ChessTan as "2-player" and "hundreds of new and concurrent players" where the page says 2 to 4 players. Before the Resume link ships: re-export the resume with an open-source line (eleven merged PRs in platformdirs and virtualenv, September 2026), the watchglass project, and "2 to 4 players", so the page never claims what the PDF does not.
2. Confirm every Role line (all four case sheets say "Solo developer"); if a project had collaborators, replace the line with what Darren did.
3. Confirm the skills marks table in 5.6 against the resume once more; empty cells stay empty.
4. Produce: font subsets (3.2), `watchglass-demo.mp4`, the filmstrip 800w twins, the hero stills (8.6), `og.png`, `favicon.svg`.
5. Run the checks in section 9 and the deploy gate in section 6.

---

## Appendix A. Grafts taken and rejected

Taken:
- Resume as the hero secondary CTA and a nav item; GitHub as the last nav item (hiring manager, builder). The brief says recruiters decide whether to open the resume or GitHub; D1 linked neither above the fold.
- Thematic grouping of the eleven PRs with D3's group headings verbatim and per-repo counts; D2's two featured explanations placed inline under #545 and #3245 rather than as a separate featured block, so no PR appears twice (hiring manager, builder).
- Skills as D1's matrix (the fuller form the hiring manager offered), with the evidence rule that unverifiable cells stay empty; the list form is the sub-1024 rendering, not a CSS transform of the table.
- D1's title block as the label/value row at the top of About (hiring manager's graft is already D1's device).
- The merge-date axis, kept, with the accessible-name pattern and 24px hit areas (art director, builder).
- Three sentences for the NASA and Mercor rows and the plain word "Current" (hiring manager, builder, art director; from D4 and D2).
- D4's lead lines for watchglass and Kinetic Analyzer verbatim, and its ChessTan sentence "so a good economy can still lose to a bad position"; the Prediction Market Bot lead adapted (art director).
- Numbers inline inside sentences everywhere; D1's figure block and B612 Mono 700 removed (art director's D3 fatal applies to D1's `.fig` block equally).
- The deploy-time grep gate (art director, builder; from D2).
- The watchglass recording as a play-once MP4 with a real Replay button and a reduced-motion poster (art director; D1 already had it).
- IntersectionObserver pause of the hero loop, saveData and deviceMemory gates, stills exported from the same scene (art director, builder; from D2 and D4).
- Twin hex custom properties for the scene, two theme stills, `<picture>` with media, preload by scheme, `aspect-ratio` box, canvas cross-fade (builder).
- The ChessTan filmstrip from the three real stills, as a scroll-snap row on phones (builder; from D2). The files the hiring manager flagged as invented names now exist in `img/work/` and are mapped to their sources in section 7.
- A `size-adjust` fallback face for Archivo and `overflow-wrap: anywhere` on the email button (builder; from D3).
- Equal-treatment experience rows in place of D1's featured-plus-stack, so Mercor's sixteen months is not a sidebar entry (hiring manager; from D2 and D4).

Rejected:
- The Steam main capsule as box art beside the ChessTan links (hiring manager's optional graft). Its indigo-to-orange sunset is the gradient family the brief bans, and the board still plus the Steam link are already proof of a shipped title. `chesstan-capsule.webp` stays in the repo unused.
- D2's blurred nav (`backdrop-filter`): a hard ban in the brief and impeccable.
- D2's trailing ArrowUpRight glyphs and Phosphor icons: the page has no icons; the arrow is a recognised tell.
- D3's 30-column CSS grid merge strip: 4px marks on a phone fail the target minimum; the SVG axis with a phone `viewBox` replaces it.
- D4's grain overlay, token tray and sticky spec rail: a 2025 premium tell, chip soup, and a dashboard read respectively; D1's case sheets already hold role, stack and links beside the image.
- D3's width-axis load animation on the name: it relayouts the largest text on the page for 900 ms and is on the redesign skill's own upgrade list.
- D2's "Tools" label and Skills folded into About: recruiters find-in-page for "Skills"; it stays a nav item and an h2.
- D1's own corner registration marks on plates: the art director read them as the modal 2025 technical ornament and D1 said the direction survives without them; it does.
- D1's Contact heading "Looking for a new-grad engineer for 2027?": a question hook; replaced with "Contact" and one plain line.
- Certifications cell: omitted for parity with the PDF.

## Appendix B. Fatals and their fixes

Builder (on D1):
1. Single hero PNG for two themes, no preload, no aspect box: fixed in 8.6 and 5.2 (two stills per format, `<picture>` by scheme, preload with media, `aspect-ratio: 4 / 3`, cross-fade).
2. Matrix via `display: block` rows and `content: attr()`: fixed in 5.6 (two renderings, explicit roles, hidden "Yes" text, nine columns sized for 1024, breakpoint at 1024).
3. Resting link underline at 1.42:1: fixed (1px `--muted`, 4.95:1 worst case; accent on hover).
4. 10px axis markers as links: fixed (24x24 hit rects, focus as a stroke change, phone viewBox).
5. PNG captures at 0.6 to 1.5 MB: all plates are the WebP files already in `img/work/`; 800w twins for srcset.
6. Loop only paused on visibilitychange; Replay not a button: fixed in 8.4 and 8.6.

Hiring manager (D1's weak points and the fatals that transfer):
1. No resume link, GitHub only in Contact: fixed (hero secondary, nav).
2. Mercor shrunk to a sidebar: fixed (four equal rows, three sentences for NASA and Mercor).
3. Case sheet A as three text columns reads as a spec sheet: fixed (title and spec in four columns, the two paragraphs in seven).
4. Resume claims and page claims disagree: pre-launch item 1.
5. Filmstrip file names invented: mapped to real files.
6. Degree in the subtext must survive edits: rule stated in 5.2.

Art director (D1's tells and the D3 fatals that transfer):
1. Corner registration marks: removed.
2. Figure tiles with `2 to 4` and a date as big numbers: removed; numbers inline.
3. Title block as a metadata grid: kept, reduced to facts a screener needs, no certifications cell, paragraph inside it.
4. "X at NASA. Y on Steam." two-fragment cadence shared by three directions: replaced by a first-person sentence with a verb; the Steam fact moves to the subtext.
5. "looks easy until" setup and "Los Angeles is home." flourish: cut; About rewritten as three plain chronological sentences.
6. Display ceiling: the h1 tops out at 48px, under 6rem.
7. Question-hook heading in Contact: replaced.

## Appendix C. Pre-flight (taste-skill Section 14), run against this specification

Brief inference declared (section 1); dials reasoned; aesthetic labelled honestly (native CSS, no design system); redesign mode overhaul with the retired list in section 1. Zero em-dashes, en-dashes and middle dots in this file and in every visible string (grep-verified after writing; CI-gated). One theme by `prefers-color-scheme`, the Experience band is `--surface-2` inside the theme. One accent, with a grep-enforced list of uses. Radius 0 everywhere, grep-enforced. Button contrast 5.32:1 and 9.17:1; secondary is ink on bg. No CTA wraps (longest is 20 characters). No forms. No serif. Not a premium-consumer brief; no cream, no brass. No italics. Hero: two-line h1 at 48px in an 18ch measure, 20-word subtext, buttons in view at 375x812 and 360x640, top padding at most 5rem, three text elements, no eyebrow, no tagline, no trust strip. Eyebrows: 0 of a permitted 3. No split header. One image-beside-text split on the page. No duplicate CTA intent. No logo wall, bento or marquee. Copy self-audit done on every string in section 5. Every animation carries a reason in section 8. Nav on one line at 1024, 64px. Nine sections, nine families. Long lists: eleven PRs as five groups in two columns; eight skills as a matrix with a list rendering. Real images: five plates, three filmstrip stills, two phone captures, one recording, one portrait, one live scene, no div screenshots, one SVG that is a data chart. No pills on images, no photo-credit captions, no version footer, no micro-meta sentences, no decoration strip, no floating corner text, no progress bars, no locale strip (one contact-city mention in the footer, one in the title block), no scroll cue, no version label, no numbered eyebrows, no decorative dots (marks and markers are data), no top-plus-bottom borders on rows. Content density: leads at most 25 words, case paragraphs at most 60 words. No quotes. Motion claimed equals motion shown. No scroll listener. Reduced motion collapses everything. Dark tokens proven. Mobile collapse stated for every section. `100dvh` only. Observers unobserve after firing; the renderer disposes on pagehide. Loading and error states: the hero still is the canvas's loading and error state; the poster is the recording's. Cards omitted. Icons: none. Core Web Vitals plausible (preloaded font and still, aspect boxes, deferred three.js). One system: none.

## Appendix D. Build notes (2026-09-30)

Where the built page departs from this document, and why:

- Mono face: Geist Mono (400 to 500, subset) replaces B612 Mono. B612's punctuation sits at the left of its cell, so inline strings read as "4. 7" and "v0. 1. 8".
- Inline figures in prose use the sans face at weight 600 with tabular figures (`.num`) instead of the mono `.val`. `.val` is kept for stack lists, repo slugs, pull request ids and dates, CLI strings, employment dates and the email address.
- The ChessTan lead plate is shown at 16:9 on every width. The 21:9 crop cut through the game's side panels.
- Image wipes clip the image inside the plate rather than the plate. Chromium's IntersectionObserver treats a fully clipped target as not intersecting, so a clipped plate never revealed.
- The hero h1 scales from 34px to 52px (two lines at 390px and at 1440px).
- The hero scene is the hand-built `js/hero-scene.js`: terrain tints are derived from the accent, with soft shadow maps, at 19.5k triangles and 35 draw calls. The canvas box carries an alpha mask so the ground grid fades out before the box edge; those mask gradients are the only gradients in `styles.css`.
- The merge-date axis is one SVG at every width. Below about 900px it scrolls sideways inside its figure, so the marks keep a usable target size.
- Kinetic Analyzer has no Source link because that repository is private.
- The Contact line reads "Open to software engineering roles. Email is fastest."
- The nav collapses to the Menu button below 920px, where eight links stop fitting on one line.

## Appendix E. Review round (2026-09-30)

Three reviewers (art direction, accessibility and code, hiring-manager fact check) audited the first build. Changes made:

- Copy checked against the linked repositories. Petrarchan GPT now describes what the repo contains, with no training-speed or perplexity figures. GreetBot is credited as a 14-person UCLA club project. The Prediction Market Bot credits Jonathan Becker's framework it is built on and claims only the scanner, alerts, web app and tests. The Kinetic Analyzer link was removed because the repository is private.
- The hero says "Flight software intern at NASA." Experience moved directly under the hero, with first-person verbs in every role. US date format and spelling are used throughout.
- The resume PDF and every link to it were removed, because it disagreed with the page and printed a phone number. The hero's secondary button is now GitHub.
- Skills: the "ranked by" claim is gone, Docker and CI are split, PyTorch replaces "PyTorch and TensorFlow", and Kinetic Analyzer marks were added where its code shows them.
- Chart: same-day marks have a 28-unit pitch so their 24px targets no longer overlap, labels are 15 units, and there is a sideways-scroll hint below 1120px. Phones get a compact whole-month drawing with no links; the ledgers carry them.
- Hero scene: the ring halo, pulse and dust were removed, and ore tiles are slate instead of violet. Stills and og.png were re-exported.
- Imagery: the lead ChessTan frame lost its status toast (top crop) and a stray resource icon over "Player 2". The victory still is cropped to its modal, the lobby to its panel, and the Kalshi capture to the app column (15:14, so the two-up plates match in height). The portrait is cropped closer and brightened. Light captures are dimmed in the dark theme.
- Behaviour: the wordmark scrolls to the top. Contact becomes current at the page end. The demo button toggles pause, play and replay and keeps focus. Scroll regions are tab stops only while they scroll. The menu closes when focus leaves it. The no-JS nav and video work. Print shows all content. Wipe-revealed images are fetched before the wipe. The hero preload matches the picture's candidates. three.js loads the minified build. A lost WebGL context falls back to the still. Forced-colors mode shows matrix marks.

## Appendix F. Portrait hero and project pages (2026-09-30)

At Darren's request the front page now keeps his photo and the usual intro, and the projects are clickable instead of laid out in full.

- Hero: name, role line, the 20-word subtext, See the work and GitHub, then the email address and LinkedIn. The portrait sits in columns 9 to 12, framed by a 1px line. On phones it sits above the name.
- The three.js board moved from the hero to the ChessTan card cover. It loads only when the card is within about a screen of the viewport, and tilts with the pointer anywhere on the card.
- Projects: one 12-column grid of linked cards in rows of 7 and 5, 5 and 7, then 6 and 6 (the last two have no cover). Each card is a single link, a stretched anchor on the title, with a View project cue.
- Project pages (`projects/<slug>.html`) are generated by `tools/build_projects.py` from one data list. Each page has a back link, a title and lead beside a facts grid, a lead image, recording, image pair, phone pair or model-settings grid, sections on the problem and the build, an optional screenshot gallery, and previous and next links.
- About lost its photo cell (the photo is in the hero). It is now a three-column fact grid with the bio below.
- Open source: the two ledgers sit behind a Show all eleven pull requests toggle under the chart. The chart's marks still link to each pull request.

## Appendix G. Resume (2026-10-05)

- `resume.html` shows the PDF itself (`Darren-Huai-Resume.pdf`, the September 21, 2026 export) embedded in a Letter-proportioned frame, with Download the PDF and Open in a new tab above it. Browsers that cannot embed a PDF inline (most Android browsers) get a rendered image of the page inside the object element instead, made with pypdfium2 at `img/resume-page-1.webp`.
- The PDF is linked from the resume page, the front page's Resume band (between Skills and About), the hero's secondary button, and a Resume item in the nav on every page. GitHub moved into the hero's link row.
- `index.html` carries Person structured data (schema.org JSON-LD).

## Appendix H. Reading as hand-made (2026-10-05)

Darren's note: it still looked AI-made. What changed, all in the direction of plainer and more personal:

- Copy is first person and conversational: the hero says what he does and where in three sentences; the open-source intro says what he did in September and why; About is two paragraphs, not a grid of facts; Contact is "Get in touch".
- The systems are gone: no skills matrix, no merge-date chart, no details toggle, no title block. Skills are a short grouped list, open source is two plain lists of pull requests, About is prose.
- Numbers sit in sentences as ordinary text (no bold figures, no mono dates). Mono is reserved for real code.
- Headings and the wordmark use the normal width of Archivo instead of the semi-expanded instance; corners have a 6px radius.
- Nav dropped Skills. Footer: "Made by hand with plain HTML and CSS."
- The resume page embeds the PDF itself in a Letter-proportioned frame, with a rendered image of the page as the fallback for browsers that cannot embed PDFs.

## Appendix I. The owner's palette, and more life (2026-10-05, evening)

Three requests in one sitting: "why is my picture so fuzzy", "the website seems a little boring, use the connectors and GitHubs I've told you about, give it more life", "add the portfolios so it matches my GitHub", and, with a screenshot of the first version of the site, "I also liked this colour scheme, go back to this please".

**The portrait.** The committed `img/pro_pic.jpg` was a 480x600 photo upscaled to 600x750. The 1440x1800 original was in Downloads. It is now a 960x1200 crop served through a `picture` element (480 and 960 wide, webp and jpg) with a matching `imagesrcset` preload. `img/og.png` was retaken from the new hero.

**The palette.** The first version's tokens came back from the `v1-pre-redesign` tag: cream `#faf8f5`, violet `#5b3df0`, amber `#f0a63c`, the lavender wash and two drifting blobs behind the hero, the violet-to-amber gradient on the name and around the portrait, pill buttons with the violet glow, lavender pill links, a status pill with a green dot, 14px card radius with a gradient rule along the top, a translucent blurred nav. A dark variant was derived (ink-violet ground, the same violet and amber). The OKLCH block is gone; `DESIGN.md` was rewritten. The blobs drift only at 900px and up, and everything is static under reduced motion. The hand-made copy rules from Appendix H still hold.

**More life, from real assets.** A four-designer, three-judge panel ran on a brief built from the GitHub and Steam inventory. The winning direction ("real things, dated") and the grafts the judges agreed on:
- The ChessTan page opens on the Steam trailer, self-hosted, muted, cut to start on the board (15 seconds, 1280x720, about 180 KB), with "Play it in your browser" and "Free on Steam" buttons under the lead, and a six-frame gallery in the order a match happens, captioned only from what is on each frame.
- The watchglass card plays its 14-second recording on hover (fine pointers) or once in view (touch); the video element is created by JS only when the card is near, so no-JS, reduced-motion and print keep the still.
- Every card lead gained a second sentence saying why the project exists, each lifted from that project's own page copy.
- The open-source section tells the true scale: 26 merged pull requests in seven projects since August 2026, all 11 virtualenv and 10 platformdirs fixes listed in merge order, the five one-offs and six open ones in one sentence, and a real excerpt of the platformdirs 545 diff with four of its thirteen test cases. The data lives in `tools/build_projects.py` and the block is generated between `oss:start` and `oss:end`.
- A dated paragraph in About ("As of October 2026") says what is in progress; the watchglass Released fact carries the release cadence; the meta descriptions carry the count.
- "Also on my GitHub" lists the five smaller public repositories under the cards, because the owner asked for the site to match his GitHub.

**Rejected by the judges, and not built:** the Steam store widget iframe, the Godot web build inside an iframe (47 MB), a GitHub contribution heatmap, star counts beside every project, a hand-sketched relay diagram, a nine-row release changelog, a Now band, a colophon, copy buttons on code blocks, per-item merge dates in the lists (the lead carries the first and last dates instead), and a resume thumbnail.

**Flagged to the owner:** the judges read the palette and the small-repos list as risks against Appendix H; both were his explicit requests and shipped as asked. They also asked whether qutip-qtrl 61 should stay in the count, and whether the browser build of ChessTan (last pushed 2026-09-01, older than the Steam 1.0.1 patch) will stay up, since the hero, the project page and the small-repos list link it.

## Appendix J. The editorial page (2026-10-06)

Darren pointed at arlenmccluskey.com: "could you just copy it, but with my purple-blue colour scheme and my projects; I like the UI you did for ChessTan; have the same sections as before." So the page was rebuilt in that language, on the same content and the same generated data:

- **Type.** Playfair Display (variable, OFL, self-hosted, subset) for the h1, section titles and row titles, in place of the reference's Superior Title. Geist Mono, now with its full weight range, for every other word, in place of Pitch Sans. Archivo is no longer used.
- **Structure.** A static top bar ("DH" and five mono links). A hero with the two-line serif greeting, two mono paragraphs with bold emphasis, four mono links, and the wash with a 9x9 canvas of tick marks that lean with value noise (`js/field.js`). A full-width hairline. Then the same sections as before: Experience, Work, Open source, Skills, Resume, About, and the sign-off, all as numbered rows with a vertical divider, a horizontal rule and a mono one-liner, and the media or the body on the right.
- **Work rows.** Each row is one link to its project page. The media plate per project: the live three.js board (kept, as asked), the watchglass still that plays its clip on hover, a screenshot, the two phone captures, a spec sheet for Petrarchan GPT, and a few lines of code for GreetBot. "Also on my GitHub" follows the rows.
- **Colour.** The reference's orange-to-red washes became violet, blue and magenta; rules and text are ink; links turn violet on hover. A dark theme was derived.
- **Kept from the hand-made pass.** First-person copy, the dated About paragraph, the full open-source record and the diff excerpt, the portrait (now in About, as a plate), the embedded resume, the project pages (restyled), the copy gate.
- **Not copied.** The reference's typewriter effects, jQuery, Webflow and analytics; the phone-frame device mockups (the plates are the real captures as they are).

### J.1 Review round (2026-10-06, evening)

Three reviewers (fidelity to the reference, AI tells, correctness) read the rebuild. Applied:
- A rule written for the hover clips (`.plate > video`) also hid the trailer and the demo on the project pages; it is now scoped to `[data-hover-video]`.
- The greeting was the reference's line with two words swapped; it is now his own: "I write flight software and make games." The bold phrases in the hero paragraphs went.
- Row titles no longer wrap to three lines: no 16ch cap, 40px at 1440, the row head at 3/5 and the plate a real 440px from 1024px up; the work rows lost their serif taglines and the "View project" cue, and the stack line moved under the plate as a caption. The experience rows carry the start year in the index slot instead of a second 01 to 04.
- Section heads are running heads with a rule (2rem) so the rows carry the page; section air trimmed.
- The hero wash now rises behind the nav instead of being cut flat under it; the sign-off wash bleeds off the left edge and under the footer, and the dot grid became a still frame of the tick field (his motif) over it. The sign-off name sits on one line with a dated fact under it.
- Mono a step larger and medium weight for the nav, links and indexes; body text in ink rather than grey.
- No filled buttons anywhere: the resume strip is a link row, the remaining buttons are hairline rectangles.
- Skills is prose tied to the projects; the footer no longer announces it was made by hand; the sub-pages share the home page's nav ("DH", Experience, Work, Open source, About, Resume, GitHub) and "All work" back link.
- The GreetBot plate shows the module's real import list (no paraphrased call); the Petrarchan plate reads "Steps 5,000 / Batch 64"; two experience sentences now match the resume ("five or more product modules", "query times").
- Case-study headings renamed after their content ("Two games on one board", "Screens with no API", "Thousands of markets", "What a clip cannot show").

Flagged to the owner, not changed: the embedded resume PDF shows his phone number (his file, his call); chesstan-web is still the August build.

### J.2 The portrait (2026-10-06)

Darren asked for his face to stay on the page. The portrait now sits in the hero, a 4:5 plate centred over the tick field with the wash behind it, preloaded as the largest paint; About is text only. Mobile stacks it under the intro over the same wash.
