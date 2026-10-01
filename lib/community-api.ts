import {
  authenticateRequestUser,
  getOptionalUserId,
  isCommunityAdmin,
  unauthorized,
} from '@/lib/api-auth';

export async function authenticateCommunityUser(request: Request) {
  const result = await authenticateRequestUser(request);

  if (!result.user) {
    return { user: null, response: result.response };
  }

  return {
    user: { id: result.user.id, name: result.user.name },
    response: null,
  };
}

/*
 * Reporting and moderation are separate surfaces on purpose: signing in is not
 * enough to read the report queue, and the check happens on the server so the
 * page itself is never the thing standing between a visitor and the queue.
 */
export async function authenticateCommunityAdmin(request: Request) {
  const result = await authenticateRequestUser(request);

  if (!result.user) {
    return { user: null, response: result.response };
  }

  if (!isCommunityAdmin(result.user.email)) {
    return {
      user: null,
      response: unauthorized('You cannot review community reports.', 403),
    };
  }

  return {
    user: { id: result.user.id, name: result.user.name },
    response: null,
  };
}

export { getOptionalUserId as getOptionalCommunityUserId };

export { unauthorized };
