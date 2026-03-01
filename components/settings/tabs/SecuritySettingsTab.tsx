'use client'

import { useState } from 'react'
import { FaLock, FaSave, FaShieldAlt, FaToggleOn, FaToggleOff, FaKey } from 'react-icons/fa'

const SecuritySettingsTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }
    // In production this would call the API
    setMessage({ type: 'success', text: 'Password updated successfully' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaLock className="text-blue-600" /> Password Settings
        </h2>
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
            <FaSave /> Update Password
          </button>
        </form>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-blue-600" /> Two-Factor Authentication
        </h2>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium text-gray-800">Two-Factor Authentication (2FA)</p>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <button type="button" onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
            {twoFactorEnabled ? (
              <FaToggleOn className="text-4xl text-green-500" />
            ) : (
              <FaToggleOff className="text-4xl text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaKey className="text-blue-600" /> Active Sessions
        </h2>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Current Session</p>
              <p className="text-sm text-gray-600">This device &bull; Active now</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettingsTab
