'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Clean external redirect to your Telegram group
      window.location.href = 'https://t.me/joinwandlo';
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
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
          <form onSubmit={handleSignIn} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] text-gray-400 font-inter mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] text-gray-400 font-inter">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gray-400 hover:text-[#9B88ED] font-inter flex items-center gap-1"
                >
                  {showPassword ? 'Hide' : 'Show'} 👁
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
              />
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-xs mx-auto block py-2 bg-[#9B88ED] hover:bg-[#8A75E3] text-white font-poppins font-bold text-xs rounded-full transition shadow-xs"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

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