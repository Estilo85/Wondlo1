'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import Footer from '@/components/Footer';
import CurrencySelector, { useCurrency } from '@/components/CurrencySelector';
import { formatConverted, COUNTRIES } from '@/lib/currency';
import { auth } from '@/lib/firebase-client';

const PAYMENT_LINKS = {
  'pay-as-you-go': 'https://buy.stripe.com/7sY00j64s5NKdd50aLcfK07',
  starter: 'https://buy.stripe.com/5kQeVddwUdgc8WPf5FcfK08',
} as const;

const PLANS = {
  'pay-as-you-go': {
    name: 'Pay As You Go',
    pricePence: 300,
    cadence: '/search',
    paymentLink: PAYMENT_LINKS['pay-as-you-go'],
    features: [
      'One Search',
      'Adventure Preparedness',
      'Safety Digest',
      'Operator Chat Diagnosis',
    ],
  },
  starter: {
    name: 'Starter Plan',
    pricePence: 1500,
    cadence: '/month',
    paymentLink: PAYMENT_LINKS.starter,
    features: [
      'Seven Searches / Month',
      'Adventure Preparedness',
      'Safety Digest',
      'Operator Chat Diagnosis',
    ],
  },
} as const;

type PlanKey = keyof typeof PLANS;

type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  billingAddress?: { line1: string; city: string; postal: string; country: string } | null;
};

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(cardNumber: string) {
  const first = cardNumber.replace(/\D/g, '').slice(0, 2);
  if (first.startsWith('4')) return 'Visa';
  if (first.startsWith('5')) return 'Mastercard';
  if (first.startsWith('3')) return 'Amex';
  if (first.startsWith('6')) return 'Discover';
  return '';
}

function luhnValid(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 15) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

const BRAND_STYLES: Record<string, { background: string; label: string }> = {
  Visa: { background: 'linear-gradient(135deg, #1A1F71 0%, #4B53B0 100%)', label: 'VISA' },
  Mastercard: { background: 'linear-gradient(135deg, #231F20 0%, #46424F 100%)', label: 'Mastercard' },
  Amex: { background: 'linear-gradient(135deg, #006FCF 0%, #40A0E0 100%)', label: 'AMEX' },
  Discover: { background: 'linear-gradient(135deg, #B5651D 0%, #F0A500 100%)', label: 'DISCOVER' },
};

