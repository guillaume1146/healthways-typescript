# Oh My Dok - Healthcare Platform for Mauritius

A full-stack healthcare platform built with **Next.js 15**, **TypeScript**, **PostgreSQL**, **Socket.IO**, and **WebRTC**. It connects patients with doctors, nurses, nannies, pharmacists, lab technicians, and emergency responders through video consultations, appointment booking, prescription management, and more.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started with Docker Compose](#getting-started-with-docker-compose)
- [Getting Started without Docker](#getting-started-without-docker)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Video Call System](#video-call-system)
- [User Roles & Demo Accounts](#user-roles--demo-accounts)
- [Key Features](#key-features)

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  Next.js App Router (React 19) + Tailwind CSS                │
│                                                              │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ useAuth  │  │  useSocket   │  │      useWebRTC          │ │
│  │ (Zustand │  │  (Socket.IO  │  │  (simple-peer P2P       │ │
│  │  + API)  │  │   client)    │  │   video/audio/screen)   │ │
│  └──────────┘  └──────┬───────┘  └───────────┬─────────────┘ │
└────────────────────────┼─────────────────────┼───────────────┘
                    WebSocket              WebRTC P2P
                         │                     │
┌────────────────────────┼─────────────────────┼───────────────┐
│               Custom Node.js Server (server.js)              │
│                                                              │
│  ┌─────────────────────┴─────────────────────┐               │
│  │           Socket.IO Server                 │               │
│  │  - Room management                         │               │
│  │  - WebRTC signaling (offer/answer/ICE)     │               │
│  │  - Session persistence to PostgreSQL       │               │
│  │  - Reconnection grace period (2 min)       │               │
│  │  - Heartbeat monitoring (30s)              │               │
│  │  - Room cleanup (2h timeout)               │               │
│  └────────────────────────────────────────────┘               │
│  ┌────────────────────────────────────────────┐               │
│  │           Next.js HTTP Handler              │               │
│  │  - REST API routes (/api/...)               │               │
│  │  - JWT authentication (httpOnly cookies)    │               │
│  │  - Zod request validation                   │               │
│  │  - Per-page data fetching (Prisma select)   │               │
│  └────────────────────────────────────────────┘               │
└───────────────────────────┬──────────────────────────────────┘
                            │
                     Prisma ORM (TCP)
                            │
                 ┌──────────┴──────────┐
                 │    PostgreSQL 16     │
                 │                     │
                 │  Fully normalized   │
                 │  relational schema  │
                 │  (30+ tables)       │
                 │  No JSON columns    │
                 │  Proper FKs & JOINs │
                 └─────────────────────┘
```

**Key design decisions:**
- **Layered Architecture** — types (`lib/data/`, `types/`) → services (`lib/auth/`) → API routes (`app/api/`) → UI (`components/`, `app/*/dashboard/`). Separation of concerns throughout.
- **DRY components** — Video call, stat cards, and booking flows each exist as a single shared component. No duplicates.
- The dev server is `node server.js` (NOT `next dev`) — it wraps Next.js to co-host Socket.IO on the same port
- Login returns only profile data (`id`, `firstName`, `lastName`, `email`, `profileImage`, `userType`) — no bulk data loading
- Each page fetches its own data via dedicated API endpoints using the user ID from auth state
- Video call sessions are persisted to the database so calls survive server restarts
- Domain types are centralized in `lib/data/` — all components import from there

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15.4 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| State | Zustand, React hooks |
| Real-time | Socket.IO 4.8, WebRTC via simple-peer |
| Backend | Custom Node.js HTTP server + Next.js handler |
| Database | PostgreSQL 16 + Prisma 6.16 ORM |
| Auth | JWT (jsonwebtoken), bcrypt, httpOnly cookies |
| Validation | Zod |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts         # POST — authenticate, returns JWT cookie
│   │   │   ├── logout/route.ts        # POST — clear auth cookies
│   │   │   └── me/route.ts            # GET  — current user profile
│   │   ├── patients/[id]/
│   │   │   ├── route.ts               # GET  — patient profile
│   │   │   ├── appointments/route.ts  # GET  — paginated, filterable by status
│   │   │   ├── prescriptions/route.ts # GET  — with medicines via JOIN
│   │   │   ├── medical-records/route.ts
│   │   │   ├── vital-signs/route.ts   # GET  — latest or history
│   │   │   ├── pill-reminders/route.ts
│   │   │   ├── lab-tests/route.ts     # GET  — with results via JOIN
│   │   │   └── notifications/route.ts
│   │   ├── doctors/[id]/
│   │   │   ├── appointments/route.ts  # GET  — with patient info via JOIN
│   │   │   ├── patients/route.ts      # GET  — unique patients from appointments
│   │   │   ├── schedule/route.ts      # GET  — weekly time slots
│   │   │   └── notifications/route.ts
│   │   ├── webrtc/
│   │   │   ├── session/route.ts       # CRUD — video call session management
│   │   │   └── recovery/route.ts      # POST — session recovery after disconnect
│   │   ├── health/route.ts            # GET  — DB connectivity check
│   │   ├── config/route.ts            # GET  — app configuration
│   │   ├── upload/route.ts            # POST — file upload
│   │   └── video/room/route.ts        # POST/GET — video room management
│   ├── patient/                       # Patient pages
│   │   ├── dashboard/
│   │   ├── doctor-consultations/
│   │   ├── doctor-prescriptions/
│   │   ├── health-records/
│   │   ├── home-nursing/
│   │   ├── pharmacy/
│   │   ├── childcare/
│   │   ├── lab-tests/
│   │   ├── emergency/
│   │   ├── insurance/
│   │   ├── video-call/[roomId]/       # WebRTC video call page
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── error.tsx                  # Error boundary
│   │   └── loading.tsx                # Loading state
│   ├── doctor/                        # Doctor pages
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── consultations/
│   │   ├── patients/
│   │   ├── prescriptions/
│   │   ├── availability/
│   │   ├── video-call/[roomId]/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── admin/dashboard/               # Admin dashboard
│   ├── nurse/dashboard/               # Nurse dashboard
│   ├── nanny/dashboard/               # Nanny dashboard
│   ├── login/                         # Login page + auth utilities
│   │   ├── page.tsx
│   │   ├── types/auth.ts             # AuthUser interface
│   │   └── utils/auth.ts             # AuthService class
│   ├── error.tsx                      # Global error boundary
│   ├── loading.tsx                    # Global loading state
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Landing page
├── components/
│   ├── video/                         # Shared video call components (single source of truth)
│   │   ├── VideoCallRoom.tsx          # Video UI with PiP, controls, stream management
│   │   └── VideoConsultation.tsx      # Full consultation flow with session management
│   ├── home/                          # Landing page sections
│   ├── layout/                        # Navbar, Footer
│   ├── booking/                       # Booking flow (6 generic components)
│   ├── forms/                         # Contact, Login, Signup forms
│   ├── shared/                        # Reusable UI (DashboardStatCard, PageHeader, etc.)
│   │   ├── ProviderReviews.tsx        # Shared review/rating component for all provider types
│   └── ui/                            # Utility components
├── hooks/
│   ├── useAuth.ts                     # Auth state management
│   ├── useSocket.ts                   # Socket.IO with auto-reconnection
│   ├── useWebRTC.ts                   # WebRTC peer connections
│   └── useAppConfig.ts               # App config fetcher
├── lib/
│   ├── auth/
│   │   ├── jwt.ts                     # signToken() / verifyToken()
│   │   ├── cookies.ts                 # setAuthCookies() / clearAuthCookies()
│   │   ├── validate.ts               # validateRequest() for API routes
│   │   └── schemas.ts                # Zod schemas (loginSchema)
│   ├── data/                          # Domain model type definitions
│   │   ├── patients.ts               # Patient interface + related types
│   │   ├── doctors.ts                # Doctor interface + related types
│   │   ├── nurses.ts                 # Nurse interface
│   │   ├── nannies.ts                # Nanny interface
│   │   └── index.ts                  # Re-exports all types
│   ├── dashboard/
│   │   ├── createDashboardLayout.tsx  # Shared HOC for all 12 layouts
│   │   └── getActiveSectionFromPath.ts # Shared sidebar active section resolver
│   ├── db.ts                          # Prisma singleton
│   ├── db-utils.ts                    # getPatientDashboardSummary()
│   └── constants.ts                   # Static content (services, stats)
├── prisma/
│   ├── schema.prisma                  # 30+ normalized tables
│   ├── seed.ts                        # Entry point — calls all seeders
│   └── seeds/                         # Modular seed files
│       ├── 01-medicines.seed.ts
│       ├── 02-doctors.seed.ts
│       ├── 03-nurses.seed.ts
│       ├── 04-nannies.seed.ts
│       ├── 05-patients.seed.ts
│       ├── 06-clinical-data.seed.ts   # Records, prescriptions, vitals, lab tests
│       ├── 07-appointments.seed.ts
│       ├── 08-video-rooms.seed.ts     # Pre-created rooms with IDs
│       └── 09-supporting-data.seed.ts # Reminders, billing, notifications
├── types/
│   ├── index.ts                       # Shared UI component types
│   └── super-admin.ts                 # Admin management types
├── server.js                          # Custom server (Socket.IO + Next.js)
├── middleware.ts                      # Route protection by user type
├── docker-compose.yml                 # PostgreSQL + App
├── Dockerfile                         # Multi-stage production build
├── .env.example                       # Environment variable template
├── tailwind.config.ts                 # Brand colors & theme
└── package.json
```

---

## Getting Started with Docker Compose

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Build and start

```bash
docker compose up --build -d
```

This starts:
- **PostgreSQL 16** on port 5432 (with health checks)
- **Oh My Dok app** on port 3000 (maps to container port 8080)

### 2. Set up the database

```bash
# Create tables from the Prisma schema
docker compose exec app npx prisma db push

# Seed with demo data (5 patients, 3 doctors, 2 nurses, 2 nannies, medicines, appointments, video rooms, etc.)
docker compose exec app npx prisma db seed
```

### 3. Open the app

Go to **http://localhost:3000**

### Stop / Reset

```bash
docker compose down       # Stop containers
docker compose down -v    # Stop + delete database volume
```

---

## Getting Started without Docker

### Prerequisites
- Node.js 20+
- PostgreSQL running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
```

### 3. Set up database

```bash
npx prisma db push     # Create tables
npx prisma db seed      # Insert demo data
```

### 4. Run

```bash
npm run dev             # Development (node server.js on port 3000)
npm run build           # Production build (prisma generate + next build)
npm run start           # Production server
```

### Other commands

```bash
npx prisma studio       # Visual database browser at localhost:5555
npx prisma migrate dev  # Create a migration
npx eslint .            # Lint
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | `ohmydok-dev-secret...` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | App base URL | `http://localhost:3000` |
| `PORT` | Server port | `3000` |
| `SUPER_ADMIN_EMAIL` | Super admin email (auto-created on startup) | `hassan.doorgakant@ohmydok.com` |
| `SUPER_ADMIN_PASSWORD` | Super admin password | `Admin123!` |
| `PLATFORM_COMMISSION_RATE` | Platform fee % (fallback if DB config missing) | `5` |
| `REGIONAL_COMMISSION_RATE` | Regional admin fee % (fallback) | `10` |

---

## Database Schema

The database is **fully normalized** — no JSON columns. All data is stored in proper relational tables with foreign keys, indexes, and cascading deletes.

### Core Tables

| Table | Description | Key Relations |
|-------|-------------|---------------|
| `Patient` | Patient profiles | Has many: appointments, prescriptions, medical records, vital signs, lab tests |
| `Doctor` | Doctor profiles with credentials | Has many: appointments, prescriptions, education, certifications, schedule slots |
| `Nurse` | Nursing staff | Has many: nurse bookings |
| `Nanny` | Childcare professionals | Has many: childcare bookings |

### Clinical Tables

| Table | Description | Key Relations |
|-------|-------------|---------------|
| `Appointment` | Scheduled appointments | FK to Patient + Doctor, includes roomId for video calls |
| `Prescription` | Prescriptions | FK to Patient + Doctor |
| `PrescriptionMedicine` | Medicines in a prescription | FK to Prescription + Medicine (JOIN table) |
| `Medicine` | Medicine catalog | Referenced by prescriptions and orders |
| `MedicalRecord` | Consultation records | FK to Patient + Doctor |
| `VitalSigns` | BP, heart rate, temperature, etc. | FK to Patient, uses scalar fields (not JSON) |
| `LabTest` | Lab test orders | FK to Patient, has many LabTestResult |
| `LabTestResult` | Individual test parameters | FK to LabTest |

### Video Call Tables

| Table | Description | Key Relations |
|-------|-------------|---------------|
| `VideoRoom` | Pre-created rooms with unique codes | Links Doctor + Patient, has many sessions |
| `VideoCallSession` | Active/ended call sessions | FK to VideoRoom + Patient + Doctor |
| `WebRTCConnection` | Individual peer connections | FK to VideoCallSession, stores socket/ICE state |

### Messaging Tables

| Table | Description |
|-------|-------------|
| `Conversation` | Direct or group conversations |
| `ConversationParticipant` | Polymorphic: links to Patient/Doctor/Nurse/Nanny |
| `Message` | Chat messages with sender info |

### Supporting Tables

| Table | Description |
|-------|-------------|
| `PillReminder` | Medication reminders (FK to Prescription) |
| `NurseBooking` | Home nursing appointments (FK to Patient + Nurse) |
| `ChildcareBooking` | Nanny bookings (FK to Patient + Nanny) |
| `BillingInfo` | Payment methods (last 4 digits only) |
| `NutritionAnalysis` | Food/meal tracking |
| `Document` | Uploaded files/reports |
| `MedicineOrder` + `MedicineOrderItem` | Pharmacy orders |
| `Notification` | Push notifications |
| `ScheduleSlot` | Doctor weekly availability |
| `DoctorEducation`, `DoctorCertification`, `DoctorWorkHistory` | Doctor credentials |
| `PatientComment` | Doctor reviews |
| `PatientEmergencyContact` | Personal emergency contact |
| `EmergencyServiceContact` | Emergency services (ambulance, ER) |
| `ProviderReview` | Generic reviews for any provider type |
| `UserConnection` | Social connections between users (pending/accepted/rejected) |

### Configuration Tables

| Table | Description |
|-------|-------------|
| `PlatformConfig` | Commission rates (provider/regional/platform %), currency, trial wallet amount — singleton |
| `RoleFeatureConfig` | Admin-configurable feature visibility per user role |
| `RequiredDocumentConfig` | Admin-configurable required documents per user role |
| `ProviderReview` | Generic reviews for all provider types (rating, comment, response, helpful) |
| `InsuranceClaim` | Insurance claim lifecycle (pending → approved/rejected) |

---

## API Endpoints

All API routes (except `/api/auth/login`, `/api/health`, and `/api/config`) require a valid JWT in the `omd_token` httpOnly cookie.

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login with email + password + userType. Returns user profile + sets JWT cookie |
| POST | `/api/auth/logout` | Clears auth cookies |
| GET | `/api/auth/me` | Returns current user profile from JWT |

### Patient Data (all require patient auth)
| Method | Path | Query Params | Description |
|--------|------|-------------|-------------|
| GET | `/api/patients/[id]` | — | Patient profile |
| GET | `/api/patients/[id]/appointments` | `status`, `limit`, `offset` | Appointments with doctor details (JOIN) |
| GET | `/api/patients/[id]/prescriptions` | `active`, `limit`, `offset` | Prescriptions with medicines (JOIN) |
| GET | `/api/patients/[id]/medical-records` | `type`, `limit`, `offset` | Medical records with doctor (JOIN) |
| GET | `/api/patients/[id]/vital-signs` | `latest`, `limit` | Vital signs history |
| GET | `/api/patients/[id]/pill-reminders` | `active` | Active medication reminders |
| GET | `/api/patients/[id]/lab-tests` | `status`, `limit`, `offset` | Lab tests with results (JOIN) |
| GET | `/api/patients/[id]/notifications` | `unread` | Notifications |

### Doctor Data (all require doctor auth)
| Method | Path | Query Params | Description |
|--------|------|-------------|-------------|
| GET | `/api/doctors/[id]/appointments` | `status`, `limit`, `offset` | Appointments with patient details (JOIN) |
| GET | `/api/doctors/[id]/patients` | — | Unique patients from appointment history |
| GET | `/api/doctors/[id]/schedule` | — | Weekly time slots |
| GET | `/api/doctors/[id]/notifications` | `unread` | Notifications |

### System
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Database connectivity check |
| GET | `/api/config` | App name, tagline |

### Provider Reviews
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/providers/[id]/reviews` | Paginated reviews for any provider (public) |
| POST | `/api/providers/[id]/reviews` | Submit review (auth required) |
| PATCH | `/api/providers/[id]/reviews/[reviewId]` | Provider responds or mark helpful |

### Connections
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/connections` | List connections (filter by status, direction) |
| POST | `/api/connections` | Send connection request |
| PATCH | `/api/connections/[id]` | Accept or reject connection (receiver only) |
| DELETE | `/api/connections/[id]` | Remove connection |

### AI Support
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ai/support` | Chat with AI health assistant (Groq LLM, rate limited) |

### Insurance
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/insurance/claims` | List insurance claims (filter by status) |
| POST | `/api/insurance/claims` | Create new insurance claim |
| PATCH | `/api/insurance/claims/[id]` | Approve or reject claim |
| GET | `/api/insurance/[id]/dashboard` | Insurance rep dashboard stats |
| GET | `/api/patients/[id]/claims` | Patient's insurance claims |

### Emergency & Lab Tech
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/responders/[id]/calls` | Emergency worker call history |
| GET | `/api/lab-techs/[id]/results` | Lab technician test results |

### Corporate
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/corporate/[id]/dashboard` | Corporate admin stats (employees, claims, contributions) |
| GET | `/api/corporate/[id]/employees` | Employee list |
| GET | `/api/corporate/[id]/claims` | Corporate claims |

### Bookings
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/bookings/doctor` | Create doctor appointment |
| POST | `/api/bookings/nurse` | Create nurse booking |
| POST | `/api/bookings/nanny` | Create childcare booking |
| POST | `/api/bookings/lab-test` | Create lab test booking |
| POST | `/api/bookings/emergency` | Create emergency request (broadcasts to all workers) |
| POST | `/api/bookings/confirm` | Provider confirms booking, triggers payment with commission split |
| GET | `/api/bookings/available-slots` | Available time slots for a provider |

### Admin Configuration
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/role-config` | All role feature configs |
| PUT | `/api/admin/role-config` | Upsert role feature configs |
| GET | `/api/admin/required-documents` | All required document configs |
| PUT | `/api/admin/required-documents` | Upsert required document configs |
| GET | `/api/role-config/[userType]` | Public: enabled features for a role |
| GET | `/api/admin/commission-config` | Get platform commission configuration |
| PUT | `/api/admin/commission-config` | Update commission rates (super admin only) |
| GET | `/api/admin/platform-commission` | Commission earnings dashboard data |
| GET | `/api/admin/regional-activity` | Regional admin activity and stats |

---

## Authentication Flow

1. User submits email + password + userType on `/login`
2. `POST /api/auth/login` validates input with Zod, queries the database by userType
3. Password is verified with `bcrypt.compare()`
4. A JWT is generated (`lib/auth/jwt.ts`) containing `{ sub: userId, userType, email }`
5. The JWT is set as an **httpOnly cookie** (`omd_token`) — not accessible via JavaScript
6. Minimal user info (`id`, `firstName`, `lastName`, `email`, `profileImage`, `userType`) is stored in localStorage for UI display only
7. `middleware.ts` checks the `omd_userType` cookie and redirects unauthorized users
8. Every API route validates the JWT via `validateRequest()` before returning data
9. On logout, `POST /api/auth/logout` clears all cookies

**Security features:**
- JWT tokens with 7-day expiry
- httpOnly, Secure, SameSite=Lax cookies
- Zod validation on all inputs
- Patients can only access their own data (API enforces `auth.sub === id`)
- No passwords or tokens in localStorage
- No hardcoded credentials in source code

---

## Video Call System

The video call system is designed to be **resilient to network interruptions, connection resets, and server restarts**.

### Architecture

```
Patient Browser ──── WebRTC P2P ──── Doctor Browser
       │                                     │
       └──── Socket.IO (signaling) ──────────┘
                       │
              ┌────────┴────────┐
              │  server.js      │
              │  - Room state   │
              │  - Heartbeats   │
              │  - DB persist   │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              │  PostgreSQL     │
              │  - VideoRoom    │
              │  - Session      │
              │  - Connection   │
              └─────────────────┘
```

### How it works

1. **Room creation**: Video rooms are pre-created in the database (`VideoRoom` table) with a unique `roomCode` (e.g., `ROOM-DOC001-PAT001`). The room ID is stored on the `Appointment` record.

2. **Joining**: Both patient and doctor dashboards use the **same shared component** (`components/video/VideoConsultation.tsx`) — there is only ONE video call component in the entire codebase. The `useSocket` hook connects to Socket.IO and the `useWebRTC` hook handles peer connections.

3. **Signaling**: SDP offers, answers, and ICE candidates are relayed through Socket.IO between peers.

4. **P2P connection**: Once signaling is complete, video/audio streams flow directly between browsers (no server relay).

### Resilience features

| Scenario | Handling |
|----------|----------|
| **Network glitch** | ICE restart with exponential backoff (up to 10 attempts) |
| **Socket disconnection** | Auto-reconnection (infinite retries, 1-5s backoff). Room state preserved in `sessionStorage`. Auto-rejoin on reconnect |
| **Peer disconnects temporarily** | 2-minute grace period before removing from room. Peers see "reconnecting" status |
| **Server restart** | Sessions are persisted to PostgreSQL (`VideoCallSession` + `WebRTCConnection`). On reconnect, client requests recovery from DB |
| **ICE failure** | Automatic ICE restart via `createOffer({ iceRestart: true })`. Falls back to new peer creation if restart fails |
| **Browser tab close** | `leave-room` event sent, peer cleaned up immediately |
| **SDP negotiation race** | Perfect Negotiation pattern: polite/impolite roles based on user ID ordering |
| **Signaling errors** | Benign SDP errors (`setRemoteDescription`, `Called in wrong state`) are swallowed |

### Connection health monitoring

- `useWebRTC` checks ICE and connection state every 5 seconds
- `useSocket` sends heartbeat every 30 seconds
- Server times out sockets after 90 seconds of no heartbeat
- Rooms are cleaned up after 2 hours of inactivity

---

## User Roles & Demo Accounts

After running `npx prisma db seed`, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Patient | emma.johnson@ohmydok.com | Patient123! |
| Patient | jean.pierre@ohmydok.com | Patient123! |
| Patient | aisha.khan@ohmydok.com | Patient123! |
| Patient | vikash.d@ohmydok.com | Patient123! |
| Patient | nadia.s@ohmydok.com | Patient123! |
| Doctor | sarah.johnson@ohmydok.com | Doctor123! |
| Doctor | raj.patel@ohmydok.com | Doctor123! |
| Doctor | marie.dupont@ohmydok.com | Doctor123! |
| Nurse | priya.ramgoolam@ohmydok.com | Nurse123! |
| Nurse | sophie.laurent@ohmydok.com | Nurse123! |
| Nanny | anita.beeharry@ohmydok.com | Nanny123! |
| Nanny | claire.morel@ohmydok.com | Nanny123! |
| Pharmacist | rajesh.doorgakant@ohmydok.com | Pharma123! |
| Pharmacist | anushka.doobur@ohmydok.com | Pharma123! |
| Lab Technician | david.ahkee@ohmydok.com | Lab123! |
| Lab Technician | priya.doorgakant@ohmydok.com | Lab123! |
| Emergency Worker | jeanmarc.lafleur@ohmydok.com | Emergency123! |
| Emergency Worker | fatima.joomun@ohmydok.com | Emergency123! |
| Insurance Rep | vikram.doorgakant@ohmydok.com | Insurance123! |
| Insurance Rep | marie.genave@ohmydok.com | Insurance123! |
| Corporate Admin | anil.doobur@ohmydok.com | Corporate123! |
| Referral Partner | sophie.leclerc@ohmydok.com | Referral123! |
| Regional Admin (MU) | vikash.doorgakant@ohmydok.com | Regional123! |
| Regional Admin (MG) | tiana.rasoa@ohmydok.com | Regional123! |
| Regional Admin (KE) | james.mwangi@ohmydok.com | Regional123! |
| Super Admin | hassan.doorgakant@ohmydok.com | Admin123! |

All passwords are hashed with bcrypt in the database.

### Pre-created Video Rooms

| Room Code | Participants |
|-----------|-------------|
| ROOM-DOC001-PAT001 | Dr. Johnson + Emma Johnson |
| ROOM-DOC003-PAT004 | Dr. Dupont + Vikash Doorgakant |
| ROOM-DOC001-PAT005 | Dr. Johnson + Nadia Soobramanien |
| ROOM-DOC002-PAT002 | Dr. Patel + Jean Pierre |
| ROOM-DOC002-PAT003 | Dr. Patel + Aisha Khan |

---

## Key Features

- **Video consultations** — WebRTC P2P with resilient reconnection, screen sharing, in-call chat
- **Appointment booking** — Schedule with doctors, nurses, nannies
- **Prescription management** — Active prescriptions with medicine details via JOINs, refill tracking, pill reminders
- **Medical records** — Consultation history, lab results with individual parameters
- **Vital signs monitoring** — Proper scalar fields (systolicBP, diastolicBP, heartRate, etc.)
- **Lab tests** — Tests with individual result parameters, reference ranges, abnormal flags
- **Nutrition tracking** — Food logging with calorie/macro analysis
- **Emergency services** — Contact emergency responders
- **Multi-role dashboards** — Patient, Doctor, Nurse, Nanny, Admin
- **Per-page data loading** — Each page fetches only what it needs via dedicated API endpoints
- **Pagination** — All list endpoints support `limit` and `offset`
- **Provider reviews** — Generic review/rating system for all provider types (doctors, nurses, nannies, pharmacists, lab techs, emergency workers) via unified `/api/providers/{id}/reviews` API
- **Admin role configuration** — Super admin can toggle feature visibility per user role from the Role Config page, stored in database (`RoleFeatureConfig`)
- **Required documents config** — Super admin can configure which documents are required during registration per role (`RequiredDocumentConfig`)
- **Unified dashboard architecture** — All 12 user type dashboards use a shared `createDashboardLayout` HOC and `createGetActiveSectionFromPath` utility, eliminating code duplication
- **Insurance claims** — Full create/approve/reject flow with `InsuranceClaim` model
- **Wallet system** — Trial credits (Rs 4,500) for all users, debit on booking acceptance, credit for providers
- **Commission system** — Automatic revenue split: 85% provider, 10% regional admin, 5% platform. Rates stored in `PlatformConfig` table and configurable via super admin UI
- **Regional admin model** — Regional admins install the platform in their region, manage CMS content, and earn commission on all transactions. Super admin (env vars) validates regional admin accounts
- **Referral tracking** — Referral codes tracked at signup, referrer gets commission credits
- **Emergency dispatch** — Broadcast-based emergency booking with responder accept/dispatch/en-route/resolved flow
- **AI health assistant** — Groq-powered LLM with dietary tracking, date-aware insight extraction (Llama 3.1)
- **AI support chat** — Public AI-powered health Q&A at `/search/ai` via Groq API (no login required)
- **Social connections** — LinkedIn/Facebook-style Connect + Message buttons on all search result cards, with `UserConnection` model (pending/accepted/rejected)
- **Unified booking UI** — Shared `BookingForm` component with time-slot grid for all 5 provider types (doctor, nurse, nanny, lab-test, emergency)
- **Collapsible sidebar** — Icon-only mode on desktop when collapsed, with tooltips and notification dots
- **Billing in settings** — Shared `BillingSettingsTab` available in all 11 user type settings pages
- **i18n** — English, French, and Mauritian Creole with language switcher
- **PWA** — Service worker + manifest for mobile app-like experience
- **Responsive mobile nav** — Service icons in 4-column grid on mobile, expandable categories on tablet+
- **ERD diagram** — Auto-generated entity relationship diagram at `docs/erd.svg` via prisma-erd-generator
