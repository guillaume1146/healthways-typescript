'use client'
import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { userTypes } from './constants'
import { UserType, LoginFormData } from './types'
import UserTypeSelector from './UserTypeSelector'
import SelectedUserDisplay from './SelectedUserDisplay'
import LoginFormComponent from './LoginFormComponent'
import { AuthService } from './utils/auth'

const LoginForm: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState(userTypes[0])
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
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
    if (error) setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      console.log('Attempting login:', { email: formData.email, userType: selectedUserType.id })
      
      const authenticatedUser = AuthService.authenticate(
        formData.email,
        formData.password, 
        selectedUserType.id
      )

      if (!authenticatedUser) {
        setError('Invalid credentials. Please check your email, password, and selected user type.')
        setIsSubmitting(false)
        return
      }

      console.log('Authentication successful:', authenticatedUser)

      // Save to both localStorage and cookies
      AuthService.saveToLocalStorage(authenticatedUser)
      
      console.log('Data saved to storage, redirecting...')

      // Small delay to ensure cookies are set
      setTimeout(() => {
        setIsSubmitting(false)
        const redirectPath = AuthService.getUserTypeRedirectPath(selectedUserType.id)
        console.log('Redirecting to:', redirectPath)
        
        // Force page reload to ensure middleware picks up new cookies
        window.location.href = redirectPath
      }, 500)

    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const redirectPath = AuthService.getUserTypeRedirectPath(selectedUserType.id)
      window.location.href = redirectPath
    }, 1000)
  }

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType)
    setFormData({ email: '', password: '' })
    setError('')
    
    if (userType.demoEmail) {
      setFormData({ email: userType.demoEmail, password: '' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Healthwyz
          </h1>
          <p className="text-xl text-gray-600">
            Select your account type and sign in
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <UserTypeSelector 
              selectedUserType={selectedUserType}
              onUserTypeSelect={handleUserTypeSelect}
            />
            
            <SelectedUserDisplay selectedUserType={selectedUserType} />
          </div>

          <LoginFormComponent
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onGoogleLogin={handleGoogleLogin}
            selectedUserType={selectedUserType}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}

export default LoginForm