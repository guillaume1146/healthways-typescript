import { PrismaClient } from '@prisma/client'

export async function seedRegions(prisma: PrismaClient) {
  const regions = [
    { id: 'REG-MU', name: 'Mauritius', countryCode: 'MU', language: 'en', flag: '🇲🇺' },
    { id: 'REG-MG', name: 'Madagascar', countryCode: 'MG', language: 'fr', flag: '🇲🇬' },
    { id: 'REG-KE', name: 'Kenya', countryCode: 'KE', language: 'en', flag: '🇰🇪' },
    { id: 'REG-TG', name: 'Togo', countryCode: 'TG', language: 'fr', flag: '🇹🇬' },
    { id: 'REG-BJ', name: 'Benin', countryCode: 'BJ', language: 'fr', flag: '🇧🇯' },
    { id: 'REG-RW', name: 'Rwanda', countryCode: 'RW', language: 'en', flag: '🇷🇼' },
  ]

  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {},
      create: region,
    })
  }

  console.log(`  Seeded ${regions.length} regions`)
}
