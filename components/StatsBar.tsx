'use client';

const stats = [
  {
    number: '1,000+',
    title: 'Users',
    subtitle: 'Joined in Q1 Launch',
    icon: 'users',
  },
  {
    number: '190+',
    title: 'Countries',
    subtitle: 'Monitored',
    icon: 'globe',
  },
  {
    number: '500,000+',
    title: 'Data Points',
    subtitle: '',
    icon: 'database',
  },
  {
    number: '27',
    title: 'Adventure Categories',
    subtitle: '',
    icon: 'tags',
  },
];

export default function StatsBar() {
  return (
    <section className="bg-[#FFFFFF] pt-[40px]">
      <div className="mx-auto w-full max-w-[1440px]">

        {/* =====================================================
            DESKTOP
        ====================================================== */}
        <div
          className="hidden h-[150px] w-full overflow-hidden rounded-[20px] md:block"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >
          <div className="grid h-full grid-cols-4">

            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="relative flex h-full items-center justify-center"
              >

                {/* =================================================
                    VERTICAL SEPARATOR
                ================================================== */}
                {index < stats.length - 1 && (
                  <div
                    className="absolute right-0 top-1/2 h-[120px] w-px -translate-y-1/2"
                    style={{
                      backgroundColor:
                        'rgba(43, 39, 64, 0.12)',
                    }}
                  />
                )}

                {/* =================================================
                    STAT CONTENT
                ================================================== */}
                <div className="flex w-[250px] items-center gap-5">

                  {/* ICON */}
                  <div
                    className="flex h-[74px] w-[74px] flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    <StatIcon type={stat.icon} />
                  </div>

                  {/* TEXT */}
                  <div className="min-w-0 flex-1 text-left">

                    {/* NUMBER */}
                    <h3
                      className="whitespace-nowrap text-[#2B2740]"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '30px',
                        fontWeight: 700,
                        lineHeight: '1.15',
                      }}
                    >
                      {stat.number}
                    </h3>

                    {/* TITLE */}
                    <div className="mt-1 flex h-[22px] items-start">
                      <p
                        className="text-[#2B2740]"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '17px',
                          fontWeight: 400,
                          lineHeight: '1.3',
                        }}
                      >
                        {stat.title}
                      </p>
                    </div>

                    {/* SUBTITLE */}
                    {stat.subtitle && (
                      <p
                        className="mt-0 text-[#7E6BB3]"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '13px',
                          fontWeight: 400,
                          lineHeight: '1.3',
                        }}
                      >
                        {stat.subtitle}
                      </p>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            MOBILE
        ====================================================== */}
        <div
          className="grid w-full grid-cols-2 overflow-hidden rounded-[20px] md:hidden"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >

          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className={`
                relative flex min-h-[185px] items-center justify-center px-4 py-7
                ${
                  index < 2
                    ? 'border-b-[0.1px] border-[#2B2740]/10'
                    : ''
                }
                ${
                  index % 2 === 0
                    ? 'border-r-[0.1px] border-[#2B2740]/10'
                    : ''
                }
              `}
            >

              <div className="flex flex-col items-center text-center">

                {/* =================================================
                    ICON
                ================================================== */}
                <div
                  className="flex h-[74px] w-[74px] flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                  }}
                >
                  <StatIcon type={stat.icon} />
                </div>

                {/* =================================================
                    NUMBER
                ================================================== */}
                <h3
                  className="mt-4 whitespace-nowrap text-[#2B2740]"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '30px',
                    fontWeight: 700,
                    lineHeight: '1.15',
                  }}
                >
                  {stat.number}
                </h3>

                {/* =================================================
                    TITLE
                ================================================== */}
                <div className="mt-1 flex h-[44px] w-full items-center justify-center">
                  <p
                    className="max-w-[160px] text-center text-[#2B2740]"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '17px',
                      fontWeight: 400,
                      lineHeight: '1.25',
                    }}
                  >
                    {stat.title}
                  </p>
                </div>

                {/* =================================================
                    SUBTITLE
                ================================================== */}
                {stat.subtitle && (
                  <p
                    className="mt-0 max-w-[160px] text-[#7E6BB3]"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                      lineHeight: '1.25',
                    }}
                  >
                    {stat.subtitle}
                  </p>
                )}

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}


/* =============================================================
   STAT ICONS
============================================================= */

function StatIcon({ type }: { type: string }) {
  const commonProps = {
    className: 'h-[46px] w-[46px] text-[#806DB6]',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.45,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  /* =========================================================
     USERS
  ========================================================== */
  if (type === 'users') {
    return (
      <svg {...commonProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.5-3.5 2.3-5.5 5.5-5.5s5 2 5.5 5.5" />

        <path d="M16 11c2.3 0 4-1.5 4-3.5S18.3 4 16 4" />
        <path d="M17 14.5c2.2.4 3.5 2 4 4.5" />
      </svg>
    );
  }

  /* =========================================================
     GLOBE
  ========================================================== */
  if (type === 'globe') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 9h16.4" />
        <path d="M3.8 15h16.4" />
        <path d="M12 3.5c2.2 2.3 3.4 5.1 3.4 8.5S14.2 18.2 12 20.5" />
        <path d="M12 3.5C9.8 5.8 8.6 8.6 8.6 12s1.2 6.2 3.4 8.5" />
      </svg>
    );
  }

  /* =========================================================
     DATABASE
  ========================================================== */
  if (type === 'database') {
    return (
      <svg {...commonProps}>
        <ellipse cx="12" cy="5.5" rx="7" ry="3" />
        <path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        <path d="M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }

  /* =========================================================
     TAGS / ADVENTURE CATEGORIES
  ========================================================== */
  return (
    <svg {...commonProps}>
      <path d="M4 5.5v5.2l8.8 8.8a2 2 0 0 0 2.8 0l3.9-3.9a2 2 0 0 0 0-2.8L10.7 4H5.5A1.5 1.5 0 0 0 4 5.5Z" />
      <circle cx="8" cy="8" r="1.2" />
      <path d="M14 7.5l3 3" />
    </svg>
  );
}