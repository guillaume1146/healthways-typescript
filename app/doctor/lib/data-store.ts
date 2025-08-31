import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DoctorProfile {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  registrationNumber: string
  avatar: string
  bio: string
  languages: string[]
  consultationFee: number
  videoConsultationFee: number
  emergencyConsultationAvailable: boolean
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  email: string
  phone: string
  avatar: string
  medicalHistory: string[]
  allergies: string[]
  lastVisit: string
  upcomingAppointment?: string
  totalVisits: number
  prescriptions: number
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  datetime: string
  duration: number
  type: 'video' | 'in-person'
  status: 'upcoming' | 'completed' | 'cancelled'
  location: string
  notes?: string
}

export interface TimeSlot {
  start: string
  end: string
  isAvailable: boolean
}

export interface DayAvailability {
  date: string
  slots: TimeSlot[]
  isWorkingDay: boolean
}

export interface AvailabilitySchedule {
  regularHours: {
    [key: string]: DayAvailability // monday, tuesday, etc.
  }
  exceptions: {
    date: string
    reason: string
    isAvailable: boolean
  }[]
  vacations: {
    startDate: string
    endDate: string
    reason: string
  }[]
}

export interface SubscriptionPlan {
  id: 'free' | 'professional' | 'premium'
  name: string
  price: number
  features: string[]
  isActive: boolean
}

export interface PaymentMethod {
  id: string
  type: 'mcb_juice' | 'visa' | 'mastercard'
  isEnabled: boolean
  lastFour?: string
  isDefault?: boolean
}

export interface ConsultationSession {
  id: string
  patientId: string
  startTime: string
  endTime?: string
  recordingUrl?: string
  notes: string
  prescriptionId?: string
}

// Store Interface
interface DoctorStore {
  // Doctor Profile
  profile: DoctorProfile
  updateProfile: (profile: Partial<DoctorProfile>) => void
  
  // Patients
  patients: Patient[]
  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
  addPatient: (patient: Patient) => void
  updatePatient: (id: string, data: Partial<Patient>) => void
  
  // Appointments
  appointments: Appointment[]
  addAppointment: (appointment: Appointment) => void
  updateAppointment: (id: string, data: Partial<Appointment>) => void
  cancelAppointment: (id: string) => void
  
  // Availability
  availability: AvailabilitySchedule
  updateAvailability: (schedule: Partial<AvailabilitySchedule>) => void
  addException: (exception: { date: string; reason: string; isAvailable: boolean }) => void
  addVacation: (vacation: { startDate: string; endDate: string; reason: string }) => void
  
  // Subscription
  subscription: SubscriptionPlan
  updateSubscription: (plan: SubscriptionPlan) => void
  
  // Payment Methods
  paymentMethods: PaymentMethod[]
  addPaymentMethod: (method: PaymentMethod) => void
  removePaymentMethod: (id: string) => void
  setDefaultPaymentMethod: (id: string) => void
  
  // Consultation Sessions
  activeSessions: ConsultationSession[]
  startConsultation: (patientId: string) => string
  endConsultation: (sessionId: string, notes: string) => void
  
  // Utility functions
  getPatientById: (id: string) => Patient | undefined
  getUpcomingAppointments: () => Appointment[]
  getTodaysAppointments: () => Appointment[]
}

// Default initial state
const defaultProfile: DoctorProfile = {
  id: 'doc-001',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@healthwyz.mu',
  phone: '+230 5123 4567',
  specialty: 'Cardiology',
  registrationNumber: 'MED-2024-001',
  avatar: '👩‍⚕️',
  bio: 'Experienced cardiologist with over 10 years of practice',
  languages: ['English', 'French', 'Creole'],
  consultationFee: 2500,
  videoConsultationFee: 2000,
  emergencyConsultationAvailable: true
}

