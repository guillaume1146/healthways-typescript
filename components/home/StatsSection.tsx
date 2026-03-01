import { STATS } from '@/lib/constants'
import StatCard from '@/components/shared/StatCard'
import { Stat } from '@/types'

interface StatsSectionProps {
  items?: Stat[]
}

const StatsSection: React.FC<StatsSectionProps> = ({ items }) => {
  const data = items || STATS

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection