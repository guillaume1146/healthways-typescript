import { IconType } from 'react-icons'

export interface Stat {
  number: string
  label: string
  color?: string
}

export interface Service {
  id: number
  title: string
  description: string
  icon: string
  gradient: string
}

export interface Specialty {
  id: number
  name: string
  icon: string
  color: string
}

export interface WhyChooseReason {
  icon: string
  title: string
  description: string
}

export interface NavLink {
  href: string
  label: string
  icon: IconType
}

export interface FormData {
  [key: string]: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  fullName: string
  username: string
  email: string
  password: string
}

export interface PageHeaderProps {
  title: string
  description: string
  icon?: IconType
}

export interface EmptyStateProps {
  icon: IconType
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}

export interface ProfessionalBannerProps {
  title: string
  description: string
  primaryButton?: string
  secondaryButton?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export interface ServiceCardProps extends Service {}

export interface StatCardProps extends Stat {}

export interface SpecialtyItemProps extends Specialty {}

export interface WhyChooseCardProps extends WhyChooseReason {}