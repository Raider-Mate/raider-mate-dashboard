import type { Actor } from './actor';
import { getLink, hasLink } from './links';
import type { ServiceClient } from './service-client';
import type { AnalysisIndex } from './service-types';

/**
 * The panels the analysis section is made of, in the order they are meant to be read.
 *
 * This list is the repo's own vocabulary, not a permissions model. What is behind each
 * panel is the service's answer: the index carries a link for every panel a guild may
 * read, and a panel with no link renders locked. Naming them here is what lets the
 * overview, the sub-navigation and the locked states all say the same words.
 */
export interface Panel {
  /** Last segment of the panel's route, and the key everything else looks it up by. */
  slug: PanelSlug;
  /** The rel the analysis index carries when this guild may read the panel. */
  rel: string;
  title: string;
  /** One plain sentence on what the panel shows. Never a pitch, never an apology. */
  blurb: string;
}

export type PanelSlug = 'weeks' | 'attendance' | 'comp' | 'roster' | 'gear';

export const PANELS: readonly Panel[] = [
  {
    slug: 'weeks',
    rel: 'throughput',
    title: 'The raid week',
    blurb: 'Raids run per week, and what share of the people who said yes never appeared.',
  },
  {
    slug: 'attendance',
    rel: 'attendance',
    title: 'Attendance',
    blurb: 'Who turns up, who says no in advance, and who never answers at all.',
  },
  {
    slug: 'comp',
    rel: 'comp-balance',
    title: 'Comp balance',
    blurb:
      'Which roles you actually field week to week, and who has been carrying the bench for everyone else.',
  },
  {
    slug: 'roster',
    rel: 'roster-health',
    title: 'Roster health',
    blurb:
      'How much of the roster still turns up, and which role you are one holiday away from not being able to field.',
  },
  {
    slug: 'gear',
    rel: 'ilvl',
    title: 'Gear over time',
    blurb:
      "The roster's item level week by week, from snapshots Raider Mate has been keeping for you all along.",
  },
];

export function panelFor(slug: PanelSlug): Panel {
  return PANELS.find((panel) => panel.slug === slug)!;
}

/** Where a panel lives. One function, so a route never gets spelled out by hand. */
export function panelHref(slug: PanelSlug): string {
  return `/analysis/${slug}`;
}

export function fetchAnalysisIndex(
  client: ServiceClient,
  actor: Actor | null,
  guildId: string,
): Promise<AnalysisIndex> {
  return client.get<AnalysisIndex>(actor, `/api/guilds/${guildId}/analysis`);
}

/**
 * Follows one panel's link, or returns null when the index did not carry it.
 *
 * No link, nothing to ask for: the panel renders locked and the service is never put in
 * the position of refusing a request the caller already knew the answer to.
 */
export async function followPanel<T>(
  client: ServiceClient,
  actor: Actor | null,
  index: AnalysisIndex,
  rel: string,
): Promise<T | null> {
  if (!hasLink(index, rel)) {
    return null;
  }
  return (await client.follow<T>(actor, getLink(index, rel)!)).body;
}

/** The value of a settled promise, or null where it rejected. */
export function settled<T>(result: PromiseSettledResult<T | null>): T | null {
  return result.status === 'fulfilled' ? result.value : null;
}

/**
 * A rate the service already worked out, as a whole percent. Rounding is presentation;
 * the division happened in the service, which is where it belongs.
 */
export function percent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
