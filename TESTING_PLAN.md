# Healthwyz UI Testing Plan

This document provides a comprehensive manual testing checklist for verifying all features across the Healthwyz platform. Follow each section sequentially.

## Prerequisites

```bash
# 1. Push schema and seed data
npx prisma db push --accept-data-loss
npx prisma db seed

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000
```

### Seeded Login Credentials

**IMPORTANT:** Each user type has its own password format: `{Role}123!`

| User Type | Email | Password | Dashboard URL |
|-----------|-------|----------|--------------|
| Patient | emma.johnson@healthwyz.mu | Patient123! | /patient/dashboard |
| Patient | jean.pierre@healthwyz.mu | Patient123! | /patient/dashboard |
| Patient | aisha.khan@healthwyz.mu | Patient123! | /patient/dashboard |
| Patient | vikash.d@healthwyz.mu | Patient123! | /patient/dashboard |
| Patient | nadia.s@healthwyz.mu | Patient123! | /patient/dashboard |
| Doctor | sarah.johnson@healthwyz.mu | Doctor123! | /doctor/dashboard |
| Doctor | raj.patel@healthwyz.mu | Doctor123! | /doctor/dashboard |
| Doctor | marie.dupont@healthwyz.mu | Doctor123! | /doctor/dashboard |
| Nurse | priya.ramgoolam@healthwyz.mu | Nurse123! | /nurse/dashboard |
| Nurse | sophie.laurent@healthwyz.mu | Nurse123! | /nurse/dashboard |
| Nanny | anita.beeharry@healthwyz.mu | Nanny123! | /nanny/dashboard |
| Nanny | claire.morel@healthwyz.mu | Nanny123! | /nanny/dashboard |
| Pharmacist | rajesh.doorgakant@healthways.mu | Pharma123! | /pharmacist/dashboard |
| Pharmacist | anushka.doobur@healthways.mu | Pharma123! | /pharmacist/dashboard |
| Lab Tech | david.ahkee@healthways.mu | Lab123! | /lab-technician/dashboard |
| Lab Tech | priya.doorgakant@healthways.mu | Lab123! | /lab-technician/dashboard |
| Emergency | jeanmarc.lafleur@healthways.mu | Emergency123! | /responder/dashboard |
| Emergency | fatima.joomun@healthways.mu | Emergency123! | /responder/dashboard |
| Insurance | vikram.doorgakant@healthways.mu | Insurance123! | /insurance/dashboard |
| Insurance | marie.genave@healthways.mu | Insurance123! | /insurance/dashboard |
| Corporate | anil.doobur@healthways.mu | Corporate123! | /corporate/dashboard |
| Referral | sophie.leclerc@healthways.mu | Referral123! | /referral-partner/dashboard |
| Super Admin | hassan.doorgakant@healthways.mu | Admin123! | /super-admin/dashboard |

---

## A. Registration Flow (with OCR Document Upload)

### Test Data Files

Test documents are in `Test-Data/generated/`. Run `node Test-Data/generate-test-docs.js` first if the folder is empty.

Three test personas are available for OCR-verified registration:

#### Persona 1: Doctor Registration
- **Full Name on form:** `Rajesh Kumar Doorgakant`
- **Email:** any new email (e.g., `rajesh.test@email.com`)
- **Password:** any (e.g., `Test1234!`)
- **User Type:** Doctor
- **National ID upload:** `Test-Data/generated/national-id-rajesh-kumar-doorgakant.pdf`
- **Proof of Residence upload:** `Test-Data/generated/proof-of-residence-rajesh-kumar-doorgakant.pdf`
- **Professional License upload:** `Test-Data/generated/professional-license-rajesh-kumar-doorgakant.pdf`
- **Expected result:** OCR reads "Rajesh Kumar Doorgakant" from PDFs, matches the name on the form. Green "Verified" badge on documents.

#### Persona 2: Nurse Registration
- **Full Name on form:** `Priya Devi Ramsewak`
- **Email:** any new email (e.g., `priya.test@email.com`)
- **Password:** any (e.g., `Test1234!`)
- **User Type:** Nurse
- **National ID upload:** `Test-Data/generated/national-id-priya-devi-ramsewak.pdf`
- **Proof of Residence upload:** `Test-Data/generated/proof-of-residence-priya-devi-ramsewak.pdf`
- **Professional License upload:** `Test-Data/generated/professional-license-priya-devi-ramsewak.pdf`
- **Expected result:** Name matches, verified status

#### Persona 3: Pharmacist Registration
- **Full Name on form:** `Jean-Pierre Lafleur`
- **Email:** any new email (e.g., `jeanpierre.test@email.com`)
- **Password:** any (e.g., `Test1234!`)
- **User Type:** Pharmacist
- **National ID upload:** `Test-Data/generated/national-id-jean-pierre-lafleur.pdf`
- **Proof of Residence upload:** `Test-Data/generated/proof-of-residence-jean-pierre-lafleur.pdf`
- **Professional License upload:** `Test-Data/generated/professional-license-jean-pierre-lafleur.pdf`
- **Expected result:** Name matches, verified status

#### OCR Failure Test
- **Full Name on form:** `John Smith` (a name that does NOT appear in any test document)
- **Upload any of the test PDFs above** (they contain "Rajesh Kumar Doorgakant", etc.)
- **Expected result:** OCR reads a different name, shows Yellow "Manual review" badge

| # | Test | Steps | Expected |
|---|------|-------|----------|
| A1 | Doctor registration | /signup > Select Doctor > Full Name: `Rajesh Kumar Doorgakant` > Email: `rajesh.test@email.com` > Password: `Test1234!` > Upload the 3 PDFs listed above > Submit | Success message, documents show "Verified" badge, redirect to /login |
| A2 | Nurse registration | /signup > Select Nurse > Full Name: `Priya Devi Ramsewak` > Upload the 3 corresponding PDFs > Submit | Success, "Verified" on documents |
| A3 | OCR failure test | /signup > Select Doctor > Full Name: `John Smith` > Upload `national-id-rajesh-kumar-doorgakant.pdf` | Yellow "Manual review" badge (name mismatch) |
| A4 | Trial wallet created | After registration, login with the new account | Wallet card shows Rs 4,500 balance |
| A5 | Duplicate email | Try registering with `emma.johnson@healthwyz.mu` (already exists) | Error: "An account with this email already exists" |
| A6 | Password mismatch | Enter different passwords in password and confirm fields | Form validation prevents proceeding |

## B. Login & Auth

| # | Test | Steps | Expected |
|---|------|-------|----------|
| B1 | Patient login | /login > Email: `emma.johnson@healthwyz.mu` > Password: `Patient123!` > Select "Patient" | Redirected to /patient/dashboard |
| B2 | Doctor login | /login > Email: `sarah.johnson@healthwyz.mu` > Password: `Doctor123!` > Select "Doctor" | Redirected to /doctor/dashboard |
| B3 | Wrong password | /login > Email: `sarah.johnson@healthwyz.mu` > Password: `wrongpassword` | Error: "Invalid credentials" |
| B4 | Wrong user type | /login > Email: `emma.johnson@healthwyz.mu` > Password: `Patient123!` > Select "Doctor" | Error: "Invalid credentials" |
| B5 | Session persistence | Login, close tab, reopen dashboard URL | Still authenticated |
| B6 | Logout | Click Logout button in dashboard header | Redirected to /login |

## C. Trial Balance System

| # | Test | Steps | Expected |
|---|------|-------|----------|
| C1 | Patient balance | Login as `emma.johnson@healthwyz.mu` / `Patient123!` | WalletBalanceCard visible on dashboard |
| C2 | Doctor balance | Login as `sarah.johnson@healthwyz.mu` / `Doctor123!` | Wallet card visible with balance |
| C3 | Pharmacist balance | Login as `rajesh.doorgakant@healthways.mu` / `Pharma123!` | Balance Rs 4,500 |
| C4 | Transaction history | Click "View Transaction History" on wallet card | Shows list of past transactions |
| C5 | Payment form notice | Go to Settings > Billing/Payment | Blue info banner: "All payments are currently simulated using your trial credits" |

