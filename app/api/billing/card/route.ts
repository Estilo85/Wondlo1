import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

async function authenticate(token: string) {
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const cardId = url.searchParams.get('cardId');

    const decoded = await authenticate(token ?? '');
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { firebaseId: decoded.uid } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const card = await prisma.savedCard.findFirst({
      where: { id: cardId, userId: user.id },
    });
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const wasDefault = card.isDefault;
    await prisma.savedCard.delete({ where: { id: card.id } });

    if (wasDefault) {
      const nextCard = await prisma.savedCard.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      if (nextCard) {
        await prisma.savedCard.update({
          where: { id: nextCard.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete card error:', error);
    return NextResponse.json({ error: 'Unable to remove card' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { token, cardId } = await req.json();

    const decoded = await authenticate(token ?? '');
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { firebaseId: decoded.uid } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const card = await prisma.savedCard.findFirst({
      where: { id: cardId, userId: user.id },
    });
    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.savedCard.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      }),
      prisma.savedCard.update({
        where: { id: card.id },
        data: { isDefault: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Set default card error:', error);
    return NextResponse.json({ error: 'Unable to update card' }, { status: 500 });
  }
}