'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { jsPDF } from 'jspdf';

import Footer from '@/components/Footer';
import CurrencySelector, { useCurrency } from '@/components/CurrencySelector';
import { formatConverted } from '@/lib/currency';
import { auth } from '@/lib/firebase-client';
import { formatMoney, formatCardBrand, PLANS } from '@/lib/billing';

type Card = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

type Purchase = {
  id: string;
  orderRef: string;
  plan: string;
  amountPence: number;
  currency: string;
  status: string;
  createdAt: string;
  cardBrand: string | null;
  cardLast4: string | null;
};

type BillingResponse = {
  user: { name: string; email: string };
  plan: string;
  label: string;
  cadence: string;
  pricePence: number;
  allowance: number;
  used: number;
  left: number;
  limited: boolean;
  cycleEndsAt: string | null;
  cards: Card[];
  purchases: Purchase[];
};

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(cardNumber: string) {
  const first = cardNumber.replace(/\D/g, '').slice(0, 2);
  if (first.startsWith('4')) return 'Visa';
  if (first.startsWith('5')) return 'Mastercard';
  if (first.startsWith('3')) return 'Amex';
  if (first.startsWith('6')) return 'Discover';
  return 'Card';
}

function luhnValid(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 15) return false;
  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

const cardClass =
  'rounded-3xl p-6 sm:p-7 bg-[#F6F4FE]';
const cardBorder = { border: '0.1px solid rgba(43, 39, 64, 0.10)', boxShadow: '0 8px 20px rgba(43, 39, 64, 0.06)' };

