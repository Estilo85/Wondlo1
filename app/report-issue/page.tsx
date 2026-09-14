'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MAX_MESSAGE_CHARS = 1000;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const FEATURE_CATEGORIES = ['New feature', 'Improvement', 'Interface improvement', 'Other'];
const BUG_CATEGORIES = ['Bug', 'Broken feature', 'Performance', 'Security concern', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

function ReportIssueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFeature = searchParams.get('type') === 'feature';

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const categories = isFeature ? FEATURE_CATEGORIES : BUG_CATEGORIES;

  const validate = () => {
    const nextErrors: { name?: string; email?: string; message?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (formData.message.trim().length < 10) {
      nextErrors.message =
        'Please describe the ' + (isFeature ? 'feature' : 'issue') + ' in a few more words.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName('');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileName('');
      setFileError('File is too large. Please choose a file under 2MB.');
      e.target.value = '';
      return;
    }
    setFileError('');
    setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);

    let attachmentBase64: string | null = null;
    const fileInput = document.getElementById('report-attachment') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (file) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      attachmentBase64 = dataUrl.split(',')[1];
    }

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          type: isFeature ? 'feature' : 'bug',
          category: category || 'General',
          priority,
          attachmentName: fileName || null,
          attachmentBase64,
        }),
      });
      const result = await res.json();
      setEmailSent(result.emailStatus === 'sent');
      setSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ message: 'Something went wrong while submitting. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-xs font-semibold text-[#7E6BB3] hover:underline flex items-center gap-2 cursor-pointer"
        >
          <span className="text-[#3D8A1E] text-base font-extrabold leading-none">←</span>
          Back
        </button>

        {/* Outer Section */}
        <div
          className="w-full rounded-3xl p-6 sm:p-12"
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
              {isFeature ? 'Request a Feature' : 'Report an Issue'}
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
              {isFeature
                ? 'Have an idea that would make Wondlo better? Tell us about the feature you would like to see and our team will review it.'
                : 'Found a bug or experiencing technical difficulties? Fill out the form below and our team will review it.'}
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
                  {isFeature ? 'Thanks for your suggestion!' : 'Thank you for your feedback!'}
                </h2>

                <p className="font-inter text-sm leading-relaxed text-[#4A4560]">
                  Your {isFeature ? 'feature request' : 'report'} has been successfully
                  submitted. If necessary, our team will follow up via email at{' '}
                  <span className="font-semibold">
                    {formData.email}
                  </span>
                  .
                </p>

                {emailSent && (
                  <p className="font-inter text-sm leading-relaxed text-[#3D8A1E]">
                    A confirmation email has been sent to {formData.email}.
                  </p>
                )}

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmailSent(false);
                    setFileName('');
                    setCategory('');
                    setPriority('Medium');
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
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg border px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB] ${errors.name ? 'border-[#C51D14]' : 'border-[#EDE7FB]'}`}
                />
                {errors.name && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="name@example.com"
                  className={`w-full rounded-lg border px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB] ${errors.email ? 'border-[#C51D14]' : 'border-[#EDE7FB]'}`}
                />
                {errors.email && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.email}</p>
                )}
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                    {isFeature ? 'Feature Type' : 'Category'}
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#EDE7FB] bg-white px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-[#EDE7FB] bg-white px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                    {isFeature ? 'Feature Description' : 'Issue Description'}
                  </label>

                  <span className={`mb-2 text-xs font-medium ${formData.message.length >= MAX_MESSAGE_CHARS ? 'text-[#C51D14]' : 'text-[#9A95A8]'}`}>
                    {formData.message.length}/{MAX_MESSAGE_CHARS}
                  </span>
                </div>

                <textarea
                  rows={5}
                  maxLength={MAX_MESSAGE_CHARS}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: undefined });
                  }}
                  placeholder={
                    isFeature
                      ? 'Please describe the feature you would like to see...'
                      : 'Please describe the problem or bug you encountered...'
                  }
                  className={`w-full resize-none rounded-lg border px-4 py-3 font-inter text-sm text-[#2B2740] outline-none transition-all duration-200 placeholder:text-[#9A95A8] focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB] ${errors.message ? 'border-[#C51D14]' : 'border-[#EDE7FB]'}`}
                />
                {errors.message && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.message}</p>
                )}
              </div>

              {/* Attachment */}
              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold text-[#2B2740]">
                  Attachment (optional)
                </label>

                <label
                  htmlFor="report-attachment"
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-dashed border-[#C7B5F5] bg-white px-4 py-3 transition-all duration-200 hover:border-[#7E6BB3]"
                >
                  <span className={`font-inter text-sm ${fileName ? 'text-[#2B2740]' : 'text-[#9A95A8]'}`}>
                    {fileName || 'Upload a screenshot or file (max 2MB)'}
                  </span>

                  <svg
                    className="h-5 w-5 text-[#7E6BB3]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4M8 8l4-4 4 4" />
                    <path d="M4 20h16" />
                  </svg>
                </label>

                <input
                  id="report-attachment"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {fileError && (
                  <p className="mt-1 font-inter text-xs text-[#C51D14]">{fileError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#7E6BB3] py-3 font-poppins text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#68559D] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : isFeature ? (
                  'Submit Request'
                ) : (
                  'Submit Report'
                )}
              </button>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ReportIssuePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F4FE] flex items-center justify-center text-sm text-[#7E6BB3]">
          Loading...
        </div>
      }
    >
      <ReportIssueContent />
    </Suspense>
  );
}