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
  status?: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered'
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
  id: string
  title: string
  date: string
  time: string
  type: 'consultation' | 'prescription' | 'lab_result' | 'imaging' | 'vaccination' | 'surgery'
  doctorResponsible: string
  nurseResponsible?: string
  summary: string
  diagnosis?: string
  treatment?: string
  notes?: string
  attachments?: string[]
}

export interface Prescription {
  id: string
  date: string
  time: string
  doctorName: string
  doctorId: string
  medicines: Array<{
    name: string
    dosage: string
    quantity: number
    frequency: string
    duration: string
    instructions: string
    beforeFood: boolean
  }>
  diagnosis: string
  isActive: boolean
  nextRefill?: string
  notes?: string
  orderInformation?: {
    canReorder: boolean
    lastOrderDate?: string
    nextOrderSuggestion?: string
    preferredPharmacy?: string
    estimatedCost: number
    insuranceCovered: boolean
    copayAmount: number
  }
  reminderSettings?: {
    enabled: boolean
    reminderTimes: string[]
    adherenceTracking: boolean
    missedDoseAlerts: boolean
  }
}

export interface VitalSigns {
  id: string
  date: string
  time: string
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  temperature: number
  weight: number
  height: number
  oxygenSaturation: number
  glucose?: number
  cholesterol?: number
  labTechnician: string
  facility: string
}

export interface Appointment {
  id: string
  date: string
  time: string
  type: 'video' | 'in-person'
  status: 'upcoming' | 'completed' | 'cancelled'
  doctorName: string
  doctorId: string
  specialty: string
  reason: string
  duration: number
  location?: string
  roomId?: string
  notes?: string
}

