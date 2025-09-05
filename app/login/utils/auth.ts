import { createAuthData } from "../data/userData";
import { AuthUser, BaseAuthenticatedUser } from '../types/auth';

export class AuthService {
  private static authData: Record<string, BaseAuthenticatedUser> = createAuthData();

  static authenticate(email: string, password: string, userType: string): AuthUser | null {
    const user = this.authData[email.toLowerCase()];
    
    if (!user) {
      return null;
    }

    if (user.password !== password) {
      return null;
    }

    if (user.userType !== userType) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: user.token,
      userType: user.userType,
      profileImage: user.profileImage
    };
  }

  // Updated to save to both localStorage AND cookies
  static saveToLocalStorage(user: AuthUser): void {
    // Save to localStorage for client-side access
    localStorage.setItem('healthwyz_user', JSON.stringify(user));
    localStorage.setItem('healthwyz_token', user.token);
    localStorage.setItem('healthwyz_userType', user.userType);
    
    // IMPORTANT: Also save to cookies for middleware access
    this.setCookie('healthwyz_token', user.token, 7); // 7 days
    this.setCookie('healthwyz_userType', user.userType, 7);
    this.setCookie('healthwyz_user_id', user.id, 7);
  }

  // Helper method to set cookies
  static setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  // Helper method to get cookie value
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  static getFromLocalStorage(): AuthUser | null {
    try {
      const userData = localStorage.getItem('healthwyz_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Updated to clear both localStorage AND cookies
  static clearLocalStorage(): void {
    // Clear localStorage
    localStorage.removeItem('healthwyz_user');
    localStorage.removeItem('healthwyz_token');
    localStorage.removeItem('healthwyz_userType');
    
    // Clear cookies
    this.setCookie('healthwyz_token', '', -1);
    this.setCookie('healthwyz_userType', '', -1);
    this.setCookie('healthwyz_user_id', '', -1);
  }

  static getUserTypeRedirectPath(userType: string): string {
    const redirectPaths: Record<string, string> = {
      'patient': '/patient/dashboard',
      'doctor': '/doctor/dashboard',
      'nurse': '/nurse/dashboard',
      'child-care-nurse': '/nanny/dashboard',
      'pharmacy': '/pharmacist/dashboard',
      'lab': '/lab-technician/dashboard',
      'ambulance': '/responder/dashboard',
      'admin': '/admin/dashboard',
      'corporate': '/corporate/dashboard',
      'insurance': '/insurance/dashboard',
      'referral-partner': '/referral-partner/dashboard'
    };
    
    return redirectPaths[userType] || '/dashboard';
  }
}