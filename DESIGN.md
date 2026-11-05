---
name: TOPBOT
description: Quiet newsroom magazine for scored AI reviews - paper, photography, maritime blue.
colors:
  maritime-blue: "#1E3A5F"
  maritime-blue-light: "#5B8DC9"
  ink: "#161616"
  cool-paper: "#f8f7f7"
  hairline: "#e9e9e9"
  secondary-ink: "#4e5052"
  muted: "#a0a0a0"
  white: "#ffffff"
  line-2: "#d9d9d9"
  black: "#000000"
  overlay: "#00000033"
  cool-paper-60: "rgba(248, 247, 247, 0.6)"
  line-dark: "rgba(255, 255, 255, 0.1)"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "80px"
    fontWeight: 700
    lineHeight: "88px"
    letterSpacing: "normal"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: "68px"
    letterSpacing: "normal"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "48px"
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "30px"
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "24px"
  pill: "999px"
spacing:
  gutter: "15px"
  grid: "30px"
  grid-md: "24px"
  section: "80px"
  section-md: "50px"
  btn-x: "32px"
components:
  button-primary:
    backgroundColor: "{colors.maritime-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.maritime-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "50px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "50px"
  chip-tag:
    backgroundColor: "rgba(0, 0, 0, 0.2)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "32px"
  chip-score:
    backgroundColor: "rgba(0, 0, 0, 0.6)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  card-feature:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  nav-item:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
---

# Design System: TOPBOT

## Overview

**Creative North Star: "The Quiet Newsroom"**

TOPBOT reads as a calm editorial desk, not a product dashboard. Pages sit on Cool Paper. Structure is hairline rules and a wide canvas. Photography leads every listing. Type is Manrope at newsroom weights — 700 for headlines, 400 for body — in Ink Charcoal. The density of a broadsheet, the manners of a lifestyle magazine.

Maritime Blue is the brand color of the desk: primary buttons, active nav, links, audience scores. Pill-shaped Maritime buttons, 12px photograph corners, and 8px fields are the chrome. Surfaces are flat at rest; a button lifts and shines only when touched.

This is the incumbent Drozy magazine skin as it actually ships. Do not treat the old public-site Oswald/Mulish/Tailwind theme, Drozy's mint accent, or Drozy demo logos as the identity.

**Key Characteristics:**
- Cool Paper canvas, Ink type, hairline rules
- Photography-led cards with 12px corners and almost no chrome
- Pill actions in Maritime Blue; shine-and-lift on hover
- Maritime Blue for brand, actions, active states and scores
- One typeface (Manrope); dark mode is token inversion, not a second world

## Colors

A near-neutral paper palette with one maritime blue brand color. Flat blue, no gradients or shades.

### Primary
- **Maritime Blue** (`#1E3A5F`): Primary buttons, current nav underline, links, audience scores, dropdown accent, scrollbar thumb. Never a full page fill.
- **Maritime Blue Light** (`#5B8DC9`): Dark-mode substitute for Maritime Blue on text and scores, where `#1E3A5F` lacks contrast on Ink.

### Neutral
- **Ink Charcoal**: Headlines, nav, primary buttons, icons. The voice of the desk.
- **Secondary Ink**: Default body and meta (`body` color). Headlines step up to Ink; running text stays here.
- **Muted**: De-emphasized labels, "POST BY", dark-mode inverted secondary.
- **Cool Paper**: Page and section ground. `Surface` and `Surface-light` share this value in light mode.
- **White**: Button reverse fill, input fill, play-control discs.
- **Hairline Gray**: 1px structural rules (header bands, footer columns, form strokes at 2px).
- **Line 2**: Slightly stronger divider (topbar mode-check).
- **Overlay**: Menu dim (`rgba(0,0,0,0.2)` on tags; `--Bg-color-1` for heavier scrims).

Dark mode (`.dark-mode` on `body`) inverts the desk: Cool Paper becomes Ink (`#161616`), Ink becomes white, Hairline becomes `rgba(255, 255, 255, 0.1)`, Surface becomes `rgba(255, 255, 255, 0.08)`. Do not author a parallel palette.

**The Brand Blue Rule.** Maritime Blue marks what is the brand or clickable. Paper stays the ground; a screen washed in blue has left the newsroom.

## Typography

