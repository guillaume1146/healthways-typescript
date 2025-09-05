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
  gender: 'Male' | 'Female';
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  healthScore: number;
  medicalRecords: MedicalRecord[];
  activePrescriptions: Prescription[];
  vitalSigns: VitalSigns[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  childcareBookings: ChildcareBooking[];
  insuranceCoverage: InsuranceCoverage;
  registrationDate: string;
  lastLogin: string;
  verified: boolean;
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
    emergencyContact: {
      name: "Michael Johnson",
      relationship: "Husband",
      phone: "+230 5890 2345"
    },
    bloodType: "A+",
    allergies: ["Penicillin", "Shellfish"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    healthScore: 78,
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
        notes: "Patient shows good compliance with treatment plan"
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
        meetingLink: "https://healthwyz.mu/video/APP001",
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
    registrationDate: "2023-08-15",
    lastLogin: "2024-12-15",
    verified: true
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
    emergencyContact: {
      name: "Sofia Martinez",
      relationship: "Wife",
      phone: "+230 5901 3456"
    },
    bloodType: "O-",
    allergies: ["Latex", "Aspirin"],
    chronicConditions: ["Asthma"],
    healthScore: 85,
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
    registrationDate: "2023-11-10",
    lastLogin: "2024-12-14",
    verified: true
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
    emergencyContact: {
      name: "David Chen",
      relationship: "Brother",
      phone: "+230 5923 4567"
    },
    bloodType: "B+",
    allergies: ["Iodine"],
    chronicConditions: [],
    healthScore: 92,
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
        notes: "Baby development on track, mother's health excellent"
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
    registrationDate: "2024-01-05",
    lastLogin: "2024-12-13",
    verified: true
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
    emergencyContact: {
      name: "Carlos Rodriguez",
      relationship: "Husband",
      phone: "+230 5945 6789"
    },
    bloodType: "AB-",
    allergies: ["Codeine", "Sulfa drugs"],
    chronicConditions: ["Rheumatoid Arthritis", "Osteoporosis"],
    healthScore: 71,
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
        meetingLink: "https://healthwyz.mu/video/APP004"
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
    registrationDate: "2023-12-20",
    lastLogin: "2024-12-12",
    verified: true
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
    emergencyContact: {
      name: "Priya Patel",
      relationship: "Mother",
      phone: "+230 5967 8901"
    },
    bloodType: "A-",
    allergies: ["Peanuts", "Tree nuts"],
    chronicConditions: ["Food allergies"],
    healthScore: 88,
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
    registrationDate: "2024-02-10",
    lastLogin: "2024-12-11",
    verified: true
  },
  {
    id: "PAT006",
    firstName: "Noah",
    lastName: "Williams",
    email: "noah.williams@healthwyz.mu",
    password: "Patient303!",
    profileImage: "/images/patients/6.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDYiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient006",
    dateOfBirth: "1980-12-28",
    age: 44,
    gender: "Male",
    phone: "+230 5978 9012",
    address: "Vacoas, Mauritius",
    emergencyContact: {
      name: "Amanda Williams",
      relationship: "Wife",
      phone: "+230 5989 0123"
    },
    bloodType: "O+",
    allergies: [],
    chronicConditions: ["High Cholesterol"],
    healthScore: 82,
    medicalRecords: [
      {
        id: "MR006",
        title: "Cardiology Consultation",
        date: "2024-10-30",
        time: "16:00",
        type: "consultation",
        doctorResponsible: "Dr. Sarah Johnson",
        summary: "Lipid profile review and cardiovascular risk assessment",
        diagnosis: "Hypercholesterolemia - well controlled",
        treatment: "Continue statin therapy, lifestyle modifications",
        notes: "LDL levels improved significantly since last visit"
      }
    ],
    activePrescriptions: [
      {
        id: "RX006",
        date: "2024-10-30",
        time: "16:30",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        medicines: [
          {
            name: "Atorvastatin",
            dosage: "20mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the evening",
            beforeFood: false
          },
          {
            name: "Aspirin",
            dosage: "81mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take with food to prevent stomach upset",
            beforeFood: false
          }
        ],
        diagnosis: "Hypercholesterolemia",
        isActive: true,
        nextRefill: "2025-01-30"
      }
    ],
    vitalSigns: [
      {
        id: "VS006",
        date: "2024-10-30",
        time: "16:15",
        bloodPressure: { systolic: 118, diastolic: 78 },
        heartRate: 65,
        temperature: 36.5,
        weight: 82.1,
        height: 175,
        oxygenSaturation: 98,
        cholesterol: 165,
        labTechnician: "Dr. James Miller",
        facility: "Apollo Bramwell Hospital Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP006",
        date: "2025-01-30",
        time: "16:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Cardiology",
        reason: "Cholesterol follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP006"
      }
    ],
    pastAppointments: [
      {
        id: "APP006_PAST",
        date: "2024-10-30",
        time: "16:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Cardiology",
        reason: "Cholesterol management",
        duration: 30,
        location: "Apollo Bramwell Hospital"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Prime Health Insurance",
      policyNumber: "PH-2024-777888",
      subscriberId: "PAT006PH",
      validFrom: "2024-02-01",
      validUntil: "2025-01-31",
      copay: 400,
      deductible: 1800,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },
    registrationDate: "2023-10-15",
    lastLogin: "2024-12-10",
    verified: true
  },
  {
    id: "PAT007",
    firstName: "Ethan",
    lastName: "Brown",
    email: "ethan.brown@healthwyz.mu",
    password: "Patient404!",
    profileImage: "/images/patients/7.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDciLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient007",
    dateOfBirth: "1995-04-18",
    age: 29,
    gender: "Male",
    phone: "+230 5990 1234",
    address: "Grand Baie, Mauritius",
    emergencyContact: {
      name: "Sarah Brown",
      relationship: "Sister",
      phone: "+230 6001 2345"
    },
    bloodType: "B-",
    allergies: ["Morphine"],
    chronicConditions: [],
    healthScore: 94,
    medicalRecords: [
      {
        id: "MR007",
        title: "Sports Medicine Consultation",
        date: "2024-11-15",
        time: "13:45",
        type: "consultation",
        doctorResponsible: "Dr. Mark Thompson",
        summary: "Knee injury assessment after rugby match",
        diagnosis: "Minor meniscus strain",
        treatment: "Rest, ice, compression, elevation. Physiotherapy referral",
        notes: "No surgery required. Return to sport in 4-6 weeks with proper rehabilitation"
      }
    ],
    activePrescriptions: [
      {
        id: "RX007",
        date: "2024-11-15",
        time: "14:15",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        medicines: [
          {
            name: "Ibuprofen",
            dosage: "400mg",
            quantity: 20,
            frequency: "Twice daily",
            duration: "10 days",
            instructions: "Take with food to prevent stomach irritation",
            beforeFood: false
          },
          {
            name: "Topical Diclofenac Gel",
            dosage: "1% gel",
            quantity: 1,
            frequency: "Apply 3 times daily",
            duration: "2 weeks",
            instructions: "Apply to affected knee area",
            beforeFood: false
          }
        ],
        diagnosis: "Meniscus strain, knee inflammation",
        isActive: false,
        nextRefill: "Not applicable"
      }
    ],
    vitalSigns: [
      {
        id: "VS007",
        date: "2024-11-15",
        time: "14:00",
        bloodPressure: { systolic: 115, diastolic: 72 },
        heartRate: 58,
        temperature: 36.3,
        weight: 78.5,
        height: 182,
        oxygenSaturation: 99,
        labTechnician: "Sophie Laurent",
        facility: "Sports Medicine Center"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP007",
        date: "2025-01-15",
        time: "13:45",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        specialty: "Sports Medicine",
        reason: "Knee recovery follow-up",
        duration: 30,
        location: "Sports Medicine Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP007_PAST",
        date: "2024-11-15",
        time: "13:45",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        specialty: "Sports Medicine",
        reason: "Knee injury assessment",
        duration: 45,
        location: "Sports Medicine Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Active Life Insurance",
      policyNumber: "AL-2024-999000",
      subscriberId: "PAT007AL",
      validFrom: "2024-05-01",
      validUntil: "2025-04-30",
      copay: 300,
      deductible: 1200,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: true
    },
    registrationDate: "2024-03-05",
    lastLogin: "2024-12-09",
    verified: true
  },
  {
    id: "PAT008",
    firstName: "Mason",
    lastName: "Davis",
    email: "mason.davis@healthwyz.mu",
    password: "Patient505!",
    profileImage: "/images/patients/8.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDgiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient008",
    dateOfBirth: "1967-08-14",
    age: 57,
    gender: "Male",
    phone: "+230 6012 3456",
    address: "Flic en Flac, Mauritius",
    emergencyContact: {
      name: "Linda Davis",
      relationship: "Wife",
      phone: "+230 6023 4567"
    },
    bloodType: "AB+",
    allergies: ["Bee stings"],
    chronicConditions: ["Benign Prostatic Hyperplasia", "Mild Depression"],
    healthScore: 75,
    medicalRecords: [
      {
        id: "MR008",
        title: "Urology Follow-up",
        date: "2024-12-05",
        time: "09:30",
        type: "consultation",
        doctorResponsible: "Dr. Paul Henderson",
        summary: "Prostate examination and symptom assessment",
        diagnosis: "BPH - stable, well-controlled with medication",
        treatment: "Continue alpha-blocker therapy",
        notes: "PSA levels stable, urinary symptoms improved"
      }
    ],
    activePrescriptions: [
      {
        id: "RX008",
        date: "2024-12-05",
        time: "10:00",
        doctorName: "Dr. Paul Henderson",
        doctorId: "DOC009",
        medicines: [
          {
            name: "Tamsulosin",
            dosage: "0.4mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take 30 minutes after the same meal each day",
            beforeFood: false
          },
          {
            name: "Sertraline",
            dosage: "50mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning with food",
            beforeFood: false
          }
        ],
        diagnosis: "Benign Prostatic Hyperplasia, Depression",
        isActive: true,
        nextRefill: "2025-03-05"
      }
    ],
    vitalSigns: [
      {
        id: "VS008",
        date: "2024-12-05",
        time: "09:45",
        bloodPressure: { systolic: 132, diastolic: 88 },
        heartRate: 70,
        temperature: 36.7,
        weight: 88.3,
        height: 173,
        oxygenSaturation: 97,
        labTechnician: "Helen Cooper",
        facility: "Wellkin Hospital Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP008",
        date: "2025-03-05",
        time: "09:30",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Paul Henderson",
        doctorId: "DOC009",
        specialty: "Urology",
        reason: "BPH follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP008"
      }
    ],
    pastAppointments: [
      {
        id: "APP008_PAST",
        date: "2024-12-05",
        time: "09:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Paul Henderson",
        doctorId: "DOC009",
        specialty: "Urology",
        reason: "Prostate check-up",
        duration: 45,
        location: "Wellkin Hospital"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Golden Years Insurance",
      policyNumber: "GY-2024-121314",
      subscriberId: "PAT008GY",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 500,
      deductible: 2000,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2023-09-10",
    lastLogin: "2024-12-08",
    verified: true
  },
  {
    id: "PAT009",
    firstName: "Olivia",
    lastName: "Miller",
    email: "olivia.miller@healthwyz.mu",
    password: "Patient606!",
    profileImage: "/images/patients/9.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDkiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient009",
    dateOfBirth: "1990-01-25",
    age: 34,
    gender: "Female",
    phone: "+230 6034 5678",
    address: "Port Louis, Mauritius",
    emergencyContact: {
      name: "James Miller",
      relationship: "Husband",
      phone: "+230 6045 6789"
    },
    bloodType: "A+",
    allergies: ["Cats", "Dust mites"],
    chronicConditions: ["Allergic Rhinitis", "Eczema"],
    healthScore: 83,
    medicalRecords: [
      {
        id: "MR009",
        title: "Allergy & Immunology Consultation",
        date: "2024-11-18",
        time: "14:30",
        type: "consultation",
        doctorResponsible: "Dr. Rebecca Foster",
        summary: "Seasonal allergy management and skin condition review",
        diagnosis: "Allergic rhinitis and atopic dermatitis - well controlled",
        treatment: "Continue antihistamine therapy, updated topical treatment",
        notes: "Symptoms well managed with current regimen"
      }
    ],
    activePrescriptions: [
      {
        id: "RX009",
        date: "2024-11-18",
        time: "15:00",
        doctorName: "Dr. Rebecca Foster",
        doctorId: "DOC010",
        medicines: [
          {
            name: "Cetirizine",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the evening to avoid drowsiness",
            beforeFood: false
          },
          {
            name: "Hydrocortisone Cream",
            dosage: "1%",
            quantity: 1,
            frequency: "Apply twice daily",
            duration: "1 month",
            instructions: "Apply thin layer to affected skin areas only",
            beforeFood: false
          }
        ],
        diagnosis: "Allergic rhinitis, Atopic dermatitis",
        isActive: true,
        nextRefill: "2025-02-18"
      }
    ],
    vitalSigns: [
      {
        id: "VS009",
        date: "2024-11-18",
        time: "14:45",
        bloodPressure: { systolic: 110, diastolic: 70 },
        heartRate: 72,
        temperature: 36.5,
        weight: 62.5,
        height: 168,
        oxygenSaturation: 98,
        labTechnician: "Maria Santos",
        facility: "Allergy Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP009",
        date: "2025-02-18",
        time: "14:30",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Rebecca Foster",
        doctorId: "DOC010",
        specialty: "Allergy & Immunology",
        reason: "Allergy management follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP009"
      }
    ],
    pastAppointments: [
      {
        id: "APP009_PAST",
        date: "2024-11-18",
        time: "14:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Rebecca Foster",
        doctorId: "DOC010",
        specialty: "Allergy & Immunology",
        reason: "Allergy management",
        duration: 45,
        location: "Allergy Center"
      }
    ],
    childcareBookings: [
      {
        id: "CB003",
        date: "2025-01-25",
        time: "19:00",
        nannyName: "Emma Wilson",
        nannyId: "NAN005",
        duration: 6,
        type: "regular",
        children: ["Lily Miller (3 years)", "Max Miller (5 years)"],
        specialInstructions: "Both children have bedtime routine at 8pm. No pets due to mother's allergies.",
        status: "upcoming"
      }
    ],
    insuranceCoverage: {
      provider: "Universal Health Plus",
      policyNumber: "UHP-2024-151617",
      subscriberId: "PAT009UHP",
      validFrom: "2024-07-01",
      validUntil: "2025-06-30",
      copay: 350,
      deductible: 1500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2024-01-20",
    lastLogin: "2024-12-07",
    verified: true
  },
  {
    id: "PAT010",
    firstName: "Ava",
    lastName: "Garcia",
    email: "ava.garcia@healthwyz.mu",
    password: "Patient707!",
    profileImage: "/images/patients/10.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTAiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient010",
    dateOfBirth: "1982-06-09",
    age: 42,
    gender: "Female",
    phone: "+230 6056 7890",
    address: "Mahebourg, Mauritius",
    emergencyContact: {
      name: "Diego Garcia",
      relationship: "Brother",
      phone: "+230 6067 8901"
    },
    bloodType: "O-",
    allergies: ["Nickel", "Fragrances"],
    chronicConditions: ["Migraine", "Anxiety Disorder"],
    healthScore: 79,
    medicalRecords: [
      {
        id: "MR010",
        title: "Neurology & Psychology Consultation",
        date: "2024-10-22",
        time: "11:15",
        type: "consultation",
        doctorResponsible: "Dr. Elena Rodriguez",
        summary: "Migraine frequency assessment and anxiety management review",
        diagnosis: "Chronic migraine with anxiety comorbidity",
        treatment: "Preventive migraine medication adjustment, anxiety therapy continuation",
        notes: "Significant improvement in migraine frequency with current preventive treatment"
      }
    ],
    activePrescriptions: [
      {
        id: "RX010",
        date: "2024-10-22",
        time: "11:45",
        doctorName: "Dr. Elena Rodriguez",
        doctorId: "DOC011",
        medicines: [
          {
            name: "Topiramate",
            dosage: "50mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with plenty of water",
            beforeFood: false
          },
          {
            name: "Sumatriptan",
            dosage: "50mg",
            quantity: 9,
            frequency: "As needed for migraine",
            duration: "3 months",
            instructions: "Maximum 3 tablets per week",
            beforeFood: false
          },
          {
            name: "Escitalopram",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning with food",
            beforeFood: false
          }
        ],
        diagnosis: "Chronic migraine, Generalized anxiety disorder",
        isActive: true,
        nextRefill: "2025-01-22"
      }
    ],
    vitalSigns: [
      {
        id: "VS010",
        date: "2024-10-22",
        time: "11:30",
        bloodPressure: { systolic: 125, diastolic: 80 },
        heartRate: 78,
        temperature: 36.6,
        weight: 59.8,
        height: 164,
        oxygenSaturation: 98,
        labTechnician: "Thomas Wilson",
        facility: "Neurology Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP010",
        date: "2025-01-22",
        time: "11:15",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Elena Rodriguez",
        doctorId: "DOC011",
        specialty: "Neurology",
        reason: "Migraine follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP010"
      }
    ],
    pastAppointments: [
      {
        id: "APP010_PAST",
        date: "2024-10-22",
        time: "11:15",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Elena Rodriguez",
        doctorId: "DOC011",
        specialty: "Neurology",
        reason: "Migraine management",
        duration: 45,
        location: "Neurology Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "NeuroHealth Insurance",
      policyNumber: "NH-2024-181920",
      subscriberId: "PAT010NH",
      validFrom: "2024-08-01",
      validUntil: "2025-07-31",
      copay: 450,
      deductible: 1800,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: true
    },
    registrationDate: "2023-11-25",
    lastLogin: "2024-12-06",
    verified: true
  },
  {
    id: "PAT011",
    firstName: "Lucas",
    lastName: "Anderson",
    email: "lucas.anderson@healthwyz.mu",
    password: "Patient808!",
    profileImage: "/images/patients/11.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTEiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient011",
    dateOfBirth: "1998-02-14",
    age: 26,
    gender: "Male",
    phone: "+230 6078 9012",
    address: "Tamarin, Mauritius",
    emergencyContact: {
      name: "Lisa Anderson",
      relationship: "Mother",
      phone: "+230 6089 0123"
    },
    bloodType: "A-",
    allergies: ["Shellfish"],
    chronicConditions: [],
    healthScore: 96,
    medicalRecords: [
      {
        id: "MR011",
        title: "Pre-employment Medical Examination",
        date: "2024-08-12",
        time: "08:00",
        type: "consultation",
        doctorResponsible: "Dr. Kevin Walsh",
        summary: "Comprehensive health screening for new employment",
        diagnosis: "Healthy young adult, fit for employment",
        treatment: "No treatment required",
        notes: "All parameters within normal limits, excellent physical condition"
      }
    ],
    activePrescriptions: [],
    vitalSigns: [
      {
        id: "VS011",
        date: "2024-08-12",
        time: "08:15",
        bloodPressure: { systolic: 112, diastolic: 68 },
        heartRate: 55,
        temperature: 36.4,
        weight: 74.8,
        height: 180,
        oxygenSaturation: 99,
        labTechnician: "David Park",
        facility: "Occupational Health Center"
      }
    ],
    upcomingAppointments: [],
    pastAppointments: [
      {
        id: "APP011_PAST",
        date: "2024-08-12",
        time: "08:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Kevin Walsh",
        doctorId: "DOC012",
        specialty: "Occupational Medicine",
        reason: "Pre-employment medical",
        duration: 60,
        location: "Occupational Health Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Young Professional Insurance",
      policyNumber: "YP-2024-212223",
      subscriberId: "PAT011YP",
      validFrom: "2024-08-15",
      validUntil: "2025-08-14",
      copay: 250,
      deductible: 800,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },
    registrationDate: "2024-08-01",
    lastLogin: "2024-12-05",
    verified: true
  },
  {
    id: "PAT012",
    firstName: "Charlotte",
    lastName: "Taylor",
    email: "charlotte.taylor@healthwyz.mu",
    password: "Patient909!",
    profileImage: "/images/patients/12.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTIiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient012",
    dateOfBirth: "1973-10-30",
    age: 51,
    gender: "Female",
    phone: "+230 6090 1234",
    address: "Pereybere, Mauritius",
    emergencyContact: {
      name: "Robert Taylor",
      relationship: "Husband",
      phone: "+230 6101 2345"
    },
    bloodType: "B+",
    allergies: ["Latex", "Bananas"],
    chronicConditions: ["Fibromyalgia", "Hypothyroidism"],
    healthScore: 68,
    medicalRecords: [
      {
        id: "MR012",
        title: "Rheumatology & Endocrinology Review",
        date: "2024-09-28",
        time: "15:00",
        type: "consultation",
        doctorResponsible: "Dr. Patricia Moore",
        summary: "Joint pain management and thyroid function assessment",
        diagnosis: "Fibromyalgia stable, hypothyroidism well-controlled",
        treatment: "Continue thyroid replacement, pain management adjustment",
        notes: "TSH levels optimal, pain management showing improvement"
      }
    ],
    activePrescriptions: [
      {
        id: "RX012",
        date: "2024-09-28",
        time: "15:30",
        doctorName: "Dr. Patricia Moore",
        doctorId: "DOC013",
        medicines: [
          {
            name: "Levothyroxine",
            dosage: "75mcg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take on empty stomach, 30 minutes before breakfast",
            beforeFood: true
          },
          {
            name: "Duloxetine",
            dosage: "30mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take with food to reduce nausea",
            beforeFood: false
          },
          {
            name: "Pregabalin",
            dosage: "75mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take at the same times each day",
            beforeFood: false
          }
        ],
        diagnosis: "Hypothyroidism, Fibromyalgia",
        isActive: true,
        nextRefill: "2024-12-28"
      }
    ],
    vitalSigns: [
      {
        id: "VS012",
        date: "2024-09-28",
        time: "15:15",
        bloodPressure: { systolic: 138, diastolic: 92 },
        heartRate: 72,
        temperature: 36.2,
        weight: 71.5,
        height: 160,
        oxygenSaturation: 97,
        labTechnician: "Jennifer Lee",
        facility: "Endocrine Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP012",
        date: "2024-12-28",
        time: "15:00",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Patricia Moore",
        doctorId: "DOC013",
        specialty: "Endocrinology",
        reason: "Thyroid and fibromyalgia follow-up",
        duration: 45,
        location: "Endocrine Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP012_PAST",
        date: "2024-09-28",
        time: "15:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Patricia Moore",
        doctorId: "DOC013",
        specialty: "Endocrinology",
        reason: "Thyroid management",
        duration: 45,
        location: "Endocrine Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Chronic Care Insurance",
      policyNumber: "CC-2024-242526",
      subscriberId: "PAT012CC",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 600,
      deductible: 2200,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2023-07-30",
    lastLogin: "2024-12-04",
    verified: true
  },
  {
    id: "PAT013",
    firstName: "Grace",
    lastName: "Wilson",
    email: "grace.wilson@healthwyz.mu",
    password: "Patient010!",
    profileImage: "/images/patients/13.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTMiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient013",
    dateOfBirth: "2010-12-05",
    age: 14,
    gender: "Female",
    phone: "+230 6112 3456",
    address: "Triolet, Mauritius",
    emergencyContact: {
      name: "Emma Wilson",
      relationship: "Mother",
      phone: "+230 6123 4567"
    },
    bloodType: "AB+",
    allergies: ["Dairy products"],
    chronicConditions: ["Lactose Intolerance"],
    healthScore: 91,
    medicalRecords: [
      {
        id: "MR013",
        title: "Adolescent Health Check-up",
        date: "2024-08-20",
        time: "16:30",
        type: "consultation",
        doctorResponsible: "Dr. Lisa Chang",
        summary: "Annual adolescent health assessment with growth monitoring",
        diagnosis: "Normal adolescent development, lactose intolerance managed",
        treatment: "Continue dairy-free diet, calcium supplementation",
        notes: "Growth parameters excellent, well-adjusted teenager"
      }
    ],
    activePrescriptions: [
      {
        id: "RX013",
        date: "2024-08-20",
        time: "17:00",
        doctorName: "Dr. Lisa Chang",
        doctorId: "DOC006",
        medicines: [
          {
            name: "Calcium Carbonate + Vitamin D3",
            dosage: "500mg + 200IU",
            quantity: 60,
            frequency: "Twice daily",
            duration: "6 months",
            instructions: "Take with non-dairy meals",
            beforeFood: false
          },
          {
            name: "Lactase Enzyme",
            dosage: "9000 units",
            quantity: 30,
            frequency: "As needed before dairy",
            duration: "6 months",
            instructions: "Take before accidental dairy consumption",
            beforeFood: true
          }
        ],
        diagnosis: "Lactose intolerance",
        isActive: true,
        nextRefill: "2025-02-20"
      }
    ],
    vitalSigns: [
      {
        id: "VS013",
        date: "2024-08-20",
        time: "16:45",
        bloodPressure: { systolic: 105, diastolic: 65 },
        heartRate: 88,
        temperature: 36.5,
        weight: 52.3,
        height: 162,
        oxygenSaturation: 99,
        labTechnician: "Susan Clark",
        facility: "Pediatric Health Center"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP013",
        date: "2025-08-20",
        time: "16:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Lisa Chang",
        doctorId: "DOC006",
        specialty: "Pediatrics",
        reason: "Annual teen health check",
        duration: 45,
        location: "Pediatric Health Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP013_PAST",
        date: "2024-08-20",
        time: "16:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Lisa Chang",
        doctorId: "DOC006",
        specialty: "Pediatrics",
        reason: "Annual check-up",
        duration: 45,
        location: "Pediatric Health Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Family Guardian Insurance",
      policyNumber: "FG-2024-272829",
      subscriberId: "PAT013FG",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 200,
      deductible: 500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2024-01-15",
    lastLogin: "2024-12-03",
    verified: true
  },
  {
    id: "PAT014",
    firstName: "Luna",
    lastName: "Singh",
    email: "luna.singh@healthwyz.mu",
    password: "Patient111!",
    profileImage: "/images/patients/14.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTQiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient014",
    dateOfBirth: "1986-03-22",
    age: 38,
    gender: "Female",
    phone: "+230 6134 5678",
    address: "Goodlands, Mauritius",
    emergencyContact: {
      name: "Raj Singh",
      relationship: "Husband",
      phone: "+230 6145 6789"
    },
    bloodType: "A+",
    allergies: ["Pollen", "Animal dander"],
    chronicConditions: ["Seasonal Allergies"],
    healthScore: 86,
    medicalRecords: [
      {
        id: "MR014",
        title: "Dermatology Consultation",
        date: "2024-10-15",
        time: "12:00",
        type: "consultation",
        doctorResponsible: "Dr. Nina Patel",
        summary: "Skin allergy assessment and treatment plan review",
        diagnosis: "Contact dermatitis with seasonal allergy component",
        treatment: "Topical corticosteroids, antihistamine adjustment",
        notes: "Skin condition improved with environmental modifications"
      }
    ],
    activePrescriptions: [
      {
        id: "RX014",
        date: "2024-10-15",
        time: "12:30",
        doctorName: "Dr. Nina Patel",
        doctorId: "DOC014",
        medicines: [
          {
            name: "Loratadine",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take at the same time each day",
            beforeFood: false
          },
          {
            name: "Betamethasone Cream",
            dosage: "0.1%",
            quantity: 1,
            frequency: "Apply twice daily",
            duration: "2 weeks",
            instructions: "Apply thin layer to affected areas only",
            beforeFood: false
          }
        ],
        diagnosis: "Contact dermatitis, Seasonal allergies",
        isActive: true,
        nextRefill: "2025-01-15"
      }
    ],
    vitalSigns: [
      {
        id: "VS014",
        date: "2024-10-15",
        time: "12:15",
        bloodPressure: { systolic: 118, diastolic: 75 },
        heartRate: 68,
        temperature: 36.7,
        weight: 58.9,
        height: 166,
        oxygenSaturation: 98,
        labTechnician: "Rachel Green",
        facility: "Dermatology Clinic Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP014",
        date: "2025-01-15",
        time: "12:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Nina Patel",
        doctorId: "DOC014",
        specialty: "Dermatology",
        reason: "Skin condition follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP014"
      }
    ],
    pastAppointments: [
      {
        id: "APP014_PAST",
        date: "2024-10-15",
        time: "12:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Nina Patel",
        doctorId: "DOC014",
        specialty: "Dermatology",
        reason: "Skin allergy treatment",
        duration: 30,
        location: "Dermatology Clinic"
      }
    ],
    childcareBookings: [
      {
        id: "CB004",
        date: "2025-01-18",
        time: "14:00",
        nannyName: "Priya Sharma",
        nannyId: "NAN007",
        duration: 5,
        type: "regular",
        children: ["Arjun Singh (8 years)", "Meera Singh (6 years)"],
        specialInstructions: "Children know about mother's allergies - no pets or flowers inside",
        status: "upcoming"
      }
    ],
    insuranceCoverage: {
      provider: "AllergyCare Plus",
      policyNumber: "ACP-2024-303132",
      subscriberId: "PAT014ACP",
      validFrom: "2024-09-01",
      validUntil: "2025-08-31",
      copay: 350,
      deductible: 1300,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },
    registrationDate: "2024-04-10",
    lastLogin: "2024-12-02",
    verified: true
  },
  {
    id: "PAT015",
    firstName: "Benjamin",
    lastName: "Lee",
    email: "benjamin.lee@healthwyz.mu",
    password: "Patient212!",
    profileImage: "/images/patients/15.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTUiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient015",
    dateOfBirth: "1991-07-11",
    age: 33,
    gender: "Male",
    phone: "+230 6156 7890",
    address: "Albion, Mauritius",
    emergencyContact: {
      name: "Michelle Lee",
      relationship: "Wife",
      phone: "+230 6167 8901"
    },
    bloodType: "B-",
    allergies: [],
    chronicConditions: ["ADHD"],
    healthScore: 87,
    medicalRecords: [
      {
        id: "MR015",
        title: "Psychiatry Follow-up",
        date: "2024-11-08",
        time: "10:45",
        type: "consultation",
        doctorResponsible: "Dr. Steven Wong",
        summary: "ADHD medication management and cognitive assessment",
        diagnosis: "ADHD - well controlled with current medication",
        treatment: "Continue stimulant therapy, behavioral strategies review",
        notes: "Significant improvement in focus and work performance"
      }
    ],
    activePrescriptions: [
      {
        id: "RX015",
        date: "2024-11-08",
        time: "11:15",
        doctorName: "Dr. Steven Wong",
        doctorId: "DOC015",
        medicines: [
          {
            name: "Methylphenidate ER",
            dosage: "18mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "1 month",
            instructions: "Take in the morning with breakfast",
            beforeFood: false
          }
        ],
        diagnosis: "Attention Deficit Hyperactivity Disorder",
        isActive: true,
        nextRefill: "2024-12-08"
      }
    ],
    vitalSigns: [
      {
        id: "VS015",
        date: "2024-11-08",
        time: "11:00",
        bloodPressure: { systolic: 122, diastolic: 78 },
        heartRate: 82,
        temperature: 36.6,
        weight: 76.4,
        height: 175,
        oxygenSaturation: 98,
        labTechnician: "Carol Martinez",
        facility: "Mental Health Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP015",
        date: "2024-12-08",
        time: "10:45",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Steven Wong",
        doctorId: "DOC015",
        specialty: "Psychiatry",
        reason: "ADHD medication review",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP015"
      }
    ],
    pastAppointments: [
      {
        id: "APP015_PAST",
        date: "2024-11-08",
        time: "10:45",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Steven Wong",
        doctorId: "DOC015",
        specialty: "Psychiatry",
        reason: "ADHD management",
        duration: 45,
        location: "Mental Health Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Mind Health Insurance",
      policyNumber: "MH-2024-333435",
      subscriberId: "PAT015MH",
      validFrom: "2024-10-01",
      validUntil: "2025-09-30",
      copay: 400,
      deductible: 1600,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: true
    },
    registrationDate: "2024-05-15",
    lastLogin: "2024-12-01",
    verified: true
  },
  {
    id: "PAT016",
    firstName: "Zoe",
    lastName: "Thompson",
    email: "zoe.thompson@healthwyz.mu",
    password: "Patient313!",
    profileImage: "/images/patients/16.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTYiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient016",
    dateOfBirth: "1979-11-17",
    age: 45,
    gender: "Female",
    phone: "+230 6178 9012",
    address: "Le Morne, Mauritius",
    emergencyContact: {
      name: "Alex Thompson",
      relationship: "Partner",
      phone: "+230 6189 0123"
    },
    bloodType: "O+",
    allergies: ["Sulfa drugs", "NSAIDs"],
    chronicConditions: ["Peptic Ulcer Disease", "Iron Deficiency Anemia"],
    healthScore: 73,
    medicalRecords: [
      {
        id: "MR016",
        title: "Gastroenterology Follow-up",
        date: "2024-09-12",
        time: "13:30",
        type: "consultation",
        doctorResponsible: "Dr. Hassan Al-Ahmad",
        summary: "Peptic ulcer monitoring and anemia management review",
        diagnosis: "Peptic ulcer stable, iron deficiency anemia improving",
        treatment: "Continue PPI therapy, iron supplementation adjustment",
        notes: "Hemoglobin levels trending upward, ulcer symptoms resolved"
      }
    ],
    activePrescriptions: [
      {
        id: "RX016",
        date: "2024-09-12",
        time: "14:00",
        doctorName: "Dr. Hassan Al-Ahmad",
        doctorId: "DOC016",
        medicines: [
          {
            name: "Omeprazole",
            dosage: "20mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take 30 minutes before breakfast",
            beforeFood: true
          },
          {
            name: "Iron Sulfate",
            dosage: "325mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take with vitamin C, avoid with dairy",
            beforeFood: true
          },
          {
            name: "Vitamin C",
            dosage: "500mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take with iron supplement",
            beforeFood: false
          }
        ],
        diagnosis: "Peptic ulcer disease, Iron deficiency anemia",
        isActive: true,
        nextRefill: "2024-12-12"
      }
    ],
    vitalSigns: [
      {
        id: "VS016",
        date: "2024-09-12",
        time: "13:45",
        bloodPressure: { systolic: 108, diastolic: 72 },
        heartRate: 85,
        temperature: 36.4,
        weight: 55.2,
        height: 161,
        oxygenSaturation: 96,
        labTechnician: "Omar Hassan",
        facility: "Gastroenterology Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP016",
        date: "2024-12-12",
        time: "13:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Hassan Al-Ahmad",
        doctorId: "DOC016",
        specialty: "Gastroenterology",
        reason: "Ulcer and anemia follow-up",
        duration: 30,
        location: "Gastroenterology Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP016_PAST",
        date: "2024-09-12",
        time: "13:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Hassan Al-Ahmad",
        doctorId: "DOC016",
        specialty: "Gastroenterology",
        reason: "Ulcer management",
        duration: 45,
        location: "Gastroenterology Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Digestive Health Insurance",
      policyNumber: "DH-2024-363738",
      subscriberId: "PAT016DH",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 500,
      deductible: 2000,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: false
    },
    registrationDate: "2023-08-20",
    lastLogin: "2024-11-30",
    verified: true
  },
  {
    id: "PAT017",
    firstName: "Gabriel",
    lastName: "Santos",
    email: "gabriel.santos@healthwyz.mu",
    password: "Patient414!",
    profileImage: "/images/patients/17.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTciLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient017",
    dateOfBirth: "2001-05-08",
    age: 23,
    gender: "Male",
    phone: "+230 6190 1234",
    address: "Riviere du Rempart, Mauritius",
    emergencyContact: {
      name: "Maria Santos",
      relationship: "Mother",
      phone: "+230 6201 2345"
    },
    bloodType: "AB-",
    allergies: ["Eggs"],
    chronicConditions: [],
    healthScore: 93,
    medicalRecords: [
      {
        id: "MR017",
        title: "Sports Injury Assessment",
        date: "2024-07-25",
        time: "17:15",
        type: "consultation",
        doctorResponsible: "Dr. Mark Thompson",
        summary: "Ankle sprain evaluation from soccer match",
        diagnosis: "Grade 1 ankle sprain",
        treatment: "RICE protocol, physical therapy referral",
        notes: "Full recovery expected in 2-3 weeks with proper rehabilitation"
      }
    ],
    activePrescriptions: [],
    vitalSigns: [
      {
        id: "VS017",
        date: "2024-07-25",
        time: "17:30",
        bloodPressure: { systolic: 110, diastolic: 70 },
        heartRate: 58,
        temperature: 36.8,
        weight: 71.5,
        height: 177,
        oxygenSaturation: 99,
        labTechnician: "Carlos Rivera",
        facility: "Sports Medicine Center"
      }
    ],
    upcomingAppointments: [],
    pastAppointments: [
      {
        id: "APP017_PAST",
        date: "2024-07-25",
        time: "17:15",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        specialty: "Sports Medicine",
        reason: "Ankle injury assessment",
        duration: 30,
        location: "Sports Medicine Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Student Health Insurance",
      policyNumber: "SH-2024-394041",
      subscriberId: "PAT017SH",
      validFrom: "2024-09-01",
      validUntil: "2025-08-31",
      copay: 150,
      deductible: 300,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2024-07-01",
    lastLogin: "2024-11-29",
    verified: true
  },
  {
    id: "PAT018",
    firstName: "Ryan",
    lastName: "O'Connor",
    email: "ryan.oconnor@healthwyz.mu",
    password: "Patient515!",
    profileImage: "/images/patients/18.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTgiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient018",
    dateOfBirth: "1984-09-20",
    age: 40,
    gender: "Male",
    phone: "+230 6212 3456",
    address: "Camp de Masque, Mauritius",
    emergencyContact: {
      name: "Fiona O'Connor",
      relationship: "Wife",
      phone: "+230 6223 4567"
    },
    bloodType: "A-",
    allergies: ["Ibuprofen", "Grass pollen"],
    chronicConditions: ["Sleep Apnea", "Obesity"],
    healthScore: 65,
    medicalRecords: [
      {
        id: "MR018",
        title: "Sleep Medicine Consultation",
        date: "2024-10-08",
        time: "09:00",
        type: "consultation",
        doctorResponsible: "Dr. Jennifer Adams",
        summary: "Sleep study results review and CPAP therapy adjustment",
        diagnosis: "Moderate obstructive sleep apnea, improved compliance",
        treatment: "Continue CPAP therapy, weight management program",
        notes: "AHI reduced significantly with current CPAP settings"
      }
    ],
    activePrescriptions: [],
    vitalSigns: [
      {
        id: "VS018",
        date: "2024-10-08",
        time: "09:15",
        bloodPressure: { systolic: 142, diastolic: 95 },
        heartRate: 78,
        temperature: 36.7,
        weight: 95.8,
        height: 170,
        oxygenSaturation: 96,
        labTechnician: "Patrick O'Brien",
        facility: "Sleep Disorders Center"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP018",
        date: "2025-01-08",
        time: "09:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Jennifer Adams",
        doctorId: "DOC017",
        specialty: "Sleep Medicine",
        reason: "CPAP therapy follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP018"
      }
    ],
    pastAppointments: [
      {
        id: "APP018_PAST",
        date: "2024-10-08",
        time: "09:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Jennifer Adams",
        doctorId: "DOC017",
        specialty: "Sleep Medicine",
        reason: "Sleep study review",
        duration: 45,
        location: "Sleep Disorders Center"
      }
    ],
    childcareBookings: [
      {
        id: "CB005",
        date: "2025-01-12",
        time: "20:00",
        nannyName: "Katie Murphy",
        nannyId: "NAN009",
        duration: 8,
        type: "overnight",
        children: ["Sean O'Connor (12 years)", "Ava O'Connor (9 years)"],
        specialInstructions: "Father has sleep apnea - CPAP machine in bedroom, check children are quiet after 9pm",
        status: "upcoming"
      }
    ],
    insuranceCoverage: {
      provider: "Sleep Well Insurance",
      policyNumber: "SW-2024-424344",
      subscriberId: "PAT018SW",
      validFrom: "2024-08-01",
      validUntil: "2025-07-31",
      copay: 550,
      deductible: 2100,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },
    registrationDate: "2023-12-05",
    lastLogin: "2024-11-28",
    verified: true
  },
  {
    id: "PAT019",
    firstName: "Kai",
    lastName: "Nakamura",
    email: "kai.nakamura@healthwyz.mu",
    password: "Patient616!",
    profileImage: "/images/patients/19.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMTkiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient019",
    dateOfBirth: "1993-01-30",
    age: 31,
    gender: "Male",
    phone: "+230 6234 5678",
    address: "Arsenal, Mauritius",
    emergencyContact: {
      name: "Yuki Nakamura",
      relationship: "Brother",
      phone: "+230 6245 6789"
    },
    bloodType: "B+",
    allergies: [],
    chronicConditions: ["Mild Hypertension"],
    healthScore: 84,
    medicalRecords: [
      {
        id: "MR019",
        title: "Hypertension Management Review",
        date: "2024-11-22",
        time: "14:00",
        type: "consultation",
        doctorResponsible: "Dr. Sarah Johnson",
        summary: "Blood pressure monitoring and lifestyle modification assessment",
        diagnosis: "Stage 1 hypertension - well controlled",
        treatment: "Continue ACE inhibitor, dietary counseling",
        notes: "Blood pressure well controlled with medication and lifestyle changes"
      }
    ],
    activePrescriptions: [
      {
        id: "RX019",
        date: "2024-11-22",
        time: "14:30",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        medicines: [
          {
            name: "Lisinopril",
            dosage: "5mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take at the same time each day",
            beforeFood: false
          }
        ],
        diagnosis: "Essential hypertension",
        isActive: true,
        nextRefill: "2025-02-22"
      }
    ],
    vitalSigns: [
      {
        id: "VS019",
        date: "2024-11-22",
        time: "14:15",
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 70,
        temperature: 36.6,
        weight: 73.2,
        height: 174,
        oxygenSaturation: 98,
        labTechnician: "Hiroshi Tanaka",
        facility: "Apollo Bramwell Hospital Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP019",
        date: "2025-02-22",
        time: "14:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Cardiology",
        reason: "Hypertension follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP019"
      }
    ],
    pastAppointments: [
      {
        id: "APP019_PAST",
        date: "2024-11-22",
        time: "14:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Cardiology",
        reason: "Blood pressure check",
        duration: 30,
        location: "Apollo Bramwell Hospital"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Eastern Health Insurance",
      policyNumber: "EH-2024-454647",
      subscriberId: "PAT019EH",
      validFrom: "2024-06-01",
      validUntil: "2025-05-31",
      copay: 300,
      deductible: 1200,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: true
    },
    registrationDate: "2024-02-28",
    lastLogin: "2024-11-27",
    verified: true
  },
  {
    id: "PAT020",
    firstName: "Alex",
    lastName: "Carter",
    email: "alex.carter@healthwyz.mu",
    password: "Patient717!",
    profileImage: "/images/patients/20.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjAiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient020",
    dateOfBirth: "1977-12-03",
    age: 47,
    gender: "Male",
    phone: "+230 6256 7890",
    address: "Souillac, Mauritius",
    emergencyContact: {
      name: "Taylor Carter",
      relationship: "Spouse",
      phone: "+230 6267 8901"
    },
    bloodType: "O-",
    allergies: ["Contrast dye"],
    chronicConditions: ["Chronic Kidney Disease Stage 3"],
    healthScore: 72,
    medicalRecords: [
      {
        id: "MR020",
        title: "Nephrology Consultation",
        date: "2024-09-30",
        time: "10:30",
        type: "consultation",
        doctorResponsible: "Dr. Ahmed Hassan",
        summary: "Kidney function monitoring and progression assessment",
        diagnosis: "CKD Stage 3A - stable progression",
        treatment: "Continue ACE inhibitor, phosphorus binder adjustment",
        notes: "eGFR stable at 45 ml/min, good blood pressure control"
      }
    ],
    activePrescriptions: [
      {
        id: "RX020",
        date: "2024-09-30",
        time: "11:00",
        doctorName: "Dr. Ahmed Hassan",
        doctorId: "DOC018",
        medicines: [
          {
            name: "Enalapril",
            dosage: "10mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Monitor blood pressure regularly",
            beforeFood: false
          },
          {
            name: "Sevelamer",
            dosage: "800mg",
            quantity: 90,
            frequency: "Three times daily with meals",
            duration: "3 months",
            instructions: "Take with each meal",
            beforeFood: false
          },
          {
            name: "Vitamin D3",
            dosage: "1000IU",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Support calcium absorption",
            beforeFood: false
          }
        ],
        diagnosis: "Chronic kidney disease stage 3A",
        isActive: true,
        nextRefill: "2024-12-30"
      }
    ],
    vitalSigns: [
      {
        id: "VS020",
        date: "2024-09-30",
        time: "10:45",
        bloodPressure: { systolic: 130, diastolic: 85 },
        heartRate: 75,
        temperature: 36.5,
        weight: 80.7,
        height: 172,
        oxygenSaturation: 97,
        labTechnician: "Sarah Ahmed",
        facility: "Nephrology Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP020",
        date: "2024-12-30",
        time: "10:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Ahmed Hassan",
        doctorId: "DOC018",
        specialty: "Nephrology",
        reason: "Kidney function follow-up",
        duration: 45,
        location: "Nephrology Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP020_PAST",
        date: "2024-09-30",
        time: "10:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Ahmed Hassan",
        doctorId: "DOC018",
        specialty: "Nephrology",
        reason: "CKD monitoring",
        duration: 45,
        location: "Nephrology Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Kidney Care Insurance",
      policyNumber: "KC-2024-484950",
      subscriberId: "PAT020KC",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 700,
      deductible: 2500,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2023-06-15",
    lastLogin: "2024-11-26",
    verified: true
  },
  {
    id: "PAT021",
    firstName: "Diego",
    lastName: "Rodriguez",
    email: "diego.rodriguez@healthwyz.mu",
    password: "Patient818!",
    profileImage: "/images/patients/21.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjEiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient021",
    dateOfBirth: "1989-04-12",
    age: 35,
    gender: "Male",
    phone: "+230 6278 9012",
    address: "Bambous, Mauritius",
    emergencyContact: {
      name: "Carmen Rodriguez",
      relationship: "Sister",
      phone: "+230 6289 0123"
    },
    bloodType: "A+",
    allergies: ["Dust", "Mold"],
    chronicConditions: ["Chronic Sinusitis"],
    healthScore: 81,
    medicalRecords: [
      {
        id: "MR021",
        title: "ENT Consultation",
        date: "2024-08-18",
        time: "11:45",
        type: "consultation",
        doctorResponsible: "Dr. Maria Gonzalez",
        summary: "Sinus infection treatment and allergy management review",
        diagnosis: "Chronic rhinosinusitis with polyps",
        treatment: "Nasal corticosteroids, antihistamine therapy",
        notes: "Significant improvement with current regimen, follow-up in 3 months"
      }
    ],
    activePrescriptions: [
      {
        id: "RX021",
        date: "2024-08-18",
        time: "12:15",
        doctorName: "Dr. Maria Gonzalez",
        doctorId: "DOC019",
        medicines: [
          {
            name: "Fluticasone Nasal Spray",
            dosage: "50mcg/spray",
            quantity: 1,
            frequency: "Two sprays each nostril daily",
            duration: "6 months",
            instructions: "Use consistently for best results",
            beforeFood: false
          },
          {
            name: "Montelukast",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily in evening",
            duration: "3 months",
            instructions: "Take consistently for allergy control",
            beforeFood: false
          }
        ],
        diagnosis: "Chronic rhinosinusitis, Allergic rhinitis",
        isActive: true,
        nextRefill: "2025-02-18"
      }
    ],
    vitalSigns: [
      {
        id: "VS021",
        date: "2024-08-18",
        time: "12:00",
        bloodPressure: { systolic: 115, diastolic: 75 },
        heartRate: 68,
        temperature: 36.8,
        weight: 77.9,
        height: 176,
        oxygenSaturation: 98,
        labTechnician: "Isabella Torres",
        facility: "ENT Specialty Center"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP021",
        date: "2025-02-18",
        time: "11:45",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Maria Gonzalez",
        doctorId: "DOC019",
        specialty: "ENT",
        reason: "Sinusitis follow-up",
        duration: 30,
        location: "ENT Specialty Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP021_PAST",
        date: "2024-08-18",
        time: "11:45",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Maria Gonzalez",
        doctorId: "DOC019",
        specialty: "ENT",
        reason: "Sinus treatment",
        duration: 45,
        location: "ENT Specialty Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Sinus Relief Insurance",
      policyNumber: "SR-2024-515253",
      subscriberId: "PAT021SR",
      validFrom: "2024-07-01",
      validUntil: "2025-06-30",
      copay: 350,
      deductible: 1400,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: false
    },
    registrationDate: "2024-06-10",
    lastLogin: "2024-11-25",
    verified: true
  },
  {
    id: "PAT022",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@healthwyz.mu",
    password: "Patient919!",
    profileImage: "/images/patients/22.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjIiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient022",
    dateOfBirth: "1970-08-25",
    age: 54,
    gender: "Male",
    phone: "+230 6290 1234",
    address: "Bel Air, Mauritius",
    emergencyContact: {
      name: "Angela Johnson",
      relationship: "Wife",
      phone: "+230 6301 2345"
    },
    bloodType: "B-",
    allergies: ["Aspirin", "Codeine"],
    chronicConditions: ["Type 2 Diabetes", "Diabetic Neuropathy"],
    healthScore: 69,
    medicalRecords: [
      {
        id: "MR022",
        title: "Endocrinology & Neurology Review",
        date: "2024-10-14",
        time: "08:30",
        type: "consultation",
        doctorResponsible: "Dr. Patricia Moore",
        summary: "Diabetes management and neuropathy pain assessment",
        diagnosis: "Type 2 DM with peripheral neuropathy - stable",
        treatment: "Insulin adjustment, neuropathic pain medication optimization",
        notes: "HbA1c improved to 7.2%, neuropathy symptoms better controlled"
      }
    ],
    activePrescriptions: [
      {
        id: "RX022",
        date: "2024-10-14",
        time: "09:00",
        doctorName: "Dr. Patricia Moore",
        doctorId: "DOC013",
        medicines: [
          {
            name: "Insulin Glargine",
            dosage: "25 units",
            quantity: 1,
            frequency: "Once daily at bedtime",
            duration: "1 month",
            instructions: "Rotate injection sites",
            beforeFood: false
          },
          {
            name: "Metformin XR",
            dosage: "1000mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with meals",
            beforeFood: false
          },
          {
            name: "Gabapentin",
            dosage: "300mg",
            quantity: 90,
            frequency: "Three times daily",
            duration: "3 months",
            instructions: "Gradually increase dose as tolerated",
            beforeFood: false
          }
        ],
        diagnosis: "Type 2 diabetes mellitus, Diabetic peripheral neuropathy",
        isActive: true,
        nextRefill: "2025-01-14"
      }
    ],
    vitalSigns: [
      {
        id: "VS022",
        date: "2024-10-14",
        time: "08:45",
        bloodPressure: { systolic: 145, diastolic: 92 },
        heartRate: 80,
        temperature: 36.4,
        weight: 92.3,
        height: 175,
        oxygenSaturation: 97,
        glucose: 156,
        labTechnician: "Michael Brown",
        facility: "Diabetes Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP022",
        date: "2025-01-14",
        time: "08:30",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Patricia Moore",
        doctorId: "DOC013",
        specialty: "Endocrinology",
        reason: "Diabetes follow-up",
        duration: 45,
        meetingLink: "https://healthwyz.mu/video/APP022"
      }
    ],
    pastAppointments: [
      {
        id: "APP022_PAST",
        date: "2024-10-14",
        time: "08:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Patricia Moore",
        doctorId: "DOC013",
        specialty: "Endocrinology",
        reason: "Diabetes management",
        duration: 60,
        location: "Diabetes Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Diabetes Care Plus",
      policyNumber: "DCP-2024-545556",
      subscriberId: "PAT022DCP",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 600,
      deductible: 2300,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2023-04-20",
    lastLogin: "2024-11-24",
    verified: true
  },
  {
    id: "PAT023",
    firstName: "Jayden",
    lastName: "Kim",
    email: "jayden.kim@healthwyz.mu",
    password: "Patient020!",
    profileImage: "/images/patients/23.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjMiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient023",
    dateOfBirth: "1996-11-14",
    age: 28,
    gender: "Male",
    phone: "+230 6312 3456",
    address: "Roche Bois, Mauritius",
    emergencyContact: {
      name: "Jin Kim",
      relationship: "Father",
      phone: "+230 6323 4567"
    },
    bloodType: "AB+",
    allergies: [],
    chronicConditions: ["Social Anxiety Disorder"],
    healthScore: 85,
    medicalRecords: [
      {
        id: "MR023",
        title: "Mental Health Consultation",
        date: "2024-11-30",
        time: "16:00",
        type: "consultation",
        doctorResponsible: "Dr. Steven Wong",
        summary: "Anxiety management review and medication adjustment",
        diagnosis: "Social anxiety disorder - improving with therapy",
        treatment: "Continue SSRI, cognitive behavioral therapy referral",
        notes: "Significant progress with social situations, reduced avoidance behaviors"
      }
    ],
    activePrescriptions: [
      {
        id: "RX023",
        date: "2024-11-30",
        time: "16:30",
        doctorName: "Dr. Steven Wong",
        doctorId: "DOC015",
        medicines: [
          {
            name: "Sertraline",
            dosage: "75mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning with food",
            beforeFood: false
          },
          {
            name: "Propranolol",
            dosage: "10mg",
            quantity: 30,
            frequency: "As needed for performance anxiety",
            duration: "3 months",
            instructions: "Take 1 hour before anxiety-provoking situations",
            beforeFood: false
          }
        ],
        diagnosis: "Social anxiety disorder",
        isActive: true,
        nextRefill: "2025-02-28"
      }
    ],
    vitalSigns: [
      {
        id: "VS023",
        date: "2024-11-30",
        time: "16:15",
        bloodPressure: { systolic: 118, diastolic: 72 },
        heartRate: 88,
        temperature: 36.5,
        weight: 69.8,
        height: 171,
        oxygenSaturation: 98,
        labTechnician: "Grace Kim",
        facility: "Mental Health Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP023",
        date: "2025-02-28",
        time: "16:00",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Steven Wong",
        doctorId: "DOC015",
        specialty: "Psychiatry",
        reason: "Anxiety management follow-up",
        duration: 45,
        meetingLink: "https://healthwyz.mu/video/APP023"
      }
    ],
    pastAppointments: [
      {
        id: "APP023_PAST",
        date: "2024-11-30",
        time: "16:00",
        type: "video",
        status: "completed",
        doctorName: "Dr. Steven Wong",
        doctorId: "DOC015",
        specialty: "Psychiatry",
        reason: "Anxiety therapy",
        duration: 45,
        meetingLink: "https://healthwyz.mu/video/APP023_PAST"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Mental Wellness Insurance",
      policyNumber: "MW-2024-575859",
      subscriberId: "PAT023MW",
      validFrom: "2024-11-01",
      validUntil: "2025-10-31",
      copay: 400,
      deductible: 1500,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: true
    },
    registrationDate: "2024-09-05",
    lastLogin: "2024-11-23",
    verified: true
  },
  {
    id: "PAT024",
    firstName: "Caleb",
    lastName: "Mitchell",
    email: "caleb.mitchell@healthwyz.mu",
    password: "Patient121!",
    profileImage: "/images/patients/24.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjQiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient024",
    dateOfBirth: "1983-02-07",
    age: 41,
    gender: "Male",
    phone: "+230 6334 5678",
    address: "Stanley, Mauritius",
    emergencyContact: {
      name: "Rachel Mitchell",
      relationship: "Wife",
      phone: "+230 6345 6789"
    },
    bloodType: "O+",
    allergies: ["Shellfish", "Nuts"],
    chronicConditions: ["Irritable Bowel Syndrome"],
    healthScore: 78,
    medicalRecords: [
      {
        id: "MR024",
        title: "Gastroenterology Follow-up",
        date: "2024-09-05",
        time: "14:45",
        type: "consultation",
        doctorResponsible: "Dr. Hassan Al-Ahmad",
        summary: "IBS symptom management and dietary counseling review",
        diagnosis: "IBS-D (diarrhea predominant) - well controlled",
        treatment: "Continue antispasmodic, probiotics, dietary modifications",
        notes: "Symptoms significantly improved with FODMAP diet and medication"
      }
    ],
    activePrescriptions: [
      {
        id: "RX024",
        date: "2024-09-05",
        time: "15:15",
        doctorName: "Dr. Hassan Al-Ahmad",
        doctorId: "DOC016",
        medicines: [
          {
            name: "Dicyclomine",
            dosage: "20mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take 30 minutes before meals",
            beforeFood: true
          },
          {
            name: "Probiotics Multi-strain",
            dosage: "1 capsule",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take with breakfast",
            beforeFood: false
          }
        ],
        diagnosis: "Irritable bowel syndrome with diarrhea",
        isActive: true,
        nextRefill: "2024-12-05"
      }
    ],
    vitalSigns: [
      {
        id: "VS024",
        date: "2024-09-05",
        time: "15:00",
        bloodPressure: { systolic: 125, diastolic: 78 },
        heartRate: 74,
        temperature: 36.6,
        weight: 79.4,
        height: 178,
        oxygenSaturation: 98,
        labTechnician: "Ahmed Rahman",
        facility: "Gastroenterology Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP024",
        date: "2024-12-05",
        time: "14:45",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Hassan Al-Ahmad",
        doctorId: "DOC016",
        specialty: "Gastroenterology",
        reason: "IBS management review",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP024"
      }
    ],
    pastAppointments: [
      {
        id: "APP024_PAST",
        date: "2024-09-05",
        time: "14:45",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Hassan Al-Ahmad",
        doctorId: "DOC016",
        specialty: "Gastroenterology",
        reason: "IBS follow-up",
        duration: 45,
        location: "Gastroenterology Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Digestive Health Plus",
      policyNumber: "DHP-2024-606162",
      subscriberId: "PAT024DHP",
      validFrom: "2024-09-01",
      validUntil: "2025-08-31",
      copay: 400,
      deductible: 1700,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },
    registrationDate: "2024-05-20",
    lastLogin: "2024-11-22",
    verified: true
  },
  {
    id: "PAT025",
    firstName: "Maya",
    lastName: "Patel",
    email: "maya.patel@healthwyz.mu",
    password: "Patient222!",
    profileImage: "/images/patients/25.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjUiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient025",
    dateOfBirth: "1994-06-18",
    age: 30,
    gender: "Female",
    phone: "+230 6356 7890",
    address: "Moka, Mauritius",
    emergencyContact: {
      name: "Vikram Patel",
      relationship: "Husband",
      phone: "+230 6367 8901"
    },
    bloodType: "A-",
    allergies: ["Latex"],
    chronicConditions: ["Polycystic Ovary Syndrome"],
    healthScore: 82,
    medicalRecords: [
      {
        id: "MR025",
        title: "Gynecology & Endocrinology Consultation",
        date: "2024-10-28",
        time: "11:30",
        type: "consultation",
        doctorResponsible: "Dr. Amanda Williams",
        summary: "PCOS management and fertility counseling",
        diagnosis: "PCOS - well managed with lifestyle and medication",
        treatment: "Continue metformin, hormonal balance monitoring",
        notes: "Regular cycles restored, insulin resistance improved"
      }
    ],
    activePrescriptions: [
      {
        id: "RX025",
        date: "2024-10-28",
        time: "12:00",
        doctorName: "Dr. Amanda Williams",
        doctorId: "DOC005",
        medicines: [
          {
            name: "Metformin",
            dosage: "1000mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Take with meals to reduce stomach upset",
            beforeFood: false
          },
          {
            name: "Spironolactone",
            dosage: "50mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Monitor potassium levels",
            beforeFood: false
          }
        ],
        diagnosis: "Polycystic ovary syndrome",
        isActive: true,
        nextRefill: "2025-01-28"
      }
    ],
    vitalSigns: [
      {
        id: "VS025",
        date: "2024-10-28",
        time: "11:45",
        bloodPressure: { systolic: 112, diastolic: 68 },
        heartRate: 76,
        temperature: 36.7,
        weight: 65.3,
        height: 163,
        oxygenSaturation: 99,
        glucose: 95,
        labTechnician: "Priya Sharma",
        facility: "Women's Health Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP025",
        date: "2025-01-28",
        time: "11:30",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Amanda Williams",
        doctorId: "DOC005",
        specialty: "Obstetrics & Gynecology",
        reason: "PCOS follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP025"
      }
    ],
    pastAppointments: [
      {
        id: "APP025_PAST",
        date: "2024-10-28",
        time: "11:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Amanda Williams",
        doctorId: "DOC005",
        specialty: "Obstetrics & Gynecology",
        reason: "PCOS management",
        duration: 45,
        location: "Women's Health Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Women's Health Insurance",
      policyNumber: "WH-2024-636465",
      subscriberId: "PAT025WH",
      validFrom: "2024-10-01",
      validUntil: "2025-09-30",
      copay: 350,
      deductible: 1400,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2024-07-15",
    lastLogin: "2024-11-21",
    verified: true
  },
  {
    id: "PAT026",
    firstName: "Xavier",
    lastName: "Foster",
    email: "xavier.foster@healthwyz.mu",
    password: "Patient323!",
    profileImage: "/images/patients/26.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjYiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient026",
    dateOfBirth: "1987-10-05",
    age: 37,
    gender: "Male",
    phone: "+230 6378 9012",
    address: "Grand Bay, Mauritius",
    emergencyContact: {
      name: "Lisa Foster",
      relationship: "Wife",
      phone: "+230 6389 0123"
    },
    bloodType: "A+",
    allergies: ["Pollen", "Dust mites"],
    chronicConditions: ["Chronic Lower Back Pain"],
    healthScore: 76,
    medicalRecords: [
      {
        id: "MR026",
        title: "Orthopedic & Pain Management Consultation",
        date: "2024-11-12",
        time: "15:30",
        type: "consultation",
        doctorResponsible: "Dr. Mark Thompson",
        summary: "Chronic back pain assessment and physiotherapy progress review",
        diagnosis: "Lumbar disc degeneration with chronic pain",
        treatment: "Continue physiotherapy, pain management adjustment",
        notes: "Good progress with current treatment plan, reduced pain intensity"
      }
    ],
    activePrescriptions: [
      {
        id: "RX026",
        date: "2024-11-12",
        time: "16:00",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        medicines: [
          {
            name: "Naproxen",
            dosage: "500mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "1 month",
            instructions: "Take with food to prevent stomach upset",
            beforeFood: false
          },
          {
            name: "Cyclobenzaprine",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily at bedtime",
            duration: "1 month",
            instructions: "May cause drowsiness",
            beforeFood: false
          }
        ],
        diagnosis: "Chronic lumbar pain, Muscle spasm",
        isActive: true,
        nextRefill: "2024-12-12"
      }
    ],
    vitalSigns: [
      {
        id: "VS026",
        date: "2024-11-12",
        time: "15:45",
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 72,
        temperature: 36.6,
        weight: 85.7,
        height: 180,
        oxygenSaturation: 98,
        labTechnician: "Mark Johnson",
        facility: "Orthopedic Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP026",
        date: "2024-12-12",
        time: "15:30",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        specialty: "Orthopedics",
        reason: "Back pain follow-up",
        duration: 30,
        location: "Orthopedic Center"
      }
    ],
    pastAppointments: [
      {
        id: "APP026_PAST",
        date: "2024-11-12",
        time: "15:30",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Mark Thompson",
        doctorId: "DOC008",
        specialty: "Orthopedics",
        reason: "Back pain management",
        duration: 45,
        location: "Orthopedic Center"
      }
    ],
    childcareBookings: [
      {
        id: "CB006",
        date: "2025-01-05",
        time: "09:00",
        nannyName: "Amy Foster",
        nannyId: "NAN010",
        duration: 6,
        type: "regular",
        children: ["Emma Foster (8 years)", "Jack Foster (5 years)"],
        specialInstructions: "Father has back pain - children aware not to jump on dad. Emergency contact available.",
        status: "upcoming"
      }
    ],
    insuranceCoverage: {
      provider: "Pain Management Insurance",
      policyNumber: "PM-2024-666768",
      subscriberId: "PAT026PM",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 450,
      deductible: 1900,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: true
    },
    registrationDate: "2023-11-08",
    lastLogin: "2024-11-20",
    verified: true
  },
  {
    id: "PAT027",
    firstName: "Austin",
    lastName: "Cooper",
    email: "austin.cooper@healthwyz.mu",
    password: "Patient424!",
    profileImage: "/images/patients/27.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjciLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient027",
    dateOfBirth: "1974-01-19",
    age: 50,
    gender: "Male",
    phone: "+230 6390 1234",
    address: "Chemin Grenier, Mauritius",
    emergencyContact: {
      name: "Jennifer Cooper",
      relationship: "Wife",
      phone: "+230 6401 2345"
    },
    bloodType: "O-",
    allergies: ["Shellfish", "Iodine"],
    chronicConditions: ["Enlarged Prostate", "High Blood Pressure"],
    healthScore: 74,
    medicalRecords: [
      {
        id: "MR027",
        title: "Urology & Cardiology Joint Consultation",
        date: "2024-08-22",
        time: "10:15",
        type: "consultation",
        doctorResponsible: "Dr. Paul Henderson",
        summary: "Prostate health monitoring and blood pressure management review",
        diagnosis: "Benign prostatic hyperplasia, Essential hypertension",
        treatment: "Continue alpha-blocker and ACE inhibitor therapy",
        notes: "PSA levels stable, blood pressure well controlled with current medications"
      }
    ],
    activePrescriptions: [
      {
        id: "RX027",
        date: "2024-08-22",
        time: "10:45",
        doctorName: "Dr. Paul Henderson",
        doctorId: "DOC009",
        medicines: [
          {
            name: "Tamsulosin",
            dosage: "0.4mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take 30 minutes after same meal daily",
            beforeFood: false
          },
          {
            name: "Lisinopril",
            dosage: "20mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the morning",
            beforeFood: true
          }
        ],
        diagnosis: "Benign prostatic hyperplasia, Essential hypertension",
        isActive: true,
        nextRefill: "2024-11-22"
      }
    ],
    vitalSigns: [
      {
        id: "VS027",
        date: "2024-08-22",
        time: "10:30",
        bloodPressure: { systolic: 135, diastolic: 88 },
        heartRate: 68,
        temperature: 36.8,
        weight: 89.2,
        height: 174,
        oxygenSaturation: 97,
        labTechnician: "Robert Wilson",
        facility: "Urology Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP027",
        date: "2024-11-22",
        time: "10:15",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Paul Henderson",
        doctorId: "DOC009",
        specialty: "Urology",
        reason: "Prostate and BP follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP027"
      }
    ],
    pastAppointments: [
      {
        id: "APP027_PAST",
        date: "2024-08-22",
        time: "10:15",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Paul Henderson",
        doctorId: "DOC009",
        specialty: "Urology",
        reason: "Prostate examination",
        duration: 45,
        location: "Urology Center"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Men's Health Plus",
      policyNumber: "MHP-2024-697071",
      subscriberId: "PAT027MHP",
      validFrom: "2024-08-01",
      validUntil: "2025-07-31",
      copay: 500,
      deductible: 2000,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2023-05-12",
    lastLogin: "2024-11-19",
    verified: true
  },
  {
    id: "PAT028",
    firstName: "Tyler",
    lastName: "Reed",
    email: "tyler.reed@healthwyz.mu",
    password: "Patient525!",
    profileImage: "/images/patients/28.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjgiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient028",
    dateOfBirth: "1999-03-26",
    age: 25,
    gender: "Male",
    phone: "+230 6412 3456",
    address: "Flacq, Mauritius",
    emergencyContact: {
      name: "Sarah Reed",
      relationship: "Mother",
      phone: "+230 6423 4567"
    },
    bloodType: "B+",
    allergies: ["Penicillin"],
    chronicConditions: [],
    healthScore: 95,
    medicalRecords: [
      {
        id: "MR028",
        title: "Travel Medicine Consultation",
        date: "2024-06-10",
        time: "13:00",
        type: "consultation",
        doctorResponsible: "Dr. Kevin Walsh",
        summary: "Pre-travel health assessment and vaccination update",
        diagnosis: "Healthy young adult, fit for international travel",
        treatment: "Travel vaccinations administered, malaria prophylaxis prescribed",
        notes: "All routine vaccinations up to date, health clearance for Africa travel"
      }
    ],
    activePrescriptions: [],
    vitalSigns: [
      {
        id: "VS028",
        date: "2024-06-10",
        time: "13:15",
        bloodPressure: { systolic: 108, diastolic: 68 },
        heartRate: 60,
        temperature: 36.4,
        weight: 72.8,
        height: 179,
        oxygenSaturation: 99,
        labTechnician: "Andrew Smith",
        facility: "Travel Health Clinic"
      }
    ],
    upcomingAppointments: [],
    pastAppointments: [
      {
        id: "APP028_PAST",
        date: "2024-06-10",
        time: "13:00",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Kevin Walsh",
        doctorId: "DOC012",
        specialty: "Travel Medicine",
        reason: "Pre-travel consultation",
        duration: 30,
        location: "Travel Health Clinic"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Adventure Travel Insurance",
      policyNumber: "AT-2024-727374",
      subscriberId: "PAT028AT",
      validFrom: "2024-06-01",
      validUntil: "2025-05-31",
      copay: 200,
      deductible: 600,
      coverageType: "individual",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: false,
      visionCoverage: false
    },
    registrationDate: "2024-05-25",
    lastLogin: "2024-11-18",
    verified: true
  },
  {
    id: "PAT029",
    firstName: "Blake",
    lastName: "Murphy",
    email: "blake.murphy@healthwyz.mu",
    password: "Patient626!",
    profileImage: "/images/patients/29.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMjkiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient029",
    dateOfBirth: "1965-07-04",
    age: 59,
    gender: "Male",
    phone: "+230 6434 5678",
    address: "Trou d'Eau Douce, Mauritius",
    emergencyContact: {
      name: "Margaret Murphy",
      relationship: "Wife",
      phone: "+230 6445 6789"
    },
    bloodType: "AB-",
    allergies: ["Sulfa drugs", "Latex"],
    chronicConditions: ["Coronary Artery Disease", "High Cholesterol"],
    healthScore: 67,
    medicalRecords: [
      {
        id: "MR029",
        title: "Cardiology Intensive Follow-up",
        date: "2024-11-05",
        time: "08:45",
        type: "consultation",
        doctorResponsible: "Dr. Sarah Johnson",
        summary: "Post-angioplasty follow-up and cardiac rehabilitation progress",
        diagnosis: "CAD post-PCI, hyperlipidemia - stable",
        treatment: "Continue dual antiplatelet therapy, statin optimization",
        notes: "Excellent recovery post-procedure, cardiac function improved significantly"
      }
    ],
    activePrescriptions: [
      {
        id: "RX029",
        date: "2024-11-05",
        time: "09:15",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        medicines: [
          {
            name: "Clopidogrel",
            dosage: "75mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "1 year",
            instructions: "Take with aspirin as prescribed",
            beforeFood: false
          },
          {
            name: "Aspirin",
            dosage: "81mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "Lifelong",
            instructions: "Take with food",
            beforeFood: false
          },
          {
            name: "Atorvastatin",
            dosage: "80mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "Take in the evening",
            beforeFood: false
          },
          {
            name: "Metoprolol",
            dosage: "50mg",
            quantity: 60,
            frequency: "Twice daily",
            duration: "3 months",
            instructions: "Monitor heart rate and blood pressure",
            beforeFood: false
          }
        ],
        diagnosis: "Coronary artery disease post-angioplasty, Hyperlipidemia",
        isActive: true,
        nextRefill: "2025-02-05"
      }
    ],
    vitalSigns: [
      {
        id: "VS029",
        date: "2024-11-05",
        time: "09:00",
        bloodPressure: { systolic: 118, diastolic: 75 },
        heartRate: 58,
        temperature: 36.5,
        weight: 78.9,
        height: 171,
        oxygenSaturation: 98,
        cholesterol: 145,
        labTechnician: "Catherine O'Brien",
        facility: "Cardiac Center Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP029",
        date: "2025-02-05",
        time: "08:45",
        type: "in-person",
        status: "upcoming",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Cardiology",
        reason: "Cardiac follow-up",
        duration: 45,
        location: "Apollo Bramwell Hospital"
      }
    ],
    pastAppointments: [
      {
        id: "APP029_PAST",
        date: "2024-11-05",
        time: "08:45",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Sarah Johnson",
        doctorId: "DOC001",
        specialty: "Cardiology",
        reason: "Post-angioplasty follow-up",
        duration: 60,
        location: "Apollo Bramwell Hospital"
      }
    ],
    childcareBookings: [],
    insuranceCoverage: {
      provider: "Cardiac Care Insurance",
      policyNumber: "CC-2024-757677",
      subscriberId: "PAT029CC",
      validFrom: "2024-01-01",
      validUntil: "2024-12-31",
      copay: 800,
      deductible: 3000,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: true
    },
    registrationDate: "2023-01-15",
    lastLogin: "2024-11-17",
    verified: true
  },
  {
    id: "PAT030",
    firstName: "Logan",
    lastName: "Hayes",
    email: "logan.hayes@healthwyz.mu",
    password: "Patient727!",
    profileImage: "/images/patients/30.jpg",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMzAiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient030",
    dateOfBirth: "1991-12-31",
    age: 33,
    gender: "Male",
    phone: "+230 6456 7890",
    address: "La Gaulette, Mauritius",
    emergencyContact: {
      name: "Samantha Hayes",
      relationship: "Wife",
      phone: "+230 6467 8901"
    },
    bloodType: "A+",
    allergies: ["Grass pollen", "Animal dander"],
    chronicConditions: ["Severe Allergic Asthma"],
    healthScore: 80,
    medicalRecords: [
      {
        id: "MR030",
        title: "Pulmonology & Allergy Specialist Review",
        date: "2024-12-02",
        time: "16:45",
        type: "consultation",
        doctorResponsible: "Dr. Michael Chen",
        nurseResponsible: "Rebecca Foster",
        summary: "Asthma control assessment and allergen management review",
        diagnosis: "Severe persistent asthma with environmental allergies - well controlled",
        treatment: "Continue combination inhaler therapy, environmental control measures",
        notes: "Significant improvement in peak flow readings, reduced rescue inhaler use"
      }
    ],
    activePrescriptions: [
      {
        id: "RX030",
        date: "2024-12-02",
        time: "17:15",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        medicines: [
          {
            name: "Budesonide/Formoterol Inhaler",
            dosage: "160/4.5mcg",
            quantity: 2,
            frequency: "Two puffs twice daily",
            duration: "3 months",
            instructions: "Rinse mouth after each use",
            beforeFood: false
          },
          {
            name: "Salbutamol Inhaler",
            dosage: "100mcg",
            quantity: 2,
            frequency: "As needed for acute symptoms",
            duration: "6 months",
            instructions: "Maximum 8 puffs per day",
            beforeFood: false
          },
          {
            name: "Montelukast",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily in evening",
            duration: "3 months",
            instructions: "Take consistently for allergy control",
            beforeFood: false
          },
          {
            name: "Cetirizine",
            dosage: "10mg",
            quantity: 30,
            frequency: "Once daily",
            duration: "3 months",
            instructions: "For environmental allergies",
            beforeFood: false
          }
        ],
        diagnosis: "Severe persistent asthma, Environmental allergies",
        isActive: true,
        nextRefill: "2025-03-02"
      }
    ],
    vitalSigns: [
      {
        id: "VS030",
        date: "2024-12-02",
        time: "17:00",
        bloodPressure: { systolic: 120, diastolic: 78 },
        heartRate: 74,
        temperature: 36.6,
        weight: 81.4,
        height: 176,
        oxygenSaturation: 96,
        labTechnician: "Daniel Foster",
        facility: "Pulmonary Function Lab"
      }
    ],
    upcomingAppointments: [
      {
        id: "APP030",
        date: "2025-03-02",
        time: "16:45",
        type: "video",
        status: "upcoming",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        specialty: "Pulmonology",
        reason: "Asthma control follow-up",
        duration: 30,
        meetingLink: "https://healthwyz.mu/video/APP030"
      }
    ],
    pastAppointments: [
      {
        id: "APP030_PAST",
        date: "2024-12-02",
        time: "16:45",
        type: "in-person",
        status: "completed",
        doctorName: "Dr. Michael Chen",
        doctorId: "DOC003",
        specialty: "Pulmonology",
        reason: "Asthma management",
        duration: 45,
        location: "Pulmonary Specialist Center"
      }
    ],
    childcareBookings: [
      {
        id: "CB007",
        date: "2025-01-08",
        time: "18:30",
        nannyName: "Hannah Clark",
        nannyId: "NAN012",
        duration: 4,
        type: "regular",
        children: ["Oliver Hayes (7 years)", "Sophie Hayes (4 years)"],
        specialInstructions: "Father has severe asthma - rescue inhaler locations known to children. No pets, flowers, or strong scents. Air purifier must stay on.",
        status: "upcoming"
      }
    ],
    insuranceCoverage: {
      provider: "Respiratory Health Insurance",
      policyNumber: "RH-2024-787980",
      subscriberId: "PAT030RH",
      validFrom: "2024-12-01",
      validUntil: "2025-11-30",
      copay: 400,
      deductible: 1600,
      coverageType: "family",
      emergencyCoverage: true,
      pharmacyCoverage: true,
      dentalCoverage: true,
      visionCoverage: false
    },
    registrationDate: "2024-08-18",
    lastLogin: "2024-12-15",
    verified: true
  }
];