'use client'

import { useState } from 'react'
import { FaSearch, FaShieldAlt, FaStar, FaMapMarkerAlt, FaClock, FaTruck, FaCheckCircle, FaStarHalfAlt, FaShoppingCart, FaLock, FaPhoneAlt, FaHome, FaExclamationTriangle, FaCertificate, FaHeadset, FaUndo, FaHeart, FaBrain, FaBaby, FaEye, FaTooth, FaBone, FaThermometerHalf, FaHandHoldingMedical, FaMedkit, FaVial, FaPercent, FaTags, FaUserMd, FaIdCard, FaFileAlt, FaTint, FaMicroscope, FaViruses, FaAmbulance, FaCalendarAlt, FaClipboardList, FaBuilding, FaUsers, FaMoneyBillWave, FaUserShield, FaClipboardCheck, FaCreditCard, FaCalculator, FaGift } from 'react-icons/fa'

const mockInsurancePlans = [
  {
    id: 1,
    name: "Premium Health Plus",
    provider: "Mauritius Health Insurance",
    type: "Individual",
    coverage: "Comprehensive",
    monthlyPremium: "Rs 3,500",
    annualPremium: "Rs 38,000",
    originalPrice: "Rs 45,000",
    discount: "16% OFF",
    rating: 4.9,
    reviews: 2341,
    available: true,
    description: "Comprehensive health coverage including hospitalization, outpatient care, and specialist consultations",
    maxCoverage: "Rs 2,000,000",
    deductible: "Rs 10,000",
    copay: "Rs 500",
    networkHospitals: 85,
    waitingPeriod: "30 days",
    claimSettlement: "98.5%",
    renewalBonus: "10% annually",
    location: "Mauritius Wide",
    features: ["Cashless Treatment", "No Sub-limits", "Maternity Cover"],
    benefits: [
      { name: "Hospitalization", coverage: "100%", limit: "Rs 2,000,000" },
      { name: "OPD Consultation", coverage: "80%", limit: "Rs 50,000" },
      { name: "Medicines", coverage: "75%", limit: "Rs 30,000" },
      { name: "Lab Tests", coverage: "90%", limit: "Rs 25,000" }
    ],
    exclusions: ["Pre-existing conditions (first 2 years)", "Cosmetic surgery", "Dental procedures"],
    ageLimit: "18-65 years",
    familyDiscount: "25%",
    verified: true,
    fastProcessing: true,
    onlineQuote: true,
    customerService: "24/7"
  },
  {
    id: 2,
    name: "Family Care Shield",
    provider: "Swan Life Insurance",
    type: "Family",
    coverage: "Standard",
    monthlyPremium: "Rs 6,800",
    annualPremium: "Rs 75,000",
    originalPrice: "Rs 90,000",
    discount: "17% OFF",
    rating: 4.8,
    reviews: 1876,
    available: true,
    description: "Complete family health protection covering up to 6 members with extensive network coverage",
    maxCoverage: "Rs 5,000,000",
    deductible: "Rs 15,000",
    copay: "Rs 750",
    networkHospitals: 120,
    waitingPeriod: "90 days",
    claimSettlement: "96.2%",
    renewalBonus: "15% annually",
    location: "Indian Ocean Region",
    features: ["Family Floater", "Preventive Care", "Emergency Evacuation"],
    benefits: [
      { name: "Hospitalization", coverage: "100%", limit: "Rs 5,000,000" },
      { name: "Maternity", coverage: "100%", limit: "Rs 200,000" },
      { name: "Emergency", coverage: "100%", limit: "Rs 500,000" },
      { name: "Preventive Care", coverage: "100%", limit: "Rs 15,000" }
    ],
    exclusions: ["Adventure sports", "War and terrorism", "Substance abuse"],
    ageLimit: "0-70 years",
    familyDiscount: "30%",
    verified: true,
    fastProcessing: true,
    onlineQuote: true,
    customerService: "Business Hours"
  },
  {
    id: 3,
    name: "Senior Citizen Care",
    provider: "State Insurance Mauritius",
    type: "Senior",
    coverage: "Specialized",
    monthlyPremium: "Rs 4,200",
    annualPremium: "Rs 48,000",
    originalPrice: "Rs 60,000",
    discount: "20% OFF",
    rating: 4.7,
    reviews: 1432,
    available: true,
    description: "Specialized health insurance for senior citizens with no upper age limit and chronic disease coverage",
    maxCoverage: "Rs 1,500,000",
    deductible: "Rs 8,000",
    copay: "Rs 300",
    networkHospitals: 95,
    waitingPeriod: "60 days",
    claimSettlement: "97.8%",
    renewalBonus: "5% annually",
    location: "Mauritius",
    features: ["No Age Limit", "Chronic Disease", "Home Care"],
    benefits: [
      { name: "Hospitalization", coverage: "100%", limit: "Rs 1,500,000" },
      { name: "Chronic Conditions", coverage: "90%", limit: "Rs 100,000" },
      { name: "Home Nursing", coverage: "80%", limit: "Rs 50,000" },
      { name: "Physiotherapy", coverage: "75%", limit: "Rs 20,000" }
    ],
    exclusions: ["Mental illness", "Congenital disorders", "Assisted reproduction"],
    ageLimit: "55+ years",
    familyDiscount: "20%",
    verified: true,
    fastProcessing: false,
    onlineQuote: true,
    customerService: "24/7"
  },
  {
    id: 4,
    name: "Basic Health Cover",
    provider: "Mauritius Union Insurance",
    type: "Individual",
    coverage: "Basic",
    monthlyPremium: "Rs 1,800",
    annualPremium: "Rs 20,000",
    originalPrice: "Rs 25,000",
    discount: "20% OFF",
    rating: 4.5,
    reviews: 2103,
    available: true,
    description: "Affordable basic health coverage for essential medical needs and emergency situations",
    maxCoverage: "Rs 500,000",
    deductible: "Rs 5,000",
    copay: "Rs 200",
    networkHospitals: 45,
    waitingPeriod: "30 days",
    claimSettlement: "95.1%",
    renewalBonus: "5% annually",
    location: "Urban Areas",
    features: ["Affordable Premium", "Quick Claims", "Emergency Cover"],
    benefits: [
      { name: "Hospitalization", coverage: "80%", limit: "Rs 500,000" },
      { name: "Emergency", coverage: "100%", limit: "Rs 100,000" },
      { name: "Surgery", coverage: "90%", limit: "Rs 300,000" },
      { name: "Ambulance", coverage: "100%", limit: "Rs 5,000" }
    ],
    exclusions: ["OPD treatments", "Dental care", "Eye glasses"],
    ageLimit: "18-60 years",
    familyDiscount: "15%",
    verified: true,
    fastProcessing: true,
    onlineQuote: true,
    customerService: "Business Hours"
  },
  {
    id: 5,
    name: "Corporate Group Health",
    provider: "La Prudence Insurance",
    type: "Corporate",
    coverage: "Group",
    monthlyPremium: "Rs 2,500",
    annualPremium: "Rs 28,000",
    originalPrice: "Rs 35,000",
    discount: "20% OFF",
    rating: 4.6,
    reviews: 892,
    available: true,
    description: "Comprehensive group health insurance for employees with corporate wellness benefits",
    maxCoverage: "Rs 1,000,000",
    deductible: "Rs 7,500",
    copay: "Rs 400",
    networkHospitals: 75,
    waitingPeriod: "0 days",
    claimSettlement: "99.2%",
    renewalBonus: "12% annually",
    location: "Corporate Network",
    features: ["Group Benefits", "Wellness Program", "No Waiting Period"],
    benefits: [
      { name: "Hospitalization", coverage: "100%", limit: "Rs 1,000,000" },
      { name: "OPD", coverage: "70%", limit: "Rs 25,000" },
      { name: "Health Checkup", coverage: "100%", limit: "Rs 10,000" },
      { name: "Vaccination", coverage: "100%", limit: "Rs 5,000" }
    ],
    exclusions: ["Non-medical expenses", "Experimental treatments", "Luxury treatments"],
    ageLimit: "18-65 years",
    familyDiscount: "40%",
    verified: true,
    fastProcessing: true,
    onlineQuote: false,
    customerService: "24/7"
  },
  {
    id: 6,
    name: "Maternity & Child Care",
    provider: "Angel Insurance Mauritius",
    type: "Specialized",
    coverage: "Maternity",
    monthlyPremium: "Rs 2,200",
    annualPremium: "Rs 25,000",
    originalPrice: "Rs 32,000",
    discount: "22% OFF",
    rating: 4.8,
    reviews: 1567,
    available: true,
    description: "Specialized coverage for maternity, newborn care, and pediatric treatments",
    maxCoverage: "Rs 800,000",
    deductible: "Rs 3,000",
    copay: "Rs 300",
    networkHospitals: 65,
    waitingPeriod: "12 months",
    claimSettlement: "97.5%",
    renewalBonus: "8% annually",
    location: "Mother & Child Hospitals",
    features: ["Maternity Cover", "Newborn Care", "Vaccination"],
    benefits: [
      { name: "Delivery", coverage: "100%", limit: "Rs 150,000" },
      { name: "Prenatal Care", coverage: "90%", limit: "Rs 25,000" },
      { name: "Newborn Care", coverage: "100%", limit: "Rs 100,000" },
      { name: "Pediatric Care", coverage: "85%", limit: "Rs 50,000" }
    ],
    exclusions: ["Multiple births above twins", "IVF treatments", "Genetic disorders"],
    ageLimit: "18-45 years",
    familyDiscount: "25%",
    verified: true,
    fastProcessing: false,
    onlineQuote: true,
    customerService: "Business Hours"
  }
]

