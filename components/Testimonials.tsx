'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string | null;
  rating: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetch('/api/safety-reviews', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load safety reviews.');
        return (await response.json()) as { reviews: Testimonial[] };
      })
      .then((data) => {
        if (isActive) setTestimonials(data.reviews);
      })
      .catch(() => {
        if (isActive) setHasError(true);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const visibleTestimonials = Array.from(
    { length: Math.min(3, testimonials.length) },
    (_, index) => testimonials[index]
  );

  return (
    <section
      id="safety-reviews"
      className="mx-auto mb-8 w-full max-w-[1440px] scroll-mt-8 bg-white"
    >
      <div
        className="w-full rounded-[20px] px-4 py-4 sm:px-8 sm:py-5"
        style={{
          background:
            'linear-gradient(90deg, rgba(237,231,251,0.8) 0%, rgba(199,181,245,0.8) 100%)',
        }}
      >
        <div className="mb-3 text-center">
          <h2
            className="font-poppins font-bold text-[#2B2740]"
            style={{
              fontSize: 'clamp(20px, 2.1vw, 30px)',
              lineHeight: '1.25',
            }}
          >
            What our users say
          </h2>
          <p className="mt-1 font-inter text-[14px] font-medium leading-[1.5] text-[#7E6BB3]">
            Hear directly from other travellers from across the globe.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl bg-white/80 px-4 py-8 text-center font-inter text-sm text-[#7E6BB3]">
            Loading safety reviews...
          </div>
        ) : visibleTestimonials.length > 0 ? (
          <div className="flex items-center gap-3 sm:gap-8">
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-3 sm:gap-5">
              {visibleTestimonials.map((item) => (
                <article
                  key={item.id}
                  className="flex min-h-[150px] flex-col justify-between rounded-[12px] border border-[#F6F4FE] bg-white px-3 py-2.5 shadow-xs sm:px-4"
                >
                  <div className="min-h-0">
                    <span className="block h-5 font-serif text-[28px] leading-[1] text-[#9A83D3]">
                      “
                    </span>
                    <p className="line-clamp-3 font-inter text-[13px] font-normal leading-[1.3] text-[#686868]">
                      {item.quote}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-2 pt-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt=""
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 flex-shrink-0 rounded-full border border-[#EDE7FB] object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#EDE7FB] bg-[#EDE7FB] font-poppins text-sm font-semibold text-[#7E6BB3]">
                          {item.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-poppins text-[12px] font-semibold leading-tight text-[#2B2740]">
                          {item.name}
                        </h3>
                        <p className="truncate font-inter text-[10px] leading-tight text-[#686868]">
                          {item.location}
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex flex-shrink-0 gap-px text-[18px] leading-none"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= item.rating
                              ? 'text-[#FFC400]'
                              : 'text-[#D8D8D8]'
                          }
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link
              href="/safety-reviews"
              aria-label="Read all safety reviews"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white bg-transparent text-white transition hover:bg-white/20 sm:h-[52px] sm:w-[52px]"
            >
              <FiChevronRight className="h-7 w-7" strokeWidth={1.2} />
            </Link>
          </div>
        ) : (
          <div className="rounded-[12px] border border-white/80 bg-white/80 px-4 py-6 text-center">
            <p className="font-poppins text-[14px] font-semibold text-[#2B2740]">
              {hasError
                ? 'Safety reviews are temporarily unavailable.'
                : 'No reviews submitted yet'}
            </p>
            {!hasError && (
              <p className="mt-1 font-inter text-[13px] text-[#7E6BB3]">
                Be the first traveller to share an adventure safety experience.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}