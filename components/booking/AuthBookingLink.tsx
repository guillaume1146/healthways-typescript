'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useCallback } from 'react'
import type { BookingType } from '@/lib/booking/types'

interface AuthBookingLinkProps {
  type: BookingType
  providerId?: string
  children: ReactNode
  className?: string
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export default function AuthBookingLink({ type, providerId, children, className }: AuthBookingLinkProps) {
  const router = useRouter()

  const bookingPath = type === 'emergency'
    ? '/patient/book/emergency'
    : `/patient/book/${type}/${providerId}`

  const handleClick = useCallback(() => {
    const userType = getCookie('healthwyz_userType')
    if (userType) {
      router.push(bookingPath)
    } else {
      router.push(`/login?returnUrl=${encodeURIComponent(bookingPath)}`)
    }
  }, [bookingPath, router])

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
