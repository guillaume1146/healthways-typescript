import { PrismaClient } from '@prisma/client'

export async function seedRequiredDocuments(prisma: PrismaClient) {
  const documentConfigs: Record<string, string[]> = {
    DOCTOR: ['Medical License', 'Board Certification', 'ID Card', 'Proof of Address'],
    NURSE: ['Nursing License', 'ID Card', 'CPR Certification'],
    NANNY: ['ID Card', 'Childcare Certification', 'Background Check', 'First Aid Certificate'],
    PHARMACIST: ['Pharmacy License', 'ID Card', 'Degree Certificate'],
    LAB_TECHNICIAN: ['Lab Technician License', 'ID Card', 'Degree Certificate'],
    EMERGENCY_WORKER: ['EMT Certification', 'ID Card', 'Driving License', 'First Aid Certificate'],
    INSURANCE_REP: ['Insurance License', 'ID Card', 'Company Authorization'],
    CORPORATE_ADMIN: ['ID Card', 'Company Registration', 'Authorized Representative Letter'],
    REFERRAL_PARTNER: ['ID Card', 'Business Registration'],
  }

  let count = 0

  for (const [userType, documents] of Object.entries(documentConfigs)) {
    for (const documentName of documents) {
      await prisma.requiredDocumentConfig.upsert({
        where: { userType_documentName: { userType, documentName } },
        update: {},
        create: {
          userType,
          documentName,
          required: true,
        },
      })
      count++
    }
  }

  console.log(`  Seeded ${count} required document configs across ${Object.keys(documentConfigs).length} user types`)
}
