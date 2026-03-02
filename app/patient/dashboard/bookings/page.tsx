'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaCalendarCheck,
  FaUserMd,
  FaUserNurse,
  FaBaby,
  FaFlask,
  FaAmbulance,
  FaSearch,
} from 'react-icons/fa'

interface Booking {
  id: string
  type: 'doctor' | 'nurse' | 'nanny' | 'lab-test' | 'emergency'
  providerName: string
  scheduledAt: string
  status: string
  consultationType?: string
  testName?: string
  detail?: string
}

type FilterType = 'all' | 'pending' | 'upcoming' | 'past'

export default function PatientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const stored = localStorage.getItem('healthwyz_user')
        if (!stored) return
        let user: { id?: string }
        try {
          user = JSON.parse(stored)
        } catch {
          // Corrupted localStorage
          return
        }
        if (!user.id) return

        const res = await fetch(`/api/patients/${user.id}/bookings`)
        const data = await res.json()
        if (data.success) {
          setBookings(data.data || [])
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const filteredBookings =
    filter === 'all'
      ? bookings
      : bookings.filter((b) => {
          if (filter === 'pending') return b.status === 'pending'
          if (filter === 'upcoming') return b.status === 'upcoming'
          // "past" covers completed, cancelled, resolved, dispatched, etc.
          return (
            b.status === 'completed' ||
            b.status === 'cancelled' ||
            b.status === 'resolved'
          )
        })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return <FaUserMd className="text-blue-500" />
      case 'nurse':
        return <FaUserNurse className="text-pink-500" />
      case 'nanny':
        return <FaBaby className="text-yellow-500" />
      case 'lab-test':
        return <FaFlask className="text-cyan-500" />
      case 'emergency':
        return <FaAmbulance className="text-red-500" />
      default:
        return <FaCalendarCheck className="text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'doctor':
        return 'Doctor Appointment'
      case 'nurse':
        return 'Nurse Booking'
      case 'nanny':
        return 'Childcare Booking'
      case 'lab-test':
        return 'Lab Test'
      case 'emergency':
        return 'Emergency Service'
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      upcoming: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      resolved: 'bg-blue-100 text-blue-700',
      dispatched: 'bg-orange-100 text-orange-700',
      en_route: 'bg-orange-100 text-orange-700',
    }
    const style = styles[status] || 'bg-gray-100 text-gray-700'
    const label = status.replace(/_/g, ' ')

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}
      >
        {label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}{' '}
            across all services
          </p>
        </div>
        <Link
          href="/patient/dashboard/book/doctor"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2 w-fit text-sm"
        >
          <FaSearch /> Find a Provider
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'upcoming', 'past'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
          <FaCalendarCheck className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {filter === 'all' ? 'No Bookings Yet' : `No ${filter} bookings`}
          </h3>
          <p className="text-gray-500 mb-4 text-sm">
            {filter === 'all'
              ? 'Book a consultation with a doctor, nurse, or other provider to get started.'
              : 'Try a different filter to see other bookings.'}
          </p>
          {filter === 'all' && (
            <Link
              href="/patient/dashboard/book/doctor"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Browse Providers
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={`${booking.type}-${booking.id}`}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg flex-shrink-0">
                  {getTypeIcon(booking.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {booking.providerName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getTypeLabel(booking.type)}
                        {booking.consultationType
                          ? ` \u2014 ${booking.consultationType.replace(/_/g, ' ')}`
                          : ''}
                        {booking.detail &&
                        booking.detail !== booking.consultationType
                          ? ` \u2014 ${booking.detail}`
                          : ''}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {' at '}
                    {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
