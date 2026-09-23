import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import { PLANS, STARTER_SEARCHES } from '@/lib/billing';

export const runtime = 'nodejs';

const PAYABLE_PLANS = new Set(['pay_as_you_go', 'starter']);

function generateOrderRef() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WL-${stamp}${random}`;
}

function isValidCard(card: unknown): card is { brand: string; last4: string; expMonth: number; expYear: number } {
  if (!card || typeof card !== 'object') return false;
  const c = card as Record<string, unknown>;
  if (
    typeof c.brand !== 'string' ||
    c.brand.length === 0 ||
    typeof c.last4 !== 'string' ||
    !/^\d{4}$/.test(c.last4) ||
    typeof c.expMonth !== 'number' ||
    c.expMonth < 1 ||
    c.expMonth > 12 ||
    typeof c.expYear !== 'number'
  ) {
    return false;
  }
  const now = new Date();
  const currentMonth = now.getFullYear() * 12 + now.getMonth() + 1;
  const cardMonth = c.expYear * 12 + c.expMonth;
  if (cardMonth < currentMonth) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, plan, email, card } = body;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (typeof plan !== 'string' || !PAYABLE_PLANS.has(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (!isValidCard(card)) {
      return NextResponse.json({ error: 'Invalid card details' }, { status: 400 });
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseId: decoded.uid },
      include: { savedCards: { orderBy: { createdAt: 'desc' } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const config = PLANS[plan as 'pay_as_you_go' | 'starter'];
    const orderRef = generateOrderRef();
    const cycleEndsAt = plan === 'starter' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : user.cycleEndsAt;

    const isCardSaved = user.savedCards.some(
      (saved) =>
        saved.brand === card.brand &&
        saved.last4 === card.last4 &&
        saved.expMonth === card.expMonth &&
        saved.expYear === card.expYear
    );
    const savedCard = isCardSaved
      ? user.savedCards.find(
          (saved) =>
            saved.brand === card.brand &&
            saved.last4 === card.last4 &&
            saved.expMonth === card.expMonth &&
            saved.expYear === card.expYear
        )
      : await prisma.savedCard.create({
          data: {
            userId: user.id,
            brand: card.brand,
            last4: card.last4,
            expMonth: card.expMonth,
            expYear: card.expYear,
            isDefault: user.savedCards.length === 0,
          },
        });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        plan,
        ...(plan === 'pay_as_you_go'
          ? { searchAllowance: { increment: 1 }, cycleEndsAt }
          : { searchAllowance: STARTER_SEARCHES, searchAllowanceUsed: 0, cycleEndsAt }),
      },
      include: { savedCards: true, purchases: true },
    });

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        plan,
        amountPence: config.pricePence,
        currency: 'GBP',
        orderRef,
        cardBrand: card.brand,
        cardLast4: card.last4,
        status: 'paid',
      },
    });

    const receiptEmail = typeof email === 'string' && email.trim() ? email.trim() : user.email;

    return NextResponse.json({
      success: true,
      orderRef: purchase.orderRef,
      plan: updatedUser.plan,
      label: config.name,
      cadence: config.cadence,
      amountPence: purchase.amountPence,
      currency: purchase.currency,
      allowance: updatedUser.searchAllowance,
      used: updatedUser.searchAllowanceUsed,
      left: Math.max(0, updatedUser.searchAllowance - updatedUser.searchAllowanceUsed),
      cycleEndsAt: updatedUser.cycleEndsAt,
      card: { brand: card.brand, last4: card.last4 },
      receiptEmail,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Unable to complete purchase' }, { status: 500 });
  }
}