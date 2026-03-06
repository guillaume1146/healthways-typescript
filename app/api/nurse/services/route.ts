import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { nurseServiceCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const nurseProfile = await prisma.nurseProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nurseProfile) {
      return NextResponse.json({ success: false, message: 'Nurse profile not found' }, { status: 404 })
    }

    const services = await prisma.nurseServiceCatalog.findMany({
      where: { nurseId: nurseProfile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    console.error('Nurse service catalog fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'nurse') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const nurseProfile = await prisma.nurseProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!nurseProfile) {
      return NextResponse.json({ success: false, message: 'Nurse profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = nurseServiceCatalogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const service = await prisma.nurseServiceCatalog.create({
      data: {
        ...parsed.data,
        nurseId: nurseProfile.id,
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Nurse service catalog create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
