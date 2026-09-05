---
version: 1
slug: "src-pages-analysis-index-astro"
primary_target: "src/pages/analysis/index.astro"
related_targets: ["src/pages/analysis/attendance.astro","src/pages/analysis/comp.astro","src/pages/analysis/roster.astro","src/pages/analysis/weeks.astro","src/pages/analysis/gear.astro","src/components/analysis-nav.astro","src/lib/analysis.ts"]
---

# Surface: analysis (`/analysis` and its five panel pages)

**Scope.** `src/pages/analysis/index.astro` and the five panel pages beside it, plus
`src/components/analysis-nav.astro`, `src/lib/analysis.ts`, and the marks they render
with: `proportion-bar`, `throughput-chart`, `ilvl-chart`, `chart-axis`, `chart-scale`,
`chart-readout`, `locked-panel`. Visitor mode: **Operate**, in the unhurried,
comparative half of it. This is the raid lead doing roster admin between raids, not the
one thirty minutes before pull.

**Job.** Answer four questions the guild argues about: who actually turns up, what we
actually field, how much of the roster is still here, and is the gear moving. Five
panels covering the same ninety days, said once in the page head.

**Was one page, is now six.** The single page stacked five full-width panels plus up to
four locked ones in one column, with an unpaginated attendance table over the whole
roster, and it had nowhere to grow. Each panel is now its own page under `/analysis`,
and `/analysis` is an overview.

The second reason for the split matters more than the scrolling: the old page fetched
all five panels on every render, so sorting the attendance table by no-shows re-fetched
the gear chart to do it. A panel page now follows one link. The overview is the only
page that still reads all five, because a card without its figure is an advert for a
page rather than a summary of one.

