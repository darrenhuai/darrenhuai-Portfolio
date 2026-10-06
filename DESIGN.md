---
name: Darren Huai portfolio
description: A plain, hand-made engineer portfolio in the owner's own palette: warm cream, violet, a touch of amber, one variable sans, mono only for code.
colors:
  bg: "#faf8f5"
  surface: "#ffffff"
  surface-2: "#f2eee7"
  ink: "#17131f"
  ink-2: "#56516b"
  muted: "#6b6480"
  accent: "#5b3df0"
  accent-hover: "#4a2fd6"
  accent-ink: "#ffffff"
  accent-text: "#7c5cf0"
  accent-soft: "#ece6fd"
  accent-faint: "#f5f2fe"
  amber: "#f0a63c"
  amber-text: "#b8761f"
  line: "#e9e4da"
  bg-dark: "#17131f"
  surface-dark: "#1f1a2b"
  surface-2-dark: "#241e32"
  ink-dark: "#f3f0fa"
  ink-2-dark: "#cdc7df"
  muted-dark: "#9b96b3"
  accent-dark: "#8b73ff"
  accent-hover-dark: "#a08fff"
  accent-ink-dark: "#120d1f"
  accent-text-dark: "#b4a4ff"
  accent-soft-dark: "#2b2447"
  accent-faint-dark: "#1e1933"
  amber-text-dark: "#f2b65e"
  line-dark: "#35304a"
