// app/super-admin/settings/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaCogs, FaGlobe, FaShieldAlt, FaDatabase, FaKey,
  FaBell, FaUserShield, FaWallet,
  FaToggleOn, FaToggleOff, FaSave, FaExclamationTriangle
} from 'react-icons/fa'

interface SettingSection {
  id: string
  title: string
  icon: React.ElementType
  description: string
}

export default function SuperAdminSettings() {
  const [activeSection, setActiveSection] = useState('platform')
  const [settings, setSettings] = useState({
    // Platform Settings
    maintenanceMode: false,
    debugMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // API Settings
    apiRateLimit: 1000,
    apiVersion: 'v2',
    webhookUrl: 'https://api.healthplatform.com/webhooks',
    apiKeyRotation: 90,
    
    // Security Settings
    twoFactorAuth: true,
    ipWhitelisting: false,
    sslEnforcement: true,
    dataEncryption: true,
    auditLogging: true,
    
    // Payment Settings
    paymentGateways: {
      stripe: true,
      paypal: true,
      mobileMoney: true, // Corrected typo from mobileWoney
      bankTransfer: true
    },
    platformFeePercentage: 2.5,
    minimumPayout: 100,
    payoutFrequency: 'weekly',
    
    // Regional Settings
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    supportedRegions: ['MU', 'KE', 'MG', 'ZA', 'NG'],
    timezone: 'UTC',
    
    // Notification Settings
    systemEmails: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  })

  const sections: SettingSection[] = [
    { id: 'platform', title: 'Platform Configuration', icon: FaCogs, description: 'Core platform settings and maintenance' },
    { id: 'api', title: 'API & Integrations', icon: FaKey, description: 'API keys, webhooks, and third-party integrations' },
    { id: 'security', title: 'Security & Compliance', icon: FaShieldAlt, description: 'Security policies and compliance settings' },
    { id: 'payment', title: 'Payment Gateway', icon: FaWallet, description: 'Payment processing and financial settings' },
    { id: 'regional', title: 'Regional Settings', icon: FaGlobe, description: 'Multi-region configuration and localization' },
    { id: 'database', title: 'Database Management', icon: FaDatabase, description: 'Database optimization and backup settings' },
    { id: 'notifications', title: 'Notifications', icon: FaBell, description: 'System-wide notification preferences' },
    { id: 'access', title: 'Access Control', icon: FaUserShield, description: 'Role-based access and permissions' }
  ]

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // API call to save settings would go here
    alert('Settings saved successfully! (Check console for data)');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-1">Configure global platform settings and preferences</p>
            </div>
            <Link 
              href="/super-admin/dashboard"
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-4 px-2">Settings Categories</h2>
              <nav className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${
                      activeSection === section.id 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <section.icon className="text-lg" />
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Platform Configuration */}
              {activeSection === 'platform' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Platform Configuration</h2>
                    <p className="text-gray-600">Manage core platform settings and operational modes</p>
                  </div>

                  <div className="space-y-6">
                    {/* Maintenance Mode */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-gray-600">Temporarily disable platform access for maintenance</p>
                      </div>
                      <button onClick={() => handleToggle('maintenanceMode')}>
                        {settings.maintenanceMode ? 
                          <FaToggleOn className="text-3xl text-blue-600" /> : 
                          <FaToggleOff className="text-3xl text-gray-400" />
                        }
                      </button>
                    </div>

                    {/* Debug Mode */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Debug Mode</p>
                        <p className="text-sm text-gray-600">Enable detailed error logging and debugging tools</p>
                      </div>
                      <button onClick={() => handleToggle('debugMode')}>
                        {settings.debugMode ? 
                          <FaToggleOn className="text-3xl text-blue-600" /> : 
                          <FaToggleOff className="text-3xl text-gray-400" />
                        }
                      </button>
                    </div>

                    {/* New Registrations */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Allow New Registrations</p>
                        <p className="text-sm text-gray-600">Enable or disable new user registrations</p>
                      </div>
                      <button onClick={() => handleToggle('allowNewRegistrations')}>
                        {settings.allowNewRegistrations ? 
                          <FaToggleOn className="text-3xl text-blue-600" /> : 
                          <FaToggleOff className="text-3xl text-gray-400" />
                        }
                      </button>
                    </div>

                    {/* Session Settings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.maxLoginAttempts}
                          onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API & Integrations */}
              {activeSection === 'api' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">API & Integrations</h2>
                    {/* FIX: Comment is now in JSX format */}
                    <p className="text-gray-600">Configure API access and third-party integrations</p>
                  </div>

                  <div className="space-y-6">
                    {/* API Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Rate Limit (requests/hour)
                        </label>
                        <input
                          type="number"
                          value={settings.apiRateLimit}
                          onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value, 10) || 0 }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Version
                        </label>
                        <select
                          value={settings.apiVersion}
                          onChange={(e) => setSettings(prev => ({ ...prev, apiVersion: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="v1">Version 1.0</option>
                          <option value="v2">Version 2.0</option>
                          <option value="v3">Version 3.0 (Beta)</option>
                        </select>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.webhookUrl}
                        onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="https://api.example.com/webhooks"
                      />
                    </div>

                    {/* API Keys */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-yellow-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-yellow-900">API Key Management</p>
                          <p className="text-sm text-yellow-700 mt-1">
                            Current API keys will rotate in {settings.apiKeyRotation} days.
                          </p>
                          <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm">
                            Generate New API Key
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add other sections similarly... */}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition"
                >
                  <FaSave />
                  Save All Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}