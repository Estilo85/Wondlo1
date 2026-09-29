import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';

export async function authenticateCommunityUser(request: Request) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';

  if (!token) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Sign in to post or interact with the community.' },
        { status: 401 }
      ),
    };
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
      select: { id: true, name: true },
    });

    if (!user) {
      return {
        user: null,
        response: NextResponse.json(
          { error: 'Your account is not available.' },
          { status: 401 }
        ),
      };
    }

    return { user, response: null };
  } catch {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Your session is invalid. Please sign in again.' },
        { status: 401 }
      ),
    };
  }
}

export async function getOptionalCommunityUserId(request: Request) {
  const authorization = request.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';

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
