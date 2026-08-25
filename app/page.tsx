import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsBar from '@/components/StatsBar';
import SafetyQuestions from '@/components/SafetyQuestions';
import HowItWorks from '@/components/HowItWorks';
import WhatYouWillReceive from '@/components/WhatYouWillReceive';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
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