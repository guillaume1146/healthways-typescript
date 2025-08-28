'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
    FaUserEdit, FaCreditCard, FaBell, FaSave, FaToggleOn, FaToggleOff,
    FaUniversity, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaIdCard, FaCertificate, FaLanguage, FaTimes
} from 'react-icons/fa'
import { IconType } from 'react-icons'

type ActiveTab = 'profile' | 'billing' | 'notifications'

interface TabButtonProps {
  icon: IconType
  label: string
  tabName: ActiveTab
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

interface InsuranceProfileSettings {
    name: string
    email: string
    phone: string
    alternatePhone: string
    address: string
    companyName: string
    licenseNumber: string
    specialization: string
    experience: number
    bio: string
    languages: string[]
}

interface BillingSettings {
    accountType: 'MCB Juice' | 'Bank Transfer' | 'Mobile Money'
    accountDetails: {
        accountNumber: string
        accountName: string
        bankName: string
    }
    commissionRate: number
    paymentMethods: string[]
    taxId: string
}

interface NotificationSettings {
    policyExpiry: boolean
    claimUpdates: boolean
    paymentReminders: boolean
    commissionAlerts: boolean
    systemUpdates: boolean
}

// Mock Data
const mockProfileData: InsuranceProfileSettings = {
    name: "Marie Dubois",
    email: "marie.dubois@swissre.mu",
    phone: "+230 5789 0123",
    alternatePhone: "+230 5789 0124",
    address: "456 St. Louis Street, Port Louis, Mauritius",
    companyName: "SwissRe Mauritius",
    licenseNumber: "INS-2020-5678",
    specialization: "Health & Life Insurance",
    experience: 8,
    bio: "Experienced insurance representative specializing in health and life insurance products. Committed to providing comprehensive coverage solutions for individuals and families.",
    languages: ["English", "French", "Creole"]
}

const mockBillingData: BillingSettings = {
    accountType: 'MCB Juice',
    accountDetails: {
        accountNumber: '•••• •••• 5678',
        accountName: 'Marie Dubois',
        bankName: 'MCB',
    },
    commissionRate: 15,
    paymentMethods: ['MCB Juice', 'Bank Transfer', 'Mobile Money'],
    taxId: 'TAX-987654321',
}

const mockNotificationData: NotificationSettings = {
    policyExpiry: true,
    claimUpdates: true,
    paymentReminders: true,
    commissionAlerts: true,
    systemUpdates: false,
}

// Reusable Components
const TabButton = ({ icon: Icon, label, tabName, activeTab, setActiveTab }: TabButtonProps) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
      activeTab === tabName
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="mr-3 text-lg" />
    {label}
  </button>
)

const TagInput = ({ 
    label, 
    tags, 
    onChange 
}: { 
    label: string
    tags: string[]
    onChange: (newTags: string[]) => void 
}) => {
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault()
            if (!tags.includes(inputValue.trim())) {
                onChange([...tags, inputValue.trim()])
            }
            setInputValue('')
        }
    }
    
    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove))
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded-full">
                        <FaLanguage className="text-xs" />
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-blue-600 hover:text-blue-800">
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter"
                    className="flex-1 border-none outline-none focus:ring-0 min-w-[150px]"
                />
            </div>
        </div>
    )
}

function InsuranceSettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as ActiveTab | null
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile')
  const [profile, setProfile] = useState<InsuranceProfileSettings>(mockProfileData)
  const [billing, setBilling] = useState<BillingSettings>(mockBillingData)
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotificationData)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleLanguageChange = (newLanguages: string[]) => {
    setProfile(prev => ({ ...prev, languages: newLanguages }))
  }

  const handlePaymentMethodToggle = (method: string) => {
    if (billing.paymentMethods.includes(method)) {
        setBilling(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.filter(m => m !== method)
        }))
    } else {
        setBilling(prev => ({
            ...prev,
            paymentMethods: [...prev.paymentMethods, method]
        }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Insurance Representative Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton icon={FaUserEdit} label="Profile Management" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaCreditCard} label="Billing & Payouts" tabName="billing" activeTab={activeTab} setActiveTab={setActiveTab} />
              <TabButton icon={FaBell} label="Notifications" tabName="notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </aside>

          {/* Content Area */}
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Profile Management Tab */}
              {activeTab === 'profile' && (
                <form className="space-y-8">
                  {/* Personal Information */}
                  <div className="pb-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative mt-1">
                          <FaUserEdit className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative mt-1">
                          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Primary Phone</label>
                        <div className="relative mt-1">
                          <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">Alternate Phone</label>
                        <div className="relative mt-1">
                          <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            id="alternatePhone"
                            name="alternatePhone"
                            value={profile.alternatePhone}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <div className="relative mt-1">
                          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                          <textarea
                            id="address"
                            name="address"
                            value={profile.address}
                            onChange={handleProfileChange}
                            rows={3}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="pb-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Professional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={profile.companyName}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">License Number</label>
                        <div className="relative mt-1">
                          <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="licenseNumber"
                            name="licenseNumber"
                            value={profile.licenseNumber}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                        <select
                          id="specialization"
                          name="specialization"
                          value={profile.specialization}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option>Health & Life Insurance</option>
                          <option>Motor Insurance</option>
                          <option>Property Insurance</option>
                          <option>Business Insurance</option>
                          <option>Marine Insurance</option>
                          <option>General Insurance</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                        <input
                          type="number"
                          id="experience"
                          name="experience"
                          value={profile.experience}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Professional Bio</label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <TagInput 
                      label="Languages Spoken" 
                      tags={profile.languages} 
                      onChange={handleLanguageChange} 
                    />
                  </div>

                  <div className="text-right pt-6 mt-6 border-t">
                    <button type="button" className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                      <FaSave />
                      Save Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Billing & Payouts Tab */}
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing & Payout Settings</h2>
                  
                  {/* Payout Account */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <FaUniversity className="text-xl" />
                          Primary Payout Account
                        </h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="font-medium">Type:</span> {billing.accountType}</p>
                          <p><span className="font-medium">Account:</span> {billing.accountDetails.accountNumber}</p>
                          <p><span className="font-medium">Name:</span> {billing.accountDetails.accountName}</p>
                          <p><span className="font-medium">Bank:</span> {billing.accountDetails.bankName}</p>
                          <p><span className="font-medium">Tax ID:</span> {billing.taxId}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Change Account
                        </button>
                        <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                          Add Secondary
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MCB Juice Integration */}
                  <div className="border rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">MCB Juice Integration</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src="https://www.mcb.mu/images/mcb-juice-logo.png" alt="MCB Juice" className="h-10" />
                        <div>
                          <p className="font-medium text-gray-800">MCB Juice</p>
                          <p className="text-sm text-gray-600">Enable instant payments through MCB Juice</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setBilling(prev => ({
                            ...prev,
                            accountType: prev.accountType === 'MCB Juice' ? 'Bank Transfer' : 'MCB Juice'
                          }))
                        }}
                      >
                        {billing.accountType === 'MCB Juice' ? (
                          <FaToggleOn className="text-4xl text-green-500" />
                        ) : (
                          <FaToggleOff className="text-4xl text-gray-400" />
                        )}
                      </button>
                    </div>
                    {billing.accountType === 'MCB Juice' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800 flex items-center gap-2">
                          <FaShieldAlt />
                          MCB Juice is connected and active
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Commission Settings */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Commission Settings</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Commission Rate</p>
                          <p className="text-sm text-gray-600">Your current commission percentage</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-600">{billing.commissionRate}%</span>
                          <p className="text-xs text-gray-500">Per policy sold</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">Accepted Payment Methods</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['MCB Juice', 'Bank Transfer', 'Mobile Money', 'Credit Card'].map(method => (
                        <label key={method} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={billing.paymentMethods.includes(method)}
                            onChange={() => handlePaymentMethodToggle(method)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="text-right mt-6">
                    <button type="button" className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                      <FaSave />
                      Save Billing Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {Object.entries({
                      policyExpiry: {
                        title: "Policy Expiry Alerts",
                        description: "Get notified when policies are about to expire"
                      },
                      claimUpdates: {
                        title: "Claim Status Updates", 
                        description: "Receive updates on claim processing status"
                      },
                      paymentReminders: {
                        title: "Payment Reminders",
                        description: "Reminders for premium payments and commissions"
                      },
                      commissionAlerts: {
                        title: "Commission Notifications",
                        description: "Notifications about commission payments and earnings"
                      },
                      systemUpdates: {
                        title: "System Updates",
                        description: "Platform updates and maintenance notices"
                      }
                    }).map(([key, { title, description }]) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-800">{title}</p>
                          <p className="text-sm text-gray-600">{description}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleNotificationToggle(key as keyof NotificationSettings)}
                        >
                          {notifications[key as keyof NotificationSettings] ? (
                            <FaToggleOn className="text-3xl text-green-500" />
                          ) : (
                            <FaToggleOff className="text-3xl text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-right pt-6 mt-6 border-t">
                    <button type="button" className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 inline-flex">
                      <FaSave />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function SettingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading settings...</p>
      </div>
    </div>
  )
}

export default function InsuranceSettings() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <InsuranceSettingsContent />
    </Suspense>
  )
}