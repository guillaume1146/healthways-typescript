import { PrismaClient } from '@prisma/client'

export async function seedClinicalData(prisma: PrismaClient) {
  // Medical Records
  const records = [
    { id: 'MR001', patientId: 'PPROF001', doctorId: 'DPROF001', title: 'Annual Diabetes Checkup', date: new Date('2024-11-15'), type: 'consultation', summary: 'Routine diabetes management review. HbA1c stable at 6.8%.', diagnosis: 'Type 2 Diabetes - well controlled', treatment: 'Continue current medication regimen', notes: 'Next checkup in 3 months' },
    { id: 'MR002', patientId: 'PPROF001', doctorId: 'DPROF003', title: 'Cardiac Screening', date: new Date('2024-10-20'), type: 'consultation', summary: 'Preventive cardiac screening. ECG normal. Lipid panel within target.', diagnosis: 'No cardiac abnormalities', treatment: 'Continue statins' },
    { id: 'MR003', patientId: 'PPROF002', doctorId: 'DPROF002', title: 'Asthma Follow-up', date: new Date('2024-12-01'), type: 'consultation', summary: 'Asthma well controlled with current inhaler. No nocturnal symptoms.', diagnosis: 'Mild persistent asthma', treatment: 'Continue Salbutamol as needed' },
    { id: 'MR004', patientId: 'PPROF003', doctorId: 'DPROF002', title: 'General Health Checkup', date: new Date('2024-11-10'), type: 'consultation', summary: 'Annual health checkup. All vitals normal. No concerns.', diagnosis: 'Healthy', treatment: 'Continue healthy lifestyle' },
    { id: 'MR005', patientId: 'PPROF004', doctorId: 'DPROF003', title: 'Cholesterol Management Review', date: new Date('2024-12-05'), type: 'consultation', summary: 'LDL slightly elevated. Adjust medication.', diagnosis: 'Hypercholesterolemia', treatment: 'Increase Atorvastatin to 40mg' },
  ]
  await prisma.medicalRecord.createMany({ data: records })

  // Prescriptions
  const prescriptions = [
    { id: 'PRE001', patientId: 'PPROF001', doctorId: 'DPROF001', date: new Date('2024-11-15'), diagnosis: 'Type 2 Diabetes', isActive: true, nextRefill: new Date('2025-02-15'), notes: 'Take with meals' },
    { id: 'PRE002', patientId: 'PPROF001', doctorId: 'DPROF001', date: new Date('2024-11-15'), diagnosis: 'Hypertension', isActive: true, nextRefill: new Date('2025-02-15') },
    { id: 'PRE003', patientId: 'PPROF002', doctorId: 'DPROF002', date: new Date('2024-12-01'), diagnosis: 'Asthma', isActive: true, notes: 'Use as needed for symptoms' },
    { id: 'PRE004', patientId: 'PPROF004', doctorId: 'DPROF003', date: new Date('2024-12-05'), diagnosis: 'Hypercholesterolemia', isActive: true, nextRefill: new Date('2025-03-05') },
    { id: 'PRE005', patientId: 'PPROF001', doctorId: 'DPROF002', date: new Date('2024-06-10'), diagnosis: 'Seasonal allergies', isActive: false, notes: 'Completed course' },
  ]
  await prisma.prescription.createMany({ data: prescriptions })

  // Prescription Medicines
  const prescMeds = [
    { prescriptionId: 'PRE001', medicineId: 'MED001', dosage: '500mg', frequency: 'Twice daily', duration: '3 months', instructions: 'Take with food' },
    { prescriptionId: 'PRE002', medicineId: 'MED002', dosage: '10mg', frequency: 'Once daily', duration: 'Ongoing', instructions: 'Take in the morning' },
    { prescriptionId: 'PRE002', medicineId: 'MED004', dosage: '5mg', frequency: 'Once daily', duration: 'Ongoing' },
    { prescriptionId: 'PRE003', medicineId: 'MED010', dosage: '100mcg', frequency: 'As needed', duration: '6 months', instructions: '2 puffs when needed' },
    { prescriptionId: 'PRE004', medicineId: 'MED003', dosage: '40mg', frequency: 'Once daily', duration: 'Ongoing', instructions: 'Take at bedtime' },
    { prescriptionId: 'PRE005', medicineId: 'MED009', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
  ]
  await prisma.prescriptionMedicine.createMany({ data: prescMeds })

  // Vital Signs
  const vitals = [
    { patientId: 'PPROF001', recordedAt: new Date('2024-11-15T10:00:00'), systolicBP: 130, diastolicBP: 85, heartRate: 72, temperature: 36.6, weight: 68.5, height: 165, oxygenSaturation: 98, glucose: 110, cholesterol: 195, facility: 'City Medical Center', recordedBy: 'Lab Tech Lisa' },
    { patientId: 'PPROF001', recordedAt: new Date('2024-08-20T09:30:00'), systolicBP: 135, diastolicBP: 88, heartRate: 75, temperature: 36.7, weight: 69.0, height: 165, oxygenSaturation: 97, glucose: 125, cholesterol: 210, facility: 'City Medical Center', recordedBy: 'Lab Tech Lisa' },
    { patientId: 'PPROF002', recordedAt: new Date('2024-12-01T11:00:00'), systolicBP: 120, diastolicBP: 78, heartRate: 68, temperature: 36.5, weight: 75.0, height: 178, oxygenSaturation: 99, facility: 'Rose Hill Medical Clinic', recordedBy: 'Lab Tech Mark' },
    { patientId: 'PPROF003', recordedAt: new Date('2024-11-10T14:00:00'), systolicBP: 118, diastolicBP: 75, heartRate: 70, temperature: 36.4, weight: 62.0, height: 160, oxygenSaturation: 99, facility: 'City Medical Center', recordedBy: 'Lab Tech Lisa' },
    { patientId: 'PPROF004', recordedAt: new Date('2024-12-05T08:30:00'), systolicBP: 128, diastolicBP: 82, heartRate: 74, temperature: 36.6, weight: 82.0, height: 175, oxygenSaturation: 98, cholesterol: 245, facility: 'Cardiac Care Center', recordedBy: 'Lab Tech Sarah' },
  ]
  await prisma.vitalSigns.createMany({ data: vitals })

  // Lab Tests
  const labTests = [
    { id: 'LT001', patientId: 'PPROF001', testName: 'HbA1c', category: 'Blood Sugar', orderedAt: new Date('2024-11-15'), completedAt: new Date('2024-11-16'), status: 'completed', facility: 'City Medical Center', orderedBy: 'Dr. Sarah Johnson' },
    { id: 'LT002', patientId: 'PPROF001', testName: 'Complete Blood Count', category: 'Hematology', orderedAt: new Date('2024-11-15'), completedAt: new Date('2024-11-16'), status: 'completed', facility: 'City Medical Center', orderedBy: 'Dr. Sarah Johnson' },
    { id: 'LT003', patientId: 'PPROF004', testName: 'Lipid Panel', category: 'Cardiology', orderedAt: new Date('2024-12-05'), completedAt: new Date('2024-12-06'), status: 'completed', facility: 'Cardiac Care Center', orderedBy: 'Dr. Marie Dupont' },
    { id: 'LT004', patientId: 'PPROF002', testName: 'Pulmonary Function Test', category: 'Pulmonology', orderedAt: new Date('2024-12-10'), status: 'pending', facility: 'Rose Hill Medical Clinic', orderedBy: 'Dr. Raj Patel' },
  ]
  await prisma.labTest.createMany({ data: labTests })

  const labResults = [
    { labTestId: 'LT001', parameter: 'HbA1c', value: '6.8', unit: '%', referenceMin: '4.0', referenceMax: '5.6', isAbnormal: true },
    { labTestId: 'LT002', parameter: 'Hemoglobin', value: '13.5', unit: 'g/dL', referenceMin: '12.0', referenceMax: '16.0', isAbnormal: false },
    { labTestId: 'LT002', parameter: 'WBC', value: '6.2', unit: '10^3/uL', referenceMin: '4.5', referenceMax: '11.0', isAbnormal: false },
    { labTestId: 'LT002', parameter: 'Platelets', value: '250', unit: '10^3/uL', referenceMin: '150', referenceMax: '400', isAbnormal: false },
    { labTestId: 'LT003', parameter: 'Total Cholesterol', value: '245', unit: 'mg/dL', referenceMin: '0', referenceMax: '200', isAbnormal: true },
    { labTestId: 'LT003', parameter: 'LDL', value: '160', unit: 'mg/dL', referenceMin: '0', referenceMax: '100', isAbnormal: true },
    { labTestId: 'LT003', parameter: 'HDL', value: '45', unit: 'mg/dL', referenceMin: '40', referenceMax: '60', isAbnormal: false },
    { labTestId: 'LT003', parameter: 'Triglycerides', value: '180', unit: 'mg/dL', referenceMin: '0', referenceMax: '150', isAbnormal: true },
  ]
  await prisma.labTestResult.createMany({ data: labResults })

  console.log(`  Seeded ${records.length} medical records, ${prescriptions.length} prescriptions, ${vitals.length} vital signs, ${labTests.length} lab tests`)
}
