'use client'

import { useState } from 'react'
import { FaSearch, FaPills, FaStar, FaMapMarkerAlt, FaClock, FaTruck, FaCheckCircle, FaStarHalfAlt, FaShoppingCart, FaLock, FaPhoneAlt, FaLeaf, FaExclamationTriangle, FaCertificate, FaHeadset, FaUndo, FaHeart, FaBrain, FaBaby, FaEye, FaTooth, FaBone, FaThermometerHalf, FaHandHoldingMedical, FaMedkit, FaVial, FaGift, FaPercent, FaTags, FaUserMd, FaIdCard, FaFileAlt } from 'react-icons/fa'

const mockMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    brand: "Tylenol",
    genericName: "Acetaminophen",
    category: "Pain Relief",
    type: "Over-the-counter",
    price: "Rs 45",
    originalPrice: "Rs 60",
    discount: "25% OFF",
    rating: 4.8,
    reviews: 1234,
    inStock: true,
    quantity: "Strip of 10 tablets",
    description: "Effective pain relief and fever reducer for headaches, muscle aches, and minor pain",
    image: "https://via.placeholder.com/150x150/4F46E5/ffffff?text=Pills",
    manufacturer: "GSK",
    expiryDate: "12/2025",
    prescriptionRequired: false,
    activeIngredient: "Paracetamol 500mg",
    sideEffects: ["Mild stomach upset", "Rare allergic reactions"],
    dosage: "1-2 tablets every 4-6 hours",
    maxDailyDose: "8 tablets per day",
    contraindications: ["Liver disease", "Alcohol dependence"],
    storage: "Store in cool, dry place",
    deliveryTime: "2-4 hours",
    fastDelivery: true,
    verified: true,
    pharmacyLocation: "Port Louis",
    features: ["Fast Acting", "Fever Reducer", "Safe for Adults"]
  },
  {
    id: 2,
    name: "Metformin 500mg",
    brand: "Glucophage",
    genericName: "Metformin HCl",
    category: "Diabetes",
    type: "Prescription",
    price: "Rs 180",
    originalPrice: "Rs 220",
    discount: "18% OFF",
    rating: 4.7,
    reviews: 892,
    inStock: true,
    quantity: "Strip of 15 tablets",
    description: "First-line treatment for type 2 diabetes, helps control blood sugar levels",
    image: "https://via.placeholder.com/150x150/059669/ffffff?text=MET",
    manufacturer: "Merck",
    expiryDate: "08/2025",
    prescriptionRequired: true,
    activeIngredient: "Metformin HCl 500mg",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
    dosage: "500mg twice daily with meals",
    maxDailyDose: "2000mg per day",
    contraindications: ["Kidney disease", "Heart failure"],
    storage: "Store at room temperature",
    deliveryTime: "Same day",
    fastDelivery: true,
    verified: true,
    pharmacyLocation: "Curepipe",
    features: ["Extended Release", "Doctor Approved", "Blood Sugar Control"]
  },
  {
    id: 3,
    name: "Amoxicillin 250mg",
    brand: "Amoxil",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    type: "Prescription",
    price: "Rs 120",
    originalPrice: "Rs 150",
    discount: "20% OFF",
    rating: 4.6,
    reviews: 567,
    inStock: true,
    quantity: "Bottle of 21 capsules",
    description: "Broad-spectrum antibiotic for bacterial infections",
    image: "https://via.placeholder.com/150x150/DC2626/ffffff?text=AMOX",
    manufacturer: "Pfizer",
    expiryDate: "03/2025",
    prescriptionRequired: true,
    activeIngredient: "Amoxicillin 250mg",
    sideEffects: ["Stomach upset", "Diarrhea", "Allergic reactions"],
    dosage: "250mg three times daily",
    maxDailyDose: "3000mg per day",
    contraindications: ["Penicillin allergy", "Kidney disease"],
    storage: "Store in refrigerator",
    deliveryTime: "1-2 hours",
    fastDelivery: true,
    verified: true,
    pharmacyLocation: "Rose Hill",
    features: ["Broad Spectrum", "Fast Acting", "Doctor Prescribed"]
  },
  {
    id: 4,
    name: "Vitamin D3 1000 IU",
    brand: "Nature Made",
    genericName: "Cholecalciferol",
    category: "Vitamins",
    type: "Supplement",
    price: "Rs 280",
    originalPrice: "Rs 350",
    discount: "20% OFF",
    rating: 4.9,
    reviews: 745,
    inStock: true,
    quantity: "Bottle of 90 softgels",
    description: "Essential vitamin for bone health and immune system support",
    image: "https://via.placeholder.com/150x150/F59E0B/ffffff?text=VIT",
    manufacturer: "Nature Made",
    expiryDate: "06/2026",
    prescriptionRequired: false,
    activeIngredient: "Vitamin D3 1000 IU",
    sideEffects: ["Rare: nausea if overdosed"],
    dosage: "1 softgel daily with food",
    maxDailyDose: "1 softgel per day",
    contraindications: ["Hypercalcemia", "Kidney stones"],
    storage: "Store in cool, dry place",
    deliveryTime: "4-6 hours",
    fastDelivery: false,
    verified: true,
    pharmacyLocation: "Quatre Bornes",
    features: ["High Potency", "Bone Health", "Immune Support"]
  },
  {
    id: 5,
    name: "Omeprazole 20mg",
    brand: "Prilosec",
    genericName: "Omeprazole",
    category: "Digestive Health",
    type: "Over-the-counter",
    price: "Rs 95",
    originalPrice: "Rs 120",
    discount: "21% OFF",
    rating: 4.7,
    reviews: 423,
    inStock: true,
    quantity: "Strip of 14 capsules",
    description: "Proton pump inhibitor for acid reflux and heartburn relief",
    image: "https://via.placeholder.com/150x150/8B5CF6/ffffff?text=OMEP",
    manufacturer: "AstraZeneca",
    expiryDate: "09/2025",
    prescriptionRequired: false,
    activeIngredient: "Omeprazole 20mg",
    sideEffects: ["Headache", "Nausea", "Diarrhea"],
    dosage: "1 capsule daily before breakfast",
    maxDailyDose: "1 capsule per day",
    contraindications: ["Liver disease", "Osteoporosis"],
    storage: "Store at room temperature",
    deliveryTime: "3-5 hours",
    fastDelivery: false,
    verified: true,
    pharmacyLocation: "Grand Baie",
    features: ["24-Hour Relief", "Acid Control", "Heartburn Treatment"]
  },
  {
    id: 6,
    name: "Ibuprofen 400mg",
    brand: "Advil",
    genericName: "Ibuprofen",
    category: "Pain Relief",
    type: "Over-the-counter",
    price: "Rs 65",
    originalPrice: "Rs 80",
    discount: "19% OFF",
    rating: 4.5,
    reviews: 891,
    inStock: true,
    quantity: "Strip of 20 tablets",
    description: "Non-steroidal anti-inflammatory drug for pain and inflammation",
    image: "https://via.placeholder.com/150x150/EF4444/ffffff?text=IBU",
    manufacturer: "Pfizer",
    expiryDate: "11/2025",
    prescriptionRequired: false,
    activeIngredient: "Ibuprofen 400mg",
    sideEffects: ["Stomach irritation", "Dizziness", "Headache"],
    dosage: "1 tablet every 6-8 hours",
    maxDailyDose: "3 tablets per day",
    contraindications: ["Stomach ulcers", "Heart disease"],
    storage: "Store below 25°C",
    deliveryTime: "2-4 hours",
    fastDelivery: true,
    verified: true,
    pharmacyLocation: "Vacoas",
    features: ["Anti-inflammatory", "Pain Relief", "Fever Reducer"]
  }
]

