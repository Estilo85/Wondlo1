import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { adminAuth } from '@/lib/firebase-admin';
import { PLANS, STARTER_SEARCHES, formatCardBrand, formatMoney, sanitizeBillingAddress } from '@/lib/billing';
import { convertPence, isCurrencyCode, type CurrencyCode } from '@/lib/currency';
import { resend } from '@/lib/resend';

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, plan, email, card, savedCardId, currency: currencyInput, saveCard, billingAddress } = body;

    const currency: CurrencyCode = isCurrencyCode(currencyInput) ? currencyInput : 'GBP';
    const address = sanitizeBillingAddress(billingAddress);

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (typeof plan !== 'string' || !PAYABLE_PLANS.has(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (!savedCardId && !isValidCard(card)) {
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

    const selectedCard = savedCardId
      ? user.savedCards.find((saved) => saved.id === savedCardId)
      : null;
    if (savedCardId && !selectedCard) {
      return NextResponse.json({ error: 'Saved card not found' }, { status: 404 });
    }

    const paymentCard = selectedCard ?? card;

    const config = PLANS[plan as 'pay_as_you_go' | 'starter'];
    const orderRef = generateOrderRef();
    const cycleEndsAt = plan === 'starter' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : user.cycleEndsAt;
    const amountPence =
      currency === 'GBP' ? config.pricePence : Math.round(convertPence(config.pricePence, currency) * 100);

    const isCardSaved = user.savedCards.some(
      (saved) =>
        saved.brand === paymentCard.brand &&
        saved.last4 === paymentCard.last4 &&
        saved.expMonth === paymentCard.expMonth &&
        saved.expYear === paymentCard.expYear
    );
    if (!isCardSaved && saveCard !== false && address) {
      await prisma.savedCard.create({
        data: {
          userId: user.id,
          brand: paymentCard.brand,
          last4: paymentCard.last4,
          expMonth: paymentCard.expMonth,
          expYear: paymentCard.expYear,
          isDefault: user.savedCards.length === 0,
          billingAddress: address,
        },
      });
    }

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
        amountPence,
        currency,
        orderRef,
        cardBrand: paymentCard.brand,
        cardLast4: paymentCard.last4,
        ...(address ? { billingAddress: address } : {}),
        status: 'paid',
      },
    });

    const receiptEmail = typeof email === 'string' && email.trim() ? email.trim() : user.email;

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'partnership@joinwondlo.com';
    const fromName = process.env.RESEND_FROM_NAME || 'Wondlo';
    try {
      await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [receiptEmail],
        subject: `Your Wondlo receipt — ${config.name} (${orderRef})`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #2B2740;">
            <h2 style="color: #7E6BB3;">Thanks for subscribing, ${escapeHtml(user.name)}!</h2>
            <p>Here's your receipt for your Wondlo plan.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #777;">Order reference</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${orderRef}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Plan</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${config.name} (${config.cadence})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Date</td>
                <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Payment method</td>
                <td style="padding: 8px 0; text-align: right;">${formatCardBrand(paymentCard.brand)} ending ${paymentCard.last4}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;">Total paid</td>
                <td style="padding: 8px 0; text-align: right; font-size: 16px; font-weight: bold; color: #7E6BB3;">${formatMoney(amountPence, currency)}</td>
              </tr>
            </table>
            ${address ? `
            <div style="margin-top: 16px; background: #F6F3FE; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #4A4560;">
              <div style="font-weight: bold; margin-bottom: 4px;">Billed to</div>
              <div>${escapeHtml(address.line1)}${address.city ? `, ${escapeHtml(address.city)}` : ''}${address.postal ? `, ${escapeHtml(address.postal)}` : ''}${address.country ? `, ${escapeHtml(address.country)}` : ''}</div>
            </div>` : ''}
            <p style="margin-top: 20px; color: #666; font-size: 14px;">You can view and download your receipts anytime on your billing page. If you have any questions, just reply to this email.</p>
          </div>
        `,
      });
    } catch (emailError: unknown) {
      console.error('Receipt email failed:', emailError);
    }

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
      card: { brand: paymentCard.brand, last4: paymentCard.last4 },
      receiptEmail,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json({ error: 'Unable to complete purchase' }, { status: 500 });
  }
}