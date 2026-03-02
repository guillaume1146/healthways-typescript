import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { heroSlideCreateSchema } from '@/lib/validations/cms'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const includeInactive = request.nextUrl.searchParams.get('includeInactive') === 'true'
    const countryCode = request.nextUrl.searchParams.get('countryCode') || null

    const where: { isActive?: boolean; countryCode?: string | null } = {
      isActive: true,
      countryCode,
    }

    if (includeInactive) {
      const auth = validateRequest(request)
      if (auth && auth.userType === 'REGIONAL_ADMIN') {
        delete where.isActive
      }
    }

    const slides = await prisma.cmsHeroSlide.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: slides })
  } catch (error) {
    console.error('Hero slides fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'REGIONAL_ADMIN') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = heroSlideCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { sortOrder: parsedSortOrder, countryCode, ...rest } = parsed.data
    let sortOrder = parsedSortOrder

    if (sortOrder === undefined) {
      const maxOrder = await prisma.cmsHeroSlide.aggregate({ _max: { sortOrder: true } })
      sortOrder = (maxOrder._max.sortOrder ?? 0) + 1
    }

    const slide = await prisma.cmsHeroSlide.create({
      data: {
        ...rest,
        sortOrder,
        countryCode: countryCode || null,
      },
    })

    return NextResponse.json({ success: true, data: slide }, { status: 201 })
  } catch (error) {
    console.error('Hero slide create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
