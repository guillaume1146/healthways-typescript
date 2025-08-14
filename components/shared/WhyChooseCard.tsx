
import { FaUserMd, FaHeadset, FaShieldAlt } from 'react-icons/fa'
import type { WhyChooseCardProps } from '@/types'
import type { IconType } from 'react-icons'

const iconMap: Record<string, IconType> = {
  FaUserMd: FaUserMd,
  FaHeadset: FaHeadset,
  FaShieldAlt: FaShieldAlt,
}

const WhyChooseCard: React.FC<WhyChooseCardProps> = ({ icon, title, description }) => {
  const Icon = iconMap[icon]
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
      <div className="w-20 h-20 bg-gradient-main rounded-full flex items-center justify-center mb-6 mx-auto">
        {Icon && <Icon className="text-white text-3xl" />}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default WhyChooseCard