---
name: Darren Huai portfolio
description: An editorial engineer portfolio: a high-contrast serif for headlines, a mono for everything else, hairline rules, numbered rows with generous air, and two soft violet-blue washes.
colors:
  bg: "#f7f6fa"
  surface: "#ffffff"
  surface-2: "#efedf5"
  ink: "#1c1826"
  ink-2: "#4a4458"
  muted: "#6f6a7e"
  line: "#1c1826"
  line-soft: "#d9d6e3"
  accent: "#5b3df0"
  accent-hover: "#4a2fd6"
  blue: "#3d6bff"
  lavender: "#c9c0ff"
  magenta: "#a855f7"
  bg-dark: "#15121c"
  surface-dark: "#1d1927"
  surface-2-dark: "#231e30"
  ink-dark: "#f1eef7"
  ink-2-dark: "#c6c0d6"
  muted-dark: "#9893a8"
  line-dark: "#f1eef7"
  line-soft-dark: "#312c3f"
  accent-dark: "#8b73ff"
  blue-dark: "#6b8dff"
  magenta-dark: "#b57cff"
typography:
  display:
    fontFamily: "Playfair Display, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.4rem + 4vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Playfair Display, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2rem, 1.5rem + 2.2vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  row-title:
    fontFamily: "Playfair Display, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.5vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Geist Mono, ui-monospace, Cascadia Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.005em"
  small:
    fontFamily: "Geist Mono, ui-monospace, Cascadia Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.005em"
  index:
    fontFamily: "Geist Mono, ui-monospace, Cascadia Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  plate: "20px"
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
  s10: "128px"
  section-y: "clamp(5rem, 4rem + 5vw, 8rem)"
  gutter: "clamp(1.25rem, 5vw, 3.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    typography: "{typography.small}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "44px"
  plate:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.plate}"
    padding: "0"
    shadow: "0 18px 50px rgba(28, 24, 38, 0.10)"
  nav:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    height: "72px"
---

# Design System: Darren Huai portfolio

## 1. Overview

**North star: an editorial page, in violet and blue.**

On 2026-10-06 Darren pointed at arlenmccluskey.com and asked for that page, with his purple-blue colour scheme, his projects and sections, and the live ChessTan board kept. So the page is now that language: a serif with real contrast for headlines, a typewriter mono for every other word, 1px rules in ink, a number beside every row, generous vertical air, one media plate per work row, and two soft washes (one with a field of drifting tick marks in the hero, one with a dot grid in the sign-off).

Key characteristics:
- Two typefaces with a clear split: Playfair Display for h1, h2 and row titles; Geist Mono for body, labels, lists, buttons, captions and the nav. Nothing else.
- Lines, not boxes. Sections are separated by air and a hairline; rows carry a vertical divider beside their index and a horizontal rule under the title. Cards exist only as media plates.
- Colour lives in the two washes and the ChessTan board. Text is ink; links go violet on hover.
- Light and dark by `prefers-color-scheme`. Dark keeps the same rules in near-white ink on an ink-violet ground.
- Copy rules stand: first person, plain, sentence case, zero em or en dashes, no invented biography, no eyebrow labels, no icons.

Layout: a 1080px sheet with a fluid gutter. The hero is 8/4; experience, work, about and resume rows are 7/5 at 900px and up, with the media or body column on the right. Everything stacks to one column below 900px.

## 2. Colours

- **Ink** (`{colors.ink}`; dark `{colors.ink-dark}`): all text, all rules, the primary button fill. The `--ink-hex` twin feeds the tick-mark canvas.
- **Ink 2** and **Muted**: body paragraphs and captions.
- **Line** is ink; **Line soft** (`{colors.line-soft}`) frames plates and separates list items.
- **Violet** (`{colors.accent}`): link hover, focus rings, the nav current state, the filename lines in the diff, the board's accent tile.
- **Blue**, **Magenta**, **Lavender**: only in the two washes and the selection colour.

### The washes
- **Hero:** three radial ellipses (violet, blue, magenta) blurred 46px behind a 400px square canvas of 9x9 tick marks, with the portrait as a 136px byline plate above the headline; the wash rises behind the nav and bleeds off the right edge of the viewport.
- **Sign-off:** three radial ellipses (magenta, violet, blue) blurred 40px under a 38px dot grid, left of the name.

## 3. Typography

- **Display** (`{typography.display}`): the hero h1 only, two lines, "Hello, I'm Darren. / I'm an engineer."
- **Headline** (`{typography.headline}`): section h2s, the sign-off name, project page h1s.
- **Row title** (`{typography.row-title}`): the serif name of each row, with an optional second line (`.row-sub`).
- **Body** (`{typography.body}`): mono at 15px, 48 to 56ch measures.
- **Small** (`{typography.small}`): nav, meta lines, list items, buttons, captions.
- **Index** (`{typography.index}`): the 01, 02 beside each row, tracked a little.

Emphasis in the hero paragraphs is `strong` at mono 600, as the reference does.

## 4. Rows

```
<article class="row [work-row]">
  <div class="row-head">
    <h3 class="row-title">Title<span class="row-sub">Second line</span></h3>
    <span class="row-index">01</span>          <!-- vertical divider on its left -->
    <div class="row-rule"></div>               <!-- hairline under both -->
    <p class="row-meta">...</p> | <p class="row-lead">...</p>
  </div>
  <p class="row-body">...</p> | <div class="row-media"><div class="plate">...</div></div>
</article>
```
Experience rows put the role and dates under the rule and the description on the right. Work rows put the one-liner, the stack and "View project" under the rule, the media plate on the right, and make the whole row one link to the project page.

## 5. Plates

20px radius, 1px soft line, a soft shadow, 440px wide at 4:3 in work rows. Kinds: the live three.js board (no frame, no shadow), a still that plays its recording on hover or in view, a screenshot, a pair of phone captures on a tinted ground, a spec sheet, a few lines of code. On project pages the lead media, galleries and the portrait use the same plate.

## 6. Motion

- Load: the headline, text, links and field rise in over 500 to 800ms.
- The tick marks lie still in a noise pattern and turn toward the mouse pointer only while it is over the field, the nearest ones most, easing back when it leaves; one static frame under reduced motion.
- Scroll reveals: below-the-fold rows rise 14px once.
- The watchglass plate plays its clip on hover (fine pointers) or once in view (coarse); project page videos play once at half visibility; the board mounts within 800px.
- Reduced motion: no animation, no clips, no autoplay, a still field, no board.

## 7. Do's and Don'ts

Do: keep every heading in the serif and every other word in the mono; keep rules 1px and ink; number rows; put one real artifact per work row; keep the two washes the only colour fields.

Don't: add pills, chips, icons, gradients on text, eyebrow labels, stat tiles, charts, a third typeface, a shadow on anything that is not a plate, or a Google Fonts link (fonts are self-hosted and the deploy gate rejects runtime font links).
