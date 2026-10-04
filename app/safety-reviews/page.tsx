'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiStar } from 'react-icons/fi';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type SafetyReview = {
  id: string;
  isOwner: boolean;
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

type ReviewDraft = {
  operatorName: string;
  activity: string;
  country: string;
  experience: string;
  improvement: string;
  answers: SafetyReview['answers'];
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
  const router = useRouter();
  const [reviews, setReviews] = useState<SafetyReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [savingReview, setSavingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadReviews = async () => {
      try {
        const token = await auth?.currentUser?.getIdToken();
        const response = await fetch('/api/safety-reviews', {
          cache: 'no-store',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!response.ok) throw new Error('Unable to load safety reviews.');
        const data = (await response.json()) as { reviews: SafetyReview[] };
        if (isActive) {
          setReviews(data.reviews);
          setHasError(false);
        }
      } catch {
        if (isActive) setHasError(true);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadReviews();
    const unsubscribe = auth
      ? onAuthStateChanged(auth, () => void loadReviews())
      : undefined;

    /*
     * Reviews are written from the community page, so returning to this tab has
     * to re-read them. Without this a traveller who just submitted a review
     * lands here and sees the list as it was before they pressed submit.
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadReviews();
      }
    };

    const handleFocus = () => {
      void loadReviews();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      isActive = false;
      unsubscribe?.();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const editReview = (review: SafetyReview) => {
    setActionMessage('');
    setEditingReviewId(review.id);
    setDraft({
      operatorName: review.operatorName,
      activity: review.activity,
      country: review.location,
      experience: review.quote,
      improvement: review.improvement ?? '',
      answers: { ...review.answers },
    });
  };

  const saveReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingReviewId || !draft || savingReview) return;

    setSavingReview(true);
    setActionMessage('');
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) throw new Error('Sign in again to edit your review.');

      const response = await fetch(`/api/safety-reviews/${encodeURIComponent(editingReviewId)}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update your review.');

      setEditingReviewId(null);
      setDraft(null);
      setActionMessage('Your review has been updated.');
      const refreshed = await fetch('/api/safety-reviews', {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshed.ok) {
        const updated = (await refreshed.json()) as { reviews: SafetyReview[] };
        setReviews(updated.reviews);
      }
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : 'Unable to update your review.');
    } finally {
      setSavingReview(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (deletingReviewId || !window.confirm('Delete this safety review? This cannot be undone.')) return;

    setDeletingReviewId(reviewId);
    setActionMessage('');
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) throw new Error('Sign in again to delete your review.');

      const response = await fetch(`/api/safety-reviews/${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete your review.');

      setReviews((current) => current.filter((review) => review.id !== reviewId));
      setActionMessage('Your review has been deleted.');
      if (editingReviewId === reviewId) {
        setEditingReviewId(null);
        setDraft(null);
      }
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : 'Unable to delete your review.');
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar backgroundColor="#FAF9FE" />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-10 sm:px-8 sm:py-14">
        <button
          type="button"
          onClick={() => {
            const requestedTarget = new URLSearchParams(window.location.search).get('returnTo');
            let returnTarget: string | null = null;

            if (requestedTarget?.startsWith('/') && !requestedTarget.startsWith('//')) {
              const target = new URL(requestedTarget, window.location.origin);
              if (target.origin === window.location.origin && target.pathname !== '/safety-reviews') {
                returnTarget = `${target.pathname}${target.search}${target.hash}`;
              }
            }

            if (returnTarget) {
              router.push(returnTarget);
            } else if (window.history.length > 1) {
              router.back();
            } else {
              router.push('/#safety-reviews');
            }
          }}
          className="mb-7 inline-flex items-center gap-2 font-inter text-sm font-semibold text-[#7E6BB3] hover:underline"
        >
          <FiArrowLeft aria-hidden="true" />
          Back
        </button>

        {actionMessage && (
          <p role="status" className="mb-5 rounded-xl bg-white px-4 py-3 font-inter text-sm text-[#7E6BB3] shadow-sm">
            {actionMessage}
          </p>
        )}

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

                {review.isOwner && editingReviewId !== review.id && (
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => editReview(review)}
                      className="rounded-lg border border-[#C7B5F5] px-4 py-2 font-inter text-sm font-semibold text-[#7E6BB3] hover:bg-[#F6F4FE]"
                    >
                      Edit review
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteReview(review.id)}
                      disabled={deletingReviewId === review.id}
                      className="rounded-lg border border-red-200 px-4 py-2 font-inter text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingReviewId === review.id ? 'Deleting…' : 'Delete review'}
                    </button>
                  </div>
                )}

                {editingReviewId === review.id && draft && (
                  <form onSubmit={saveReview} className="mt-5 space-y-4 rounded-xl bg-[#F6F4FE] p-4 sm:p-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {([
                        ['operatorName', 'Operator'],
                        ['activity', 'Activity'],
                        ['country', 'Country'],
                      ] as const).map(([key, label]) => (
                        <label key={key} className="block font-inter text-sm font-medium text-[#4A4560]">
                          {label}
                          <input
                            required
                            maxLength={key === 'operatorName' ? 120 : 100}
                            value={draft[key]}
                            onChange={(event) => setDraft((current) => current ? { ...current, [key]: event.target.value } : current)}
                            className="mt-1 w-full rounded-lg border border-[#DDD7EA] bg-white px-3 py-2 text-sm outline-none focus:border-[#8B6BCB]"
                          />
                        </label>
                      ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {REVIEW_QUESTIONS.map(({ key, label }) => (
                        <label key={key} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 font-inter text-sm text-[#4A4560]">
                          <span>{label}</span>
                          <select
                            value={draft.answers[key]}
                            onChange={(event) => setDraft((current) => current ? {
                              ...current,
                              answers: { ...current.answers, [key]: Number(event.target.value) },
                            } : current)}
                            className="rounded-md border border-[#DDD7EA] bg-white px-2 py-1 text-sm text-[#7E6BB3]"
                          >
                            {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score}/5</option>)}
                          </select>
                        </label>
                      ))}
                    </div>
                    <label className="block font-inter text-sm font-medium text-[#4A4560]">
                      Your experience
                      <textarea
                        required
                        minLength={20}
                        maxLength={1500}
                        rows={5}
                        value={draft.experience}
                        onChange={(event) => setDraft((current) => current ? { ...current, experience: event.target.value } : current)}
                        className="mt-1 w-full rounded-lg border border-[#DDD7EA] bg-white px-3 py-2 text-sm outline-none focus:border-[#8B6BCB]"
                      />
                    </label>
                    <label className="block font-inter text-sm font-medium text-[#4A4560]">
                      What could have helped more (optional)
                      <textarea
                        maxLength={1200}
                        rows={3}
                        value={draft.improvement}
                        onChange={(event) => setDraft((current) => current ? { ...current, improvement: event.target.value } : current)}
                        className="mt-1 w-full rounded-lg border border-[#DDD7EA] bg-white px-3 py-2 text-sm outline-none focus:border-[#8B6BCB]"
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button type="submit" disabled={savingReview} className="rounded-lg bg-[#7E6BB3] px-4 py-2 font-inter text-sm font-semibold text-white disabled:opacity-60">
                        {savingReview ? 'Saving…' : 'Save changes'}
                      </button>
                      <button type="button" disabled={savingReview} onClick={() => { setEditingReviewId(null); setDraft(null); }} className="rounded-lg border border-[#C7B5F5] px-4 py-2 font-inter text-sm font-semibold text-[#7E6BB3] disabled:opacity-60">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {editingReviewId !== review.id && <blockquote className="mt-5 whitespace-pre-wrap font-inter text-[15px] leading-relaxed text-[#55515F]">
                  “{review.quote}”
                </blockquote>}

                {editingReviewId !== review.id && <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                </div>}

                {editingReviewId !== review.id && review.improvement && (
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