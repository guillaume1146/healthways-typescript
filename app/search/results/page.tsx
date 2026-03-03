'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  FaSearch,
  FaUserMd,
  FaUserNurse,
  FaBaby,
  FaPills,
  FaAmbulance,
  FaFlask,
  FaClinicMedical,
  FaSpinner,
  FaArrowLeft,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface SearchResult {
  id: string
  label: string
  sublabel: string
  category: string
  href: string
  image?: string | null
}

const CATEGORY_ICONS: Record<string, IconType> = {
  doctors: FaUserMd,
  nurses: FaUserNurse,
  nannies: FaBaby,
  medicines: FaPills,
  pharmacy: FaClinicMedical,
  emergency: FaAmbulance,
  lab: FaFlask,
}

const CATEGORY_COLORS: Record<string, string> = {
  doctors: 'text-blue-600 bg-blue-50 border-blue-200',
  nurses: 'text-teal-600 bg-teal-50 border-teal-200',
  nannies: 'text-pink-600 bg-pink-50 border-pink-200',
  medicines: 'text-green-600 bg-green-50 border-green-200',
  pharmacy: 'text-purple-600 bg-purple-50 border-purple-200',
  emergency: 'text-red-600 bg-red-50 border-red-200',
  lab: 'text-amber-600 bg-amber-50 border-amber-200',
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Categories',
  doctors: 'Doctors',
  nurses: 'Nurses',
  nannies: 'Nannies / Childcare',
  medicines: 'Medicines',
  pharmacy: 'Pharmacies',
  emergency: 'Emergency Services',
  lab: 'Lab Tests',
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const categoryParam = searchParams.get('category') || 'all'

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(categoryParam)

  useEffect(() => {
    if (!query) {
      setResults([])
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/search/autocomplete?q=${encodeURIComponent(query)}&category=${activeCategory}&limit=20`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            setResults(data.data)
          }
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, activeCategory])

  // Group results by category
  const groupedResults = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <FaArrowLeft /> Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Search Results {query && <>for &quot;{query}&quot;</>}
          </h1>
          <p className="text-white/80">
            {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Filter Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === key
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <FaSpinner className="animate-spin text-3xl text-blue-600 mr-3" />
                <span className="text-gray-500">Searching across all categories...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
                <p className="text-gray-500 mb-6">
                  {query
                    ? `We couldn't find anything matching "${query}". Try different keywords.`
                    : 'Enter a search term to find doctors, medicines, and more.'}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaArrowLeft /> Back to Home
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {activeCategory === 'all' ? (
                  // Show grouped by category
                  Object.entries(groupedResults).map(([cat, items]) => {
                    const CatIcon = CATEGORY_ICONS[cat] || FaSearch
                    const colors = CATEGORY_COLORS[cat] || 'text-gray-600 bg-gray-50 border-gray-200'
                    return (
                      <div key={cat}>
                        <div className="flex items-center gap-2 mb-3">
                          <CatIcon className={colors.split(' ')[0]} />
                          <h2 className="text-lg font-semibold text-gray-900 capitalize">{cat}</h2>
                          <span className="text-xs text-gray-400">({items.length})</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {items.map(renderResultCard)}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  // Show flat list for specific category
                  <div className="grid sm:grid-cols-2 gap-3">
                    {results.map(renderResultCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function renderResultCard(result: SearchResult) {
  const CatIcon = CATEGORY_ICONS[result.category] || FaSearch
  const colors = CATEGORY_COLORS[result.category] || 'text-gray-600 bg-gray-50 border-gray-200'

  return (
    <Link
      key={`${result.category}-${result.id}`}
      href={result.href}
      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
        result.image ? '' : colors.split(' ')[1]
      }`}>
        {result.image ? (
          <Image
            src={result.image}
            alt={result.label}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <CatIcon className={`text-xl ${colors.split(' ')[0]}`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{result.label}</div>
        <div className="text-sm text-gray-500 truncate">{result.sublabel}</div>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border flex-shrink-0 ${colors}`}>
        {result.category}
      </span>
    </Link>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}
