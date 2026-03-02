'use client'

import { useState, useEffect } from 'react'
import {
  FaCog, FaSpinner, FaSave, FaBell, FaPercentage,
  FaGlobe, FaEnvelope
} from 'react-icons/fa'

export default function AdminSettingsPage() {
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState({
    // Commission Rates
    doctorCommission: 15,
    nurseCommission: 12,
    nannyCommission: 10,
    pharmacistCommission: 8,
    labTechCommission: 10,
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true,
    // Platform Settings
    maintenanceMode: false,
    platformName: 'Healthwyz',
    supportEmail: 'support@healthwyz.com',
    defaultCurrency: 'MUR',
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('healthwyz_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUserId(parsed.id)
      }
    } catch {
      // Corrupted localStorage
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const loadSettings = async () => {
      try {
        // Settings would be fetched from an API in production
        await new Promise((resolve) => setTimeout(resolve, 400))
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [userId])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      // In production this would POST to /api/admin/settings
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaCog className="text-2xl text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Settings</h1>
        </div>
        <p className="text-gray-600">Configure platform settings and commission rates</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Platform Settings */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <FaGlobe className="text-lg text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Platform Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => updateSetting('platformName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => updateSetting('supportEmail', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MUR">MUR - Mauritian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                  <p className="text-sm text-gray-500">Temporarily disable platform access</p>
                </div>
                <button
                  onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Commission Rates */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <FaPercentage className="text-lg text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Commission Rates</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'doctorCommission', label: 'Doctor Commission' },
                { key: 'nurseCommission', label: 'Nurse Commission' },
                { key: 'nannyCommission', label: 'Nanny Commission' },
                { key: 'pharmacistCommission', label: 'Pharmacist Commission' },
                { key: 'labTechCommission', label: 'Lab Technician Commission' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <label className="font-medium text-gray-700">{item.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={settings[item.key as keyof typeof settings] as number}
                      onChange={(e) => updateSetting(item.key, Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <FaBell className="text-lg text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email alerts for important events' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send SMS alerts to users' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Enable browser push notifications' },
                { key: 'adminAlerts', label: 'Admin Alerts', desc: 'Receive alerts for critical system events' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      updateSetting(item.key, !settings[item.key as keyof typeof settings])
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            {saved && (
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                Settings saved successfully
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {saving ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSave />
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
