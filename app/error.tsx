'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9FE] px-4 py-20">
      <div
        className="w-full max-w-lg rounded-3xl p-8 text-center sm:p-12"
        style={{
          backgroundColor: '#F6F4FE',
          border: '0.1px solid rgba(43, 39, 64, 0.10)',
          boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
        }}
      >
        <p className="font-inter text-sm font-semibold tracking-wide text-[#7E6BB3]">
          Something went wrong
        </p>

        <h1 className="mt-3 font-poppins text-3xl font-bold text-[#2B2740] sm:text-4xl">
          This didn&apos;t load properly
        </h1>

        <div
          className="mx-auto my-5 h-[2px] w-[100px]"
          style={{
            background: 'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
          }}
        />

        <p className="font-inter text-sm leading-6 text-[#4A4560]">
          An unexpected error interrupted this page. Your searches and saved
          reports are unaffected. Try again, and if it keeps happening let us
          know.
        </p>

        {error.digest && (
          <p className="mt-4 font-inter text-xs text-[#6B7280]">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="w-full cursor-pointer rounded-[20px] bg-[#8B6BCB] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#7A5BB8] sm:w-auto"
          >
            Try Again
          </button>

          <Link
            href="/report-issue"
            className="w-full rounded-[20px] border-2 border-[#C7B5F5] px-6 py-3 text-sm font-semibold text-[#2B2740] transition-all hover:bg-[#EDE7FB] sm:w-auto"
          >
            Report This
          </Link>
        </div>
      </div>
    </div>
  );
}
