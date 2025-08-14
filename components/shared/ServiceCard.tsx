import { FaVideo, FaCalendarCheck, FaTruck, FaRobot } from 'react-icons/fa'
import type { ServiceCardProps } from '@/types'
import type { IconType } from 'react-icons'

const iconMap: Record<string, IconType> = {
  FaVideo: FaVideo,
  FaCalendarCheck: FaCalendarCheck,
  FaTruck: FaTruck,
  FaRobot: FaRobot,
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, gradient }) => {
  const Icon = iconMap[icon]
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
      <div className={`w-20 h-20 ${gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
        {Icon && <Icon className="text-white text-3xl" />}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default ServiceCard