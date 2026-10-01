---
name: Darren Huai portfolio
description: One-page engineer portfolio in an engineering-drawing language, one amber accent, one variable sans, mono only for values.
colors:
  bg: "oklch(0.965 0.006 240)"
  surface: "oklch(0.985 0.003 240)"
  surface-2: "oklch(0.935 0.008 240)"
  ink: "oklch(0.22 0.02 250)"
  ink-2: "oklch(0.42 0.02 250)"
  muted: "oklch(0.5 0.015 250)"
  accent: "oklch(0.53 0.13 55)"
  accent-hover: "oklch(0.47 0.115 55)"
  accent-ink: "oklch(0.985 0.01 80)"
  line: "oklch(0.85 0.01 240)"
  bg-dark: "oklch(0.17 0.014 250)"
  surface-dark: "oklch(0.21 0.015 250)"
  surface-2-dark: "oklch(0.25 0.015 250)"
  ink-dark: "oklch(0.94 0.012 80)"
  ink-2-dark: "oklch(0.78 0.012 80)"
  muted-dark: "oklch(0.68 0.012 80)"
  accent-dark: "oklch(0.78 0.14 65)"
  accent-hover-dark: "oklch(0.83 0.12 65)"
  accent-ink-dark: "oklch(0.18 0.02 60)"
  line-dark: "oklch(0.32 0.015 250)"
