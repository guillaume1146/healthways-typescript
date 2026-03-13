import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const regions = await prisma.region.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        countryCode: true,
        language: true,
        flag: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, data: regions })
  } catch (error) {
    console.error('GET /api/regions error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
