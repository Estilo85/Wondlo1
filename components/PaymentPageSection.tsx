'use client';

export default function PaymentPageSection({
  onUpgrade,
  onPayAsYouGo,
  onStarterPlan,
}: {
  onUpgrade?: () => void;
  onPayAsYouGo?: () => void;
  onStarterPlan?: () => void;
}) {
  return (
    <div className="w-full min-h-screen bg-white font-poppins flex flex-col justify-between">

      {/* 1. Top Navbar Header */}
      <div className="w-full max-w-[1200px] mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight text-[#2B2740]">
          Wondlo
        </div>

        {/* Right Navigation Links & Search Bar */}
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-[#2B2740] tracking-wider cursor-pointer hover:text-[#7C63BD]">
            HOME
          </span>
          <span className="text-xs font-bold text-[#2B2740] tracking-wider cursor-pointer hover:text-[#7C63BD]">
            COMMUNITY
          </span>

          {/* Analyze Another Adventure Button */}
          <div className="bg-[#7C63BD] text-white px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold shadow-xs cursor-pointer hover:bg-[#6B52A1]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Analyse Another Adventure</span>
          </div>

          {/* User Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#EBE2FE] border border-[#D5C3F9] flex items-center justify-center text-[#7C63BD] font-bold text-sm shadow-xs cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="w-full max-w-[1100px] mx-auto px-6 py-8 space-y-10">

        {/* Upgrade Pill Badge */}
        <div className="flex justify-center">
          <div className="bg-[#7C63BD] text-white px-8 py-2.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-xs">
            UPGRADE
          </div>
        </div>

        {/* 3-Column Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Card 1: Free Trial */}
          <div className="bg-white border border-[#D5C3F9] rounded-[24px] p-8 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="bg-[#EBE2FE] text-[#7C63BD] border border-[#D5C3F9] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  Free Trial
                </span>
              </div>
              {/* Price */}
              <div className="text-center pt-2">
                <span className="text-5xl font-extrabold text-[#2B2740]">0£</span>
                <span className="text-sm font-bold text-[#7C63BD]">/Month</span>
              </div>
              {/* Description */}
              <div className="text-center text-xs font-semibold text-[#2B2740] pt-4">
                Three Searches
              </div>
            </div>
          </div>

          {/* Card 2: Pay As You Go */}
          <div className="bg-white border border-[#D5C3F9] rounded-[24px] p-8 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="bg-[#EBE2FE] text-[#7C63BD] border border-[#D5C3F9] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  Pay As You Go
                </span>
              </div>
              {/* Price */}
              <div className="text-center pt-2">
                <span className="text-5xl font-extrabold text-[#2B2740]">3£</span>
                <span className="text-sm font-bold text-[#7C63BD]">/search</span>
              </div>
              {/* Features List */}
              <div className="space-y-3 text-center text-xs font-semibold text-[#2B2740] pt-2">
                <p>One Search</p>
                <p>Adventure Preparedness</p>
                <p>Safety Digest</p>
                <p>Operator Chat Diagnosis</p>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-8">
              <button
                onClick={onPayAsYouGo}
                className="w-full bg-[#7C63BD] hover:bg-[#6B52A1] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs tracking-wider cursor-pointer"
              >
                PAY
              </button>
            </div>
          </div>

          {/* Card 3: Starter Plan */}
          <div className="bg-white border border-[#D5C3F9] rounded-[24px] p-8 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex justify-center">
                <span className="bg-[#EBE2FE] text-[#7C63BD] border border-[#D5C3F9] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider">
                  Starter Plan
                </span>
              </div>
              {/* Price */}
              <div className="text-center pt-2">
                <span className="text-5xl font-extrabold text-[#2B2740]">15£</span>
                <span className="text-sm font-bold text-[#7C63BD]">/Month</span>
              </div>
              {/* Features List */}
              <div className="space-y-3 text-center text-xs font-semibold text-[#2B2740] pt-2">
                <p>Seven Searches / Month</p>
                <p>Adventure Preparedness</p>
                <p>Safety Digest</p>
                <p>Operator Chat Diagnosis</p>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-8">
              <button
                onClick={onStarterPlan}
                className="w-full bg-[#7C63BD] hover:bg-[#6B52A1] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-xs tracking-wider cursor-pointer"
              >
                PAY
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Footer Section */}
      <div className="w-full bg-[#9E86D3] text-white py-10 px-8 mt-16">
        <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-b border-[#B5A1E2] pb-8">

          {/* Column 1: Brand & Address */}
          <div className="space-y-3">
            <h3 className="text-base font-bold tracking-tight">Wondlo</h3>
            <p className="text-xs font-medium text-[#EFE9FC] leading-relaxed">
              71–75 Shelton Street<br />
              United Kingdom
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-[#EFE9FC]">
              <span className="cursor-pointer hover:text-white">IG</span>
              <span className="cursor-pointer hover:text-white">LI</span>
              <span className="cursor-pointer hover:text-white">X</span>
              <span className="cursor-pointer hover:text-white">TT</span>
            </div>
          </div>

          {/* Column 2: Important Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold tracking-wider uppercase">Important Link</h4>
            <ul className="space-y-1.5 text-xs text-[#EFE9FC] font-medium">
              <li className="cursor-pointer hover:text-white">Safety Guidelines</li>
              <li className="cursor-pointer hover:text-white">Report an Issue</li>
              <li className="cursor-pointer hover:text-white">Help Center</li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold tracking-wider uppercase">Contact</h4>
            <p className="text-xs text-[#EFE9FC] font-medium">
              partnership@joinwondlo.com
            </p>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="w-full max-w-[1100px] mx-auto pt-6 flex items-center justify-between text-[11px] text-[#EFE9FC] font-medium">
          <span>Safety as a System™</span>
          <span>Copyright © wondlo 2026</span>
          <div className="w-5 h-5 flex items-center justify-center cursor-pointer">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}