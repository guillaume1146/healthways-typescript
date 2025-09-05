'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { nanniesData } from '@/lib/data'
import { NannyInfo } from '@/components/booking/NannyInfo'
import { NannyBookingSteps } from '@/components/booking/NannyBookingSteps'
import { NannyScheduleSelection } from '@/components/booking/NannyScheduleSelection'
import { NannyConsultationDetails } from '@/components/booking/NannyConsultationDetails'
import { NannyPaymentOptions } from '@/components/booking/NannyPaymentOptions'
import { NannyBookingConfirmation } from '@/components/booking/NannyBookingConfirmation'
import type { Nanny } from '@/lib/data'

export interface NannyBookingData {
  nanny: Nanny
  date: string
  time: string
  type: 'regular' | 'overnight'
  duration: number // in hours
  reason: string
  notes: string
  selectedPaymentMethod: PaymentMethod | null
  finalAmount: number
  ticketId?: string
}

export interface PaymentMethod {
  id: string
  type: 'mcb-juice' | 'credit-card' | 'corporate' | 'family-plan' | 'subscription'
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

export default function NannyBookingPage() {
  const params = useParams()
  const nannyId = params.id as string
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [nanny, setNanny] = useState<Nanny | null>(null)

  const [bookingData, setBookingData] = useState<NannyBookingData>({
    nanny: {} as Nanny,
    date: '',
    time: '',
    type: 'regular',
    duration: 4,
    reason: '',
    notes: '',
    selectedPaymentMethod: null,
    finalAmount: 0
  })

  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    cardType: undefined
  })

  // Load nanny data on mount
  useEffect(() => {
    const foundNanny = nanniesData.find(n => n.id === nannyId)
    if (foundNanny) {
      setNanny(foundNanny)
      setBookingData(prev => ({ ...prev, nanny: foundNanny }))
    }
  }, [nannyId])

  // Generate ticket ID when booking is confirmed
  const generateTicketId = () => {
    const prefix = 'NCT' // Nanny Care Ticket
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  const updateBookingData = (updates: Partial<NannyBookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }))
  }

  const updateCreditCardData = (data: CreditCardData) => {
    setCreditCardData(data)
  }

  const calculateFinalAmount = () => {
    if (!nanny) return 0
    
    const baseAmount = bookingData.type === 'overnight' 
      ? nanny.overnightRate 
      : nanny.hourlyRate * bookingData.duration
    const platformFee = 50
    const totalBeforeDiscount = baseAmount + platformFee
    
    if (bookingData.selectedPaymentMethod?.discount) {
      return totalBeforeDiscount * (1 - bookingData.selectedPaymentMethod.discount / 100)
    }
    
    return totalBeforeDiscount
  }

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const finalAmount = calculateFinalAmount()
    const ticketId = generateTicketId()
    
    updateBookingData({ 
      finalAmount, 
      ticketId 
    })
    
    setIsProcessing(false)
    setCurrentStep(5) // Go to confirmation
  }

  // Show loading if nanny not found
  if (!nanny) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading nanny information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <NannyBookingSteps currentStep={currentStep} />
      
      <div className="container mx-auto px-4 py-8">
        {currentStep === 1 && (
          <NannyInfo 
            nanny={nanny}
            onNext={handleNextStep}
          />
        )}
        
        {currentStep === 2 && (
          <NannyScheduleSelection
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        )}
        
        {currentStep === 3 && (
          <NannyConsultationDetails
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
          />
        )}
        
        {currentStep === 4 && (
          <NannyPaymentOptions
            bookingData={bookingData}
            onUpdate={updateBookingData}
            onPayment={handlePayment}
            onBack={handlePreviousStep}
            isProcessing={isProcessing}
            creditCardData={creditCardData}
            onCreditCardUpdate={updateCreditCardData}
          />
        )}
        
        {currentStep === 5 && (
          <NannyBookingConfirmation 
            bookingData={bookingData}
          />
        )}
      </div>
    </div>
  )
}