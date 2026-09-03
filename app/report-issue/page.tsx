'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReportIssuePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-2xl mx-auto px-3 sm:px-6 py-12">

        {/* Outer Section */}
        <div
          className="w-full rounded-3xl p-4 sm:p-12"
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
              Report an Issue
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
              Found a bug or experiencing technical difficulties? Fill out the
              form below and our team will review it.
            </p>
          </div>

          {/* Submitted State */}
          {submitted ? (
            <div
              className="mt-8 rounded-2xl bg-white p-6 sm:p-8 text-center"
              style={{
                border:
                  '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow:
                  '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <div
                className="mx-auto mb-5 flex h-[55px] w-[55px] items-center justify-center rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #EDE7FB 0%, #C7B5F5 100%)',
                }}
              >
                <svg
                  className="h-6 w-6 text-[#7E6BB3]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              <div className="space-y-4">
                <h2
                  className="font-poppins text-xl font-semibold text-[#7E6BB3]"
                >
                  Thank you for your feedback!
                </h2>

                <p className="font-inter text-sm leading-relaxed text-[#4A4560]">
                  Your report has been successfully submitted. If necessary,
                  our team will follow up via email at{' '}
                  <span className="font-semibold">
                    {formData.email}
                  </span>
                  .
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      message: '',
                    });
                  }}
                  className="mt-4 rounded-lg bg-[#7E6BB3] px-6 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#68559D]"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6 rounded-2xl bg-[#FAF9FE] p-4 sm:p-8"
              style={{
                border:
                  '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow:
                  '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >

              {/* Name */}
              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Your Name
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-[#EDE7FB] px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-[#EDE7FB] px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]"
                />
              </div>

              {/* Issue Description */}
              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Issue Description
                </label>

                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Please describe the problem or bug you encountered..."
                  className="w-full resize-none rounded-lg border border-[#EDE7FB] px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-[#7E6BB3] py-3 font-poppins text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#68559D] hover:shadow-md"
              >
                Submit Report
              </button>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}