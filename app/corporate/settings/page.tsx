'use client'

import { Suspense } from 'react'
import SettingsTabs from '../SettingsTabs'

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

export default function CorporateSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Corporate Settings</h1>
        <Suspense fallback={<SettingsLoading />}>
          <SettingsTabs />
        </Suspense>
      </div>
    </div>
  )
}