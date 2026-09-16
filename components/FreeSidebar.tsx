'use client';

import { useState } from 'react';
import FreeSidebarHeaderSection from '@/components/FreeSidebarHeaderSection';
import FreeSidebarSafetyCardSection from '@/components/FreeSidebarSafetyCardSection';
import SafetyCardStateSection from '@/components/SafetyCardStateSection';

interface FreeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  freeSearchesLeft?: number;
  previousSearches?: string[];
  onSelectSearch?: (query: string) => void;
  onUpgrade?: () => void;
  onSignOut?: () => void;
  companyName?: string;
  score?: number;
}

export default function FreeSidebar({
  isOpen,
  onClose,
  userName = 'BRYCE',
  freeSearchesLeft = 2,
  previousSearches = ['Summit Trails Expeditions', 'El Nido Island Hopping', 'Rinjani Summit Trek'],
  onSelectSearch,
  onUpgrade,
  onSignOut,
  companyName = 'Summit Trails Expeditions',
  score,
}: FreeSidebarProps) {
  const [showHistory, setShowHistory] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs transition-opacity">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sidebar Drawer Container */}
      <aside className="relative w-full max-w-[420px] bg-[#EBE2FE] border-l border-[#BFAFF6] shadow-2xl flex flex-col h-full font-poppins text-[#2B2740] animate-in slide-in-from-right duration-300 overflow-y-auto">

        {/* Header Section + Collapsible Recent History */}
        <div className="bg-[#D7CCF8] border-b border-[#BFAFF6]">
          <FreeSidebarHeaderSection
            userName={userName}
            freeSearchesLeft={freeSearchesLeft}
            onViewPreviousSearches={() => setShowHistory((v) => !v)}
            onUpgrade={onUpgrade}
          />

          {showHistory && (
            <div className="px-6 pb-6 space-y-2">
              <span className="block text-[11px] font-bold tracking-widest text-[#2B2740]/60 uppercase">
                Recent History
              </span>

              {previousSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectSearch?.(item);
                    onClose();
                  }}
                  className="w-full text-left bg-white border border-[#BFAFF6] hover:border-[#6B52A1] p-4 rounded-2xl text-sm font-semibold text-[#2B2740] flex items-center justify-between transition-all shadow-xs cursor-pointer group"
                >
                  <span className="truncate">{item}</span>
                  <span className="text-[#6B52A1] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Safety Cards */}
        <div className="p-6 space-y-6 bg-[#EBE2FE]">
          <FreeSidebarSafetyCardSection companyName={companyName} score={score} />
          {Array.from({ length: 2 }).map((_, i) => (
            <SafetyCardStateSection key={i} />
          ))}
        </div>

        {/* Footer / Bottom Action */}
        <div className="p-4 bg-white border-t border-[#BFAFF6] flex items-center justify-between gap-3 px-5">
          <span className="text-[10px] text-[#2B2740]/40">
            Wondlo Safety Intelligence • Free Tier Access
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="h-8 px-3 rounded-lg bg-[#EBE2FE] border border-[#A28BEE] text-[#6B52A1] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#D7CCF8] transition-all shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="w-8 h-8 rounded-lg bg-[#EBE2FE] border border-[#A28BEE] text-[#6B52A1] flex items-center justify-center cursor-pointer hover:bg-[#D7CCF8] transition-all shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

      </aside>
    </div>
  );
}