// Enhanced Doctor Data Structure with Comprehensive TypeScript Interfaces

// ============= CORE INTERFACES =============

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

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface WorkExperience {
  position: string;
  organization: string;
  period: string;
  current: boolean;
}

export interface Certification {
  name: string;
  issuingBody: string;
  dateObtained: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface Document {
  id: string;
  type: 'license' | 'degree' | 'certification' | 'insurance' | 'other';
  name: string;
  uploadDate: string;
  url: string;
  size: string;
  verified: boolean;
  verifiedDate?: string;
}

// ============= PATIENT MANAGEMENT INTERFACES =============

export interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  profileImage: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  status: 'active' | 'inactive';
  lastVisit: string;
  nextAppointment?: string;
  totalVisits: number;
  totalPrescriptions: number;
  videoCallLink?: string;
  medicalRecordUrl?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'doctor' | 'patient';
  message: string;
  timestamp: string;
  attachments?: string[];
  read: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice';
}

export interface PatientChat {
  patientId: string;
  patientName: string;
  patientImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  status: 'online' | 'offline' | 'away';
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  diagnosis: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity: number;
  }[];
  notes?: string;
  nextRefill?: string;
  isActive: boolean;
  signatureUrl?: string;
}

// ============= APPOINTMENT INTERFACES =============

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  date: string;
  time: string;
  duration: number;
  type: 'in-person' | 'video' | 'home-visit';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  videoCallLink?: string;
  location?: string;
  payment: {
    amount: number;
    status: 'pending' | 'paid' | 'refunded';
    method?: 'cash' | 'card' | 'insurance' | 'mcb_juice';
  };
  prescription?: Prescription;
  followUpRequired: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface DailySchedule {
  date: string;
  slots: TimeSlot[];
  totalAppointments: number;
  availableSlots: number;
}

export interface Availability {
  monday: { start: string; end: string; isAvailable: boolean };
  tuesday: { start: string; end: string; isAvailable: boolean };
  wednesday: { start: string; end: string; isAvailable: boolean };
  thursday: { start: string; end: string; isAvailable: boolean };
  friday: { start: string; end: string; isAvailable: boolean };
  saturday: { start: string; end: string; isAvailable: boolean };
  sunday: { start: string; end: string; isAvailable: boolean };
  slotDuration: number; // in minutes
  breakTime: { start: string; end: string };
  vacationDates: { start: string; end: string }[];
}

// ============= BILLING & FINANCIAL INTERFACES =============

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  swift: string;
  iban?: string;
  isDefault: boolean;
  addedDate: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'mcb_juice' | 'bank_transfer';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  bankAccount?: BankAccount;
  isDefault: boolean;
  addedDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  amount: number;
  type: 'consultation' | 'video_consultation' | 'procedure' | 'emergency';
  paymentMethod: 'cash' | 'card' | 'insurance' | 'mcb_juice';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  receiptUrl?: string;
}

export interface EarningsStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  totalEarnings: number;
  pendingPayouts: number;
  averageConsultationFee: number;
}

// ============= SUBSCRIPTION & SETTINGS INTERFACES =============

export interface SubscriptionPlan {
  type: 'free' | 'professional' | 'premium' | 'enterprise';
  planName: string;
  startDate: string;
  endDate?: string;
  features: string[];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  nextBillingDate?: string;
  usage: {
    consultations: { used: number; limit: number };
    videoConsultations: { used: number; limit: number };
    storage: { used: number; limit: number }; // in GB
    smsNotifications: { used: number; limit: number };
  };
}

export interface NotificationSettings {
  appointments: boolean;
  newPatients: boolean;
  prescriptionRefills: boolean;
  labResults: boolean;
  emergencyAlerts: boolean;
  chatMessages: boolean;
  paymentReceived: boolean;
  reviewsReceived: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
  notificationTime: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'patients_only' | 'private';
  showContactInfo: boolean;
  showEducation: boolean;
  showExperience: boolean;
  allowReviews: boolean;
  shareDataForResearch: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number; // in minutes
}

export interface LanguageSettings {
  preferredLanguage: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  timezone: string;
  currency: string;
}

// ============= ANALYTICS INTERFACES =============

export interface PerformanceMetrics {
  averageRating: number;
  totalReviews: number;
  patientSatisfaction: number;
  responseTime: number; // in minutes
  appointmentCompletionRate: number;
  prescriptionAccuracy: number;
  returnPatientRate: number;
}

export interface Statistics {
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  totalConsultations: number;
  consultationsThisMonth: number;
  videoConsultations: number;
  emergencyConsultations: number;
  averageConsultationDuration: number;
  totalPrescriptions: number;
  totalRevenue: number;
  topConditionsTreated: { condition: string; count: number }[];
  patientDemographics: {
    ageGroups: { range: string; count: number }[];
    gender: { male: number; female: number; other: number };
  };
}

// ============= MAIN DOCTOR INTERFACE =============

export interface Doctor {
  // Basic Information
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  token: string;
  
  // Professional Information
  category: string;
  specialty: string[];
  subSpecialties: string[];
  licenseNumber: string;
  licenseExpiryDate: string;
  clinicAffiliation: string;
  hospitalPrivileges: string[];
  
  // Ratings & Reviews
  rating: number;
  reviews: number;
  patientComments: PatientComment[];
  performanceMetrics: PerformanceMetrics;
  
  // Experience & Education
  experience: string;
  education: Education[];
  workHistory: WorkExperience[];
  certifications: Certification[];
  publications: string[];
  awards: string[];
  
  // Location & Contact
  location: string;
  address: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  
  // Languages & Availability
  languages: string[];
  availability: string;
  detailedAvailability: Availability;
  nextAvailable: string;
  consultationDuration: number; // in minutes
  
  // Consultation Details
  consultationFee: number;
  videoConsultationFee: number;
  emergencyConsultationFee: number;
  consultationTypes: string[];
  emergencyAvailable: boolean;
  homeVisitAvailable: boolean;
  telemedicineAvailable: boolean;
  
  // Personal Details
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  bio: string;
  philosophy: string;
  specialInterests: string[];
  
  // Verification & Compliance
  verified: boolean;
  verificationDate?: string;
  verificationDocuments: Document[];
  insuranceCoverage: {
    provider: string;
    policyNumber: string;
    validUntil: string;
    coverageAmount: number;
  };
  
  // Patient Management
  patients: {
    current: PatientRecord[];
    past: PatientRecord[];
  };
  patientChats: PatientChat[];
  
  // Appointments
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  todaySchedule: DailySchedule;
  weeklySchedule: DailySchedule[];
  
  // Prescriptions
  prescriptions: Prescription[];
  prescriptionTemplates: {
    id: string;
    name: string;
    condition: string;
    medicines: string[];
  }[];
  
  // Financial
  billing: {
    receiveMethods: PaymentMethod[];
    bankAccounts: BankAccount[];
    transactions: Transaction[];
    earnings: EarningsStats;
    taxId: string;
    taxRate: number;
  };
  
  // Settings
  subscription: SubscriptionPlan;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  languageSettings: LanguageSettings;
  
  // Statistics
  statistics: Statistics;
  
  // System
  registrationDate: string;
  lastLogin: string;
  lastPasswordChange: string;
  accountStatus: 'active' | 'suspended' | 'pending_verification';
  loginHistory: {
    date: string;
    time: string;
    device: string;
    location: string;
    ipAddress: string;
  }[];
}

// ============= DOCTOR DATA (5 COMPLETE INSTANCES) =============

export const doctorsData: Doctor[] = [
  {
    // Dr. Sarah Johnson - Cardiologist
    id: "DOC001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@healthwyz.mu",
    password: "SecurePass123!",
    profileImage: "/images/doctors/1.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJET0MwMDEiLCJpYXQiOjE2MzQyMzQ1Njd9.abc123",
    
    category: "Specialist",
    specialty: ["Cardiology"],
    subSpecialties: ["Interventional Cardiology", "Cardiac Catheterization", "Coronary Angioplasty"],
    licenseNumber: "MED-2009-CAR-1234",
    licenseExpiryDate: "2026-12-31",
    clinicAffiliation: "Apollo Bramwell Hospital",
    hospitalPrivileges: ["Apollo Bramwell Hospital", "Wellkin Hospital", "Victoria Hospital"],
    
    rating: 4.8,
    reviews: 342,
    patientComments: [
      {
        id: "PC001",
        patientFirstName: "Marie",
        patientLastName: "Dupont",
        patientProfileImage: "/images/patients/1.jpg",
        comment: "Dr. Johnson saved my life with her quick diagnosis and treatment.",
        starRating: 5,
        date: "2024-08-15",
        time: "14:30"
      },
      {
        id: "PC002",
        patientFirstName: "Jean",
        patientLastName: "Baptiste",
        patientProfileImage: "/images/patients/2.jpg",
        comment: "Very professional and caring doctor, explains everything clearly.",
        starRating: 5,
        date: "2024-08-10",
        time: "09:15"
      },
      {
        id: "PC003",
        patientFirstName: "Priya",
        patientLastName: "Sharma",
        patientProfileImage: "/images/patients/3.jpg",
        comment: "Excellent bedside manner, highly recommend for heart issues.",
        starRating: 4,
        date: "2024-07-28",
        time: "16:45"
      }
    ],
    
    performanceMetrics: {
      averageRating: 4.8,
      totalReviews: 342,
      patientSatisfaction: 94.5,
      responseTime: 12,
      appointmentCompletionRate: 98.2,
      prescriptionAccuracy: 99.1,
      returnPatientRate: 78.3
    },
    
    experience: "15 years",
    education: [
      {
        degree: "MBBS",
        institution: "University of Mauritius",
        year: "2009"
      },
      {
        degree: "MD Cardiology",
        institution: "King's College London",
        year: "2013"
      },
      {
        degree: "Fellowship in Interventional Cardiology",
        institution: "Harvard Medical School",
        year: "2015"
      }
    ],
    
    workHistory: [
      {
        position: "Senior Cardiologist",
        organization: "Apollo Bramwell Hospital",
        period: "2015-present",
        current: true
      },
      {
        position: "Consultant Cardiologist",
        organization: "SSR Hospital",
        period: "2010-2015",
        current: false
      },
      {
        position: "Resident Cardiologist",
        organization: "Victoria Hospital",
        period: "2008-2010",
        current: false
      }
    ],
    
    certifications: [
      {
        name: "FESC - Fellow of European Society of Cardiology",
        issuingBody: "European Society of Cardiology",
        dateObtained: "2016-03-15",
        certificateUrl: "/certificates/fesc_sarah_johnson.pdf"
      },
      {
        name: "FACC - Fellow of American College of Cardiology",
        issuingBody: "American College of Cardiology",
        dateObtained: "2017-06-20",
        certificateUrl: "/certificates/facc_sarah_johnson.pdf"
      },
      {
        name: "Board Certified Cardiologist",
        issuingBody: "Mauritius Medical Council",
        dateObtained: "2014-01-10",
        expiryDate: "2025-01-10",
        certificateUrl: "/certificates/board_cert_sarah_johnson.pdf"
      }
    ],
    
    publications: [
      "Novel Approaches in Interventional Cardiology - Journal of Cardiac Medicine, 2023",
      "Risk Factors in Coronary Artery Disease in Mauritius - International Heart Journal, 2022",
      "Minimally Invasive Cardiac Procedures - Medical Review Quarterly, 2021"
    ],
    
    awards: [
      "Best Cardiologist Award - Mauritius Medical Association, 2023",
      "Excellence in Patient Care - Apollo Bramwell Hospital, 2022",
      "Research Excellence Award - Cardiac Society of Mauritius, 2021"
    ],
    
    location: "Port Louis",
    address: "Apollo Bramwell Hospital, Moka Road, Port Louis, Mauritius",
    phone: "+230 5123 4567",
    alternatePhone: "+230 5123 4568",
    website: "www.drsarahjohnson.mu",
    socialMedia: {
      linkedin: "linkedin.com/in/dr-sarah-johnson",
      twitter: "@DrSarahCardio",
      facebook: "facebook.com/DrSarahJohnsonCardiology"
    },
    
    languages: ["English", "French", "Creole"],
    availability: "Mon-Fri, 8:00 AM - 6:00 PM",
    detailedAvailability: {
      monday: { start: "08:00", end: "18:00", isAvailable: true },
      tuesday: { start: "08:00", end: "18:00", isAvailable: true },
      wednesday: { start: "08:00", end: "18:00", isAvailable: true },
      thursday: { start: "08:00", end: "18:00", isAvailable: true },
      friday: { start: "08:00", end: "18:00", isAvailable: true },
      saturday: { start: "09:00", end: "13:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
      slotDuration: 30,
      breakTime: { start: "13:00", end: "14:00" },
      vacationDates: [
        { start: "2025-03-15", end: "2025-03-25" },
        { start: "2025-08-10", end: "2025-08-20" }
      ]
    },
    nextAvailable: "Tomorrow, 10:00 AM",
    consultationDuration: 30,
    
    consultationFee: 2500,
    videoConsultationFee: 2000,
    emergencyConsultationFee: 4000,
    consultationTypes: ["In-Person", "Video Consultation", "Emergency"],
    emergencyAvailable: true,
    homeVisitAvailable: false,
    telemedicineAvailable: true,
    
    age: 42,
    gender: "Female",
    dateOfBirth: "1982-03-15",
    nationality: "Mauritian",
    bio: "Experienced cardiologist with over 15 years of practice, specializing in interventional procedures and heart disease prevention. Passionate about providing compassionate care and utilizing the latest medical technologies.",
    philosophy: "I believe in treating not just the disease, but the whole person. Every patient deserves personalized care that considers their unique circumstances and goals.",
    specialInterests: ["Preventive Cardiology", "Women's Heart Health", "Cardiac Rehabilitation"],
    
    verified: true,
    verificationDate: "2024-01-15",
    verificationDocuments: [
      {
        id: "DOC001",
        type: "license",
        name: "Medical License",
        uploadDate: "2024-01-10",
        url: "/documents/license_sarah_johnson.pdf",
        size: "2.3 MB",
        verified: true,
        verifiedDate: "2024-01-15"
      },
      {
        id: "DOC002",
        type: "degree",
        name: "MD Cardiology Certificate",
        uploadDate: "2024-01-10",
        url: "/documents/md_sarah_johnson.pdf",
        size: "1.8 MB",
        verified: true,
        verifiedDate: "2024-01-15"
      },
      {
        id: "DOC003",
        type: "insurance",
        name: "Malpractice Insurance",
        uploadDate: "2024-01-10",
        url: "/documents/insurance_sarah_johnson.pdf",
        size: "3.1 MB",
        verified: true,
        verifiedDate: "2024-01-15"
      }
    ],
    
    insuranceCoverage: {
      provider: "Medical Protection Society",
      policyNumber: "MPS-2024-001234",
      validUntil: "2025-12-31",
      coverageAmount: 10000000
    },
    
    patients: {
      current: [
        {
          id: "PAT001",
          firstName: "Emma",
          lastName: "Johnson",
          email: "emma.johnson@email.com",
          phone: "+230 5789 1234",
          dateOfBirth: "1985-03-15",
          gender: "Female",
          profileImage: "/images/patients/emma.jpg",
          bloodType: "A+",
          allergies: ["Penicillin", "Shellfish"],
          chronicConditions: ["Hypertension", "Type 2 Diabetes"],
          status: "active",
          lastVisit: "2024-12-01",
          nextAppointment: "2025-01-15",
          totalVisits: 12,
          totalPrescriptions: 8,
          videoCallLink: "/doctor/video-call/emma_sarah_20250115",
          medicalRecordUrl: "/records/PAT001_medical_history.pdf",
          insuranceProvider: "Swan Life",
          insurancePolicyNumber: "SWN-001234"
        },
        {
          id: "PAT002",
          firstName: "Liam",
          lastName: "Martinez",
          email: "liam.martinez@email.com",
          phone: "+230 5890 2345",
          dateOfBirth: "1992-07-22",
          gender: "Male",
          profileImage: "/images/patients/liam.jpg",
          bloodType: "O-",
          allergies: ["Latex", "Aspirin"],
          chronicConditions: ["Cardiac Arrhythmia"],
          status: "active",
          lastVisit: "2024-11-20",
          nextAppointment: "2025-02-10",
          totalVisits: 8,
          totalPrescriptions: 5,
          videoCallLink: "/doctor/video-call/liam_sarah_20250210",
          medicalRecordUrl: "/records/PAT002_medical_history.pdf",
          insuranceProvider: "MCB Insurance",
          insurancePolicyNumber: "MCB-567890"
        }
      ],
      past: [
        {
          id: "PAT003",
          firstName: "David",
          lastName: "Chen",
          email: "david.chen@email.com",
          phone: "+230 5345 6789",
          dateOfBirth: "1972-11-08",
          gender: "Male",
          profileImage: "/images/patients/david.jpg",
          bloodType: "B+",
          allergies: ["Sulfa drugs"],
          chronicConditions: ["Previous MI", "Hypertension"],
          status: "inactive",
          lastVisit: "2023-08-15",
          totalVisits: 20,
          totalPrescriptions: 15,
          medicalRecordUrl: "/records/PAT003_medical_history.pdf",
          insuranceProvider: "Jubilee Insurance",
          insurancePolicyNumber: "JUB-234567"
        }
      ]
    },
    
    patientChats: [
      {
        patientId: "PAT001",
        patientName: "Emma Johnson",
        patientImage: "/images/patients/emma.jpg",
        lastMessage: "Thank you Doctor, my blood pressure readings are much better now!",
        lastMessageTime: "2024-12-14 17:15",
        unreadCount: 0,
        status: "offline",
        messages: [
          {
            id: "MSG001",
            senderId: "PAT001",
            senderName: "Emma Johnson",
            senderType: "patient",
            message: "Good morning Dr. Johnson! I wanted to update you on my blood pressure readings.",
            timestamp: "2024-12-14 09:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG002",
            senderId: "DOC001",
            senderName: "Dr. Sarah Johnson",
            senderType: "doctor",
            message: "Good morning Emma! Please share your readings, I'd like to review them.",
            timestamp: "2024-12-14 09:15",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG003",
            senderId: "PAT001",
            senderName: "Emma Johnson",
            senderType: "patient",
            message: "Morning: 128/82, Evening: 130/85. Much better than last month!",
            timestamp: "2024-12-14 09:20",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG004",
            senderId: "DOC001",
            senderName: "Dr. Sarah Johnson",
            senderType: "doctor",
            message: "Excellent progress! Continue with the current medication. Let's review again at your next appointment.",
            timestamp: "2024-12-14 09:30",
            read: true,
            messageType: "text"
          }
        ]
      },
      {
        patientId: "PAT002",
        patientName: "Liam Martinez",
        patientImage: "/images/patients/liam.jpg",
        lastMessage: "I'll schedule the ECG for next week. Thank you!",
        lastMessageTime: "2024-12-13 15:45",
        unreadCount: 1,
        status: "online",
        messages: [
          {
            id: "MSG005",
            senderId: "DOC001",
            senderName: "Dr. Sarah Johnson",
            senderType: "doctor",
            message: "Hi Liam, how have you been feeling since we adjusted your medication?",
            timestamp: "2024-12-13 14:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG006",
            senderId: "PAT002",
            senderName: "Liam Martinez",
            senderType: "patient",
            message: "Much better! The palpitations have reduced significantly.",
            timestamp: "2024-12-13 14:30",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG007",
            senderId: "DOC001",
            senderName: "Dr. Sarah Johnson",
            senderType: "doctor",
            message: "That's great to hear. Please schedule an ECG before your next visit.",
            timestamp: "2024-12-13 15:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG008",
            senderId: "PAT002",
            senderName: "Liam Martinez",
            senderType: "patient",
            message: "I'll schedule the ECG for next week. Thank you!",
            timestamp: "2024-12-13 15:45",
            read: false,
            messageType: "text"
          }
        ]
      }
    ],
    
    upcomingAppointments: [
      {
        id: "APP001",
        patientId: "PAT001",
        patientName: "Emma Johnson",
        patientImage: "/images/patients/emma.jpg",
        date: "2025-01-15",
        time: "10:00",
        duration: 30,
        type: "video",
        status: "scheduled",
        reason: "Quarterly diabetes and hypertension review",
        videoCallLink: "/doctor/video-call/emma_sarah_20250115",
        payment: {
          amount: 2000,
          status: "pending",
          method: "insurance"
        },
        followUpRequired: true
      },
      {
        id: "APP002",
        patientId: "PAT002",
        patientName: "Liam Martinez",
        patientImage: "/images/patients/liam.jpg",
        date: "2025-02-10",
        time: "14:00",
        duration: 45,
        type: "in-person",
        status: "scheduled",
        reason: "Cardiac arrhythmia follow-up with ECG review",
        location: "Apollo Bramwell Hospital, Room 205",
        payment: {
          amount: 2500,
          status: "pending"
        },
        followUpRequired: true
      }
    ],
    
    pastAppointments: [
      {
        id: "APP003",
        patientId: "PAT001",
        patientName: "Emma Johnson",
        patientImage: "/images/patients/emma.jpg",
        date: "2024-12-01",
        time: "09:00",
        duration: 45,
        type: "in-person",
        status: "completed",
        reason: "Annual cardiac assessment",
        location: "Apollo Bramwell Hospital",
        notes: "Patient shows good control of hypertension. Continue current medication.",
        payment: {
          amount: 2500,
          status: "paid",
          method: "insurance"
        },
        prescription: {
          id: "RX001",
          patientId: "PAT001",
          patientName: "Emma Johnson",
          date: "2024-12-01",
          time: "10:00",
          diagnosis: "Essential Hypertension, Type 2 Diabetes",
          medicines: [
            {
              name: "Lisinopril",
              dosage: "10mg",
              frequency: "Once daily",
              duration: "3 months",
              instructions: "Take in the morning with water",
              quantity: 90
            },
            {
              name: "Metformin",
              dosage: "500mg",
              frequency: "Twice daily",
              duration: "3 months",
              instructions: "Take with meals",
              quantity: 180
            }
          ],
          notes: "Continue lifestyle modifications. Monitor BP daily.",
          nextRefill: "2025-03-01",
          isActive: true,
          signatureUrl: "/signatures/sarah_johnson_sign.png"
        },
        followUpRequired: true
      }
    ],
    
    todaySchedule: {
      date: "2024-12-15",
      slots: [
        { time: "08:00", available: false, appointmentId: "APP004" },
        { time: "08:30", available: false, appointmentId: "APP005" },
        { time: "09:00", available: true },
        { time: "09:30", available: false, appointmentId: "APP006" },
        { time: "10:00", available: true },
        { time: "10:30", available: true },
        { time: "11:00", available: false, appointmentId: "APP007" },
        { time: "11:30", available: false, appointmentId: "APP008" },
        { time: "14:00", available: true },
        { time: "14:30", available: true },
        { time: "15:00", available: false, appointmentId: "APP009" },
        { time: "15:30", available: true },
        { time: "16:00", available: false, appointmentId: "APP010" },
        { time: "16:30", available: true },
        { time: "17:00", available: true },
        { time: "17:30", available: true }
      ],
      totalAppointments: 7,
      availableSlots: 9
    },
    
    weeklySchedule: [
      {
        date: "2024-12-16",
        slots: [],
        totalAppointments: 8,
        availableSlots: 8
      },
      {
        date: "2024-12-17",
        slots: [],
        totalAppointments: 6,
        availableSlots: 10
      },
      {
        date: "2024-12-18",
        slots: [],
        totalAppointments: 9,
        availableSlots: 7
      },
      {
        date: "2024-12-19",
        slots: [],
        totalAppointments: 7,
        availableSlots: 9
      },
      {
        date: "2024-12-20",
        slots: [],
        totalAppointments: 5,
        availableSlots: 11
      }
    ],
    
    prescriptions: [
      {
        id: "RX001",
        patientId: "PAT001",
        patientName: "Emma Johnson",
        date: "2024-12-01",
        time: "10:00",
        diagnosis: "Essential Hypertension, Type 2 Diabetes",
        medicines: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning with water",
            quantity: 90
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with meals",
            quantity: 180
          }
        ],
        notes: "Continue lifestyle modifications. Monitor BP daily.",
        nextRefill: "2025-03-01",
        isActive: true,
        signatureUrl: "/signatures/sarah_johnson_sign.png"
      },
      {
        id: "RX002",
        patientId: "PAT002",
        patientName: "Liam Martinez",
        date: "2024-11-20",
        time: "14:30",
        diagnosis: "Cardiac Arrhythmia",
        medicines: [
          {
            name: "Metoprolol",
            dosage: "50mg",
            frequency: "Twice daily",
            duration: "6 months",
            instructions: "Take with or without food",
            quantity: 360
          }
        ],
        notes: "Monitor heart rate regularly. Report any dizziness.",
        nextRefill: "2025-05-20",
        isActive: true,
        signatureUrl: "/signatures/sarah_johnson_sign.png"
      }
    ],
    
    prescriptionTemplates: [
      {
        id: "TEMP001",
        name: "Hypertension Standard",
        condition: "Essential Hypertension",
        medicines: ["Lisinopril 10mg", "Amlodipine 5mg", "Hydrochlorothiazide 25mg"]
      },
      {
        id: "TEMP002",
        name: "Diabetes Type 2 Initial",
        condition: "Type 2 Diabetes Mellitus",
        medicines: ["Metformin 500mg", "Glimepiride 2mg"]
      },
      {
        id: "TEMP003",
        name: "Cardiac Arrhythmia",
        condition: "Atrial Fibrillation",
        medicines: ["Metoprolol 50mg", "Warfarin 5mg", "Digoxin 0.25mg"]
      }
    ],
    
    billing: {
      receiveMethods: [
        {
          id: "PAY001",
          type: "credit_card",
          cardNumber: "****1234",
          cardHolder: "Dr. Sarah Johnson",
          expiryDate: "12/26",
          isDefault: true,
          addedDate: "2024-01-15"
        },
        {
          id: "PAY002",
          type: "mcb_juice",
          cardNumber: "****5678",
          cardHolder: "Dr. Sarah Johnson",
          expiryDate: "08/25",
          isDefault: false,
          addedDate: "2024-03-20"
        }
      ],
      bankAccounts: [
        {
          id: "BANK001",
          bankName: "Mauritius Commercial Bank",
          accountNumber: "000123456789",
          accountHolder: "Dr. Sarah Johnson",
          swift: "MCBLMUMU",
          iban: "MU17MCBL0001234567890123456789MUR",
          isDefault: true,
          addedDate: "2024-01-10"
        }
      ],
      transactions: [
        {
          id: "TRX001",
          date: "2024-12-01",
          time: "10:30",
          patientId: "PAT001",
          patientName: "Emma Johnson",
          amount: 2500,
          type: "consultation",
          paymentMethod: "insurance",
          status: "completed",
          invoiceUrl: "/invoices/INV-2024-12-001.pdf",
          receiptUrl: "/receipts/REC-2024-12-001.pdf"
        },
        {
          id: "TRX002",
          date: "2024-11-20",
          time: "15:00",
          patientId: "PAT002",
          patientName: "Liam Martinez",
          amount: 2500,
          type: "consultation",
          paymentMethod: "mcb_juice",
          status: "completed",
          invoiceUrl: "/invoices/INV-2024-11-020.pdf",
          receiptUrl: "/receipts/REC-2024-11-020.pdf"
        }
      ],
      earnings: {
        today: 7500,
        thisWeek: 35000,
        thisMonth: 145000,
        thisYear: 1850000,
        totalEarnings: 8500000,
        pendingPayouts: 25000,
        averageConsultationFee: 2500
      },
      taxId: "TAX-MU-123456",
      taxRate: 15
    },
    
    subscription: {
      type: "premium",
      planName: "HealthWyz Premium Plus",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      features: [
        "Unlimited consultations",
        "Video consultation platform",
        "Electronic prescriptions",
        "Patient management system",
        "Automated appointment reminders",
        "Revenue analytics dashboard",
        "24/7 technical support",
        "Custom branding"
      ],
      price: 5000,
      billingCycle: "monthly",
      autoRenew: true,
      paymentMethod: {
        id: "PAY001",
        type: "credit_card",
        cardNumber: "****1234",
        cardHolder: "Dr. Sarah Johnson",
        expiryDate: "12/26",
        isDefault: true,
        addedDate: "2024-01-15"
      },
      nextBillingDate: "2025-01-01",
      usage: {
        consultations: { used: 287, limit: -1 },
        videoConsultations: { used: 98, limit: -1 },
        storage: { used: 12.5, limit: 100 },
        smsNotifications: { used: 450, limit: 1000 }
      }
    },
    
    notificationSettings: {
      appointments: true,
      newPatients: true,
      prescriptionRefills: true,
      labResults: true,
      emergencyAlerts: true,
      chatMessages: true,
      paymentReceived: true,
      reviewsReceived: true,
      systemUpdates: false,
      marketingEmails: false,
      notificationTime: "08:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true
    },
    
    privacySettings: {
      profileVisibility: "public",
      showContactInfo: true,
      showEducation: true,
      showExperience: true,
      allowReviews: true,
      shareDataForResearch: false,
      twoFactorAuth: true,
      sessionTimeout: 30
    },
    
    languageSettings: {
      preferredLanguage: "en",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12h",
      timezone: "Indian/Mauritius",
      currency: "MUR"
    },
    
    statistics: {
      totalPatients: 342,
      activePatients: 145,
      newPatientsThisMonth: 12,
      totalConsultations: 2854,
      consultationsThisMonth: 98,
      videoConsultations: 450,
      emergencyConsultations: 23,
      averageConsultationDuration: 28,
      totalPrescriptions: 1890,
      totalRevenue: 8500000,
      topConditionsTreated: [
        { condition: "Hypertension", count: 89 },
        { condition: "Coronary Artery Disease", count: 67 },
        { condition: "Cardiac Arrhythmia", count: 45 },
        { condition: "Heart Failure", count: 34 },
        { condition: "Diabetes with Cardiac Complications", count: 28 }
      ],
      patientDemographics: {
        ageGroups: [
          { range: "18-30", count: 45 },
          { range: "31-45", count: 89 },
          { range: "46-60", count: 134 },
          { range: "61+", count: 74 }
        ],
        gender: { male: 198, female: 144, other: 0 }
      }
    },
    
    registrationDate: "2015-06-15",
    lastLogin: "2024-12-15 07:45:00",
    lastPasswordChange: "2024-10-20",
    accountStatus: "active",
    loginHistory: [
      {
        date: "2024-12-15",
        time: "07:45",
        device: "MacBook Pro",
        location: "Port Louis, Mauritius",
        ipAddress: "196.192.110.45"
      },
      {
        date: "2024-12-14",
        time: "18:30",
        device: "iPhone 14 Pro",
        location: "Port Louis, Mauritius",
        ipAddress: "196.192.110.45"
      },
      {
        date: "2024-12-13",
        time: "08:00",
        device: "MacBook Pro",
        location: "Port Louis, Mauritius",
        ipAddress: "196.192.110.45"
      }
    ]
  },

  // Additional 4 doctors with complete data structure follow...
  // Due to length constraints, I'll provide the structure for the remaining doctors
  // Each would have the same comprehensive data structure as Dr. Sarah Johnson above
  
  {
    // Dr. Michael Chen - Neurologist
    id: "DOC002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@healthwyz.mu",
    password: "NeuralDoc456#",
    profileImage: "/images/doctors/2.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJET0MwMDIiLCJpYXQiOjE2MzQyMzQ1Njh9.def456",
    
    category: "Specialist",
    specialty: ["Neurology"],
    subSpecialties: ["Epilepsy", "Migraine Treatment", "EEG Interpretation", "Stroke Management"],
    licenseNumber: "MED-2012-NEU-2345",
    licenseExpiryDate: "2026-06-30",
    clinicAffiliation: "Clinique du Nord",
    hospitalPrivileges: ["Clinique du Nord", "Wellkin Hospital"],
    
    rating: 4.9,
    reviews: 278,
    patientComments: [
      {
        id: "PC004",
        patientFirstName: "David",
        patientLastName: "Wong",
        patientProfileImage: "/images/patients/4.jpg",
        comment: "Dr. Chen helped control my epilepsy completely, life-changing treatment.",
        starRating: 5,
        date: "2024-08-20",
        time: "11:20"
      },
      {
        id: "PC005",
        patientFirstName: "Anita",
        patientLastName: "Ramesh",
        patientProfileImage: "/images/patients/5.jpg",
        comment: "Very knowledgeable and patient, takes time to explain conditions.",
        starRating: 5,
        date: "2024-08-05",
        time: "15:30"
      }
    ],
    
    performanceMetrics: {
      averageRating: 4.9,
      totalReviews: 278,
      patientSatisfaction: 96.8,
      responseTime: 10,
      appointmentCompletionRate: 99.1,
      prescriptionAccuracy: 99.5,
      returnPatientRate: 82.5
    },
    
    experience: "12 years",
    education: [
      {
        degree: "MBBS",
        institution: "University of Sydney",
        year: "2012"
      },
      {
        degree: "MD Neurology",
        institution: "Johns Hopkins University",
        year: "2016"
      },
      {
        degree: "Fellowship in Epilepsy",
        institution: "Mayo Clinic",
        year: "2018"
      }
    ],
    
    workHistory: [
      {
        position: "Lead Neurologist",
        organization: "Clinique du Nord",
        period: "2018-present",
        current: true
      },
      {
        position: "Neurologist",
        organization: "Wellkin Hospital",
        period: "2012-2018",
        current: false
      }
    ],
    
    certifications: [
      {
        name: "Board Certified Neurologist",
        issuingBody: "Mauritius Medical Council",
        dateObtained: "2016-08-15",
        expiryDate: "2026-08-15",
        certificateUrl: "/certificates/board_cert_michael_chen.pdf"
      },
      {
        name: "Epilepsy Specialist Certification",
        issuingBody: "International League Against Epilepsy",
        dateObtained: "2018-03-20",
        certificateUrl: "/certificates/epilepsy_michael_chen.pdf"
      },
      {
        name: "EEG Certification",
        issuingBody: "American Clinical Neurophysiology Society",
        dateObtained: "2017-11-10",
        certificateUrl: "/certificates/eeg_michael_chen.pdf"
      }
    ],
    
    publications: [
      "Novel Treatment Approaches for Drug-Resistant Epilepsy - Neurology Today, 2023",
      "Migraine Management in Tropical Climates - International Headache Journal, 2022"
    ],
    
    awards: [
      "Excellence in Neurology - Mauritius Medical Association, 2022",
      "Best Research Paper - International Epilepsy Congress, 2021"
    ],
    
    location: "Curepipe",
    address: "Clinique du Nord, Royal Road, Curepipe, Mauritius",
    phone: "+230 5234 5678",
    alternatePhone: "+230 5234 5679",
    website: "www.drmichaelchen.mu",
    socialMedia: {
      linkedin: "linkedin.com/in/dr-michael-chen-neurology"
    },
    
    languages: ["English", "Mandarin", "French"],
    availability: "Mon-Sat, 9:00 AM - 5:00 PM",
    detailedAvailability: {
      monday: { start: "09:00", end: "17:00", isAvailable: true },
      tuesday: { start: "09:00", end: "17:00", isAvailable: true },
      wednesday: { start: "09:00", end: "17:00", isAvailable: true },
      thursday: { start: "09:00", end: "17:00", isAvailable: true },
      friday: { start: "09:00", end: "17:00", isAvailable: true },
      saturday: { start: "09:00", end: "13:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
      slotDuration: 45,
      breakTime: { start: "13:00", end: "14:00" },
      vacationDates: [
        { start: "2025-04-10", end: "2025-04-20" }
      ]
    },
    nextAvailable: "Today, 2:00 PM",
    consultationDuration: 45,
    
    consultationFee: 2800,
    videoConsultationFee: 2200,
    emergencyConsultationFee: 4500,
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: true,
    homeVisitAvailable: false,
    telemedicineAvailable: true,
    
    age: 38,
    gender: "Male",
    dateOfBirth: "1986-05-22",
    nationality: "Chinese-Mauritian",
    bio: "Specialized neurologist with expertise in treating epilepsy, migraines, and neurological disorders using latest treatment protocols.",
    philosophy: "The brain is our most complex organ, and understanding it requires patience, precision, and compassion.",
    specialInterests: ["Pediatric Neurology", "Neuroplasticity", "Cognitive Rehabilitation"],
    
    verified: true,
    verificationDate: "2024-02-20",
    verificationDocuments: [
      {
        id: "DOC004",
        type: "license",
        name: "Medical License",
        uploadDate: "2024-02-15",
        url: "/documents/license_michael_chen.pdf",
        size: "2.1 MB",
        verified: true,
        verifiedDate: "2024-02-20"
      }
    ],
    
    insuranceCoverage: {
      provider: "Medical Defence Union",
      policyNumber: "MDU-2024-002345",
      validUntil: "2025-12-31",
      coverageAmount: 8000000
    },
    
    patients: {
      current: [
        {
          id: "PAT004",
          firstName: "Sophie",
          lastName: "Laurent",
          email: "sophie.laurent@email.com",
          phone: "+230 5456 7890",
          dateOfBirth: "1990-02-14",
          gender: "Female",
          profileImage: "/images/patients/sophie.jpg",
          bloodType: "AB+",
          allergies: ["Iodine"],
          chronicConditions: ["Epilepsy", "Migraine"],
          status: "active",
          lastVisit: "2024-12-10",
          nextAppointment: "2025-01-20",
          totalVisits: 15,
          totalPrescriptions: 10,
          videoCallLink: "/doctor/video-call/sophie_michael_20250120",
          medicalRecordUrl: "/records/PAT004_medical_history.pdf",
          insuranceProvider: "Swan Life",
          insurancePolicyNumber: "SWN-003456"
        }
      ],
      past: []
    },
    
    patientChats: [
      {
        patientId: "PAT004",
        patientName: "Sophie Laurent",
        patientImage: "/images/patients/sophie.jpg",
        lastMessage: "The new medication is working much better, thank you!",
        lastMessageTime: "2024-12-14 16:30",
        unreadCount: 2,
        status: "online",
        messages: [
          {
            id: "MSG009",
            senderId: "PAT004",
            senderName: "Sophie Laurent",
            senderType: "patient",
            message: "Dr. Chen, I've been seizure-free for 3 weeks now!",
            timestamp: "2024-12-14 15:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG010",
            senderId: "DOC002",
            senderName: "Dr. Michael Chen",
            senderType: "doctor",
            message: "That's wonderful news Sophie! Continue with the current dosage.",
            timestamp: "2024-12-14 15:30",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG011",
            senderId: "PAT004",
            senderName: "Sophie Laurent",
            senderType: "patient",
            message: "The new medication is working much better, thank you!",
            timestamp: "2024-12-14 16:30",
            read: false,
            messageType: "text"
          }
        ]
      }
    ],
    
    upcomingAppointments: [
      {
        id: "APP004",
        patientId: "PAT004",
        patientName: "Sophie Laurent",
        patientImage: "/images/patients/sophie.jpg",
        date: "2025-01-20",
        time: "11:00",
        duration: 45,
        type: "in-person",
        status: "scheduled",
        reason: "Epilepsy medication review and EEG",
        location: "Clinique du Nord, Room 312",
        payment: {
          amount: 2800,
          status: "pending",
          method: "insurance"
        },
        followUpRequired: true
      }
    ],
    
    pastAppointments: [],
    todaySchedule: {
      date: "2024-12-15",
      slots: [],
      totalAppointments: 6,
      availableSlots: 10
    },
    weeklySchedule: [],
    prescriptions: [],
    prescriptionTemplates: [
      {
        id: "TEMP004",
        name: "Epilepsy Control",
        condition: "Epilepsy",
        medicines: ["Levetiracetam 500mg", "Lamotrigine 100mg"]
      },
      {
        id: "TEMP005",
        name: "Migraine Prevention",
        condition: "Chronic Migraine",
        medicines: ["Topiramate 25mg", "Propranolol 40mg"]
      }
    ],
    
    billing: {
      receiveMethods: [
        {
          id: "PAY003",
          type: "mcb_juice",
          cardNumber: "****9012",
          cardHolder: "Dr. Michael Chen",
          expiryDate: "06/27",
          isDefault: true,
          addedDate: "2024-02-01"
        }
      ],
      bankAccounts: [
        {
          id: "BANK002",
          bankName: "State Bank of Mauritius",
          accountNumber: "000234567890",
          accountHolder: "Dr. Michael Chen",
          swift: "SBMUMUMU",
          isDefault: true,
          addedDate: "2024-02-01"
        }
      ],
      transactions: [],
      earnings: {
        today: 8400,
        thisWeek: 42000,
        thisMonth: 168000,
        thisYear: 2100000,
        totalEarnings: 6500000,
        pendingPayouts: 28000,
        averageConsultationFee: 2800
      },
      taxId: "TAX-MU-234567",
      taxRate: 15
    },
    
    subscription: {
      type: "professional",
      planName: "HealthWyz Professional",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      features: [
        "500 consultations/month",
        "Video consultation platform",
        "Electronic prescriptions",
        "Basic analytics",
        "Business hours support"
      ],
      price: 3000,
      billingCycle: "monthly",
      autoRenew: true,
      nextBillingDate: "2025-01-01",
      usage: {
        consultations: { used: 234, limit: 500 },
        videoConsultations: { used: 67, limit: 100 },
        storage: { used: 8.2, limit: 50 },
        smsNotifications: { used: 320, limit: 500 }
      }
    },
    
    notificationSettings: {
      appointments: true,
      newPatients: true,
      prescriptionRefills: true,
      labResults: true,
      emergencyAlerts: true,
      chatMessages: true,
      paymentReceived: true,
      reviewsReceived: true,
      systemUpdates: true,
      marketingEmails: false,
      notificationTime: "09:00",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: false
    },
    
    privacySettings: {
      profileVisibility: "public",
      showContactInfo: true,
      showEducation: true,
      showExperience: true,
      allowReviews: true,
      shareDataForResearch: true,
      twoFactorAuth: true,
      sessionTimeout: 45
    },
    
    languageSettings: {
      preferredLanguage: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "24h",
      timezone: "Indian/Mauritius",
      currency: "MUR"
    },
    
    statistics: {
      totalPatients: 278,
      activePatients: 98,
      newPatientsThisMonth: 8,
      totalConsultations: 2340,
      consultationsThisMonth: 78,
      videoConsultations: 234,
      emergencyConsultations: 45,
      averageConsultationDuration: 42,
      totalPrescriptions: 1560,
      totalRevenue: 6500000,
      topConditionsTreated: [
        { condition: "Epilepsy", count: 78 },
        { condition: "Migraine", count: 65 },
        { condition: "Stroke", count: 34 },
        { condition: "Parkinson's", count: 23 },
        { condition: "Multiple Sclerosis", count: 15 }
      ],
      patientDemographics: {
        ageGroups: [
          { range: "18-30", count: 56 },
          { range: "31-45", count: 78 },
          { range: "46-60", count: 89 },
          { range: "61+", count: 55 }
        ],
        gender: { male: 145, female: 133, other: 0 }
      }
    },
    
    registrationDate: "2018-03-20",
    lastLogin: "2024-12-15 08:30:00",
    lastPasswordChange: "2024-09-15",
    accountStatus: "active",
    loginHistory: [
      {
        date: "2024-12-15",
        time: "08:30",
        device: "Dell Laptop",
        location: "Curepipe, Mauritius",
        ipAddress: "196.192.120.78"
      }
    ]
  },

  {
    // Dr. Raj Sharma - Pediatrician
    id: "DOC003",
    firstName: "Raj",
    lastName: "Sharma",
    email: "raj.sharma@healthwyz.mu",
    password: "KidsHealth789$",
    profileImage: "/images/doctors/3.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJET0MwMDMiLCJpYXQiOjE2MzQyMzQ1Njl9.ghi789",
    
    category: "Specialist",
    specialty: ["Pediatrics"],
    subSpecialties: ["Child Development", "Vaccination", "Neonatal Care", "Pediatric Nutrition"],
    licenseNumber: "MED-2014-PED-3456",
    licenseExpiryDate: "2027-03-31",
    clinicAffiliation: "Children's Medical Center",
    hospitalPrivileges: ["Children's Medical Center", "Fortis Hospital"],
    
    rating: 4.7,
    reviews: 445,
    patientComments: [
      {
        id: "PC007",
        patientFirstName: "Sunita",
        patientLastName: "Gupta",
        patientProfileImage: "/images/patients/7.jpg",
        comment: "My children love Dr. Sharma, he's so gentle and caring.",
        starRating: 5,
        date: "2024-08-18",
        time: "09:00"
      },
      {
        id: "PC008",
        patientFirstName: "Michel",
        patientLastName: "Rousseau",
        patientProfileImage: "/images/patients/8.jpg",
        comment: "Excellent with kids, very thorough examinations and explanations.",
        starRating: 4,
        date: "2024-08-12",
        time: "13:45"
      }
    ],
    
    performanceMetrics: {
      averageRating: 4.7,
      totalReviews: 445,
      patientSatisfaction: 93.2,
      responseTime: 15,
      appointmentCompletionRate: 97.5,
      prescriptionAccuracy: 98.8,
      returnPatientRate: 85.6
    },
    
    experience: "10 years",
    education: [
      {
        degree: "MBBS",
        institution: "AIIMS Delhi",
        year: "2014"
      },
      {
        degree: "MD Pediatrics",
        institution: "Christian Medical College",
        year: "2017"
      },
      {
        degree: "Child Development Certificate",
        institution: "Boston Children's Hospital",
        year: "2019"
      }
    ],
    
    workHistory: [
      {
        position: "Senior Pediatrician",
        organization: "Children's Medical Center",
        period: "2019-present",
        current: true
      },
      {
        position: "Pediatrician",
        organization: "Fortis Hospital",
        period: "2014-2019",
        current: false
      }
    ],
    
    certifications: [
      {
        name: "Board Certified Pediatrician",
        issuingBody: "Mauritius Medical Council",
        dateObtained: "2017-09-10",
        expiryDate: "2027-09-10",
        certificateUrl: "/certificates/board_cert_raj_sharma.pdf"
      },
      {
        name: "Child Development Specialist",
        issuingBody: "International Pediatric Association",
        dateObtained: "2019-06-15",
        certificateUrl: "/certificates/child_dev_raj_sharma.pdf"
      },
      {
        name: "Vaccination Expert Certification",
        issuingBody: "WHO",
        dateObtained: "2018-12-20",
        certificateUrl: "/certificates/vaccination_raj_sharma.pdf"
      }
    ],
    
    publications: [
      "Childhood Obesity Prevention in Mauritius - Pediatric Health Journal, 2023",
      "Vaccination Compliance Strategies - International Pediatrics Review, 2022"
    ],
    
    awards: [
      "Best Pediatrician Award - Parents' Choice Awards, 2023",
      "Excellence in Child Healthcare - Children's Medical Center, 2022"
    ],
    
    location: "Phoenix",
    address: "Children's Medical Center, Phoenix Mall Area, Phoenix, Mauritius",
    phone: "+230 5345 6789",
    alternatePhone: "+230 5345 6790",
    website: "www.drrajsharma.mu",
    socialMedia: {
      linkedin: "linkedin.com/in/dr-raj-sharma-pediatrics",
      facebook: "facebook.com/DrRajSharmaPediatrics"
    },
    
    languages: ["English", "Hindi", "French", "Creole"],
    availability: "Mon-Fri, 8:00 AM - 7:00 PM, Sat 9:00 AM - 1:00 PM",
    detailedAvailability: {
      monday: { start: "08:00", end: "19:00", isAvailable: true },
      tuesday: { start: "08:00", end: "19:00", isAvailable: true },
      wednesday: { start: "08:00", end: "19:00", isAvailable: true },
      thursday: { start: "08:00", end: "19:00", isAvailable: true },
      friday: { start: "08:00", end: "19:00", isAvailable: true },
      saturday: { start: "09:00", end: "13:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
      slotDuration: 20,
      breakTime: { start: "13:00", end: "14:00" },
      vacationDates: [
        { start: "2025-05-01", end: "2025-05-10" }
      ]
    },
    nextAvailable: "Tomorrow, 9:00 AM",
    consultationDuration: 20,
    
    consultationFee: 2200,
    videoConsultationFee: 1800,
    emergencyConsultationFee: 3500,
    consultationTypes: ["In-Person", "Video Consultation", "Home Visit"],
    emergencyAvailable: false,
    homeVisitAvailable: true,
    telemedicineAvailable: true,
    
    age: 35,
    gender: "Male",
    dateOfBirth: "1989-07-08",
    nationality: "Indian-Mauritian",
    bio: "Dedicated pediatrician focused on comprehensive child healthcare, vaccinations, and developmental assessments. Passionate about making healthcare fun and comfortable for children.",
    philosophy: "Every child deserves healthcare that's both excellent and enjoyable. I strive to make each visit a positive experience.",
    specialInterests: ["Childhood Obesity Prevention", "Developmental Disorders", "Pediatric Nutrition"],
    
    verified: true,
    verificationDate: "2024-03-10",
    verificationDocuments: [
      {
        id: "DOC007",
        type: "license",
        name: "Medical License",
        uploadDate: "2024-03-05",
        url: "/documents/license_raj_sharma.pdf",
        size: "2.4 MB",
        verified: true,
        verifiedDate: "2024-03-10"
      }
    ],
    
    insuranceCoverage: {
      provider: "Medical Indemnity Protection",
      policyNumber: "MIP-2024-003456",
      validUntil: "2025-12-31",
      coverageAmount: 7500000
    },
    
    patients: {
      current: [
        {
          id: "PAT005",
          firstName: "Lucas",
          lastName: "Martinez",
          email: "lucas.parents@email.com",
          phone: "+230 5567 8901",
          dateOfBirth: "2019-03-20",
          gender: "Male",
          profileImage: "/images/patients/lucas.jpg",
          bloodType: "O+",
          allergies: ["Peanuts"],
          chronicConditions: [],
          status: "active",
          lastVisit: "2024-12-05",
          nextAppointment: "2025-01-10",
          totalVisits: 24,
          totalPrescriptions: 5,
          videoCallLink: "/doctor/video-call/lucas_raj_20250110",
          medicalRecordUrl: "/records/PAT005_medical_history.pdf",
          insuranceProvider: "Parents' Insurance - MCB",
          insurancePolicyNumber: "MCB-789012"
        },
        {
          id: "PAT006",
          firstName: "Maya",
          lastName: "Patel",
          email: "maya.parents@email.com",
          phone: "+230 5678 9012",
          dateOfBirth: "2021-08-15",
          gender: "Female",
          profileImage: "/images/patients/maya.jpg",
          bloodType: "A-",
          allergies: [],
          chronicConditions: [],
          status: "active",
          lastVisit: "2024-11-28",
          nextAppointment: "2025-01-05",
          totalVisits: 12,
          totalPrescriptions: 3,
          videoCallLink: "/doctor/video-call/maya_raj_20250105",
          medicalRecordUrl: "/records/PAT006_medical_history.pdf",
          insuranceProvider: "Family Health Plan",
          insurancePolicyNumber: "FHP-345678"
        }
      ],
      past: []
    },
    
    patientChats: [
      {
        patientId: "PAT005",
        patientName: "Lucas Martinez (Parent: Sofia)",
        patientImage: "/images/patients/lucas.jpg",
        lastMessage: "Thank you Dr. Sharma! Lucas is feeling much better.",
        lastMessageTime: "2024-12-14 18:00",
        unreadCount: 0,
        status: "offline",
        messages: [
          {
            id: "MSG012",
            senderId: "PAT005",
            senderName: "Sofia Martinez",
            senderType: "patient",
            message: "Dr. Sharma, Lucas has been having a mild fever since yesterday.",
            timestamp: "2024-12-14 16:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG013",
            senderId: "DOC003",
            senderName: "Dr. Raj Sharma",
            senderType: "doctor",
            message: "What's his temperature? Any other symptoms like cough or runny nose?",
            timestamp: "2024-12-14 16:15",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG014",
            senderId: "PAT005",
            senderName: "Sofia Martinez",
            senderType: "patient",
            message: "38.2°C, slight runny nose but eating well and active.",
            timestamp: "2024-12-14 16:30",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG015",
            senderId: "DOC003",
            senderName: "Dr. Raj Sharma",
            senderType: "doctor",
            message: "Give him paracetamol syrup 5ml every 6 hours. Keep him hydrated. If fever persists beyond 2 days or worsens, bring him in.",
            timestamp: "2024-12-14 17:00",
            read: true,
            messageType: "text"
          }
        ]
      }
    ],
    
    upcomingAppointments: [
      {
        id: "APP005",
        patientId: "PAT005",
        patientName: "Lucas Martinez",
        patientImage: "/images/patients/lucas.jpg",
        date: "2025-01-10",
        time: "09:00",
        duration: 20,
        type: "in-person",
        status: "scheduled",
        reason: "5-year vaccination and developmental assessment",
        location: "Children's Medical Center, Room 105",
        payment: {
          amount: 2200,
          status: "pending",
          method: "insurance"
        },
        followUpRequired: false
      },
      {
        id: "APP006",
        patientId: "PAT006",
        patientName: "Maya Patel",
        patientImage: "/images/patients/maya.jpg",
        date: "2025-01-05",
        time: "10:00",
        duration: 20,
        type: "in-person",
        status: "scheduled",
        reason: "3-year routine checkup",
        location: "Children's Medical Center, Room 105",
        payment: {
          amount: 2200,
          status: "pending",
          method: "cash"
        },
        followUpRequired: false
      }
    ],
    
    pastAppointments: [],
    todaySchedule: {
      date: "2024-12-15",
      slots: [],
      totalAppointments: 12,
      availableSlots: 8
    },
    weeklySchedule: [],
    prescriptions: [],
    prescriptionTemplates: [
      {
        id: "TEMP006",
        name: "Common Cold - Pediatric",
        condition: "Upper Respiratory Infection",
        medicines: ["Paracetamol Syrup", "Saline Nasal Drops", "Vitamin C"]
      },
      {
        id: "TEMP007",
        name: "Gastroenteritis - Child",
        condition: "Acute Gastroenteritis",
        medicines: ["ORS Sachets", "Zinc Supplements", "Probiotics"]
      }
    ],
    
    billing: {
      receiveMethods: [
        {
          id: "PAY004",
          type: "credit_card",
          cardNumber: "****3456",
          cardHolder: "Dr. Raj Sharma",
          expiryDate: "09/26",
          isDefault: true,
          addedDate: "2024-01-20"
        }
      ],
      bankAccounts: [
        {
          id: "BANK003",
          bankName: "Barclays Bank Mauritius",
          accountNumber: "000345678901",
          accountHolder: "Dr. Raj Sharma",
          swift: "BARCMUMU",
          isDefault: true,
          addedDate: "2024-01-20"
        }
      ],
      transactions: [],
      earnings: {
        today: 6600,
        thisWeek: 33000,
        thisMonth: 132000,
        thisYear: 1650000,
        totalEarnings: 4500000,
        pendingPayouts: 22000,
        averageConsultationFee: 2200
      },
      taxId: "TAX-MU-345678",
      taxRate: 15
    },
    
    subscription: {
      type: "free",
      planName: "HealthWyz Basic",
      startDate: "2024-01-01",
      features: [
        "50 consultations/month",
        "Basic patient management",
        "Electronic prescriptions",
        "Email support"
      ],
      price: 0,
      billingCycle: "monthly",
      autoRenew: false,
      usage: {
        consultations: { used: 45, limit: 50 },
        videoConsultations: { used: 12, limit: 20 },
        storage: { used: 3.5, limit: 10 },
        smsNotifications: { used: 0, limit: 0 }
      }
    },
    
    notificationSettings: {
      appointments: true,
      newPatients: true,
      prescriptionRefills: false,
      labResults: true,
      emergencyAlerts: true,
      chatMessages: true,
      paymentReceived: true,
      reviewsReceived: true,
      systemUpdates: false,
      marketingEmails: false,
      notificationTime: "08:00",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      soundEnabled: true,
      vibrationEnabled: true
    },
    
    privacySettings: {
      profileVisibility: "public",
      showContactInfo: true,
      showEducation: true,
      showExperience: true,
      allowReviews: true,
      shareDataForResearch: false,
      twoFactorAuth: false,
      sessionTimeout: 60
    },
    
    languageSettings: {
      preferredLanguage: "en",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12h",
      timezone: "Indian/Mauritius",
      currency: "MUR"
    },
    
    statistics: {
      totalPatients: 445,
      activePatients: 234,
      newPatientsThisMonth: 18,
      totalConsultations: 3890,
      consultationsThisMonth: 156,
      videoConsultations: 89,
      emergencyConsultations: 12,
      averageConsultationDuration: 18,
      totalPrescriptions: 890,
      totalRevenue: 4500000,
      topConditionsTreated: [
        { condition: "Common Cold", count: 234 },
        { condition: "Vaccination", count: 189 },
        { condition: "Growth Monitoring", count: 156 },
        { condition: "Allergies", count: 78 },
        { condition: "Gastroenteritis", count: 67 }
      ],
      patientDemographics: {
        ageGroups: [
          { range: "0-2", count: 89 },
          { range: "3-5", count: 123 },
          { range: "6-12", count: 156 },
          { range: "13-18", count: 77 }
        ],
        gender: { male: 234, female: 211, other: 0 }
      }
    },
    
    registrationDate: "2019-02-28",
    lastLogin: "2024-12-15 07:30:00",
    lastPasswordChange: "2024-11-01",
    accountStatus: "active",
    loginHistory: [
      {
        date: "2024-12-15",
        time: "07:30",
        device: "Samsung Galaxy Tab",
        location: "Phoenix, Mauritius",
        ipAddress: "196.192.125.92"
      }
    ]
  },

  {
    // Dr. Sophie Williams - Orthopedic Surgeon
    id: "DOC004",
    firstName: "Sophie",
    lastName: "Williams",
    email: "sophie.williams@healthwyz.mu",
    password: "BoneDoc321!",
    profileImage: "/images/doctors/4.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJET0MwMDQiLCJpYXQiOjE2MzQyMzQ1NzB9.jkl012",
    
    category: "Surgeon",
    specialty: ["Orthopedic Surgery"],
    subSpecialties: ["Sports Medicine", "Joint Replacement", "Minimally Invasive Surgery", "Spine Surgery"],
    licenseNumber: "MED-2006-ORT-4567",
    licenseExpiryDate: "2026-09-30",
    clinicAffiliation: "Orthopedic Specialists Clinic",
    hospitalPrivileges: ["Orthopedic Specialists Clinic", "Wellkin Hospital", "Apollo Bramwell Hospital"],
    
    rating: 4.6,
    reviews: 189,
    patientComments: [
      {
        id: "PC010",
        patientFirstName: "Ahmed",
        patientLastName: "Hassan",
        patientProfileImage: "/images/patients/10.jpg",
        comment: "Dr. Williams performed my knee surgery perfectly, walking pain-free now.",
        starRating: 5,
        date: "2024-08-22",
        time: "14:15"
      },
      {
        id: "PC011",
        patientFirstName: "Lisa",
        patientLastName: "Chen",
        patientProfileImage: "/images/patients/11.jpg",
        comment: "Professional surgeon, excellent post-op care and follow-up.",
        starRating: 4,
        date: "2024-08-08",
        time: "10:30"
      }
    ],
    
    performanceMetrics: {
      averageRating: 4.6,
      totalReviews: 189,
      patientSatisfaction: 91.5,
      responseTime: 20,
      appointmentCompletionRate: 96.8,
      prescriptionAccuracy: 98.5,
      returnPatientRate: 72.3
    },
    
    experience: "18 years",
    education: [
      {
        degree: "MBBS",
        institution: "University of Cape Town",
        year: "2006"
      },
      {
        degree: "MS Orthopedics",
        institution: "Oxford University",
        year: "2010"
      },
      {
        degree: "Fellowship in Sports Medicine",
        institution: "University of Pittsburgh",
        year: "2012"
      }
    ],
    
    workHistory: [
      {
        position: "Senior Orthopedic Surgeon",
        organization: "Orthopedic Specialists Clinic",
        period: "2015-present",
        current: true
      },
      {
        position: "Consultant Surgeon",
        organization: "Wellkin Hospital",
        period: "2010-2015",
        current: false
      }
    ],
    
    certifications: [
      {
        name: "Fellow of Royal College of Surgeons",
        issuingBody: "Royal College of Surgeons",
        dateObtained: "2011-05-20",
        certificateUrl: "/certificates/frcs_sophie_williams.pdf"
      },
      {
        name: "Sports Medicine Specialist",
        issuingBody: "American College of Sports Medicine",
        dateObtained: "2012-09-15",
        certificateUrl: "/certificates/sports_med_sophie_williams.pdf"
      },
      {
        name: "Joint Replacement Certification",
        issuingBody: "International Joint Replacement Institute",
        dateObtained: "2014-03-10",
        certificateUrl: "/certificates/joint_replace_sophie_williams.pdf"
      }
    ],
    
    publications: [
      "Minimally Invasive Techniques in Hip Replacement - Journal of Orthopedic Surgery, 2023",
      "Sports Injuries in Tropical Athletes - Sports Medicine Review, 2022",
      "Advances in Knee Arthroscopy - Surgical Techniques Quarterly, 2021"
    ],
    
    awards: [
      "Excellence in Orthopedic Surgery - Mauritius Surgical Society, 2023",
      "Best Sports Medicine Practitioner - Athletes Association of Mauritius, 2022"
    ],
    
    location: "Quatre Bornes",
    address: "Orthopedic Specialists Clinic, St Jean Road, Quatre Bornes, Mauritius",
    phone: "+230 5456 7890",
    alternatePhone: "+230 5456 7891",
    website: "www.drsophiewilliams.mu",
    socialMedia: {
      linkedin: "linkedin.com/in/dr-sophie-williams-orthopedics"
    },
    
    languages: ["English", "French"],
    availability: "Mon, Wed, Fri: 2:00 PM - 8:00 PM",
    detailedAvailability: {
      monday: { start: "14:00", end: "20:00", isAvailable: true },
      tuesday: { start: "00:00", end: "00:00", isAvailable: false },
      wednesday: { start: "14:00", end: "20:00", isAvailable: true },
      thursday: { start: "00:00", end: "00:00", isAvailable: false },
      friday: { start: "14:00", end: "20:00", isAvailable: true },
      saturday: { start: "09:00", end: "13:00", isAvailable: true },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
      slotDuration: 60,
      breakTime: { start: "17:00", end: "17:30" },
      vacationDates: [
        { start: "2025-06-15", end: "2025-06-30" }
      ]
    },
    nextAvailable: "Friday, 3:00 PM",
    consultationDuration: 60,
    
    consultationFee: 3000,
    videoConsultationFee: 0,
    emergencyConsultationFee: 5000,
    consultationTypes: ["In-Person"],
    emergencyAvailable: true,
    homeVisitAvailable: false,
    telemedicineAvailable: false,
    
    age: 45,
    gender: "Female",
    dateOfBirth: "1979-06-12",
    nationality: "British-Mauritian",
    bio: "Experienced orthopedic surgeon specializing in joint replacement, sports injuries, and minimally invasive procedures. Committed to helping patients return to active lifestyles.",
    philosophy: "Movement is life. My goal is to restore function and eliminate pain so patients can enjoy their daily activities.",
    specialInterests: ["Robotic Surgery", "Regenerative Medicine", "Sports Biomechanics"],
    
    verified: true,
    verificationDate: "2024-04-05",
    verificationDocuments: [
      {
        id: "DOC010",
        type: "license",
        name: "Medical License",
        uploadDate: "2024-04-01",
        url: "/documents/license_sophie_williams.pdf",
        size: "2.6 MB",
        verified: true,
        verifiedDate: "2024-04-05"
      }
    ],
    
    insuranceCoverage: {
      provider: "Surgeons Insurance Company",
      policyNumber: "SIC-2024-004567",
      validUntil: "2025-12-31",
      coverageAmount: 15000000
    },
    
    patients: {
      current: [
        {
          id: "PAT007",
          firstName: "Robert",
          lastName: "Taylor",
          email: "robert.taylor@email.com",
          phone: "+230 5789 0123",
          dateOfBirth: "1965-11-30",
          gender: "Male",
          profileImage: "/images/patients/robert.jpg",
          bloodType: "B-",
          allergies: [],
          chronicConditions: ["Osteoarthritis"],
          status: "active",
          lastVisit: "2024-12-08",
          nextAppointment: "2025-01-25",
          totalVisits: 8,
          totalPrescriptions: 4,
          videoCallLink: "/doctor/video-call/robert_sophie_20250125",
          medicalRecordUrl: "/records/PAT007_medical_history.pdf",
          insuranceProvider: "Life Insurance Corporation",
          insurancePolicyNumber: "LIC-890123"
        }
      ],
      past: []
    },
    
    patientChats: [
      {
        patientId: "PAT007",
        patientName: "Robert Taylor",
        patientImage: "/images/patients/robert.jpg",
        lastMessage: "I'll continue with the physiotherapy as recommended.",
        lastMessageTime: "2024-12-14 14:00",
        unreadCount: 1,
        status: "offline",
        messages: [
          {
            id: "MSG016",
            senderId: "DOC004",
            senderName: "Dr. Sophie Williams",
            senderType: "doctor",
            message: "How's your recovery going after the knee replacement?",
            timestamp: "2024-12-14 12:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG017",
            senderId: "PAT007",
            senderName: "Robert Taylor",
            senderType: "patient",
            message: "Much better! I can walk without the walker now.",
            timestamp: "2024-12-14 13:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG018",
            senderId: "DOC004",
            senderName: "Dr. Sophie Williams",
            senderType: "doctor",
            message: "Excellent progress! Continue with physiotherapy 3 times a week.",
            timestamp: "2024-12-14 13:30",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG019",
            senderId: "PAT007",
            senderName: "Robert Taylor",
            senderType: "patient",
            message: "I'll continue with the physiotherapy as recommended.",
            timestamp: "2024-12-14 14:00",
            read: false,
            messageType: "text"
          }
        ]
      }
    ],
    
    upcomingAppointments: [
      {
        id: "APP007",
        patientId: "PAT007",
        patientName: "Robert Taylor",
        patientImage: "/images/patients/robert.jpg",
        date: "2025-01-25",
        time: "15:00",
        duration: 60,
        type: "in-person",
        status: "scheduled",
        reason: "3-month post-op follow-up for knee replacement",
        location: "Orthopedic Specialists Clinic, Surgical Suite 2",
        payment: {
          amount: 3000,
          status: "pending",
          method: "insurance"
        },
        followUpRequired: true
      }
    ],
    
    pastAppointments: [],
    todaySchedule: {
      date: "2024-12-15",
      slots: [],
      totalAppointments: 4,
      availableSlots: 4
    },
    weeklySchedule: [],
    prescriptions: [],
    prescriptionTemplates: [
      {
        id: "TEMP008",
        name: "Post-Surgery Pain Management",
        condition: "Post-operative Pain",
        medicines: ["Tramadol 50mg", "Paracetamol 500mg", "Diclofenac Gel"]
      },
      {
        id: "TEMP009",
        name: "Arthritis Management",
        condition: "Osteoarthritis",
        medicines: ["Glucosamine", "Chondroitin", "Celecoxib 200mg"]
      }
    ],
    
    billing: {
      receiveMethods: [
        {
          id: "PAY005",
          type: "bank_transfer",
          bankAccount: {
            id: "BANK004",
            bankName: "HSBC Mauritius",
            accountNumber: "000456789012",
            accountHolder: "Dr. Sophie Williams",
            swift: "HSBCMUMU",
            isDefault: true,
            addedDate: "2024-01-25"
          },
          isDefault: true,
          addedDate: "2024-01-25"
        }
      ],
      bankAccounts: [
        {
          id: "BANK004",
          bankName: "HSBC Mauritius",
          accountNumber: "000456789012",
          accountHolder: "Dr. Sophie Williams",
          swift: "HSBCMUMU",
          isDefault: true,
          addedDate: "2024-01-25"
        }
      ],
      transactions: [],
      earnings: {
        today: 9000,
        thisWeek: 45000,
        thisMonth: 180000,
        thisYear: 2250000,
        totalEarnings: 12000000,
        pendingPayouts: 30000,
        averageConsultationFee: 3000
      },
      taxId: "TAX-MU-456789",
      taxRate: 15
    },
    
    subscription: {
      type: "enterprise",
      planName: "HealthWyz Enterprise",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      features: [
        "Unlimited everything",
        "Priority support",
        "Custom integrations",
        "Advanced analytics",
        "Multi-location support",
        "API access",
        "White labeling",
        "Dedicated account manager"
      ],
      price: 10000,
      billingCycle: "yearly",
      autoRenew: true,
      nextBillingDate: "2025-01-01",
      usage: {
        consultations: { used: 189, limit: -1 },
        videoConsultations: { used: 0, limit: -1 },
        storage: { used: 45.8, limit: -1 },
        smsNotifications: { used: 567, limit: -1 }
      }
    },
    
    notificationSettings: {
      appointments: true,
      newPatients: true,
      prescriptionRefills: false,
      labResults: true,
      emergencyAlerts: true,
      chatMessages: true,
      paymentReceived: true,
      reviewsReceived: false,
      systemUpdates: false,
      marketingEmails: false,
      notificationTime: "14:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      soundEnabled: false,
      vibrationEnabled: false
    },
    
    privacySettings: {
      profileVisibility: "public",
      showContactInfo: false,
      showEducation: true,
      showExperience: true,
      allowReviews: true,
      shareDataForResearch: false,
      twoFactorAuth: true,
      sessionTimeout: 30
    },
    
    languageSettings: {
      preferredLanguage: "en",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      timezone: "Indian/Mauritius",
      currency: "MUR"
    },
    
    statistics: {
      totalPatients: 189,
      activePatients: 45,
      newPatientsThisMonth: 4,
      totalConsultations: 1234,
      consultationsThisMonth: 32,
      videoConsultations: 0,
      emergencyConsultations: 34,
      averageConsultationDuration: 55,
      totalPrescriptions: 456,
      totalRevenue: 12000000,
      topConditionsTreated: [
        { condition: "Knee Replacement", count: 45 },
        { condition: "Hip Replacement", count: 38 },
        { condition: "Sports Injuries", count: 34 },
        { condition: "Fractures", count: 28 },
        { condition: "Spine Surgery", count: 22 }
      ],
      patientDemographics: {
        ageGroups: [
          { range: "18-30", count: 23 },
          { range: "31-45", count: 45 },
          { range: "46-60", count: 67 },
          { range: "61+", count: 54 }
        ],
        gender: { male: 112, female: 77, other: 0 }
      }
    },
    
    registrationDate: "2015-09-01",
    lastLogin: "2024-12-14 13:45:00",
    lastPasswordChange: "2024-08-30",
    accountStatus: "active",
    loginHistory: [
      {
        date: "2024-12-14",
        time: "13:45",
        device: "HP Laptop",
        location: "Quatre Bornes, Mauritius",
        ipAddress: "196.192.130.56"
      }
    ]
  },

  {
    // Dr. Isabella Costa - Psychiatrist
    id: "DOC005",
    firstName: "Isabella",
    lastName: "Costa",
    email: "isabella.costa@healthwyz.mu",
    password: "MindHealth123$",
    profileImage: "/images/doctors/5.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJET0MwMDUiLCJpYXQiOjE2MzQyMzQ1NzU9.yz567",
    
    category: "Mental Health",
    specialty: ["Psychiatry"],
    subSpecialties: ["Anxiety Disorders", "Depression", "PTSD Treatment", "Cognitive Behavioral Therapy"],
    licenseNumber: "MED-2010-PSY-5678",
    licenseExpiryDate: "2026-05-31",
    clinicAffiliation: "Mental Health Wellness Center",
    hospitalPrivileges: ["Mental Health Wellness Center", "Brown Sequard Hospital"],
    
    rating: 4.9,
    reviews: 156,
    patientComments: [
      {
        id: "PC025",
        patientFirstName: "Hannah",
        patientLastName: "Wilson",
        patientProfileImage: "/images/patients/25.jpg",
        comment: "Dr. Costa helped me overcome severe anxiety, life-changing treatment.",
        starRating: 5,
        date: "2024-08-11",
        time: "13:00"
      },
      {
        id: "PC026",
        patientFirstName: "Jake",
        patientLastName: "Thompson",
        patientProfileImage: "/images/patients/26.jpg",
        comment: "Very understanding and professional, excellent therapy sessions.",
        starRating: 5,
        date: "2024-08-04",
        time: "11:30"
      }
    ],
    
    performanceMetrics: {
      averageRating: 4.9,
      totalReviews: 156,
      patientSatisfaction: 97.5,
      responseTime: 8,
      appointmentCompletionRate: 98.9,
      prescriptionAccuracy: 99.2,
      returnPatientRate: 88.7
    },
    
    experience: "14 years",
    education: [
      {
        degree: "MD Psychiatry",
        institution: "University of São Paulo",
        year: "2010"
      },
      {
        degree: "Cognitive Behavioral Therapy Training",
        institution: "Beck Institute",
        year: "2012"
      },
      {
        degree: "EMDR Therapy Certification",
        institution: "EMDR Institute",
        year: "2014"
      }
    ],
    
    workHistory: [
      {
        position: "Lead Psychiatrist",
        organization: "Mental Health Wellness Center",
        period: "2017-present",
        current: true
      },
      {
        position: "Consultant Psychiatrist",
        organization: "Brown Sequard Hospital",
        period: "2012-2017",
        current: false
      }
    ],
    
    certifications: [
      {
        name: "Board Certified Psychiatrist",
        issuingBody: "Mauritius Medical Council",
        dateObtained: "2011-07-15",
        expiryDate: "2026-07-15",
        certificateUrl: "/certificates/board_cert_isabella_costa.pdf"
      },
      {
        name: "CBT Therapist Certification",
        issuingBody: "Beck Institute",
        dateObtained: "2012-11-20",
        certificateUrl: "/certificates/cbt_isabella_costa.pdf"
      },
      {
        name: "EMDR Certified Therapist",
        issuingBody: "EMDR International Association",
        dateObtained: "2014-05-10",
        certificateUrl: "/certificates/emdr_isabella_costa.pdf"
      }
    ],
    
    publications: [
      "Treating Anxiety in the Digital Age - Journal of Psychiatric Practice, 2023",
      "EMDR Therapy Effectiveness in PTSD - International Trauma Journal, 2022",
      "Cultural Considerations in Mental Health Treatment - Global Psychiatry Review, 2021"
    ],
    
    awards: [
      "Excellence in Mental Health Care - Mauritius Psychiatric Association, 2023",
      "Compassionate Care Award - Mental Health Wellness Center, 2022",
      "Research Excellence in PTSD Treatment - International PTSD Society, 2021"
    ],
    
    location: "Rose Hill",
    address: "Mental Health Wellness Center, Vandermeersch Street, Rose Hill, Mauritius",
    phone: "+230 5890 1234",
    alternatePhone: "+230 5890 1235",
    website: "www.drisabellacosta.mu",
    socialMedia: {
      linkedin: "linkedin.com/in/dr-isabella-costa-psychiatry",
      twitter: "@DrCostaMentalHealth"
    },
    
    languages: ["English", "Portuguese", "French", "Spanish"],
    availability: "Mon-Fri, 10:00 AM - 6:00 PM",
    detailedAvailability: {
      monday: { start: "10:00", end: "18:00", isAvailable: true },
      tuesday: { start: "10:00", end: "18:00", isAvailable: true },
      wednesday: { start: "10:00", end: "18:00", isAvailable: true },
      thursday: { start: "10:00", end: "18:00", isAvailable: true },
      friday: { start: "10:00", end: "18:00", isAvailable: true },
      saturday: { start: "00:00", end: "00:00", isAvailable: false },
      sunday: { start: "00:00", end: "00:00", isAvailable: false },
      slotDuration: 50,
      breakTime: { start: "14:00", end: "15:00" },
      vacationDates: [
        { start: "2025-07-01", end: "2025-07-15" }
      ]
    },
    nextAvailable: "Friday, 11:00 AM",
    consultationDuration: 50,
    
    consultationFee: 3000,
    videoConsultationFee: 2500,
    emergencyConsultationFee: 4500,
    consultationTypes: ["In-Person", "Video Consultation"],
    emergencyAvailable: true,
    homeVisitAvailable: false,
    telemedicineAvailable: true,
    
    age: 43,
    gender: "Female",
    dateOfBirth: "1981-09-18",
    nationality: "Portuguese-Mauritian",
    bio: "Compassionate psychiatrist specializing in anxiety, depression, and mood disorders with both therapy and medication management. Fluent in multiple languages to serve diverse patient populations.",
    philosophy: "Mental health is just as important as physical health. I believe in treating the whole person with empathy, understanding, and evidence-based approaches.",
    specialInterests: ["Trauma-Informed Care", "Mindfulness-Based Therapy", "Cultural Psychiatry"],
    
    verified: true,
    verificationDate: "2024-05-15",
    verificationDocuments: [
      {
        id: "DOC013",
        type: "license",
        name: "Medical License",
        uploadDate: "2024-05-10",
        url: "/documents/license_isabella_costa.pdf",
        size: "2.2 MB",
        verified: true,
        verifiedDate: "2024-05-15"
      },
      {
        id: "DOC014",
        type: "degree",
        name: "MD Psychiatry Certificate",
        uploadDate: "2024-05-10",
        url: "/documents/md_isabella_costa.pdf",
        size: "1.9 MB",
        verified: true,
        verifiedDate: "2024-05-15"
      }
    ],
    
    insuranceCoverage: {
      provider: "Professional Indemnity Insurance",
      policyNumber: "PII-2024-005678",
      validUntil: "2025-12-31",
      coverageAmount: 10000000
    },
    
    patients: {
      current: [
        {
          id: "PAT008",
          firstName: "Emily",
          lastName: "Richards",
          email: "emily.richards@email.com",
          phone: "+230 5901 2345",
          dateOfBirth: "1995-04-25",
          gender: "Female",
          profileImage: "/images/patients/emily.jpg",
          bloodType: "O+",
          allergies: [],
          chronicConditions: ["Generalized Anxiety Disorder", "Depression"],
          status: "active",
          lastVisit: "2024-12-12",
          nextAppointment: "2025-01-08",
          totalVisits: 24,
          totalPrescriptions: 8,
          videoCallLink: "/doctor/video-call/emily_isabella_20250108",
          medicalRecordUrl: "/records/PAT008_medical_history.pdf"
        },
        {
          id: "PAT009",
          firstName: "Marcus",
          lastName: "Brown",
          email: "marcus.brown@email.com",
          phone: "+230 5012 3456",
          dateOfBirth: "1988-12-10",
          gender: "Male",
          profileImage: "/images/patients/marcus.jpg",
          bloodType: "A+",
          allergies: ["SSRIs"],
          chronicConditions: ["PTSD", "Insomnia"],
          status: "active",
          lastVisit: "2024-12-05",
          nextAppointment: "2025-01-12",
          totalVisits: 18,
          totalPrescriptions: 6,
          videoCallLink: "/doctor/video-call/marcus_isabella_20250112",
          medicalRecordUrl: "/records/PAT009_medical_history.pdf"
        }
      ],
      past: []
    },
    
    patientChats: [
      {
        patientId: "PAT008",
        patientName: "Emily Richards",
        patientImage: "/images/patients/emily.jpg",
        lastMessage: "Thank you Dr. Costa, I'll practice the breathing exercises daily.",
        lastMessageTime: "2024-12-14 19:00",
        unreadCount: 0,
        status: "offline",
        messages: [
          {
            id: "MSG020",
            senderId: "PAT008",
            senderName: "Emily Richards",
            senderType: "patient",
            message: "Dr. Costa, I've been having more anxiety attacks this week.",
            timestamp: "2024-12-14 17:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG021",
            senderId: "DOC005",
            senderName: "Dr. Isabella Costa",
            senderType: "doctor",
            message: "I'm sorry to hear that. What triggers have you noticed?",
            timestamp: "2024-12-14 17:30",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG022",
            senderId: "PAT008",
            senderName: "Emily Richards",
            senderType: "patient",
            message: "Mostly work stress and social situations.",
            timestamp: "2024-12-14 18:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG023",
            senderId: "DOC005",
            senderName: "Dr. Isabella Costa",
            senderType: "doctor",
            message: "Let's adjust your CBT exercises. Try the 4-7-8 breathing technique when you feel anxiety rising. We'll discuss more strategies at your next appointment.",
            timestamp: "2024-12-14 18:30",
            read: true,
            messageType: "text"
          }
        ]
      },
      {
        patientId: "PAT009",
        patientName: "Marcus Brown",
        patientImage: "/images/patients/marcus.jpg",
        lastMessage: "Yes, the nightmares have decreased significantly.",
        lastMessageTime: "2024-12-13 20:00",
        unreadCount: 1,
        status: "offline",
        messages: [
          {
            id: "MSG024",
            senderId: "DOC005",
            senderName: "Dr. Isabella Costa",
            senderType: "doctor",
            message: "Hi Marcus, how has your sleep been since we started the EMDR therapy?",
            timestamp: "2024-12-13 18:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG025",
            senderId: "PAT009",
            senderName: "Marcus Brown",
            senderType: "patient",
            message: "Much better! I'm getting 6-7 hours most nights now.",
            timestamp: "2024-12-13 19:00",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG026",
            senderId: "DOC005",
            senderName: "Dr. Isabella Costa",
            senderType: "doctor",
            message: "That's excellent progress! Are the nightmares less frequent?",
            timestamp: "2024-12-13 19:30",
            read: true,
            messageType: "text"
          },
          {
            id: "MSG027",
            senderId: "PAT009",
            senderName: "Marcus Brown",
            senderType: "patient",
            message: "Yes, the nightmares have decreased significantly.",
            timestamp: "2024-12-13 20:00",
            read: false,
            messageType: "text"
          }
        ]
      }
    ],
    
    upcomingAppointments: [
      {
        id: "APP008",
        patientId: "PAT008",
        patientName: "Emily Richards",
        patientImage: "/images/patients/emily.jpg",
        date: "2025-01-08",
        time: "11:00",
        duration: 50,
        type: "video",
        status: "scheduled",
        reason: "Anxiety management and CBT session",
        videoCallLink: "/doctor/video-call/emily_isabella_20250108",
        payment: {
          amount: 2500,
          status: "pending",
          method: "card"
        },
        followUpRequired: true
      },
      {
        id: "APP009",
        patientId: "PAT009",
        patientName: "Marcus Brown",
        patientImage: "/images/patients/marcus.jpg",
        date: "2025-01-12",
        time: "14:00",
        duration: 50,
        type: "in-person",
        status: "scheduled",
        reason: "EMDR therapy session for PTSD",
        location: "Mental Health Wellness Center, Therapy Room 3",
        payment: {
          amount: 3000,
          status: "pending",
          method: "cash"
        },
        followUpRequired: true
      }
    ],
    
    pastAppointments: [],
    todaySchedule: {
      date: "2024-12-15",
      slots: [],
      totalAppointments: 5,
      availableSlots: 3
    },
    weeklySchedule: [],
    prescriptions: [
      {
        id: "RX003",
        patientId: "PAT008",
        patientName: "Emily Richards",
        date: "2024-12-12",
        time: "11:30",
        diagnosis: "Generalized Anxiety Disorder, Major Depressive Disorder",
        medicines: [
          {
            name: "Sertraline",
            dosage: "50mg",
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning with food",
            quantity: 90
          },
          {
            name: "Alprazolam",
            dosage: "0.25mg",
            frequency: "As needed for panic attacks",
            duration: "1 month",
            instructions: "Maximum 2 tablets per day",
            quantity: 30
          }
        ],
        notes: "Continue CBT. Monitor for side effects. Avoid alcohol.",
        nextRefill: "2025-03-12",
        isActive: true,
        signatureUrl: "/signatures/isabella_costa_sign.png"
      }
    ],
    prescriptionTemplates: [
      {
        id: "TEMP010",
        name: "Anxiety Starter Pack",
        condition: "Generalized Anxiety Disorder",
        medicines: ["Sertraline 25mg", "Propranolol 10mg PRN", "Melatonin 3mg"]
      },
      {
        id: "TEMP011",
        name: "Depression Management",
        condition: "Major Depressive Disorder",
        medicines: ["Escitalopram 10mg", "Bupropion 150mg", "Vitamin D 2000IU"]
      },
      {
        id: "TEMP012",
        name: "PTSD Protocol",
        condition: "Post-Traumatic Stress Disorder",
        medicines: ["Prazosin 1mg", "Sertraline 50mg", "Trazodone 50mg"]
      }
    ],
    
    billing: {
      receiveMethods: [
        {
          id: "PAY006",
          type: "credit_card",
          cardNumber: "****7890",
          cardHolder: "Dr. Isabella Costa",
          expiryDate: "03/27",
          isDefault: true,
          addedDate: "2024-01-30"
        },
        {
          id: "PAY007",
          type: "mcb_juice",
          cardNumber: "****1234",
          cardHolder: "Dr. Isabella Costa",
          expiryDate: "11/26",
          isDefault: false,
          addedDate: "2024-02-15"
        }
      ],
      bankAccounts: [
        {
          id: "BANK005",
          bankName: "AfrAsia Bank",
          accountNumber: "000567890123",
          accountHolder: "Dr. Isabella Costa",
          swift: "AFBLMUMU",
          isDefault: true,
          addedDate: "2024-01-30"
        }
      ],
      transactions: [],
      earnings: {
        today: 12000,
        thisWeek: 60000,
        thisMonth: 240000,
        thisYear: 3000000,
        totalEarnings: 9500000,
        pendingPayouts: 45000,
        averageConsultationFee: 2750
      },
      taxId: "TAX-MU-567890",
      taxRate: 15
    },
    
    subscription: {
      type: "premium",
      planName: "HealthWyz Premium Plus",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      features: [
        "Unlimited consultations",
        "Video consultation platform",
        "Electronic prescriptions",
        "Patient management system",
        "Automated appointment reminders",
        "Revenue analytics dashboard",
        "24/7 technical support",
        "Custom branding"
      ],
      price: 5000,
      billingCycle: "monthly",
      autoRenew: true,
      paymentMethod: {
        id: "PAY006",
        type: "credit_card",
        cardNumber: "****7890",
        cardHolder: "Dr. Isabella Costa",
        expiryDate: "03/27",
        isDefault: true,
        addedDate: "2024-01-30"
      },
      nextBillingDate: "2025-01-01",
      usage: {
        consultations: { used: 156, limit: -1 },
        videoConsultations: { used: 89, limit: -1 },
        storage: { used: 18.3, limit: 100 },
        smsNotifications: { used: 234, limit: 1000 }
      }
    },
    
    notificationSettings: {
      appointments: true,
      newPatients: true,
      prescriptionRefills: true,
      labResults: false,
      emergencyAlerts: true,
      chatMessages: true,
      paymentReceived: true,
      reviewsReceived: true,
      systemUpdates: false,
      marketingEmails: false,
      notificationTime: "10:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      soundEnabled: false,
      vibrationEnabled: false
    },
    
    privacySettings: {
      profileVisibility: "public",
      showContactInfo: true,
      showEducation: true,
      showExperience: true,
      allowReviews: true,
      shareDataForResearch: true,
      twoFactorAuth: true,
      sessionTimeout: 60
    },
    
    languageSettings: {
      preferredLanguage: "en",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12h",
      timezone: "Indian/Mauritius",
      currency: "MUR"
    },
    
    statistics: {
      totalPatients: 156,
      activePatients: 78,
      newPatientsThisMonth: 6,
      totalConsultations: 1890,
      consultationsThisMonth: 89,
      videoConsultations: 456,
      emergencyConsultations: 23,
      averageConsultationDuration: 48,
      totalPrescriptions: 678,
      totalRevenue: 9500000,
      topConditionsTreated: [
        { condition: "Anxiety Disorders", count: 67 },
        { condition: "Depression", count: 54 },
        { condition: "PTSD", count: 23 },
        { condition: "Bipolar Disorder", count: 8 },
        { condition: "OCD", count: 4 }
      ],
      patientDemographics: {
        ageGroups: [
          { range: "18-30", count: 45 },
          { range: "31-45", count: 56 },
          { range: "46-60", count: 34 },
          { range: "61+", count: 21 }
        ],
        gender: { male: 67, female: 89, other: 0 }
      }
    },
    
    registrationDate: "2017-01-15",
    lastLogin: "2024-12-15 09:45:00",
    lastPasswordChange: "2024-07-20",
    accountStatus: "active",
    loginHistory: [
      {
        date: "2024-12-15",
        time: "09:45",
        device: "iPad Pro",
        location: "Rose Hill, Mauritius",
        ipAddress: "196.192.140.67"
      },
      {
        date: "2024-12-14",
        time: "16:30",
        device: "iPhone 13 Pro",
        location: "Rose Hill, Mauritius",
        ipAddress: "196.192.140.67"
      },
      {
        date: "2024-12-13",
        time: "10:00",
        device: "MacBook Air",
        location: "Rose Hill, Mauritius",
        ipAddress: "196.192.140.67"
      }
    ]
  }
];