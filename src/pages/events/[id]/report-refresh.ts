import type { APIRoute } from 'astro';

import { getLink } from '../../../lib/links';
import { noticeCodeFor } from '../../../lib/service-notice';
import type { Event } from '../../../lib/service-types';

export const prerender = false;

/**
 * Asks the service to read the attached report again.
 *
 * A report is read once and then left alone, because a finished raid night cannot
 * change. This is the button for the case where it did: WarcraftLogs was down when it
 * was first tried, or a raid lead has just set a private report to unlisted and wants
 * the numbers now rather than at the next tick.
 *
 * The transition is read from an event fetched here rather than from a hidden field, for
 * the same reason the log form does it: an href in a form would let a browser aim this
 * dashboard's shared API key at any path on the service. The absence of `refresh-report`
 * is the answer for anyone who is not a raid lead.
 */
export const POST: APIRoute = async ({ params, locals, redirect }) => {
  const { session, actor, client } = locals;
  if (!session?.selectedGuildId || !actor) {
    return redirect('/guild');
  }

  const eventId = params.id!;
  const back = (notice?: string) =>
    redirect(`/events/${eventId}${notice ? `?notice=${notice}` : ''}`);

  try {
    const event = await client.get<Event>(actor, `/api/events/${eventId}`);
    const link = getLink(event, 'refresh-report');
    if (!link) {
      return back('denied');
    }

    await client.follow(actor, link);
    return back('rereading');
  } catch (error) {
    return back(noticeCodeFor(error));
  }
};
