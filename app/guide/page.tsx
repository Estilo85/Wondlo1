import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          href="/help"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-[#7E6BB3] hover:underline"
        >
          <span className="text-[#3D8A1E] text-base font-extrabold leading-none">←</span>
          Back to Help Center
        </Link>

        <div
          className="w-full rounded-3xl overflow-hidden"
          style={{
            backgroundColor: '#F6F4FE',
            border: '0.1px solid rgba(43, 39, 64, 0.10)',
            boxShadow: '0 8px 30px rgba(43, 39, 64, 0.20)',
          }}
        >
          {/* Header */}
          <div className="px-6 sm:px-10 lg:px-14 pt-8 sm:pt-10 pb-7 sm:pb-8">
            <div className="max-w-3xl">
              <p className="font-poppins mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7E6BB3]">
                Wondlo Help Center
              </p>

              <h1
                className="font-poppins text-[#2B2740]"
                style={{
                  fontSize: 'clamp(28px, 3vw, 38px)',
                  fontWeight: 700,
                  lineHeight: '1.25',
                }}
              >
                User Guide
              </h1>

              <div
                className="my-5 h-[2px] w-[100px]"
                style={{
                  background:
                    'linear-gradient(90deg, #7E6BB3 0%, #2B2740 100%)',
                }}
              />

              <p
                className="font-inter text-[#4A4560] max-w-2xl"
                style={{ fontSize: '14px', lineHeight: '1.7' }}
              >
                How Wondlo works and how to find your way around the platform.
              </p>
            </div>
          </div>

          <div className="border-t border-[#2B2740]/10" />

          <div className="px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
            {/* Contents */}
            <section
              className="mb-8 rounded-2xl p-5 sm:p-6"
              style={{
                background:
                  'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)',
                border: '0.1px solid rgba(126, 107, 179, 0.20)',
                boxShadow: '0 4px 14px rgba(43, 39, 64, 0.06)',
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="sm:min-w-[180px]">
                  <p className="font-poppins text-xs font-semibold uppercase tracking-[0.12em] text-[#7E6BB3]">
                    Guide overview
                  </p>
                  <h2 className="font-poppins mt-1 text-lg font-semibold text-[#2B2740]">
                    Contents
                  </h2>
                </div>

                <ol className="grid flex-1 grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <li>
                    <a href="#what-is-wondlo" className="text-[#7E6BB3] hover:underline">
                      01. What is Wondlo?
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="text-[#7E6BB3] hover:underline">
                      02. How the System Works
                    </a>
                  </li>
                  <li>
                    <a href="#getting-started" className="text-[#7E6BB3] hover:underline">
                      03. Getting Started
                    </a>
                  </li>
                  <li>
                    <a href="#navigating" className="text-[#7E6BB3] hover:underline">
                      04. Navigating the Platform
                    </a>
                  </li>
                  <li>
                    <a href="#searching" className="text-[#7E6BB3] hover:underline">
                      05. Analysing an Adventure
                    </a>
                  </li>
                  <li>
                    <a href="#reading-report" className="text-[#7E6BB3] hover:underline">
                      06. Reading your Safety Report
                    </a>
                  </li>
                  <li>
                    <a href="#dashboard" className="text-[#7E6BB3] hover:underline">
                      07. Dashboard &amp; Search History
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="text-[#7E6BB3] hover:underline">
                      08. Free Tier &amp; Upgrading
                    </a>
                  </li>
                  <li>
                    <a href="#community" className="text-[#7E6BB3] hover:underline">
                      09. Community
                    </a>
                  </li>
                  <li>
                    <a href="#support" className="text-[#7E6BB3] hover:underline">
                      10. Help &amp; Support
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="text-[#7E6BB3] hover:underline">
                      11. Troubleshooting &amp; FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#glossary" className="text-[#7E6BB3] hover:underline">
                      12. Glossary
                    </a>
                  </li>
                </ol>
              </div>
            </section>

            <div className="space-y-6 font-inter leading-relaxed text-[#4A4560]">
              {/* What is Wondlo */}
              <section
                id="what-is-wondlo"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-5 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    01
                  </span>
                  <div>
                    <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                      What is Wondlo?
                    </h2>
                  </div>
                </div>

                <div className="max-w-4xl space-y-3 text-sm leading-7">
                  <p>
                    Wondlo is an <strong>adventure safety intelligence</strong> platform.
                    Before you book an adventure (trekking, climbing, kayaking,
                    paragliding, safari, and more), you type in the company&apos;s name,
                    website, or social media handle, and Wondlo produces a{' '}
                    <strong>Safety Report</strong> that answers one question: is it safe
                    before I pay a deposit?
                  </p>
                  <p>
                    Wondlo is a research layer that gathers publicly available
                    information about an operator and evaluates it against a{' '}
                    <strong>7-step safety framework</strong>. It does not replace
                    booking platforms.
                  </p>
                </div>
              </section>

              {/* How it works */}
              <section
                id="how-it-works"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-5 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    02
                  </span>
                  <div>
                    <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                      How the System Works
                    </h2>
                  </div>
                </div>

                <div className="space-y-7 text-sm">
                  <div>
                    <p className="mb-4 max-w-4xl leading-7">
                      Every search moves through four steps, exactly as described on the
                      homepage (&ldquo;How it works&rdquo;):
                    </p>

                    <div className="overflow-hidden rounded-xl border border-[#2B2740]/10">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-sm">
                          <thead
                            style={{
                              background:
                                'linear-gradient(90deg, #7E6BB3 25%, #2B2740 100%)',
                            }}
                          >
                            <tr className="text-left font-poppins text-white">
                              <th className="w-[37%] whitespace-nowrap px-4 py-3 font-semibold">Step</th>
                              <th className="px-4 py-3 font-semibold">What happens</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2B2740]/10">
                            {[
                              ['01 — Search Operator', 'Enter a company name, website, or social handle.'],
                              ['02 — Collect Public Information', 'The system gathers incidents, operator claims, safety-specific information, community notes, and government advisories.'],
                              ['03 — Evaluate Safety Evidence', 'Evidence is scored across a 7-dimension safety framework.'],
                              ['04 — Receive Safety Report', 'A structured summary with a safety score and detailed risk breakdown.'],
                            ].map(([step, description]) => (
                              <tr key={step}>
                                <td className="w-[37%] whitespace-nowrap px-4 py-3 align-top font-semibold text-[#2B2740]">
                                  {step}
                                </td>
                                <td className="px-4 py-3 align-top text-[#4A4560]">
                                  {description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      The 7 Safety Dimensions
                    </h3>
                    <p className="mb-4 leading-7">
                      Every report assesses the operator across these 7 dimensions:
                    </p>

                    <div className="overflow-hidden rounded-xl border border-[#2B2740]/10">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-sm">
                          <thead
                            style={{
                              background:
                                'linear-gradient(90deg, #7E6BB3 25%, #2B2740 100%)',
                            }}
                          >
                            <tr className="text-left font-poppins text-white">
                              <th className="px-4 py-3 font-semibold">Dimension</th>
                              <th className="px-4 py-3 font-semibold">What it measures</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2B2740]/10">
                            <tr>
                              <td className="px-4 py-3 align-top">Quality of Experience</td>
                              <td className="px-4 py-3">Reviews, traveller satisfaction, value.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 align-top">Quality of Regulation</td>
                              <td className="px-4 py-3">Licensing, permits, adherence to regulations.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 align-top">Incident History</td>
                              <td className="px-4 py-3">Reported incidents, severity, recency.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 align-top">Business Information</td>
                              <td className="px-4 py-3">Operator identity, legitimacy, contactable info.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 align-top">Risk Assessment</td>
                              <td className="px-4 py-3">How well risks are identified and managed.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 align-top">Equipment Assessment</td>
                              <td className="px-4 py-3">Equipment quality, inspection, maintenance.</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 align-top">Safety Sentiment</td>
                              <td className="px-4 py-3">Community/traveller sentiment about safety.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p
                      className="rounded-xl p-4 leading-6"
                      style={{ background: 'linear-gradient(135deg, #C7B5F5 0%, #EDE7FB 100%)' }}>
                      The <strong>Overall Safety Score</strong> is based on these 7
                      dimensions, and the <strong>Confidence</strong> figure expresses
                      how strongly the model stands behind the result.
                    </p>

                    <p
                      className="rounded-xl  p-4 text-sm leading-6"
                      style={{ background: 'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)' }}
                    >
                      <strong>Important Note:</strong> Reports are AI-assisted
                      assessments based on publicly available information.
                    </p>
                  </div>
                </div>
              </section>

              {/* Getting started */}
              <section
                id="getting-started"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    03
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Getting Started
                  </h2>
                </div>

                <div className="grid gap-7 lg:grid-cols-3">
                  <div>
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      Create an Account
                    </h3>
                    <ol className="list-decimal space-y-1 pl-5 text-sm leading-6">
                      <li>Go to the homepage and click <strong>Sign Up</strong> (top-right).</li>
                      <li>Enter your <strong>full name</strong> and <strong>email address</strong>.</li>
                      <li>Click <strong>Create an account</strong>.</li>
                    </ol>
                    <p
                      className="mt-3 rounded-xl bg-[#EDE7FB] p-3 text-sm leading-6"
                      style={{ background: 'linear-gradient(135deg, #C7B5F5 0%, #EDE7FB 100%)' }}
                    >
                      Every new account is entitled to <strong>3 free safety checks</strong>.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      Set Your Password (Important)
                    </h3>
                    <p className="text-sm leading-6">
                      You do <strong>not</strong> choose a password at sign-up. Wondlo emails
                      you a &ldquo;Welcome to Wondlo — Set Your Password&rdquo; email
                      containing a <strong>Set Your Password</strong> button.
                    </p>
                    <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
                      <li>Open the email.</li>
                      <li>Click the link — it opens the <strong>Set Password</strong> page for your email.</li>
                      <li>Enter a password (at least 6 characters), confirm it, and click <strong>Save Password &amp; Continue</strong>.</li>
                      <li>You are signed in automatically and returned to the homepage.</li>
                    </ol>
                    <p className="mt-3 text-sm leading-6">
                      If you try to sign in before setting your password, sign-in will fail.
                      Check your inbox (and spam folder) for the welcome email.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      Sign In
                    </h3>
                    <ol className="list-decimal space-y-1 pl-5 text-sm leading-6">
                      <li>Click <strong>Sign In</strong> in the top navigation.</li>
                      <li>Enter your email and password (a <strong>Show / Hide</strong> toggle is available).</li>
                      <li>Click <strong>Sign In</strong> — you land on your <strong>Dashboard</strong>. The first time, you have <strong>3 searches left</strong>.</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Navigating */}
              <section
                id="navigating"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    04
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Navigating the Platform
                  </h2>
                </div>

                <h3 className="font-poppins mb-3 text-base font-semibold text-[#2B2740]">
                  Site Map
                </h3>

                <div className="overflow-hidden rounded-xl border border-[#2B2740]/10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-sm">
                      <thead
                        style={{
                          background:
                            'linear-gradient(90deg, #7E6BB3 25%, #2B2740 100%)',
                        }}
                      >
                        <tr className="text-left font-poppins text-white">
                          <th className="px-4 py-3 font-semibold">Page</th>
                          <th className="px-4 py-3 font-semibold">Where to find it</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2B2740]/10">
                        <tr><td className="px-4 py-3 align-top">Homepage</td><td className="px-4 py-3">Logo / HOME link</td></tr>
                        <tr><td className="px-4 py-3 align-top">Sign Up</td><td className="px-4 py-3"><Link href="/signup" className="text-[#7E6BB3] hover:underline">Sign Up</Link> button</td></tr>
                        <tr><td className="px-4 py-3 align-top">Sign In</td><td className="px-4 py-3"><Link href="/signin" className="text-[#7E6BB3] hover:underline">Sign In</Link> button</td></tr>
                        <tr><td className="px-4 py-3 align-top">Set Password</td><td className="px-4 py-3">Link inside the welcome email</td></tr>
                        <tr><td className="px-4 py-3 align-top">Dashboard</td><td className="px-4 py-3">After signing in</td></tr>
                        <tr><td className="px-4 py-3 align-top">Safety Report</td><td className="px-4 py-3">Automatically after a search</td></tr>
                        <tr><td className="px-4 py-3 align-top">Upgrade / Plans</td><td className="px-4 py-3">Upgrade button when a search limit is reached</td></tr>
                        <tr><td className="px-4 py-3 align-top">Help Center</td><td className="px-4 py-3">Footer &rarr; Help Center</td></tr>
                        <tr><td className="px-4 py-3 align-top">Report an Issue / Request a Feature</td><td className="px-4 py-3">Footer &rarr; Report an Issue, or Actions bar on a report</td></tr>
                        <tr><td className="px-4 py-3 align-top">Request Safety Help</td><td className="px-4 py-3">Actions bar on a report</td></tr>
                        <tr><td className="px-4 py-3 align-top">Privacy Policy / Terms</td><td className="px-4 py-3">Footer</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 className="font-poppins mb-3 mt-7 text-base font-semibold text-[#2B2740]">
                  Common Navigation Elements
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-xl bg-[#EDE7FB] p-4 text-sm leading-6"
                    style={{
                      background:'radial-gradient(circle at bottom right, #C7B5F5 0%, #EDE7FB 75%)'}}>
                    <strong>Top navigation bar</strong> — Wondlo logo (home), HOME, Sign In, Sign Up, and (when relevant) Analyse Another.
                  </div>
                  <div
                    className="rounded-xl bg-[#EDE7FB] p-4 text-sm leading-6"
                    style={{
                      background:'radial-gradient(circle at bottom left, #C7B5F5 0%, #EDE7FB 75%)'}}>
                    <strong>Footer</strong> — Help Center, Report an Issue, Privacy Policy, Terms of Service, contact email, and social links.
                  </div>
                  <div
                    className="rounded-xl bg-[#EDE7FB] p-4 text-sm leading-6"
                    style={{
                      background:'radial-gradient(circle at top right, #C7B5F5 0%, #EDE7FB 75%)'}}>
                    <strong>Profile menu</strong> — avatar with a green dot (top-right on Dashboard, reports, and Upgrade pages). Opens <strong>Sign Out</strong>.
                  </div>
                  <div
                    className="rounded-xl bg-[#EDE7FB] p-4 text-sm leading-6"
                    style={{
                      background:'radial-gradient(circle at top left, #C7B5F5 0%, #EDE7FB 75%)'}}>
                    <strong>Sidebar</strong> — on report pages (toggle button, top-right). Your name, searches remaining, <strong>previous search history</strong>, and <strong>safety cards</strong>.
                  </div>
                </div>
              </section>

              {/* Searching */}
              <section
                id="searching"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    05
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Analysing an Adventure
                  </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
                  <div>
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-6">
                      <li>Sign in (you land on the <strong>Dashboard</strong>).</li>
                      <li>In the search box, type a <strong>company name, website, or social media handle</strong> — for example &ldquo;Summit Trails Expeditions&rdquo;.</li>
                      <li>Press Enter or click <strong>Analyse Adventure</strong>.</li>
                      <li>You are taken straight to the <strong>Safety Report</strong> page for that operator.</li>
                    </ol>
                  </div>

                  <div
                    className="rounded-xl p-5"
                      style={{background: 'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)',}}>
                    <ul className="space-y-3 text-sm leading-6">
                      <li>Searching requires a signed-in account. If you are not signed in, Wondlo redirects you to <strong>Sign In</strong> first.</li>
                      <li>Duplicate searches do <strong>not</strong> consume an extra search — looking up the same operator again returns the saved report.</li>
                      <li>Each <em>new</em> operator uses <strong>one</strong> of your 3 free checks.</li>
                      <li>The <strong>Adventure type</strong> chips below the search box (Trekking, Kayaking, … and a <strong>More</strong> list) are informational — you still type the operator into the search box.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Reading report */}
              <section
                id="reading-report"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    06
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Reading Your Safety Report
                  </h2>
                </div>

                <p className="mb-6 text-sm leading-7">
                  The report page is the heart of Wondlo. From top to bottom:
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Report header', <>Operator name with a verification badge, location, activity type, <strong>Report Generated</strong> and <strong>Data Collected Up To</strong> dates, plus a <strong>Back to Search</strong> link and report metadata (Assessment Version and Generated date).</>],
                    ['Overall Safety Score', <>A score <strong>out of 100</strong> with a <strong>risk level</strong> badge (for example &ldquo;Low Risk&rdquo;) and a progress bar. The <strong>i</strong> icons are info hints.</>],
                    ['Confidence', <>A percentage showing how strongly the model stands behind the assessment — &ldquo;This operator satisfies our trained model&apos;s 7 required dimensions for safety.&rdquo;</>],
                    ['Safety Summary', <>A plain-language paragraph explaining what the evidence means, followed by tags: green-check tags for passing dimensions and warning tags for those that need attention.</>],
                    ['Risk Breakdown', <>A horizontal score bar for each of the <strong>7 dimensions</strong> (score /100).</>],
                    ['Incident Timeline', <>A chronological record of reported safety events, each with a <strong>date</strong>, <strong>severity</strong> (None / Minor / Moderate / Major), title, description, and <strong>source</strong> (Instagram, news article, rescue log, etc.). Severity colours: purple (minor), amber (moderate), red (major), grey (none).</>],
                    ['Assessment', <>A single-sentence conclusion about how the operator measures up.</>],
                    ['Recommended Documents to Request', <>Documents you can ask the operator for: <strong>Safety Plan</strong>, <strong>Equipment Inspection Records</strong>, <strong>Emergency Response Plan</strong>, <strong>Insurance</strong>, and <strong>Permits &amp; Authorisations</strong>.</>],
                  ].map(([title, content]) => (
                    <div
                      key={title as string}
                      className="rounded-xl border border-[#2B2740]/10 bg-[#FAF9FE] p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F0EBFB]"
                    >
                      <h3 className="font-poppins mb-2 text-sm font-semibold text-[#2B2740]">
                        {title as string}
                      </h3>
                      <p className="text-sm leading-6">{content}</p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-6 rounded-xl p-5"
                  style={{ background: 'linear-gradient(135deg, #C7B5F5 0%, #EDE7FB 100%)' }}>
                  <h3 className="font-poppins mb-2 text-sm font-semibold text-[#2B2740]">
                    Actions
                  </h3>
                  <ul className="grid gap-2 text-sm leading-6 sm:grid-cols-2">
                    <li><strong>Report a Bug</strong> — opens the issue form pre-set to bug reporting.</li>
                    <li><strong>Request a Feature</strong> — opens the feature request form.</li>
                    <li><strong>Request Safety Help</strong> — opens the safety help form.</li>
                    <li><strong>Download Recommended Questions</strong> — downloads a PDF with <strong>25 questions</strong> to ask an operator, grouped into 7 categories, plus a Traveller Safety Reminder.</li>
                  </ul>
                </div>
              </section>

              {/* Dashboard */}
              <section
                id="dashboard"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    07
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Dashboard &amp; Search History
                  </h2>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <p className="text-sm leading-7">
                      The <strong>Dashboard</strong> is your home after sign-in: the search
                      box, an informative message, and your <strong>searches remaining</strong>.
                    </p>

                    <ul className="mt-4 space-y-2 text-sm leading-6">
                      <li>On sign-in, Wondlo automatically opens your <strong>most recent</strong> report.</li>
                      <li>To start a brand-new search, click <strong>Analyse Another Adventure</strong>.</li>
                      <li>If you have <strong>0 searches left</strong>, the Analyse button shows the upgrade message instead of searching.</li>
                    </ul>
                  </div>

                  <div
                    className="rounded-xl p-5"
                    style={{ background: 'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)' }}>
                    <p className="text-sm leading-6">
                      The <strong>sidebar</strong> (open from a report page via the toggle,
                      top-right) contains your name, <strong>searches left</strong>,{' '}
                      <strong>Recent History</strong> (tap to reopen a past report), up to
                      three <strong>safety cards</strong>, and <strong>Sign out</strong>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section
                id="pricing"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    08
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Free Tier &amp; Upgrading
                  </h2>
                </div>

                <p className="text-sm leading-7">
                  Every account starts on the <strong>Free Trial</strong> —{' '}
                  <strong>0£ / month</strong> — with <strong>three searches</strong>.
                  Once used, further new searches are blocked with:
                </p>

                <p
                  className="mt-4 rounded-xl border p-4 text-sm-regular leading-6 text-[#C51D14]"
                  style={{background: 'linear-gradient(135deg, #ff8f8fcf 40%, #ffe0e0 100%)'}}>
                  &ldquo;You have reached your 3 free searches. Upgrade to analyse another
                  adventure.&rdquo;
                </p>

                <div className="mt-5 overflow-hidden rounded-xl border border-[#2B2740]/10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-sm">
                      <thead
                        style={{
                          background:
                            'linear-gradient(90deg, #7E6BB3 25%, #2B2740 100%)',
                        }}
                      >
                        <tr className="text-left font-poppins text-white">
                          <th className="px-4 py-3 font-semibold">Plan</th>
                          <th className="px-4 py-3 font-semibold">Price</th>
                          <th className="px-4 py-3 font-semibold">Includes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2B2740]/10">
                        <tr>
                          <td className="px-4 py-3 align-top font-semibold">Pay As You Go</td>
                          <td className="px-4 py-3 align-top">3£ / search</td>
                          <td className="px-4 py-3">One search, Adventure Preparedness, Safety Digest, Operator Chat Diagnosis.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 align-top font-semibold">Starter Plan</td>
                          <td className="px-4 py-3 align-top">15£ / month</td>
                          <td className="px-4 py-3">Seven searches / month, Adventure Preparedness, Safety Digest, Operator Chat Diagnosis.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-4 text-sm">
                  Compare the plans on the <strong>Upgrade</strong> page.
                </p>
              </section>

              {/* Community */}
              <section
                id="community"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-5 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    09
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Community
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-xl p-4 text-sm leading-6"
                    style={{ background: 'linear-gradient(135deg, #EDE7FB 0%, #C7B5F5 100%)' }}>
                    <strong>Join the Telegram community</strong> via the footer (&ldquo;Join us on&rdquo;). A confirmation page forwards you to the group after about 2 seconds.
                  </div>
                  <div
                    className="rounded-xl p-4 text-sm leading-6"
                    style={{ background: 'linear-gradient(135deg, #C7B5F5 0%, #EDE7FB 100%)' }}>
                    <strong>Refer Your Travel Buddy</strong> — on the Sign Up and Sign In pages there is a button that copies the Wondlo link to your clipboard.
                  </div>
                </div>
              </section>

              {/* Support */}
              <section
                id="support"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    10
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Help &amp; Support
                  </h2>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-[#2B2740]/10 bg-[#FAF9FE] p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F0EBFB]">
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      Help Center
                    </h3>
                    <p className="text-sm leading-6">
                      Quick-launch cards for <Link href="/signup" className="text-[#7E6BB3] hover:underline">Account Setup</Link> and{' '}
                      <Link href="/report-issue" className="text-[#7E6BB3] hover:underline">Reporting Issues</Link>. This guide is one click away from it.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#2B2740]/10 bg-[#FAF9FE] p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F0EBFB]">
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      Report an Issue or Request a Feature
                    </h3>
                    <p className="text-sm leading-6">
                      Provide your name, email, a category, a priority (Low / Medium /
                      High / Critical), a description (max 1,000 characters), and an
                      optional attachment (screenshot or PDF, max 2MB). A confirmation
                      email is sent to your address.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#2B2740]/10 bg-[#FAF9FE] p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F0EBFB]">
                    <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                      Request Safety Help
                    </h3>
                    <p className="text-sm leading-6">
                      For safety questions about an operator, an assessment, or a concern
                      during a trip. Choose a category and urgency (Low / Medium / High /
                      Urgent) and describe the question (max 1,200 characters).
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section
                id="faq"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    11
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Troubleshooting &amp; FAQ
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Why can\'t I sign in?', 'Most likely you have not set a password yet. Find the “Set Your Password” welcome email, set a password, then sign in.'],
                    ['I got the “free search limit” message.', 'You have used your 3 free searches. You will need to upgrade to analyse another adventure.'],
                    ['Why does the score look unexpected for a small operator?', 'Reports are based on publicly available information only. A small or new operator may show lower confidence, which reflects the amount of available evidence — not necessarily poor practice.'],
                    ['My search is not working.', 'Make sure you are signed in and use a company name, website, or social handle.'],
                    ['Do reports expire?', 'Reports are saved to your account. Re-opening a past search returns the saved report; the header shows how current the data is.'],
                    ['Is Wondlo a replacement for official travel advice?', 'No. Wondlo’s AI-assisted assessments should support — not replace — official travel advisories.'],
                  ].map(([question, answer]) => (
                    <div
                      key={question}
                      className="rounded-xl border border-[#2B2740]/10 bg-[#FAF9FE] p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F0EBFB]"
                    >
                      <p className="font-poppins font-semibold text-[#2B2740]">
                        {question}
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        {answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Glossary */}
              <section
                id="glossary"
                className="scroll-mt-8 rounded-2xl bg-[#F6F4FE]/75 p-6 sm:p-7"
                style={{
                  border: '0.1px solid rgba(43, 39, 64, 0.10)',
                  boxShadow: '0 5px 18px rgba(43, 39, 64, 0.07)',
                }}
              >
                <div className="mb-6 flex items-start gap-4">
                  <span
                    className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-poppins text-xs font-bold text-[#2B2740]"
                    style={{
                      background:
                        'linear-gradient(180deg, #EDE7FB 0%, #C7B5F5 100%)',
                    }}
                  >
                    12
                  </span>
                  <h2 className="font-poppins text-xl font-semibold text-[#2B2740]">
                    Glossary
                  </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#2B2740]/10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                      <tbody className="divide-y divide-[#2B2740]/10">
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Safety Score</td><td className="px-4 py-3">0–100 weighted score across the 7 dimensions.</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Risk Level</td><td className="px-4 py-3">Categorical verdict shown next to the score (e.g. Low Risk).</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Confidence</td><td className="px-4 py-3">How strongly the model stands behind the assessment (%).</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Dimension</td><td className="px-4 py-3">One of the 7 areas of the safety framework.</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Incident Timeline</td><td className="px-4 py-3">Chronological record of reported safety events.</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Operator</td><td className="px-4 py-3">The adventure provider you are researching.</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Free Searches</td><td className="px-4 py-3">3 new-operator checks included with every account.</td></tr>
                        <tr><td className="w-[30%] px-4 py-3 align-top font-semibold text-white" style={{ background: 'linear-gradient(90deg, #2B2740 25%, #7E6BB3 100%)' }}>Safety Card</td><td className="px-4 py-3">Compact recap of one report (score + risk + incidents).</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}