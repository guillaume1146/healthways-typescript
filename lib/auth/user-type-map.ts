import { UserType } from '@prisma/client'

/**
 * Maps cookie/form string values (sent by the frontend login form)
 * to the Prisma UserType enum values stored in the database.
 */
export const cookieToPrismaUserType: Record<string, UserType> = {
  'patient':          UserType.PATIENT,
  'doctor':           UserType.DOCTOR,
  'nurse':            UserType.NURSE,
  'child-care-nurse': UserType.NANNY,
  'pharmacy':         UserType.PHARMACIST,
  'lab':              UserType.LAB_TECHNICIAN,
  'ambulance':        UserType.EMERGENCY_WORKER,
  'admin':            UserType.REGIONAL_ADMIN,
  'corporate':        UserType.CORPORATE_ADMIN,
  'insurance':        UserType.INSURANCE_REP,
  'referral-partner': UserType.REFERRAL_PARTNER,
}

/**
 * Reverse mapping: Prisma UserType enum -> cookie/form string value.
 */
export const prismaUserTypeToCookie: Record<UserType, string> = {
  [UserType.PATIENT]:          'patient',
  [UserType.DOCTOR]:           'doctor',
  [UserType.NURSE]:            'nurse',
  [UserType.NANNY]:            'child-care-nurse',
  [UserType.PHARMACIST]:       'pharmacy',
  [UserType.LAB_TECHNICIAN]:   'lab',
  [UserType.EMERGENCY_WORKER]: 'ambulance',
  [UserType.REGIONAL_ADMIN]:   'admin',
  [UserType.CORPORATE_ADMIN]:  'corporate',
  [UserType.INSURANCE_REP]:    'insurance',
  [UserType.REFERRAL_PARTNER]: 'referral-partner',
}

/**
 * Maps each Prisma UserType to the corresponding Prisma relation name
 * on the User model, so we can dynamically include the right profile.
 */
export const userTypeToProfileRelation: Record<UserType, string> = {
  [UserType.PATIENT]:          'patientProfile',
  [UserType.DOCTOR]:           'doctorProfile',
  [UserType.NURSE]:            'nurseProfile',
  [UserType.NANNY]:            'nannyProfile',
  [UserType.PHARMACIST]:       'pharmacistProfile',
  [UserType.LAB_TECHNICIAN]:   'labTechProfile',
  [UserType.EMERGENCY_WORKER]: 'emergencyWorkerProfile',
  [UserType.INSURANCE_REP]:    'insuranceRepProfile',
  [UserType.CORPORATE_ADMIN]:  'corporateAdminProfile',
  [UserType.REFERRAL_PARTNER]: 'referralPartnerProfile',
  [UserType.REGIONAL_ADMIN]:   'regionalAdminProfile',
}
