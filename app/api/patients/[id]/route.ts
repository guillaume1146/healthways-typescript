import { NextRequest, NextResponse } from 'next/server'
import { getCompletePatientData } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const patient = await getCompletePatientData(id)
    
    if (!patient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: patient
    })
  } catch (error) {
    console.error('Error fetching patient:', error)
    return NextResponse.json(
      { success: false, message: 'Database error' },
      { status: 500 }
    )
  }
}