## D. Doctor Posts & Community

| # | Test | Steps | Expected |
|---|------|-------|----------|
| D1 | Community page | Navigate to /community | Feed page with health posts from doctors |
| D2 | Doctor creates post | Login as `sarah.johnson@healthwyz.mu` / `Doctor123!` > Go to /doctor/dashboard/posts > Fill title, content, category > Submit | Post appears in "My Posts" |
| D3 | Patient comments | Login as `emma.johnson@healthwyz.mu` / `Patient123!` > /community > Click comment icon > Write comment > Submit | Comment appears with "Patient" badge |
| D4 | Like a post | Click heart icon on a post | Heart turns red, count increments |
| D5 | Unlike a post | Click heart again | Heart turns gray, count decrements |
| D6 | Category filter | Click "Health Tips" tab | Only health_tips posts shown |

## E. Patient Dashboard

| # | Test | Steps | Expected |
|---|------|-------|----------|
| E1 | Overview loads | Login as `emma.johnson@healthwyz.mu` / `Patient123!` | Dashboard with health score, wallet, stats |
| E2 | Bookings page | Click "My Bookings" in sidebar | Bookings list page with filter tabs (All, Pending, Upcoming, Past) |
| E3 | Doctor consultations | Click "Doctor Consultations" | Shows consultations or "Book Your First Consultation" button that links to /search/doctors |
| E4 | Prescriptions | Click "Prescriptions" | Lists prescriptions. "Consult Doctor" button links to /search/doctors |
| E5 | Health records | Click "Health Records" | Shows records. "Request Medical Records" button links to /search/doctors |
| E6 | Lab results | Click "Lab Results" | Shows lab test results |
| E7 | Settings > Profile | Click "Settings" > Profile tab | Current name, email, phone pre-populated from database. Edit and save works. |
| E8 | Video call | Click "Video Call" | Video consultation interface |
| E9 | Messages | Click "Messages" | Chat interface with conversations |

## F. Booking Flow (End-to-End)

### User Story: Patient Books a Doctor Appointment

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `emma.johnson@healthwyz.mu` / `Patient123!` | Patient dashboard loads |
| 2 | Navigate to /search/doctors | Doctor search page shows list of doctors |
| 3 | Click "Book" on Dr. Sarah Johnson | Redirected to booking form at /patient/dashboard/book/doctor/{id} |
| 4 | Step 1: Select consultation type (In-Person, Home Visit, or Video) | Type selected, price updates |
| 5 | Step 2: Select a date (any weekday Mon-Fri) | Available time slots appear (09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00) |
| 6 | Select a time slot (e.g., 10:00) | Slot highlighted in blue |
| 7 | Enter reason: "Routine checkup" | Reason filled |
| 8 | Step 3: Review booking summary | Shows doctor name, date, time, fee |
| 9 | Click "Confirm Booking" | Booking created with "Pending" status, ticket displayed |
| 10 | Go to "My Bookings" in sidebar | New booking appears with "Pending" badge |

### User Story: Doctor Accepts Booking

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `sarah.johnson@healthwyz.mu` / `Doctor123!` | Doctor dashboard loads |
| 2 | Click "Booking Requests" in sidebar | Shows pending booking from the patient |
| 3 | Click "Accept" on the booking | Booking status changes to "Upcoming", patient's wallet is debited |
| 4 | Login as patient again | Notification bell shows new notification: "Booking Accepted" |
| 5 | Click bell icon | Notification dropdown shows "Your doctor booking has been accepted" |
| 6 | Go to "My Bookings" | Booking now shows "Upcoming" badge |

### User Story: Doctor Denies Booking

| Step | Action | Expected |
|------|--------|----------|
| 1 | Patient books another appointment (repeat steps above) | New pending booking |
| 2 | Login as doctor, go to Booking Requests | See the new pending booking |
| 3 | Click "Deny" | Booking status becomes "Cancelled" |
| 4 | Login as patient | Notification: "Your doctor booking has been declined" |
| 5 | Go to "My Bookings" > Past tab | Cancelled booking visible |

