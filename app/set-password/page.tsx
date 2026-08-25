'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Safely decode the email parameter to properly handle %40 characters from the link
  const rawEmail = searchParams.get('email') || '';
  const email = decodeURIComponent(rawEmail);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to set password.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/signin');
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9FE] p-10 rounded-2xl border border-[#EDE7FB] shadow-xs w-full max-w-md text-center">
      <h2 className="text-lg font-poppins font-bold text-[#2B2740] mb-2">Set Your Password</h2>
      <p className="text-xs text-gray-500 mb-6">For account: <span className="font-semibold">{email}</span></p>

      {success ? (
        <div className="p-4 bg-green-50 text-green-700 text-xs rounded-md">
          Password set successfully! Redirecting you to sign in...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] text-gray-400 font-inter mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 font-inter mb-1">Confirm Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-xs mx-auto block py-2 bg-[#9B88ED] hover:bg-[#8A75E3] text-white font-poppins font-bold text-xs rounded-full transition shadow-xs"
            >
              {loading ? 'Saving Password...' : 'Save Password & Continue'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 my-12">
        <Suspense fallback={<div className="text-xs text-gray-400">Loading...</div>}>
          <SetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}