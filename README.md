# Wondlo

Wondlo is an adventure safety intelligence platform designed to help travellers check whether an operator, tour company, guide business, or adventure provider is credible before they book, pay a deposit, or commit to a trip.

At a high level, the product aims to answer one core question: is this operator safe enough for me to trust with my trip, my money, and my wellbeing?

This repository is the current working web application for that idea. It includes the product landing pages, user accounts, billing logic, search flow, analysis/reporting UI, community safety feedback, and the backend APIs that support them.

## Production

Live production app: [Wondlo - Know before you book.](https://wondlo1.vercel.app/)

## What Wondlo does today

The current system is a prototype / MVP product that combines:

- a user-facing landing experience and onboarding flow
- sign up and authentication
- free and paid search allowance tracking
- operator searches with stored results per user
- AI-assisted safety analysis output styled as a Wondlo report
- review and PDF export of recommended safety questions
- community safety feedback and report moderation workflows
- billing, checkout, saved cards, and plan management
- a PostgreSQL data layer using Prisma

The app does not yet perform a fully real-world, independent data mining pipeline from public internet sources. Instead, it currently demonstrates the product experience and reporting flow using a mix of seeded/mock data, application logic, and AI prompt-based analysis.

## Core product concept

Wondlo is positioned as a research and decision-support layer between a traveller and an adventure operator.

The intended workflow is:

1. A user searches an operator or company name, website, or social handle.
2. The system gathers relevant public information about the operator.
3. The data is evaluated against a structured safety framework.
4. The user receives a safety report with a score, risk level, and key issues.
5. The user can ask targeted questions before booking and check community sentiment/reviews.

The project documentation and product language describe a 7-dimension safety model:

- Quality of Experience
- Quality of Regulation
- Incident History
- Business Information
- Risk Assessment
- Equipment Assessment
- Safety Sentiment

## Current implementation in this repo

### 1. Frontend experience

The app is built with Next.js App Router and React.

Main user-facing screens include:

- landing page and marketing sections
- sign-up and sign-in
- dashboard and search history
- results / analysis page
- billing and checkout pages
- community submission page
- safety review page
- FAQ, help, privacy, terms, etc.

The home page and help content explain the intended Wondlo experience and the seven-step framework.

### 2. Authentication and accounts

The app uses Firebase Authentication for user identity.

Relevant flows include:

- signup
- sign-in redirect handling
- profile-based usage tracking
- account-based search limits

User data is persisted in Prisma with models such as:

- User
- Search
- Purchase
- SavedCard
- CommunityPost
- CommunityComment
- CommunityReport
- SafetyReview

### 3. Search and quota system

The search engine and billing logic are already modeled.

Current behavior:

- free trial users get a limited number of searches
- paid plans have increased search allowance
- search usage is tracked against the user record
- repeat searches are cached per user and query key
- past searches are shown in the dashboard

This is implemented in:

- app/api/search/route.ts
- lib/billing.ts
- prisma/schema.prisma

### 4. AI-assisted analysis

The analysis API at app/api/analyze/route.ts is intended to power a report-generation engine using Anthropic Claude.

In the current repository, this endpoint constructs a structured safety analysis prompt and asks the model for a JSON report. That is useful as a demonstration and MVP foundation, but it is not yet backed by a real mining pipeline or trusted external data collection.

The project also includes lib/mock-analysis.ts, which generates deterministic mock safety results for operator searches. This is a strong indicator that the live-system data pipeline is still in progress.

### 5. Safety report output and recommended questions

The results experience includes:

- overall safety score
- risk level
- confidence score
- dimension breakdown
- incidents / warnings
- assessment summary
- downloadable PDF of recommended questions for an operator

This creates the feel of a real reporting tool, even though the source data is still not yet being mined from live public sources in a verified data pipeline.

### 6. Community and moderation features

The application includes community feedback workflows:

- posting about experiences and safety concerns
- likes and comments
- report abuse / review moderation flows
- admin review pages for submitted community reports

This gives Wondlo a social trust layer in addition to the operator evaluation system.

### 7. Billing and plan management

The product includes a billing layer for:

- free trial search limits
- pay-as-you-go searches
- starter plan management
- saved card data
- billing status checks
- purchase processing

The repository has the structure for real payment handling and plan limits, even though the live deployment and production-grade billing configuration still need to be fully validated in a production environment.

## How to use the app

### Prerequisites

You need:

- Node.js 22.x
- PostgreSQL / Prisma-compatible database
- Firebase project credentials for authentication
- Anthropic API key if using the analysis route
- environment variables configured in a local .env file

### Installation

```bash
npm install
```

### Run the app

```bash
npm run dev
```

Then open:

- http://localhost:3000

### Typical user flow

1. Sign up or sign in.
2. Go to the dashboard.
3. Enter a search query for an adventure operator or company.
4. Review the generated report or mock analysis output.
5. Download recommended questions or continue to booking research.
6. If needed, upgrade to a paid plan to increase search availability.
7. Use the community or reporting flows to add safety context or flag issues.

## Environment and configuration

The app expects environment variables such as:

- DATABASE_URL
- DIRECT_URL
- ANTHROPIC_API_KEY
- Firebase config values for client/server auth
- any billing or email provider configuration

The repository is set up for local development, but production deployment still needs real secrets and service configuration.

## Important gap: what is not yet implemented

This is the most important section for the product vision.

The core real-world engine is not yet fully implemented. Right now, Wondlo is best described as a product prototype and reporting interface, not a fully autonomous, authentic data-mining safety intelligence system.

### Missing functionality

The following are major items still to be built or hardened:

#### 1. Real search engine for operator data mining

The system still does not truly crawl and aggregate data from the web for an operator search. A user can type in a company or operator name, but the app is not yet doing a real, comprehensive public data mining pipeline that collects multiple source types such as:

- company websites
- Google Business details
- TripAdvisor and review platforms
- social media profiles
- news articles and incident reports
- regulator or licensing databases
- travel and safety advisories
- legal records and enforcement notices

This is a major missing feature and one of the most important roadmap items.

#### 2. Real AI model trained on safety evidence

The current Anthropic call is a useful prompt-driven evaluation layer, but it is not yet a trained safety model that performs genuine evidence-based analysis on real-world operator data.

The missing upgrade is a model pipeline that:

- collects structured evidence from sources
- normalizes and scores each input
- identifies contradictory or repeated claims
- weighs incident severity and recency
- extracts risk patterns from reviews and reports
- generates a report using factual evidence rather than an LLM-only summary prompt

#### 3. Authentic report generation from live data

The app currently produces a report-like output, but the underlying report is not yet a fully authenticated evidence ledger. The product should eventually generate reports that clearly cite:

- where the data came from
- how recent it is
- which sources support each claim
- what is uncertain or unverified
- confidence and data completeness levels

#### 4. Safety digest and adventure preparedness guidance

The current product vision includes more than a simple score. It should eventually produce a real safety digest for the user, including:

- a plain-English summary of the operator’s main risks
- suggested questions to ask before booking
- a personalised trip risk assessment
- weather, route, and operational readiness guidance
- emergency plan expectations
- recommended preparedness steps for the user

This is one of the biggest product gaps: the app needs to do more than assess an operator; it must help the traveller become prepared for the actual adventure.

#### 5. User-specific trip preparation

The future product should tailor the output to the user, not just the operator. For example:

- experience level
- medical constraints
- trip length
- seasonality and environment
- destination risk profile
- family or group travel considerations

This would turn Wondlo from a company-review tool into an adventure safety assistant.

#### 6. Trust and verification systems

The real product must add stronger verification controls around:

- source provenance
- licensing checks
- incident validation
- cross-source contradictions
- review quality scoring
- content moderation and false information prevention

## How the system is structured

The repository is organized around a Next.js app with several major components:

- app/ for routes and screens
- components/ for reusable UI blocks
- lib/ for app logic, billing, mock analysis, and helpers
- prisma/ for database schema
- public/ for assets
- app/api/ for backend routes

## Technology stack

- Next.js 16
- React 19
- TypeScript
- Prisma + PostgreSQL
- Firebase Authentication
- Anthropic API
- Tailwind CSS
- Resend / email support
- Stripe-like billing flow patterns (projected in code structure)

## Practical status

At the moment, the application is best understood as:

- a product prototype for adventure safety assessment
- a working UI and logic foundation for search/report workflows
- a pipeline skeleton for future real-world intelligence and AI analysis

It is not yet a fully autonomous, evidence-backed, live-data safety intelligence engine.

## Recommended roadmap

The next major milestones should include:

1. Build a real data ingestion and web-mining layer
2. Create a source-quality scoring and verification model
3. Train or fine-tune an operator-risk analysis model on validated safety evidence
4. Integrate source citations into every report
5. Add a personalised safety digest and preparedness guidance flow
6. Improve moderation, trust scoring, and user transparency
7. Launch production-grade reliability, security, and billing operations

## Summary

Wondlo is a compelling idea: a traveller enters an operator name, and the platform helps determine whether that operator is safe, credible, and prepared for the adventure in question.

The current repository already contains the skeleton of that experience: signup, search limits, results pages, billing, AI analysis, safety review flows, and a community layer.

The most important missing step is the real engine: authentic data mining, a trained safety model, and a user-facing safety digest / preparedness system that turns operator screening into a genuinely useful adventure safety assistant.

That is the next generation of the product, and it is the biggest piece still to be built.
