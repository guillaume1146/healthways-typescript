'use client'

import React, { useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FaStar,
  FaStarHalfAlt,
  FaComment,
  FaThumbsUp,
  FaReply,
  FaFilter,
  FaSearch,
  FaChartBar,
  FaChartLine,
  FaTrophy,
  FaAward,
  FaMedal,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaCheckCircle,
  FaHeart,
  FaShareAlt,
  FaEllipsisV,
  FaQuoteLeft,
  FaArrowUp,
  FaSmile,
  FaMeh,
  FaFrown,
  FaUserMd,
  FaClock
} from 'react-icons/fa'

/* ---------------- Types ---------------- */

interface PatientComment {
  id: string
  patientFirstName: string
  patientLastName: string
  patientProfileImage: string
  comment: string
  starRating: number
  date: string
  time: string
  helpful?: number
  response?: string
  verified?: boolean
}

interface PerformanceMetrics {
  patientSatisfaction?: number
  responseTime?: number
  appointmentCompletionRate?: number
  returnPatientRate?: number
}

interface DoctorData {
  patientComments?: PatientComment[]
  rating?: number
  reviews?: number
  performanceMetrics?: PerformanceMetrics
  [key: string]: unknown
}

interface Props {
  doctorData: DoctorData
}

interface FilterOptions {
  rating: 'all' | '5' | '4' | '3' | '2' | '1'
  dateRange: 'all' | 'week' | 'month' | 'year'
  verified: 'all' | 'verified' | 'unverified'
}

/* ---------------- Component ---------------- */