**Display Font:** Manrope (sans-serif fallback)
**Body Font:** Manrope (sans-serif fallback)
**Label/Mono Font:** Manrope; icomoon for UI icons. Mulish exists as `$font-main2` / `.font-2` and is an exception, not a pairing to expand.

**Character:** A single geometric sans at newsroom weights. Headlines are 700 and tight to the paper. Body is 400 at 18/30. Meta is 12px uppercase 700. No serif display. No tracking-out luxury captions.

Root `html` is `62.5%`; component sizes below are the observed `px` values (not rem).

### Hierarchy
- **Display** (700, 80/88): Rare masthead / `.text-display-1`. Steps to 66 then 55 at xl/lg.
- **Headline** (700, 56/68): `h1`. CTA lines ("Let's Start The Conversation!"). Steps to 46 / 38.
- **Title** (700, 36/48): `h3` section titles ("Latest Reviews"). Card titles use `h5` (24/32).
- **Body** (400, 18/30): `p` and `.text-body-1` at 16/26 for card excerpts. Body UI chrome is 15px/400 in Secondary Ink. Max comfortable measure follows the card/column, not a 65ch article well on the home.
- **Label** (700, 12/16, uppercase): `.text-caption-2` on dates, authors, photo tags. Nav items are 16/26 at 700, not this caption size.

### Named Rules
**The One Face Rule.** Manrope is the voice. Do not introduce a serif display or expand Mulish beyond `.font-2`.

**The Caption Case Rule.** Dates, authors, and tags are uppercase 12px/700. Headlines stay title case at 700.

## Layout

A wide newsroom desk, not a centered reading column.

`.tf-container` is `max-width: 1830px` with 15px gutters. Modifiers: `.w-xl` 1440px, `.w-xxl` 1590px. Grid is `.tf-grid-layout` with `--spacing: 30px` (24px from md). Column helpers (`sm-col-*` / `md-col-*` / `lg-col-*` / `xl-col-*` / `xxl-col-*`) switch on Drozy **min** breakpoints. From lg up, some grids draw 1px Hairline column rules via `grid-borders`.

Section rhythm is `.tf-spacing-1` at 80px top/bottom (50px below md). Home Latest Reviews uses that plus `mb_28` on the heading row and a 4-up grid (`xxl-col-4 sm-col-2`).

Breakpoints are Drozy's map, not Bootstrap's namesake widths: max sm 575 / md 767 / lg 991 / llg 1024 / xl 1199 / xxl 1440 / xxxl 1599 / full 1920. Bootstrap 5 `xxl` is 1400px — do not assume the names match.

Sticky chrome: `.header-menu.sticky-nav` is `position: sticky; top: 0; z-index: 999`. Keep sticky on `.header-menu`, not a short wrapping `<header>`.

**The Wide Desk Rule.** Default pages use the 1830 canvas. Do not collapse the magazine to a 720px article well unless the surface is a review body.

## Elevation & Depth

Flat by default. Hairline rules and photography do the layering. Shadows and `translateY` appear only as a response to action.

Dark mode is tonal inversion of the same tokens. Sticky dark headers may use `backdrop-filter: blur(10px)`. The mobile menu overlay is `rgba(0, 0, 0, 0.3)` plus `blur(3px)` on `body::before`.

### Shadow Vocabulary
- **Action lift** (`box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.15)` plus `translate3d(0, -2px, 0)`): `.animate-hover-btn:hover` only.
- **Menu scrim** (`rgba(0, 0, 0, 0.3)` + `blur(3px)`): body overlay while the menu is open.
- **Input**: none. Fields are 2px Hairline strokes, `box-shadow: none`.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, menu, focus). Do not put rest-state drop shadows on cards.

## Shapes

Pills for actions and tags. Soft rectangles for photographs and fields. Hairlines for structure.

- **Pill (999px / 28px tags):** `.tf-btn`, category and score tags, dark-mode toggle track, scroll thumbs.
- **Photograph (12px):** `.feature-post-item .img-style`, category tiles. Small list thumbs use 8px.
- **Field (8px):** text inputs, 2px Hairline border.
- **Footer (16px):** outer footer shell, 1px Hairline.
- **Disc (50%):** play control, search icon button, toggle knob.

**The Pill-for-Action Rule.** Buttons and tags are capsules. Photographs are 12px. Fields are 8px. Do not ship a 4px rectangular primary button.

## Components

Pill actions, photo cards. Chrome is Ink and Hairline; photography does the talking.

