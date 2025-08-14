import { SERVICES } from '@/lib/constants'
import ServiceCard from '@/components/shared/ServiceCard'

const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Comprehensive Healthcare Services
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          From online consultations to medicine delivery, we provide end-to-end 
          healthcare solutions tailored for the Mauritian community.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection