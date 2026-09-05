---
name: Raider Mate Dashboard
description: A dark, dense raid-night console for World of Warcraft guild leads
colors:
  ground: '#0C0D11'
  surface: '#13141A'
  raised: '#1A1C23'
  hover: '#23252E'
  border-subtle: '#262832'
  border: '#30323E'
  border-strong: '#434654'
  gilt: '#B98C34'
  gilt-dim: '#6B5121'
  gilt-lit: '#E8C877'
  vellum: '#E6D7B4'
  vellum-ink: '#33240F'
  vellum-ink-2: '#6F5A33'
  text-primary: '#E8EBF2'
  text-secondary: '#A5ADBE'
  text-tertiary: '#8A94A6'
  accent: '#E0A33C'
  accent-hover: '#F0B457'
  accent-pressed: '#C88C2C'
  accent-fg: '#12141A'
  success: '#34D399'
  warning: '#FB923C'
  danger: '#F27381'
  info: '#6AA9F5'
  role-tank: '#6AA9F5'
  role-healer: '#4ED88F'
  role-mdps: '#F5915E'
  role-rdps: '#B98BF0'
typography:
  display:
    fontFamily: 'Cinzel, Trajan Pro, Georgia, Times New Roman, serif'
    fontSize: '2rem'
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: '0.004em'
  title:
    fontFamily: '{typography.display.fontFamily}'
    fontSize: '1.0625rem'
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: '0.006em'
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI Variable Display, Segoe UI, system-ui, Roboto, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: '-0.006em'
  label:
    fontFamily: '{typography.body.fontFamily}'
    fontSize: '0.75rem'
    fontWeight: 560
    lineHeight: 1.35
    letterSpacing: '0.01em'
rounded:
  sm: '6px'
  md: '8px'
  lg: '10px'
  xl: '14px'
  full: '9999px'
spacing:
  1: '4px'
  2: '8px'
  3: '12px'
  4: '16px'
  5: '20px'
  6: '24px'
  8: '32px'
  10: '40px'
  12: '48px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.accent-fg}'
    rounded: '{rounded.md}'
    padding: '8px 14px'
    typography: '{typography.label}'
  button-primary-hover:
    backgroundColor: '{colors.accent-hover}'
    textColor: '{colors.accent-fg}'
  button-secondary:
    backgroundColor: '{colors.raised}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.md}'
    padding: '8px 14px'
    typography: '{typography.label}'
  button-secondary-hover:
    backgroundColor: '{colors.hover}'
    textColor: '{colors.text-primary}'
  badge:
    backgroundColor: '{colors.raised}'
    textColor: '{colors.text-secondary}'
    rounded: '{rounded.full}'
    padding: '2px 8px'
    typography: '{typography.label}'
  panel:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.xl}'
    padding: '20px'
  table-row-hover:
    backgroundColor: '{colors.hover}'
    textColor: '{colors.text-primary}'
  nav-link:
    backgroundColor: 'transparent'
    textColor: '{colors.text-secondary}'
    rounded: '{rounded.md}'
    padding: '6px 10px'
    typography: '{typography.label}'
  nav-link-active:
    backgroundColor: 'transparent'
    textColor: '{colors.text-primary}'
---

# Design System: Raider Mate Dashboard

## Overview

**Creative North Star: "A muster order pinned to the console on the second monitor."**

This is still a raid-night instrument. It runs on a second display at 20:00 beside a
full-screen game and a dark Discord, and a raid lead reads it in the minutes before pull
with half their attention. Dark ground, tight type, tabular figures and dense tables are
not style here, they are the job, and the redesign kept every one of them.

What the console lacked was any sign of what it was for. It could have belonged to a
billing product. So three materials sit on top of it, each carrying a rule that stops it
spreading into decoration.

