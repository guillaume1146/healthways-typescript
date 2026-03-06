import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/nurses/[id]/services
 * Returns all active services offered by a specific nurse.
 * Used in patient booking form after selecting a nurse.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const { id } = await params

    const nurse = await prisma.nurseProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      select: { id: true },
    })

    if (!nurse) {
      return NextResponse.json({ success: false, message: 'Nurse not found' }, { status: 404 })
    }

    const services = await prisma.nurseServiceCatalog.findMany({
      where: {
        nurseId: nurse.id,
        isActive: true,
      },
      orderBy: { serviceName: 'asc' },
    })

    const data = services.map((s) => ({
      id: s.id,
      serviceName: s.serviceName,
      category: s.category,
      description: s.description,
      price: s.price,
      currency: s.currency,
      duration: s.duration,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/nurses/[id]/services error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
