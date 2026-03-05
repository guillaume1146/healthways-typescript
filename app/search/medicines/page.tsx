'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaSearch, FaPills, FaStar, FaMapMarkerAlt, FaClock, FaTruck, FaCheckCircle, FaStarHalfAlt, FaShoppingCart, FaLock,  FaLeaf, FaExclamationTriangle,  FaHeadset, FaUndo, FaHeart, FaBrain, FaBaby, FaEye, FaTooth, FaBone, FaHandHoldingMedical, FaMedkit, FaPercent,  FaPlus, FaMinus, FaTrash, FaHistory, FaTimes } from 'react-icons/fa'
import { useCart } from '@/app/search/medicines/contexts/CartContext'
import { useSearchHistory } from '@/hooks/useSearchHistory'

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

const FloatingCart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-[600px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Shopping Cart</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-600">{item.brand}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-green-600">Rs {item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-green-600">Rs {getTotalPrice()}</span>
                  </div>
                  <Link
                    href="/patient/pharmacy/order/cart"
                    className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:from-green-700 hover:to-green-800 transition-all relative"
          >
            <FaShoppingCart className="text-2xl" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
        )}
      </div>
    </>
  )
}

// Medicine UI interface (mapped from API response)
interface MedicineUi {
  id: number
  name: string
  brand: string
  genericName: string
  category: string
  type: string
  price: number
  originalPrice: number
  discount: string
  rating: number
  reviews: number
  inStock: boolean
  quantity: number
  stockQuantity: number
  description: string
  image: string
  manufacturer: string
  expiryDate: string
  prescriptionRequired: boolean
  activeIngredient: string
  sideEffects: string[]
  dosage: string
  maxDailyDose: string
  contraindications: string[]
  storage: string
  deliveryTime: string
  fastDelivery: boolean
  verified: boolean
  pharmacyLocation: string
  features: string[]
  stockStatus: string
  [key: string]: unknown // Allow passing to MedicineInput which requires index signature
}

interface MedicineProps {
  medicine: MedicineUi
}

