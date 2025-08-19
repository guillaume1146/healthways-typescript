import { FaMobile, FaHospital, FaShoppingCart, FaImage } from 'react-icons/fa'

const DetailedServicesSection: React.FC = () => {
  const services = [
    {
      emoji: '🩺',
      title: 'Healthwyz',
      subtitle: 'Simple, accessible, and efficient healthcare',
      description: 'Healthwyz&apos;s telehealth app simplifies healthcare. Users can consult locally-licensed doctors and allied health professionals, receive medications, schedule health screenings or vaccinations, shop for health and wellness products, and connect with a trusted network of healthcare providers and specialists.',
      icon: FaMobile,
      gradient: 'bg-gradient-blue'
    },
    {
      emoji: '🏥',
      title: 'Healthwyz CLINICS',
      subtitle: 'Comprehensive primary healthcare services',
      description: 'Healthwyz is a network of GP clinics across Mauritius, providing comprehensive primary care services including GP consultations, chronic disease management, health screenings, vaccinations, and more. We also provide access to government-supported programs, ensuring quality care for the community.',
      icon: FaHospital,
      gradient: 'bg-gradient-green'
    },
    {
      emoji: '🛒',
      title: 'Healthwyz Online Marketplace',
      subtitle: 'Convenient access to health products',
      description: 'Healthwyz&apos;s online Marketplace is accessible via our website and mobile app, offering preventive health services such as vaccinations and health screenings, along with over-the-counter medication. With free delivery across Mauritius, it provides convenient access to quality healthcare products and services.',
      icon: FaShoppingCart,
      gradient: 'bg-gradient-purple'
    },
    {
      emoji: '🏥',
      title: 'MedSuites',
      subtitle: 'Centralised Health Screening and Imaging Services',
      description: 'A premier medical centre located in Central, Healthwyz MedSuites centralises health screening and imaging services for comprehensive care and convenience in a single location. The state-of-the-art facility addresses the preventive health needs of Mauritius.',
      icon: FaImage,
      gradient: 'bg-gradient-orange'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Healthcare Ecosystem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare solutions designed to meet all your health needs through our integrated platform
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg card-hover">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 ${service.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <service.icon className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{service.emoji}</span>
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <h4 className="text-primary-blue font-semibold mb-3">{service.subtitle}</h4>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{service.description}</p>

              {/* CTA */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="text-primary-blue font-semibold hover:text-primary-teal transition-colors">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience the Future of Healthcare
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of Mauritians who trust Healthwyz for their comprehensive healthcare needs. 
              From telehealth to physical clinics, we&apos;ve got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-gradient px-8 py-3">
                Get Started Today
              </button>
              <button className="border-2 border-primary-blue text-primary-blue px-8 py-3 rounded-xl font-semibold hover:bg-primary-blue hover:text-white transition">
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetailedServicesSection