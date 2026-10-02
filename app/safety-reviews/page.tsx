'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type SafetyReview = {
  id: string;
  quote: string;
  improvement: string | null;
  operatorName: string;
  activity: string;
  name: string;
  location: string;
  avatar: string | null;
  createdAt: string;
  rating: number;
  answers: {
    operatorAssessment: number;
    adventurePreparation: number;
    riskAwareness: number;
    safetyQuestions: number;
    realWorldAccuracy: number;
  };
};

const REVIEW_QUESTIONS: Array<{
  key: keyof SafetyReview['answers'];
  label: string;
}> = [
  { key: 'operatorAssessment', label: 'Operator safety assessment' },
  { key: 'adventurePreparation', label: 'Adventure preparation' },
  { key: 'riskAwareness', label: 'Risk awareness' },
  { key: 'safetyQuestions', label: 'Safety checks and questions' },
  { key: 'realWorldAccuracy', label: 'Real-world accuracy' },
];

export default function SafetyReviewsPage() {
  const [reviews, setReviews] = useState<SafetyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetch('/api/safety-reviews', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load safety reviews.');
        return (await response.json()) as { reviews: SafetyReview[] };
      })
      .then((data) => {
        if (isActive) setReviews(data.reviews);
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

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 sm:px-8 sm:py-14">
        <Link
          href="/#safety-reviews"
          className="mb-7 inline-flex items-center gap-2 font-inter text-sm font-semibold text-[#7E6BB3] hover:underline"
        >
          <FiArrowLeft aria-hidden="true" />
          Back to home
        </Link>

        <header className="mb-8 text-center">
          <h1 className="font-poppins text-3xl font-bold text-[#2B2740] sm:text-4xl">
            Traveller Safety Reviews
          </h1>
          <p className="mt-2 font-inter text-base text-[#7E6BB3]">
            Read travellers’ full experiences and ratings from their adventures.
          </p>
        </header>

        {isLoading ? (
          <p className="rounded-2xl bg-white p-8 text-center font-inter text-[#7E6BB3] shadow-sm">
            Loading safety reviews...
          </p>
        ) : hasError ? (
          <p role="alert" className="rounded-2xl bg-white p-8 text-center font-inter text-[#C51D14] shadow-sm">
            Safety reviews are temporarily unavailable. Please try again later.
          </p>
        ) : reviews.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center font-inter text-[#7E6BB3] shadow-sm">
            No safety reviews have been submitted yet.
          </p>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-[#EDE7FB] bg-white p-5 shadow-[0_4px_16px_rgba(43,39,64,0.07)] sm:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                      {review.operatorName}
                    </h2>
                    <p className="mt-1 font-inter text-sm text-[#686868]">
                      {review.activity} · {review.location}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 text-[#FFC400]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`h-5 w-5 ${star <= review.rating ? 'fill-current' : 'text-[#D8D8D8]'}`}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-1 font-inter text-sm font-semibold text-[#2B2740]">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <blockquote className="mt-5 whitespace-pre-wrap font-inter text-[15px] leading-relaxed text-[#55515F]">
                  “{review.quote}”
                </blockquote>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {REVIEW_QUESTIONS.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-3 rounded-xl bg-[#F6F4FE] px-4 py-3"
                    >
                      <span className="font-inter text-sm text-[#4A4560]">
                        {label}
                      </span>
                      <span className="whitespace-nowrap font-inter text-sm font-semibold text-[#7E6BB3]">
                        {review.answers[key]}/5
                      </span>
                    </div>
                  ))}
                </div>

                {review.improvement && (
                  <div className="mt-5 rounded-xl border border-[#EDE7FB] px-4 py-3">
                    <h3 className="font-inter text-sm font-semibold text-[#2B2740]">
                      What could have helped more
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap font-inter text-sm leading-relaxed text-[#55515F]">
                      {review.improvement}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex items-center gap-3 border-t border-[#F0EDF8] pt-4">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 rounded-full border border-[#EDE7FB] object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE7FB] font-poppins font-semibold text-[#7E6BB3]">
                      {review.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-poppins text-sm font-semibold text-[#2B2740]">
                      {review.name}
                    </p>
                    <time
                      dateTime={review.createdAt}
                      className="font-inter text-xs text-[#77727F]"
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}