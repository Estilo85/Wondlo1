'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#FAF9FE] px-4 py-6 sm:px-6 md:px-8 lg:px-10 md:py-8">
            <div
                className="relative mx-auto w-full max-w-[1440px] overflow-hidden rounded-[20px]"
                style={{
                    backgroundColor: 'rgba(126, 107, 179, 0.80)',
                    border: '0.1px solid rgba(43, 39, 64, 0.10)',
                }}
            >
                <div className="px-6 py-10 sm:px-8 md:px-[44px] md:py-12 lg:px-[44px]">

                    {/* Main content */}
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">

                        {/* Column 1 */}
                        <div>
                            <Link
                                href="/"
                                className="inline-block font-poppins text-[22px] font-bold text-white transition-opacity hover:opacity-90"
                            >
                                Wondlo
                            </Link>

                            <div className="mt-4 space-y-1">
                                <p className="font-inter text-[15px] font-medium text-white/90">
                                    71–75 Shelton Street
                                </p>
                                <p className="font-inter text-[15px] font-medium text-white/90">
                                    United Kingdom
                                </p>
                            </div>

                            {/* Social icons */}
                            <div className="mt-6 flex items-center gap-4 text-white/80">
                                <a
                                    href="https://www.linkedin.com/company/wondlo/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="transition-opacity hover:opacity-100"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.facebook.com/share/19J2nZimxj/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="transition-opacity hover:opacity-100"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.tiktok.com/@usewondlo?_r=1&_t=ZS-98eSHPYIj6z"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                    className="transition-opacity hover:opacity-100"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.54-1.28 2.53.02 1.14.71 2.17 1.75 2.6 1.01.42 2.21.23 3.03-.47.67-.57.99-1.43.98-2.31.02-5.4.01-10.8.01-16.2z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/joinwondlo?igsh=MXEyaTZzMnUybnV2cQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="transition-opacity hover:opacity-100"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Important Links */}
                        <div className="border-t border-white/35 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                            <h4 className="mb-4 font-poppins text-sm font-semibold text-white/90">
                                Important Link
                            </h4>

                            <ul className="space-y-3 font-inter text-[15px] font-medium text-white/85">
                                <li>
                                    <Link href="/help" className="transition-colors hover:text-white">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/report-issue" className="transition-colors hover:text-white">
                                        Report an Issue
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="transition-colors hover:text-white">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="transition-colors hover:text-white">
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Contact */}
                        <div className="border-t border-white/35 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0 flex flex-col justify-between">
                            <div>
                                <h4 className="mb-4 font-poppins text-sm font-semibold text-white/90">
                                    Contact
                                </h4>

                                <a 
                                    href="mailto:partnership@joinwondlo.com"
                                    className="break-words font-inter text-[15px] font-medium text-white/85 transition-colors hover:text-white hover:underline"
                                >
                                    partnership@joinwondlo.com
                                </a>
                            </div>

                            {/* Telegram */}
                            <div className="mt-8 md:mt-0">
                                <a
                                    href="https://t.me/joinwandlo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Join Wondlo on Telegram"
                                    className="inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white"
                                >
                                    <span className="font-inter text-[13px] font-medium text-white/50">
                                        Join us on
                                    </span>
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.52c-.15.68-.55.85-1.12.53l-3.08-2.27-1.49 1.43c-.16.16-.3.3-.61.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.05 4.44-3.04-.95c-.66-.21-.67-.66.14-.98l11.89-4.58c.55-.2 1.03.13.84.96z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section: Border line, Safety as a System™, and Copyright */}
                    <div className="mt-10 border-t border-white/30 pt-6 flex flex-col items-center text-center gap-2">
                        <div className="font-inter text-[14px] font-semibold text-white/90">
                            <p>Safety as a System™</p>
                        </div>
                        <div className="font-inter text-[14px] font-medium text-white/70">
                            <p>Copyright © 2026 Wondlo. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}