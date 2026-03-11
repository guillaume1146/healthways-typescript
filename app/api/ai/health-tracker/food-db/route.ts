import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * GET /api/ai/health-tracker/food-db?q=chicken&category=Protein - Search food database
 */
export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')

    if (!query && !category) {
      return NextResponse.json(
        { success: false, message: 'q or category query parameter is required' },
        { status: 400 }
      )
    }

    const where: Record<string, unknown> = {}

    if (query && query.trim().length > 0) {
      where.name = { contains: query.trim(), mode: 'insensitive' }
    }

    if (category) {
      where.category = category
    }

    const results = await prisma.foodDatabase.findMany({
      where,
      take: 50,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('GET /api/ai/health-tracker/food-db error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
