import { Suspense } from 'react'
import SettingsClient from './settings-client'

const SettingsSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-9 bg-gray-200 rounded-md w-1/3 mb-8"></div>
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4">
        <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
          <div className="h-12 bg-red-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </aside>
      <main className="w-full md:w-3/4">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-24 bg-gray-200 rounded-md w-full"></div>
        </div>
      </main>
    </div>
  </div>
);

export default function EmergencySettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsClient />
    </Suspense>
  )
}