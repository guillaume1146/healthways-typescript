import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimitAuth } from '@/lib/rate-limit'
import { updateRegionSchema } from '@/lib/validations/api'

type RouteContext = { params: Promise<{ id: string }> }

async function verifySuperAdmin(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) return null

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
  const user = await prisma.user.findUnique({ where: { id: auth.sub }, select: { email: true } })
  if (!user || user.email !== superAdminEmail) return null

  return auth
}

export async function GET(request: NextRequest, context: RouteContext) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  try {
    const auth = await verifySuperAdmin(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const region = await prisma.region.findUnique({
      where: { id },
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

    if (!region) {
      return NextResponse.json({ success: false, message: 'Region not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: region })
  } catch (error) {
    console.error('GET /api/admin/regions/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  try {
    const auth = await verifySuperAdmin(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const body = await request.json()
    const parsed = updateRegionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    // Check region exists
    const existing = await prisma.region.findUnique({ where: { id }, select: { id: true } })
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Region not found' }, { status: 404 })
    }

    const region = await prisma.region.update({
      where: { id },
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

    return NextResponse.json({ success: true, data: region })
  } catch (error) {
    console.error('PUT /api/admin/regions/[id] error:', error)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json({ success: false, message: 'A region with that name or country code already exists' }, { status: 409 })
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  try {
    const auth = await verifySuperAdmin(request)
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    // Check region exists and count assigned users
    const region = await prisma.region.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        _count: { select: { users: true } },
      },
    })

    if (!region) {
      return NextResponse.json({ success: false, message: 'Region not found' }, { status: 404 })
    }

    if (region._count.users > 0) {
      return NextResponse.json(
        { success: false, message: `Cannot delete region "${region.name}" because it has ${region._count.users} assigned user(s)` },
        { status: 409 }
      )
    }

    await prisma.region.delete({ where: { id } })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('DELETE /api/admin/regions/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
