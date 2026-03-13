# Healthwyz — Project Progress Presentation

**Date:** March 2026
**Platform:** Full-Stack Healthcare Platform for Africa
**Stack:** Next.js 15, TypeScript, PostgreSQL, Prisma, Socket.IO, WebRTC

---

## 1. Executive Summary

Healthwyz is a comprehensive healthcare platform connecting patients with 10 types of healthcare professionals across 6 African countries. The platform supports video consultations, appointment booking, prescription management, AI health coaching, in-app payments, and regional administration.

**Current Status:** Core platform is **production-deployed** with CI/CD pipeline, serving all user types with dashboards, booking, messaging, video calls, and AI features. Payment processing and external notification channels remain simulated/planned.

---

## 2. Platform at a Glance

| Metric | Count |
|--------|------:|
| User Types Supported | 11 + Super Admin |
| API Endpoints | 176 |
| Database Models | 79 |
| React Components | 140+ |
| Dashboard Pages | 320+ |
| Unit Tests | 750+ (Vitest) |
| E2E Tests | 18 files (Playwright) |
| Languages | 3 (English, French, Creole) |
| Regions/Countries | 6 |
| Seeded Test Users | 82 |

---

## 3. What Is Done

### 3.1 Authentication & Registration

| Feature | Status |
|---------|:------:|
| JWT authentication with httpOnly cookies | DONE |
| Multi-step registration (Account Type -> Basic Info -> Documents -> Verification) | DONE |
| Role-based access control (11 user types) | DONE |
| CSRF protection | DONE |
| Password change / security settings | DONE |
| Account status management (active, pending, suspended) | DONE |
| "Provide later" option for required documents | DONE |
| Region selection at registration | DONE |
| Profile picture upload at registration | DONE |
| Document file upload saved to database | DONE |

### 3.2 User Types & Dashboards

Every user type has a fully built dashboard with sidebar navigation, role-specific pages, and shared components.

| User Type | Dashboard | Booking | Messaging | Video | AI Assistant | Wallet |
|-----------|:---------:|:-------:|:---------:|:-----:|:------------:|:------:|
| Patient | DONE | DONE | DONE | DONE | DONE | DONE |
| Doctor | DONE | DONE | DONE | DONE | DONE | DONE |
| Nurse | DONE | DONE | DONE | DONE | DONE | DONE |
| Nanny | DONE | DONE | DONE | DONE | DONE | DONE |
| Pharmacist | DONE | — | DONE | DONE | DONE | DONE |
| Lab Technician | DONE | DONE | DONE | DONE | DONE | DONE |
| Emergency Worker | DONE | DONE | DONE | DONE | DONE | DONE |
| Insurance Rep | DONE | — | DONE | DONE | DONE | DONE |
| Corporate Admin | DONE | DONE | DONE | DONE | DONE | DONE |
| Referral Partner | DONE | — | DONE | DONE | DONE | DONE |
| Regional Admin | DONE | — | DONE | DONE | — | — |
| Super Admin | DONE | — | DONE | DONE | — | — |

### 3.3 Booking & Appointments

| Feature | Status |
|---------|:------:|
| Doctor appointment booking (in-person, home visit, video) | DONE |
| Nurse booking | DONE |
| Nanny/childcare booking | DONE |
| Lab test booking | DONE |
| Emergency service booking | DONE |
| Available slots API | DONE |
| Booking actions (accept, deny, cancel, en_route, complete) | DONE |
| Provider booking request management | DONE |
| Booking confirmation with commission split | DONE |

### 3.4 Video Consultations & Real-Time Communication

| Feature | Status |
|---------|:------:|
| WebRTC peer-to-peer video calls (simple-peer) | DONE |
| Socket.IO signaling server (co-hosted with Next.js) | DONE |
| Room management with participant tracking | DONE |
| Session persistence and recovery | DONE |
| Heartbeat monitoring (30s interval, 90s timeout) | DONE |
| Reconnection grace period (2 minutes) | DONE |
| Generic VideoConsultation component (works for all user types) | DONE |
| Real-time chat/messaging via Socket.IO | DONE |
| Conversation creation and message history | DONE |

### 3.5 AI Health Assistant & Tracking

