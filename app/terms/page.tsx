import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-poppins text-3xl font-bold text-[#2B2740] mb-4">Terms of Service</h1>
        <p className="text-sm font-semibold text-[#7E6BB3] mb-8 uppercase tracking-wide">Safety as a System™</p>
        
        <div className="space-y-6 font-inter text-[#4A4560] leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or registering with Wondlo, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">2. User Accounts & Security</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and password setup links. Notify us immediately of any unauthorized usage.</p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">3. Platform Conduct</h2>
            <p>Users must adhere to safe community practices and refrain from disrupting platform functionality or misusing community resources.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}