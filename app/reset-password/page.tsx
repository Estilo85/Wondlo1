'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    confirmPasswordReset,
    verifyPasswordResetCode,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const oobCode = searchParams.get('oobCode') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (!auth) {
            setError(
                'Authentication is not configured yet. Please contact support or add Firebase environment variables.'
            );
            return;
        }

        if (!oobCode) {
            setError('This password reset link is invalid or has expired.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyPasswordResetCode(auth, oobCode);
            await confirmPasswordReset(auth, oobCode, password);

            setSuccess(true);

            setTimeout(() => {
                router.replace('/signin');
            }, 2500);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to reset your password. The link may have expired.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FAF9FE]">
            <Navbar />

            <div className="flex flex-1 items-center justify-center px-4 pb-12 pt-24 sm:px-6 md:pt-28">
                <div className="w-full max-w-md">

                    {/* BADGE */}
                    <div className="mb-6 flex justify-center">
                        <span className="inline-flex rounded-full bg-[#7E6BB3] px-6 py-2 text-sm font-medium text-white">
                            Reset Your Password
                        </span>
                    </div>

                    {/* RESET PASSWORD CARD */}
                    <div className="
                            rounded-[20px]
                            border
                            border-[#DDD7EA]
                            bg-[#F6F4FE]
                            p-6
                            shadow-[0_2px_5px_rgba(47,39,64,0.08)]
                            sm:p-8
                        ">
                        {/* HEADING */}
                        <h1 className="mb-2 text-center text-3xl font-semibold text-[#2B2740]">
                            Reset password
                        </h1>

                        <p className="mb-8 text-center text-sm text-[#6B7280]">
                            Enter a new password for your account.
                        </p>

                        {/* ERROR */}
                        {error && (
                            <div className="
                                    mb-4
                                    rounded-[15px]
                                    bg-red-50
                                    p-3
                                    text-sm
                                    text-red-600
                                ">
                                {error}
                            </div>
                        )}

                        {success ? (
                            <div className="
                                    rounded-[15px]
                                    bg-green-50
                                    p-4
                                    text-center
                                    text-sm
                                    text-green-600
                                ">
                                Password reset successfully! Redirecting you
                                to the sign in page...
                            </div>
                        ) : (
                            /* RESET PASSWORD FORM */
                            <form
                                onSubmit={handleResetPassword}
                                className="space-y-4"
                            >
                                {/* PASSWORD */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-[#2B2740]">
                                            New Password
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
                                        minLength={6}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="At least 6 characters"
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

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <div className="mb-1 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-[#2B2740]">
                                            Confirm Password
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
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
                                            {showConfirmPassword
                                                ? 'Hide'
                                                : 'Show'}
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
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm your new password"
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

                                {/* RESET PASSWORD BUTTON */}
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
                                        ? 'Resetting password...'
                                        : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        {/* BACK TO SIGN IN */}
                        {!success && (
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => router.push('/signin')}
                                    className="
                                        text-sm
                                        font-medium
                                        text-[#8B6BCB]
                                        hover:underline
                                    "
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#FAF9FE] text-sm text-[#6B7280]">
                    Loading...
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}