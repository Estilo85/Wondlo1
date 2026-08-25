'use client';

const stats = [
  {
    number: "1,000+",
    title: "Users",
    subtitle: "Joined in Q1 Launch",
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: "190+",
    title: "Countries",
    subtitle: "Monitored",
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    number: "500,000+",
    title: "Data Points",
    subtitle: "",
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    number: "27",
    title: "Adventure Categories",
    subtitle: "",
    icon: (
      <svg className="w-5 h-5 text-[#7E6BB3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
  },
];

export default function StatsBar() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-12 my-6">
      <div className="bg-[#FAF9FE] rounded-3xl p-6 border border-[#EDE7FB] shadow-[0_12px_30px_-8px_rgba(43,39,64,0.08)]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EDE7FB]">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex items-center space-x-3.5 ${
                idx === 0 ? 'pb-4 md:pb-0 md:pr-4' : 
                idx === 3 ? 'pt-4 md:pt-0 md:pl-6' : 
                'py-4 md:py-0 md:px-5'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-[#EAE2FB] flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              
              <div className="flex flex-col">
                <span className="font-poppins font-bold text-lg sm:text-xl text-[#2B2740] leading-tight">
                  {stat.number}
                </span>
                <span className="font-inter text-[11px] text-gray-500 font-medium">
                  {stat.title}
                </span>
                {stat.subtitle ? (
                  <span className="font-inter text-[10px] text-gray-400">
                    {stat.subtitle}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}