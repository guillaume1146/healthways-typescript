import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import { rateLimit } from '@/lib/rate-limit'
import prisma from '@/lib/db'

/**
 * DELETE /api/ai/health-tracker/water/[id] - Delete a water entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimit(request, { limit: 30, windowMs: 60_000, prefix: 'health-tracker' })
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const entry = await prisma.waterEntry.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!entry) {
      return NextResponse.json({ success: false, message: 'Water entry not found' }, { status: 404 })
    }

    if (entry.userId !== auth.sub) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    await prisma.waterEntry.delete({ where: { id } })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('DELETE /api/ai/health-tracker/water/[id] error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
