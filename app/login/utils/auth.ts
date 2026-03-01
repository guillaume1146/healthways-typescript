import { AuthUser } from '../types/auth'

const USER_TYPES_TO_PATHS: Record<string, string> = {
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  nurse: '/nurse/dashboard',
  'child-care-nurse': '/nanny/dashboard',
  pharmacy: '/pharmacist/dashboard',
  lab: '/lab-technician/dashboard',
  ambulance: '/responder/dashboard',
  admin: '/admin/dashboard',
  corporate: '/corporate/dashboard',
  insurance: '/insurance/dashboard',
  'referral-partner': '/referral-partner/dashboard',
}

export class AuthService {
  /**
   * Save minimal user info to localStorage for client-side display.
   * The JWT token is stored in httpOnly cookies (set by the login API response).
   */
  static saveToLocalStorage(user: AuthUser): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('healthwyz_user', JSON.stringify(user))
  }

  static getFromLocalStorage(): AuthUser | null {
    if (typeof window === 'undefined') return null
    try {
      const data = localStorage.getItem('healthwyz_user')
      return data ? (JSON.parse(data) as AuthUser) : null
    } catch {
      return null
    }
  }

  static clearLocalStorage(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('healthwyz_user')
  }

  static getUserTypeRedirectPath(userType: string): string {
    return USER_TYPES_TO_PATHS[userType] || '/login'
  }

  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Best-effort server-side cookie clear
    }
    AuthService.clearLocalStorage()
  }
}
