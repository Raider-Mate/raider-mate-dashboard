import type { APIRoute } from 'astro';

import { getLink } from '../../../lib/links';
import { ServiceError } from '../../../lib/service-error';
import { noticeCodeFor } from '../../../lib/service-notice';
import type { Event, LateRequest } from '../../../lib/service-types';

export const prerender = false;

/**
 * Answers one late request, the queue a signup filed after the deadline lands in.
 *
 * Without this the raid lead was told about a request they could not act on: the bot
 * posts "it is waiting in the dashboard", and the dashboard listed it and offered
 * nothing, so the raider never got on the raid.
 *
 * The form carries the request id and which answer, never the href. Same reasoning as
 * the signup route next door: a hidden field holding a link would let a browser aim this
 * dashboard's shared API key at any path on the service. The transition is read off a
 * response fetched here, so a request that is not this event's, or is already decided,
 * simply has no link to follow.
 */
export const POST: APIRoute = async ({ request, params, locals, redirect }) => {
  const { session, actor, client } = locals;
  if (!session?.selectedGuildId || !actor) {
    return redirect('/guild');
  }

  const eventId = params.id!;
  const back = (notice?: string) =>
    redirect(`/events/${eventId}${notice ? `?notice=${notice}` : ''}`);

  const form = await request.formData();
  const requestId = form.get('request_id');
  const decision = form.get('decision');
  if (typeof requestId !== 'string' || (decision !== 'approve' && decision !== 'reject')) {
    return back('failed');
  }

  try {
    const event = await client.get<Event>(actor, `/api/events/${eventId}`);

    // Absent for anyone who is not a raid lead, which is the whole permission decision.
    const queue = getLink(event, 'late-requests');
    if (!queue) {
      return back('denied');
    }

    const requests = (await client.follow<LateRequest[]>(actor, queue)).body;
    const target = requests.find((req) => req.id === requestId);
    if (!target) {
      return back('gone');
    }

    const link = getLink(target, decision);
    if (!link) {
      return back('decided');
    }

    await client.follow(actor, link);
    return back(decision === 'approve' ? 'approved' : 'rejected');
  } catch (error) {
    // The link was there when the queue was read and gone by the time it was followed,
    // which is the other raid lead answering first rather than anything going wrong.
    if (error instanceof ServiceError && error.isConflict) {
      return back('decided');
    }
    return back(noticeCodeFor(error));
  }
};
