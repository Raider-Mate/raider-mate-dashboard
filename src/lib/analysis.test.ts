import { describe, expect, it } from 'vitest';

import { PANELS, panelFor, panelHref, percent, settled } from './analysis';

describe('PANELS', () => {
  it('is the canonical read order', () => {
    expect(PANELS.map((panel) => panel.slug)).toEqual([
      'weeks',
      'attendance',
      'comp',
      'roster',
      'gear',
    ]);
  });

  it('gives every panel its own slug and its own rel', () => {
    expect(new Set(PANELS.map((panel) => panel.slug)).size).toBe(PANELS.length);
    expect(new Set(PANELS.map((panel) => panel.rel)).size).toBe(PANELS.length);
  });

  it('carries the rels the service names its panels by', () => {
    // Transcribed from the service's analysis index, not invented here. A typo in one of
    // these silently locks a panel a guild has paid for.
    expect(PANELS.map((panel) => panel.rel)).toEqual([
      'throughput',
      'attendance',
      'comp-balance',
      'roster-health',
      'ilvl',
    ]);
  });
});

describe('panelFor', () => {
  it('finds a panel by its slug', () => {
    expect(panelFor('gear').title).toBe('Gear over time');
  });
});

describe('panelHref', () => {
  it('puts every panel under /analysis', () => {
    expect(PANELS.map((panel) => panelHref(panel.slug))).toEqual([
      '/analysis/weeks',
      '/analysis/attendance',
      '/analysis/comp',
      '/analysis/roster',
      '/analysis/gear',
    ]);
  });
});

describe('settled', () => {
  it('unwraps a fulfilled result', () => {
    expect(settled({ status: 'fulfilled', value: 7 })).toBe(7);
  });

  it('turns a rejection into null rather than throwing', () => {
    // One panel failing must not blank the ones that loaded.
    expect(settled({ status: 'rejected', reason: new Error('nope') })).toBeNull();
  });
});

describe('percent', () => {
  it('renders a rate the service worked out as a whole percent', () => {
    expect(percent(0)).toBe('0%');
    expect(percent(0.5)).toBe('50%');
    expect(percent(1)).toBe('100%');
  });

  it('rounds rather than truncating', () => {
    expect(percent(0.666)).toBe('67%');
  });
});
