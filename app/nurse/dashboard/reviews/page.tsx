'use client'

import { useState, useEffect } from 'react'
import {
  FaSpinner, FaStar, FaStarHalfAlt, FaSearch,
  FaFilter, FaComment, FaCalendarAlt, FaQuoteLeft,
  FaChevronDown, FaChevronUp, FaUserNurse
} from 'react-icons/fa'

interface Review {
  id: string
  patientName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1'

export default function NurseReviewsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<Review[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUserId(parsed.id)
      }
    } catch {
      // Corrupted localStorage
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchReviews = async () => {
      try {
        // Fetch reviews from the user profile API which may include review data
        const res = await fetch(`/api/users/${userId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data?.nurseProfile?.reviews) {
            setReviews(data.data.nurseProfile.reviews)
          }
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [userId])

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }))

  const renderStars = (rating: number, size = 'text-base') => {
    const nodes: React.ReactNode[] = []
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5

    for (let i = 0; i < full; i++) {
      nodes.push(<FaStar key={`s${i}`} className={`${size} text-yellow-500`} />)
    }
    if (half) {
      nodes.push(<FaStarHalfAlt key="half" className={`${size} text-yellow-500`} />)
    }
    for (let i = nodes.length; i < 5; i++) {
      nodes.push(<FaStar key={`e${i}`} className={`${size} text-gray-300`} />)
    }
    return nodes
  }

  const filteredReviews = reviews
    .filter(r => {
      if (ratingFilter !== 'all' && Math.round(r.rating).toString() !== ratingFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          r.patientName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-3xl text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 rounded-2xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <FaStar />
              Reviews & Ratings
            </h1>
            <p className="text-teal-100 text-sm mt-1">Patient feedback on your services</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
            <div className="flex justify-center mt-1">{renderStars(averageRating, 'text-sm')}</div>
            <p className="text-teal-100 text-xs mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Rating Summary</h2>
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium w-3 text-gray-600">{star}</span>
              <FaStar className="text-yellow-500 text-sm" />
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-sm"
          >
            <FaFilter />
            Filters
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Rating</label>
            <div className="flex gap-2 flex-wrap">
              {(['all', '5', '4', '3', '2', '1'] as RatingFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setRatingFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    ratingFilter === f
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : `${f} Stars`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
          <FaComment className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {reviews.length === 0 ? 'No Reviews Yet' : 'No matching reviews'}
          </h3>
          <p className="text-gray-500 text-sm">
            {reviews.length === 0
              ? 'Reviews from your patients will appear here after they complete their appointments.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {review.patientName}
                        {review.verified && (
                          <span className="ml-2 text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Verified</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <FaCalendarAlt className="text-gray-400" />
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex">{renderStars(review.rating, 'text-sm')}</div>
                      <span className="text-xs text-gray-500">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <FaQuoteLeft className="inline mr-1 text-gray-300 text-xs" />
                    {review.comment}
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
