'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { auth } from '@/lib/firebase-client';

export default function DashboardPage() {
  const router = useRouter();
  const [hasPressedAnalyseAnother, setHasPressedAnalyseAnother] = useState(false);
  const [hasPreviousSearches, setHasPreviousSearches] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [searchesLeft, setSearchesLeft] = useState(3);
  const [searchLimitMessage, setSearchLimitMessage] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      router.replace('/');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/');
      } else {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authReady || !auth?.currentUser) return;

    (async () => {
      try {
        const token = await auth.currentUser!.getIdToken();
        const response = await fetch(`/api/search?token=${encodeURIComponent(token)}`);
        if (response.ok) {
          const data = await response.json();
          const searches = data.searches ?? [];
          setHasPreviousSearches(searches.length > 0);
          setIsPaid(data.isPaid === true);
          setSearchesLeft(data.searchesLeft ?? data.freeSearchesLeft ?? 3);

          const isNewSearchRequest =
            new URLSearchParams(window.location.search).get('newSearch') === '1';

          if (searches[0]?.query && !isNewSearchRequest) {
            router.replace(`/analyze/results?q=${encodeURIComponent(searches[0].query)}`);
          }
        }
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    })();
  }, [authReady, router]);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

  if (!authReady) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
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
                      onClick={() => {
                        if (searchesLeft === 0) {
                          setSearchLimitMessage(
                            isPaid
                              ? 'You have reached your 7 monthly searches.'
                              : 'You have reached your 3 free searches. Upgrade to analyse another adventure.'
                          );
                          return;
                        }

                        setHasPressedAnalyseAnother(true);
                        setSearchLimitMessage('');
                      }}
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

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8">
        <HeroSection
          showVisuals={false}
          dashboardLayout
          dashboardMessage={
            searchLimitMessage ||
              (hasPressedAnalyseAnother || hasPreviousSearches
                ? 'Ready to search again? Enter another adventure provider above.'
                : "You haven't searched for an adventure yet. Start by searching above.")
          }
          searchesRemaining={searchesLeft}
        />
      </main>

      <Footer />
    </div>
  );
}