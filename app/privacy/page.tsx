import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
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
              Privacy Policy
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

          {/* Privacy Content */}
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
                1. Information We Collect
              </h2>

              <p>
                When you register on Wondlo, we collect basic details such as
                your name and email address to manage your account security and
                authentication profile.
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
                2. How We Use Your Data
              </h2>

              <p>
                Your information is used strictly to provide secure platform
                access, deliver onboarding and verification communications, and
                uphold our safety protocols.
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
                3. Contact Us
              </h2>

              <p>
                If you have questions regarding your data privacy, you can
                reach out directly via partnership@joinwondlo.com.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}