const ReviewsRatings: React.FC<Props> = ({ doctorData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'analytics' | 'achievements'>('overview')
  const [expandedSection, setExpandedSection] = useState<string>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    rating: 'all',
    dateRange: 'all',
    verified: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  // Safe data extraction
  const reviews: PatientComment[] = doctorData?.patientComments ?? []
  const rating: number = doctorData?.rating ?? 0
  const totalReviews: number = doctorData?.reviews ?? 0
  const performanceMetrics: Required<PerformanceMetrics> = {
    patientSatisfaction: doctorData?.performanceMetrics?.patientSatisfaction ?? 0,
    responseTime: doctorData?.performanceMetrics?.responseTime ?? 0,
    appointmentCompletionRate: doctorData?.performanceMetrics?.appointmentCompletionRate ?? 0,
    returnPatientRate: doctorData?.performanceMetrics?.returnPatientRate ?? 0
  }

  // Rating distribution
  const getRatingDistribution = () => {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review: PatientComment) => {
      if (review.starRating >= 1 && review.starRating <= 5) {
        distribution[review.starRating as 1 | 2 | 3 | 4 | 5]++
      }
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  const sections: {
    id: 'overview' | 'reviews' | 'analytics' | 'achievements'
    label: string
    icon: IconType
    color: 'blue' | 'green' | 'purple' | 'yellow'
    count?: number
  }[] = [
    { id: 'overview', label: 'Overview', icon: FaChartBar, color: 'blue' },
    { id: 'reviews', label: 'Patient Reviews', icon: FaComment, color: 'green', count: totalReviews },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine, color: 'purple' },
    { id: 'achievements', label: 'Achievements', icon: FaTrophy, color: 'yellow' }
  ]

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('')
    } else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const filterReviews = (reviewList: PatientComment[]) => {
    const q = searchQuery.toLowerCase()
    return reviewList.filter((review) => {
      const matchesSearch =
        review.comment?.toLowerCase().includes(q) ||
        review.patientFirstName?.toLowerCase().includes(q) ||
        review.patientLastName?.toLowerCase().includes(q)

      const matchesRating = filters.rating === 'all' || review.starRating.toString() === filters.rating
      const matchesVerified =
        filters.verified === 'all' || (filters.verified === 'verified' ? !!review.verified : !review.verified)

      // dateRange filter UI exists but not implemented; add if needed.
      return matchesSearch && matchesRating && matchesVerified
    })
  }

  const renderStars = (score: number, size = 'text-base') => {
    const nodes: React.ReactNode[] = []
    const full = Math.floor(score)
    const half = score % 1 !== 0

    for (let i = 0; i < full; i++) nodes.push(<FaStar key={`s${i}`} className={`${size} text-yellow-500`} />)
    if (half) nodes.push(<FaStarHalfAlt key="half" className={`${size} text-yellow-500`} />)
    for (let i = nodes.length; i < 5; i++) nodes.push(<FaStar key={`e${i}`} className={`${size} text-gray-300`} />)
    return nodes
  }

  const getSentimentIcon = (score: number) => {
    if (score >= 4) return <FaSmile className="text-green-500 text-2xl" />
    if (score >= 3) return <FaMeh className="text-yellow-500 text-2xl" />
    return <FaFrown className="text-red-500 text-2xl" />
  }

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Overall Rating Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-blue-700 mb-2">{rating}</div>
            <div className="flex justify-center mb-2">{renderStars(rating, 'text-xl')}</div>
            <p className="text-sm text-gray-600">{totalReviews} reviews</p>
          </div>

          <div className="flex-1 w-full">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star as 1 | 2 | 3 | 4 | 5]
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 mb-2">
                  <span className="text-sm w-3">{star}</span>
                  <FaStar className="text-yellow-500 text-sm" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-10 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaSmile className="text-green-600" />
            <p className="text-xs text-gray-600">Satisfaction</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-green-700">{performanceMetrics.patientSatisfaction}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <FaClock className="text-purple-600" />
            <p className="text-xs text-gray-600">Response Time</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-purple-700">{performanceMetrics.responseTime} min</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCheckCircle className="text-orange-600" />
            <p className="text-xs text-gray-600">Completion Rate</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-orange-700">
            {performanceMetrics.appointmentCompletionRate}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-cyan-200">
          <div className="flex items-center gap-2 mb-1">
            <FaReply className="text-cyan-600" />
            <p className="text-xs text-gray-600">Return Rate</p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-cyan-700">{performanceMetrics.returnPatientRate}%</p>
        </div>
      </div>

      {/* Recent Reviews Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Recent Reviews</h3>
        <div className="space-y-3">
          {reviews.slice(0, 2).map((review: PatientComment) => (
            <div key={review.id} className="bg-white/80 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.patientFirstName[0]}
                  {review.patientLastName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">
                      {review.patientFirstName} {review.patientLastName}
                    </h4>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-2">{renderStars(review.starRating, 'text-sm')}</div>
                  <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
          {reviews.length > 2 && (
            <button onClick={() => setActiveTab('reviews')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all {totalReviews} reviews →
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const renderReviewCard = (review: PatientComment) => (
    <div
      key={review.id}
      className="bg-gradient-to-br from-white/90 to-green-50/30 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
            {review.patientFirstName[0]}
            {review.patientLastName[0]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {review.patientFirstName} {review.patientLastName}
                  {review.verified && <FaCheckCircle className="inline ml-1 text-blue-500 text-xs" />}
                </h4>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <FaCalendarAlt className="text-gray-400" />
                  {review.date} at {review.time}
                </div>
              </div>
              <div className="text-right">
                <div className="flex mb-1">{renderStars(review.starRating, 'text-sm')}</div>
                <span className="text-xs text-gray-500">{review.starRating}/5</span>
              </div>
            </div>

            <p className={`text-sm text-gray-700 mb-3 ${expandedReview === review.id ? '' : 'line-clamp-3'}`}>
              <FaQuoteLeft className="inline mr-1 text-gray-400 text-xs" />
              {review.comment}
            </p>

            {review.comment.length > 150 && (
              <button
                onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                className="text-blue-600 hover:text-blue-700 text-xs font-medium mb-3"
              >
                {expandedReview === review.id ? 'Show less' : 'Read more'}
              </button>
            )}

            {/* Response Section */}
            {review.response && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaUserMd className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-800">Doctor&apos;s Response</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">{review.response}</p>
              </div>
            )}

            {/* Reply Section */}
            {replyingTo === review.id && (
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-3 mb-3 border border-gray-200">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your response..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded text-xs hover:from-blue-600 hover:to-indigo-700 transition">
                    Send Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText('')
                    }}
                    className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-gray-600 hover:text-green-600 transition text-xs">
                  <FaThumbsUp />
                  <span>Helpful ({review.helpful || 0})</span>
                </button>
                {!review.response && (
                  <button
                    onClick={() => setReplyingTo(review.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition text-xs"
                  >
                    <FaReply />
                    Reply
                  </button>
                )}
                <button className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition text-xs">
                  <FaShareAlt />
                  Share
                </button>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition">
                <FaEllipsisV className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Trends */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Rating Trends</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">This Month</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-700">4.8</span>
              <div className="flex items-center text-green-600">
                <FaArrowUp className="text-xs" />
                <span className="text-xs">0.2</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Last Month</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-700">4.6</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Average Response Time</span>
            <span className="font-semibold">{performanceMetrics.responseTime} minutes</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Response Rate</span>
            <span className="font-semibold">85%</span>
          </div>
        </div>
      </div>

      {/* Review Categories */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Common Feedback Themes</h3>

        <div className="space-y-3">
          {[
            { theme: 'Professional & Knowledgeable', count: 45, percentage: 85 },
            { theme: 'Caring & Compassionate', count: 42, percentage: 80 },
            { theme: 'Clear Communication', count: 38, percentage: 72 },
            { theme: 'Punctual', count: 35, percentage: 67 },
            { theme: 'Thorough Examination', count: 33, percentage: 63 }
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.theme}</span>
                <span className="text-gray-600">{item.count} mentions</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-yellow-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Patient Sentiment</h3>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <FaSmile className="text-green-500 text-3xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-700">75%</p>
            <p className="text-xs text-gray-600">Positive</p>
          </div>
          <div>
            <FaMeh className="text-yellow-500 text-3xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-700">20%</p>
            <p className="text-xs text-gray-600">Neutral</p>
          </div>
          <div>
            <FaFrown className="text-red-500 text-3xl mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-700">5%</p>
            <p className="text-xs text-gray-600">Negative</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Badges */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Earned Badges</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: FaTrophy, name: 'Top Rated', description: '4.5+ rating', color: 'yellow' },
            { icon: FaAward, name: 'Patient Choice', description: '100+ reviews', color: 'blue' },
            { icon: FaMedal, name: 'Quick Responder', description: '<15 min response', color: 'green' },
            { icon: FaHeart, name: 'Compassionate Care', description: 'High empathy score', color: 'red' },
            { icon: FaStar, name: 'Excellence', description: '95% satisfaction', color: 'purple' },
            { icon: FaCheckCircle, name: 'Verified', description: 'Profile verified', color: 'cyan' }
          ].map((badge, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-r from-${badge.color}-400 to-${badge.color}-600 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <badge.icon className="text-white text-2xl" />
              </div>
              <p className="text-sm font-semibold text-gray-800">{badge.name}</p>
              <p className="text-xs text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Milestones</h3>

        <div className="space-y-3">
          {[
            { milestone: '1,000 Patients Treated', achieved: true, date: '2023-06-15' },
            { milestone: '500 5-Star Reviews', achieved: true, date: '2024-01-20' },
            { milestone: '3 Years of Excellence', achieved: true, date: '2024-03-01' },
            { milestone: '1,000 Reviews', achieved: false, progress: 342, target: 1000 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                {item.achieved ? (
                  <FaCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                )}
                <div>
                  <p className={`text-sm font-medium ${item.achieved ? 'text-gray-800' : 'text-gray-600'}`}>{item.milestone}</p>
                  {item.achieved ? (
                    <p className="text-xs text-gray-500">Achieved on {item.date}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {item.progress}/{item.target}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaStar className="mr-2 sm:mr-3" />
              Reviews & Ratings
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Patient feedback and performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{rating}</p>
              <div className="flex">{renderStars(rating, 'text-sm')}</div>
              <p className="text-xs opacity-90">{totalReviews} reviews</p>
            </div>
            {getSentimentIcon(rating)}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition text-sm sm:text-base"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg sm:rounded-xl hover:from-gray-200 hover:to-slate-200 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaFilter />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 md:gap-4">
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value as FilterOptions['rating'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-sm sm:text-base"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-sm sm:text-base"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <select
              value={filters.verified}
              onChange={(e) => setFilters({ ...filters, verified: e.target.value as FilterOptions['verified'] })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-sm sm:text-base"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        )}
      </div>

      {/* Mobile Accordion / Desktop Tabs */}
      <div className="bg-gradient-to-br from-gray-50 to-yellow-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Tab Navigation */}
        <div className="hidden sm:block border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {sections.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 text-center font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `text-${tab.color}-600 border-b-2 border-current bg-gradient-to-b from-${tab.color}-50 to-transparent`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="text-sm md:text-base" />
                <span className="whitespace-nowrap text-sm md:text-base">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="sm:hidden">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-4 py-3 flex items-center justify-between transition-all ${
                  expandedSection === section.id ? `bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/50` : 'bg-white/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <section.icon className={`text-${section.color}-500`} />
                  <span className={`font-medium ${expandedSection === section.id ? `text-${section.color}-700` : 'text-gray-700'}`}>
                    {section.label}
                  </span>
                  {section.count !== undefined && section.count > 0 && (
                    <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full">{section.count}</span>
                  )}
                </div>
                {expandedSection === section.id ? (
                  <FaChevronUp className={`text-${section.color}-500`} />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-4 bg-white/60">
                  {section.id === 'overview' && renderOverview()}
                  {section.id === 'reviews' && (
                    <div className="space-y-3 sm:space-y-4">
                      {filterReviews(reviews).map(renderReviewCard)}
                      {filterReviews(reviews).length === 0 && (
                        <div className="text-center py-8">
                          <FaComment className="text-gray-400 text-4xl mx-auto mb-3" />
                          <p className="text-gray-500">No reviews found</p>
                        </div>
                      )}
                    </div>
                  )}
                  {section.id === 'analytics' && renderAnalytics()}
                  {section.id === 'achievements' && renderAchievements()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Content */}
        <div className="hidden sm:block p-4 md:p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reviews' && (
            <div className="space-y-3 sm:space-y-4">
              {filterReviews(reviews).map(renderReviewCard)}
              {filterReviews(reviews).length === 0 && (
                <div className="text-center py-8">
                  <FaComment className="text-gray-400 text-4xl mx-auto mb-3" />
                  <p className="text-gray-500">No reviews found</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'achievements' && renderAchievements()}
        </div>
      </div>
    </div>
  )
}

export default ReviewsRatings
