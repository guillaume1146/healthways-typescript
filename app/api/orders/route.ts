import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { validateRequest } from '@/lib/auth/validate'

// ─── POST — Create a medicine order ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { items } = body as {
      items: Array<{ pharmacyMedicineId: string; quantity: number }>
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Items must be a non-empty array' },
        { status: 400 }
      )
    }

    for (const item of items) {
      if (!item.pharmacyMedicineId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: 'Each item must have a valid pharmacyMedicineId and quantity > 0' },
          { status: 400 }
        )
      }
    }

    // Find patient profile
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: auth.sub },
      select: { id: true },
    })

    if (!patientProfile) {
      return NextResponse.json(
        { success: false, message: 'Patient profile not found' },
        { status: 404 }
      )
    }

    // Execute the entire order flow inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Fetch all pharmacy medicines
      const medicines = await Promise.all(
        items.map((item) =>
          tx.pharmacyMedicine.findUnique({
            where: { id: item.pharmacyMedicineId },
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true,
              inStock: true,
              isActive: true,
              pharmacist: { select: { pharmacyName: true } },
            },
          })
        )
      )

      // Validate stock availability
      const unavailable: string[] = []
      for (let i = 0; i < items.length; i++) {
        const med = medicines[i]
        const item = items[i]
        if (!med || !med.isActive) {
          unavailable.push(`${item.pharmacyMedicineId}: medicine not found or inactive`)
        } else if (!med.inStock) {
          unavailable.push(`${med.name}: out of stock`)
        } else if (med.quantity < item.quantity) {
          unavailable.push(`${med.name}: only ${med.quantity} available, requested ${item.quantity}`)
        }
      }

      if (unavailable.length > 0) {
        throw { code: 'OUT_OF_STOCK', details: unavailable }
      }

      // Calculate total
      const total = items.reduce((sum, item, i) => {
        return sum + medicines[i]!.price * item.quantity
      }, 0)

      // Check wallet balance
      const wallet = await tx.userWallet.findUnique({
        where: { userId: auth.sub },
        select: { id: true, balance: true },
      })

      if (!wallet || wallet.balance < total) {
        throw {
          code: 'INSUFFICIENT_BALANCE',
          required: total,
          available: wallet?.balance ?? 0,
        }
      }

      // Deduct wallet balance
      await tx.userWallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance - total },
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'debit',
          amount: total,
          description: `Medicine order: ${items.length} item(s)`,
          serviceType: 'medicine',
          balanceBefore: wallet.balance,
          balanceAfter: wallet.balance - total,
        },
      })

      // Find or create Medicine records for each pharmacy medicine
      const medicineRecords = await Promise.all(
        medicines.map(async (med) => {
          if (!med) throw { code: 'INVALID_MEDICINE' }
          return tx.medicine.upsert({
            where: { name: med.name },
            update: {},
            create: { name: med.name, category: 'General' },
          })
        })
      )

      // Create the order with items
      const order = await tx.medicineOrder.create({
        data: {
          patientId: patientProfile.id,
          status: 'confirmed',
          totalAmount: total,
          pharmacy: medicines[0]!.pharmacist.pharmacyName,
          items: {
            create: items.map((item, i) => ({
              medicineId: medicineRecords[i].id,
              pharmacyMedicineId: item.pharmacyMedicineId,
              quantity: item.quantity,
              price: medicines[i]!.price,
            })),
          },
        },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          pharmacy: true,
          orderedAt: true,
        },
      })

      // Decrement stock for each item
      await Promise.all(
        items.map((item, i) =>
          tx.pharmacyMedicine.update({
            where: { id: item.pharmacyMedicineId },
            data: {
              quantity: { decrement: item.quantity },
              inStock: medicines[i]!.quantity - item.quantity > 0,
            },
          })
        )
      )

      return {
        orderId: order.id,
        status: order.status,
        totalAmount: total,
        walletBalance: wallet.balance - total,
        items: items.map((item, i) => ({
          pharmacyMedicineId: item.pharmacyMedicineId,
          name: medicines[i]!.name,
          quantity: item.quantity,
          price: medicines[i]!.price,
          subtotal: medicines[i]!.price * item.quantity,
        })),
      }
    })

    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error: unknown) {
    // Handle known business errors thrown from the transaction
    if (error && typeof error === 'object' && 'code' in error) {
      const err = error as { code: string; details?: string[]; required?: number; available?: number }

      if (err.code === 'OUT_OF_STOCK') {
        return NextResponse.json(
          { success: false, message: 'Some items are unavailable', details: err.details },
          { status: 400 }
        )
      }

      if (err.code === 'INSUFFICIENT_BALANCE') {
        return NextResponse.json(
          {
            success: false,
            message: 'Insufficient wallet balance',
            required: err.required,
            available: err.available,
          },
          { status: 400 }
        )
      }

      if (err.code === 'INVALID_MEDICINE') {
        return NextResponse.json(
          { success: false, message: 'Invalid medicine reference' },
          { status: 400 }
        )
      }
    }

    console.error('POST /api/orders error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// ─── GET — List patient's orders ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const auth = validateRequest(request)
  if (!auth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))

    const [orders, totalCount] = await Promise.all([
      prisma.medicineOrder.findMany({
        where: { patient: { userId: auth.sub } },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          pharmacy: true,
          orderedAt: true,
          deliveredAt: true,
          items: {
            select: {
              id: true,
              quantity: true,
              price: true,
              pharmacyMedicine: {
                select: { name: true, dosageForm: true, strength: true },
              },
            },
          },
        },
        orderBy: { orderedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.medicineOrder.count({
        where: { patient: { userId: auth.sub } },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
