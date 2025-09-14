import React, { useState, useEffect } from 'react'
import { Patient } from '@/lib/data/patients'
import { 
  FaShieldAlt,
  FaCreditCard,
  FaFileInvoice,
  FaHospital,
  FaPills,
  FaTooth,
  FaEye,
  FaAmbulance,
  FaDownload,
  FaPhone,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaUserMd,
  FaStethoscope,
  FaBaby,
  FaHeartbeat,
  FaChartLine,
  FaCheckCircle,
  FaStar,
  FaGift,
  FaPercentage,
  FaReceipt,
  FaFlask,
  FaUserNurse
} from 'react-icons/fa'

interface Props {
  patientData: Patient
}

const InsuranceInfo: React.FC<Props> = ({ patientData }) => {
  const [expandedSection, setExpandedSection] = useState<string>('coverage')
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [selectedBillingMethod, setSelectedBillingMethod] = useState<string>('')
  
  // Load patient data from localStorage if not passed as prop
  const [localPatientData, setLocalPatientData] = useState<Patient | null>(patientData)
  
  useEffect(() => {
    if (!patientData) {
      const userData = localStorage.getItem('healthwyz_user')
      if (userData) {
        setLocalPatientData(JSON.parse(userData))
      }
    }
  }, [patientData])

  const patient = localPatientData || patientData

  if (!patient) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg text-center border border-gray-200">
        <FaShieldAlt className="text-gray-400 text-3xl sm:text-4xl mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Insurance Data Available</h3>
        <p className="text-gray-500 text-sm sm:text-base">Please update your insurance information</p>
      </div>
    )
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId)
  }

  const sections = [
    { id: 'coverage', label: 'Coverage Details', icon: FaShieldAlt, color: 'blue' },
    { id: 'billing', label: 'Billing & Payment', icon: FaCreditCard, color: 'green' },
    { id: 'subscription', label: 'Health Plan', icon: FaStar, color: 'purple' },
    { id: 'claims', label: 'Claims History', icon: FaFileInvoice, color: 'orange' },
    { id: 'benefits', label: 'Benefits Usage', icon: FaGift, color: 'pink' }
  ]

  // Calculate coverage percentages
  const calculateCoverageUsage = () => {
    const deductibleUsed = patient.medicineOrders ? 
      patient.medicineOrders.reduce((sum, order) => sum + order.totalAmount, 0) * 0.2 : 0
    const deductiblePercentage = Math.min((deductibleUsed / patient.insuranceCoverage.deductible) * 100, 100)
    
    return {
      deductibleUsed,
      deductiblePercentage,
      remainingDeductible: Math.max(patient.insuranceCoverage.deductible - deductibleUsed, 0)
    }
  }

  const coverageUsage = calculateCoverageUsage()

  // Mock claims data based on patient's medical history
  const generateClaims = () => {
    const claims: { id: string; date: string; type: string; provider: string; amount: number; coveredAmount: number; copay: number; status: string; description: string }[] = []
    
    // Generate claims from appointments
    if (patient.pastAppointments) {
      patient.pastAppointments.forEach((apt, index) => {
        claims.push({
          id: `CLM-${apt.id}`,
          date: apt.date,
          type: 'Consultation',
          provider: apt.doctorName,
          amount: 1500,
          coveredAmount: 1200,
          copay: 300,
          status: 'approved',
          description: apt.reason
        })
      })
    }
    
    // Generate claims from lab tests
    if (patient.labTests) {
      patient.labTests.forEach((test, index) => {
        claims.push({
          id: `CLM-LAB-${test.id}`,
          date: test.date,
          type: 'Lab Test',
          provider: test.facility,
          amount: 2500,
          coveredAmount: 2000,
          copay: 500,
          status: 'approved',
          description: test.testName
        })
      })
    }
    
    // Generate claims from medicine orders
    if (patient.medicineOrders) {
      patient.medicineOrders.forEach((order, index) => {
        if (order.status === 'delivered') {
          claims.push({
            id: `CLM-MED-${order.id}`,
            date: order.orderDate,
            type: 'Pharmacy',
            provider: 'Pharmacy Services',
            amount: order.totalAmount,
            coveredAmount: order.totalAmount * 0.8,
            copay: order.totalAmount * 0.2,
            status: 'approved',
            description: 'Prescription Medications'
          })
        }
      })
    }
    
    return claims.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const claims = generateClaims()
  
  // Calculate total savings
  const totalClaimsAmount = claims.reduce((sum, claim) => sum + claim.amount, 0)
  const totalCoveredAmount = claims.reduce((sum, claim) => sum + claim.coveredAmount, 0)
  const totalSavings = totalCoveredAmount

  const renderCoverageDetails = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Insurance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaShieldAlt className="text-2xl sm:text-3xl" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{patient.insuranceCoverage.provider}</h3>
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <p><span className="opacity-80">Policy:</span> {patient.insuranceCoverage.policyNumber}</p>
              <p><span className="opacity-80">Member ID:</span> {patient.insuranceCoverage.subscriberId}</p>
              {patient.insuranceCoverage.groupNumber && (
                <p><span className="opacity-80">Group:</span> {patient.insuranceCoverage.groupNumber}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm opacity-80">Coverage Type</p>
            <p className="text-base sm:text-lg md:text-xl font-bold capitalize">{patient.insuranceCoverage.coverageType}</p>
            <p className="text-xs sm:text-sm mt-2">
              Valid until {new Date(patient.insuranceCoverage.validUntil).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Coverage Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <FaHospital className="text-green-600 text-lg sm:text-xl" />
            <span className={`text-xs font-medium ${patient.insuranceCoverage.emergencyCoverage ? 'text-green-600' : 'text-red-600'}`}>
              {patient.insuranceCoverage.emergencyCoverage ? 'Active' : 'Not Covered'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Emergency Care</p>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {patient.insuranceCoverage.emergencyCoverage ? '100% Covered' : 'Not Available'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <FaPills className="text-purple-600 text-lg sm:text-xl" />
            <span className={`text-xs font-medium ${patient.insuranceCoverage.pharmacyCoverage ? 'text-green-600' : 'text-red-600'}`}>
              {patient.insuranceCoverage.pharmacyCoverage ? 'Active' : 'Not Covered'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Pharmacy</p>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {patient.insuranceCoverage.pharmacyCoverage ? '80% Covered' : 'Not Available'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <FaTooth className="text-yellow-600 text-lg sm:text-xl" />
            <span className={`text-xs font-medium ${patient.insuranceCoverage.dentalCoverage ? 'text-green-600' : 'text-red-600'}`}>
              {patient.insuranceCoverage.dentalCoverage ? 'Active' : 'Not Covered'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Dental</p>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {patient.insuranceCoverage.dentalCoverage ? '70% Covered' : 'Not Available'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-3 sm:p-4 border border-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <FaEye className="text-cyan-600 text-lg sm:text-xl" />
            <span className={`text-xs font-medium ${patient.insuranceCoverage.visionCoverage ? 'text-green-600' : 'text-red-600'}`}>
              {patient.insuranceCoverage.visionCoverage ? 'Active' : 'Not Covered'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Vision</p>
          <p className="text-base sm:text-lg font-bold text-gray-900">
            {patient.insuranceCoverage.visionCoverage ? '60% Covered' : 'Not Available'}
          </p>
        </div>
      </div>

      {/* Deductible and Copay Information */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-indigo-200">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaMoneyBillWave className="mr-2 text-indigo-600" />
          Deductible & Out-of-Pocket
        </h4>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Annual Deductible</span>
              <span className="text-sm sm:text-base font-bold text-gray-900">
                Rs {coverageUsage.deductibleUsed.toFixed(0)} / Rs {patient.insuranceCoverage.deductible}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${coverageUsage.deductiblePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Rs {coverageUsage.remainingDeductible.toFixed(0)} remaining
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-70 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-gray-600">Standard Copay</p>
              <p className="text-lg sm:text-xl font-bold text-indigo-600">Rs {patient.insuranceCoverage.copay}</p>
              <p className="text-xs text-gray-500">Per visit</p>
            </div>
            <div className="bg-white bg-opacity-70 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-gray-600">Out-of-Pocket Max</p>
              <p className="text-lg sm:text-xl font-bold text-purple-600">Rs 50,000</p>
              <p className="text-xs text-gray-500">Annual limit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderBillingPayment = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Payment Methods */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-green-200">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaCreditCard className="mr-2 text-green-600" />
          Payment Methods
        </h4>
        
        <div className="space-y-3">
          {patient.billingInformation.map((billing) => (
            <div 
              key={billing.id}
              className={`bg-white bg-opacity-80 rounded-xl p-3 sm:p-4 border-2 transition-all cursor-pointer hover:shadow-md ${
                billing.isDefault ? 'border-green-400' : 'border-gray-200'
              }`}
              onClick={() => setSelectedBillingMethod(billing.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                    billing.type === 'mcb_juice' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    <FaCreditCard className={`text-lg sm:text-xl ${
                      billing.type === 'mcb_juice' ? 'text-orange-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {billing.type === 'mcb_juice' ? 'MCB Juice' : 'Credit Card'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {billing.cardNumber} • Exp: {billing.expiryDate}
                    </p>
                    <p className="text-xs text-gray-500">{billing.cardHolder}</p>
                  </div>
                </div>
                <div className="text-right">
                  {billing.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Default
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Added {new Date(billing.addedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2 text-sm sm:text-base">
          <FaCreditCard />
          Add New Payment Method
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-200">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaReceipt className="mr-2 text-blue-600" />
          Recent Transactions
        </h4>
        
        <div className="space-y-3">
          {patient.medicineOrders && patient.medicineOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="bg-white bg-opacity-80 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Medicine Order #{order.id}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <div className="mt-1">
                    {order.medicines.slice(0, 2).map((med, index) => (
                      <p key={index} className="text-xs text-gray-500">• {med.name}</p>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-lg font-bold text-gray-900">Rs {order.totalAmount}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSubscriptionPlan = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Current Plan */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaStar className="text-2xl sm:text-3xl" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{patient.subscriptionPlan.planName}</h3>
            </div>
            <p className="text-xs sm:text-sm opacity-90 capitalize">
              {patient.subscriptionPlan.type} Plan • {patient.subscriptionPlan.billingCycle} Billing
            </p>
            {patient.subscriptionPlan.corporateName && (
              <p className="text-xs sm:text-sm mt-1 opacity-80">
                Sponsored by {patient.subscriptionPlan.corporateName}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold">
              Rs {patient.subscriptionPlan.corporateDiscount ? 0 : patient.subscriptionPlan.price}
            </p>
            <p className="text-xs sm:text-sm opacity-80">per {patient.subscriptionPlan.billingCycle}</p>
            {patient.subscriptionPlan.corporateDiscount && (
              <p className="text-xs sm:text-sm mt-1 bg-white bg-opacity-20 rounded px-2 py-1 inline-block">
                {patient.subscriptionPlan.corporateDiscount}% Corporate Discount
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white border-opacity-30">
          <p className="text-xs sm:text-sm opacity-80">Valid from {new Date(patient.subscriptionPlan.startDate).toLocaleDateString()} to {patient.subscriptionPlan.endDate ? new Date(patient.subscriptionPlan.endDate).toLocaleDateString() : 'Ongoing'}</p>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-purple-200">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaGift className="mr-2 text-purple-600" />
          Plan Benefits & Features
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {patient.subscriptionPlan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200">
          <FaUserMd className="text-blue-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs text-gray-600">Consultations</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {patient.pastAppointments ? patient.pastAppointments.length : 0}
          </p>
          <p className="text-xs text-gray-500">This period</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200">
          <FaPills className="text-green-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs text-gray-600">Prescriptions</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {patient.activePrescriptions ? patient.activePrescriptions.length : 0}
          </p>
          <p className="text-xs text-gray-500">Active</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-purple-200">
          <FaFlask className="text-purple-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs text-gray-600">Lab Tests</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            {patient.labTests ? patient.labTests.length : 0}
          </p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-4 border border-orange-200">
          <FaHeartbeat className="text-orange-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs text-gray-600">Wellness Score</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{patient.healthScore}%</p>
          <p className="text-xs text-gray-500">Current</p>
        </div>
      </div>
    </div>
  )

  const renderClaimsHistory = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Claims Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200">
          <FaMoneyBillWave className="text-green-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs sm:text-sm text-gray-600">Total Claims</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">Rs {totalClaimsAmount.toFixed(0)}</p>
          <p className="text-xs text-gray-500">All time</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200">
          <FaShieldAlt className="text-blue-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs sm:text-sm text-gray-600">Insurance Paid</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">Rs {totalCoveredAmount.toFixed(0)}</p>
          <p className="text-xs text-gray-500">Total covered</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-200">
          <FaPercentage className="text-purple-600 text-lg sm:text-xl mb-2" />
          <p className="text-xs sm:text-sm text-gray-600">You Saved</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">Rs {totalSavings.toFixed(0)}</p>
          <p className="text-xs text-gray-500">With insurance</p>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <FaFileInvoice className="mr-2 text-orange-600" />
            Recent Claims
          </h4>
          <button 
            onClick={() => setShowClaimForm(!showClaimForm)}
            className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-xs sm:text-sm"
          >
            File New Claim
          </button>
        </div>
        
        <div className="space-y-3">
          {claims.slice(0, 5).map((claim) => (
            <div key={claim.id} className="bg-white bg-opacity-80 rounded-lg p-3 sm:p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{claim.description}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {claim.type} • {claim.provider} • {new Date(claim.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Claim ID: {claim.id}</p>
                </div>
                <div className="flex sm:flex-col gap-4 sm:gap-1 sm:text-right">
                  <div>
                    <p className="text-xs text-gray-500">Billed</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">Rs {claim.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Covered</p>
                    <p className="text-sm sm:text-base font-semibold text-green-600">Rs {claim.coveredAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Your Cost</p>
                    <p className="text-sm sm:text-base font-semibold text-orange-600">Rs {claim.copay}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-lg hover:from-orange-200 hover:to-yellow-200 transition text-sm">
          View All Claims History
        </button>
      </div>
    </div>
  )

  const renderBenefitsUsage = () => (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Annual Benefits Overview */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-pink-200">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-pink-600" />
          Annual Benefits Usage
        </h4>
        
        <div className="space-y-4">
          {/* Doctor Visits */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FaUserMd className="text-blue-600" />
                <span className="text-xs sm:text-sm text-gray-700">Doctor Consultations</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {patient.pastAppointments ? patient.pastAppointments.length : 0} / Unlimited
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Lab Tests */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FaFlask className="text-purple-600" />
                <span className="text-xs sm:text-sm text-gray-700">Free Lab Tests</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {patient.labTests ? patient.labTests.length : 0} / 4 per year
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" 
                style={{ width: `${Math.min((patient.labTests ? patient.labTests.length : 0) / 4 * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Wellness Programs */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FaHeartbeat className="text-green-600" />
                <span className="text-xs sm:text-sm text-gray-700">Wellness Programs</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900">3 / 12 sessions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          {/* Home Nurse Visits */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FaUserNurse className="text-pink-600" />
                <span className="text-xs sm:text-sm text-gray-700">Home Nurse Visits</span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {patient.nurseBookings ? patient.nurseBookings.length : 0} / 24 per year
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" 
                style={{ width: `${Math.min((patient.nurseBookings ? patient.nurseBookings.length : 0) / 24 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-cyan-200">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaGift className="mr-2 text-cyan-600" />
          Additional Benefits Available
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaStethoscope className="text-blue-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Annual Health Screening</p>
                <p className="text-xs text-gray-600">Comprehensive checkup included</p>
                <button className="mt-2 text-xs text-blue-600 hover:underline">Schedule Now →</button>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaBaby className="text-pink-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Childcare Services</p>
                <p className="text-xs text-gray-600">Nanny services available</p>
                <button className="mt-2 text-xs text-pink-600 hover:underline">Learn More →</button>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaTooth className="text-yellow-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Dental Care</p>
                <p className="text-xs text-gray-600">70% coverage on treatments</p>
                <button className="mt-2 text-xs text-yellow-600 hover:underline">Find Dentist →</button>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start gap-3">
              <FaAmbulance className="text-red-600 mt-1" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Emergency Services</p>
                <p className="text-xs text-gray-600">24/7 ambulance service</p>
                <button className="mt-2 text-xs text-red-600 hover:underline">View Details →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center">
              <FaShieldAlt className="mr-2 sm:mr-3" />
              Insurance & Benefits
            </h2>
            <p className="opacity-90 text-xs sm:text-sm md:text-base">Manage your insurance coverage and health benefits</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">100%</p>
              <p className="text-xs opacity-90">Coverage Active</p>
            </div>
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">Rs {totalSavings.toFixed(0)}</p>
              <p className="text-xs opacity-90">Total Saved</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{claims.length}</p>
              <p className="text-xs opacity-90">Claims Filed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Accordion / Desktop Tabs */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Tab Navigation */}
        <div className="hidden sm:block border-b">
          <div className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setExpandedSection(section.id)}
                className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 text-center font-medium transition-all ${
                  expandedSection === section.id 
                    ? `text-${section.color}-600 border-b-2 border-current bg-${section.color}-50` 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <section.icon className="inline mr-2 text-sm md:text-base" />
                <span className="whitespace-nowrap text-sm md:text-base">{section.label}</span>
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
                  expandedSection === section.id ? `bg-${section.color}-50` : 'bg-white bg-opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <section.icon className={`text-${section.color}-500`} />
                  <span className={`font-medium ${
                    expandedSection === section.id ? `text-${section.color}-700` : 'text-gray-700'
                  }`}>
                    {section.label}
                  </span>
                </div>
                {expandedSection === section.id ? (
                  <FaChevronUp className={`text-${section.color}-500`} />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-4 bg-white bg-opacity-50">
                  {section.id === 'coverage' && renderCoverageDetails()}
                  {section.id === 'billing' && renderBillingPayment()}
                  {section.id === 'subscription' && renderSubscriptionPlan()}
                  {section.id === 'claims' && renderClaimsHistory()}
                  {section.id === 'benefits' && renderBenefitsUsage()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Content */}
        <div className="hidden sm:block p-4 md:p-6">
          {expandedSection === 'coverage' && renderCoverageDetails()}
          {expandedSection === 'billing' && renderBillingPayment()}
          {expandedSection === 'subscription' && renderSubscriptionPlan()}
          {expandedSection === 'claims' && renderClaimsHistory()}
          {expandedSection === 'benefits' && renderBenefitsUsage()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-3 md:gap-4">
          <button className="w-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-indigo-400/30 hover:to-purple-400/30 transition text-left">
            <FaFileInvoice className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">File a Claim</p>
            <p className="text-xs sm:text-sm opacity-90">Submit new claim</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-green-400/30 hover:to-emerald-400/30 transition text-left">
            <FaDownload className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Download Card</p>
            <p className="text-xs sm:text-sm opacity-90">Get insurance card</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-blue-400/30 hover:to-cyan-400/30 transition text-left">
            <FaPhone className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Contact Support</p>
            <p className="text-xs sm:text-sm opacity-90">Insurance help</p>
          </button>
          
          <button className="w-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 hover:from-pink-400/30 hover:to-purple-400/30 transition text-left">
            <FaHospital className="text-xl sm:text-2xl mb-2" />
            <p className="font-medium text-sm sm:text-base">Find Provider</p>
            <p className="text-xs sm:text-sm opacity-90">Network hospitals</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InsuranceInfo