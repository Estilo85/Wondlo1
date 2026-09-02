'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import WaitlistModal from './WaitlistModal';

type SafetyCardData = {
  score: number;
  status: string;
  provider: string;
  details: {
    label: string;
    value: string;
  }[];
  isExample?: boolean;
};

const bannerImages = [
  {
    src: '/images/paragliding.jpg',
    alt: 'Paragliding adventure',
  },
  {
    src: '/images/hiking.jpg',
    alt: 'Mountain hiking adventure',
  },
  {
    src: '/images/kayaking.jpg',
    alt: 'Kayaking adventure',
  },
  {
    src: '/images/snowboarding.jpg',
    alt: 'Snowboarding adventure',
  },
];

const safetyCards: SafetyCardData[] = [
  {
    score: 75,
    status: 'Good',
    provider: 'Example Provider',
    details: [
      {
        label: 'Safety Sentiment',
        value: 'Generally Positive',
      },
      {
        label: 'Risk Assessment',
        value: 'Moderate Risk',
      },
      {
        label: 'Quality of Experience',
        value: 'Good',
      },
    ],
    isExample: true,
  },
  {
    score: 25,
    status: 'High Risk',
    provider: 'Example Provider',
    details: [
      {
        label: 'Safety Sentiment',
        value: 'Mostly Negative',
      },
      {
        label: 'Risk Assessment',
        value: 'High Risk',
      },
      {
        label: 'Quality of Experience',
        value: 'Needs Improvement',
      },
    ],
    isExample: true,
  },
  {
    score: 50,
    status: 'Caution',
    provider: 'Example Provider',
    details: [
      {
        label: 'Safety Sentiment',
        value: 'Mixed',
      },
      {
        label: 'Risk Assessment',
        value: 'Moderate Risk',
      },
      {
        label: 'Quality of Experience',
        value: 'Average',
      },
    ],
    isExample: true,
  },
];

const visibleChips = [
  'Parasailing',
  'Snowboarding',
  'Trekking',
  'Kayaking',
  'ATV',
  'Ziplining',
  'Cave diving',
  'Paragliding',
  'Volcano boarding',
  'Heli skiing',
];

const moreChips = [
  'Hiking',
  'Snorkeling',
  'Safari',
  'Kayaking (Calm Water)',
  'Biking (Easy Trails)',
  'Horseback Riding (Easy)',
  'Canoeing',
  'Bungee jumping',
  'Climbing',
  'Mountaineering',
  'Cave Diving',
  'Skydiving',
  'Base Jumping',
  'White-water Rafting (Advanced)',
  'Rock Climbing (Advanced)',
  'Ice Climbing',
  'Paragliding',
  'Scuba Diving (Deep)',
  'Extreme Skiing',
  'Canyoning',
  'Volcano Boarding',
  'Shark Cage Diving',
  'Snowboarding',
  'Expedition',
  'Gorilla tracking',
  'Heli-Skiing',
  'Free Solo Climbing',
].filter(
  (chip) =>
    !visibleChips.some(
      (visibleChip) =>
        visibleChip.toLowerCase() === chip.toLowerCase()
    )
);

interface HeroSectionProps {
  score?: number;
  operatorName?: string;
  ratingText?: string;
}

