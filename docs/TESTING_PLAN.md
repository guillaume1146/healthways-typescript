# Healthwyz Testing Plan

This document provides the complete testing checklist for the Healthwyz platform. Sections A-S are **fully automated** across three test layers. Remaining sections cover manual testing for real-time features and complex multi-tab workflows.

---

## How to Run All Automated Tests

```bash
# Prerequisites
npm run dev                          # Server on localhost:3000 (use NODE_OPTIONS="--max-old-space-size=4096" for stability)
npx prisma db push                   # Schema pushed to DB
npx prisma db seed                   # 13 seed files loaded
node Test-Data/generate-test-docs.js # PDF test documents generated

# 1. Unit Tests (fast, no server needed) — 600 tests, 46 files
npx vitest run

# 2. API End-to-End Tests (requires running server + seeded DB) — ~320 tests
node e2e/e2e-registration-auth.js

# 3. Browser End-to-End Tests (requires running server) — ~148 tests, 17 files
# Run all (chromium only, recommended):
npx playwright test --project=chromium

# Or run in batches to avoid server memory pressure:
npx playwright test e2e/home.spec.ts e2e/login.spec.ts e2e/search.spec.ts --project=chromium
npx playwright test e2e/patient-dashboard.spec.ts e2e/community.spec.ts --project=chromium
npx playwright test e2e/booking-flow.spec.ts e2e/doctor-dashboard.spec.ts --project=chromium
npx playwright test e2e/other-dashboards.spec.ts --project=chromium
npx playwright test e2e/edge-cases.spec.ts e2e/mobile-responsive.spec.ts e2e/admin-role-config.spec.ts --project=chromium
npx playwright test e2e/cross-role-flows.spec.ts e2e/responder-dashboard.spec.ts --project=chromium
npx playwright test e2e/insurance-dashboard.spec.ts e2e/corporate-dashboard.spec.ts e2e/regional-admin-dashboard.spec.ts --project=chromium
npx playwright test e2e/connections-and-sidebar.spec.ts --project=chromium
```

## Test Totals

| Layer | Files | Tests | Command |
|-------|-------|-------|---------|
| **Unit (Vitest)** | 46 | 600 | `npx vitest run` |
| **API E2E (Node.js)** | 1 | ~320 | `node e2e/e2e-registration-auth.js` |
| **Browser E2E (Playwright)** | 17 | ~148 (chromium) | `npx playwright test --project=chromium` |
| **Total** | **64** | **~1068** | |

---

## Seeded Login Credentials

**Password format:** `{Role}123!`

| User Type | Email | Password |
|-----------|-------|----------|
| Patient | emma.johnson@healthwyz.mu | Patient123! |
| Patient | jean.pierre@healthwyz.mu | Patient123! |
| Patient | aisha.khan@healthwyz.mu | Patient123! |
| Patient | vikash.d@healthwyz.mu | Patient123! |
| Patient | nadia.s@healthwyz.mu | Patient123! |
| Doctor | sarah.johnson@healthwyz.mu | Doctor123! |
| Doctor | raj.patel@healthwyz.mu | Doctor123! |
| Doctor | marie.dupont@healthwyz.mu | Doctor123! |
| Nurse | priya.ramgoolam@healthwyz.mu | Nurse123! |
| Nurse | sophie.laurent@healthwyz.mu | Nurse123! |
| Nanny | anita.beeharry@healthwyz.mu | Nanny123! |
| Nanny | claire.morel@healthwyz.mu | Nanny123! |
| Pharmacist | rajesh.doorgakant@healthways.mu | Pharma123! |
| Pharmacist | anushka.doobur@healthways.mu | Pharma123! |
| Lab Tech | david.ahkee@healthways.mu | Lab123! |
| Lab Tech | priya.doorgakant@healthways.mu | Lab123! |
| Emergency | jeanmarc.lafleur@healthways.mu | Emergency123! |
| Emergency | fatima.joomun@healthways.mu | Emergency123! |
| Insurance | vikram.doorgakant@healthways.mu | Insurance123! |
| Insurance | marie.genave@healthways.mu | Insurance123! |
| Corporate | anil.doobur@healthways.mu | Corporate123! |
| Referral | sophie.leclerc@healthways.mu | Referral123! |
| Regional MU | vikash.doorgakant@healthways.mu | Regional123! |
| Regional MG | tiana.rasoa@healthways.mg | Regional123! |
| Regional KE | james.mwangi@healthways.ke | Regional123! |
| Super Admin | hassan.doorgakant@healthways.mu | Admin123! |

