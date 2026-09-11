import type { APIRoute } from 'astro';

import { getLink } from '../../../lib/links';
import { ServiceError } from '../../../lib/service-error';
import { noticeCodeFor } from '../../../lib/service-notice';
import type { Event } from '../../../lib/service-types';

export const prerender = false;

/**
 * Puts a cancelled raid back on, for the tank who turns up after all.
 *
 * The service refuses this once the raid was due to start, and drops the `uncancel` link
 * at the same moment, so the control is gone before anyone can press it. The 409 arm is
 * for the raid that started between the page rendering and the form being submitted.
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
    const link = getLink(event, 'uncancel');
    if (!link) {
      return back('denied');
    }

    await client.follow(actor, link);
    return back('backon');
  } catch (error) {
    if (error instanceof ServiceError && error.isConflict) {
      return back('toolate');
    }
    return back(noticeCodeFor(error));
  }
};
