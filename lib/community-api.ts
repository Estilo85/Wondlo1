import { NextResponse } from 'next/server';
import {
  authenticateRequestUser,
  getOptionalUserId,
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

export { getOptionalUserId as getOptionalCommunityUserId };

export { unauthorized };
