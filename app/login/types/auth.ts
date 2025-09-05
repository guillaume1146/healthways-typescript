// types/auth.ts - Add to your existing auth types
import { IconType } from 'react-icons'

export interface UserType {
  id: string;
  label: string;
  icon: IconType;
  description: string;
  redirectPath: string;
  demoEmail: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  userType: string;
  profileImage?: string;
}

// Base interface for all authenticated users
export interface BaseAuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token: string;
  userType: string;
  profileImage?: string;
  // Allow additional properties from specific user types
  [key: string]: unknown;
}

// Demo user type for additional user roles
export interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token: string;
  userType: string;
  profileImage?: string;
}
