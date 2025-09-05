import { AuthUser } from '@/app/login/types/auth'
import { AuthService } from '@/app/login/utils/auth'
import { useState, useEffect } from 'react'


export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const userData = AuthService.getFromLocalStorage()
      setUser(userData)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (userData: AuthUser) => {
    AuthService.saveToLocalStorage(userData)
    setUser(userData)
  }

  const logout = () => {
    AuthService.clearLocalStorage()
    setUser(null)
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  }
}