### Buttons
- **Shape:** Full pill (999px). Height 50px from md, 44px default, 36px below md. Padding 0 32px (0 16px below md). Weight 600, 16px.
- **Primary:** Maritime Blue fill, White type. Class `.tf-btn`.
- **Hover / Focus:** `.animate-hover-btn` lifts 2px with the action shadow and a skew shine sweep. `.btn-switch-text` swaps the label upward via `data-text`. Transition `0.4s cubic-bezier(0.42, 0, 0.58, 1)`.
- **White:** `.btn-white` inverts fill/type. Header CTA is the same pill (`.style-2` is a markup class with no separate fill).

### Chips
- **Category tag:** 32px tall, 0 16px, 28px radius, `rgba(0,0,0,0.2)` on the photo, White 12px uppercase 700.
- **Audience score:** same capsule, darker `rgba(0,0,0,0.6)`, Eye icon, the numeric score in Maritime Blue Light (readable on the dark chip).
- **Small list tags:** 24px, 0 8px.

### Cards / Containers
- **Corner Style:** 12px on the photograph; the card itself has no shell radius, no fill, no rest shadow.
- **Background:** transparent on Cool Paper.
- **Shadow Strategy:** none at rest. Hover is image motion (`.hover-image-translate` scales 1.1 and shifts 4%; `.hover-image` flashes a diagonal sheen).
- **Border:** none on feature cards. Category tiles use 2px Hairline, Ink on hover.
- **Internal Padding:** image `mb_24`; meta `mb_12`; excerpt is two-line clamp.

### Inputs / Fields
- **Style:** White fill, 2px Hairline, 8px radius, 10px 14px, 16/26 body, height 50px from md. Placeholder Secondary Ink.
- **Search:** 1000px pill field, 50–60px tall, submit inset 8px.
- **Underline search (`.form-search.style-2`):** no box; 2px Ink bottom rule, 0 radius.
- **Focus:** outline 0; do not invent a blue glow. Keep the 2px stroke.
- **Newsletter:** dark-mode remaps the field to translucent white and Ink type.

### Navigation
- Topbar on Cool Paper: socials, centered logo, dark-mode toggle, pill CTA. 35px vertical padding.
- `.header-menu.style-default`: Hairline top and bottom, sticky. Items 16/26 700 Ink, 40px gaps, 16px vertical padding. Current item draws a 2px Ink underline from the left.
- Splitting.js duplicates label text for a split hover. Mobile: three-span burger; offcanvas on White.
- Live TOPBOT nav is Home / About / Contact only. Template dropdowns (Primary on `.has-child > a`) stay on demo homes.

### Feature post (signature)
The listing atom. Photograph with overlaid tags, then uppercase meta (date, POST BY author) and an `h5` title. Live home Hero is one wrap-feature Swiper of these cards (1/2/3/3/4 at 0/575/768/992/1200), not the stock dual banner. Audience score uses Maritime Blue Light inside the dark time tag.

### Dark-mode toggle (signature)
52×28 track, 2px Ink, 40px radius, 20px Ink knob. Active slides 23px. Labels 16/26 700.

## Do's and Don'ts

### Do:
- **Do** use Maritime Blue for brand, actions and scores (**The Brand Blue Rule**).
- **Do** set listing photographs to 12px radius and leave the card shell chromeless.
- **Do** use Maritime Blue pill buttons (999px, 50px from md) with shine-and-lift hover.
- **Do** structure pages with 1px Hairline rules and the 1830 `.tf-container` (**The Wide Desk Rule**).
- **Do** set headlines in Manrope 700 and body in Manrope 400 18/30 (**The One Face Rule**).
- **Do** invert tokens with `.dark-mode`; do not paint a second palette.
- **Do** keep surfaces flat at rest (**The Flat-By-Default Rule**).

### Don't:
- **Don't** flood a screen with Maritime Blue, or use shades or gradients of it.
- **Don't** introduce Tailwind, daisyUI, or SaaS dashboard chrome.
- **Don't** use Drozy's mint (`#14be77`) anywhere.
- **Don't** add a serif display face or expand Mulish beyond `.font-2`.
- **Don't** put rest-state drop shadows on cards or inputs.
- **Don't** treat Drozy template logos or Drozy demo copy as TOPBOT brand.
- **Don't** restore the dual creative/parallax hero-banner Swiper as the home language.
