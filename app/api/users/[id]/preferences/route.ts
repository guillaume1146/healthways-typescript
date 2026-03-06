import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'
import { z } from 'zod'

const updatePreferencesSchema = z.object({
  language: z.enum(['en', 'fr', 'mfe']).optional(),
  timezone: z.string().min(1).max(100).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  appointmentReminders: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  profileVisibility: z.enum(['public', 'connections', 'private']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (auth.sub !== id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: id },
    })

    if (!preferences) {
      // Return defaults
      return NextResponse.json({
        success: true,
        data: {
          language: 'en',
          timezone: 'Indian/Mauritius',
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          appointmentReminders: true,
          marketingEmails: false,
          profileVisibility: 'public',
        },
      })
    }

    return NextResponse.json({ success: true, data: preferences })
  } catch (error) {
    console.error('GET /api/users/[id]/preferences error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  if (auth.sub !== id) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

  try {
    const body = await request.json()
    const parsed = updatePreferencesSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
    }

    const preferences = await prisma.userPreference.upsert({
      where: { userId: id },
      update: parsed.data,
      create: { userId: id, ...parsed.data },
    })

    return NextResponse.json({ success: true, data: preferences })
  } catch (error) {
    console.error('PUT /api/users/[id]/preferences error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
