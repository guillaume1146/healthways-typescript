/** Centralized user type color definitions used across badges, avatars, and UI elements */

export const USER_TYPE_COLORS: Record<string, {
  bg: string
  text: string
  border: string
  gradient: string
  accent: string
}> = {
  PATIENT: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    gradient: 'from-green-500 to-emerald-600',
    accent: 'green',
  },
  DOCTOR: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-indigo-600',
    accent: 'blue',
  },
  NURSE: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-pink-500 to-rose-600',
    accent: 'pink',
  },
  NANNY: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    gradient: 'from-yellow-500 to-orange-600',
    accent: 'orange',
  },
  PHARMACIST: {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    border: 'border-teal-200',
    gradient: 'from-teal-500 to-cyan-600',
    accent: 'teal',
  },
  LAB_TECHNICIAN: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    gradient: 'from-cyan-500 to-teal-600',
    accent: 'cyan',
  },
  EMERGENCY_WORKER: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    gradient: 'from-red-500 to-red-700',
    accent: 'red',
  },
  INSURANCE_REP: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    gradient: 'from-indigo-500 to-purple-600',
    accent: 'indigo',
  },
  CORPORATE_ADMIN: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    gradient: 'from-slate-500 to-gray-600',
    accent: 'slate',
  },
  REFERRAL_PARTNER: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    gradient: 'from-amber-500 to-yellow-600',
    accent: 'amber',
  },
  REGIONAL_ADMIN: {
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
    gradient: 'from-violet-500 to-purple-600',
    accent: 'violet',
  },
}

export function getUserTypeColor(userType: string) {
  return USER_TYPE_COLORS[userType] || USER_TYPE_COLORS.PATIENT
}

export function getUserTypeLabel(userType: string): string {
  const labels: Record<string, string> = {
    PATIENT: 'Patient',
    DOCTOR: 'Doctor',
    NURSE: 'Nurse',
    NANNY: 'Nanny',
    PHARMACIST: 'Pharmacist',
    LAB_TECHNICIAN: 'Lab Technician',
    EMERGENCY_WORKER: 'Emergency Worker',
    INSURANCE_REP: 'Insurance Rep',
    CORPORATE_ADMIN: 'Corporate Admin',
    REFERRAL_PARTNER: 'Referral Partner',
    REGIONAL_ADMIN: 'Regional Admin',
  }
  return labels[userType] || userType
}

/** Status badge styles used across booking/appointment lists */
export const STATUS_STYLES: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  'no-show': 'bg-gray-100 text-gray-800 border-gray-200',
  dispatched: 'bg-orange-100 text-orange-800 border-orange-200',
  en_route: 'bg-amber-100 text-amber-800 border-amber-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
}

export function getStatusStyle(status: string): string {
  return STATUS_STYLES[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/** Provider accent colors for booking pages */
export const PROVIDER_BOOKING_COLORS: Record<string, {
  gradient: string
  ticketGradient: string
  spinnerBorder: string
  accentColor: string
  backLink: string
}> = {
  doctor: {
    gradient: 'from-blue-600 to-blue-700',
    ticketGradient: 'from-blue-600 to-indigo-700',
    spinnerBorder: 'border-blue-600',
    accentColor: 'blue',
    backLink: '/patient/consultations',
  },
  nurse: {
    gradient: 'from-pink-600 to-rose-700',
    ticketGradient: 'from-pink-600 to-rose-700',
    spinnerBorder: 'border-pink-600',
    accentColor: 'pink',
    backLink: '/patient/nurse-services',
  },
  nanny: {
    gradient: 'from-yellow-500 to-orange-600',
    ticketGradient: 'from-yellow-500 to-orange-600',
    spinnerBorder: 'border-yellow-500',
    accentColor: 'orange',
    backLink: '/patient/childcare',
  },
  'lab-test': {
    gradient: 'from-cyan-600 to-teal-700',
    ticketGradient: 'from-cyan-600 to-teal-700',
    spinnerBorder: 'border-cyan-600',
    accentColor: 'cyan',
    backLink: '/patient/lab-results',
  },
  emergency: {
    gradient: 'from-red-600 to-red-800',
    ticketGradient: 'from-red-600 to-red-800',
    spinnerBorder: 'border-red-600',
    accentColor: 'red',
    backLink: '/patient/emergency',
  },
}