| Feature | Status |
|---------|:------:|
| AI chat assistant (Groq API / llama-3.1-8b-instant) | DONE |
| Tool-calling pattern for structured extraction | DONE |
| AiPatientInsight — date-aware dietary/health tracking | DONE |
| Food diary with 100+ items (including Mauritian local foods) | DONE |
| Exercise logging | DONE |
| Water intake tracking | DONE |
| AI meal plan generation | DONE |
| Progress tracking with historical data | DONE |
| TDEE/calorie calculation | DONE |
| Health tracker dashboard with charts | DONE |
| AI health coaching tab | DONE |

### 3.6 Medical & Clinical Features

| Feature | Status |
|---------|:------:|
| Medical records (consultation, prescription, lab, imaging, vaccination, surgery) | DONE |
| Prescription management with medicine database | DONE |
| Lab test results | DONE |
| Vital signs tracking (BP, heart rate, temp, weight, O2, glucose, cholesterol) | DONE |
| Doctor service catalog customization | DONE |
| Nurse service catalog | DONE |
| Nanny service catalog | DONE |
| Lab test catalog | DONE |
| Emergency service listings | DONE |
| Insurance plan listings | DONE |
| Insurance claims management | DONE |
| Pill reminders | DONE |

### 3.7 Document Management

| Feature | Status |
|---------|:------:|
| Document upload at registration (files saved to disk + URL in DB) | DONE |
| Document verification via AI/VLM (Groq Vision — Llama 4 Scout) | DONE |
| PDF text extraction (pdfjs-dist) | DONE |
| Word document extraction (mammoth) | DONE |
| Profile page: view, download, upload new documents | DONE |
| Profile picture upload and change from profile page | DONE |
| Admin document verification queue | DONE |

### 3.8 Payments & Commission

| Feature | Status |
|---------|:------:|
| In-app wallet system (credit, debit, balance) | DONE |
| Commission distribution (85% provider, 10% regional admin, 5% platform) | DONE |
| Configurable rates via environment variables | DONE |
| Wallet transaction history | DONE |
| Platform commission dashboard | DONE |
| Regional admin commission tracking | DONE |
| Billing info management per user | DONE |
| Medicine orders (pharmacy) | DONE |
| Payment UI (MCB Juice + credit/debit card form) | DONE |

> **Note:** Payment processing currently uses **simulated trial credits (Rs 4,500)** — see Section 4 for external payment integration status.

### 3.9 Social & Community

| Feature | Status |
|---------|:------:|
| Doctor posts / health feed | DONE |
| Post comments and likes | DONE |
| User connection system (send, accept, reject) | DONE |
| Connection suggestions (region-aware: same-region first) | DONE |
| Provider reviews and ratings | DONE |
| Social feed per dashboard | DONE |

### 3.10 Search & Discovery

| Feature | Status |
|---------|:------:|
| Unified search API with filters | DONE |
| Search autocomplete | DONE |
| Provider search: doctors, nurses, nannies, pharmacists, lab techs, emergency, insurance | DONE |
| Medicine search | DONE |
| Search results with connect/message/call buttons | DONE |
| Search history tracking | DONE |

### 3.11 Admin & Regional Management

| Feature | Status |
|---------|:------:|
| Super admin dashboard (global view) | DONE |
| Regional admin dashboard (scoped to their region) | DONE |
| User account management (approve, reject, suspend) | DONE |
| Regional admin user filtering by regionId | DONE |
| Role configuration per user type | DONE |
| Commission configuration | DONE |
| Security alerts and management | DONE |
| System health monitoring | DONE |
| CMS: landing page editor per country | DONE |
| CMS: hero slides management | DONE |
| CMS: testimonials management | DONE |
| Platform metrics and statistics | DONE |
| Regional activity dashboard | DONE |
| Required documents configuration | DONE |

### 3.12 Multi-Region / Multi-Country

| Feature | Status |
|---------|:------:|
| Region model in database (name, countryCode, language, flag) | DONE |
| 6 regions seeded: Mauritius, Madagascar, Kenya, Togo, Benin, Rwanda | DONE |
| Region selection at signup | DONE |
| Public GET /api/regions for dropdown | DONE |
| Admin CRUD for regions | DONE |
| Feed suggestions prioritize same-region users | DONE |
| Regional admin scoped to their region's users | DONE |
| Multi-country seed data (50+ users across 5 countries) | DONE |
| Dynamic landing page per country (`/[countryCode]`) | DONE |

