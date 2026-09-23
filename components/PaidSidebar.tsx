'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

import PaidSidebarHeaderSection from '@/components/PaidSidebarHeaderSection';
import PaidSidebarSafetyCardSection from '@/components/PaidSidebarSafetyCardSection';
import SafetyCardStateSection from '@/components/SafetyCardStateSection';

interface SavedAnalysis {
  operatorName: string;
  overallSafetyScore: number;
  riskLevel: string;
  incidents: { date: string; title: string }[];
}

interface PaidSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  paidSearchesLeft?: number;
  previousSearches?: string[];
  onSelectSearch?: (query: string) => void;
  onGetStarted?: () => void;
  onGet?: () => void;
  onBook?: () => void;
  onConsumeSearch?: () => void;
  onSignOut?: () => void;
  savedAnalyses?: SavedAnalysis[];
}

export default function PaidSidebar({
  isOpen,
  onClose,
  userName,
  paidSearchesLeft = 7,
  previousSearches = [
    'Summit Trails Expeditions',
    'El Nido Island Hopping',
    'Rinjani Summit Trek',
  ],
  onSelectSearch,
  onGetStarted,
  onGet,
  onBook,
  onSignOut,
  savedAnalyses = [],
}: PaidSidebarProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [authenticatedUserName, setAuthenticatedUserName] = useState('');

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setAuthenticatedUserName('');
        return;
      }

      const displayName = firebaseUser.displayName?.trim();

      if (displayName) {
        setAuthenticatedUserName(displayName);
        return;
      }

      const email = firebaseUser.email?.trim();

      if (email) {
        const emailUsername = email.split('@')[0]?.trim();

        if (emailUsername) {
          setAuthenticatedUserName(emailUsername);
          return;
        }
      }

      setAuthenticatedUserName('');
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const resolvedUserName =
    authenticatedUserName.trim() || userName?.trim() || '';
  const resolvedPaidSearchesLeft = Math.max(0, Math.min(7, paidSearchesLeft));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <aside
        className="relative z-10 w-[342px] min-w-[342px] max-w-[342px] h-full flex flex-col font-poppins text-[#2B2740] overflow-hidden animate-in slide-in-from-right duration-300"
        style={{
          background: '#F6F4FE',
          borderLeft: '1px solid rgba(43, 39, 64, 0.12)',
          boxShadow: '-10px 0 35px rgba(43, 39, 64, 0.12)',
        }}
      >
        <div
          className="w-[342px] flex-shrink-0"
          style={{
            background: 'rgba(126, 107, 179, 0.90)',
            borderBottom: '1px solid #2B2740',
          }}
        >
          <PaidSidebarHeaderSection
            userName={resolvedUserName}
            paidSearchesLeft={resolvedPaidSearchesLeft}
            onViewPreviousSearches={() => setShowHistory((value) => !value)}
            onGetStarted={onGetStarted}
            onGet={onGet}
            onBook={onBook}
            onClose={onClose}
          />

          {showHistory && (
            <div
              className="w-[342px] px-[6px] pt-3 pb-4"
              style={{ background: 'rgba(126, 107, 179, 0.90)' }}
            >
              <div className="w-[330px]">
                <span className="block mb-2 px-2 text-[12px] leading-[12px] font-semibold tracking-wide text-white/75 uppercase">
                  Recent History
                </span>

                <div className="space-y-2">
                  {previousSearches.map((item, idx) => (
                    <button
                      key={`${item}-${idx}`}
                      type="button"
                      onClick={() => {
                        onSelectSearch?.(item);
                        onClose();
                      }}
                      className="group w-[330px] min-h-[45px] px-4 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer hover:bg-white"
                      style={{
                        background: '#F6F4FE',
                        border: '0.5px solid rgba(43, 39, 64, 0.12)',
                      }}
                    >
                      <span className="truncate text-[13px] leading-[17px] font-semibold text-[#000000]">
                        {item}
                      </span>
                      <span className="ml-3 flex-shrink-0 text-[#7E6BB3] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className="relative flex-1 min-h-0 w-[342px] overflow-y-auto overflow-x-hidden"
          style={{
            background: '#F6F4FE',
            scrollbarColor: 'rgba(126, 107, 179, 0.90) transparent',
            scrollbarWidth: 'thin',
          }}
        >
          <div className="w-[342px] flex flex-col items-center gap-5 py-5">
            {savedAnalyses.slice(0, 7).map((savedAnalysis) => (
              <PaidSidebarSafetyCardSection
                key={savedAnalysis.operatorName}
                companyName={savedAnalysis.operatorName}
                score={savedAnalysis.overallSafetyScore}
                incidentHistory={savedAnalysis.incidents
                  .map((incident) => `${incident.date}: ${incident.title}`)
                  .join(' | ')}
              />
            ))}

            {Array.from({ length: Math.max(0, 7 - savedAnalyses.length) }).map(
              (_, index) => <SafetyCardStateSection key={index} />,
            )}
          </div>

          <style jsx>{`
            div::-webkit-scrollbar {
              width: 4px;
            }

            div::-webkit-scrollbar-track {
              background: transparent;
            }

            div::-webkit-scrollbar-thumb {
              background: rgba(126, 107, 179, 0.9);
              border-radius: 9999px;
            }

            div::-webkit-scrollbar-thumb:hover {
              background: rgba(126, 107, 179, 1);
            }
          `}</style>
        </div>

        <div
          className="w-[342px] min-h-[58px] flex-shrink-0 px-4 py-3 flex items-center justify-between gap-3"
          style={{
            background: '#F6F4FE',
            borderTop: '1px solid rgba(43, 39, 64, 0.10)',
          }}
        >
          <span className="text-[10px] leading-[13px] font-medium text-[#2B2740]/40">
            Wondlo Safety Intelligence
            <br />
            Paid Tier Access
          </span>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium text-[#2B2740] transition-all duration-200 cursor-pointer hover:bg-white hover:-translate-y-0.5"
              style={{
                background: 'rgba(126, 107, 179, 0.90)',
                border: '0.5px solid #FFFFFF',
                boxShadow: '0 3px 8px rgba(43, 39, 64, 0.10)',
              }}
            >
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-white">Sign out</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}