// Insurance type icons mapping
const typeIcons = {
  "Individual": FaUserShield,
  "Family": FaUsers,
  "Senior": FaHeart,
  "Corporate": FaBuilding,
  "Specialized": FaBaby,
  "Group": FaHandHoldingMedical
}

// AI search simulation function
const aiSearchInsurance = (query: string, type: string, budget: string) => {
  return new Promise<typeof mockInsurancePlans>((resolve) => {
    setTimeout(() => {
      let results = [...mockInsurancePlans]
      
      if (type !== 'all') {
        results = results.filter(plan => 
          plan.type.toLowerCase().includes(type.toLowerCase())
        )
      }
      
      if (budget !== 'all') {
        const budgetNum = parseInt(budget)
        results = results.filter(plan => {
          const premium = parseInt(plan.monthlyPremium.replace(/[^\d]/g, ''))
          if (budget === '2000') return premium <= 2000
          if (budget === '5000') return premium > 2000 && premium <= 5000
          if (budget === '10000') return premium > 5000 && premium <= 10000
          return premium > 10000
        })
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(plan => 
          plan.name.toLowerCase().includes(lowerQuery) ||
          plan.provider.toLowerCase().includes(lowerQuery) ||
          plan.description.toLowerCase().includes(lowerQuery) ||
          plan.features.some(f => f.toLowerCase().includes(lowerQuery)) ||
          plan.benefits.some(b => b.name.toLowerCase().includes(lowerQuery)) ||
          plan.coverage.toLowerCase().includes(lowerQuery)
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

// Insurance Plan Card Component
interface InsurancePlanProps {
  plan: typeof mockInsurancePlans[0]
}

const InsurancePlanCard = ({ plan }: InsurancePlanProps) => {
  const TypeIcon = typeIcons[plan.type as keyof typeof typeIcons] || FaShieldAlt
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header with Icon and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <TypeIcon className="text-3xl text-blue-600" />
            </div>
            {plan.fastProcessing && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <FaClock className="text-white text-xs" />
              </div>
            )}
            {plan.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="text-blue-600 font-medium flex items-center gap-2">
              <TypeIcon className="text-sm" />
              {plan.provider}
            </p>
            <p className="text-gray-600 text-sm">{plan.type} • {plan.coverage}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(plan.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {plan.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{plan.rating}</span>
              <span className="text-sm text-gray-500">({plan.reviews})</span>
            </div>
          </div>
        </div>
        
        {/* Type and Coverage Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {plan.type}
          </span>
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
            {plan.coverage} Coverage
          </span>
          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
            {plan.claimSettlement} Claims Settled
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
        
        {/* Key Benefits */}
        <div className="mb-3">
          <span className="text-xs text-gray-500 block mb-1">Key Benefits:</span>
          <div className="flex flex-wrap gap-1">
            {plan.benefits.slice(0, 3).map((benefit, index) => (
              <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                {benefit.name} ({benefit.coverage})
              </span>
            ))}
            {plan.benefits.length > 3 && (
              <span className="text-xs text-gray-500">+{plan.benefits.length - 3} more</span>
            )}
          </div>
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMoneyBillWave className="text-green-500" />
            <span>Max: {plan.maxCoverage}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaBuilding className="text-blue-500" />
            <span>{plan.networkHospitals} Hospitals</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-purple-500" />
            <span>{plan.waitingPeriod} waiting</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaGift className="text-orange-500" />
            <span>{plan.renewalBonus} bonus</span>
          </div>
        </div>
        
        {/* Service Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {plan.fastProcessing && (
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaClock />
              <span>Fast Processing</span>
            </div>
          )}
          {plan.verified && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FaCheckCircle />
              <span>Verified</span>
            </div>
          )}
          {plan.onlineQuote && (
            <div className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
              <FaCalculator />
              <span>Online Quote</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
            <FaPercent />
            <span>{plan.discount}</span>
          </div>
        </div>
        
        {/* Availability Status */}
        <div className="mb-4">
          {plan.available ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <FaCheckCircle className="text-xs" />
              Available for Enrollment
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1">
              <FaExclamationTriangle className="text-xs" />
              Currently Unavailable
            </span>
          )}
        </div>
        
        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{plan.monthlyPremium}</p>
              <span className="text-xs text-gray-500">/month</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">{plan.originalPrice}</span>
              <span className="text-xs text-green-600 font-medium">{plan.discount}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
              Compare
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center gap-2 text-sm">
              <FaShoppingCart />
              Get Quote
            </button>
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
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        <FaShieldAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is finding the best insurance plans for you...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No insurance plans found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all available plans</p>
      <button 
        onClick={onClear}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}

// Main Component
export default function InsurancePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [insuranceType, setInsuranceType] = useState('all')
  const [budget, setBudget] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(mockInsurancePlans)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchExamples] = useState([
    "Family health insurance",
    "Senior citizen coverage",
    "Maternity insurance plan",
    "Corporate group health",
    "Affordable health cover",
    "Comprehensive medical insurance"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    const results = await aiSearchInsurance(searchQuery, insuranceType, budget)
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setInsuranceType('all')
    setBudget('all')
    setSearchResults(mockInsurancePlans)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Health Insurance Plans</h1>
          <p className="text-xl text-blue-100">
            AI-powered search to find the perfect health insurance coverage for you and your family
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCheckCircle className="text-green-300" />
              <span>IRDAI Approved</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaLock className="text-yellow-300" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCalculator className="text-blue-300" />
              <span>Instant Quotes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaHeadset className="text-orange-300" />
              <span>Expert Guidance</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search insurance plans (e.g., 'family health insurance', 'senior citizen plan', 'maternity cover')"
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
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
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Insurance Types</option>
                    <option value="individual">Individual Plans</option>
                    <option value="family">Family Plans</option>
                    <option value="senior">Senior Citizen</option>
                    <option value="corporate">Corporate Group</option>
                    <option value="specialized">Specialized Plans</option>
                  </select>
                  
                  <select 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Budgets</option>
                    <option value="2000">Under Rs 2,000/month</option>
                    <option value="5000">Rs 2,000 - 5,000/month</option>
                    <option value="10000">Rs 5,000 - 10,000/month</option>
                    <option value="above">Above Rs 10,000/month</option>
                  </select>
                  
                  <button 
                    type="button"
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    <FaSearch />
                    Find Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaShieldAlt className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">200+</p>
            <p className="text-sm text-gray-600">Insurance Plans</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaBuilding className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">500+</p>
            <p className="text-sm text-gray-600">Network Hospitals</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaCheckCircle className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">98%</p>
            <p className="text-sm text-gray-600">Claim Settlement</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaUsers className="text-3xl text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">50,000+</p>
            <p className="text-sm text-gray-600">Happy Customers</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Important Insurance Advisory</h4>
              <p className="text-sm text-yellow-700">
                Health insurance is a crucial financial protection. Compare plans carefully, understand terms and conditions, 
                and consider your  specific health needs of family . Consult with our insurance experts for personalized advice.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          {isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> insurance plans matching your search
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((plan) => (
                  <InsurancePlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Types of Health Insurance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaUserShield className="text-3xl text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Individual</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaUsers className="text-3xl text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Family</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaHeart className="text-3xl text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Senior Citizen</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaBuilding className="text-3xl text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Corporate</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaBaby className="text-3xl text-pink-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Maternity</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaHandHoldingMedical className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Critical Illness</h3>
            </div>
          </div>
        </div>
        
        {/* Popular Insurance Packages */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Compare Popular Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Basic Plan</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900 bg-blue-100">Premium Plan</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Family Plan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 font-medium">Monthly Premium</td>
                  <td className="px-6 py-4 text-center">Rs 1,800</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Rs 3,500</td>
                  <td className="px-6 py-4 text-center">Rs 6,800</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-medium">Sum Insured</td>
                  <td className="px-6 py-4 text-center">Rs 5,00,000</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Rs 20,00,000</td>
                  <td className="px-6 py-4 text-center">Rs 50,00,000</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-medium">Hospitalization</td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><FaCheckCircle className="text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-medium">OPD Coverage</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center bg-blue-50"><FaCheckCircle className="text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-medium">Maternity Cover</td>
                  <td className="px-6 py-4 text-center">-</td>
                  <td className="px-6 py-4 text-center bg-blue-50">-</td>
                  <td className="px-6 py-4 text-center"><FaCheckCircle className="text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Network Hospitals</td>
                  <td className="px-6 py-4 text-center">45+</td>
                  <td className="px-6 py-4 text-center bg-blue-50">85+</td>
                  <td className="px-6 py-4 text-center">120+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* How Insurance Works */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Health Insurance Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Plan</h3>
              <p className="text-sm text-gray-600">Select the right insurance plan based on your needs and budget</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Pay Premium</h3>
              <p className="text-sm text-gray-600">Make regular premium payments to keep your policy active</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Treatment</h3>
              <p className="text-sm text-gray-600">Receive cashless treatment at network hospitals or get reimbursed</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">File Claims</h3>
              <p className="text-sm text-gray-600">Submit required documents for claim settlement if needed</p>
            </div>
          </div>
        </div>
        
        {/* Insurance Benefits */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Health Insurance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaMoneyBillWave className="text-4xl text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Financial Protection</h3>
              <p className="text-gray-600 text-sm mb-4">Protect yourself from high medical costs and unexpected health expenses</p>
              <button className="text-green-600 font-medium text-sm">Learn More →</button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaBuilding className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cashless Treatment</h3>
              <p className="text-gray-600 text-sm mb-4">Get treatment at network hospitals without paying upfront</p>
              <button className="text-blue-600 font-medium text-sm">Find Hospitals →</button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaCreditCard className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tax Benefits</h3>
              <p className="text-gray-600 text-sm mb-4">Save taxes up to Rs 75,000 under Section 80D of Income Tax Act</p>
              <button className="text-purple-600 font-medium text-sm">Calculate Tax →</button>
            </div>
          </div>
        </div>
        
        {/* Customer Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Excellent service! Got my claim settled within 3 days. The cashless treatment at Apollo was seamless.</p>
              <p className="font-semibold text-gray-900">- Rajesh M.</p>
              <p className="text-xs text-gray-500">Port Louis</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Great family coverage. The maternity benefits covered all our expenses during childbirth.</p>
              <p className="font-semibold text-gray-900">- Kavita S.</p>
              <p className="text-xs text-gray-500">Curepipe</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Affordable premiums with comprehensive coverage. Customer support is very helpful and responsive.</p>
              <p className="font-semibold text-gray-900">- David L.</p>
              <p className="text-xs text-gray-500">Rose Hill</p>
            </div>
          </div>
        </div>
        
        {/* Emergency Claims Banner */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need to File an Emergency Claim?</h2>
          <p className="text-red-100 mb-6">
            Our 24/7 claims assistance ensures you get help when you need it most. 
            Immediate support for emergency hospitalizations and urgent medical situations.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
              <FaAmbulance />
              Emergency Claims
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-red-700 transition-colors">
              Call Helpline
            </button>
          </div>
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you an insurance provider?</h2>
          <p className="text-green-100 mb-6">
            Partner with us to reach more customers and provide better healthcare access across Mauritius. 
            Join our network of trusted insurance providers.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
              Become a Partner →
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}