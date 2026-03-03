# Ishango — Production Roadmap

## Project Overview

**Ishango** is a SaaS tax and financial calculator platform offering multi-country income tax, mortgage, and corporate tax calculations through a web application and a public API. The platform also features an expert marketplace for connecting users with tax and financial consultants.

### Architecture

| Repository | Role | Stack |
|---|---|---|
| **novha-calc-engines** | Calculation engine library | TypeScript, published as `@novha/calc-engines` npm package |
| **ishango-calc-api** | REST API backend | NestJS, TypeORM, MySQL, Clerk Auth |
| **ishango-web** | Web frontend | Next.js 16, React 19, Tailwind CSS, Redux, Clerk Auth, next-intl (i18n) |

### Supported Countries & Calculators

| Country | Income Tax | Mortgage | Corporate Tax |
|---|---|---|---|
| Canada (CA) | ✅ (Federal + Provincial) | ✅ | ✅ |
| France (FR) | ✅ (Family-based) | ✅ | ✅ |
| South Africa (ZA) | ✅ (Age & medical aid) | ✅ | ✅ |
| Australia (AU) | ✅ (Medicare levy) | ✅ | ✅ |
| United Kingdom (GB) | ✅ | ✅ | ✅ |

### Revenue Model

- **Freemium web calculators** — free basic calculations to drive traffic and SEO
- **API subscriptions** — tiered plans (free, starter, professional, enterprise) for developers integrating calculators into their own apps
- **Expert marketplace** — commission on consultations booked through the platform

---

## Current State Assessment

### What Works
- ✅ Calculator engines for 5 countries × 3 calculator types
- ✅ REST API endpoints for calculations, countries, plans, experts, subscriptions
- ✅ Web frontend with calculator UIs, landing page, pricing page, dashboard shell
- ✅ Clerk authentication guard implemented (not yet applied to routes)
- ✅ Comprehensive database schema (22 entities) for full SaaS model
- ✅ i18n support in web frontend
- ✅ Postman collection for API testing

### What's Missing for Production
- ❌ Auth guard not applied to protected routes
- ❌ Database credentials hardcoded (not using environment variables)
- ❌ TypeORM `synchronize: true` (auto-modifies schema — dangerous in production)
- ❌ No database migrations
- ❌ No input validation (DTOs without decorators)
- ❌ No rate limiting
- ❌ No CI/CD pipelines
- ❌ No Docker / container configuration
- ❌ No payment processor integration (Stripe, etc.)
- ❌ No API key management for subscription-based access
- ❌ No logging or monitoring
- ❌ No error tracking (Sentry, etc.)
- ❌ Minimal test coverage
- ❌ No OpenAPI / Swagger documentation
- ❌ No HTTPS / TLS configuration
- ❌ No cloud infrastructure setup

---

## MVP Phases

### MVP 1 — Free Calculator (Web)

**Goal:** Launch the web application with free calculators to build traffic, validate product-market fit, and establish SEO presence.

**Revenue:** None (traffic & user acquisition phase)

**Timeline estimate:** 2–4 weeks

#### API Tasks (`ishango-calc-api`)

- [ ] **Environment configuration** — Move all secrets (DB credentials, Clerk keys) to environment variables using `@nestjs/config` with `.env` files
- [ ] **Input validation** — Add `class-validator` and `class-transformer` decorators to all DTOs; enable `ValidationPipe` globally
- [ ] **Error handling** — Implement global exception filter with consistent error response format
- [ ] **Swagger / OpenAPI docs** — Add `@nestjs/swagger` with decorators on all controllers and DTOs
- [ ] **Health check endpoint** — Expand `/ping` to include database connectivity check using `@nestjs/terminus`
- [ ] **CORS configuration** — Restrict allowed origins to the production web domain
- [ ] **Logging** — Integrate structured logging (e.g., `nestjs-pino` or Winston)
- [ ] **Unit tests** — Add tests for all calculator services, country service, and plan service
- [ ] **E2E tests** — Add tests for all API endpoints

#### Web Tasks (`ishango-web`)

- [ ] **Fix environment variables** — API base URL and Clerk keys via `.env`
- [ ] **Error handling UI** — Add error boundaries and user-friendly error messages in calculator forms
- [ ] **SEO optimization** — Add meta tags, structured data (JSON-LD), and sitemap for calculator pages
- [ ] **Analytics** — Integrate Vercel Analytics or Google Analytics
- [ ] **Responsive design audit** — Ensure mobile-friendly experience across all calculator pages
- [ ] **Accessibility audit** — Ensure WCAG 2.1 AA compliance

