import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth/validate'
import prisma from '@/lib/db'
import { rateLimitPublic } from '@/lib/rate-limit'

// GET /api/posts/[id]/comments — Paginated comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

  try {
    // Verify post exists
    const post = await prisma.doctorPost.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    const where = { postId: id }

    const [comments, total] = await Promise.all([
      prisma.postComment.findMany({
        where,
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              userType: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.postComment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        comments,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Comments fetch error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// POST /api/posts/[id]/comments — Add comment (any authenticated user)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  const auth = validateRequest(request)
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    // Verify post exists
    const post = await prisma.doctorPost.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 })
    }

    const comment = await prisma.postComment.create({
      data: {
        postId: id,
        authorId: auth.sub,
        content: content.trim(),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            userType: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
