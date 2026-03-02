const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const personas = require('./test-personas.json');

const outputDir = path.join(__dirname, 'generated');

// ─── Document IDs per user type (mirrors app/signup/constants.ts) ────────────

const DOCS_PER_TYPE = {
  patient: ['national-id', 'insurance-card', 'proof-address', 'medical-history'],
  doctor: ['national-id', 'medical-degree', 'medical-license', 'registration-cert', 'work-certificate'],
  nurse: ['national-id', 'nursing-degree', 'nursing-license', 'registration-cert', 'work-certificate'],
  nanny: ['national-id', 'police-clearance', 'childcare-cert', 'employment-refs'],
  pharmacist: ['national-id', 'pharmacy-degree', 'pharmacy-license', 'registration-cert', 'pharmacy-affiliation'],
  lab: ['national-id', 'lab-degree', 'lab-license', 'lab-accreditation', 'employment-proof'],
  emergency: ['national-id', 'emt-cert', 'professional-license', 'first-aid-cert', 'employment-proof'],
  insurance: ['national-id', 'employment-proof', 'company-registration', 'regulatory-auth', 'professional-accred'],
  corporate: ['national-id', 'company-registration', 'business-permit', 'employment-verification', 'authorization-letter', 'corporate-profile'],
  'referral-partner': ['national-id', 'proof-address', 'business-registration', 'marketing-portfolio', 'bank-details', 'tax-certificate'],
  'regional-admin': ['national-id', 'business-plan', 'financial-statements', 'experience-credentials', 'regional-research', 'legal-clearance', 'reference-letters'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const currentDate = new Date().toISOString().split('T')[0];

// ─── Document Templates ──────────────────────────────────────────────────────
// Each template: { issuer, subtitle?, title, pageSize?, layout?, body(p), fields(p), footer }
// All templates MUST include persona.fullName somewhere in body or fields for OCR.

const TEMPLATES = {
  'national-id': {
    issuer: 'REPUBLIC OF MAURITIUS',
    title: 'NATIONAL IDENTITY CARD',
    pageSize: 'A5',
    layout: 'landscape',
    body: null,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Date of Birth', p.dob],
      ['ID Number', p.idNumber],
      ['Nationality', 'Mauritian'],
    ],
    footer: 'This document is issued by the Civil Status Division, Government of Mauritius.',
  },

  'proof-address': {
    issuer: 'CENTRAL ELECTRICITY BOARD',
    subtitle: 'Republic of Mauritius',
    title: 'ELECTRICITY BILL / PROOF OF RESIDENCE',
    body: null,
    fields: (p) => [
      ['Account Holder', p.fullName],
      ['Address', p.address],
      ['Date', currentDate],
      ['Bill Period', 'January 2026 - February 2026'],
      ['Amount Due', 'Rs 1,250.00'],
    ],
    footer: 'Central Electricity Board, Royal Road, Curepipe, Mauritius. This bill serves as proof of residence for official purposes.',
  },

  'insurance-card': {
    issuer: 'SWAN INSURANCE CO. LTD',
    subtitle: 'Health Insurance Division',
    title: 'HEALTH INSURANCE CARD',
    body: (p) => `This card certifies that ${p.fullName} is a registered member of the Swan Health Insurance scheme and is entitled to medical benefits as per the policy terms.`,
    fields: (p) => [
      ['Insured Name', p.fullName],
      ['Policy Number', 'HI-2026-' + p.idNumber.slice(0, 6)],
      ['Coverage Type', 'Comprehensive Health'],
      ['Valid Until', '2027-12-31'],
    ],
    footer: 'Swan Insurance Co. Ltd, Ebene, Mauritius.',
  },

  'medical-history': {
    issuer: 'MINISTRY OF HEALTH AND WELLNESS',
    subtitle: 'Republic of Mauritius',
    title: 'MEDICAL HISTORY SUMMARY',
    body: (p) => `This document provides a summary of the medical history for ${p.fullName}, as recorded in the national health information system.`,
    fields: (p) => [
      ['Patient Name', p.fullName],
      ['Date of Birth', p.dob],
      ['Blood Type', 'O+'],
      ['Allergies', 'None known'],
      ['Chronic Conditions', 'None'],
      ['Vaccinations', 'COVID-19 (3 doses), Hepatitis B, Tetanus'],
      ['Date Issued', currentDate],
    ],
    footer: 'Ministry of Health and Wellness, Port Louis, Mauritius.',
  },

  'medical-degree': {
    issuer: 'UNIVERSITY OF MAURITIUS',
    subtitle: 'Faculty of Medicine and Health Sciences',
    title: 'MEDICAL DEGREE CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed all requirements for the degree of ${p.degreeTitle || 'Doctor of Medicine (MD)'} and is hereby conferred this degree with all the rights and privileges appertaining thereto.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Degree', p.degreeTitle || 'Doctor of Medicine (MD)'],
      ['Date of Award', '2012-07-15'],
      ['Registration Number', 'UOM/' + p.idNumber.slice(0, 8)],
    ],
    footer: 'University of Mauritius, Reduit, Mauritius.',
  },

  'medical-license': {
    issuer: 'MEDICAL COUNCIL OF MAURITIUS',
    subtitle: 'Ministry of Health and Wellness',
    title: 'LICENSE TO PRACTICE MEDICINE',
    body: (p) => `This certifies that ${p.fullName} is licensed to practice medicine in the Republic of Mauritius, in accordance with the Medical Council Act.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['License Number', p.licenseNumber || 'MED-XXXX-XXXX'],
      ['Specialty', p.profession],
      ['Date of Issue', currentDate],
      ['Status', 'Active'],
    ],
    footer: 'Medical Council of Mauritius, Emmanuel Anquetil Building, Port Louis.',
  },

  'registration-cert': {
    issuer: 'MEDICAL COUNCIL OF MAURITIUS',
    subtitle: 'Republic of Mauritius',
    title: 'PROFESSIONAL REGISTRATION CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has been duly registered as a ${p.profession} with the Medical Council of Mauritius and is authorized to practice in accordance with applicable regulations.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Registration Number', 'REG-' + p.idNumber.slice(0, 8)],
      ['Profession', p.profession],
      ['Date of Registration', '2013-01-15'],
      ['Status', 'Active'],
    ],
    footer: 'Medical Council of Mauritius, Port Louis.',
  },

  'work-certificate': {
    issuer: 'SSR NATIONAL HOSPITAL',
    subtitle: 'Pamplemousses, Mauritius',
    title: 'CERTIFICATE OF EMPLOYMENT',
    body: (p) => `This is to certify that ${p.fullName} has been employed at SSR National Hospital as a ${p.profession} since 2015. During this period, ${p.fullName} has demonstrated exemplary professional conduct and competence.`,
    fields: (p) => [
      ['Employee Name', p.fullName],
      ['Position', p.profession],
      ['Department', 'General Medicine'],
      ['Employment Start', '2015-03-01'],
      ['Date Issued', currentDate],
    ],
    footer: 'SSR National Hospital, Human Resources Department.',
  },

  'nursing-degree': {
    issuer: 'UNIVERSITY OF MAURITIUS',
    subtitle: 'Faculty of Medicine and Health Sciences',
    title: 'NURSING DEGREE CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed all requirements for the degree of ${p.degreeTitle || 'Bachelor of Science in Nursing'} and is hereby conferred this degree.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Degree', p.degreeTitle || 'Bachelor of Science in Nursing'],
      ['Date of Award', '2014-07-15'],
      ['Registration Number', 'UOM/NUR/' + p.idNumber.slice(0, 6)],
    ],
    footer: 'University of Mauritius, Reduit, Mauritius.',
  },

  'nursing-license': {
    issuer: 'NURSING COUNCIL OF MAURITIUS',
    subtitle: 'Ministry of Health and Wellness',
    title: 'LICENSE TO PRACTICE NURSING',
    body: (p) => `This certifies that ${p.fullName} is licensed to practice nursing in the Republic of Mauritius, in accordance with the Nursing Council Act.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['License Number', p.licenseNumber || 'NUR-XXXX-XXXX'],
      ['Specialization', 'Registered Nurse'],
      ['Date of Issue', currentDate],
      ['Status', 'Active'],
    ],
    footer: 'Nursing Council of Mauritius, Port Louis.',
  },

  'police-clearance': {
    issuer: 'MAURITIUS POLICE FORCE',
    subtitle: 'Criminal Investigation Division',
    title: 'CERTIFICATE OF CHARACTER',
    body: (p) => `This is to certify that ${p.fullName}, holder of National Identity Card number ${p.idNumber}, residing at ${p.address}, has no criminal record registered with the Mauritius Police Force as of the date of issue.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['ID Number', p.idNumber],
      ['Address', p.address],
      ['Date of Issue', currentDate],
      ['Valid Until', '2027-03-01'],
    ],
    footer: 'Mauritius Police Force, Line Barracks, Port Louis.',
  },

  'childcare-cert': {
    issuer: 'RED CROSS MAURITIUS',
    subtitle: 'Training & Certification Division',
    title: 'CHILDCARE & FIRST AID CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed the Childcare and Pediatric First Aid Training Programme conducted by Red Cross Mauritius, covering infant CPR, emergency response, and child safety protocols.`,
    fields: (p) => [
      ['Participant Name', p.fullName],
      ['Course', 'Childcare & Pediatric First Aid'],
      ['Duration', '40 hours'],
      ['Date of Completion', '2023-06-15'],
      ['Certificate Number', 'RC-CF-' + p.idNumber.slice(0, 6)],
    ],
    footer: 'Red Cross Mauritius, Rose Hill.',
  },

  'employment-refs': {
    issuer: 'TO WHOM IT MAY CONCERN',
    title: 'EMPLOYMENT REFERENCE LETTER',
    body: (p) => `I am pleased to provide this reference for ${p.fullName}, who worked under my supervision as a childcare provider from 2020 to 2025. During this period, ${p.fullName} demonstrated exceptional dedication, reliability, and a genuine love for children. I highly recommend ${p.fullName} for any childcare position.`,
    fields: (p) => [
      ['Referred Person', p.fullName],
      ['Period of Employment', '2020-2025'],
      ['Position', 'Childcare Provider'],
      ['Referee', 'Dr. Anand Doorgakant'],
      ['Contact', 'anand.d@email.mu'],
      ['Date', currentDate],
    ],
    footer: 'This reference is provided in good faith and to the best of my knowledge.',
  },

  'pharmacy-degree': {
    issuer: 'UNIVERSITY OF MAURITIUS',
    subtitle: 'Faculty of Science',
    title: 'PHARMACY DEGREE CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed all requirements for the degree of ${p.degreeTitle || 'Doctor of Pharmacy (PharmD)'} and is hereby conferred this degree.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Degree', p.degreeTitle || 'Doctor of Pharmacy (PharmD)'],
      ['Date of Award', '2004-07-15'],
      ['Registration Number', 'UOM/PHA/' + p.idNumber.slice(0, 6)],
    ],
    footer: 'University of Mauritius, Reduit, Mauritius.',
  },

  'pharmacy-license': {
    issuer: 'PHARMACY COUNCIL OF MAURITIUS',
    subtitle: 'Ministry of Health and Wellness',
    title: 'LICENSE TO PRACTICE PHARMACY',
    body: (p) => `This certifies that ${p.fullName} is licensed to practice pharmacy in the Republic of Mauritius, in accordance with the Pharmacy Act.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['License Number', p.licenseNumber || 'PHA-XXXX-XXXX'],
      ['Date of Issue', currentDate],
      ['Status', 'Active'],
    ],
    footer: 'Pharmacy Council of Mauritius, Port Louis.',
  },

  'pharmacy-affiliation': {
    issuer: 'REGISTRAR OF COMPANIES',
    subtitle: 'Republic of Mauritius',
    title: 'PHARMACY AFFILIATION PROOF',
    body: (p) => `This document certifies that ${p.fullName} is the registered pharmacist-in-charge of ${p.companyName || 'Pharmacy'}, located at ${p.address}. The pharmacy is duly registered and authorized to dispense medications.`,
    fields: (p) => [
      ['Pharmacist Name', p.fullName],
      ['Pharmacy Name', p.companyName || 'Pharmacy'],
      ['Business Registration', 'BRN-PHA-' + p.idNumber.slice(0, 6)],
      ['Address', p.address],
      ['Date', currentDate],
    ],
    footer: 'Registrar of Companies, Port Louis, Mauritius.',
  },

  'lab-degree': {
    issuer: 'UNIVERSITY OF MAURITIUS',
    subtitle: 'Faculty of Science',
    title: 'LABORATORY SCIENCE DEGREE CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed all requirements for the degree of ${p.degreeTitle || 'Bachelor of Medical Laboratory Science'} and is hereby conferred this degree.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Degree', p.degreeTitle || 'Bachelor of Medical Laboratory Science'],
      ['Date of Award', '2009-07-15'],
      ['Registration Number', 'UOM/LAB/' + p.idNumber.slice(0, 6)],
    ],
    footer: 'University of Mauritius, Reduit, Mauritius.',
  },

  'lab-license': {
    issuer: 'MINISTRY OF HEALTH AND WELLNESS',
    subtitle: 'Health Laboratory Services',
    title: 'LABORATORY PROFESSIONAL LICENSE',
    body: (p) => `This certifies that ${p.fullName} is licensed to practice as a Laboratory Technician in the Republic of Mauritius, in accordance with the Public Health Act.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['License Number', p.licenseNumber || 'LAB-XXXX-XXXX'],
      ['Specialization', 'Clinical Biochemistry & Haematology'],
      ['Date of Issue', currentDate],
      ['Status', 'Active'],
    ],
    footer: 'Ministry of Health and Wellness, Port Louis.',
  },

  'lab-accreditation': {
    issuer: 'MAURITIUS ACCREDITATION SERVICE (MAURITAS)',
    subtitle: 'Ministry of Industrial Development',
    title: 'LABORATORY ACCREDITATION CERTIFICATE',
    body: (p) => `This is to certify that the laboratory operated by ${p.fullName} at ${p.companyName || 'the laboratory'} has been assessed and found to comply with the requirements of ISO 15189:2022 for medical laboratories. The laboratory is accredited for clinical testing services.`,
    fields: (p) => [
      ['Laboratory Director', p.fullName],
      ['Laboratory Name', p.companyName || 'Medical Laboratory'],
      ['Accreditation Number', 'MAURITAS-LAB-' + p.idNumber.slice(0, 6)],
      ['Standard', 'ISO 15189:2022'],
      ['Valid Until', '2028-12-31'],
    ],
    footer: 'MAURITAS, Ebene, Mauritius.',
  },

  'employment-proof': {
    issuer: 'HUMAN RESOURCES DEPARTMENT',
    title: 'PROOF OF EMPLOYMENT',
    body: (p) => `This letter confirms that ${p.fullName} is currently employed at ${p.companyName || 'our organization'} as a ${p.profession}. This letter is issued upon request for official purposes.`,
    fields: (p) => [
      ['Employee Name', p.fullName],
      ['Position', p.profession],
      ['Organization', p.companyName || 'Our Organization'],
      ['Employment Status', 'Full-time, Permanent'],
      ['Date Issued', currentDate],
    ],
    footer: 'This letter is issued for verification purposes only.',
  },

  'emt-cert': {
    issuer: 'SAMU MAURITIUS',
    subtitle: 'Emergency Medical Services',
    title: 'EMT / PARAMEDIC CERTIFICATION',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed the Emergency Medical Technician (EMT-Paramedic) certification programme and is qualified to provide pre-hospital emergency medical care.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Certification Level', 'EMT-Paramedic'],
      ['Certificate Number', p.licenseNumber || 'EMT-XXXX-XXXX'],
      ['Date of Certification', '2018-09-01'],
      ['Valid Until', '2028-09-01'],
    ],
    footer: 'SAMU Mauritius, Port Louis.',
  },

  'professional-license': {
    issuer: 'MINISTRY OF HEALTH AND WELLNESS',
    subtitle: 'Republic of Mauritius',
    title: 'PROFESSIONAL LICENSE',
    body: (p) => `This certifies that ${p.fullName} is licensed to practice as a ${p.profession} in the Republic of Mauritius, in accordance with the relevant regulations governing healthcare professionals.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['License Number', p.licenseNumber || 'PRO-' + p.idNumber.slice(0, 8)],
      ['Profession', p.profession],
      ['Date of Issue', currentDate],
      ['Status', 'Active'],
    ],
    footer: 'Ministry of Health and Wellness, Port Louis.',
  },

  'first-aid-cert': {
    issuer: 'RED CROSS MAURITIUS',
    subtitle: 'Emergency Training Division',
    title: 'ADVANCED LIFE SUPPORT (ALS) CERTIFICATION',
    body: (p) => `This is to certify that ${p.fullName} has successfully completed the Advanced Life Support (ALS) certification programme, including cardiac arrest management, airway management, and emergency pharmacology.`,
    fields: (p) => [
      ['Participant Name', p.fullName],
      ['Course', 'Advanced Life Support (ALS)'],
      ['Duration', '80 hours'],
      ['Date of Completion', '2023-03-20'],
      ['Certificate Number', 'RC-ALS-' + p.idNumber.slice(0, 6)],
    ],
    footer: 'Red Cross Mauritius, Rose Hill.',
  },

  'company-registration': {
    issuer: 'REGISTRAR OF COMPANIES',
    subtitle: 'Republic of Mauritius',
    title: 'COMPANY REGISTRATION CERTIFICATE',
    body: (p) => `This is to certify that ${p.companyName || 'the Company'} has been duly incorporated and registered under the Companies Act 2001. The company is authorized to conduct business in Mauritius. Director: ${p.fullName}.`,
    fields: (p) => [
      ['Company Name', p.companyName || 'Company Ltd'],
      ['Director', p.fullName],
      ['Business Registration Number', 'BRN-' + p.idNumber.slice(0, 8)],
      ['Date of Registration', '2020-01-15'],
      ['Status', 'Active'],
    ],
    footer: 'Registrar of Companies, Port Louis, Mauritius.',
  },

  'regulatory-auth': {
    issuer: 'FINANCIAL SERVICES COMMISSION',
    subtitle: 'Republic of Mauritius',
    title: 'REGULATORY AUTHORIZATION',
    body: (p) => `This is to certify that ${p.fullName}, representing ${p.companyName || 'the Company'}, is authorized to operate as an insurance intermediary in the Republic of Mauritius in accordance with the Insurance Act 2005.`,
    fields: (p) => [
      ['Authorized Person', p.fullName],
      ['Company', p.companyName || 'Insurance Company'],
      ['Authorization Number', 'FSC-INS-' + p.idNumber.slice(0, 6)],
      ['Date of Issue', currentDate],
      ['Valid Until', '2028-12-31'],
    ],
    footer: 'Financial Services Commission, Ebene, Mauritius.',
  },

  'professional-accred': {
    issuer: 'INSURANCE INSTITUTE OF MAURITIUS',
    title: 'PROFESSIONAL ACCREDITATION CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} has met the professional standards required for accreditation as a Certified Insurance Professional and is recognized as a qualified practitioner.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Designation', 'Certified Insurance Professional (CIP)'],
      ['Accreditation Number', 'IIM-CIP-' + p.idNumber.slice(0, 6)],
      ['Date', currentDate],
    ],
    footer: 'Insurance Institute of Mauritius.',
  },

  'business-permit': {
    issuer: 'DISTRICT COUNCIL OF PLAINES WILHEMS',
    subtitle: 'Republic of Mauritius',
    title: 'BUSINESS OPERATING LICENSE',
    body: (p) => `This business operating license is hereby granted to ${p.companyName || 'the Business'}, represented by ${p.fullName}, to conduct business operations at the registered address.`,
    fields: (p) => [
      ['Business Name', p.companyName || 'Business'],
      ['Representative', p.fullName],
      ['License Number', 'BOL-' + p.idNumber.slice(0, 8)],
      ['Business Type', 'Corporate Wellness Services'],
      ['Date of Issue', currentDate],
      ['Valid Until', '2027-12-31'],
    ],
    footer: 'District Council of Plaines Wilhems, Rose Hill.',
  },

  'employment-verification': {
    issuer: 'HUMAN RESOURCES DEPARTMENT',
    subtitle: null,
    title: 'EMPLOYMENT VERIFICATION LETTER',
    body: (p) => `This letter is to confirm that ${p.fullName} holds the position of ${p.profession} at ${p.companyName || 'our organization'}. ${p.fullName} has the authority to manage corporate wellness programs and represent the company on the Healthwyz platform.`,
    fields: (p) => [
      ['Employee Name', p.fullName],
      ['Position', p.profession],
      ['Company', p.companyName || 'Organization'],
      ['Date of Joining', '2018-06-01'],
      ['Date Issued', currentDate],
    ],
    footer: 'This letter is issued for official platform registration purposes.',
  },

  'authorization-letter': {
    issuer: null,
    title: 'COMPANY AUTHORIZATION LETTER',
    body: (p) => `We, the Board of Directors of ${p.companyName || 'the Company'}, hereby authorize ${p.fullName} to represent ${p.companyName || 'the Company'} on the Healthwyz healthcare platform. ${p.fullName} is authorized to manage employee wellness programs, process health-related claims, and act on behalf of the company in all matters related to the platform.`,
    fields: (p) => [
      ['Authorized Person', p.fullName],
      ['Company', p.companyName || 'Company'],
      ['Authorization Scope', 'Full platform access and management'],
      ['Date', currentDate],
      ['Signed by', 'Board of Directors'],
    ],
    footer: 'This authorization is valid until revoked in writing.',
  },

  'corporate-profile': {
    issuer: null,
    title: 'CORPORATE PROFILE',
    body: (p) => `${p.companyName || 'The Company'} is a leading provider of corporate wellness solutions in Mauritius. Under the leadership of ${p.fullName}, the company manages wellness programs for over 500 employees across multiple sectors. The company is committed to promoting employee health and well-being through the Healthwyz platform.`,
    fields: (p) => [
      ['Company Name', p.companyName || 'Company'],
      ['Contact Person', p.fullName],
      ['Employee Count', '500+'],
      ['Industry', 'Corporate Wellness'],
      ['Address', p.address],
    ],
    footer: null,
  },

  'business-registration': {
    issuer: 'REGISTRAR OF COMPANIES',
    subtitle: 'Republic of Mauritius',
    title: 'BUSINESS REGISTRATION CERTIFICATE',
    body: (p) => `This is to certify that the business operated by ${p.fullName} under the name ${p.companyName || 'Business'} has been duly registered under the Business Registration Act.`,
    fields: (p) => [
      ['Business Owner', p.fullName],
      ['Business Name', p.companyName || 'Business'],
      ['Registration Number', 'BRN-' + p.idNumber.slice(0, 8)],
      ['Business Type', 'Marketing & Referral Services'],
      ['Date', currentDate],
    ],
    footer: 'Registrar of Companies, Port Louis.',
  },

  'marketing-portfolio': {
    issuer: null,
    title: 'MARKETING PORTFOLIO',
    body: (p) => `This portfolio showcases the marketing experience of ${p.fullName} in the healthcare and digital marketing sectors. ${p.fullName} has successfully managed referral campaigns and social media marketing for healthcare providers, generating over 10,000 leads in the past year.`,
    fields: (p) => [
      ['Name', p.fullName],
      ['Specialty', 'Healthcare Digital Marketing'],
      ['Social Media Reach', '50,000+ followers'],
      ['Campaigns Managed', '25+'],
      ['Date', currentDate],
    ],
    footer: null,
  },

  'bank-details': {
    issuer: 'STATE BANK OF MAURITIUS',
    subtitle: 'Banking Services Division',
    title: 'BANK ACCOUNT VERIFICATION LETTER',
    body: (p) => `This letter confirms that ${p.fullName} holds an active savings account with the State Bank of Mauritius. This verification is provided for commission payment setup purposes on the Healthwyz platform.`,
    fields: (p) => [
      ['Account Holder', p.fullName],
      ['Account Type', 'Savings Account'],
      ['Branch', 'Ebene Branch'],
      ['IBAN', 'MU43STBK0000' + p.idNumber.slice(0, 8)],
      ['Date Issued', currentDate],
    ],
    footer: 'State Bank of Mauritius, Ebene.',
  },

  'tax-certificate': {
    issuer: 'MAURITIUS REVENUE AUTHORITY',
    subtitle: 'Republic of Mauritius',
    title: 'TAX REGISTRATION CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName} is registered with the Mauritius Revenue Authority for income tax purposes.`,
    fields: (p) => [
      ['Taxpayer Name', p.fullName],
      ['Tax Account Number', 'TAN-' + p.idNumber.slice(0, 8)],
      ['Registration Date', '2020-04-01'],
      ['Status', 'Active'],
      ['Date Issued', currentDate],
    ],
    footer: 'Mauritius Revenue Authority, Port Louis.',
  },

  'business-plan': {
    issuer: null,
    title: 'BUSINESS PLAN DOCUMENT',
    subtitle: 'Healthwyz Regional Operations',
    body: (p) => `Prepared by ${p.fullName}\n\nExecutive Summary: This business plan outlines the strategy for expanding the Healthwyz healthcare platform across the Indian Ocean region. Under the direction of ${p.fullName}, the plan targets Mauritius, Reunion, Madagascar, and Seychelles markets with a projected user base of 500,000 within 3 years. The plan includes market analysis, financial projections, and operational strategies for each target market.`,
    fields: (p) => [
      ['Author', p.fullName],
      ['Company', p.companyName || 'Healthwyz Regional'],
      ['Target Markets', 'Mauritius, Reunion, Madagascar, Seychelles'],
      ['Projected Users', '500,000 (3 years)'],
      ['Date', currentDate],
    ],
    footer: null,
  },

  'financial-statements': {
    issuer: 'DELOITTE MAURITIUS',
    subtitle: 'Certified Public Accountants',
    title: 'AUDITED FINANCIAL STATEMENTS',
    body: (p) => `We have audited the financial statements of ${p.companyName || 'the Company'}, managed by ${p.fullName}. In our opinion, the financial statements present fairly, in all material respects, the financial position as of December 31, 2025.`,
    fields: (p) => [
      ['Company', p.companyName || 'Company'],
      ['Director', p.fullName],
      ['Total Assets', 'Rs 15,000,000'],
      ['Net Income', 'Rs 3,200,000'],
      ['Audit Period', 'FY 2025'],
      ['Date', currentDate],
    ],
    footer: 'Deloitte Mauritius, Ebene.',
  },

  'experience-credentials': {
    issuer: null,
    title: 'CURRICULUM VITAE',
    body: (p) => `${p.fullName}\n${p.address}\n\nProfessional Summary: ${p.fullName} is a seasoned healthcare management professional with over 20 years of experience in hospital administration, public health policy, and healthcare technology. Holds an ${p.degreeTitle || 'MBA in Healthcare Management'} and has managed healthcare operations across multiple countries in the Indian Ocean region.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['Education', p.degreeTitle || 'MBA in Healthcare Management'],
      ['Experience', '20+ years in Healthcare Management'],
      ['Languages', 'English, French, Kreol Morisyen'],
      ['Date', currentDate],
    ],
    footer: null,
  },

  'regional-research': {
    issuer: null,
    title: 'MARKET RESEARCH REPORT',
    subtitle: 'Healthcare Platform Expansion - Indian Ocean Region',
    body: (p) => `Prepared by ${p.fullName}\n\nThis market research report analyses the healthcare landscape across the Indian Ocean region, with focus on telemedicine adoption, healthcare spending, and digital health readiness. The research conducted by ${p.fullName} identifies key opportunities for the Healthwyz platform expansion.`,
    fields: (p) => [
      ['Researcher', p.fullName],
      ['Region', 'Indian Ocean (Mauritius, Reunion, Madagascar, Seychelles)'],
      ['Market Size', 'USD 2.1 billion'],
      ['Digital Penetration', '42% smartphone adoption'],
      ['Date', currentDate],
    ],
    footer: null,
  },

  'legal-clearance': {
    issuer: 'MAURITIUS POLICE FORCE',
    subtitle: 'Criminal Investigation Division',
    title: 'LEGAL CLEARANCE CERTIFICATE',
    body: (p) => `This is to certify that ${p.fullName}, holder of National Identity Card number ${p.idNumber}, has been subject to a comprehensive background check including criminal records, civil litigation, and financial standing. No adverse findings were recorded.`,
    fields: (p) => [
      ['Full Name', p.fullName],
      ['ID Number', p.idNumber],
      ['Check Type', 'Comprehensive (Criminal, Civil, Financial)'],
      ['Result', 'Clear - No adverse findings'],
      ['Date of Issue', currentDate],
      ['Valid Until', '2027-03-01'],
    ],
    footer: 'Mauritius Police Force, Line Barracks, Port Louis.',
  },

  'reference-letters': {
    issuer: null,
    title: 'PROFESSIONAL REFERENCE LETTERS',
    body: (p) => `Reference 1:\nI have known ${p.fullName} for over 15 years in a professional capacity. ${p.fullName} has demonstrated exceptional leadership, strategic thinking, and deep expertise in healthcare management. I strongly recommend ${p.fullName} for any senior management role.\n- Dr. Anand Doorgakant, Former Director, Ministry of Health\n\nReference 2:\nAs a colleague, ${p.fullName} has consistently shown innovation and dedication to improving healthcare access. ${p.fullName}'s work in digital health transformation has been remarkable.\n- Prof. Marie Dupont, University of Mauritius`,
    fields: (p) => [
      ['Candidate', p.fullName],
      ['Number of References', '2'],
      ['Date', currentDate],
    ],
    footer: null,
  },
};

