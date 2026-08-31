import type { APIRoute } from 'astro';

import { getLink } from '../../../lib/links';
import { noticeCodeFor } from '../../../lib/service-notice';
import type { Character } from '../../../lib/service-types';

export const prerender = false;

/**
 * Takes a character off the guild roster, or puts them back. Not a delete: the service
 * keeps the row and everything hanging off it, because a raider's signups are what the
 * guild's attendance is computed from. Removing a departed raider with the delete route
 * next door would erase the raids they turned up to.
 *
 * The roster is read to find the character rather than trusting the submitted id: the
 * list is guild-scoped and carries the archive links only where the service decided this
 * caller may use them, so a character somebody else may not touch simply has no link on
 * it. Absence is the authorization answer and there is nothing to check here.
 */
export const POST: APIRoute = async ({ params, request, locals, redirect }) => {
  const { session, actor, client } = locals;
  if (!session?.selectedGuildId || !actor) {
    return redirect('/guild');
  }

  const back = (notice: string) => redirect(`/roster?notice=${notice}`);

  const form = await request.formData();
  const direction = form.get('direction');
  if (direction !== 'archive' && direction !== 'unarchive') {
    return back('failed');
  }

  try {
    const roster = await client.get<Character[]>(
      actor,
      `/api/guilds/${session.selectedGuildId}/characters?include_archived=true`,
    );
    const character = roster.find((c) => c.id === params.id);
    const link = character && getLink(character, direction);
    if (!link) {
      return back('denied');
    }

    await client.follow(actor, link);
    return back(direction === 'archive' ? 'archived' : 'restored');
  } catch (error) {
    return back(noticeCodeFor(error));
  }
};
