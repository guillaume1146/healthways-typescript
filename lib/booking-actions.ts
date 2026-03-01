import prisma from '@/lib/db'
import { createNotification } from '@/lib/notifications'

type BookingType = 'doctor' | 'nurse' | 'nanny' | 'lab-test' | 'emergency'

interface AcceptResult {
  newBalance?: number
}

export async function acceptBooking(
  bookingId: string,
  bookingType: BookingType,
  providerUserId: string
): Promise<AcceptResult> {
  // Get booking details based on type
  let booking: any
  let patientUserId: string
  let amount = 0
  let description = ''
  let serviceType = ''

  switch (bookingType) {
    case 'doctor': {
      booking = await prisma.appointment.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, doctor: { select: { userId: true, consultationFee: true, videoConsultationFee: true } } },
      })
      if (!booking || booking.doctor.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      amount = booking.type === 'video' ? booking.doctor.videoConsultationFee : booking.doctor.consultationFee
      description = `Doctor consultation - ${booking.type.replace('_', ' ')}`
      serviceType = 'consultation'
      break
    }
    case 'nurse': {
      booking = await prisma.nurseBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, nurse: { select: { userId: true } } },
      })
      if (!booking || booking.nurse.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      const nurseFees: Record<string, number> = { in_person: 500, home_visit: 400, video: 350 }
      amount = nurseFees[booking.type] || 500
      description = `Nurse service - ${booking.type.replace('_', ' ')}`
      serviceType = 'consultation'
      break
    }
    case 'nanny': {
      booking = await prisma.childcareBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, nanny: { select: { userId: true } } },
      })
      if (!booking || booking.nanny.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      const nannyFees: Record<string, number> = { in_person: 400, home_visit: 350, video: 300 }
      amount = nannyFees[booking.type] || 400
      description = `Childcare service - ${booking.type.replace('_', ' ')}`
      serviceType = 'consultation'
      break
    }
    case 'lab-test': {
      booking = await prisma.labTestBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, labTech: { select: { userId: true } } },
      })
      if (!booking || !booking.labTech || booking.labTech.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      amount = booking.price || 500
      description = `Lab test - ${booking.testName}`
      serviceType = 'lab_test'
      break
    }
    case 'emergency': {
      booking = await prisma.emergencyBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } } },
      })
      if (!booking) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      amount = 0 // Free
      description = 'Emergency service'
      serviceType = 'emergency'
      break
    }
  }

  // Transaction: update status + debit wallet (if amount > 0)
  const result = await prisma.$transaction(async (tx) => {
    // Update booking status
    switch (bookingType) {
      case 'doctor':
        await tx.appointment.update({ where: { id: bookingId }, data: { status: 'upcoming' } })
        break
      case 'nurse':
        await tx.nurseBooking.update({ where: { id: bookingId }, data: { status: 'upcoming' } })
        break
      case 'nanny':
        await tx.childcareBooking.update({ where: { id: bookingId }, data: { status: 'upcoming' } })
        break
      case 'lab-test':
        await tx.labTestBooking.update({ where: { id: bookingId }, data: { status: 'upcoming' } })
        break
      case 'emergency':
        await tx.emergencyBooking.update({ where: { id: bookingId }, data: { status: 'dispatched' } })
        break
    }

    // Debit patient wallet if amount > 0
    if (amount > 0) {
      const wallet = await tx.userWallet.findUnique({
        where: { userId: patientUserId },
        select: { id: true, balance: true },
      })
      if (!wallet) throw new Error('WALLET_NOT_FOUND')
      if (wallet.balance < amount) throw new Error('INSUFFICIENT_BALANCE')

      await tx.userWallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance - amount },
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'debit',
          amount,
          description,
          serviceType,
          referenceId: bookingId,
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance - amount,
          status: 'completed',
        },
      })

      return { newBalance: wallet.balance - amount }
    }

    return { newBalance: undefined }
  })

  // Create notification for patient
  await createNotification({
    userId: patientUserId,
    type: 'booking_accepted',
    title: 'Booking Accepted',
    message: `Your ${bookingType === 'lab-test' ? 'lab test' : bookingType} booking has been accepted${amount > 0 ? `. Rs ${amount} has been deducted from your wallet.` : '.'}`,
    referenceId: bookingId,
    referenceType: bookingType,
  })

  return { newBalance: result.newBalance }
}

export async function denyBooking(
  bookingId: string,
  bookingType: BookingType,
  providerUserId: string
): Promise<void> {
  // Find booking and verify ownership (same pattern as accept)
  let patientUserId: string

  switch (bookingType) {
    case 'doctor': {
      const booking = await prisma.appointment.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, doctor: { select: { userId: true } } },
      })
      if (!booking || booking.doctor.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      await prisma.appointment.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
      break
    }
    case 'nurse': {
      const booking = await prisma.nurseBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, nurse: { select: { userId: true } } },
      })
      if (!booking || booking.nurse.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      await prisma.nurseBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
      break
    }
    case 'nanny': {
      const booking = await prisma.childcareBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, nanny: { select: { userId: true } } },
      })
      if (!booking || booking.nanny.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      await prisma.childcareBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
      break
    }
    case 'lab-test': {
      const booking = await prisma.labTestBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, labTech: { select: { userId: true } } },
      })
      if (!booking || !booking.labTech || booking.labTech.userId !== providerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      await prisma.labTestBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
      break
    }
    case 'emergency': {
      const booking = await prisma.emergencyBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } } },
      })
      if (!booking) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending') throw new Error('NOT_PENDING')
      patientUserId = booking.patient.userId
      await prisma.emergencyBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
      break
    }
    default:
      throw new Error('INVALID_TYPE')
  }

  // Create notification for patient
  await createNotification({
    userId: patientUserId,
    type: 'booking_denied',
    title: 'Booking Declined',
    message: `Your ${bookingType === 'lab-test' ? 'lab test' : bookingType} booking has been declined by the provider. No charges were applied.`,
    referenceId: bookingId,
    referenceType: bookingType,
  })

}
