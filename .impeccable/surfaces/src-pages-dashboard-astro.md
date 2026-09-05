---
version: 1
slug: "src-pages-dashboard-astro"
primary_target: "src/pages/dashboard.astro"
related_targets:
  - "src/components/encounter-sigil.astro"
  - "src/lib/guild-time.ts"
---

# Surface: the overview (`/dashboard`)

**Scope.** `src/pages/dashboard.astro`, the page a raid lead lands on after picking a
guild. Visitor mode: **Operate**.

**Audience and job.** A raid lead half an hour before pull, with the game and Discord
open beside this. One question: what is next, and is it still open. They read the answer
and leave. A raider arriving from a Discord link passes through here on the way to an
event.

**The answer, at the scale of the answer.** The next raid is the summons: a sheet of
vellum carrying the raid name in Cinzel, its type and difficulty chips, the start time in
the guild's timezone, how long signups remain open, and the encounter sigil aimed at it.
Everything after it is on dark, because everything after it is a list.

**How alive it is encodes how close the pull is.** `pullTier` and `signupsClosing` in
`src/lib/guild-time.ts` are read in frontmatter and written onto the card as `data-pull`
and a class. Four tiers, one hearth, one breath, one pulse on the deadline inside the
last hour. Server-rendered on a page that is never prerendered, so it is right when it
arrives, and the absolute times are on the card regardless.

This is deliberately not a countdown. A ticking figure on a server-rendered page is
wrong a second after it loads, and the seconds are not the thing a raid lead needs.

**Constraints.**
- The card renders `Event` fields and nothing computed. No signup arithmetic, no comp
  state, no permission decision. `/events` and the event page own those.
- Three events at most, then a link. `docs/design.md` §2: the answer cannot be below the
  fold, and an unbounded list on an overview is the shape that puts it there.
- Vellum lives here and on the event header, and nowhere else. See `DESIGN.md`.
- The sigil is `aria-hidden`; the raid name is already the heading, and announcing the
  marker again would just be the title twice.
- Empty state names the real cause, that events are created from Discord, and offers the
  bot install rather than a shrug.

**What it must survive.** `prefers-reduced-motion: reduce` stops the hearth, the breath
and the deadline pulse with the card fully readable. Below 40rem the sigil goes and the
raid name drops a step; nothing else moves.
