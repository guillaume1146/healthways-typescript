// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Test with Patient model since it exists in your schema
    const testPatient = await prisma.patient.create({
      data: {
        id: `TEST-${Date.now()}`,
        firstName: 'Test',
        lastName: 'Patient',
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        dateOfBirth: '1990-01-01',
        age: 34,
        gender: 'Male',
        phone: '+230 5555 9999',
        address: 'Test Address, Mauritius',
        nationalId: `TEST${Date.now()}`,
        bloodType: 'O+',
        allergies: [],
        chronicConditions: [],
        healthScore: 100,
        bodyAge: 30,
        emergencyContact: {
          name: 'Test Contact',
          relationship: 'Friend',
          phone: '+230 5555 8888',
          address: 'Test Address'
        },
        nurseBookings: [],
        emergencyServiceContacts: [],
        chatHistory: {
          doctors: [],
          nurses: [],
          nannies: [],
          emergencyServices: []
        },
        botHealthAssistant: {
          sessions: [],
          dietHistory: [],
          currentMealPlan: {
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            meals: [],
            calorieTarget: 2000,
            proteinTarget: 100,
            carbTarget: 200,
            fatTarget: 70
          },
          hydrationTracking: [],
          exerciseSuggestions: []
        },
        labTests: [],
        healthMetrics: {},
        insuranceCoverage: {},
        subscriptionPlan: {},
        notificationPreferences: {},
        securitySettings: {},
        documents: [],
        medicineOrders: [],
        lastCheckupDate: '2024-01-01',
        nextScheduledCheckup: '2024-06-01',
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        verified: false,
        profileCompleteness: 50
      }
    });

    // Get counts for different models
    const patients = await prisma.patient.findMany();
    const doctors = await prisma.doctor.findMany();
    const nurses = await prisma.nurse.findMany();
    
    // Clean up test data
    await prisma.patient.delete({
      where: { id: testPatient.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Database working!',
      testPatient: {
        id: testPatient.id,
        name: `${testPatient.firstName} ${testPatient.lastName}`,
        email: testPatient.email
      },
      counts: {
        patients: patients.length,
        doctors: doctors.length,
        nurses: nurses.length
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database error'
    }, { status: 500 });
  }
}