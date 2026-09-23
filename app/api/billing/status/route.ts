import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import { planInfo } from '@/lib/billing';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get('token');
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
      include: {
        savedCards: { orderBy: { createdAt: 'desc' } },
        purchases: { orderBy: { createdAt: 'desc' }, take: 100 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const info = planInfo(user);

    return NextResponse.json({
      user: { name: user.name, email: user.email },
      ...info,
      cards: user.savedCards.map((card) => ({
        id: card.id,
        brand: card.brand,
        last4: card.last4,
        expMonth: card.expMonth,
        expYear: card.expYear,
        isDefault: card.isDefault,
      })),
      purchases: user.purchases.map((purchase) => ({
        id: purchase.id,
        orderRef: purchase.orderRef,
        plan: purchase.plan,
        amountPence: purchase.amountPence,
        currency: purchase.currency,
        status: purchase.status,
        createdAt: purchase.createdAt,
        cardBrand: purchase.cardBrand,
        cardLast4: purchase.cardLast4,
      })),
    });
  } catch (error) {
    console.error('Billing status error:', error);
    return NextResponse.json({ error: 'Unable to load billing details' }, { status: 500 });
  }
}