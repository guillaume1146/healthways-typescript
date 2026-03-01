import { AuthUser } from '@/app/login/types/auth'
import { AuthService } from '@/app/login/utils/auth'
import { useState, useEffect, useCallback } from 'react'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = AuthService.getFromLocalStorage()
    setUser(userData)
    setIsLoading(false)
  }, [])

  const login = useCallback((userData: AuthUser) => {
    AuthService.saveToLocalStorage(userData)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    await AuthService.logout()
    setUser(null)
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}
