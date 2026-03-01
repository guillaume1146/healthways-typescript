import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { signToken } from '@/lib/auth/jwt'
import { setAuthCookies } from '@/lib/auth/cookies'
import { loginSchema } from '@/lib/auth/schemas'
import { cookieToPrismaUserType, prismaUserTypeToCookie } from '@/lib/auth/user-type-map'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password, userType } = parsed.data
    const normalizedEmail = email.toLowerCase()

    // Map the cookie/form user type string to the Prisma enum
    const prismaUserType = cookieToPrismaUserType[userType]
    if (!prismaUserType) {
      return NextResponse.json(
        { success: false, message: 'User type not supported' },
        { status: 400 }
      )
    }

    // Single query against the unified User table
    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        profileImage: true,
        userType: true,
        accountStatus: true,
      },
    })

    if (!dbUser || !(await bcrypt.compare(password, dbUser.password))) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Enforce account status
    if (dbUser.accountStatus === 'pending') {
      return NextResponse.json(
        { success: false, message: 'Your account is pending approval. Please wait for admin verification.' },
        { status: 403 }
      )
    }
    if (dbUser.accountStatus === 'suspended') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended. Please contact support.' },
        { status: 403 }
      )
    }

    // Verify the user's stored type matches what was submitted on the form
    if (dbUser.userType !== prismaUserType) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Convert back to the cookie-friendly string for the JWT and response
    const cookieUserType = prismaUserTypeToCookie[dbUser.userType]

    // Generate JWT
    const token = signToken({ sub: dbUser.id, userType: cookieUserType, email: dbUser.email })

    // Build response with httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        profileImage: dbUser.profileImage,
        userType: cookieUserType,
      },
      message: 'Login successful',
    })

    setAuthCookies(response, token, cookieUserType, dbUser.id)
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
