'use client';

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Overall Safety Score",
    description: "A single 0-100 score weighed across a 7-step safety framework.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="10" x2="21" y1="6" y2="6" />
        <line x1="10" x2="21" y1="12" y2="12" />
        <line x1="10" x2="21" y1="18" y2="18" />
        <path d="M4 6h1v4" />
        <path d="M4 10h2" />
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      </svg>
    ),
    title: "Incident Timeline",
    description: "Chronological record of reported safety events.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
    title: "Recommended Questions",
    description: "We send you adventure-specific questions to ask the operator during your chat/talk with them and work with you to diagnose their response.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v6h6" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
    title: "Safety Report",
    description: "Plain language interpretation of what the evidence means.",
  },
];

export default function WhatYouWillReceive() {
  return (
    <section className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE7FB] shadow-[0_12px_30px_-8px_rgba(43,39,64,0.06)]">
      <h2 className="font-poppins font-bold text-2xl text-[#2B2740] mb-8">
        What you'll receive
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 border border-[#EDE7FB] shadow-[0_8px_20px_-4px_rgba(43,39,64,0.05)] flex flex-col space-y-4 hover:shadow-[0_12px_25px_-4px_rgba(43,39,64,0.08)] transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F6F4FE] flex items-center justify-center border border-[#EDE7FB]">
              {item.icon}
            </div>
            <div>
              <h3 className="font-poppins font-bold text-sm text-[#2B2740] mb-2">
                {item.title}
              </h3>
              <p className="font-inter text-xs text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}