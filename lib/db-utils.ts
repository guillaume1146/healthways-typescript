// lib/db-utils.ts
import prisma from '@/lib/db'

export async function getCompletePatientData(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      medicalRecords: true,
      prescriptions: true,
      vitalSigns: true,
      appointments: true,
      childcareBookings: true,
      videoCallHistory: true,
      billingInformation: true,
      pillReminders: true,
      emergencyContacts: true,
      nutritionAnalyses: true
    }
  })

  if (!patient) return null

  // Separate prescriptions into active and history
  const activePrescriptions = patient.prescriptions.filter((p: { isActive: boolean }) => p.isActive)
  const prescriptionHistory = patient.prescriptions.filter((p: { isActive: boolean }) => !p.isActive)
  
  // Separate appointments into upcoming and past
  const upcomingAppointments = patient.appointments.filter((a: { status: string }) => a.status === 'upcoming')
  const pastAppointments = patient.appointments.filter((a: { status: string }) => 
    a.status === 'completed' || a.status === 'cancelled'
  )

  const { prescriptions, appointments, ...restPatient } = patient

  return {
    ...restPatient,
    activePrescriptions,
    prescriptionHistory,
    upcomingAppointments,
    pastAppointments
  }
}