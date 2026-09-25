import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

function isValidCard(card: unknown): card is { brand: string; last4: string; expMonth: number; expYear: number } {
  if (!card || typeof card !== 'object') return false;
  const value = card as Record<string, unknown>;
  if (
    typeof value.brand !== 'string' ||
    value.brand.length === 0 ||
    typeof value.last4 !== 'string' ||
    !/^\d{4}$/.test(value.last4) ||
    typeof value.expMonth !== 'number' ||
    value.expMonth < 1 ||
    value.expMonth > 12 ||
    typeof value.expYear !== 'number'
  ) {
    return false;
  }

  const now = new Date();
  const currentMonth = now.getFullYear() * 12 + now.getMonth() + 1;
  const cardMonth = value.expYear * 12 + value.expMonth;
  return cardMonth >= currentMonth;
}

async function authenticate(token: string) {
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { token, card } = await req.json();
    const decoded = await authenticate(token ?? '');
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!isValidCard(card)) {
      return NextResponse.json({ error: 'Invalid card details' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
      include: { savedCards: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existingCard = user.savedCards.find(
      (savedCard) =>
        savedCard.brand === card.brand &&
        savedCard.last4 === card.last4 &&
        savedCard.expMonth === card.expMonth &&
        savedCard.expYear === card.expYear
    );
    if (existingCard) {
      return NextResponse.json({ card: existingCard });
    }

    const savedCard = await prisma.savedCard.create({
      data: {
        userId: user.id,
        brand: card.brand,
        last4: card.last4,
        expMonth: card.expMonth,
        expYear: card.expYear,
        isDefault: user.savedCards.length === 0,
      },
    });

    return NextResponse.json({ card: savedCard }, { status: 201 });
  } catch (error) {
    console.error('Save card error:', error);
    return NextResponse.json({ error: 'Unable to save card' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { token, cardId, card } = await req.json();
    const decoded = await authenticate(token ?? '');
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (!cardId || !isValidCard(card)) {
      return NextResponse.json({ error: 'Invalid card details' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { firebaseId: decoded.uid } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const savedCard = await prisma.savedCard.findFirst({
      where: { id: cardId, userId: user.id },
    });
    if (!savedCard) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const updatedCard = await prisma.savedCard.update({
      where: { id: savedCard.id },
      data: {
        brand: card.brand,
        last4: card.last4,
        expMonth: card.expMonth,
        expYear: card.expYear,
      },
    });

    return NextResponse.json({ card: updatedCard });
  } catch (error) {
    console.error('Edit card error:', error);
    return NextResponse.json({ error: 'Unable to edit card' }, { status: 500 });
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