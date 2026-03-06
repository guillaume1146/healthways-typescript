import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitAuth } from '@/lib/rate-limit'
import { z } from 'zod'

const updateSchema = z.object({
  platformCommissionRate: z.number().min(0).max(100),
  regionalCommissionRate: z.number().min(0).max(100),
  providerCommissionRate: z.number().min(0).max(100),
  currency: z.string().min(1).max(10).optional(),
  trialWalletAmount: z.number().min(0).optional(),
}).refine(
  (data) => {
    const sum = data.platformCommissionRate + data.regionalCommissionRate + data.providerCommissionRate
    return Math.abs(sum - 100) < 0.01
  },
  { message: 'Commission rates must sum to 100%' }
)

/** Get or create the singleton platform config */
async function getOrCreateConfig() {
  let config = await prisma.platformConfig.findFirst()
  if (!config) {
    config = await prisma.platformConfig.create({
      data: {
        platformCommissionRate: 5,
        regionalCommissionRate: 10,
        providerCommissionRate: 85,
      },
    })
  }
  return config
}

export async function GET(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const config = await getOrCreateConfig()
    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('GET /api/admin/commission-config error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  // Only super admin can update commission config
  const user = await prisma.user.findUnique({
    where: { id: auth.sub },
    select: { email: true },
  })

  if (user?.email !== process.env.SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ success: false, message: 'Only the super admin can modify commission rates' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const existing = await getOrCreateConfig()

    const config = await prisma.platformConfig.update({
      where: { id: existing.id },
      data: {
        platformCommissionRate: parsed.data.platformCommissionRate,
        regionalCommissionRate: parsed.data.regionalCommissionRate,
        providerCommissionRate: parsed.data.providerCommissionRate,
        currency: parsed.data.currency,
        trialWalletAmount: parsed.data.trialWalletAmount,
      },
    })

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('PUT /api/admin/commission-config error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
