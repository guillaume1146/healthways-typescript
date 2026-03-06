import { z } from 'zod'

export const pharmacyMedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  genericName: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  dosageForm: z.string().min(1, 'Dosage form is required'),
  strength: z.string().min(1, 'Strength is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be 0 or more').optional(),
  inStock: z.boolean().optional(),
  requiresPrescription: z.boolean().optional(),
  sideEffects: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const labTestCatalogSchema = z.object({
  testName: z.string().min(1, 'Test name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  turnaroundTime: z.string().min(1, 'Turnaround time is required'),
  sampleType: z.string().min(1, 'Sample type is required'),
  preparation: z.string().optional(),
})

export const nurseServiceCatalogSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  duration: z.string().min(1, 'Duration is required'),
})

export const nannyServiceCatalogSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  ageRange: z.string().optional(),
})

export const emergencyServiceSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  description: z.string().min(1, 'Description is required'),
  responseTime: z.string().min(1, 'Response time is required'),
  available24h: z.boolean().optional(),
  coverageArea: z.string().min(1, 'Coverage area is required'),
  contactNumber: z.string().min(1, 'Contact number is required'),
  price: z.number().positive().optional(),
  specializations: z.array(z.string()).optional(),
})

export const insurancePlanSchema = z.object({
  planName: z.string().min(1, 'Plan name is required'),
  planType: z.string().min(1, 'Plan type is required'),
  description: z.string().min(1, 'Description is required'),
  monthlyPremium: z.number().positive('Monthly premium must be positive'),
  annualPremium: z.number().positive().optional(),
  coverageAmount: z.number().positive('Coverage amount must be positive'),
  deductible: z.number().min(0).optional(),
  coverageDetails: z.array(z.string()).optional(),
  eligibility: z.string().optional(),
})