### 3.13 Internationalization (i18n)

| Feature | Status |
|---------|:------:|
| English support | DONE |
| French support | DONE |
| Mauritian Creole support | DONE |
| Language switcher component | DONE |
| localStorage persistence | DONE |
| User preference language (from region) | DONE |

### 3.14 Mobile & PWA

| Feature | Status |
|---------|:------:|
| Progressive Web App manifest | DONE |
| Service worker with caching strategies | DONE |
| App icons (8 sizes: 72px–512px) | DONE |
| Offline fallback | DONE |
| Capacitor configuration (iOS + Android) | DONE |
| SplashScreen, StatusBar, Keyboard plugins | DONE |
| Responsive design (mobile-first) | DONE |
| Mobile bottom tab navigation pattern | DONE |

### 3.15 Infrastructure & DevOps

| Feature | Status |
|---------|:------:|
| Docker Compose (PostgreSQL 16 + App) | DONE |
| GitHub Actions CI/CD pipeline | DONE |
| Automated: lint, type check, unit tests, build, deploy | DONE |
| Vultr VPS deployment via SSH | DONE |
| HTTPS with Let's Encrypt / Certbot | DONE |
| Nginx reverse proxy | DONE |
| Prisma schema auto-push on deploy | DONE |
| Idempotent database seeding on deploy | DONE |
| Smoke test after deployment (login validation) | DONE |
| Container health checks | DONE |
| CSP security headers | DONE |
| Input sanitization | DONE |
| SEO: meta tags, Open Graph, JSON-LD | DONE |

### 3.16 Testing

| Feature | Status |
|---------|:------:|
| Unit tests (Vitest): 750+ tests, 56 files | DONE |
| E2E tests (Playwright): 18 test files | DONE |
| API route tests (auth, validation, CRUD, edge cases) | DONE |
| Validation schema tests | DONE |
| Component tests | DONE |
| Test documents for manual testing | DONE |

---

## 4. What Is Not Yet Done

### 4.1 Payment Processing — External Integration

| Feature | Status | Notes |
|---------|:------:|-------|
| Real payment gateway integration (Stripe, PayPal, etc.) | NOT DONE | Currently uses simulated trial credits (Rs 4,500) |
| MCB Juice real API integration | NOT DONE | UI form exists, backend is simulated |
| Credit/debit card processing | NOT DONE | Form UI exists, no real processor |
| Payment receipts / invoices (PDF) | NOT DONE | Transaction history exists but no downloadable receipts |
| Subscription billing (recurring) | NOT DONE | Tab exists in settings but no recurring logic |

### 4.2 External Notifications

| Feature | Status | Notes |
|---------|:------:|-------|
| Email sending (transactional) | NOT DONE | No nodemailer/sendgrid/resend integration |
| Email templates (welcome, booking confirm, etc.) | NOT DONE | — |
| SMS notifications | NOT DONE | No Twilio/Vonage integration |
| Push notifications (web) | NOT DONE | No web-push subscription mechanism |
| Push notifications (mobile via Firebase) | NOT DONE | Capacitor plugin configured, no Firebase setup |

> In-app notifications (database + Socket.IO real-time) are fully working.

### 4.3 Authentication Enhancements

| Feature | Status | Notes |
|---------|:------:|-------|
| Google Sign-In / OAuth | NOT DONE | Button exists with "Coming soon" message |
| Apple Sign-In | NOT DONE | — |
| Two-factor authentication (2FA) | NOT DONE | Security settings tab exists but no TOTP/SMS 2FA |
| Email verification (real sending) | NOT DONE | Verification flag in DB but no actual email sent |
| Password reset via email | NOT DONE | No email sending capability |

### 4.4 AI Features — Planned

| Feature | Status | Notes |
|---------|:------:|-------|
| AI food photo scanning (camera) | NOT DONE | "Coming Soon" placeholder in AddFoodModal |
| AI symptom checker | NOT DONE | — |
| AI triage / urgency assessment | NOT DONE | — |
| AI prescription interaction checker | NOT DONE | — |

### 4.5 Doctor-Specific

