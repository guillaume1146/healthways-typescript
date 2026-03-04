'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FaCheckCircle, FaArrowLeft, FaCalendarAlt, FaClock, FaStethoscope, FaWallet } from 'react-icons/fa'
import BookingForm from '@/components/booking/BookingForm'
import type { BookingSubmitData } from '@/components/booking/BookingForm'

interface DoctorInfo {
  id: string
  firstName: string
  lastName: string
  profileImage: string
  specialty: string[]
  location: string
  consultationFee: number
  videoConsultationFee: number
}

interface BookingResult {
  ticketId: string
  type: string
  scheduledAt: string
  status: string
}

export default function BookDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [doctor, setDoctor] = useState<DoctorInfo | null>(null)
  const [walletBalance, setWalletBalance] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null)
  const [submitData, setSubmitData] = useState<BookingSubmitData | null>(null)

  const getUserId = useCallback(() => {
    try {
      const user = JSON.parse(localStorage.getItem('healthwyz_user') || '{}')
      return user.id || null
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch doctor details
        const doctorsRes = await fetch('/api/search/doctors')
        const doctorsData = await doctorsRes.json()

        if (doctorsData.success && doctorsData.data) {
          const found = doctorsData.data.find((d: DoctorInfo) => d.id === id)
          if (found) {
            setDoctor(found)
          } else {
            setError('Doctor not found')
          }
        } else {
          setError('Failed to load doctor information')
        }

        // Fetch wallet balance
        const userId = getUserId()
        if (userId) {
          const walletRes = await fetch(`/api/users/${userId}/wallet`)
          const walletData = await walletRes.json()
          if (walletData.success && walletData.data) {
            setWalletBalance(walletData.data.balance)
          }
        }
      } catch {
        setError('Failed to load booking information')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, getUserId])

  const handleSubmit = async (data: BookingSubmitData) => {
    setIsSubmitting(true)
    setSubmitData(data)

    try {
      const res = await fetch('/api/bookings/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: id,
          consultationType: data.consultationType,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          reason: data.reason,
          notes: data.notes,
          duration: data.duration,
        }),
      })

      const result = await res.json()

      if (!result.success) {
        throw new Error(result.message || 'Booking failed')
      }

      setBookingResult(result.booking)
      if (result.newBalance !== undefined) {
        setWalletBalance(result.newBalance)
      }
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-4">{error || 'Doctor not found'}</p>
          <Link
            href="/patient/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (bookingResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">Your doctor consultation has been successfully booked.</p>

          {/* Ticket Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Consultation Ticket</h3>
                <p className="text-blue-200 text-sm">Keep this for your records</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs">Ticket ID</p>
                <p className="font-bold text-lg">{bookingResult.ticketId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200 mb-1">Doctor</p>
                <p className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</p>
              </div>
              <div>
                <p className="text-blue-200 mb-1">Specialty</p>
                <p className="font-semibold">{doctor.specialty[0] || 'General'}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-200" />
                <div>
                  <p className="text-blue-200 text-xs">Date</p>
                  <p className="font-semibold">{submitData?.scheduledDate ? new Date(submitData.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-200" />
                <div>
                  <p className="text-blue-200 text-xs">Time</p>
                  <p className="font-semibold">{submitData?.scheduledTime || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaStethoscope className="text-blue-200" />
                <div>
                  <p className="text-blue-200 text-xs">Type</p>
                  <p className="font-semibold capitalize">{submitData?.consultationType?.replace('_', ' ') || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaWallet className="text-blue-200" />
                <div>
                  <p className="text-blue-200 text-xs">Wallet Balance</p>
                  <p className="font-semibold">Rs {walletBalance?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {submitData?.reason && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-blue-200 text-xs">Reason</p>
                <p className="text-sm">{submitData.reason}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/patient/dashboard"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-center"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/patient/consultations"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
            >
              View Appointments
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
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Book Consultation with Dr. {doctor.firstName} {doctor.lastName}
      </h1>

      <BookingForm
        providerType="doctor"
        providerId={id}
        providerName={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        providerSpecialty={doctor.specialty.join(', ')}
        providerImage={doctor.profileImage}
        providerLocation={doctor.location}
        showConsultationType={true}
        price={doctor.consultationFee}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        walletBalance={walletBalance}
      />
    </div>
  )
}
