import type { StatCardProps } from '@/types'

const StatCard: React.FC<StatCardProps> = ({ number, label, color }) => {
  return (
    <div className="text-center">
      <div className={`text-4xl lg:text-5xl font-bold mb-2 ${color || 'text-primary-blue'}`}>
        {number}
      </div>
      <div className="text-gray-700 font-medium">{label}</div>
    </div>
  )
}

export default StatCard