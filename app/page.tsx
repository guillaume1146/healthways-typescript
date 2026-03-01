import prisma from '@/lib/db'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import ServicesSection from '@/components/home/ServicesSection'
import DetailedServicesSection from '@/components/home/DetailedServicesSection'
import SpecialtiesSection from '@/components/home/SpecialtiesSection'
import WhyChooseSection from '@/components/home/WhyChooseSection'
import ProfessionalBanner from '@/components/shared/ProfessionalBanner'
import { HeroContent, HeroSlide } from '@/types'

export const revalidate = 60

async function getCmsData() {
  try {
    const [sections, heroSlides] = await Promise.all([
      prisma.cmsSection.findMany({
        where: { isVisible: true, countryCode: null },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.cmsHeroSlide.findMany({
        where: { isActive: true, countryCode: null },
        orderBy: { sortOrder: 'asc' },
      }),
    ])

    const sectionMap: Record<string, unknown> = {}
    for (const section of sections) {
      sectionMap[section.sectionType] = section.content
    }

    return { sectionMap, heroSlides }
  } catch {
    return { sectionMap: {}, heroSlides: [] }
  }
}

export default async function HomePage() {
  const { sectionMap, heroSlides } = await getCmsData()

  const heroContent = sectionMap['hero'] as HeroContent | undefined
  const statsContent = sectionMap['stats'] as { items: { number: string; label: string; color?: string }[] } | undefined
  const servicesContent = sectionMap['services'] as { title: string; subtitle: string; items: { id: number; title: string; description: string; icon: string; gradient: string }[] } | undefined
  const detailedContent = sectionMap['detailed_services'] as Record<string, unknown> | undefined
  const specialtiesContent = sectionMap['specialties'] as { title: string; subtitle: string; items: { id: number; name: string; icon: string; color: string }[] } | undefined
  const whyChooseContent = sectionMap['why_choose'] as { title: string; subtitle: string; items: { icon: string; title: string; description: string }[] } | undefined
  const ctaContent = sectionMap['cta_banner'] as { title: string; description: string; primaryButton?: string; secondaryButton?: string } | undefined

  const slides: HeroSlide[] = heroSlides.map((s: { id: string; title: string; subtitle: string | null; imageUrl: string; sortOrder: number }) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    imageUrl: s.imageUrl,
    sortOrder: s.sortOrder,
  }))

  return (
    <>
      <HeroSection content={heroContent} slides={slides.length > 0 ? slides : undefined} />
      <StatsSection items={statsContent?.items} />
      <ServicesSection
        title={servicesContent?.title}
        subtitle={servicesContent?.subtitle}
        items={servicesContent?.items}
      />
      <DetailedServicesSection content={detailedContent} />
      <SpecialtiesSection
        title={specialtiesContent?.title}
        subtitle={specialtiesContent?.subtitle}
        items={specialtiesContent?.items}
      />
      <WhyChooseSection
        title={whyChooseContent?.title}
        subtitle={whyChooseContent?.subtitle}
        items={whyChooseContent?.items}
      />
      <div className="container mx-auto px-4">
        <ProfessionalBanner
          title={ctaContent?.title || "Ready to Take Control of Your Health?"}
          description={ctaContent?.description || "Join thousands of Mauritians who trust Healthwyz for their healthcare needs. Start your journey to better health today."}
          primaryButton={ctaContent?.primaryButton || "Schedule Consultation"}
          secondaryButton={ctaContent?.secondaryButton || "Learn More"}
        />
      </div>
    </>
  )
}
