import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Find the lab tech profile
  const labTechProfile = await prisma.labTechProfile.findFirst({
    where: { userId: id },
    select: { id: true },
  })

  if (!labTechProfile) {
    return NextResponse.json({ success: false, message: 'Lab tech profile not found' }, { status: 404 })
  }

  const bookings = await prisma.labTestBooking.findMany({
    where: { labTechId: labTechProfile.id, status: 'pending' },
    include: {
      patient: {
        select: {
          id: true,
          userId: true,
          user: { select: { firstName: true, lastName: true, email: true, phone: true, profileImage: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, data: bookings })
}
