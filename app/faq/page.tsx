import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ_GROUPS: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: 'Payments',
    items: [
      {
        q: 'What payment methods does Wondlo accept?',
        a: (
          <>
            We accept Visa, Mastercard, American Express and Discover debit or credit cards,
            entered securely at checkout. We do not currently support payment wallets.
          </>
        ),
      },
      {
        q: 'Do I need a card to start the free trial?',
        a: (
          <>
            No. The Free Trial gives you 3 safety searches at no cost and without adding a
            payment card. You only add a card when you choose a paid plan or top up searches.
          </>
        ),
      },
      {
        q: 'What currency am I charged in?',
        a: (
          <>
            All purchases are billed in GBP (£). The currency selector on the plans and billing
            pages is for display only — it shows estimated equivalents in other currencies, but
            the actual amount charged to your card is always in pounds.
          </>
        ),
      },
      {
        q: 'When is my card charged?',
        a: (
          <>
            Pay As You Go is charged once, immediately at purchase. The Starter Plan renews
            automatically at the end of each monthly billing cycle using your default card.
          </>
        ),
      },
    ],
  },
  {
    title: 'Refunds',
    items: [
      {
        q: 'Can I get a refund for a Pay As You Go purchase?',
        a: (
          <>
            If you have not used any of the searches from a Pay As You Go top-up and you contact
            us within 7 days of purchase, we will refund the full amount to the card used.
          </>
        ),
      },
      {
        q: 'Can I get a refund for the Starter Plan?',
        a: (
          <>
            If you cancel within 7 days of the most recent monthly charge and have used fewer
            than half of that month&apos;s searches, we will refund that charge in full or
            pro-rated. Refund requests after 7 days are not eligible.
          </>
        ),
      },
      {
        q: 'How do I request a refund?',
        a: (
          <>
            Email{' '}
            <a
              href="mailto:partnership@joinwondlo.com"
              className="font-semibold text-[#7E6BB3] hover:underline"
            >
              partnership@joinwondlo.com
            </a>{' '}
            with your account email and order reference (shown on your receipt). We aim to
            respond within 3 working days.
          </>
        ),
      },
    ],
  },
  {
    title: 'Cancellation',
    items: [
      {
        q: 'How do I cancel my Starter Plan subscription?',
        a: (
          <>
            Email{' '}
            <a
              href="mailto:partnership@joinwondlo.com"
              className="font-semibold text-[#7E6BB3] hover:underline"
            >
              partnership@joinwondlo.com
            </a>{' '}
            from your registered account email, or request cancellation from your Billing page.
            We&apos;ll confirm and stop future charges.
          </>
        ),
      },
      {
        q: 'What happens after I cancel?',
        a: (
          <>
            Your searches remain available until the end of your current billing cycle. After
            that, your account returns to the free options and you are not charged again
            (subject to the refund policy above for the current cycle).
          </>
        ),
      },
      {
        q: 'Do I need to cancel Pay As You Go?',
        a: (
          <>
            No. Pay As You Go is a one-time purchase, not a subscription, so there is nothing to
            cancel. It stops automatically when your prepaid searches are used up.
          </>
        ),
      },
    ],
  },
];

const itemClass =
  'rounded-2xl bg-[#FCFCFB] p-4 transition-colors duration-200 hover:bg-white';
const borderStyle = { border: '0.1px solid rgba(43, 39, 64, 0.10)', boxShadow: '0 8px 20px rgba(43, 39, 64, 0.06)' };

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12">
        <div
          className="w-full rounded-3xl p-8 sm:p-12"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >
          <div>
            <h1
              className="font-poppins text-[#2B2740]"
              style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 700, lineHeight: '1.25' }}
            >
              Payments, Refunds & Cancellation FAQ
            </h1>

            <div
              className="my-5 h-[2px] w-[100px]"
              style={{ background: 'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)' }}
            />

            <p
              className="font-inter text-[#4A4560]"
              style={{ fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
            >
              Everything you need to know about paying for Wondlo, getting a refund and
              cancelling your plan.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {FAQ_GROUPS.map((group) => (
              <section key={group.title}>
                <h2 className="font-poppins mb-4 text-lg font-semibold text-[#2B2740]">
                  {group.title}
                </h2>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <details key={item.q} className={itemClass} style={borderStyle}>
                      <summary className="font-poppins cursor-pointer list-none text-sm font-semibold text-[#2B2740] [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-3">
                          <span>{item.q}</span>
                          <svg
                            className="h-4 w-4 flex-shrink-0 text-[#7E6BB3] transition-transform duration-200 [details[open]_&]:rotate-180"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </summary>

                      <p
                        className="mt-3 font-inter text-sm text-[#4A4560]"
                        style={{ lineHeight: '1.6' }}
                      >
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-[#FCFCFB] p-6 text-center" style={borderStyle}>
            <p className="font-poppins text-sm font-semibold text-[#2B2740]">
              Still have a question?
            </p>
            <p className="font-inter text-sm text-[#4A4560]">
              Email us at{' '}
              <a
                href="mailto:partnership@joinwondlo.com"
                className="font-semibold text-[#7E6BB3] hover:underline"
              >
                partnership@joinwondlo.com
              </a>{' '}
              — we usually reply within 3 working days.
            </p>
            <Link
              href="/payments"
              className="mt-1 text-xs font-semibold text-[#7E6BB3] transition-colors hover:text-[#2B2740]"
            >
              View plans &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}