'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaCheckCircle, FaArrowLeft, FaAmbulance, FaExclamationTriangle, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import BookingForm from '@/components/booking/BookingForm'
import type { BookingSubmitData } from '@/components/booking/BookingForm'

interface BookingResult {
  ticketId: string
  type: string
  status: string
  priority: string
  createdAt: string
}

export default function BookEmergencyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [submitData, setSubmitData] = useState<BookingSubmitData | null>(null)

  const handleSubmit = async (data: BookingSubmitData) => {
    setIsSubmitting(true)
    setSubmitData(data)

    try {
      const res = await fetch('/api/bookings/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyType: data.emergencyType,
          location: data.location,
          contactNumber: data.contactNumber,
          notes: data.notes,
          priority: data.priority,
        }),
      })

      const result = await res.json()

      if (!result.success) {
        throw new Error(result.message || 'Emergency request failed')
      }

      setBookingResult(result.booking)
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (bookingResult) {
    const priorityColors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Request Submitted!</h2>
          <p className="text-gray-600 mb-8">Your emergency request has been dispatched. Help is on the way.</p>

          {/* Ticket Card */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 text-white mb-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FaAmbulance /> Emergency Ticket
                </h3>
                <p className="text-red-200 text-sm">Dispatched to nearest responder</p>
              </div>
              <div className="text-right">
                <p className="text-red-200 text-xs">Ticket ID</p>
                <p className="font-bold text-lg">{bookingResult.ticketId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-red-200 mb-1">Emergency Type</p>
                <p className="font-semibold capitalize">{submitData?.emergencyType?.replace('_', ' ') || 'N/A'}</p>
              </div>
              <div>
                <p className="text-red-200 mb-1">Priority</p>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${priorityColors[bookingResult.priority] || priorityColors.medium}`}>
                  {bookingResult.priority.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-200" />
                <div>
                  <p className="text-red-200 text-xs">Location</p>
                  <p className="font-semibold">{submitData?.location || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-red-200" />
                <div>
                  <p className="text-red-200 text-xs">Submitted At</p>
                  <p className="font-semibold">{bookingResult.createdAt ? new Date(bookingResult.createdAt).toLocaleString() : 'Just now'}</p>
                </div>
              </div>
            </div>

            {submitData?.contactNumber && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-red-200 text-xs">Contact Number</p>
                <p className="text-sm font-semibold">{submitData.contactNumber}</p>
              </div>
            )}

            {submitData?.notes && (
              <div className="mt-3">
                <p className="text-red-200 text-xs">Additional Notes</p>
                <p className="text-sm">{submitData.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800 text-sm mb-1">What happens next?</p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>- Your request has been dispatched to the nearest available responder</li>
                  <li>- You will receive a notification when a responder is assigned</li>
                  <li>- Keep your phone accessible at the contact number provided</li>
                  <li>- If this is a life-threatening emergency, also call 114 (SAMU)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/patient/dashboard"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all text-center"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/patient/dashboard/emergency"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
            >
              View Emergency Services
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      {/* Emergency Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <FaAmbulance className="text-3xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Request Emergency Service</h1>
            <p className="text-red-100 text-sm mt-1">
              For life-threatening emergencies, also call 114 (SAMU) or 999 immediately
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-red-600 mt-0.5" />
          <p className="text-red-700 text-sm">
            Emergency services are provided at <strong>no charge</strong> during the Healthwyz trial period.
            A qualified emergency responder will be dispatched to your location.
          </p>
        </div>
      </div>

      <BookingForm
        providerType="emergency"
        showConsultationType={false}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
