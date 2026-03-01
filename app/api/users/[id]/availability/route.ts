import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (auth.sub !== id) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const dayOfWeekParam = searchParams.get('dayOfWeek')

    const where: { userId: string; dayOfWeek?: number } = { userId: id }
    if (dayOfWeekParam !== null) {
      const dayOfWeek = parseInt(dayOfWeekParam, 10)
      if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
        return NextResponse.json({ success: false, error: 'dayOfWeek must be 0-6' }, { status: 400 })
      }
      where.dayOfWeek = dayOfWeek
    }

    const slots = await prisma.providerAvailability.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      select: {
        id: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: slots })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (auth.sub !== id) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { slots } = body as {
      slots: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }>
    }

    if (!Array.isArray(slots)) {
      return NextResponse.json({ success: false, error: 'slots must be an array' }, { status: 400 })
    }

    // Validate each slot
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    for (const slot of slots) {
      if (typeof slot.dayOfWeek !== 'number' || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        return NextResponse.json(
          { success: false, error: `Invalid dayOfWeek: ${slot.dayOfWeek}. Must be 0-6.` },
          { status: 400 }
        )
      }
      if (!timeRegex.test(slot.startTime)) {
        return NextResponse.json(
          { success: false, error: `Invalid startTime format: ${slot.startTime}. Use HH:MM (24h).` },
          { status: 400 }
        )
      }
      if (!timeRegex.test(slot.endTime)) {
        return NextResponse.json(
          { success: false, error: `Invalid endTime format: ${slot.endTime}. Use HH:MM (24h).` },
          { status: 400 }
        )
      }
      if (slot.startTime >= slot.endTime) {
        return NextResponse.json(
          { success: false, error: `startTime (${slot.startTime}) must be before endTime (${slot.endTime}).` },
          { status: 400 }
        )
      }
    }

    // Transaction: delete all existing, create all new
    const newSlots = await prisma.$transaction(async (tx) => {
      await tx.providerAvailability.deleteMany({ where: { userId: id } })

      if (slots.length === 0) return []

      await tx.providerAvailability.createMany({
        data: slots.map((slot) => ({
          userId: id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: slot.isActive ?? true,
        })),
      })

      return tx.providerAvailability.findMany({
        where: { userId: id },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    })

    return NextResponse.json({ success: true, data: newSlots })
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ success: false, error: 'Failed to update availability' }, { status: 500 })
  }
}