| Feature | Status | Notes |
|---------|:------:|-------|
| Full calendar view for schedule | NOT DONE | "Coming soon" in practice page |
| Review theme analysis (NLP) | NOT DONE | "Coming soon" in reviews page |
| E-prescription with digital signature | NOT DONE | Prescription CRUD exists, no digital signing |

### 4.6 Mobile App

| Feature | Status | Notes |
|---------|:------:|-------|
| Native iOS build (Capacitor) | NOT DONE | Config ready, no native build executed |
| Native Android build (Capacitor) | NOT DONE | Config ready, no native build executed |
| App Store / Play Store publishing | NOT DONE | Publishing guide exists in docs |
| Biometric authentication (fingerprint/face) | NOT DONE | — |
| Offline mode with sync | NOT DONE | Basic service worker caching only |

### 4.7 Advanced Platform Features

| Feature | Status | Notes |
|---------|:------:|-------|
| Analytics dashboard (usage metrics, retention) | NOT DONE | Basic stats exist, no full analytics |
| Audit trail / activity logs | NOT DONE | Admin page exists, no detailed logging |
| Data export (patient records as PDF/CSV) | NOT DONE | — |
| Appointment reminders (automated) | NOT DONE | Requires email/SMS integration |
| Telemedicine queue / waiting room | NOT DONE | Direct video call exists, no queue system |
| Multi-language content (CMS per language) | NOT DONE | CMS exists but content is single-language |
| Referral tracking with analytics | NOT DONE | Referral code system exists, limited analytics |

---

## 5. Architecture Overview

```
                         ┌──────────────────────────┐
                         │      Nginx (HTTPS)        │
                         │    Let's Encrypt SSL      │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │    Custom server.js       │
                         │  Next.js 15 + Socket.IO   │
                         │     Port 3000 → 8080      │
                         └────────────┬─────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                   │
           ┌────────▼──────┐  ┌──────▼───────┐  ┌───────▼──────┐
           │  API Routes   │  │  Socket.IO   │  │   Static     │
           │  176 endpoints│  │  Signaling   │  │   Assets     │
           └────────┬──────┘  └──────┬───────┘  └──────────────┘
                    │                │
           ┌────────▼──────┐  ┌──────▼───────┐
           │   Prisma ORM  │  │   WebRTC     │
           │  79 models    │  │   P2P Video  │
           └────────┬──────┘  └──────────────┘
                    │
           ┌────────▼──────┐
           │  PostgreSQL   │
           │  Docker 16    │
           └───────────────┘
```

---

## 6. Deployment Pipeline

```
  Developer pushes to main
         │
         ▼
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Lint &      │────▶│  Unit Tests  │────▶│  Docker      │
  │   Type Check  │     │  (750+ pass) │     │  Build &     │
  │   (ESLint,    │     │  (Vitest)    │     │  Push to     │
  │    TSC)       │     │              │     │  GHCR        │
  └──────────────┘     └──────────────┘     └──────┬───────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │  Deploy to   │
                                            │  Vultr VPS   │
                                            │  via SSH     │
                                            ├──────────────┤
                                            │ • Pull image │
                                            │ • Prisma push│
                                            │ • Seed DB    │
                                            │ • Smoke test │
                                            └──────────────┘
```

---

## 7. Countries & Regions

| Country | Code | Language | Seeded Users | Regional Admin |
|---------|:----:|----------|:------------:|:--------------:|
| Mauritius | MU | English | 29 | Hassan, Vikash |
| Madagascar | MG | French | 11 | Tiana |
| Kenya | KE | English | 11 | James |
| Togo | TG | French | 10 | — |
| Benin | BJ | French | 10 | — |
| Rwanda | RW | English | 10 | — |

---

## 8. Revenue Model Implementation

```
  Patient pays for consultation
              │
              ▼
     ┌────────────────┐
     │  Total Payment  │
     └───────┬────────┘
             │
    ┌────────┼─────────┐
    │        │         │
    ▼        ▼         ▼
  85%      10%        5%
Provider  Regional   Platform
          Admin      Fee

  Rates configurable via:
  PLATFORM_COMMISSION_RATE
  REGIONAL_COMMISSION_RATE
```

**Status:** Commission logic fully implemented in `lib/commission.ts`. Wallet transactions track `platformCommission`, `regionalCommission`, `providerAmount`, and `regionalAdminId`. Dashboard shows accumulated commissions per regional admin.

