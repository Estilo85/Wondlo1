'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { auth } from '@/lib/firebase-client';
import { isPaidPlan } from '@/lib/billing';
import { resizeAvatar } from '@/lib/image';
import { FiUsers } from 'react-icons/fi';

type PlanSummary = {
  key: string;
  label: string;
  cadence: string;
  allowance: number;
  used: number;
  left: number;
  cycleEndsAt: string | null;
};

const inputClass =
  'h-12 w-full rounded-[10px] border border-[#DDD7EA] bg-[#F6F4FE] px-4 text-[#2B2740] placeholder:text-[#A1A1AA] transition-all focus:border-[#8B6BCB] focus:outline-none focus:ring-2 focus:ring-[#8B6BCB]/20';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cardStyle = {
  backgroundColor: '#FCFCFB',
  border: '0.1px solid rgba(43, 39, 64, 0.10)',
  boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
};

export default function SettingsPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<PlanSummary | null>(null);
  const [planError, setPlanError] = useState('');

  const [emailPassword, setEmailPassword] = useState('');
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsMessage, setDetailsMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarMessage, setAvatarMessage] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth) {
      router.replace('/');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.replace('/');
        return;
      }

      setName(firebaseUser.displayName ?? '');
      setEmail(firebaseUser.email ?? '');
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authReady || !auth?.currentUser) return;

    (async () => {
      try {
        const token = await auth.currentUser!.getIdToken();
        const response = await fetch(`/api/billing/status?token=${encodeURIComponent(token)}`, {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const data = await response.json();
        setPlan({
          key: data.plan ?? 'free_trial',
          label: data.label ?? 'Free Trial',
          cadence: data.cadence ?? '',
          allowance: data.allowance ?? 0,
          used: data.used ?? 0,
          left: data.left ?? 0,
          cycleEndsAt: data.cycleEndsAt ?? null,
        });
        setAvatarUrl(data.avatarUrl ?? null);
      } catch (error) {
        console.error('Failed to load plan details:', error);
        setPlanError('We could not load your plan details right now.');
      }
    })();
  }, [authReady]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError('');
    setDetailsMessage('');

    const user = auth?.currentUser;

    if (!user?.email) {
      setDetailsError('We could not verify your account. Please sign in again.');
      return;
    }

    const nextName = name.trim();
    const nextEmail = email.trim().toLowerCase();

    if (nextName.length < 2) {
      setDetailsError('Please enter your full name.');
      return;
    }

    if (!EMAIL_PATTERN.test(nextEmail)) {
      setDetailsError('Please enter a valid email address.');
      return;
    }

    const emailChanged = nextEmail !== user.email.toLowerCase();

    if (emailChanged && !emailPassword) {
      setDetailsError('Please enter your current password to change your email address.');
      return;
    }

    setDetailsBusy(true);

    try {
      let token = await user.getIdToken();

      if (emailChanged) {
        try {
          const credential = EmailAuthProvider.credential(user.email, emailPassword);
          await reauthenticateWithCredential(user, credential);
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code;

          if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
            setDetailsError('That current password is not correct.');
          } else if (code === 'auth/too-many-requests') {
            setDetailsError('Too many attempts. Please wait a moment and try again.');
          } else {
            setDetailsError('We could not verify your password. Please try again.');
          }

          return;
        }

        // A forced refresh issues a token carrying a fresh auth_time claim.
        token = await user.getIdToken(true);
      }

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name: nextName, email: nextEmail }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setDetailsError(data?.error || 'We could not save your changes. Please try again.');
        return;
      }

      setName(data.name);
      setEmail(data.email);
      setEmailPassword('');

      // Refresh the cached Firebase profile so the rest of the app picks up the new name.
      await user.reload();

      setDetailsMessage(
        data.emailChanged
          ? 'Your details have been saved. We have emailed a confirmation to your new address.'
          : 'Your details have been saved.'
      );
    } catch (error) {
      console.error('Failed to save profile details:', error);
      setDetailsError('We could not save your changes. Please try again.');
    } finally {
      setDetailsBusy(false);
    }
  };

  const handleAvatarSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    setAvatarError('');
    setAvatarMessage('');

    const resized = await resizeAvatar(file);

    if (!resized.ok) {
      setAvatarError(resized.error);
      return;
    }

    setAvatarBusy(true);

    try {
      const token = await auth?.currentUser?.getIdToken();

      if (!token) {
        setAvatarError('We could not verify your account. Please sign in again.');
        return;
      }

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl: resized.dataUrl }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAvatarError(data?.error || 'We could not save your profile picture.');
        return;
      }

      setAvatarUrl(data.avatarUrl ?? null);
      setAvatarMessage('Your profile picture has been updated.');
    } catch (error) {
      console.error('Failed to save profile picture:', error);
      setAvatarError('We could not save your profile picture. Please try again.');
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarError('');
    setAvatarMessage('');
    setAvatarBusy(true);

    try {
      const token = await auth?.currentUser?.getIdToken();

      if (!token) {
        setAvatarError('We could not verify your account. Please sign in again.');
        return;
      }

      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAvatarError(data?.error || 'We could not remove your profile picture.');
        return;
      }

      setAvatarUrl(null);
      setAvatarMessage('Your profile picture has been removed.');
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
      setAvatarError('We could not remove your profile picture. Please try again.');
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!auth?.currentUser?.email) {
      setPasswordError('We could not verify your account. Please sign in again.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('Your new password must be different from your current one.');
      return;
    }

    setPasswordBusy(true);

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Password updated successfully.');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;

      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPasswordError('That current password is not correct.');
      } else if (code === 'auth/too-many-requests') {
        setPasswordError('Too many attempts. Please wait a moment and try again.');
      } else if (code === 'auth/requires-recent-login') {
        setPasswordError('For security, please sign out and sign back in, then try again.');
      } else {
        setPasswordError(
          err instanceof Error ? err.message : 'Unable to update your password.'
        );
      }
    } finally {
      setPasswordBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

  if (!authReady) {
    return <div className="min-h-screen bg-[#FAF9FE]" />;
  }

  const renewalDate = plan?.cycleEndsAt
    ? new Date(plan.cycleEndsAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const signedInEmail = auth?.currentUser?.email ?? '';
  const emailChanged = signedInEmail
    ? email.trim().toLowerCase() !== signedInEmail.toLowerCase()
    : false;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-grow px-4 py-12 sm:px-6">
        <h1 className="font-poppins text-[32px] font-bold text-[#2B2740]">
          Account Settings
        </h1>

        <div
          className="my-5 h-[2px] w-[100px]"
          style={{ background: 'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)' }}
        />

        <p className="font-inter text-sm leading-6 text-[#4A4560]">
          Manage your account details, plan and password.
        </p>

        <div className="mt-8 space-y-6">
          {/* PROFILE PICTURE */}
          <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h2 className="font-poppins text-lg font-semibold text-[#2B2740]">
              Profile Picture
            </h2>

            <p className="mt-1 font-inter text-xs text-[#6B7280]">
              This picture appears next to your name on the community feed. We resize it
              for you.
            </p>

            {avatarError && (
              <div className="mt-5 rounded-[15px] bg-red-50 p-3 font-inter text-sm text-red-600">
                {avatarError}
              </div>
            )}

            {avatarMessage && (
              <div className="mt-5 rounded-[15px] bg-green-50 p-3 font-inter text-sm text-green-600">
                {avatarMessage}
              </div>
            )}

            <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#C7B5F5]/75 ring-2 ring-[#C7B5F5]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Your profile picture"
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <FiUsers
                    className="h-10 w-10 text-[#7E6BB3]"
                    strokeWidth={1.4}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={avatarBusy}
                    onClick={() => avatarInputRef.current?.click()}
                    className="h-11 cursor-pointer rounded-[20px] bg-[#8B6BCB] px-5 font-inter text-sm font-semibold text-white transition-all hover:bg-[#7A5BB8] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {avatarUrl ? 'Change Picture' : 'Upload Picture'}
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      disabled={avatarBusy}
                      onClick={handleRemoveAvatar}
                      className="h-11 cursor-pointer rounded-[20px] border-2 border-[#C7B5F5] px-5 font-inter text-sm font-semibold text-[#2B2740] transition-all hover:bg-[#EDE7FB] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <p className="font-inter text-xs text-[#6B7280]">
                  PNG, JPEG or WebP. We resize it down to 256px.
                </p>
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarSelected}
                className="hidden"
                aria-label="Choose a profile picture"
              />
            </div>
          </section>

          {/* ACCOUNT DETAILS */}
          <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h2 className="font-poppins text-lg font-semibold text-[#2B2740]">
              Your Details
            </h2>

            <p className="mt-1 font-inter text-xs text-[#6B7280]">
              Your name and email are used on your safety reports and receipts.
            </p>

            {detailsError && (
              <div className="mt-5 rounded-[15px] bg-red-50 p-3 font-inter text-sm text-red-600">
                {detailsError}
              </div>
            )}

            {detailsMessage && (
              <div className="mt-5 rounded-[15px] bg-green-50 p-3 font-inter text-sm text-green-600">
                {detailsMessage}
              </div>
            )}

            <form onSubmit={handleSaveDetails} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="settings-name"
                  className="mb-1 block font-inter text-sm font-medium text-[#2B2740]"
                >
                  Full Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-email"
                  className="mb-1 block font-inter text-sm font-medium text-[#2B2740]"
                >
                  Email Address
                </label>
                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              {emailChanged && (
                <div>
                  <label
                    htmlFor="settings-email-password"
                    className="mb-1 block font-inter text-sm font-medium text-[#2B2740]"
                  >
                    Current Password
                  </label>
                  <input
                    id="settings-email-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    className={inputClass}
                  />
                  <p className="mt-1 font-inter text-xs text-[#6B7280]">
                    Confirm your password to change the email address on your account.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={detailsBusy}
                className="h-12 w-full cursor-pointer rounded-[20px] bg-[#8B6BCB] font-inter text-sm font-semibold text-white transition-all hover:bg-[#7A5BB8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {detailsBusy ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>

          {/* PLAN */}
          <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h2 className="font-poppins text-lg font-semibold text-[#2B2740]">
              Your Plan
            </h2>

            {planError ? (
              <p className="mt-4 font-inter text-sm text-red-600">{planError}</p>
            ) : plan ? (
              <>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#F6F4FE] p-4">
                    <p className="font-inter text-xs font-medium text-[#6B7280]">
                      Current plan
                    </p>
                    <p className="mt-1 font-poppins text-base font-semibold text-[#2B2740]">
                      {plan.label}
                    </p>
                    {plan.cadence && (
                      <p className="font-inter text-xs text-[#6B7280]">{plan.cadence}</p>
                    )}
                  </div>

                  <div className="rounded-xl bg-[#F6F4FE] p-4">
                    <p className="font-inter text-xs font-medium text-[#6B7280]">
                      Searches remaining
                    </p>
                    <p className="mt-1 font-poppins text-base font-semibold text-[#2B2740]">
                      {plan.left} of {plan.allowance}
                    </p>
                    <p className="font-inter text-xs text-[#6B7280]">
                      {plan.used} used this cycle
                    </p>
                  </div>
                </div>

                {renewalDate && (
                  <p className="mt-4 font-inter text-xs text-[#6B7280]">
                    Renews on {renewalDate}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/billing"
                    className="rounded-[20px] border-2 border-[#C7B5F5] px-5 py-2.5 font-inter text-sm font-semibold text-[#2B2740] transition-all hover:bg-[#EDE7FB]"
                  >
                    Manage Billing
                  </Link>

                  {!isPaidPlan(plan.key) && (
                    <Link
                      href="/payments"
                      className="rounded-[20px] bg-[#8B6BCB] px-5 py-2.5 font-inter text-sm font-semibold text-white transition-all hover:bg-[#7A5BB8]"
                    >
                      Upgrade Plan
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-4 font-inter text-sm text-[#6B7280]">Loading your plan...</p>
            )}
          </section>

          {/* PASSWORD */}
          <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h2 className="font-poppins text-lg font-semibold text-[#2B2740]">
              Change Password
            </h2>

            <p className="mt-1 font-inter text-xs text-[#6B7280]">
              Choose a password of at least 6 characters that you don&apos;t use
              anywhere else.
            </p>

            {passwordError && (
              <div className="mt-5 rounded-[15px] bg-red-50 p-3 font-inter text-sm text-red-600">
                {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="mt-5 rounded-[15px] bg-green-50 p-3 font-inter text-sm text-green-600">
                {passwordMessage}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block font-inter text-sm font-medium text-[#2B2740]">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block font-inter text-sm font-medium text-[#2B2740]">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block font-inter text-sm font-medium text-[#2B2740]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={passwordBusy}
                className="h-12 w-full cursor-pointer rounded-[20px] bg-[#8B6BCB] font-inter text-sm font-semibold text-white transition-all hover:bg-[#7A5BB8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {passwordBusy ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </section>

          {/* SESSION */}
          <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h2 className="font-poppins text-lg font-semibold text-[#2B2740]">
              Signed In As
            </h2>

            <p className="mt-1 font-inter text-xs text-[#6B7280]">
              {email || 'Your account'}
            </p>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-6 h-12 w-full cursor-pointer rounded-[20px] border-2 border-[#C7B5F5] font-inter text-sm font-semibold text-[#2B2740] transition-all hover:bg-[#EDE7FB]"
            >
              Sign Out
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
