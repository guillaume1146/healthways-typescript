import { PrismaClient } from '@prisma/client'

export async function seedWallets(prisma: PrismaClient) {
  console.log('🏦 Seeding wallets...')

  // Get all users
  const users = await prisma.user.findMany({ select: { id: true } })

  for (const user of users) {
    await prisma.userWallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: 4500,
        currency: 'MUR',
        initialCredit: 4500,
      },
    })
  }

  // Add sample transactions for first patient and first doctor
  // Find them by looking up users
  const patient = await prisma.user.findFirst({
    where: { userType: 'PATIENT' },
    select: { id: true, wallet: { select: { id: true, balance: true } } },
    orderBy: { createdAt: 'asc' }
  })

  const doctor = await prisma.user.findFirst({
    where: { userType: 'DOCTOR' },
    select: { id: true, wallet: { select: { id: true, balance: true } } },
    orderBy: { createdAt: 'asc' }
  })

  if (patient?.wallet) {
    // Create sample debit transactions for patient
    const transactions = [
      { description: 'Video consultation with Dr. Sarah Johnson', serviceType: 'consultation', amount: 1500 },
      { description: 'Paracetamol 500mg x2 boxes', serviceType: 'medicine', amount: 90 },
      { description: 'Complete Blood Count (CBC)', serviceType: 'lab_test', amount: 500 },
      { description: 'Monthly subscription - Premium Care', serviceType: 'subscription', amount: 250 },
    ]

    let balance = 4500
    for (const tx of transactions) {
      const balanceBefore = balance
      balance -= tx.amount
      await prisma.walletTransaction.create({
        data: {
          walletId: patient.wallet.id,
          type: 'debit',
          amount: tx.amount,
          description: tx.description,
          serviceType: tx.serviceType,
          balanceBefore,
          balanceAfter: balance,
          status: 'completed',
        },
      })
    }

    // Update patient wallet balance
    await prisma.userWallet.update({
      where: { id: patient.wallet.id },
      data: { balance },
    })
  }

  if (doctor?.wallet) {
    // Doctor transactions (mostly subscription)
    const txs = [
      { description: 'Professional subscription plan', serviceType: 'subscription', amount: 1999 },
    ]

    let balance = 4500
    for (const tx of txs) {
      const balanceBefore = balance
      balance -= tx.amount
      await prisma.walletTransaction.create({
        data: {
          walletId: doctor.wallet.id,
          type: 'debit',
          amount: tx.amount,
          description: tx.description,
          serviceType: tx.serviceType,
          balanceBefore,
          balanceAfter: balance,
          status: 'completed',
        },
      })
    }

    await prisma.userWallet.update({
      where: { id: doctor.wallet.id },
      data: { balance },
    })
  }

  console.log(`  ✅ Created wallets for ${users.length} users with sample transactions`)
}
