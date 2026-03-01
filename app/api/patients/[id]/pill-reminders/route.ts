import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (auth.userType === 'patient' && auth.sub !== id) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const active = searchParams.get('active')

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: id } })
    if (!profile) {
      return NextResponse.json({ message: 'Patient profile not found' }, { status: 404 })
    }

    const reminders = await prisma.pillReminder.findMany({
      where: { patientId: profile.id, ...(active !== null ? { isActive: active === 'true' } : {}) },
      include: {
        prescription: {
          select: {
            id: true, diagnosis: true,
            doctor: {
              select: {
                id: true,
                user: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
      orderBy: { nextDose: 'asc' },
    })

    return NextResponse.json({ success: true, data: reminders })
  } catch (error) {
    console.error('Pill reminders fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
