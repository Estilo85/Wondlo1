'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = mounted && pathname === '/';
  const isSignIn = mounted && pathname === '/signin';
  const isSignUp = mounted && (pathname === '/signup' || (!isSignIn && !isHome));

  return (
    <nav className="w-full bg-white border-b border-[#EDE7FB] py-4 px-6 sm:px-12 flex items-center justify-between">
      {/* Brand Logo Text Only */}
      <div className="flex items-center">
        <Link 
          href="/" 
          className="font-poppins font-bold text-xl text-[#2B2740] tracking-tight"
        >
          Wondlo
        </Link>
      </div>

      {/* Navigation Links & Action Buttons */}
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-6 font-poppins text-xs font-semibold text-[#6E6B80]">
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
        </div>
        <div className="flex items-center space-x-2">
          {/* Sign In Button */}
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

          {/* Sign Up Button */}
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
        </div>
      </div>
    </nav>
  );
}