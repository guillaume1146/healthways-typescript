import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { cmsSectionCreateSchema } from '@/lib/validations/cms'

export async function GET(request: NextRequest) {
  try {
    const includeHidden = request.nextUrl.searchParams.get('includeHidden') === 'true'
    const countryCode = request.nextUrl.searchParams.get('countryCode') || null

    const where: { isVisible?: boolean; countryCode?: string | null } = {
      isVisible: true,
      countryCode,
    }

    if (includeHidden) {
      const auth = validateRequest(request)
      if (auth && auth.userType === 'REGIONAL_ADMIN') {
        delete where.isVisible
      }
    }

    const sections = await prisma.cmsSection.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ success: true, data: sections })
  } catch (error) {
    console.error('CMS sections fetch error:', error)
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
    const parsed = cmsSectionCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const section = await prisma.cmsSection.create({
      data: {
        ...parsed.data,
        countryCode: parsed.data.countryCode || null,
        updatedBy: auth.sub,
      },
    })

    return NextResponse.json({ success: true, data: section }, { status: 201 })
  } catch (error) {
    console.error('CMS section create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
