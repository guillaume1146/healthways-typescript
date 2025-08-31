// app/doctor/settings/page.tsx
'use client'

import { useState } from 'react'
import { 
  FaUserEdit, 
  FaCreditCard, 
  FaCrown, 
  FaSave,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaCcVisa,
  FaCcMastercard,
  FaMobileAlt,
  FaLock,
  FaShieldAlt,
  FaTrash
} from 'react-icons/fa'
import { useDoctorStore } from '../lib/data-store'

type ActiveTab = 'profile' | 'payment' | 'subscription'

// Subscription Plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'MUR',
    period: 'forever',
    features: [
      'Up to 10 patients per month',
      'Basic consultation features',
      'Email support',
      'Basic analytics'
    ],
    limitations: [
      'No video consultations',
      'Limited prescription templates',
      'No priority support'
    ],
    isCurrent: true,
    isDefault: true
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 4999,
    currency: 'MUR',
    period: 'monthly',
    features: [
      'Unlimited patients',
      'Video consultations',
      'Priority support',
      'Advanced analytics',
      'Prescription templates',
      'Patient mobile app access',
      'Lab integration'
    ],
    limitations: [],
    isCurrent: false,
    isDefault: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9999,
    currency: 'MUR',
    period: 'monthly',
    features: [
      'Everything in Professional',
      'Multi-clinic support',
      'API access',
      'Custom branding',
      'Dedicated account manager',
      'Training sessions',
      'Custom integrations',
      'White-label mobile app'
    ],
    limitations: [],
    isCurrent: false,
    isDefault: false
  }
]

export default function DoctorSettingsPage() {
  const { profile, updateProfile, subscription, updateSubscription, paymentMethods, addPaymentMethod, removePaymentMethod } = useDoctorStore()
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS.find(p => p.isCurrent))
  
  // Profile form state
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    specialty: profile.specialty,
    bio: profile.bio,
    consultationFee: profile.consultationFee,
    videoConsultationFee: profile.videoConsultationFee
  })

  // Payment method form
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'visa' as 'visa' | 'mastercard' | 'mcb_juice',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    mcbPhone: ''
  })

  const handleSaveProfile = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.type === 'mcb_juice') {
      if (newPaymentMethod.mcbPhone) {
        addPaymentMethod({
          id: Date.now().toString(),
          type: 'mcb_juice',
          isEnabled: true,
          lastFour: newPaymentMethod.mcbPhone.slice(-4)
        })
        setShowAddPayment(false)
        setNewPaymentMethod({
          type: 'visa',
          cardNumber: '',
          cardName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          mcbPhone: ''
        })
      }
    } else {
      if (newPaymentMethod.cardNumber && newPaymentMethod.cardName && newPaymentMethod.expiryMonth && newPaymentMethod.expiryYear && newPaymentMethod.cvv) {
        addPaymentMethod({
          id: Date.now().toString(),
          type: newPaymentMethod.type,
          isEnabled: true,
          lastFour: newPaymentMethod.cardNumber.slice(-4)
        })
        setShowAddPayment(false)
        setNewPaymentMethod({
          type: 'visa',
          cardNumber: '',
          cardName: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          mcbPhone: ''
        })
      }
    }
  }

  const handleUpgradePlan = (planId: string) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
    if (plan) {
      updateSubscription({
        id: plan.id as 'free' | 'professional' | 'premium',
        name: plan.name,
        price: plan.price,
        features: plan.features,
        isActive: true
      })
      setSelectedPlan(plan)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Account Settings</h1>
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaUserEdit className="mr-3 text-lg" />
                Profile Settings
              </button>
              
              <button
                onClick={() => setActiveTab('payment')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'payment'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaCreditCard className="mr-3 text-lg" />
                Payment Methods
              </button>
              
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'subscription'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaCrown className="mr-3 text-lg" />
                Subscription
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Profile Settings</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <FaSave />
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                        <input
                          type="text"
                          value={formData.specialty}
                          onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (MUR)</label>
                        <input
                          type="number"
                          value={formData.consultationFee}
                          onChange={(e) => setFormData({...formData, consultationFee: parseInt(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video Consultation Fee (MUR)</label>
                        <input
                          type="number"
                          value={formData.videoConsultationFee}
                          onChange={(e) => setFormData({...formData, videoConsultationFee: parseInt(e.target.value)})}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Payment Methods</h2>
                    <button
                      onClick={() => setShowAddPayment(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <FaCreditCard />
                      Add Payment Method
                    </button>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-yellow-600 mt-1" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">Accepted Payment Methods</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          We accept MCB Juice, Visa, and Mastercard for all transactions. Cash and bank transfers are not supported.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods List */}
                  <div className="space-y-4">
                    {/* MCB Juice */}
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FaMobileAlt className="text-orange-600 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">MCB Juice</p>
                          <p className="text-sm text-gray-600">Mobile payment</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Recommended
                        </span>
                      </div>
                    </div>

                    {/* Saved Cards */}
                    {paymentMethods.filter(m => m.type !== 'mcb_juice').map((method) => (
                      <div key={method.id} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {method.type === 'visa' ? (
                              <FaCcVisa className="text-blue-600 text-xl" />
                            ) : (
                              <FaCcMastercard className="text-red-600 text-xl" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.lastFour}
                            </p>
                            <p className="text-sm text-gray-600">Credit/Debit Card</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removePaymentMethod(method.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Security Notice */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaShieldAlt className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm text-blue-900 font-medium">Secure Payment Processing</p>
                        <p className="text-sm text-blue-800 mt-1">
                          All payment information is encrypted and processed securely. We never store your full card details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Subscription Plans</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className={`border-2 rounded-xl p-6 ${
                          plan.isCurrent
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {plan.isDefault && (
                          <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                            DEFAULT
                          </div>
                        )}
                        {plan.isCurrent && !plan.isDefault && (
                          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                            CURRENT PLAN
                          </div>
                        )}
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-900">
                            {plan.price === 0 ? 'Free' : `Rs ${plan.price.toLocaleString()}`}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-gray-600">/{plan.period}</span>
                          )}
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <FaCheck className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {plan.limitations.length > 0 && (
                          <ul className="space-y-2 mb-6 border-t pt-4">
                            {plan.limitations.map((limitation, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                                <FaTimes className="text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        {!plan.isCurrent && (
                          <button
                            onClick={() => handleUpgradePlan(plan.id)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              plan.price > (selectedPlan?.price || 0)
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {plan.price > (selectedPlan?.price || 0) ? 'Upgrade' : 'Select'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                <select
                  value={newPaymentMethod.type}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value as 'visa' | 'mastercard' | 'mcb_juice'})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="mcb_juice">MCB Juice</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                </select>
              </div>
              
              {newPaymentMethod.type === 'mcb_juice' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newPaymentMethod.mcbPhone}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, mcbPhone: e.target.value})}
                    placeholder="+230 5XXX XXXX"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                    <input
                      type="text"
                      value={newPaymentMethod.cardName}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newPaymentMethod.expiryMonth}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: e.target.value})}
                          placeholder="MM"
                          maxLength={2}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={newPaymentMethod.expiryYear}
                          onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryYear: e.target.value})}
                          placeholder="YY"
                          maxLength={2}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={newPaymentMethod.cvv}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvv: e.target.value})}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <FaLock className="text-gray-500 mt-0.5" />
                  <p className="text-xs text-gray-600">
                    Your payment information is encrypted and secure. We comply with PCI DSS standards.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPayment(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}