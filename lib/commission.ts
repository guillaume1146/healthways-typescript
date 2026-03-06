import prisma from '@/lib/db'

// Env var fallbacks (used only if DB config not yet created)
const ENV_PLATFORM_RATE = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '5')
const ENV_REGIONAL_RATE = parseFloat(process.env.REGIONAL_COMMISSION_RATE || '10')

interface CommissionRates {
  platformRate: number
  regionalRate: number
  providerRate: number
}

interface CommissionSplit {
  platformCommission: number
  regionalCommission: number
  providerAmount: number
  regionalAdminId: string | null
}

/**
 * Load commission rates from the PlatformConfig table (singleton).
 * Falls back to env vars if no config exists yet.
 */
async function loadRates(): Promise<CommissionRates> {
  const config = await prisma.platformConfig.findFirst()
  if (config) {
    return {
      platformRate: config.platformCommissionRate,
      regionalRate: config.regionalCommissionRate,
      providerRate: config.providerCommissionRate,
    }
  }
  return {
    platformRate: ENV_PLATFORM_RATE,
    regionalRate: ENV_REGIONAL_RATE,
    providerRate: 100 - ENV_PLATFORM_RATE - ENV_REGIONAL_RATE,
  }
}

/**
 * Calculate commission split for a transaction.
 * Rates are loaded from the database (PlatformConfig table).
 * Regional admin's individual commissionRate overrides the default if set.
 */
export async function calculateCommission(
  totalAmount: number,
  providerUserId: string
): Promise<CommissionSplit> {
  const rates = await loadRates()

  // Find the regional admin for this provider's region
  const provider = await prisma.user.findUnique({
    where: { id: providerUserId },
    select: { address: true },
  })

  let regionalAdmin = null

  if (provider?.address) {
    regionalAdmin = await prisma.regionalAdminProfile.findFirst({
      where: {
        user: { accountStatus: 'active' },
        OR: [
          { region: { contains: provider.address, mode: 'insensitive' } },
          { country: { contains: provider.address, mode: 'insensitive' } },
        ],
      },
      select: { id: true, userId: true, commissionRate: true },
    })
  }

  // Fallback: use the first active regional admin
  if (!regionalAdmin) {
    regionalAdmin = await prisma.regionalAdminProfile.findFirst({
      where: { user: { accountStatus: 'active' } },
      select: { id: true, userId: true, commissionRate: true },
    })
  }

  const platformRate = rates.platformRate / 100
  // Regional admin's own rate overrides the platform default
  const regionalRate = regionalAdmin
    ? (regionalAdmin.commissionRate ?? rates.regionalRate) / 100
    : rates.regionalRate / 100

  const platformCommission = Math.round(totalAmount * platformRate * 100) / 100
  const regionalCommission = regionalAdmin
    ? Math.round(totalAmount * regionalRate * 100) / 100
    : 0
  const providerAmount = Math.round((totalAmount - platformCommission - regionalCommission) * 100) / 100

  return {
    platformCommission,
    regionalCommission,
    providerAmount,
    regionalAdminId: regionalAdmin?.userId ?? null,
  }
}

/**
 * Process a service payment: debit patient, credit provider, distribute commissions.
 * Called when a provider confirms a booking.
 */
export async function processServicePayment(params: {
  patientUserId: string
  providerUserId: string
  amount: number
  description: string
  serviceType: string
  referenceId: string
}): Promise<{ success: boolean; error?: string }> {
  const { patientUserId, providerUserId, amount, description, serviceType, referenceId } = params

  const commission = await calculateCommission(amount, providerUserId)

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Debit patient wallet
      const patientWallet = await tx.userWallet.findUnique({
        where: { userId: patientUserId },
        select: { id: true, balance: true },
      })

      if (!patientWallet) throw new Error('WALLET_NOT_FOUND')
      if (patientWallet.balance < amount) throw new Error('INSUFFICIENT_BALANCE')

      const patientBalanceAfter = patientWallet.balance - amount

      await tx.userWallet.update({
        where: { id: patientWallet.id },
        data: { balance: patientBalanceAfter },
      })

      await tx.walletTransaction.create({
        data: {
          walletId: patientWallet.id,
          type: 'debit',
          amount,
          description,
          serviceType,
          referenceId,
          balanceBefore: patientWallet.balance,
          balanceAfter: patientBalanceAfter,
          status: 'completed',
          platformCommission: commission.platformCommission,
          regionalCommission: commission.regionalCommission,
          providerAmount: commission.providerAmount,
          regionalAdminId: commission.regionalAdminId,
        },
      })

      // 2. Credit provider wallet
      const providerWallet = await tx.userWallet.findUnique({
        where: { userId: providerUserId },
        select: { id: true, balance: true },
      })

      if (providerWallet) {
        const providerBalanceAfter = providerWallet.balance + commission.providerAmount

        await tx.userWallet.update({
          where: { id: providerWallet.id },
          data: { balance: providerBalanceAfter },
        })

        await tx.walletTransaction.create({
          data: {
            walletId: providerWallet.id,
            type: 'credit',
            amount: commission.providerAmount,
            description: `Earnings: ${description}`,
            serviceType,
            referenceId,
            balanceBefore: providerWallet.balance,
            balanceAfter: providerBalanceAfter,
            status: 'completed',
            platformCommission: commission.platformCommission,
            regionalCommission: commission.regionalCommission,
            providerAmount: commission.providerAmount,
            regionalAdminId: commission.regionalAdminId,
          },
        })
      }

      // 3. Credit regional admin wallet
      if (commission.regionalAdminId && commission.regionalCommission > 0) {
        const adminWallet = await tx.userWallet.findUnique({
          where: { userId: commission.regionalAdminId },
          select: { id: true, balance: true },
        })

        if (adminWallet) {
          const adminBalanceAfter = adminWallet.balance + commission.regionalCommission

          await tx.userWallet.update({
            where: { id: adminWallet.id },
            data: { balance: adminBalanceAfter },
          })

          await tx.walletTransaction.create({
            data: {
              walletId: adminWallet.id,
              type: 'credit',
              amount: commission.regionalCommission,
              description: `Regional commission: ${description}`,
              serviceType,
              referenceId,
              balanceBefore: adminWallet.balance,
              balanceAfter: adminBalanceAfter,
              status: 'completed',
              platformCommission: commission.platformCommission,
              regionalCommission: commission.regionalCommission,
              providerAmount: commission.providerAmount,
              regionalAdminId: commission.regionalAdminId,
            },
          })
        }

        await tx.regionalAdminProfile.updateMany({
          where: { userId: commission.regionalAdminId },
          data: { totalCommission: { increment: commission.regionalCommission } },
        })
      }
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Transaction failed' }
  }
}
