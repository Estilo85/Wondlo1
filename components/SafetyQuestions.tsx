'use client';

const questionPairs = [
  {
    leftIcon: (
      <svg className="w-4 h-4 text-[#D9534F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    standard: "How many reviews does it have?",
    rightIcon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2h-2z" />
        <path d="M12 11v6" />
        <path d="M9 14h6" />
      </svg>
    ),
    safety: "What happens if someone gets injured?",
  },
  {
    leftIcon: (
      <svg className="w-4 h-4 text-[#D9534F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
    standard: "Is it worth the price?",
    rightIcon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h20" />
        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
        <path d="m7 21 5-5 5 5" />
      </svg>
    ),
    safety: "Is there a safety briefing before the activity?",
  },
  {
    leftIcon: (
      <svg className="w-4 h-4 text-[#D9534F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
    standard: "Is pickup included?",
    rightIcon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    safety: "How is the equipment inspected and monitored?",
  },
  {
    leftIcon: (
      <svg className="w-4 h-4 text-[#D9534F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    standard: "How many photos will I get?",
    rightIcon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
    safety: "What emergency support is available?",
  },
  {
    leftIcon: (
      <svg className="w-4 h-4 text-[#D9534F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    standard: "Is it popular on Instagram?",
    rightIcon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    safety: "Are there limits on group size, permits, or route access?",
  },
];

export default function SafetyQuestions() {
  return (
    <section className="w-full bg-[#FAF9FE] rounded-3xl p-6 sm:p-10 border border-[#EDE7FB] shadow-[0_12px_30px_-8px_rgba(43,39,64,0.05)]">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-poppins font-bold text-xl sm:text-3xl text-[#2B2740]">
          Adventure planning{' '}
          <span className="relative inline-block border-b-2 border-[#7E6BB3] pb-0.5">
            does not stop
          </span>{' '}
          at desire.
        </h2>
        <p className="font-poppins font-semibold text-sm sm:text-lg text-[#7E6BB3] mt-2">
          Before you book, ask better safety questions
        </p>
      </div>

      {/* Side-by-side Row */}
      <div className="max-w-4xl mx-auto space-y-3">
        {questionPairs.map((pair, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
            {/* Left Question Card */}
            <div className="bg-[#FFF2EE] border border-[#FFE2D8] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center space-x-2 sm:space-x-3 text-[#D9534F] min-h-[52px] shadow-[0_4px_12px_rgba(217,83,79,0.04)]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/80 flex items-center justify-center shrink-0">
                {pair.leftIcon}
              </div>
              <span className="font-poppins font-semibold text-[11px] sm:text-sm leading-tight">
                {pair.standard}
              </span>
            </div>

            {/* Center VS Badge */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EDE7FB] text-[#7E6BB3] font-poppins font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs">
              VS
            </div>

            {/* Right Question Card */}
            <div className="bg-[#F6F4FE] border border-[#EDE7FB] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center space-x-2 sm:space-x-3 text-[#2B2740] min-h-[52px] shadow-[0_4px_12px_rgba(43,39,64,0.03)]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#EDE7FB] flex items-center justify-center shrink-0">
                {pair.rightIcon}
              </div>
              <span className="font-poppins font-semibold text-[11px] sm:text-sm leading-tight text-[#2B2740]">
                {pair.safety}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}