'use client';

const features = [
  {
    icon: (
      <svg
        className="w-5 h-5 text-[#7E6BB3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: 'Overall Safety Score',
    description:
      'A single 0-100 score weighed across a 7-step safety framework.',
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-[#7E6BB3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="10" x2="21" y1="6" y2="6" />
        <line x1="10" x2="21" y1="12" y2="12" />
        <line x1="10" x2="21" y1="18" y2="18" />
        <path d="M4 6h1v4" />
        <path d="M4 10h2" />
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      </svg>
    ),
    title: 'Incident Timeline',
    description: 'Chronological record of reported safety events.',
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-[#7E6BB3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    title: 'Recommended Questions',
    description:
      'We send you adventure-specific questions to ask the operator during your chat/talk with them and work with you to diagnose their response.',
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-[#7E6BB3]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v6h6" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
    title: 'Safety Report',
    description:
      'Plain language interpretation of what the evidence means.',
  },
];

export default function WhatYouWillReceive() {
  return (
    <section className="w-full bg-[#FFFFFF] py-[40px]">
      <div className="w-full px-0">

        {/* Outer Section */}
        <div
          className="w-full rounded-3xl p-8 sm:p-12"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >

          {/* Header */}
          <div>
            <h2
              className="font-poppins text-[#2B2740]"
              style={{
                fontSize: 'clamp(20px, 2.1vw, 30px)',
                fontWeight: 700,
                lineHeight: '1.25',
              }}
            >
              What you&apos;ll receive
            </h2>

            <div
              className="my-5 h-[2px] w-[100px]"
              style={{
                background:
                  'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
              }}
            />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl bg-white p-6 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  border:
                    '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow:
                    '0 8px 20px rgba(43, 39, 64, 0.12)',
                }}
              >

                {/* Icon */}
                <div
                  className="mb-5 flex h-[55px] w-[55px] items-center justify-center rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                  }}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="font-poppins text-[#7E6BB3]"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      lineHeight: '1.35',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="mt-[10px] font-inter text-black"
                    style={{
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '1.5',
                      color: '#6F6A7F',
                    }}
                  >
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}