import { Suspense } from 'react'
import SettingsClient from './settings-client'
import { FaUserEdit } from 'react-icons/fa'

// A simple skeleton loader to show while the client component is loading
const SettingsSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-9 bg-gray-200 rounded-md w-1/3 mb-8"></div>
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4">
        <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
          <div className="h-12 bg-gray-300 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </aside>
      <main className="w-full md:w-3/4">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-md w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
          <div className="h-8 bg-gray-200 rounded-md w-full"></div>
        </div>
      </main>
    </div>
  </div>
);


export default function NurseSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsClient />
    </Suspense>
  )
}