---

# AUTOMATED TEST SECTIONS (A-T)

## A. Registration Flow

**Automated in:** `e2e/e2e-registration-auth.js` (Sections A), `lib/auth/__tests__/schemas.test.ts`, `app/api/__tests__/register.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| A1-A11 | Register all 11 user types with OCR doc upload | API E2E | Automated |
| A12 | OCR failure handling (name mismatch) | API E2E | Automated |
| A13 | Trial wallet creation (Rs 4,500) | API E2E | Automated |
| A14 | Duplicate email rejection (HTTP 409) | API E2E | Automated |
| A15 | Password mismatch (HTTP 400) | API E2E | Automated |
| A16-A18 | Skip documents ("I'll provide later") | API E2E | Automated |
| A19-A27 | Skip docs for all user types | API E2E | Automated |
| - | Registration Zod validation schemas | Unit (Vitest) | Automated |
| - | Register API route logic | Unit (Vitest) | Automated |

### Test Data Files

Test documents in `Test-Data/generated/`. Run `node Test-Data/generate-test-docs.js` to generate 57 PDFs for all 11 user types.

---

## B. Login & Authentication

**Automated in:** `e2e/e2e-registration-auth.js` (Section B), `e2e/login.spec.ts`, `lib/auth/__tests__/jwt.test.ts`, `lib/auth/__tests__/schemas.test.ts`, `app/api/__tests__/login.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| B1-B22 | Seeded account logins (all 22 accounts) | API E2E | Automated |
| B23 | Wrong password returns 401 | API E2E | Automated |
| B24-B34 | Newly registered account logins | API E2E | Automated |
| - | Login page renders, form interaction, validation | Browser (Playwright) | Automated (9 tests in `login.spec.ts`) |
| - | JWT sign/verify, auth schemas, user type map | Unit (Vitest) | Automated |
| - | Rate limiting, CSRF protection | Unit (Vitest) | Automated |

---

## C. Trial Balance & Wallet System

**Automated in:** `e2e/e2e-registration-auth.js` (Section C), `app/api/__tests__/wallet.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| C1-C2 | Trial balance after registration | API E2E | Automated |
| C3 | Wallet balance, currency, initial credit | API E2E | Automated |
| C4 | Transaction history (sorted, required fields) | API E2E | Automated |
| C5 | Cannot access another user's wallet (403) | API E2E | Automated |
| C6 | Unauthenticated wallet access (401) | API E2E | Automated |
| C7 | New patient has Rs 4,500 trial balance | API E2E | Automated |
| - | Wallet API route logic | Unit (Vitest) | Automated |

---

## D. Doctor Posts & Community

**Automated in:** `e2e/e2e-registration-auth.js` (Section D), `e2e/community.spec.ts`, `lib/validations/__tests__/posts.test.ts`, `app/api/__tests__/posts.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| D1 | Community feed public GET /api/posts | API E2E | Automated |
| D2 | Doctor creates post (content, category, authorId) | API E2E | Automated |
| D3 | Patient comments on post | API E2E | Automated |
| D4-D5 | Like/unlike toggle | API E2E | Automated |
| D6 | Category filter | API E2E | Automated |
| D7 | Doctor deletes own post | API E2E | Automated |
| - | Community feed page (6 tests) | Browser (Playwright) | Automated (`community.spec.ts`) |
| - | Post validation schemas (22 tests) | Unit (Vitest) | Automated |

---

## E. Patient Dashboard

