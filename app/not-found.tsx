import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6">
        <div
          className="w-full max-w-lg rounded-3xl p-8 text-center sm:p-12"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >
          <p className="font-inter text-sm font-semibold tracking-wide text-[#7E6BB3]">
            404
          </p>

          <h1 className="mt-3 font-poppins text-3xl font-bold text-[#2B2740] sm:text-4xl">
            We couldn&apos;t find that page
          </h1>

          <div
            className="mx-auto my-5 h-[2px] w-[100px]"
            style={{
              background: 'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
            }}
          />

          <p className="font-inter text-sm leading-6 text-[#4A4560]">
            The page you&apos;re looking for doesn&apos;t exist, or it may have
            moved. Let&apos;s get you back to somewhere useful.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="w-full rounded-[20px] bg-[#8B6BCB] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#7A5BB8] sm:w-auto"
            >
              Back to Home
            </Link>

            <Link
              href="/help"
              className="w-full rounded-[20px] border-2 border-[#C7B5F5] px-6 py-3 text-sm font-semibold text-[#2B2740] transition-all hover:bg-[#EDE7FB] sm:w-auto"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
