import { AuthUser } from '../types/auth';

export class AuthService {
   static saveToLocalStorage(user: AuthUser): void {
    // Store the complete user object
    localStorage.setItem('healthwyz_user', JSON.stringify(user));
    localStorage.setItem('healthwyz_token', user.token);
    localStorage.setItem('healthwyz_userType', user.userType);
    
    // For cookies, only store essential info
    this.setCookie('healthwyz_token', user.token, 7);
    this.setCookie('healthwyz_userType', user.userType, 7);
    this.setCookie('healthwyz_user_id', String(user.id), 7);
  }
  
  static setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
  
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
      return userData ? (JSON.parse(userData) as AuthUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  static clearLocalStorage(): void {
    localStorage.removeItem('healthwyz_user');
    localStorage.removeItem('healthwyz_token');
    localStorage.removeItem('healthwyz_userType');
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