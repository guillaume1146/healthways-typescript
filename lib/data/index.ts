export { doctorsData, type Doctor } from './doctors'
export { nursesData, type Nurse } from './nurses'
export { nanniesData, type Nanny } from './nannies'
export { patientsData, type Patient } from './patients'

import type { Doctor } from './doctors'
import type { Nurse } from './nurses'
import type { Nanny } from './nannies'

export type HealthcareProfile = (Doctor | Nurse | Nanny) & {
  category: 'doctor' | 'nurse' | 'nanny'
}

export interface SearchFilters {
  category?: 'doctor' | 'nurse' | 'nanny' | 'all'
  specialty?: string
  location?: string
  rating?: number
  experience?: string
  availability?: 'available' | 'busy' | 'all'
  priceRange?: {
    min: number
    max: number
  }
  languages?: string[]
  verified?: boolean
  emergencyAvailable?: boolean
}
