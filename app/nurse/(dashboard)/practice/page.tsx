'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FaCalendarCheck, FaClipboardList, FaUsers, FaMedkit } from 'react-icons/fa'

const AppointmentsContent = dynamic(() => import('../appointments/page'), { ssr: false, loading: () => <TabLoading /> })
const BookingRequestsContent = dynamic(() => import('../booking-requests/page'), { ssr: false, loading: () => <TabLoading /> })
const PatientsContent = dynamic(() => import('../patients/page'), { ssr: false, loading: () => <TabLoading /> })
const ServicesContent = dynamic(() => import('../services/page'), { ssr: false, loading: () => <TabLoading /> })

function TabLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
    </div>
  )
}

const TABS = [
  { id: 'appointments', label: 'Appointments', icon: FaCalendarCheck },
  { id: 'requests', label: 'Requests', icon: FaClipboardList },
  { id: 'patients', label: 'Patients', icon: FaUsers },
  { id: 'services', label: 'Services', icon: FaMedkit },
] as const

type TabId = typeof TABS[number]['id']

export default function NursePracticePage() {
  const [activeTab, setActiveTab] = useState<TabId>('appointments')

  return (
    <div className="pb-20 sm:pb-0">
      {/* Desktop tab bar */}
      <div className="hidden sm:block border-b border-gray-200 bg-white rounded-t-xl mb-0">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={isActive ? 'text-teal-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'appointments' && <AppointmentsContent />}
        {activeTab === 'requests' && <BookingRequestsContent />}
        {activeTab === 'patients' && <PatientsContent />}
        {activeTab === 'services' && <ServicesContent />}
      </div>

      {/* Mobile bottom tab bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-1 z-50 shadow-lg">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1 min-w-[40px] ${
                isActive ? 'text-teal-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && <div className="w-1 h-1 bg-teal-600 rounded-full mt-0.5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
