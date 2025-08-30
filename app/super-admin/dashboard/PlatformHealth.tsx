'use client'

import { useState, useEffect } from 'react'
import { FaServer, FaDatabase, FaNetworkWired, FaShieldAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

interface HealthMetric {
  service: string
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  responseTime: number
  errorRate: number
  lastCheck: string
  icon: React.ElementType
}

export default function PlatformHealth() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy')

  useEffect(() => {
    // Simulate real-time health monitoring
    const fetchHealth = () => {
      const metrics: HealthMetric[] = [
        {
          service: 'API Gateway',
          status: 'healthy',
          uptime: 99.99,
          responseTime: 45,
          errorRate: 0.01,
          lastCheck: '10 seconds ago',
          icon: FaNetworkWired
        },
        {
          service: 'Database Cluster',
          status: 'healthy',
          uptime: 99.98,
          responseTime: 12,
          errorRate: 0.02,
          lastCheck: '15 seconds ago',
          icon: FaDatabase
        },
        {
          service: 'Application Servers',
          status: 'warning',
          uptime: 99.85,
          responseTime: 180,
          errorRate: 0.5,
          lastCheck: '5 seconds ago',
          icon: FaServer
        },
        {
          service: 'Security Services',
          status: 'healthy',
          uptime: 100,
          responseTime: 22,
          errorRate: 0,
          lastCheck: '8 seconds ago',
          icon: FaShieldAlt
        }
      ]
      
      setHealthMetrics(metrics)
      
      // Determine overall health
      if (metrics.some(m => m.status === 'critical')) {
        setOverallHealth('critical')
      } else if (metrics.some(m => m.status === 'warning')) {
        setOverallHealth('warning')
      } else {
        setOverallHealth('healthy')
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-50'
      case 'warning': return 'text-yellow-500 bg-yellow-50'
      case 'critical': return 'text-red-500 bg-red-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-green-200'
      case 'warning': return 'border-yellow-200'
      case 'critical': return 'border-red-200'
      default: return 'border-gray-200'
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Platform Health Status</h2>
        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${getStatusColor(overallHealth)}`}>
          {overallHealth === 'healthy' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span className="font-semibold capitalize">{overallHealth}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthMetrics.map((metric, idx) => (
          <div key={idx} className={`bg-white rounded-xl p-6 shadow-lg border-2 ${getStatusBorder(metric.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getStatusColor(metric.status)}`}>
                <metric.icon className="text-2xl" />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-3">{metric.service}</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Uptime</span>
                <span className="font-medium text-gray-700">{metric.uptime}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Response Time</span>
                <span className="font-medium text-gray-700">{metric.responseTime}ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Error Rate</span>
                <span className="font-medium text-gray-700">{metric.errorRate}%</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-xs text-gray-400">Last checked: {metric.lastCheck}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed System Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">System Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">CPU Usage</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Memory Usage</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Storage Usage</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}