import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { parsePagination } from '@/lib/api-utils'
import { markNotificationsReadSchema } from '@/lib/validations/api'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    if (auth.sub !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const { limit } = parsePagination(searchParams)

    const where: Record<string, unknown> = { userId: id }
    if (unreadOnly) {
      where.readAt = null
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({ where }),
    ])

    return NextResponse.json({
      data: notifications,
      meta: { total, unreadCount: unreadOnly ? total : undefined },
    })
  } catch (error) {
    console.error('GET /api/users/[id]/notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    if (auth.sub !== id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const body = await request.json()
    const parsed = markNotificationsReadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }
    const { notificationIds } = parsed.data

    if (notificationIds && notificationIds.length > 0) {
      await prisma.notification.updateMany({
        where: { id: { in: notificationIds }, userId: id },
        data: { readAt: new Date() },
      })
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId: id, readAt: null },
        data: { readAt: new Date() },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH /api/users/[id]/notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
