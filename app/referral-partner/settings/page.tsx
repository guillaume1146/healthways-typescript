'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaUserEdit, FaCreditCard, FaBell, FaFileUpload, FaSpinner } from 'react-icons/fa'
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
  emptyReferralPartnerSettings,
  emptyBillingSettings,
  emptyNotificationSettings
} from '../constants'

function SettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams?.get('tab') as ActiveTab | null
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || 'profile')

  const [profile, setProfile] = useState<ReferralPartnerSettings>(emptyReferralPartnerSettings)
  const [billing, setBilling] = useState<BillingSettings>(emptyBillingSettings)
  const [notifications, setNotifications] = useState<NotificationSettings>(emptyNotificationSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const stored = localStorage.getItem('healthwyz_user')
        if (!stored) return
        let userId: string
        try { userId = JSON.parse(stored).id } catch { return }
        const res = await fetch(`/api/users/${userId}`)
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            const d = json.data
            const rp = d.referralPartnerProfile || {}
            setProfile({
              name: `${d.firstName || ''} ${d.lastName || ''}`.trim(),
              email: d.email || '', phone: d.phone || '',
              address: rp.address || '', dateOfBirth: d.dateOfBirth || '',
              businessType: rp.businessType || '', taxId: rp.taxId || ''
            })
            if (rp.billing) setBilling(rp.billing)
            if (rp.notifications) setNotifications(rp.notifications)
          }
        }
      } catch {
        // Failed to fetch settings
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-purple-600" />
      </div>
    )
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