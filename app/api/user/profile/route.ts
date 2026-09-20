import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

const FREE_SEARCH_LIMIT = 3;

export async function POST(req: Request) {
  try {
    const { token, action } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'consume') {
      if (user.freeSearchesUsed >= FREE_SEARCH_LIMIT) {
        return NextResponse.json({
          name: user.name,
          freeSearchesUsed: user.freeSearchesUsed,
          freeSearchesLeft: 0,
          limited: true,
        });
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { freeSearchesUsed: { increment: 1 } },
      });

      return NextResponse.json({
        name: updated.name,
        freeSearchesUsed: updated.freeSearchesUsed,
        freeSearchesLeft: Math.max(0, FREE_SEARCH_LIMIT - updated.freeSearchesUsed),
        limited: updated.freeSearchesUsed >= FREE_SEARCH_LIMIT,
      });
    }

    return NextResponse.json({
      name: user.name,
      freeSearchesUsed: user.freeSearchesUsed,
      freeSearchesLeft: Math.max(0, FREE_SEARCH_LIMIT - user.freeSearchesUsed),
      limited: user.freeSearchesUsed >= FREE_SEARCH_LIMIT,
    });
  } catch (error: unknown) {
    console.error('Profile route error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}