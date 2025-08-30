// app/super-admin/dashboard/ActivityHeatmap.tsx
'use client'

import { useState, useEffect } from 'react'
import { FaUsers, FaChartBar, FaDollarSign } from 'react-icons/fa'
import type { IconType } from 'react-icons'

// Type Definitions for strictness
interface RegionActivity {
  region: string;
  code: string;
  flag: string;
  activeUsers: number;
  transactions: number;
  revenue: number;
  growth: number;
  peakTime: string;
  popularServices: string[];
}

// FIX 1: Define a specific type for the metric keys
type MetricKey = 'users' | 'transactions' | 'revenue';

// FIX 2: Define a type for the metric objects in the array
interface Metric {
  key: MetricKey;
  label: string;
  icon: IconType;
}

export default function ActivityHeatmap() {
  const [regionActivities, setRegionActivities] = useState<RegionActivity[]>([]);
  // Use the MetricKey type for the state
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('users');

  useEffect(() => {
    // Simulate fetching regional activity data
    setRegionActivities([
      { region: 'Mauritius', code: 'MU', flag: '🇲🇺', activeUsers: 45230, transactions: 12450, revenue: 285000, growth: 15.3, peakTime: '14:00 - 16:00', popularServices: ['Consultations', 'Lab Tests', 'Pharmacy'] },
      { region: 'Kenya', code: 'KE', flag: '🇰🇪', activeUsers: 78920, transactions: 18920, revenue: 425000, growth: 22.7, peakTime: '10:00 - 12:00', popularServices: ['Emergency', 'Consultations', 'Insurance'] },
      { region: 'Madagascar', code: 'MG', flag: '🇲🇬', activeUsers: 34560, transactions: 8750, revenue: 156000, growth: 18.5, peakTime: '08:00 - 10:00', popularServices: ['Consultations', 'Pharmacy', 'Child Care'] },
      { region: 'South Africa', code: 'ZA', flag: '🇿🇦', activeUsers: 92340, transactions: 24300, revenue: 580000, growth: 28.9, peakTime: '16:00 - 18:00', popularServices: ['Insurance', 'Specialists', 'Lab Tests'] },
      { region: 'Nigeria', code: 'NG', flag: '🇳🇬', activeUsers: 125600, transactions: 31200, revenue: 720000, growth: 35.2, peakTime: '12:00 - 14:00', popularServices: ['Consultations', 'Emergency', 'Pharmacy'] }
    ]);
  }, []);

  // FIX 3: Apply the Metric type to the array for type safety
  const metrics: Metric[] = [
    { key: 'users', label: 'Active Users', icon: FaUsers },
    { key: 'transactions', label: 'Transactions', icon: FaChartBar },
    { key: 'revenue', label: 'Revenue', icon: FaDollarSign },
  ];

  const getHeatmapColor = (value: number, max: number) => {
    const intensity = value / max;
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-yellow-500';
    if (intensity > 0.2) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getMaxValue = () => {
    if (regionActivities.length === 0) return 1;
    const values = regionActivities.map(r => {
      if (selectedMetric === 'users') return r.activeUsers;
      if (selectedMetric === 'transactions') return r.transactions;
      return r.revenue;
    });
    return Math.max(...values);
  };

  const getValue = (region: RegionActivity) => {
    if (selectedMetric === 'users') return region.activeUsers;
    if (selectedMetric === 'transactions') return region.transactions;
    return region.revenue;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Cross-Region Activity Heatmap</h2>
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
          {metrics.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              // FIX 4: Removed 'as any'. TypeScript now knows `key` is of type MetricKey.
              onClick={() => setSelectedMetric(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedMetric === key ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regionActivities.map((region) => {
            const maxValue = getMaxValue();
            const value = getValue(region);
            const colorClass = getHeatmapColor(value, maxValue);
            
            return (
              <div key={region.code} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{region.flag}</span>
                    <h3 className="font-semibold text-gray-900">{region.region}</h3>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${colorClass}`} title={`Activity: ${Math.round((value/maxValue) * 100)}%`}></div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Active Users</span>
                    <span className="font-medium">{region.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transactions</span>
                    <span className="font-medium">{region.transactions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Revenue</span>
                    <span className="font-medium">${region.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Growth</span>
                    <span className={`font-medium ${region.growth > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      +{region.growth}%
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t mt-2">
                    <p className="text-xs text-gray-500 mb-1">Peak Time: {region.peakTime}</p>
                    <div className="flex flex-wrap gap-1">
                      {region.popularServices.map((service, sIdx) => (
                        <span key={sIdx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}