import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20', 10)

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
  try {
    const { id } = await params
    const body = await request.json()
    const { notificationIds } = body as { notificationIds?: string[] }

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
