'use client';

const questionPairs = [
  {
    leftIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    standard: 'How many reviews does it have?',
    rightIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 2a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2h-2z" />
        <path d="M12 11v6" />
        <path d="M9 14h6" />
      </svg>
    ),
    safety: 'What happens if someone gets injured?',
  },
  {
    leftIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
    standard: 'Is it worth the price?',
    rightIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h20" />
        <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
        <path d="m7 21 5-5 5 5" />
      </svg>
    ),
    safety: 'Is there a safety briefing before the activity?',
  },
  {
    leftIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
    standard: 'Is pickup included?',
    rightIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    safety: 'How is the equipment inspected and monitored?',
  },
  {
    leftIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    standard: 'How many photos will I get?',
    rightIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
    safety: 'What emergency support is available?',
  },
  {
    leftIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    standard: 'Is it popular on Instagram?',
    rightIcon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    safety:
      'Are there limits on group size, permits, or route access?',
  },
];

export default function SafetyQuestions() {
  return (
    <section className="bg-[#FFFFFF] pt-[40px]">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* =====================================================
            MAIN CONTAINER
        ====================================================== */}
        <div
          className="w-full overflow-hidden rounded-[20px]"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >
          {/* =================================================
              HEADING AREA
          ================================================== */}
          <div className="flex flex-col items-center px-6 pb-[40px] pt-[50px] text-center md:px-10 md:pt-[55px]">
            <h2
              className="text-[#2B2740]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(20px, 2.1vw, 30px)',
                fontWeight: 700,
                lineHeight: '1.25',
              }}
            >
              Adventure planning does not stop at desire.
            </h2>

            {/* Gradient divider */}
            <div
              className="my-5 h-[2px] w-[100px] flex-shrink-0"
              style={{
                background:
                  'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
              }}
            />

            <p
              className="text-[#7E6BB3]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(16px, 2.1vw, 30px)',
                fontWeight: 700,
                lineHeight: '1.25',
              }}
            >
              Before you book, ask better safety questions
            </p>
          </div>

          {/* =================================================
              DESKTOP QUESTIONS
          ================================================== */}
          <div className="hidden md:block">
            {questionPairs.map((pair, index) => (
              <div
                key={index}
                className={`relative px-8 ${
                  index !== questionPairs.length - 1
                    ? 'pb-3'
                    : 'pb-[50px]'
                }`}
              >
                {/* =================================================
                    QUESTION ROW
                ================================================== */}
                <div className="relative flex items-stretch gap-[8px]">
                  {/* =================================================
                      LEFT / STANDARD QUESTION
                  ================================================== */}
                  <div
                    className="relative z-10 flex min-h-[90px] w-[calc(50%+26px)] items-center gap-5 rounded-[10px] px-7 pr-[55px]"
                    style={{
                      backgroundColor: 'rgba(255, 241, 232, 0.75)',
                    }}
                  >
                    <div
                      className="flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-[9px]"
                      style={{
                        backgroundColor: 'rgba(255, 226, 216, 0.90)',
                      }}
                    >
                      <div className="text-[rgba(197,81,20,0.75)]">
                        {pair.leftIcon}
                      </div>
                    </div>

                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '17px',
                        fontWeight: 500,
                        lineHeight: '1.35',
                        color: 'rgba(197, 81, 20, 0.75)',
                      }}
                    >
                      {pair.standard}
                    </span>
                  </div>

                  {/* =================================================
                      RIGHT / SAFETY QUESTION
                  ================================================== */}
                  <div
                    className="relative z-10 ml-[-8px] flex min-h-[90px] w-[calc(50%+26px)] items-center gap-5 rounded-[10px] pl-[55px] pr-7"
                    style={{
                      backgroundColor: '#EDE7FB',
                    }}
                  >
                    {/* Purple icon background */}
                    <div
                      className="flex h-[45px] w-[45px] flex-shrink-0 items-center justify-center rounded-[9px]"
                      style={{
                        background:
                          'linear-gradient(180deg, #F6F4FE 0%, #E2DBF7 100%)',
                      }}
                    >
                      <div className="text-[#7E6BB3]">
                        {pair.rightIcon}
                      </div>
                    </div>

                    <span
                      className="text-left"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '17px',
                        fontWeight: 500,
                        lineHeight: '1.35',
                        color: '#7E6BB3',
                      }}
                    >
                      {pair.safety}
                    </span>
                  </div>

                  {/* =================================================
                      VS BADGE
                  ================================================== */}
                  <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                      style={{
                        background:
                          'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                      }}
                    >
                      <span
                        className="text-[#7E6BB3]"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '18px',
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        VS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* =================================================
              MOBILE QUESTIONS
          ================================================== */}
          <div className="flex flex-col gap-5 px-5 pb-8 md:hidden">
            {questionPairs.map((pair, index) => (
              <div key={index} className="relative">
                {/* =================================================
                    LEFT / STANDARD QUESTION
                ================================================== */}
                <div
                  className="relative z-10 flex min-h-[90px] items-center gap-4 rounded-[10px] px-5 py-4"
                  style={{
                    backgroundColor: 'rgba(255, 241, 232, 0.75)',
                  }}
                >
                  {/* Orange icon background */}
                  <div
                    className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-[9px]"
                    style={{
                      backgroundColor: 'rgba(255, 226, 216, 0.90)',
                    }}
                  >
                    <div className="text-[rgba(197,81,20,0.75)]">
                      {pair.leftIcon}
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      lineHeight: '1.35',
                      color: 'rgba(197, 81, 20, 0.75)',
                    }}
                  >
                    {pair.standard}
                  </span>
                </div>

                {/* =================================================
                    VS BADGE
                ================================================== */}
                <div className="relative z-30 my-[-15px] flex justify-center">
                  <div
                    className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    <span
                      className="text-[#7E6BB3]"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '16px',
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      VS
                    </span>
                  </div>
                </div>

                {/* =================================================
                    RIGHT / SAFETY QUESTION
                ================================================== */}
                <div
                  className="relative z-10 flex min-h-[90px] items-center gap-4 rounded-[10px] px-5 py-4"
                  style={{
                    backgroundColor: '#EDE7FB',
                  }}
                >
                  {/* Purple icon background */}
                  <div
                    className="flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center rounded-[9px]"
                    style={{
                      background:
                        'linear-gradient(180deg, #F6F4FE 0%, #E2DBF7 100%)',
                    }}
                  >
                    <div className="text-[#7E6BB3]">
                      {pair.rightIcon}
                    </div>
                  </div>

                  <span
                    className="text-left"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      fontWeight: 500,
                      lineHeight: '1.35',
                      color: '#7E6BB3',
                    }}
                  >
                    {pair.safety}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}