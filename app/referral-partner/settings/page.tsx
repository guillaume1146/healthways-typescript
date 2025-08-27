'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaUserEdit, FaCreditCard, FaBell, FaFileUpload } from 'react-icons/fa'
import { 
  ActiveTab,
  ReferralPartnerSettings,
  BillingSettings,
  NotificationSettings
} from '../types'
import {
  TabButton,
  ProfileSettings,
  BillingSettingsComponent,
  NotificationSettingsComponent,
  DocumentSettings
} from '../SettingsComponents'
import {
  mockReferralPartnerSettings,
  mockBillingSettings, 
  mockNotificationSettings
} from '../constants'

function SettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams?.get('tab') as ActiveTab | null
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile')
  
  const [profile, setProfile] = useState<ReferralPartnerSettings>(mockReferralPartnerSettings)
  const [billing, setBilling] = useState<BillingSettings>(mockBillingSettings)
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotificationSettings)

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBilling(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Referral Partner Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              <TabButton 
                icon={FaUserEdit} 
                label="Profile Management" 
                tabName="profile" 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
              <TabButton 
                icon={FaCreditCard} 
                label="Billing & Payouts" 
                tabName="billing" 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
              <TabButton 
                icon={FaBell} 
                label="Notifications" 
                tabName="notifications" 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
              <TabButton 
                icon={FaFileUpload} 
                label="Documents" 
                tabName="documents" 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
          </aside>

          {/* Content Area */}
          <main className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              {activeTab === 'profile' && (
                <ProfileSettings 
                  profile={profile}
                  onProfileChange={handleProfileChange}
                />
              )}

              {activeTab === 'billing' && (
                <BillingSettingsComponent 
                  billing={billing}
                  onBillingChange={handleBillingChange}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationSettingsComponent 
                  notifications={notifications}
                  onNotificationToggle={handleNotificationToggle}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentSettings />
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
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Loading settings...</p>
      </div>
    </div>
  )
}

export default function ReferralPartnerSettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  )
}