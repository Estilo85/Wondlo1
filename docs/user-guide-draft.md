# Wondlo — User Guide (Draft)

*How Wondlo works and how to find your way around the platform.*

> Status: **Draft v0.1** for review. Written to match the current app behaviour
> (`app/`, `components/`, `app/api/`). Confirm every URL and label before
> publishing.

---

## 1. What is Wondlo?

Wondlo is an **adventure safety intelligence** platform. Before you book an
adventure (trekking, climbing, kayaking, paragliding, safari, etc.), you type in
the company's name, website, or social media handle, and Wondlo produces a
**Safety Report** that answers one question:

> **Is it safe before I pay a deposit?**

Wondlo does **not** replace booking platforms. It is a research layer that
gathers publicly available information about an operator and evaluates it
against a **7-step safety framework**.

---

## 2. How the system works (the core loop)

The product works in **four steps**, exactly as described on the homepage
("How it works"):

| Step | Name | What happens |
|------|------|--------------|
| 01 | **Search Operator** | You enter a company name, website, or social handle. |
| 02 | **Collect Public Information** | The system gathers incidents, operator claims, safety-specific information, community notes, and government advisories. |
| 03 | **Evaluate Safety Evidence** | Evidence is scored across a 7-dimension safety framework. |
| 04 | **Receive Safety Report** | A structured summary with a safety score and detailed risk breakdown. |

### The 7 safety dimensions

Every report scores the operator out of **100** across these weighted
dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| Quality of Experience | 10% | Reviews, traveller satisfaction, value. |
| Quality of Regulation | 15% | Licensing, permits, adherence to regulations. |
| Incident History | 20% | Reported incidents, severity, recency. |
| Business Information | 10% | Operator identity, legitimacy, contactable info. |
| Risk Assessment | 15% | How well risks are identified and managed. |
| Equipment Assessment | 15% | Equipment quality, inspection, maintenance. |
| Safety Sentiment | 15% | Community/traveller sentiment about safety. |

The **Overall Safety Score** is a weighted combination of these 7 dimensions,
and the **Confidence** figure expresses how strongly the model stands behind
the result.

> **Important limitation (shown in the app):** Reports are AI-assisted
> assessments based on publicly available information. They should *support —
> not replace* — official travel advisories.

---

## 3. Getting started

### 3.1 Create an account

1. Go to the homepage and click **Sign Up** (top-right).
2. Enter your **full name** and **email address**.
3. Click **Create an account**.

A confirmation message appears and an email is sent to your inbox.

> Every new account is entitled to **3 free safety checks** (a badge on the
> sign-up / sign-in pages reminds you of this).

### 3.2 Set your password (important)

You do **not** choose a password at sign-up. Wondlo emails you a
**"Welcome to Wondlo — Set Your Password"** email containing a **Set Your
Password** button.

1. Open the email.
2. Click the link — it opens the **Set /set-password** page for your email.
3. Enter a password (at least 6 characters), confirm it, and click
   **Save Password & Continue**.
4. You are signed in automatically and returned to the homepage.

If you try to sign in before setting your password, sign-in will fail. Check
your inbox (and spam folder) for the welcome email.

### 3.3 Sign in

1. Click **Sign In** in the top navigation.
2. Enter your email and password (a **Show / Hide** toggle is available).
3. Click **Sign In** — you land on your **Dashboard**. The first time, you have
   **3 searches left**.

---

## 4. Navigating the platform

### 4.1 Site map

| Page | Route | Who sees it |
|------|-------|-------------|
| Homepage | `/` | Everyone |
| Sign Up | `/signup` | Everyone |
| Sign In | `/signin` | Everyone |
| Set Password | `/set-password?email=...` | New users via email link |
| Dashboard | `/dashboard` | Signed-in users |
| Safety Report | `/analyze/results?q=<search>` | Signed-in users |
| Pricing / Upgrade | `/payments` | Signed-in users |
| Help Center | `/help` | Everyone |
| Report an Issue / Request a Feature | `/report-issue` | Everyone |
| Request Safety Help | `/safety-help` | Everyone |
| Privacy Policy | `/privacy` | Everyone |
| Terms of Service | `/terms` | Everyone |
| Community redirect | `/redirecting` | Joining via community link |

### 4.2 Common navigation elements

- **Top navigation bar** — Wondlo logo (home), **HOME**, **Sign In**, **Sign Up**,
  and (when relevant) **Analyse Another**.
- **Footer** — Help Center, Report an Issue, Privacy Policy, Terms of Service,
  contact email, and social links (LinkedIn, Facebook, TikTok, Instagram, Telegram).
