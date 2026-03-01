export interface PatientComment {
  id: string
  patientFirstName: string
  patientLastName: string
  patientProfileImage: string
  comment: string
  starRating: number
  date: string
  time: string
}

export interface Nurse {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  profileImage: string
  token?: string
  type: string
  specialization: string[]
  subSpecialties: string[]
  clinicAffiliation: string
  rating: number
  reviews: number
  experience: string
  location: string
  address: string
  languages: string[]
  hourlyRate: number
  videoConsultationRate: number
  availability: string
  nextAvailable: string
  bio: string
  education: string[]
  workHistory: string[]
  certifications: string[]
  services: string[]
  consultationTypes: string[]
  verified: boolean
  emergencyAvailable: boolean
  phone: string
  age: number
  patientComments: PatientComment[]
}

// Empty array - data now comes from Prisma database
export const nursesData: Nurse[] = []
