import React, { useState } from 'react'
import { Patient, Prescription } from '@/lib/data/patients'
import { 
  FaPills, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaUser,
  FaUserMd,
  FaDownload,
  FaPrint,
  FaSyncAlt,
  FaPlus,
  FaBell,
  FaEdit,
  FaEye,
  FaSearch,
  FaShoppingCart,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaExclamationCircle,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaClipboardCheck,
  FaCapsules,
  FaAllergies,
  FaTimesCircle,
  FaStethoscope,
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

interface MedicineOrder {
  id: string
  medicines: Array<{
    id: string
    name: string
    dosage: string
    quantity: number
    price: number
    inStock: boolean
  }>
  pharmacy: {
    name: string
    address: string
    phone: string
    rating: number
    deliveryTime: string
  }
  totalAmount: number
  deliveryFee: number
  estimatedDelivery: string
  paymentMethod: 'cash' | 'card' | 'insurance'
}

interface PillReminder {
  id: string
  medicineId: string
  medicineName: string
  dosage: string
  times: string[]
  taken: boolean[]
  nextDose: string
  frequency: string
}

const PrescriptionManagement: React.FC<Props> = ({ patientData }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'reminders' | 'order'>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'doctor' | 'medicine'>('date')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all')
  const [expandedPrescription, setExpandedPrescription] = useState<string | null>(null)
  const [selectedForOrder, setSelectedForOrder] = useState<string[]>([])
  const [showReminders, setShowReminders] = useState(true)
  const [expandedSection, setExpandedSection] = useState<string>('active')

  // Mock pill reminders data
  const mockReminders: PillReminder[] = [
    {
      id: 'REM001',
      medicineId: 'MED001',
      medicineName: 'Metformin 500mg',
      dosage: '1 tablet',
      times: ['08:00', '20:00'],
      taken: [true, false],
      nextDose: '20:00',
      frequency: 'Twice daily'
    },
    {
      id: 'REM002', 
      medicineId: 'MED002',
      medicineName: 'Lisinopril 10mg',
      dosage: '1 tablet',
      times: ['08:00'],
      taken: [true],
      nextDose: 'Tomorrow 08:00',
      frequency: 'Once daily'
    }
  ]

  // Mock order data
  const mockOrder: MedicineOrder = {
    id: 'ORD001',
    medicines: [
      { id: 'MED001', name: 'Metformin 500mg', dosage: '60 tablets', quantity: 1, price: 450, inStock: true },
      { id: 'MED002', name: 'Lisinopril 10mg', dosage: '30 tablets', quantity: 1, price: 380, inStock: true }
    ],
    pharmacy: {
      name: 'Apollo Pharmacy',
      address: 'Rose Hill, Mauritius',
      phone: '+230 401-3000',
      rating: 4.8,
      deliveryTime: '2-4 hours'
    },
    totalAmount: 830,
    deliveryFee: 50,
    estimatedDelivery: 'Today by 6:00 PM',
    paymentMethod: 'insurance'
  }

  const allPrescriptions = [
    ...(patientData.activePrescriptions || []),
    ...(patientData.prescriptionHistory || [])
  ]

  // Filter and sort prescriptions
  const filteredPrescriptions = allPrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medicines.some(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && prescription.isActive) ||
      (filterStatus === 'expired' && !prescription.isActive)

    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'doctor':
        return a.doctorName.localeCompare(b.doctorName)
      case 'medicine':
        return a.medicines[0]?.name.localeCompare(b.medicines[0]?.name) || 0
      default:
        return 0
    }
  })

  const getDaysUntilRefill = (prescription: Prescription): number => {
    if (!prescription.nextRefill) return 0
    const refillDate = new Date(prescription.nextRefill)
    const today = new Date()
    const diffTime = refillDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getRefillUrgency = (prescription: Prescription): 'urgent' | 'soon' | 'normal' => {
    const days = getDaysUntilRefill(prescription)
    if (days <= 7) return 'urgent'
    if (days <= 14) return 'soon'
    return 'normal'
  }

  const toggleMedicineForOrder = (medicineId: string) => {
    setSelectedForOrder(prev => 
      prev.includes(medicineId) 
        ? prev.filter(id => id !== medicineId)
        : [...prev, medicineId]
    )
  }

  const sections = [
    { id: 'active', label: 'Active Prescriptions', icon: FaCheckCircle, color: 'green', count: patientData.activePrescriptions?.length },
    { id: 'reminders', label: 'Reminders', icon: FaBell, color: 'blue', count: mockReminders.length },
    { id: 'order', label: 'Order Medicines', icon: FaShoppingCart, color: 'purple' },
    { id: 'history', label: 'History', icon: FaHistory, color: 'orange', count: allPrescriptions.length }
  ]

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection('')
    } else {
      setExpandedSection(sectionId)
      setActiveTab(sectionId as typeof activeTab)
    }
  }

  const renderActivePrescriptions = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Quick Actions - Grid responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button 
          onClick={() => setActiveTab('reminders')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 text-center"
        >
          <FaBell className="text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
          <p className="font-semibold text-xs sm:text-sm md:text-base">Set Reminders</p>
          <p className="text-xs opacity-80 hidden sm:block">Never miss a dose</p>
        </button>

        <button 
          onClick={() => setActiveTab('order')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 text-center"
        >
          <FaShoppingCart className="text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
          <p className="font-semibold text-xs sm:text-sm md:text-base">Order Medicines</p>
          <p className="text-xs opacity-80 hidden sm:block">Home delivery</p>
        </button>

        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 text-center">
          <FaUserMd className="text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
          <p className="font-semibold text-xs sm:text-sm md:text-base">Consult Doctor</p>
          <p className="text-xs opacity-80 hidden sm:block">Ask questions</p>
        </button>

        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-lg sm:rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 text-center">
          <FaAllergies className="text-xl sm:text-2xl mx-auto mb-1 sm:mb-2" />
          <p className="font-semibold text-xs sm:text-sm md:text-base">Drug Interactions</p>
          <p className="text-xs opacity-80 hidden sm:block">Safety check</p>
        </button>
      </div>

      {/* Refill Alerts */}
      {patientData.activePrescriptions && patientData.activePrescriptions.filter(p => getRefillUrgency(p) !== 'normal').length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-orange-200">
          <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-3 sm:mb-4 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Refill Reminders
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {patientData.activePrescriptions.filter(p => getRefillUrgency(p) !== 'normal').map((prescription) => {
              const urgency = getRefillUrgency(prescription)
              const days = getDaysUntilRefill(prescription)
              return (
                <div key={prescription.id} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 ${
                  urgency === 'urgent' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-500' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">{prescription.medicines[0]?.name}</p>
                      <p className={`text-xs sm:text-sm ${urgency === 'urgent' ? 'text-red-600' : 'text-yellow-600'}`}>
                        Refill needed in {days} days • Next refill: {prescription.nextRefill}
                      </p>
                    </div>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs sm:text-sm">
                      Refill Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Prescriptions List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredPrescriptions.filter(p => p.isActive).map((prescription) => (
          <div key={prescription.id} className="bg-gradient-to-br from-white to-green-50/30 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Prescription #{prescription.id}</h3>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                      <FaCheckCircle className="inline mr-1" />
                      Active
                    </span>
                    {getRefillUrgency(prescription) !== 'normal' && (
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                        getRefillUrgency(prescription) === 'urgent' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800' : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800'
                      }`}>
                        <FaExclamationTriangle className="inline mr-1" />
                        Refill {getRefillUrgency(prescription)}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaUserMd className="text-blue-500" />
                      <span>{prescription.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-green-500" />
                      <span>{new Date(prescription.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-purple-500" />
                      <span>{prescription.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaSyncAlt className="text-orange-500" />
                      <span>Next refill: {prescription.nextRefill}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedPrescription(
                      expandedPrescription === prescription.id ? null : prescription.id
                    )}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition text-xs sm:text-sm"
                  >
                    <FaEye className="inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{expandedPrescription === prescription.id ? 'Less' : 'Details'}</span>
                  </button>
                  
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition text-xs sm:text-sm">
                    <FaShoppingCart className="inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Reorder</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl">
                <h4 className="font-medium text-blue-800 mb-1 flex items-center text-sm sm:text-base">
                  <FaStethoscope className="mr-2" />
                  Diagnosis
                </h4>
                <p className="text-blue-700 text-xs sm:text-sm">{prescription.diagnosis}</p>
              </div>

              {/* Medicines Overview */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="font-medium text-gray-800 flex items-center text-sm sm:text-base">
                  <FaPills className="mr-2 text-green-500" />
                  Medications ({prescription.medicines.length})
                </h4>
                <div className="grid gap-2 sm:gap-3">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                            <FaCapsules className="mr-2 text-purple-500" />
                            {medicine.name}
                          </h5>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                            <div className="space-y-1">
                              <p className="text-gray-600">
                                <span className="font-medium">Dosage:</span> {medicine.dosage}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Frequency:</span> {medicine.frequency}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Duration:</span> {medicine.duration}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-600">
                                <span className="font-medium">Quantity:</span> {medicine.quantity}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Take:</span> {medicine.beforeFood ? 'Before food' : 'After food'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                            <p className="text-xs sm:text-sm text-yellow-800">
                              <FaInfoCircle className="inline mr-1 sm:mr-2" />
                              <strong>Instructions:</strong> {medicine.instructions}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2">
                          <button 
                            onClick={() => toggleMedicineForOrder(medicine.name)}
                            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition ${
                              selectedForOrder.includes(medicine.name)
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                                : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 hover:from-gray-200 hover:to-slate-200'
                            }`}
                          >
                            <FaShoppingCart className="inline mr-1" />
                            {selectedForOrder.includes(medicine.name) ? 'Added' : 'Add'}
                          </button>
                          
                          <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition text-xs sm:text-sm">
                            <FaBell className="inline mr-1" />
                            Remind
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPrescription === prescription.id && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h5 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaUser className="mr-2 text-blue-500" />
                        Doctor Information
                      </h5>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <p><strong>Name:</strong> {prescription.doctorName}</p>
                        <p><strong>Doctor ID:</strong> {prescription.doctorId}</p>
                        <p><strong>Prescribed:</strong> {new Date(prescription.date).toLocaleDateString()} at {prescription.time}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h5 className="font-semibold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <FaCalendarAlt className="mr-2" />
                        Prescription Timeline
                      </h5>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <p><strong>Issued:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                        <p><strong>Next Refill:</strong> {prescription.nextRefill}</p>
                        <p><strong>Days Until Refill:</strong> {getDaysUntilRefill(prescription)} days</p>
                      </div>
                    </div>
                  </div>

                  {prescription.notes && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                      <h5 className="font-semibold text-blue-800 mb-2 flex items-center text-sm sm:text-base">
                        <FaInfoCircle className="mr-2" />
                        Additional Notes
                      </h5>
                      <p className="text-blue-700 text-xs sm:text-sm">{prescription.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaDownload />
                      Download
                    </button>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaPrint />
                      Print
                    </button>
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <FaUserMd />
                      Contact
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.filter(p => p.isActive).length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg border border-gray-200">
          <FaPills className="text-gray-400 text-3xl sm:text-4xl lg:text-5xl mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Active Prescriptions</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">You don&apos;t have any active prescriptions at the moment</p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all text-sm sm:text-base">
            Consult a Doctor
          </button>
        </div>
      )}
    </div>
  )

  const renderReminders = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Today's Medication Schedule */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <FaBell className="mr-2 text-blue-500" />
            Today&apos;s Medication Schedule
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Reminders</span>
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white shadow-lg transition-transform ${showReminders ? 'translate-x-5 sm:translate-x-6 bg-blue-500' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {mockReminders.map((reminder) => (
            <div key={reminder.id} className="bg-gradient-to-r from-white/70 to-blue-50/70 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPills className="text-blue-600 text-base sm:text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{reminder.medicineName}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{reminder.dosage} • {reminder.frequency}</p>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {reminder.times.map((time, index) => (
                        <div key={index} className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg ${
                          reminder.taken[index] 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                            : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800'
                        }`}>
                          <FaClock className="text-xs sm:text-sm" />
                          <span className="text-xs sm:text-sm font-medium">{time}</span>
                          {reminder.taken[index] ? (
                            <FaCheckCircle className="text-green-600 text-xs sm:text-sm" />
                          ) : (
                            <FaExclamationCircle className="text-yellow-600 text-xs sm:text-sm" />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Next dose: {reminder.nextDose}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg hover:from-green-200 hover:to-emerald-200 transition text-xs sm:text-sm">
                    <FaCheckCircle className="inline mr-1" />
                    Mark Taken
                  </button>
                  <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition text-xs sm:text-sm">
                    <FaEdit className="inline mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-blue-200">
          <button className="w-full p-2.5 sm:p-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition text-sm sm:text-base">
            <FaPlus className="inline mr-2" />
            Set New Medication Reminder
          </button>
        </div>
      </div>

      {/* Medication Adherence */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-green-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <FaClipboardCheck className="mr-2 text-green-500" />
          Medication Adherence
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl font-bold text-green-600">87%</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">This Week</p>
            <p className="text-xs sm:text-sm text-gray-600">6 of 7 days on track</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl font-bold text-blue-600">92%</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">This Month</p>
            <p className="text-xs sm:text-sm text-gray-600">28 of 30 days completed</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <FaStar className="text-purple-600 text-xl sm:text-2xl" />
            </div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base">Overall Rating</p>
            <p className="text-xs sm:text-sm text-gray-600">Excellent adherence</p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg sm:rounded-xl">
          <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Tips for Better Adherence</h4>
          <ul className="text-xs sm:text-sm text-green-700 space-y-1">
            <li>• Set consistent daily routines</li>
            <li>• Use pill organizers or reminder apps</li>
            <li>• Keep medications visible and accessible</li>
            <li>• Track your progress regularly</li>
          </ul>
        </div>
      </div>
    </div>
  )

  const renderOrderMedicines = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Order Summary */}
      {selectedForOrder.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-green-200">
          <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
            <FaShoppingCart className="mr-2" />
            Your Medicine Cart ({selectedForOrder.length} items)
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            {selectedForOrder.map((medicineName, index) => (
              <div key={index} className="flex items-center justify-between p-2.5 sm:p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <FaPills className="text-green-600 text-sm sm:text-base" />
                  <span className="font-medium text-sm sm:text-base">{medicineName}</span>
                </div>
                <button 
                  onClick={() => toggleMedicineForOrder(medicineName)}
                  className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-3 sm:mt-4 bg-green-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-green-600 transition text-sm sm:text-base">
            Proceed to Order
          </button>
        </div>
      )}

      {/* Current Order */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-blue-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <FaTruck className="mr-2 text-blue-500" />
          Current Order
        </h3>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {mockOrder.medicines.map((medicine) => (
            <div key={medicine.id} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-white/70 to-blue-50/70 border border-gray-200 rounded-lg sm:rounded-xl">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  <FaPills className="text-blue-600 text-sm sm:text-base" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{medicine.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{medicine.dosage}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      medicine.inStock ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800'
                    }`}>
                      {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-base sm:text-lg">Rs {medicine.price}</p>
                <p className="text-xs sm:text-sm text-gray-600">Qty: {medicine.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pharmacy Info */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center text-sm sm:text-base">
                <FaMapMarkerAlt className="mr-2" />
                {mockOrder.pharmacy.name}
              </h4>
              <div className="text-xs sm:text-sm text-blue-800 space-y-1">
                <p>{mockOrder.pharmacy.address}</p>
                <p className="flex items-center gap-2">
                  <FaPhone />
                  {mockOrder.pharmacy.phone}
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span>{mockOrder.pharmacy.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>Delivery: {mockOrder.pharmacy.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-3 sm:pt-4">
          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs {mockOrder.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>Rs {mockOrder.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
              <span>Total:</span>
              <span>Rs {mockOrder.totalAmount + mockOrder.deliveryFee}</span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <p className="text-xs sm:text-sm text-green-800">
              <FaTruck className="inline mr-2" />
              Estimated delivery: {mockOrder.estimatedDelivery}
            </p>
          </div>

          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            <button className="w-full bg-green-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-green-600 transition text-sm sm:text-base">
              Confirm Order
            </button>
            <button className="w-full bg-blue-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-600 transition text-sm sm:text-base">
              Pay with Insurance
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* History Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-blue-100 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <FaHistory className="text-blue-600 text-base sm:text-xl" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{allPrescriptions.length}</p>
          <p className="text-xs sm:text-sm text-gray-600">Total Prescriptions</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-green-100 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <FaCheckCircle className="text-green-600 text-base sm:text-xl" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {allPrescriptions.filter(p => p.isActive).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Currently Active</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-purple-100 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <FaUserMd className="text-purple-600 text-base sm:text-xl" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {new Set(allPrescriptions.map(p => p.doctorName)).size}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Different Doctors</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-orange-100 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
            <FaPills className="text-orange-600 text-base sm:text-xl" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {allPrescriptions.reduce((sum, p) => sum + p.medicines.length, 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Total Medicines</p>
        </div>
      </div>

      {/* All Prescriptions */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Prescription History</h3>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative">
              <FaSearch className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm w-full sm:w-auto"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'doctor' | 'medicine')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="doctor">Sort by Doctor</option>
              <option value="medicine">Sort by Medicine</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'expired')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-gradient-to-r from-white/70 to-blue-50/70 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Prescription #{prescription.id}</h4>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                      prescription.isActive 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                        : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800'
                    }`}>
                      {prescription.isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Doctor:</strong> {prescription.doctorName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Diagnosis:</strong> {prescription.diagnosis}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Medicines:</strong> {prescription.medicines.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {prescription.medicines.slice(0, 3).map((medicine, index) => (
                      <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs">
                        {medicine.name}
                      </span>
                    ))}
                    {prescription.medicines.length > 3 && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 rounded-full text-xs">
                        +{prescription.medicines.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition text-xs sm:text-sm">
                    <FaEye className="inline mr-1" />
                    View
                  </button>
                  <button className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg hover:from-green-100 hover:to-emerald-100 transition text-xs sm:text-sm">
                    <FaDownload className="inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <FaSearch className="text-gray-400 text-2xl sm:text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">No prescriptions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )

  if (allPrescriptions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-purple-200">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <FaPills className="text-purple-500 text-2xl sm:text-3xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">No Prescriptions Found</h3>
        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">You don&apos;t have any prescriptions yet. Consult with a doctor to get started.</p>
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base">
          <FaUserMd />
          Consult a Doctor
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaPills className="mr-2 sm:mr-3" />
              Prescription Management
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Manage your medications, set reminders, and order refills</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
            <div className="bg-gradient-to-br from-purple-400/20 to-indigo-400/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{patientData.activePrescriptions?.length || 0}</p>
              <p className="text-xs opacity-90">Active</p>
            </div>
            <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{allPrescriptions.length}</p>
              <p className="text-xs opacity-90">Total</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{mockReminders.length}</p>
              <p className="text-xs opacity-90">Reminders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Accordion / Desktop Tabs */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
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
                  expandedSection === section.id ? `bg-gradient-to-r from-${section.color}-50 to-${section.color}-100/50` : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <section.icon className={`text-${section.color}-500`} />
                  <span className={`font-medium ${
                    expandedSection === section.id ? `text-${section.color}-700` : 'text-gray-700'
                  }`}>
                    {section.label}
                  </span>
                  {section.count !== undefined && section.count > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {section.count}
                    </span>
                  )}
                </div>
                {expandedSection === section.id ? (
                  <FaChevronUp className={`text-${section.color}-500`} />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-4 bg-white">
                  {section.id === 'active' && renderActivePrescriptions()}
                  {section.id === 'reminders' && renderReminders()}
                  {section.id === 'order' && renderOrderMedicines()}
                  {section.id === 'history' && renderHistory()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Content */}
        <div className="hidden sm:block p-4 md:p-6">
          {activeTab === 'active' && renderActivePrescriptions()}
          {activeTab === 'reminders' && renderReminders()}
          {activeTab === 'order' && renderOrderMedicines()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  )
}

export default PrescriptionManagement