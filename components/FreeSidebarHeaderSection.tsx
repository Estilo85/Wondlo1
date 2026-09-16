'use client';

export default function FreeSidebarHeaderSection({
  userName = 'BRYCE',
  freeSearchesLeft = 2,
  onViewPreviousSearches,
  onUpgrade,
}: {
  userName?: string;
  freeSearchesLeft?: number;
  onViewPreviousSearches?: () => void;
  onUpgrade?: () => void;
}) {
  const firstName = userName.trim().split(/\s+/)[0] || userName;

  return (
    <div className="w-full max-w-[420px] bg-[#D7CCF8] p-6 space-y-4 font-poppins">

      {/* 1. HELLO, BRYCE! Card */}
      <div className="bg-white border border-[#BFAFF6] rounded-2xl p-5 flex items-center justify-between gap-3 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight uppercase text-[#2B2740]">
          <span className="text-[#BFAFF6]">HELLO, </span>
          <span className="text-[#6B52A1]">{firstName}</span>
          <span className="text-[#6B52A1]">!</span>
        </h1>

        {/* Icon */}
        <svg
          className="w-8 h-8 text-[#7C63BD]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer Rectangle Box */}
          <rect x="3" y="4" width="18" height="16" rx="2" />

          {/* Vertical Divider Line */}
          <line x1="12" y1="4" x2="12" y2="20" />

          {/* Left Side List Dots and Lines */}
          <circle cx="6.5" cy="8" r="0.75" fill="currentColor" />
          <line x1="9" y1="8" x2="10" y2="8" />

          <circle cx="6.5" cy="12" r="0.75" fill="currentColor" />
          <line x1="9" y1="12" x2="10" y2="12" />

          <circle cx="6.5" cy="16" r="0.75" fill="currentColor" />
          <line x1="9" y1="16" x2="10" y2="16" />

          {/* Right Side Chevron Arrow pointing Left */}
          <polyline points="16,9 13.5,12 16,15" />
        </svg>
      </div>

      {/* 2. View Previous Searches Card */}
      <div
        onClick={onViewPreviousSearches}
        className="bg-white border border-[#BFAFF6] rounded-2xl p-5 flex items-center justify-between shadow-xs cursor-pointer hover:bg-[#F9F7FF] transition-all"
      >
        <span className="text-base font-bold text-[#2B2740]">View Previous Searches</span>
      </div>

      {/* 3. Free Searches Left Card */}
      <div className="bg-white border border-[#BFAFF6] rounded-2xl p-5 flex items-center justify-between shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-[#2B2740]">
            {freeSearchesLeft} Free Searches Left
          </h2>
          <p className="text-[11px] font-bold tracking-wider text-[#00897B] uppercase">
            VALID ONLY FOR 30 DAYS
          </p>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-[#EBE2FE] hover:bg-[#D7CCF8] border border-[#A28BEE] text-[#A28BEE] font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-2xs tracking-wider"
        >
          UPGRADE
        </button>
      </div>

    </div>
  );
}