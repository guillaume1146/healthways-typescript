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
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaSort,
  FaShoppingCart,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaHeart,
  FaExclamationCircle,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaClipboardCheck,
  FaCapsules,
  FaNutritionix,
  FaAllergies,
  FaWeight,
  FaTimesCircle,
  FaMinus,
  FaHandHoldingMedical,
  FaStethoscope,
  FaMobileAlt
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

  const renderActivePrescriptions = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setActiveTab('reminders')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 text-center"
        >
          <FaBell className="text-2xl mx-auto mb-2" />
          <p className="font-semibold">Set Reminders</p>
          <p className="text-xs opacity-80">Never miss a dose</p>
        </button>

        <button 
          onClick={() => setActiveTab('order')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 text-center"
        >
          <FaShoppingCart className="text-2xl mx-auto mb-2" />
          <p className="font-semibold">Order Medicines</p>
          <p className="text-xs opacity-80">Home delivery</p>
        </button>

        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 text-center">
          <FaUserMd className="text-2xl mx-auto mb-2" />
          <p className="font-semibold">Consult Doctor</p>
          <p className="text-xs opacity-80">Ask questions</p>
        </button>

        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 text-center">
          <FaAllergies className="text-2xl mx-auto mb-2" />
          <p className="font-semibold">Drug Interactions</p>
          <p className="text-xs opacity-80">Safety check</p>
        </button>
      </div>

      {/* Refill Alerts */}
      {patientData.activePrescriptions && patientData.activePrescriptions.filter(p => getRefillUrgency(p) !== 'normal').length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Refill Reminders
          </h3>
          <div className="space-y-3">
            {patientData.activePrescriptions.filter(p => getRefillUrgency(p) !== 'normal').map((prescription) => {
              const urgency = getRefillUrgency(prescription)
              const days = getDaysUntilRefill(prescription)
              return (
                <div key={prescription.id} className={`p-4 rounded-xl border-l-4 ${
                  urgency === 'urgent' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{prescription.medicines[0]?.name}</p>
                      <p className={`text-sm ${urgency === 'urgent' ? 'text-red-600' : 'text-yellow-600'}`}>
                        Refill needed in {days} days • Next refill: {prescription.nextRefill}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
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
      <div className="space-y-4">
        {filteredPrescriptions.filter(p => p.isActive).map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Prescription #{prescription.id}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <FaCheckCircle className="inline mr-1" />
                      Active
                    </span>
                    {getRefillUrgency(prescription) !== 'normal' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getRefillUrgency(prescription) === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <FaExclamationTriangle className="inline mr-1" />
                        Refill {getRefillUrgency(prescription)}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
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

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setExpandedPrescription(
                      expandedPrescription === prescription.id ? null : prescription.id
                    )}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <FaEye className="inline mr-2" />
                    {expandedPrescription === prescription.id ? 'Less' : 'Details'}
                  </button>
                  
                  <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
                    <FaShoppingCart className="inline mr-2" />
                    Reorder
                  </button>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-800 mb-1 flex items-center">
                  <FaStethoscope className="mr-2" />
                  Diagnosis
                </h4>
                <p className="text-blue-700">{prescription.diagnosis}</p>
              </div>

              {/* Medicines Overview */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 flex items-center">
                  <FaPills className="mr-2 text-green-500" />
                  Medications ({prescription.medicines.length})
                </h4>
                <div className="grid gap-3">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <FaCapsules className="mr-2 text-purple-500" />
                            {medicine.name}
                          </h5>
                          
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
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
                            <div>
                              <p className="text-gray-600">
                                <span className="font-medium">Quantity:</span> {medicine.quantity}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">Take:</span> {medicine.beforeFood ? 'Before food' : 'After food'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <FaInfoCircle className="inline mr-2" />
                              <strong>Instructions:</strong> {medicine.instructions}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <button 
                            onClick={() => toggleMedicineForOrder(medicine.name)}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                              selectedForOrder.includes(medicine.name)
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <FaShoppingCart className="inline mr-1" />
                            {selectedForOrder.includes(medicine.name) ? 'Added' : 'Add to Cart'}
                          </button>
                          
                          <button className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition text-sm">
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
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        Doctor Information
                      </h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {prescription.doctorName}</p>
                        <p><strong>Doctor ID:</strong> {prescription.doctorId}</p>
                        <p><strong>Prescribed:</strong> {new Date(prescription.date).toLocaleDateString()} at {prescription.time}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4">
                      <h5 className="font-semibold text-green-800 mb-3 flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        Prescription Timeline
                      </h5>
                      <div className="space-y-2 text-sm">
                        <p><strong>Issued:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                        <p><strong>Next Refill:</strong> {prescription.nextRefill}</p>
                        <p><strong>Days Until Refill:</strong> {getDaysUntilRefill(prescription)} days</p>
                      </div>
                    </div>
                  </div>

                  {prescription.notes && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <FaInfoCircle className="mr-2" />
                        Additional Notes
                      </h5>
                      <p className="text-blue-700 text-sm">{prescription.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                      <FaDownload />
                      Download Prescription
                    </button>
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                      <FaPrint />
                      Print
                    </button>
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
                      <FaUserMd />
                      Contact Doctor
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrescriptions.filter(p => p.isActive).length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
          <FaPills className="text-gray-400 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Prescriptions</h3>
          <p className="text-gray-500 mb-6">You don&apos;t have any active prescriptions at the moment</p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
            Consult a Doctor
          </button>
        </div>
      )}
    </div>
  )

  const renderReminders = () => (
    <div className="space-y-6">
      {/* Today's Medication Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaBell className="mr-2 text-blue-500" />
            Today&apos;s Medication Schedule
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Reminders</span>
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${showReminders ? 'translate-x-6 bg-blue-500' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockReminders.map((reminder) => (
            <div key={reminder.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaPills className="text-blue-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{reminder.medicineName}</h4>
                    <p className="text-sm text-gray-600 mb-2">{reminder.dosage} • {reminder.frequency}</p>
                    
                    <div className="flex items-center gap-4">
                      {reminder.times.map((time, index) => (
                        <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                          reminder.taken[index] 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <FaClock className="text-sm" />
                          <span className="text-sm font-medium">{time}</span>
                          {reminder.taken[index] ? (
                            <FaCheckCircle className="text-green-600" />
                          ) : (
                            <FaExclamationCircle className="text-yellow-600" />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Next dose: {reminder.nextDose}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm">
                    <FaCheckCircle className="inline mr-1" />
                    Mark Taken
                  </button>
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm">
                    <FaEdit className="inline mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition">
            <FaPlus className="inline mr-2" />
            Set New Medication Reminder
          </button>
        </div>
      </div>

      {/* Medication Adherence */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaClipboardCheck className="mr-2 text-green-500" />
          Medication Adherence
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-green-600">87%</span>
            </div>
            <p className="font-semibold text-gray-900">This Week</p>
            <p className="text-sm text-gray-600">6 of 7 days on track</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-blue-600">92%</span>
            </div>
            <p className="font-semibold text-gray-900">This Month</p>
            <p className="text-sm text-gray-600">28 of 30 days completed</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaStar className="text-purple-600 text-2xl" />
            </div>
            <p className="font-semibold text-gray-900">Overall Rating</p>
            <p className="text-sm text-gray-600">Excellent adherence</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <h4 className="font-semibold text-green-800 mb-2">Tips for Better Adherence</h4>
          <ul className="text-sm text-green-700 space-y-1">
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
    <div className="space-y-6">
      {/* Order Summary */}
      {selectedForOrder.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <FaShoppingCart className="mr-2" />
            Your Medicine Cart ({selectedForOrder.length} items)
          </h3>
          
          <div className="space-y-3">
            {selectedForOrder.map((medicineName, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaPills className="text-green-600" />
                  <span className="font-medium">{medicineName}</span>
                </div>
                <button 
                  onClick={() => toggleMedicineForOrder(medicineName)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
            Proceed to Order
          </button>
        </div>
      )}

      {/* Current Order */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <FaTruck className="mr-2 text-blue-500" />
          Current Order
        </h3>

        <div className="space-y-4 mb-6">
          {mockOrder.medicines.map((medicine) => (
            <div key={medicine.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaPills className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                  <p className="text-sm text-gray-600">{medicine.dosage}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      medicine.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {medicine.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Rs {medicine.price}</p>
                <p className="text-sm text-gray-600">Qty: {medicine.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pharmacy Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {mockOrder.pharmacy.name}
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>{mockOrder.pharmacy.address}</p>
                <p className="flex items-center gap-2">
                  <FaPhone />
                  {mockOrder.pharmacy.phone}
                </p>
                <div className="flex items-center gap-4">
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
        <div className="border-t pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs {mockOrder.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>Rs {mockOrder.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>Rs {mockOrder.totalAmount + mockOrder.deliveryFee}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <FaTruck className="inline mr-2" />
              Estimated delivery: {mockOrder.estimatedDelivery}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition">
              Confirm Order
            </button>
            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition">
              Pay with Insurance
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {patientData.medicineOrders && patientData.medicineOrders.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaHistory className="mr-2 text-purple-500" />
            Recent Orders
          </h3>
          
          <div className="space-y-4">
            {patientData.medicineOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.medicines.map((medicine, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2">
                      <span>{medicine.name} x {medicine.quantity}</span>
                      <span className="font-medium">Rs {medicine.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <p className="font-semibold text-gray-900">Total: Rs {order.totalAmount}</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">
                      Reorder
                    </button>
                    <button className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm">
                      Track
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-6">
      {/* History Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaHistory className="text-blue-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{allPrescriptions.length}</p>
          <p className="text-sm text-gray-600">Total Prescriptions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {allPrescriptions.filter(p => p.isActive).length}
          </p>
          <p className="text-sm text-gray-600">Currently Active</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaUserMd className="text-purple-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(allPrescriptions.map(p => p.doctorName)).size}
          </p>
          <p className="text-sm text-gray-600">Different Doctors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaPills className="text-orange-600 text-xl" />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {allPrescriptions.reduce((sum, p) => sum + p.medicines.length, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Medicines</p>
        </div>
      </div>

      {/* All Prescriptions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Prescription History</h3>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'doctor' | 'medicine')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="doctor">Sort by Doctor</option>
              <option value="medicine">Sort by Medicine</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'expired')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">Prescription #{prescription.id}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      prescription.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prescription.isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Doctor:</strong> {prescription.doctorName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Diagnosis:</strong> {prescription.diagnosis}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Medicines:</strong> {prescription.medicines.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {prescription.medicines.slice(0, 3).map((medicine, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {medicine.name}
                      </span>
                    ))}
                    {prescription.medicines.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{prescription.medicines.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">
                    <FaEye className="inline mr-1" />
                    View
                  </button>
                  <button className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm">
                    <FaDownload className="inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-8">
            <FaSearch className="text-gray-400 text-3xl mx-auto mb-3" />
            <p className="text-gray-500">No prescriptions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )

  if (allPrescriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center border border-gray-100">
        <div className="bg-purple-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <FaPills className="text-purple-500 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">No Prescriptions Found</h3>
        <p className="text-gray-500 mb-6">You don&apos;t have any prescriptions yet. Consult with a doctor to get started.</p>
        <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
          <FaUserMd />
          Consult a Doctor
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <FaPills className="mr-3" />
              Prescription Management
            </h2>
            <p className="opacity-90">Manage your medications, set reminders, and order refills</p>
          </div>
          <div className="mt-4 md:mt-0 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{patientData.activePrescriptions?.length || 0}</p>
              <p className="text-xs opacity-80">Active</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{allPrescriptions.length}</p>
              <p className="text-xs opacity-80">Total</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-2xl font-bold">{mockReminders.length}</p>
              <p className="text-xs opacity-80">Reminders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'active', label: 'Active Prescriptions', icon: FaCheckCircle, count: patientData.activePrescriptions?.length },
              { id: 'reminders', label: 'Reminders', icon: FaBell, count: mockReminders.length },
              { id: 'order', label: 'Order Medicines', icon: FaShoppingCart },
              { id: 'history', label: 'History', icon: FaHistory, count: allPrescriptions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'active' | 'history' | 'reminders' | 'order')}
                className={`flex-shrink-0 px-6 py-4 text-center font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
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