**Vellum is the summons.** Aged paper, ink type, a torn bottom edge. It appears on
exactly two surfaces, the overview's next raid and the event header that morphs out of
it, and it is the same object seen twice. It never touches a table, a chart, a roster
row, or a panel body. A raid lead's eye lands on the one light thing on the screen and
that thing is tonight.

**Gilt is the frame.** A warm metal hairline on the top bar's edge and around the
summons, plus a corner notch on two opposite corners of every panel. Trim, never a fill,
never text.

**Amber is unchanged.** It still marks exactly two things: what you can do next, and
where you are. Gilt is darker and duller on purpose, so metal and lit amber never read
as the same signal.

The craft bar for everything a raid lead operates is still Linear, Vercel's Geist,
Raycast, Stripe's dashboard, and Untitled UI: familiar product-UI grammar executed
exactly, with no invented affordances. The materials are spent on the one surface that
answers the page's question, not on the controls.

**Key Characteristics:**

- Dark stone neutrals in four tonal steps, warmed off the blue axis they used to sit on.
- 14px body, tabular numerals on every figure, tight tracking.
- One amber accent for action and place, one gilt trim for frame, one vellum for the
  summons.
- Hairline borders and tonal steps instead of drop shadows, except on true overlays.
- Motion is one idea: the summons is more alive the closer the pull is.

## Colors

Cool neutrals in the 225-230 hue range under one warm amber, with saturated hues
reserved entirely for game data.

### Primary

