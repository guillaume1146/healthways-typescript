import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { validateRequest } from '@/lib/auth/validate'
import { changePasswordSchema } from '@/lib/validations/api'
import { rateLimitAuth } from '@/lib/rate-limit'
import { successResponse, unauthorizedResponse, forbiddenResponse, errorResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitAuth(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return unauthorizedResponse()

  try {
    const { id } = await params
    if (auth.sub !== id) return forbiddenResponse()

    const body = await request.json()
    const parsed = changePasswordSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message)
    }

    const { currentPassword, newPassword } = parsed.data

    // Fetch the user's current password hash
    const user = await prisma.user.findUnique({
      where: { id },
      select: { password: true },
    })

    if (!user) {
      return notFoundResponse('User not found')
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return errorResponse('Current password is incorrect')
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })

    return successResponse({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('PATCH /api/users/[id]/password error:', error)
    return serverErrorResponse()
  }
}
