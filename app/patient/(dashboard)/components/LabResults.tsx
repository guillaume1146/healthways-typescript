import React, { useState } from 'react'
import { Patient } from '@/lib/data/patients'
import BookingsList, { BookingItem } from '@/components/booking/BookingsList'
import ProviderPageHeader from '@/components/booking/ProviderPageHeader'
import {
  FaFlask,
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaFilter,
  FaPlus,
  FaHome,
  FaHospital,
  FaTint,
  FaMicroscope,
  FaUserMd,
  FaShoppingCart,
  FaStar,
  FaEye,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaAward,
  FaPercent,
  FaTimes,
  FaSpinner,
  FaHistory,
  FaFileDownload,
  FaClipboardList,
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

interface LabTest {
  id: string
  name: string
  category: string
  price: number
  duration: string
  preparation: string
  description: string
  popular: boolean
  discount?: number
  requirements: string[]
  sampleType: string
  methodology: string
  accuracy: number
}

const availableTests: LabTest[] = [
  {
    id: 'LT001', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 500,
    duration: '24 hours', preparation: 'No special preparation required',
    description: 'Comprehensive blood analysis measuring red cells, white cells, platelets, and hemoglobin levels',
    popular: true, requirements: ['No fasting required', 'Avoid strenuous exercise 24hrs before'],
    sampleType: 'Blood (5ml)', methodology: 'Flow Cytometry', accuracy: 99.8
  },
  {
    id: 'LT002', name: 'Lipid Profile Complete', category: 'Biochemistry', price: 800,
    duration: '24 hours', preparation: '12 hours fasting required',
    description: 'Comprehensive cholesterol analysis including total, LDL, HDL, VLDL, and triglycerides',
    popular: true, discount: 15, requirements: ['12 hours fasting', 'Avoid alcohol 24hrs before', 'Normal water intake allowed'],
    sampleType: 'Blood (3ml)', methodology: 'Enzymatic Colorimetric', accuracy: 99.5
  },
  {
    id: 'LT003', name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes', price: 600,
    duration: '24 hours', preparation: 'No fasting required',
    description: 'Gold standard test for diabetes monitoring - shows average blood sugar over 3 months',
    popular: true, requirements: ['No fasting required', 'Can be done any time of day'],
    sampleType: 'Blood (2ml)', methodology: 'HPLC', accuracy: 99.9
  },
  {
    id: 'LT004', name: 'Thyroid Function Test (T3, T4, TSH)', category: 'Endocrinology', price: 1200,
    duration: '48 hours', preparation: 'No special preparation required',
    description: 'Complete thyroid assessment measuring T3, T4, and TSH levels for thyroid disorders',
    popular: true, discount: 20, requirements: ['Morning sample preferred', 'Avoid biotin supplements 72hrs before'],
    sampleType: 'Blood (3ml)', methodology: 'Chemiluminescence', accuracy: 99.7
  },
  {
    id: 'LT005', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: 900,
    duration: '24 hours', preparation: 'Fasting for 8-12 hours',
    description: 'Comprehensive liver assessment including ALT, AST, ALP, Bilirubin, and protein levels',
    popular: false, requirements: ['8-12 hours fasting', 'Avoid alcohol 48hrs before', 'Avoid fatty foods'],
    sampleType: 'Blood (4ml)', methodology: 'Kinetic UV', accuracy: 99.6
  },
  {
    id: 'LT006', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: 850,
    duration: '24 hours', preparation: 'No special preparation required',
    description: 'Complete kidney assessment measuring creatinine, urea, uric acid, and electrolytes',
    popular: false, requirements: ['Normal water intake', 'Avoid excessive protein 24hrs before'],
    sampleType: 'Blood (3ml) + Urine', methodology: 'Kinetic Jaffe Method', accuracy: 99.4
  },
  {
    id: 'LT007', name: 'Vitamin D (25-OH) Test', category: 'Vitamins', price: 1000,
    duration: '48 hours', preparation: 'No special preparation required',
    description: 'Measures vitamin D levels for bone health and immune function assessment',
    popular: true, discount: 10, requirements: ['No special preparation', 'Can be done any time'],
    sampleType: 'Blood (2ml)', methodology: 'Chemiluminescence', accuracy: 99.3
  },
  {
    id: 'LT008', name: 'COVID-19 RT-PCR', category: 'Infectious Disease', price: 2500,
    duration: '24-48 hours', preparation: 'No eating/drinking 30 min before test',
    description: 'Highly accurate molecular test for active COVID-19 infection detection',
    popular: false, requirements: ['No food/drink 30min before', 'Avoid nasal medications 2hrs before'],
    sampleType: 'Nasopharyngeal Swab', methodology: 'RT-PCR', accuracy: 99.9
  },
]

const LabResults: React.FC<Props> = ({ patientData }) => {
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Booking form state
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [collectionType, setCollectionType] = useState<'home' | 'clinic'>('clinic')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTest, setExpandedTest] = useState<string | null>(null)
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null)

  const categories = ['all', ...Array.from(new Set(availableTests.map(t => t.category)))]

  const filteredTests = availableTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const calculateTotal = () => {
    let total = selectedTests.reduce((sum, testId) => {
      const test = availableTests.find(t => t.id === testId)
      const price = test?.price || 0
      const discount = test?.discount || 0
      return sum + (price * (1 - discount / 100))
    }, 0)
    if (collectionType === 'home') total += 200
    return Math.round(total)
  }

  const resetBookingForm = () => {
    setSelectedTests([])
    setCollectionType('clinic')
    setScheduledDate('')
    setScheduledTime('')
    setNotes('')
    setSubmitError('')
    setSubmitSuccess(false)
    setSearchQuery('')
    setSelectedCategory('all')
    setExpandedTest(null)
  }

  const handleBookingSubmit = async () => {
    if (selectedTests.length === 0 || !scheduledDate || !scheduledTime) return
    setIsSubmitting(true)
    setSubmitError('')

    const testNames = selectedTests.map(id => availableTests.find(t => t.id === id)?.name).filter(Boolean).join(', ')
    const sampleTypes = selectedTests.map(id => availableTests.find(t => t.id === id)?.sampleType).filter(Boolean).join(', ')

    try {
      const res = await fetch('/api/bookings/lab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: testNames,
          scheduledDate,
          scheduledTime,
          sampleType: sampleTypes || 'Blood',
          notes: `Collection: ${collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}${notes ? '. ' + notes : ''}`,
          price: calculateTotal(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setShowBookingForm(false)
          resetBookingForm()
          window.location.reload()
        }, 2000)
      } else {
        setSubmitError(data.message || 'Booking failed. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = selectedTests.length > 0 && scheduledDate && scheduledTime && !isSubmitting

  // Map lab tests to BookingItem format
  const bookingItems: BookingItem[] = (patientData.labTests || []).map((test) => {
    const hasAbnormal = test.results.some(r => r.status === 'abnormal')
    return {
      id: test.id,
      providerName: test.facility,
      date: test.date,
      time: '',
      status: hasAbnormal ? 'pending' : 'completed',
      service: test.testName,
      notes: test.notes || `Ordered by: ${test.orderedBy}`,
      details: [
        { label: 'Test Name', value: test.testName },
        { label: 'Facility', value: test.facility },
        { label: 'Ordered By', value: test.orderedBy },
        { label: 'Parameters', value: `${test.results.length} tested` },
        { label: 'Normal', value: `${test.results.filter(r => r.status === 'normal').length}` },
        { label: 'Abnormal', value: `${test.results.filter(r => r.status === 'abnormal').length}` },
      ],
    }
  })

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates: { date: string; label: string }[] = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      if (d.getDay() !== 0) { // Skip Sundays
        dates.push({
          date: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        })
      }
    }
    return dates
  }

  const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6 border-b border-cyan-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Book Lab Test</h3>
            <button
              onClick={() => { setShowBookingForm(false); resetBookingForm() }}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Booking Submitted!</h4>
              <p className="text-gray-600 text-sm">Your lab test booking has been confirmed. You will receive details shortly.</p>
            </div>
          ) : (
            <>
              {/* Step 1: Select Tests */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Tests <span className="text-red-500">*</span>
                </h4>

                {/* Search & Filter */}
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1.5 text-sm"
                  >
                    <FaFilter />
                    {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                {showFilters && (
                  <div className="mb-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredTests.map((test) => {
                    const isSelected = selectedTests.includes(test.id)
                    const discountedPrice = test.discount ? Math.round(test.price * (1 - test.discount / 100)) : test.price
                    return (
                      <div key={test.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setSelectedTests(prev =>
                            prev.includes(test.id) ? prev.filter(id => id !== test.id) : [...prev, test.id]
                          )}
                          className={`w-full p-3 text-left transition ${
                            isSelected
                              ? 'bg-cyan-100 border-cyan-500 ring-1 ring-cyan-300'
                              : 'bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-cyan-600 border-cyan-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <FaCheckCircle className="text-white text-xs" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-semibold text-gray-900 text-sm">{test.name}</h5>
                                {test.popular && (
                                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs flex items-center gap-0.5">
                                    <FaStar className="text-xs" /> Popular
                                  </span>
                                )}
                                {test.discount && (
                                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs flex items-center gap-0.5">
                                    <FaPercent className="text-xs" /> {test.discount}% Off
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span>{test.category}</span>
                                <span>{test.duration}</span>
                                <span>{test.sampleType}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {test.discount ? (
                                <>
                                  <p className="font-bold text-green-600 text-sm">Rs {discountedPrice}</p>
                                  <p className="text-xs text-gray-400 line-through">Rs {test.price}</p>
                                </>
                              ) : (
                                <p className="font-bold text-gray-900 text-sm">Rs {test.price}</p>
                              )}
                            </div>
                          </div>
                        </button>
                        {isSelected && (
                          <button
                            onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                            className="w-full px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs hover:bg-cyan-100 flex items-center gap-1 justify-center"
                          >
                            {expandedTest === test.id ? 'Hide details' : 'Show details'}
                            {expandedTest === test.id ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        )}
                        {expandedTest === test.id && (
                          <div className="px-3 py-2 bg-gray-50 border-t text-xs space-y-1">
                            <p className="text-gray-600">{test.description}</p>
                            <p><span className="font-medium">Preparation:</span> {test.preparation}</p>
                            <p><span className="font-medium">Methodology:</span> {test.methodology} ({test.accuracy}% accuracy)</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                {selectedTests.length > 0 && (
                  <p className="text-sm text-cyan-700 mt-2 font-medium">{selectedTests.length} test(s) selected</p>
                )}
              </div>

              {/* Step 2: Collection Type */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Collection Type</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => setCollectionType('clinic')}
                    className={`p-3 border rounded-lg text-center transition ${
                      collectionType === 'clinic'
                        ? 'bg-cyan-100 border-cyan-500 ring-2 ring-cyan-300'
                        : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                    }`}
                  >
                    <FaHospital className={`mx-auto text-lg mb-1 ${collectionType === 'clinic' ? 'text-cyan-600' : 'text-gray-400'}`} />
                    <p className="text-xs sm:text-sm font-medium">Visit Lab</p>
                    <p className="text-xs text-green-600">No extra charge</p>
                  </button>
                  <button
                    onClick={() => setCollectionType('home')}
                    className={`p-3 border rounded-lg text-center transition ${
                      collectionType === 'home'
                        ? 'bg-cyan-100 border-cyan-500 ring-2 ring-cyan-300'
                        : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                    }`}
                  >
                    <FaHome className={`mx-auto text-lg mb-1 ${collectionType === 'home' ? 'text-cyan-600' : 'text-gray-400'}`} />
                    <p className="text-xs sm:text-sm font-medium">Home Collection</p>
                    <p className="text-xs text-orange-600">+Rs 200</p>
                  </button>
                </div>
              </div>

              {/* Step 3: Date & Time */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                  Select Date & Time <span className="text-red-500">*</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getAvailableDates().slice(0, 7).map((d) => (
                      <button
                        key={d.date}
                        onClick={() => setScheduledDate(d.date)}
                        className={`px-3 py-2 border-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                          scheduledDate === d.date
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                            : 'border-gray-200 text-gray-700 hover:border-cyan-400 hover:bg-cyan-50'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {scheduledDate && (
                    <div className="flex flex-wrap gap-1.5">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setScheduledTime(time)}
                          className={`px-2.5 py-1.5 border-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            scheduledTime === time
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-md'
                              : 'border-gray-200 text-gray-700 hover:border-cyan-400 hover:bg-cyan-50'
                          }`}
                        >
                          {(() => {
                            const h = parseInt(time.split(':')[0], 10)
                            const amPm = h >= 12 ? 'PM' : 'AM'
                            return `${h % 12 || 12}:${time.split(':')[1]} ${amPm}`
                          })()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Additional Notes (optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="Any specific requirements or medical conditions..."
                />
              </div>

              {/* Summary */}
              {canSubmit && (
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border border-cyan-200">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Booking Summary</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div><span className="text-gray-500">Tests:</span> <span className="font-medium">{selectedTests.map(id => availableTests.find(t => t.id === id)?.name).join(', ')}</span></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(scheduledDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                      <div><span className="text-gray-500">Time:</span> <span className="font-medium">{scheduledTime}</span></div>
                      <div><span className="text-gray-500">Collection:</span> <span className="font-medium capitalize">{collectionType === 'home' ? 'Home Collection' : 'Lab Visit'}</span></div>
                      <div><span className="text-gray-500">Total:</span> <span className="font-bold text-cyan-700">Rs {calculateTotal()}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  {submitError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={() => { setShowBookingForm(false); resetBookingForm() }}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-lg hover:from-gray-200 hover:to-slate-200 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!canSubmit}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    'Book Lab Test'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  // Detailed result view for a specific lab test
  const renderDetailedResult = (test: NonNullable<Patient['labTests']>[number]) => (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {test.results.map((result, index) => (
          <div key={index} className={`rounded-lg p-3 border ${
            result.status === 'normal' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-700">{result.parameter}</p>
                <p className="text-sm font-bold text-gray-900">{result.value}</p>
                <p className="text-xs text-gray-500">Range: {result.normalRange}</p>
              </div>
              {result.status === 'normal'
                ? <FaCheckCircle className="text-green-500 text-xs flex-shrink-0" />
                : <FaExclamationTriangle className="text-red-500 text-xs flex-shrink-0" />
              }
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><FaHospital /> {test.facility}</span>
        <span className="flex items-center gap-1"><FaUserMd /> {test.orderedBy}</span>
        {test.reportUrl && (
          <button className="flex items-center gap-1 text-blue-600 hover:underline">
            <FaDownload /> Download Report
          </button>
        )}
      </div>
      {test.notes && (
        <p className="text-xs text-gray-600 bg-yellow-50 rounded p-2 border border-yellow-100">
          <FaInfoCircle className="inline mr-1 text-yellow-600" />
          {test.notes}
        </p>
      )}
    </div>
  )

  if (!patientData.labTests || patientData.labTests.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-cyan-200">
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
            <FaFlask className="text-cyan-500 text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Lab Tests Yet</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">Book your first lab test to start tracking your health</p>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base w-fit"
          >
            <FaPlus />
            Book Your First Lab Test
          </button>
        </div>
        {showBookingForm && renderBookingForm()}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      <ProviderPageHeader
        icon={FaFlask}
        title="Laboratory Testing"
        subtitle="Comprehensive lab testing and health screening"
        gradient="from-cyan-500 via-blue-500 to-indigo-600"
        onBook={() => setShowBookingForm(true)}
        bookLabel="Book Lab Test"
      />

      {/* Bookings List (Reusable Component) */}
      <BookingsList
        bookings={bookingItems}
        providerLabel="Lab"
        accentColor="cyan"
        emptyMessage="No lab test results yet."
      />

      {/* Detailed Results Section */}
      {patientData.labTests && patientData.labTests.length > 0 && (
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-cyan-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <FaChartLine className="mr-2 text-cyan-500" />
            Detailed Test Results
          </h3>
          <div className="space-y-3">
            {patientData.labTests.map((test) => {
              const hasAbnormal = test.results.some(r => r.status === 'abnormal')
              const isExpanded = expandedResultId === test.id
              return (
                <div key={test.id} className="bg-white rounded-lg border border-cyan-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedResultId(isExpanded ? null : test.id)}
                    className="w-full p-3 sm:p-4 text-left flex items-center gap-3 hover:bg-cyan-50 transition"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      hasAbnormal ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {hasAbnormal
                        ? <FaExclamationTriangle className="text-red-500" />
                        : <FaCheckCircle className="text-green-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{test.testName}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>{test.results.length} parameters</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        hasAbnormal ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {hasAbnormal ? 'Attention' : 'Normal'}
                      </span>
                      {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      {renderDetailedResult(test)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-br from-cyan-400/20 to-blue-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-cyan-400/30 hover:to-blue-400/30 transition text-left"
          >
            <FaPlus className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm">Book Test</p>
            <p className="text-xs opacity-80">Schedule lab test</p>
          </button>

          <button className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-green-400/30 hover:to-emerald-400/30 transition text-left">
            <FaFileDownload className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm">Reports</p>
            <p className="text-xs opacity-80">Download results</p>
          </button>

          <button className="bg-gradient-to-br from-purple-400/20 to-indigo-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-purple-400/30 hover:to-indigo-400/30 transition text-left">
            <FaClipboardList className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm">Health Packages</p>
            <p className="text-xs opacity-80">Bundle deals</p>
          </button>

          <button className="bg-gradient-to-br from-orange-400/20 to-red-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-orange-400/30 hover:to-red-400/30 transition text-left">
            <FaHistory className="text-xl sm:text-2xl mb-1.5 sm:mb-2" />
            <p className="font-medium text-xs sm:text-sm">History</p>
            <p className="text-xs opacity-80">Past results</p>
          </button>
        </div>
      </div>

      {showBookingForm && renderBookingForm()}
    </div>
  )
}

export default LabResults