- **Profile menu** (avatar with a green dot, top-right on Dashboard/Report/Upgrade
  pages) — opens a small menu with **Sign Out**.
- **Sidebar** (results page, toggle button in the top-right corner) — your user
  name, searches remaining, **previous search history**, and **safety cards**.

---

## 5. Analysing an adventure (your first search)

1. Sign in (you land on the **Dashboard**).
2. In the search box, type a **company name, website, or social media handle**
   — for example `Summit Trails Expeditions`.
3. Press Enter or click **Analyse Adventure**.
4. You are taken straight to the **Safety Report** page for that operator,
   e.g. `/analyze/results?q=Summit%20Trails%20Expeditions`.

Notes:

- Searching requires a signed-in account. If you are not signed in, Wondlo
  redirects you to **Sign In** first.
- Duplicate searches do **not** consume an extra search — looking up the same
  operator again returns the saved report.
- Each *new* operator you search uses **one** of your 3 free checks.
- The search supports adventure types via the **Adventure type** chips below
  the search box (Parasailing, Trekking, Kayaking, … and a **More** list of
  ~30 activity types). The chips are informational; you still type the operator
  into the search box.

---

## 6. Reading your Safety Report

The report page (`/analyze/results`) is the heart of Wondlo. Top to bottom:

### 6.1 Report header (profile bar)

- **Operator name** (your search query) with a verification badge.
- **Location** (e.g. Nepal) and **activity type** (e.g. Adventure Trekking, Climbing).
- **Report Generated** date.
- **Data Collected Up To** date (reports cover public data up to the day before
  generation).
- Example imagery for the operator.
- **Back to Search** link and report metadata (**Assessment Version: v1.1**,
  **Generated**: date).

### 6.2 Overall Safety Score

- A big **score out of 100** with a **risk level** badge (e.g. **Low Risk**)
  and a progress bar.
- The **i** icons are info hints.

### 6.3 Confidence

- A percentage (e.g. **90%**) showing how strongly the model stands behind the
  assessment — phrased as "This operator satisfies our trained model's 7
  required dimensions for safety."

### 6.4 Safety Summary

- A plain-language paragraph explaining what the evidence means.
- A set of tags: green-check tags for the dimensions that pass
  (Quality of Experience, Incident History, Safety Sentiment, Quality of
  Regulation, Business Information) and warning tags for the ones that need
  attention (Equipment Assessment, Risk Assessment).

### 6.5 Risk Breakdown

- A horizontal score bar for **each of the 7 dimensions** (score /100).
- Hover or read each bar to see what the category includes.

### 6.6 Incident Timeline

- A chronological record of reported safety events, each with a **date**,
  **severity** (None / Minor / Moderate / Major), **title**, **description**,
  and **source** (Instagram, news article, rescue log, etc.).
- Severity colours: purple (minor), amber/yellow (moderate), red (major), grey (none).

### 6.7 Assessment

- A single-sentence conclusion, e.g. "The operator satisfies our safety
  framework for (trip-type) safety."

### 6.8 Recommended Documents to Request

- Documents you can ask the operator for to verify their safety practices:
  **Safety Plan**, **Equipment Inspection Records**, **Emergency Response Plan**,
  **Insurance**, and **Permits & Authorisations**.

### 6.9 Actions (bottom purple bar)

| Action | What it does |
|--------|--------------|
| **REPORT A BUG** | Opens `/report-issue` pre-set to bug reporting. |
| **REQUEST A FEATURE** | Opens `/report-issue?type=feature`. |
| **REQUEST SAFETY HELP** | Opens `/safety-help`. |
| **DOWNLOAD RECOMMENDED QUESTIONS** | Downloads a PDF — "Wondlo-Recommended Questions.pdf" — with **25 questions** to ask an operator, organised into 7 categories (Emergency Response, Guides & Supervision, Safety Briefing & Preparation, Equipment & Safety Checks, Risk Management & Changing Conditions, Participant Safety & Accountability, Learning From Incidents) plus a Traveller Safety Reminder. |

---

## 7. Your Dashboard & search history

The **Dashboard** (`/dashboard`) is your home after sign-in.

- Shows the search box, an informative message, and your **searches remaining**.
- On sign-in, Wondlo automatically opens your **most recent** report. To start a
  brand-new search, click **Analyse Another Adventure** (or `?newSearch=1`).
- If you have **0 searches left**, the Analyse button shows the upgrade message
  instead of searching.

The **sidebar** (open from the results page via the toggle in the top-right)
contains:

1. **Header** — your name, **searches left**, and **View previous searches**.
2. **Recent History** — taps reopen a past report.
3. **Safety cards** — up to 3 saved reports with score, risk level, and incident
   history.
