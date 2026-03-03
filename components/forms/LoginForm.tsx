'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaEnvelope,
} from 'react-icons/fa'
import type { LoginFormData } from '@/types'

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setError('')
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid credentials')
        setIsSubmitting(false)
        return
      }

      // Store user data in localStorage for client-side access
      localStorage.setItem('healthwyz_user', JSON.stringify(data.user))

      // Redirect to the user's dashboard (auto-detected from their role)
      router.push(data.redirectPath || '/patient/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    setError('Google sign-in coming soon. Please use email/password.')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
        <p className="text-gray-600">Sign in to your Healthwyz account</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

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
              placeholder="Enter your email"
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
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing In...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
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

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          New to Healthwyz?{' '}
          <Link href="/signup" className="text-primary-blue hover:underline font-medium">
            Create an account
          </Link>
        </p>
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
