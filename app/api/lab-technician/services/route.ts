import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { labTestCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.labTechProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
    }

    const services = await prisma.labTestCatalog.findMany({
      where: { labTechId: profile.id },
      orderBy: { createdAt: 'desc' },
    })

    // Map testName → serviceName for ServiceCatalogManager compatibility
    const data = services.map(s => ({
      ...s,
      serviceName: s.testName,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Lab test catalog fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const profile = await prisma.labTechProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
    }

    const body = await request.json()
    // Map serviceName → testName if provided
    const payload = { ...body, testName: body.testName || body.serviceName }
    const parsed = labTestCatalogSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const service = await prisma.labTestCatalog.create({
      data: {
        ...parsed.data,
        labTechId: profile.id,
      },
    })

    return NextResponse.json({ success: true, data: { ...service, serviceName: service.testName } })
  } catch (error) {
    console.error('Lab test catalog create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
