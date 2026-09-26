'use client';

import SidebarToggleButton from '@/components/SidebarToggleButton';

export default function PaidSidebarHeaderSection({
  userName = '',
  paidSearchesLeft = 7,
  onViewPreviousSearches,
  onViewBilling,
  onGetStarted,
  onGet,
  onClose,
}: {
  userName?: string;
  paidSearchesLeft?: number;
  onViewPreviousSearches?: () => void;
  onViewBilling?: () => void;
  onGetStarted?: () => void;
  onGet?: () => void;
  onClose?: () => void;
}) {
  const firstName = userName.trim().split(/\s+/)[0] || '';
  const searchesLeft = Math.max(0, paidSearchesLeft);
  const actionButtonStyle = {
    background: 'rgba(126, 107, 179, 0.90)',
    border: '0.5px solid #FFFFFF',
    boxShadow: '0 6px 16px rgba(43, 39, 64, 0.10)',
  };

  return (
    <div
      className="w-[342px] h-[400px] p-[6px] font-poppins"
      style={{
        background: 'rgba(126, 107, 179, 0.90)',
        borderBottom: '1px solid #2B2740',
      }}
    >
      <div className="w-full space-y-2">
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
              background: 'linear-gradient(90deg, #2B2740 50%, #C7B5F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HELLO, {firstName}!
          </h1>

          {onClose && <SidebarToggleButton isOpen onClick={onClose} />}
        </div>

        <button
          type="button"
          onClick={onViewPreviousSearches}
          className="w-[330px] h-[55px] px-5 rounded-xl flex items-center text-left transition-all duration-200 hover:shadow-sm cursor-pointer"
          style={{ background: '#F6F4FE' }}
        >
          <span className="text-[14px] leading-[18px] font-semibold text-[#2B2740]">
            View Previous Searches
          </span>
        </button>

        <button
          type="button"
          onClick={onViewBilling}
          className="w-[330px] h-[55px] px-5 rounded-xl flex items-center text-left transition-all duration-200 hover:shadow-sm cursor-pointer"
          style={{ background: '#F6F4FE' }}
        >
          <span className="text-[14px] leading-[18px] font-semibold text-[#2B2740]">
            {searchesLeft} Searches Left
          </span>
        </button>

        {[
          ['Adventure Preparedness', 'Get Started', onGetStarted],
          ['Safety Digest', 'Get', onGet],
        ].map(([label, actionLabel, onClick]) => (
          <div
            key={label as string}
            className="w-[330px] h-[55px] rounded-xl grid grid-cols-[minmax(0,1fr)_107px] items-center gap-4 px-5"
            style={{ background: '#F6F4FE' }}
          >
            <span className="text-[14px] leading-[18px] font-semibold text-[#2B2740]">
              {label as string}
            </span>
            <button
              type="button"
              onClick={onClick as (() => void) | undefined}
              className="w-[107px] h-[28px] rounded-[10px] flex items-center justify-center transition-all duration-200 hover:bg-white hover:-translate-y-0.5 cursor-pointer"
              style={actionButtonStyle}
            >
              <span className="text-[15px] leading-[19px] font-medium text-white">
                {actionLabel as string}
              </span>
            </button>
          </div>
        ))}

        <div
          className="w-[330px] h-[55px] rounded-xl grid grid-cols-[minmax(0,1fr)_107px] items-center gap-4 px-5"
          style={{ background: '#F6F4FE' }}
        >
          <span className="text-[14px] leading-[18px] font-semibold text-[#2B2740] whitespace-nowrap">
            Need More Than a Report?
          </span>
          <button
            type="button"
            onClick={() =>
              window.open(
                'https://calendly.com/wondlo-operatorchatdiagnosis/30min',
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="w-[107px] h-[28px] rounded-[10px] flex items-center justify-center gap-1.5 transition-all duration-200 hover:bg-white hover:-translate-y-0.5 cursor-pointer"
            style={actionButtonStyle}
          >
            <svg
              className="w-[16px] h-[16px] flex-shrink-0 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 9h18" />
            </svg>
            <span className="text-[15px] leading-[19px] font-medium text-white">
              Book
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}