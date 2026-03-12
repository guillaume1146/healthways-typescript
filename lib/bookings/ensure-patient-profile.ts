import prisma from '@/lib/db'
import { randomUUID } from 'crypto'

/**
 * Ensures the user has a PatientProfile for booking purposes.
 * All user types (pharmacist, nurse, doctor, etc.) can book healthcare services
 * as patients. If they don't have a PatientProfile yet, one is auto-created.
 */
export async function ensurePatientProfile(userId: string): Promise<{ id: string }> {
  // Try to find existing profile
  const existing = await prisma.patientProfile.findUnique({
    where: { userId },
    select: { id: true },
  })

  if (existing) return existing

  // Auto-create a PatientProfile for non-patient users making bookings
  // Use a unique placeholder nationalId since it's required
  const profile = await prisma.patientProfile.create({
    data: {
      userId,
      nationalId: `AUTO-${randomUUID().slice(0, 12).toUpperCase()}`,
      bloodType: 'Unknown',
      allergies: [],
      chronicConditions: [],
      healthScore: 50,
    },
    select: { id: true },
  })

  return profile
}
