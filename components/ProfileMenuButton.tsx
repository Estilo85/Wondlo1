'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import { auth } from '@/lib/firebase-client';

const TONES = {
  solid: 'border-[#C7B5F5] bg-[#C7B5F5] text-white',
  soft: 'border-[#C7B5F5] bg-[#F6F4FE] text-[#7E6BB3]',
} as const;

export default function ProfileMenuButton({
  tone = 'solid',
}: {
  tone?: keyof typeof TONES;
}) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAvatarUrl(null);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const response = await fetch('/api/user/avatar', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (!response.ok) return;

        const data = await response.json();
        setAvatarUrl(
          typeof data?.avatarUrl === 'string' && data.avatarUrl
            ? data.avatarUrl
            : null
        );
      } catch (error) {
        console.error('Failed to load profile picture:', error);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const handleSignOut = async () => {
    setProfileOpen(false);

    if (auth) {
      await signOut(auth);
    }

    router.replace('/');
  };

  return (
    <div ref={menuRef} className="relative flex-shrink-0">
      <button
        type="button"
        aria-label={profileOpen ? 'Close profile menu' : 'Open profile menu'}
        aria-expanded={profileOpen}
        onClick={() => setProfileOpen((open) => !open)}
        className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border ${TONES[tone]}`}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Your profile picture"
            fill
            sizes="36px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"
            />
          </svg>
        )}

        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#3D8A1E] ring-2 ring-white" />
      </button>

      {profileOpen && (
        <div className="absolute right-0 top-11 z-50 w-32 rounded-lg border border-[#EDE7FB] bg-white p-1 shadow-lg">
          <Link
            href="/settings"
            onClick={() => setProfileOpen(false)}
            className="block w-full rounded-md px-3 py-2 text-center text-xs font-semibold text-[#2B2740] hover:bg-[#F6F4FE]"
          >
            Settings
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-md px-3 py-2 text-center text-xs font-semibold text-[#2B2740] hover:bg-[#F6F4FE]"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
