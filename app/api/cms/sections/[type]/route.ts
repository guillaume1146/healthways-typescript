import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { cmsSectionUpdateSchema } from '@/lib/validations/cms'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params
    const countryCode = request.nextUrl.searchParams.get('countryCode') || null

    const section = await prisma.cmsSection.findFirst({
      where: { sectionType: type, countryCode },
    })

    if (!section) {
      return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    console.error('CMS section fetch error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'REGIONAL_ADMIN') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { type } = await params
    const countryCode = request.nextUrl.searchParams.get('countryCode') || null
    const body = await request.json()
    const parsed = cmsSectionUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const existing = await prisma.cmsSection.findFirst({
      where: { sectionType: type, countryCode },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 })
    }

    const section = await prisma.cmsSection.update({
      where: { id: existing.id },
      data: {
        ...parsed.data,
        updatedBy: auth.sub,
      },
    })

    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    console.error('CMS section update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'REGIONAL_ADMIN') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { type } = await params
    const countryCode = request.nextUrl.searchParams.get('countryCode') || null
    const hard = request.nextUrl.searchParams.get('hard') === 'true'

    const existing = await prisma.cmsSection.findFirst({
      where: { sectionType: type, countryCode },
    })

    if (!existing) {
      return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 })
    }

    if (hard) {
      await prisma.cmsSection.delete({
        where: { id: existing.id },
      })
    } else {
      await prisma.cmsSection.update({
        where: { id: existing.id },
        data: { isVisible: false, updatedBy: auth.sub },
      })
    }

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('CMS section delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
