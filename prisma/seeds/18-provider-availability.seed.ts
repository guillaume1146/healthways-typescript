import { PrismaClient, UserType } from '@prisma/client'

const PROVIDER_USER_TYPES: UserType[] = [
  UserType.DOCTOR,
  UserType.NURSE,
  UserType.NANNY,
  UserType.LAB_TECHNICIAN,
]

// Monday–Friday (1–5), 7 one-hour slots per day
const WEEKDAYS = [1, 2, 3, 4, 5]
const TIME_SLOTS = [
  { startTime: '09:00', endTime: '10:00' },
  { startTime: '10:00', endTime: '11:00' },
  { startTime: '11:00', endTime: '12:00' },
  { startTime: '13:00', endTime: '14:00' },
  { startTime: '14:00', endTime: '15:00' },
  { startTime: '15:00', endTime: '16:00' },
  { startTime: '16:00', endTime: '17:00' },
]

export async function seedProviderAvailability(prisma: PrismaClient) {
  // Query all users who are providers (doctor, nurse, nanny, lab technician)
  const providers = await prisma.user.findMany({
    where: {
      userType: { in: PROVIDER_USER_TYPES },
    },
    select: { id: true, userType: true },
  })

  if (providers.length === 0) {
    console.log('  No provider users found — skipping availability seeding')
    return
  }

  // Build availability records for every provider × weekday × time slot
  const records: {
    userId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
  }[] = []

  for (const provider of providers) {
    for (const day of WEEKDAYS) {
      for (const slot of TIME_SLOTS) {
        records.push({
          userId: provider.id,
          dayOfWeek: day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: true,
        })
      }
    }
  }

  const result = await prisma.providerAvailability.createMany({
    data: records,
    skipDuplicates: true,
  })

  console.log(
    `  Seeded ${result.count} provider availability slots for ${providers.length} providers (${WEEKDAYS.length} days x ${TIME_SLOTS.length} slots each)`
  )
}
