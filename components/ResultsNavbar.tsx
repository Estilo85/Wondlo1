'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import ProfileMenuButton from '@/components/ProfileMenuButton';

const NAV_LINKS = [
  { href: '/', label: 'HOME', match: '/' },
  { href: '/community', label: 'COMMUNITY', match: '/community' },
] as const;

export default function ResultsNavbar({
  onAnalyseAnother,
}: {
  onAnalyseAnother?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navbarBackground =
    pathname === '/analyze/results'
      ? '#F6F4FE'
      : pathname === '/dashboard' || pathname === '/community' || pathname === '/billing'
        ? '#FAF9FE'
        : '#FFFFFF';

  const closeMenus = () => {
    setMobileOpen(false);
  };

  const startNewSearch = () => {
    closeMenus();

    if (onAnalyseAnother) {
      onAnalyseAnother();
      return;
    }
    router.push('/dashboard?newSearch=1');
  };

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
    <header
      className="sticky top-0 z-50 border-b border-[#EDE7FB]"
      style={{ backgroundColor: navbarBackground }}
    >
      <div className="w-full max-w-[1316px] mx-auto px-4 sm:px-6 xl:px-0">
        <div className="min-h-16 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-bold text-lg text-[#2B2740] tracking-tight flex-shrink-0"
          >
            Wondlo
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide text-[#2B2740]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={
                    pathname === link.match
                      ? 'text-[#7E6BB3] border-b-2 border-[#7E6BB3] pb-0.5'
                      : 'hover:text-[#7E6BB3] transition-colors pb-0.5'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={startNewSearch}
              className="hidden lg:flex h-8 px-4 rounded-lg bg-[#7E6BB3] text-white border border-[#7E6BB3] items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Analyse Another Adventure</span>
              <span className="text-sm">→</span>
            </button>

            <ProfileMenuButton />

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#C7B5F5] text-[#2B2740] md:hidden"
            >
              {mobileOpen ? (
                <FiX className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiMenu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="border-t border-[#EDE7FB] pb-4 pt-2 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className={`rounded-[10px] px-4 py-3 text-xs font-semibold tracking-wide ${
                    pathname === link.match
                      ? 'bg-[#EDE7FB] text-[#7E6BB3]'
                      : 'text-[#2B2740] hover:bg-[#F6F4FE]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={startNewSearch}
                className="mt-1 flex items-center justify-center gap-2 rounded-[10px] bg-[#7E6BB3] px-4 py-3 text-xs font-semibold text-white"
              >
                Analyse Another Adventure
                <span className="text-sm">→</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
