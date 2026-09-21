import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FE] text-[#2B2740]">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12">

        <Link
          href="/help"
          className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#7E6BB3] hover:underline"
        >
          <span className="text-[#3D8A1E] text-base font-extrabold leading-none">←</span>
          Back to Help Center
        </Link>

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

            <p className="font-inter text-[#4A4560]" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              How Wondlo works and how to find your way around the platform.
            </p>
          </div>

          <div className="mt-8 space-y-6 font-inter leading-relaxed text-[#4A4560]">

            <section
              className="rounded-2xl bg-[#FCFCFB] p-6"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-3 text-lg font-semibold text-[#2B2740]">
                Contents
              </h2>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                <li><a href="#what-is-wondlo" className="text-[#7E6BB3] hover:underline">What is Wondlo?</a></li>
                <li><a href="#how-it-works" className="text-[#7E6BB3] hover:underline">How the system works</a></li>
                <li><a href="#getting-started" className="text-[#7E6BB3] hover:underline">Getting started</a></li>
                <li><a href="#navigating" className="text-[#7E6BB3] hover:underline">Navigating the platform</a></li>
                <li><a href="#searching" className="text-[#7E6BB3] hover:underline">Analysing an adventure</a></li>
                <li><a href="#reading-report" className="text-[#7E6BB3] hover:underline">Reading your Safety Report</a></li>
                <li><a href="#dashboard" className="text-[#7E6BB3] hover:underline">Dashboard & search history</a></li>
                <li><a href="#pricing" className="text-[#7E6BB3] hover:underline">Free tier & upgrading</a></li>
                <li><a href="#community" className="text-[#7E6BB3] hover:underline">Community</a></li>
                <li><a href="#support" className="text-[#7E6BB3] hover:underline">Help & support</a></li>
                <li><a href="#faq" className="text-[#7E6BB3] hover:underline">Troubleshooting & FAQ</a></li>
                <li><a href="#glossary" className="text-[#7E6BB3] hover:underline">Glossary</a></li>
              </ol>
            </section>

            <section id="what-is-wondlo"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                1. What is Wondlo?
              </h2>
              <p>
                Wondlo is an <strong>adventure safety intelligence</strong> platform.
                Before you book an adventure (trekking, climbing, kayaking,
                paragliding, safari, and more), you type in the company&apos;s name,
                website, or social media handle, and Wondlo produces a{' '}
                <strong>Safety Report</strong> that answers one question: is it safe
                before I pay a deposit?
              </p>
              <p className="mt-2">
                Wondlo is a research layer that gathers publicly available
                information about an operator and evaluates it against a{' '}
                <strong>7-step safety framework</strong>. It does not replace
                booking platforms.
              </p>
            </section>

            <section id="how-it-works"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                2. How the system works
              </h2>
              <p>
                Every search moves through four steps, exactly as described on the
                homepage (&ldquo;How it works&rdquo;):
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left font-poppins text-[#7E6BB3]">
                      <th className="pb-2 pr-3">Step</th>
                      <th className="pb-2 pr-3">What happens</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 pr-3 align-top font-semibold">01 — Search Operator</td>
                      <td className="py-1">Enter a company name, website, or social handle.</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-3 align-top font-semibold">02 — Collect Public Information</td>
                      <td className="py-1">The system gathers incidents, operator claims, safety-specific information, community notes, and government advisories.</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-3 align-top font-semibold">03 — Evaluate Safety Evidence</td>
                      <td className="py-1">Evidence is scored across a 7-dimension safety framework.</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-3 align-top font-semibold">04 — Receive Safety Report</td>
                      <td className="py-1">A structured summary with a safety score and detailed risk breakdown.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-poppins mb-2 mt-6 text-base font-semibold text-[#2B2740]">
                The 7 safety dimensions
              </h3>
              <p>
                Every report scores the operator out of <strong>100</strong> across
                these weighted dimensions:
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left font-poppins text-[#7E6BB3]">
                      <th className="pb-2 pr-3">Dimension</th>
                      <th className="pb-2 pr-3">Weight</th>
                      <th className="pb-2">What it measures</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-1 pr-3 align-top">Quality of Experience</td><td className="py-1 pr-3 align-top">10%</td><td className="py-1">Reviews, traveller satisfaction, value.</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Quality of Regulation</td><td className="py-1 pr-3 align-top">15%</td><td className="py-1">Licensing, permits, adherence to regulations.</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Incident History</td><td className="py-1 pr-3 align-top">20%</td><td className="py-1">Reported incidents, severity, recency.</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Business Information</td><td className="py-1 pr-3 align-top">10%</td><td className="py-1">Operator identity, legitimacy, contactable info.</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Risk Assessment</td><td className="py-1 pr-3 align-top">15%</td><td className="py-1">How well risks are identified and managed.</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Equipment Assessment</td><td className="py-1 pr-3 align-top">15%</td><td className="py-1">Equipment quality, inspection, maintenance.</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Safety Sentiment</td><td className="py-1 pr-3 align-top">15%</td><td className="py-1">Community/traveller sentiment about safety.</td></tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 rounded-lg bg-[#F6F4FE] p-4 text-sm">
                The <strong>Overall Safety Score</strong> is a weighted combination of
                these 7 dimensions, and the <strong>Confidence</strong> figure
                expresses how strongly the model stands behind the result.
              </p>

              <p className="mt-3 text-sm">
                <strong>Important limitation:</strong> Reports are AI-assisted
                assessments based on publicly available information. They should{' '}
                <em>support — not replace</em> — official travel advisories.
              </p>
            </section>

            <section id="getting-started"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                3. Getting started
              </h2>

              <h3 className="font-poppins mb-1 text-base font-semibold text-[#2B2740]">
                Create an account
              </h3>
              <ol className="list-decimal pl-5">
                <li>Go to the homepage and click <strong>Sign Up</strong> (top-right).</li>
                <li>Enter your <strong>full name</strong> and <strong>email address</strong>.</li>
                <li>Click <strong>Create an account</strong>.</li>
              </ol>
              <p className="mt-1 rounded-lg bg-[#F6F4FE] p-3 text-sm">
                Every new account is entitled to <strong>3 free safety checks</strong>.
              </p>

              <h3 className="font-poppins mb-1 mt-5 text-base font-semibold text-[#2B2740]">
                Set your password (important)
              </h3>
              <p>
                You do <strong>not</strong> choose a password at sign-up. Wondlo emails
                you a &ldquo;Welcome to Wondlo — Set Your Password&rdquo; email
                containing a <strong>Set Your Password</strong> button.
              </p>
              <ol className="list-decimal pl-5">
                <li>Open the email.</li>
                <li>Click the link — it opens the <strong>Set Password</strong> page for your email.</li>
                <li>Enter a password (at least 6 characters), confirm it, and click <strong>Save Password &amp; Continue</strong>.</li>
                <li>You are signed in automatically and returned to the homepage.</li>
              </ol>
              <p className="mt-1 text-sm">
                If you try to sign in before setting your password, sign-in will fail.
                Check your inbox (and spam folder) for the welcome email.
              </p>

              <h3 className="font-poppins mb-1 mt-5 text-base font-semibold text-[#2B2740]">
                Sign in
              </h3>
              <ol className="list-decimal pl-5">
                <li>Click <strong>Sign In</strong> in the top navigation.</li>
                <li>Enter your email and password (a <strong>Show / Hide</strong> toggle is available).</li>
                <li>Click <strong>Sign In</strong> — you land on your <strong>Dashboard</strong>. The first time, you have <strong>3 searches left</strong>.</li>
              </ol>
            </section>

            <section id="navigating"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                4. Navigating the platform
              </h2>

              <h3 className="font-poppins mb-2 text-base font-semibold text-[#2B2740]">
                Site map
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left font-poppins text-[#7E6BB3]">
                      <th className="pb-2 pr-3">Page</th>
                      <th className="pb-2 pr-3">Where to find it</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-1 pr-3 align-top">Homepage</td><td className="py-1">Logo / HOME link</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Sign Up</td><td className="py-1"><Link href="/signup" className="text-[#7E6BB3] hover:underline">Sign Up</Link> button</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Sign In</td><td className="py-1"><Link href="/signin" className="text-[#7E6BB3] hover:underline">Sign In</Link> button</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Set Password</td><td className="py-1">Link inside the welcome email</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Dashboard</td><td className="py-1">After signing in</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Safety Report</td><td className="py-1">Automatically after a search</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Upgrade / Plans</td><td className="py-1">Upgrade button when a search limit is reached</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Help Center</td><td className="py-1">Footer &rarr; Help Center</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Report an Issue / Request a Feature</td><td className="py-1">Footer &rarr; Report an Issue, or Actions bar on a report</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Request Safety Help</td><td className="py-1">Actions bar on a report</td></tr>
                    <tr><td className="py-1 pr-3 align-top">Privacy Policy / Terms</td><td className="py-1">Footer</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-poppins mb-2 mt-6 text-base font-semibold text-[#2B2740]">
                Common navigation elements
              </h3>
              <ul className="list-disc pl-5">
                <li><strong>Top navigation bar</strong> — Wondlo logo (home), HOME, Sign In, Sign Up, and (when relevant) Analyse Another.</li>
                <li><strong>Footer</strong> — Help Center, Report an Issue, Privacy Policy, Terms of Service, contact email, and social links.</li>
                <li><strong>Profile menu</strong> — avatar with a green dot (top-right on Dashboard, reports, and Upgrade pages). Opens <strong>Sign Out</strong>.</li>
                <li><strong>Sidebar</strong> — on report pages (toggle button, top-right). Your name, searches remaining, <strong>previous search history</strong>, and <strong>safety cards</strong>.</li>
              </ul>
            </section>

            <section id="searching"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                5. Analysing an adventure
              </h2>
              <ol className="list-decimal pl-5">
                <li>Sign in (you land on the <strong>Dashboard</strong>).</li>
                <li>In the search box, type a <strong>company name, website, or social media handle</strong> — for example &ldquo;Summit Trails Expeditions&rdquo;.</li>
                <li>Press Enter or click <strong>Analyse Adventure</strong>.</li>
                <li>You are taken straight to the <strong>Safety Report</strong> page for that operator.</li>
              </ol>
              <ul className="mt-3 list-disc pl-5">
                <li>Searching requires a signed-in account. If you are not signed in, Wondlo redirects you to <strong>Sign In</strong> first.</li>
                <li>Duplicate searches do <strong>not</strong> consume an extra search — looking up the same operator again returns the saved report.</li>
                <li>Each <em>new</em> operator uses <strong>one</strong> of your 3 free checks.</li>
                <li>The <strong>Adventure type</strong> chips below the search box (Trekking, Kayaking, … and a <strong>More</strong> list) are informational — you still type the operator into the search box.</li>
              </ul>
            </section>

            <section id="reading-report"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                6. Reading your Safety Report
              </h2>
              <p>
                The report page is the heart of Wondlo. From top to bottom:
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Report header
              </h3>
              <p>
                Operator name with a verification badge, location, activity type,{' '}
                <strong>Report Generated</strong> and <strong>Data Collected Up To</strong>{' '}
                dates, plus a <strong>Back to Search</strong> link and report
                metadata (Assessment Version and Generated date).
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Overall Safety Score
              </h3>
              <p>
                A score <strong>out of 100</strong> with a <strong>risk level</strong>{' '}
                badge (for example &ldquo;Low Risk&rdquo;) and a progress bar. The{' '}
                <strong>i</strong> icons are info hints.
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Confidence
              </h3>
              <p>
                A percentage showing how strongly the model stands behind the
                assessment — &ldquo;This operator satisfies our trained model&apos;s 7
                required dimensions for safety.&rdquo;
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Safety Summary
              </h3>
              <p>
                A plain-language paragraph explaining what the evidence means,
                followed by tags: green-check tags for passing dimensions and
                warning tags for those that need attention.
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Risk Breakdown
              </h3>
              <p>A horizontal score bar for each of the <strong>7 dimensions</strong> (score /100).</p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Incident Timeline
              </h3>
              <p>
                A chronological record of reported safety events, each with a{' '}
                <strong>date</strong>, <strong>severity</strong> (None / Minor /
                Moderate / Major), title, description, and <strong>source</strong>{' '}
                (Instagram, news article, rescue log, etc.). Severity colours:
                purple (minor), amber (moderate), red (major), grey (none).
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Assessment
              </h3>
              <p>A single-sentence conclusion about how the operator measures up.</p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Recommended Documents to Request
              </h3>
              <p>
                Documents you can ask the operator for: <strong>Safety Plan</strong>,{' '}
                <strong>Equipment Inspection Records</strong>,{' '}
                <strong>Emergency Response Plan</strong>, <strong>Insurance</strong>, and{' '}
                <strong>Permits &amp; Authorisations</strong>.
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Actions
              </h3>
              <ul className="list-disc pl-5">
                <li><strong>Report a Bug</strong> — opens the issue form pre-set to bug reporting.</li>
                <li><strong>Request a Feature</strong> — opens the feature request form.</li>
                <li><strong>Request Safety Help</strong> — opens the safety help form.</li>
                <li><strong>Download Recommended Questions</strong> — downloads a PDF with <strong>25 questions</strong> to ask an operator, grouped into 7 categories, plus a Traveller Safety Reminder.</li>
              </ul>
            </section>

            <section id="dashboard"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                7. Dashboard &amp; search history
              </h2>
              <p>
                The <strong>Dashboard</strong> is your home after sign-in: the search
                box, an informative message, and your <strong>searches remaining</strong>.
              </p>
              <ul className="mt-2 list-disc pl-5">
                <li>On sign-in, Wondlo automatically opens your <strong>most recent</strong> report.</li>
                <li>To start a brand-new search, click <strong>Analyse Another Adventure</strong>.</li>
                <li>If you have <strong>0 searches left</strong>, the Analyse button shows the upgrade message instead of searching.</li>
              </ul>
              <p className="mt-2">
                The <strong>sidebar</strong> (open from a report page via the toggle,
                top-right) contains your name, <strong>searches left</strong>,{' '}
                <strong>Recent History</strong> (tap to reopen a past report), up to
                three <strong>safety cards</strong>, and <strong>Sign out</strong>.
              </p>
            </section>

            <section id="pricing"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                8. Free tier &amp; upgrading
              </h2>
              <p>
                Every account starts on the <strong>Free Trial</strong> —{' '}
                <strong>0£ / month</strong> — with <strong>three searches</strong>.
                Once used, further new searches are blocked with:
              </p>
              <p className="mt-2 rounded-lg bg-[#FFF1E8] p-3 text-sm text-[#C51D14]/80">
                &ldquo;You have reached your 3 free searches. Upgrade to analyse another
                adventure.&rdquo;
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left font-poppins text-[#7E6BB3]">
                      <th className="pb-2 pr-3">Plan</th>
                      <th className="pb-2 pr-3">Price</th>
                      <th className="pb-2">Includes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 pr-3 align-top font-semibold">Pay As You Go</td>
                      <td className="py-1 pr-3 align-top">3£ / search</td>
                      <td className="py-1">One search, Adventure Preparedness, Safety Digest, Operator Chat Diagnosis.</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-3 align-top font-semibold">Starter Plan</td>
                      <td className="py-1 pr-3 align-top">15£ / month</td>
                      <td className="py-1">Seven searches / month, Adventure Preparedness, Safety Digest, Operator Chat Diagnosis.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                Compare the plans on the <strong>Upgrade</strong> page.
              </p>
            </section>

            <section id="community"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                9. Community
              </h2>
              <ul className="list-disc pl-5">
                <li><strong>Join the Telegram community</strong> via the footer (&ldquo;Join us on&rdquo;). A confirmation page forwards you to the group after about 2 seconds.</li>
                <li><strong>Refer Your Travel Buddy</strong> — on the Sign Up and Sign In pages there is a button that copies the Wondlo link to your clipboard.</li>
              </ul>
            </section>

            <section id="support"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                10. Help &amp; support
              </h2>

              <h3 className="font-poppins mb-1 text-base font-semibold text-[#2B2740]">
                Help Center
              </h3>
              <p>
                Quick-launch cards for <Link href="/signup" className="text-[#7E6BB3] hover:underline">Account Setup</Link> and{' '}
                <Link href="/report-issue" className="text-[#7E6BB3] hover:underline">Reporting Issues</Link>. This guide is one click away from it.
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Report an Issue or Request a Feature
              </h3>
              <p>
                Provide your name, email, a category, a priority (Low / Medium /
                High / Critical), a description (max 1,000 characters), and an
                optional attachment (screenshot or PDF, max 2MB). A confirmation
                email is sent to your address.
              </p>

              <h3 className="font-poppins mb-1 mt-4 text-base font-semibold text-[#2B2740]">
                Request Safety Help
              </h3>
              <p>
                For safety questions about an operator, an assessment, or a concern
                during a trip. Choose a category and urgency (Low / Medium / High /
                Urgent) and describe the question (max 1,200 characters).
              </p>
            </section>

            <section id="faq"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                11. Troubleshooting &amp; FAQ
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-[#2B2740]">Why can&apos;t I sign in?</p>
                  <p className="text-sm">Most likely you have not set a password yet. Find the &ldquo;Set Your Password&rdquo; welcome email, set a password, then sign in.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2B2740]">I got the &ldquo;free search limit&rdquo; message.</p>
                  <p className="text-sm">You have used your 3 free searches. You will need to upgrade to analyse another adventure.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2B2740]">Why does the score look unexpected for a small operator?</p>
                  <p className="text-sm">Reports are based on publicly available information only. A small or new operator may show lower confidence, which reflects the amount of available evidence — not necessarily poor practice.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2B2740]">My search is not working.</p>
                  <p className="text-sm">Make sure you are signed in and use a company name, website, or social handle.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2B2740]">Do reports expire?</p>
                  <p className="text-sm">Reports are saved to your account. Re-opening a past search returns the saved report; the header shows how current the data is.</p>
                </div>
                <div>
                  <p className="font-semibold text-[#2B2740]">Is Wondlo a replacement for official travel advice?</p>
                  <p className="text-sm">No. Wondlo&apos;s AI-assisted assessments should support — not replace — official travel advisories.</p>
                </div>
              </div>
            </section>

            <section id="glossary"
              className="rounded-2xl bg-[#FCFCFB] p-6 transition-transform duration-300 hover:-translate-y-1"
              style={{
                border: '0.1px solid rgba(43, 39, 64, 0.10)',
                boxShadow: '0 8px 20px rgba(43, 39, 64, 0.12)',
              }}
            >
              <h2 className="font-poppins mb-2 text-lg font-semibold text-[#2B2740]">
                12. Glossary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Safety Score</td><td className="py-1">0–100 weighted score across the 7 dimensions.</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Risk Level</td><td className="py-1">Categorical verdict shown next to the score (e.g. Low Risk).</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Confidence</td><td className="py-1">How strongly the model stands behind the assessment (%).</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Dimension</td><td className="py-1">One of the 7 areas of the safety framework.</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Incident Timeline</td><td className="py-1">Chronological record of reported safety events.</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Operator</td><td className="py-1">The adventure provider you are researching.</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Free Searches</td><td className="py-1">3 new-operator checks included with every account.</td></tr>
                    <tr><td className="py-1 pr-3 align-top font-semibold">Safety Card</td><td className="py-1">Compact recap of one report (score + risk + incidents).</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}