---
version: 1
slug: "src-pages-events-id-index-astro"
primary_target: "src/pages/events/[id]/index.astro"
related_targets: ["src/components/pull-timeline.astro","src/components/meter-board.astro"]
---

# Surface: the event page (`/events/:id`)

**Scope.** `src/pages/events/[id]/index.astro` and the two marks the post-raid face is
built from, `pull-timeline` and `meter-board`. Visitor mode: **Operate**, in both halves
of it: the raid lead thirty minutes before pull, and the same person on Thursday morning
wanting to know what happened.

**Two faces, one URL.** Before a report has been read the page is what it always was: the
comp, the late requests, the signup sheet. Once the service sends a `report` link it turns
around. The night leads, the plan moves below it.

Which face is a link rel, never a clock. The page does not compare `starts_at` to now to
decide a raid is over, and does not read a tier flag to decide it may show numbers.
Exactly one of `report`, `report-pending` and `report-failed` arrives; none of them means
the instance has no WarcraftLogs credentials and the page is unchanged.

**Nothing is demoted away.** The comp and the signup sheet keep every control they had,
one disclosure down. The disclosure is rendered either way and hides its own summary
before the flip, because a wrapper that only sometimes exists would mean two copies of
everything inside it.

**Two things the flip removes rather than demotes**, because they are controls that can
only be refused once the raid has happened: the signup form, and the late-request queue.
Signing up for a night the log has already been read for is meaningless, and approving a
plea to be let onto that night changes nothing that can still be changed.

Late requests were kept visible at first, on the reasoning that a pending request is a
decision a raid lead still owes somebody. That is true right up until the raid starts and
false immediately afterwards, and what the queue mostly showed on a finished event was an
empty "Nothing waiting" panel.

The signal for both is the service's, not a clock: the report link is what says the night
happened, never a comparison of `starts_at` against now.

**The authored moment: the boss cards.** A grid of small cards, one per boss, each mostly
its own trajectory: a tiny line plotting how far into the boss each pull got, the outcome
under it ("Killed on pull 2", "Best 13.4%"), then the boss name, and every pull spelled out
underneath.

The name sits under its own shape rather than over it. Across a grid of six you find the
boss you mean by the line first, and read the name to confirm.

**It took three goes, and the first two are worth remembering.** Full-width bands stacked
one boss per row read well for the night they were designed against, twelve pulls on one
boss, and turned a six-boss clear into a screen and a half of mostly empty green. Wider
cards with a bar per pull fixed the stacking and kept the real problem: a bar chart of two
pulls is not a chart, it is two rectangles, and at card size the axis it wanted had nowhere
to go.

What a raid lead reads off a boss is one shape: did we get there, and were we getting
closer. That is a line, and a line survives being small. The bars are gone.

**No panel around them.** They are the cards; wrapping them would nest a card inside a
card, which this system does not do. `docs/design.md` section 2 is the rule they came from.

**Colour is the outcome.** One hue per card, `--success` or `--danger`, carried by the
line, the last dot and the outcome line together. A night of five green cards and one red
is read without any reading, which is the whole job of the grid.

The dashed rule across the top of every plot is where the boss dies. A line that reaches it
killed something.

A pull WarcraftLogs could not measure is left off the line rather than plotted at zero.
"We could not measure it" and "we wiped at full health" are different facts.

Each bar links out to that pull on WarcraftLogs (`#fight=12`). Per-fight numbers are not
fetched: three extra table queries per pull against a 3600-point hourly budget, to
reproduce a breakdown that already exists one click away and is better there.

**Motion.** Each boss's trajectory wipes in from the left, dots arriving as the sweep
reaches them, so the night replays in the order it happened.

It is a `clip-path` sweep and not a stroke dash, and the reason is worth keeping. The dash
version drew the line by hiding it (`stroke-dashoffset: 1`) and revealing it, so its
resting state was invisible and anything that interfered left a line stopping partway to
its own last point, which is exactly what shipped and had to be fixed. A clip only takes
away what is already there: a plot that never animates is a plot that is simply complete.
Default state is the finished state.

**Cards take whatever width the row gives them.** `auto-fit`, so empty tracks collapse and
one boss alone fills the row. The track floor is a sixth of the row, which is what caps a
row at six: a seventh cannot fit beside them and wraps. Never below 13rem, where the pull
list stops being readable, and never above 100%, so a phone gets one column.