- **Amber** (#E0A33C): the primary action, the current nav item, the focus ring, and
  the active-state indicator. Nothing else. It appears on well under 10% of any screen.
- **Amber Hover** (#F0B457) and **Amber Pressed** (#C88C2C): the only two variations.
- **Amber Foreground** (#12141A): text and icons on an amber fill. Never white.

### Gilt

- **Gilt** (#B98C34), **Gilt Dim** (#6B5121), **Gilt Lit** (#E8C877): the three stops of
  a single metal. They exist as a gradient, because a flat gold line is paint and a
  gradient with a highlight running through it is metal.
- Gilt appears in three places and no others: the 1px rail under the top bar, the 1px
  bevel around the summons, and a 10px corner notch on two opposite corners of a panel.
- Gilt is never text, never a fill, never a hover state, and never larger than 1px.

### Secondary

Game-data hues. These are information channels, not palette decoration.

- **Tank** (#6AA9F5), **Healer** (#4ED88F), **Melee** (#F5915E), **Ranged** (#B98BF0):
  role identity on comps and signups.
- **Heroic** (#6AA9F5) and **Mythic** (#B98BF0): raid difficulty. Normal takes neutral.
- **WoW class colors**: Blizzard's official thirteen, rendered only as a small dot or a
  left-edge marker beside the class name. Several of them (Death Knight, Rogue, Priest)
  cannot carry text at 4.5:1 on this ground, so class colour never becomes text colour.

### Tertiary

State semantics, used on badges and notices.

- **Success** (#34D399): confirmed signups.
- **Warning** (#FB923C): late, and deadlines inside the hour.
- **Danger** (#F27381): declined, no-show, and failures.
- **Info** (#6AA9F5): tentative, and neutral advisories.

### Neutral

- **Ground** (#0C0D11): the page behind everything.
- **Surface** (#13141A): panels, tables, the nav bar.
- **Raised** (#1A1C23): controls at rest, badges, table headers.
- **Hover** (#23252E): row and control hover.
- **Border Subtle** (#262832): dividers inside a panel.
- **Border** (#30323E): panel and control edges.
- **Border Strong** (#434654): hover edges and selected outlines.
- **Text Primary** (#E8EBF2), **Text Secondary** (#A5ADBE), **Text Tertiary** (#8A94A6).
  Tertiary is the floor; nothing dimmer ships, because it stops clearing 4.5:1.

The four steps are a few degrees warmer than the steel they replaced. Cool neutrals read
as app chrome; the same values warmed read as stone, which is what gilt trim and a sheet
of vellum need behind them to look like parts of one object.

### Vellum

The one light surface. Two ink levels, because a third stops clearing 4.5:1 on paper.

- **Vellum** (#E6D7B4): the sheet.
- **Ink** (#33240F) at 10.5:1, and **Ink Two** (#6F5A33) at 4.6:1. Labels and metadata
  share Ink Two. There is no dimmer step.
- The primary action inverts here: an ink fill with parchment text, because amber on
  parchment is a stain rather than a signal.
- The focus ring switches to bronze inside vellum. Amber on paper is invisible, and a
  focus outline nobody can see is the one failure this product does not accept.
- Every data hue is re-cut for paper: Heroic #1D5FA8, Mythic #5B3391, Tank #1D5FA8,
  Healer #1F6B43, Melee #8F4415, Ranged #5B3391, warning #8F4307, danger #A02218. Same
  meanings, same order, values that clear 4.5:1 on the sheet. A difficulty nobody can
  read is not a data channel.

### Named Rules

**The One Amber Rule.** Amber marks exactly two things: what you can do next, and where
you are. A second amber element on a screen means one of them is wrong.

**The Colour Means Data Rule.** A saturated hue on this surface encodes a role, a class,
a difficulty, or a state. Never a mood, never an accent on a heading. Gilt is exempt
because it is not a hue, it is trim, and it is the only gradient in the product.

**The Two Sheets Rule.** Vellum exists on the overview's summons and the event header,
because they are one object seen from two pages. A third vellum surface means one of the
three is wrong.

## Typography

**Display Font:** Cinzel (SIL OFL), variable weight, Latin subset, self-hosted at
`public/fonts/cinzel-latin-var.woff2` at 26KB. Terms in `LICENSE-OFL-Cinzel`.
**Body Font:** system UI stack (`-apple-system`, `Segoe UI Variable Text`, `system-ui`,
Roboto)
**Label/Mono Font:** `ui-monospace`, `SF Mono`, `JetBrains Mono`, Menlo

**Character:** one family carries the instrument, and one inscriptional serif carries the
titles. Cinzel is Roman capitals cut for stone, which is the letterform a raid name
wants and the one a table cell must never have. It is self-hosted because the Caddyfile's
CSP is `default-src 'self'` with no `font-src` of its own, and because a self-hoster has
to get everything the product needs out of this repository.

### Hierarchy

- **Summons** (Cinzel 700, 2rem, 1.15, 0.004em): the raid name on the overview's
  vellum. The largest type in the product, and there is one of it.
- **Display** (Cinzel 600, 1.625rem, 1.2, 0.002em): the page title in the header block.
  One per page.
- **Headline** (Cinzel 600, 1.3125rem, 1.25, 0.004em): section heads inside a page.
- **Title** (Cinzel 600, 1.0625rem, 1.35, 0.006em): panel and card titles.
- **Body** (400, 0.875rem, 1.55, -0.006em): everything else. Prose blocks cap at 68ch;
  table content runs as wide as the data needs.
- **Label** (560, 0.75rem, 1.35, 0.01em): badges, table headers, nav items, metadata.
  Table headers add 0.04em and uppercase; nothing else is uppercased.

### Named Rules

**The Tabular Rule.** Every figure a raid lead compares down a column carries
`font-variant-numeric: tabular-nums`: item level, Mythic+ score, times, counts, page
numbers. Digits that shift width between rows make a column unreadable at a glance.

**The One Family Plus One Rule.** Cinzel takes page titles, section heads, panel heads,
the raid name on the summons, the brand wordmark, and the summons kicker. Everything
else is the system sans: every label, badge, button, nav item, and table cell.

The line is not taste, it is arithmetic. Cinzel has no tabular numerals, and a figure
that changes width between rows makes an item level column unreadable at a glance, which
is the one thing this product cannot trade away. If a string is a figure a raid lead
compares down a column, it is not in the display face.

## Layout

A single centred column, `max-width: 76rem`, with `1.25rem` gutters that grow to
`2rem` above 60rem. The top nav is full-bleed and sticky; the content column is not.

Spacing runs on a 4px scale. The vertical rhythm is `2rem` between page sections,
`1.25rem` between blocks inside a section, and `0.5rem` inside a tight group. A heading
always gets more space above it than below it: `2rem` over, `0.75rem` under.

Density is deliberately high. Table rows run about `42px` on desktop
(`0.625rem` block padding on a `1.55` line), which fits roughly fourteen events or
twenty-five roster entries in a viewport without scrolling.

Responsive behaviour is structural, never fluid type. Below 52rem the nav collapses its
links into a horizontal scrolling strip and the guild switcher drops its label; below
44rem data tables re-flow into stacked rows with their column names as inline labels,
so no table ever scrolls sideways on a phone.

## Elevation & Depth

Tonal layering, not shadows. Depth on this surface is four neutral steps
(ground → surface → raised → hover) plus a hairline border, which reads correctly in a
dark room where a drop shadow reads as smudge.

Under all four, the ground carries two fixed films: fractal grain at an opacity nobody
should consciously notice, and a faint warm wash off the top edge where the summons
sits. They are background layers on `body` rather than a positioned element, so nothing
stacks above the content and no page has to know they exist. Their job is to stop
1400px of near-black reading as a void. Shadows appear only on elements that
genuinely float above the page: the sticky nav once the page has scrolled, and any true
overlay.

### Shadow Vocabulary

- **Sticky** (`box-shadow: 0 8px 24px -12px rgb(0 0 0 / 0.7)`): the nav bar once
  content has scrolled beneath it, faded in over the first `4rem` of scroll by a
  scroll-driven animation. Where that API is missing the bar stays flat. The gilt rail
  sits on the bar's own bottom edge and replaces its hairline border rather than joining
  it, because two lines there read as a seam.
- **Overlay** (`box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.65), 0 4px 12px -6px rgb(0 0 0 / 0.5)`):
  dialogs and popovers only.

### Named Rules

**The Flat-At-Rest Rule.** Panels and rows carry no shadow. Elevation is a response to
floating or to state, never a default decoration.

## Shapes

Soft-rectangular throughout, on a four-step radius scale: `6px` on inline chips and
small controls, `8px` on buttons and inputs, `10px` on nested blocks, `14px` on panels
and tables. Pills (`9999px`) are reserved for badges that carry a status word.

Every panel, table, and control is defined by a `1px` border rather than a fill
difference alone, so the structure survives on a dim or badly calibrated monitor. Left
or right accent borders thicker than 1px are not part of this language; a class colour
marker is a `3px` rounded bar and is the single exception, because it encodes data.

## Components

### Buttons

- **Shape:** `8px` radius, `1px` border, `32px` tall at default size.
- **Primary:** amber fill, `#12141A` text, no border colour of its own. Padding
  `8px 14px`, label type.
- **Secondary:** raised fill (#171B24), border (#2C3342), primary text. This is the
  default button on this surface; primary is rare.
- **Ghost:** transparent until hover, used inside table rows and toolbars.
- **Hover / Focus:** background steps one tonal level and the border steps to
  border-strong, over `120ms` with `cubic-bezier(0.16, 1, 0.3, 1)`. Focus adds the
  2px amber outline at 2px offset plus a soft amber halo. Active presses `1px` down via
  transform, never via margin.
- **Disabled:** 45% opacity, no hover response, `cursor: not-allowed`.
- **Toggle buttons** (signup statuses) carry `aria-pressed`; the pressed state takes the
  status colour as border and text, not as a fill.

### Chips

- **Style:** pill, raised fill, `1px` border, label type, optional `6px` leading dot
  carrying the semantic or class colour.
- **State:** status chips tint their background with `color-mix(in srgb, <hue> 14%,
  transparent)` and take the hue for text and border. Neutral chips stay raised.

### Cards / Containers

- **Corner Style:** `14px` on panels, `10px` on nested blocks.
- **Background:** surface (#11141B) on ground; raised (#171B24) for a block nested
  inside a panel.
- **Shadow Strategy:** none. See Elevation & Depth.
- **Border:** `1px` solid border (#30323E), always.
- **Corner notch:** a `10px` gilt-dim hairline on the top-left and bottom-right corners,
  inset `4px`. Two corners, not four: marked on all four it reads as a picture frame and
  starts competing with the table inside it.
- **Internal Padding:** `20px` on panels, `12px` on nested blocks. A panel header sits
  in its own `16px 20px` band separated by a subtle divider.
- Cards are never nested inside cards. A repeating card grid is not this system's page
  structure; tables and panels are.

### Tables

- **Header:** raised fill, uppercase label type at `0.04em`, subtle bottom border. Not
  sticky: the horizontal scroll container a wide table needs would trap it.
- **Rows:** `44px` tall, separated by subtle dividers, hover to `#1D2230` over `120ms`.
- **Row as link:** the whole row is clickable via a stretched anchor on the primary
  cell, so the pointer target is the row while the accessible name stays the event.
- **Numeric cells:** right-aligned, tabular numerals.
- **Empty cell:** an em dash at text-tertiary. A blank cell is never acceptable, because
  "no data" and "not synced yet" are different facts and must read differently.
- **Pagination:** a footer band inside the table border, showing the range and total on
  the left and previous / numbered / next controls on the right. Pagination is
  server-rendered from a `?page=` parameter; the current page is `aria-current="page"`.

### Inputs / Fields

- **Style:** raised fill, `1px` border, `8px` radius, `32px` tall, body type.
- **Focus:** border steps to amber and the amber halo appears. The border never
  disappears on focus.
- **Placeholder:** text-tertiary, which is the dimmest value that still clears 4.5:1.

### Navigation

- **Style:** a sticky full-width top bar, `56px` tall, surface fill, hairline bottom
  border. Brand mark left, primary links beside it, guild switcher and account right.
- **Brand mark:** `public/icon-512.webp`, the same mark the bot posts under in Discord:
  three chevrons in tank blue, healer green and dps red inside an amber ring. It is
  shipped as one file at `20px` in the nav, `48px` on the sign-in card, and as the
  favicon and touch icon. Never recoloured, never redrawn as an inline SVG, because the
  point of it is being the mark a raider already recognises from the event post.
- **Links:** label type at text-secondary, stepping to text-primary on hover.
- **Active:** text-primary plus a `2px` amber bar seated on the bar's bottom edge.
- **Mobile:** below 52rem the links become a horizontally scrollable strip on a second
  row; nothing is hidden behind a hamburger, because there are only three destinations.

### Locked panels (subscription-gated views)

Analytics, attendance trends, gear gap analysis and enchant compliance are part of a
paid tier. The dashboard never decides this: the service stops returning the data, and
the panel renders its locked state instead of its content.

- **Style:** the ordinary panel, at full opacity and full contrast. A locked panel is
  not blurred, greyed, or dimmed, because a raid lead has to be able to read what they
  would be getting.
- **Marker:** a neutral chip reading `Premium` in the panel header, in the badge
  vocabulary. Not amber, because it is not an action and not where you are.
- **Body:** a heading naming the view, one plain sentence on what it shows, and one
  primary button. Never a screenshot of fake data, never a blurred chart, never an
  invented number.
- **Nav:** a gated destination sits in the nav like any other, with the same `Premium`
  chip trailing its label. It is never hidden, because hiding it makes the product look
  smaller than it is.

### Signature Component: the summons

The overview's next raid, on vellum. It is the answer to the only question that page
asks, so it is the one place the budget is spent.

- **The sheet.** Vellum base under two off-centre washes and fractal grain, so it reads
  as paper rather than a beige rectangle. Gilt bevel on three sides.
- **The torn edge.** The bottom is a deckle, cut by a mask through both the sheet and
  the gilt, so the trim stops where the paper tears. Where masks are unavailable it is a
  straight edge and nothing is lost.
- **The sigil.** `EncounterSigil`, the same raid marker the comp board aims its beams
  at, carrying the same difficulty colour. On the overview it answers what tonight is
  pointed at.
- **The hearth.** A warm pool of light lying on the sheet and drifting across it. It is
  a transform on one composited layer, not an animated gradient, so a card left on
  screen for an hour costs no repaints.

**How alive it is encodes how close the pull is**, read server-side by `pullTier` in
`src/lib/guild-time.ts` and written onto the card as `data-pull`:

| Tier | | Hearth | Sigil breath |
|---|---|---|---|
| `distant` | more than a day | still, faint | 6s |
| `soon` | inside the day | drifts, 24s | 4.4s |
| `imminent` | inside six hours | drifts, 16s, stronger | 3.2s |
| `live` | already pulled | settled over the middle | 3.2s |

Separately, `signupsClosing` marks the last hour anyone can still be talked into coming,
and the signup deadline is the only thing on the card allowed to pulse, because it is
the only thing with a deadline.

This is not a countdown. A countdown on a server-rendered page is a lie the moment the
page finishes loading, and a raid lead does not need the seconds. The card is simply
more alive the closer the raid is, which is a thing you read without looking at it.

**The morph.** Clicking the summons carries the raid name and its chips into the event
detail header, which is the same vellum band, so the sheet travels rather than being
replaced. Built on the View Transitions API through Astro's `ClientRouter` with paired
`transition:name` values. The active nav indicator carries its own transition name and
slides between destinations on the same mechanism. Where the API is unavailable the
navigation is an ordinary one and nothing is lost.

## Do's and Don'ts

### Do:

- **Do** render controls from the API's `_links` and `allowed_statuses` and nothing
  else. A control the service did not offer must not exist in the markup.
- **Do** put `font-variant-numeric: tabular-nums` on every compared figure.
- **Do** state both facts in an empty cell: "Not synced yet" is not the same as no item
  level, and neither is a blank.
- **Do** keep transitions at `120-180ms` for state and up to `280ms` for a navigation
  morph. A raid lead is in flow.
- **Do** give an empty state a heading, one plain sentence, and the action that fills
  it.
- **Do** honour `prefers-reduced-motion: reduce` by dropping every transition and
  transition-name to nothing.

### Don't:

- **Don't** use amber for anything except the primary action and current state.
- **Don't** use a saturated colour that does not encode role, class, difficulty, or
  state.
- **Don't** add a drop shadow to a panel or a row.
- **Don't** introduce a third typeface, gradient text, or a glow. Cinzel is the second
  face and its range is fixed by the One Family Plus One Rule. The glow exceptions are
  the focus ring, the comp builder's encounter band, and the sigil's halo where it sits
  on the summons; all three are the same bloom on the same marker. The hearth on the
  vellum is not a glow: it is light lying on a surface, which is why it drifts across
  the sheet rather than pulsing behind the text. Nothing else glows.
- **Don't** let vellum onto a third surface, or gilt onto anything that is not 1px of
  trim. Both rules exist because both materials are one step from costume.
- **Don't** nest a card inside a card, or use a same-size card grid as a page's
  structure. A grid of blocks *inside* one panel is a different thing and is fine: the
  comp's role columns and the post-raid boss cards are both that.
- **Don't** answer a question by stacking every part of the answer down the screen. Count
  the common case, not the one the shape was designed against; a handful of things belongs
  in a grid, an unbounded list gets a page size, and an overview carries one figure per
  thing and a way in. See `docs/design.md` section 2, which exists because this went wrong
  three times.
- **Don't** stage a page-load animation. This surface opens into a task. The hearth is
  ambient and already running when the page arrives; it is not an entrance.
- **Don't** remove or thin a focus outline. Keyboard operability is a product
  requirement here, not a preference.