**The overview is not the old page shrunk.** One card per panel, each carrying a single
figure the service already sent, one line naming what the figure is, and the panel's own
blurb. Nothing on it divides two of its own fields. Where a card picks a value rather
than reading one off (the busiest role, the latest week's median) that is a selection
among numbers the service worked out, which is drawing, not statistics.

**One list of panels, spelled once.** `src/lib/analysis.ts` holds slug, rel, title and
blurb for all five in canonical order. The overview reads it, the sub-navigation reads
it, and every locked state reads it. Before the split the same five names lived in a
`locked[]` array that only the locked path used, and the titles in the template were a
second copy. A rel typo in that list silently locks a panel a guild has paid for, which
is why the list has a test asserting the exact five rels the service sends.

**The panel list is still not a permissions model.** The list of five is this repo's own
vocabulary. What is behind each one is the service's answer: the index carries a link for
every panel this guild may read, and a panel with no link renders locked. A lapsed
subscription looks exactly like a guild that never subscribed.

**Locked panels are gathered at the end of the overview, and never hidden from the
navigation.** On the overview, cards with content come first and locked ones follow, so a
guild without a subscription does not open on an advert with the one thing it can read
pushed below. This sorts on whether a panel has content, which is the service's answer,
so it is not a tier check; the order within each group is canonical, so a panel arrives
back where it was always going to be the moment its data does. In the sub-navigation a
gated destination sits in place with a neutral `Premium` chip, because hiding it makes
the product look smaller than it is.

**Sub-navigation is the top bar's grammar one level down.** A row of links with a 2px
amber bar under the current one, carrying its own `transition:name` so the marker slides
between destinations on the same mechanism `nav-marker` uses. Below 52rem it becomes a
horizontally scrolling strip rather than wrapping or collapsing, which is what the top
bar does with the same problem. No second navigation idea was invented, because two
navigation ideas on one page is how a raid lead loses track of which one they are in.

**The morph is the continuity.** A card's title carries `analysis-{slug}` and the panel
page sets the same name on its own title through the layout's `titleTransition`, so the
card's heading travels into the page head rather than the page replacing itself. Paired
`transition:name` values on the existing View Transitions mechanism, nothing new.

**The one chart form.** A stacked proportion bar: one whole, split by a channel that
already means something. It carries a raider's season, a role's share of the boards, and
what the roster can play, because in all three the question is the same shape. Choosing
it over four different chart types is the decision this surface is built on.

**Colour comes from the existing channels, or not at all.**
- Attendance splits three ways: turned up (`--success`), said yes and did not appear
  (`--danger`), answered no (`--text-tertiary`). Never answered is the empty track. Six
  statuses would need two hues twice over, and `DECLINED` against `NO_SHOW` is the one
  distinction the panel exists for.
- Roles take the role hues. Bench takes none, matching the event view, and specifically
  not `--warning`: four amber-adjacent bars beside the one amber button would take the
  eye off the only thing on the panel you can act on.
- The raid week's bars take `--success`, because they count confirmed signups and that
  is what `--success` means on this surface, on the event view and on the attendance
  ribbon. They were neutral first; that was not restraint, it was the one chart on the
  page refusing to say what it counted.
- Item level over time is drawn entirely in neutrals. Gear encodes no role, class,
  difficulty or state, so the one chart with no channel to borrow gets no colour. That
  restraint is what stops the section turning into a palette.

**The authored moment.** Every bar draws itself in from the left on arrival, a beat
behind the one above it, capped at twelve steps. A panel assembles top-down and the shape
of the guild's season lands before a single number has been read. It uses its own easing
rather than `--ease`: the surface's exponential ease-out is right for a 120ms state
change and puts a 460ms draw at nine tenths of its length in the first hundred
milliseconds, where the movement never reads.

A travelling bloom on the leading edge was built and cut. On a 6px bar it could not be
shown to read, and DESIGN.md's glow rule was left intact rather than spent on an effect
that had to be argued for instead of seen.

**Counts are people, never rows.** A raid week bar is how many raiders confirmed that
week, counted once each, not the sum of that week's signup rows. The sum reported more
people than the guild had, which is the worst thing an analysis panel can do: it was
wrong in the direction that flatters. Anything drawn beside the roster has to be
comparable with the roster.

**A chart answers when you ask it.** Both charts carry hover and focus readouts, from one
shared `chart-readout` shell: a `button` with the same sentence as its accessible name,
revealed in CSS, because an SVG `title` takes a second to appear, cannot be styled, and
never shows for somebody on a keyboard. No script on any page in this section.

Axis labels centre on their tick and only nudge at the real edges of the plot. Nudging
the first and last label unconditionally is what put a date to the left of its own bar
once there were only two of them.

**Both charts carry both axes.** A y-axis with labelled gridlines, and an x-axis that is
the whole ninety days rather than the extent of the data. Two weeks of history stretched
edge to edge draws a wedge that claims to be a quarter's trend; placed in the real window
against a thirteen-week grid it reads as two weeks, which is what it is. Weeks with
nothing in them are never filled with zeroes: "we took the week off" and "we were not
using this yet" are different facts and neither is a zero.

**Gear is quartiles over mains.** Not lowest to highest, and not every character. A
roster holds abandoned alts and one of them sets the floor at whatever it was when it was
abandoned, which drew a band spanning two hundred item levels and pinned the median to
the top edge of its own chart. The gear page says what the band is in a sentence rather
than making anyone read it off an axis.

**Constraints.**
- No number in this section is computed here. Every rate, share and median arrives worked
  out; a page that divides two of its own fields is a bug (hard rule 1). Bar geometry is
  the one exception, and it is drawing.
- Charts are hand-drawn SVG. No chart library was added, and the two shapes here do not
  justify one.
- Plots stretch with `preserveAspectRatio="none"` and keep their strokes with
  `vector-effect="non-scaling-stroke"`. Axis dates are HTML underneath, never SVG text,
  so a label stays real type at a real size on a phone.
- A page's `.stack` or `.cards` grid is `minmax(0, 1fr)`. A grid item's automatic minimum
  is its content, so the attendance table would push the page wider than a phone instead
  of scrolling inside its own wrapper.
- Attendance sorts and paginates from the query string, the way the events list
  paginates: real links, no script, and a sorted page is a URL. The default is still the
  order the service sent. Sorting drops the page number, because page four of one order
  is nowhere in another; paging keeps the sort, because otherwise the second page undoes
  the click that got you there.
- The pager's number window lives in `src/lib/pagination.ts`, shared with the events
  list. It is one piece of knowledge about how a pager reads, not markup that happens to
  look alike: the same roster must not paginate two ways on two pages.
