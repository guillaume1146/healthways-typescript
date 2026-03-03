'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FaCheckCircle, FaArrowLeft, FaCalendarAlt, FaClock, FaBaby, FaWallet } from 'react-icons/fa'
import BookingForm from '@/components/booking/BookingForm'
import type { BookingSubmitData } from '@/components/booking/BookingForm'

const NANNY_FEES: Record<string, number> = {
  in_person: 400,
  home_visit: 350,
  video: 300,
}

interface NannyInfo {
  id: string
  firstName: string
  lastName: string
  profileImage: string
  specialization: string[]
  location: string
  hourlyRate: number
}

interface BookingResult {
  ticketId: string
  type: string
  scheduledAt: string
  status: string
}

export default function BookNannyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [nanny, setNanny] = useState<NannyInfo | null>(null)
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

        // Fetch nanny details
        const nanniesRes = await fetch('/api/search/nannies')
        const nanniesData = await nanniesRes.json()

        if (nanniesData.success && nanniesData.data) {
          const found = nanniesData.data.find((n: NannyInfo) => n.id === id)
          if (found) {
            setNanny(found)
          } else {
            setError('Nanny not found')
          }
        } else {
          setError('Failed to load nanny information')
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
      const res = await fetch('/api/bookings/nanny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nannyId: id,
          consultationType: data.consultationType,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          reason: data.reason,
          notes: data.notes,
          duration: data.duration,
          children: data.children,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading nanny information...</p>
        </div>
      </div>
    )
  }

  if (error || !nanny) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-4">{error || 'Nanny not found'}</p>
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
          <p className="text-gray-600 mb-8">Your childcare booking has been successfully confirmed.</p>

          {/* Ticket Card */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-6 text-white mb-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Childcare Booking Ticket</h3>
                <p className="text-yellow-100 text-sm">Keep this for your records</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-100 text-xs">Ticket ID</p>
                <p className="font-bold text-lg">{bookingResult.ticketId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-yellow-100 mb-1">Nanny</p>
                <p className="font-semibold">{nanny.firstName} {nanny.lastName}</p>
              </div>
              <div>
                <p className="text-yellow-100 mb-1">Specialization</p>
                <p className="font-semibold">{nanny.specialization[0] || 'Child Care'}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-100" />
                <div>
                  <p className="text-yellow-100 text-xs">Date</p>
                  <p className="font-semibold">{submitData?.scheduledDate ? new Date(submitData.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-yellow-100" />
                <div>
                  <p className="text-yellow-100 text-xs">Time</p>
                  <p className="font-semibold">{submitData?.scheduledTime || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaBaby className="text-yellow-100" />
                <div>
                  <p className="text-yellow-100 text-xs">Type</p>
                  <p className="font-semibold capitalize">{submitData?.consultationType?.replace('_', ' ') || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaWallet className="text-yellow-100" />
                <div>
                  <p className="text-yellow-100 text-xs">Fee Paid</p>
                  <p className="font-semibold">Rs {submitData?.consultationType ? NANNY_FEES[submitData.consultationType] : 400}</p>
                </div>
              </div>
            </div>

            {submitData?.children && submitData.children.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-yellow-100 text-xs">Children</p>
                <p className="text-sm">{submitData.children.join(', ')}</p>
              </div>
            )}

            {submitData?.reason && (
              <div className="mt-3">
                <p className="text-yellow-100 text-xs">Reason</p>
                <p className="text-sm">{submitData.reason}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/patient/dashboard"
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all text-center"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/patient/dashboard/childcare"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
            >
              View Childcare Services
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
          className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Book Childcare with {nanny.firstName} {nanny.lastName}
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        In-Person: Rs {NANNY_FEES.in_person} | Home Visit: Rs {NANNY_FEES.home_visit} | Video: Rs {NANNY_FEES.video}
      </p>

      <BookingForm
        providerType="nanny"
        providerId={id}
        providerName={`${nanny.firstName} ${nanny.lastName}`}
        providerSpecialty={nanny.specialization.join(', ')}
        providerImage={nanny.profileImage}
        providerLocation={nanny.location}
        showConsultationType={true}
        price={NANNY_FEES.in_person}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        walletBalance={walletBalance}
      />
    </div>
  )
}