typography:
  display:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(2.125rem, 1.6rem + 2.2vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.886rem + 0.485vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(1.5625rem, 1.477rem + 0.364vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.193rem + 0.242vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0"
  body:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(1rem, 0.957rem + 0.182vw, 1.094rem)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  small:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(0.8125rem, 0.784rem + 0.121vw, 0.875rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0"
  code:
    fontFamily: "Geist Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.9em"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
rounded:
  sm: "10px"
  md: "14px"
  lg: "28px"
  pill: "999px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
  s8: "64px"
  s9: "96px"
  section-y: "clamp(4rem, 2.5rem + 4vw, 6.5rem)"
  gutter: "clamp(1rem, 4vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
    shadow: "0 14px 34px rgba(91, 61, 240, 0.28)"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
  pill-link:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-hover}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "24px"
    shadow: "0 2px 10px rgba(23, 19, 31, 0.05)"
  plate:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0"
  nav:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    height: "64px"
  band:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
---

# Design System: Darren Huai portfolio

## 1. Overview

**North star: a person's own site, in his own colours.**

The first version of this site had a palette the owner liked: warm cream, a violet he used for every button, a lavender wash behind the hero and an amber that showed up in gradients. The 2026-09-30 rebuild replaced it with a cool "drafting table" system, which he later read as AI-made. On 2026-10-05 the palette came back, on top of the plainer structure: real screenshots, click-through project cards, first-person copy, the resume as the PDF itself.

Key characteristics:
- The palette is the old site's (see Colours). Violet is the working accent; amber appears only in the two gradients and the three.js board.
- One variable sans (Archivo) for everything; Geist Mono only inside `code` and `pre`.
- Soft shapes: 14px on cards and plates, pills for buttons and contact links, 28px on the portrait frame. Two soft shadows and one glow, nowhere else.
- Light and dark by `prefers-color-scheme`; dark keeps the same violet and amber on an ink-violet ground.
- Copy rules from the hand-made pass stand: sentence case, plain numbers in prose, zero em or en dashes, no eyebrow labels, no chips as decoration, no icons, no invented biography.

Layout: 12-column sheet, max-width 1200px, column gap `{spacing.s5}`, gutter `{spacing.gutter}`; section rhythm `{spacing.section-y}` above and 1.15 times that below; every multi-column section is one column below 768px (900px for the open-source columns and the experience split).

## 2. Colours

Warm cream neutrals, violet, amber. Plain hex throughout; the three.js scene reads the `--*-hex` twins.

### Primary
- **Violet** (`{colors.accent}`; dark `{colors.accent-dark}`): primary buttons, the hovered link underline, the focus ring, the nav current underline, the gradient rule on project cards, the hero blob. Text on it is white in both themes.
- **Violet, hover** (`{colors.accent-hover}`; dark `{colors.accent-hover-dark}`): primary button hover, pill link text.
- **Violet, text** (`{colors.accent-text}`; dark `{colors.accent-text-dark}`): the middle stop of the name gradient and the card border on hover.
- **Lavender** (`{colors.accent-soft}` and `{colors.accent-faint}`; dark twins): pill link fill, selection, the radial wash at the top of the hero.
- **Amber** (`{colors.amber}`, text `{colors.amber-text}`; dark text `{colors.amber-text-dark}`): the warm end of the name gradient and the portrait frame, the second hero blob, the board scene's accent. Never a button, never a border on its own.

### Neutral
- **Cream** (`{colors.bg}`; dark `{colors.bg-dark}`): page ground.
- **White** (`{colors.surface}`; dark `{colors.surface-dark}`): cards, plates, the status pill, facts cells.
- **Band** (`{colors.surface-2}`; dark `{colors.surface-2-dark}`): the Experience and Resume bands, code blocks.
- **Ink** (`{colors.ink}`; dark `{colors.ink-dark}`): headings and body.
- **Ink 2** (`{colors.ink-2}`; dark `{colors.ink-2-dark}`): leads, secondary text.
- **Muted** (`{colors.muted}`; dark `{colors.muted-dark}`): captions, dates in lists, the footer, resting link underlines.
- **Line** (`{colors.line}`; dark `{colors.line-dark}`): hairlines, card and plate frames.

### Gradients
- **Name:** `linear-gradient(120deg, accent, accent-text 45%, amber-text, accent)` clipped to the text, drifting slowly when motion is allowed. Used on the name in the hero h1 only.
- **Frame:** `linear-gradient(135deg, accent, amber)` as the 6px frame around the portrait, and at 90 degrees as the 3px rule along the top of every project card.
- **Wash:** a lavender radial at the top of the hero plus two blurred blobs (violet top right, amber bottom left) that drift over 16 and 20 seconds; static under reduced motion; hidden in print.

## 3. Typography

**Everything:** Archivo (variable), self-hosted `fonts/archivo-var.woff2`, normal width throughout, with a metric-matched Arial fallback.
**Code only:** Geist Mono, self-hosted `fonts/geistmono-var.woff2`, inside `code` and `pre`.

- **Display** (`{typography.display}`): the hero h1 ("Hi, I'm" in ink, the name in the gradient).
- **Headline** (`{typography.headline}`): section h2s and project page titles.
- **Title** (`{typography.title}`): card titles and the email button.
- **Lead** (`{typography.lead}`): hero intro and section leads, ink-2.
- **Body** (`{typography.body}`): 62 to 66ch measure; line-height 1.55 light, 1.62 dark.
- **Small** (`{typography.small}`): nav, the status pill, captions, dates after list items, facts labels.
- **Code** (`{typography.code}`): commands and excerpts only.

Rules: no uppercase transforms; numbers and dates in prose are ordinary text (not mono); headings at normal width.

## 4. Elevation and shape

- Cards: white, 1px line, 14px radius, the gradient rule on top, `shadow-sm`; on hover the border turns violet-text, the shadow steps up to `shadow-md` and the card lifts 2px.
- Plates: 1px line, 14px radius, `overflow: hidden`, declared `aspect-ratio`.
- Buttons: pills; the primary carries the violet glow and lifts 2px on hover; the secondary has a line border that turns violet on hover.
- The portrait: a 6px gradient frame at 28px radius with the violet glow; the photo at 24px with a 3px cream inset.
- The nav: translucent cream with a 12px backdrop blur and a hairline below.
- Nothing else casts a shadow, blurs or uses a gradient.

## 5. Components

### Hero
Status pill (white, hairline, green dot, "Software engineer intern at NASA Armstrong"), the h1, a four-sentence first-person intro, "See my projects" and "Resume", three pill links (Email, GitHub, LinkedIn), and the portrait on the right (columns 9 to 12 at 1024px and up; above the copy on phones). The portrait is served as a `picture` with 480 and 960 wide webp and jpg from the 1440x1800 original, and preloaded with `imagesrcset`.

### Project cards
Stretched links to `projects/<slug>.html`. Cover: the three.js board (ChessTan), a still that plays its recording on hover or once in view on touch (watchglass, `data-hover-video`), a screenshot, or a pair of phone captures. Below the cards, "Also on my GitHub" lists the smaller public repositories. All of it is generated by `tools/build_projects.py`.

### Project pages
Title, lead, optional action buttons (ChessTan: "Play it in your browser", "Free on Steam"), a facts list, one lead media (video with the play, pause and replay button; image; image pair; phone pair; specs table), 4/8 prose sections, a screenshot gallery, previous and next.

### Open source
A lead with the real numbers, two columns (virtualenv, platformdirs) listing every merged pull request with its merge date in muted small text, then "One each" and "In review" columns, then the user-dirs.dirs note. Data lives in `OSS_PROJECTS`, `OSS_SINGLES` and `OSS_OPEN` in `tools/build_projects.py`.

### Motion
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`; `--dur-fast: 120ms`; `--dur-base: 160ms`.
- Load: the status pill and intro rise in, the h1 wipes in, the portrait settles 8px; the name gradient and the two blobs drift on loops.
- Scroll: below-the-fold blocks rise 12px once (IntersectionObserver; `.pre` is only ever added by JS).
- Media: the watchglass card clip plays on hover (fine pointers) or once at 60% visibility (coarse); project page videos play once at 50% visibility; the three.js board mounts within 800px of the viewport.
- Reduced motion: every animation and transition off, no clips are created, no autoplay, the board is never mounted.

## 6. Do's and Don'ts

Do:
- Use violet for anything interactive and amber only in the two gradients and the board.
- Keep copy first person, specific and dated where it can go stale (the About paragraph that starts "As of").
- Ship real captures, real recordings, real numbers with links under them.
- Run the copy gate: zero U+2013, U+2014, U+00B7; no runtime Google Fonts.

Don't:
- Add eyebrow labels, icon sets, stat tiles, charts, matrices, chips as decoration, or a typing effect.
- Set headings, labels or prose in the mono, or in a condensed width.
- Add a third accent, a second glow, or shadows on text.
- Link the private repositories or show the phone number.
- Invent biography or opinions.
