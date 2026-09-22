'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';

const PLANS = {
  'pay-as-you-go': {
    name: 'Pay As You Go',
    price: 3.0,
    priceLabel: '£3',
    cadence: '/search',
    features: [
      'One Search',
      'Adventure Preparedness',
      'Safety Digest',
      'Operator Chat Diagnosis',
    ],
  },
  starter: {
    name: 'Starter Plan',
    price: 15.0,
    priceLabel: '£15',
    cadence: '/month',
    features: [
      'Seven Searches / Month',
      'Adventure Preparedness',
      'Safety Digest',
      'Operator Chat Diagnosis',
    ],
  },
} as const;

type PlanKey = keyof typeof PLANS;

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

const inputClass =
  'w-full rounded-lg border border-[#EDE7FB] bg-white px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = (searchParams.get('plan') || '') as PlanKey;
  const plan = PLANS[planKey];

  const [email, setEmail] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'declined'>('idle');
  const [orderRef, setOrderRef] = useState('');

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

    const declined = cardNumber.replace(/\D/g, '').endsWith('0002');
    setStatus('processing');

    setTimeout(() => {
      if (declined) {
        setStatus('declined');
        return;
      }
      setOrderRef(
        `WL-${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString().slice(-4)}`
      );
      setStatus('success');
    }, 2200);
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
              {plan.priceLabel}
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
                  {plan.priceLabel}
                  {plan.cadence}
                </span>
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
            className="order-2 lg:order-1 rounded-3xl p-6 sm:p-8"
            style={{
              backgroundColor: '#F6F4FE',
              border: '0.1px solid rgba(43, 39, 64, 0.10)',
              boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
            }}
          >
            <h2 className="text-lg font-bold text-[#2B2740]">Order summary</h2>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FCFCFB] p-4" style={{ border: '0.1px solid rgba(43, 39, 64, 0.10)' }}>
              <div>
                <p className="font-semibold text-[#2B2740]">{plan.name}</p>
                <p className="mt-1 font-inter text-xs text-[#4A4560]">
                  Billed {plan.cadence === '/month' ? 'monthly' : 'per search'}
                </p>
              </div>

              <p className="text-2xl font-bold text-[#2B2740]">
                {plan.priceLabel}
                <span className="text-sm font-medium text-[#4A4560]">
                  {plan.cadence}
                </span>
              </p>
            </div>

            <ul className="mt-4 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#3D8A1E]/15">
                    <svg className="h-3 w-3 text-[#3D8A1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4 4L19 7" />
                    </svg>
                  </span>

                  <span className="font-inter text-sm text-[#4A4560]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 border-t border-[#EDE7FB] pt-4 font-inter text-sm">
              <div className="flex justify-between text-[#4A4560]">
                <span>Subtotal</span>
                <span>{plan.priceLabel}</span>
              </div>
              <div className="flex justify-between text-[#4A4560]">
                <span>VAT</span>
                <span>Included</span>
              </div>
              <div className="mt-2 flex justify-between font-poppins font-semibold text-[#2B2740]">
                <span>Total due today</span>
                <span>
                  {plan.priceLabel}
                  {plan.cadence}
                </span>
              </div>
            </div>
          </div>

          <div
            className="order-1 lg:order-2 rounded-3xl p-6 sm:p-8"
            style={{
              backgroundColor: '#F6F4FE',
              border: '0.1px solid rgba(43, 39, 64, 0.10)',
              boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
            }}
          >
            <h1 className="text-lg font-bold text-[#2B2740]">Payment details</h1>

            <form onSubmit={handlePay} className="mt-6 space-y-5" noValidate>
              <div>
                <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Email for receipt
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

              <div>
                <label className="mb-1.5 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Cardholder name
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
                    Card number
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
                    placeholder="123"
                    className={inputClass}
                  />

                  {errors.cvc && (
                    <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.cvc}</p>
                  )}
                </div>
              </div>

              {status === 'declined' && (
                <p className="rounded-lg bg-red-50 p-3 font-inter text-xs text-[#C51D14]">
                  Your card was declined. Check the details or try another card.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'processing'}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#7E6BB3] text-xs font-semibold text-white transition-colors hover:bg-[#68559D] disabled:cursor-not-allowed disabled:opacity-70"
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
                    Pay {plan.priceLabel}
                    {plan.cadence === '/month' ? ' today' : ` ${plan.cadence}`}
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