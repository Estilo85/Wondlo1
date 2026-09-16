'use client';

export default function SafetyCardStateSection() {
  return (
    <div className="w-full max-w-[420px] bg-white border border-[#D5C3F9] rounded-[24px] p-5 space-y-4 font-poppins shadow-xs">

      {/* 1. Safety Card Header with Shield Icon */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-6 h-6 rounded-md border border-[#C5B0F6] bg-[#EBE2FE] flex items-center justify-center text-[#7C63BD]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-[#2B2740] tracking-tight">Safety Card</h2>
      </div>

      {/* 2. Safety Score Placeholder Box */}
      <div className="bg-[#EBE2FE] border border-[#D5C3F9] rounded-[20px] p-5 h-28 shadow-2xs">
        <span className="text-[11px] font-bold text-[#7C63BD] uppercase tracking-wider block">
          SAFETY SCORE
        </span>
      </div>

      {/* 3. Checklist Container with Connected Vertical Line & Solid White Shield Boxes */}
      <div className="bg-[#EBE2FE] border border-[#D5C3F9] rounded-[20px] p-4 relative space-y-3 shadow-2xs">

        {/* Vertical Connecting Line spanning behind the shield icons */}
        <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-[#C5B0F6] z-0" />

        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="bg-white border border-[#D5C3F9] rounded-[16px] h-12 flex items-center px-3 relative z-10 shadow-2xs"
          >
            {/* Small Shield Icon Box */}
            <div className="w-6 h-6 rounded-md border border-[#C5B0F6] bg-[#EBE2FE] flex items-center justify-center text-[#7C63BD] flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}