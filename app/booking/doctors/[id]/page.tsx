'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { doctorsData } from '@/lib/data'
import DoctorInfo from '@/components/booking/DoctorInfo'
import BookingSteps from '@/components/booking/BookingSteps'
import ScheduleSelection from '@/components/booking/ScheduleSelection'
import ConsultationDetails from '@/components/booking/ConsultationDetails'
import PaymentOptions from '@/components/booking/PaymentOptions'
import BookingConfirmation from '@/components/booking/BookingConfirmation'
import type { Doctor } from '@/lib/data'

export interface BookingData {
  doctor: Doctor
  date: string
  time: string
  type: 'video' | 'in-person'
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

export default function DoctorBookingPage() {
  const params = useParams()
  const doctorId = params.id as string
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

  const doctor = doctorsData.find(d => d.id === doctorId)

  const [bookingData, setBookingData] = useState<BookingData>({
    doctor: doctor!,
    date: '',
    time: '',
    type: 'video',
    reason: '',
    notes: '',
    selectedPaymentMethod: null,
    finalAmount: 0
  })
  

  useEffect(() => {
    if (doctor) {
      setBookingData(prev => ({ 
        ...prev, 
        doctor,
        finalAmount: calculateFinalAmount()
      }))
    }
  }, [doctor])

  // Separate useEffect to update final amount when relevant fields change
  useEffect(() => {
    const newAmount = calculateFinalAmount(bookingData)
    if (newAmount !== bookingData.finalAmount) {
      setBookingData(prev => ({ ...prev, finalAmount: newAmount }))
    }
  }, [bookingData.type, bookingData.selectedPaymentMethod, bookingData.doctor])

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setBookingConfirmed(true)
      const ticketId = `TKT-${Date.now()}`
      setBookingData(prev => ({ ...prev, ticketId }))
      setCurrentStep(5)
    }, 3000)
  }

  const calculateFinalAmount = (data = bookingData) => {
    const baseAmount = data.type === 'video' 
        ? data.doctor.videoConsultationFee 
        : data.doctor.consultationFee
    const platformFee = 50
    const totalBeforeDiscount = baseAmount + platformFee
    
    if (data.selectedPaymentMethod?.discount) {
        return totalBeforeDiscount * (1 - data.selectedPaymentMethod.discount / 100)
    }
    
    return totalBeforeDiscount
    }

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => {
      const updated = { ...prev, ...updates }
      updated.finalAmount = calculateFinalAmount()
      return updated
    })
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h1>
          <p className="text-gray-600">The doctor you are looking for does not exist.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Book Consultation</h1>
            <span className="text-gray-600">
              with Dr. {doctor.firstName} {doctor.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <BookingSteps currentStep={currentStep} />

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Doctor Information */}
        {currentStep === 1 && (
          <DoctorInfo 
            doctor={doctor} 
            onNext={() => setCurrentStep(2)} 
          />
        )}

        {/* Step 2: Schedule Selection */}
        {currentStep === 2 && (
          <ScheduleSelection
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3: Consultation Details */}
        {currentStep === 3 && (
          <ConsultationDetails
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && (
          <PaymentOptions
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
          <BookingConfirmation bookingData={bookingData} />
        )}
      </div>
    </div>
  )
}