import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import ServicesSection from '@/components/home/ServicesSection'
import DetailedServicesSection from '@/components/home/DetailedServicesSection'
import SpecialtiesSection from '@/components/home/SpecialtiesSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import ProfessionalBanner from '@/components/shared/ProfessionalBanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <DetailedServicesSection />
      <SpecialtiesSection />
      <WhyChooseSection />
      <div className="container mx-auto px-4">
        <ProfessionalBanner
          title="Ready to Take Control of Your Health?"
          description="Join thousands of Mauritians who trust Healthwyz for their healthcare needs. Start your journey to better health today."
          primaryButton="Schedule Consultation"
          secondaryButton="Learn More"
        />
      </div>
    </>
  )
}