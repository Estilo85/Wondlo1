'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './globals.css';

export default function GlobalError({
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
    <html lang="en">
      <body className="bg-[#FAF9FE] text-[#2B2740] antialiased">
        <title>Wondlo - Something went wrong</title>

        <div className="flex min-h-screen items-center justify-center bg-[#FAF9FE] px-4 py-20">
          <div className="w-full max-w-lg rounded-3xl bg-[#F6F4FE] p-8 text-center sm:p-12">
            <p className="font-inter text-sm font-semibold tracking-wide text-[#7E6BB3]">
              Something went wrong
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#2B2740] sm:text-4xl">
              We hit an unexpected error
            </h1>

            <p className="mt-5 text-sm leading-6 text-[#4A4560]">
              This one is on us. Your searches and saved reports are safe. Try
              again, and if it keeps happening please get in touch.
            </p>

            {error.digest && (
              <p className="mt-4 text-xs text-[#6B7280]">
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
                href="/"
                className="w-full rounded-[20px] border-2 border-[#C7B5F5] px-6 py-3 text-sm font-semibold text-[#2B2740] transition-all hover:bg-[#EDE7FB] sm:w-auto"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
