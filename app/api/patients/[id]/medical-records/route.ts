import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { parsePagination } from '@/lib/api-utils'

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
  const type = searchParams.get('type')
  const { limit, offset } = parsePagination(searchParams)

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: id } })
    if (!profile) {
      return NextResponse.json({ message: 'Patient profile not found' }, { status: 404 })
    }

    const where = { patientId: profile.id, ...(type ? { type } : {}) }

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        select: {
          id: true, title: true, date: true, type: true, summary: true,
          diagnosis: true, treatment: true, notes: true, attachments: true,
          doctor: {
            select: {
              id: true,
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.medicalRecord.count({ where }),
    ])

    return NextResponse.json({ success: true, data: records, total, limit, offset })
  } catch (error) {
    console.error('Medical records fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