4. **Free Tier Access** footer with **Sign out**.

---

## 8. Free tier & upgrading

### 8.1 The Free Trial

| | Free Trial |
|---|---|
| Price | **0£ / month** |
| Includes | **Three searches** |

Once you have used 3 new searches, further searches are blocked with the
message:

> "You have reached your 3 free searches. Upgrade to analyse another adventure."

### 8.2 Paid plans

Compare plans on **Upgrade** (`/payments`).

| | Pay As You Go | Starter Plan |
|---|---|---|
| Price | **3£ / search** | **15£ / month** |
| Includes | One search | Seven searches / month |
| | Adventure Preparedness | Adventure Preparedness |
| | Safety Digest | Safety Digest |
| | Operator Chat Diagnosis | Operator Chat Diagnosis |

> Payment integration is **not yet connected** — the **PAY** buttons are
> placeholders. Treat everything after this point as future/planned.

---

## 9. Community

- **Join the Telegram community** via the footer ("Join us on") or any community
  link. The `/redirecting` page shows "You're in!" and forwards to the Telegram
  group after ~2 seconds.
- **Refer Your Travel Buddy** — on the Sign Up and Sign In pages there is a
  button that copies the Wondlo link to your clipboard so you can share it.

---

## 10. Help & support

### 10.1 Help Center (`/help`)

Quick-launch cards:

- **Account Setup & Sign Up** → `/signup`
- **Reporting Issues** → `/report-issue`

### 10.2 Report an Issue / Request a Feature (`/report-issue`)

- Choose kind via the `type` parameter (Bug by default, `type=feature` for a
  feature request).
- Form: **Your Name**, **Email Address**, **Category** (bug → Bug/Broken
  feature/Performance/Security concern/Other; feature → New feature/
  Improvement/Interface improvement/Other), **Priority** (Low/Medium/High/
  Critical), **Description** (max 1,000 characters), and an **optional
  attachment** (screenshot or PDF, max 2MB).
- Validation stops submission if the name is too short, the email is invalid,
  or the description is under 10 characters.
- On success you see a thank-you screen, and a confirmation email is sent to the
  email you provided.

### 10.3 Request Safety Help (`/safety-help`)

For safety questions about an operator, an assessment, or a concern during a
trip.

- Categories: Before booking / Understanding an assessment / Safety concern
  during a trip / Other.
- Urgency: Low / Medium / High / Urgent.
- Description max 1,200 characters.
- On success you see "Your request has been received" and a confirmation email.

Both forms email the Wondlo team (`partnership@joinwondlo.com` by default)
using Resend, `reply-to` your email.

---

## 11. Troubleshooting & FAQ

**Why can't I sign in?**
Most likely you have not set a password yet. Find the "Set Your Password"
welcome email, set a password, then sign in.

**I got the "free search limit" message.**
You have used your 3 free searches. Wait — currently there is no free reset; you
will need to upgrade when payments go live.

**Why does the score look unexpected for a small operator?**
Reports are based on *publicly available* information only. A small or new
operator with little public footprint may show a lower confidence, which
reflects the amount of available evidence — not necessarily poor practice.

**My search is not working.**
Make sure you are signed in, and use a company name, website, or social handle.

**Do reports expire?**
Reports are saved to your account. Re-opening a past search returns the saved
report; the header shows the **Report Generated** and **Data Collected Up To**
dates so you know how current it is.

**Is Wondlo a replacement for official travel advice?**
No. Wondlo explicitly states that its AI-assisted assessments should
**support — not replace** official travel advisories.

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| **Safety Score** | 0–100 weighted score across the 7 dimensions. |
| **Risk Level** | Categorical verdict shown next to the score (e.g. Low Risk). |
| **Confidence** | How strongly the model stands behind the assessment (%). |
| **Dimension** | One of the 7 areas of the safety framework. |
| **Incident Timeline** | Chronological record of reported safety events. |
| **Operator** | The adventure provider you are researching. |
| **Free Searches** | 3 new-operator checks included with every account. |
| **Safety Card** | Compact recap of one report (score + risk + incidents). |

---

## 13. To-do before this guide ships

1. Confirm the welcome-email sender name/address used in production.
2. Confirm exact risk-level labels ("Low Risk / Caution / High Risk").
3. Decide whether to document the future/greyed-out upgrade flow upfront or
   after payments launch.
4. Add screenshots for the Dashboard, results page, and Upgrade page.
5. Review terminology: "safety checks" vs "searches" (both appear in the UI).
6. Add an accessibility note if the guide is published as an HTML page.