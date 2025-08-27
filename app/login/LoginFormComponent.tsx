import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { 
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaEnvelope
} from 'react-icons/fa'
import { UserType, LoginFormData } from './types'

interface LoginFormComponentProps {
  selectedUserType: UserType;
  formData: LoginFormData;
  showPassword: boolean;
  isSubmitting: boolean;
  onFormChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onTogglePassword: () => void;
  onGoogleLogin: () => void;
}

export default function LoginFormComponent({ 
  selectedUserType, 
  formData, 
  showPassword, 
  isSubmitting,
  onFormChange, 
  onSubmit, 
  onTogglePassword, 
  onGoogleLogin 
}: LoginFormComponentProps) {
  return (
    <>
      {/* Login Form */}
      <form onSubmit={onSubmit} className="space-y-4">
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
              onChange={onFormChange}
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
              onChange={onFormChange}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={onTogglePassword}
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
        onClick={onGoogleLogin}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
      >
        <FaGoogle className="text-red-500" />
        <span className="text-gray-700 font-medium">Sign in with Google</span>
      </button>
      
      {/* Register Links */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600 text-sm">
          New to Healthwyz?{' '}
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
    </>
  )
}