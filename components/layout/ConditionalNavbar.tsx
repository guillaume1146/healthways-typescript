'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const DASHBOARD_PREFIXES = [
  '/patient/', '/doctor/', '/nurse/', '/nanny/', '/pharmacist/',
  '/lab-technician/', '/responder/', '/insurance/', '/corporate/',
  '/referral-partner/', '/admin/', '/regional/',
]

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const isDashboard = DASHBOARD_PREFIXES.some((p) => pathname.startsWith(p))
    || DASHBOARD_PREFIXES.some((p) => pathname === p.slice(0, -1))

  if (isDashboard) return null
  return <Navbar />
}
