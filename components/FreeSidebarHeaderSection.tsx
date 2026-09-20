'use client';

import SidebarToggleButton from '@/components/SidebarToggleButton';

export default function FreeSidebarHeaderSection({
  userName = '',
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
  const firstName = userName.trim().split(/\s+/)[0] || '';

  return (
    <div
      className="w-[342px] h-[235px] p-[6px] font-poppins"
      style={{
        background: 'rgba(199, 181, 245, 0.75)',
        borderBottom: '1px solid #2B2740',
      }}
    >
      <div className="w-full space-y-2">
        {/* ============================================================
            HEADER / HELLO USER
        ============================================================ */}
        <div
          className="w-[330px] h-[70px] px-5 rounded-xl flex items-center justify-between gap-4"
          style={{
            background: '#F6F4FE',
            boxShadow: '0 6px 18px rgba(43, 39, 64, 0.15)',
          }}
        >
          <h1
            className="text-[22px] leading-[25px] font-bold tracking-tight uppercase"
            style={{
              background:
                'linear-gradient(90deg, #C7B5F5 50%, #2B2740 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HELLO, {firstName}!
          </h1>

          {onClose && (
            <SidebarToggleButton
              isOpen
              onClick={onClose}
            />
          )}
        </div>

        {/* ============================================================
            PREVIOUS SEARCHES
        ============================================================ */}
        <button
          type="button"
          onClick={onViewPreviousSearches}
          className="w-[330px] h-[55px] px-5 rounded-xl flex items-center text-left transition-all duration-200 hover:shadow-sm cursor-pointer"
          style={{
            background: '#F6F4FE',
          }}
        >
          <span className="text-[14px] leading-[18px] font-semibold text-[#000000]">
            View Previous Searches
          </span>
        </button>

        {/* ============================================================
            SUBSCRIPTION AREA
        ============================================================ */}
        <div
          className="w-[330px] h-[55px] px-5 rounded-xl flex items-center justify-between gap-4"
          style={{
            background: '#F6F4FE',
          }}
        >
          <div className="flex flex-col justify-center min-w-0">
            <h2 className="text-[14px] leading-[17px] font-semibold text-[#000000] whitespace-nowrap">
              {freeSearchesLeft} Free Searches Left
            </h2>

            <p className="mt-0.5 text-[10px] leading-[12px] font-semibold tracking-wide text-[#196469] uppercase whitespace-nowrap">
              VALID ONLY FOR 30 DAYS
            </p>
          </div>

          <button
            type="button"
            onClick={onUpgrade}
            className="w-[97px] h-[28px] flex-shrink-0 rounded-md flex items-center justify-center transition-all duration-200 hover:bg-white hover:-translate-y-0.5 cursor-pointer"
            style={{
              background: 'rgba(199, 181, 245, 0.75)',
              border: '0.5px solid #196469',
              boxShadow: '0 3px 8px rgba(43, 39, 64, 0.10)',
            }}
          >
            <span className="text-[14px] leading-[18px] font-semibold text-[#2B2740]/75">
              UPGRADE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}