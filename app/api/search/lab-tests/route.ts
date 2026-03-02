import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { rateLimitSearch } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitSearch(request)
  if (limited) return limited

  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''

    const tests = await prisma.labTestCatalog.findMany({
      where: {
        isActive: true,
        labTech: {
          user: { accountStatus: 'active' },
        },
      },
      include: {
        labTech: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    let results = tests.map((test) => ({
      id: test.id,
      testName: test.testName,
      category: test.category,
      description: test.description,
      price: test.price,
      currency: test.currency,
      turnaroundTime: test.turnaroundTime,
      sampleType: test.sampleType,
      preparation: test.preparation,
      lab: test.labTech.labName,
      labTechnician: {
        id: test.labTech.user.id,
        name: `${test.labTech.user.firstName} ${test.labTech.user.lastName}`,
        profileImage: test.labTech.user.profileImage,
        verified: test.labTech.user.verified,
      },
    }))

    if (category && category !== 'all') {
      results = results.filter((t) => t.category.toLowerCase().includes(category.toLowerCase()))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter((t) =>
        t.testName.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.lab.toLowerCase().includes(lowerQuery)
      )
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Lab tests search error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
