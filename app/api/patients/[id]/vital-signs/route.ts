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
  const latest = searchParams.get('latest') === 'true'
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    const profile = await prisma.patientProfile.findUnique({ where: { userId: id } })
    if (!profile) {
      return NextResponse.json({ message: 'Patient profile not found' }, { status: 404 })
    }

    const vitals = await prisma.vitalSigns.findMany({
      where: { patientId: profile.id },
      orderBy: { recordedAt: 'desc' },
      take: latest ? 1 : limit,
    })

    return NextResponse.json({ success: true, data: latest ? vitals[0] || null : vitals })
  } catch (error) {
    console.error('Vital signs fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
