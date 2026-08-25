'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Failed to create account.');

      router.push('https://t.me/joinwandlo');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
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
        <div className="px-6 py-2 bg-[#9B88ED] text-white text-xs rounded-full font-poppins font-bold shadow-xs">
          3 Free Safety Checks
        </div>

        <div className="bg-[#FAF9FE] p-10 rounded-2xl border border-[#EDE7FB] shadow-xs w-full max-w-md text-center">
          <h2 className="font-poppins font-bold text-base text-[#2B2740] mb-1">Create an account</h2>
          <p className="text-[11px] text-gray-400 font-inter mb-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#9B88ED] font-bold hover:underline">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSignUp} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] text-gray-400 font-inter mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F6F4FE] border border-[#EDE7FB] rounded-md text-sm outline-none focus:border-[#9B88ED]"
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
              />
            </div>

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-xs mx-auto block py-2 bg-[#9B88ED] hover:bg-[#8A75E3] text-white font-poppins font-bold text-xs rounded-full transition shadow-xs"
              >
                {loading ? 'Creating account...' : 'Create an account'}
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#EDE7FB]"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#FAF9FE] px-2 text-gray-400 font-inter font-bold">or</span></div>
          </div>

          <div>
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