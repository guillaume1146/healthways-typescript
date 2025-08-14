'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import type { LoginFormData } from '@/types'

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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
      console.log('Login:', formData)
      // Add your authentication logic here
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h3 className="text-2xl font-bold text-center mb-2">Welcome Back</h3>
      <p className="text-center text-gray-600 mb-6">Sign in to your Healthways account</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email or Username
          </label>
          <input
            type="text"
            id="email"
            name="email"
            required
            placeholder="Enter your email or username"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-gradient py-3 mb-4 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
        
        <p className="text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary-blue hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginForm