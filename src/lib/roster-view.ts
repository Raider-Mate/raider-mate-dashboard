import { ROLE_ORDER } from './roles';
import type { Character, Role } from './service-types';

/**
 * Searching, filtering and sorting the roster table, as data. This decides nothing
 * about raiders: every field it reads arrived on the wire already, and every question
 * it answers is "which of these rows is the reader looking at right now".
 *
 * Pure on purpose, the same way comp-board is. The roster script is DOM plumbing over
 * these functions, so the ordering and the matching can be tested without a browser.
 */

/** A row's facts, flattened off the wire so a comparator never walks a response. */
export interface RosterRow {
  name: string;
  /**
   * The role this raider plays first. The service sends the menu in priority order, so
   * this is the first entry rather than a judgement made here. Null when they
   * registered no menu at all. What the Role column shows and what it sorts on.
   */
  role: Role | null;
  /**
   * The whole menu, which is what the role chips match. A raider who plays melee and
   * can tank belongs under both, because the question a role chip is asked is "who can
   * fill this seat" rather than "who signed up as one".
   */
  roles: Role[];
  className: string | null;
  spec: string | null;
  ilvl: number | null;
  mplus: number | null;
  /** Still missing, not yet enchanted. Null when the service established nothing. */
  enchantsMissing: number | null;
  tier: number | null;
  /** Mythic kills, the deepest count in a progression cell. */
  mythic: number | null;
  isMain: boolean;
  synced: boolean;
  /** Off the roster. Archived and active never appear in the same table. */
  archived: boolean;
  /** When Raider.IO stopped finding them, or null while it still does. */
  notFoundSince: string | null;
}

export type SortKey =
  'name' | 'role' | 'class' | 'ilvl' | 'mplus' | 'enchants' | 'tier' | 'progression';

export type SortDirection = 'asc' | 'desc';

/** ALL is every raider; NONE is the ones who registered no roles at all. */
export type RoleFilter = Role | 'ALL' | 'NONE';

export interface Filters {
  search: string;
  role: RoleFilter;
  /** A class name as the service spelled it, or ALL. */
  className: string | 'ALL';
  /**
   * A raider's main character rather than their alts. Deliberately not called "main":
   * a guild says "main" about a character and "main spec" about a role, and one toggle
   * carrying both readings is the one thing this pair must not do.
   */
  mainCharacter: boolean;
  /**
   * Narrows the role chip to the raiders who play that role first, dropping the ones
   * who only offspec it. Reads as nothing on its own: with no role chosen there is no
   * role for a spec to be first in.
   */
  mainSpec: boolean;
  /**
   * Two facts, not a verdict. "Missing enchants" is `enchants_missing` above zero, and
   * a character the worker has never read is a separate toggle, because a raid lead
   * chasing gear and a raid lead chasing registrations are doing different jobs.
   */
  missingEnchants: boolean;
  unsynced: boolean;
  /**
   * Which roster to show, not a narrowing. The archived are a separate list rather than
   * extra rows in this one: they are kept for the raids they attended, and mixing them
   * into a comp-planning scan would put raiders in it who are not coming.
   */
  archived: boolean;
}

export const NO_FILTERS: Filters = {
  search: '',
  role: 'ALL',
  className: 'ALL',
  mainCharacter: false,
  mainSpec: false,
  missingEnchants: false,
  unsynced: false,
  archived: false,
};

/**
 * The role a raider plays first, or null. The service orders the menu by priority; this
 * reads the front of it rather than ranking anything.
 */
export function mainRole(character: Character): Role | null {
  return character.roles?.[0]?.role ?? null;
}

export function toRow(character: Character): RosterRow {
  return {
    name: character.name,
    role: mainRole(character),
    roles: character.roles?.map((choice) => choice.role) ?? [],
    className: character.class ?? null,
    spec: character.spec ?? null,
    ilvl: character.ilvl ?? null,
    mplus: character.mplus_score ?? null,
    enchantsMissing: character.enchants_missing ?? null,
    tier: character.tier_pieces ?? null,
    mythic: character.progression?.mythic ?? null,
    isMain: character.is_main,
    synced: character.synced,
    archived: character.archived_at !== undefined,
    notFoundSince: character.not_found_since ?? null,
  };
}

