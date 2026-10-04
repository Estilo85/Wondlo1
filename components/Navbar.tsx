'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FiMenu, FiX } from 'react-icons/fi';
import ProfileMenuButton from '@/components/ProfileMenuButton';
import { auth } from '@/lib/firebase-client';

export default function Navbar({
  onAnalyseAnother,
  backgroundColor,
}: {
  onAnalyseAnother?: () => void;
  backgroundColor?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === '/';
  const isCommunity = pathname === '/community';
  const isSignIn = pathname === '/signin';
  const isSignUp = pathname === '/signup';
  const isAuthPage = isSignIn || isSignUp;
  const footerPagePaths = ['/help', '/report-issue', '/privacy', '/terms', '/faq', '/guide'];
  const pageBackgroundColor = backgroundColor ?? (
    footerPagePaths.includes(pathname) ? '#FAF9FE' : '#FFFFFF'
  );

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!auth) return;

    return onAuthStateChanged(auth, (firebaseUser) => {
      setIsSignedIn(Boolean(firebaseUser));
    });
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <nav
      className="w-full border-b border-[#EDE7FB] py-4 px-4 sm:px-12"
      style={{ backgroundColor: pageBackgroundColor }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <Link
            href="/"
            className="font-poppins font-bold text-xl text-[#2B2740] tracking-tight"
          >
            Wondlo
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden md:flex items-center gap-6 font-poppins text-xs font-semibold text-[#6E6B80]">
            <Link
              href="/"
              className={
                isHome
                  ? 'text-[#7E6BB3] border-b-2 border-[#7E6BB3] pb-0.5'
                  : 'hover:text-[#2B2740] transition-colors pb-0.5'
              }
            >
              HOME
            </Link>
            {isSignedIn && !isAuthPage && (
              <Link
                href="/community"
                className={
                  isCommunity
                    ? 'text-[#7E6BB3] border-b-2 border-[#7E6BB3] pb-0.5'
                    : 'hover:text-[#2B2740] transition-colors pb-0.5'
                }
              >
                COMMUNITY
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onAnalyseAnother && (
              <button
                type="button"
                onClick={onAnalyseAnother}
                className="hidden rounded-lg bg-[#7E6BB3] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:block"
              >
                Analyse Another
              </button>
            )}

            {isSignedIn && !isAuthPage ? (
              <ProfileMenuButton tone="soft" />
            ) : (
              <>
                <Link
                  href="/signin"
                  className={
                    isSignIn
                      ? 'px-4 py-1.5 rounded-lg bg-[#7E6BB3] text-white font-poppins font-semibold text-xs transition-colors shadow-xs'
                      : 'px-4 py-1.5 rounded-lg border border-[#EDE7FB] text-[#2B2740] font-poppins font-semibold text-xs hover:bg-[#F6F4FE] transition-colors'
                  }
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className={
                    isSignUp
                      ? 'px-4 py-1.5 rounded-lg bg-[#7E6BB3] text-white font-poppins font-semibold text-xs hover:bg-[#68559D] transition-colors shadow-xs'
                      : 'px-4 py-1.5 rounded-lg border border-[#EDE7FB] text-[#2B2740] font-poppins font-semibold text-xs hover:bg-[#F6F4FE] transition-colors'
                  }
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#C7B5F5] text-[#2B2740] md:hidden"
            >
              {mobileOpen ? (
                <FiX className="h-4 w-4" aria-hidden="true" />
              ) : (
                <FiMenu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="mt-3 border-t border-[#EDE7FB] pt-3 md:hidden"
        >
          <div className="flex flex-col gap-1 font-poppins text-xs font-semibold text-[#6E6B80]">
            <Link
              href="/"
              className={
                isHome
                  ? 'rounded-[10px] bg-[#EDE7FB] px-4 py-3 text-[#7E6BB3]'
                  : 'rounded-[10px] px-4 py-3 hover:bg-[#F6F4FE]'
              }
              onClick={closeMobileMenu}
            >
              HOME
            </Link>

            {isSignedIn && !isAuthPage && (
              <Link
                href="/community"
                className={
                  isCommunity
                    ? 'rounded-[10px] bg-[#EDE7FB] px-4 py-3 text-[#7E6BB3]'
                    : 'rounded-[10px] px-4 py-3 hover:bg-[#F6F4FE]'
                }
                onClick={closeMobileMenu}
              >
                COMMUNITY
              </Link>
            )}

            {onAnalyseAnother && (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onAnalyseAnother();
                }}
                className="rounded-[10px] px-4 py-3 text-left hover:bg-[#F6F4FE]"
              >
                Analyse Another
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