// Category icons mapping
const categoryIcons = {
  "Pain Relief": FaHandHoldingMedical,
  "Diabetes": FaHeart,
  "Antibiotics": FaLock,
  "Vitamins": FaLeaf,
  "Digestive Health": FaMedkit,
  "Heart Health": FaHeart,
  "Mental Health": FaBrain,
  "Children's Health": FaBaby,
  "Eye Care": FaEye,
  "Dental Care": FaTooth,
  "Bone Health": FaBone
}

// AI search simulation function
const aiSearchMedicines = (query: string, category: string) => {
  return new Promise<typeof mockMedicines>((resolve) => {
    setTimeout(() => {
      let results = [...mockMedicines]
      
      if (category !== 'all') {
        results = results.filter(medicine => 
          medicine.category.toLowerCase().includes(category.toLowerCase())
        )
      }
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        results = results.filter(medicine => 
          medicine.name.toLowerCase().includes(lowerQuery) ||
          medicine.brand.toLowerCase().includes(lowerQuery) ||
          medicine.genericName.toLowerCase().includes(lowerQuery) ||
          medicine.category.toLowerCase().includes(lowerQuery) ||
          medicine.description.toLowerCase().includes(lowerQuery) ||
          medicine.activeIngredient.toLowerCase().includes(lowerQuery) ||
          medicine.features.some(f => f.toLowerCase().includes(lowerQuery))
        )
      }
      
      resolve(results)
    }, 1500)
  })
}

// Medicine Card Component
interface MedicineProps {
  medicine: typeof mockMedicines[0]
}

const MedicineCard = ({ medicine }: MedicineProps) => {
  const CategoryIcon = categoryIcons[medicine.category as keyof typeof categoryIcons] || FaPills
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header with Image and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center"
              style={{ backgroundImage: `url(${medicine.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <FaPills className="text-3xl text-blue-400 opacity-0" />
            </div>
            {medicine.fastDelivery && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <FaTruck className="text-white text-xs" />
              </div>
            )}
            {medicine.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <FaCheckCircle className="text-white text-xs" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{medicine.name}</h3>
            <p className="text-blue-600 font-medium flex items-center gap-2">
              <CategoryIcon className="text-sm" />
              {medicine.brand}
            </p>
            <p className="text-gray-600 text-sm">{medicine.genericName}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-500">
                {[...Array(Math.floor(medicine.rating))].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
                {medicine.rating % 1 !== 0 && <FaStarHalfAlt className="text-sm" />}
              </div>
              <span className="text-sm font-medium text-gray-700">{medicine.rating}</span>
              <span className="text-sm text-gray-500">({medicine.reviews})</span>
            </div>
          </div>
        </div>
        
        {/* Category and Type Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
            {medicine.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            medicine.prescriptionRequired 
              ? 'bg-red-50 text-red-700' 
              : 'bg-green-50 text-green-700'
          }`}>
            {medicine.prescriptionRequired ? 'Prescription Required' : 'OTC'}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{medicine.description}</p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {medicine.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMedkit className="text-green-500" />
            <span>{medicine.quantity}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaClock className="text-blue-500" />
            <span>{medicine.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-purple-500" />
            <span>{medicine.pharmacyLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaLock className="text-green-500" />
            <span>Expires {medicine.expiryDate}</span>
          </div>
        </div>
        
        {/* Service Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {medicine.fastDelivery && (
            <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              <FaTruck />
              <span>Fast Delivery</span>
            </div>
          )}
          {medicine.verified && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              <FaCheckCircle />
              <span>Verified</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
            <FaPercent />
            <span>{medicine.discount}</span>
          </div>
        </div>
        
        {/* Stock Status */}
        <div className="mb-4">
          {medicine.inStock ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <FaCheckCircle className="text-xs" />
              In Stock
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1">
              <FaExclamationTriangle className="text-xs" />
              Out of Stock
            </span>
          )}
        </div>
        
        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900">{medicine.price}</p>
              <span className="text-sm text-gray-500 line-through">{medicine.originalPrice}</span>
            </div>
            <p className="text-xs text-green-600 font-medium">{medicine.discount}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
              Details
            </button>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center gap-2 text-sm">
              <FaShoppingCart />
              Add to Cart
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
        <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-600 rounded-full animate-spin border-t-transparent"></div>
        <FaPills className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 text-2xl" />
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is finding the best medicines for you...</p>
      <div className="flex gap-1 mt-2">
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
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
      <FaPills className="text-6xl text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all categories</p>
      <button 
        onClick={onClear}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}

// Main Component
export default function MedicinesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(mockMedicines)
  const [hasSearched, setHasSearched] = useState(false)
  const [cartCount] = useState(3)
  const [searchExamples] = useState([
    "Paracetamol for fever",
    "Diabetes medication",
    "Vitamin D supplements",
    "Antibiotics for infection",
    "Blood pressure medicine",
    "Cough syrup for children"
  ])

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)
    
    const results = await aiSearchMedicines(searchQuery, category)
    
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategory('all')
    setSearchResults(mockMedicines)
    setHasSearched(false)
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Medicine Store & Pharmacy</h1>
          <p className="text-xl text-green-100">
            AI-powered search for authentic medicines with fast delivery across Mauritius
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaCheckCircle className="text-green-300" />
              <span>Authentic Medicines</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaTruck className="text-blue-300" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaLock className="text-yellow-300" />
              <span>Licensed Pharmacies</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FaHeadset className="text-orange-300" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-4xl mx-auto -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicines by name, condition, or symptoms (e.g., 'headache medicine', 'diabetes pills')"
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-lg"
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
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="pain relief">Pain Relief</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="antibiotics">Antibiotics</option>
                    <option value="vitamins">Vitamins & Supplements</option>
                    <option value="digestive">Digestive Health</option>
                    <option value="heart">Heart Health</option>
                    <option value="children">Medicine for Children </option>
                  </select>
                  
                  <button 
                    type="button"
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    <FaSearch />
                    Find Medicine
                  </button>
                  
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium flex items-center gap-2">
                    <FaShoppingCart />
                    Cart ({cartCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaTruck className="text-3xl text-green-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">2-4 Hours</p>
            <p className="text-sm text-gray-600">Fast Delivery</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaCheckCircle className="text-3xl text-blue-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-600">Authentic</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaHeadset className="text-3xl text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Support</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <FaUndo className="text-3xl text-orange-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">Easy</p>
            <p className="text-sm text-gray-600">Returns</p>
          </div>
        </div>
        
        {/* Medical Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Important Medical Disclaimer</h4>
              <p className="text-sm text-yellow-700">
                This platform is for purchasing medicines only. Always consult with a qualified healthcare professional before taking any medication. 
                Prescription medicines require a valid prescription from a licensed doctor.
              </p>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="mt-12">
          {isSearching ? (
            <LoadingAnimation />
          ) : searchResults.length > 0 ? (
            <>
              {hasSearched && (
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{searchResults.length}</span> medicines matching your search
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>
            </>
          ) : hasSearched ? (
            <EmptyState onClear={handleClearFilters} />
          ) : null}
        </div>
        
        {/* Medicine Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaHandHoldingMedical className="text-3xl text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Pain Relief</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaHeart className="text-3xl text-pink-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Heart Health</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaLock className="text-3xl text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Antibiotics</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaLeaf className="text-3xl text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Vitamins</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaBaby className="text-3xl text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Children</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer text-center">
              <FaMedkit className="text-3xl text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Digestive</h3>
            </div>
          </div>
        </div>
        
        {/* How Medicine Delivery Works */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Search Medicine</h3>
              <p className="text-sm text-gray-600">Find the medicine you need using our AI-powered search</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Upload Prescription</h3>
              <p className="text-sm text-gray-600">Upload prescription for prescription medicines</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Pay securely with multiple payment options</p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Get medicines delivered to your doorstep quickly</p>
            </div>
          </div>
        </div>
        
        {/* Pharmacy Services */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Pharmacy Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaUserMd className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pharmacist Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">Get expert advice from licensed pharmacists about your medications</p>
              <button className="text-blue-600 font-medium text-sm">Consult Now →</button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaVial className="text-4xl text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Medicine Reminders</h3>
              <p className="text-gray-600 text-sm mb-4">Set up automated reminders for your medication schedule</p>
              <button className="text-green-600 font-medium text-sm">Set Reminders →</button>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <FaFileAlt className="text-4xl text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Digital Prescriptions</h3>
              <p className="text-gray-600 text-sm mb-4">Store and manage all your prescriptions digitally</p>
              <button className="text-purple-600 font-medium text-sm">View Records →</button>
            </div>
          </div>
        </div>
        
        {/* Customer Reviews */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Fast delivery and authentic medicines. The AI search helped me find exactly what I needed!</p>
              <p className="font-semibold text-gray-900">- Priya M.</p>
              <p className="text-xs text-gray-500">Port Louis</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Great prices and excellent customer service. Medicines arrived within 2 hours!</p>
              <p className="font-semibold text-gray-900">- David L.</p>
              <p className="text-xs text-gray-500">Curepipe</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-sm" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">Very convenient for elderly patients. Easy ordering and reliable delivery service.</p>
              <p className="font-semibold text-gray-900">- Marie C.</p>
              <p className="text-xs text-gray-500">Grand Baie</p>
            </div>
          </div>
        </div>
        
        {/* Emergency Medicine Banner */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Need Emergency Medicine?</h2>
          <p className="text-red-100 mb-6">
            Our 24/7 emergency medicine service ensures you get critical medications when you need them most. 
            Priority delivery within 1 hour for emergency prescriptions.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
              <FaPhoneAlt />
              Emergency Hotline
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-red-700 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Pharmacy Partner Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Are you a licensed pharmacy?</h2>
          <p className="text-blue-100 mb-6">
            Join our network of verified pharmacies and reach thousands of customers across Mauritius. 
            Grow your business with our AI-powered platform and delivery network.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Partner With Us →
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