'use client';

import Image from 'next/image';

const steps = [
  {
    number: "01",
    title: "Search Operator",
    description: "Enter a company name, website, or social handle.",
    icon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Collect Public Information",
    description: "Our system collects incidents, operator claims, safety-specific reviews, community notes, and government advisories based on our developed proprietary safety framework.",
    icon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="11.5" cy="14.5" r="2.5" />
        <path d="M13.25 16.25 15 18" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Evaluate Safety Evidence",
    description: "Our model evaluates evidence across a 7-step safety framework.",
    icon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Receive Safety Report",
    description: "A structured summary with a safety score and detailed risk breakdown.",
    icon: (
      <svg className="w-4 h-4 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v6h6" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE7FB] shadow-[0_12px_30px_-8px_rgba(43,39,64,0.06)]">
      <h2 className="font-poppins font-bold text-2xl text-[#2B2740] mb-1">
        How it works
      </h2>
      <p className="font-inter text-xs text-[#7E6BB3] mb-10">
        From search to safety intelligence in four steps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Visual Area: Offset Photos & Curved Yellow Dotted Line */}
        <div className="md:col-span-5 relative h-[320px] flex items-center justify-between px-4">
          
          {/* Lower Left Kayaking Photo (Higher Y-position) */}
          <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.12)] border-2 border-white self-end mb-4 z-10">
            <Image src="/images/kayaking.jpg" alt="Kayaking" fill className="object-cover" />
          </div>

          {/* Yellow/Gold Curved Dotted Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 320 220" fill="none">
            <path 
              d="M 95,155 C 120,230 180,210 215,140 C 230,110 240,70 255,80" 
              stroke="#D4B04C" 
              strokeWidth="3.5" 
              strokeDasharray="7 7" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Upper Right Hiking Photo */}
          <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.12)] border-2 border-white self-start mt-4 z-10">
            <Image src="/images/hiking.jpg" alt="Hiking" fill className="object-cover" />
          </div>
        </div>

        {/* Right Step List */}
        <div className="md:col-span-7 space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start justify-between space-x-4">
              <div className="flex items-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-[#EDE7FB] text-[#7E6BB3] font-poppins font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-poppins font-bold text-sm text-[#2B2740]">
                    {step.title}
                  </h3>
                  <p className="font-inter text-xs text-gray-500 mt-1 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#F6F4FE] flex items-center justify-center shrink-0">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}