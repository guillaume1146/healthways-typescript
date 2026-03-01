'use client'

import { useState, useEffect, useCallback } from 'react'
import { FaCheck, FaTimes, FaSpinner, FaCalendarAlt, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa'

interface BookingRequest {
  id: string
  type: string
  scheduledAt: string
  reason: string
  notes: string | null
  duration: number
  createdAt: string
  patient: {
    id: string
    userId: string
    user: {
      firstName: string
      lastName: string
      email: string
      phone: string
      profileImage: string | null
    }
  }
}

export default function DoctorBookingRequestsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      const userData = localStorage.getItem('healthwyz_user')
      if (!userData) return
      const user = JSON.parse(userData)

      const res = await fetch(`/api/doctors/${user.id}/booking-requests`)
      const data = await res.json()
      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch booking requests:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleAction = async (bookingId: string, action: 'accept' | 'deny') => {
    setActionLoading(bookingId)
    setMessage(null)

    try {
      const res = await fetch(`/api/bookings/doctor/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId))
        setMessage({
          type: 'success',
          text: action === 'accept' ? 'Booking accepted successfully' : 'Booking declined successfully',
        })
      } else {
        setMessage({ type: 'error', text: data.message || 'Action failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' })
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      video: 'bg-blue-100 text-blue-800',
      in_person: 'bg-green-100 text-green-800',
      home_visit: 'bg-purple-100 text-purple-800',
    }
    return styles[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>

      {message && (
        <div className={`rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm border border-gray-200">
          <FaCalendarAlt className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No pending booking requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {booking.patient.user.firstName[0]}{booking.patient.user.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {booking.patient.user.firstName} {booking.patient.user.lastName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-xs" /> {booking.patient.user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-xs" /> {booking.patient.user.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadge(booking.type)}`}>
                      {booking.type.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <FaCalendarAlt className="text-xs" /> {formatDate(booking.scheduledAt)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <FaClock className="text-xs" /> {formatTime(booking.scheduledAt)}
                    </span>
                    <span className="text-gray-500">{booking.duration} min</span>
                  </div>

                  {booking.reason && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {booking.reason}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={() => handleAction(booking.id, 'accept')}
                    disabled={actionLoading === booking.id}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === booking.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(booking.id, 'deny')}
                    disabled={actionLoading === booking.id}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === booking.id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
