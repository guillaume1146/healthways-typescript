'use client'

import { useState } from 'react'
import {
  FaChartPie, FaUtensils, FaDumbbell, FaRobot,
  FaChartLine, FaCalendarAlt, FaUser,
} from 'react-icons/fa'

import DashboardTab from './tabs/DashboardTab'
import FoodDiaryTab from './tabs/FoodDiaryTab'
import ExerciseTab from './tabs/ExerciseTab'
import AiCoachTab from './tabs/AiCoachTab'
import ProgressTab from './tabs/ProgressTab'
import MealPlannerTab from './tabs/MealPlannerTab'
import ProfileGoalsTab from './tabs/ProfileGoalsTab'

interface HealthTrackerTabsProps {
  patientData?: any
}

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FaChartPie },
  { id: 'food', label: 'Food Diary', icon: FaUtensils },
  { id: 'exercise', label: 'Exercise', icon: FaDumbbell },
  { id: 'ai-coach', label: 'AI Coach', icon: FaRobot },
  { id: 'progress', label: 'Progress', icon: FaChartLine },
  { id: 'meal-plan', label: 'Meal Plan', icon: FaCalendarAlt },
  { id: 'profile', label: 'Profile', icon: FaUser },
]

export default function HealthTrackerTabs({ patientData }: HealthTrackerTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <DashboardTab onNavigateToTab={setActiveTab} />
      case 1: return <FoodDiaryTab />
      case 2: return <ExerciseTab />
      case 3: return <AiCoachTab patientData={patientData} />
      case 4: return <ProgressTab />
      case 5: return <MealPlannerTab />
      case 6: return <ProfileGoalsTab />
      default: return <DashboardTab onNavigateToTab={setActiveTab} />
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Desktop: Top tabs */}
      <div className="hidden md:flex items-center gap-1 bg-white border-b px-4 py-2 overflow-x-auto">
        {TABS.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === index
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-20 md:pb-4">
        {renderTab()}
      </div>

      {/* Mobile: Bottom tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 px-1 z-50">
        {TABS.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === index
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`flex flex-col items-center justify-center p-1 min-w-[40px] ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
