'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FaStethoscope, FaPills, FaFileAlt, FaRobot, FaUserNurse, FaBaby, FaAmbulance, FaFlask, FaShieldAlt } from 'react-icons/fa'

const ConsultationsContent = dynamic(() => import('../consultations/page'), { ssr: false, loading: () => <TabLoading /> })
const PrescriptionsContent = dynamic(() => import('../prescriptions/page'), { ssr: false, loading: () => <TabLoading /> })
const HealthRecordsContent = dynamic(() => import('../health-records/page'), { ssr: false, loading: () => <TabLoading /> })
const AiAssistantContent = dynamic(() => import('../ai-assistant/page'), { ssr: false, loading: () => <TabLoading /> })
const NurseServicesContent = dynamic(() => import('../nurse-services/page'), { ssr: false, loading: () => <TabLoading /> })
const ChildcareContent = dynamic(() => import('../childcare/page'), { ssr: false, loading: () => <TabLoading /> })
const EmergencyContent = dynamic(() => import('../emergency/page'), { ssr: false, loading: () => <TabLoading /> })
const LabResultsContent = dynamic(() => import('../lab-results/page'), { ssr: false, loading: () => <TabLoading /> })
const InsuranceContent = dynamic(() => import('../insurance/page'), { ssr: false, loading: () => <TabLoading /> })

function TabLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )
}

const TABS = [
  { id: 'ai', label: 'AI', icon: FaRobot },
  { id: 'consult', label: 'Consult', icon: FaStethoscope },
  { id: 'rx', label: 'Rx', icon: FaPills },
  { id: 'records', label: 'Records', icon: FaFileAlt },
  { id: 'nurse', label: 'Nurse', icon: FaUserNurse },
  { id: 'childcare', label: 'Child', icon: FaBaby },
  { id: 'emergency', label: 'SOS', icon: FaAmbulance },
  { id: 'lab', label: 'Lab', icon: FaFlask },
  { id: 'insurance', label: 'Cover', icon: FaShieldAlt },
] as const

type TabId = typeof TABS[number]['id']

export default function PatientHealthPage() {
  const [activeTab, setActiveTab] = useState<TabId>('ai')

  return (
    <div className="pb-20 sm:pb-0">
      <div className="hidden sm:block border-b border-gray-200 bg-white rounded-t-xl mb-0">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        {activeTab === 'ai' && <AiAssistantContent />}
        {activeTab === 'consult' && <ConsultationsContent />}
        {activeTab === 'rx' && <PrescriptionsContent />}
        {activeTab === 'records' && <HealthRecordsContent />}
        {activeTab === 'nurse' && <NurseServicesContent />}
        {activeTab === 'childcare' && <ChildcareContent />}
        {activeTab === 'emergency' && <EmergencyContent />}
        {activeTab === 'lab' && <LabResultsContent />}
        {activeTab === 'insurance' && <InsuranceContent />}
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-1.5 px-0.5 z-50 shadow-lg">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-0.5 min-w-[32px] ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="text-[8px] mt-0.5">{tab.label}</span>
              {isActive && <div className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
