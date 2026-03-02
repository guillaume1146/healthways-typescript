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
  // Extract needed values from each booking type
  let patientUserId: string
  let amount = 0
  let description = ''
  let serviceType = ''

  switch (bookingType) {
    case 'doctor': {
      const booking = await prisma.appointment.findUnique({
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
      const booking = await prisma.nurseBooking.findUnique({
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
      const booking = await prisma.childcareBooking.findUnique({
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
      const booking = await prisma.labTestBooking.findUnique({
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
      const booking = await prisma.emergencyBooking.findUnique({
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

      // Credit provider wallet
      const providerWallet = await tx.userWallet.findUnique({
        where: { userId: providerUserId },
        select: { id: true, balance: true },
      })
      if (providerWallet) {
        await tx.userWallet.update({
          where: { id: providerWallet.id },
          data: { balance: providerWallet.balance + amount },
        })
        await tx.walletTransaction.create({
          data: {
            walletId: providerWallet.id,
            type: 'credit',
            amount,
            description: `Payment received - ${description}`,
            serviceType,
            referenceId: bookingId,
            balanceBefore: providerWallet.balance,
            balanceAfter: providerWallet.balance + amount,
            status: 'completed',
          },
        })
      }

      return { newBalance: wallet.balance - amount }
    }

    return { newBalance: undefined }
  })

  // Auto-create conversation between provider and patient
  try {
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        type: 'direct',
        AND: [
          { participants: { some: { userId: providerUserId } } },
          { participants: { some: { userId: patientUserId } } },
        ],
      },
    })
    if (!existingConversation) {
      await prisma.conversation.create({
        data: {
          type: 'direct',
          participants: {
            create: [
              { userId: providerUserId },
              { userId: patientUserId },
            ],
          },
        },
      })
    }
  } catch (err) {
    console.error('Failed to auto-create conversation:', err)
  }

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

interface CancelResult {
  refundAmount?: number
  newBalance?: number
}

// Cancellation policy: full refund if >24h before, 50% if 2-24h, no refund if <2h
function getRefundPercentage(scheduledAt: Date): number {
  const hoursUntil = (scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60)
  if (hoursUntil > 24) return 100
  if (hoursUntil > 2) return 50
  return 0
}

export async function cancelBooking(
  bookingId: string,
  bookingType: BookingType,
  callerUserId: string,
  reason?: string
): Promise<CancelResult> {
  let patientUserId: string
  let providerUserId: string | null = null
  let scheduledAt: Date
  let status: string
  let bookingAmount = 0

  // Look up booking and determine if caller is patient or provider
  switch (bookingType) {
    case 'doctor': {
      const booking = await prisma.appointment.findUnique({
        where: { id: bookingId },
        include: {
          patient: { select: { userId: true } },
          doctor: { select: { userId: true, consultationFee: true, videoConsultationFee: true } },
        },
      })
      if (!booking) throw new Error('NOT_FOUND')
      if (booking.patient.userId !== callerUserId && booking.doctor.userId !== callerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending' && booking.status !== 'upcoming') throw new Error('NOT_CANCELLABLE')
      patientUserId = booking.patient.userId
      providerUserId = booking.doctor.userId
      scheduledAt = booking.scheduledAt
      status = booking.status
      bookingAmount = booking.type === 'video' ? booking.doctor.videoConsultationFee : booking.doctor.consultationFee
      break
    }
    case 'nurse': {
      const booking = await prisma.nurseBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, nurse: { select: { userId: true } } },
      })
      if (!booking) throw new Error('NOT_FOUND')
      if (booking.patient.userId !== callerUserId && booking.nurse.userId !== callerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending' && booking.status !== 'upcoming') throw new Error('NOT_CANCELLABLE')
      patientUserId = booking.patient.userId
      providerUserId = booking.nurse.userId
      scheduledAt = booking.scheduledAt
      status = booking.status
      const nurseFees: Record<string, number> = { in_person: 500, home_visit: 400, video: 350 }
      bookingAmount = nurseFees[booking.type] || 500
      break
    }
    case 'nanny': {
      const booking = await prisma.childcareBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, nanny: { select: { userId: true } } },
      })
      if (!booking) throw new Error('NOT_FOUND')
      if (booking.patient.userId !== callerUserId && booking.nanny.userId !== callerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending' && booking.status !== 'upcoming') throw new Error('NOT_CANCELLABLE')
      patientUserId = booking.patient.userId
      providerUserId = booking.nanny.userId
      scheduledAt = booking.scheduledAt
      status = booking.status
      const nannyFees: Record<string, number> = { in_person: 400, home_visit: 350, video: 300 }
      bookingAmount = nannyFees[booking.type] || 400
      break
    }
    case 'lab-test': {
      const booking = await prisma.labTestBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } }, labTech: { select: { userId: true } } },
      })
      if (!booking) throw new Error('NOT_FOUND')
      const labTechUserId = booking.labTech?.userId
      if (booking.patient.userId !== callerUserId && labTechUserId !== callerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending' && booking.status !== 'upcoming') throw new Error('NOT_CANCELLABLE')
      patientUserId = booking.patient.userId
      providerUserId = labTechUserId || null
      scheduledAt = booking.scheduledAt
      status = booking.status
      bookingAmount = booking.price || 500
      break
    }
    case 'emergency': {
      const booking = await prisma.emergencyBooking.findUnique({
        where: { id: bookingId },
        include: { patient: { select: { userId: true } } },
      })
      if (!booking) throw new Error('NOT_FOUND')
      if (booking.patient.userId !== callerUserId) throw new Error('NOT_FOUND')
      if (booking.status !== 'pending' && booking.status !== 'dispatched') throw new Error('NOT_CANCELLABLE')
      patientUserId = booking.patient.userId
      scheduledAt = booking.createdAt
      status = booking.status
      bookingAmount = 0
      break
    }
  }

  // Pending bookings had no payment — just cancel
  // Upcoming bookings may need refund based on policy
  const needsRefund = status === 'upcoming' && bookingAmount > 0
  const refundPercentage = needsRefund ? getRefundPercentage(scheduledAt) : 0
  const refundAmount = Math.round(bookingAmount * refundPercentage / 100)

  const result = await prisma.$transaction(async (tx) => {
    // Update booking status
    switch (bookingType) {
      case 'doctor':
        await tx.appointment.update({ where: { id: bookingId }, data: { status: 'cancelled', notes: reason || null } })
        break
      case 'nurse':
        await tx.nurseBooking.update({ where: { id: bookingId }, data: { status: 'cancelled', notes: reason || null } })
        break
      case 'nanny':
        await tx.childcareBooking.update({ where: { id: bookingId }, data: { status: 'cancelled' } })
        break
      case 'lab-test':
        await tx.labTestBooking.update({ where: { id: bookingId }, data: { status: 'cancelled', notes: reason || null } })
        break
      case 'emergency':
        await tx.emergencyBooking.update({ where: { id: bookingId }, data: { status: 'cancelled', notes: reason || null } })
        break
    }

    // Process refund if booking was already paid
    if (needsRefund && refundAmount > 0) {
      // Refund patient wallet
      const patientWallet = await tx.userWallet.findUnique({
        where: { userId: patientUserId },
        select: { id: true, balance: true },
      })
      if (patientWallet) {
        await tx.userWallet.update({
          where: { id: patientWallet.id },
          data: { balance: patientWallet.balance + refundAmount },
        })
        await tx.walletTransaction.create({
          data: {
            walletId: patientWallet.id,
            type: 'credit',
            amount: refundAmount,
            description: `Cancellation refund (${refundPercentage}%) - ${bookingType}`,
            serviceType: 'refund',
            referenceId: bookingId,
            balanceBefore: patientWallet.balance,
            balanceAfter: patientWallet.balance + refundAmount,
            status: 'completed',
          },
        })

        // Debit provider wallet
        if (providerUserId) {
          const providerWallet = await tx.userWallet.findUnique({
            where: { userId: providerUserId },
            select: { id: true, balance: true },
          })
          if (providerWallet && providerWallet.balance >= refundAmount) {
            await tx.userWallet.update({
              where: { id: providerWallet.id },
              data: { balance: providerWallet.balance - refundAmount },
            })
            await tx.walletTransaction.create({
              data: {
                walletId: providerWallet.id,
                type: 'debit',
                amount: refundAmount,
                description: `Cancellation refund deducted - ${bookingType}`,
                serviceType: 'refund',
                referenceId: bookingId,
                balanceBefore: providerWallet.balance,
                balanceAfter: providerWallet.balance - refundAmount,
                status: 'completed',
              },
            })
          }
        }

        return { refundAmount, newBalance: patientWallet.balance + refundAmount }
      }
    }

    return { refundAmount: 0 }
  })

  // Notify the other party
  const isPatientCancelling = callerUserId === patientUserId
  const notifyUserId = isPatientCancelling ? providerUserId : patientUserId
  const cancellerRole = isPatientCancelling ? 'patient' : 'provider'

  if (notifyUserId) {
    await createNotification({
      userId: notifyUserId,
      type: 'booking_cancelled',
      title: 'Booking Cancelled',
      message: `A ${bookingType === 'lab-test' ? 'lab test' : bookingType} booking has been cancelled by the ${cancellerRole}.${result.refundAmount ? ` Rs ${result.refundAmount} has been refunded.` : ''}${reason ? ` Reason: ${reason}` : ''}`,
      referenceId: bookingId,
      referenceType: bookingType,
    })
  }

  return { refundAmount: result.refundAmount, newBalance: result.newBalance }
}
