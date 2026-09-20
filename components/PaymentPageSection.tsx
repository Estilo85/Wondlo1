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
              <Link href="/" className="transition-colors hover:text-[#7E6BB3]">
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

              <span className="hidden sm:inline">Analyse Another Adventure</span>
              <span className="sm:hidden">Analyse Another</span>
              <span aria-hidden="true" className="text-sm">→</span>
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

      <main className="mx-auto w-full max-w-[1100px] px-6 py-12 pb-20 sm:py-16 sm:pb-24">

        {/* Upgrade Pill Badge */}
        <div className="mb-8 flex justify-center">
          <div className="bg-[#7C63BD] text-white px-8 py-2.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-xs">
            UPGRADE
          </div>
        </div>

        {/* 3-Column Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Card 1: Free Trial */}
          <div className="bg-[#F6F4FE] border border-[#D5C3F9] rounded-[24px] p-8 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="bg-[#EBE2FE] text-[#7C63BD] border border-[#D5C3F9] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  Free Trial
                </span>
              </div>
              {/* Price */}
              <div className="text-center pt-2">
                <span className="text-5xl font-extrabold text-[#2B2740]">0£</span>
                <span className="text-sm font-bold text-[#7C63BD]">/Month</span>
              </div>
              {/* Description */}
              <div className="text-center text-xs font-semibold text-[#2B2740] pt-4">
                Three Searches
              </div>
            </div>
          </div>

          {/* Card 2: Pay As You Go */}
          <div className="bg-[#F6F4FE] border border-[#D5C3F9] rounded-[24px] p-8 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="bg-[#EBE2FE] text-[#7C63BD] border border-[#D5C3F9] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  Pay As You Go
                </span>
              </div>
              {/* Price */}
              <div className="text-center pt-2">
                <span className="text-5xl font-extrabold text-[#2B2740]">3£</span>
                <span className="text-sm font-bold text-[#7C63BD]">/search</span>
              </div>
              {/* Features List */}
              <div className="space-y-3 text-center text-xs font-semibold text-[#2B2740] pt-2">
                <p>One Search</p>
                <p>Adventure Preparedness</p>
                <p>Safety Digest</p>
                <p>Operator Chat Diagnosis</p>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-8">
              <button
                onClick={onPayAsYouGo}
                className="w-full bg-[#7C63BD] hover:bg-[#6B52A1] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs tracking-wider cursor-pointer"
              >
                PAY
              </button>
            </div>
          </div>

          {/* Card 3: Starter Plan */}
          <div className="bg-[#F6F4FE] border border-[#D5C3F9] rounded-[24px] p-8 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="bg-[#EBE2FE] text-[#7C63BD] border border-[#D5C3F9] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  Starter Plan
                </span>
              </div>
              {/* Price */}
              <div className="text-center pt-2">
                <span className="text-5xl font-extrabold text-[#2B2740]">15£</span>
                <span className="text-sm font-bold text-[#7C63BD]">/Month</span>
              </div>
              {/* Features List */}
              <div className="space-y-3 text-center text-xs font-semibold text-[#2B2740] pt-2">
                <p>Seven Searches / Month</p>
                <p>Adventure Preparedness</p>
                <p>Safety Digest</p>
                <p>Operator Chat Diagnosis</p>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-8">
              <button
                onClick={onStarterPlan}
                className="w-full bg-[#7C63BD] hover:bg-[#6B52A1] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs tracking-wider cursor-pointer"
              >
                PAY
              </button>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}