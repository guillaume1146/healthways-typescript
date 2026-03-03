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
