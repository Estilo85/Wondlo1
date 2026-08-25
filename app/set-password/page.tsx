'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return setMessage('Invalid or missing reset link.');

    setLoading(true);
    try {
      // Direct Firebase Client Auth action to consume oobCode
      await confirmPasswordReset(auth, oobCode, password);
      router.push('/signin');
    } catch (err: any) {
      setMessage(err.message || 'Error setting password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-[#EDE7FB] shadow-sm w-full max-w-md text-center">
      <h2 className="font-poppins font-semibold text-xl mb-4">Set Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs text-gray-500 mb-1">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF9FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#7E6BB3]"
          />
        </div>

        {message && <p className="text-xs text-red-500 text-center">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#C7B5F5] hover:bg-[#7E6BB3] text-white font-poppins font-semibold text-xs rounded-md transition"
        >
          {loading ? 'Saving...' : 'Set Password'}
        </button>
      </form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <SetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}