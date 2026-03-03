import prisma from '@/lib/db'

type ProviderType = 'doctor' | 'nurse' | 'nanny' | 'lab-test'

interface ResolvedProvider {
  userId: string
  profileId: string
}

/**
 * Resolves a provider ID (profile or user ID) to both userId and profileId.
 */
async function resolveProvider(providerId: string, providerType: ProviderType): Promise<ResolvedProvider | null> {
  switch (providerType) {
    case 'doctor': {
      const byProfile = await prisma.doctorProfile.findUnique({ where: { id: providerId }, select: { id: true, userId: true } })
      if (byProfile) return { userId: byProfile.userId, profileId: byProfile.id }
      const byUser = await prisma.doctorProfile.findFirst({ where: { userId: providerId }, select: { id: true, userId: true } })
      if (byUser) return { userId: byUser.userId, profileId: byUser.id }
      return null
    }
    case 'nurse': {
      const byProfile = await prisma.nurseProfile.findUnique({ where: { id: providerId }, select: { id: true, userId: true } })
      if (byProfile) return { userId: byProfile.userId, profileId: byProfile.id }
      const byUser = await prisma.nurseProfile.findFirst({ where: { userId: providerId }, select: { id: true, userId: true } })
      if (byUser) return { userId: byUser.userId, profileId: byUser.id }
      return null
    }
    case 'nanny': {
      const byProfile = await prisma.nannyProfile.findUnique({ where: { id: providerId }, select: { id: true, userId: true } })
      if (byProfile) return { userId: byProfile.userId, profileId: byProfile.id }
      const byUser = await prisma.nannyProfile.findFirst({ where: { userId: providerId }, select: { id: true, userId: true } })
      if (byUser) return { userId: byUser.userId, profileId: byUser.id }
      return null
    }
    case 'lab-test': {
      const byProfile = await prisma.labTechProfile.findUnique({ where: { id: providerId }, select: { id: true, userId: true } })
      if (byProfile) return { userId: byProfile.userId, profileId: byProfile.id }
      const byUser = await prisma.labTechProfile.findFirst({ where: { userId: providerId }, select: { id: true, userId: true } })
      if (byUser) return { userId: byUser.userId, profileId: byUser.id }
      return null
    }
  }
}

/**
 * Check if a provider has existing bookings at a given time.
 */
async function hasConflictingBooking(
  profileId: string,
  providerType: ProviderType,
  scheduledAt: Date
): Promise<boolean> {
  // Check for bookings within 1 hour of the requested time
  const slotStart = new Date(scheduledAt)
  const slotEnd = new Date(scheduledAt.getTime() + 60 * 60 * 1000) // +1 hour

  let count = 0
  switch (providerType) {
    case 'doctor':
      count = await prisma.appointment.count({
        where: {
          doctorId: profileId,
          scheduledAt: { gte: slotStart, lt: slotEnd },
          status: { not: 'cancelled' },
        },
      })
      break
    case 'nurse':
      count = await prisma.nurseBooking.count({
        where: {
          nurseId: profileId,
          scheduledAt: { gte: slotStart, lt: slotEnd },
          status: { not: 'cancelled' },
        },
      })
      break
    case 'nanny':
      count = await prisma.childcareBooking.count({
        where: {
          nannyId: profileId,
          scheduledAt: { gte: slotStart, lt: slotEnd },
          status: { not: 'cancelled' },
        },
      })
      break
    case 'lab-test':
      count = await prisma.labTestBooking.count({
        where: {
          labTechId: profileId,
          scheduledAt: { gte: slotStart, lt: slotEnd },
          status: { not: 'cancelled' },
        },
      })
      break
  }

  return count > 0
}

export interface AvailabilityCheckResult {
  available: boolean
  reason?: string
}

/**
 * Validates that a requested booking slot is available by checking:
 * 1. The provider has availability set for that day of the week (ProviderAvailability)
 * 2. The requested time falls within one of the provider's available windows
 * 3. The slot is not already booked
 *
 * @param providerId - Either a profile ID or user ID for the provider
 * @param providerType - Type of provider
 * @param scheduledDate - Date string in YYYY-MM-DD format
 * @param scheduledTime - Time string in HH:MM format (24h)
 * @returns AvailabilityCheckResult indicating whether the slot is available
 */
export async function validateSlotAvailability(
  providerId: string,
  providerType: ProviderType,
  scheduledDate: string,
  scheduledTime: string
): Promise<AvailabilityCheckResult> {
  // Resolve provider to get both userId and profileId
  const provider = await resolveProvider(providerId, providerType)
  if (!provider) {
    return { available: false, reason: 'Provider not found' }
  }

  // Calculate day of week from the date (0=Sunday, 6=Saturday)
  const dayOfWeek = new Date(scheduledDate + 'T00:00:00').getDay()

  // Check provider availability settings for this day
  const availability = await prisma.providerAvailability.findMany({
    where: {
      userId: provider.userId,
      dayOfWeek,
      isActive: true,
    },
    select: { startTime: true, endTime: true },
    orderBy: { startTime: 'asc' },
  })

  // If the provider has availability settings, enforce them.
  // If they have NO availability settings at all (no records for any day),
  // we allow the booking (provider hasn't configured availability yet).
  const totalAvailabilityRecords = await prisma.providerAvailability.count({
    where: { userId: provider.userId },
  })

  if (totalAvailabilityRecords > 0) {
    // Provider has configured availability -- enforce it
    if (availability.length === 0) {
      return {
        available: false,
        reason: 'The provider is not available on this day. Please choose a different date.',
      }
    }

    // Check if the requested time falls within any availability window
    const requestedMinutes = timeToMinutes(scheduledTime)
    const withinWindow = availability.some((slot) => {
      const startMinutes = timeToMinutes(slot.startTime)
      const endMinutes = timeToMinutes(slot.endTime)
      // The slot must start within a window such that the full 1-hour slot fits
      return requestedMinutes >= startMinutes && requestedMinutes + 60 <= endMinutes
    })

    if (!withinWindow) {
      return {
        available: false,
        reason: 'The requested time is outside the provider\'s available hours. Please choose a different time.',
      }
    }
  }

  // Check for conflicting bookings
  const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)
  const hasConflict = await hasConflictingBooking(provider.profileId, providerType, scheduledAt)

  if (hasConflict) {
    return {
      available: false,
      reason: 'This time slot is already booked. Please choose a different time.',
    }
  }

  return { available: true }
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}
