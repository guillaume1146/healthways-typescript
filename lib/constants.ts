import { Stat, Service, Specialty, WhyChooseReason } from '@/types'

export const SPECIALTIES: Specialty[] = [
  { id: 1, name: 'General Medicine', icon: 'FaStethoscope', color: 'text-blue-500' },
  { id: 2, name: 'Cardiology', icon: 'FaHeart', color: 'text-red-500' },
  { id: 3, name: 'Dermatology', icon: 'FaBrain', color: 'text-cyan-500' },
  { id: 4, name: 'Pediatrics', icon: 'FaBaby', color: 'text-yellow-500' },
  { id: 5, name: 'Orthopedics', icon: 'FaEye', color: 'text-green-500' },
  { id: 6, name: 'Dental Care', icon: 'FaTooth', color: 'text-blue-500' },
  { id: 7, name: 'Gynecology', icon: 'FaFemale', color: 'text-red-500' },
  { id: 8, name: 'Mental Health', icon: 'FaUserMd', color: 'text-cyan-500' },
]

export const STATS: Stat[] = [
  { number: '500+', label: 'Verified Doctors' },
  { number: '10,000+', label: 'Video Consultations' },
  { number: '25,000+', label: 'Medicines Available' },
  { number: '20+', label: 'Specialties' },
]

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Video Consultation',
    description: 'Consult with qualified doctors from the comfort of your home',
    icon: 'FaVideo',
    gradient: 'bg-gradient-blue',
  },
  {
    id: 2,
    title: 'Easy Appointment Booking',
    description: 'Book appointments with top specialists in just a few clicks',
    icon: 'FaCalendarCheck',
    gradient: 'bg-gradient-green',
  },
  {
    id: 3,
    title: 'Medicine Delivery',
    description: 'Get medicines delivered to your doorstep across Mauritius',
    icon: 'FaTruck',
    gradient: 'bg-gradient-purple',
  },
  {
    id: 4,
    title: 'AI Health Assistant',
    description: 'Get instant health information and treatment suggestions',
    icon: 'FaRobot',
    gradient: 'bg-gradient-orange',
  },
]

export const WHY_CHOOSE_REASONS: WhyChooseReason[] = [
  {
    icon: 'FaUserMd',
    title: 'Verified Doctors',
    description: 'All doctors are verified and licensed healthcare professionals',
  },
  {
    icon: 'FaHeadset',
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your healthcare needs',
  },
  {
    icon: 'FaShieldAlt',
    title: 'Quality Care',
    description: 'Committed to providing the highest quality healthcare services',
  },
]