'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReportIssuePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />
      
      <main className="flex-grow max-w-2xl mx-auto px-6 py-12 w-full">
        <h1 className="font-poppins text-3xl font-bold text-[#2B2740] mb-2">Report an Issue</h1>
        <p className="font-inter text-[#4A4560] mb-8">Found a bug or experiencing technical difficulties? Fill out the form below and our team will review it.</p>
        
        {submitted ? (
          <div className="bg-white p-8 rounded-2xl border border-[#EDE7FB] text-center space-y-4">
            <h2 className="font-poppins text-xl font-semibold text-[#7E6BB3]">Thank you for your feedback!</h2>
            <p className="font-inter text-sm text-[#4A4560]">Your report has been successfully submitted. If necessary, our team will follow up via email at <span className="font-semibold">{formData.email}</span>.</p>
            <button 
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}
              className="mt-4 px-6 py-2 bg-[#7E6BB3] text-white rounded-lg text-xs font-semibold hover:bg-[#68559D] transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-[#EDE7FB] space-y-6">
            <div>
              <label className="block font-poppins text-xs font-semibold text-[#2B2740] mb-2">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg border border-[#EDE7FB] font-inter text-sm focus:outline-none focus:border-[#7E6BB3]"
              />
            </div>

            <div>
              <label className="block font-poppins text-xs font-semibold text-[#2B2740] mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg border border-[#EDE7FB] font-inter text-sm focus:outline-none focus:border-[#7E6BB3]"
              />
            </div>

            <div>
              <label className="block font-poppins text-xs font-semibold text-[#2B2740] mb-2">Issue Description</label>
              <textarea 
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe the problem or bug you encountered..."
                className="w-full px-4 py-3 rounded-lg border border-[#EDE7FB] font-inter text-sm focus:outline-none focus:border-[#7E6BB3] resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-[#7E6BB3] text-white rounded-lg font-poppins font-semibold text-xs hover:bg-[#68559D] transition-colors shadow-xs"
            >
              Submit Report
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}