// ─── Generic PDF Generator ───────────────────────────────────────────────────

function generateDocument(persona, docId, template) {
  return new Promise((resolve, reject) => {
    const slug = slugify(persona.fullName);
    const filePath = path.join(outputDir, `${docId}-${slug}.pdf`);

    const isLandscape = template.layout === 'landscape';
    const doc = new PDFDocument({
      size: template.pageSize || 'A4',
      layout: template.layout || 'portrait',
      margins: isLandscape
        ? { top: 40, bottom: 40, left: 50, right: 50 }
        : { top: 50, bottom: 50, left: 60, right: 60 },
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const leftMargin = isLandscape ? 50 : 60;
    const rightEdge = isLandscape ? 545 : 535;

    // Issuer header
    if (template.issuer) {
      doc.fontSize(isLandscape ? 16 : 18).font('Helvetica-Bold')
        .text(template.issuer, { align: 'center' });
      doc.moveDown(0.4);
    }

    // Subtitle
    if (template.subtitle) {
      doc.fontSize(isLandscape ? 11 : 13).font('Helvetica')
        .text(template.subtitle, { align: 'center' });
      doc.moveDown(0.3);
    }

    // Title
    doc.fontSize(isLandscape ? 13 : 15).font('Helvetica-Bold')
      .text(template.title, { align: 'center' });
    doc.moveDown(0.3);

    // Divider
    doc.moveTo(leftMargin, doc.y).lineTo(rightEdge, doc.y)
      .strokeColor('#333333').lineWidth(1).stroke();
    doc.moveDown(1);

    // Body paragraph
    if (template.body) {
      const bodyText = template.body(persona);
      doc.fontSize(11).font('Helvetica').text(bodyText, { lineGap: 4 });
      doc.moveDown(1);
    }

    // Key-value fields
    if (template.fields) {
      const fields = template.fields(persona);
      doc.fontSize(11);
      for (const [label, value] of fields) {
        doc.font('Helvetica-Bold').text(`${label}: `, { continued: true });
        doc.font('Helvetica').text(value || 'N/A');
        doc.moveDown(0.6);
      }
    }

    // Footer
    if (template.footer) {
      doc.moveDown(1.5);
      doc.fontSize(8).font('Helvetica').fillColor('#888888')
        .text(template.footer, { align: 'center' });
    }

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clean old generated files
  const existing = fs.readdirSync(outputDir).filter(f => f.endsWith('.pdf'));
  for (const f of existing) {
    fs.unlinkSync(path.join(outputDir, f));
  }

  let count = 0;

  for (const persona of personas) {
    const docIds = DOCS_PER_TYPE[persona.userType];
    if (!docIds) {
      console.warn(`No document config for userType "${persona.userType}" (${persona.fullName}), skipping.`);
      continue;
    }

    for (const docId of docIds) {
      const template = TEMPLATES[docId];
      if (!template) {
        console.warn(`No template for document "${docId}", skipping.`);
        continue;
      }

      await generateDocument(persona, docId, template);
      count++;
    }
  }

  console.log(`Generated ${count} documents for ${personas.length} personas successfully.`);
}

main().catch((err) => {
  console.error('Error generating documents:', err);
  process.exit(1);
});
