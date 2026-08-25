'use client';

import { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function RedirectingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || 'https://t.me/joinwandlo';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9FE] flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl border border-[#EDE7FB] shadow-sm max-w-sm text-center flex flex-col items-center">
        <FaCheckCircle className="text-green-500 text-5xl mb-4" />
        <h2 className="font-poppins font-bold text-xl text-[#2B2740] mb-2">You're in!</h2>
        <p className="text-xs text-gray-500 mb-6">
          Thanks for joining.<br />
          You're being redirected to our Telegram Community...
        </p>
        <div className="text-xs text-[#7E6BB3] flex items-center gap-2 font-medium">
          <span className="animate-spin">🌀</span> Redirecting...
        </div>
      </div>
    </main>
  );
}