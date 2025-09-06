import { IconType } from 'react-icons'

export interface UserType {
  id: string;
  label: string;
  icon: IconType;
  description: string;
  redirectPath: string;
  demoEmail?: string;
  demoPassword?: string;  
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

export interface BaseAuthenticatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token: string;
  userType: string;
  profileImage?: string;
  [key: string]: unknown;
}

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