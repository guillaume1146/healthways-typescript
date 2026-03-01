import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { labTestCatalogSchema } from '@/lib/validations/catalog'

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const labTechProfile = await prisma.labTechProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!labTechProfile) {
      return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
    }

    const tests = await prisma.labTestCatalog.findMany({
      where: { labTechId: labTechProfile.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: tests })
  } catch (error) {
    console.error('Lab test catalog fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'lab') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const labTechProfile = await prisma.labTechProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!labTechProfile) {
      return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = labTestCatalogSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const test = await prisma.labTestCatalog.create({
      data: {
        ...parsed.data,
        labTechId: labTechProfile.id,
      },
    })

    return NextResponse.json({ success: true, data: test })
  } catch (error) {
    console.error('Lab test catalog create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
