import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { rateLimitPublic } from '@/lib/rate-limit'

// GET /api/posts — Public feed, paginated, filterable by category
export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const category = searchParams.get('category')

  try {
    const where = {
      isPublished: true,
      ...(category ? { category } : {}),
    }

    const [posts, total] = await Promise.all([
      prisma.doctorPost.findMany({
        where,
        select: {
          id: true,
          content: true,
          category: true,
          tags: true,
          likeCount: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              userType: true,
              verified: true,
              doctorProfile: {
                select: {
                  specialty: true,
                  clinicAffiliation: true,
                },
              },
            },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.doctorPost.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        posts,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Posts feed fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// POST /api/posts — Create post (doctors only)
export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    // Verify the user is a verified doctor
    const user = await prisma.user.findUnique({
      where: { id: auth.sub },
      select: { userType: true, verified: true },
    })

    if (!user || user.userType !== 'DOCTOR') {
      return NextResponse.json({ message: 'Only doctors can create posts' }, { status: 403 })
    }

    if (!user.verified) {
      return NextResponse.json({ message: 'Account must be verified to create posts' }, { status: 403 })
    }

    const body = await request.json()
    const { content, category, tags } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 })
    }

    const post = await prisma.doctorPost.create({
      data: {
        authorId: auth.sub,
        content: content.trim(),
        category: category || null,
        tags: Array.isArray(tags) ? tags : [],
      },
      select: {
        id: true,
        content: true,
        category: true,
        tags: true,
        likeCount: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
            verified: true,
            doctorProfile: {
              select: {
                specialty: true,
                clinicAffiliation: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: post }, { status: 201 })
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