#### Calc Engines Tasks (`novha-calc-engines`)

- [ ] **Test coverage** — Ensure comprehensive unit tests for all country/calculator combinations
- [ ] **Publish to npm** — Set up GitHub Actions to auto-publish on version tag

#### Infrastructure Tasks

- [ ] **Dockerize API** — Create `Dockerfile` and `docker-compose.yml` for API + MySQL
- [ ] **CI/CD pipeline** — GitHub Actions for lint → test → build → deploy on all three repos
- [ ] **Deploy API** — Deploy to cloud (AWS ECS/Fargate, Railway, Render, or similar)
- [ ] **Deploy web** — Deploy Next.js app to Vercel
- [ ] **Deploy database** — Set up managed MySQL (AWS RDS, PlanetScale, or similar)
- [ ] **Database migrations** — Replace TypeORM `synchronize` with migration files; create initial migration from current schema
- [ ] **Domain & SSL** — Set up custom domain with HTTPS for both web and API

---

### MVP 2 — User Authentication & API Keys

**Goal:** Enable user registration and API key management so developers can start using the API with a free tier.

**Revenue:** None yet, but sets the foundation for paid plans.

**Timeline estimate:** 2–3 weeks

#### API Tasks (`ishango-calc-api`)

- [ ] **Apply ClerkGuard** — Protect subscription, expert creation, and dashboard-related endpoints
- [ ] **API key generation** — Implement API key creation, storage (hashed), and validation for programmatic access
- [ ] **API key middleware** — Create middleware that authenticates requests via `X-API-Key` header or Bearer token
- [ ] **Client registration** — Auto-create client record on first authenticated request (sync from Clerk user data)
- [ ] **Rate limiting** — Add `@nestjs/throttler` with configurable limits per plan tier
- [ ] **Usage tracking** — Log API calls per client/API key for usage dashboards and plan enforcement
- [ ] **Free tier enforcement** — Limit free-tier API keys to a set number of calculations per month

#### Web Tasks (`ishango-web`)

- [ ] **Login / registration flow** — Complete Clerk integration with sign-up, sign-in, and profile pages
- [ ] **Dashboard — API keys** — UI to generate, view, revoke, and copy API keys
- [ ] **Dashboard — usage stats** — Display calculation count, remaining quota, and usage graphs
- [ ] **API documentation page** — Interactive docs page showing endpoints, request/response examples, and code snippets

---

### MVP 3 — Paid Subscriptions (First Revenue)

**Goal:** Launch paid API subscription plans and process payments. **This is where the platform starts earning revenue.**

**Revenue:** API subscription fees (monthly/annual)

**Timeline estimate:** 3–4 weeks

#### API Tasks (`ishango-calc-api`)

- [ ] **Payment processor integration** — Integrate Stripe for subscription billing (create customers, subscriptions, invoices)
- [ ] **Webhook handler** — Handle Stripe webhooks for payment success, failure, subscription changes, and cancellations
- [ ] **Subscription lifecycle** — Implement upgrade, downgrade, cancel, and renewal logic
- [ ] **Plan enforcement** — Enforce calculator access, country access, and calculation limits based on active subscription plan
- [ ] **Invoice generation** — Generate and store invoices for each payment
- [ ] **Billing history endpoint** — API to retrieve past invoices and payment history
- [ ] **Subscription status management** — Automatically suspend accounts on payment failure; reactivate on successful retry

#### Web Tasks (`ishango-web`)

- [ ] **Pricing page — Stripe checkout** — Connect plan selection to Stripe Checkout or embedded payment form
- [ ] **Dashboard — subscription management** — UI to view current plan, upgrade/downgrade, cancel, and see billing history
- [ ] **Dashboard — invoices** — Download invoices as PDF
- [ ] **Trial period** — Offer a 14-day free trial on paid plans

#### Infrastructure Tasks

- [ ] **Stripe configuration** — Set up Stripe account, products, prices, and webhook endpoints
- [ ] **PCI compliance** — Ensure no card data touches the server (use Stripe.js / Checkout)
- [ ] **Monitoring & alerts** — Set up uptime monitoring (e.g., Better Stack, UptimeRobot) and alerting for payment failures

---

### MVP 4 — Expert Marketplace (Second Revenue Stream)

**Goal:** Enable users to find and book consultations with tax and financial experts. The platform earns a commission on each consultation.

**Revenue:** Commission on expert consultations (e.g., 15–20% platform fee)

**Timeline estimate:** 4–6 weeks

#### API Tasks (`ishango-calc-api`)

