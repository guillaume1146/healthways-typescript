'use client'

import { useState, useEffect, useCallback } from 'react'
import AuthBookingLink from '@/components/booking/AuthBookingLink'
import { FaSearch, FaFlask, FaStar, FaMapMarkerAlt, FaClock,FaCheckCircle, FaStarHalfAlt, FaShoppingCart, FaLock,  FaHome, FaExclamationTriangle, FaCertificate, FaHeadset,  FaHeart,  FaBaby, FaHandHoldingMedical,  FaVial, FaPercent,  FaUserMd,  FaFileAlt, FaTint, FaMicroscope, FaViruses, FaAmbulance,  FaClipboardList } from 'react-icons/fa'

interface ApiLabTest {
  id: string
  testName?: string
  category?: string
  price?: number | string
  description?: string
  sampleType?: string
  preparation?: string
  turnaroundTime?: string
  lab?: string
  labTechnician?: { verified?: boolean }
}

function mapApiTestToUi(apiTest: ApiLabTest) {
  const price = Number(apiTest.price) || 0
  const originalPrice = Math.round(price * 1.2)
  const discountPct = Math.round(((originalPrice - price) / originalPrice) * 100)
  return {
    id: apiTest.id,
    name: apiTest.testName,
    category: apiTest.category,
    type: apiTest.category,
    price: `Rs ${price}`,
    originalPrice: `Rs ${originalPrice}`,
    discount: `${discountPct}% OFF`,
    rating: 4.7 + Math.random() * 0.3,
    reviews: Math.floor(500 + Math.random() * 2000),
    available: true,
    description: apiTest.description || 'Lab test provided by a certified laboratory',
    sampleType: apiTest.sampleType || 'Blood',
    fastingRequired: (apiTest.preparation || '').toLowerCase().includes('fast'),
    resultTime: apiTest.turnaroundTime || 'Same day',
    preparation: apiTest.preparation || 'No special preparation required',
    labLocation: apiTest.lab || 'Mauritius',
    homeCollection: true,
    popularity: 'Standard',
    reportDelivery: 'Digital + Physical',
    verified: apiTest.labTechnician?.verified ?? true,
    testCode: `TEST-${String(apiTest.id).slice(0, 8).toUpperCase()}`,
    components: [] as string[],
    clinicalUse: [] as string[],
    normalRange: 'See report',
    turnaroundTime: apiTest.turnaroundTime || 'Same day',
    bookings: Math.floor(200 + Math.random() * 1500),
    features: ['Digital Report', 'Home Collection'],
  }
}

// Test category icons mapping
const categoryIcons = {
  "Hematology": FaTint,
  "Biochemistry": FaMicroscope,
  "Hormones": FaHeart,
  "Diabetes": FaHandHoldingMedical,
  "Vitamins": FaUserMd,
  "Infectious Disease": FaViruses,
  "Cardiology": FaHeart,
  "Allergy": FaExclamationTriangle,
  "Cancer Screening": FaLock,
  "Pregnancy": FaBaby
}

// Lab Test Card Component
interface LabTestProps {
  test: ReturnType<typeof mapApiTestToUi>
}

const LabTestCard = ({ test }: LabTestProps) => {
  const CategoryIcon = categoryIcons[test.category as keyof typeof categoryIcons] || FaFlask
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header with Icon and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-lg border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
              <CategoryIcon className="text-3xl text-purple-600" />
            </div>
            {test.homeCollection && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <FaHome className="text-white text-xs" />
              </div>
            )}
            {test.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{test.name}</h3>
            <p className="text-purple-600 font-medium flex items-center gap-2">
              <CategoryIcon className="text-sm" />
              {test.category}
            </p>
            <p className="text-gray-600 text-sm">{test.testCode}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(test.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {test.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{test.rating}</span>
              <span className="text-sm text-gray-500">({test.reviews})</span>
            </div>
          </div>
        </div>
        
        {/* Popularity and Type Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
            {test.category}
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {test.popularity}
          </span>
          {test.fastingRequired && (
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
              Fasting Required
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
        
        {/* Components */}
        <div className="mb-3">
          <span className="text-xs text-gray-500 block mb-1">Test Components:</span>
          <div className="flex flex-wrap gap-1">
            {test.components.slice(0, 3).map((component, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {component}
              </span>
            ))}
            {test.components.length > 3 && (
              <span className="text-xs text-gray-500">+{test.components.length - 3} more</span>
            )}
          </div>
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaVial className="text-purple-500" />
            <span>{test.sampleType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-blue-500" />
            <span>{test.resultTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-green-500" />
            <span>{test.labLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaClipboardList className="text-orange-500" />
            <span>{test.bookings} bookings</span>
          </div>
        </div>
        
        {/* Service Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {test.homeCollection && (
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaHome />
              <span>Home Collection</span>
            </div>
          )}
          {test.verified && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FaCheckCircle />
              <span>Verified Lab</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
            <FaPercent />
            <span>{test.discount}</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
            <FaFileAlt />
            <span>{test.reportDelivery}</span>
          </div>
        </div>
        
        {/* Availability Status */}
        <div className="mb-4">
          {test.available ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <FaCheckCircle className="text-xs" />
              Available Today
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1">
              <FaExclamationTriangle className="text-xs" />
              Temporarily Unavailable
            </span>
          )}
        </div>
        
        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{test.price}</p>
              <span className="text-sm text-gray-500 line-through">{test.originalPrice}</span>
            </div>
            <p className="text-xs text-green-600 font-medium">{test.discount}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
              Details
            </button>
            <AuthBookingLink type="lab-test" providerId={test.id} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 text-sm">
              <FaShoppingCart />
              Book Test
            </AuthBookingLink>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading Animation Component
const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
        <FaFlask className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is finding the best lab tests for you...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  )
}

// Empty State Component
interface EmptyStateProps {
  onClear: () => void
}

const EmptyState = ({ onClear }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <FaFlask className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No lab tests found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all categories</p>
      <button 
        onClick={onClear}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}

// Main Component
export default function LabTestingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [allLabTests, setAllLabTests] = useState<ReturnType<typeof mapApiTestToUi>[]>([])
  const [searchResults, setSearchResults] = useState<ReturnType<typeof mapApiTestToUi>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  const [cartCount] = useState(2)
  const [searchExamples] = useState([
    "Blood sugar test for diabetes",
    "Cholesterol check",
    "Complete blood count",
    "Thyroid function test",
    "Vitamin D deficiency",
    "COVID-19 test for travel"
  ])

  const fetchLabTests = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/search/lab-tests')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map(mapApiTestToUi)
        setAllLabTests(mapped)
        setSearchResults(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch lab tests:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLabTests()
  }, [fetchLabTests])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (category && category !== 'all') params.set('category', category)
      const res = await fetch(`/api/search/lab-tests?${params.toString()}`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setSearchResults(json.data.map(mapApiTestToUi))
      } else {
        setSearchResults([])
      }
    } catch (err) {
      console.error('Search failed:', err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategory('all')
    setSearchResults(allLabTests)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Lab Tests & Diagnostics</h1>
          <p className="text-xl text-purple-100">
            AI-powered search for accurate lab tests with home collection across Mauritius
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCheckCircle className="text-green-300" />
              <span>NABL Certified Labs</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaHome className="text-blue-300" />
              <span>Home Collection</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaFileAlt className="text-yellow-300" />
              <span>Digital Reports</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaHeadset className="text-orange-300" />
              <span>Expert Consultation</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-10">
            <div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lab tests by name, condition, or symptoms (e.g., 'diabetes test', 'cholesterol check')"
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-lg"
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                {/* Example Searches */}
                {!hasSearched && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Popular searches:</span>
                    {searchExamples.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-4">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="hematology">Blood Tests</option>
                    <option value="biochemistry">Biochemistry</option>
                    <option value="hormones">Hormone Tests</option>
                    <option value="diabetes">Diabetes Tests</option>
                    <option value="vitamins">Vitamin Tests</option>
                    <option value="infectious">Infectious Disease</option>
                    <option value="cardiology">Heart Health</option>
                  </select>
                  
                  <button 
                    type="button"
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    <FaSearch />
                    Find Tests
                  </button>
                  
                  <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium flex items-center gap-2">
                    <FaShoppingCart />
                    Cart ({cartCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaFlask className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">500+</p>
            <p className="text-sm text-gray-600">Lab Tests</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaHome className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">Free</p>
            <p className="text-sm text-gray-600">Home Collection</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaClock className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">Same Day</p>
            <p className="text-sm text-gray-600">Results</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaCertificate className="text-3xl text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Accurate</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <FaUserMd className="text-blue-600 text-xl mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Medical Advisory</h4>
              <p className="text-sm text-blue-700">
                Lab tests should be ordered based on medical consultation. Some tests may require  prescription of doctor. 
                Consult with our expert pathologists for test recommendations and result interpretation.
              </p>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="mt-12">
          {isLoading || isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> lab tests matching your search
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
                {searchResults.map((test) => (
                  <LabTestCard key={test.id} test={test} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        {/* Test Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaTint className="text-3xl text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Blood Tests</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaHeart className="text-3xl text-pink-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Heart Health</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaHandHoldingMedical className="text-3xl text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Diabetes</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaUserMd className="text-3xl text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Vitamins</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaViruses className="text-3xl text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Infectious</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaMicroscope className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Hormones</h3>
            </div>
          </div>
        </div>
        
        {/* Test Packages */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Health Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-100">
              <div className="text-center mb-4">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaHeart className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Basic Health Checkup</h3>
                <p className="text-gray-600 text-sm">Essential tests for overall health monitoring</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>CBC + ESR</span>
                  <span>Rs 800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lipid Profile</span>
                  <span>Rs 1200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Blood Sugar</span>
                  <span>Rs 400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kidney Function</span>
                  <span>Rs 1300</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 line-through">Rs 3700</span>
                  <span className="text-xl font-bold text-blue-600">Rs 2500</span>
                </div>
                <span className="text-green-600 text-sm font-medium">Save Rs 1200</span>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Book Package
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-purple-100">
              <div className="text-center mb-4">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaFlask className="text-2xl text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Package</h3>
                <p className="text-gray-600 text-sm">Complete health assessment with major tests</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Full Body Checkup</span>
                  <span>Rs 4000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thyroid Panel</span>
                  <span>Rs 1500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vitamin Profile</span>
                  <span>Rs 2500</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cancer Markers</span>
                  <span>Rs 3000</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 line-through">Rs 11000</span>
                  <span className="text-xl font-bold text-purple-600">Rs 7500</span>
                </div>
                <span className="text-green-600 text-sm font-medium">Save Rs 3500</span>
                <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Book Package
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-100">
              <div className="text-center mb-4">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <FaHandHoldingMedical className="text-2xl text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Diabetes Care Package</h3>
                <p className="text-gray-600 text-sm">Specialized tests for diabetes management</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>HbA1c</span>
                  <span>Rs 1000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fasting Glucose</span>
                  <span>Rs 400</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lipid Profile</span>
                  <span>Rs 1200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kidney Function</span>
                  <span>Rs 1300</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 line-through">Rs 3900</span>
                  <span className="text-xl font-bold text-green-600">Rs 2800</span>
                </div>
                <span className="text-green-600 text-sm font-medium">Save Rs 1100</span>
                <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Book Package
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Lab Testing Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Select Tests</h3>
              <p className="text-sm text-gray-600">Choose from 500+ lab tests or health packages</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule home collection or visit our lab centers</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Sample Collection</h3>
              <p className="text-sm text-gray-600">Trained phlebotomists collect samples safely</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Reports</h3>
              <p className="text-sm text-gray-600">Receive accurate digital reports with doctor consultation</p>
            </div>
          </div>
        </div>
        
        {/* Lab Services */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaUserMd className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Doctor Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">Free consultation with specialist doctors for report interpretation</p>
              <button className="text-blue-600 font-medium text-sm">Consult Now →</button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaHome className="text-4xl text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Home Collection</h3>
              <p className="text-gray-600 text-sm mb-4">Convenient sample collection at your home with trained professionals</p>
              <button className="text-green-600 font-medium text-sm">Schedule Now →</button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaFileAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Digital Reports</h3>
              <p className="text-gray-600 text-sm mb-4">Secure digital reports accessible anytime with trend analysis</p>
              <button className="text-purple-600 font-medium text-sm">View Sample →</button>
            </div>
          </div>
        </div>
        
        {/* Customer Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Patient Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Quick and accurate results. Home collection was very convenient and professional.</p>
              <p className="font-semibold text-gray-900">- Ramesh K.</p>
              <p className="text-xs text-gray-500">Port Louis</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Excellent service! Got my diabetes panel results the same day with doctor consultation.</p>
              <p className="font-semibold text-gray-900">- Anjali P.</p>
              <p className="text-xs text-gray-500">Curepipe</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Very affordable packages and transparent pricing. Digital reports are very detailed.</p>
              <p className="font-semibold text-gray-900">- David L.</p>
              <p className="text-xs text-gray-500">Rose Hill</p>
            </div>
          </div>
        </div>
        
        {/* Emergency Testing Banner */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Emergency Lab Tests?</h2>
          <p className="text-red-100 mb-6">
            Our 24/7 emergency lab service provides critical test results when you need them most. 
            Immediate collection and rapid processing for urgent medical situations.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
              <FaAmbulance />
              Emergency Testing
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-red-700 transition-colors">
              Call Hotline
            </button>
          </div>
        </div>
        
        {/* Lab Partner Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a diagnostic lab?</h2>
          <p className="text-blue-100 mb-6">
            Partner with us to expand your reach and serve more patients across Mauritius. 
            Join our network of certified laboratories and grow your business.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Become a Partner →
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}