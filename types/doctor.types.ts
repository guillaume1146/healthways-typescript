export interface PatientComment {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  patientProfileImage: string;
  comment: string;
  starRating: number;
  date: string;
  time: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'patient' | 'doctor';
  message: string;
  timestamp: string;
  attachments?: string[];
  read: boolean;
  messageType: 'text' | 'image' | 'video' | 'file' | 'voice';
}

export interface PatientChat {
  patientId: string;
  patientName: string;
  patientProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface DoctorPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  status: 'active' | 'inactive' | 'discharged';
  lastVisit: string;
  nextAppointment?: string;
  totalVisits: number;
  prescriptionsIssued: number;
  videoCallLink: string; // Format: /doctor/video-call/{patientFirstName}_{doctorFirstName}_{uniqueId}
  medicalRecordLink: string;
  prescriptionLink: string;
}

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientProfileImage: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  duration: number; // in minutes
  notes?: string;
  meetingLink?: string;
  followUpRequired: boolean;
}

export interface DoctorDocument {
  id: string;
  type: 'license' | 'degree' | 'certification' | 'insurance' | 'cv' | 'other';
  name: string;
  uploadDate: string;
  url: string;
  expiryDate?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  size: string;
}

export interface BillingAccount {
  id: string;
  type: 'credit_card' | 'mcb_juice' | 'bank_account';
  accountNumber: string;
  accountHolder: string;
  bankName?: string;
  expiryDate?: string;
  isDefault: boolean;
  isReceivingAccount: boolean; // For receiving payments from patients
  addedDate: string;
}

export interface DoctorSubscription {
  type: 'free' | 'professional' | 'premium' | 'enterprise';
  planName: string;
  startDate: string;
  endDate?: string;
  features: string[];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  paymentMethod: string;
  limits: {
    monthlyPatients: number;
    videoCallHours: number;
    storageGB: number;
    teamMembers: number;
  };
}

export interface NotificationSettings {
  appointments: boolean;
  newPatients: boolean;
  patientMessages: boolean;
  prescriptionRefills: boolean;
  labResults: boolean;
  emergencyAlerts: boolean;
  platformUpdates: boolean;
  marketingEmails: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  sessionTimeout: number; // in minutes
  loginHistory: {
    date: string;
    time: string;
    device: string;
    location: string;
    ipAddress: string;
    status: 'success' | 'failed';
  }[];
  trustedDevices: {
    id: string;
    name: string;
    type: string;
    lastUsed: string;
  }[];
  lastPasswordChange: string;
  passwordExpiryDays: number;
}

export interface LanguagePreferences {
  primaryLanguage: string;
  consultationLanguages: string[];
  documentLanguage: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  timezone: string;
}

export interface DoctorRevenue {
  month: string;
  consultations: number;
  earnings: number;
  averagePerConsultation: number;
  pendingPayments: number;
}

export interface PerformanceMetrics {
  totalPatientsTreated: number;
  averageRating: number;
  totalReviews: number;
  consultationCompletionRate: number;
  averageResponseTime: number; // in hours
  patientSatisfactionScore: number;
  prescriptionsIssued: number;
  emergenciesHandled: number;
}

export interface WorkSchedule {
  dayOfWeek: string;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breakStart?: string;
  breakEnd?: string;
  slotsAvailable?: number;
}

export interface Doctor {
  // Existing fields
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  token: string;
  category: string;
  specialty: string[];
  subSpecialties: string[];
  clinicAffiliation: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  address: string;
  languages: string[];
  consultationFee: number;
  videoConsultationFee: number;
  availability: string;
  nextAvailable: string;
  bio: string;
  education: string[];
  workHistory: string[];
  certifications: string[];
  consultationTypes: string[];
  emergencyAvailable: boolean;
  phone: string;
  age: number;
  verified: boolean;
  patientComments: PatientComment[];
  
  // New enhanced fields
  currentPatients: DoctorPatient[];
  pastPatients: DoctorPatient[];
  upcomingAppointments: DoctorAppointment[];
  pastAppointments: DoctorAppointment[];
  chatHistory: PatientChat[];
  documents: DoctorDocument[];
  billingAccounts: BillingAccount[];
  subscription: DoctorSubscription;
  notificationSettings: NotificationSettings;
  securitySettings: SecuritySettings;
  languagePreferences: LanguagePreferences;
  revenue: DoctorRevenue[];
  performanceMetrics: PerformanceMetrics;
  weeklySchedule: WorkSchedule[];
  profileCompleteness: number;
  registrationDate: string;
  lastLogin: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  malpracticeInsurance: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: string;
  };
  specialEquipment: string[];
  telemedicineSetup: {
    camera: boolean;
    microphone: boolean;
    internetSpeed: string;
    preferredPlatform: string;
  };
  awardsAndRecognitions: {
    title: string;
    year: string;
    organization: string;
  }[];
}