'use client'

import { useState } from 'react'
import { FaBell, FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa'

export interface NotificationOption {
  key: string
  label: string
  description?: string
}

interface NotificationSettingsTabProps {
  options: NotificationOption[]
  defaults?: Record<string, boolean>
}

const NotificationSettingsTab: React.FC<NotificationSettingsTabProps> = ({
  options,
  defaults = {},
}) => {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    options.forEach((opt) => {
      initial[opt.key] = defaults[opt.key] ?? true
    })
    return initial
  })

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBell className="text-blue-600" /> Notification Preferences
      </h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
            <div>
              <p className="font-medium text-gray-800">{opt.label}</p>
              {opt.description && <p className="text-sm text-gray-500">{opt.description}</p>}
            </div>
            <button type="button" onClick={() => toggle(opt.key)} aria-label={`Toggle ${opt.label}`}>
              {settings[opt.key] ? (
                <FaToggleOn className="text-3xl text-green-500" />
              ) : (
                <FaToggleOff className="text-3xl text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="text-right pt-6 mt-6 border-t">
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2 ml-auto">
          <FaSave /> Save Preferences
        </button>
      </div>
    </div>
  )
}

export default NotificationSettingsTab
