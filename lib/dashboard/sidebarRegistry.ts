import type { SidebarItem } from '@/components/dashboard/DashboardSidebar'

import { PATIENT_SIDEBAR_ITEMS, getActiveSectionFromPath as patientGetActive } from '@/app/patient/(dashboard)/sidebar-config'
import { DOCTOR_SIDEBAR_ITEMS, getActiveSectionFromPath as doctorGetActive } from '@/app/doctor/(dashboard)/sidebar-config'
import { NURSE_SIDEBAR_ITEMS, getActiveSectionFromPath as nurseGetActive } from '@/app/nurse/(dashboard)/sidebar-config'
import { NANNY_SIDEBAR_ITEMS, getActiveSectionFromPath as nannyGetActive } from '@/app/nanny/(dashboard)/sidebar-config'
import { PHARMACIST_SIDEBAR_ITEMS, getActiveSectionFromPath as pharmacistGetActive } from '@/app/pharmacist/(dashboard)/sidebar-config'
import { LAB_TECH_SIDEBAR_ITEMS, getActiveSectionFromPath as labTechGetActive } from '@/app/lab-technician/(dashboard)/sidebar-config'
import { RESPONDER_SIDEBAR_ITEMS, getActiveSectionFromPath as responderGetActive } from '@/app/responder/(dashboard)/sidebar-config'
import { INSURANCE_SIDEBAR_ITEMS, getActiveSectionFromPath as insuranceGetActive } from '@/app/insurance/(dashboard)/sidebar-config'
import { CORPORATE_SIDEBAR_ITEMS, getActiveSectionFromPath as corporateGetActive } from '@/app/corporate/(dashboard)/sidebar-config'
import { REFERRAL_SIDEBAR_ITEMS, getActiveSectionFromPath as referralGetActive } from '@/app/referral-partner/(dashboard)/sidebar-config'
import { REGIONAL_ADMIN_SIDEBAR_ITEMS, getActiveSectionFromPath as regionalGetActive } from '@/app/regional/(dashboard)/sidebar-config'
import { ADMIN_SIDEBAR_ITEMS, getActiveSectionFromPath as adminGetActive } from '@/app/admin/(dashboard)/sidebar-config'

export interface SidebarConfig {
  items: SidebarItem[]
  getActiveSectionFromPath: (pathname: string) => string
  userSubtitle: string
  profileHref: string
  networkHref: string
  namePrefix?: string
}

const userTypeToSlug: Record<string, string> = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  NANNY: 'nanny',
  PHARMACIST: 'pharmacist',
  LAB_TECHNICIAN: 'lab-technician',
  EMERGENCY_WORKER: 'responder',
  INSURANCE_REP: 'insurance',
  CORPORATE_ADMIN: 'corporate',
  REFERRAL_PARTNER: 'referral-partner',
  REGIONAL_ADMIN: 'regional',
}

const registry: Record<string, SidebarConfig> = {
  PATIENT: {
    items: PATIENT_SIDEBAR_ITEMS,
    getActiveSectionFromPath: patientGetActive,
    userSubtitle: 'Patient',
    profileHref: '/patient/profile',
    networkHref: '/patient/network',
  },
  DOCTOR: {
    items: DOCTOR_SIDEBAR_ITEMS,
    getActiveSectionFromPath: doctorGetActive,
    userSubtitle: 'Doctor',
    profileHref: '/doctor/profile',
    networkHref: '/doctor/network',
    namePrefix: 'Dr.',
  },
  NURSE: {
    items: NURSE_SIDEBAR_ITEMS,
    getActiveSectionFromPath: nurseGetActive,
    userSubtitle: 'Nurse',
    profileHref: '/nurse/profile',
    networkHref: '/nurse/network',
  },
  NANNY: {
    items: NANNY_SIDEBAR_ITEMS,
    getActiveSectionFromPath: nannyGetActive,
    userSubtitle: 'Childcare',
    profileHref: '/nanny/profile',
    networkHref: '/nanny/network',
  },
  PHARMACIST: {
    items: PHARMACIST_SIDEBAR_ITEMS,
    getActiveSectionFromPath: pharmacistGetActive,
    userSubtitle: 'Pharmacist',
    profileHref: '/pharmacist/profile',
    networkHref: '/pharmacist/network',
  },
  LAB_TECHNICIAN: {
    items: LAB_TECH_SIDEBAR_ITEMS,
    getActiveSectionFromPath: labTechGetActive,
    userSubtitle: 'Lab Technician',
    profileHref: '/lab-technician/profile',
    networkHref: '/lab-technician/network',
  },
  EMERGENCY_WORKER: {
    items: RESPONDER_SIDEBAR_ITEMS,
    getActiveSectionFromPath: responderGetActive,
    userSubtitle: 'Responder',
    profileHref: '/responder/profile',
    networkHref: '/responder/network',
  },
  INSURANCE_REP: {
    items: INSURANCE_SIDEBAR_ITEMS,
    getActiveSectionFromPath: insuranceGetActive,
    userSubtitle: 'Insurance',
    profileHref: '/insurance/profile',
    networkHref: '/insurance/network',
  },
  CORPORATE_ADMIN: {
    items: CORPORATE_SIDEBAR_ITEMS,
    getActiveSectionFromPath: corporateGetActive,
    userSubtitle: 'Corporate',
    profileHref: '/corporate/profile',
    networkHref: '/corporate/network',
  },
  REFERRAL_PARTNER: {
    items: REFERRAL_SIDEBAR_ITEMS,
    getActiveSectionFromPath: referralGetActive,
    userSubtitle: 'Referral Partner',
    profileHref: '/referral-partner/profile',
    networkHref: '/referral-partner/network',
  },
  REGIONAL_ADMIN: {
    items: REGIONAL_ADMIN_SIDEBAR_ITEMS,
    getActiveSectionFromPath: regionalGetActive,
    userSubtitle: 'Regional Admin',
    profileHref: '/regional/profile',
    networkHref: '/regional/network',
  },
}

export function getSidebarConfig(userType: string): SidebarConfig | null {
  return registry[userType] ?? null
}

export function getUserTypeSlug(userType: string): string | null {
  return userTypeToSlug[userType] ?? null
}
