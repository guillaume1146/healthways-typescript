import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { labTestCatalogSchema } from '@/lib/validations/catalog'
import { rateLimitPublic } from '@/lib/rate-limit'

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

  try {
    const { id } = await params

    const labTechProfile = await prisma.labTechProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!labTechProfile) {
      return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
    }

    const existingTest = await prisma.labTestCatalog.findUnique({
      where: { id },
      select: { labTechId: true },
    })

    if (!existingTest) {
      return NextResponse.json({ success: false, message: 'Test not found' }, { status: 404 })
    }

    if (existingTest.labTechId !== labTechProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = labTestCatalogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const test = await prisma.labTestCatalog.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: test })
  } catch (error) {
    console.error('Lab test catalog update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    const labTechProfile = await prisma.labTechProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!labTechProfile) {
      return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
    }

    const existingTest = await prisma.labTestCatalog.findUnique({
      where: { id },
      select: { labTechId: true },
    })

    if (!existingTest) {
      return NextResponse.json({ success: false, message: 'Test not found' }, { status: 404 })
    }

    if (existingTest.labTechId !== labTechProfile.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    await prisma.labTestCatalog.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('Lab test catalog delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
