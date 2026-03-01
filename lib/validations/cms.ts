import { z } from 'zod'

const SECTION_TYPES = ['hero', 'stats', 'services', 'detailed_services', 'specialties', 'why_choose', 'cta_banner'] as const

export const cmsSectionCreateSchema = z.object({
  sectionType: z.enum(SECTION_TYPES),
  title: z.string().min(1),
  content: z.record(z.string(), z.any()),
  sortOrder: z.number().int().optional(),
  isVisible: z.boolean().optional(),
  countryCode: z.string().length(2).toUpperCase().optional(),
})

export const cmsSectionUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.record(z.string(), z.any()).optional(),
  sortOrder: z.number().int().optional(),
  isVisible: z.boolean().optional(),
})

export const heroSlideCreateSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  imageUrl: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  countryCode: z.string().length(2).toUpperCase().optional(),
})

export const heroSlideUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export const testimonialCreateSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  countryCode: z.string().length(2).toUpperCase().optional(),
})

export const testimonialUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
})
