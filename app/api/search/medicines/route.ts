import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''

    const medicines = await prisma.pharmacyMedicine.findMany({
      where: {
        isActive: true,
        pharmacist: {
          user: { accountStatus: 'active' },
        },
      },
      include: {
        pharmacist: {
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

    let results = medicines.map((med) => ({
      id: med.id,
      name: med.name,
      genericName: med.genericName,
      category: med.category,
      description: med.description,
      dosageForm: med.dosageForm,
      strength: med.strength,
      price: med.price,
      currency: med.currency,
      quantity: med.quantity,
      inStock: med.inStock,
      requiresPrescription: med.requiresPrescription,
      sideEffects: med.sideEffects,
      imageUrl: med.imageUrl,
      pharmacy: med.pharmacist.pharmacyName,
      pharmacist: {
        id: med.pharmacist.user.id,
        name: `${med.pharmacist.user.firstName} ${med.pharmacist.user.lastName}`,
        profileImage: med.pharmacist.user.profileImage,
        verified: med.pharmacist.user.verified,
      },
    }))

    if (category && category !== 'all') {
      results = results.filter((m) => m.category.toLowerCase().includes(category.toLowerCase()))
    }

    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter((m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        (m.genericName && m.genericName.toLowerCase().includes(lowerQuery)) ||
        m.category.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery) ||
        m.pharmacy.toLowerCase().includes(lowerQuery)
      )
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Medicines search error:', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
