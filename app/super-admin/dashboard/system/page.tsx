'use client'

import { useState } from 'react'
import {
  FaServer, FaDatabase, FaMemory, FaHdd,
  FaCog, FaCheckCircle, FaExclamationTriangle, FaToggleOn, FaToggleOff
} from 'react-icons/fa'

export default function SuperAdminSystemPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const systemMetrics = [
    { title: 'Application Server', status: 'healthy', icon: FaServer, uptime: '99.99%', detail: 'Next.js + Node.js' },
    { title: 'Database', status: 'healthy', icon: FaDatabase, uptime: '99.98%', detail: 'PostgreSQL' },
    { title: 'Memory Usage', status: 'healthy', icon: FaMemory, uptime: '68%', detail: 'Allocated / Total' },
    { title: 'Storage', status: 'healthy', icon: FaHdd, uptime: '35%', detail: 'Used / Available' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' }
      case 'warning': return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' }
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaCog className="text-gray-500" /> System Management
        </h1>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow">
          <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
          <button onClick={() => setMaintenanceMode(!maintenanceMode)} className="text-2xl">
            {maintenanceMode ? <FaToggleOn className="text-red-500" /> : <FaToggleOff className="text-gray-400" />}
          </button>
        </div>
      </div>

      {maintenanceMode && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
          <FaExclamationTriangle className="text-red-500" />
          <p className="text-red-800 text-sm font-medium">Maintenance mode is active. Users will see a maintenance page.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, idx) => {
          const colors = getStatusColor(metric.status)
          return (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <metric.icon className={`text-xl ${colors.text}`} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className={`text-xs font-semibold ${colors.text}`}>{metric.status.toUpperCase()}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.uptime}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.detail}</p>
            </div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment</h2>
          <div className="space-y-3">
            {[
              { label: 'Runtime', value: 'Node.js' },
              { label: 'Framework', value: 'Next.js 15 (App Router)' },
              { label: 'Database', value: 'PostgreSQL (Prisma ORM)' },
              { label: 'Real-time', value: 'Socket.IO + WebRTC' },
              { label: 'Environment', value: process.env.NODE_ENV || 'development' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <FaDatabase className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-blue-900">Clear Application Cache</p>
                <p className="text-xs text-blue-700">Reset cached data and rebuild indexes</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <FaCheckCircle className="text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-900">Run Health Check</p>
                <p className="text-xs text-green-700">Verify all services are responding</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
              <FaServer className="text-purple-500" />
              <div>
                <p className="text-sm font-medium text-purple-900">Restart Services</p>
                <p className="text-xs text-purple-700">Gracefully restart application processes</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
