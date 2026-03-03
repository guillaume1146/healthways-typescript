import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitPublic } from '@/lib/rate-limit'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Valid email is required'),
  message: z.string().min(1, 'Message is required').max(5000),
})

export async function POST(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, message } = parsed.data

    // Store in database using a generic approach
    // Since there's no ContactMessage model, we store as a notification to admins
    const admins = await prisma.user.findMany({
      where: { userType: 'REGIONAL_ADMIN' },
      select: { id: true },
      take: 5,
    })

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: 'system',
          title: `Contact Form: ${name}`,
          message: `From: ${email}\n\n${message}`,
          readAt: null,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
