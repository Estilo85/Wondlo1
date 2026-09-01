import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-poppins text-3xl font-bold text-[#2B2740] mb-4">Privacy Policy</h1>
        <p className="text-sm font-semibold text-[#7E6BB3] mb-8 uppercase tracking-wide">Safety as a System™</p>
        
        <div className="space-y-6 font-inter text-[#4A4560] leading-relaxed">
          <section className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">1. Information We Collect</h2>
            <p>When you register on Wondlo, we collect basic details such as your name and email address to manage your account security and authentication profile.</p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">2. How We Use Your Data</h2>
            <p>Your information is used strictly to provide secure platform access, deliver onboarding and verification communications, and uphold our safety protocols.</p>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">3. Contact Us</h2>
            <p>If you have questions regarding your data privacy, you can reach out directly via partnership@joinwondlo.com.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}