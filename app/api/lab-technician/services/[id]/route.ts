import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { labTestCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

async function getLabTechProfileId(userId: string) {
  const profile = await prisma.labTechProfile.findUnique({
    where: { userId },
    select: { id: true },
  })
  return profile?.id
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const profileId = await getLabTechProfileId(auth.sub)
  if (!profileId) {
    return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 })
  }

  const service = await prisma.labTestCatalog.findFirst({
    where: { id, labTechId: profileId },
  })

  if (!service) {
    return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: { ...service, serviceName: service.testName } })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const profileId = await getLabTechProfileId(auth.sub)
  if (!profileId) {
    return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 })
  }

  const existing = await prisma.labTestCatalog.findFirst({
    where: { id, labTechId: profileId },
  })
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const payload = { ...body, testName: body.testName || body.serviceName }
    const parsed = labTestCatalogSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const updated = await prisma.labTestCatalog.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: { ...updated, serviceName: updated.testName } })
  } catch (error) {
    console.error('Lab test catalog update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const profileId = await getLabTechProfileId(auth.sub)
  if (!profileId) {
    return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 })
  }

  const existing = await prisma.labTestCatalog.findFirst({
    where: { id, labTechId: profileId },
  })
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 })
  }

  await prisma.labTestCatalog.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