export default function HeroSection({
  score = 75,
  operatorName = 'Example Provider',
  ratingText = 'Good',
}: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const [morePopupTop, setMorePopupTop] = useState(0);

  const initialCard: SafetyCardData = {
    ...safetyCards[0],
    score,
    provider: operatorName,
    status: ratingText,
  };

  const cards = [initialCard, ...safetyCards.slice(1)];

  /*
   * Rotate safety card every 60 seconds.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setIsCardVisible(false);

      const timeout = setTimeout(() => {
        setActiveCardIndex(
          (currentIndex) => (currentIndex + 1) % cards.length
        );

        setIsCardVisible(true);
      }, 500);

      return () => clearTimeout(timeout);
    }, 60000);

    return () => clearInterval(interval);
  }, [cards.length]);

  /*
   * Keep the mobile More popup positioned directly below
   * the More button while remaining centered in the viewport.
   */
  useEffect(() => {
    if (!isMoreOpen) return;

    const updateMorePopupPosition = () => {
      if (!moreButtonRef.current) return;

      const rect = moreButtonRef.current.getBoundingClientRect();

      setMorePopupTop(rect.bottom + 10);
    };

    updateMorePopupPosition();

    window.addEventListener('resize', updateMorePopupPosition);
    window.addEventListener('scroll', updateMorePopupPosition, true);

    return () => {
      window.removeEventListener('resize', updateMorePopupPosition);
      window.removeEventListener('scroll', updateMorePopupPosition, true);
    };
  }, [isMoreOpen]);

  const activeCard = cards[activeCardIndex];

  return (
    <>
      <section className="relative overflow-visible bg-white pb-0 sm:pb-8 lg:pb-0">
        <div className="mx-auto w-full max-w-[1440px]">

          {/* =====================================================
              MAIN HERO GRID
          ====================================================== */}
          <div
            className="
              grid
              grid-cols-1
              items-start
              lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]
              lg:gap-10
              xl:gap-14
            "
          >

            {/* =================================================
                LEFT SIDE
            ================================================== */}
            <div className="relative z-40 pt-1">

              {/* =================================================
                  EYEBROW
              ================================================== */}
              <div className="flex justify-center lg:justify-start">
                <div
                  className="
                    mb-5
                    inline-flex
                    min-h-[28px]
                    max-w-full
                    items-center
                    gap-1.5
                    rounded-full
                    px-3
                    sm:mb-6
                    sm:min-h-[30px]
                    sm:px-3.5
                  "
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: 1,
                    background:
                      'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                    color: '#806DB6',
                  }}
                >
                  <svg
                    className="h-[14px] w-[14px] flex-shrink-0 sm:h-[15px] sm:w-[15px]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 3L19 6V11C19 15.55 16.01 19.74 12 21C7.99 19.74 5 15.55 5 11V6L12 3Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 12L11 14L15 10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="whitespace-nowrap">
                    Adventure Safety Intelligence
                  </span>
                </div>
              </div>

              {/* =================================================
                  H1
              ================================================== */}
              <h1
                className="
                  m-0
                  text-center
                  text-[#29243F]
                  text-[42px]
                  leading-[1.05]
                  tracking-[-1.4px]
                  sm:text-[50px]
                  sm:tracking-[-1.8px]
                  lg:text-left
                  lg:text-[62px]
                  lg:leading-[1.03]
                  lg:tracking-[-2.4px]
                "
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 730,
                }}
              >
                Know if it&apos;s{' '}
                <span className="text-[#806DB6]">safe</span>

                <br className="hidden lg:block" />

                {' '}before you pay

                <br className="hidden lg:block" />

                {' '}a deposit.
              </h1>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}
              <p
                className="
                  mx-auto
                  mt-5
                  max-w-[590px]
                  text-center
                  text-[#625C70]
                  sm:mt-6
                  lg:mx-0
                  lg:text-left
                "
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '18px',
                  fontWeight: 300,
                  lineHeight: 1.5,
                  letterSpacing: '-0.1px',
                }}
              >
                Check an adventure provider by company name,
                <br className="hidden sm:block" />
                {' '}website, or social media handle.
              </p>

              {/* =================================================
                  SEARCH
              ================================================== */}
              <div
                className="
                  mx-auto
                  mt-6
                  flex
                  min-h-[56px]
                  w-full
                  max-w-[760px]
                  flex-wrap
                  items-center
                  rounded-[14px]
                  border
                  border-[#E2DDF0]
                  bg-[#FAF9FE]
                  p-1.5
                  shadow-[0_5px_18px_rgba(43,39,64,0.06)]
                  sm:mt-7
                  sm:min-h-[60px]
                  lg:mx-0
                  lg:max-w-none
                  lg:w-[calc(100%+90px)]
                  lg:flex-nowrap
                "
              >

                {/* Search icon */}
                <div
                  className="
                    flex
                    h-[42px]
                    w-[38px]
                    flex-shrink-0
                    items-center
                    justify-center
                    sm:h-[50px]
                    sm:w-[46px]
                  "
                >
                  <svg
                    className="h-[19px] w-[19px] text-[#8F8998] sm:h-[21px] sm:w-[21px]"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="10.8"
                      cy="10.8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M16 16L21 21"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Input */}
                <div
                  className="
                    min-w-0
                    flex-1
                    basis-[calc(100%-38px)]
                    sm:basis-auto
                  "
                >
                  <input
                    type="text"
                    placeholder="Search by company name, website, or social media handle"
                    className="
                      block
                      h-[42px]
                      w-full
                      min-w-0
                      bg-transparent
                      px-0
                      font-inter
                      text-[12px]
                      text-[#29243F]
                      outline-none
                      placeholder:text-[#9A95A3]
                      sm:h-[50px]
                      sm:text-[13px]
                      md:text-[14px]
                      lg:text-[15px]
                    "
                  />
                </div>

                {/* Analyse button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="
                    mt-1
                    flex
                    h-[44px]
                    w-full
                    flex-shrink-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-[11px]
                    bg-[#B29DE8]
                    px-3
                    text-white
                    transition-colors
                    hover:bg-[#9D85DB]
                    sm:mt-0
                    sm:h-[50px]
                    sm:w-auto
                    sm:px-4
                  "
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  <span className="whitespace-nowrap">
                    Analyse Adventure
                  </span>

                  <svg
                    className="h-[17px] w-[17px] flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="M13 6L19 12L13 18"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* =================================================
                  ADVENTURE TYPE
              ================================================== */}
              <div
                className="
                  relative
                  z-[99999]
                  mx-auto
                  mt-5
                  w-full
                  max-w-[760px]
                  sm:mt-6
                  lg:mx-0
                  lg:max-w-none
                  lg:w-[calc(100%+90px)]
                "
              >

                <div
                  className="
                    mb-3
                    text-center
                    text-[#514B63]
                    lg:text-left
                  "
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  Adventure type:
                </div>

                {/* =================================================
                    VISIBLE CHIPS
                ================================================== */}
                <div
                  className="
                    flex
                    w-full
                    flex-wrap
                    justify-center
                    gap-x-1.5
                    gap-y-2
                    sm:gap-x-2
                    sm:gap-y-2.5
                    lg:justify-start
                    lg:gap-x-3
                    lg:gap-y-3
                  "
                >
                  {visibleChips.map((chip) => (
                    <span
                      key={chip}
                      className="
                        inline-flex
                        min-h-[30px]
                        flex-shrink-0
                        items-center
                        rounded-full
                        border
                        border-black/[0.18]
                        bg-[#C7B5F5]/25
                        px-[10px]
                        text-[#806DB6]
                        sm:min-h-[32px]
                        sm:px-[12px]
                        lg:min-h-[36px]
                        lg:px-[17px]
                      "
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                    >
                      {chip}
                    </span>
                  ))}

                  {/* =================================================
                      MORE DROPDOWN
                  ================================================== */}
                  <div className="relative">

                    <button
                      ref={moreButtonRef}
                      type="button"
                      onClick={() => setIsMoreOpen((open) => !open)}
                      aria-expanded={isMoreOpen}
                      className="
                        inline-flex
                        min-h-[30px]
                        items-center
                        gap-1
                        rounded-full
                        border
                        border-[#806DB6]/30
                        bg-[#EDE7FB]
                        px-[11px]
                        text-[#806DB6]
                        transition-colors
                        hover:bg-[#E2DBF7]
                        sm:min-h-[32px]
                        sm:px-[13px]
                        lg:min-h-[36px]
                        lg:px-[17px]
                      "
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      <span>More</span>

                      <svg
                        className={`
                          h-3.5
                          w-3.5
                          transition-transform
                          duration-200
                          ${isMoreOpen ? 'rotate-180' : ''}
                        `}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {isMoreOpen && (
                      <div
                        className="
                          fixed
                          left-1/2
                          top-[var(--more-popup-top)]
                          z-[999999]
                          w-[min(420px,calc(100vw-32px))]
                          -translate-x-1/2
                          rounded-[16px]
                          border
                          border-[#DDD6EA]
                          bg-[#F7F5FD]
                          p-4
                          shadow-[0_18px_45px_rgba(43,39,64,0.18)]
                          lg:absolute
                          lg:left-0
                          lg:top-[calc(100%+10px)]
                          lg:w-[min(420px,calc(100vw-32px))]
                          lg:translate-x-0
                        "
                        style={
                          {
                            '--more-popup-top': `${morePopupTop}px`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex max-h-[280px] flex-wrap gap-2.5 overflow-y-auto">
                          {moreChips.map((chip) => (
                            <span
                              key={chip}
                              className="
                                inline-flex
                                min-h-[34px]
                                items-center
                                rounded-full
                                border
                                border-black/[0.18]
                                bg-[#C7B5F5]/20
                                px-[15px]
                                text-[#806DB6]
                              "
                              style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: 1.2,
                              }}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                DESKTOP RIGHT SIDE
            ================================================== */}
            <div className="relative mt-5 hidden min-h-[500px] lg:block">

              {/* =================================================
                  DIAGONAL IMAGE STRIP
              ================================================== */}
              <div className="absolute right-0 top-0 w-full max-w-[650px]">

                <div
                  className="
                    relative
                    h-[320px]
                    w-full
                    overflow-hidden
                    rounded-[20px]
                    bg-white
                    shadow-[0_10px_30px_rgba(43,39,64,0.08)]
                  "
                >

                  {bannerImages.map((image, index) => (
                    <div
                      key={image.src + index}
                      className="
                        absolute
                        inset-y-0
                        overflow-hidden
                      "
                      style={{
                        left: `${index * 22}%`,
                        width: '34%',
                        zIndex: index + 1,
                        clipPath:
                          index === 0
                            ? 'polygon(0% 0%, 100% 0%, 82% 100%, 0% 100%)'
                            : index === bannerImages.length - 1
                              ? 'polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)'
                              : 'polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)',
                      }}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 16vw"
                        priority={index < 2}
                        className="object-cover"
                        style={{
                          objectPosition:
                            index === 0
                              ? 'center 35%'
                              : index === 1
                                ? 'center 30%'
                                : index === 2
                                  ? 'center 45%'
                                  : 'center 35%',
                        }}
                      />
                    </div>
                  ))}

                  {/* Subtle overlay */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-20
                      bg-gradient-to-r
                      from-black/[0.025]
                      via-transparent
                      to-black/[0.05]
                    "
                  />

                  {/* Border */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-30
                      rounded-[20px]
                      ring-1
                      ring-inset
                      ring-black/[0.05]
                    "
                  />

                </div>
              </div>

              {/* =================================================
                  DESKTOP ROTATING SAFETY CARD
              ================================================== */}
              <div
                className={`
                  absolute
                  right-[-2%]
                  top-[215px]
                  z-40
                  w-[292px]
                  rounded-[20px]
                  border
                  border-[#DDD6EA]
                  bg-[#F7F5FD]
                  p-[16px]
                  shadow-[0_18px_45px_rgba(43,39,64,0.16)]
                  transition-all
                  duration-600
                  ease-out
                  ${
                    isCardVisible
                      ? 'translate-y-0 translate-x-0 scale-100 opacity-100'
                      : 'translate-y-4 translate-x-3 scale-[0.97] opacity-0'
                  }
                `}
              >
                <SafetyCardContent
                  card={activeCard}
                  activeCardIndex={activeCardIndex}
                  desktop
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              MOBILE VISUAL
          ====================================================== */}
          <div className="relative mt-8 block lg:hidden">

            {/* =================================================
                MOBILE IMAGE GRID
            ================================================== */}
            <div className="relative h-[430px] w-full">

              {/* Top-left */}
              <div className="absolute left-0 top-0 h-[200px] w-[48%] overflow-hidden rounded-[7px]">
                <Image
                  src="/images/paragliding.jpg"
                  alt="Paragliding adventure"
                  fill
                  sizes="48vw"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 35%',
                  }}
                />
              </div>

              {/* Top-right */}
              <div className="absolute right-0 top-0 h-[200px] w-[48%] overflow-hidden rounded-[7px]">
                <Image
                  src="/images/hiking.jpg"
                  alt="Mountain hiking adventure"
                  fill
                  sizes="48vw"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 30%',
                  }}
                />
              </div>

              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 h-[200px] w-[48%] overflow-hidden rounded-[7px]">
                <Image
                  src="/images/snowboarding.jpg"
                  alt="Snowboarding adventure"
                  fill
                  sizes="48vw"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 35%',
                  }}
                />
              </div>

              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 h-[200px] w-[48%] overflow-hidden rounded-[7px]">
                <Image
                  src="/images/kayaking.jpg"
                  alt="Kayaking adventure"
                  fill
                  sizes="48vw"
                  className="object-cover"
                  style={{
                    objectPosition: 'center 45%',
                  }}
                />
              </div>
            </div>

            {/* =================================================
                MOBILE ROTATING SAFETY CARD
            ================================================== */}
            <div
              className={`
                relative
                z-10
                mx-auto
                mt-7
                w-[300px]
                rounded-[20px]
                border
                border-[#DDD6EA]
                bg-[#F7F5FD]
                p-4
                shadow-[0_15px_35px_rgba(43,39,64,0.15)]
                transition-all
                duration-600
                ease-out
                ${
                  isCardVisible
                    ? 'translate-y-0 translate-x-0 scale-100 opacity-100'
                    : 'translate-y-4 translate-x-3 scale-[0.97] opacity-0'
                }
              `}
            >
              <SafetyCardContent
                card={activeCard}
                activeCardIndex={activeCardIndex}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WAITLIST MODAL
      ====================================================== */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/* =============================================================
   SAFETY CARD CONTENT
============================================================= */

function SafetyCardContent({
  card,
  activeCardIndex,
  desktop = false,
}: {
  card: SafetyCardData;
  activeCardIndex: number;
  desktop?: boolean;
}) {
  const statusColor =
    card.score === 25
      ? '#D94A4A'
      : card.score === 50
        ? '#f2ea01'
        : '#806DB6';

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================== */}
      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <svg
            className="h-5 w-5 flex-shrink-0 text-[#806DB6]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 3L19 6V11C19 15.55 16.01 19.74 12 21C7.99 19.74 5 15.55 5 11V6L12 3Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M8.8 12L11 14.2L15.5 9.8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span
            className="text-[#29243F]"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: desktop ? '15px' : '16px',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Safety Card
          </span>
        </div>

        {card.isExample && (
          <span
            className="rounded-full bg-[#F1EDF8] px-2 py-1 text-[#806DB6]"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '8px',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            EXAMPLE
          </span>
        )}
      </div>

      {/* =================================================
          SCORE PANEL
      ================================================== */}
      <div className="rounded-[9px] bg-[#ECE5FB] px-4 py-3.5">

        <p
          className="text-[#806DB6]"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          Safety Score
        </p>

        <div className="mt-1 flex items-end justify-between">

          <div className="flex items-baseline">

            <span
              className="text-[#29243F]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: desktop ? '58px' : '50px',
                fontWeight: 600,
                lineHeight: 0.9,
                letterSpacing: '-1.5px',
              }}
            >
              {card.score}
            </span>

            <span
              className="ml-1 text-[#29243F]"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: desktop ? '17px' : '16px',
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              /100
            </span>

          </div>

          <span
            className="pb-1"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: 1,
              color: statusColor,
            }}
          >
            {card.status}
          </span>
        </div>

        {/* Provider */}
        <div className="mt-3">

          <span
            className="
              inline-flex
              max-w-full
              rounded-full
              border
              border-[#D9D0E8]
              bg-white/70
              px-3
              py-1.5
              text-[#625C70]
            "
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: desktop ? '12px' : '13px',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            <span className="truncate">
              {card.provider}
            </span>
          </span>
        </div>

        {/* Progress */}
        <div className="mt-3 h-[7px] overflow-hidden rounded-full bg-[#D3CEDA]">

          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(Math.max(card.score, 0), 100)}%`,
              backgroundColor: statusColor,
            }}
          />

        </div>
      </div>

      {/* =================================================
          DETAILS
      ================================================== */}
      <div className="mt-4 space-y-3.5">

        {card.details.map((detail, index) => (
          <SafetyDetail
            key={`${activeCardIndex}-${detail.label}`}
            title={detail.label}
            description={detail.value}
            descriptionColor={statusColor}
            showLine={index < card.details.length - 1}
          />
        ))}

      </div>
    </div>
  );
}

/* =============================================================
   SAFETY DETAIL
============================================================= */

function SafetyDetail({
  title,
  description,
  descriptionColor,
  showLine = false,
}: {
  title: string;
  description: string;
  descriptionColor: string;
  showLine?: boolean;
}) {
  return (
    <div className="relative flex gap-2">

      {/* Icon */}
      <div className="relative flex h-[22px] w-[22px] flex-shrink-0 items-start justify-center">

        <div className="relative z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#F1EDF8]">

          <svg
            className="h-[15px] w-[15px] text-[#806DB6]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 3L19 6V11C19 15.55 16.01 19.74 12 21C7.99 19.74 5 15.55 5 11V6L12 3Z"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M8.8 12L11 14.2L15.5 9.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        </div>

        {showLine && (
          <span className="absolute left-1/2 top-[20px] h-[calc(100%+14px)] w-px -translate-x-1/2 bg-[#D1C9E1]" />
        )}

      </div>

      {/* Text */}
      <div className="min-w-0 pt-[1px]">

        <p
          className="text-[#29243F]"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.25,
          }}
        >
          {title}
        </p>

        <p
          className="mt-[3px]"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            lineHeight: 1.3,
            color: descriptionColor,
          }}
        >
          {description}
        </p>

      </div>
    </div>
  );
}