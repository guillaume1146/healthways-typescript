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

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface WorkExperience {
  position: string
  organization: string
  period: string
  current: boolean
}

export interface Certification {
  name: string
  issuingBody: string
  dateObtained: string
  expiryDate?: string
  certificateUrl?: string
}

export interface Document {
  id: string
  type: 'license' | 'degree' | 'certification' | 'insurance' | 'other'
  name: string
  uploadDate: string
  url: string
  size: string
  verified: boolean
  verifiedDate?: string
}

export interface PatientRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other'
  profileImage: string
  bloodType: string
  allergies: string[]
  chronicConditions: string[]
  status: 'active' | 'inactive'
  lastVisit: string
  nextAppointment?: string
  totalVisits: number
  totalPrescriptions: number
  roomId?: string
  medicalRecordUrl?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'doctor' | 'patient'
  message: string
  timestamp: string
  attachments?: string[]
  read: boolean
  messageType: 'text' | 'image' | 'file' | 'voice'
}

export interface PatientChat {
  patientId: string
  patientName: string
  patientImage: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: ChatMessage[]
  status: 'online' | 'offline' | 'away'
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  diagnosis: string
  medicines: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
    quantity: number
  }[]
  notes?: string
  nextRefill?: string
  isActive: boolean
  signatureUrl?: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientImage: string
  date: string
  time: string
  duration: number
  type: 'in-person' | 'video' | 'home-visit'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  reason: string
  notes?: string
  roomId?: string
  location?: string
  payment: {
    amount: number
    status: 'pending' | 'paid' | 'refunded'
    method?: 'cash' | 'card' | 'insurance' | 'mcb_juice'
  }
  prescription?: Prescription
  followUpRequired: boolean
}

export interface TimeSlot {
  time: string
  available: boolean
  appointmentId?: string
}

export interface DailySchedule {
  date: string
  slots: TimeSlot[]
  totalAppointments: number
  availableSlots: number
}

export interface Availability {
  monday: { start: string; end: string; isAvailable: boolean }
  tuesday: { start: string; end: string; isAvailable: boolean }
  wednesday: { start: string; end: string; isAvailable: boolean }
  thursday: { start: string; end: string; isAvailable: boolean }
  friday: { start: string; end: string; isAvailable: boolean }
  saturday: { start: string; end: string; isAvailable: boolean }
  sunday: { start: string; end: string; isAvailable: boolean }
  slotDuration: number
  breakTime: {
    start: string
    end: string
  }
  vacationDates: {
    start: string
    end: string
  }[]
}

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  swift: string
  iban?: string
  isDefault: boolean
  addedDate: string
}

export interface PaymentMethod {
  id: string
  type: 'credit_card' | 'mcb_juice' | 'bank_transfer'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  bankAccount?: BankAccount
  isDefault: boolean
  addedDate: string
}

export interface Transaction {
  id: string
  date: string
  time: string
  patientId: string
  patientName: string
  amount: number
  type: 'consultation' | 'video_consultation' | 'procedure' | 'emergency'
  paymentMethod: 'cash' | 'card' | 'insurance' | 'mcb_juice'
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  invoiceUrl?: string
  receiptUrl?: string
}

export interface EarningsStats {
  today: number
  thisWeek: number
  thisMonth: number
  thisYear: number
  totalEarnings: number
  pendingPayouts: number
  averageConsultationFee: number
}

export interface SubscriptionPlan {
  type: 'free' | 'professional' | 'premium' | 'enterprise'
  planName: string
  startDate: string
  endDate?: string
  features: string[]
  price: number
  billingCycle: 'monthly' | 'yearly'
  autoRenew: boolean
  paymentMethod?: PaymentMethod
  nextBillingDate?: string
  usage: {
    consultations: {
      used: number
      limit: number
    }
    videoConsultations: {
      used: number
      limit: number
    }
    storage: {
      used: number
      limit: number
    }
    smsNotifications: {
      used: number
      limit: number
    }
  }
}

