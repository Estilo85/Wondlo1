'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaUserFriends } from 'react-icons/fa';

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }

      setSuccessMessage(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReferBuddy = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE]">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 pb-12 pt-24 sm:px-6 md:pt-28">
        <div className="w-full max-w-md">

          {/* =====================================================
              BADGE
          ====================================================== */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex rounded-full bg-[#7E6BB3] px-6 py-2 text-sm font-medium text-white">
              3 Free Safety Checks
            </span>
          </div>

          {/* =====================================================
              SIGN UP CARD
          ====================================================== */}
          <div
            className="
              rounded-[20px]
              border
              border-[#DDD7EA]
              bg-[#F6F4FE]
              p-6
              shadow-[0_2px_5px_rgba(47,39,64,0.08)]
              sm:p-8
            "
          >

            {/* =================================================
                HEADING
            ================================================== */}
            <h1
              className="
                mb-2
                text-center
                text-3xl
                font-semibold
                text-[#2B2740]
              "
            >
              Create an account
            </h1>

            {/* =================================================
                SIGN IN LINK
            ================================================== */}
            <p className="mb-8 text-center text-sm text-[#6B7280]">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-[#8B6BCB] hover:underline"
              >
                Sign In
              </Link>
            </p>

            {/* =================================================
                ERROR
            ================================================== */}
            {error && (
              <div className="mb-4 rounded-[15px] bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================== */}
            {successMessage ? (
              <div className="mb-4 rounded-[15px] bg-purple-50 p-4 text-sm text-[#2B2740]">
                <p className="font-semibold">
                  Account created successfully!
                </p>

                <p className="mt-2">
                  We’ve sent an email to{' '}
                  <span className="font-semibold">
                    {email}
                  </span>{' '}
                  from ZagoTours. Please check your inbox and
                  click the link to set your password before
                  signing in.
                </p>
              </div>
            ) : (
              /* =================================================
                  FORM
              ================================================== */
              <form
                onSubmit={handleSignup}
                className="space-y-4"
              >

                {/* =================================================
                    NAME
                ================================================== */}
                <div>
                  <label
                    className="
                      mb-1
                      block
                      text-sm
                      font-medium
                      text-[#2B2740]
                    "
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="
                      h-12
                      w-full
                      rounded-[10px]
                      border
                      border-[#DDD7EA]
                      bg-[#F6F4FE]
                      px-4
                      text-[#2B2740]
                      placeholder:text-[#A1A1AA]
                      transition-all
                      focus:border-[#8B6BCB]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#8B6BCB]/20
                    "
                  />
                </div>

                {/* =================================================
                    EMAIL
                ================================================== */}
                <div>
                  <label
                    className="
                      mb-1
                      block
                      text-sm
                      font-medium
                      text-[#2B2740]
                    "
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      h-12
                      w-full
                      rounded-[10px]
                      border
                      border-[#DDD7EA]
                      bg-[#F6F4FE]
                      px-4
                      text-[#2B2740]
                      placeholder:text-[#A1A1AA]
                      transition-all
                      focus:border-[#8B6BCB]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#8B6BCB]/20
                    "
                  />
                </div>

                {/* =================================================
                    ERROR
                ================================================== */}
                {error && (
                  <div className="rounded-[15px] bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* =================================================
                    CREATE ACCOUNT BUTTON
                ================================================== */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    h-12
                    w-full
                    rounded-[20px]
                    bg-[#8B6BCB]
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    hover:bg-[#7A5BB8]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? 'Creating Account...'
                    : 'Create an account'}
                </button>
              </form>
            )}

            {/* =====================================================
                DIVIDER
            ====================================================== */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DDD7EA]" />
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-[#F6F4FE] px-4 text-[#6B7280]">
                  or
                </span>
              </div>
            </div>

            {/* =====================================================
                REFER YOUR TRAVEL BUDDY
            ====================================================== */}
            <button
              type="button"
              onClick={handleReferBuddy}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-[20px]
                border-2
                border-[#C7B5F5]
                text-sm
                font-semibold
                text-[#2B2740]
                transition-all
                hover:bg-[#EDE7FB]
              "
            >
              <FaUserFriends className="text-[#8B6BCB]" />

              {copied
                ? 'Link Copied!'
                : 'Refer Your Travel Buddy'}
            </button>

            {/* =====================================================
                COPIED MESSAGE
            ====================================================== */}
            {copied && (
              <p className="mt-3 text-center text-sm text-green-600">
                Link copied to clipboard!
              </p>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}