**Automated in:** `e2e/patient-dashboard.spec.ts`, `app/patient/__tests__/dashboard.test.tsx`, `app/api/__tests__/patients.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| E1 | Overview page (welcome text, stat cards) | Browser (Playwright) | Automated |
| E2 | Bookings page with filter tabs | Browser (Playwright) | Automated |
| E3 | Consultations page | Browser (Playwright) | Automated |
| E4 | Prescriptions page | Browser (Playwright) | Automated |
| E5 | Health records page | Browser (Playwright) | Automated |
| E6 | Billing page | Browser (Playwright) | Automated |
| E7 | Video call page | Browser (Playwright) | Automated |
| E8 | Messages page | Browser (Playwright) | Automated |
| E9 | Profile page | Browser (Playwright) | Automated |
| - | Dashboard component rendering (17 tests) | Unit (Vitest) | Automated |
| - | Patient API routes (11 tests) | Unit (Vitest) | Automated |

---

## F. Booking Flow (End-to-End)

**Automated in:** `e2e/booking-flow.spec.ts`, `e2e/e2e-registration-auth.js` (Section E), `lib/validations/__tests__/bookings.test.ts`, `app/api/__tests__/bookings.test.ts`, `app/api/__tests__/booking-actions.test.ts`, `app/api/__tests__/available-slots.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| F1 | Search doctors page loads with "Dr. Sarah Johnson" | Browser (Playwright) | Automated |
| F2 | Doctor card has Book button | Browser (Playwright) | Automated |
| F3 | Patient navigates to booking form via Book click | Browser (Playwright) | Automated |
| F4 | Booking form has consultation type options | Browser (Playwright) | Automated |
| F5 | Search nurses page loads | Browser (Playwright) | Automated |
| F6 | Search lab tests page loads | Browser (Playwright) | Automated |
| F7 | Doctor sees booking requests page | Browser (Playwright) | Automated |
| F8 | Patient bookings page with filter tabs | Browser (Playwright) | Automated |
| E1-E9 | Book doctor, accept, deny, book nurse, book lab test, auth/validation | API E2E | Automated |
| - | Booking validation schemas (36 tests) | Unit (Vitest) | Automated |
| - | Bookings API (16 tests), Actions API (19 tests, incl. emergency accept with profile resolution), Slots API (7 tests) | Unit (Vitest) | Automated |

---

## G. Provider Availability Configuration

**Automated in:** `e2e/e2e-registration-auth.js` (Section F), `app/api/__tests__/availability.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| G1 | Get doctor availability (5 default slots) | API E2E | Automated |
| G2 | Update availability (add Saturday) | API E2E | Automated |
| G3 | Verify Saturday saved | API E2E | Automated |
| G4 | Remove Wednesday | API E2E | Automated |
| G5 | Get nurse availability | API E2E | Automated |
| G6 | Get nanny availability | API E2E | Automated |
| - | Availability API logic (7 tests) | Unit (Vitest) | Automated |

---

## H. Doctor Dashboard

**Automated in:** `e2e/doctor-dashboard.spec.ts`, `e2e/e2e-registration-auth.js` (Section G), `app/doctor/__tests__/sidebar-config.test.ts`, `app/api/__tests__/doctors.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| H1 | Overview page (welcome text, stat cards) | Browser (Playwright) | Automated |
| H2 | Booking Requests page | Browser (Playwright) | Automated |
| H3 | Patients page | Browser (Playwright) | Automated |
| H4 | My Posts page (create form) | Browser (Playwright) | Automated |
| H5 | Profile page | Browser (Playwright) | Automated |
| H6 | Appointments page | Browser (Playwright) | Automated |
| H7 | Billing & Earnings page | Browser (Playwright) | Automated |
| H8 | Video call page | Browser (Playwright) | Automated |
| H9 | Messages page | Browser (Playwright) | Automated |
| H10 | Reviews page | Browser (Playwright) | Automated |
| G1-G6 | Doctor dashboard APIs (booking-requests, appointments, patients, stats, prescriptions, unauth) | API E2E | Automated |
| - | Doctor sidebar config (16 tests) | Unit (Vitest) | Automated |
| - | Doctors API (13 tests) | Unit (Vitest) | Automated |

---

## I. Other User Type Dashboards