export interface NotificationSettings {
  appointments: boolean
  newPatients: boolean
  prescriptionRefills: boolean
  labResults: boolean
  emergencyAlerts: boolean
  chatMessages: boolean
  paymentReceived: boolean
  reviewsReceived: boolean
  systemUpdates: boolean
  marketingEmails: boolean
  notificationTime: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'patients_only' | 'private'
  showContactInfo: boolean
  showEducation: boolean
  showExperience: boolean
  allowReviews: boolean
  shareDataForResearch: boolean
  twoFactorAuth: boolean
  sessionTimeout: number
}

export interface LanguageSettings {
  preferredLanguage: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  timezone: string
  currency: string
}

export interface PerformanceMetrics {
  averageRating: number
  totalReviews: number
  patientSatisfaction: number
  responseTime: number
  appointmentCompletionRate: number
  prescriptionAccuracy: number
  returnPatientRate: number
}

export interface Statistics {
  totalPatients: number
  activePatients: number
  newPatientsThisMonth: number
  totalConsultations: number
  consultationsThisMonth: number
  videoConsultations: number
  emergencyConsultations: number
  averageConsultationDuration: number
  totalPrescriptions: number
  totalRevenue: number
  topConditionsTreated: {
    condition: string
    count: number
  }[]
  patientDemographics: {
    ageGroups: {
      range: string
      count: number
    }[]
    gender: {
      male: number
      female: number
      other: number
    }
  }
}

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  email: string
  password?: string
  profileImage: string
  token?: string
  category: string
  specialty: string[]
  subSpecialties: string[]
  licenseNumber: string
  licenseExpiryDate: string
  clinicAffiliation: string
  hospitalPrivileges: string[]
  rating: number
  reviews: number
  patientComments: PatientComment[]
  performanceMetrics?: PerformanceMetrics
  experience: string
  education: Education[]
  workHistory: WorkExperience[]
  certifications: Certification[]
  publications?: string[]
  awards?: string[]
  location: string
  address: string
  phone: string
  alternatePhone?: string
  website?: string
  socialMedia?: {
    linkedin?: string
    twitter?: string
    facebook?: string
  }
  languages: string[]
  availability?: string
  detailedAvailability?: Availability
  nextAvailable: string
  consultationDuration: number
  consultationFee: number
  videoConsultationFee: number
  emergencyConsultationFee: number
  consultationTypes: string[]
  emergencyAvailable: boolean
  homeVisitAvailable: boolean
  telemedicineAvailable: boolean
  age: number
  gender?: 'Male' | 'Female' | 'Other'
  dateOfBirth?: string
  nationality?: string
  bio: string
  philosophy?: string
  specialInterests?: string[]
  verified: boolean
  verificationDate?: string
  verificationDocuments?: Document[]
  insuranceCoverage?: {
    provider: string
    policyNumber: string
    validUntil: string
    coverageAmount: number
  }
  patients?: {
    current: PatientRecord[]
    past: PatientRecord[]
  }
  patientChats?: PatientChat[]
  upcomingAppointments?: Appointment[]
  pastAppointments?: Appointment[]
  todaySchedule?: DailySchedule
  weeklySchedule?: DailySchedule[]
  prescriptions?: Prescription[]
  prescriptionTemplates?: {
    id: string
    name: string
    condition: string
    medicines: string[]
  }[]
  billing?: {
    receiveMethods: PaymentMethod[]
    bankAccounts: BankAccount[]
    transactions: Transaction[]
    earnings: EarningsStats
    taxId: string
    taxRate: number
  }
  subscription?: SubscriptionPlan
  notificationSettings?: NotificationSettings
  privacySettings?: PrivacySettings
  languageSettings?: LanguageSettings
  statistics?: Statistics
  registrationDate?: string
  lastLogin?: string
  lastPasswordChange?: string
  accountStatus?: 'active' | 'suspended' | 'pending_verification'
  loginHistory?: {
    date: string
    time: string
    device: string
    location: string
    ipAddress: string
  }[]
}

// Empty array - data now comes from Prisma database
export const doctorsData: Doctor[] = []
