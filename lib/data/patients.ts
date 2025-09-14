// Interfaces with additional order and reminder information
export interface MedicineOrder {
  id: string
  medicines: Array<{
    id: string
    name: string
    dosage: string
    quantity: number
    price: number
    inStock: boolean
    prescriptionId?: string
  }>
  pharmacy: {
    name: string
    address: string
    phone: string
    rating: number
    deliveryTime: string
    licenseNumber: string
  }
  totalAmount: number
  deliveryFee: number
  estimatedDelivery: string
  paymentMethod: 'cash' | 'card' | 'insurance'
  orderStatus: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered'
  trackingNumber?: string
  orderDate: string
  deliveryAddress: string
}

export interface PillReminder {
  id: string
  medicineId: string
  medicineName: string
  dosage: string
  times: string[]
  taken: boolean[]
  nextDose: string
  frequency: string
  prescriptionId: string
  startDate: string
  endDate: string
  isActive: boolean
  notificationEnabled: boolean
}

export interface NutritionAnalysis {
  id: string
  foodName: string
  date: string
  time: string
  calories: number
  carbs: number
  protein: number
  fat: number
  vitamins: string[]
  healthScore: number
  suggestions: string[]
  allergens?: string[]
  nutritionalBenefits: string[]
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface EmergencyContact {
  id: string
  name: string
  service: string
  phone: string
  available24h: boolean
  responseTime: string
  specialization: string[]
  location: string
  distance: string
  priority: 'high' | 'medium' | 'low'
}

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'consultation' | 'prescription' | 'lab_result' | 'imaging' | 'vaccination' | 'surgery';
  doctorResponsible: string;
  nurseResponsible?: string;
  summary: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  attachments?: string[];
}

export interface Prescription {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  doctorId: string;
  medicines: Array<{
    name: string;
    dosage: string;
    quantity: number;
    frequency: string;
    duration: string;
    instructions: string;
    beforeFood: boolean;
  }>;
  diagnosis: string;
  isActive: boolean;
  nextRefill?: string;
  notes?: string;
  orderInformation?: {
    canReorder: boolean;
    lastOrderDate?: string;
    nextOrderSuggestion?: string;
    preferredPharmacy?: string;
    estimatedCost: number;
    insuranceCovered: boolean;
    copayAmount: number;
  };
  reminderSettings?: {
    enabled: boolean;
    reminderTimes: string[];
    adherenceTracking: boolean;
    missedDoseAlerts: boolean;
  };
}

export interface VitalSigns {
  id: string;
  date: string;
  time: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  oxygenSaturation: number;
  glucose?: number;
  cholesterol?: number;
  labTechnician: string;
  facility: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  doctorName: string;
  doctorId: string;
  specialty: string;
  reason: string;
  duration: number;
  location?: string;
  roomId?: string;
  notes?: string;
}

