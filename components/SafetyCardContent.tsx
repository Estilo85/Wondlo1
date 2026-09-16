'use client';

export type SafetyCardData = {
  score: number;
  status: string;
  provider: string;
  details: { label: string; value: string }[];
  isExample?: boolean;
};

export default function SafetyCardContent({
  card,
  activeCardIndex = 0,
  desktop = false,
  empty = false,
}: {
  card: SafetyCardData;
  activeCardIndex?: number;
  desktop?: boolean;
  empty?: boolean;
}) {
  const statusColor = card.score === 25 ? '#D94A4A' : card.score === 50 ? '#f2ea01' : '#806DB6';

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 flex-shrink-0 text-[#806DB6]" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L19 6V11C19 15.55 16.01 19.74 12 21C7.99 19.74 5 15.55 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.8 12L11 14.2L15.5 9.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#29243F]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: desktop ? '15px' : '16px', fontWeight: 600, lineHeight: 1.2 }}>
            Safety Card
          </span>
        </div>
        {card.isExample && <span className="rounded-full bg-[#F1EDF8] px-2 py-1 text-[#806DB6]" style={{ fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600, lineHeight: 1 }}>EXAMPLE</span>}
      </div>

      <div className={`rounded-[9px] bg-[#ECE5FB] px-4 py-3.5 ${empty ? 'min-h-[147px]' : ''}`}>
        <p className="text-[#806DB6]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Safety Score</p>
        {!empty && <div className="mt-1 flex items-end justify-between">
          <div className="flex items-baseline">
            <span className="text-[#29243F]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: desktop ? '58px' : '50px', fontWeight: 600, lineHeight: 0.9, letterSpacing: '-1.5px' }}>{card.score}</span>
            <span className="ml-1 text-[#29243F]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: desktop ? '17px' : '16px', fontWeight: 500, lineHeight: 1 }}>/100</span>
          </div>
          <span className="pb-1" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 500, lineHeight: 1, color: statusColor }}>{card.status}</span>
        </div>}
        {!empty && <div className="mt-3">
          <span className="inline-flex max-w-full rounded-full border border-[#D9D0E8] bg-white/70 px-3 py-1.5 text-[#625C70]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: desktop ? '12px' : '13px', fontWeight: 600, lineHeight: 1.2 }}>
            <span className="truncate">{card.provider}</span>
          </span>
        </div>}
        {!empty && <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-[#D3CEDA]">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(Math.max(card.score, 0), 100)}%`, backgroundColor: statusColor }} />
        </div>}
      </div>

      <div className="mt-4 space-y-3.5">
        {card.details.map((detail, index) => (
          <div key={`${activeCardIndex}-${detail.label}-${index}`} className="relative flex gap-2">
            <div className="relative flex h-[22px] w-[22px] flex-shrink-0 items-start justify-center">
              <div className="relative z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#F1EDF8]">
                <svg className="h-[15px] w-[15px] text-[#806DB6]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L19 6V11C19 15.55 16.01 19.74 12 21C7.99 19.74 5 15.55 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.8 12L11 14.2L15.5 9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {index < card.details.length - 1 && <span className="absolute left-1/2 top-[20px] h-[calc(100%+14px)] w-px -translate-x-1/2 bg-[#D1C9E1]" />}
            </div>
            <div className="min-w-0 pt-[1px]">
              <p className="text-[#29243F]" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600, lineHeight: 1.25 }}>{detail.label}</p>
              <p className="mt-[3px] break-words" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600, lineHeight: 1.3, color: statusColor }}>{detail.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}