/**
 * First, last, and the current page's neighbours. Gaps render as an ellipsis.
 *
 * Shared because it is one piece of knowledge about how a pager reads, not markup that
 * happens to look alike: the events list and the attendance table have to agree on when
 * a run of numbers turns into a gap, or the same roster paginates two different ways on
 * two pages.
 */
export function pageWindow(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < pageCount);
  const spread: (number | null)[] = [];
  let previous = 0;
  for (const n of [1, ...around, pageCount]) {
    if (previous > 0 && n - previous > 1) {
      spread.push(null);
    }
    spread.push(n);
    previous = n;
  }
  return spread;
}

/** The requested page, kept inside the pager. Anything unreadable is page one. */
export function clampPage(requested: string | null, pageCount: number): number {
  const asked = Number.parseInt(requested ?? '1', 10);
  return Number.isNaN(asked) ? 1 : Math.min(Math.max(asked, 1), pageCount);
}
