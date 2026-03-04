'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FaCheckCircle, FaArrowLeft, FaCalendarAlt, FaClock, FaFlask, FaWallet } from 'react-icons/fa'
import BookingForm from '@/components/booking/BookingForm'
import type { BookingSubmitData } from '@/components/booking/BookingForm'

interface LabTestInfo {
  id: string
  testName: string
  category: string
  description: string
  price: number
  currency: string
  turnaroundTime: string
  sampleType: string
  preparation: string
  lab: string
  labTechnician: {
    id: string
    name: string
    profileImage: string | null
    verified: boolean
  }
}

interface BookingResult {
  ticketId: string
  type: string
  scheduledAt: string
  status: string
}

export default function BookLabTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [labTest, setLabTest] = useState<LabTestInfo | null>(null)
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

        // Fetch lab test catalog
        const testsRes = await fetch('/api/search/lab-tests')
        const testsData = await testsRes.json()

        if (testsData.success && testsData.data) {
          const found = testsData.data.find((t: LabTestInfo) => t.id === id)
          if (found) {
            setLabTest(found)
          } else {
            setError('Lab test not found')
          }
        } else {
          setError('Failed to load lab test information')
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
      const res = await fetch('/api/bookings/lab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labTechId: labTest?.labTechnician.id,
          testName: labTest?.testName,
          scheduledDate: data.scheduledDate,
          scheduledTime: data.scheduledTime,
          sampleType: labTest?.sampleType || data.sampleType,
          notes: data.notes,
          price: labTest?.price,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lab test information...</p>
        </div>
      </div>
    )
  }

  if (error || !labTest) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium mb-4">{error || 'Lab test not found'}</p>
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

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lab Test Booked!</h2>
          <p className="text-gray-600 mb-8">Your lab test appointment has been successfully scheduled.</p>

          {/* Ticket Card */}
          <div className="bg-gradient-to-r from-cyan-600 to-teal-700 rounded-2xl p-6 text-white mb-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Lab Test Ticket</h3>
                <p className="text-cyan-200 text-sm">Keep this for your records</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-200 text-xs">Ticket ID</p>
                <p className="font-bold text-lg">{bookingResult.ticketId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-cyan-200 mb-1">Test Name</p>
                <p className="font-semibold">{labTest.testName}</p>
              </div>
              <div>
                <p className="text-cyan-200 mb-1">Laboratory</p>
                <p className="font-semibold">{labTest.lab}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-cyan-200" />
                <div>
                  <p className="text-cyan-200 text-xs">Date</p>
                  <p className="font-semibold">{submitData?.scheduledDate ? new Date(submitData.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-cyan-200" />
                <div>
                  <p className="text-cyan-200 text-xs">Time</p>
                  <p className="font-semibold">{submitData?.scheduledTime || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaFlask className="text-cyan-200" />
                <div>
                  <p className="text-cyan-200 text-xs">Sample Type</p>
                  <p className="font-semibold">{labTest.sampleType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaWallet className="text-cyan-200" />
                <div>
                  <p className="text-cyan-200 text-xs">Amount Paid</p>
                  <p className="font-semibold">Rs {labTest.price.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {labTest.turnaroundTime && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-cyan-200 text-xs">Turnaround Time</p>
                <p className="text-sm">{labTest.turnaroundTime}</p>
              </div>
            )}

            {labTest.preparation && (
              <div className="mt-3">
                <p className="text-cyan-200 text-xs">Preparation Instructions</p>
                <p className="text-sm">{labTest.preparation}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/patient/dashboard"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-teal-800 transition-all text-center"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/patient/lab-results"
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
            >
              View Lab Results
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
          className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Book Lab Test: {labTest.testName}
      </h1>
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
        <span>Lab: {labTest.lab}</span>
        <span>|</span>
        <span>Category: {labTest.category}</span>
        <span>|</span>
        <span>Sample: {labTest.sampleType}</span>
        <span>|</span>
        <span>Results in: {labTest.turnaroundTime}</span>
      </div>

      {labTest.preparation && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm font-medium mb-1">Preparation Required</p>
          <p className="text-amber-700 text-sm">{labTest.preparation}</p>
        </div>
      )}

      <BookingForm
        providerType="lab-test"
        providerId={labTest.labTechnician.id}
        providerName={labTest.lab}
        providerSpecialty={labTest.category}
        providerImage={labTest.labTechnician.profileImage || undefined}
        showConsultationType={false}
        price={labTest.price}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        walletBalance={walletBalance}
      />
    </div>
  )
}
