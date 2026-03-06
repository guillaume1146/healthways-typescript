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

Test documents are in `Test-Data/generated/`. Run `node Test-Data/generate-test-docs.js` first if the folder is empty. This generates **57 PDFs** — one per document type per persona, covering all 11 user types.

**File naming:** `{document-id}-{slugified-name}.pdf` — the document ID matches the upload slot in the UI.

---

#### Persona 1: Patient Registration
- **Full Name:** `Aisha Fatima Doobur`
- **Email:** `aisha.test@email.com` | **Password:** `Test1234!`
- **User Type:** Patient (2 required, 2 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-aisha-fatima-doobur.pdf` | Yes |
| Health Insurance Card | `insurance-card-aisha-fatima-doobur.pdf` | No |
| Proof of Address | `proof-address-aisha-fatima-doobur.pdf` | Yes |
| Medical History Document | `medical-history-aisha-fatima-doobur.pdf` | No |

---

#### Persona 2: Doctor Registration
- **Full Name:** `Rajesh Kumar Doorgakant`
- **Email:** `rajesh.test@email.com` | **Password:** `Test1234!`
- **User Type:** Doctor (4 required, 1 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-rajesh-kumar-doorgakant.pdf` | Yes |
| Medical Degree | `medical-degree-rajesh-kumar-doorgakant.pdf` | Yes |
| Professional License | `medical-license-rajesh-kumar-doorgakant.pdf` | Yes |
| Registration Certificate | `registration-cert-rajesh-kumar-doorgakant.pdf` | Yes |
| Work Certificate | `work-certificate-rajesh-kumar-doorgakant.pdf` | No |

---

#### Persona 3: Nurse Registration
- **Full Name:** `Priya Devi Ramsewak`
- **Email:** `priya.test@email.com` | **Password:** `Test1234!`
- **User Type:** Nurse (5 required)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-priya-devi-ramsewak.pdf` | Yes |
| Nursing Degree/Diploma | `nursing-degree-priya-devi-ramsewak.pdf` | Yes |
| Professional License | `nursing-license-priya-devi-ramsewak.pdf` | Yes |
| Registration Certificate | `registration-cert-priya-devi-ramsewak.pdf` | Yes |
| Work Certificate | `work-certificate-priya-devi-ramsewak.pdf` | Yes |

---

#### Persona 4: Nanny Registration
- **Full Name:** `Marie-Claire Montagne`
- **Email:** `marie.test@email.com` | **Password:** `Test1234!`
- **User Type:** Nanny (2 required, 2 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-marie-claire-montagne.pdf` | Yes |
| Police Clearance Certificate | `police-clearance-marie-claire-montagne.pdf` | Yes |
| Childcare Training Certificate | `childcare-cert-marie-claire-montagne.pdf` | No |
| Employment References | `employment-refs-marie-claire-montagne.pdf` | No |

---

#### Persona 5: Pharmacist Registration
- **Full Name:** `Jean-Pierre Lafleur`
- **Email:** `jeanpierre.test@email.com` | **Password:** `Test1234!`
- **User Type:** Pharmacist (5 required)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-jean-pierre-lafleur.pdf` | Yes |
| Pharmacy Degree | `pharmacy-degree-jean-pierre-lafleur.pdf` | Yes |
| Professional License | `pharmacy-license-jean-pierre-lafleur.pdf` | Yes |
| Registration Certificate | `registration-cert-jean-pierre-lafleur.pdf` | Yes |
| Pharmacy Affiliation Proof | `pharmacy-affiliation-jean-pierre-lafleur.pdf` | Yes |

---

#### Persona 6: Lab Technician Registration
- **Full Name:** `David Sooben Ahkee`
- **Email:** `david.test@email.com` | **Password:** `Test1234!`
- **User Type:** Lab Technician (5 required)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-david-sooben-ahkee.pdf` | Yes |
| Laboratory Science Degree | `lab-degree-david-sooben-ahkee.pdf` | Yes |
| Professional License | `lab-license-david-sooben-ahkee.pdf` | Yes |
| Laboratory Accreditation | `lab-accreditation-david-sooben-ahkee.pdf` | Yes |
| Proof of Employment | `employment-proof-david-sooben-ahkee.pdf` | Yes |

---

#### Persona 7: Emergency Worker Registration
- **Full Name:** `Jean-Marc Lavoix`
- **Email:** `jeanmarc.test@email.com` | **Password:** `Test1234!`
- **User Type:** Emergency Worker (4 required, 1 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-jean-marc-lavoix.pdf` | Yes |
| EMT/Paramedic Certification | `emt-cert-jean-marc-lavoix.pdf` | Yes |
| Professional License | `professional-license-jean-marc-lavoix.pdf` | No |
| First Aid/ALS Certification | `first-aid-cert-jean-marc-lavoix.pdf` | Yes |
| Proof of Employment | `employment-proof-jean-marc-lavoix.pdf` | Yes |

---

#### Persona 8: Insurance Rep Registration
- **Full Name:** `Vikram Kumar Doorgakant`
- **Email:** `vikram.test@email.com` | **Password:** `Test1234!`
- **User Type:** Insurance Rep (3 required, 2 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-vikram-kumar-doorgakant.pdf` | Yes |
| Proof of Employment | `employment-proof-vikram-kumar-doorgakant.pdf` | Yes |
| Company Registration Certificate | `company-registration-vikram-kumar-doorgakant.pdf` | Yes |
| Regulatory Authorization | `regulatory-auth-vikram-kumar-doorgakant.pdf` | No |
| Professional Accreditation | `professional-accred-vikram-kumar-doorgakant.pdf` | No |

---

#### Persona 9: Corporate Administrator Registration
- **Full Name:** `Anil Kumar Doobur`
- **Email:** `anil.test@email.com` | **Password:** `Test1234!`
- **User Type:** Corporate Administrator (5 required, 1 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-anil-kumar-doobur.pdf` | Yes |
| Company Registration Certificate | `company-registration-anil-kumar-doobur.pdf` | Yes |
| Business Operating License | `business-permit-anil-kumar-doobur.pdf` | Yes |
| Employment Verification Letter | `employment-verification-anil-kumar-doobur.pdf` | Yes |
| Company Authorization Letter | `authorization-letter-anil-kumar-doobur.pdf` | Yes |
| Corporate Profile/Brochure | `corporate-profile-anil-kumar-doobur.pdf` | No |

---

#### Persona 10: Referral Partner Registration
- **Full Name:** `Sophie Anne Leclerc`
- **Email:** `sophie.test@email.com` | **Password:** `Test1234!`
- **User Type:** Referral Partner (3 required, 3 optional)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-sophie-anne-leclerc.pdf` | Yes |
| Proof of Address | `proof-address-sophie-anne-leclerc.pdf` | Yes |
| Business Registration | `business-registration-sophie-anne-leclerc.pdf` | No |
| Marketing Portfolio/Experience | `marketing-portfolio-sophie-anne-leclerc.pdf` | No |
| Bank Account Details | `bank-details-sophie-anne-leclerc.pdf` | Yes |
| Tax Registration Certificate | `tax-certificate-sophie-anne-leclerc.pdf` | No |

---

#### Persona 11: Regional Administrator Registration
- **Full Name:** `Hassan Fareed Doorgakant`
- **Email:** `hassan.test@email.com` | **Password:** `Test1234!`
- **User Type:** Regional Administrator (7 required)

| Upload Slot | File | Required |
|-------------|------|----------|
| National ID/Passport | `national-id-hassan-fareed-doorgakant.pdf` | Yes |
| Business Plan Document | `business-plan-hassan-fareed-doorgakant.pdf` | Yes |
| Financial Statements | `financial-statements-hassan-fareed-doorgakant.pdf` | Yes |
| Healthcare/Business Experience | `experience-credentials-hassan-fareed-doorgakant.pdf` | Yes |
| Market Research Report | `regional-research-hassan-fareed-doorgakant.pdf` | Yes |
| Legal Clearance Certificate | `legal-clearance-hassan-fareed-doorgakant.pdf` | Yes |
| Professional Reference Letters | `reference-letters-hassan-fareed-doorgakant.pdf` | Yes |

---

#### OCR Failure Test
- **Full Name on form:** `John Smith` (a name that does NOT appear in any test document)
- **Upload any test PDF** (e.g., `national-id-rajesh-kumar-doorgakant.pdf`)
- **Expected result:** Yellow "Manual review" badge (name mismatch)

**All file paths are relative to project root.** Prefix with `Test-Data/generated/` when browsing files.

| # | Test | Steps | Expected |
|---|------|-------|----------|
| A1 | Patient registration | /signup > Patient > Full Name: `Aisha Fatima Doobur` > Upload 2 required PDFs > Submit | "Verified" badges, redirect to /login |
| A2 | Doctor registration | /signup > Doctor > Full Name: `Rajesh Kumar Doorgakant` > Upload 4 required PDFs > Submit | "Verified" badges |
| A3 | Nurse registration | /signup > Nurse > Full Name: `Priya Devi Ramsewak` > Upload 5 required PDFs > Submit | "Verified" badges |
| A4 | Nanny registration | /signup > Nanny > Full Name: `Marie-Claire Montagne` > Upload 2 required PDFs > Submit | "Verified" badges |
| A5 | Pharmacist registration | /signup > Pharmacist > Full Name: `Jean-Pierre Lafleur` > Upload 5 required PDFs > Submit | "Verified" badges |
| A6 | Lab Technician registration | /signup > Lab Technician > Full Name: `David Sooben Ahkee` > Upload 5 required PDFs > Submit | "Verified" badges |
| A7 | Emergency Worker registration | /signup > Emergency Worker > Full Name: `Jean-Marc Lavoix` > Upload 4 required PDFs > Submit | "Verified" badges |
| A8 | Insurance Rep registration | /signup > Insurance Rep > Full Name: `Vikram Kumar Doorgakant` > Upload 3 required PDFs > Submit | "Verified" badges |
| A9 | Corporate Admin registration | /signup > Corporate Administrator > Full Name: `Anil Kumar Doobur` > Upload 5 required PDFs > Submit | "Verified" badges |
| A10 | Referral Partner registration | /signup > Referral Partner > Full Name: `Sophie Anne Leclerc` > Upload 3 required PDFs > Submit | "Verified" badges |
| A11 | Regional Admin registration | /signup > Regional Administrator > Full Name: `Hassan Fareed Doorgakant` > Upload 7 required PDFs > Submit | "Verified" badges |
| A12 | OCR failure test | /signup > Doctor > Full Name: `John Smith` > Upload `national-id-rajesh-kumar-doorgakant.pdf` | Yellow "Manual review" badge |
| A13 | Trial wallet created | After registration, login with the new account | Wallet card shows Rs 4,500 balance |
| A14 | Duplicate email | Try registering with `emma.johnson@healthwyz.mu` (already exists) | Error: "An account with this email already exists" |
| A15 | Password mismatch | Enter different passwords in password and confirm fields | Form validation prevents proceeding |

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

## N. Provider Reviews (End-to-End)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| N1 | View doctor reviews | Login as patient `emma.johnson@healthwyz.mu` / `Patient123!` > Navigate to any doctor's review page | Reviews page loads with rating summary and review list |
| N2 | Submit review for doctor | After completing a consultation, navigate to doctor reviews > Rate 5 stars > Comment "Excellent consultation" > Submit | Review appears in the list |
| N3 | View nurse reviews | Login as nurse `priya.ramgoolam@healthwyz.mu` / `Nurse123!` > Click "Reviews" in sidebar | Reviews page shows seeded reviews with rating distribution |
| N4 | View nanny reviews | Login as nanny `anita.beeharry@healthwyz.mu` / `Nanny123!` > Click "Reviews" in sidebar | Reviews page loads with seeded reviews |
| N5 | Provider responds to review | As doctor/nurse/nanny, click "Reply" on a review > Type response > Submit | Response appears under the review |
| N6 | Mark review helpful | Click "Helpful" on any review | Helpful count increments |
| N7 | Filter reviews | Use rating filter (e.g., "5 Stars Only") | Only 5-star reviews shown |
| N8 | Search reviews | Type patient name in search box | Reviews filtered to matches |

## O. Super Admin - Role Configuration

| # | Test | Steps | Expected |
|---|------|-------|----------|
| O1 | View role config page | Login as super admin `hassan.doorgakant@healthways.mu` / `Admin123!` > Click "Role Config" in sidebar | Matrix of user types vs features with toggles |
| O2 | Disable a feature | Toggle "video" OFF for NURSE > Click "Save Changes" | Success message. When nurse logs in, video may be hidden if sidebar filtering is active |
| O3 | Re-enable feature | Toggle "video" ON for NURSE > Save | Feature re-enabled |
| O4 | View required docs | Click "Documents Config" in sidebar | Document requirements per role with checkboxes |
| O5 | Add new document | Select "DOCTOR" from dropdown > Type "Continuing Education Certificate" > Click Add | New document appears under DOCTOR |
| O6 | Remove document | Click trash icon on a document | Document removed from the list |
| O7 | Save doc config | Make changes > Click "Save Changes" | Configuration saved to database |

## P. Insurance Claims Flow

| # | Test | Steps | Expected |
|---|------|-------|----------|
| P1 | View claims page | Login as insurance rep `vikram.doorgakant@healthways.mu` / `Insurance123!` > Click "Claims" in sidebar | Claims list page loads |
| P2 | Create new claim | Click "New Claim" > Fill form with patient info, claim amount, description > Submit | Claim created with "Pending" status |
| P3 | Approve claim | Click "Approve" on a pending claim | Status changes to "Approved", resolvedDate set |
| P4 | Reject claim | Click "Reject" on a pending claim | Status changes to "Rejected" |

## Q. Emergency Booking Flow (End-to-End)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| Q1 | Patient requests emergency | Login as patient > Click "Emergency Services" > Select emergency type > Request | Emergency booking created with "Pending" status |
| Q2 | Responder sees request | Login as emergency worker `jeanmarc.lafleur@healthways.mu` / `Emergency123!` > Click "Booking Requests" | Pending emergency request visible |
| Q3 | Responder accepts | Click "Accept" on the emergency request | Status changes to "Dispatched", responder assigned |
| Q4 | Status updates | Responder updates status: dispatched → en_route → resolved | Status updates reflected for both patient and responder |

## R. Referral Partner Flow

| # | Test | Steps | Expected |
|---|------|-------|----------|
| R1 | Dashboard stats | Login as referral partner `sophie.leclerc@healthways.mu` / `Referral123!` | Dashboard shows total referrals, earnings, commission rate |
| R2 | Referral code visible | Check dashboard or profile | Referral code displayed, can be shared |
| R3 | Track conversions | View "Recent Conversions" section | Shows users who signed up with the referral code |
| R4 | View analytics | Click "Analytics" in sidebar | Conversion rate, earnings charts |
| R5 | View earnings | Click "Earnings" in sidebar | Wallet balance, transaction history |

## S. Messaging Flow (Cross-Role)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| S1 | Patient sends message to doctor | Login as patient > Click "Messages" > Find Dr. Sarah Johnson > Type "Hello Doctor" > Send | Message appears in chat |
| S2 | Doctor receives message | Login as doctor `sarah.johnson@healthwyz.mu` / `Doctor123!` > Click "Messages" | Conversation with patient visible, message "Hello Doctor" shown |
| S3 | Doctor replies | Type "Hello, how can I help?" > Send | Message appears in chat |
| S4 | Patient sees reply | Login as patient > Messages | Doctor's reply visible |
| S5 | Patient messages nurse | As patient > Messages > Find a nurse > Send message | Message delivered |

## T. Video Call Flow (Cross-Role)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| T1 | Patient joins video room | Login as patient > Click "Video Call" > Select an appointment with a doctor > Join | Video call interface loads, camera/mic requested |
| T2 | Doctor joins same room | In another browser/tab, login as the doctor > Video Call > Join same appointment | Both peers connected, video/audio flowing |
| T3 | Screen sharing | During call, click screen share button | Screen shared to other peer |
| T4 | End call | Click "End Call" | Call ended, both returned to dashboard |

## U. Prescription Flow (Doctor writes, Patient views)

| # | Test | Steps | Expected |
|---|------|-------|----------|
| U1 | Doctor writes prescription | Login as doctor > Go to a patient's profile > Click "Write Prescription" > Add medicines, dosage, instructions > Save | Prescription created |
| U2 | Patient views prescription | Login as patient > Click "Prescriptions" in sidebar | New prescription visible with medicine details |
| U3 | Prescription management | Click on a prescription | Shows medication schedule, refill status |

## V. Pharmacy Order Flow

| # | Test | Steps | Expected |
|---|------|-------|----------|
| V1 | Browse medicines | Navigate to /search/medicines | Medicine catalog with search and filters |
| V2 | Add to cart | Click "Add to Cart" on multiple medicines | Cart icon shows item count |
| V3 | Place order | Checkout > Confirm > Place Order | Order created, wallet debited |
| V4 | Pharmacist sees order | Login as pharmacist > Click "Orders" | New order visible with items list |
| V5 | Pharmacist updates status | Change order status: Preparing → Delivering → Completed | Status updates reflected |

## W. Corporate Admin Portal

| # | Test | Steps | Expected |
|---|------|-------|----------|
| W1 | Dashboard loads | Login as corporate admin `anil.doobur@healthways.mu` / `Corporate123!` | Dashboard with employee stats |
| W2 | Company profile | Click "Company" in sidebar | Company info form, can edit and save |
| W3 | Employees list | Click "Employees" in sidebar | List of employees (if any) |

## X. Lab Technician Portal

| # | Test | Steps | Expected |
|---|------|-------|----------|
| X1 | Dashboard loads | Login as lab tech `david.ahkee@healthways.mu` / `Lab123!` | Dashboard with test request stats |
| X2 | View test requests | Click "Test Requests" in sidebar | List of pending lab test bookings |
| X3 | View results | Click "Results" in sidebar | Completed test results |

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

### Round 4: Registration with OCR (Doctor)
1. Go to /signup > Select Doctor
2. Full Name: `Rajesh Kumar Doorgakant`
3. Upload to "National ID/Passport": `Test-Data/generated/national-id-rajesh-kumar-doorgakant.pdf`
4. Upload to "Medical Degree": `Test-Data/generated/medical-degree-rajesh-kumar-doorgakant.pdf`
5. Upload to "Professional License": `Test-Data/generated/medical-license-rajesh-kumar-doorgakant.pdf`
6. Upload to "Registration Certificate": `Test-Data/generated/registration-cert-rajesh-kumar-doorgakant.pdf`
7. Verify: Green "Verified" badges on all 4 required documents

### Round 4b: Registration with OCR (Patient)
1. Go to /signup > Select Patient
2. Full Name: `Aisha Fatima Doobur`
3. Upload to "National ID/Passport": `Test-Data/generated/national-id-aisha-fatima-doobur.pdf`
4. Upload to "Proof of Address": `Test-Data/generated/proof-address-aisha-fatima-doobur.pdf`
5. Verify: Green "Verified" badges on both required documents

### Round 5: Community
1. Login as doctor > My Posts > Create a post
2. Login as patient > /community > Comment on the post > Like it

### Round 6: Provider Reviews
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Click "Reviews" in sidebar > See seeded reviews with rating distribution
3. Reply to a review

### Round 7: Admin Role Config
1. Login as super admin: `hassan.doorgakant@healthways.mu` / `Admin123!`
2. Click "Role Config" in sidebar > Toggle a feature > Save
3. Click "Documents Config" > Add a document requirement > Save

### Round 8: Cross-Role Messaging
1. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
2. Messages > Send "Hello Doctor" to Dr. Sarah Johnson
3. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
4. Messages > Find conversation > Reply "Hello, how can I help you?"

### Round 9: Insurance Claims
1. Login as insurance rep: `vikram.doorgakant@healthways.mu` / `Insurance123!`
2. Claims > Create new claim > Approve it

### Round 10: Connect & Message on Search Pages
1. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
2. Navigate to /search/doctors
3. Click "Connect" on Dr. Sarah Johnson > Button changes to "Requested"
4. Click "Message" on Dr. Sarah Johnson > Redirected to chat page with new conversation
5. Navigate to /search/nurses > Verify "Connect" and "Message" buttons present
6. Navigate to /search/childcare > Verify buttons present
7. Navigate to /search/emergency > Verify buttons present
8. Navigate to /search/lab > Verify buttons present

### Round 11: AI Support Chat
1. Navigate to /search/ai (no login required)
2. Type "What are common symptoms of dengue fever in Mauritius?"
3. Verify: Real AI response (not hardcoded keyword match), loading spinner while waiting
4. Send a follow-up: "How is it treated?"
5. Verify: Context-aware response referencing previous message

### Round 12: Connection Acceptance
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Go to Messages > See "New Connection" entry for the patient who sent connect request
3. The connection shows in chat contacts after acceptance

### Round 13: Emergency Worker Calls
1. Login as emergency worker: `jeanmarc.lafleur@healthways.mu` / `Emergency123!`
2. Click "Calls" in sidebar > Call history loads from API (not empty)

### Round 14: Lab Technician Results
1. Login as lab tech: `david.ahkee@healthways.mu` / `Lab123!`
2. Click "Results" in sidebar > Results page loads from API

### Round 15: Patient Insurance Info
1. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
2. Navigate to Insurance section
3. Verify: Claims show real data from API (no fabricated amounts)
4. If no claims exist, shows "No claims yet" message

### Round 16: Doctor Dashboard Dynamic Data
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Check BillingEarnings > Revenue breakdown computed from transactions (not hardcoded 60/25/10/5%)
3. Check Statistics > Growth rate and success rate computed from real data
4. Check Reviews > Analytics tab shows computed averages, Achievements show earned/unearned badges

### Round 17: Corporate Analytics
1. Login as corporate admin: `anil.doobur@healthways.mu` / `Corporate123!`
2. Click "Analytics" > All 6 fields populated from API (not zeros)
3. Settings > Quick stats show real employee/claims data

### Round 18: Admin Backup
1. Login as super admin: `hassan.doorgakant@healthways.mu` / `Admin123!`
2. Navigate to Backup page
3. Click "Create Backup" > New entry appears with progress
4. Refresh page > Backup persists (stored in localStorage)

### Round 19: Sidebar Collapsed Mode (Desktop)
1. Login as any user on desktop
2. Click hamburger/toggle to collapse sidebar
3. Verify: Icons only visible (no text labels), sidebar width shrinks to icon-only
4. Hover over icon > Tooltip shows label
5. Notification badge shows as small dot when collapsed
6. Click toggle again > Sidebar expands with full labels

### Round 20: Billing in Settings
1. Login as any user type
2. Go to Settings > Click "Billing" tab
3. Verify: Wallet balance card + Payment method form displayed
4. Verify: "All payments are currently simulated using your trial credits" banner shown

### Round 21: Referral Partner UTM Links
1. Login as referral partner: `sophie.leclerc@healthways.mu` / `Referral123!`
2. Click UTM Link Generator > Select a social platform
3. Verify: Generated link uses current domain (not hardcoded healthwyz.mu)
4. Copy link > Open in incognito > Verify redirects to signup with promo param

### Round 22: Doctor Prescriptions Flow
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Go to Video Call > During/after a call, click "Write Prescription"
3. Add medicines with dosage and instructions > Save
4. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
5. Go to Prescriptions > Verify new prescription appears in the list

### Round 23: Commission System — Booking Confirmation & Payment Split
1. Login as doctor: `sarah.johnson@healthwyz.mu` / `Doctor123!`
2. Go to Appointments > Find a pending booking
3. Click "Confirm" on the booking
4. Verify: Patient wallet debited by full consultation fee
5. Verify: Doctor wallet credited with 85% of the fee
6. Verify: Regional admin wallet credited with 10% of the fee
7. Verify: Platform retains 5% (visible in wallet transactions)
8. Check wallet transaction records show `platformCommission`, `regionalCommission`, `providerAmount` fields
9. Repeat with a nurse and nanny booking to ensure split works across provider types

### Round 24: Commission Config UI (Super Admin)
1. Login as super admin: `hassan.doorgakant@healthways.mu` / `Admin123!`
2. Navigate to Commission Config (`/admin/commission-config`)
3. Verify: Current rates load from database (default 85/10/5)
4. Verify: Visual revenue split bar reflects current percentages
5. Change provider to 80%, regional to 12%, platform to 8% > Total indicator shows "100% (valid)"
6. Click Save > Success message appears
7. Refresh page > New values persist
8. Set rates that don't sum to 100% > Save button disabled, "must equal 100%" shown
9. Verify: Currency and Trial Wallet Amount fields are editable and persist

### Round 25: Platform Earnings Dashboard (Super Admin)
1. Login as super admin: `hassan.doorgakant@healthways.mu` / `Admin123!`
2. Navigate to Platform Earnings (`/admin/platform-earnings`)
3. Verify: Stats cards show Platform Revenue (5%), Regional Payouts, Transaction Volume, Active Admins
4. Verify: Recent transactions table shows commission breakdown per transaction
5. Verify: Regional admin summary shows each admin's total commission earned

### Round 26: Regional Admin Earnings Dashboard
1. Login as regional admin: `hassan.doorgakant@healthways.mu` / `Admin123!`
2. Navigate to Earnings (`/super-admin/earnings`)
3. Verify: Stats show total commission earned, transaction count, average commission
4. Verify: Commission explanation card shows the regional admin's rate
5. Verify: Transaction list shows only transactions from their region

### Round 27: Mobile Navigation — Icon Grid
1. Open the app on a mobile viewport (375px width)
2. Click the hamburger menu
3. Verify: Services section shows a 4-column icon grid (no text labels, icons only with short names)
4. Verify: All 8 service categories are present (Doctors, Nurses, Childcare, Pharmacy, Lab, Emergency, Insurance, Corporate)
5. Tap any icon > Navigates to the correct search page
6. Resize to tablet (768px+) > Verify: Full expandable category dropdowns appear instead of icon grid

### Round 28: Chat UI Scroll Containment
1. Login as any user with existing conversations
2. Open Messages > Select a conversation
3. Send multiple messages to create a long thread
4. Verify: Chat container stays within the viewport (no page-level scrollbar from messages)
5. Verify: Messages scroll within the chat area with an internal scrollbar
6. Verify: Input field stays fixed at the bottom of the chat container

### Round 29: AI Chat Scroll Containment
1. Login as patient: `emma.johnson@healthwyz.mu` / `Patient123!`
2. Open the AI Health Assistant
3. Send multiple messages to generate a long conversation
4. Verify: Chat stays within viewport height, scrolls internally
5. Verify: Input area stays fixed at the bottom

### Round 30: Auth Redirect on Provider Detail Pages
1. Open the app in incognito (not logged in)
2. Navigate to a doctor detail page (e.g., `/search/doctors/[id]`)
3. Click "Book Consultation" button
4. Verify: Redirects to `/login?returnUrl=/booking/doctors/[id]`
5. Click "Video Call" button > Redirects to login with appropriate returnUrl
6. Click "Connect" button > Redirects to login
7. Click "Message" button > Redirects to login
8. Repeat on nurse (`/search/nurses/[id]`) and nanny (`/search/childcare/[id]`) detail pages
9. Login after redirect > Verify: Returns to the intended page