/**
 * Folded for searching: lower case, and diacritics stripped. A guild roster is full of
 * names like Centurián and Imeyâ, and a raid lead typing "centurian" is looking for the
 * same raider.
 */
export function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function matches(row: RosterRow, filters: Filters): boolean {
  if (row.archived !== filters.archived) {
    return false;
  }
  if (filters.role === 'NONE') {
    if (row.roles.length > 0) {
      return false;
    }
  } else if (filters.role !== 'ALL') {
    const plays = filters.mainSpec ? row.role === filters.role : row.roles.includes(filters.role);
    if (!plays) {
      return false;
    }
  }
  if (filters.className !== 'ALL' && row.className !== filters.className) {
    return false;
  }
  if (filters.mainCharacter && !row.isMain) {
    return false;
  }
  // Absent is unknown, never compliant, so a character with no enchant data is not a
  // character with nothing missing.
  if (filters.missingEnchants && !(row.enchantsMissing !== null && row.enchantsMissing > 0)) {
    return false;
  }
  if (filters.unsynced && row.synced) {
    return false;
  }

  const needle = fold(filters.search.trim());
  if (needle === '') {
    return true;
  }
  return [row.name, row.className, row.spec]
    .filter((field): field is string => field !== null)
    .some((field) => fold(field).includes(needle));
}

/**
 * Rows in a comparable order for one column. Null sorts last in both directions:
 * flipping an item level column should move the raiders who have one, not park the
 * unsynced ones at the top.
 */
function compare(a: RosterRow, b: RosterRow, key: SortKey, direction: SortDirection): number {
  const sign = direction === 'asc' ? 1 : -1;

  if (key === 'name') {
    return sign * a.name.localeCompare(b.name);
  }
  if (key === 'class') {
    return textCompare(a.className, b.className, sign) || a.name.localeCompare(b.name);
  }
  if (key === 'role') {
    return rankCompare(roleRank(a.role), roleRank(b.role), sign) || a.name.localeCompare(b.name);
  }

  const numbers: Record<Exclude<SortKey, 'name' | 'class' | 'role'>, keyof RosterRow> = {
    ilvl: 'ilvl',
    mplus: 'mplus',
    enchants: 'enchantsMissing',
    tier: 'tier',
    progression: 'mythic',
  };
  const field = numbers[key];
  return (
    rankCompare(a[field] as number | null, b[field] as number | null, sign) ||
    a.name.localeCompare(b.name)
  );
}

function roleRank(role: Role | null): number | null {
  return role === null ? null : ROLE_ORDER.indexOf(role);
}

function rankCompare(a: number | null, b: number | null, sign: number): number {
  if (a === null || b === null) {
    return a === b ? 0 : a === null ? 1 : -1;
  }
  return sign * (a - b);
}

function textCompare(a: string | null, b: string | null, sign: number): number {
  if (a === null || b === null) {
    return a === b ? 0 : a === null ? 1 : -1;
  }
  return sign * a.localeCompare(b);
}

export function sortRows<T>(
  items: T[],
  rowOf: (item: T) => RosterRow,
  key: SortKey,
  direction: SortDirection,
): T[] {
  return [...items].sort((a, b) => compare(rowOf(a), rowOf(b), key, direction));
}

/**
 * How many raiders each role chip holds. A raider counts once per role they registered,
 * so these deliberately overshoot the roster: six tanks and thirteen melee on a roster
 * of thirty-four is the useful answer when one of them is both.
 *
 * `mainSpecOnly` counts the role each raider plays first instead, which is what the
 * chips have to say while that filter is on. A count the table then contradicts is
 * worse than no count.
 */
export function roleCounts(rows: RosterRow[], mainSpecOnly = false): Record<RoleFilter, number> {
  const counts: Record<RoleFilter, number> = {
    ALL: rows.length,
    TANK: 0,
    HEALER: 0,
    MDPS: 0,
    RDPS: 0,
    NONE: 0,
  };
  for (const row of rows) {
    if (row.roles.length === 0) {
      counts.NONE += 1;
      continue;
    }
    for (const role of mainSpecOnly ? [row.role!] : row.roles) {
      counts[role] += 1;
    }
  }
  return counts;
}
