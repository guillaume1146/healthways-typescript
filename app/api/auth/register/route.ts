import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { UserType } from '@prisma/client'
import { registerSchema } from '@/lib/auth/schemas'

/**
 * Maps signup-form user-type strings to Prisma UserType enum values.
 * These IDs match the constants in app/signup/constants.ts (e.g. 'nanny',
 * 'emergency'), which differ from the login-form IDs used in
 * cookieToPrismaUserType (e.g. 'child-care-nurse', 'ambulance').
 */
const signupTypeToPrisma: Record<string, UserType> = {
  'patient':          UserType.PATIENT,
  'doctor':           UserType.DOCTOR,
  'nurse':            UserType.NURSE,
  'nanny':            UserType.NANNY,
  'pharmacist':       UserType.PHARMACIST,
  'lab':              UserType.LAB_TECHNICIAN,
  'emergency':        UserType.EMERGENCY_WORKER,
  'insurance':        UserType.INSURANCE_REP,
  'corporate':        UserType.CORPORATE_ADMIN,
  'referral-partner': UserType.REFERRAL_PARTNER,
  'regional-admin':   UserType.REGIONAL_ADMIN,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const normalizedEmail = data.email.toLowerCase().trim()

    // ── Map form user type to Prisma enum ──────────────────────────────────
    const prismaUserType = signupTypeToPrisma[data.userType]
    if (!prismaUserType) {
      return NextResponse.json(
        { success: false, message: 'Unsupported user type' },
        { status: 400 }
      )
    }

    // ── Check for existing user ────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // ── Hash password ──────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // ── Split full name into first / last ──────────────────────────────────
    const nameParts = data.fullName.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    // ── Determine account status ───────────────────────────────────────────
    // Patients are activated immediately.
    // Professional types with all documents OCR-verified (≥70% confidence) are auto-activated.
    // Corporate and regional-admin always require manual approval.
    const requiresManualApproval = prismaUserType === UserType.CORPORATE_ADMIN || prismaUserType === UserType.REGIONAL_ADMIN
    const allDocsVerified = data.documentVerifications.length > 0 &&
      data.documentVerifications.every(v => v.verified && v.confidence >= 70)

    const accountStatus = prismaUserType === UserType.PATIENT
      ? 'active'
      : (allDocsVerified && !requiresManualApproval)
        ? 'active'
        : 'pending'

    // ── Create User + profile in a single transaction ──────────────────────
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: normalizedEmail,
          password: hashedPassword,
          phone: data.phone,
          userType: prismaUserType,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          address: data.address,
          verified: false,
          accountStatus,
        },
      })

      // ── Create the type-specific profile ─────────────────────────────────
      switch (prismaUserType) {
        case UserType.PATIENT: {
          const patientProfile = await tx.patientProfile.create({
            data: {
              userId: newUser.id,
              nationalId: `PAT-${newUser.id.slice(0, 8).toUpperCase()}`,
              bloodType: 'Unknown',
              allergies: [],
              chronicConditions: [],
            },
          })

          // Create emergency contact if provided
          if (data.emergencyContactName && data.emergencyContactPhone) {
            await tx.patientEmergencyContact.create({
              data: {
                patientId: patientProfile.id,
                name: data.emergencyContactName,
                phone: data.emergencyContactPhone,
                relationship: data.emergencyContactRelation || 'Not specified',
              },
            })
          }
          break
        }

        case UserType.DOCTOR: {
          await tx.doctorProfile.create({
            data: {
              userId: newUser.id,
              category: 'General Practitioner',
              specialty: data.specialization ? [data.specialization] : [],
              subSpecialties: [],
              licenseNumber: data.licenseNumber || `DOC-${newUser.id.slice(0, 8).toUpperCase()}`,
              licenseExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now (placeholder)
              clinicAffiliation: data.institution || 'Not specified',
              hospitalPrivileges: [],
              experience: data.experience || '0 years',
              publications: [],
              awards: [],
              location: data.address,
              languages: [],
              consultationFee: 0,
              videoConsultationFee: 0,
              emergencyConsultationFee: 0,
              consultationTypes: ['video'],
              specialInterests: [],
              bio: '',
            },
          })
          break
        }

        case UserType.NURSE: {
          await tx.nurseProfile.create({
            data: {
              userId: newUser.id,
              licenseNumber: data.licenseNumber || `NRS-${newUser.id.slice(0, 8).toUpperCase()}`,
              experience: data.experience ? parseInt(data.experience, 10) || 0 : 0,
              specializations: data.specialization ? [data.specialization] : [],
            },
          })
          break
        }

        case UserType.NANNY: {
          await tx.nannyProfile.create({
            data: {
              userId: newUser.id,
              experience: data.experience ? parseInt(data.experience, 10) || 0 : 0,
              certifications: [],
            },
          })
          break
        }

        case UserType.PHARMACIST: {
          await tx.pharmacistProfile.create({
            data: {
              userId: newUser.id,
              licenseNumber: data.licenseNumber || `PHR-${newUser.id.slice(0, 8).toUpperCase()}`,
              pharmacyName: data.institution || 'Not specified',
              pharmacyAddress: data.address,
              specializations: data.specialization ? [data.specialization] : [],
            },
          })
          break
        }

        case UserType.LAB_TECHNICIAN: {
          await tx.labTechProfile.create({
            data: {
              userId: newUser.id,
              licenseNumber: data.licenseNumber || `LAB-${newUser.id.slice(0, 8).toUpperCase()}`,
              labName: data.institution || 'Not specified',
              specializations: data.specialization ? [data.specialization] : [],
            },
          })
          break
        }

        case UserType.EMERGENCY_WORKER: {
          await tx.emergencyWorkerProfile.create({
            data: {
              userId: newUser.id,
              certifications: [],
            },
          })
          break
        }

        case UserType.INSURANCE_REP: {
          await tx.insuranceRepProfile.create({
            data: {
              userId: newUser.id,
              companyName: data.companyName || data.institution || 'Not specified',
              licenseNumber: data.licenseNumber || null,
              coverageTypes: [],
            },
          })
          break
        }

        case UserType.CORPORATE_ADMIN: {
          await tx.corporateAdminProfile.create({
            data: {
              userId: newUser.id,
              companyName: data.companyName || 'Not specified',
              registrationNumber: data.companyRegistrationNumber || null,
            },
          })
          break
        }

        case UserType.REFERRAL_PARTNER: {
          await tx.referralPartnerProfile.create({
            data: {
              userId: newUser.id,
              businessType: data.businessType || 'Individual',
              commissionRate: 0,
              referralCode: `REF-${newUser.id.slice(0, 8).toUpperCase()}`,
              totalReferrals: 0,
            },
          })
          break
        }

        case UserType.REGIONAL_ADMIN: {
          await tx.regionalAdminProfile.create({
            data: {
              userId: newUser.id,
              region: data.targetRegion || 'Not specified',
              country: data.targetCountry || 'Not specified',
              countryCode: data.countryCode || null,
            },
          })
          break
        }
      }

      // Create trial wallet
      await tx.userWallet.create({
        data: {
          userId: newUser.id,
          balance: 4500,
          currency: 'MUR',
          initialCredit: 4500,
        },
      })

      return newUser
    })

    // ── Return success ─────────────────────────────────────────────────────
    let message: string
    if (accountStatus === 'active') {
      message = prismaUserType === UserType.PATIENT
        ? 'Registration successful. You can now log in.'
        : 'Registration successful. Your documents were verified — you can log in immediately.'
    } else {
      message = requiresManualApproval
        ? 'Registration submitted. Your account requires administrator approval and will be reviewed within 2-5 business days.'
        : 'Registration submitted. Your account will be verified within 2-5 business days.'
    }

    return NextResponse.json(
      { success: true, userId: user.id, accountStatus, message },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    )
  }
}
