'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsBar from '@/components/StatsBar';
import SafetyQuestions from '@/components/SafetyQuestions';
import HowItWorks from '@/components/HowItWorks';
import WhatYouWillReceive from '@/components/WhatYouWillReceive';
import Testimonials from '@/components/Testimonials';
import ResultsNavbar from '@/components/ResultsNavbar';
import Footer from '@/components/Footer';

/*
 * The landing page serves two audiences from one route.
 *
 * A visitor who has not signed in only wants to search, so they get the search
 * screen: no marketing sections competing with the one thing they came to do.
 * The sign-in gate itself lives in HeroSection, which sends anyone without a
 * session to /signin and back again with the query intact.
 *
 * Once someone is signed in they get the full marketing page, because by then
 * they are browsing rather than arriving cold, and the sections explain what the
 * product does before they spend a search on it.
 *
 * The signed out layout is what renders on the server too. Starting from the
 * search screen means a cold visitor never sees an empty page while Firebase
 * resolves, which is the failure the dashboard page suffers from.
 */
export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsSignedIn(Boolean(firebaseUser));
    });

    return () => unsubscribe();
  }, []);

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9FE]">
        <ResultsNavbar />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-8">
          <HeroSection
            showVisuals={false}
            dashboardLayout
            dashboardMessage="Search an adventure provider to see its safety profile, risk breakdown and reports from other travellers."
            searchesRemaining={3}
          />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-8 py-8 space-y-8">
        {/* Modularized Hero Section */}
        <HeroSection />

        {/* Modularized Stats Bar */}
        <StatsBar />

        {/* Safety Questions Section */}
        <SafetyQuestions />

        {/* How It Works Section */}
        <HowItWorks />

        {/* What You'll Receive Section */}
        <WhatYouWillReceive />

        {/* Testimonials Component */}
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}