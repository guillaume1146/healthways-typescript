import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { testimonialUpdateSchema } from '@/lib/validations/cms'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth || !['admin', 'regional-admin'].includes(auth.userType)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = testimonialUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const testimonial = await prisma.cmsTestimonial.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('Testimonial update error:', error)
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
  if (!auth || !['admin', 'regional-admin'].includes(auth.userType)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    await prisma.cmsTestimonial.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('Testimonial delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
