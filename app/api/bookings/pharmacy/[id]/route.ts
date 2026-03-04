import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const updateStatusSchema = z.object({
  status: z.enum(['preparing', 'delivering', 'completed', 'cancelled']),
})

/**
 * PATCH /api/bookings/pharmacy/[id]
 * Update a medicine order's status. Only the pharmacist who owns the medicine can update.
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
    const body = await request.json()
    const parsed = updateStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    // Fetch order and verify pharmacist ownership via order items
    const order = await prisma.medicineOrder.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        items: {
          select: {
            pharmacyMedicine: {
              select: { pharmacist: { select: { userId: true } } },
            },
          },
          take: 1,
        },
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    // Verify the caller is the pharmacist for this order
    const pharmacistUserId = order.items[0]?.pharmacyMedicine?.pharmacist?.userId
    if (pharmacistUserId !== auth.sub) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const { status } = parsed.data

    const updateData: { status: string; deliveredAt?: Date } = { status }
    if (status === 'completed') {
      updateData.deliveredAt = new Date()
    }

    const updated = await prisma.medicineOrder.update({
      where: { id },
      data: updateData,
      select: { id: true, status: true, deliveredAt: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PATCH /api/bookings/pharmacy/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