typography:
  display:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 2.273rem + 0.97vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 108"
  headline:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(2rem, 1.886rem + 0.485vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 108"
  title:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(1.5625rem, 1.477rem + 0.364vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 100"
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
  label:
    fontFamily: "Archivo, Archivo Fallback, Arial, sans-serif"
    fontSize: "clamp(0.8125rem, 0.784rem + 0.121vw, 0.875rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 88"
  value:
    fontFamily: "Geist Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.92em"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0"
    fontFeature: "tnum"
rounded:
  none: "0"
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
  section-y: "clamp(4.5rem, 3rem + 5vw, 8rem)"
  gutter: "clamp(1rem, 4vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  plate:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "0"
  title-block-cell:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  nav:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    height: "64px"
  band:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
---

# Design System: Darren Huai portfolio

## 1. Overview

**Creative North Star: "The drafting table"**

A one-page drawing set for a software engineer: a live hex board from the game he shipped, screenshot-led case sheets with the numbers inside the sentences, eleven merges plotted on a date axis, a skills-to-evidence matrix, and a title block instead of a bio. Warm, exact, sentence case. Rejects the purple-gradient portfolio, the typewriter hero, the avatar card, chip soup, the dot timeline, eyebrows above sections, figure tiles, cards with shadows, and mono as a costume.

Key characteristics:
- One accent (burnt amber), used identically everywhere it appears and nowhere else.
- One variable sans (Archivo) carrying display, headings, body and labels through its width and weight axes; a cockpit mono (Geist Mono) only where a string is a value.
- Radius 0, no shadows, no gradients, no blur. Depth is a three-step surface ladder and 1px frames.
- Light and dark by `prefers-color-scheme`; dark is the game's own panel palette (navy, cream, amber).
- Zero eyebrows, zero icons, zero em or en dashes.

Layout: 12-column sheet, max-width 1200px, column gap `{spacing.s5}`, gutter `{spacing.gutter}`; section rhythm `{spacing.section-y}` on top and 1.15 times that below; every multi-column section is one column below 768px. Full token detail, section layouts and copy: `docs/design/2026-09-29-redesign-spec.md`.

## 2. Colors

Cool vellum neutrals with one amber; the dark theme keeps the same hue family and swaps to cream text. OKLCH is canonical; hex values below are sRGB conversions for the `color:` fallback line and for the Three.js scene (published as `--*-hex` twins).

### Primary
- **Burnt amber** (`{colors.accent}`, #a35303; dark `{colors.accent-dark}`, #f4a34b): primary button fill, matrix marks, axis markers, hover underline, focus ring, the hovered hex edge in the hero. 5.00:1 on bg light, 9.27:1 dark; 4.57:1 on the band light.
- **Amber, hover** (`{colors.accent-hover}`, #8a4603; dark #fdb770): primary button hover only.
- **Accent ink** (`{colors.accent-ink}`, #fefaf3; dark #180f09): text on the accent. 5.32:1 light, 9.17:1 dark.

### Neutral
- **Vellum** (`{colors.bg}`, #f0f4f7; dark **Navy** #0b1015): page ground.
- **Sheet** (`{colors.surface}`, #f8fafc; dark #13191f): title-block cells, plate background, ledger blocks.
- **Band** (`{colors.surface-2}`, #e5eaee; dark #1c2229): the Experience band only.
- **Ink** (`{colors.ink}`, #141b24; dark **Cream** #efeae2): headings and body. 15.67:1 light, 15.96:1 dark.
- **Ink 2** (`{colors.ink-2}`, #454e58; dark #bbb7af): secondary text, labels, perceivable borders. 7.65:1 light, 9.56:1 dark.
- **Muted** (`{colors.muted}`, #5d646c; dark #9c9890): captions, footer, resting link underline. 5.42:1 light, 6.65:1 dark; 4.95:1 on the band.
- **Line** (`{colors.line}`, #c8cfd4; dark #2d343a): hairlines and plate frames, decorative only (1.42:1).

### Named rules
**The one accent rule.** `var(--accent)` may appear only in: primary button, `.mark`, `.axis-marker`, `a:hover` underline, `:focus-visible`, nav current underline, `::selection`, and the scene twin. A grep enforces it.
**The perceivable border rule.** Anything that must be seen as a boundary (secondary button, Menu, Replay) uses ink-2, never line.
**The screenshot rule.** The only saturated colours besides the accent live inside real screenshots and the hero scene's tiles.

## 3. Typography

**Display and text font:** Archivo (variable, wdth 62 to 125, wght 100 to 900), self-hosted `fonts/archivo-var.woff2`, fallback "Archivo Fallback" (metric-matched Arial) then Arial.
**Value font:** Geist Mono 400, self-hosted `fonts/geistmono-var.woff2`; used by the `.val` class only.

**Character:** a stamped aluminium nameplate for headings (wide cut, 600), a plain readable grotesque for prose (normal width, 400), a compact cut for labels (wdth 88, 500), and an aerospace instrument face for values.

### Hierarchy
- **Display** (`{typography.display}`): the hero h1 only; two lines, `text-wrap: balance`, 18ch measure, 40 to 48px.
- **Headline** (`{typography.headline}`): section h2s and case-sheet titles, 32 to 36px.
- **Title** (`{typography.title}`): case-sheet titles and the email button, 25 to 28px; the employer, repo and Earlier-projects names use the lead size at weight 600.
- **Lead** (`{typography.lead}`): hero subtext and section lead sentences, ink-2, 20 to 22px.
- **Body** (`{typography.body}`): 16 to 17.5px, line-height 1.55 light and 1.62 dark, 62ch.
- **Label** (`{typography.label}`): field labels, matrix heads, title-block labels, nav; sentence case, never uppercase, 13 to 14px.
- **Value** (`{typography.value}`): numbers, dates, versions, PR ids, repo slugs, flags, the email; tabular figures.

### Named rules
**The value rule.** A string is set in mono only if someone could paste it into a form or a terminal. `font-mono` is referenced by exactly one rule.
**The no-caps rule.** No `text-transform: uppercase`; acronyms are typed as they are.
**The scale rule.** Steps are at least 1.25 apart at the large end (1.25, 1.26, 1.27, 1.29, 1.33).

## 4. Elevation

No shadows anywhere; `box-shadow`, `backdrop-filter` and gradients are grep-gated to zero. Depth is conveyed by the three-step surface ladder (bg, surface, surface-2), by 1px `line` frames on plates and title-block cells, and by the one full-bleed band (Experience). Hover on plates scales the image 1.02 inside its clipped frame; hover on buttons lifts 1px; nothing lifts a shadow because there are none.

## 5. Components

### Buttons
- **Shape:** sharp rectangle (`{rounded.none}`), 48px tall, 20px side padding, one line, at most three words (the email address is the one exception, 20 characters).
- **Primary:** `{components.button-primary}`; hover `{components.button-primary-hover}` plus `translateY(-1px)`; active `scale(0.98)`; focus ring 2px ink, 2px offset.
- **Secondary:** `{components.button-secondary}` with a 1px ink-2 border; hover border ink, background surface; active `scale(0.98)`.

### Links
Ink text, 1px `muted` underline at 3px offset at rest; hover: 2px `accent` underline. External links get `rel="noopener"` and visually hidden "(opens in a new tab)". No arrow glyphs.

### Plates (image frames)
`{components.plate}` with a 1px `line` border, `overflow: hidden`, declared `aspect-ratio`, `object-fit: cover`; captions below in label size, muted, only when they add information. Nothing overlaid on an image. No device frames.

### Title block
`{components.title-block-cell}` cells in a 1px `line` grid; label over value; the portrait spans two rows at 4:5.

### Nav
`{components.nav}`, sticky, 1px `line` bottom rule, no blur. Current section: ink with a 2px `accent` underline. Mobile: text button "Menu" / "Close", `aria-expanded`, Escape closes.

### Data marks
Matrix mark: 12px `accent` square with hidden "Yes" text. Axis marker: 12px `accent` square (filled for platformdirs, stroked for virtualenv) inside a 24px hit area, each an `<a>` with a full accessible name.

### Motion
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`; `--dur-fast: 120ms`; `--dur-base: 160ms`; `--dur-reveal: 600ms`; `--dur-canvas: 300ms`.
- Load: nav 200ms at 0; h1 line wipes 420ms from 80ms, 90ms apart; subtext and buttons rise 12px and fade 360ms from 320ms, 80ms apart; board wireframe-to-solid 200 to 1100ms.
- Reveal: IntersectionObserver `threshold: 0.25`, `rootMargin: 0 0 -10%`, once; plates wipe 600ms then text staggers 40ms; axis draws 500ms then markers 40ms apart; matrix rows 30ms apart; other sections fade-and-rise 400ms.
- Idle: hero yaw 0.02 rad/s, the page's only loop; pointer tilt up to 6 degrees lerped 0.08 per frame; paused off-screen and when hidden.
- Reduced motion: every animation and transition removed, reveals applied at load, canvas never created, recording shows its poster with a Play demo button.

## 6. Do's and Don'ts

Do:
- Use the accent only in the seven listed places and the scene.
- Put every number inside a sentence, set in `.val`.
- Keep every section one column below 768px and state the collapse.
- Ship real screenshots or nothing; text entries for projects without imagery.
- Run the copy gate: zero U+2013, U+2014, U+00B7; no "Hi, I".

Don't:
- Add an eyebrow, a figure tile, a chip, a card with a border and a shadow, a corner mark, an icon, a gradient, a blur, a shadow, a radius.
- Set a heading, label, button or sentence in the mono.
- Use a scroll listener, a loop other than the hero idle, or `100vh`.
- Add a second accent, a status dot, a locale strip, a version string, or a scroll cue.
- Use the Steam capsule, the ChessTan logo, or any generated or placeholder imagery.
