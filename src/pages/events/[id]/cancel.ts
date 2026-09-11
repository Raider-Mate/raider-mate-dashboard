import type { APIRoute } from 'astro';

import { getLink } from '../../../lib/links';
import { ServiceError } from '../../../lib/service-error';
import { noticeCodeFor } from '../../../lib/service-notice';
import type { Event } from '../../../lib/service-types';

export const prerender = false;

/** Longer than this and the service refuses it, so say so here rather than at the API. */
const MAX_REASON = 200;

/**
 * Calls a raid off.
 *
 * Not the delete the service also offers. Deleting an event cascades, taking the signups
 * the attendance is computed from with it, which is right for a raid typed wrong an hour
 * ago and wrong for a Sunday that got snowed off. This keeps the night and says what
 * happened to it, and it undoes.
 *
 * The transition is read from an event fetched here rather than from a hidden field, the
 * same reason report-refresh.ts gives: an href in a form would let a browser aim this
 * dashboard's shared API key at any path on the service. The absence of `cancel` is the
 * answer for anyone who is not a raid lead.
 */
export const POST: APIRoute = async ({ params, request, locals, redirect }) => {
  const { session, actor, client } = locals;
  if (!session?.selectedGuildId || !actor) {
    return redirect('/guild');
  }

  const eventId = params.id!;
  const back = (notice?: string) =>
    redirect(`/events/${eventId}${notice ? `?notice=${notice}` : ''}`);

  const form = await request.formData();
  const typed = String(form.get('reason') ?? '').trim();
  if (typed.length > MAX_REASON) {
    return back('longreason');
  }

  try {
    const event = await client.get<Event>(actor, `/api/events/${eventId}`);
    const link = getLink(event, 'cancel');
    if (!link) {
      return back('denied');
    }

    // An empty box is nothing said, not a reason of "".
    await client.follow(actor, link, typed === '' ? {} : { reason: typed });
    return back('cancelled');
  } catch (error) {
    if (error instanceof ServiceError && error.isConflict) {
      return back('alreadyoff');
    }
    return back(noticeCodeFor(error));
  }
};