**Automated in:** `e2e/other-dashboards.spec.ts`, `e2e/e2e-registration-auth.js` (Section H), `app/api/__tests__/dashboards.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| I1 | Nurse dashboard loads | Browser (Playwright) | Automated |
| I2 | Nanny dashboard loads | Browser (Playwright) | Automated |
| I3 | Pharmacist dashboard loads | Browser (Playwright) | Automated |
| I4 | Lab Technician dashboard loads | Browser (Playwright) | Automated |
| I5 | Emergency Worker dashboard loads | Browser (Playwright) | Automated |
| I6 | Insurance Rep dashboard loads | Browser (Playwright) | Automated |
| I7 | Corporate Admin dashboard loads | Browser (Playwright) | Automated |
| I8 | Referral Partner dashboard loads | Browser (Playwright) | Automated |
| I9 | Super Admin dashboard loads | Browser (Playwright) | Automated |
| H1-H5 | Other dashboard APIs (nurse, nanny, pharmacist, lab, responder) | API E2E | Automated |
| - | Dashboard API logic (11 tests) | Unit (Vitest) | Automated |

---

## J. Notification System

**Automated in:** `e2e/other-dashboards.spec.ts`, `e2e/e2e-registration-auth.js` (Section I)

| # | Test | Type | Status |
|---|------|------|--------|
| J1 | Dashboard header shows user name and logout | Browser (Playwright) | Automated |
| J2 | Notification dropdown opens on bell click | Browser (Playwright) | Automated |
| I1-I3 | Notification APIs (get, mark all read, unauth) | API E2E | Automated |
| J3 | Real-time toast notification | - | Manual |
| J4-J5 | Booking accepted/denied notification content | - | Manual |

---

## K. Medicine Purchase Flow

**Automated in:** `e2e/other-dashboards.spec.ts`, `e2e/e2e-registration-auth.js` (Section J)

| # | Test | Type | Status |
|---|------|------|--------|
| K1 | Medicine search page loads (disclaimer + Find Medicine) | Browser (Playwright) | Automated |
| K2 | Pharmacist inventory page loads | Browser (Playwright) | Automated |
| K3 | Pharmacist orders page loads | Browser (Playwright) | Automated |
| J1-J3 | Medicine & pharmacy APIs (search, pharmacist medicines, patient orders) | API E2E | Automated |
| - | Add to cart, checkout, place order | - | Manual (see Section V below) |

---

## L. Mobile Responsive Testing

**Automated in:** `e2e/mobile-responsive.spec.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| L1 | Home page on mobile (375x812) — no horizontal overflow | Browser (Playwright) | Automated |
| L2 | Login page usable on mobile — inputs wide enough | Browser (Playwright) | Automated |
| L3 | Patient dashboard on mobile — sidebar hidden | Browser (Playwright) | Automated |
| L4 | Search doctors on tablet (768x1024) — cards visible | Browser (Playwright) | Automated |
| L5 | Signup page on mobile — heading + step indicators | Browser (Playwright) | Automated |
| L6 | Doctor dashboard on tablet — content fits viewport | Browser (Playwright) | Automated |

---

## M. Edge Cases

**Automated in:** `e2e/edge-cases.spec.ts`, `e2e/e2e-registration-auth.js` (Section K), `lib/validations/__tests__/edge-cases.test.ts`, `lib/__tests__/sanitize.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| M1 | Login wrong password shows error (red banner) | Browser (Playwright) | Automated |
| M2 | Login nonexistent email shows error | Browser (Playwright) | Automated |
| M3 | Protected route without auth redirects to login | Browser (Playwright) | Automated |
| M4 | 404 page for invalid route | Browser (Playwright) | Automated |
| M5 | Empty search query works without crash | Browser (Playwright) | Automated |
| K1-K5 | Edge case APIs (wrong pw, nonexistent user, unauth, invalid payload, nonexistent resource) | API E2E | Automated |
| - | Edge case validations — booking, conversation, message, video, WebRTC (19 tests) | Unit (Vitest) | Automated |
| - | Input sanitization (57 tests) | Unit (Vitest) | Automated |

---

## N. Provider Reviews

**Automated in:** `e2e/other-dashboards.spec.ts`, `app/api/__tests__/provider-reviews.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| N1 | Doctor reviews page loads | Browser (Playwright) | Automated |
| N2 | Nurse reviews page loads | Browser (Playwright) | Automated |
| N3 | Nanny reviews page loads | Browser (Playwright) | Automated |
| - | Provider reviews API logic (13 tests) | Unit (Vitest) | Automated |
| N4-N8 | Submit review, reply, helpful, filter, search | - | Manual |

---

## O. Super Admin Role Configuration

