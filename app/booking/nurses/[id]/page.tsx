'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { nursesData } from '@/lib/data'
import NurseInfo from '@/components/booking/NurseInfo'
import BookingSteps from '@/components/booking/NurseBookingSteps'
import NurseScheduleSelection from '@/components/booking/NurseScheduleSelection'
import NurseConsultationDetails from '@/components/booking/NurseConsultationDetails'
import NursePaymentOptions from '@/components/booking/NursePaymentOptions'
import NurseBookingConfirmation from '@/components/booking/NurseBookingConfirmation'
import type { Nurse } from '@/lib/data'

export interface NurseBookingData {
  nurse: Nurse
  date: string
  time: string
  type: 'video' | 'in-person' | 'home-visit'
  duration: number // in hours
  reason: string
  notes: string
  selectedPaymentMethod: PaymentMethod | null
  finalAmount: number
  ticketId?: string
}

export interface PaymentMethod {
  id: string
  type: 'mcb-juice' | 'credit-card' | 'corporate' | 'insurance' | 'subscription'
  name: string
  description: string
  discount?: number
  icon: string
  available: boolean
}

export interface CreditCardData {
  cardNumber: string
  expiryDate: string
  cvv: string
  holderName: string
  cardType?: 'visa' | 'mastercard' | 'amex'
}

export default function NurseBookingPage() {
  const params = useParams()
  const nurseId = params.id as string
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    cardType: undefined
  })

  const nurse = nursesData.find(n => n.id === nurseId)

  const [bookingData, setBookingData] = useState<NurseBookingData>({
    nurse: nurse!,
    date: '',
    time: '',
    type: 'in-person',
    duration: 2, // Default 2 hours
    reason: '',
    notes: '',
    selectedPaymentMethod: null,
    finalAmount: 0
  })
  

  useEffect(() => {
    if (nurse) {
      setBookingData(prev => ({ 
        ...prev, 
        nurse,
        finalAmount: calculateFinalAmount()
      }))
    }
  }, [nurse])

  // Separate useEffect to update final amount when relevant fields change
  useEffect(() => {
    const newAmount = calculateFinalAmount(bookingData)
    if (newAmount !== bookingData.finalAmount) {
      setBookingData(prev => ({ ...prev, finalAmount: newAmount }))
    }
  }, [bookingData.type, bookingData.duration, bookingData.selectedPaymentMethod, bookingData.nurse])

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      const ticketId = `NUR-${Date.now()}`
      setBookingData(prev => ({ ...prev, ticketId }))
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = (data = bookingData) => {
    const baseAmount = data.type === 'video' 
        ? data.nurse.videoConsultationRate * data.duration
        : data.nurse.hourlyRate * data.duration
    const platformFee = 50
    const totalBeforeDiscount = baseAmount + platformFee
    
    if (data.selectedPaymentMethod?.discount) {
        return totalBeforeDiscount * (1 - data.selectedPaymentMethod.discount / 100)
    }
    
    return totalBeforeDiscount
  }

  const updateBookingData = (updates: Partial<NurseBookingData>) => {
    setBookingData(prev => {
      const updated = { ...prev, ...updates }
      updated.finalAmount = calculateFinalAmount(updated)
      return updated
    })
  }

  if (!nurse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nurse Not Found</h1>
          <p className="text-gray-600">The nurse you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Book Nursing Service</h1>
            <span className="text-gray-600">
              with {nurse.firstName} {nurse.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <BookingSteps currentStep={currentStep} />

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Nurse Information */}
        {currentStep === 1 && (
          <NurseInfo 
            nurse={nurse} 
            onNext={() => setCurrentStep(2)} 
          />
        )}

        {/* Step 2: Schedule Selection */}
        {currentStep === 2 && (
          <NurseScheduleSelection
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3: Service Details */}
        {currentStep === 3 && (
          <NurseConsultationDetails
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <NursePaymentOptions
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onPayment={handlePayment}
            onBack={() => setCurrentStep(3)}
            isProcessing={isProcessing}
            creditCardData={creditCardData}
            onCreditCardUpdate={setCreditCardData}
          />
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && bookingConfirmed && (
          <NurseBookingConfirmation bookingData={bookingData} />
        )}
      </div>
    </div>
  )
}