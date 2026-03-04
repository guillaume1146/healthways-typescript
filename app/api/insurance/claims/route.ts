import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const createClaimSchema = z.object({
  patientId: z.string().uuid(),
  planId: z.string().uuid().optional(),
  policyHolderName: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  policyType: z.string().min(1).max(100),
  claimAmount: z.number().positive(),
})

/**
 * GET /api/insurance/claims
 * List claims for the authenticated insurance rep.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const insuranceProfile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!insuranceProfile) {
      return NextResponse.json({ success: false, message: 'Insurance profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))

    const where: Record<string, unknown> = { insuranceRepId: insuranceProfile.id }
    if (status) where.status = status

    const [claims, total] = await Promise.all([
      prisma.insuranceClaim.findMany({
        where,
        select: {
          id: true,
          claimId: true,
          policyHolderName: true,
          description: true,
          policyType: true,
          claimAmount: true,
          status: true,
          submittedDate: true,
          resolvedDate: true,
          patient: {
            select: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
          plan: { select: { planName: true, planType: true } },
        },
        orderBy: { submittedDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.insuranceClaim.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: claims,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/insurance/claims error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/insurance/claims
 * Create a new insurance claim.
 */
export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const insuranceProfile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!insuranceProfile) {
      return NextResponse.json({ success: false, message: 'Insurance profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = createClaimSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const claim = await prisma.insuranceClaim.create({
      data: {
        insuranceRepId: insuranceProfile.id,
        patientId: parsed.data.patientId,
        planId: parsed.data.planId ?? null,
        policyHolderName: parsed.data.policyHolderName,
        description: parsed.data.description,
        policyType: parsed.data.policyType,
        claimAmount: parsed.data.claimAmount,
      },
      select: {
        id: true,
        claimId: true,
        policyHolderName: true,
        status: true,
        claimAmount: true,
        submittedDate: true,
      },
    })

    return NextResponse.json({ success: true, data: claim }, { status: 201 })
  } catch (error) {
    console.error('POST /api/insurance/claims error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
