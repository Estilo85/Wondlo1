'use client';

import SidebarToggleButton from '@/components/SidebarToggleButton';

export default function FreeSidebarHeaderSection({
  userName = 'BRYCE',
  freeSearchesLeft = 2,
  onViewPreviousSearches,
  onUpgrade,
  onClose,
}: {
  userName?: string;
  freeSearchesLeft?: number;
  onViewPreviousSearches?: () => void;
  onUpgrade?: () => void;
  onClose?: () => void;
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

        {onClose && <SidebarToggleButton isOpen onClick={onClose} />}
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