### User Story: Book a Nurse

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as patient, navigate to /search/nurses | Nurse list appears |
| 2 | Click "Book" on a nurse | Booking form loads |
| 3 | Select In-Person (Rs 500), pick a weekday, select slot, enter reason | Form filled |
| 4 | Confirm booking | Pending booking created |

### User Story: Book a Lab Test

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as patient, navigate to /search/lab | Lab test catalog appears |
| 2 | Click "Book" on a test | Lab test booking form loads |
| 3 | Select date, select slot | Available slots shown |
| 4 | Confirm booking | Pending lab test booking created |

## G. Provider Availability Configuration

| # | Test | Steps | Expected |
|---|------|-------|----------|
| G1 | Doctor availability | Login as `sarah.johnson@healthwyz.mu` / `Doctor123!` > Settings > Availability tab | Shows 7-day grid. Mon-Fri pre-populated with 09:00-17:00 slots |
| G2 | Edit availability | Toggle Saturday on, add 09:00-12:00 slot > Save | Success. Saturday now available for booking |
| G3 | Remove a day | Toggle Wednesday off > Save | Wednesday removed. Patient cannot book on Wednesdays |
| G4 | Nurse availability | Login as `priya.ramgoolam@healthwyz.mu` / `Nurse123!` > Settings > Availability | Same grid, same defaults |
| G5 | Nanny availability | Login as `anita.beeharry@healthwyz.mu` / `Nanny123!` > Settings > Availability | Same grid |

## H. Doctor Dashboard

| # | Test | Steps | Expected |
|---|------|-------|----------|
| H1 | Overview loads | Login as `sarah.johnson@healthwyz.mu` / `Doctor123!` | Dashboard with earnings, appointments, wallet |
| H2 | Booking Requests | Click "Booking Requests" | Shows pending booking requests with Accept/Deny buttons |
| H3 | Patients | Click "Patients" | Patient list |
| H4 | My Posts | Click "My Posts" | Post creation + own posts list |
| H5 | Settings | Click Settings gear icon | Profile, Security, Availability, Notifications tabs |

## I. Other User Types

| # | Test | Email | Password | Expected |
|---|------|-------|----------|----------|
| I1 | Nurse | priya.ramgoolam@healthwyz.mu | Nurse123! | Dashboard loads, Booking Requests in sidebar |
| I2 | Nanny | anita.beeharry@healthwyz.mu | Nanny123! | Dashboard loads, Booking Requests in sidebar |
| I3 | Pharmacist | rajesh.doorgakant@healthways.mu | Pharma123! | Dashboard with medicine inventory |
| I4 | Lab Tech | david.ahkee@healthways.mu | Lab123! | Dashboard, Booking Requests in sidebar |
| I5 | Emergency | jeanmarc.lafleur@healthways.mu | Emergency123! | Dashboard, Booking Requests in sidebar |
| I6 | Insurance | vikram.doorgakant@healthways.mu | Insurance123! | Dashboard loads |
| I7 | Corporate | anil.doobur@healthways.mu | Corporate123! | Dashboard loads |
| I8 | Referral | sophie.leclerc@healthways.mu | Referral123! | Dashboard loads |
| I9 | Super Admin | hassan.doorgakant@healthways.mu | Admin123! | Admin dashboard |

## J. Notification System

| # | Test | Steps | Expected |
|---|------|-------|----------|
| J1 | Bell icon | Click bell icon in any dashboard | Notification dropdown opens |
| J2 | Mark all read | Click "Mark all read" in dropdown | Blue dots disappear, all notifications marked as read |
| J3 | Real-time toast | While logged in as patient, have doctor accept a booking in another tab | Toast notification appears in top-right corner |
| J4 | Booking notification | Doctor accepts patient booking | Patient sees "Booking Accepted" notification |
| J5 | Denial notification | Doctor denies patient booking | Patient sees "Booking Declined" notification |

## K. Medicine Purchase Flow (End-to-End)

