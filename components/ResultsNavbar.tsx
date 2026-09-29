'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/lib/firebase-client';
import { signOut } from 'firebase/auth';

export default function ResultsNavbar({
  onAnalyseAnother,
}: {
  onAnalyseAnother?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const isHome = pathname === '/';
  const isCommunity = pathname === '/community';
  const navbarBackground =
    pathname === '/analyze/results'
      ? '#F6F4FE'
      : pathname === '/dashboard' || pathname === '/community' || pathname === '/billing'
        ? '#FAF9FE'
        : '#FFFFFF';

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#EDE7FB]"
      style={{ backgroundColor: navbarBackground }}
    >
      <div className="w-full max-w-[1316px] mx-auto px-4 sm:px-6 xl:px-0">
      <div className="min-h-16 py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-bold text-lg text-[#2B2740] tracking-tight flex-shrink-0"
        >
          Wondlo
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide text-[#2B2740]">
            <Link
              href="/"
              className={
                isHome
                  ? 'text-[#7E6BB3] border-b-2 border-[#7E6BB3] pb-0.5'
                  : 'hover:text-[#7E6BB3] transition-colors pb-0.5'
              }
            >
              HOME
            </Link>
            <Link
              href="/community"
              className={
                isCommunity
                  ? 'text-[#7E6BB3] border-b-2 border-[#7E6BB3] pb-0.5'
                  : 'hover:text-[#7E6BB3] transition-colors pb-0.5'
              }
            >
              COMMUNITY
            </Link>
          </nav>

          <button
            onClick={onAnalyseAnother ?? (() => router.push('/dashboard?newSearch=1'))}
            className="h-8 px-3 sm:px-4 rounded-lg bg-[#7E6BB3] text-white border border-[#7E6BB3] flex items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="hidden sm:inline">Analyse Another Adventure</span>
            <span className="sm:hidden">Analyse Another</span>
            <span className="text-sm">→</span>
          </button>

          <div className="relative flex-shrink-0">
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#C7B5F5] bg-[#C7B5F5] text-white"
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
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="block w-full rounded-md px-3 py-2 text-center text-xs font-semibold text-[#2B2740] hover:bg-[#F6F4FE]"
                >
                  Settings
                </Link>
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
      </div>
    </header>
  );
}
