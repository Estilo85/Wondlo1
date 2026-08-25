'use client';

import { useState } from 'react';
import Image from 'next/image';
import WaitlistModal from './WaitlistModal';

const adventureTypes = [
  'Parasailing', 'Snowboarding', 'Trekking', 'Kayaking', 'ATV',
  'Ziplining', 'Cave diving', 'Paragliding', 'Volcano boarding', 'Heli skiing',
];

const bannerImages = [
  { src: '/images/paragliding.jpg', alt: 'Paragliding' },
  { src: '/images/hiking.jpg', alt: 'Hiking' },
  { src: '/images/kayaking.jpg', alt: 'Kayaking' },
  { src: '/images/snowboarding.jpg', alt: 'Snowboarding' },
  { src: '/images/hiking.jpg', alt: 'Hiking (Repeat)' },
];

interface HeroSectionProps {
  score?: number;
  operatorName?: string;
  ratingText?: string;
}

export default function HeroSection({
  score = 85,
  operatorName = "Summit Trails Expeditions",
  ratingText = "Good",
}: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-white pt-6 pb-12 px-4 sm:px-8 relative overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto relative">
          
          {/* Left Column: Search & Intro */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-1.5 bg-[#F4EFFE] border border-[#E4D7FA] px-3 py-1 rounded-full">
              <svg className="w-3.5 h-3.5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="font-poppins font-semibold text-[11px] text-[#7E6BB3]">
                Adventure Safety Intelligence
              </span>
            </div>

            <h1 className="font-poppins font-bold text-3xl sm:text-5xl text-[#2B2740] leading-[1.15]">
              Know if it’s <span className="text-[#7E6BB3]">safe</span> <br />
              before you pay <br />
              a deposit.
            </h1>

            <p className="font-inter text-xs sm:text-sm text-[#7E6BB3] max-w-md">
              Check an adventure provider by company name, website, or social media handle.
            </p>

            <div className="bg-[#FAF9FE] border border-[#EDE7FB] rounded-2xl p-2 flex items-center shadow-xs">
              <div className="pl-3 pr-2 text-gray-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by company name, website, or social media handle"
                className="w-full bg-transparent text-xs text-[#2B2740] placeholder-gray-400 outline-none font-inter"
              />
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-[#B29DE8] hover:bg-[#9D85DB] text-white font-poppins font-medium text-xs px-4 py-2.5 rounded-xl shrink-0 transition-colors cursor-pointer"
              >
                Analyse Adventure →
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-poppins font-bold text-xs text-[#2B2740] mr-1">Adventure type:</span>
              {adventureTypes.map((type) => (
                <span key={type} className="bg-[#F4EFFE] text-[#7E6BB3] text-[11px] font-medium px-2.5 py-0.5 rounded-lg border border-[#EDE7FB]">
                  {type}
                </span>
              ))}
              <button type="button" className="text-[11px] font-semibold text-[#7E6BB3] hover:underline">More</button>
            </div>
          </div>

          {/* Right Column: 5 Slanted Images & Exact Safety Card */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-3xl overflow-hidden shadow-md flex border border-[#EDE7FB]">
              {bannerImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative flex-1 h-full -mr-3 transform -skew-x-12 scale-125 overflow-hidden border-r-2 border-white last:border-r-0"
                >
                  <div className="skew-x-12 scale-100 w-full h-full relative">
                    <Image 
                      src={img.src} 
                      alt={img.alt} 
                      fill 
                      sizes="(max-width: 768px) 25vw, 15vw"
                      priority={idx < 2}
                      className="object-cover" 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Card */}
            <div className="absolute -bottom-10 right-2 sm:right-4 bg-white border border-[#EDE7FB] rounded-2xl p-4 shadow-2xl w-72 z-20 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#F4EFFE] border border-[#E4D7FA] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="font-poppins font-bold text-sm text-[#2B2740]">Safety Card</span>
              </div>
              
              <div className="bg-[#F4EFFE]/60 border border-[#EDE7FB] rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-semibold text-[#7E6BB3] leading-none">Safety Score</p>
                <p className="text-xs font-bold text-[#2B2740] truncate leading-tight">{operatorName}</p>
                
                <div className="flex items-baseline space-x-1 pt-1">
                  <span className="text-4xl font-extrabold text-[#2B2740] leading-none">{score}</span>
                  <span className="text-xs font-semibold text-gray-500">/100</span>
                  <span className="ml-auto text-xs font-bold text-[#7E6BB3]">{ratingText}</span>
                </div>

                <div className="w-full bg-[#E5DDF8] h-2 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="bg-[#7E6BB3] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#F4EFFE]/60 border border-[#EDE7FB] rounded-xl p-3 space-y-2.5">
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full border border-[#7E6BB3] text-[#7E6BB3] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#2B2740] leading-none">Incident History</p>
                    <p className="text-[10px] text-[#7E6BB3] font-medium mt-0.5">5 Years - No Reported Incidents</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full border border-[#7E6BB3] text-[#7E6BB3] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#2B2740] leading-none">Equipment Maintenance</p>
                    <p className="text-[10px] text-[#7E6BB3] font-medium mt-0.5">Inspection Every 3 Months</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full border border-[#7E6BB3] text-[#7E6BB3] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#2B2740] leading-none">Operational Transparency</p>
                    <p className="text-[10px] text-[#7E6BB3] font-medium mt-0.5">Registered & Licenced</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}