import { describe, expect, it } from 'vitest';
import type { Filters, RosterRow } from './roster-view';
import { NO_FILTERS, mainRole, matches, roleCounts, sortRows } from './roster-view';
import type { Character } from './service-types';

function row(over: Partial<RosterRow> = {}): RosterRow {
  return {
    name: 'Thrall',
    role: 'TANK',
    roles: ['TANK'],
    className: 'Warrior',
    spec: 'Protection',
    ilvl: 300,
    mplus: 2000,
    enchantsMissing: 0,
    tier: 4,
    mythic: 2,
    isMain: true,
    synced: true,
    archived: false,
    notFoundSince: null,
    ...over,
  };
}

function filters(over: Partial<Filters> = {}): Filters {
  return { ...NO_FILTERS, ...over };
}

describe('mainRole', () => {
  it('reads the front of the menu the service ordered', () => {
    const character = {
      roles: [
        { role: 'HEALER', priority: 1 },
        { role: 'RDPS', priority: 2 },
      ],
    } as Character;
    expect(mainRole(character)).toBe('HEALER');
  });

  it('is null for a raider who registered no roles', () => {
    // Not a role of its own, and not a default. A raider who picked nothing is a fact
    // the roster shows rather than a gap it fills in.
    expect(mainRole({} as Character)).toBeNull();
    expect(mainRole({ roles: [] } as unknown as Character)).toBeNull();
  });
});

describe('matches', () => {
  it('finds a name typed without its diacritics', () => {
    expect(matches(row({ name: 'Centurián' }), filters({ search: 'centurian' }))).toBe(true);
    expect(matches(row({ name: 'Imeyâ' }), filters({ search: 'imea' }))).toBe(false);
  });

  it('searches class and spec as well as the name', () => {
    expect(matches(row(), filters({ search: 'protect' }))).toBe(true);
    expect(matches(row(), filters({ search: 'warri' }))).toBe(true);
    expect(matches(row(), filters({ search: 'rogue' }))).toBe(false);
  });

  it('splits on every role a raider registered, not only their first', () => {
    // A melee who can tank answers the Tanks chip. The chip is asked who can fill the
    // seat, not who signed up as one.
    const offspec = row({ role: 'MDPS', roles: ['MDPS', 'TANK'] });
    expect(matches(offspec, filters({ role: 'MDPS' }))).toBe(true);
    expect(matches(offspec, filters({ role: 'TANK' }))).toBe(true);
    expect(matches(offspec, filters({ role: 'HEALER' }))).toBe(false);
  });

  it('gathers the raiders with no role menu under NONE', () => {
    expect(matches(row({ role: null, roles: [] }), filters({ role: 'NONE' }))).toBe(true);
    expect(matches(row({ role: 'TANK', roles: ['TANK'] }), filters({ role: 'NONE' }))).toBe(false);
  });

  it('treats unknown enchant data as unknown, not as compliant', () => {
    // The service omits the field when it has established nothing. Such a character is
    // not missing enchants, and must not answer a filter asking who is.
    expect(matches(row({ enchantsMissing: null }), filters({ missingEnchants: true }))).toBe(false);
    expect(matches(row({ enchantsMissing: 0 }), filters({ missingEnchants: true }))).toBe(false);
    expect(matches(row({ enchantsMissing: 2 }), filters({ missingEnchants: true }))).toBe(true);
  });

  it('applies every active filter at once', () => {
    const alt = row({ isMain: false, className: 'Mage' });
    expect(matches(alt, filters({ mainCharacter: true, className: 'Mage' }))).toBe(false);
    expect(matches(alt, filters({ className: 'Mage' }))).toBe(true);
  });

  it('keeps the main character and the main spec apart', () => {
    // A guild says "main" about a character and "main spec" about a role. Joharian is a
    // main character whose second role is tank, and the two toggles have to answer
    // differently about him.
    const offspec = row({ role: 'MDPS', roles: ['MDPS', 'TANK'], isMain: true });
    expect(matches(offspec, filters({ role: 'TANK', mainCharacter: true }))).toBe(true);
    expect(matches(offspec, filters({ role: 'TANK', mainSpec: true }))).toBe(false);
    expect(matches(offspec, filters({ role: 'MDPS', mainSpec: true }))).toBe(true);
  });

  it('leaves main spec inert while no role is chosen', () => {
    // There is no role for a spec to be first in yet. The chip is disabled in the UI
    // for the same reason, and the filter agrees rather than quietly dropping rows.
    const offspec = row({ role: 'MDPS', roles: ['MDPS', 'TANK'] });
    expect(matches(offspec, filters({ role: 'ALL', mainSpec: true }))).toBe(true);
  });
});

