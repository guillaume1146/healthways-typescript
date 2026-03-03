import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'

const billingSchema = z.object({
  type: z.enum(['mcb_juice', 'credit_card']),
  lastFour: z.string().regex(/^\d{4}$/, 'lastFour must be exactly 4 digits'),
  cardHolder: z.string().min(1, 'cardHolder is required'),
  expiryDate: z.string().min(1, 'expiryDate is required'),
  isDefault: z.boolean().optional().default(false),
})

const billingSelect = {
  id: true,
  userId: true,
  type: true,
  lastFour: true,
  cardHolder: true,
  expiryDate: true,
  isDefault: true,
  createdAt: true,
}

export async function GET(
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

  if (auth.sub !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const billingInfo = await prisma.billingInfo.findMany({
      where: { userId: id },
      select: billingSelect,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ success: true, data: billingInfo })
  } catch (error) {
    console.error('GET /api/users/[id]/billing error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
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

  if (auth.sub !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = billingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { type, lastFour, cardHolder, expiryDate, isDefault } = parsed.data

    // If this entry should be the default, unset all other defaults for this user
    if (isDefault) {
      await prisma.billingInfo.updateMany({
        where: { userId: id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const billing = await prisma.billingInfo.create({
      data: {
        userId: id,
        type,
        lastFour,
        cardHolder,
        expiryDate,
        isDefault,
      },
      select: billingSelect,
    })

    return NextResponse.json({ success: true, data: billing }, { status: 201 })
  } catch (error) {
    console.error('POST /api/users/[id]/billing error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

  if (auth.sub !== id) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { billingId } = body as { billingId?: string }

    if (!billingId) {
      return NextResponse.json(
        { success: false, message: 'billingId is required' },
        { status: 400 }
      )
    }

    // Verify the billing entry belongs to this user
    const existing = await prisma.billingInfo.findFirst({
      where: { id: billingId, userId: id },
      select: { id: true },
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Billing info not found' },
        { status: 404 }
      )
    }

    await prisma.billingInfo.delete({
      where: { id: billingId },
    })

    return NextResponse.json({ success: true, data: { id: billingId } })
  } catch (error) {
    console.error('DELETE /api/users/[id]/billing error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
