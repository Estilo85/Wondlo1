import {
  authenticateRequestUser,
  getOptionalUserId,
  isCommunityAdmin,
  unauthorized,
} from '@/lib/api-auth';
import { prisma } from '@/lib/db';

export async function authenticateCommunityUser(request: Request) {
  const result = await authenticateRequestUser(request);

  if (!result.user) {
    return { user: null, response: result.response };
  }

  /*
   * A suspended account keeps its existing content and can still browse, but it
   * cannot take part. Checking here means every posting surface inherits the
   * same rule instead of each route re-reading the column.
   */
  const suspension = await prisma.user.findUnique({
    where: { id: result.user.id },
    select: { suspendedUntil: true },
  });

  if (suspension?.suspendedUntil && suspension.suspendedUntil > new Date()) {
    return {
      user: null,
      response: unauthorized(
        'Your account is suspended. Please try again later.',
        403
      ).response,
    };
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
    /*
     * unauthorized() is itself the failure result, matching the shape
     * authenticateRequestUser returns. Wrapping it in another object would
     * leave `response` holding a failure object instead of a NextResponse,
     * which the generated route types reject at build time.
     */
    return unauthorized('You cannot review community reports.', 403);
  }

  return {
    user: { id: result.user.id, name: result.user.name },
    response: null,
  };
}

export { getOptionalUserId as getOptionalCommunityUserId };

export { unauthorized };