describe('sortRows', () => {
  const rows = [
    row({ name: 'Alinella', ilvl: 278, role: 'RDPS', roles: ['RDPS'] }),
    row({ name: 'Grudum', ilvl: null, role: 'HEALER', roles: ['HEALER'] }),
    row({ name: 'Inqenieur', ilvl: 314, role: 'MDPS', roles: ['MDPS'] }),
  ];
  const names = (sorted: RosterRow[]) => sorted.map((r) => r.name);
  const identity = (r: RosterRow) => r;

  it('orders a number column both ways', () => {
    expect(names(sortRows(rows, identity, 'ilvl', 'asc')).slice(0, 2)).toEqual([
      'Alinella',
      'Inqenieur',
    ]);
    expect(names(sortRows(rows, identity, 'ilvl', 'desc')).slice(0, 2)).toEqual([
      'Inqenieur',
      'Alinella',
    ]);
  });

  it('keeps the rows with no value at the bottom in both directions', () => {
    // Flipping a column should move the raiders who have a number, not park the
    // unsynced ones at the top of the table.
    expect(names(sortRows(rows, identity, 'ilvl', 'asc')).at(-1)).toBe('Grudum');
    expect(names(sortRows(rows, identity, 'ilvl', 'desc')).at(-1)).toBe('Grudum');
  });

  it('orders roles the way a raid frame reads, on the role each raider plays first', () => {
    expect(names(sortRows(rows, identity, 'role', 'asc'))).toEqual([
      'Grudum',
      'Inqenieur',
      'Alinella',
    ]);
  });

  it('breaks a tie on the name, so a re-sort never reshuffles equals', () => {
    const tied = [row({ name: 'Zeta', ilvl: 300 }), row({ name: 'Alpha', ilvl: 300 })];
    expect(names(sortRows(tied, identity, 'ilvl', 'desc'))).toEqual(['Alpha', 'Zeta']);
  });

  it('leaves the input alone', () => {
    const original = [...rows];
    sortRows(rows, identity, 'ilvl', 'desc');
    expect(rows).toEqual(original);
  });
});

describe('the archived roster', () => {
  it('is a separate list rather than extra rows in the active one', () => {
    const left = row({ archived: true });
    const here = row();
    expect(matches(left, filters())).toBe(false);
    expect(matches(here, filters())).toBe(true);
    expect(matches(left, filters({ archived: true }))).toBe(true);
    expect(matches(here, filters({ archived: true }))).toBe(false);
  });

  it('still answers the other filters while it is showing', () => {
    // An archived roster is scanned the same way the active one is: a raid lead looking
    // for the tanks who left is asking a real question.
    const left = row({ archived: true, role: 'HEALER', roles: ['HEALER'] });
    expect(matches(left, filters({ archived: true, role: 'HEALER' }))).toBe(true);
    expect(matches(left, filters({ archived: true, role: 'TANK' }))).toBe(false);
  });
});

describe('roleCounts', () => {
  it('counts only the role each raider plays first when main spec is on', () => {
    const counts = roleCounts(
      [
        row({ role: 'TANK', roles: ['TANK'] }),
        row({ role: 'MDPS', roles: ['MDPS', 'TANK'] }),
        row({ role: null, roles: [] }),
      ],
      true,
    );
    expect(counts).toEqual({ ALL: 3, TANK: 1, HEALER: 0, MDPS: 1, RDPS: 0, NONE: 1 });
  });

  it('counts a raider once per role they registered', () => {
    // The chips overshoot the roster on purpose. Four raiders, five role seats, because
    // one of them tanks as well, and that is the number a raid lead is after.
    const counts = roleCounts([
      row({ role: 'TANK', roles: ['TANK'] }),
      row({ role: 'MDPS', roles: ['MDPS', 'TANK'] }),
      row({ role: 'HEALER', roles: ['HEALER'] }),
      row({ role: null, roles: [] }),
    ]);
    expect(counts).toEqual({ ALL: 4, TANK: 2, HEALER: 1, MDPS: 1, RDPS: 0, NONE: 1 });
  });
});
