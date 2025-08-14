import { Stat, Service, Specialty, WhyChooseReason } from '@/types'

export const STATS: Stat[] = [
  { number: '500+', label: 'Qualified Doctors', color: 'text-blue-500' },
  { number: '10,000+', label: 'Happy Patients', color: 'text-green-500' },
  { number: '25,000+', label: 'Consultations', color: 'text-purple-500' },
  { number: '20+', label: 'Cities Covered', color: 'text-orange-500' },
]

export const SPECIALTIES: Specialty[] = [
  { id: 1, name: 'General Medicine', icon: 'FaStethoscope', color: 'text-blue-500' },
  { id: 2, name: 'Cardiology', icon: 'FaHeart', color: 'text-red-500' },
  { id: 3, name: 'Dermatology', icon: 'FaBrain', color: 'text-cyan-500' },
  { id: 4, name: 'Pediatrics', icon: 'FaBaby', color: 'text-yellow-500' },
  { id: 5, name: 'Gynecology', icon: 'FaFemale', color: 'text-pink-500' },
  { id: 6, name: 'Orthopedics', icon: 'FaBone', color: 'text-green-500' },
  { id: 7, name: 'Psychiatry', icon: 'FaBrain', color: 'text-purple-500' },
  { id: 8, name: 'Ayurveda', icon: 'FaLeaf', color: 'text-green-600' },
  { id: 9, name: 'Diabetes Care', icon: 'FaHeartbeat', color: 'text-red-600' },
  { id: 10, name: 'Hypertension', icon: 'FaStethoscope', color: 'text-blue-600' },
  { id: 11, name: 'Obesity Management', icon: 'FaWeight', color: 'text-orange-500' },
  { id: 12, name: 'Mental Health', icon: 'FaBrain', color: 'text-indigo-500' },
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
    description: 'Book appointments with your preferred doctors instantly',
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
    icon: 'FaShieldAlt',
    title: 'Verified Doctors',
    description: 'All doctors are verified and licensed healthcare professionals',
  },
  {
    icon: 'FaClock',
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your healthcare needs',
  },
  {
    icon: 'FaAward',
    title: 'Quality Care',
    description: 'Committed to providing the highest quality healthcare services',
  },
]