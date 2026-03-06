import { z } from 'zod'

export const baseServiceSchema = z.object({
  serviceName: z.string().min(2, 'Service name must be at least 2 characters').max(200),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().min(5, 'Description must be at least 5 characters').max(2000),
  price: z.number().min(0, 'Price must be positive').max(1000000),
  currency: z.string().default('MUR'),
  isActive: z.boolean().default(true),
})

export const doctorServiceSchema = baseServiceSchema.extend({
  duration: z.number().int().min(5).max(480).default(30),
})

export const nurseServiceSchema = baseServiceSchema.extend({
  duration: z.string().min(1).max(50), // e.g. "30 minutes", "1 hour"
})

export const nannyServiceSchema = baseServiceSchema.extend({
  ageRange: z.string().max(50).optional(),
})

export const labTestSchema = baseServiceSchema.extend({
  turnaroundTime: z.string().min(1).max(100),
  sampleType: z.string().min(1).max(100),
  preparation: z.string().max(500).optional(),
})

export const emergencyServiceSchema = baseServiceSchema.extend({
  serviceType: z.string().min(1).max(100),
  responseTime: z.string().min(1).max(100),
  coverageArea: z.string().min(1).max(200),
  contactNumber: z.string().min(1).max(50),
  available24h: z.boolean().default(true),
  specializations: z.array(z.string()).default([]),
})

// Category options per provider type
export const DOCTOR_SERVICE_CATEGORIES = [
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Screening', label: 'Screening' },
  { value: 'Therapy', label: 'Therapy' },
  { value: 'Procedure', label: 'Procedure' },
  { value: 'Diagnostic', label: 'Diagnostic' },
  { value: 'Follow-up', label: 'Follow-up' },
  { value: 'Emergency', label: 'Emergency' },
  { value: 'Other', label: 'Other' },
]

export const NURSE_SERVICE_CATEGORIES = [
  { value: 'Wound Care', label: 'Wound Care' },
  { value: 'Monitoring', label: 'Monitoring' },
  { value: 'Medication', label: 'Medication' },
  { value: 'Assessment', label: 'Assessment' },
  { value: 'Post-Surgery', label: 'Post-Surgery' },
  { value: 'Chronic Care', label: 'Chronic Care' },
  { value: 'Education', label: 'Education' },
  { value: 'Injection', label: 'Injection' },
  { value: 'Other', label: 'Other' },
]

export const NANNY_SERVICE_CATEGORIES = [
  { value: 'Educational', label: 'Educational' },
  { value: 'Creative', label: 'Creative' },
  { value: 'Health & Safety', label: 'Health & Safety' },
  { value: 'Daily Care', label: 'Daily Care' },
  { value: 'Physical Activity', label: 'Physical Activity' },
  { value: 'Language', label: 'Language' },
  { value: 'Music', label: 'Music' },
  { value: 'Special Needs', label: 'Special Needs' },
  { value: 'Other', label: 'Other' },
]

export const LAB_TEST_CATEGORIES = [
  { value: 'Blood', label: 'Blood' },
  { value: 'Urine', label: 'Urine' },
  { value: 'Imaging', label: 'Imaging' },
  { value: 'Genetic', label: 'Genetic' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'Microbiology', label: 'Microbiology' },
  { value: 'Hormone', label: 'Hormone' },
  { value: 'Other', label: 'Other' },
]

export const EMERGENCY_SERVICE_TYPES = [
  { value: 'Ambulance', label: 'Ambulance' },
  { value: 'First Aid', label: 'First Aid' },
  { value: 'Rescue', label: 'Rescue' },
  { value: 'Medical Transport', label: 'Medical Transport' },
  { value: 'Training', label: 'Training' },
  { value: 'Other', label: 'Other' },
]