export default function BillingPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [data, setData] = useState<BillingResponse | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editCardNumber, setEditCardNumber] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  const [editCardError, setEditCardError] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardError, setCardError] = useState('');
  const currency = useCurrency();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.replace('/');
  };

  useEffect(() => {
    if (!auth) {
      router.replace('/signin');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/signin');
      } else {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const load = async () => {
    if (!auth?.currentUser) return;
    setError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`/api/billing/status?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        setError('Unable to load billing details.');
        return;
      }
      setData(await res.json());
    } catch (err) {
      console.error(err);
      setError('Unable to load billing details.');
    }
  };

  useEffect(() => {
    if (!authReady) return;

    void (async () => {
      await load();
    })();
  }, [authReady]);

  const changeDefault = async (cardId: string) => {
    if (!auth?.currentUser || busy) return;
    setBusy(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/billing/card', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, cardId }),
      });
      if (res.ok) await load();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const removeCard = async (cardId: string) => {
    if (!auth?.currentUser || busy) return;
    setBusy(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`/api/billing/card?token=${encodeURIComponent(token)}&cardId=${encodeURIComponent(cardId)}`, {
        method: 'DELETE',
      });
      if (res.ok) await load();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const editCard = async (event: React.FormEvent, cardId: string) => {
    event.preventDefault();
    if (!auth?.currentUser || busy) return;

    const digits = editCardNumber.replace(/\D/g, '');
    const expDigits = editExpiry.replace(/\D/g, '');
    const month = Number(expDigits.slice(0, 2));
    const year = 2000 + Number(expDigits.slice(2));
    const currentMonth = new Date().getFullYear() * 12 + new Date().getMonth() + 1;
    const cardMonth = year * 12 + month;

    if (!luhnValid(editCardNumber) || digits.length > 16) {
      setEditCardError('Enter a valid card number.');
      return;
    }
    if (expDigits.length !== 4 || month < 1 || month > 12 || cardMonth < currentMonth) {
      setEditCardError('Enter a valid expiry date.');
      return;
    }

    setBusy(true);
    setEditCardError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/billing/card', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          cardId,
          card: {
            brand: detectBrand(editCardNumber),
            last4: digits.slice(-4),
            expMonth: month,
            expYear: year,
          },
        }),
      });
      if (!res.ok) {
        setEditCardError('Unable to edit this card.');
        return;
      }
      setEditingCardId(null);
      setEditCardNumber('');
      setEditExpiry('');
      await load();
    } catch (err) {
      console.error(err);
      setEditCardError('Unable to edit this card.');
    } finally {
      setBusy(false);
    }
  };

  const saveCard = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth?.currentUser || busy) return;

    const digits = cardNumber.replace(/\D/g, '');
    const expDigits = expiry.replace(/\D/g, '');
    const month = Number(expDigits.slice(0, 2));
    const year = 2000 + Number(expDigits.slice(2));
    const currentMonth = new Date().getFullYear() * 12 + new Date().getMonth() + 1;
    const cardMonth = year * 12 + month;

    if (cardholder.trim().length < 2) {
      setCardError('Enter the name on the card.');
      return;
    }
    if (!luhnValid(cardNumber) || digits.length > 16) {
      setCardError('Enter a valid card number.');
      return;
    }
    if (expDigits.length !== 4 || month < 1 || month > 12 || cardMonth < currentMonth) {
      setCardError('Enter a valid expiry date.');
      return;
    }
    if (cvc.replace(/\D/g, '').length < 3) {
      setCardError('Enter a valid security code.');
      return;
    }

    setBusy(true);
    setCardError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/billing/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          card: {
            cardholder: cardholder.trim(),
            brand: detectBrand(cardNumber),
            last4: digits.slice(-4),
            expMonth: month,
            expYear: year,
          },
        }),
      });
      if (!res.ok) {
        setCardError('Unable to save this card.');
        return;
      }
      setCardNumber('');
      setCardholder('');
      setExpiry('');
      setCvc('');
      setAddCardOpen(false);
      await load();
    } catch (err) {
      console.error(err);
      setCardError('Unable to save this card.');
    } finally {
      setBusy(false);
    }
  };

  const downloadReceipt = async (purchase: Purchase, user: { name: string; email: string }) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const PURPLE = '#7E6BB3';
    const DARK = '#2B2740';
    const GREEN = '#3D8A1E';
    const GRAY = '#6B6B80';

    const hexToRgb = (hex: string) => {
      const value = hex.replace('#', '');
      return {
        r: parseInt(value.substring(0, 2), 16),
        g: parseInt(value.substring(2, 4), 16),
        b: parseInt(value.substring(4, 6), 16),
      };
    };
    const setText = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      doc.setTextColor(r, g, b);
    };

    let y = 20;
    const addPage = () => {
      doc.addPage();
      y = 20;
    };
    const ensure = (h: number) => {
      if (y + h > 275) addPage();
    };

    setText(PURPLE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Wondlo', margin, y);
    y += 5;
    setText(GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Secure Adventure Safety Intelligence', margin, y);
    y += 14;

    setText(PURPLE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('INVOICE', margin, y);
    y += 9;

    const details = [
      ['Invoice No', purchase.orderRef],
      ['Date', new Date(purchase.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })],
      ['Status', 'Paid'],
    ];
    setText(DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    details.forEach(([k, v]) => {
      const labelX = pageWidth - margin - 90;
      ensure(8);
      setText(GRAY);
      doc.setFont('helvetica', 'normal');
      doc.text(k, labelX, y);
      doc.setFont('helvetica', 'bold');
      setText(DARK);
      doc.text(v, pageWidth - margin, y, { align: 'right' });
      y += 6;
    });
    y += 6;

    const leftCol = [
      ['Billed to', `${user.name}`],
      [user.email, ''],
    ];
    setText(GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    leftCol.forEach(([lineA, lineB], i) => {
      ensure(8);
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
      setText(i === 0 ? DARK : GRAY);
      doc.text(lineA, margin, y);
      if (lineB) doc.text(lineB, margin, y + 5);
      y += 6;
    });

    y += 14;

    const drawLine = () => {
      doc.setDrawColor(220, 212, 240);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
    };
    ensure(12);
    drawLine();
    y += 8;

    setText(DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Description', margin, y);
    doc.text('Amount', pageWidth - margin, y, { align: 'right' });
    y += 7;

    ensure(10);
    setText(GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Wondlo ${PLANS[purchase.plan as keyof typeof PLANS].name} (${PLANS[purchase.plan as keyof typeof PLANS].cadence})`, margin, y);
    doc.text(formatMoney(purchase.amountPence, purchase.currency), pageWidth - margin, y, { align: 'right' });
    y += 8;

    ensure(10);
    drawLine();
    y += 8;
    ensure(10);
    setText(DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total', margin, y);
    doc.text(formatMoney(purchase.amountPence, purchase.currency), pageWidth - margin, y, { align: 'right' });
    y += 16;

    setText(GREEN);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const paidMsg = purchase.cardLast4
      ? `Paid by ${formatCardBrand(purchase.cardBrand ?? 'Card')} ending in ${purchase.cardLast4}.`
      : 'Payment confirmed.';
    doc.text(paidMsg, margin, y);
    y += 6;
    setText(GRAY);
    doc.setFontSize(9);
    const note = 'Thank you for using Wondlo. This invoice serves as your payment receipt.';
    const lines = doc.splitTextToSize(note, contentWidth);
    doc.text(lines, margin, y);

    doc.save(`Wondlo-${purchase.orderRef}-Receipt.pdf`);
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F6F4FE] flex items-center justify-center text-sm text-[#7E6BB3]">
        Loading billing details...
      </div>
    );
  }

  const usagePercent = data && data.allowance > 0 ? Math.min(100, Math.round((data.used / data.allowance) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#FAF9FE] text-[#2B2740] font-poppins antialiased">
      <header className="sticky top-0 z-50 border-b border-[#EDE7FB] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1316px] items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-0">
          <Link
            href="/"
            className="flex-shrink-0 text-lg font-bold tracking-tight text-[#2B2740]"
          >
            Wondlo
          </Link>

          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-8 text-xs font-semibold tracking-wide text-[#2B2740] md:flex">
              <Link href="/" className="transition-colors hover:text-[#7E6BB3]">
                HOME
              </Link>

              <Link href="/community" className="transition-colors hover:text-[#7E6BB3]">
                COMMUNITY
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => router.push('/payments')}
              className="flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-[#7E6BB3] bg-[#7E6BB3] px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:px-4"
            >
              View Plans
            </button>

            <div className="relative flex-shrink-0">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C7B5F5] bg-[#F6F4FE] text-[#7E6BB3]"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                </svg>

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#3D8A1E] ring-2 ring-white" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 z-50 w-32 rounded-lg border border-[#EDE7FB] bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-md px-3 py-2 text-center text-xs font-semibold text-[#2B2740] hover:bg-[#F6F4FE]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1340px] px-4 py-10 pb-16 sm:px-6 sm:py-12 sm:pb-20 xl:px-0">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2B2740]">Billing</h1>
            <p className="mt-1 font-inter text-sm text-[#4A4560]">
              Manage your plan, payment methods and receipts.
            </p>
          </div>

          <span className="flex items-center gap-2">
            <span className="font-inter text-xs font-semibold text-[#7E6BB3]">
              Display prices in
            </span>
            <CurrencySelector />
          </span>
        </div>

        {error && (
          <p className="mx-auto mb-6 max-w-xl rounded-lg bg-red-50 p-3 text-center font-inter text-sm text-[#C51D14]">
            {error}
          </p>
        )}

        {!data ? (
          <div className="h-40 animate-pulse rounded-2xl bg-[#F6F4FE]" style={cardBorder} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div
                className="relative overflow-hidden rounded-3xl p-6 text-white sm:p-8 lg:col-span-2"
                style={{
                  background: 'linear-gradient(135deg, #7E6BB3 0%, #2B2740 100%)',
                  boxShadow: '0 14px 34px rgba(126, 107, 179, 0.35)',
                }}
              >
                <div
                  className="pointer-events-none absolute -right-14 -top-14 z-0 h-44 w-44 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7E6BB3 0%, #2B2740 100%)' }}
                />
                <div
                  className="pointer-events-none absolute -bottom-16 -left-10 z-0 h-40 w-40 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7E6BB3 0%, #C7B5F5 100%)' }}
                />
              <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-white/70">
                    Current Plan
                  </p>

                  <h1 className="mt-1 text-2xl font-bold text-white">{data.label}</h1>

                  <p className="mt-1 font-inter text-sm text-white/80">
                    {data.pricePence === 0
                      ? 'Your free trial includes 3 searches. No card required.'
                      : `${data.cadence.replace('/', '').replace(/^month$/, 'Month')} Cycle · Billed Securely`}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {data.pricePence === 0
                      ? 'Free'
                      : `${formatConverted(data.pricePence, currency)}${data.cadence}`}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#3D8A1E]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Active
                  </span>
                </div>
              </div>

              <div className="relative z-10 mt-6">
                <div className="mb-1.5 flex justify-between font-inter text-xs text-white/85">
                  <span>{data.left} searches left</span>
                  <span>{usagePercent}%</span>
                </div>

                <div className="h-[14px] w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-300"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-inter text-xs text-white/85">
                {data.cycleEndsAt && (
                  <span>
                    Next charge:{' '}
                    <span className="font-semibold text-white">
                      {new Date(data.cycleEndsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </span>
                )}

                {data.cycleEndsAt && (
                  <span className="hidden text-white/50 sm:inline">·</span>
                )}

                <span>
                  Account:{' '}
                  <span className="font-semibold text-white">{data.user.email}</span>
                </span>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                <Link
                  href="/payments"
                  className="h-10 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-[#7E6BB3] shadow-[0_4px_12px_rgba(43,39,64,0.25)] transition-transform hover:-translate-y-0.5"
                >
                  Change or Upgrade Plan
                </Link>

                {data.limited && data.plan === 'free_trial' && (
                  <Link
                    href="/checkout?plan=pay-as-you-go"
                    className="h-10 rounded-lg bg-[#3D8A1E] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(61,138,30,0.35)] transition-transform hover:-translate-y-0.5"
                  >
                    Top up searches
                  </Link>
                )}
              </div>
            </div>

            <div className={`${cardClass} lg:col-span-1`} style={cardBorder}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-bold text-[#2B2740]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE7FB] text-[#7E6BB3]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="2.5" y="5" width="19" height="14" rx="2" />
                      <path d="M2.5 10h19" />
                    </svg>
                  </span>
                  Payment Methods
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setAddCardOpen((open) => !open);
                    setCardError('');
                  }}
                  className="rounded-full border border-[#C7B5F5] bg-white px-3 py-1.5 text-xs font-semibold text-[#7E6BB3] transition-colors hover:bg-[#EDE7FB]"
                >
                  {addCardOpen ? 'Cancel' : '+ Add Card'}
                </button>
              </div>

              {addCardOpen && (
                <form onSubmit={saveCard} className="mt-4 space-y-3 rounded-2xl bg-[#FAF9FE] p-4" style={{ border: '0.1px solid rgba(126, 107, 179, 0.15)' }}>
                  <input
                    type="text"
                    value={cardholder}
                    onChange={(event) => setCardholder(event.target.value.replace(/\d/g, ''))}
                    placeholder="Cardholder name"
                    aria-label="Cardholder name"
                    className="w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-3 py-2.5 font-inter text-sm text-[#2B2740] outline-none focus:border-[#7E6BB3]"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                    placeholder="Card number"
                    aria-label="Card number"
                    className="w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-3 py-2.5 font-inter text-sm text-[#2B2740] outline-none focus:border-[#7E6BB3]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                      placeholder="MM/YY"
                      aria-label="Expiry date"
                      className="w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-3 py-2.5 font-inter text-sm text-[#2B2740] outline-none focus:border-[#7E6BB3]"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cvc}
                      onChange={(event) => setCvc(event.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="CVC"
                      aria-label="CVC"
                      className="w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-3 py-2.5 font-inter text-sm text-[#2B2740] outline-none focus:border-[#7E6BB3]"
                    />
                  </div>
                  {cardError && <p className="font-inter text-xs text-[#C51D14]">{cardError}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(90deg, #7E6BB3 10%, #2B2740 100%)',
                    }}
                  >
                    {busy ? 'Saving card...' : 'Save Card'}
                  </button>
                </form>
              )}

              {data.cards.length === 0 ? (
                <p className="mt-6 rounded-xl bg-white p-4 text-center font-inter text-sm text-[#4A4560]" style={{ border: '0.1px solid rgba(126, 107, 179, 0.15)' }}>
                  No saved cards yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.cards.map((card) => (
                    <li
                      key={card.id}
                      className="flex flex-col gap-3 rounded-2xl p-4"
                      style={{ background: 'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)', border: '0.1px solid rgba(126, 107, 179, 0.15)', boxShadow: '0 4px 12px rgba(126, 107, 179, 0.10)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-[#EDE7FB] text-[#7E6BB3]">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <rect x="2.5" y="5" width="19" height="14" rx="2" />
                            <path d="M2.5 10h19" />
                          </svg>
                        </div>

                        <div>
                          <p className="flex items-center gap-2 text-sm font-semibold text-[#2B2740]">
                            {formatCardBrand(card.brand)} &#8226;&#8226;&#8226;&#8226; {card.last4}

                            {card.isDefault && (
                              <span className="rounded-full bg-[#3D8A1E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#3D8A1E]">
                                Default
                              </span>
                            )}
                          </p>

                          <p className="font-inter text-xs text-[#4A4560]">
                            Expires {String(card.expMonth).padStart(2, '0')}/{String(card.expYear).slice(-2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-1">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setEditingCardId(card.id);
                            setEditCardNumber('');
                            setEditExpiry('');
                            setEditCardError('');
                          }}
                          className="cursor-pointer text-xs font-semibold text-[#7E6BB3] hover:underline disabled:opacity-50"
                        >
                          Edit
                        </button>

                        {!card.isDefault && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => changeDefault(card.id)}
                            className="cursor-pointer text-xs font-semibold text-[#7E6BB3] hover:underline disabled:opacity-50"
                          >
                            Make default
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => removeCard(card.id)}
                          className="cursor-pointer text-xs font-semibold text-[#C51D14] hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>

                      {editingCardId === card.id && (
                        <form onSubmit={(event) => editCard(event, card.id)} className="space-y-3 rounded-xl bg-white p-3" style={{ border: '0.1px solid rgba(126, 107, 179, 0.15)' }}>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editCardNumber}
                            onChange={(event) => setEditCardNumber(formatCardNumber(event.target.value))}
                            placeholder="New card number"
                            aria-label="New card number"
                            className="w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-3 py-2.5 font-inter text-sm text-[#2B2740] outline-none focus:border-[#7E6BB3]"
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editExpiry}
                            onChange={(event) => setEditExpiry(formatExpiry(event.target.value))}
                            placeholder="New expiry MM/YY"
                            aria-label="New expiry date"
                            className="w-full rounded-lg border border-[#EDE7FB] bg-[#FAF9FE] px-3 py-2.5 font-inter text-sm text-[#2B2740] outline-none focus:border-[#7E6BB3]"
                          />
                          {editCardError && <p className="font-inter text-xs text-[#C51D14]">{editCardError}</p>}
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={busy}
                              className="rounded-lg bg-[#7E6BB3] px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                            >
                              {busy ? 'Saving...' : 'Save changes'}
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setEditingCardId(null)}
                              className="rounded-lg border border-[#C7B5F5] px-3 py-2 text-xs font-semibold text-[#7E6BB3] disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            </div>

            <div className={cardClass} style={cardBorder}>
              <h2 className="text-base font-bold text-[#2B2740]">Billing history</h2>

              {data.purchases.length === 0 ? (
                <p className="mt-6 rounded-xl bg-white p-4 text-center font-inter text-sm text-[#4A4560]" style={{ border: '0.1px solid rgba(126, 107, 179, 0.15)' }}>
                  No payments yet. When you purchase a plan, your receipts will appear here.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-[#C7B5F5] font-poppins text-xs font-bold text-[#7E6BB3]">
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3 pr-4">Order ref</th>
                        <th className="py-3 pr-4">Plan</th>
                        <th className="py-3 pr-4">Card</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3 pr-4 text-right">Amount</th>
                        <th className="py-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.purchases.map((purchase) => (
                        <tr key={purchase.id} className="border-b border-[#EDE7FB]/70 font-inter text-sm text-[#2B2740] transition-colors hover:bg-[#F6F4FE]/60">
                          <td className="py-4 pr-4">
                            {new Date(purchase.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 pr-4 font-medium">{purchase.orderRef}</td>
                          <td className="py-4 pr-4">{PLANS[purchase.plan as keyof typeof PLANS].name}</td>
                          <td className="py-4 pr-4 text-[#4A4560]">
                            {purchase.cardLast4 ? `${purchase.cardBrand ?? 'Card'} •••• ${purchase.cardLast4}` : '\u2014'}
                          </td>
                          <td className="py-4 pr-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3D8A1E]/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3D8A1E]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#3D8A1E]" />
                              Paid
                            </span>
                          </td>
                          <td className="py-4 pr-4 text-right font-bold text-[#7E6BB3]">
                            {formatMoney(purchase.amountPence, purchase.currency)}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              type="button"
                              onClick={() => downloadReceipt(purchase, data.user)}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#C7B5F5] bg-white px-3 py-1.5 text-xs font-semibold text-[#7E6BB3] transition-colors hover:bg-[#EDE7FB]"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                              </svg>
                              PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}