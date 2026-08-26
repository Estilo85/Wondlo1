'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaUserFriends } from 'react-icons/fa';

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

        if (!auth) {
            setError('Authentication is not configured yet. Please contact support or add Firebase environment variables.');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'https://t.me/joinwandlo';
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid credentials.');
            setLoading(false);
        }
    };

    const handleReferBuddy = () => {
        const link = window.location.origin;

        navigator.clipboard
            .writeText(link)
            .then(() => {
                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch(() => {
                const textArea = document.createElement('textarea');

                textArea.value = link;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            });
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
                        SIGN IN CARD
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
                            Welcome back
                        </h1>

                        <p
                            className="
                                mb-8
                                text-center
                                text-sm
                                text-[#6B7280]
                            "
                        >
                            Sign in to continue to your account.
                        </p>


                        {/* =================================================
                            ERROR
                        ================================================== */}
                        {error && (
                            <div
                                className="
                                    mb-4
                                    rounded-[15px]
                                    bg-red-50
                                    p-3
                                    text-sm
                                    text-red-600
                                "
                            >
                                {error}
                            </div>
                        )}


                        {/* =================================================
                            SIGN IN FORM
                        ================================================== */}
                        <form
                            onSubmit={handleSignIn}
                            className="space-y-4"
                        >

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
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
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
                                PASSWORD
                            ================================================== */}
                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-medium
                                            text-[#2B2740]
                                        "
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (current) => !current
                                            )
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            text-xs
                                            text-[#6B7280]
                                            transition-colors
                                            hover:text-[#8B6BCB]
                                        "
                                    >
                                        {showPassword ? 'Hide' : 'Show'}

                                        <span
                                            aria-hidden="true"
                                            className="text-sm"
                                        >
                                            👁
                                        </span>
                                    </button>
                                </div>

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="
                                        h-12
                                        w-full
                                        rounded-[10px]
                                        border
                                        border-[#DDD7EA]
                                        bg-[#F6F4FE]
                                        px-4
                                        text-[#2B2740]
                                        transition-all
                                        focus:border-[#8B6BCB]
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-[#8B6BCB]/20
                                    "
                                />
                            </div>


                            {/* =================================================
                                SIGN IN BUTTON
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
                                    ? 'Signing in...'
                                    : 'Sign In'}
                            </button>

                        </form>


                        {/* =================================================
                            DIVIDER
                        ================================================== */}
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


                        {/* =================================================
                            REFER YOUR TRAVEL BUDDY
                        ================================================== */}
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

                            Refer Your Travel Buddy
                        </button>


                        {/* =================================================
                            COPIED MESSAGE
                        ================================================== */}
                        {copied && (
                            <p
                                className="
                                    mt-3
                                    text-center
                                    text-sm
                                    text-green-600
                                "
                            >
                                ✅ Link copied to clipboard!
                            </p>
                        )}

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}