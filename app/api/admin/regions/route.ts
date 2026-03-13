import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitAuth } from '@/lib/rate-limit'
import { createRegionSchema } from '@/lib/validations/api'

export async function GET(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  try {
    const auth = validateRequest(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Check if super admin
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    const user = await prisma.user.findUnique({ where: { id: auth.sub }, select: { email: true } })
    if (!user || user.email !== superAdminEmail) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const regions = await prisma.region.findMany({
      select: {
        id: true,
        name: true,
        countryCode: true,
        language: true,
        flag: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, data: regions })
  } catch (error) {
    console.error('GET /api/admin/regions error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  try {
    const auth = validateRequest(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Check if super admin
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
    const user = await prisma.user.findUnique({ where: { id: auth.sub }, select: { email: true } })
    if (!user || user.email !== superAdminEmail) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createRegionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const region = await prisma.region.create({
      data: parsed.data,
      select: {
        id: true,
        name: true,
        countryCode: true,
        language: true,
        flag: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ success: true, data: region }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/regions error:', error)
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ success: false, message: 'A region with that name or country code already exists' }, { status: 409 })
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
