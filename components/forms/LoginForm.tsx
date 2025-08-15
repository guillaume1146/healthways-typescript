// File: components/forms/LoginForm.tsx (Enhanced)
'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaUser, 
  FaUserMd, 
  FaUserNurse, 
  FaFlask, 
  FaPills, 
  FaAmbulance, 
  FaBuilding,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaEnvelope
} from 'react-icons/fa'
import type { LoginFormData } from '@/types'

import { IconType } from 'react-icons';

interface UserType {
  id: string;
  label: string;
  icon: IconType; // Use IconType instead of React.ComponentType
  description: string;
  redirectPath: string;
  demoEmail: string;
}



const userTypes: UserType[] = [
  {
    id: 'patient',
    label: 'Patient',
    icon: FaUser,
    description: 'Book appointments & manage health',
    redirectPath: '/patient/dashboard',
    demoEmail: 'patient@healthways.mu'
  },
  {
    id: 'doctor',
    label: 'Doctor',
    icon: FaUserMd,
    description: 'Manage patients & consultations',
    redirectPath: '/doctor/dashboard',
    demoEmail: 'dr.sarah@healthways.mu'
  },
  {
    id: 'nurse',
    label: 'Nurse',
    icon: FaUserNurse,
    description: 'Provide home care services',
    redirectPath: '/nurse/dashboard',
    demoEmail: 'nurse@healthways.mu'
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: FaPills,
    description: 'Manage inventory & prescriptions',
    redirectPath: '/pharmacy/dashboard',
    demoEmail: 'pharmacy@healthways.mu'
  },
  {
    id: 'lab',
    label: 'Lab Partner',
    icon: FaFlask,
    description: 'Laboratory services & results',
    redirectPath: '/lab/dashboard',
    demoEmail: 'lab@healthways.mu'
  },
  {
    id: 'ambulance',
    label: 'Ambulance',
    icon: FaAmbulance,
    description: 'Emergency services coordination',
    redirectPath: '/ambulance/dashboard',
    demoEmail: 'ambulance@healthways.mu'
  },
  {
    id: 'corporate',
    label: 'Corporate',
    icon: FaBuilding,
    description: 'Employee wellness programs',
    redirectPath: '/corporate/dashboard',
    demoEmail: 'corporate@healthways.mu'
  }
]

const LoginForm: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(userTypes[0]) // Default to patient
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const SelectedIcon = selectedUserType.icon;
  
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      console.log('Login attempt:', { ...formData, userType: selectedUserType.id })
      
      // Simulate authentication for static prototype
      setTimeout(() => {
        setIsSubmitting(false)
        // Redirect based on user type
        router.push(selectedUserType.redirectPath)
      }, 1500)
      
    } catch (error) {
      console.error('Login error:', error)
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push(selectedUserType.redirectPath)
    }, 1000)
  }

  const handleDemoLogin = (userType: UserType) => {
    setSelectedUserType(userType)
    setFormData({
      email: userType.demoEmail,
      password: 'demo123'
    })
  }

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType)
    // Clear form when switching user types
    setFormData({ email: '', password: '' })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Healthways</h3>
        <p className="text-gray-600">Select your account type and sign in</p>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">🚀 Demo Mode</h4>
        <p className="text-sm text-blue-700 mb-3">
          This is a static prototype. Select any user type and click login to access the demo dashboard.
        </p>
        <div className="flex flex-wrap gap-2">
          {userTypes.slice(0, 4).map((userType) => (
            <button
              key={userType.id}
              onClick={() => handleDemoLogin(userType)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition"
            >
              Demo {userType.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Type Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-3">I am a:</label>
        <div className="grid grid-cols-2 gap-3">
          {userTypes.map((userType) => {
            const Icon = userType.icon;
            return (
              <button
                key={userType.id}
                type="button"
                onClick={() => handleUserTypeSelect(userType)}
                className={`p-3 border-2 rounded-lg text-left transition ${
                  selectedUserType.id === userType.id
                    ? 'border-primary-blue bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`text-lg ${
                      selectedUserType.id === userType.id ? 'text-primary-blue' : 'text-gray-600'
                    }`}
                  />
                  <span
                    className={`font-medium text-sm ${
                      selectedUserType.id === userType.id ? 'text-primary-blue' : 'text-gray-900'
                    }`}
                  >
                    {userType.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{userType.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected User Type Display */}
      <div className="bg-gradient-main text-white rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            
<SelectedIcon className="text-white text-lg" />
          </div>
          <div>
            <div className="font-semibold">{selectedUserType.label} Portal</div>
            <div className="text-sm text-white/90">{selectedUserType.description}</div>
          </div>
        </div>
      </div>
      
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder={`Enter your ${selectedUserType.label.toLowerCase()} email`}
              className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:border-primary-blue"
              value={formData.email}
              onChange={handleChange}
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 pl-10 pr-12 border rounded-lg focus:outline-none focus:border-primary-blue"
              value={formData.password}
              onChange={handleChange}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue" 
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-primary-blue hover:underline">
            Forgot password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-gradient py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing In...
            </div>
          ) : (
            `Sign In to ${selectedUserType.label} Portal`
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
      >
        <FaGoogle className="text-red-500" />
        <span className="text-gray-700 font-medium">Sign in with Google</span>
      </button>
      
      {/* Register Links */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600 text-sm">
          New to Healthways?{' '}
          <Link href="/signup" className="text-primary-blue hover:underline font-medium">
            Register as Patient
          </Link>
        </p>
        {selectedUserType.id !== 'patient' && (
          <p className="text-gray-600 text-xs">
            Healthcare Professional?{' '}
            <Link href="/professional/register" className="text-primary-blue hover:underline">
              Register as {selectedUserType.label}
            </Link>
          </p>
        )}
      </div>

      {/* Help */}
      <div className="mt-4 text-center">
        <Link href="/help" className="text-xs text-gray-500 hover:underline">
          Need help? Contact Support
        </Link>
      </div>
    </div>
  )
}

export default LoginForm