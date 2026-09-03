import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12">

        {/* Outer Section */}
        <div
          className="w-full rounded-3xl p-8 sm:p-12"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >

          {/* Header */}
          <div>
            <h1
              className="font-poppins text-[#2B2740]"
              style={{
                fontSize: 'clamp(28px, 3vw, 38px)',
                fontWeight: 700,
                lineHeight: '1.25',
              }}
            >
              Help Center
            </h1>

            <div
              className="my-5 h-[2px] w-[100px]"
              style={{
                background:
                  'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
              }}
            />

            <p
              className="font-inter text-[#4A4560]"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '1.5',
              }}
            >
              Find answers to common questions and learn how to navigate the
              Wondlo platform.
            </p>
          </div>

          {/* Help Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 font-inter md:grid-cols-2">

            {/* Account Setup */}
            <div
              className="flex flex-col rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border:
                  '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow:
                  '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2
                className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]"
              >
                Account Setup & Sign Up
              </h2>

              <p
                className="mb-4 text-sm text-[#4A4560]"
                style={{
                  lineHeight: '1.5',
                }}
              >
                Learn how to register your profile and configure your password
                securely via email.
              </p>

              <Link
                href="/signup"
                className="mt-auto text-xs font-semibold text-[#7E6BB3] transition-colors duration-200 hover:text-[#2B2740]"
              >
                Get Started &rarr;
              </Link>
            </div>

            {/* Reporting Issues */}
            <div
              className="flex flex-col rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border:
                  '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow:
                  '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2
                className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]"
              >
                Reporting Issues
              </h2>

              <p
                className="mb-4 text-sm text-[#4A4560]"
                style={{
                  lineHeight: '1.5',
                }}
              >
                Encountered an error? Submit details directly through our
                support channel.
              </p>

              <Link
                href="/report-issue"
                className="mt-auto text-xs font-semibold text-[#7E6BB3] transition-colors duration-200 hover:text-[#2B2740]"
              >
                Report an Issue &rarr;
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}