'use client'

import { useState } from 'react'
import Link from 'next/link'
import PredictiveAnalytics from './PredictiveAnalytics' // Import the child component

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = [
    { code: 'all', name: 'All Regions', flag: '🌍' },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600">Deep dive into platform-wide trends and predictions.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Region Selector */}
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              {regions.map(region => (
                <option key={region.code} value={region.code}>
                  {region.flag} {region.name}
                </option>
              ))}
            </select>
            <Link href="/super-admin/dashboard" className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* The PredictiveAnalytics component is now a child, receiving state as props */}
        <PredictiveAnalytics dateRange={timeRange} region={selectedRegion} />
        
        {/* You can add more analytic components here */}
      </main>
    </div>
  );
}