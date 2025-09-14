'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/app/login/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedUserTypes, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userType, setUserType] = useState<string | null>(null)
  console.log(userType)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const user = AuthService.getFromLocalStorage()
      
      if (!user) {
        setIsAuthenticated(false)
        router.replace(fallbackPath)
        return
      }

      if (!allowedUserTypes.includes(user.userType)) {
        setIsAuthenticated(false)
        // Redirect to appropriate dashboard if user is authenticated but accessing wrong area
        const correctPath = AuthService.getUserTypeRedirectPath(user.userType)
        router.replace(correctPath)
        return
      }

      setIsAuthenticated(true)
      setUserType(user.userType)
    }

    checkAuth()
  }, [allowedUserTypes, fallbackPath, router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}