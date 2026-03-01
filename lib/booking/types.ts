export type ConsultationType = 'in_person' | 'home_visit' | 'video'
export type BookingType = 'doctor' | 'nurse' | 'nanny' | 'lab-test' | 'emergency'

export interface BookingFormData {
  providerId: string
  providerType: BookingType
  consultationType?: ConsultationType
  scheduledDate: string
  scheduledTime: string
  reason: string
  notes?: string
  duration?: number
  // Lab-specific
  testName?: string
  sampleType?: string
  // Emergency-specific
  emergencyType?: string
  location?: string
  contactNumber?: string
  priority?: string
  // Childcare-specific
  children?: string[]
}

export interface ProviderInfo {
  id: string
  name: string
  specialty?: string
  rating?: number
  price?: number
  imageUrl?: string
  location?: string
}

export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
  in_person: 'In-Person (At Clinic/Hospital)',
  home_visit: 'Home Visit (Provider comes to you)',
  video: 'Teleconsultation (Video Call)',
}

export const CONSULTATION_TYPE_ICONS: Record<ConsultationType, string> = {
  in_person: 'hospital',
  home_visit: 'home',
  video: 'video',
}
