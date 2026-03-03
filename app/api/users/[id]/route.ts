import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { updateUserProfileSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

// Allowed fields per profile type to prevent mass-assignment
const ALLOWED_PROFILE_FIELDS: Record<string, string[]> = {
  PATIENT: ['bloodType', 'allergies', 'chronicConditions', 'healthScore'],
  DOCTOR: ['category', 'specialty', 'subSpecialties', 'licenseNumber', 'clinicAffiliation', 'consultationFee', 'videoConsultationFee', 'emergencyConsultationFee', 'bio', 'languages', 'experience', 'location', 'alternatePhone', 'website', 'consultationTypes', 'emergencyAvailable', 'homeVisitAvailable', 'telemedicineAvailable', 'nationality', 'philosophy', 'specialInterests', 'hospitalPrivileges', 'consultationDuration'],
  NURSE: ['licenseNumber', 'experience', 'specializations'],
  NANNY: ['experience', 'certifications'],
  PHARMACIST: ['licenseNumber', 'pharmacyName', 'pharmacyAddress', 'specializations'],
  LAB_TECHNICIAN: ['licenseNumber', 'labName', 'specializations'],
  EMERGENCY_WORKER: ['certifications', 'vehicleType', 'responseZone', 'emtLevel'],
  INSURANCE_REP: ['companyName', 'licenseNumber', 'coverageTypes'],
  CORPORATE_ADMIN: ['companyName', 'registrationNumber', 'employeeCount', 'industry'],
  REFERRAL_PARTNER: ['businessType', 'commissionRate', 'referralCode'],
  REGIONAL_ADMIN: ['region', 'country', 'countryCode'],
}

const PROFILE_TABLE_MAP: Record<string, string> = {
  PATIENT: 'patientProfile',
  DOCTOR: 'doctorProfile',
  NURSE: 'nurseProfile',
  NANNY: 'nannyProfile',
  PHARMACIST: 'pharmacistProfile',
  LAB_TECHNICIAN: 'labTechProfile',
  EMERGENCY_WORKER: 'emergencyWorkerProfile',
  INSURANCE_REP: 'insuranceRepProfile',
  CORPORATE_ADMIN: 'corporateAdminProfile',
  REFERRAL_PARTNER: 'referralPartnerProfile',
  REGIONAL_ADMIN: 'regionalAdminProfile',
}

async function updateTypeProfile(userId: string, userType: string, data: Record<string, unknown>) {
  const tableName = PROFILE_TABLE_MAP[userType]
  const allowedFields = ALLOWED_PROFILE_FIELDS[userType]
  if (!tableName || !allowedFields) return

  // Filter to only allowed fields
  const filtered: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (data[key] !== undefined) filtered[key] = data[key]
  }
  if (Object.keys(filtered).length === 0) return

  // Use dynamic prisma access to update the profile
  const model = (prisma as unknown as Record<string, unknown>)[tableName] as {
    update: (args: { where: { userId: string }; data: Record<string, unknown> }) => Promise<unknown>
  }
  if (model?.update) {
    await model.update({ where: { userId }, data: filtered })
  }
}

const PROFILE_INCLUDES: Record<string, string> = {
  PATIENT: 'patientProfile',
  DOCTOR: 'doctorProfile',
  NURSE: 'nurseProfile',
  NANNY: 'nannyProfile',
  PHARMACIST: 'pharmacistProfile',
  LAB_TECHNICIAN: 'labTechProfile',
  EMERGENCY_WORKER: 'emergencyWorkerProfile',
  INSURANCE_REP: 'insuranceRepProfile',
  CORPORATE_ADMIN: 'corporateAdminProfile',
  REFERRAL_PARTNER: 'referralPartnerProfile',
  REGIONAL_ADMIN: 'regionalAdminProfile',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    if (auth.sub !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profileImage: true,
        userType: true,
        dateOfBirth: true,
        gender: true,
        address: true,
        verified: true,
        accountStatus: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch the type-specific profile (with emergency contact for patients)
    const profileRelation = PROFILE_INCLUDES[user.userType]
    let profile = null
    if (profileRelation) {
      const includeConfig: Record<string, unknown> =
        user.userType === 'PATIENT'
          ? { [profileRelation]: { include: { emergencyContact: true } } }
          : { [profileRelation]: true }

      const userWithProfile = await prisma.user.findUnique({
        where: { id },
        include: includeConfig,
      })
      profile = userWithProfile?.[profileRelation as keyof typeof userWithProfile] ?? null
    }

    return NextResponse.json({ data: { ...user, profile } })
  } catch (error) {
    void error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    if (auth.sub !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = updateUserProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      profileData,
    } = parsed.data

    // Build the User update data (only include fields that were provided)
    const userData: Record<string, unknown> = {}
    if (firstName !== undefined) userData.firstName = firstName
    if (lastName !== undefined) userData.lastName = lastName
    if (email !== undefined) userData.email = email
    if (phone !== undefined) userData.phone = phone
    if (dateOfBirth !== undefined) userData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null
    if (gender !== undefined) userData.gender = gender
    if (address !== undefined) userData.address = address

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profileImage: true,
        userType: true,
        dateOfBirth: true,
        gender: true,
        address: true,
      },
    })

    // Update emergency contact if provided and user is a patient
    if (emergencyContact && updatedUser.userType === 'PATIENT') {
      const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: id },
      })

      if (patientProfile) {
        await prisma.patientEmergencyContact.upsert({
          where: { patientId: patientProfile.id },
          update: {
            name: emergencyContact.name ?? '',
            relationship: emergencyContact.relationship ?? '',
            phone: emergencyContact.phone ?? '',
          },
          create: {
            patientId: patientProfile.id,
            name: emergencyContact.name ?? '',
            relationship: emergencyContact.relationship ?? '',
            phone: emergencyContact.phone ?? '',
          },
        })
      }
    }

    // Update type-specific profile if profileData is provided
    if (profileData && Object.keys(profileData).length > 0) {
      await updateTypeProfile(id, updatedUser.userType, profileData)
    }

    return NextResponse.json({ data: updatedUser })
  } catch (error) {
    void error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
