import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/nannies/[id]/services
 * Returns all active services offered by a specific nanny.
 * Used in patient booking form after selecting a nanny.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const { id } = await params

    const nanny = await prisma.nannyProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      select: { id: true },
    })

    if (!nanny) {
      return NextResponse.json({ success: false, message: 'Nanny not found' }, { status: 404 })
    }

    const services = await prisma.nannyServiceCatalog.findMany({
      where: {
        nannyId: nanny.id,
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
      ageRange: s.ageRange,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/nannies/[id]/services error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
