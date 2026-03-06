import prisma from '@/lib/db'

/**
 * Check if the patient has sufficient wallet balance for a booking.
 * Returns { sufficient: true } or { sufficient: false, balance, required }.
 */
export async function checkPatientBalance(
  patientUserId: string,
  requiredAmount: number
): Promise<{ sufficient: boolean; balance?: number; required?: number }> {
  const wallet = await prisma.userWallet.findUnique({
    where: { userId: patientUserId },
    select: { balance: true },
  })

  if (!wallet) {
    return { sufficient: false, balance: 0, required: requiredAmount }
  }

  if (wallet.balance < requiredAmount) {
    return { sufficient: false, balance: wallet.balance, required: requiredAmount }
  }

  return { sufficient: true }
}