export interface ChildcareBooking {
  id: string;
  date: string;
  time: string;
  nannyName: string;
  nannyId: string;
  duration: number;
  type: 'regular' | 'overnight';
  children: string[];
  specialInstructions?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface InsuranceCoverage {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberId: string;
  validFrom: string;
  validUntil: string;
  copay: number;
  deductible: number;
  coverageType: 'individual' | 'family';
  emergencyCoverage: boolean;
  pharmacyCoverage: boolean;
  dentalCoverage: boolean;
  visionCoverage: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'patient' | 'doctor' | 'nurse' | 'nanny' | 'bot' | 'emergency';
  message: string;
  timestamp: string;
  attachments?: string[];
  read: boolean;
  messageType: 'text' | 'image' | 'video' | 'file' | 'voice';
}

export interface DietEntry {
  id: string;
  date: string;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: {
    name: string;
    quantity: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    vitamins: string[];
  }[];
  imageUrl?: string;
  waterIntake: number;
  notes?: string;
  nutritionScore: number;
}

export interface HealthMetrics {
  cholesterol: {
    total: number;
    ldl: number;
    hdl: number;
    triglycerides: number;
    date: string;
  };
  bloodPressure: {
    systolic: number;
    diastolic: number;
    date: string;
  };
  bmi: {
    value: number;
    category: string;
    date: string;
  };
  heartRateVariability: number;
  sleepQuality: {
    averageHours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  stressLevel: 'low' | 'moderate' | 'high';
  bodyAge: number;
  metabolicAge: number;
  visceralFat: number;
  muscleMass: number;
  boneDensity: number;
}

export interface BotHealthSession {
  id: string;
  date: string;
  topic: string;
  recommendations: {
    diet: string[];
    exercise: string[];
    supplements: string[];
    lifestyle: string[];
  };
  bookingSuggestions: {
    type: 'psychologist' | 'nutritionist' | 'yoga' | 'physio';
    specialist: string;
    reason: string;
  }[];
  hydrationReminders: string[];
  mealPlan?: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
}

export interface VideoCallSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  withType: 'doctor' | 'nurse' | 'nanny';
  withName: string;
  withId: string;
  callQuality: 'poor' | 'fair' | 'good' | 'excellent';
  recording?: string;
  notes?: string;
  prescription?: string;
}

export interface BillingInfo {
  id: string;
  type: 'mcb_juice' | 'credit_card';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv?: string;
  isDefault: boolean;
  addedDate: string;
}

export interface NotificationPreferences {
  appointments: boolean;
  medications: boolean;
  testResults: boolean;
  healthTips: boolean;
  emergencyAlerts: boolean;
  chatMessages: boolean;
  videoCallReminders: boolean;
  dietReminders: boolean;
  exerciseReminders: boolean;
  notificationTime: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  loginHistory: {
    date: string;
    time: string;
    device: string;
    location: string;
    ipAddress: string;
  }[];
  securityQuestions: {
    question: string;
    answer: string;
  }[];
  lastPasswordChange: string;
}

export interface SubscriptionPlan {
  type: 'free' | 'premium' | 'corporate';
  planName: string;
  startDate: string;
  endDate?: string;
  features: string[];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  corporateName?: string;
  corporateDiscount?: number;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
  token: string;
  dateOfBirth: string;
  age: number;
  userType: 'patient';
  gender: 'Male' | 'Female';
  phone: string;
  address: string;
  nationalId: string;
  passportNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  healthScore: number;
  bodyAge: number;
  medicalRecords: MedicalRecord[];
  activePrescriptions: Prescription[];
  prescriptionHistory: Prescription[];
  vitalSigns: VitalSigns[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  childcareBookings: ChildcareBooking[];
  nurseBookings: {
    id: string;
    nurseId: string;
    nurseName: string;
    date: string;
    time: string;
    type: 'home_visit' | 'clinic';
    service: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    notes?: string;
  }[];
  emergencyServiceContacts: {
    id: string;
    date: string;
    time: string;
    reason: string;
    serviceName: string;
    responseTime: number;
    status: 'resolved' | 'ongoing';
    notes: string;
  }[];
  chatHistory: {
    doctors: {
      doctorId: string;
      doctorName: string;
      specialty: string;
      lastMessage: string;
      lastMessageTime: string;
      unreadCount: number;
      messages: ChatMessage[];
    }[];
    nurses: {
      nurseId: string;
      nurseName: string;
      lastMessage: string;
      lastMessageTime: string;
      unreadCount: number;
      messages: ChatMessage[];
    }[];
    nannies: {
      nannyId: string;
      nannyName: string;
      lastMessage: string;
      lastMessageTime: string;
      unreadCount: number;
      messages: ChatMessage[];
    }[];
    emergencyServices: {
      serviceId: string;
      serviceName: string;
      lastMessage: string;
      lastMessageTime: string;
      messages: ChatMessage[];
    }[];
  };
  botHealthAssistant: {
    sessions: BotHealthSession[];
    dietHistory: DietEntry[];
    currentMealPlan: {
      startDate: string;
      endDate: string;
      meals: DietEntry[];
      calorieTarget: number;
      proteinTarget: number;
      carbTarget: number;
      fatTarget: number;
    };
    hydrationTracking: {
      date: string;
      targetML: number;
      consumedML: number;
      reminders: string[];
    }[];
    exerciseSuggestions: {
      date: string;
      exercises: {
        name: string;
        duration: number;
        caloriesBurned: number;
        completed: boolean;
      }[];
    }[];
  };
  videoCallHistory: VideoCallSession[];
  labTests: {
    id: string;
    testName: string;
    date: string;
    facility: string;
    orderedBy: string;
    results: {
      parameter: string;
      value: string;
      normalRange: string;
      status: 'normal' | 'abnormal';
    }[];
    reportUrl: string;
    notes?: string;
  }[];
  healthMetrics: HealthMetrics;
  insuranceCoverage: InsuranceCoverage;
  billingInformation: BillingInfo[];
  subscriptionPlan: SubscriptionPlan;
  notificationPreferences: NotificationPreferences;
  securitySettings: SecuritySettings;
  documents: {
    id: string;
    type: 'medical_report' | 'prescription' | 'lab_result' | 'insurance' | 'id_proof';
    name: string;
    uploadDate: string;
    url: string;
    size: string;
  }[];
  lastCheckupDate: string;
  nextScheduledCheckup: string;
  pillReminders: PillReminder[];
  emergencyContacts: EmergencyContact[];
  nutritionAnalyses: NutritionAnalysis[];
  medicineOrders: {
    id: string;
    orderDate: string;
    medicines: {
      name: string;
      quantity: number;
      price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'delivered';
    deliveryDate?: string;
    deliveryAddress: string;
  }[];
  registrationDate: string;
  lastLogin: string;
  verified: boolean;
  profileCompleteness: number;
}

// Patient Data with comprehensive information
export const patientsData = [
  {
    id: "PAT001",
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma.johnson@healthwyz.mu",
    password: "Patient123!",
    profileImage: "/images/patients/1.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDEiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient001",
    dateOfBirth: "1985-03-15",
    age: 39,
    gender: "Female",
    phone: "+230 5789 1234",
    address: "Rose Hill, Mauritius",
    nationalId: "E1503851234567",
    passportNumber: "MU8745123",
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Husband",
      phone: "+230 5890 2345",
      address: "Rose Hill, Mauritius"
    },
    bloodType: "A+",
    allergies: ["Penicillin", "Shellfish"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    healthScore: 78,
    bodyAge: 42,
    
    medicalRecords: [
      {
        id: "MR001",
        title: "Annual Physical Examination",
        date: "2024-12-01",
        time: "09:00",
        type: "consultation",
        doctorResponsible: "Dr. Sarah Johnson",
        nurseResponsible: "Maria Thompson",
        summary: "Comprehensive annual health checkup with blood work and vitals assessment",
        diagnosis: "Stable hypertension and diabetes management",
        treatment: "Continue current medication regimen with dose adjustments",
        notes: "Patient shows excellent compliance with treatment plan. HbA1c improved from 7.2% to 6.8%",
        attachments: ["blood_test_report_dec2024.pdf", "ecg_report_dec2024.pdf", "diabetes_monitoring_chart.pdf"]
      },
      {
        id: "MR002",
        title: "Diabetes Management Review",
        date: "2024-10-15",
        time: "14:30",
        type: "consultation",
        doctorResponsible: "Dr. Sarah Johnson",
        summary: "Quarterly diabetes management review with medication adjustment",
        diagnosis: "Type 2 Diabetes - well controlled",
        treatment: "Metformin dose optimization",
        notes: "Blood glucose levels stable, patient maintaining healthy diet"
      },
      {
        id: "MR003",
        title: "Blood Pressure Monitoring",
        date: "2024-11-20",
        time: "10:15",
        type: "consultation",
        doctorResponsible: "Dr. Sarah Johnson",
        nurseResponsible: "Maria Thompson",
        summary: "Blood pressure check and medication review",
        diagnosis: "Essential Hypertension - controlled",
        treatment: "Continue Lisinopril, lifestyle modifications",
        notes: "Blood pressure trending downward with current treatment"
      }
    ],

    activePrescriptions: [
      {
        id: "RX001",
        date: "2024-12-01",
        time: "10:30",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        medicines: [
          {
            name: "Metformin",
            dosage: "500mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with meals to reduce stomach upset. Monitor blood glucose levels daily.",
            beforeFood: false
          },
          {
            name: "Lisinopril",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning consistently. Monitor blood pressure weekly.",
            beforeFood: true
          }
        ],
        diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension",
        isActive: true,
        nextRefill: "2025-03-01",
        notes: "Patient responding well to current regimen. Continue monitoring glucose and BP.",
        orderInformation: {
          canReorder: true,
          lastOrderDate: "2024-12-05",
          nextOrderSuggestion: "2025-02-25",
          preferredPharmacy: "Apollo Pharmacy - Rose Hill",
          estimatedCost: 830,
          insuranceCovered: true,
          copayAmount: 250
        },
        reminderSettings: {
          enabled: true,
          reminderTimes: ["08:00", "20:00"],
          adherenceTracking: true,
          missedDoseAlerts: true
        }
      }
    ],

    prescriptionHistory: [
      {
        id: "RX_HIST_001",
        date: "2024-09-01",
        time: "10:00",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        medicines: [
          {
            name: "Metformin",
            dosage: "250mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Start with lower dose, take with meals",
            beforeFood: false
          }
        ],
        diagnosis: "Type 2 Diabetes Mellitus - Initial diagnosis",
        isActive: false,
        notes: "Initial diabetes medication - dose increased after tolerance established"
      },
      {
        id: "RX_HIST_002",
        date: "2024-06-15",
        time: "11:15",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        medicines: [
          {
            name: "Lisinopril",
            dosage: "5mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Initial hypertension treatment",
            beforeFood: true
          }
        ],
        diagnosis: "Essential Hypertension",
        isActive: false,
        notes: "Starting dose for blood pressure management"
      }
    ],

    vitalSigns: [
      {
        id: "VS001",
        date: "2024-12-01",
        time: "09:15",
        bloodPressure: { systolic: 135, diastolic: 85 },
        heartRate: 72,
        temperature: 36.7,
        weight: 68.5,
        height: 165,
        oxygenSaturation: 98,
        glucose: 142,
        cholesterol: 195,
        labTechnician: "Lisa Chen",
        facility: "Central Lab Services"
      },
      {
        id: "VS002",
        date: "2024-11-20",
        time: "10:30",
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 75,
        temperature: 36.6,
        weight: 68.2,
        height: 165,
        oxygenSaturation: 99,
        glucose: 138,
        labTechnician: "Maria Thompson",
        facility: "Apollo Bramwell Hospital"
      }
    ],

    upcomingAppointments: [
      {
        id: "APP001",
        date: "2025-01-15",
        time: "14:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Endocrinology",
        reason: "Quarterly diabetes management review",
        duration: 30,
        roomId: "emma_sarah_20250115",
        notes: "Review HbA1c results and adjust treatment plan if needed"
      },
      {
        id: "APP002",
        date: "2025-02-10",
        time: "09:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Endocrinology",
        reason: "Comprehensive health assessment",
        duration: 45,
        location: "Apollo Bramwell Hospital",
        notes: "Annual comprehensive exam with lab work"
      }
    ],

    pastAppointments: [
      {
        id: "APP001_PAST",
        date: "2024-12-01",
        time: "09:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Endocrinology",
        reason: "Annual checkup and medication review",
        duration: 45,
        location: "Apollo Bramwell Hospital",
        notes: "Discussed lifestyle modifications and medication adherence"
      },
      {
        id: "APP002_PAST",
        date: "2024-11-20",
        time: "10:15",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Endocrinology",
        reason: "Blood pressure monitoring",
        duration: 20,
        location: "Apollo Bramwell Hospital"
      }
    ],

    childcareBookings: [],

    nurseBookings: [
      {
        id: "NB001",
        nurseId: "NUR001",
        nurseName: "Patricia Williams",
        date: "2025-01-20",
        time: "10:00",
        type: "home_visit",
        service: "Blood pressure monitoring and medication administration guidance",
        status: "upcoming",
        notes: "Weekly BP check, insulin injection technique review, medication adherence counseling"
      },
      {
        id: "NB002",
        nurseId: "NUR001",
        nurseName: "Patricia Williams",
        date: "2025-02-03",
        time: "14:30",
        type: "clinic",
        service: "Diabetes education and nutrition counseling",
        status: "upcoming",
        notes: "Review carbohydrate counting and meal planning"
      }
    ],

    emergencyServiceContacts: [
      {
        id: "ES001",
        date: "2024-11-15",
        time: "22:30",
        reason: "Severe hypoglycemia episode with confusion",
        serviceName: "MediCare Emergency Services",
        responseTime: 12,
        status: "resolved",
        notes: "Patient found unconscious by husband. Glucose administered by paramedics. Transported to ER, stabilized and discharged next morning."
      }
    ],

    chatHistory: {
      doctors: [
        {
          doctorId: "DOC001",
          doctorName: "Dr. Sarah Johnson",
          specialty: "Endocrinology",
          lastMessage: "That's excellent progress! Keep monitoring your levels and we'll review at your next appointment.",
          lastMessageTime: "2024-12-14 17:15",
          unreadCount: 0,
          messages: [
            {
              id: "MSG001",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Good morning Dr. Johnson! I wanted to update you on my blood sugar readings from this week.",
              timestamp: "2024-12-14 16:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG002",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "Good morning Emma! I'd love to hear about your readings. How have they been trending?",
              timestamp: "2024-12-14 16:05",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG003",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Much better! My morning readings have been between 120-130, and post-meal readings rarely go above 160 now.",
              timestamp: "2024-12-14 16:10",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG004",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "That's wonderful improvement! What changes have you made to achieve this?",
              timestamp: "2024-12-14 16:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG005",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "I've been following the meal plan from our nutritionist more strictly, and I've added 20 minutes of walking after dinner each night.",
              timestamp: "2024-12-14 16:20",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG006",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "Excellent lifestyle modifications! How has your blood pressure been with the current Lisinopril dose?",
              timestamp: "2024-12-14 16:25",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG007",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Blood pressure has been consistently around 130/80. Much better than the 150/95 it was before starting treatment.",
              timestamp: "2024-12-14 16:30",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG008",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "Perfect! Are you experiencing any side effects from your medications?",
              timestamp: "2024-12-14 16:35",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG009",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "No side effects at all. I take the Metformin with meals as instructed, and the Lisinopril first thing in the morning.",
              timestamp: "2024-12-14 16:40",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG010",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "That's excellent progress! Keep monitoring your levels and we'll review at your next appointment.",
              timestamp: "2024-12-14 17:15",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nurses: [
        {
          nurseId: "NUR001",
          nurseName: "Patricia Williams",
          lastMessage: "Perfect! Your medication adherence is excellent. See you next week for the home visit!",
          lastMessageTime: "2024-12-19 15:30",
          unreadCount: 0,
          messages: [
            {
              id: "MSG011",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Hi Patricia! Question about tomorrow's home visit - should I prepare anything specific?",
              timestamp: "2024-12-19 13:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG012",
              senderId: "NUR001",
              senderName: "Patricia Williams",
              senderType: "nurse",
              message: "Hi Emma! Just have your blood pressure monitor ready and your medication list. I'll bring everything else we need.",
              timestamp: "2024-12-19 13:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG013",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Great! Also, can you bring the new glucose test strips? I'm running low and wanted to make sure I have enough.",
              timestamp: "2024-12-19 13:45",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG014",
              senderId: "NUR001",
              senderName: "Patricia Williams",
              senderType: "nurse",
              message: "Absolutely! I'll bring a fresh box. How many strips are you using per day on average?",
              timestamp: "2024-12-19 14:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG015",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "I'm testing twice daily as recommended - once fasting in the morning and once 2 hours after my largest meal.",
              timestamp: "2024-12-19 14:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG016",
              senderId: "NUR001",
              senderName: "Patricia Williams",
              senderType: "nurse",
              message: "Perfect! Your medication adherence is excellent. See you next week for the home visit!",
              timestamp: "2024-12-19 15:30",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nannies: [],
      emergencyServices: [
        {
          serviceId: "EMRG001",
          serviceName: "MediCare Emergency",
          lastMessage: "Emergency resolved. Follow up with Dr. Johnson within 48 hours and monitor glucose levels closely.",
          lastMessageTime: "2024-11-15 23:00",
          messages: [
            {
              id: "MSG017",
              senderId: "EMRG001",
              senderName: "Emergency Response Team",
              senderType: "emergency",
              message: "Patient stabilized and transported to Apollo Hospital ER. Glucose levels normalized.",
              timestamp: "2024-11-15 22:45",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG018",
              senderId: "EMRG001",
              senderName: "Emergency Response Team",
              senderType: "emergency",
              message: "Emergency resolved. Follow up with Dr. Johnson within 48 hours and monitor glucose levels closely.",
              timestamp: "2024-11-15 23:00",
              read: true,
              messageType: "text"
            }
          ]
        }
      ]
    },

    botHealthAssistant: {
      sessions: [
        {
          id: "BOT001",
          date: "2024-12-10",
          topic: "Diabetes Management and Nutritional Optimization",
          recommendations: {
            diet: [
              "Focus on complex carbohydrates with low glycemic index",
              "Include lean proteins with every meal",
              "Increase soluble fiber intake to 25-30g daily",
              "Limit refined sugars and processed foods",
              "Practice portion control using the plate method"
            ],
            exercise: [
              "30 minutes moderate cardio 5 days per week",
              "Resistance training 2-3 times weekly",
              "Post-meal walks to improve glucose uptake",
              "Monitor blood glucose before and after exercise"
            ],
            supplements: [
              "Vitamin D 2000 IU daily (deficiency noted in recent labs)",
              "Omega-3 fatty acids 1000mg daily for heart health",
              "Chromium picolinate 200mcg for glucose metabolism",
              "Magnesium 400mg for muscle and nerve function"
            ],
            lifestyle: [
              "Maintain consistent meal timing",
              "Achieve 7-8 hours quality sleep nightly",
              "Practice stress management techniques",
              "Regular blood glucose monitoring",
              "Annual eye and foot exams"
            ]
          },
          bookingSuggestions: [
            {
              type: "nutritionist",
              specialist: "Dr. Amanda Chen, RD",
              reason: "Advanced diabetic meal planning and carbohydrate counting education"
            },
            {
              type: "physio",
              specialist: "Sarah Mitchell, DPT",
              reason: "Exercise program design for diabetic patients"
            }
          ],
          hydrationReminders: [
            "Target 8-10 glasses of water daily",
            "Avoid high-sugar beverages",
            "Monitor for signs of dehydration",
            "Increase intake during exercise"
          ],
          mealPlan: {
            breakfast: "Steel-cut oatmeal with cinnamon, chopped almonds, and fresh berries",
            lunch: "Grilled salmon with quinoa and roasted vegetables",
            dinner: "Lean turkey breast with sweet potato and steamed broccoli",
            snacks: ["Greek yogurt with mixed nuts", "Apple slices with almond butter", "Hummus with vegetable sticks"]
          }
        }
      ],
      dietHistory: [
        {
          id: "DIET001",
          date: "2024-12-14",
          time: "08:00",
          mealType: "breakfast",
          foodItems: [
            {
              name: "Steel-cut oatmeal with berries",
              quantity: "1 cup cooked",
              calories: 220,
              carbs: 45,
              protein: 8,
              fat: 4,
              vitamins: ["B1", "B2", "Iron", "Magnesium", "Fiber"]
            },
            {
              name: "Almond slices",
              quantity: "1 oz",
              calories: 164,
              carbs: 6,
              protein: 6,
              fat: 14,
              vitamins: ["Vitamin E", "Magnesium", "Healthy fats"]
            }
          ],
          imageUrl: "/uploads/diet/breakfast_20241214.jpg",
          waterIntake: 500,
          notes: "Great fiber content, good protein balance, appropriate carb portion for diabetes management",
          nutritionScore: 92
        },
        {
          id: "DIET002",
          date: "2024-12-14",
          time: "12:30",
          mealType: "lunch",
          foodItems: [
            {
              name: "Grilled salmon",
              quantity: "4 oz",
              calories: 280,
              carbs: 0,
              protein: 42,
              fat: 12,
              vitamins: ["Omega-3", "Vitamin D", "B12", "Selenium"]
            },
            {
              name: "Quinoa",
              quantity: "1/2 cup cooked",
              calories: 111,
              carbs: 20,
              protein: 4,
              fat: 2,
              vitamins: ["Fiber", "Iron", "Magnesium", "Complete protein"]
            }
          ],
          waterIntake: 600,
          nutritionScore: 95
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 1800,
        proteinTarget: 100,
        carbTarget: 180,
        fatTarget: 60
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 2500,
          consumedML: 2200,
          reminders: ["08:00", "10:30", "13:00", "15:30", "18:00", "20:30"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Brisk Morning Walk",
              duration: 30,
              caloriesBurned: 180,
              completed: false
            },
            {
              name: "Resistance Band Training",
              duration: 20,
              caloriesBurned: 120,
              completed: false
            },
            {
              name: "Post-dinner Walk",
              duration: 15,
              caloriesBurned: 75,
              completed: false
            }
          ]
        }
      ]
    },

    videoCallHistory: [
      {
        id: "VC001",
        date: "2024-12-01",
        startTime: "14:00",
        endTime: "14:30",
        duration: 30,
        withType: "doctor",
        withName: "Dr. Sarah Johnson",
        withId: "DOC001",
        callQuality: "excellent",
        notes: "Discussed HbA1c results and medication adjustments. Patient very engaged and compliant."
      },
      {
        id: "VC002",
        date: "2024-11-15",
        startTime: "16:00",
        endTime: "16:20",
        duration: 20,
        withType: "nurse",
        withName: "Patricia Williams",
        withId: "NUR001",
        callQuality: "good",
        notes: "Medication administration guidance and blood pressure monitoring education"
      }
    ],

    labTests: [
      {
        id: "LAB001",
        testName: "Comprehensive Metabolic Panel",
        date: "2024-12-01",
        facility: "Central Lab Services",
        orderedBy: "Dr. Sarah Johnson",
        results: [
          {
            parameter: "HbA1c",
            value: "6.8%",
            normalRange: "<7.0% (diabetic target)",
            status: "normal"
          },
          {
            parameter: "Fasting Glucose",
            value: "128 mg/dL",
            normalRange: "70-130 mg/dL (diabetic target)",
            status: "normal"
          },
          {
            parameter: "Creatinine",
            value: "0.9 mg/dL",
            normalRange: "0.6-1.2 mg/dL",
            status: "normal"
          },
          {
            parameter: "eGFR",
            value: "92 mL/min/1.73m²",
            normalRange: ">60 mL/min/1.73m²",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/CMP_20241201.pdf",
        notes: "Excellent diabetes control, kidney function normal"
      },
      {
        id: "LAB002",
        testName: "Lipid Panel",
        date: "2024-12-01",
        facility: "Central Lab Services",
        orderedBy: "Dr. Sarah Johnson",
        results: [
          {
            parameter: "Total Cholesterol",
            value: "195 mg/dL",
            normalRange: "<200 mg/dL",
            status: "normal"
          },
          {
            parameter: "LDL Cholesterol",
            value: "115 mg/dL",
            normalRange: "<100 mg/dL (diabetic target)",
            status: "abnormal"
          },
          {
            parameter: "HDL Cholesterol",
            value: "55 mg/dL",
            normalRange: ">50 mg/dL (women)",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/Lipids_20241201.pdf"
      }
    ],

    healthMetrics: {
      cholesterol: {
        total: 195,
        ldl: 115,
        hdl: 55,
        triglycerides: 125,
        date: "2024-12-01"
      },
      bloodPressure: {
        systolic: 135,
        diastolic: 85,
        date: "2024-12-14"
      },
      bmi: {
        value: 25.1,
        category: "Slightly Overweight",
        date: "2024-12-01"
      },
      heartRateVariability: 35,
      sleepQuality: {
        averageHours: 7.2,
        quality: "good"
      },
      stressLevel: "moderate",
      bodyAge: 42,
      metabolicAge: 41,
      visceralFat: 9,
      muscleMass: 45.2,
      boneDensity: 2.8
    },

    insuranceCoverage: {
      provider: "Swan Life Assurance",
      policyNumber: "SWN-2024-001234",
      subscriberId: "PAT001SWN",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 500,
      deductible: 2000,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },

    billingInformation: [
      {
        id: "BILL001",
        type: "credit_card",
        cardNumber: "****1234",
        cardHolder: "Emma Johnson",
        expiryDate: "12/26",
        isDefault: true,
        addedDate: "2024-01-15"
      },
      {
        id: "BILL002",
        type: "mcb_juice",
        cardNumber: "****5678",
        cardHolder: "Emma Johnson",
        expiryDate: "08/25",
        isDefault: false,
        addedDate: "2024-03-20"
      }
    ],

    subscriptionPlan: {
      type: "premium",
      planName: "HealthWyz Premium Plus",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      features: [
        "Unlimited video consultations",
        "Priority appointments",
        "24/7 emergency support",
        "Free lab tests quarterly",
        "Nutrition counseling",
        "Home nurse visits",
        "Medication delivery",
        "Health monitoring devices"
      ],
      price: 2500,
      billingCycle: "monthly"
    },

    notificationPreferences: {
      appointments: true,
      medications: true,
      testResults: true,
      healthTips: true,
      emergencyAlerts: true,
      chatMessages: true,
      videoCallReminders: true,
      dietReminders: true,
      exerciseReminders: true,
      notificationTime: "09:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    },

    securitySettings: {
      twoFactorEnabled: true,
      biometricEnabled: true,
      loginHistory: [
        {
          date: "2024-12-15",
          time: "08:30",
          device: "iPhone 14",
          location: "Rose Hill, Mauritius",
          ipAddress: "196.192.110.45"
        },
        {
          date: "2024-12-14",
          time: "16:20",
          device: "MacBook Pro",
          location: "Rose Hill, Mauritius",
          ipAddress: "196.192.110.45"
        },
        {
          date: "2024-12-13",
          time: "12:15",
          device: "iPad Air",
          location: "Rose Hill, Mauritius",
          ipAddress: "196.192.110.45"
        }
      ],
      securityQuestions: [
        {
          question: "What is your mother's maiden name?",
          answer: "***encrypted***"
        },
        {
          question: "What was your first pet's name?",
          answer: "***encrypted***"
        }
      ],
      lastPasswordChange: "2024-10-15"
    },

    documents: [
      {
        id: "DOC001",
        type: "medical_report",
        name: "Annual_Health_Report_2024.pdf",
        uploadDate: "2024-12-01",
        url: "/documents/medical/annual_2024.pdf",
        size: "2.3 MB"
      },
      {
        id: "DOC002",
        type: "lab_result",
        name: "Diabetes_Panel_Dec2024.pdf",
        uploadDate: "2024-12-01",
        url: "/documents/lab/diabetes_panel.pdf",
        size: "1.8 MB"
      },
      {
        id: "DOC003",
        type: "prescription",
        name: "Current_Medications_List.pdf",
        uploadDate: "2024-12-01",
        url: "/documents/prescriptions/current_meds.pdf",
        size: "650 KB"
      },
      {
        id: "DOC004",
        type: "id_proof",
        name: "National_ID_Card.pdf",
        uploadDate: "2024-01-15",
        url: "/documents/id/national_id.pdf",
        size: "1.1 MB"
      }
    ],

    lastCheckupDate: "2024-12-01",
    nextScheduledCheckup: "2025-03-01",

    // Integrated Pill Reminders
    pillReminders: [
      {
        id: 'REM001',
        medicineId: 'MED001',
        medicineName: 'Metformin 500mg',
        dosage: '1 tablet',
        times: ['08:00', '20:00'],
        taken: [true, false],
        nextDose: '20:00',
        frequency: 'Twice daily',
        prescriptionId: 'RX001',
        startDate: '2024-12-01',
        endDate: '2025-03-01',
        isActive: true,
        notificationEnabled: true
      },
      {
        id: 'REM002',
        medicineId: 'MED002',
        medicineName: 'Lisinopril 10mg',
        dosage: '1 tablet',
        times: ['08:00'],
        taken: [true],
        nextDose: 'Tomorrow 08:00',
        frequency: 'Once daily',
        prescriptionId: 'RX001',
        startDate: '2024-12-01',
        endDate: '2025-03-01',
        isActive: true,
        notificationEnabled: true
      },
      {
        id: 'REM003',
        medicineId: 'MED003',
        medicineName: 'Glucose Test Strips',
        dosage: 'Test twice daily',
        times: ['08:00', '14:00'],
        taken: [true, false],
        nextDose: '14:00',
        frequency: 'Twice daily monitoring',
        prescriptionId: 'RX001',
        startDate: '2024-12-01',
        endDate: '2025-03-01',
        isActive: true,
        notificationEnabled: true
      }
    ],

    // Integrated Emergency Contacts
    emergencyContacts: [
      {
        id: 'EMRG001',
        name: 'National Emergency Response',
        service: 'General Emergency',
        phone: '999',
        available24h: true,
        responseTime: '8-12 min',
        specialization: ['Medical Emergency', 'Accident', 'Fire', 'Crime'],
        location: 'Central Station',
        distance: '2.5 km',
        priority: 'high'
      },
      {
        id: 'EMRG002',
        name: 'MediCare Emergency Services',
        service: 'Medical Emergency',
        phone: '+230 402-0000',
        available24h: true,
        responseTime: '10-15 min',
        specialization: ['Cardiac Emergency', 'Diabetic Emergency', 'Trauma'],
        location: 'Rose Hill Medical Center',
        distance: '1.8 km',
        priority: 'high'
      },
      {
        id: 'EMRG003',
        name: 'Diabetes Emergency Hotline',
        service: 'Specialized Emergency',
        phone: '+230 404-3333',
        available24h: true,
        responseTime: 'Immediate phone consultation',
        specialization: ['Diabetic Emergency', 'Hypoglycemia', 'Hyperglycemia'],
        location: 'Endocrinology Center',
        distance: '3.1 km',
        priority: 'high'
      },
      {
        id: 'EMRG004',
        name: 'Poison Control Center',
        service: 'Poison Emergency',
        phone: '+230 405-5555',
        available24h: true,
        responseTime: 'Immediate phone consultation',
        specialization: ['Poison Control', 'Overdose', 'Chemical Exposure'],
        location: 'National Hospital',
        distance: '5.1 km',
        priority: 'medium'
      }
    ],

    // Integrated Nutrition Analyses
    nutritionAnalyses: [
      {
        id: 'NA001',
        foodName: 'Steel-cut oatmeal with berries and almonds',
        date: '2024-12-14',
        time: '08:00',
        calories: 384,
        carbs: 51,
        protein: 14,
        fat: 16,
        vitamins: ['B1', 'B2', 'Iron', 'Magnesium', 'Fiber', 'Vitamin E', 'Antioxidants'],
        healthScore: 92,
        suggestions: [
          'Excellent choice for diabetes management',
          'High fiber content helps regulate blood sugar',
          'Good balance of complex carbs and protein',
          'Consider adding cinnamon for additional blood sugar benefits'
        ],
        allergens: ['Tree nuts (almonds)'],
        nutritionalBenefits: [
          'Sustained energy release from complex carbs',
          'High in soluble fiber for cholesterol management',
          'Rich in antioxidants from berries',
          'Good source of healthy fats from almonds'
        ],
        mealType: 'breakfast'
      },
      {
        id: 'NA002',
        foodName: 'Grilled salmon with quinoa and vegetables',
        date: '2024-12-14',
        time: '12:30',
        calories: 465,
        carbs: 35,
        protein: 48,
        fat: 18,
        vitamins: ['Omega-3', 'Vitamin D', 'B12', 'Selenium', 'Iron', 'Magnesium'],
        healthScore: 95,
        suggestions: [
          'Perfect for heart health and diabetes',
          'Omega-3 helps reduce inflammation',
          'Quinoa provides complete protein',
          'Excellent mineral content for overall health'
        ],
        allergens: ['Fish'],
        nutritionalBenefits: [
          'High-quality complete proteins',
          'Anti-inflammatory omega-3 fatty acids',
          'Heart-healthy meal choice',
          'Supports blood sugar stability'
        ],
        mealType: 'lunch'
      },
      {
        id: 'NA003',
        foodName: 'Greek yogurt with mixed nuts',
        date: '2024-12-14',
        time: '15:30',
        calories: 210,
        carbs: 12,
        protein: 15,
        fat: 14,
        vitamins: ['Calcium', 'Probiotics', 'Vitamin E', 'Magnesium', 'Healthy fats'],
        healthScore: 88,
        suggestions: [
          'Great protein-rich snack for diabetes',
          'Probiotics support digestive health',
          'Good balance of nutrients',
          'Helps maintain stable blood sugar between meals'
        ],
        allergens: ['Dairy', 'Tree nuts'],
        nutritionalBenefits: [
          'High in protein for satiety',
          'Probiotics for gut health',
          'Calcium for bone health',
          'Healthy fats for heart health'
        ],
        mealType: 'snack'
      }
    ],

    medicineOrders: [
      {
        id: "ORDER001",
        orderDate: "2024-12-05",
        medicines: [
          {
            name: "Metformin 500mg",
            quantity: 60,
            price: 450
          },
          {
            name: "Lisinopril 10mg",
            quantity: 30,
            price: 380
          }
        ],
        totalAmount: 830,
        status: "delivered",
        deliveryDate: "2024-12-07",
        deliveryAddress: "Rose Hill, Mauritius"
      },
      {
        id: "ORDER002",
        orderDate: "2024-11-15",
        medicines: [
          {
            name: "Glucose Test Strips",
            quantity: 100,
            price: 650
          },
          {
            name: "Lancets",
            quantity: 100,
            price: 120
          }
        ],
        totalAmount: 770,
        status: "delivered",
        deliveryDate: "2024-11-17",
        deliveryAddress: "Rose Hill, Mauritius"
      }
    ],

    registrationDate: "2023-08-15",
    lastLogin: "2024-12-15",
    verified: true,
    profileCompleteness: 98,
    userType: "patient"
  },

  // Second Patient - Liam Martinez
  {
    id: "PAT002",
    firstName: "Liam",
    lastName: "Martinez",
    email: "liam.martinez@healthwyz.mu",
    password: "Patient456!",
    profileImage: "/images/patients/2.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDIiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient002",
    dateOfBirth: "1992-07-22",
    age: 32,
    gender: "Male",
    phone: "+230 5890 2345",
    address: "Quatre Bornes, Mauritius",
    nationalId: "L2207921234567",
    emergencyContact: {
      name: "Sofia Martinez",
      relationship: "Wife",
      phone: "+230 5901 3456",
      address: "Quatre Bornes, Mauritius"
    },
    bloodType: "O-",
    allergies: ["Latex", "Aspirin"],
    chronicConditions: ["Asthma"],
    healthScore: 85,
    bodyAge: 30,

    medicalRecords: [
      {
        id: "MR002",
        title: "Asthma Follow-up Consultation",
        date: "2024-11-20",
        time: "15:30",
        type: "consultation",
        doctorResponsible: "Dr. Michael Chen",
        nurseResponsible: "Emma Rodriguez",
        summary: "Comprehensive asthma management review with spirometry testing",
        diagnosis: "Well-controlled persistent asthma",
        treatment: "Continue current bronchodilator therapy with technique optimization",
        notes: "Peak flow readings significantly improved. Patient demonstrates excellent inhaler technique. Exercise tolerance much better.",
        attachments: ["spirometry_results_nov2024.pdf", "asthma_action_plan.pdf"]
      },
      {
        id: "MR003",
        title: "Pulmonary Function Assessment",
        date: "2024-09-15",
        time: "11:00",
        type: "lab_result",
        doctorResponsible: "Dr. Michael Chen",
        summary: "Baseline pulmonary function testing for asthma monitoring",
        diagnosis: "Mild airway obstruction, reversible with bronchodilator",
        treatment: "Inhaled corticosteroid adjustment",
        notes: "FEV1 improved 15% post-bronchodilator"
      },
      {
        id: "MR004",
        title: "Emergency Department Visit",
        date: "2024-08-03",
        time: "22:15",
        type: "consultation",
        doctorResponsible: "Dr. Lisa Park",
        summary: "Acute asthma exacerbation triggered by air pollution",
        diagnosis: "Moderate asthma exacerbation",
        treatment: "Nebulizer treatment, oral prednisolone course",
        notes: "Patient responded well to treatment. Discharged with rescue inhaler instructions."
      }
    ],

    activePrescriptions: [
      {
        id: "RX002",
        date: "2024-11-20",
        time: "16:00",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        medicines: [
          {
            name: "Salbutamol Inhaler",
            dosage: "100mcg per puff",
            quantity: 2,
            frequency: "2 puffs as needed for symptoms",
            duration: "6 months",
            instructions: "Use during breathing difficulty. Shake well before use. Rinse mouth if using more than 4 puffs per day.",
            beforeFood: false
          },
          {
            name: "Budesonide Inhaler",
            dosage: "200mcg per puff",
            quantity: 1,
            frequency: "2 puffs twice daily",
            duration: "6 months",
            instructions: "Use as preventive medication. Always rinse mouth after use to prevent thrush.",
            beforeFood: false
          },
          {
            name: "Montelukast",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily in evening",
            duration: "6 months",
            instructions: "Take consistently each evening. Helps with exercise-induced symptoms.",
            beforeFood: false
          }
        ],
        diagnosis: "Persistent Asthma with Exercise-induced Bronchospasm",
        isActive: true,
        nextRefill: "2025-05-20",
        notes: "Patient showing excellent control with current regimen. Peak flow consistently >85% predicted.",
        orderInformation: {
          canReorder: true,
          lastOrderDate: "2024-11-25",
          nextOrderSuggestion: "2025-05-10",
          preferredPharmacy: "Wellkin Pharmacy - Quatre Bornes",
          estimatedCost: 1850,
          insuranceCovered: true,
          copayAmount: 300
        },
        reminderSettings: {
          enabled: true,
          reminderTimes: ["08:00", "20:00"],
          adherenceTracking: true,
          missedDoseAlerts: true
        }
      }
    ],

    prescriptionHistory: [
      {
        id: "RX_HIST_003",
        date: "2024-08-15",
        time: "14:00",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        medicines: [
          {
            name: "Prednisolone",
            dosage: "40mg",
            quantity: 5,
            frequency: "Once daily for 5 days",
            duration: "5 days",
            instructions: "Take with food to reduce stomach irritation",
            beforeFood: false
          }
        ],
        diagnosis: "Acute asthma exacerbation",
        isActive: false,
        notes: "Short-term oral steroid course following ER visit"
      }
    ],

    vitalSigns: [
      {
        id: "VS002",
        date: "2024-11-20",
        time: "15:45",
        bloodPressure: { systolic: 120, diastolic: 75 },
        heartRate: 68,
        temperature: 36.5,
        weight: 75.2,
        height: 178,
        oxygenSaturation: 98,
        labTechnician: "Robert Kim",
        facility: "Wellkin Hospital Lab"
      },
      {
        id: "VS003",
        date: "2024-10-15",
        time: "10:30",
        bloodPressure: { systolic: 118, diastolic: 72 },
        heartRate: 72,
        temperature: 36.4,
        weight: 74.8,
        height: 178,
        oxygenSaturation: 97,
        labTechnician: "Emma Rodriguez",
        facility: "Wellkin Hospital Lab"
      }
    ],

    upcomingAppointments: [
      {
        id: "APP002",
        date: "2025-02-20",
        time: "15:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        specialty: "Pulmonology",
        reason: "Quarterly asthma follow-up with spirometry",
        duration: 45,
        location: "Wellkin Hospital",
        notes: "Review current control, assess for step-down therapy possibility"
      },
      {
        id: "APP003",
        date: "2025-01-25",
        time: "14:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        specialty: "Pulmonology",
        reason: "Mid-cycle check-in",
        duration: 20,
        roomId: "liam_michael_20250125",
        notes: "Quick assessment of symptom control and adherence"
      }
    ],

    pastAppointments: [
      {
        id: "APP002_PAST",
        date: "2024-11-20",
        time: "15:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        specialty: "Pulmonology",
        reason: "Quarterly asthma management review",
        duration: 45,
        location: "Wellkin Hospital",
        notes: "Excellent control achieved, patient education reinforced"
      },
      {
        id: "APP004_PAST",
        date: "2024-08-03",
        time: "22:15",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Lisa Park",
        doctorId: "DOC008",
        specialty: "Emergency Medicine",
        reason: "Acute asthma exacerbation",
        duration: 180,
        location: "Wellkin Hospital ER"
      }
    ],

    childcareBookings: [
      {
        id: "CB001",
        date: "2025-01-10",
        time: "18:00",
        nannyName: "Sophie Chen",
        nannyId: "NAN001",
        duration: 4,
        type: "regular",
        children: ["Lucas Martinez (5 years)"],
        specialInstructions: "Child has mild food allergies - no nuts. Father has asthma inhaler if needed for activities.",
        status: "upcoming"
      },
      {
        id: "CB002",
        date: "2025-02-14",
        time: "19:00",
        nannyName: "Sophie Chen",
        nannyId: "NAN001",
        duration: 6,
        type: "regular",
        children: ["Lucas Martinez (5 years)"],
        specialInstructions: "Valentine's dinner date. Emergency inhalers available. Lucas knows daddy's breathing exercises.",
        status: "upcoming"
      }
    ],

    nurseBookings: [
      {
        id: "NB003",
        nurseId: "NUR002",
        nurseName: "Emma Rodriguez",
        date: "2025-01-30",
        time: "16:00",
        type: "clinic",
        service: "Inhaler technique assessment and asthma education",
        status: "upcoming",
        notes: "Annual inhaler technique review, peak flow meter training, asthma action plan update"
      }
    ],

    emergencyServiceContacts: [
      {
        id: "ES002",
        date: "2024-08-03",
        time: "21:45",
        reason: "Severe asthma attack with wheezing and shortness of breath",
        serviceName: "Wellkin Emergency Response",
        responseTime: 8,
        status: "resolved",
        notes: "Patient experienced severe asthma exacerbation after exposure to construction dust. Responded well to nebulizer treatment in ambulance. Transported to ER for further evaluation and treatment."
      }
    ],

    chatHistory: {
      doctors: [
        {
          doctorId: "DOC003",
          doctorName: "Dr. Michael Chen",
          specialty: "Pulmonology",
          lastMessage: "Excellent! Keep up the great work with your asthma management. The swimming is clearly helping your lung capacity.",
          lastMessageTime: "2024-12-10 12:45",
          unreadCount: 0,
          messages: [
            {
              id: "MSG020",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Hi Dr. Chen! I wanted to update you on my breathing since our last appointment.",
              timestamp: "2024-12-10 10:30",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG021",
              senderId: "DOC003",
              senderName: "Dr. Michael Chen",
              senderType: "doctor",
              message: "Hello Liam! I'd love to hear how you're doing. How has your breathing been overall?",
              timestamp: "2024-12-10 10:35",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG022",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Much better! I've been using my rescue inhaler maybe once or twice a week, usually only during really intense workouts.",
              timestamp: "2024-12-10 10:40",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG023",
              senderId: "DOC003",
              senderName: "Dr. Michael Chen",
              senderType: "doctor",
              message: "That's fantastic progress! Are you remembering to use your preventer inhaler twice daily?",
              timestamp: "2024-12-10 10:45",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG024",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Yes, religiously! Morning and evening, and I always rinse my mouth afterward. Sofia actually reminds me if I forget.",
              timestamp: "2024-12-10 10:50",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG025",
              senderId: "DOC003",
              senderName: "Dr. Michael Chen",
              senderType: "doctor",
              message: "Perfect! How has the exercise been going? Any issues with exercise-induced symptoms?",
              timestamp: "2024-12-10 11:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG026",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Actually, I've been swimming 3 times a week and it's been amazing! No breathing issues in the pool at all.",
              timestamp: "2024-12-10 11:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG027",
              senderId: "DOC003",
              senderName: "Dr. Michael Chen",
              senderType: "doctor",
              message: "Swimming is excellent for asthma patients! The humid environment and controlled breathing really help. Any concerns about air quality during outdoor activities?",
              timestamp: "2024-12-10 11:20",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG028",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "I've been checking the air quality app you recommended. On high pollution days, I stick to indoor activities or use my inhaler preemptively before going out.",
              timestamp: "2024-12-10 12:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG029",
              senderId: "DOC003",
              senderName: "Dr. Michael Chen",
              senderType: "doctor",
              message: "Excellent! Keep up the great work with your asthma management. The swimming is clearly helping your lung capacity.",
              timestamp: "2024-12-10 12:45",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nurses: [
        {
          nurseId: "NUR002",
          nurseName: "Emma Rodriguez",
          lastMessage: "Perfect! Your inhaler technique is excellent now. Keep up the great work!",
          lastMessageTime: "2024-12-05 14:30",
          unreadCount: 0,
          messages: [
            {
              id: "MSG030",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Hi Emma! I've been practicing the inhaler technique you showed me. Can I send you a quick video to make sure I'm doing it right?",
              timestamp: "2024-12-05 13:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG031",
              senderId: "NUR002",
              senderName: "Emma Rodriguez",
              senderType: "nurse",
              message: "Hi Liam! I'd love to see your technique. A short video would be perfect - that way I can give you specific feedback.",
              timestamp: "2024-12-05 13:10",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG032",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Here's the video! I made sure to shake it well first, then exhale fully before inhaling slowly and deeply.",
              timestamp: "2024-12-05 13:30",
              attachments: ["/uploads/videos/inhaler_technique_liam.mp4"],
              read: true,
              messageType: "video"
            },
            {
              id: "MSG033",
              senderId: "NUR002",
              senderName: "Emma Rodriguez",
              senderType: "nurse",
              message: "Excellent technique! I can see you're breathing in slowly and holding for the full 10 seconds. Your coordination is perfect now.",
              timestamp: "2024-12-05 14:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG034",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Thank you! It definitely feels more effective now. I can tell the medication is reaching deeper into my lungs.",
              timestamp: "2024-12-05 14:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG035",
              senderId: "NUR002",
              senderName: "Emma Rodriguez",
              senderType: "nurse",
              message: "Perfect! Your inhaler technique is excellent now. Keep up the great work!",
              timestamp: "2024-12-05 14:30",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nannies: [
        {
          nannyId: "NAN001",
          nannyName: "Sophie Chen",
          lastMessage: "Don't worry! Lucas understands about daddy's breathing medicine and he's very responsible about it.",
          lastMessageTime: "2024-12-08 18:45",
          unreadCount: 0,
          messages: [
            {
              id: "MSG036",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Hi Sophie! Just wanted to check in about Lucas and make sure he's not worried about my asthma.",
              timestamp: "2024-12-08 17:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG037",
              senderId: "NAN001",
              senderName: "Sophie Chen",
              senderType: "nanny",
              message: "Hi Liam! Lucas is doing great. He actually helped me organize your inhaler today and showed me where you keep your backup one.",
              timestamp: "2024-12-08 17:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG038",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "That's my boy! Has he asked any questions about it? I want to make sure he understands it's just medicine to help daddy breathe better.",
              timestamp: "2024-12-08 17:30",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG039",
              senderId: "NAN001",
              senderName: "Sophie Chen",
              senderType: "nanny",
              message: "He asked why you use it, and I explained it the way you told me - that it helps keep your lungs happy and strong. He seemed satisfied with that!",
              timestamp: "2024-12-08 18:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG040",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "Perfect explanation! I don't want him to be scared if he sees me use it. Has he been eating well? Any issues with his mild food allergies?",
              timestamp: "2024-12-08 18:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG041",
              senderId: "NAN001",
              senderName: "Sophie Chen",
              senderType: "nanny",
              message: "No issues at all! He's been great about telling me what he can and can't eat. We made nut-free cookies together today!",
              timestamp: "2024-12-08 18:30",
              attachments: ["/uploads/photos/lucas_cookies.jpg"],
              read: true,
              messageType: "text"
            },
            {
              id: "MSG042",
              senderId: "NAN001",
              senderName: "Sophie Chen",
              senderType: "nanny",
              message: "Don't worry! Lucas understands about daddy's breathing medicine and he's very responsible about it.",
              timestamp: "2024-12-08 18:45",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      emergencyServices: [
        {
          serviceId: "EMRG002",
          serviceName: "Wellkin Emergency Response",
          lastMessage: "Patient recovered well from asthma exacerbation. Follow up with pulmonologist completed. Clear airways, good response to treatment.",
          lastMessageTime: "2024-08-04 10:00",
          messages: [
            {
              id: "MSG043",
              senderId: "EMRG002",
              senderName: "Emergency Response Team",
              senderType: "emergency",
              message: "Patient transported to Wellkin Hospital ER with acute asthma exacerbation. Nebulizer treatment started en route.",
              timestamp: "2024-08-03 22:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG044",
              senderId: "EMRG002",
              senderName: "Emergency Response Team",
              senderType: "emergency",
              message: "Patient recovered well from asthma exacerbation. Follow up with pulmonologist completed. Clear airways, good response to treatment.",
              timestamp: "2024-08-04 10:00",
              read: true,
              messageType: "text"
            }
          ]
        }
      ]
    },

    botHealthAssistant: {
      sessions: [
        {
          id: "BOT002",
          date: "2024-12-05",
          topic: "Asthma Management and Athletic Performance Optimization",
          recommendations: {
            diet: [
              "Increase anti-inflammatory foods: fatty fish, leafy greens, berries",
              "Reduce dairy intake if it increases mucus production",
              "Include magnesium-rich foods: almonds, spinach, dark chocolate",
              "Stay hydrated to keep airways moist",
              "Avoid sulfite-containing foods and preservatives"
            ],
            exercise: [
              "Swimming 3-4 times per week for lung capacity",
              "Warm-up thoroughly before intense exercise",
              "Practice breathing exercises: 4-7-8 technique",
              "Yoga for breath control and stress management",
              "Monitor air quality before outdoor activities"
            ],
            supplements: [
              "Vitamin D 2000 IU daily for immune support",
              "Magnesium 400mg for bronchial muscle relaxation",
              "Omega-3 fatty acids 1000mg for anti-inflammatory effects",
              "Quercetin 500mg as natural antihistamine"
            ],
            lifestyle: [
              "Use air purifier at home, especially bedroom",
              "Monitor daily air quality index",
              "Practice stress management techniques",
              "Maintain consistent sleep schedule",
              "Keep rescue inhaler accessible always"
            ]
          },
          bookingSuggestions: [
            {
              type: "yoga",
              specialist: "Master Raj Patel",
              reason: "Pranayama breathing techniques for asthma control and athletic performance"
            },
            {
              type: "nutritionist",
              specialist: "Dr. Amanda Chen",
              reason: "Anti-inflammatory nutrition plan for active individuals with asthma"
            }
          ],
          hydrationReminders: [
            "Drink 3-4 liters daily to keep airways moist",
            "Increase intake during exercise and humid weather",
            "Avoid very cold drinks during asthma episodes"
          ],
          mealPlan: {
            breakfast: "Green smoothie with spinach, banana, ginger, and protein powder",
            lunch: "Grilled salmon with quinoa and roasted vegetables",
            dinner: "Chicken and vegetable curry with turmeric and brown rice",
            snacks: ["Mixed berries and yogurt", "Handful of almonds", "Apple with almond butter"]
          }
        }
      ],
      dietHistory: [
        {
          id: "DIET002",
          date: "2024-12-13",
          time: "12:30",
          mealType: "lunch",
          foodItems: [
            {
              name: "Grilled Salmon",
              quantity: "150g",
              calories: 280,
              carbs: 0,
              protein: 42,
              fat: 12,
              vitamins: ["Omega-3", "Vitamin D", "B12", "Selenium"]
            },
            {
              name: "Quinoa Salad",
              quantity: "100g",
              calories: 220,
              carbs: 39,
              protein: 8,
              fat: 4,
              vitamins: ["Fiber", "Iron", "Magnesium", "Complete amino acids"]
            },
            {
              name: "Steamed Broccoli",
              quantity: "80g",
              calories: 25,
              carbs: 5,
              protein: 3,
              fat: 0,
              vitamins: ["Vitamin C", "Vitamin K", "Folate", "Antioxidants"]
            }
          ],
          imageUrl: "/uploads/diet/lunch_20241213.jpg",
          waterIntake: 600,
          notes: "Excellent anti-inflammatory meal choice. High omega-3 content supports respiratory health.",
          nutritionScore: 95
        },
        {
          id: "DIET003",
          date: "2024-12-13",
          time: "19:30",
          mealType: "dinner",
          foodItems: [
            {
              name: "Turmeric Chicken Curry",
              quantity: "200g",
              calories: 320,
              carbs: 8,
              protein: 45,
              fat: 12,
              vitamins: ["Turmeric (anti-inflammatory)", "Protein", "B6", "Niacin"]
            },
            {
              name: "Brown Rice",
              quantity: "150g cooked",
              calories: 170,
              carbs: 35,
              protein: 4,
              fat: 1,
              vitamins: ["Fiber", "Magnesium", "B vitamins", "Complex carbs"]
            }
          ],
          waterIntake: 500,
          notes: "Turmeric provides natural anti-inflammatory benefits for asthma management",
          nutritionScore: 90
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 2400,
        proteinTarget: 130,
        carbTarget: 280,
        fatTarget: 80
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 3000,
          consumedML: 2750,
          reminders: ["07:00", "09:30", "12:00", "15:00", "18:00", "20:30"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Swimming Laps",
              duration: 45,
              caloriesBurned: 400,
              completed: false
            },
            {
              name: "Breathing Exercises",
              duration: 15,
              caloriesBurned: 20,
              completed: false
            },
            {
              name: "Yoga Flow",
              duration: 30,
              caloriesBurned: 120,
              completed: false
            }
          ]
        }
      ]
    },

    videoCallHistory: [
      {
        id: "VC002",
        date: "2024-11-20",
        startTime: "15:30",
        endTime: "16:15",
        duration: 45,
        withType: "doctor",
        withName: "Dr. Michael Chen",
        withId: "DOC003",
        callQuality: "excellent",
        notes: "Comprehensive asthma review. Discussed exercise program and inhaler technique optimization."
      },
      {
        id: "VC003",
        date: "2024-10-15",
        startTime: "11:00",
        endTime: "11:20",
        duration: 20,
        withType: "nurse",
        withName: "Emma Rodriguez",
        withId: "NUR002",
        callQuality: "good",
        notes: "Inhaler technique assessment via video. Patient demonstrated improved coordination."
      }
    ],

    labTests: [
      {
        id: "LAB002",
        testName: "Pulmonary Function Test with Bronchodilator Response",
        date: "2024-11-20",
        facility: "Wellkin Hospital Pulmonary Lab",
        orderedBy: "Dr. Michael Chen",
        results: [
          {
            parameter: "FEV1 Pre-bronchodilator",
            value: "3.2 L (85% predicted)",
            normalRange: ">80% predicted",
            status: "normal"
          },
          {
            parameter: "FEV1 Post-bronchodilator",
            value: "3.6 L (95% predicted)",
            normalRange: ">80% predicted",
            status: "normal"
          },
          {
            parameter: "Peak Expiratory Flow",
            value: "520 L/min",
            normalRange: "450-650 L/min",
            status: "normal"
          },
          {
            parameter: "FEV1/FVC Ratio",
            value: "78%",
            normalRange: ">75%",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/PFT_detailed_20241120.pdf",
        notes: "Excellent bronchodilator response. Lung function significantly improved compared to August baseline."
      },
      {
        id: "LAB003",
        testName: "Complete Blood Count with Eosinophil Count",
        date: "2024-11-20",
        facility: "Wellkin Hospital Lab",
        orderedBy: "Dr. Michael Chen",
        results: [
          {
            parameter: "Eosinophils",
            value: "3%",
            normalRange: "1-4%",
            status: "normal"
          },
          {
            parameter: "Total IgE",
            value: "180 IU/mL",
            normalRange: "<150 IU/mL",
            status: "abnormal"
          }
        ],
        reportUrl: "/reports/lab/CBC_allergy_20241120.pdf"
      }
    ],

    healthMetrics: {
      cholesterol: {
        total: 180,
        ldl: 100,
        hdl: 65,
        triglycerides: 95,
        date: "2024-11-20"
      },
      bloodPressure: {
        systolic: 120,
        diastolic: 75,
        date: "2024-12-14"
      },
      bmi: {
        value: 23.7,
        category: "Normal Weight",
        date: "2024-11-20"
      },
      heartRateVariability: 45,
      sleepQuality: {
        averageHours: 7.8,
        quality: "excellent"
      },
      stressLevel: "low",
      bodyAge: 30,
      metabolicAge: 29,
      visceralFat: 6,
      muscleMass: 54.2,
      boneDensity: 3.3
    },

    insuranceCoverage: {
      provider: "MCB Corporate Health Insurance",
      policyNumber: "MCB-CORP-2024-567890",
      groupNumber: "TECHSOL-001",
      subscriberId: "PAT002MCB",
      validFrom: "2024-03-01",
      validUntil: "2025-02-28",
      copay: 300,
      deductible: 1500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },

    billingInformation: [
      {
        id: "BILL003",
        type: "mcb_juice",
        cardNumber: "****9012",
        cardHolder: "Liam Martinez",
        expiryDate: "06/27",
        isDefault: true,
        addedDate: "2024-03-15"
      },
      {
        id: "BILL004",
        type: "credit_card",
        cardNumber: "****3456",
        cardHolder: "Sofia Martinez",
        expiryDate: "09/26",
        isDefault: false,
        addedDate: "2024-07-20"
      }
    ],

    subscriptionPlan: {
      type: "corporate",
      planName: "Corporate Health Plus with Wellness Benefits",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      features: [
        "All premium features included",
        "Annual comprehensive health screening",
        "Gym and fitness center membership",
        "Wellness programs and workshops",
        "Mental health support",
        "Nutrition counseling",
        "Preventive care coverage",
        "Emergency medical services"
      ],
      price: 0,
      billingCycle: "yearly",
      corporateName: "Tech Solutions Ltd",
      corporateDiscount: 100
    },

    notificationPreferences: {
      appointments: true,
      medications: true,
      testResults: true,
      healthTips: true,
      emergencyAlerts: true,
      chatMessages: true,
      videoCallReminders: true,
      dietReminders: true,
      exerciseReminders: true,
      notificationTime: "08:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    },

    securitySettings: {
      twoFactorEnabled: true,
      biometricEnabled: true,
      loginHistory: [
        {
          date: "2024-12-14",
          time: "09:00",
          device: "Samsung Galaxy S23",
          location: "Quatre Bornes, Mauritius",
          ipAddress: "196.192.120.78"
        },
        {
          date: "2024-12-13",
          time: "18:30",
          device: "MacBook Air",
          location: "Quatre Bornes, Mauritius",
          ipAddress: "196.192.120.78"
        },
        {
          date: "2024-12-12",
          time: "12:15",
          device: "iPad Pro",
          location: "Port Louis, Mauritius",
          ipAddress: "196.192.125.92"
        }
      ],
      securityQuestions: [
        {
          question: "What city were you born in?",
          answer: "***encrypted***"
        },
        {
          question: "What was your first car model?",
          answer: "***encrypted***"
        }
      ],
      lastPasswordChange: "2024-09-20"
    },

    documents: [
      {
        id: "DOC003",
        type: "insurance",
        name: "Corporate_Insurance_Policy.pdf",
        uploadDate: "2024-03-01",
        url: "/documents/insurance/policy_mcb_corp.pdf",
        size: "3.2 MB"
      },
      {
        id: "DOC004",
        type: "medical_report",
        name: "Pulmonary_Function_Report_Nov2024.pdf",
        uploadDate: "2024-11-20",
        url: "/documents/medical/pft_report_nov.pdf",
        size: "2.1 MB"
      },
      {
        id: "DOC005",
        type: "prescription",
        name: "Asthma_Action_Plan.pdf",
        uploadDate: "2024-11-20",
        url: "/documents/prescriptions/asthma_plan.pdf",
        size: "890 KB"
      }
    ],

    lastCheckupDate: "2024-11-20",
    nextScheduledCheckup: "2025-02-20",

    // Integrated Pill Reminders
    pillReminders: [
      {
        id: 'REM004',
        medicineId: 'MED004',
        medicineName: 'Budesonide Inhaler 200mcg',
        dosage: '2 puffs',
        times: ['08:00', '20:00'],
        taken: [true, true],
        nextDose: 'Tomorrow 08:00',
        frequency: 'Twice daily',
        prescriptionId: 'RX002',
        startDate: '2024-11-20',
        endDate: '2025-05-20',
        isActive: true,
        notificationEnabled: true
      },
      {
        id: 'REM005',
        medicineId: 'MED005',
        medicineName: 'Montelukast 10mg',
        dosage: '1 tablet',
        times: ['20:00'],
        taken: [true],
        nextDose: 'Tomorrow 20:00',
        frequency: 'Once daily in evening',
        prescriptionId: 'RX002',
        startDate: '2024-11-20',
        endDate: '2025-05-20',
        isActive: true,
        notificationEnabled: true
      },
      {
        id: 'REM006',
        medicineId: 'MED006',
        medicineName: 'Salbutamol Inhaler',
        dosage: '2 puffs as needed',
        times: ['As needed'],
        taken: [false],
        nextDose: 'Use when symptoms occur',
        frequency: 'As required for symptoms',
        prescriptionId: 'RX002',
        startDate: '2024-11-20',
        endDate: '2025-05-20',
        isActive: true,
        notificationEnabled: false
      }
    ],

    // Integrated Emergency Contacts
    emergencyContacts: [
      {
        id: 'EMRG001',
        name: 'National Emergency Response',
        service: 'General Emergency',
        phone: '999',
        available24h: true,
        responseTime: '8-12 min',
        specialization: ['Medical Emergency', 'Accident', 'Fire', 'Crime'],
        location: 'Central Station',
        distance: '4.2 km',
        priority: 'high'
      },
      {
        id: 'EMRG003',
        name: 'Wellkin Emergency Response',
        service: 'Medical Emergency',
        phone: '+230 403-1111',
        available24h: true,
        responseTime: '8-10 min',
        specialization: ['Respiratory Emergency', 'Asthma Crisis', 'Allergic Reactions'],
        location: 'Quatre Bornes Hospital',
        distance: '1.2 km',
        priority: 'high'
      },
      {
        id: 'EMRG006',
        name: 'Respiratory Emergency Unit',
        service: 'Specialized Emergency',
        phone: '+230 407-4444',
        available24h: true,
        responseTime: '6-8 min',
        specialization: ['Severe Asthma', 'Respiratory Failure', 'Bronchospasm'],
        location: 'Wellkin Respiratory Center',
        distance: '1.8 km',
        priority: 'high'
      },
      {
        id: 'EMRG004',
        name: 'Poison Control Center',
        service: 'Poison Emergency',
        phone: '+230 405-5555',
        available24h: true,
        responseTime: 'Immediate phone consultation',
        specialization: ['Poison Control', 'Overdose', 'Chemical Exposure'],
        location: 'National Hospital',
        distance: '6.8 km',
        priority: 'medium'
      },
      {
        id: 'EMRG007',
        name: 'Air Quality Emergency Hotline',
        service: 'Environmental Health',
        phone: '+230 408-6666',
        available24h: true,
        responseTime: 'Real-time air quality updates',
        specialization: ['Air Quality Alerts', 'Pollution Emergency', 'Environmental Health'],
        location: 'Environmental Health Department',
        distance: '3.5 km',
        priority: 'medium'
      }
    ],

    // Integrated Nutrition Analyses
    nutritionAnalyses: [
      {
        id: 'NA004',
        foodName: 'Green smoothie with spinach, banana, and ginger',
        date: '2024-12-13',
        time: '07:30',
        calories: 185,
        carbs: 42,
        protein: 4,
        fat: 1,
        vitamins: ['Vitamin C', 'Vitamin K', 'Folate', 'Potassium', 'Antioxidants', 'Anti-inflammatory compounds'],
        healthScore: 94,
        suggestions: [
          'Excellent anti-inflammatory choice for asthma',
          'Ginger helps reduce airway inflammation',
          'High in antioxidants to support lung health',
          'Add protein powder for better satiety'
        ],
        allergens: [],
        nutritionalBenefits: [
          'Natural anti-inflammatory properties',
          'High in antioxidants for respiratory health',
          'Supports immune system function',
          'Easy to digest and nutrient-dense'
        ],
        mealType: 'breakfast'
      },
      {
        id: 'NA005',
        foodName: 'Grilled salmon with turmeric quinoa',
        date: '2024-12-13',
        time: '12:30',
        calories: 425,
        carbs: 35,
        protein: 42,
        fat: 15,
        vitamins: ['Omega-3', 'Vitamin D', 'Turmeric (curcumin)', 'Complete amino acids', 'Iron'],
        healthScore: 96,
        suggestions: [
          'Perfect anti-inflammatory meal for asthma',
          'Omega-3 helps reduce airway inflammation',
          'Turmeric provides natural anti-inflammatory benefits',
          'High-quality protein supports muscle health'
        ],
        allergens: ['Fish'],
        nutritionalBenefits: [
          'Potent anti-inflammatory omega-3 fatty acids',
          'Turmeric reduces respiratory inflammation',
          'Complete protein for muscle maintenance',
          'Supports overall respiratory health'
        ],
        mealType: 'lunch'
      },
      {
        id: 'NA006',
        foodName: 'Turmeric chicken curry with brown rice',
        date: '2024-12-13',
        time: '19:30',
        calories: 490,
        carbs: 43,
        protein: 49,
        fat: 13,
        vitamins: ['Turmeric (curcumin)', 'B6', 'Niacin', 'Fiber', 'Complex carbs', 'Anti-inflammatory spices'],
        healthScore: 90,
        suggestions: [
          'Turmeric provides excellent anti-inflammatory benefits',
          'Brown rice offers sustained energy',
          'Lean protein supports respiratory muscle strength',
          'Spices help clear airways naturally'
        ],
        allergens: [],
        nutritionalBenefits: [
          'Natural anti-inflammatory from turmeric',
          'Supports respiratory health',
          'High-quality lean protein',
          'Complex carbs for sustained energy'
        ],
        mealType: 'dinner'
      },
      {
        id: 'NA007',
        foodName: 'Apple slices with almond butter',
        date: '2024-12-13',
        time: '15:00',
        calories: 195,
        carbs: 18,
        protein: 7,
        fat: 12,
        vitamins: ['Vitamin E', 'Magnesium', 'Fiber', 'Antioxidants', 'Healthy fats'],
        healthScore: 85,
        suggestions: [
          'Good source of magnesium for bronchial health',
          'Apple provides quercetin - natural antihistamine',
          'Healthy fats support lung function',
          'Fiber helps with overall health'
        ],
        allergens: ['Tree nuts (almonds)'],
        nutritionalBenefits: [
          'Magnesium helps relax bronchial muscles',
          'Quercetin acts as natural antihistamine',
          'Vitamin E supports lung health',
          'Balanced snack for sustained energy'
        ],
        mealType: 'snack'
      }
    ],

    medicineOrders: [
      {
        id: "ORDER002",
        orderDate: "2024-11-25",
        medicines: [
          {
            name: "Salbutamol Inhaler 100mcg",
            quantity: 2,
            price: 650
          },
          {
            name: "Budesonide Inhaler 200mcg",
            quantity: 1,
            price: 850
          },
          {
            name: "Montelukast 10mg",
            quantity: 30,
            price: 420
          }
        ],
        totalAmount: 1920,
        status: "delivered",
        deliveryDate: "2024-11-27",
        deliveryAddress: "Quatre Bornes, Mauritius"
      },
      {
        id: "ORDER003",
        orderDate: "2024-10-15",
        medicines: [
          {
            name: "Peak Flow Meter",
            quantity: 1,
            price: 380
          },
          {
            name: "Spacer Device",
            quantity: 1,
            price: 220
          }
        ],
        totalAmount: 600,
        status: "delivered",
        deliveryDate: "2024-10-17",
        deliveryAddress: "Quatre Bornes, Mauritius"
      }
    ],

    registrationDate: "2023-11-10",
    lastLogin: "2024-12-14",
    verified: true,
    profileCompleteness: 95,
    userType: "patient"
  }
];