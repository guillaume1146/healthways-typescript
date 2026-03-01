import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { heroSlideUpdateSchema } from '@/lib/validations/cms'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'REGIONAL_ADMIN') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = heroSlideUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const slide = await prisma.cmsHeroSlide.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, data: slide })
  } catch (error) {
    console.error('Hero slide update error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth || auth.userType !== 'REGIONAL_ADMIN') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
  }

  try {
    const { id } = await params

    await prisma.cmsHeroSlide.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('Hero slide delete error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
