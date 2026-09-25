'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import Footer from '@/components/Footer';
import CurrencySelector, { useCurrency } from '@/components/CurrencySelector';
import { formatConverted } from '@/lib/currency';
import { auth } from '@/lib/firebase-client';

type BillingStatus = {
  plan: string;
  label: string;
  cadence: string;
  allowance: number;
  used: number;
  left: number;
  limited: boolean;
  cycleEndsAt: string | null;
};

export default function PaymentPageSection({
  onPayAsYouGo,
  onStarterPlan,
}: {
  onPayAsYouGo?: () => void;
  onStarterPlan?: () => void;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const currency = useCurrency();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setSignedIn(Boolean(firebaseUser));
      if (!firebaseUser) {
        setBilling(null);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const res = await fetch(`/api/billing/status?token=${encodeURIComponent(token)}`);
        if (res.ok) {
          const data = await res.json();
          setBilling({
            plan: data.plan,
            label: data.label,
            cadence: data.cadence,
            allowance: data.allowance,
            used: data.used,
            left: data.left,
            limited: data.limited,
            cycleEndsAt: data.cycleEndsAt ?? null,
          });
        }
      } catch (error) {
        console.error('Failed to load billing status:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  const usagePercent = billing && billing.allowance > 0 ? Math.min(100, Math.round((billing.used / billing.allowance) * 100)) : 0;

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
              <Link
                href="/"
                className="transition-colors hover:text-[#7E6BB3]"
              >
                HOME
              </Link>

              <Link
                href="/community"
                className="transition-colors hover:text-[#7E6BB3]"
              >
                COMMUNITY
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex h-8 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border border-[#7E6BB3] bg-[#7E6BB3] px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:px-4"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <span className="hidden sm:inline">
                Analyse Another Adventure
              </span>
              <span className="sm:hidden">Analyse Another</span>
              <span aria-hidden="true" className="text-sm">
                →
              </span>
            </button>

            <div className="relative flex-shrink-0">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C7B5F5] bg-[#F6F4FE] text-[#7E6BB3]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
                  />
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
        {/* ============================================================
            BILLING STATUS
        ============================================================ */}
        {signedIn && billing ? (
          <div
            className="mb-8 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            style={{
              background: '#F6F4FE',
              border: '0.1px solid rgba(43, 39, 64, 0.10)',
              boxShadow: '0 8px 20px rgba(43, 39, 64, 0.06)',
            }}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#7E6BB3]"
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h2m4 0h2m-8 4h12a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#7E6BB3]">
                  Billing
                </p>

                <p className="text-sm font-bold text-[#2B2740]">
                  You&apos;re on {billing.label}
                </p>
              </div>

              <div className="w-full max-w-[220px] sm:w-[190px] flex-shrink-0">
                <div className="mb-1 flex justify-between font-inter text-[11px] text-[#4A4560]">
                  <span>
                    {billing.used} of {billing.allowance} searches used
                  </span>
                  <span>{billing.left} left</span>
                </div>

                <div className="h-[10px] w-full overflow-hidden rounded-full bg-[#D9D9D9]">
                  <div
                    className="h-full rounded-full bg-[#7E6BB3] transition-all duration-300"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {billing.limited && billing.plan === 'free_trial' && (
                <Link
                  href="/checkout?plan=pay-as-you-go"
                  className="h-9 rounded-lg bg-[#3D8A1E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#32751A]"
                >
                  Top up searches
                </Link>
              )}

              <Link
                href="/billing"
                className="group inline-flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-[#7E6BB3] to-[#9A87CE] px-4 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(126,107,179,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(126,107,179,0.45)]"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>

                Manage Billing

                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        ) : signedIn ? (
          <div className="mb-8 h-14 animate-pulse rounded-2xl bg-[#F6F4FE]" style={{ border: '0.1px solid rgba(43, 39, 64, 0.10)' }} />
        ) : (
          <div
            className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-6"
            style={{
              background: '#F6F4FE',
              border: '0.1px solid rgba(43, 39, 64, 0.10)',
              boxShadow: '0 8px 20px rgba(43, 39, 64, 0.06)',
            }}
          >
            <p className="text-sm font-medium text-[#2B2740]">
              Sign in to see your search balance and billing details.
            </p>

            <Link
              href="/signin"
              className="h-9 rounded-lg bg-[#7E6BB3] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#68559D]"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* ============================================================
            UPGRADE HEADER
            171 × 50
        ============================================================ */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <div
            className="flex h-[50px] w-[171px] items-center justify-center rounded-full"
            style={{
              background: 'rgba(126, 107, 179, 0.90)',
              boxShadow: '0 6px 16px rgba(43, 39, 64, 0.10)',
            }}
          >
            <span className="text-[20px] leading-[25px] font-bold text-white">
              UPGRADE
            </span>
          </div>

          <span className="flex items-center gap-2">
            <span className="font-inter text-xs font-semibold text-[#7E6BB3]">
              Display prices in
            </span>
            <CurrencySelector />
          </span>
        </div>

        {/* ============================================================
            SUBSCRIPTIONS CONTAINER
            1340 × 673
        ============================================================ */}
        <section
          className="w-full min-h-[673px] rounded-[20px] px-8 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-8 lg:px-[71px] lg:pb-[71px] lg:pt-12"
          style={{
            background: '#FAF9FE',
            boxShadow: '0 12px 20px rgba(43, 39, 64, 0.06), 0 0 0 rgba(43, 39, 64, 0)',
          }}
        >
          {/* ==========================================================
              SUBSCRIPTION COLUMNS
              380 × 530
          ========================================================== */}
          <div className="grid grid-cols-1 justify-center gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-[40px]">
            {/* ========================================================
                FREE TRIAL
            ======================================================== */}
            <div
              className="relative mx-auto flex h-[530px] w-full max-w-[380px] flex-col rounded-[20px]"
              style={{
                background: '#F6F4FE',
                border: '1px solid #7E6BB3',
                boxShadow: '0 6px 16px rgba(43, 39, 64, 0.05)',
              }}
            >
              <div className="flex h-full flex-col items-center px-8 py-10">
                {/* Subscription Label */}
                <div
                  className="flex h-[30px] w-[140px] items-center justify-center rounded-[20px]"
                  style={{
                    background: 'rgba(126, 107, 179, 0.90)',
                    border: '0.5px solid #FFFFFF',
                  }}
                >
                  <span className="text-[16px] leading-[20px] font-medium text-white">
                    Free Trial
                  </span>
                </div>

                {/* Price */}
                <div className="mt-12 flex items-baseline justify-center">
                  <span className="text-[60px] leading-[72px] font-bold text-[#2B2740]">
                    {formatConverted(0, currency)}
                  </span>

                  <span className="ml-0 text-[24px] leading-[30px] font-bold text-[#2B2740]">
                    /Month
                  </span>
                </div>

                {/* Features */}
                <div className="mt-14 w-full text-center">
                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Three Searches
                  </p>

                  <p className="mt-2 text-[13px] leading-[18px] font-normal text-[#4A4560]">
                    No card required
                  </p>
                </div>

                {/* Start Free Trial Button */}
                <div className="mt-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      signedIn
                        ? router.push('/dashboard?newSearch=1')
                        : router.push('/signup')
                    }
                    className="flex h-[32px] w-[150px] cursor-pointer items-center justify-center rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                    style={{
                      background: 'rgba(126, 107, 179, 0.90)',
                      border: '0.5px solid #FFFFFF',
                      boxShadow: '0 6px 16px rgba(43, 39, 64, 0.20)',
                    }}
                  >
                    <span className="text-[20px] leading-[25px] font-medium text-white">
                      START FREE
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================
                PAY AS YOU GO
            ======================================================== */}
            <div
              className="relative mx-auto flex h-[530px] w-full max-w-[380px] flex-col rounded-[20px]"
              style={{
                background: '#F6F4FE',
                border: '1px solid #7E6BB3',
                boxShadow: '0 10px 35px rgba(43, 39, 64, 0.05)',
              }}
            >
              <div className="flex h-full flex-col items-center px-8 py-10">
                {/* Subscription Label */}
                <div
                  className="flex h-[30px] w-[140px] items-center justify-center rounded-[20px]"
                  style={{
                    background: 'rgba(126, 107, 179, 0.90)',
                    border: '0.5px solid #FFFFFF',
                  }}
                >
                  <span className="text-[16px] leading-[20px] font-medium text-white">
                    Pay As You Go
                  </span>
                </div>

                {/* Price */}
                <div className="mt-12 flex items-baseline justify-center">
                  <span className="text-[60px] leading-[72px] font-bold text-[#2B2740]">
                    {formatConverted(300, currency)}
                  </span>

                  <span className="ml-0 text-[24px] leading-[30px] font-bold text-[#2B2740]">
                    /Search
                  </span>
                </div>

                {/* Features */}
                <div className="mt-12 w-full space-y-4 text-center">
                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    One Search
                  </p>

                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Adventure Preparedness
                  </p>

                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Safety Digest
                  </p>

                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Operator Chat Diagnosis
                  </p>
                </div>

                {/* PAY Button */}
                <div className="mt-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      onPayAsYouGo
                        ? onPayAsYouGo()
                        : router.push('/checkout?plan=pay-as-you-go')
                    }
                    className="flex h-[32px] w-[130px] items-center justify-center rounded-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 cursor-pointer"
                    style={{
                      background: 'rgba(126, 107, 179, 0.90)',
                      border: '0.5px solid #FFFFFF',
                      boxShadow: '0 6px 16px rgba(43, 39, 64, 0.20)',
                    }}
                  >
                    <span className="text-[20px] leading-[25px] font-medium text-white">
                      PAY
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================
                STARTER PLAN
            ======================================================== */}
            <div
              className="relative mx-auto flex h-[530px] w-full max-w-[380px] flex-col rounded-[20px]"
              style={{
                background: '#F6F4FE',
                border: '1px solid #7E6BB3',
                boxShadow: '0 10px 35px rgba(43, 39, 64, 0.05)',
              }}
            >
              <div className="flex h-full flex-col items-center px-8 py-10">
                {/* Subscription Label */}
                <div
                  className="flex h-[30px] w-[140px] items-center justify-center rounded-[20px]"
                  style={{
                    background: 'rgba(126, 107, 179, 0.90)',
                    border: '0.5px solid #FFFFFF',
                  }}
                >
                  <span className="text-[16px] leading-[20px] font-medium text-white">
                    Starter Plan
                  </span>
                </div>

                {/* Price */}
                <div className="mt-12 flex items-baseline justify-center">
                  <span className="text-[60px] leading-[72px] font-bold text-[#2B2740]">
                    {formatConverted(1500, currency)}
                  </span>

                  <span className="ml-0 text-[24px] leading-[30px] font-bold text-[#2B2740]">
                    /Month
                  </span>
                </div>

                {/* Features */}
                <div className="mt-12 w-full space-y-4 text-center">
                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Seven Searches / Month
                  </p>

                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Adventure Preparedness
                  </p>

                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Safety Digest
                  </p>

                  <p className="text-[20px] leading-[25px] font-normal text-[#000000]">
                    Operator Chat Diagnosis
                  </p>
                </div>

                {/* PAY Button */}
                <div className="mt-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      onStarterPlan
                        ? onStarterPlan()
                        : router.push('/checkout?plan=starter')
                    }
                    className="flex h-[32px] w-[130px] items-center justify-center rounded-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 cursor-pointer"
                    style={{
                      background: 'rgba(126, 107, 179, 0.90)',
                      border: '0.5px solid #FFFFFF',
                      boxShadow: '0 6px 16px rgba(43, 39, 64, 0.20)',
                    }}
                  >
                    <span className="text-[20px] leading-[25px] font-medium text-white">
                      PAY
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}