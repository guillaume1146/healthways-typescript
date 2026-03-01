import { PrismaClient } from '@prisma/client'

export async function seedAppointments(prisma: PrismaClient) {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 86400000)
  const nextWeek = new Date(now.getTime() + 7 * 86400000)
  const lastWeek = new Date(now.getTime() - 7 * 86400000)
  const lastMonth = new Date(now.getTime() - 30 * 86400000)

  const appointments = [
    // Upcoming
    { id: 'APT001', patientId: 'PPROF001', doctorId: 'DPROF001', scheduledAt: tomorrow, type: 'video', status: 'upcoming', specialty: 'Endocrinology', reason: 'Diabetes follow-up', duration: 30, roomId: 'ROOM-DOC001-PAT001' },
    { id: 'APT002', patientId: 'PPROF002', doctorId: 'DPROF002', scheduledAt: nextWeek, type: 'in-person', status: 'upcoming', specialty: 'General Medicine', reason: 'Asthma review', duration: 20, location: 'Rose Hill Medical Clinic' },
    { id: 'APT003', patientId: 'PPROF004', doctorId: 'DPROF003', scheduledAt: new Date(now.getTime() + 3 * 86400000), type: 'video', status: 'upcoming', specialty: 'Cardiology', reason: 'Cholesterol follow-up', duration: 30, roomId: 'ROOM-DOC003-PAT004' },
    { id: 'APT004', patientId: 'PPROF003', doctorId: 'DPROF002', scheduledAt: new Date(now.getTime() + 5 * 86400000), type: 'in-person', status: 'upcoming', specialty: 'General Medicine', reason: 'Annual checkup', duration: 30, location: 'Rose Hill Medical Clinic' },
    { id: 'APT005', patientId: 'PPROF005', doctorId: 'DPROF001', scheduledAt: new Date(now.getTime() + 10 * 86400000), type: 'video', status: 'upcoming', specialty: 'Endocrinology', reason: 'Thyroid screening', duration: 30, roomId: 'ROOM-DOC001-PAT005' },
    // Past
    { id: 'APT006', patientId: 'PPROF001', doctorId: 'DPROF001', scheduledAt: lastWeek, type: 'video', status: 'completed', specialty: 'Endocrinology', reason: 'HbA1c review', duration: 30 },
    { id: 'APT007', patientId: 'PPROF001', doctorId: 'DPROF003', scheduledAt: lastMonth, type: 'in-person', status: 'completed', specialty: 'Cardiology', reason: 'Cardiac screening', duration: 45, location: 'Cardiac Care Center' },
    { id: 'APT008', patientId: 'PPROF002', doctorId: 'DPROF002', scheduledAt: lastWeek, type: 'in-person', status: 'completed', specialty: 'General Medicine', reason: 'Flu symptoms', duration: 20, location: 'Rose Hill Medical Clinic' },
  ]

  await prisma.appointment.createMany({ data: appointments })

  // Nurse bookings
  const nurseBookings = [
    { patientId: 'PPROF001', nurseId: 'NPROF001', scheduledAt: new Date(now.getTime() + 2 * 86400000), duration: 60, type: 'home_visit', status: 'upcoming', notes: 'Blood pressure monitoring and wound dressing' },
    { patientId: 'PPROF003', nurseId: 'NPROF002', scheduledAt: new Date(now.getTime() + 4 * 86400000), duration: 45, type: 'home_visit', status: 'upcoming', notes: 'Post-surgery wound care' },
  ]
  await prisma.nurseBooking.createMany({ data: nurseBookings })

  // Childcare bookings
  const childcareBookings = [
    { patientId: 'PPROF001', nannyId: 'NAPROF001', scheduledAt: new Date(now.getTime() + 3 * 86400000), duration: 480, type: 'regular', children: ['Emily Johnson', 'James Johnson'], status: 'upcoming', specialInstructions: 'Emily has peanut allergy' },
    { patientId: 'PPROF003', nannyId: 'NAPROF002', scheduledAt: new Date(now.getTime() + 6 * 86400000), duration: 360, type: 'regular', children: ['Sara Khan'], status: 'upcoming' },
  ]
  await prisma.childcareBooking.createMany({ data: childcareBookings })

  console.log(`  Seeded ${appointments.length} appointments, ${nurseBookings.length} nurse bookings, ${childcareBookings.length} childcare bookings`)
}