---

## 9. Priority Roadmap — What's Next

### High Priority (Revenue-Enabling)

| # | Feature | Effort | Impact |
|---|---------|--------|--------|
| 1 | Real payment gateway (Stripe / local provider) | Medium | Enables real transactions |
| 2 | Email integration (SendGrid / Resend) | Low | Booking confirmations, password reset |
| 3 | SMS notifications (Twilio) | Low | Appointment reminders |
| 4 | Google OAuth sign-in | Low | Reduces registration friction |

### Medium Priority (User Experience)

| # | Feature | Effort | Impact |
|---|---------|--------|--------|
| 5 | Push notifications (web + mobile) | Medium | Real-time engagement |
| 6 | Two-factor authentication | Medium | Security compliance |
| 7 | Native mobile builds (Capacitor) | Medium | App store presence |
| 8 | Appointment reminders (automated) | Low | Reduces no-shows |
| 9 | Data export (PDF/CSV) | Low | Patient record portability |

### Lower Priority (Enhancement)

| # | Feature | Effort | Impact |
|---|---------|--------|--------|
| 10 | AI food photo scanning | High | Novelty feature |
| 11 | Doctor calendar full view | Medium | Scheduling efficiency |
| 12 | Waiting room / queue system | Medium | Better video UX |
| 13 | Multi-language CMS content | Medium | Regional content |
| 14 | Analytics dashboard | Medium | Business intelligence |
| 15 | Offline mode with sync | High | Connectivity resilience |

---

## 10. Test Coverage Summary

| Category | Tests | Files |
|----------|------:|------:|
| API route tests | 450+ | 30+ |
| Validation schema tests | 150+ | 8 |
| Component tests | 50+ | 5 |
| Service/utility tests | 100+ | 13 |
| E2E tests (Playwright) | 18 files | 18 |
| **Total unit tests** | **750+** | **56** |

All tests pass. Type checking clean (`npx tsc --noEmit` — 0 errors).

---

## 11. Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Single User table + 11 profile tables | Unified auth, type-specific data isolation |
| Custom server.js (not `next dev`) | Socket.IO co-hosting for real-time signaling |
| Groq API for AI (not OpenAI) | Cost-effective, fast inference for health coaching |
| Groq Vision for document verification | No separate OCR service needed |
| simple-peer for WebRTC | Lightweight P2P, no media server costs |
| In-app wallet (not direct payment) | Simpler commission split, offline-friendly |
| SVG seed documents | No external file dependencies for testing |
| Route groups `(dashboard)/` | Clean URLs without `/dashboard/` segment |
| Region-based filtering | Scalable multi-country expansion |

---

## 12. File Structure Summary

```
healthways-typescript/
├── app/
│   ├── api/              → 176 API endpoints
│   ├── admin/            → Super admin dashboard
│   ├── patient/          → Patient dashboard (25+ pages)
│   ├── doctor/           → Doctor dashboard (15+ pages)
│   ├── nurse/            → Nurse dashboard
│   ├── nanny/            → Nanny dashboard
│   ├── pharmacist/       → Pharmacist dashboard
│   ├── lab-technician/   → Lab tech dashboard
│   ├── responder/        → Emergency worker dashboard
│   ├── insurance/        → Insurance rep dashboard
│   ├── corporate/        → Corporate admin dashboard
│   ├── referral-partner/ → Referral partner dashboard
│   ├── regional/         → Regional admin dashboard
│   ├── signup/           → Multi-step registration
│   ├── login/            → Authentication
│   └── [countryCode]/    → Dynamic country landing pages
├── components/           → 140+ React components
├── hooks/                → 9 custom hooks
├── lib/                  → Services, auth, validation, DB
├── prisma/
│   ├── schema.prisma     → 79 models
│   ├── seeds/            → 15 seed files (82 users, 6 regions)
│   └── seed.ts           → Orchestrator
├── public/               → PWA assets, uploads, service worker
├── e2e/                  → 18 Playwright test files
├── docs/                 → Documentation & test data
├── server.js             → Custom server (Next.js + Socket.IO)
├── docker-compose.yml    → PostgreSQL + App containers
└── .github/workflows/    → CI/CD pipeline
```

---

*Generated March 2026 — Healthwyz Platform v1.0*
