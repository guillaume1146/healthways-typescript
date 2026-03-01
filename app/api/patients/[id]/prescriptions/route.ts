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
  const active = searchParams.get('active') // 'true' or 'false'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: id } })
    if (!profile) {
      return NextResponse.json({ message: 'Patient profile not found' }, { status: 404 })
    }

    const where = {
      patientId: profile.id,
      ...(active !== null ? { isActive: active === 'true' } : {}),
    }

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        select: {
          id: true, date: true, diagnosis: true, isActive: true, nextRefill: true, notes: true,
          doctor: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
          medicines: {
            select: {
              dosage: true, frequency: true, duration: true, instructions: true,
              medicine: { select: { id: true, name: true, category: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.prescription.count({ where }),
    ])

    return NextResponse.json({ success: true, data: prescriptions, total, limit, offset })
  } catch (error) {
    console.error('Prescriptions fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
