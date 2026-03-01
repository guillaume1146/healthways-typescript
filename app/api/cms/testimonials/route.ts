import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { testimonialCreateSchema } from '@/lib/validations/cms'

export async function GET(request: NextRequest) {
  try {
    const includeInactive = request.nextUrl.searchParams.get('includeInactive') === 'true'
    const countryCode = request.nextUrl.searchParams.get('countryCode') || null

    const where: { isActive?: boolean; countryCode?: string | null } = {
      isActive: true,
      countryCode,
    }

    if (includeInactive) {
      const auth = validateRequest(request)
      if (auth && auth.userType === 'REGIONAL_ADMIN') {
        delete where.isActive
      }
    }

    const testimonials = await prisma.cmsTestimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Testimonials fetch error:', error)
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
    const parsed = testimonialCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const testimonial = await prisma.cmsTestimonial.create({
      data: {
        ...parsed.data,
        countryCode: parsed.data.countryCode || null,
      },
    })

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (error) {
    console.error('Testimonial create error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
