import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

/**
 * GET /api/lab-techs/[id]/tests
 * Returns all active lab tests offered by a specific lab technician.
 * Used in patient booking form after selecting a lab tech.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const { id } = await params

    // id can be either the profile ID or user ID
    const labTech = await prisma.labTechProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      select: { id: true, labName: true },
    })

    if (!labTech) {
      return NextResponse.json({ success: false, message: 'Lab technician not found' }, { status: 404 })
    }

    const tests = await prisma.labTestCatalog.findMany({
      where: {
        labTechId: labTech.id,
        isActive: true,
      },
      orderBy: { testName: 'asc' },
    })

    const data = tests.map((t) => ({
      id: t.id,
      testName: t.testName,
      category: t.category,
      description: t.description,
      price: t.price,
      currency: t.currency,
      turnaroundTime: t.turnaroundTime,
      sampleType: t.sampleType,
      preparation: t.preparation,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET /api/lab-techs/[id]/tests error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
