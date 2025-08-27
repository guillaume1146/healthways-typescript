import { StatCardProps } from '../types'

export default function StatCard({ icon: Icon, title, value, color, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  )
}