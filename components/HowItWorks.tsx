'use client';

import Image from 'next/image';

const steps = [
  {
    number: '01',
    icon: 'search',
    title: 'Search Operator',
    description:
      'Enter a company name, website, or social handle.',
  },
  {
    number: '02',
    icon: 'info',
    title: 'Collect Public Information',
    description:
      'Our system collects incidents, operator claims, safety-specific information, community notes, and government advisories based on our developed proprietary safety framework.',
  },
  {
    number: '03',
    icon: 'evaluate',
    title: 'Evaluate Safety Evidence',
    description:
      'Our model evaluates evidence across a 7-step safety framework.',
  },
  {
    number: '04',
    icon: 'report',
    title: 'Receive Safety Report',
    description:
      'A structured summary with a safety score and detailed risk breakdown.',
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white pt-[40px]">
      <div className="mx-auto w-full max-w-[1440px]">

        {/* =====================================================
            HOW IT WORKS CARD
        ====================================================== */}
        <div
          className="relative w-full overflow-hidden rounded-[20px]"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >

          {/* =================================================
              HEADER
          ================================================== */}
          <div className="px-6 pt-[50px] sm:px-8 lg:px-[44px]">

            <h2
              className="text-[#2B2740]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(20px, 2.1vw, 30px)',
                fontWeight: 700,
                lineHeight: '1.25',
              }}
            >
              How it works
            </h2>

            <div
              className="my-5 h-[2px] w-[100px]"
              style={{
                background:
                  'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
              }}
            />

            <p
              className="text-[#7E6BB3]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: '1.4',
              }}
            >
              From search to safety intelligence in four steps.
            </p>

          </div>


          {/* =================================================
              DESKTOP / TABLET CONTENT
          ================================================== */}
          <div
            className="
              relative
              mx-6
              mt-[0px]
              hidden
              min-h-[450px]
              md:block
              sm:mx-8
              lg:mx-[44px]
            "
          >

            {/* =================================================
                LEFT VISUAL AREA
            ================================================== */}
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: '50%',
              }}
            >

              {/* =================================================
                  TABLET CURVED PATH
                  md -> lg only
              ================================================== */}
              <svg
                className="
                  pointer-events-none
                  absolute
                  z-0
                  md:left-[50%]
                  md:top-[42%]
                  md:h-[280px]
                  md:w-[390px]
                  md:max-lg:block
                  lg:hidden
                "
                style={{
                  transform: 'translate(-50%, -50%)',
                }}
                viewBox="0 0 320 220"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M 55,190 C 95,265 175,235 215,140 C 235,98 260,42 285,65"
                  stroke="#C7B5F5"
                  strokeWidth="3.5"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />
              </svg>


              {/* =================================================
                  DESKTOP CURVED PATH
                  ORIGINAL PATH — DO NOT CHANGE
              ================================================== */}
              <svg
                className="
                  pointer-events-none
                  absolute
                  z-0
                  hidden
                  lg:left-[50%]
                  lg:top-[46%]
                  lg:block
                  lg:h-[220px]
                  lg:w-[320px]
                "
                style={{
                  transform: 'translate(-50%, -50%)',
                }}
                viewBox="0 0 320 220"
                fill="none"
              >
                <path
                  d="M 95,155 C 120,230 180,210 215,140 C 230,110 240,70 255,80"
                  stroke="#C7B5F5"
                  strokeWidth="3.5"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />
              </svg>


              {/* =================================================
                  KAYAKING IMAGE
              ================================================== */}
              <div
                className="
                  absolute
                  z-10
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-white
                  shadow-[0_8px_20px_rgba(0,0,0,0.12)]

                  /* TABLET */
                  md:bottom-[92px]
                  md:max-lg:left-[43%]

                  /* DESKTOP - ORIGINAL */
                  lg:bottom-[88px]
                  lg:left-[14%]
                "
                style={{
                  width: '176px',
                  height: '128px',
                }}
              >
                <Image
                  src="/images/kayaking.jpg"
                  alt="Kayaking"
                  fill
                  className="object-cover"
                />
              </div>


              {/* =================================================
                  HIKING IMAGE
              ================================================== */}
              <div
                className="
                  absolute
                  z-10
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-white
                  shadow-[0_8px_20px_rgba(0,0,0,0.12)]

                  /* TABLET */
                  md:top-[50px]
                  md:max-lg:right-[27%]

                  /* DESKTOP - MOVED SLIGHTLY LEFT */
                  lg:right-[17%]
                  lg:top-[52px]
                "
                style={{
                  width: '176px',
                  height: '128px',
                }}
              >
                <Image
                  src="/images/hiking.jpg"
                  alt="Mountain hiking"
                  fill
                  className="object-cover"
                />
              </div>

            </div>


            {/* =================================================
                CENTER DIVIDER / NUMBER AXIS
            ================================================== */}
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-1/2
                z-20
                w-0
                md:translate-y-[-22px]
                lg:translate-y-[-42px]
              "
            >

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="absolute h-[50px] w-[50px]"
                  style={{
                    top: `${index * 106 + 20}px`,
                    left: '-25px',
                  }}
                >
                  <div
                    className="flex h-[50px] w-[50px] items-center justify-center rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    <span
                      className="text-[#7E6BB3]"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '21px',
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>
              ))}

            </div>


            {/* =================================================
                RIGHT STEP CONTENT
            ================================================== */}
            <div
              className="
                absolute
                inset-y-0
                right-0
                md:translate-y-[-22px]
                lg:translate-y-[-42px]
              "
              style={{
                width: '50%',
                paddingLeft: '45px',
                paddingRight: '10px',
              }}
            >

              <div className="flex h-full flex-col justify-start py-[20px]">

                <div className="space-y-[18px]">

                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="relative min-h-[88px]"
                    >

                      <div className="relative max-w-[500px] pr-[48px]">

                        <h3
                          className="text-[#2B2740]"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '16px',
                            fontWeight: 600,
                            lineHeight: '1.35',
                          }}
                        >
                          {step.title}
                        </h3>

                        <p
                          className="mt-2"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '1.5',
                            color: '#6F6A7F',
                          }}
                        >
                          {step.description}
                        </p>

                        <div
                          className="
                            absolute
                            right-0
                            top-0
                            flex
                            h-[32px]
                            w-[32px]
                            items-center
                            justify-center
                            rounded-[8px]
                          "
                          style={{
                            background:
                              'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                          }}
                        >
                          <StepIcon type={step.icon} />
                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>


          {/* =====================================================
              MOBILE CONTENT
          ====================================================== */}
          <div className="md:hidden">

            {/* =================================================
                MOBILE VISUAL
            ================================================== */}
            <div className="relative mx-[20px] mt-[35px] h-[320px]">
              <svg
                className="pointer-events-none absolute z-0"
                style={{
                  width: '320px',
                  height: '220px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                viewBox="0 0 320 220"
                fill="none"
              >
                <path
                  d="M 95,155 C 120,230 180,210 215,140 C 230,110 240,70 255,80"
                  stroke="#C7B5F5"
                  strokeWidth="3.5"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />
              </svg>


              {/* =================================================
                  MOBILE KAYAKING
              ================================================== */}
              <div
                className="
                  absolute
                  bottom-[10px]
                  left-[0px]
                  z-10
                  h-28
                  w-36
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-white
                  shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                  sm:h-32
                  sm:w-44
                "
              >
                <Image
                  src="/images/kayaking.jpg"
                  alt="Kayaking"
                  fill
                  className="object-cover"
                />
              </div>


              {/* =================================================
                  MOBILE HIKING
              ================================================== */}
              <div
                className="
                  absolute
                  right-[0px]
                  top-[14px]
                  z-10
                  h-28
                  w-36
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-white
                  shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                  sm:h-32
                  sm:w-44
                "
              >
                <Image
                  src="/images/hiking.jpg"
                  alt="Mountain hiking"
                  fill
                  className="object-cover"
                />
              </div>

            </div>


            {/* =================================================
                MOBILE STEPS
            ================================================== */}
            <div
              className="
                relative
                mx-auto
                w-full
                max-w-[560px]
                px-[20px]
                pb-[75px]
                pt-[45px]
              "
            >

              <div
                className="absolute bottom-[95px] left-[45px] top-[70px] w-[2px]"
                style={{
                  background:
                    'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                }}
              />

              <div className="relative space-y-8">

                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="relative flex gap-4"
                  >

                    {/* NUMBER */}
                    <div
                      className="
                        relative
                        z-10
                        flex
                        h-[50px]
                        w-[50px]
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-full
                      "
                      style={{
                        background:
                          'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                      }}
                    >
                      <span
                        className="text-[#7E6BB3]"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '21px',
                          fontWeight: 600,
                          lineHeight: 1,
                        }}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1 pt-[2px]">

                      <div className="flex items-start justify-between gap-3">

                        <h3
                          className="min-w-0 text-[#2B2740]"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '16px',
                            fontWeight: 600,
                            lineHeight: '1.35',
                          }}
                        >
                          {step.title}
                        </h3>

                        {/* ICON */}
                        <div
                          className="
                            flex
                            h-[32px]
                            w-[32px]
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-[8px]
                          "
                          style={{
                            background:
                              'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                          }}
                        >
                          <StepIcon type={step.icon} />
                        </div>

                      </div>

                      <p
                        className="mt-2"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '1.5',
                          color: '#6F6A7F',
                        }}
                      >
                        {step.description}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}


/* =============================================================
   STEP ICONS
============================================================= */

function StepIcon({ type }: { type: string }) {
  const commonProps = {
    className: 'h-[18px] w-[18px]',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#7E6BB3',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'search') {
    return (
      <svg {...commonProps}>
        <circle cx="10.8" cy="10.8" r="6.2" />
        <path d="M15.5 15.5L20 20" />
      </svg>
    );
  }

  if (type === 'info') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 10.5v5" />
        <circle
          cx="12"
          cy="7.5"
          r="0.6"
          fill="#7E6BB3"
          stroke="none"
        />
      </svg>
    );
  }

  if (type === 'evaluate') {
    return (
      <svg {...commonProps}>
        <rect
          x="5"
          y="4.5"
          width="14"
          height="16"
          rx="2"
        />
        <path d="M9 4.5V3h6v1.5" />
        <path d="M8.5 10.5l2 2 4.5-4.5" />
        <path d="M8.5 16h7" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12h6" />
      <path d="M9 15.5h6" />
      <path d="M9 19h4" />
    </svg>
  );
}