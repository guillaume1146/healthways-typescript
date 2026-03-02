import { PrismaClient } from '@prisma/client'
import { seedMedicines } from './seeds/01-medicines.seed'
import { seedDoctors } from './seeds/02-doctors.seed'
import { seedNurses } from './seeds/03-nurses.seed'
import { seedNannies } from './seeds/04-nannies.seed'
import { seedPatients } from './seeds/05-patients.seed'
import { seedClinicalData } from './seeds/06-clinical-data.seed'
import { seedAppointments } from './seeds/07-appointments.seed'
import { seedVideoRooms } from './seeds/08-video-rooms.seed'
import { seedSupportingData } from './seeds/09-supporting-data.seed'
import { seedNewUserTypes } from './seeds/10-new-user-types.seed'
import { seedConversations } from './seeds/11-conversations.seed'
import { seedEnrichedData } from './seeds/12-enriched-data.seed'
import { seedBillingAndVideo } from './seeds/13-billing-video.seed'
import { seedCmsContent } from './seeds/14-cms-content.seed'
import { seedCatalogData } from './seeds/15-catalog-data.seed'
import { seedWallets } from './seeds/16-wallets.seed'
import { seedDoctorPosts } from './seeds/17-doctor-posts.seed'
import { seedProviderAvailability } from './seeds/18-provider-availability.seed'
import { seedDocumentsAndEnrichment } from './seeds/19-documents-enrichment.seed'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning database...')

  // Delete in reverse dependency order
  // 0a. Doctor Posts (children before parents)
  await prisma.postLike.deleteMany()
  await prisma.postComment.deleteMany()
  await prisma.doctorPost.deleteMany()

  // 0b. Wallets (children before parents)
  await prisma.walletTransaction.deleteMany()
  await prisma.userWallet.deleteMany()

  // 0c. CMS + Catalog tables
  await prisma.cmsTestimonial.deleteMany()
  await prisma.cmsHeroSlide.deleteMany()
  await prisma.cmsSection.deleteMany()
  await prisma.pharmacyMedicine.deleteMany()
  await prisma.labTestCatalog.deleteMany()
  await prisma.emergencyServiceListing.deleteMany()
  await prisma.insurancePlanListing.deleteMany()

  // 1. Cross-cutting models
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.webRTCConnection.deleteMany()
  await prisma.videoCallSession.deleteMany()
  await prisma.videoRoomParticipant.deleteMany()
  await prisma.videoRoom.deleteMany()
  await prisma.billingInfo.deleteMany()
  await prisma.document.deleteMany()

  // 2. Order-related
  await prisma.medicineOrderItem.deleteMany()
  await prisma.medicineOrder.deleteMany()

  // 3. Patient clinical data
  await prisma.nutritionAnalysis.deleteMany()
  await prisma.emergencyServiceContact.deleteMany()
  await prisma.pillReminder.deleteMany()
  await prisma.labTestResult.deleteMany()
  await prisma.labTest.deleteMany()
  await prisma.vitalSigns.deleteMany()
  await prisma.prescriptionMedicine.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.medicalRecord.deleteMany()
  await prisma.patientEmergencyContact.deleteMany()

  // 4. Scheduling + Provider Availability
  await prisma.providerAvailability.deleteMany()
  await prisma.labTestBooking.deleteMany()
  await prisma.childcareBooking.deleteMany()
  await prisma.nurseBooking.deleteMany()
  await prisma.appointment.deleteMany()

  // 5. Doctor supporting models
  await prisma.patientComment.deleteMany()
  await prisma.scheduleSlot.deleteMany()
  await prisma.doctorWorkHistory.deleteMany()
  await prisma.doctorCertification.deleteMany()
  await prisma.doctorEducation.deleteMany()

  // 6. Medicines (standalone)
  await prisma.medicine.deleteMany()

  // 7. Profile tables (before User)
  await prisma.patientProfile.deleteMany()
  await prisma.doctorProfile.deleteMany()
  await prisma.nurseProfile.deleteMany()
  await prisma.nannyProfile.deleteMany()
  await prisma.pharmacistProfile.deleteMany()
  await prisma.labTechProfile.deleteMany()
  await prisma.emergencyWorkerProfile.deleteMany()
  await prisma.insuranceRepProfile.deleteMany()
  await prisma.corporateAdminProfile.deleteMany()
  await prisma.referralPartnerProfile.deleteMany()
  await prisma.regionalAdminProfile.deleteMany()

  // 8. User table (last — all FKs cleared above)
  await prisma.user.deleteMany()

  console.log('Seeding database...')

  await seedMedicines(prisma)
  await seedDoctors(prisma)
  await seedNurses(prisma)
  await seedNannies(prisma)
  await seedPatients(prisma)
  await seedClinicalData(prisma)
  await seedAppointments(prisma)
  await seedVideoRooms(prisma)
  await seedSupportingData(prisma)
  await seedNewUserTypes(prisma)
  await seedConversations(prisma)
  await seedEnrichedData(prisma)
  await seedBillingAndVideo(prisma)
  await seedCmsContent(prisma)
  await seedCatalogData(prisma)
  await seedWallets(prisma)
  await seedDoctorPosts(prisma)
  await seedProviderAvailability(prisma)
  await seedDocumentsAndEnrichment(prisma)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
