import { SPECIALTIES } from '@/lib/constants'
import SpecialtyItem from '@/components/shared/SpecialtyItem'

const SpecialtiesSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Medical Specialties</h2>
        <p className="text-center text-gray-600 mb-12">
          Find doctors across various specialties and get expert care
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {SPECIALTIES.map((specialty) => (
            <SpecialtyItem key={specialty.id} {...specialty} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpecialtiesSection
