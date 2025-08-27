'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { userTypes } from './constants'
import { UserType, LoginFormData } from './types'
import UserTypeSelector from './UserTypeSelector'
import SelectedUserDisplay from './SelectedUserDisplay'
import LoginFormComponent from './LoginFormComponent'

const LoginForm: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(userTypes[0]) // Default to patient
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  
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

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType)
    // Clear form when switching user types
    setFormData({ email: '', password: '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Healthwyz</h3>
          <p className="text-gray-600">Select your account type and sign in</p>
        </div>

        {/* User Type Selector */}
        <UserTypeSelector 
          selectedUserType={selectedUserType}
          onUserTypeSelect={handleUserTypeSelect}
        />

        {/* Selected User Type Display */}
        <SelectedUserDisplay selectedUserType={selectedUserType} />
        
        {/* Login Form Component */}
        <LoginFormComponent 
          selectedUserType={selectedUserType}
          formData={formData}
          showPassword={showPassword}
          isSubmitting={isSubmitting}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    </div>
  )
}

export default LoginForm