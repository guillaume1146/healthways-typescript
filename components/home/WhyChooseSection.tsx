import { WHY_CHOOSE_REASONS } from '@/lib/constants'
import WhyChooseCard from '@/components/shared/WhyChooseCard'

const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Why Choose Healthways?</h2>
        <p className="text-center text-gray-600 mb-12">
          Trusted by thousands of Mauritians for quality healthcare
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {WHY_CHOOSE_REASONS.map((reason, index) => (
            <WhyChooseCard key={index} {...reason} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection