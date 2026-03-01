import prisma from '@/lib/db'

/**
 * Get a summary of patient data for the dashboard.
 * Each section can also be fetched independently via /api/patients/[id]/<resource>.
 *
 * @param patientUserId - The User.id of the patient
 */
export async function getPatientDashboardSummary(patientUserId: string) {
  // Resolve PatientProfile.id from User.id
  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId: patientUserId },
    select: { id: true },
  })

  if (!patientProfile) {
    return { patient: null, upcomingAppointments: [], activePrescriptions: [], latestVitals: null, activeReminders: [] }
  }

  const profileId = patientProfile.id

  const [
    patient,
    upcomingAppointments,
    activePrescriptions,
    latestVitals,
    activeReminders,
  ] = await Promise.all([
    prisma.patientProfile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        healthScore: true,
        user: { select: { firstName: true, lastName: true, profileImage: true } },
      },
    }),
    prisma.appointment.findMany({
      where: { patientId: profileId, status: 'upcoming' },
      select: {
        id: true, scheduledAt: true, specialty: true, type: true, roomId: true,
        doctor: {
          select: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
    }),
    prisma.prescription.findMany({
      where: { patientId: profileId, isActive: true },
      select: { id: true, diagnosis: true, medicines: { select: { medicine: { select: { name: true } }, dosage: true, frequency: true } } },
      take: 5,
    }),
    prisma.vitalSigns.findFirst({
      where: { patientId: profileId },
      orderBy: { recordedAt: 'desc' },
    }),
    prisma.pillReminder.findMany({
      where: { patientId: profileId, isActive: true },
      select: { id: true, medicineName: true, dosage: true, times: true, nextDose: true },
      take: 5,
    }),
  ])

  return { patient, upcomingAppointments, activePrescriptions, latestVitals, activeReminders }
}
