import { Suspense } from 'react'
import DoctorSettingsPage from './settings-client'

export default function Page() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <DoctorSettingsPage />
    </Suspense>
  )
}

function SettingsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        <p className="mt-4 text-gray-600">Loading settings...</p>
      </div>
    </div>
  )
}