const defaultAvailability: AvailabilitySchedule = {
  regularHours: {
    monday: {
      date: 'monday',
      slots: [
        { start: '09:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '18:00', isAvailable: true }
      ],
      isWorkingDay: true
    },
    tuesday: {
      date: 'tuesday',
      slots: [
        { start: '09:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '18:00', isAvailable: true }
      ],
      isWorkingDay: true
    },
    wednesday: {
      date: 'wednesday',
      slots: [
        { start: '09:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '18:00', isAvailable: true }
      ],
      isWorkingDay: true
    },
    thursday: {
      date: 'thursday',
      slots: [
        { start: '09:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '18:00', isAvailable: true }
      ],
      isWorkingDay: true
    },
    friday: {
      date: 'friday',
      slots: [
        { start: '09:00', end: '12:00', isAvailable: true },
        { start: '14:00', end: '17:00', isAvailable: true }
      ],
      isWorkingDay: true
    },
    saturday: {
      date: 'saturday',
      slots: [
        { start: '09:00', end: '13:00', isAvailable: true }
      ],
      isWorkingDay: true
    },
    sunday: {
      date: 'sunday',
      slots: [],
      isWorkingDay: false
    }
  },
  exceptions: [],
  vacations: []
}

const defaultSubscription: SubscriptionPlan = {
  id: 'free',
  name: 'Free',
  price: 0,
  features: [
    'Up to 10 patients/month',
    'Basic consultation features',
    'Email support'
  ],
  isActive: true
}

// Create the store
export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      // Initial states
      profile: defaultProfile,
      patients: [],
      selectedPatient: null,
      appointments: [],
      availability: defaultAvailability,
      subscription: defaultSubscription,
      paymentMethods: [],
      activeSessions: [],

      // Profile methods
      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile }
        })),

      // Patient methods
      setSelectedPatient: (patient) =>
        set({ selectedPatient: patient }),

      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, patient]
        })),

      updatePatient: (id, data) =>
        set((state) => ({
          patients: state.patients.map(p =>
            p.id === id ? { ...p, ...data } : p
          )
        })),

      // Appointment methods
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment]
        })),

      updateAppointment: (id, data) =>
        set((state) => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, ...data } : a
          )
        })),

      cancelAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.map(a =>
            a.id === id ? { ...a, status: 'cancelled' } : a
          )
        })),

      // Availability methods
      updateAvailability: (schedule) =>
        set((state) => ({
          availability: { ...state.availability, ...schedule }
        })),

      addException: (exception) =>
        set((state) => ({
          availability: {
            ...state.availability,
            exceptions: [...state.availability.exceptions, exception]
          }
        })),

      addVacation: (vacation) =>
        set((state) => ({
          availability: {
            ...state.availability,
            vacations: [...state.availability.vacations, vacation]
          }
        })),

      // Subscription methods
      updateSubscription: (plan) =>
        set({ subscription: plan }),

      // Payment methods
      addPaymentMethod: (method) =>
        set((state) => ({
          paymentMethods: [...state.paymentMethods, method]
        })),

      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter(m => m.id !== id)
        })),

      setDefaultPaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.map(m => ({
            ...m,
            isDefault: m.id === id
          }))
        })),

      // Consultation methods
      startConsultation: (patientId) => {
        const sessionId = `session-${Date.now()}`
        const session: ConsultationSession = {
          id: sessionId,
          patientId,
          startTime: new Date().toISOString(),
          notes: ''
        }
        set((state) => ({
          activeSessions: [...state.activeSessions, session]
        }))
        return sessionId
      },

      endConsultation: (sessionId, notes) =>
        set((state) => ({
          activeSessions: state.activeSessions.map(s =>
            s.id === sessionId
              ? { ...s, endTime: new Date().toISOString(), notes }
              : s
          )
        })),

      // Utility functions
      getPatientById: (id) => {
        const state = get()
        return state.patients.find(p => p.id === id)
      },

      getUpcomingAppointments: () => {
        const state = get()
        return state.appointments.filter(a => a.status === 'upcoming')
      },

      getTodaysAppointments: () => {
        const state = get()
        const today = new Date().toDateString()
        return state.appointments.filter(a => {
          const appointmentDate = new Date(a.datetime).toDateString()
          return appointmentDate === today && a.status === 'upcoming'
        })
      }
    }),
    {
      name: 'doctor-storage',
      partialize: (state) => ({
        profile: state.profile,
        patients: state.patients,
        appointments: state.appointments,
        availability: state.availability,
        subscription: state.subscription,
        paymentMethods: state.paymentMethods
      })
    }
  )
)