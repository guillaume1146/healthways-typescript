import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const updateClaimSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().max(500).optional(),
})

/**
 * PATCH /api/insurance/claims/[id]
 * Approve or reject an insurance claim.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const insuranceProfile = await prisma.insuranceRepProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!insuranceProfile) {
      return NextResponse.json({ success: false, message: 'Insurance profile not found' }, { status: 404 })
    }

    // Verify this claim belongs to the authenticated insurance rep
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id },
      select: { id: true, insuranceRepId: true, status: true },
    })

    if (!claim || claim.insuranceRepId !== insuranceProfile.id) {
      return NextResponse.json({ success: false, message: 'Claim not found' }, { status: 404 })
    }

    if (claim.status !== 'pending') {
      return NextResponse.json({ success: false, message: 'Claim has already been resolved' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = updateClaimSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const newStatus = parsed.data.action === 'approve' ? 'approved' : 'rejected'

    const updated = await prisma.insuranceClaim.update({
      where: { id },
      data: {
        status: newStatus,
        resolvedDate: new Date(),
      },
      select: {
        id: true,
        claimId: true,
        status: true,
        resolvedDate: true,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PATCH /api/insurance/claims/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
