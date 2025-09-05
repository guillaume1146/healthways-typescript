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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl">

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Healthwyz</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Your trusted healthcare companion in Mauritius
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 h-2"></div>
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <UserTypeSelector 
                selectedUserType={selectedUserType}
                onUserTypeSelect={handleUserTypeSelect}
              />
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500 font-medium">Login Details</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="order-2 lg:order-1">
                <SelectedUserDisplay selectedUserType={selectedUserType} />
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Quick Access</h4>
                  <p className="text-sm text-blue-700">
                    Demo credentials are pre-filled for testing. Use password: <span className="font-mono font-bold">demo123</span>
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs">Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-xs">HIPAA Compliant</span>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
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
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? Contact support at <a href="mailto:support@healthwyz.mu" className="text-blue-600 hover:text-blue-700 font-medium">support@healthwyz.mu</a></p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default LoginForm