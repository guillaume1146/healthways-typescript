
'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import type { SignupFormData } from '@/types'

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    username: '',
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
      console.log('Signup:', formData)
      // Add your registration logic here
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      <h3 className="text-2xl font-bold text-center mb-2">Join Healthways</h3>
      <p className="text-center text-gray-600 mb-6">Create your account to get started</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            placeholder="Choose a username"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="signup-email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="signup-email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-blue"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="signup-password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="signup-password"
            name="password"
            required
            placeholder="Create a password"
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
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-blue hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignupForm