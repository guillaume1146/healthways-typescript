import { describe, it, expect } from 'vitest'

// Mock @prisma/client since it depends on generated code
vi.mock('@prisma/client', () => ({
  UserType: {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    NURSE: 'NURSE',
    NANNY: 'NANNY',
    PHARMACIST: 'PHARMACIST',
    LAB_TECHNICIAN: 'LAB_TECHNICIAN',
    EMERGENCY_WORKER: 'EMERGENCY_WORKER',
    INSURANCE_REP: 'INSURANCE_REP',
    CORPORATE_ADMIN: 'CORPORATE_ADMIN',
    REFERRAL_PARTNER: 'REFERRAL_PARTNER',
    REGIONAL_ADMIN: 'REGIONAL_ADMIN',
  },
}))

import { vi } from 'vitest'
import { cookieToPrismaUserType, prismaUserTypeToCookie, userTypeToProfileRelation } from '../user-type-map'

describe('cookieToPrismaUserType', () => {
  it('maps all 11 cookie types to Prisma enums', () => {
    const expectedMappings: Record<string, string> = {
      'patient': 'PATIENT',
      'doctor': 'DOCTOR',
      'nurse': 'NURSE',
      'child-care-nurse': 'NANNY',
      'pharmacy': 'PHARMACIST',
      'lab': 'LAB_TECHNICIAN',
      'ambulance': 'EMERGENCY_WORKER',
      'admin': 'REGIONAL_ADMIN',
      'corporate': 'CORPORATE_ADMIN',
      'insurance': 'INSURANCE_REP',
      'referral-partner': 'REFERRAL_PARTNER',
    }

    for (const [cookie, prismaType] of Object.entries(expectedMappings)) {
      expect(cookieToPrismaUserType[cookie]).toBe(prismaType)
    }
  })
})

describe('prismaUserTypeToCookie', () => {
  it('is the reverse of cookieToPrismaUserType', () => {
    for (const [cookie, prismaType] of Object.entries(cookieToPrismaUserType)) {
      expect(prismaUserTypeToCookie[prismaType]).toBe(cookie)
    }
  })
})

describe('userTypeToProfileRelation', () => {
  it('maps all types to profile relation names', () => {
    expect(userTypeToProfileRelation['PATIENT']).toBe('patientProfile')
    expect(userTypeToProfileRelation['DOCTOR']).toBe('doctorProfile')
    expect(userTypeToProfileRelation['NURSE']).toBe('nurseProfile')
    expect(userTypeToProfileRelation['NANNY']).toBe('nannyProfile')
    expect(userTypeToProfileRelation['PHARMACIST']).toBe('pharmacistProfile')
    expect(userTypeToProfileRelation['LAB_TECHNICIAN']).toBe('labTechProfile')
    expect(userTypeToProfileRelation['EMERGENCY_WORKER']).toBe('emergencyWorkerProfile')
    expect(userTypeToProfileRelation['INSURANCE_REP']).toBe('insuranceRepProfile')
    expect(userTypeToProfileRelation['CORPORATE_ADMIN']).toBe('corporateAdminProfile')
    expect(userTypeToProfileRelation['REFERRAL_PARTNER']).toBe('referralPartnerProfile')
    expect(userTypeToProfileRelation['REGIONAL_ADMIN']).toBe('regionalAdminProfile')
  })
})