const MedicineCard = ({ medicine }: MedicineProps) => {
  const { addToCart, cartItems } = useCart()
  const CategoryIcon = categoryIcons[medicine.category as keyof typeof categoryIcons] || FaPills
  
  const itemInCart = cartItems.find(item => item.id === medicine.id)
  const quantityInCart = itemInCart?.quantity || 0

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
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
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{medicine.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {medicine.features.slice(0, 3).map((feature: string, index: number) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
        
        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMedkit className="text-green-500" />
            <span>{medicine.stockQuantity > 0 ? `${medicine.stockQuantity} in stock` : 'Out of stock'}</span>
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
          {medicine.stockQuantity > 10 ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <FaCheckCircle className="text-xs" />
              In Stock ({medicine.stockQuantity} available)
            </span>
          ) : medicine.stockQuantity > 0 ? (
            <span className="text-sm text-yellow-600 font-medium flex items-center gap-1">
              <FaExclamationTriangle className="text-xs" />
              Only {medicine.stockQuantity} left
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
              <p className="text-2xl font-bold text-gray-900">Rs {medicine.price}</p>
              <span className="text-sm text-gray-500 line-through">Rs {medicine.originalPrice}</span>
            </div>
            <p className="text-xs text-green-600 font-medium">{medicine.discount}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
              Details
            </button>
            <button
              onClick={() => addToCart(medicine)}
              disabled={!medicine.inStock || medicine.stockQuantity <= 0}
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 text-sm relative ${
                !medicine.inStock || medicine.stockQuantity <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
              }`}
            >
              <FaShoppingCart />
              {medicine.stockQuantity <= 0 ? 'Unavailable' : 'Add to Cart'}
              {quantityInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {quantityInCart}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// API response shape for medicines
interface ApiMedicine {
  id: number
  name: string
  pharmacy?: string
  genericName?: string
  category: string
  requiresPrescription?: boolean
  price: number | string
  inStock?: boolean
  quantity?: number
  description?: string
  imageUrl?: string
  sideEffects?: string[]
  strength?: string
  dosageForm?: string
  pharmacist?: { verified?: boolean }
}

// Map API response items to the shape the UI expects
const mapApiMedicine = (item: ApiMedicine): MedicineUi => {
  const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
  const qty = item.quantity ?? 0
  return {
    id: item.id,
    name: item.name,
    brand: item.pharmacy || 'Unknown Pharmacy',
    genericName: item.genericName || '',
    category: item.category,
    type: item.requiresPrescription ? 'Prescription' : 'Over-the-counter',
    price,
    originalPrice: price, // No fake markup
    discount: '',
    rating: 0, // No fake rating — should come from reviews API
    reviews: 0,
    inStock: (item.inStock ?? false) && qty > 0,
    quantity: qty,
    stockQuantity: qty,
    description: item.description || '',
    image: item.imageUrl || 'https://via.placeholder.com/150x150/4F46E5/ffffff?text=Pills',
    manufacturer: item.pharmacy || '',
    expiryDate: '',
    prescriptionRequired: item.requiresPrescription ?? false,
    activeIngredient: item.genericName || item.name,
    sideEffects: item.sideEffects || [],
    dosage: item.strength || '',
    maxDailyDose: '',
    contraindications: [] as string[],
    storage: 'Store in cool, dry place',
    deliveryTime: '',
    fastDelivery: false,
    verified: item.pharmacist?.verified ?? false,
    pharmacyLocation: item.pharmacy || 'Mauritius',
    features: [item.dosageForm, item.strength, item.category].filter((v): v is string => Boolean(v)),
    stockStatus: qty > 10 ? 'In Stock' : qty > 0 ? `Only ${qty} left` : 'Out of Stock',
  }
}

// Fetch medicines from API with optional search params
const aiSearchMedicines = async (query: string, category: string) => {
  try {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category && category !== 'all') params.set('category', category)
    const res = await fetch(`/api/search/medicines?${params.toString()}`)
    const json = await res.json()
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(mapApiMedicine)
    }
    return []
  } catch (error) {
    console.error('Error searching medicines:', error)
    return []
  }
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
function MedicinesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [isSearching, setIsSearching] = useState(false)
  const [allMedicines, setAllMedicines] = useState<MedicineUi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<MedicineUi[]>([])
  const [hasSearched, setHasSearched] = useState(!!initialQuery)
  const [showHistory, setShowHistory] = useState(false)

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()

  const searchExamples = [
    "Paracetamol for fever",
    "Diabetes medication",
    "Vitamin D supplements",
    "Antibiotics for infection",
    "Blood pressure medicine",
    "Cough syrup for children"
  ]

  const updateUrl = useCallback((q: string, cat: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (cat && cat !== 'all') params.set('category', cat)
    const qs = params.toString()
    router.replace(`/search/medicines${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router])

  const fetchMedicines = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (initialQuery) params.set('q', initialQuery)
      if (initialCategory && initialCategory !== 'all') params.set('category', initialCategory)
      const res = await fetch(`/api/search/medicines?${params.toString()}`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map(mapApiMedicine)
        setAllMedicines(mapped)
        setSearchResults(mapped)
      }
    } catch (error) {
      console.error('Error fetching medicines:', error)
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchMedicines()
  }, [fetchMedicines])

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSearching(true)
    setHasSearched(true)
    setShowHistory(false)

    const results = await aiSearchMedicines(searchQuery, category)
    setSearchResults(results)
    setIsSearching(false)
    updateUrl(searchQuery, category)

    if (searchQuery.trim()) {
      addToHistory(searchQuery, 'medicines')
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setCategory('all')
    setSearchResults(allMedicines)
    setHasSearched(false)
    router.replace('/search/medicines', { scroll: false })
  }

  const handleExampleClick = (example: string) => {
    setSearchQuery(example)
  }

  const handleHistoryClick = (entry: { query: string }) => {
    setSearchQuery(entry.query)
    setShowHistory(false)
    setTimeout(() => {
      const btn = document.getElementById('medicine-search-btn')
      if (btn) btn.click()
    }, 50)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Floating Cart */}
      <FloatingCart />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowHistory(true) }}
                    onFocus={() => !searchQuery && setShowHistory(true)}
                    onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                    placeholder="Search medicines by name, condition, or symptoms (e.g., 'headache medicine', 'diabetes pills')"
                    className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-lg"
                  />
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                  {/* Search History Dropdown */}
                  {showHistory && history.length > 0 && !searchQuery && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                          <FaHistory className="text-[10px]" />
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => clearHistory()}
                          className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <FaTrash className="text-[10px]" />
                          Clear
                        </button>
                      </div>
                      {history.map((entry, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleHistoryClick(entry)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition text-sm text-gray-700 group"
                        >
                          <span className="flex items-center gap-2">
                            <FaHistory className="text-xs text-gray-300" />
                            {entry.query}
                          </span>
                          <button
                            type="button"
                            onMouseDown={e => e.preventDefault()}
                            onClick={e => { e.stopPropagation(); removeFromHistory(entry.query) }}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </button>
                      ))}
                    </div>
                  )}
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
                    <option value="children">Medicine for Children</option>
                  </select>

                  <button
                    id="medicine-search-btn"
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 min-w-[150px]"
                  >
                    <FaSearch />
                    Find Medicine
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
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
          {isLoading || isSearching ? (
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
      </div>
    </div>
  )
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    }>
      <MedicinesContent />
    </Suspense>
  )
}