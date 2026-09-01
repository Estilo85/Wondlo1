import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-poppins text-3xl font-bold text-[#2B2740] mb-4">Help Center</h1>
        <p className="font-inter text-[#4A4560] mb-8">Find answers to common questions and learn how to navigate the Wondlo platform.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">Account Setup & Sign Up</h2>
            <p className="text-sm text-[#4A4560] mb-4">Learn how to register your profile and configure your password securely via email.</p>
            <Link href="/signup" className="text-xs font-semibold text-[#7E6BB3] hover:underline">Get Started &rarr;</Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EDE7FB]">
            <h2 className="font-poppins font-semibold text-lg text-[#2B2740] mb-2">Reporting Issues</h2>
            <p className="text-sm text-[#4A4560] mb-4">Encountered an error? Submit details directly through our support channel.</p>
            <Link href="/report-issue" className="text-xs font-semibold text-[#7E6BB3] hover:underline">Report an Issue &rarr;</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}