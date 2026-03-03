'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  FaStar, FaMapMarkerAlt, FaCheckCircle, FaVideo, FaHome,
  FaExclamationCircle, FaLanguage, FaClock, FaSearch,
  FaChevronLeft, FaChevronRight, FaUserMd, FaUserNurse,
  FaBaby, FaPills,
} from 'react-icons/fa'
import type { UnifiedSearchResult } from '@/app/api/search/route'

// ---- Loading Skeleton ----

function ResultCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="flex justify-between pt-3 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

export function SearchResultsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ResultCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ---- No Results State ----

interface NoResultsProps {
  query: string
  onClear: () => void
}

export function NoResults({ query, onClear }: NoResultsProps) {
  return (
    <div className="text-center py-16">
      <FaSearch className="text-6xl text-gray-200 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {query
          ? `We couldn't find anything matching "${query}". Try different keywords or adjust your filters.`
          : 'Use the search bar above to find doctors, nurses, medicines, and more.'}
      </p>
      {query && (
        <button
          onClick={onClear}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

// ---- Result Card ----

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; badge: string; badgeColor: string }> = {
  doctor: {
    icon: <FaUserMd className="text-blue-600" />,
    badge: 'Doctor',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  nurse: {
    icon: <FaUserNurse className="text-teal-600" />,
    badge: 'Nurse',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  nanny: {
    icon: <FaBaby className="text-pink-600" />,
    badge: 'Childcare',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  medicine: {
    icon: <FaPills className="text-green-600" />,
    badge: 'Medicine',
    badgeColor: 'bg-green-50 text-green-700 border-green-200',
  },
}

function ResultCard({ result }: { result: UnifiedSearchResult }) {
  const config = TYPE_CONFIG[result.type] || TYPE_CONFIG.doctor

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            {result.profileImage ? (
              <Image
                src={result.profileImage}
                alt={result.name}
                width={56}
                height={56}
                className="rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
                {config.icon}
              </div>
            )}
            {result.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-white rounded-full p-0.5">
                <FaCheckCircle className="text-[10px]" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{result.name}</h3>
            <p className="text-sm text-blue-600 font-medium truncate">
              {result.specialty.slice(0, 2).join(', ')}
            </p>
            {/* Type badge + category */}
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${config.badgeColor}`}>
                {config.badge}
              </span>
              {result.category && result.type !== 'medicine' && (
                <span className="text-[10px] text-gray-400">{result.category}</span>
              )}
            </div>
          </div>
        </div>

        {/* Rating + Location */}
        <div className="space-y-1.5 mb-3">
          {result.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(result.rating))].map((_, i) => (
                  <FaStar key={i} className="text-[10px]" />
                ))}
                {result.rating % 1 >= 0.5 && <FaStar className="text-[10px] opacity-50" />}
              </div>
              <span className="text-xs font-semibold text-gray-700">{result.rating.toFixed(1)}</span>
              {result.reviewCount > 0 && (
                <span className="text-xs text-gray-400">({result.reviewCount})</span>
              )}
            </div>
          )}
          {result.city && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaMapMarkerAlt className="text-[10px] text-gray-400" />
              <span className="truncate">{result.city}</span>
            </div>
          )}
          {result.languages.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <FaLanguage className="text-[10px] text-gray-400" />
              <span className="truncate">{result.languages.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Availability Status */}
        <div className="mb-3">
          <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${
            result.available
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {result.available ? (
              <>
                <FaCheckCircle className="text-[10px]" />
                <span>{result.nextAvailable === 'Available Today' || result.nextAvailable === 'In Stock' ? result.nextAvailable : `Next: ${result.nextAvailable}`}</span>
              </>
            ) : (
              <>
                <FaClock className="text-[10px]" />
                <span>Next: {result.nextAvailable}</span>
              </>
            )}
          </div>
        </div>

        {/* Consultation types (for providers) */}
        {result.type !== 'medicine' && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.consultationTypes.includes('In-Person') && (
              <span className="flex items-center gap-1 text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200">
                <FaHome className="text-[8px]" />
                In-Person
              </span>
            )}
            {result.consultationTypes.includes('Video Consultation') && (
              <span className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded border border-purple-200">
                <FaVideo className="text-[8px]" />
                Video
              </span>
            )}
            {result.emergencyAvailable && (
              <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200">
                <FaExclamationCircle className="text-[8px]" />
                Emergency
              </span>
            )}
          </div>
        )}

        {/* Bio (truncated) */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{result.bio}</p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: Pricing + Actions */}
        <div className="pt-3 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between">
            <div>
              {result.consultationFee !== null && result.consultationFee > 0 && (
                <p className="text-base font-bold text-gray-900">
                  Rs {result.consultationFee.toLocaleString()}
                  {result.type === 'medicine' ? '' : <span className="text-xs font-normal text-gray-400"> /session</span>}
                </p>
              )}
              {result.videoConsultationFee !== null && result.videoConsultationFee > 0 && (
                <p className="text-xs text-gray-400">
                  Video: Rs {result.videoConsultationFee.toLocaleString()}
                </p>
              )}
            </div>
            <Link
              href={result.detailHref}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {result.type === 'medicine' ? 'View' : 'Details'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- Pagination ----

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Show up to 5 page numbers around current page
  const pages: number[] = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FaChevronLeft className="text-xs" />
        Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-9 h-9 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">1</button>
          {start > 2 && <span className="text-gray-400 text-sm">...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 text-sm">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-9 h-9 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  )
}

// ---- Main Component ----

interface SearchResultsProps {
  results: UnifiedSearchResult[]
  total: number
  page: number
  totalPages: number
  loading: boolean
  query: string
  onPageChange: (page: number) => void
  onClear: () => void
}

export default function SearchResults({
  results,
  total,
  page,
  totalPages,
  loading,
  query,
  onPageChange,
  onClear,
}: SearchResultsProps) {
  if (loading) {
    return <SearchResultsSkeleton />
  }

  if (results.length === 0) {
    return <NoResults query={query} onClear={onClear} />
  }

  return (
    <div>
      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{results.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{total}</span> results
          {query && <> for &quot;{query}&quot;</>}
        </p>
        {query && (
          <button onClick={onClear} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Clear filters
          </button>
        )}
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {results.map(result => (
          <ResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}
