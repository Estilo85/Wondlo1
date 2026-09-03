import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
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
              Terms of Service
            </h1>

            <div
              className="my-5 h-[2px] w-[100px]"
              style={{
                background:
                  'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
              }}
            />

            <p
              className="font-inter text-sm font-semibold uppercase tracking-wide text-[#7E6BB3]"
            >
              Safety as a System™
            </p>
          </div>

          {/* Terms Content */}
          <div className="mt-8 space-y-6 font-inter leading-relaxed text-[#4A4560]">

            <section
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
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
                1. Acceptance of Terms
              </h2>

              <p>
                By accessing or registering with Wondlo, you agree to be bound
                by these Terms of Service and all applicable laws and
                regulations.
              </p>
            </section>

            <section
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
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
                2. User Accounts & Security
              </h2>

              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and password setup links. Notify us
                immediately of any unauthorized usage.
              </p>
            </section>

            <section
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
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
                3. Platform Conduct
              </h2>

              <p>
                Users must adhere to safe community practices and refrain from
                disrupting platform functionality or misusing community
                resources.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}