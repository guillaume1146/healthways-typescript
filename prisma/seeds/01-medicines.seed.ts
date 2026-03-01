import { PrismaClient } from '@prisma/client'

export async function seedMedicines(prisma: PrismaClient) {
  const medicines = [
    { id: 'MED001', name: 'Metformin', category: 'Antidiabetic', description: 'Used to treat type 2 diabetes' },
    { id: 'MED002', name: 'Lisinopril', category: 'ACE Inhibitor', description: 'Used to treat high blood pressure' },
    { id: 'MED003', name: 'Atorvastatin', category: 'Statin', description: 'Used to lower cholesterol' },
    { id: 'MED004', name: 'Amlodipine', category: 'Calcium Channel Blocker', description: 'Used to treat high blood pressure and chest pain' },
    { id: 'MED005', name: 'Omeprazole', category: 'Proton Pump Inhibitor', description: 'Used to treat gastric acid-related conditions' },
    { id: 'MED006', name: 'Amoxicillin', category: 'Antibiotic', description: 'Used to treat bacterial infections' },
    { id: 'MED007', name: 'Paracetamol', category: 'Analgesic', description: 'Used to treat pain and fever' },
    { id: 'MED008', name: 'Ibuprofen', category: 'NSAID', description: 'Used to treat pain and inflammation' },
    { id: 'MED009', name: 'Cetirizine', category: 'Antihistamine', description: 'Used to treat allergies' },
    { id: 'MED010', name: 'Salbutamol', category: 'Bronchodilator', description: 'Used to treat asthma' },
    { id: 'MED011', name: 'Losartan', category: 'ARB', description: 'Used to treat high blood pressure' },
    { id: 'MED012', name: 'Insulin Glargine', category: 'Insulin', description: 'Long-acting insulin for diabetes' },
  ]

  for (const med of medicines) {
    await prisma.medicine.upsert({
      where: { id: med.id },
      update: {},
      create: med,
    })
  }

  console.log(`  Seeded ${medicines.length} medicines`)
  return medicines
}