**Automated in:** `e2e/admin-role-config.spec.ts`, `e2e/e2e-registration-auth.js` (Section L), `app/api/__tests__/role-config.test.ts`, `app/api/__tests__/admin.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| O1 | Role config page loads with feature toggle table | Browser (Playwright) | Automated |
| O2 | Admin users page loads with search + user table | Browser (Playwright) | Automated |
| O3 | Commission config page loads | Browser (Playwright) | Automated |
| O4 | Regional admins page loads | Browser (Playwright) | Automated |
| O5 | Admin security page loads | Browser (Playwright) | Automated |
| L1 | GET /api/admin/role-config returns data | API E2E | Automated |
| L2 | PUT /api/admin/role-config without auth returns 401 | API E2E | Automated |
| L3 | PUT /api/admin/role-config with admin auth succeeds | API E2E | Automated |
| L4 | GET /api/admin/dashboard returns data | API E2E | Automated |
| L5 | GET /api/admin/accounts returns user list | API E2E | Automated |
| L6 | GET /api/admin/system-health returns data | API E2E | Automated |
| L7 | GET /api/admin/dashboard without auth returns 401 | API E2E | Automated |
| - | Role config API logic (8 tests) | Unit (Vitest) | Automated |
| - | Admin API logic (4 tests) | Unit (Vitest) | Automated |

---

## P. Prescription Flow (Doctor → Patient)

**Automated in:** `e2e/e2e-registration-auth.js` (Section M), `e2e/cross-role-flows.spec.ts`, `app/api/__tests__/prescriptions-create.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| M1 | Doctor creates prescription for patient (2 medicines, diagnosis, notes) | API E2E | Automated |
| M1a-b | Prescription diagnosis matches, has 2 medicines | API E2E | Automated |
| M2 | Patient sees prescriptions (GET with doctor, medicines, diagnosis) | API E2E | Automated |
| M3 | Patient receives prescription notification | API E2E | Automated |
| M4 | Non-doctor cannot create prescription (403) | API E2E | Automated |
| S1 | Doctor prescriptions page loads | Browser (Playwright) | Automated |
| S2 | Patient prescriptions page loads with data | Browser (Playwright) | Automated |
| S6 | Pharmacist orders page loads | Browser (Playwright) | Automated |
| - | Prescription create API logic (13 tests) | Unit (Vitest) | Automated |

---

## Q. Lab Tech Results & Patient Lab Tests

**Automated in:** `e2e/e2e-registration-auth.js` (Section N), `e2e/cross-role-flows.spec.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| N1 | Lab tech results via GET /api/lab-techs/{id}/results | API E2E | Automated |
| N2 | Lab tech booking requests via GET /api/lab-techs/{id}/booking-requests | API E2E | Automated |
| N3 | Lab tech tests catalog via GET /api/lab-techs/{id}/tests | API E2E | Automated |
| N4 | Patient lab tests via GET /api/patients/{id}/lab-tests | API E2E | Automated |
| N5 | Lab tech results without auth returns 401 | API E2E | Automated |
| S3 | Lab technician results page loads | Browser (Playwright) | Automated |
| S4 | Lab technician booking requests page loads | Browser (Playwright) | Automated |
| S5 | Patient lab tests page loads | Browser (Playwright) | Automated |

---

## R-Part1. Emergency Worker APIs & Dashboard

**Automated in:** `e2e/e2e-registration-auth.js` (Section O), `e2e/responder-dashboard.spec.ts`, `app/api/__tests__/responder-apis.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| O1 | Responder booking requests API (pending + own active) | API E2E | Automated |
| O2 | Responder call history API (status mapping) | API E2E | Automated |
| O3 | Responder cannot view another responder's calls (403) | API E2E | Automated |
| O1-O5 | Responder dashboard, calls, booking-requests, services, profile pages | Browser (Playwright) | Automated |
| - | Responder booking-requests, calls, dashboard API logic (8 tests) | Unit (Vitest) | Automated |

---

## R-Part2. Insurance Rep APIs & Dashboard

**Automated in:** `e2e/e2e-registration-auth.js` (Section P), `e2e/insurance-dashboard.spec.ts`, `app/api/__tests__/insurance.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| P1 | Insurance dashboard API (stats, plans, wallet) | API E2E | Automated |
| P2 | Insurance plans GET | API E2E | Automated |
| P3 | Insurance plan create (POST) | API E2E | Automated |
| P4 | Insurance claims GET | API E2E | Automated |
| P5 | Insurance claim create (POST) | API E2E | Automated |
| P6 | Insurance dashboard without auth returns 401 | API E2E | Automated |
| P1-P5 | Insurance feed, claims, plans, clients, profile pages | Browser (Playwright) | Automated |
| - | Insurance claims/plans API logic (11 tests) | Unit (Vitest) | Automated |

---

## R-Part3. Corporate Admin APIs & Dashboard

**Automated in:** `e2e/e2e-registration-auth.js` (Section Q), `e2e/corporate-dashboard.spec.ts`, `app/api/__tests__/corporate.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| Q1 | Corporate dashboard API (stats, company, wallet, transactions) | API E2E | Automated |
| Q2 | Corporate employees API | API E2E | Automated |
| Q3 | Corporate claims API | API E2E | Automated |
| Q4 | Non-owner cannot access corporate dashboard (403) | API E2E | Automated |
| Q1-Q4 | Corporate feed, employees, claims, profile pages | Browser (Playwright) | Automated |
| - | Corporate dashboard, employees, claims API logic (9 tests) | Unit (Vitest) | Automated |

