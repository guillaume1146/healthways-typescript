import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { nannyServiceCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'child-care-nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const nannyProfile = await prisma.nannyProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nannyProfile) {
      return NextResponse.json({ success: false, message: 'Nanny profile not found' }, { status: 404 })
    }

    const services = await prisma.nannyServiceCatalog.findMany({
      where: { nannyId: nannyProfile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Nanny service catalog fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'child-care-nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const nannyProfile = await prisma.nannyProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nannyProfile) {
      return NextResponse.json({ success: false, message: 'Nanny profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = nannyServiceCatalogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const service = await prisma.nannyServiceCatalog.create({
      data: {
        ...parsed.data,
        nannyId: nannyProfile.id,
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Nanny service catalog create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