- [ ] **Expert onboarding** — Expert registration flow with profile, credentials, areas of expertise, and availability
- [ ] **Expert verification** — Admin workflow to review and approve/reject expert applications
- [ ] **Booking system** — Create consultation booking endpoints (request, confirm, cancel, reschedule)
- [ ] **Expert availability** — Calendar-based availability management per expert
- [ ] **Expert search & filter** — Search by country, calculator type, rating, language, and price range
- [ ] **Review & rating system** — Allow clients to rate and review completed consultations
- [ ] **Expert payout** — Track expert earnings and process payouts (Stripe Connect)
- [ ] **Consultation history** — Endpoints for clients and experts to view past and upcoming consultations

#### Web Tasks (`ishango-web`)

- [ ] **Expert directory page** — Searchable expert listing with filters and cards
- [ ] **Expert profile page** — Detailed profile with bio, specialties, ratings, reviews, and booking button
- [ ] **Booking flow** — Select time slot, provide consultation details, and pay
- [ ] **Expert dashboard** — For experts to manage availability, view bookings, and track earnings
- [ ] **Video call integration** — Embed or link to video call service (e.g., Cal.com, Calendly, or custom with Daily.co)
- [ ] **Notification system** — Email and in-app notifications for bookings, reminders, and reviews

---

### MVP 5 — Scale, Optimize & Expand

**Goal:** Grow the platform with more countries, calculator types, enterprise features, and performance optimizations.

**Revenue:** Expanded subscriptions + enterprise contracts + expert marketplace growth

**Timeline estimate:** Ongoing

#### New Countries & Calculators

- [ ] **Add more countries** — Nigeria, Kenya, India, Germany, Brazil, USA, Japan (prioritize by market demand)
- [ ] **New calculator types** — VAT/Sales tax, Capital gains tax, Payroll tax, Retirement savings calculator
- [ ] **Tax year updates** — Automated pipeline to update tax rules annually per country

#### Enterprise Features

- [ ] **White-label API** — Allow enterprise clients to embed calculators with their own branding
- [ ] **Custom webhooks** — Let clients receive callbacks on calculation events
- [ ] **Bulk calculations** — Batch processing endpoint for multiple calculations in one request
- [ ] **SLA guarantees** — Uptime and response time commitments for enterprise plans
- [ ] **Dedicated support** — Priority support channel for enterprise clients

#### Platform Optimization

- [ ] **Caching** — Add Redis caching for tax rules, country data, and plan information
- [ ] **CDN** — Serve API from edge locations for lower latency
- [ ] **Database optimization** — Add indexes, query optimization, and read replicas
- [ ] **Performance benchmarks** — Load testing and response time optimization (target < 100ms P95)
- [ ] **Error tracking** — Integrate Sentry for real-time error monitoring across API and web
- [ ] **Observability** — Distributed tracing and metrics dashboards (Grafana, Datadog, or similar)

#### Growth & Marketing

- [ ] **Blog / content marketing** — Tax guides, calculator comparisons, and how-to articles for SEO
- [ ] **Affiliate program** — Referral commissions for developers who promote the API
- [ ] **Partner integrations** — Accounting software integrations (QuickBooks, Xero, FreshBooks)
- [ ] **Developer community** — Discord or Slack community for API users

---

## Priority Matrix

| Phase | Effort | Revenue Impact | Risk | Priority |
|---|---|---|---|---|
| MVP 1 — Free Calculator | Medium | Indirect (traffic/SEO) | Low | 🟢 Start immediately |
| MVP 2 — Auth & API Keys | Medium | Foundation for revenue | Low | 🟢 Start after MVP 1 |
| MVP 3 — Paid Subscriptions | High | **Direct revenue** | Medium | 🟡 Critical for revenue |
| MVP 4 — Expert Marketplace | High | **Second revenue stream** | High | 🟡 Start after MVP 3 |
| MVP 5 — Scale & Expand | Ongoing | Growth multiplier | Medium | 🔵 Continuous |

---

## Quick Wins (Can Be Done Independently)

These tasks provide immediate value and can be tackled in parallel with MVP work:

1. **Environment variables** — Move hardcoded credentials to `.env` (1 hour)
2. **Swagger docs** — Add `@nestjs/swagger` for auto-generated API docs (2–3 hours)
3. **Input validation** — Add `class-validator` decorators to DTOs (2–3 hours)
4. **Dockerfile** — Containerize the API for consistent deployment (1–2 hours)
5. **Database migrations** — Replace `synchronize: true` with initial migration (2–3 hours)
6. **CI pipeline** — GitHub Actions for lint + test + build (1–2 hours)