---

## S. Extended Admin & Regional Admin APIs

**Automated in:** `e2e/e2e-registration-auth.js` (Section R), `e2e/regional-admin-dashboard.spec.ts`, `app/api/__tests__/admin-extended.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| R1 | Admin metrics (users, bookings, revenue breakdown) | API E2E | Automated |
| R2 | Admin alerts (pending users, notifications, suspended) | API E2E | Automated |
| R3 | Admin commission config (platform/regional/provider rates) | API E2E | Automated |
| R4 | Platform commission data (totals, regional admin list) | API E2E | Automated |
| R5 | Regional activity data (regions, codes, stats) | API E2E | Automated |
| R6 | Admin admins list (regional admins with profiles) | API E2E | Automated |
| R7 | Required documents config (public, grouped by userType) | API E2E | Automated |
| R8 | Admin security API | API E2E | Automated |
| R9 | Admin metrics without auth returns 401/403 | API E2E | Automated |
| R10 | Regional admin can access admin dashboard | API E2E | Automated |
| R11 | Regional admin can access platform commission | API E2E | Automated |
| R1-R6 | Regional admin feed, users, content, notifications, security, profile pages | Browser (Playwright) | Automated |
| - | Admin metrics, alerts, commission-config, admins, required-documents API logic (10 tests) | Unit (Vitest) | Automated |

---

## T. Connection & Messaging Flow + Sidebar Search Links

**Automated in:** `e2e/e2e-registration-auth.js` (Section S), `e2e/connections-and-sidebar.spec.ts`, `app/api/__tests__/connections.test.ts`

| # | Test | Type | Status |
|---|------|------|--------|
| S1 | Patient sends connection request to doctor | API E2E | Automated |
| S2 | Doctor gets pending connection requests | API E2E | Automated |
| S3 | Doctor accepts connection with `{ action: 'accept' }` | API E2E | Automated |
| S4 | Accepted connections visible in list | API E2E | Automated |
| S5 | Old payload format `{ status }` rejected (400) | API E2E | Automated |
| S6 | GET /api/connections without auth returns 401 | API E2E | Automated |
| S7 | Patient creates conversation with connected doctor | API E2E | Automated |
| S8 | Patient retrieves conversations list | API E2E | Automated |
| T1 | Patient sidebar has "Search & Browse" section with search links | Browser (Playwright) | Automated |
| T2 | Doctor sidebar has "Search & Browse" section | Browser (Playwright) | Automated |
| T3 | Search doctors page loads from sidebar link | Browser (Playwright) | Automated |
| T4 | Search nurses page loads | Browser (Playwright) | Automated |
| T5 | Search childcare page loads | Browser (Playwright) | Automated |
| T6 | Search medicines page loads | Browser (Playwright) | Automated |
| T7 | Network icon visible in header with badge support | Browser (Playwright) | Automated |
| T8 | Network page loads with connection requests UI | Browser (Playwright) | Automated |
| - | Connection accept/reject API (8 tests), delete (3 tests) | Unit (Vitest) | Automated |

### Bug Fixes Applied
- **Connection confirm button**: Frontend was sending `{ status: 'accepted' }` but API expects `{ action: 'accept' }` — fixed in `ConnectionRequestsList.tsx`
- **Network badge**: Added pending connection request count badge to the network icon in `DashboardHeader.tsx`
- **Sidebar search links**: Added "Search & Browse" section with 6 search links (doctors, nurses, childcare, lab, emergency, medicines) to all 12 user type sidebars

---

## U. Reusable ServiceBookingManager Component

**Component:** `components/shared/ServiceBookingManager.tsx`

A unified, configuration-driven booking management component used across all provider types. Replaces ad-hoc booking list implementations with a single reusable table.

| # | Feature | Configured via |
|---|---------|---------------|
| U1 | Status filter tabs with counts | `statuses: StatusOption[]` |
| U2 | Category filter dropdown | `categories?: { value, label }[]` |
| U3 | Search across all fields | Built-in text search |
| U4 | Stats bar (total + per-status counts) | Auto-computed from `statuses` |
| U5 | Configurable table columns | `columns: ColumnDef[]` |
| U6 | Status badge with icon on each row | Auto from `statuses` config |
| U7 | Action buttons per status (accept/deny/complete/cancel/en_route) | `actions: ActionButton[]` with `visibleForStatuses` |
| U8 | Result button (prescription/lab results) | `resultButton?: { label, href, visibleForStatuses }` |
| U9 | API endpoint configuration | `fetchPath`, `actionPath` with `{userId}` / `{bookingId}` placeholders |

**Preset configs exported:** `doctorBookingConfig()`, `nurseBookingConfig()`, `nannyBookingConfig()`, `labTestBookingConfig()`, `emergencyBookingConfig()`

### Emergency Booking Status Flow
`pending` → `dispatched` (accept) → `en_route` → `completed` (resolved) | `cancelled`

### Standard Booking Status Flow (doctor, nurse, nanny, lab)
`pending` → `upcoming` (accept) → `completed` | `cancelled`

---

## V. Emergency Page & Audio Call

**Files:** `app/search/emergency/page.tsx`, `components/search/CallButton.tsx`

| # | Test | Type | Status |
|---|------|------|--------|
| V1 | Emergency search page loads with provider cards | Browser | Manual |
| V2 | Each card shows 4 buttons: Call, Book Service, Message, Connect | Browser | Manual |
| V3 | Call button creates conversation and navigates to video page with `?mode=audio` | Browser | Manual |
| V4 | Book Service navigates to `/patient/book/emergency` | Browser | Manual |
| V5 | Status filter tabs (pending/dispatched/on-scene/completed/cancelled) | Browser | Manual |
| V6 | Real emergency numbers (114, 115, 999, 112) are clickable `tel:` links | Browser | Manual |

---

## W. Dynamic Country Flags

**File:** `components/home/HeroSection.tsx`

| # | Test | Type | Status |
|---|------|------|--------|
| W1 | `/mu` shows Mauritius flag (red/blue/yellow/green stripes) | Browser | Manual |
| W2 | `/mg` shows Madagascar flag (white/red/green) | Browser | Manual |
| W3 | `/ke` shows Kenya flag | Browser | Manual |
| W4 | Default (root `/`) shows Mauritius flag | Browser | Manual |

---

## X. Sidebar Scrollbar & Styling

**File:** `components/dashboard/DashboardSidebar.tsx`, `app/globals.css`

| # | Test | Type | Status |
|---|------|------|--------|
| X1 | Sidebar scrollbar is hidden (scrollbar-hidden CSS) | Browser | Manual |
| X2 | Desktop sidebar has white bg, rounded corners, margin spacing | Browser | Manual |
| X3 | Sidebar still scrollable despite hidden scrollbar | Browser | Manual |

---

## Additional Unit Test Coverage (cross-cutting)

| File | Tests | What it covers |
|------|-------|----------------|
| `lib/__tests__/api-response.test.ts` | 8 | API response helpers |
| `lib/__tests__/constants.test.ts` | 5 | App constants |
| `lib/__tests__/pagination.test.ts` | 11 | Pagination utilities |
| `lib/__tests__/rate-limit.test.ts` | 7 | Rate limiting |
| `lib/__tests__/csrf.test.ts` | 28 | CSRF protection |
| `lib/__tests__/sanitize.test.ts` | 57 | Input sanitization |
| `lib/services/__tests__/ai.test.ts` | 9 | AI health assistant |
| `lib/services/__tests__/ai-insights.test.ts` | 8 | AI insight extraction |
| `lib/validations/__tests__/api.test.ts` | 30 | API validation schemas |
| `lib/validations/__tests__/preferences.test.ts` | 7 | User preferences |
| `lib/dashboard/__tests__/getActiveSectionFromPath.test.ts` | 8 | Sidebar active section (incl. search routes) |
| `app/api/__tests__/connections.test.ts` | 21 | Social connections API (send, accept, reject, delete) |
| `app/api/__tests__/contact.test.ts` | 6 | Contact form API |
| `app/api/__tests__/conversations.test.ts` | 10 | Chat conversations API |
| `app/api/__tests__/insurance.test.ts` | 11 | Insurance API |
| `app/api/__tests__/prescriptions-create.test.ts` | 13 | Prescription creation |
| `app/api/__tests__/search.test.ts` | 15 | Unified search API |
| `app/api/__tests__/stats.test.ts` | 6 | Statistics API |
| `app/api/__tests__/users.test.ts` | 7 | User profile API |
| `app/api/__tests__/corporate.test.ts` | 9 | Corporate dashboard, employees, claims APIs |
| `app/api/__tests__/responder-apis.test.ts` | 8 | Responder booking-requests, calls, dashboard APIs |
| `app/api/__tests__/admin-extended.test.ts` | 10 | Admin metrics, alerts, commission-config, admins, required-documents |
| `components/__tests__/shared.test.tsx` | 12 | Shared UI components |

---

# MANUAL TEST SECTIONS

The following sections require manual testing as they involve complex UI interactions, real-time features, or multi-tab workflows.

## Messaging Flow (Cross-Role)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| M1 | Patient sends message | Login as patient > Messages > Find doctor > Send | Message appears |
| M2 | Doctor receives message | Login as doctor > Messages | Conversation visible |
| M3 | Doctor replies | Type reply > Send | Message appears |
| M4 | Patient sees reply | Login as patient > Messages | Reply visible |

## Video Call Flow (Cross-Role)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| V1 | Patient joins video room | Video Call > Select appointment > Join | Camera/mic requested |
| V2 | Doctor joins same room | In another tab, login as doctor > Join | Both connected |
| V3 | Screen sharing | Click screen share | Screen shared |
| V4 | End call | Click "End Call" | Both returned to dashboard |

## Pharmacy Order Flow (Cart + Checkout)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| PH1 | Browse medicines | /search/medicines | Catalog with search/filters |
| PH2 | Add to cart | Click "Add to Cart" | Cart shows items |
| PH3 | Place order | Checkout > Place Order | Order created, wallet debited |
| PH4 | Pharmacist sees order | Login as pharmacist > Orders | New order visible |
| PH5 | Status updates | Preparing > Delivering > Completed | Status reflected |

## Emergency Booking Interactive Flow

| # | Test | Steps | Expected |
|---|------|-------|----------|
| EB1 | Patient requests emergency | Login as patient > Emergency Services > Request | Emergency booking created |
| EB2 | Responder accepts | Login as responder > Booking Requests > Accept | Status: "Dispatched" |
| EB3 | Status transitions | dispatched > en_route > resolved | Status updates reflected |

## Referral Partner Flow

| # | Test | Steps | Expected |
|---|------|-------|----------|
| RP1 | Dashboard stats | Login as `sophie.leclerc@healthways.mu` / `Referral123!` | Referrals, earnings |
| RP2 | Referral code visible | Check dashboard/profile | Code displayed |
| RP3 | Track conversions | View "Recent Conversions" | Users who used referral code |

---

## Quick Start Manual Test Rounds

For quick verification after deployment, follow these numbered rounds:

### Round 1: Login
1. Open http://localhost:3000/login
2. Email: `sarah.johnson@healthwyz.mu`, Password: `Doctor123!`
3. Verify: redirected to /doctor/feed with wallet card

### Round 2: Booking Flow
1. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
2. Navigate to /search/doctors > Click "Book" on a doctor
3. Select In-Person > Pick weekday > Select 10:00 > Reason: "Checkup" > Confirm
4. Go to My Bookings > See "Pending" booking

### Round 3: Approval Flow
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Click "Booking Requests" > Accept the booking
3. Login as patient > Click bell > See "Booking Accepted" notification

### Round 4: Registration with OCR
1. Go to /signup > Select Doctor
2. Full Name: `Rajesh Kumar Doorgakant`
3. Upload all 4 required PDFs from `Test-Data/generated/`
4. Verify: Green "Verified" badges on all documents

### Round 5: Community
1. Login as doctor > My Posts > Create a post
2. Login as patient > /community > Comment + Like

### Round 6-30
See previous manual testing rounds for: Provider Reviews, Admin Role Config, Messaging, Video Calls, Insurance Claims, Emergency Booking, Referral UTM, Prescriptions, Commission System, Mobile Nav, Chat Scroll, AI Chat, Auth Redirects.

---

## Notes

- **Server memory**: Full Playwright suite (~140 tests) can exhaust dev server memory. Use `NODE_OPTIONS="--max-old-space-size=4096"` or run in batches of 2-3 spec files.
- **Wallet depletion**: Repeated API E2E runs deplete trial wallets. Booking tests may SKIP (not FAIL). Re-seed to reset.
- **Rate limiting**: Auth endpoints: 5 req/min/IP. API E2E script caches login sessions via `_loginCache`.
- **Slot conflicts**: Booking tests use dates +14 days. Re-seed if tests are re-run same day.
- **Insurance claim create**: Requires valid patient profile UUID. The API E2E test fetches it dynamically via `/api/patients/{id}`.
- **Seed data**: 23 seed files create demo data for all user types. Medicine IDs are `MED001`-`MED012`.