### User Story 1: Pharmacist Adds Medicines

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `rajesh.doorgakant@healthways.mu` / `Pharma123!` | Pharmacist dashboard loads |
| 2 | Click "Inventory" in sidebar | Medicine list with Qty column |
| 3 | Click "Add Medicine" | Modal form opens |
| 4 | Fill: Name=`Test Vitamin C`, Category=`Vitamins`, Dosage=`Tablet`, Strength=`1000mg`, Price=`35`, Quantity=`50`, Description=`Vitamin C supplement` | Form accepts all values |
| 5 | Click Save | Medicine appears with Qty=50 |

### User Story 2: Patient Purchases Medicines

| Step | Action | Expected |
|------|--------|----------|
| 1 | Login as `emma.johnson@healthwyz.mu` / `Patient123!` | Patient dashboard |
| 2 | Navigate to /search/medicines | Medicine catalog loads |
| 3 | Click "Add to Cart" on Paracetamol (Rs 45) | Cart appears with 1 item |
| 4 | Click "Add to Cart" on Ibuprofen (Rs 85) | Cart shows 2 items |
| 5 | Click cart icon to expand | Items, quantities, totals visible |
| 6 | Click "Checkout" | Navigates to /patient/pharmacy/order/cart |
| 7 | Click "Place Order" | Success with order ID, new wallet balance |

## L. Mobile Responsive Testing

Use Chrome DevTools > Toggle Device Toolbar (Ctrl+Shift+M)

| # | Test | Device/Width | Expected |
|---|------|-------------|----------|
| L1 | Landing page | 375px (iPhone SE) | No horizontal scroll, text readable |
| L2 | Dashboard | 375px | Sidebar hidden, hamburger visible |
| L3 | Settings | 375px | Tab navigation scrollable horizontally |
| L4 | /search/medicines | 375px | Cards stack vertically |
| L5 | /community | 375px | Posts readable |
| L6 | Booking form | 375px | Full width inputs, slot grid wraps |

## M. Edge Cases

| # | Test | Steps | Expected |
|---|------|-------|----------|
| M1 | Empty bookings | Login as new patient (no bookings) | Empty state with "Find a Provider" link |
| M2 | Double submit | Click booking confirm twice rapidly | Only one booking created (button disabled) |
| M3 | Expired session | Clear cookies, refresh dashboard | Redirected to /login |
| M4 | Weekend booking | Select a Saturday or Sunday in booking form | "No available slots" (default availability is Mon-Fri only) |
| M5 | Insufficient balance | Book expensive services until wallet runs out | Error: "Insufficient balance" on acceptance |

---

## Quick Start Test Sequence

```bash
# 1. Reset and seed
npx prisma db push --accept-data-loss
npx prisma db seed
npm run dev
```

### Round 1: Login Test
1. Open http://localhost:3000/login
2. Email: `sarah.johnson@healthwyz.mu`, Password: `Doctor123!`, Select: Doctor
3. Verify: redirected to /doctor/dashboard with wallet card

### Round 2: Booking Flow
1. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
2. Navigate to /search/doctors > Click "Book" on a doctor
3. Select In-Person > Pick a weekday > Select 10:00 slot > Reason: "Checkup" > Confirm
4. Go to My Bookings > See "Pending" booking

### Round 3: Approval Flow
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Click "Booking Requests" > Accept the booking
3. Login as patient > Click bell icon > See "Booking Accepted" notification

### Round 4: Registration with OCR
1. Go to /signup > Select Doctor
2. Full Name: `Rajesh Kumar Doorgakant`
3. Upload: `Test-Data/generated/national-id-rajesh-kumar-doorgakant.pdf`
4. Upload: `Test-Data/generated/proof-of-residence-rajesh-kumar-doorgakant.pdf`
5. Upload: `Test-Data/generated/professional-license-rajesh-kumar-doorgakant.pdf`
6. Verify: Green "Verified" badges on documents

### Round 5: Community
1. Login as doctor > My Posts > Create a post
2. Login as patient > /community > Comment on the post > Like it
