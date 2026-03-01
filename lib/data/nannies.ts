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

export interface Nanny {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  profileImage: string
  token?: string
  specialization: string[]
  subSpecialties: string[]
  ageGroups: string[]
  rating: number
  reviews: number
  experience: string
  location: string
  address: string
  languages: string[]
  hourlyRate: number
  overnightRate: number
  availability: string
  nextAvailable: string
  bio: string
  education: string[]
  workHistory: string[]
  certifications: string[]
  services: string[]
  careTypes: string[]
  verified: boolean
  backgroundCheck: boolean
  emergencyAvailable: boolean
  phone: string
  age: number
  maxChildren: number
  yearsOfExperience: number
  patientComments: PatientComment[]
}

// Empty array - data now comes from Prisma database
export const nanniesData: Nanny[] = []
