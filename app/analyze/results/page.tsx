'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase-client';
import { onAuthStateChanged } from 'firebase/auth';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const query = searchParams.get('q') || 'Summit Trails Expeditions';

  const today = new Date();
  const generatedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const coveredUpTo = new Date(today);
  coveredUpTo.setDate(today.getDate() - 1);
  const coveredUpToDate = coveredUpTo.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const riskDefaults: Record<string, { score: string; width: string; color: string }> = {
    'Quality of Experience': { score: '90 / 100', width: '90%', color: 'bg-[#7E6BB3]' },
    'Quality of Regulation': { score: '78 / 100', width: '78%', color: 'bg-[#7E6BB3]' },
    'Incident History': { score: '85 / 100', width: '85%', color: 'bg-[#7E6BB3]' },
    'Business Information': { score: '80 / 100', width: '80%', color: 'bg-[#7E6BB3]' },
    'Risk Assessment': { score: '70 / 100', width: '70%', color: 'bg-[#FBC02D]' },
    'Equipment Assessment': { score: '65 / 100', width: '65%', color: 'bg-[#FBC02D]' },
    'Safety Sentiment': { score: '77 / 100', width: '77%', color: 'bg-[#7E6BB3]' },
  };
  const riskByCompany: Record<string, typeof riskDefaults> = {
    'Himalayan Adventure Co': {
      'Quality of Experience': { score: '82 / 100', width: '82%', color: 'bg-[#7E6BB3]' },
      'Quality of Regulation': { score: '74 / 100', width: '74%', color: 'bg-[#7E6BB3]' },
      'Incident History': { score: '68 / 100', width: '68%', color: 'bg-[#FBC02D]' },
      'Business Information': { score: '88 / 100', width: '88%', color: 'bg-[#7E6BB3]' },
      'Risk Assessment': { score: '55 / 100', width: '55%', color: 'bg-[#FBC02D]' },
      'Equipment Assessment': { score: '60 / 100', width: '60%', color: 'bg-[#FBC02D]' },
      'Safety Sentiment': { score: '79 / 100', width: '79%', color: 'bg-[#7E6BB3]' },
    },
  };
  const companyRisk = riskByCompany[query] ?? riskDefaults;

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

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#FAF9FE] flex items-center justify-center text-sm text-[#7E6BB3]">
        Loading safety analysis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FE] text-[#2B2740] font-poppins antialiased">
      
      {/* Brand Navigation Bar */}
      <header className="bg-white border-b border-[#EDE7FB] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-[#7E6BB3] tracking-tight">
            <span>Wondlo</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-[#2B2740]">
              <Link href="/" className="hover:text-[#C7B5F5] transition-colors">HOME</Link>
              <Link href="/community" className="hover:text-[#C7B5F5] transition-colors">COMMUNITY</Link>
            </nav>

<button 
              onClick={() => router.push('/')}
              className="bg-[#C7B5F5] hover:opacity-90 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-[#C7B5F5]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Analyse Another Adventure</span>
              <span className="text-sm text-[#3D8A1E]">→</span>
            </button>

            <div className="relative w-9 h-9 rounded-xl bg-[#7E6BB3] border border-[#7E6BB3] flex items-center justify-center text-white shadow-2xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#3D8A1E] ring-2 ring-white"></span>
            </div>
          </div>
        </div>

        {/* Sub-Bar inside navbar */}
        <div className="max-w-7xl mx-auto px-6 pt-4 pb-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="text-xs font-semibold text-[#C7B5F5] hover:underline flex items-center gap-2 cursor-pointer"
          >
            <span className="text-[#3D8A1E] text-base font-extrabold leading-none">←</span> Back to Search
          </button>

          <div className="flex items-center gap-4 text-xs font-normal text-[#2B2740]">
            <span>Assessment Version: v1.1</span>
            <span>•</span>
            <span>Generated: {generatedDate}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-3">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-2xl text-[#2B2740] tracking-tight">
                    {query}
                  </h1>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M12 1.5 15.06 4.61 19.43 4.58 19.39 8.94 22.5 12 19.39 15.06 19.43 19.43 15.06 19.39 12 22.5 8.94 19.39 4.58 19.43 4.61 15.06 1.5 12 4.61 8.94 4.58 4.58 8.94 4.61 12 1.5Z" />
                    <path d="M7.8 12.4l2.8 2.8 5.6-5.9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
                  <svg className="w-14 h-14" viewBox="0 0 24 24">
                    <path fill="#2B2740" d="M12 2.5 22.5 20H1.5Z" />
                    <path fill="#fff" d="M12 2.5l2 4H10Z" />
                    <path fill="#2B2740" d="M3.5 11 8.5 20H-1.5Z" />
                    <path fill="#fff" d="M3.5 11l1.2 3H2.3Z" />
                    <path fill="#2B2740" d="M18 7.5 24 20H13.5Z" />
                    <path fill="#fff" d="M18 7.5l1.5 4h-3Z" />
                  </svg>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[#2B2740]">
                    <svg className="w-4 h-4 text-[#2B2740]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    Nepal
                  </span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#2B2740]">
                    <svg className="w-5 h-5 text-[#2B2740]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M5 20 19 4" />
                      <circle cx="11.5" cy="4.2" r="2" fill="currentColor" stroke="none" />
                      <rect x="5.2" y="6.8" width="2.8" height="4" rx="0.9" />
                      <path d="M11.6 6.9 10 15.5" />
                      <path d="M11 9.7 15.2 8.4" />
                      <circle cx="15.2" cy="8.2" r="0.9" fill="currentColor" stroke="none" />
                      <path d="M10 15.5 7.2 20.4M7.2 20.4 6 20" />
                      <path d="M12.6 15.7 15.4 18.8 14.2 20" />
                    </svg>
                    Adventure Trekking, Climbing
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#F6F4FE]">
                <span className="bg-[#FAF9FE] px-5 py-3 rounded-2xl border border-[#EDE7FB] flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2B2740]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4.5" width="18" height="16" rx="2.25" />
                    <path strokeLinecap="round" d="M3 9h18" />
                    <path strokeLinecap="round" d="M6.75 3v2.25M17.25 3v2.25" />
                    <text x="12" y="19" textAnchor="middle" fill="currentColor" stroke="none" fontSize="7" fontWeight="bold">{today.getDate()}</text>
                  </svg>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[#2B2740]">Report Generated:</span>
                    <strong className="text-[#2B2740]">{generatedDate}</strong>
                  </span>
                </span>
                <span className="bg-[#FAF9FE] px-5 py-3 rounded-2xl border border-[#EDE7FB] flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#2B2740]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[#2B2740]">Data Covered Up To:</span>
                    <strong className="text-[#2B2740]">{coveredUpToDate}</strong>
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-36 h-24 rounded-2xl relative overflow-hidden border border-[#C7B5F5]/40 shadow-2xs flex-shrink-0">
                <Image
                  src="/images/hiking.jpg"
                  alt="Expedition Base"
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>
              <div className="w-36 h-24 rounded-2xl relative overflow-hidden border border-[#C7B5F5]/40 shadow-2xs flex-shrink-0">
                <Image
                  src="/images/snowboarding.jpg"
                  alt="Summit Ridge"
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scores Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#2B2740]">Overall Safety Score</span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[9px] font-bold leading-none">i</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-extrabold text-[#2B2740]">
                85 <span className="text-4xl font-extrabold text-[#2B2740]">/ 100</span>
              </div>
              <span className="bg-[#EDE7FB] text-[#7E6BB3] border border-[#C7B5F5]/50 font-semibold text-xs px-3.5 py-1.5 rounded-full">
                Low Risk
              </span>
            </div>
            <div className="w-full bg-[#EDE7FB] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#7E6BB3] h-full rounded-full w-[85%]"></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#2B2740]">Confidence</span>
              <span className="w-5 h-5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[11px] font-bold leading-none">i</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#EDE7FB] border border-[#C7B5F5]/50 flex items-center justify-center text-[#7E6BB3]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-4xl font-extrabold text-[#2B2740]">
                90%
              </div>
            </div>
            <p className="text-xs text-[#2B2740]">
              This operator satisfies our trained model&apos;s 7 required dimensions for safety.
            </p>
          </div>
        </div>

        {/* Safety Summary */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-[#2B2740]">Safety Summary</h2>
            <span className="text-[#2B2740] text-xs">✦</span>
          </div>
          <p className="text-xs leading-relaxed font-medium text-[#2B2740]">
            {query} demonstrates strong safety practices overall. Guides are well-qualified and emergency protocols are in place. We found no major incidents in the past 3 years. Some traveller feedback mention equipment maintenance inconsistencies on certain trips.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {[
              { label: 'Quality of Experience', type: 'success' },
              { label: 'Incident History', type: 'success' },
              { label: 'Safety Sentiment', type: 'success' },
              { label: 'Quality of Regulation', type: 'success' },
              { label: 'Business Information', type: 'success' },
              { label: 'Equipment Assessment', type: 'warning' },
              { label: 'Risk Assessment', type: 'warning' },
            ].map((badge, idx) => (
              <span
                key={idx}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
                  badge.type === 'warning'
                    ? 'bg-orange-100 border-orange-200 text-red-600'
                    : 'bg-[#EDE7FB] border-[#C7B5F5]/50 text-[#7E6BB3]'
                }`}
              >
                {badge.type === 'warning' ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-[#3D8A1E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                    <path d="M11 13l4 4 6-7" transform="translate(-6 -2)" />
                  </svg>
                )}
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-[#2B2740]">Risk Breakdown</h2>
              <span className="w-3.5 h-3.5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[9px] font-bold leading-none">i</span>
            </div>
            <span className="text-xs font-semibold text-[#C7B5F5] hover:underline cursor-pointer flex items-center gap-1.5">View full breakdown <span className="text-[#3D8A1E] text-sm font-extrabold leading-none">→</span></span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Quality of Experience', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>, score: '90 / 100', width: '90%', color: 'bg-[#7E6BB3]' },
              { label: 'Quality of Regulation', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>, score: '78 / 100', width: '78%', color: 'bg-[#7E6BB3]' },
              { label: 'Incident History', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, score: '85 / 100', width: '85%', color: 'bg-[#7E6BB3]' },
              { label: 'Business Information', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>, score: '80 / 100', width: '80%', color: 'bg-[#7E6BB3]' },
              { label: 'Risk Assessment', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>, score: '70 / 100', width: '70%', color: 'bg-[#FBC02D]' },
              { label: 'Equipment Assessment', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>, score: '65 / 100', width: '65%', color: 'bg-[#FBC02D]' },
              { label: 'Safety Sentiment', icon: <svg className="w-4 h-4 text-[#7E6BB3] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>, score: '77 / 100', width: '77%', color: 'bg-[#7E6BB3]' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                {item.icon}
                <span className="w-40 flex-shrink-0 font-medium text-[#2B2740]">{item.label}</span>
                <div className="flex-1 min-w-10 bg-[#EDE7FB] h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }}></div>
                </div>
                <span className="w-36 flex-shrink-0 flex items-center gap-2">
                  <span className="font-semibold text-[#2B2740]">{item.score}</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[9px] font-bold leading-none">i</span>
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#9AA0A6] pt-2 flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[9px] font-bold leading-none">i</span>
            Hover over a category to see what it includes
          </p>
        </div>{/* Incident Timeline */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm text-[#2B2740]">Incident Timeline</h2>
              <span className="w-3.5 h-3.5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[9px] font-bold leading-none">i</span>
            </div>
            <span className="text-xs font-semibold text-[#C7B5F5] hover:underline cursor-pointer flex items-center gap-1.5">View full breakdown <span className="text-[#3D8A1E] text-sm font-extrabold leading-none">→</span></span>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#EDE7FB]">
            <div className="relative">
              <span className="absolute -left-6 top-0 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#7E6BB3"><path d="M12 2 4 5v6c0 5.25 3.4 9.74 8 11 4.6-1.26 8-5.75 8-11V5l-8-3z" /></svg>
              </span>
              <div className="grid grid-cols-[110px_1fr_auto] sm:grid-cols-[150px_1fr_auto] gap-6">
                <div className="flex flex-col">
                  <strong className="text-[11px] text-[#2B2740]">Apr 12, 2025</strong>
                  <span className="text-[10px] text-emerald-700">Minor</span>
                </div>
                <div className="border-l border-[#EDE7FB] pl-5 space-y-1">
                  <h4 className="font-semibold text-xs text-[#2B2740]">Mild altitude sickness reported</h4>
                  <p className="text-xs text-[#2B2740]">Trekking group experienced mild altitude sickness. Managed on site, no evacuation required.</p>
                </div>
                <span className="text-[10px] text-[#2B2740]/80 whitespace-nowrap pt-0.5">Source: Instagram</span>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-0 flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                </span>
              </span>
              <div className="grid grid-cols-[110px_1fr_auto] sm:grid-cols-[150px_1fr_auto] gap-6">
                <div className="flex flex-col">
                  <strong className="text-[11px] text-[#2B2740]">Oct 3, 2023</strong>
                  <span className="text-[10px] text-gray-500">None</span>
                </div>
                <div className="border-l border-[#EDE7FB] pl-5 space-y-1">
                  <h4 className="font-semibold text-xs text-[#2B2740]">No incidents reported</h4>
                  <p className="text-xs text-[#2B2740]">No safety incidents found during this period.</p>
                </div>
                <span className="text-[10px] text-[#2B2740]/80 whitespace-nowrap pt-0.5">Source: Company Website</span>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -left-6 top-0 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              </span>
              <div className="grid grid-cols-[110px_1fr_auto] sm:grid-cols-[150px_1fr_auto] gap-6">
                <div className="flex flex-col">
                  <strong className="text-[11px] text-[#2B2740]">May 21, 2021</strong>
                  <span className="text-[10px] text-amber-500">Moderate</span>
                </div>
                <div className="border-l border-[#EDE7FB] pl-5 space-y-1">
                  <h4 className="font-semibold text-xs text-[#2B2740]">Rescue delayed due to weather</h4>
                  <p className="text-xs text-[#2B2740]">Bad weather delayed rescue response by approximately 2 hours. No injuries were reported.</p>
                </div>
                <span className="text-[10px] text-[#2B2740]/80 whitespace-nowrap pt-0.5">Source: News Article</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-2">
          <h2 className="font-semibold text-sm text-[#2B2740]">Assessment</h2>
          <p className="text-sm text-[#2B2740]/90">
            The operator satisfies our safety framework for (trip-type) safety.
          </p>
        </div>

        {/* Recommended Documents To Request */}
        <div className="bg-white rounded-2xl border border-[#EDE7FB] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm text-[#2B2740]">Recommended Documents To Request</h2>
            <span className="w-3.5 h-3.5 rounded-full bg-[#9AA0A6] text-white flex items-center justify-center text-[9px] font-bold leading-none">i</span>
          </div>
          <p className="text-sm text-[#2B2740]/90">
            Requesting these documents can help verify the operator&apos;s safety practices.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 pt-5 md:gap-0 md:divide-x md:divide-[#EDE7FB] md:border-x md:border-[#EDE7FB]">
            {[
              { 
                title: 'Safety Plan', 
                icon: (
                  <svg className="w-9 h-9 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              { 
                title: 'Equipment Inspection Records', 
                icon: (
                  <svg className="w-9 h-9 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                )
              },
              { 
                title: 'Emergency Response Plan', 
                icon: (
                  <svg className="w-9 h-9 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              { 
                title: 'Insurance', 
                icon: (
                  <svg className="w-9 h-9 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              { 
                title: 'Permits & Authorisations', 
                icon: (
                  <svg className="w-9 h-9 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
            ].map((doc, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center gap-3 py-2 cursor-pointer">
                {doc.icon}
                <span className="font-poppins text-[11px] font-semibold text-[#2B2740] leading-snug">
                  {doc.title.split(' ').map((word, wi) => (
                    <span key={wi} className="block">{word}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Footer Card */}
        <div className="bg-[#7E6BB3]/80 rounded-2xl p-6 text-white space-y-6">
          <h2 className="font-bold text-base tracking-tight">Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            <button className="bg-white hover:bg-white/90 border border-white/20 text-[#2B2740] font-poppins font-semibold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
              <svg className="w-4 h-4 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="m8 2 1.88 1.88" />
                <path d="M14.12 3.88 16 2" />
                <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
                <path d="M12 20v-9" />
                <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
                <path d="M6 13H2" />
                <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
                <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
                <path d="M22 13h-4" />
                <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
              </svg>
              REPORT A BUG
            </button>
            <button className="bg-white hover:bg-white/90 border border-white/20 text-[#2B2740] font-poppins font-semibold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
              <svg className="w-4 h-4 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
              REQUEST A FEATURE
            </button>
            <button className="bg-white hover:bg-white/90 border border-white/20 text-[#2B2740] font-poppins font-semibold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
              <span className="w-4 h-4 rounded-full bg-white border border-[#7E6BB3] text-[#7E6BB3] flex items-center justify-center text-[10px] font-bold leading-none">?</span>
              REQUEST SAFETY HELP
            </button>
            <button className="bg-white hover:bg-white/90 border border-white/20 text-[#2B2740] font-poppins font-semibold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
              <svg className="w-4 h-4 text-[#7E6BB3]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                <text x="12" y="16.8" fontSize="6.5" textAnchor="middle" fill="currentColor" fontWeight="bold" stroke="none">PDF</text>
              </svg>
              DOWNLOAD RECOMMENDED QUESTIONS
            </button>
          </div>
          <div className="text-[11px] text-[#EDE7FB] pt-4 border-t border-white/15">
            <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
              <p className="font-inter text-left">
                AI-assisted safety assessments based on publicly
                <br />
                available information. Should support—not replace—
                <br />
                official travel advisories.
              </p>
              <div className="text-center">
                <p className="font-inter text-[12px] font-semibold text-white/90">Safety as a System™</p>
                <p className="font-inter text-[11px] font-medium text-white/70">Copyright © 2026 Wondlo. All rights reserved.</p>
              </div>
              <span className="hidden sm:block"></span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9FE] flex items-center justify-center text-sm text-[#7E6BB3]">Loading safety analysis...</div>}>
      <ResultsContent />
    </Suspense>
  );
}