**The dots are HTML, not SVG.** The canvas is stretched on both axes so the plot can be any
width at a fixed height, and a stretched circle is an ellipse. Positioning the dots in HTML
keeps them round at every card width, and makes each one a link into its own pull. The
whole plot area is inset by half the widest dot, or the first and last pull get sliced by
the edge of their own card.

**Every pull is clickable, twice, and clicking one selects it.** The dot on the plot and
the line in the list under it both point at `?fight=<id>#board`, which swaps the board
below to that pull's own numbers. Amber marks the selected pull, because amber means where
you are.

Selecting costs no request: the service sends every pull's numbers inside the report, so
the page already holds them. It is still a query parameter rather than script, for the
reason the metric tabs are: a wipe worth arguing about is a URL worth pasting into Discord.

The board says what it is showing under its own title, and a pull WarcraftLogs was not read
individually for falls back to the night and says so rather than showing an empty board.

**One way out to WarcraftLogs per boss, not per pull.** The pulls belong to the board now,
so each card carries a single "View on WarcraftLogs" link at its foot. The boss name stopped
being a link when it stopped being the way out. `scaleY` from the bottom, never `height`: a thirty-pull night would
otherwise relayout the row every frame. It reuses the analysis bars' constants
(`STEP_MS = 38`, `MAX_STEPS = 12`) and their curve, `cubic-bezier(0.33, 0.86, 0.44, 1)`,
rather than `--ease`, for the reason stated there: the surface's exponential ease-out puts
a long draw at nine tenths of its length in the first hundred milliseconds, where the
movement never reads. Full value in the default state, dropped entirely under
`prefers-reduced-motion`.

**One authored moment, not two.** The board's bars draw in on the same constants and the
same curve deliberately, so they read as the same idea quietly repeated rather than as a
second flourish competing with the timeline. No glow anywhere: DESIGN.md spends its one
glow exception on the comp builder's encounter band and says so.

**The board is three views of one set of rows.** `?metric=damage|healing|deaths`, real
links, server-rendered, like the analysis sort. Deaths deliberately renders no bar: a count
of nought to a handful says nothing proportionally that the number does not.

Class colour is a 3px marker, never text, because several of Blizzard's thirteen cannot
carry text at 4.5:1 on this ground. The viewer's own row takes the same amber inset the
signups table on this page already uses; a second treatment for the same idea on one page
would be worse than matching it.

**Who showed is the reason this exists.** A damage meter is a worse version of WarcraftLogs.
The turnout is not available anywhere else, because only Raider Mate holds the signup
sheet: who said yes and zoned in, who zoned in without being on the roster, and who said
yes and never appeared.

That third list can be wrong for innocent reasons, and says so in one sentence under
itself rather than accusing anybody. The second says what it might be (a pug, a trial, an
unsynced character) and does not guess between them. A low `roster_overlap` leads with a
line suggesting the report belongs to a different night, which is the service's own number
read back rather than a rule invented here.

**Constraints.**
- No number is computed here. Totals, boss percentages and pull durations arrive worked
  out. Bar geometry is the one division and it is drawing, not statistics.
- Formatting a number the service sent (`1.42M`) is presentation. Deriving one is a bug.
- Every control comes from a link rel: `set-warcraftlogs`, `refresh-report`, and the three
  report rels. A raider sees none of the first two in the markup at all.
- No script. The metric tabs are links, the disclosures are `<details>`, and the plots are
  hand-drawn SVG scaled uniformly: stretching the box independently would turn every dot
  into an ellipse, and the dots are the pulls.
- The per-pull list is capped and scrolls inside itself. A grid row is as tall as its
  tallest card, and one twelve-pull boss beside five one-pull kills would otherwise empty
  out the whole row.
- The attendance panel still counts signup statuses. What the log says about who turned up
  deliberately does not feed it: two pages disagreeing about the word "turned up" would be
  worse than one page not knowing.

## The header band (2026-09-05)

The page title sits on vellum, the same sheet as the overview's summons, set by the
`vellum` prop on `DashboardLayout`. It is the far end of the morph that starts on the
overview: the raid name and its chips travel from the summons onto matching material
rather than onto a dark bar.

That prop has one caller and is meant to. The band is owned by the layout, so the page
cannot reach it, and the event header is the only header that is the other half of an
object on another page.

Everything inside the band takes the vellum token scope without knowing it exists: the
chips re-cut for paper, the "All events" button on a lighter sheet, the focus ring in
bronze. Nothing in this page's own styles was changed for it.