function CardVisual({
  brand,
  cardholder,
  cardNumber,
  expiry,
  cvc,
  showBack,
}: {
  brand: string;
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  showBack: boolean;
}) {
  const cfg =
    BRAND_STYLES[brand] ?? {
      background: 'linear-gradient(135deg, #7E6BB3 0%, #2B2740 100%)',
      label: 'Card',
    };
  const digits = cardNumber.replace(/\D/g, '').slice(0, 16);
  const filled = (digits + '••••••••••••••••').slice(0, 16);
  const groups = [0, 1, 2, 3].map((i) => filled.slice(i * 4, i * 4 + 4));
  const displayCvc = (cvc.replace(/\D/g, '').slice(0, 4) + '•••').slice(0, 4);

  return (
    <div className="mx-auto mb-6 w-full max-w-[340px]" style={{ perspective: '1000px' }}>
      <div
        className={`relative w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          showBack ? '[transform:rotateY(180deg)]' : ''
        }`}
        style={{ aspectRatio: '85.6 / 53.98' }}
      >
        <div
          className="absolute inset-0 rounded-2xl p-4 sm:p-5"
          style={{
            background: cfg.background,
            backfaceVisibility: 'hidden',
            boxShadow: '0 18px 40px rgba(43, 39, 64, 0.35)',
          }}
        >
          <div className="flex items-start justify-between">
            <svg className="h-8 w-8" viewBox="0 0 48 32" aria-hidden="true">
              <rect x="1" y="1" width="46" height="30" rx="6" fill="#D9A85E" stroke="#A97B3A" />
              <path d="M1 12h46M15 7v18" stroke="#A97B3A" strokeWidth="1.5" fill="none" />
            </svg>

            {brand === 'Mastercard' ? (
              <span className="flex items-end gap-1">
                <span className="h-6 w-6 rounded-full bg-[#EB001B] mix-blend-screen" />
                <span className="h-6 w-6 rounded-full bg-[#F79E1B] mix-blend-screen" />
              </span>
            ) : (
              <span
                className={`font-bold italic text-white ${
                  brand === 'Visa' ? 'text-xl tracking-wider' : 'text-sm tracking-widest'
                }`}
              >
                {cfg.label}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-1 font-inter text-base font-semibold tracking-[0.14em] text-white sm:text-lg">
            {groups.map((group, groupIndex) => (
              <span key={groupIndex} className="flex items-center gap-[2px]">
                {group.split('').map((ch, charIndex) => (
                  <span key={`${groupIndex}-${charIndex}`} className={ch === '•' ? 'text-white/35' : ''}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-inter text-[8px] uppercase tracking-widest text-white/60">
                Card holder
              </p>
              <p className="truncate font-inter text-xs font-medium text-white">
                {cardholder.trim() || 'YOUR NAME'}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-inter text-[8px] uppercase tracking-widest text-white/60">
                Expires
              </p>
              <p className="font-inter text-xs font-medium text-white">{expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: cfg.background,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: '0 18px 40px rgba(43, 39, 64, 0.35)',
          }}
        >
          <div className="mt-5 h-9 w-full bg-[#14120F]" />
          <div className="mx-4 mt-4 flex items-center gap-3">
            <div className="flex-1 rounded-sm bg-white px-3 py-2 font-inter text-xs italic text-[#2B2740]">
              {cardholder.trim() || 'Signed'}
            </div>
            <div className="rounded-sm bg-[#E8E6F0] px-2 py-2 font-inter text-xs font-bold tracking-widest text-[#2B2740]">
              {displayCvc}
            </div>
          </div>
          <p className="mx-4 mt-3 font-inter text-[8px] uppercase tracking-widest text-white/60">
            Security code · {cfg.label}
          </p>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = (searchParams.get('plan') || '') as PlanKey;
  const plan = PLANS[planKey];
  const currency = useCurrency();
  const priceLabel = formatConverted(plan.pricePence, currency);

  const [email, setEmail] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [showCardBack, setShowCardBack] = useState(false);
  const [billing, setBilling] = useState({ line1: '', city: '', postal: '', country: 'GB' });
  const [saveCard, setSaveCard] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'declined'>('idle');
  const [orderRef, setOrderRef] = useState('');
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [savedCardsLoaded, setSavedCardsLoaded] = useState(!auth);
  const [useDifferentPaymentMethod, setUseDifferentPaymentMethod] = useState(false);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setSavedCardsLoaded(true);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const res = await fetch(`/api/billing/status?token=${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          const cards = data.cards ?? [];
          setSavedCards(cards);
          const defaultCard = cards.find((card: SavedCard) => card.isDefault) ?? cards[0];
          if (defaultCard) {
            setSelectedCardId(defaultCard.id);
            if (defaultCard.billingAddress) {
              setBilling({
                line1: defaultCard.billingAddress.line1 ?? '',
                city: defaultCard.billingAddress.city ?? '',
                postal: defaultCard.billingAddress.postal ?? '',
                country: defaultCard.billingAddress.country ?? 'GB',
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to load saved cards:', error);
      } finally {
        setSavedCardsLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!plan) {
    router.replace('/payments');
    return null;
  }

  const brand = detectBrand(cardNumber);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Enter a valid email address for your receipt.';
    }
    if (billing.line1.trim().length < 3) {
      next.line1 = 'Enter your billing address.';
    }
    if (selectedCardId) {
      setErrors(next);
      return Object.keys(next).length === 0;
    }
    if (cardholder.trim().length < 2) {
      next.cardholder = 'Enter the name on the card.';
    }
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 15 || !luhnValid(cardNumber)) {
      next.cardNumber = 'Enter a valid card number.';
    }
    const expDigits = expiry.replace(/\D/g, '');
    if (expDigits.length !== 4) {
      next.expiry = 'Use MM/YY format.';
    } else {
      const month = Number(expDigits.slice(0, 2));
      const year = 2000 + Number(expDigits.slice(2));
      const now = new Date();
      const currentMonth = now.getFullYear() * 12 + now.getMonth() + 1;
      const cardMonth = year * 12 + month;
      if (month < 1 || month > 12 || cardMonth < currentMonth) {
        next.expiry = 'Card is in the past or invalid.';
      }
    }
    const cvcDigits = cvc.replace(/\D/g, '');
    if (cvcDigits.length < 3 || cvcDigits.length > 4) {
      next.cvc = 'Enter a valid security code.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'processing' || !validate()) return;

    if (selectedCardId) {
      setStatus('processing');
      void (async () => {
        try {
          const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
          if (!token) {
            setStatus('declined');
            return;
          }

          const res = await fetch('/api/billing/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              plan: planKey,
              email,
              currency,
              savedCardId: selectedCardId,
              billingAddress: billing,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.orderRef) {
            setStatus('declined');
            return;
          }
          setOrderRef(data.orderRef);
          setStatus('success');
        } catch (error) {
          console.error('Failed to use saved payment method:', error);
          setStatus('declined');
        }
      })();
      return;
    }

    if (saveCard) {
      setStatus('processing');
      void (async () => {
        try {
          const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
          if (token) {
            const expDigits = expiry.replace(/\D/g, '');
            await fetch('/api/billing/card', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token,
                card: {
                  brand: brand || 'Card',
                  last4: cardNumber.replace(/\D/g, '').slice(-4),
                  expMonth: Number(expDigits.slice(0, 2)),
                  expYear: 2000 + Number(expDigits.slice(2)),
                },
                billingAddress: billing,
              }),
            });
          }
        } catch (error) {
          console.error('Failed to save card:', error);
        } finally {
          window.open(`${plan.paymentLink}?prefilled_email=${encodeURIComponent(email.trim())}`, '_self');
        }
      })();
      return;
    }

    window.open(`${plan.paymentLink}?prefilled_email=${encodeURIComponent(email.trim())}`, '_self');
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FAF9FE] text-[#2B2740] font-poppins antialiased">
        <header className="sticky top-0 z-50 border-b border-[#EDE7FB] bg-white">
          <div className="mx-auto flex min-h-16 w-full max-w-[1316px] items-center justify-between px-4 py-3 sm:px-6 xl:px-0">
            <Link
              href="/"
              className="flex-shrink-0 text-lg font-bold tracking-tight text-[#2B2740]"
            >
              Wondlo
            </Link>

            <span className="text-xs font-semibold text-[#7E6BB3]">
              Payment Confirmed
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
          <div
            className="w-full rounded-3xl p-8 text-center sm:p-12"
            style={{
              backgroundColor: '#F6F4FE',
              border: '0.1px solid rgba(43, 39, 64, 0.10)',
              boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
            }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#3D8A1E]">
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-[#2B2740]">
              Payment successful
            </h1>

            <p className="mt-3 font-inter text-sm leading-relaxed text-[#4A4560]">
              Thank you! Your <strong>{plan.name}</strong> is active at{' '}
              {priceLabel}
              {plan.cadence}. A receipt has been sent to{' '}
              <span className="font-semibold">{email.trim()}</span>.
            </p>

            <div className="mt-6 rounded-xl bg-[#FCFCFB] p-4 text-left" style={{ border: '0.1px solid rgba(43, 39, 64, 0.10)' }}>
              <div className="flex justify-between text-sm">
                <span className="text-[#4A4560]">Order reference</span>
                <span className="font-semibold">{orderRef}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-[#4A4560]">Plan</span>
                <span className="font-semibold">{plan.name}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-[#4A4560]">Total paid</span>
                <span className="font-semibold">
                  {priceLabel}
                  {plan.cadence}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EDE7FB] pt-3">
                <span className="font-inter text-xs font-semibold text-[#4A4560]">
                  Display prices in
                </span>
                <CurrencySelector />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="h-12 w-full rounded-lg bg-[#7E6BB3] py-3 text-xs font-semibold text-white transition-colors hover:bg-[#68559D]"
              >
                Go to your Dashboard
              </Link>

              <button
                type="button"
                onClick={() => router.push('/payments')}
                className="cursor-pointer py-2 text-xs font-semibold text-[#7E6BB3] hover:underline"
              >
                Back to plans
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FE] text-[#2B2740] font-poppins antialiased">
      <header className="sticky top-0 z-50 border-b border-[#EDE7FB] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1316px] items-center justify-between px-4 py-3 sm:px-6 xl:px-0">
          <Link
            href="/"
            className="flex-shrink-0 text-lg font-bold tracking-tight text-[#2B2740]"
          >
            Wondlo
          </Link>

          <span className="text-xs font-semibold text-[#7E6BB3]">
            Secure Checkout
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1000px] px-4 py-10 sm:px-6">
        <button
          type="button"
          onClick={() => router.push('/payments')}
          className="mb-6 flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#7E6BB3] hover:underline"
        >
          <span className="text-[#3D8A1E] text-base font-extrabold leading-none">←</span>
          Back to plans
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          <div
            className="order-1 lg:order-1 rounded-3xl p-6 sm:p-8"
            style={{
              background: 'linear-gradient(160deg, #F3EDFC 0%, #E3D8F6 100%)',
              border: '0.1px solid rgba(126, 107, 179, 0.25)',
              boxShadow: '0 8px 30px rgba(126, 107, 179, 0.20)',
            }}
          >
            <h2 className="text-lg font-bold text-[#7E6BB3]">Order Summary</h2>

            <div
              className="mt-4 flex items-center justify-between rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)',
                border: '0.1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 6px 18px rgba(126, 107, 179, 0.18)',
              }}
            >
              <div>
                <p className="font-semibold text-[#2B2740]">{plan.name}</p>
                <p className="mt-1 font-inter text-xs text-[#4A4560]">
                  Billed {plan.cadence === '/month' ? 'monthly' : 'per search'}
                </p>
              </div>

              <p className="text-2xl font-bold text-[#2B2740]">
                {priceLabel}
                <span className="text-sm font-medium text-[#4A4560]">
                  {plan.cadence}
                </span>
              </p>
            </div>

            <ul className="mt-4 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#7E6BB3]/15">
                    <svg className="h-3 w-3 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4 4L19 7" />
                    </svg>
                  </span>

                  <span className="font-inter text-sm text-[#4A4560]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 rounded-xl bg-white/60 p-4 font-inter text-sm" style={{ border: '0.1px solid rgba(126, 107, 179, 0.20)' }}>
              <div className="flex justify-between text-[#4A4560]">
                <span>Subtotal</span>
                <span>{priceLabel}</span>
              </div>
              <div className="flex justify-between text-[#4A4560]">
                <span>VAT</span>
                <span>Included</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-[#EDE7FB] pt-3 font-poppins font-bold text-[#7E6BB3]">
                <span>Total Due Today</span>
                <span>
                  {priceLabel}
                  {plan.cadence}
                </span>
              </div>
            </div>
          </div>

          <div
            className="order-2 lg:order-2 rounded-3xl p-6 sm:p-8"
            style={{
              backgroundColor: '#F6F4FE',
              border: '0.1px solid rgba(43, 39, 64, 0.10)',
              boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
            }}
          >
            {(!savedCardsLoaded || savedCards.length === 0 || useDifferentPaymentMethod) && (
              <CardVisual
                brand={brand}
                cardholder={cardholder}
                cardNumber={cardNumber}
                expiry={expiry}
                cvc={cvc}
                showBack={showCardBack}
              />
            )}

            <h1 className="text-lg font-bold text-[#2B2740]">Payment Details</h1>

            <form onSubmit={handlePay} className="mt-6 space-y-5" noValidate>
              <div>
                <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Email for Receipt
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />

                {errors.email && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.email}</p>
                )}
              </div>

              {savedCardsLoaded && savedCards.length > 0 && !useDifferentPaymentMethod && (
                <div>
                  <p className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                    Select saved payment method
                  </p>
                  <div className="space-y-2">
                    {savedCards.map((card) => (
                      <label
                        key={card.id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                          selectedCardId === card.id
                            ? 'border-[#7E6BB3] bg-[#EDE7FB]'
                            : 'border-[#EDE7FB] bg-[#FAF9FE]'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="saved-payment-method"
                            value={card.id}
                            checked={selectedCardId === card.id}
                            onChange={() => {
                              setSelectedCardId(card.id);
                              setUseDifferentPaymentMethod(false);
                              if (card.billingAddress) {
                                setBilling({
                                  line1: card.billingAddress.line1 ?? '',
                                  city: card.billingAddress.city ?? '',
                                  postal: card.billingAddress.postal ?? '',
                                  country: card.billingAddress.country ?? 'GB',
                                });
                              }
                            }}
                            className="accent-[#7E6BB3]"
                          />
                          <span className="font-inter text-sm font-semibold text-[#2B2740]">
                            {card.brand} •••• {card.last4}
                          </span>
                        </span>
                        <span className="font-inter text-xs text-[#4A4560]">
                          {String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCardId('');
                      setUseDifferentPaymentMethod(true);
                      setErrors({});
                    }}
                    className="mt-3 cursor-pointer text-xs font-semibold text-[#7E6BB3] hover:underline"
                  >
                    Use a different payment method
                  </button>
                </div>
              )}

              {(!savedCardsLoaded || savedCards.length === 0 || useDifferentPaymentMethod) && (
                <>
              <div>
                <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Cardholder Name
                </label>

                <input
                  type="text"
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  placeholder="Name as it appears on the card"
                  className={inputClass}
                />

                {errors.cardholder && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.cardholder}</p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block font-poppins text-xs font-semibold text-[#2B2740]">
                    Card Number
                  </label>

                  {brand && (
                    <span className="text-right font-inter text-xs font-semibold text-[#7E6BB3]">
                      {brand}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => {
                      const val = formatCardNumber(e.target.value);
                      setCardNumber(val);
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={`${inputClass} pr-11`}
                  />

                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7E6BB3]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2.5" y="5" width="19" height="14" rx="2" />
                    <path d="M2.5 10h19" />
                    <path d="M6.5 15h4" />
                  </svg>
                </div>

                {errors.cardNumber && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                    Expiry
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className={inputClass}
                  />

                  {errors.expiry && (
                    <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                    CVC
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    onFocus={() => setShowCardBack(true)}
                    onBlur={() => setShowCardBack(false)}
                    placeholder="123"
                    className={inputClass}
                  />

                  {errors.cvc && (
                    <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.cvc}</p>
                  )}
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EDE7FB] bg-[#FAF9FE] p-3">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="h-4 w-4 accent-[#7E6BB3]"
                />
                <span>
                  <span className="block font-inter text-sm font-semibold text-[#2B2740]">
                    Save this card for next time
                  </span>
                  <span className="block font-inter text-xs text-[#4A4560]">
                    Pay faster next time with your saved card.
                  </span>
                </span>
              </label>
                </>
              )}

              {savedCardsLoaded && savedCards.length > 0 && useDifferentPaymentMethod && (
                <button
                  type="button"
                  onClick={() => {
                    const defaultCard = savedCards.find((card) => card.isDefault) ?? savedCards[0];
                    setSelectedCardId(defaultCard.id);
                    setUseDifferentPaymentMethod(false);
                    setErrors({});
                  }}
                  className="cursor-pointer text-xs font-semibold text-[#7E6BB3] hover:underline"
                >
                  Use a saved payment method instead
                </button>
              )}

              <div
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(160deg, #F3EDFC 0%, #E9E1F9 100%)',
                  border: '0.1px solid rgba(126, 107, 179, 0.25)',
                }}
              >
                <p className="mb-3 font-poppins text-xs font-semibold text-[#7E6BB3]">
                  Billing Address
                </p>

                <div>
                  <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={billing.line1}
                    onChange={(e) => setBilling((b) => ({ ...b, line1: e.target.value }))}
                    placeholder="123 Adventure Road"
                    className={inputClass}
                  />
                  {errors.line1 && (
                    <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.line1}</p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                      City
                    </label>
                    <input
                      type="text"
                      value={billing.city}
                      onChange={(e) => setBilling((b) => ({ ...b, city: e.target.value }))}
                      placeholder="Your city"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={billing.postal}
                      onChange={(e) => setBilling((b) => ({ ...b, postal: e.target.value }))}
                      placeholder="e.g. EC1A 1BB"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                    Country
                  </label>
                  <select
                    value={billing.country}
                    onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {status === 'declined' && (
                <p className="rounded-lg bg-red-50 p-3 font-inter text-xs text-[#C51D14]">
                  Your card was declined. Check the details or try another card.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'processing' || !savedCardsLoaded}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: 'linear-gradient(90deg, #7E6BB3 25%, #2B2740 100%)' }}
              >
                {status === 'processing' ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Processing payment...
                  </>
                ) : (
                  <>
                    {selectedCardId
                      ? `Pay ${priceLabel}${plan.cadence === '/month' ? ' Today' : ` ${plan.cadence}`}`
                      : saveCard
                        ? 'Save Card & Continue To Secure Payment'
                        : 'Continue To Secure Payment'}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-1 font-inter text-xs text-[#4A4560]">
                <svg className="h-4 w-4 text-[#3D8A1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Payments are encrypted and secure
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F4FE] flex items-center justify-center text-sm text-[#7E6BB3]">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}