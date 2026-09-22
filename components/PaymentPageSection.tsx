'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'firebase/auth';

import Footer from '@/components/Footer';
import { auth } from '@/lib/firebase-client';

export default function PaymentPageSection({
  onPayAsYouGo,
  onStarterPlan,
}: {
  onPayAsYouGo?: () => void;
  onStarterPlan?: () => void;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

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
            UPGRADE HEADER
            171 × 50
        ============================================================ */}
        <div className="mb-10 flex justify-center">
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
                    0£
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
                    3£
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
                    15£
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