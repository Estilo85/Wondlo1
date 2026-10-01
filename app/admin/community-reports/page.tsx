'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import ResultsNavbar from '@/components/ResultsNavbar';
import { auth } from '@/lib/firebase-client';

type ReportRow = {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  resolution: string | null;
  createdAt: string;
  resolvedAt: string | null;
  reporter: string;
  kind: 'post' | 'comment';
  target: {
    id: string;
    title: string;
    body: string;
    meta: string;
    author: string;
    createdAt: string;
  } | null;
};

const FILTERS = [
  { value: 'open', label: 'Open' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: 'removed', label: 'Removed' },
  { value: 'all', label: 'All' },
] as const;

type FilterValue = (typeof FILTERS)[number]['value'];

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommunityReportsPage() {
  const [authReady, setAuthReady] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [filter, setFilter] = useState<FilterValue>('open');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadReports = useCallback(async (nextFilter: FilterValue) => {
    const user = auth?.currentUser;

    if (!user) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const query =
        nextFilter === 'all' ? '' : `?status=${encodeURIComponent(nextFilter)}`;
      const response = await fetch(`/api/admin/community-reports${query}`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || 'Unable to load reports.');
        return;
      }

      setAccessDenied(false);
      setReports((data.reports ?? []) as ReportRow[]);
      setError('');
    } catch {
      setError('Unable to load reports.');
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      setAuthReady(true);

      if (!firebaseUser) {
        setAccessDenied(true);
        return;
      }

      void loadReports(filter);
    });
  }, [filter, loadReports]);

  const resolveReport = async (id: string, status: 'dismissed' | 'removed') => {
    const user = auth?.currentUser;

    if (!user) {
      return;
    }

    if (
      status === 'removed' &&
      !window.confirm(
        'Remove this content for good? It cannot be brought back and every report against it is cleared.'
      )
    ) {
      return;
    }

    setBusyId(id);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/community-reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data?.error || 'Unable to update this report.');
        return;
      }

      setError('');
      await loadReports(filter);
    } catch {
      setError('Unable to update this report.');
    } finally {
      setBusyId(null);
    }
  };

  if (!authReady) {
    return <div className="min-h-screen bg-[#FAF9FE]" />;
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
        <ResultsNavbar />

        <main className="mx-auto w-full max-w-3xl flex-grow px-4 py-16">
          <h1 className="font-poppins text-[32px] font-bold">Community Reports</h1>

          <p className="mt-4 font-inter text-[15px] leading-6 text-[#4A4560]">
            This queue is limited to moderators. If you need to review reports,
            add your account address to COMMUNITY_ADMIN_EMAILS.
          </p>

          <Link
            href="/community"
            className="mt-8 inline-flex h-[48px] items-center rounded-[8px] bg-[linear-gradient(90deg,#7E6BB3_25%,#2B2740_100%)] px-6 font-inter text-[15px] font-semibold text-white"
          >
            Back to Community
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <ResultsNavbar />

      <main className="mx-auto w-full max-w-[1100px] flex-grow px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="font-poppins text-[32px] font-bold">Community Reports</h1>

        <div
          className="my-5 h-[2px] w-[100px]"
          style={{
            background: 'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
          }}
        />

        <p className="font-inter text-sm leading-6 text-[#4A4560]">
          Reported posts and comments. Removing content deletes it for everyone.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={`h-[40px] rounded-full px-5 font-inter text-[14px] font-semibold transition-colors ${
                filter === option.value
                  ? 'bg-[#7E6BB3] text-white'
                  : 'border border-[#7E6BB3] bg-[#F6F4FE] text-[#2B2740] hover:bg-[#EDE7FB]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error && (
          <p
            role="status"
            className="mt-6 rounded-[8px] bg-[#FFF1E8] px-4 py-3 font-inter text-[14px] text-[#C51D14]"
          >
            {error}
          </p>
        )}

        {reports.length === 0 && !error && (
          <p className="mt-8 rounded-[10px] border border-[#7E6BB3]/30 bg-[#F6F4FE] px-5 py-8 text-center font-inter text-[15px] text-black/60">
            Nothing to review here.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-[12px] border border-[#7E6BB3]/40 bg-white p-5 shadow-[0_3px_5px_rgba(0,0,0,0.08)]"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rounded-full bg-[#EDE7FB] px-3 py-1 font-inter text-[12px] font-semibold uppercase tracking-wide text-[#7E6BB3]">
                  {report.kind}
                </span>

                <span className="font-inter text-[13px] font-semibold text-black/60">
                  {report.reason}
                </span>

                <span className="font-inter text-[13px] text-black/45">
                  Reported by {report.reporter} · {formatDate(report.createdAt)}
                </span>

                {report.status !== 'open' && (
                  <span className="rounded-full bg-[#F6F4FE] px-3 py-1 font-inter text-[12px] font-semibold text-black/55">
                    {report.status}
                  </span>
                )}
              </div>

              {report.details && (
                <p className="mt-3 rounded-[8px] bg-[#F6F4FE] px-4 py-3 font-inter text-[14px] leading-relaxed text-[#2B2740]">
                  {report.details}
                </p>
              )}

              {report.target ? (
                <div className="mt-4 rounded-[10px] border border-[#7E6BB3]/25 bg-[#FAF9FE] px-4 py-3">
                  <p className="font-inter text-[15px] font-semibold text-[#2B2740]">
                    {report.target.title}
                  </p>

                  <p className="mt-1 font-inter text-[12px] uppercase tracking-wide text-black/50">
                    {report.target.meta} · by {report.target.author} ·{' '}
                    {formatDate(report.target.createdAt)}
                  </p>

                  <p className="mt-2 line-clamp-4 font-inter text-[14px] leading-relaxed text-[#4A4560]">
                    {report.target.body}
                  </p>
                </div>
              ) : (
                <p className="mt-4 rounded-[10px] bg-[#F6F4FE] px-4 py-3 font-inter text-[14px] text-black/55">
                  The reported content has already been removed.
                </p>
              )}

              {report.status === 'open' && (
                <div className="mt-4 flex flex-col gap-3 border-t border-[#7E6BB3]/15 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => void resolveReport(report.id, 'dismissed')}
                    disabled={busyId === report.id}
                    className="h-[42px] rounded-[8px] border border-[#2B2740] bg-[#F6F4FE] px-5 font-inter text-[14px] font-semibold text-[#2B2740] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Dismiss
                  </button>

                  <button
                    type="button"
                    onClick={() => void resolveReport(report.id, 'removed')}
                    disabled={busyId === report.id}
                    className="h-[42px] rounded-[8px] bg-[#C51D14] px-5 font-inter text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove content
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
