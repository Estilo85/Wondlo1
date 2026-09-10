'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged, type User } from 'firebase/auth';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const query = searchParams.get('q') || 'Summit Trails Expeditions';

  useEffect(() => {
    if (!auth) {
      router.replace('/signin');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/signin');
      } else {
        setUser(firebaseUser);
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const userInitial = user?.displayName?.trim()
    ? user.displayName.trim().charAt(0).toUpperCase()
    : (user?.email?.charAt(0).toUpperCase() ?? 'U');

  const signOut = () => {
    if (auth) {
      auth.signOut();
    }
    router.push('/');
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#FAF9FE] flex items-center justify-center text-sm text-[#7E6BB3]">
        Loading safety analysis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FE] text-[#2B2740] font-inter">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#EDE7FB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-poppins font-semibold text-xl text-[#7E6BB3] tracking-tight">
            Wondlo
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-[#6B6380]">
              <Link href="/" className="hover:text-[#7E6BB3] transition-colors">Home</Link>
              <Link href="/community" className="hover:text-[#7E6BB3] transition-colors">Community</Link>
            </nav>

            <button
              onClick={() => router.push('/')}
              className="bg-[#B29DE8] hover:bg-[#9D85DB] text-white font-poppins font-semibold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Analyze Another Adventure</span>
              <span>→</span>
            </button>

            <div className="flex items-center gap-2 pl-4 border-l border-[#EDE7FB]">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-[#2B2740] leading-tight">
                  {user?.displayName || 'User'}
                </p>
                <button
                  onClick={signOut}
                  className="text-[10px] text-[#7E6BB3] hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
              <div
                onClick={signOut}
                title={user?.displayName ? `Sign out ${user.displayName}` : 'Sign out'}
                className="w-8 h-8 rounded-full bg-[#EDE7FB] border border-[#C7B5F5] flex items-center justify-center text-[#7E6BB3] font-poppins font-bold text-xs cursor-pointer hover:bg-[#E2DBF7] transition-colors"
              >
                {userInitial}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="text-xs font-poppins font-semibold text-[#7E6BB3] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>←</span> Back to Search
        </button>

        {/* Provider Hero Card */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EDE7FB] border border-[#C7B5F5] flex items-center justify-center text-[#7E6BB3] font-bold text-lg">
                  🏔️
                </div>
                <div>
                  <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-[#2B2740]">
                    {query}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B6380] mt-1">
                    <span className="flex items-center gap-1">📍 Nepal</span>
                    <span className="flex items-center gap-1">🧗‍♂️ Adventure Trekking, Climbing</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8F8998] pt-2 border-t border-[#F6F4FE]">
                <span className="bg-[#F6F4FE] px-2.5 py-1 rounded-md border border-[#EDE7FB]">
                  🗓️ Report Generated: <strong className="text-[#2B2740]">July 15, 2026</strong>
                </span>
                <span className="bg-[#F6F4FE] px-2.5 py-1 rounded-md border border-[#EDE7FB]">
                  🔄 Data Covered Up to: <strong className="text-[#2B2740]">July 14, 2026</strong>
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
              <div className="w-32 h-20 rounded-xl bg-gray-100 relative overflow-hidden border border-[#EDE7FB] flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium truncate">Expedition Base</span>
                </div>
              </div>
              <div className="w-32 h-20 rounded-xl bg-gray-100 relative overflow-hidden border border-[#EDE7FB] flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                  <span className="text-[10px] text-white font-medium truncate">Summit Ridge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Overall Safety Score */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-poppins font-semibold text-sm text-[#6B6380]">Overall Safety Score</span>
              <span className="bg-[#EBFADF] text-[#3D8A1E] border border-[#D4F5BE] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Low Risk
              </span>
            </div>
            <div className="my-6 flex items-baseline gap-3">
              <span className="font-poppins font-bold text-5xl sm:text-6xl text-[#2B2740]">85</span>
              <span className="font-poppins font-semibold text-lg text-[#8F8998]">/ 100</span>
            </div>
            <div className="w-full bg-[#F6F4FE] rounded-full h-3 overflow-hidden border border-[#EDE7FB]">
              <div className="bg-[#7E6BB3] h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-poppins font-semibold text-sm text-[#6B6380]">Confidence</span>
              <span className="w-8 h-8 rounded-full bg-[#EDE7FB] border border-[#C7B5F5] flex items-center justify-center text-xs">🛡️</span>
            </div>
            <div className="my-6 flex items-baseline gap-2">
              <span className="font-poppins font-bold text-4xl sm:text-5xl text-[#2B2740]">90%</span>
            </div>
            <p className="text-xs text-[#6B6380] leading-relaxed">
              This operator satisfies our trained model&apos;s 7 required dimensions for safety.
            </p>
          </div>

        </div>

        {/* Safety Summary */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-poppins font-semibold text-base text-[#2B2740] flex items-center gap-2">
            <span>Safety Summary</span>
            <span className="text-xs text-[#7E6BB3]">✨</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6380] leading-relaxed">
            {query} demonstrates strong safety practices overall. Guides are well-qualified and emergency protocols are in place. We found no major incidents in the past 3 years. Some traveller feedback mention equipment maintenance inconsistencies on certain trips.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {['Quality of Experience', 'Incident History', 'Safety Sentiment', 'Quality of Regulation', 'Business Information', 'Equipment Assessment', 'Risk Assessment'].map((tag, idx) => (
              <span key={idx} className="bg-[#F6F4FE] hover:bg-[#EDE7FB] text-[#7E6BB3] border border-[#E4D7FA] text-[11px] font-medium px-3 py-1 rounded-full transition-colors cursor-pointer">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-semibold text-base text-[#2B2740]">Risk Breakdown</h2>
            <button className="text-xs font-semibold text-[#7E6BB3] hover:underline">View full assessment →</button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Quality of Experience', score: 90, status: 'purple' },
              { name: 'Quality of Regulation', score: 78, status: 'purple' },
              { name: 'Incident History', score: 82, status: 'purple' },
              { name: 'Business Information', score: 80, status: 'purple' },
              { name: 'Risk Assessment', score: 85, status: 'purple' },
              { name: 'Equipment Assessment', score: 65, status: 'yellow' },
              { name: 'Safety Sentiment', score: 77, status: 'purple' },
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 text-xs">
                <div className="sm:col-span-4 font-medium text-[#2B2740] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7E6BB3]"></span>
                  {item.name}
                </div>
                <div className="sm:col-span-7">
                  <div className="w-full bg-[#F6F4FE] rounded-full h-2.5 overflow-hidden border border-[#EDE7FB]">
                    <div
                      className={`h-full rounded-full ${item.status === 'yellow' ? 'bg-[#E5A93B]' : 'bg-[#7E6BB3]'}`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
                <div className="sm:col-span-1 text-right font-semibold text-[#2B2740]">
                  {item.score} / 100
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Timeline */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-poppins font-semibold text-base text-[#2B2740]">Incident Timeline</h2>
            <button className="text-xs font-semibold text-[#7E6BB3] hover:underline">View full incidents →</button>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#EDE7FB]">
            <div className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#7E6BB3] ring-4 ring-[#FAF9FE]"></div>
              <div>
                <span className="text-[10px] font-semibold text-[#8F8998] uppercase">Apr 12, 2025 • Minor</span>
                <p className="font-poppins font-semibold text-sm text-[#2B2740] mt-0.5">Mild altitude sickness reported</p>
                <p className="text-xs text-[#6B6380] mt-1">Trekking group experienced mild altitude sickness. Managed on site, no evacuation required.</p>
                <span className="inline-block mt-2 text-[10px] font-medium text-[#7E6BB3] bg-[#F6F4FE] px-2 py-0.5 rounded border border-[#EDE7FB]">Source: Instagram</span>
              </div>
            </div>

            <div className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#3D8A1E] ring-4 ring-[#FAF9FE]"></div>
              <div>
                <span className="text-[10px] font-semibold text-[#8F8998] uppercase">Oct 3, 2023 • None</span>
                <p className="font-poppins font-semibold text-sm text-[#2B2740] mt-0.5">No incidents reported</p>
                <p className="text-xs text-[#6B6380] mt-1">No safety incidents found during this period.</p>
                <span className="inline-block mt-2 text-[10px] font-medium text-[#7E6BB3] bg-[#F6F4FE] px-2 py-0.5 rounded border border-[#EDE7FB]">Source: Company Website</span>
              </div>
            </div>

            <div className="relative flex items-start gap-4 pl-8">
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#E5A93B] ring-4 ring-[#FAF9FE]"></div>
              <div>
                <span className="text-[10px] font-semibold text-[#8F8998] uppercase">May 21, 2021 • Moderate</span>
                <p className="font-poppins font-semibold text-sm text-[#2B2740] mt-0.5">Rescue delayed due to weather</p>
                <p className="text-xs text-[#6B6380] mt-1">Bad weather delayed rescue response by approximately 2 hours. No injuries were reported.</p>
                <span className="inline-block mt-2 text-[10px] font-medium text-[#7E6BB3] bg-[#F6F4FE] px-2 py-0.5 rounded border border-[#EDE7FB]">Source: News Article</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment & Documents Grid */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="font-poppins font-semibold text-base text-[#2B2740]">Assessment</h2>
            <p className="text-xs sm:text-sm text-[#6B6380] mt-1">
              The operator satisfies our safety framework for (trip-type) safety.
            </p>
          </div>

          <div className="pt-4 border-t border-[#F6F4FE]">
            <p className="text-xs font-semibold text-[#2B2740] uppercase tracking-wider mb-4">
              Recommended Documents To Request
            </p>
            <p className="text-xs text-[#6B6380] mb-4">
              Requesting these documents can help verify the operator&apos;s safety practices.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { title: 'Safety Plan', icon: '📄' },
                { title: 'Equipment Inspection Records', icon: '🛡️' },
                { title: 'Emergency Response Plan', icon: '📋' },
                { title: 'Insurance', icon: '🛡️' },
                { title: 'Permits & Authorizations', icon: '📜' },
              ].map((doc, idx) => (
                <div key={idx} className="bg-[#F6F4FE] border border-[#EDE7FB] rounded-xl p-4 text-center space-y-2 hover:bg-[#EDE7FB]/50 transition-colors">
                  <div className="text-xl">{doc.icon}</div>
                  <span className="text-[11px] font-medium text-[#2B2740] block">{doc.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Footer Banner */}
        <div className="bg-[#7E6BB3] rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-poppins font-semibold text-base">Actions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-xs font-semibold font-poppins transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <span>🐛</span> REPORT A BUG
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-xs font-semibold font-poppins transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <span>💡</span> REQUEST A FEATURE
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-xs font-semibold font-poppins transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <span>🛟</span> REQUEST SAFETY HELP
            </button>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 text-xs font-semibold font-poppins transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <span>📥</span> DOWNLOAD RECOMMENDED QUESTIONS
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/70 gap-2">
            <p>All adventure safety scores are generated using our public records & AI safety analysis framework.</p>
            <p>Safety v1.1 • Wondlo © 2026</p>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function AnalysisResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9FE] flex items-center justify-center text-sm text-[#7E6BB3]">Loading safety analysis...</div>}>
      <ResultsContent />
    </Suspense>
  );
}