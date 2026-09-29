'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { auth } from '@/lib/firebase-client';
import { isPaidPlan } from '@/lib/billing';
import ResultsNavbar from '@/components/ResultsNavbar';

export default function DashboardPage() {
  const router = useRouter();
  const [hasPressedAnalyseAnother, setHasPressedAnalyseAnother] = useState(false);
  const [hasPreviousSearches, setHasPreviousSearches] = useState(false);
  const [previousSearchQuery, setPreviousSearchQuery] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [searchesLeft, setSearchesLeft] = useState(3);
  const [searchLimitMessage, setSearchLimitMessage] = useState('');
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
        const response = await fetch(`/api/search?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          const searches = data.searches ?? [];
          setHasPreviousSearches(searches.length > 0);
          setPreviousSearchQuery(searches[0]?.query ?? '');
          setIsPaid(isPaidPlan(data.plan));
          setSearchesLeft(data.left ?? data.freeSearchesLeft ?? 3);

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


  if (!authReady) {
    return <div className="min-h-screen bg-[#FAF9FE]" />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9FE]">
      <ResultsNavbar
        onAnalyseAnother={() => {
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
      />

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
        {previousSearchQuery && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() =>
                router.push(`/analyze/results?q=${encodeURIComponent(previousSearchQuery)}`)
              }
              className="flex h-10 items-center gap-2 rounded-lg border border-[#7E6BB3] px-4 text-sm font-semibold text-[#FFFFFF] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #7E6BB3 25%, #2B2740 100%)' }}
            >
              <span aria-hidden="true">←</span>
              Back to Previous Results
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}