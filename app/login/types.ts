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