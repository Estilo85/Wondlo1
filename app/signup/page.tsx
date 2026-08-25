'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }

      setSuccessMessage(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReferBuddy = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE]">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 my-12 space-y-6">
        {/* 3 Safety Checks Pill */}
        <div className="px-6 py-2 bg-[#9B88ED] text-white text-xs rounded-full font-poppins font-bold shadow-xs">
          3 Free Safety Checks
        </div>

        <div className="bg-[#FAF9FE] p-10 rounded-2xl border border-[#EDE7FB] shadow-xs w-full max-w-md text-center">
          <h2 className="text-lg font-poppins font-bold text-[#2B2740] mb-2">Create an account</h2>
          
          {successMessage ? (
            <div className="p-4 bg-purple-50 border border-[#EDE7FB] text-[#2B2740] text-xs rounded-md space-y-2">
              <p className="font-semibold text-sm">Account created successfully!</p>
              <p>We’ve sent an email to <span className="font-semibold">{email}</span> from ZagoTours. Please check your inbox and click the link to set your password before signing in.</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] text-gray-400 font-inter mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 font-inter mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
                  placeholder="you@example.com"
                />
              </div>

              {error && <p className="text-xs text-red-500 text-center">{error}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full max-w-xs mx-auto block py-2 bg-[#9B88ED] hover:bg-[#8A75E3] text-white font-poppins font-bold text-xs rounded-full transition shadow-xs"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleReferBuddy}
              className="w-full max-w-xs mx-auto block py-2 border-2 border-[#9B88ED] bg-white text-[#2B2740] font-poppins font-bold text-xs rounded-full hover:bg-purple-50 transition shadow-xs"
            >
              {copied ? 'Link Copied!' : 'Refer your travel buddy'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}