'use client'

import { useState, useEffect } from 'react'

export interface DashboardUser {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
  profileImage: string | null
}

export function useDashboardUser(): DashboardUser | null {
  const [user, setUser] = useState<DashboardUser | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('healthwyz_user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser({
        id: parsed.id,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email ?? '',
        userType: parsed.userType,
        profileImage: parsed.profileImage ?? null,
      })
    }
  }, [])

  return user
}
