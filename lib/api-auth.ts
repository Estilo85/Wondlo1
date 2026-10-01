import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

type AuthenticationFailure = {
  user: null;
  response: NextResponse;
};

export function unauthorized(message: string, status = 401): AuthenticationFailure {
  return {
    user: null,
    response: NextResponse.json({ error: message }, { status }),
  };
}

function bearerToken(request: Request): string {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : '';
}

export async function authenticateRequestUser(
  request: Request
): Promise<{ user: AuthenticatedUser; response: null } | AuthenticationFailure> {
  const token = bearerToken(request);

  if (!token) {
    return unauthorized('Sign in to continue.');
  }

  let firebaseId: string;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    firebaseId = decoded.uid;
  } catch {
    return unauthorized('Your session is invalid. Please sign in again.');
  }

  const user = await prisma.user.findUnique({
    where: { firebaseId },
    select: { id: true, name: true, email: true, avatarUrl: true },
  });

  if (!user) {
    return unauthorized('Your account is not available.');
  }

  return { user, response: null };
}

export async function getOptionalUserId(request: Request): Promise<string | null> {
  const token = bearerToken(request);

  if (!token) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
      select: { id: true },
    });
    return user?.id ?? null;
  } catch {
    return null;
  }
}

/*
 * Addresses allowed to review community reports. Like DEV_UNLIMITED_EMAILS this
 * is a comma separated list read from the environment, so granting or revoking
 * moderator access is a deploy-time change rather than a schema change or a
 * role that a compromised signup flow could grant itself. When the variable is
 * absent the set is empty and nobody is a moderator.
 */
const COMMUNITY_ADMIN_EMAILS = new Set(
  (process.env.COMMUNITY_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export function isCommunityAdmin(email: string | null | undefined): boolean {
  if (!email || COMMUNITY_ADMIN_EMAILS.size === 0) {
    return false;
  }

  return COMMUNITY_ADMIN_EMAILS.has(email.toLowerCase());
}
