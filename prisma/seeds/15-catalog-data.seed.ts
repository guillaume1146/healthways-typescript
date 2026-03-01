import { PrismaClient } from '@prisma/client'

export async function seedCatalogData(prisma: PrismaClient) {
  console.log('Seeding catalog data...')

  // ── Pharmacy Medicines ──────────────────────────────────────────────────────

  const medicines = [
    // CarePharm Central (PHPROF001)
    { pharmacistId: 'PHPROF001', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Pain Relief', description: 'Effective pain reliever and fever reducer for mild to moderate pain.', dosageForm: 'Tablet', strength: '500mg', price: 45, quantity: 200, inStock: true, requiresPrescription: false, sideEffects: ['Nausea', 'Liver damage (overdose)'] },
    { pharmacistId: 'PHPROF001', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotics', description: 'Broad-spectrum antibiotic for bacterial infections.', dosageForm: 'Capsule', strength: '250mg', price: 120, quantity: 150, inStock: true, requiresPrescription: true, sideEffects: ['Diarrhea', 'Nausea', 'Rash'] },
    { pharmacistId: 'PHPROF001', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Digestive Health', description: 'Proton pump inhibitor for acid reflux and stomach ulcers.', dosageForm: 'Capsule', strength: '20mg', price: 85, quantity: 100, inStock: true, requiresPrescription: false, sideEffects: ['Headache', 'Nausea', 'Abdominal pain'] },
    { pharmacistId: 'PHPROF001', name: 'Metformin 500mg', genericName: 'Metformin HCl', category: 'Diabetes', description: 'First-line medication for type 2 diabetes management.', dosageForm: 'Tablet', strength: '500mg', price: 95, quantity: 180, inStock: true, requiresPrescription: true, sideEffects: ['Nausea', 'Diarrhea', 'Abdominal discomfort'] },
    { pharmacistId: 'PHPROF001', name: 'Cetirizine 10mg', genericName: 'Cetirizine HCl', category: 'Allergy', description: 'Non-drowsy antihistamine for allergy relief.', dosageForm: 'Tablet', strength: '10mg', price: 55, quantity: 250, inStock: true, requiresPrescription: false, sideEffects: ['Drowsiness', 'Dry mouth'] },
    { pharmacistId: 'PHPROF001', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Pain Relief', description: 'Anti-inflammatory pain reliever for headaches, muscle pain, and arthritis.', dosageForm: 'Tablet', strength: '400mg', price: 60, quantity: 300, inStock: true, requiresPrescription: false, sideEffects: ['Stomach irritation', 'Nausea', 'Dizziness'] },
    // MediPlus Pharmacy (PHPROF002)
    { pharmacistId: 'PHPROF002', name: 'Salbutamol Inhaler', genericName: 'Salbutamol', category: 'Respiratory', description: 'Fast-acting bronchodilator for asthma and COPD relief.', dosageForm: 'Inhaler', strength: '100mcg/dose', price: 250, quantity: 80, inStock: true, requiresPrescription: true, sideEffects: ['Tremor', 'Rapid heartbeat', 'Headache'] },
    { pharmacistId: 'PHPROF002', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', category: 'Cardiovascular', description: 'Statin medication to lower cholesterol and reduce heart disease risk.', dosageForm: 'Tablet', strength: '20mg', price: 150, quantity: 120, inStock: true, requiresPrescription: true, sideEffects: ['Muscle pain', 'Headache', 'Nausea'] },
    { pharmacistId: 'PHPROF002', name: 'Vitamin D3 1000IU', genericName: 'Cholecalciferol', category: 'Vitamins', description: 'Essential vitamin D supplement for bone health and immune support.', dosageForm: 'Capsule', strength: '1000IU', price: 180, quantity: 500, inStock: true, requiresPrescription: false, sideEffects: ['Nausea (high doses)', 'Constipation'] },
    { pharmacistId: 'PHPROF002', name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'Cardiovascular', description: 'Calcium channel blocker for hypertension and angina.', dosageForm: 'Tablet', strength: '5mg', price: 75, quantity: 90, inStock: true, requiresPrescription: true, sideEffects: ['Swollen ankles', 'Flushing', 'Headache'] },
    { pharmacistId: 'PHPROF002', name: 'Cough Syrup DM', genericName: 'Dextromethorphan', category: 'Respiratory', description: 'Cough suppressant for dry, non-productive cough relief.', dosageForm: 'Syrup', strength: '15mg/5ml', price: 90, quantity: 160, inStock: true, requiresPrescription: false, sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'] },
    { pharmacistId: 'PHPROF002', name: 'Diclofenac Gel 1%', genericName: 'Diclofenac', category: 'Pain Relief', description: 'Topical anti-inflammatory gel for joint and muscle pain.', dosageForm: 'Cream', strength: '1%', price: 135, quantity: 75, inStock: true, requiresPrescription: false, sideEffects: ['Skin irritation', 'Redness at application site'] },
  ]

  for (const med of medicines) {
    await prisma.pharmacyMedicine.create({ data: med })
  }
  console.log(`  Seeded ${medicines.length} pharmacy medicines`)

  // ── Lab Test Catalog ────────────────────────────────────────────────────────

  const labTests = [
    // HealthLab Mauritius (LTPROF001)
    { labTechId: 'LTPROF001', testName: 'Complete Blood Count (CBC)', category: 'Blood', description: 'Measures red blood cells, white blood cells, hemoglobin, hematocrit, and platelets.', price: 500, turnaroundTime: '4-6 hours', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF001', testName: 'Lipid Panel', category: 'Blood', description: 'Measures cholesterol levels including HDL, LDL, triglycerides, and total cholesterol.', price: 800, turnaroundTime: '24 hours', sampleType: 'Blood', preparation: '12 hours fasting required' },
    { labTechId: 'LTPROF001', testName: 'HbA1c (Glycated Hemoglobin)', category: 'Blood', description: 'Measures average blood sugar levels over the past 2-3 months for diabetes monitoring.', price: 650, turnaroundTime: '24 hours', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF001', testName: 'Liver Function Test (LFT)', category: 'Blood', description: 'Evaluates liver health by measuring enzymes, proteins, and bilirubin levels.', price: 900, turnaroundTime: '24 hours', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF001', testName: 'Thyroid Panel (TSH, T3, T4)', category: 'Blood', description: 'Comprehensive thyroid function assessment measuring TSH, Free T3, and Free T4.', price: 1200, turnaroundTime: '24-48 hours', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF001', testName: 'Urinalysis', category: 'Urine', description: 'Complete urine analysis for kidney function, infections, and metabolic conditions.', price: 350, turnaroundTime: '2-4 hours', sampleType: 'Urine', preparation: 'Mid-stream clean catch sample' },
    // BioAnalytics Lab (LTPROF002)
    { labTechId: 'LTPROF002', testName: 'COVID-19 PCR Test', category: 'Infectious Disease', description: 'Molecular test for active SARS-CoV-2 infection using RT-PCR technology.', price: 1500, turnaroundTime: '24-48 hours', sampleType: 'Nasopharyngeal Swab', preparation: 'No special preparation' },
    { labTechId: 'LTPROF002', testName: 'Dengue NS1 Antigen', category: 'Infectious Disease', description: 'Rapid detection of dengue virus NS1 antigen for early diagnosis.', price: 800, turnaroundTime: '4-6 hours', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF002', testName: 'Kidney Function Panel', category: 'Blood', description: 'Measures creatinine, BUN, eGFR, and electrolytes to assess kidney function.', price: 750, turnaroundTime: '24 hours', sampleType: 'Blood', preparation: '8 hours fasting recommended' },
    { labTechId: 'LTPROF002', testName: 'Vitamin D Level', category: 'Blood', description: 'Measures 25-hydroxyvitamin D levels to assess vitamin D status.', price: 1000, turnaroundTime: '48 hours', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF002', testName: 'Allergy Panel (IgE)', category: 'Blood', description: 'Comprehensive allergy testing measuring IgE antibodies for common allergens.', price: 2500, turnaroundTime: '3-5 days', sampleType: 'Blood', preparation: 'No fasting required' },
    { labTechId: 'LTPROF002', testName: 'Stool Culture', category: 'Microbiology', description: 'Identifies bacterial pathogens in stool samples for gastrointestinal infections.', price: 600, turnaroundTime: '48-72 hours', sampleType: 'Stool', preparation: 'Fresh sample required' },
  ]

  for (const test of labTests) {
    await prisma.labTestCatalog.create({ data: test })
  }
  console.log(`  Seeded ${labTests.length} lab test catalog entries`)

  // ── Emergency Service Listings ──────────────────────────────────────────────

  const emergencyServices = [
    // Jean-Marc Lafleur (EWPROF001)
    { workerId: 'EWPROF001', serviceName: 'Advanced Life Support Ambulance', serviceType: 'Ambulance', description: 'Fully equipped ALS ambulance with paramedic crew for medical emergencies, cardiac events, and trauma.', responseTime: '10-15 minutes', available24h: true, coverageArea: 'Port Louis & Northern Districts', contactNumber: '+230 5789 2001', price: 3500, specializations: ['Cardiac Emergencies', 'Trauma Care', 'Critical Transport'] },
    { workerId: 'EWPROF001', serviceName: 'Medical Event Coverage', serviceType: 'First Aid', description: 'On-site medical support for corporate events, sports competitions, and public gatherings.', responseTime: 'On-site', available24h: false, coverageArea: 'Island-wide', contactNumber: '+230 5789 2001', price: 8000, specializations: ['Event Medicine', 'Mass Casualty Triage'] },
    { workerId: 'EWPROF001', serviceName: 'Inter-Hospital Transfer', serviceType: 'Medical Transport', description: 'Safe and monitored patient transfer between hospitals with medical team escort.', responseTime: '30 minutes', available24h: true, coverageArea: 'Island-wide', contactNumber: '+230 5789 2001', price: 5000, specializations: ['Patient Transfer', 'ICU Transport'] },
    // Fatima Joomun (EWPROF002)
    { workerId: 'EWPROF002', serviceName: 'Rapid Response Motorcycle', serviceType: 'First Aid', description: 'Fast first-response motorcycle paramedic for urban emergencies, reaching patients before ambulance.', responseTime: '5-8 minutes', available24h: true, coverageArea: 'Central Plateau', contactNumber: '+230 5789 2002', price: 1500, specializations: ['First Response', 'Basic Life Support'] },
    { workerId: 'EWPROF002', serviceName: 'Community First Aid Training', serviceType: 'Training', description: 'CPR and first aid certification courses for businesses, schools, and community groups.', responseTime: 'Scheduled', available24h: false, coverageArea: 'Central Plateau & Upper Plaines', contactNumber: '+230 5789 2002', price: 2000, specializations: ['CPR Training', 'First Aid Education'] },
  ]

  for (const svc of emergencyServices) {
    await prisma.emergencyServiceListing.create({ data: svc })
  }
  console.log(`  Seeded ${emergencyServices.length} emergency service listings`)

  // ── Insurance Plan Listings ─────────────────────────────────────────────────

  const insurancePlans = [
    // Swan Life Ltd (IRPROF001)
    { insuranceRepId: 'IRPROF001', planName: 'Swan Health Essential', planType: 'Health', description: 'Comprehensive health insurance covering hospitalization, outpatient care, and specialist consultations.', monthlyPremium: 2500, annualPremium: 27000, coverageAmount: 500000, deductible: 5000, coverageDetails: ['Hospitalization', 'Outpatient care', 'Specialist consultations', 'Prescription drugs', 'Lab tests'], eligibility: 'Ages 18-65' },
    { insuranceRepId: 'IRPROF001', planName: 'Swan Family Care Plus', planType: 'Family', description: 'Family health plan covering spouse and up to 3 children with maternity benefits.', monthlyPremium: 5500, annualPremium: 60000, coverageAmount: 1000000, deductible: 3000, coverageDetails: ['Family hospitalization', 'Maternity care', 'Pediatric care', 'Dental (basic)', 'Vision check-ups', 'Vaccination'], eligibility: 'Family with children under 21' },
    { insuranceRepId: 'IRPROF001', planName: 'Swan Life Assurance', planType: 'Life', description: 'Term life insurance with death benefit and optional critical illness rider.', monthlyPremium: 1500, annualPremium: 16500, coverageAmount: 2000000, deductible: 0, coverageDetails: ['Death benefit', 'Critical illness cover', 'Accidental death benefit', 'Terminal illness benefit'], eligibility: 'Ages 21-60' },
    { insuranceRepId: 'IRPROF001', planName: 'Swan Dental Care', planType: 'Dental', description: 'Dental insurance covering preventive, basic, and major dental procedures.', monthlyPremium: 800, annualPremium: 8800, coverageAmount: 100000, deductible: 1000, coverageDetails: ['Preventive checkups', 'Fillings', 'Root canals', 'Crowns', 'Orthodontics (partial)'], eligibility: 'Ages 5-70' },
    // MUA Insurance (IRPROF002)
    { insuranceRepId: 'IRPROF002', planName: 'MUA Health Shield', planType: 'Health', description: 'Affordable health insurance with focus on hospital and surgery coverage.', monthlyPremium: 1800, annualPremium: 19800, coverageAmount: 300000, deductible: 7500, coverageDetails: ['Hospitalization', 'Surgery', 'Emergency care', 'Ambulance services'], eligibility: 'Ages 18-60' },
    { insuranceRepId: 'IRPROF002', planName: 'MUA Vision Plus', planType: 'Vision', description: 'Vision care plan covering eye exams, glasses, and contact lenses.', monthlyPremium: 450, annualPremium: 5000, coverageAmount: 50000, deductible: 500, coverageDetails: ['Annual eye exams', 'Prescription glasses', 'Contact lenses', 'Laser surgery (partial)'], eligibility: 'All ages' },
    { insuranceRepId: 'IRPROF002', planName: 'MUA Corporate Health', planType: 'Health', description: 'Group health insurance for businesses with 10+ employees. Customizable coverage options.', monthlyPremium: 1200, annualPremium: 13200, coverageAmount: 400000, deductible: 5000, coverageDetails: ['Group hospitalization', 'Outpatient care', 'Mental health support', 'Wellness programs', 'Annual health screenings'], eligibility: 'Businesses with 10+ employees' },
    { insuranceRepId: 'IRPROF002', planName: 'MUA Senior Care', planType: 'Health', description: 'Specialized health plan for seniors covering chronic conditions and home healthcare.', monthlyPremium: 3500, annualPremium: 38000, coverageAmount: 750000, deductible: 2500, coverageDetails: ['Chronic disease management', 'Home healthcare', 'Physiotherapy', 'Medical devices', 'Palliative care'], eligibility: 'Ages 55-80' },
  ]

  for (const plan of insurancePlans) {
    await prisma.insurancePlanListing.create({ data: plan })
  }
  console.log(`  Seeded ${insurancePlans.length} insurance plan listings`)

  console.log('Catalog data seeded successfully!')
}
