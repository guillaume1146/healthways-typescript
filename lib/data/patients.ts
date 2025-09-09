
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
  medicines: {
    name: string;
    dosage: string;
    quantity: number;
    frequency: string;
    duration: string;
    instructions: string;
    beforeFood: boolean;
  }[];
  diagnosis: string;
  notes?: string;
  isActive: boolean;
  nextRefill?: string;
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
  meetingLink?: string;
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

export const patientsData: Patient[] = [
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
        treatment: "Continue current medication regimen",
        notes: "Patient shows good compliance with treatment plan",
        attachments: ["blood_test_report_dec2024.pdf", "ecg_report_dec2024.pdf"]
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
            instructions: "Take with meals",
            beforeFood: false
          },
          {
            name: "Lisinopril",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning",
            beforeFood: true
          }
        ],
        diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension",
        isActive: true,
        nextRefill: "2025-03-01"
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
            dosage: "500mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with meals",
            beforeFood: false
          }
        ],
        diagnosis: "Type 2 Diabetes Mellitus",
        isActive: false,
        notes: "Initial diabetes medication"
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
        specialty: "Cardiology",
        reason: "Follow-up diabetes management",
        duration: 30,
        meetingLink: "/patient/video-call/emma_sarah_20250115",
        notes: "Review blood sugar logs"
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
        specialty: "Cardiology",
        reason: "Annual checkup",
        duration: 45,
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
        service: "Blood pressure monitoring and medication administration",
        status: "upcoming",
        notes: "Weekly BP check and insulin guidance"
      }
    ],
    emergencyServiceContacts: [
      {
        id: "ES001",
        date: "2024-11-15",
        time: "22:30",
        reason: "Severe hypoglycemia episode",
        serviceName: "MediCare Emergency Services",
        responseTime: 12,
        status: "resolved",
        notes: "Patient stabilized with glucose administration"
      }
    ],
    chatHistory: {
      doctors: [
        {
          doctorId: "DOC001",
          doctorName: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          lastMessage: "Your blood pressure readings look much better. Keep up the good work!",
          lastMessageTime: "2024-12-14 16:45",
          unreadCount: 0,
          messages: [
            {
              id: "MSG001",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Doctor, my blood pressure has been stable at 130/80 this week",
              timestamp: "2024-12-14 16:30",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG002",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "Your blood pressure readings look much better. Keep up the good work!",
              timestamp: "2024-12-14 16:45",
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
          lastMessage: "I'll see you tomorrow at 10 AM for your home visit",
          lastMessageTime: "2024-12-19 14:00",
          unreadCount: 0,
          messages: [
            {
              id: "MSG003",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Can you bring the new blood glucose strips?",
              timestamp: "2024-12-19 13:45",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG004",
              senderId: "NUR001",
              senderName: "Patricia Williams",
              senderType: "nurse",
              message: "I'll see you tomorrow at 10 AM for your home visit",
              timestamp: "2024-12-19 14:00",
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
          lastMessage: "Follow up with your doctor within 48 hours",
          lastMessageTime: "2024-11-15 23:00",
          messages: [
            {
              id: "MSG005",
              senderId: "EMRG001",
              senderName: "Emergency Response Team",
              senderType: "emergency",
              message: "Follow up with your doctor within 48 hours",
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
          topic: "Diabetes Management and Diet",
          recommendations: {
            diet: ["Increase fiber intake", "Reduce simple carbohydrates", "Eat smaller, frequent meals"],
            exercise: ["30 minutes daily walking", "Light resistance training twice weekly"],
            supplements: ["Vitamin D 1000 IU daily", "Omega-3 fatty acids"],
            lifestyle: ["Monitor blood glucose twice daily", "Maintain sleep schedule", "Stress management techniques"]
          },
          bookingSuggestions: [
            {
              type: "nutritionist",
              specialist: "Dr. Amanda Chen",
              reason: "Personalized diabetic meal planning"
            }
          ],
          hydrationReminders: ["Drink 8 glasses of water daily", "Avoid sugary drinks"],
          mealPlan: {
            breakfast: "Oatmeal with berries and nuts",
            lunch: "Grilled chicken salad with olive oil dressing",
            dinner: "Baked fish with steamed vegetables",
            snacks: ["Apple slices with almond butter", "Greek yogurt"]
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
              name: "Whole grain toast",
              quantity: "2 slices",
              calories: 160,
              carbs: 30,
              protein: 8,
              fat: 2,
              vitamins: ["B1", "B2", "Iron"]
            },
            {
              name: "Scrambled eggs",
              quantity: "2 eggs",
              calories: 140,
              carbs: 2,
              protein: 12,
              fat: 10,
              vitamins: ["Vitamin D", "B12", "Selenium"]
            }
          ],
          imageUrl: "/uploads/diet/breakfast_20241214.jpg",
          waterIntake: 500,
          notes: "Good protein balance",
          nutritionScore: 85
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 1800,
        proteinTarget: 90,
        carbTarget: 180,
        fatTarget: 60
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 2000,
          consumedML: 1750,
          reminders: ["08:00", "12:00", "16:00", "20:00"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Morning Walk",
              duration: 30,
              caloriesBurned: 150,
              completed: false
            },
            {
              name: "Light Stretching",
              duration: 10,
              caloriesBurned: 30,
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
        notes: "Discussed medication adjustments"
      }
    ],
    labTests: [
      {
        id: "LAB001",
        testName: "Complete Blood Count",
        date: "2024-12-01",
        facility: "Central Lab Services",
        orderedBy: "Dr. Sarah Johnson",
        results: [
          {
            parameter: "Hemoglobin",
            value: "13.5",
            normalRange: "12-16 g/dL",
            status: "normal"
          },
          {
            parameter: "White Blood Cells",
            value: "7500",
            normalRange: "4500-11000/μL",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/CBC_20241201.pdf"
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
      planName: "HealthWyz Premium",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      features: ["Unlimited video consultations", "Priority appointments", "24/7 emergency support", "Free lab tests quarterly"],
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
        type: "id_proof",
        name: "National_ID_Card.pdf",
        uploadDate: "2024-01-15",
        url: "/documents/id/national_id.pdf",
        size: "1.1 MB"
      }
    ],
    lastCheckupDate: "2024-12-01",
    nextScheduledCheckup: "2025-03-01",
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
      }
    ],
    registrationDate: "2023-08-15",
    lastLogin: "2024-12-15",
    verified: true,
    profileCompleteness: 95,
    userType: "patient"
  },
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
        summary: "Regular asthma monitoring and inhaler technique review",
        diagnosis: "Well-controlled asthma",
        treatment: "Continue bronchodilator therapy",
        notes: "Peak flow readings improved, continue current regimen"
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
            dosage: "100mcg",
            quantity: 2,
            frequency: "As needed",
            duration: "6 months",
            instructions: "Use during breathing difficulty",
            beforeFood: false
          },
          {
            name: "Budesonide Inhaler",
            dosage: "200mcg",
            quantity: 1,
            frequency: "Twice daily",
            duration: "6 months",
            instructions: "Rinse mouth after use",
            beforeFood: false
          }
        ],
        diagnosis: "Bronchial Asthma",
        isActive: true,
        nextRefill: "2025-05-20"
      }
    ],
    prescriptionHistory: [],
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
        oxygenSaturation: 97,
        labTechnician: "Robert Kim",
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
        reason: "Asthma follow-up",
        duration: 30,
        location: "Wellkin Hospital"
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
        reason: "Asthma follow-up",
        duration: 30,
        location: "Wellkin Hospital"
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
        specialInstructions: "Child has mild food allergies - no nuts",
        status: "upcoming"
      }
    ],
    nurseBookings: [],
    emergencyServiceContacts: [],
    chatHistory: {
      doctors: [
        {
          doctorId: "DOC003",
          doctorName: "Dr. Michael Chen",
          specialty: "Pulmonology",
          lastMessage: "Remember to use your preventer inhaler daily",
          lastMessageTime: "2024-12-10 11:00",
          unreadCount: 0,
          messages: [
            {
              id: "MSG006",
              senderId: "PAT002",
              senderName: "Liam Martinez",
              senderType: "patient",
              message: "My breathing has been much better lately",
              timestamp: "2024-12-10 10:45",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG007",
              senderId: "DOC003",
              senderName: "Dr. Michael Chen",
              senderType: "doctor",
              message: "Remember to use your preventer inhaler daily",
              timestamp: "2024-12-10 11:00",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nurses: [],
      nannies: [
        {
          nannyId: "NAN001",
          nannyName: "Sophie Chen",
          lastMessage: "Lucas had a great day, ate all his lunch!",
          lastMessageTime: "2024-12-08 17:30",
          unreadCount: 0,
          messages: [
            {
              id: "MSG008",
              senderId: "NAN001",
              senderName: "Sophie Chen",
              senderType: "nanny",
              message: "Lucas had a great day, ate all his lunch!",
              timestamp: "2024-12-08 17:30",
              attachments: ["/uploads/photos/lucas_playing.jpg"],
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      emergencyServices: []
    },
    botHealthAssistant: {
      sessions: [
        {
          id: "BOT002",
          date: "2024-12-05",
          topic: "Asthma Trigger Management",
          recommendations: {
            diet: ["Anti-inflammatory foods", "Avoid dairy if mucus-producing", "Increase omega-3 rich foods"],
            exercise: ["Swimming for lung capacity", "Yoga for breathing control", "Moderate cardio exercises"],
            supplements: ["Vitamin D", "Magnesium for bronchial relaxation"],
            lifestyle: ["Use air purifier at home", "Monitor air quality index", "Practice breathing exercises daily"]
          },
          bookingSuggestions: [
            {
              type: "yoga",
              specialist: "Master Raj Patel",
              reason: "Breathing techniques for asthma control"
            }
          ],
          hydrationReminders: ["Keep hydrated to thin mucus secretions"],
          mealPlan: {
            breakfast: "Smoothie with spinach, banana, and ginger",
            lunch: "Salmon with quinoa and vegetables",
            dinner: "Chicken soup with turmeric and garlic",
            snacks: ["Apple slices", "Handful of walnuts"]
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
              vitamins: ["Omega-3", "Vitamin D", "B12"]
            }
          ],
          waterIntake: 600,
          nutritionScore: 92
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 2200,
        proteinTarget: 110,
        carbTarget: 275,
        fatTarget: 73
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 2500,
          consumedML: 2300,
          reminders: ["07:00", "11:00", "15:00", "19:00", "22:00"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Swimming",
              duration: 45,
              caloriesBurned: 400,
              completed: false
            },
            {
              name: "Breathing Exercises",
              duration: 15,
              caloriesBurned: 20,
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
        endTime: "16:00",
        duration: 30,
        withType: "doctor",
        withName: "Dr. Michael Chen",
        withId: "DOC003",
        callQuality: "good",
        notes: "Reviewed inhaler technique"
      }
    ],
    labTests: [
      {
        id: "LAB002",
        testName: "Pulmonary Function Test",
        date: "2024-11-20",
        facility: "Wellkin Hospital Lab",
        orderedBy: "Dr. Michael Chen",
        results: [
          {
            parameter: "FEV1",
            value: "85%",
            normalRange: ">80%",
            status: "normal"
          },
          {
            parameter: "Peak Flow",
            value: "450 L/min",
            normalRange: "400-600 L/min",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/PFT_20241120.pdf"
      }
    ],
    healthMetrics: {
      cholesterol: {
        total: 180,
        ldl: 100,
        hdl: 60,
        triglycerides: 100,
        date: "2024-11-20"
      },
      bloodPressure: {
        systolic: 120,
        diastolic: 75,
        date: "2024-12-14"
      },
      bmi: {
        value: 23.7,
        category: "Normal",
        date: "2024-11-20"
      },
      heartRateVariability: 42,
      sleepQuality: {
        averageHours: 7.8,
        quality: "excellent"
      },
      stressLevel: "low",
      bodyAge: 30,
      metabolicAge: 29,
      visceralFat: 7,
      muscleMass: 52.8,
      boneDensity: 3.2
    },
    insuranceCoverage: {
      provider: "MCB Insurance",
      policyNumber: "MCB-2024-567890",
      subscriberId: "PAT002MCB",
      validFrom: "2024-03-01",
      validUntil: "2025-02-28",
      copay: 300,
      deductible: 1500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
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
      }
    ],
    subscriptionPlan: {
      type: "corporate",
      planName: "Corporate Health Plus",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      features: ["All premium features", "Annual health screening", "Gym membership", "Wellness programs"],
      price: 0,
      billingCycle: "yearly",
      corporateName: "Tech Solutions Ltd",
      corporateDiscount: 100
    },
    notificationPreferences: {
      appointments: true,
      medications: true,
      testResults: true,
      healthTips: false,
      emergencyAlerts: true,
      chatMessages: true,
      videoCallReminders: true,
      dietReminders: false,
      exerciseReminders: true,
      notificationTime: "08:00",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    securitySettings: {
      twoFactorEnabled: false,
      biometricEnabled: true,
      loginHistory: [
        {
          date: "2024-12-14",
          time: "09:00",
          device: "Samsung Galaxy S23",
          location: "Quatre Bornes, Mauritius",
          ipAddress: "196.192.120.78"
        }
      ],
      securityQuestions: [
        {
          question: "What city were you born in?",
          answer: "***encrypted***"
        }
      ],
      lastPasswordChange: "2024-09-20"
    },
    documents: [
      {
        id: "DOC003",
        type: "insurance",
        name: "Insurance_Policy.pdf",
        uploadDate: "2024-03-01",
        url: "/documents/insurance/policy_mcb.pdf",
        size: "3.2 MB"
      }
    ],
    lastCheckupDate: "2024-11-20",
    nextScheduledCheckup: "2025-02-20",
    medicineOrders: [
      {
        id: "ORDER002",
        orderDate: "2024-11-25",
        medicines: [
          {
            name: "Salbutamol Inhaler",
            quantity: 2,
            price: 650
          }
        ],
        totalAmount: 650,
        status: "delivered",
        deliveryDate: "2024-11-27",
        deliveryAddress: "Quatre Bornes, Mauritius"
      }
    ],
    registrationDate: "2023-11-10",
    lastLogin: "2024-12-14",
    verified: true,
    profileCompleteness: 88,
    userType: "patient"
  },
  {
    id: "PAT003",
    firstName: "Sophia",
    lastName: "Chen",
    email: "sophia.chen@healthwyz.mu",
    password: "Patient789!",
    profileImage: "/images/patients/3.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDMiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient003",
    dateOfBirth: "1988-11-08",
    age: 36,
    gender: "Female",
    phone: "+230 5912 3456",
    address: "Curepipe, Mauritius",
    nationalId: "S0811881234567",
    passportNumber: "MU9876543",
    emergencyContact: {
      name: "David Chen",
      relationship: "Brother",
      phone: "+230 5923 4567",
      address: "Port Louis, Mauritius"
    },
    bloodType: "B+",
    allergies: ["Iodine"],
    chronicConditions: [],
    healthScore: 92,
    bodyAge: 34,
    medicalRecords: [
      {
        id: "MR003",
        title: "Prenatal Checkup - 28 weeks",
        date: "2024-12-10",
        time: "11:00",
        type: "consultation",
        doctorResponsible: "Dr. Amanda Williams",
        nurseResponsible: "Jennifer Adams",
        summary: "Routine prenatal examination with ultrasound scan",
        diagnosis: "Normal pregnancy progression",
        treatment: "Continue prenatal vitamins",
        notes: "Baby development on track, mother's health excellent",
        attachments: ["ultrasound_28weeks.pdf", "prenatal_bloodwork.pdf"]
      }
    ],
    activePrescriptions: [
      {
        id: "RX003",
        date: "2024-12-10",
        time: "11:30",
        doctorName: "Dr. Amanda Williams",
        doctorId: "DOC005",
        medicines: [
          {
            name: "Prenatal Vitamins",
            dosage: "1 tablet",
            quantity: 30,
            frequency: "Once daily",
            duration: "1 month",
            instructions: "Take with breakfast",
            beforeFood: false
          },
          {
            name: "Iron Supplement",
            dosage: "65mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "1 month",
            instructions: "Take with vitamin C for better absorption",
            beforeFood: true
          }
        ],
        diagnosis: "Pregnancy - 28 weeks gestation",
        isActive: true,
        nextRefill: "2025-01-10"
      }
    ],
    prescriptionHistory: [],
    vitalSigns: [
      {
        id: "VS003",
        date: "2024-12-10",
        time: "11:15",
        bloodPressure: { systolic: 115, diastolic: 70 },
        heartRate: 85,
        temperature: 36.8,
        weight: 72.5,
        height: 162,
        oxygenSaturation: 99,
        labTechnician: "Sarah Mitchell",
        facility: "Fortis Clinic Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP003",
        date: "2025-01-07",
        time: "11:00",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Amanda Williams",
        doctorId: "DOC005",
        specialty: "Obstetrics & Gynecology",
        reason: "Prenatal checkup - 32 weeks",
        duration: 45,
        location: "Fortis Clinic"
      }
    ],
    pastAppointments: [
      {
        id: "APP003_PAST",
        date: "2024-12-10",
        time: "11:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Amanda Williams",
        doctorId: "DOC005",
        specialty: "Obstetrics & Gynecology",
        reason: "Prenatal checkup - 28 weeks",
        duration: 45,
        location: "Fortis Clinic"
      }
    ],
    childcareBookings: [],
    nurseBookings: [
      {
        id: "NB002",
        nurseId: "NUR002",
        nurseName: "Jennifer Adams",
        date: "2025-01-15",
        time: "14:00",
        type: "home_visit",
        service: "Prenatal education and preparation",
        status: "upcoming",
        notes: "Breastfeeding guidance and newborn care basics"
      }
    ],
    emergencyServiceContacts: [],
    chatHistory: {
      doctors: [
        {
          doctorId: "DOC005",
          doctorName: "Dr. Amanda Williams",
          specialty: "Obstetrics & Gynecology",
          lastMessage: "Everything looks perfect! Baby is growing well.",
          lastMessageTime: "2024-12-10 15:00",
          unreadCount: 0,
          messages: [
            {
              id: "MSG009",
              senderId: "PAT003",
              senderName: "Sophia Chen",
              senderType: "patient",
              message: "I felt the baby moving a lot today!",
              timestamp: "2024-12-10 14:30",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG010",
              senderId: "DOC005",
              senderName: "Dr. Amanda Williams",
              senderType: "doctor",
              message: "Everything looks perfect! Baby is growing well.",
              timestamp: "2024-12-10 15:00",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nurses: [
        {
          nurseId: "NUR002",
          nurseName: "Jennifer Adams",
          lastMessage: "Here's the prenatal class schedule for next month",
          lastMessageTime: "2024-12-12 10:00",
          unreadCount: 1,
          messages: [
            {
              id: "MSG011",
              senderId: "NUR002",
              senderName: "Jennifer Adams",
              senderType: "nurse",
              message: "Here's the prenatal class schedule for next month",
              timestamp: "2024-12-12 10:00",
              attachments: ["/documents/prenatal_classes.pdf"],
              read: false,
              messageType: "text"
            }
          ]
        }
      ],
      nannies: [],
      emergencyServices: []
    },
    botHealthAssistant: {
      sessions: [
        {
          id: "BOT003",
          date: "2024-12-08",
          topic: "Pregnancy Nutrition and Exercise",
          recommendations: {
            diet: ["Increase folic acid intake", "Adequate calcium and iron", "Avoid raw fish and unpasteurized products"],
            exercise: ["Prenatal yoga", "Daily walks", "Pelvic floor exercises"],
            supplements: ["Continue prenatal vitamins", "DHA omega-3", "Vitamin D if deficient"],
            lifestyle: ["Adequate rest", "Stress management", "Prepare birth plan", "Attend prenatal classes"]
          },
          bookingSuggestions: [
            {
              type: "yoga",
              specialist: "Sarah Mitchell",
              reason: "Prenatal yoga classes"
            },
            {
              type: "nutritionist",
              specialist: "Dr. Lisa Wang",
              reason: "Pregnancy nutrition planning"
            }
          ],
          hydrationReminders: ["Drink 10-12 glasses of water daily", "Increase if experiencing swelling"],
          mealPlan: {
            breakfast: "Whole grain cereal with milk and berries",
            lunch: "Chicken and vegetable wrap with yogurt",
            dinner: "Baked salmon with sweet potato and broccoli",
            snacks: ["Apple with peanut butter", "Greek yogurt with granola", "Handful of almonds"]
          }
        }
      ],
      dietHistory: [
        {
          id: "DIET003",
          date: "2024-12-14",
          time: "19:00",
          mealType: "dinner",
          foodItems: [
            {
              name: "Baked Salmon",
              quantity: "120g",
              calories: 250,
              carbs: 0,
              protein: 35,
              fat: 11,
              vitamins: ["Omega-3", "Vitamin D", "B12"]
            },
            {
              name: "Sweet Potato",
              quantity: "150g",
              calories: 130,
              carbs: 30,
              protein: 2,
              fat: 0,
              vitamins: ["Vitamin A", "Fiber", "Potassium"]
            }
          ],
          imageUrl: "/uploads/diet/dinner_20241214.jpg",
          waterIntake: 400,
          notes: "Great balanced meal for pregnancy",
          nutritionScore: 94
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 2200,
        proteinTarget: 100,
        carbTarget: 275,
        fatTarget: 73
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 3000,
          consumedML: 2800,
          reminders: ["07:00", "10:00", "13:00", "16:00", "19:00", "21:00"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Prenatal Yoga",
              duration: 30,
              caloriesBurned: 100,
              completed: false
            },
            {
              name: "Walking",
              duration: 30,
              caloriesBurned: 120,
              completed: false
            },
            {
              name: "Pelvic Floor Exercises",
              duration: 10,
              caloriesBurned: 20,
              completed: false
            }
          ]
        }
      ]
    },
    videoCallHistory: [
      {
        id: "VC003",
        date: "2024-11-15",
        startTime: "10:00",
        endTime: "10:20",
        duration: 20,
        withType: "doctor",
        withName: "Dr. Amanda Williams",
        withId: "DOC005",
        callQuality: "excellent",
        notes: "Quick check-in about morning sickness"
      }
    ],
    labTests: [
      {
        id: "LAB003",
        testName: "Prenatal Screening Panel",
        date: "2024-12-10",
        facility: "Fortis Clinic Lab",
        orderedBy: "Dr. Amanda Williams",
        results: [
          {
            parameter: "Glucose Tolerance",
            value: "95 mg/dL",
            normalRange: "<140 mg/dL",
            status: "normal"
          },
          {
            parameter: "Hemoglobin",
            value: "12.8 g/dL",
            normalRange: "11.5-15.5 g/dL",
            status: "normal"
          },
          {
            parameter: "Group B Strep",
            value: "Negative",
            normalRange: "Negative",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/prenatal_screening_20241210.pdf"
      }
    ],
    healthMetrics: {
      cholesterol: {
        total: 210,
        ldl: 120,
        hdl: 65,
        triglycerides: 125,
        date: "2024-12-10"
      },
      bloodPressure: {
        systolic: 115,
        diastolic: 70,
        date: "2024-12-10"
      },
      bmi: {
        value: 27.6,
        category: "Pregnancy Weight Gain - Normal",
        date: "2024-12-10"
      },
      heartRateVariability: 38,
      sleepQuality: {
        averageHours: 6.5,
        quality: "fair"
      },
      stressLevel: "moderate",
      bodyAge: 34,
      metabolicAge: 33,
      visceralFat: 8,
      muscleMass: 40.2,
      boneDensity: 3.0
    },
    insuranceCoverage: {
      provider: "Angel Insurance",
      policyNumber: "ANG-2024-111222",
      subscriberId: "PAT003ANG",
      validFrom: "2024-06-01",
      validUntil: "2025-05-31",
      copay: 400,
      deductible: 1000,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    billingInformation: [
      {
        id: "BILL004",
        type: "credit_card",
        cardNumber: "****3456",
        cardHolder: "Sophia Chen",
        expiryDate: "03/26",
        isDefault: true,
        addedDate: "2024-06-15"
      }
    ],
    subscriptionPlan: {
      type: "premium",
      planName: "Maternity Care Plus",
      startDate: "2024-06-01",
      endDate: "2025-05-31",
      features: ["Unlimited OB/GYN consultations", "Prenatal classes", "Postnatal support", "Lactation consulting"],
      price: 3500,
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
      notificationTime: "10:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    },
    securitySettings: {
      twoFactorEnabled: true,
      biometricEnabled: false,
      loginHistory: [
        {
          date: "2024-12-14",
          time: "14:00",
          device: "iPad Pro",
          location: "Curepipe, Mauritius",
          ipAddress: "196.192.130.92"
        }
      ],
      securityQuestions: [
        {
          question: "What is your favorite book?",
          answer: "***encrypted***"
        },
        {
          question: "What was your first car?",
          answer: "***encrypted***"
        }
      ],
      lastPasswordChange: "2024-11-01"
    },
    documents: [
      {
        id: "DOC004",
        type: "medical_report",
        name: "Ultrasound_28weeks.pdf",
        uploadDate: "2024-12-10",
        url: "/documents/medical/ultrasound_28w.pdf",
        size: "4.5 MB"
      },
      {
        id: "DOC005",
        type: "lab_result",
        name: "Prenatal_Tests.pdf",
        uploadDate: "2024-12-10",
        url: "/documents/lab/prenatal_tests.pdf",
        size: "1.8 MB"
      }
    ],
    lastCheckupDate: "2024-12-10",
    nextScheduledCheckup: "2025-01-07",
    medicineOrders: [
      {
        id: "ORDER003",
        orderDate: "2024-12-11",
        medicines: [
          {
            name: "Prenatal Vitamins",
            quantity: 30,
            price: 850
          },
          {
            name: "Iron Supplement 65mg",
            quantity: 30,
            price: 320
          }
        ],
        totalAmount: 1170,
        status: "confirmed",
        deliveryDate: "2024-12-13",
        deliveryAddress: "Curepipe, Mauritius"
      }
    ],
    registrationDate: "2024-01-05",
    lastLogin: "2024-12-14",
    verified: true,
    profileCompleteness: 92,
    userType: "patient"
  },
  {
    id: "PAT004",
    firstName: "Isabella",
    lastName: "Rodriguez",
    email: "isabella.rodriguez@healthwyz.mu",
    password: "Patient101!",
    profileImage: "/images/patients/4.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDQiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient004",
    dateOfBirth: "1975-05-12",
    age: 49,
    gender: "Female",
    phone: "+230 5934 5678",
    address: "Phoenix, Mauritius",
    nationalId: "I1205751234567",
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Husband",
      phone: "+230 5945 6789",
      address: "Phoenix, Mauritius"
    },
    bloodType: "AB-",
    allergies: ["Codeine", "Sulfa drugs"],
    chronicConditions: ["Rheumatoid Arthritis", "Osteoporosis"],
    healthScore: 71,
    bodyAge: 53,
    medicalRecords: [
      {
        id: "MR004",
        title: "Rheumatology Consultation",
        date: "2024-11-25",
        time: "14:15",
        type: "consultation",
        doctorResponsible: "Dr. Robert Kim",
        summary: "Joint pain assessment and medication adjustment",
        diagnosis: "Rheumatoid arthritis - moderate activity",
        treatment: "Methotrexate dose adjustment, physiotherapy referral",
        notes: "Patient reports improved morning stiffness with current treatment"
      }
    ],
    activePrescriptions: [
      {
        id: "RX004",
        date: "2024-11-25",
        time: "14:45",
        doctorName: "Dr. Robert Kim",
        doctorId: "DOC007",
        medicines: [
          {
            name: "Methotrexate",
            dosage: "15mg",
            quantity: 12,
            frequency: "Once weekly",
            duration: "3 months",
            instructions: "Take on empty stomach, avoid alcohol",
            beforeFood: true
          },
          {
            name: "Folic Acid",
            dosage: "5mg",
            quantity: 30,
            frequency: "Once daily except MTX day",
            duration: "3 months",
            instructions: "Do not take on methotrexate day",
            beforeFood: false
          },
          {
            name: "Calcium + Vitamin D",
            dosage: "600mg + 400IU",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take with evening meal",
            beforeFood: false
          }
        ],
        diagnosis: "Rheumatoid Arthritis, Osteoporosis",
        isActive: true,
        nextRefill: "2025-02-25"
      }
    ],
    prescriptionHistory: [
      {
        id: "RX_HIST_002",
        date: "2024-08-25",
        time: "14:00",
        doctorName: "Dr. Robert Kim",
        doctorId: "DOC007",
        medicines: [
          {
            name: "Methotrexate",
            dosage: "12.5mg",
            quantity: 12,
            frequency: "Once weekly",
            duration: "3 months",
            instructions: "Initial dose",
            beforeFood: true
          }
        ],
        diagnosis: "Rheumatoid Arthritis",
        isActive: false
      }
    ],
    vitalSigns: [
      {
        id: "VS004",
        date: "2024-11-25",
        time: "14:30",
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 76,
        temperature: 36.6,
        weight: 64.8,
        height: 158,
        oxygenSaturation: 98,
        labTechnician: "Mark Thompson",
        facility: "Wellkin Hospital Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP004",
        date: "2025-02-25",
        time: "14:15",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Robert Kim",
        doctorId: "DOC007",
        specialty: "Rheumatology",
        reason: "Medication follow-up",
        duration: 30,
        meetingLink: "/patient/video-call/emma_robert_20250"
      }
    ],
    pastAppointments: [
      {
        id: "APP004_PAST",
        date: "2024-11-25",
        time: "14:15",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Robert Kim",
        doctorId: "DOC007",
        specialty: "Rheumatology",
        reason: "Arthritis management",
        duration: 45,
        location: "Wellkin Hospital"
      }
    ],
    childcareBookings: [],
    nurseBookings: [
      {
        id: "NB003",
        nurseId: "NUR003",
        nurseName: "Margaret Smith",
        date: "2025-01-25",
        time: "16:00",
        type: "home_visit",
        service: "Methotrexate injection administration",
        status: "upcoming",
        notes: "Weekly injection support"
      }
    ],
    emergencyServiceContacts: [],
    chatHistory: {
      doctors: [
        {
          doctorId: "DOC007",
          doctorName: "Dr. Robert Kim",
          specialty: "Rheumatology",
          lastMessage: "The new dose should help with the morning stiffness",
          lastMessageTime: "2024-12-05 11:30",
          unreadCount: 0,
          messages: [
            {
              id: "MSG012",
              senderId: "PAT004",
              senderName: "Isabella Rodriguez",
              senderType: "patient",
              message: "My joints feel better in the afternoons now",
              timestamp: "2024-12-05 11:15",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG013",
              senderId: "DOC007",
              senderName: "Dr. Robert Kim",
              senderType: "doctor",
              message: "The new dose should help with the morning stiffness",
              timestamp: "2024-12-05 11:30",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nurses: [
        {
          nurseId: "NUR003",
          nurseName: "Margaret Smith",
          lastMessage: "Remember to take folic acid tomorrow, not today",
          lastMessageTime: "2024-12-07 09:00",
          unreadCount: 0,
          messages: [
            {
              id: "MSG014",
              senderId: "NUR003",
              senderName: "Margaret Smith",
              senderType: "nurse",
              message: "Remember to take folic acid tomorrow, not today",
              timestamp: "2024-12-07 09:00",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nannies: [],
      emergencyServices: []
    },
    botHealthAssistant: {
      sessions: [
        {
          id: "BOT004",
          date: "2024-12-01",
          topic: "Arthritis Management and Bone Health",
          recommendations: {
            diet: ["Anti-inflammatory foods", "Calcium-rich foods", "Omega-3 fatty acids", "Limit processed foods"],
            exercise: ["Low-impact activities", "Swimming or water aerobics", "Gentle stretching", "Tai Chi"],
            supplements: ["Continue Vitamin D", "Consider fish oil", "Glucosamine if approved by doctor"],
            lifestyle: ["Use assistive devices", "Maintain healthy weight", "Apply heat/cold therapy", "Regular rest periods"]
          },
          bookingSuggestions: [
            {
              type: "physio",
              specialist: "Dr. James Mitchell",
              reason: "Joint mobility and pain management"
            },
            {
              type: "nutritionist",
              specialist: "Sarah Chen",
              reason: "Anti-inflammatory diet planning"
            }
          ],
          hydrationReminders: ["Stay hydrated to maintain joint fluid"],
          mealPlan: {
            breakfast: "Oatmeal with walnuts and berries",
            lunch: "Mediterranean salad with olive oil",
            dinner: "Grilled fish with turmeric vegetables",
            snacks: ["Yogurt with flaxseeds", "Green tea"]
          }
        }
      ],
      dietHistory: [
        {
          id: "DIET004",
          date: "2024-12-13",
          time: "13:00",
          mealType: "lunch",
          foodItems: [
            {
              name: "Mediterranean Salad",
              quantity: "250g",
              calories: 220,
              carbs: 15,
              protein: 8,
              fat: 16,
              vitamins: ["Vitamin C", "Vitamin K", "Folate"]
            }
          ],
          waterIntake: 500,
          nutritionScore: 88
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 1600,
        proteinTarget: 80,
        carbTarget: 180,
        fatTarget: 62
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 2000,
          consumedML: 1900,
          reminders: ["08:00", "11:00", "14:00", "17:00", "20:00"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Water Aerobics",
              duration: 30,
              caloriesBurned: 120,
              completed: false
            },
            {
              name: "Gentle Stretching",
              duration: 15,
              caloriesBurned: 30,
              completed: false
            }
          ]
        }
      ]
    },
    videoCallHistory: [
      {
        id: "VC004",
        date: "2024-11-25",
        startTime: "14:15",
        endTime: "14:45",
        duration: 30,
        withType: "doctor",
        withName: "Dr. Robert Kim",
        withId: "DOC007",
        callQuality: "good",
        notes: "Discussed physiotherapy options"
      }
    ],
    labTests: [
      {
        id: "LAB004",
        testName: "Rheumatoid Factor & Inflammatory Markers",
        date: "2024-11-25",
        facility: "Wellkin Hospital Lab",
        orderedBy: "Dr. Robert Kim",
        results: [
          {
            parameter: "RF Factor",
            value: "45 IU/mL",
            normalRange: "<14 IU/mL",
            status: "abnormal"
          },
          {
            parameter: "CRP",
            value: "8 mg/L",
            normalRange: "<3 mg/L",
            status: "abnormal"
          },
          {
            parameter: "ESR",
            value: "32 mm/hr",
            normalRange: "0-20 mm/hr",
            status: "abnormal"
          }
        ],
        reportUrl: "/reports/lab/rheumatology_20241125.pdf"
      }
    ],
    healthMetrics: {
      cholesterol: {
        total: 205,
        ldl: 125,
        hdl: 58,
        triglycerides: 110,
        date: "2024-11-25"
      },
      bloodPressure: {
        systolic: 128,
        diastolic: 82,
        date: "2024-12-14"
      },
      bmi: {
        value: 25.9,
        category: "Slightly Overweight",
        date: "2024-11-25"
      },
      heartRateVariability: 32,
      sleepQuality: {
        averageHours: 6.0,
        quality: "fair"
      },
      stressLevel: "moderate",
      bodyAge: 53,
      metabolicAge: 52,
      visceralFat: 10,
      muscleMass: 38.5,
      boneDensity: 2.3
    },
    insuranceCoverage: {
      provider: "MedAssist Insurance",
      policyNumber: "MED-2024-333444",
      subscriberId: "PAT004MED",
      validFrom: "2024-01-15",
      validUntil: "2024-12-31",
      copay: 600,
      deductible: 2500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: false
    },
    billingInformation: [
      {
        id: "BILL005",
        type: "credit_card",
        cardNumber: "****7890",
        cardHolder: "Isabella Rodriguez",
        expiryDate: "09/25",
        isDefault: true,
        addedDate: "2024-01-20"
      },
      {
        id: "BILL006",
        type: "mcb_juice",
        cardNumber: "****2345",
        cardHolder: "Carlos Rodriguez",
        expiryDate: "11/26",
        isDefault: false,
        addedDate: "2024-06-10"
      }
    ],
    subscriptionPlan: {
      type: "premium",
      planName: "Chronic Care Premium",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      features: ["Unlimited specialist consultations", "Home nurse visits", "Medication delivery", "Physiotherapy sessions"],
      price: 4000,
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
      exerciseReminders: false,
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
          date: "2024-12-14",
          time: "10:30",
          device: "iPhone 13",
          location: "Phoenix, Mauritius",
          ipAddress: "196.192.140.56"
        },
        {
          date: "2024-12-13",
          time: "18:00",
          device: "Windows Laptop",
          location: "Phoenix, Mauritius",
          ipAddress: "196.192.140.56"
        }
      ],
      securityQuestions: [
        {
          question: "What is your mother's maiden name?",
          answer: "***encrypted***"
        },
        {
          question: "What was the name of your first school?",
          answer: "***encrypted***"
        }
      ],
      lastPasswordChange: "2024-07-20"
    },
    documents: [
      {
        id: "DOC006",
        type: "medical_report",
        name: "Rheumatology_Report_Nov2024.pdf",
        uploadDate: "2024-11-25",
        url: "/documents/medical/rheum_report.pdf",
        size: "2.7 MB"
      },
      {
        id: "DOC007",
        type: "prescription",
        name: "Methotrexate_Prescription.pdf",
        uploadDate: "2024-11-25",
        url: "/documents/prescriptions/mtx.pdf",
        size: "450 KB"
      }
    ],
    lastCheckupDate: "2024-11-25",
    nextScheduledCheckup: "2025-02-25",
    medicineOrders: [
      {
        id: "ORDER004",
        orderDate: "2024-11-30",
        medicines: [
          {
            name: "Methotrexate 15mg",
            quantity: 12,
            price: 890
          },
          {
            name: "Folic Acid 5mg",
            quantity: 30,
            price: 250
          },
          {
            name: "Calcium + Vitamin D",
            quantity: 30,
            price: 420
          }
        ],
        totalAmount: 1560,
        status: "delivered",
        deliveryDate: "2024-12-02",
        deliveryAddress: "Phoenix, Mauritius"
      }
    ],
    registrationDate: "2023-12-20",
    lastLogin: "2024-12-14",
    verified: true,
    profileCompleteness: 90,
    userType: "patient"
  },
  {
    id: "PAT005",
    firstName: "Aria",
    lastName: "Patel",
    email: "aria.patel@healthwyz.mu",
    password: "Patient202!",
    profileImage: "/images/patients/5.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDUiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient005",
    dateOfBirth: "2018-09-03",
    age: 6,
    gender: "Female",
    phone: "+230 5956 7890",
    address: "Beau Bassin, Mauritius",
    nationalId: "A0309181234567",
    emergencyContact: {
      name: "Priya Patel",
      relationship: "Mother",
      phone: "+230 5967 8901",
      address: "Beau Bassin, Mauritius"
    },
    bloodType: "A-",
    allergies: ["Peanuts", "Tree nuts"],
    chronicConditions: ["Food allergies"],
    healthScore: 88,
    bodyAge: 6,
    medicalRecords: [
      {
        id: "MR005",
        title: "Pediatric Annual Check-up",
        date: "2024-09-15",
        time: "10:30",
        type: "consultation",
        doctorResponsible: "Dr. Lisa Chang",
        nurseResponsible: "Emma Wilson",
        summary: "Annual pediatric examination with growth assessment and immunizations",
        diagnosis: "Normal growth and development, food allergies well-managed",
        treatment: "Continue allergy management plan, updated EpiPen prescription",
        notes: "Height and weight appropriate for age, motor development excellent"
      }
    ],
    activePrescriptions: [
      {
        id: "RX005",
        date: "2024-09-15",
        time: "11:00",
        doctorName: "Dr. Lisa Chang",
        doctorId: "DOC006",
        medicines: [
          {
            name: "EpiPen Jr.",
            dosage: "0.15mg",
            quantity: 2,
            frequency: "As needed for severe allergic reactions",
            duration: "1 year",
            instructions: "Keep one at home and one at school",
            beforeFood: false
          },
          {
            name: "Children's Benadryl",
            dosage: "12.5mg",
            quantity: 1,
            frequency: "As needed for mild allergic reactions",
            duration: "1 year",
            instructions: "Give for mild reactions only",
            beforeFood: false
          }
        ],
        diagnosis: "Severe food allergies (peanuts, tree nuts)",
        isActive: true,
        nextRefill: "2025-09-15"
      }
    ],
    prescriptionHistory: [],
    vitalSigns: [
      {
        id: "VS005",
        date: "2024-09-15",
        time: "10:45",
        bloodPressure: { systolic: 95, diastolic: 60 },
        heartRate: 95,
        temperature: 36.4,
        weight: 22.5,
        height: 118,
        oxygenSaturation: 99,
        labTechnician: "Amy Foster",
        facility: "Children's Health Clinic"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP005",
        date: "2025-09-15",
        time: "10:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Lisa Chang",
        doctorId: "DOC006",
        specialty: "Pediatrics",
        reason: "Annual check-up",
        duration: 45,
        location: "Children's Health Clinic"
      }
    ],
    pastAppointments: [
      {
        id: "APP005_PAST",
        date: "2024-09-15",
        time: "10:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Lisa Chang",
        doctorId: "DOC006",
        specialty: "Pediatrics",
        reason: "Annual check-up",
        duration: 45,
        location: "Children's Health Clinic"
      }
    ],
    childcareBookings: [
      {
        id: "CB002",
        date: "2025-01-20",
        time: "08:00",
        nannyName: "Rachel Brown",
        nannyId: "NAN003",
        duration: 8,
        type: "regular",
        children: ["Aria Patel (6 years)"],
        specialInstructions: "Severe nut allergies - EpiPen available. No outside food allowed.",
        status: "upcoming"
      }
    ],
    nurseBookings: [],
    emergencyServiceContacts: [
      {
        id: "ES002",
        date: "2024-06-10",
        time: "14:20",
        reason: "Allergic reaction - accidental nut exposure",
        serviceName: "Pediatric Emergency Response",
        responseTime: 8,
        status: "resolved",
        notes: "EpiPen administered, transported to hospital for observation"
      }
    ],
    chatHistory: {
      doctors: [
        {
          doctorId: "DOC006",
          doctorName: "Dr. Lisa Chang",
          specialty: "Pediatrics",
          lastMessage: "Great job avoiding allergens! Keep up the good work.",
          lastMessageTime: "2024-12-08 16:00",
          unreadCount: 0,
          messages: [
            {
              id: "MSG015",
              senderId: "PAT005_PARENT",
              senderName: "Priya Patel (Parent)",
              senderType: "patient",
              message: "Aria hasn't had any reactions in 6 months!",
              timestamp: "2024-12-08 15:45",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG016",
              senderId: "DOC006",
              senderName: "Dr. Lisa Chang",
              senderType: "doctor",
              message: "Great job avoiding allergens! Keep up the good work.",
              timestamp: "2024-12-08 16:00",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      nurses: [],
      nannies: [
        {
          nannyId: "NAN003",
          nannyName: "Rachel Brown",
          lastMessage: "Aria had a wonderful day at the park!",
          lastMessageTime: "2024-12-12 17:00",
          unreadCount: 1,
          messages: [
            {
              id: "MSG017",
              senderId: "NAN003",
              senderName: "Rachel Brown",
              senderType: "nanny",
              message: "Aria had a wonderful day at the park!",
              timestamp: "2024-12-12 17:00",
              attachments: ["/uploads/photos/aria_park.jpg"],
              read: false,
              messageType: "text"
            }
          ]
        }
      ],
      emergencyServices: []
    },
    botHealthAssistant: {
      sessions: [
        {
          id: "BOT005",
          date: "2024-11-20",
          topic: "Child Nutrition and Allergy Management",
          recommendations: {
            diet: ["Nut-free alternatives", "Balanced meals for growth", "Calcium-rich foods", "Iron-rich foods"],
            exercise: ["Active play 60 minutes daily", "Age-appropriate sports", "Playground activities"],
            supplements: ["Multivitamin for children", "Vitamin D drops"],
            lifestyle: ["Always carry EpiPen", "Educate caregivers about allergies", "Regular allergy testing"]
          },
          bookingSuggestions: [
            {
              type: "nutritionist",
              specialist: "Dr. Amy Chen",
              reason: "Child nutrition planning with allergies"
            }
          ],
          hydrationReminders: ["6-8 glasses of water daily"],
          mealPlan: {
            breakfast: "Sunflower seed butter toast with banana",
            lunch: "Chicken sandwich with vegetables",
            dinner: "Pasta with tomato sauce and cheese",
            snacks: ["Apple slices", "Rice crackers", "Yogurt"]
          }
        }
      ],
      dietHistory: [
        {
          id: "DIET005",
          date: "2024-12-14",
          time: "12:00",
          mealType: "lunch",
          foodItems: [
            {
              name: "Chicken Nuggets",
              quantity: "6 pieces",
              calories: 280,
              carbs: 18,
              protein: 14,
              fat: 17,
              vitamins: ["Protein", "Iron"]
            },
            {
              name: "Carrot Sticks",
              quantity: "50g",
              calories: 20,
              carbs: 5,
              protein: 0.5,
              fat: 0,
              vitamins: ["Vitamin A", "Fiber"]
            }
          ],
          waterIntake: 250,
          notes: "Safe meal, no allergens",
          nutritionScore: 85
        }
      ],
      currentMealPlan: {
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        meals: [],
        calorieTarget: 1400,
        proteinTarget: 50,
        carbTarget: 190,
        fatTarget: 45
      },
      hydrationTracking: [
        {
          date: "2024-12-14",
          targetML: 1500,
          consumedML: 1400,
          reminders: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]
        }
      ],
      exerciseSuggestions: [
        {
          date: "2024-12-15",
          exercises: [
            {
              name: "Playground Time",
              duration: 30,
              caloriesBurned: 100,
              completed: false
            },
            {
              name: "Dance Class",
              duration: 45,
              caloriesBurned: 120,
              completed: false
            }
          ]
        }
      ]
    },
    videoCallHistory: [
      {
        id: "VC005",
        date: "2024-10-01",
        startTime: "16:00",
        endTime: "16:15",
        duration: 15,
        withType: "doctor",
        withName: "Dr. Lisa Chang",
        withId: "DOC006",
        callQuality: "excellent",
        notes: "Quick check-in about school allergy protocol"
      }
    ],
    labTests: [
      {
        id: "LAB005",
        testName: "Allergy Panel",
        date: "2024-09-15",
        facility: "Children's Health Clinic",
        orderedBy: "Dr. Lisa Chang",
        results: [
          {
            parameter: "Peanut IgE",
            value: ">100 kU/L",
            normalRange: "<0.35 kU/L",
            status: "abnormal"
          },
          {
            parameter: "Tree Nut IgE",
            value: "85 kU/L",
            normalRange: "<0.35 kU/L",
            status: "abnormal"
          },
          {
            parameter: "Milk IgE",
            value: "0.2 kU/L",
            normalRange: "<0.35 kU/L",
            status: "normal"
          }
        ],
        reportUrl: "/reports/lab/allergy_panel_20240915.pdf"
      }
    ],
    healthMetrics: {
      cholesterol: {
        total: 160,
        ldl: 90,
        hdl: 55,
        triglycerides: 75,
        date: "2024-09-15"
      },
      bloodPressure: {
        systolic: 95,
        diastolic: 60,
        date: "2024-09-15"
      },
      bmi: {
        value: 16.1,
        category: "Normal for age",
        date: "2024-09-15"
      },
      heartRateVariability: 45,
      sleepQuality: {
        averageHours: 10.5,
        quality: "excellent"
      },
      stressLevel: "low",
      bodyAge: 6,
      metabolicAge: 6,
      visceralFat: 2,
      muscleMass: 15.8,
      boneDensity: 1.8
    },
    insuranceCoverage: {
      provider: "Family Guard Insurance",
      policyNumber: "FG-2024-555666",
      subscriberId: "PAT005FG",
      validFrom: "2024-04-01",
      validUntil: "2025-03-31",
      copay: 200,
      deductible: 500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    billingInformation: [
      {
        id: "BILL007",
        type: "credit_card",
        cardNumber: "****4567",
        cardHolder: "Priya Patel",
        expiryDate: "07/27",
        isDefault: true,
        addedDate: "2024-04-15"
      }
    ],
    subscriptionPlan: {
      type: "free",
      planName: "Basic Child Care",
      startDate: "2024-04-01",
      features: ["Basic consultations", "Emergency support", "Growth tracking"],
      price: 0,
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
      exerciseReminders: false,
      notificationTime: "18:00",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true
    },
    securitySettings: {
      twoFactorEnabled: true,
      biometricEnabled: false,
      loginHistory: [
        {
          date: "2024-12-14",
          time: "19:00",
          device: "Android Tablet",
          location: "Beau Bassin, Mauritius",
          ipAddress: "196.192.150.23"
        }
      ],
      securityQuestions: [
        {
          question: "What is your child's favorite toy?",
          answer: "***encrypted***"
        }
      ],
      lastPasswordChange: "2024-08-01"
    },
    documents: [
      {
        id: "DOC008",
        type: "medical_report",
        name: "Pediatric_Annual_Report.pdf",
        uploadDate: "2024-09-15",
        url: "/documents/medical/pediatric_annual.pdf",
        size: "1.9 MB"
      },
      {
        id: "DOC009",
        type: "prescription",
        name: "EpiPen_Prescription.pdf",
        uploadDate: "2024-09-15",
        url: "/documents/prescriptions/epipen.pdf",
        size: "380 KB"
      }
    ],
    lastCheckupDate: "2024-09-15",
    nextScheduledCheckup: "2025-09-15",
    medicineOrders: [
      {
        id: "ORDER005",
        orderDate: "2024-09-20",
        medicines: [
          {
            name: "EpiPen Jr. 0.15mg",
            quantity: 2,
            price: 3500
          },
          {
            name: "Children's Benadryl",
            quantity: 1,
            price: 280
          }
        ],
        totalAmount: 3780,
        status: "delivered",
        deliveryDate: "2024-09-22",
        deliveryAddress: "Beau Bassin, Mauritius"
      }
    ],
    registrationDate: "2024-02-10",
    lastLogin: "2024-12-14",
    verified: true,
    profileCompleteness: 85,
    userType: "patient"
  }
];