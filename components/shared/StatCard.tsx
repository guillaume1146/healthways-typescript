import type { StatCardProps } from '@/types'

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold bg-gradient-main bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  )
}

export default StatCard