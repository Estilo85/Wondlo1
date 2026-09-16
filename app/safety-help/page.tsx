'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MAX_MESSAGE_CHARS = 1200;
const HELP_CATEGORIES = [
  'Before booking an adventure',
  'Understanding an assessment',
  'Safety concern during a trip',
  'Other safety question',
];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function SafetyHelpPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    const nextErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (formData.message.trim().length < 10) {
      nextErrors.message = 'Please include a few more details about your question.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          type: 'safety-help',
          category: category || 'General safety question',
          priority,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to submit your request.');
      }

      if (result.emailStatus !== 'sent') {
        throw new Error('We could not send your safety help request. Please try again.');
      }

      setEmailSent(true);
      setSubmitted(true);
    } catch (error) {
      console.error('Safety help submission failed:', error);
      setErrors({
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while submitting. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#7E6BB3] hover:underline"
        >
          <span className="text-[#3D8A1E] text-base font-extrabold leading-none">←</span>
          Back
        </button>

        <section
          className="w-full rounded-3xl p-6 sm:p-12"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >
          <h1 className="font-poppins text-[clamp(28px,3vw,38px)] font-bold leading-tight text-[#2B2740]">
            Request Safety Help
          </h1>
          <div className="my-5 h-[2px] w-[100px] bg-gradient-to-r from-[#7E6BB3] to-[#2B2740]" />
          <p className="font-inter text-sm leading-relaxed text-[#4A4560]">
            Have a question about an adventure operator, a safety assessment, or a concern during a trip? Send our team the details and we will help you understand what to do next.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-[0_8px_20px_rgba(43,39,64,0.12)] sm:p-8">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE7FB] text-[#7E6BB3]">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>
              <h2 className="font-poppins text-xl font-semibold text-[#7E6BB3]">Your request has been received</h2>
              <p className="mt-4 font-inter text-sm leading-relaxed text-[#4A4560]">
                Our team will review your safety question and follow up at <span className="font-semibold">{formData.email}</span>.
              </p>
              {emailSent && <p className="mt-3 font-inter text-sm text-[#3D8A1E]">A confirmation email has been sent.</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl bg-[#FAF9FE] p-4 shadow-[0_8px_20px_rgba(43,39,64,0.12)] sm:p-8">
              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="Enter your full name"
                  className={`w-full rounded-lg border px-4 py-3 font-inter text-sm outline-none focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB] ${errors.name ? 'border-[#C51D14]' : 'border-[#EDE7FB]'}`}
                />
                {errors.name && <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block font-poppins text-xs font-semibold">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="name@example.com"
                  className={`w-full rounded-lg border px-4 py-3 font-inter text-sm outline-none focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB] ${errors.email ? 'border-[#C51D14]' : 'border-[#EDE7FB]'}`}
                />
                {errors.email && <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-poppins text-xs font-semibold">What do you need help with?</label>
                  <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-[#EDE7FB] bg-white px-4 py-3 font-inter text-sm outline-none focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]">
                    <option value="">Select a category...</option>
                    {HELP_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-poppins text-xs font-semibold">Urgency</label>
                  <select value={priority} onChange={(event) => setPriority(event.target.value)} className="w-full rounded-lg border border-[#EDE7FB] bg-white px-4 py-3 font-inter text-sm outline-none focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB]">
                    {PRIORITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="font-poppins text-xs font-semibold">How can we help?</label>
                  <span className="font-inter text-xs text-[#9A95A8]">{formData.message.length}/{MAX_MESSAGE_CHARS}</span>
                </div>
                <textarea
                  rows={6}
                  maxLength={MAX_MESSAGE_CHARS}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  placeholder="Describe your safety question or concern..."
                  className={`w-full resize-none rounded-lg border px-4 py-3 font-inter text-sm outline-none focus:border-[#7E6BB3] focus:ring-2 focus:ring-[#EDE7FB] ${errors.message ? 'border-[#C51D14]' : 'border-[#EDE7FB]'}`}
                />
                {errors.message && <p className="mt-1 font-inter text-xs text-[#C51D14]">{errors.message}</p>}
              </div>

              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#7E6BB3] py-3 font-poppins text-xs font-semibold text-white transition-colors hover:bg-[#68559D] disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? 'Submitting...' : 'Submit Safety Help Request'}
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
