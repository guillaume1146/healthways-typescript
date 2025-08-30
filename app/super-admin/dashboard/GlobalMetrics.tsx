'use client'

import { FaUsers, FaUserMd, FaHandshake, FaChartLine } from 'react-icons/fa'
import { TbTrendingUp, TbTrendingDown } from 'react-icons/tb'
import { useEffect, useState } from 'react'

interface MetricData {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ElementType
  color: string
  subMetrics?: { label: string; value: string | number }[]
}

export default function GlobalMetrics({ timeRange, region }: { timeRange: string; region: string }) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching real-time data
    const fetchMetrics = async () => {
      setLoading(true)
      // API call would go here
      setTimeout(() => {
        setMetrics([
          {
            title: 'Total Active Users',
            value: '287,453',
            change: 12.5,
            trend: 'up',
            icon: FaUsers,
            color: 'bg-blue-500',
            subMetrics: [
              { label: 'Patients', value: '245,890' },
              { label: 'Providers', value: '38,421' },
              { label: 'Partners', value: '3,142' }
            ]
          },
          {
            title: 'Healthcare Providers',
            value: '38,421',
            change: 8.3,
            trend: 'up',
            icon: FaUserMd,
            color: 'bg-green-500',
            subMetrics: [
              { label: 'Doctors', value: '12,450' },
              { label: 'Nurses', value: '18,230' },
              { label: 'Specialists', value: '7,741' }
            ]
          },
          {
            title: 'Corporate Partners',
            value: '3,142',
            change: 15.7,
            trend: 'up',
            icon: FaHandshake,
            color: 'bg-purple-500',
            subMetrics: [
              { label: 'Insurance', value: '892' },
              { label: 'Corporates', value: '1,456' },
              { label: 'Referral', value: '794' }
            ]
          },
          {
            title: 'Monthly Growth Rate',
            value: '23.4%',
            change: 5.2,
            trend: 'up',
            icon: FaChartLine,
            color: 'bg-orange-500',
            subMetrics: [
              { label: 'User Growth', value: '18.5%' },
              { label: 'Revenue Growth', value: '28.3%' }
            ]
          }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchMetrics()
  }, [timeRange, region])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Global Platform Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                <metric.icon className={`text-2xl ${metric.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <TbTrendingUp className="text-green-500" />
                ) : metric.trend === 'down' ? (
                  <TbTrendingDown className="text-red-500" />
                ) : null}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-500' : 
                  metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
            
            <h3 className="text-gray-600 text-sm mb-1">{metric.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">{metric.value}</p>
            
            {metric.subMetrics && (
              <div className="pt-4 border-t space-y-2">
                {metric.subMetrics.map((sub, subIdx) => (
                  <div key={subIdx} className="flex justify-between text-sm">
                    <span className="text-gray-500">{sub.label}</span>
                    <span className="font-medium text-gray-700">{sub.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}