export interface ChildcareBooking {
  id: string
  date: string
  time: string
  nannyName: string
  nannyId: string
  duration: number
  type: 'regular' | 'overnight'
  children: string[]
  specialInstructions?: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

export interface InsuranceCoverage {
  provider: string
  policyNumber: string
  groupNumber?: string
  subscriberId: string
  validFrom: string
  validUntil: string
  copay: number
  deductible: number
  coverageType: 'individual' | 'family'
  emergencyCoverage: boolean
  pharmacyCoverage: boolean
  dentalCoverage: boolean
  visionCoverage: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: 'patient' | 'doctor' | 'nurse' | 'nanny' | 'bot' | 'emergency'
  message: string
  timestamp: string
  attachments?: string[]
  read: boolean
  messageType: 'text' | 'image' | 'video' | 'file' | 'voice'
}

export interface DietEntry {
  id: string
  date: string
  time: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  foodItems: {
    name: string
    quantity: string
    calories: number
    carbs: number
    protein: number
    fat: number
    vitamins: string[]
  }[]
  imageUrl?: string
  waterIntake: number
  notes?: string
  nutritionScore: number
}

export interface HealthMetrics {
  cholesterol: {
    total: number
    ldl: number
    hdl: number
    triglycerides: number
    date: string
  }
  bloodPressure: {
    systolic: number
    diastolic: number
    date: string
  }
  bmi: {
    value: number
    category: string
    date: string
  }
  heartRateVariability: number
  sleepQuality: {
    averageHours: number
    quality: 'poor' | 'fair' | 'good' | 'excellent'
  }
  stressLevel: 'low' | 'moderate' | 'high'
  bodyAge: number
  metabolicAge: number
  visceralFat: number
  muscleMass: number
  boneDensity: number
}

export interface BotHealthSession {
  id: string
  date: string
  topic: string
  recommendations: {
    diet: string[]
    exercise: string[]
    supplements: string[]
    lifestyle: string[]
  }
  bookingSuggestions: {
    type: 'psychologist' | 'nutritionist' | 'yoga' | 'physio'
    specialist: string
    reason: string
  }[]
  hydrationReminders: string[]
  mealPlan?: {
    breakfast: string
    lunch: string
    dinner: string
    snacks: string[]
  }
}

export interface VideoCallSession {
  id: string
  date: string
  startTime: string
  endTime: string
  duration: number
  withType: 'doctor' | 'nurse' | 'nanny'
  withName: string
  withId: string
  callQuality: 'poor' | 'fair' | 'good' | 'excellent'
  recording?: string
  notes?: string
  prescription?: string
}

export interface BillingInfo {
  id: string
  type: 'mcb_juice' | 'credit_card'
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv?: string
  isDefault: boolean
  addedDate: string
}

export interface NotificationPreferences {
  appointments: boolean
  medications: boolean
  testResults: boolean
  healthTips: boolean
  emergencyAlerts: boolean
  chatMessages: boolean
  videoCallReminders: boolean
  dietReminders: boolean
  exerciseReminders: boolean
  notificationTime: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  loginHistory: {
    date: string
    time: string
    device: string
    location: string
    ipAddress: string
  }[]
  securityQuestions: {
    question: string
    answer: string
  }[]
  lastPasswordChange: string
}

export interface SubscriptionPlan {
  type: 'free' | 'premium' | 'corporate'
  planName: string
  startDate: string
  endDate?: string
  features: string[]
  price: number
  billingCycle: 'monthly' | 'yearly'
  corporateName?: string
  corporateDiscount?: number
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  profileImage: string
  token: string
  dateOfBirth: string
  age: number
  userType: 'patient'
  gender: 'Male' | 'Female'
  phone: string
  address: string
  nationalId: string
  passportNumber?: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
    address: string
  }
  bloodType: string
  allergies: string[]
  chronicConditions: string[]
  healthScore: number
  bodyAge: number
  profileCompleteness?: number
  verified?: boolean
  medicalRecords: MedicalRecord[]
  activePrescriptions: Prescription[]
  prescriptionHistory: Prescription[]
  vitalSigns: VitalSigns[]
  upcomingAppointments: Appointment[]
  pastAppointments: Appointment[]
  childcareBookings: ChildcareBooking[]
  nurseBookings: {
    id: string
    nurseId: string
    nurseName: string
    date: string
    time: string
    type: 'home_visit' | 'clinic'
    service: string
    status: 'upcoming' | 'completed' | 'cancelled'
    notes?: string
  }[]
  emergencyServiceContacts: {
    id: string
    date: string
    time: string
    reason: string
    serviceName: string
    responseTime: number
    status: 'resolved' | 'ongoing'
    notes: string
  }[]
  chatHistory: {
    doctors: {
      doctorId: string
      doctorName: string
      specialty: string
      lastMessage: string
      lastMessageTime: string
      unreadCount: number
      messages: ChatMessage[]
    }[]
    nurses: {
      nurseId: string
      nurseName: string
      lastMessage: string
      lastMessageTime: string
      unreadCount: number
      messages: ChatMessage[]
    }[]
    nannies: {
      nannyId: string
      nannyName: string
      lastMessage: string
      lastMessageTime: string
      unreadCount: number
      messages: ChatMessage[]
    }[]
    emergencyServices: {
      serviceId: string
      serviceName: string
      lastMessage: string
      lastMessageTime: string
      messages: ChatMessage[]
    }[]
  }
  botHealthAssistant: {
    sessions: BotHealthSession[]
    dietHistory: DietEntry[]
    currentMealPlan: {
      startDate: string
      endDate: string
      meals: DietEntry[]
      calorieTarget: number
      proteinTarget: number
      carbTarget: number
      fatTarget: number
    }
    hydrationTracking: {
      date: string
      targetML: number
      consumedML: number
      reminders: string[]
    }[]
    exerciseSuggestions: {
      date: string
      exercises: {
        name: string
        duration: number
        caloriesBurned: number
        completed: boolean
      }[]
    }[]
  }
  videoCallHistory: VideoCallSession[]
  labTests: {
    id: string
    testName: string
    date: string
    facility: string
    orderedBy: string
    results: {
      parameter: string
      value: string
      normalRange: string
      status: 'normal' | 'abnormal'
    }[]
    reportUrl: string
    notes?: string
  }[]
  healthMetrics: HealthMetrics
  insuranceCoverage: InsuranceCoverage
  billingInformation: BillingInfo[]
  subscriptionPlan: SubscriptionPlan
  notificationPreferences: NotificationPreferences
  securitySettings: SecuritySettings
  documents: {
    id: string
    type: 'medical_report' | 'prescription' | 'lab_result' | 'insurance' | 'id_proof'
    name: string
    uploadDate: string
    url: string
    size: string
  }[]
  lastCheckupDate: string
  nextScheduledCheckup: string
  pillReminders: PillReminder[]
  emergencyContacts: EmergencyContact[]
  nutritionAnalyses: NutritionAnalysis[]
  medicineOrders: MedicineOrder[]
}

// Empty array - data now comes from Prisma database
export const patientsData: Patient[] = []
