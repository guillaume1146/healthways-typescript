'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { type Nanny } from '@/lib/data'
import AuthBookingLink from '@/components/booking/AuthBookingLink'
import ConnectButton from '@/components/search/ConnectButton'
import MessageButton from '@/components/search/MessageButton'
import {
  FaSearch, FaBaby, FaStar, FaMapMarkerAlt, FaClock, FaCalendarAlt,
   FaGraduationCap,
   FaShieldAlt,  FaHome, FaLanguage, FaCheckCircle, FaExclamationCircle,
} from 'react-icons/fa'

interface NannyProps {
  nanny: Nanny
}

const NannyCard = ({ nanny }: NannyProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        {/* Nanny Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image 
              src={nanny.profileImage} 
              alt={`${nanny.firstName} ${nanny.lastName}`}
              width={80} 
              height={80}
              className="rounded-full object-cover border-4 border-purple-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${nanny.firstName}+${nanny.lastName}&background=random&color=fff&size=80`;
              }}
            />
            {nanny.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <FaCheckCircle className="text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {nanny.firstName} {nanny.lastName}
            </h3>
            <p className="text-purple-600 font-medium mb-2">
              {nanny.specialization.join(', ')}
            </p>
            
            {/* Age Groups Badge */}
            <div className="mb-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-pink-100 text-pink-700">
                {nanny.ageGroups.slice(0, 2).join(', ')}
                {nanny.ageGroups.length > 2 && ` +${nanny.ageGroups.length - 2} more`}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(nanny.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {nanny.rating % 1 !== 0 && <FaStar className="text-sm opacity-50" />}
              </div>
              <span className="text-sm font-semibold text-gray-700">{nanny.rating}</span>
              <span className="text-sm text-gray-500">({nanny.reviews} reviews)</span>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 mb-2">
              <FaLanguage className="text-purple-500 text-sm" />
              <span className="text-sm text-gray-600">{nanny.languages.slice(0, 2).join(', ')}</span>
              {nanny.languages.length > 2 && <span className="text-sm text-gray-400">+{nanny.languages.length - 2}</span>}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-500 text-sm" />
              <span className="text-sm text-gray-700">{nanny.location}</span>
            </div>
          </div>
        </div>

        {/* Service Types */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            {nanny.careTypes.includes("Full-time Care") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaHome className="text-green-600" />
                <span className="text-green-700 font-medium text-sm">Full-time</span>
              </div>
            )}
            {nanny.careTypes.includes("Part-time Care") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <FaClock className="text-purple-600" />
                <span className="text-purple-700 font-medium text-sm">Part-time</span>
              </div>
            )}
            {nanny.careTypes.includes("Date Night Sitting") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FaCalendarAlt className="text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">Date Night</span>
              </div>
            )}
            {nanny.careTypes.includes("Educational Support") && (
              <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <FaGraduationCap className="text-orange-600" />
                <span className="text-orange-700 font-medium text-sm">Educational</span>
              </div>
            )}
          </div>
          
          {/* Emergency Available - Fixed height container */}
          <div className="mt-2 h-10 flex items-center">
            {nanny.emergencyAvailable && (
              <div className="w-full flex items-center justify-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <FaExclamationCircle className="text-red-600" />
                <span className="text-red-700 font-medium text-sm">Emergency Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Availability */}
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FaClock className="text-purple-600" />
            <div>
              <p className="text-xs text-purple-600 font-medium">Next Available</p>
              <p className="text-sm font-semibold text-purple-800">{nanny.nextAvailable}</p>
            </div>
          </div>
        </div>

        {/* Spacer to push pricing/actions to bottom */}
        <div className="flex-1"></div>

        {/* Pricing & Actions - Fixed at bottom */}
        <div className="mt-auto">
          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Hourly Rate:</span>
              <span className="text-lg font-bold text-green-600">Rs {nanny.hourlyRate.toLocaleString()}/hr</span>
            </div>
            {nanny.overnightRate > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overnight:</span>
                <span className="text-lg font-bold text-green-600">Rs {nanny.overnightRate.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <Link href={`/search/childcare/${nanny.id}`} className="flex-1 min-w-[80px]">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Details
              </button>
            </Link>
            <AuthBookingLink type="nanny" providerId={nanny.id} className="flex-1 min-w-[80px] w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Book
            </AuthBookingLink>
            <MessageButton providerId={nanny.id} />
            <ConnectButton providerId={nanny.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingAnimation = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-3 text-gray-600">Finding the best nannies for you...</span>
  </div>
)

const EmptyState = ({ onClear }: { onClear: () => void }) => (
  <div className="text-center py-12">
    <FaBaby className="text-6xl text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No nannies found</h3>
    <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all available nannies</p>
    <button 
      onClick={onClear}
      className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
    >
      View All Nannies
    </button>
  </div>
)

export default function NanniesSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialization, setSpecialization] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Nanny[]>([])
  const [allNannies, setAllNannies] = useState<Nanny[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchExamples] = useState([
    "Find infant care specialist near me",
    "I need bilingual nanny for toddlers",
    "Looking for after school care",
    "Special needs childcare support",
    "Overnight baby care services",
    "Creative arts nanny available"
  ])

  const fetchNannies = useCallback(async (query = '', spec = '') => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (spec && spec !== 'all') params.set('specialization', spec)
    const res = await fetch(`/api/search/nannies?${params.toString()}`)
    const json = await res.json()
    return json.success ? json.data : []
  }, [])

  useEffect(() => {
    fetchNannies().then((data) => {
      setAllNannies(data)
      setSearchResults(data)
      setIsLoading(false)
    })
  }, [fetchNannies])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    const results = await fetchNannies(searchQuery, specialization)
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSpecialization('all')
    setSearchResults(allNannies)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Describe what you are looking for (e.g., 'infant care specialist', 'bilingual nanny', 'after school care')"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="all">All Specializations</option>
                  <option value="infant">Infant Care</option>
                  <option value="toddler">Toddler Development</option>
                  <option value="school">School Age Care</option>
                  <option value="special">Special Needs Care</option>
                  <option value="newborn">Newborn Care</option>
                  <option value="bilingual">Bilingual Education</option>
                  <option value="overnight">Overnight Care</option>
                  <option value="active">Active Play</option>
                  <option value="arts">Arts & Crafts</option>
                  <option value="emergency">Emergency Care</option>
                </select>
                
                <button 
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px] shadow-lg disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      Find Nannies
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Search Examples */}
            {!hasSearched && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {searchExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center border border-purple-100">
            <FaBaby className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{allNannies.length}+</p>
            <p className="text-sm text-gray-600">Verified Nannies</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-yellow-100">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-green-100">
            <FaShieldAlt className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Background Checked</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center border border-blue-100">
            <FaCheckCircle className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">97%</p>
            <p className="text-sm text-gray-600">Family Satisfaction</p>
          </div>
        </div>
        
        {/* Results */}
        <div className="mt-12">
          {isLoading || isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> nannies matching your criteria
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((nanny) => (
                  <NannyCard key={nanny.id} nanny={nanny} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
      </div>
    </div>
  )
}