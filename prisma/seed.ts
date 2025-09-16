import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  await prisma.nutritionAnalysis.deleteMany()
  await prisma.emergencyContact.deleteMany()
  await prisma.pillReminder.deleteMany()
  await prisma.billingInfo.deleteMany()
  await prisma.videoCallSession.deleteMany()
  await prisma.childcareBooking.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.vitalSigns.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.medicalRecord.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.doctor.deleteMany()
  await prisma.nurse.deleteMany()
  await prisma.nanny.deleteMany()

  const patient1 = await prisma.patient.create({
    data: {
      id: "PAT001",
      firstName: "Emma",
      lastName: "Johnson",
      email: "emma.johnson@healthwyz.mu",
      password: await bcrypt.hash("Patient123!", 10),
      profileImage: "/images/patients/1.jpg",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQQVQwMDEiLCJpYXQiOjE3MDQwNjcyMDB9.xyzPatient001",
      dateOfBirth: "1985-03-15",
      age: 39,
      userType: "patient",
      gender: "Female",
      phone: "+230 5789 1234",
      address: "Rose Hill, Mauritius",
      nationalId: "E1503851234567",
      passportNumber: "MU8745123",
      emergencyContact: {
        name: "Michael Johnson",
        relationship: "Husband",
        phone: "+230 5890 2345",
        address: "Rose Hill, Mauritius"
      },
      bloodType: "A+",
      allergies: ["Penicillin", "Shellfish"],
      chronicConditions: ["Hypertension", "Type 2 Diabetes"],
      healthScore: 78,
      bodyAge: 42,
      medicalRecords: {
        create: [
          {
            id: "MR001",
            title: "Annual Physical Examination",
            date: "2024-12-01",
            time: "09:00",
            type: "consultation",
            doctorResponsible: "Dr. Sarah Johnson",
            nurseResponsible: "Maria Thompson",
            summary: "Comprehensive annual health checkup with blood work and vitals assessment",
            diagnosis: "Stable hypertension and diabetes management",
            treatment: "Continue current medication regimen with dose adjustments",
            notes: "Patient shows excellent compliance with treatment plan. HbA1c improved from 7.2% to 6.8%",
            attachments: ["blood_test_report_dec2024.pdf", "ecg_report_dec2024.pdf", "diabetes_monitoring_chart.pdf"]
          },
          {
            id: "MR002",
            title: "Diabetes Management Review",
            date: "2024-10-15",
            time: "14:30",
            type: "consultation",
            doctorResponsible: "Dr. Sarah Johnson",
            summary: "Quarterly diabetes management review with medication adjustment",
            diagnosis: "Type 2 Diabetes - well controlled",
            treatment: "Metformin dose optimization",
            notes: "Blood glucose levels stable, patient maintaining healthy diet",
            attachments: []
          },
          {
            id: "MR003",
            title: "Blood Pressure Monitoring",
            date: "2024-11-20",
            time: "10:15",
            type: "consultation",
            doctorResponsible: "Dr. Sarah Johnson",
            nurseResponsible: "Maria Thompson",
            summary: "Blood pressure check and medication review",
            diagnosis: "Essential Hypertension - controlled",
            treatment: "Continue Lisinopril, lifestyle modifications",
            notes: "Blood pressure trending downward with current treatment",
            attachments: []
          }
        ]
      },
      prescriptions: {
        create: [
          {
            id: "RX001",
            date: "2024-12-01",
            time: "10:30",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            medicines: [
              {
                name: "Metformin",
                dosage: "500mg",
                quantity: 60,
                frequency: "Twice daily",
                duration: "3 months",
                instructions: "Take with meals to reduce stomach upset. Monitor blood glucose levels daily.",
                beforeFood: false
              },
              {
                name: "Lisinopril",
                dosage: "10mg",
                quantity: 30,
                frequency: "Once daily",
                duration: "3 months",
                instructions: "Take in the morning consistently. Monitor blood pressure weekly.",
                beforeFood: true
              }
            ],
            diagnosis: "Type 2 Diabetes Mellitus, Essential Hypertension",
            isActive: true,
            nextRefill: "2025-03-01",
            notes: "Patient responding well to current regimen. Continue monitoring glucose and BP.",
            orderInformation: {
              canReorder: true,
              lastOrderDate: "2024-12-05",
              nextOrderSuggestion: "2025-02-25",
              preferredPharmacy: "Apollo Pharmacy - Rose Hill",
              estimatedCost: 830,
              insuranceCovered: true,
              copayAmount: 250
            },
            reminderSettings: {
              enabled: true,
              reminderTimes: ["08:00", "20:00"],
              adherenceTracking: true,
              missedDoseAlerts: true
            }
          },
          {
            id: "RX_HIST_001",
            date: "2024-09-01",
            time: "10:00",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            medicines: [
              {
                name: "Metformin",
                dosage: "250mg",
                quantity: 60,
                frequency: "Twice daily",
                duration: "3 months",
                instructions: "Start with lower dose, take with meals",
                beforeFood: false
              }
            ],
            diagnosis: "Type 2 Diabetes Mellitus - Initial diagnosis",
            isActive: false,
            notes: "Initial diabetes medication - dose increased after tolerance established"
          },
          {
            id: "RX_HIST_002",
            date: "2024-06-15",
            time: "11:15",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            medicines: [
              {
                name: "Lisinopril",
                dosage: "5mg",
                quantity: 30,
                frequency: "Once daily",
                duration: "3 months",
                instructions: "Initial hypertension treatment",
                beforeFood: true
              }
            ],
            diagnosis: "Essential Hypertension",
            isActive: false,
            notes: "Starting dose for blood pressure management"
          }
        ]
      },
      vitalSigns: {
        create: [
          {
            id: "VS001",
            date: "2024-12-01",
            time: "09:15",
            bloodPressure: { systolic: 135, diastolic: 85 },
            heartRate: 72,
            temperature: 36.7,
            weight: 68.5,
            height: 165,
            oxygenSaturation: 98,
            glucose: 142,
            cholesterol: 195,
            labTechnician: "Lisa Chen",
            facility: "Central Lab Services"
          },
          {
            id: "VS002",
            date: "2024-11-20",
            time: "10:30",
            bloodPressure: { systolic: 128, diastolic: 82 },
            heartRate: 75,
            temperature: 36.6,
            weight: 68.2,
            height: 165,
            oxygenSaturation: 99,
            glucose: 138,
            labTechnician: "Maria Thompson",
            facility: "Apollo Bramwell Hospital"
          }
        ]
      },
      appointments: {
        create: [
          {
            id: "APP001",
            date: "2025-01-15",
            time: "14:00",
            type: "video",
            status: "upcoming",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            specialty: "Endocrinology",
            reason: "Quarterly diabetes management review",
            duration: 30,
            roomId: "emma_sarah_20250115",
            notes: "Review HbA1c results and adjust treatment plan if needed"
          },
          {
            id: "APP002",
            date: "2025-02-10",
            time: "09:30",
            type: "in-person",
            status: "upcoming",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            specialty: "Endocrinology",
            reason: "Comprehensive health assessment",
            duration: 45,
            location: "Apollo Bramwell Hospital",
            notes: "Annual comprehensive exam with lab work"
          },
          {
            id: "APP001_PAST",
            date: "2024-12-01",
            time: "09:00",
            type: "in-person",
            status: "completed",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            specialty: "Endocrinology",
            reason: "Annual checkup and medication review",
            duration: 45,
            location: "Apollo Bramwell Hospital",
            notes: "Discussed lifestyle modifications and medication adherence"
          },
          {
            id: "APP002_PAST",
            date: "2024-11-20",
            time: "10:15",
            type: "in-person",
            status: "completed",
            doctorName: "Dr. Sarah Johnson",
            doctorId: "DOC001",
            specialty: "Endocrinology",
            reason: "Blood pressure monitoring",
            duration: 20,
            location: "Apollo Bramwell Hospital"
          }
        ]
      },
      videoCallHistory: {
        create: [
          {
            id: "VC001",
            date: "2024-12-01",
            startTime: "14:00",
            endTime: "14:30",
            duration: 30,
            withType: "doctor",
            withName: "Dr. Sarah Johnson",
            withId: "DOC001",
            callQuality: "excellent",
            notes: "Discussed HbA1c results and medication adjustments. Patient very engaged and compliant."
          },
          {
            id: "VC002",
            date: "2024-11-15",
            startTime: "16:00",
            endTime: "16:20",
            duration: 20,
            withType: "nurse",
            withName: "Patricia Williams",
            withId: "NUR001",
            callQuality: "good",
            notes: "Medication administration guidance and blood pressure monitoring education"
          }
        ]
      },
      billingInformation: {
        create: [
          {
            id: "BILL001",
            type: "credit_card",
            cardNumber: "****1234",
            cardHolder: "Emma Johnson",
            expiryDate: "12/26",
            isDefault: true,
            addedDate: "2024-01-15"
          },
          {
            id: "BILL002",
            type: "mcb_juice",
            cardNumber: "****5678",
            cardHolder: "Emma Johnson",
            expiryDate: "08/25",
            isDefault: false,
            addedDate: "2024-03-20"
          }
        ]
      },
      pillReminders: {
        create: [
          {
            id: "REM001",
            medicineId: "MED001",
            medicineName: "Metformin 500mg",
            dosage: "1 tablet",
            times: ["08:00", "20:00"],
            taken: [true, false],
            nextDose: "20:00",
            frequency: "Twice daily",
            prescriptionId: "RX001",
            startDate: "2024-12-01",
            endDate: "2025-03-01",
            isActive: true,
            notificationEnabled: true
          },
          {
            id: "REM002",
            medicineId: "MED002",
            medicineName: "Lisinopril 10mg",
            dosage: "1 tablet",
            times: ["08:00"],
            taken: [true],
            nextDose: "Tomorrow 08:00",
            frequency: "Once daily",
            prescriptionId: "RX001",
            startDate: "2024-12-01",
            endDate: "2025-03-01",
            isActive: true,
            notificationEnabled: true
          }
        ]
      },
      emergencyContacts: {
        create: [
          {
            id: "EMRG001",
            name: "National Emergency Response",
            service: "General Emergency",
            phone: "999",
            available24h: true,
            responseTime: "8-12 min",
            specialization: ["Medical Emergency", "Accident", "Fire", "Crime"],
            location: "Central Station",
            distance: "2.5 km",
            priority: "high"
          },
          {
            id: "EMRG002",
            name: "MediCare Emergency Services",
            service: "Medical Emergency",
            phone: "+230 402-0000",
            available24h: true,
            responseTime: "10-15 min",
            specialization: ["Cardiac Emergency", "Diabetic Emergency", "Trauma"],
            location: "Rose Hill Medical Center",
            distance: "1.8 km",
            priority: "high"
          }
        ]
      },
      nutritionAnalyses: {
        create: [
          {
            id: "NA001",
            foodName: "Steel-cut oatmeal with berries and almonds",
            date: "2024-12-14",
            time: "08:00",
            calories: 384,
            carbs: 51,
            protein: 14,
            fat: 16,
            vitamins: ["B1", "B2", "Iron", "Magnesium", "Fiber", "Vitamin E", "Antioxidants"],
            healthScore: 92,
            suggestions: [
              "Excellent choice for diabetes management",
              "High fiber content helps regulate blood sugar",
              "Good balance of complex carbs and protein",
              "Consider adding cinnamon for additional blood sugar benefits"
            ],
            allergens: ["Tree nuts (almonds)"],
            nutritionalBenefits: [
              "Sustained energy release from complex carbs",
              "High in soluble fiber for cholesterol management",
              "Rich in antioxidants from berries",
              "Good source of healthy fats from almonds"
            ],
            mealType: "breakfast"
          }
        ]
      },
      nurseBookings: [
        {
          id: "NB001",
          nurseId: "NUR001",
          nurseName: "Patricia Williams",
          date: "2025-01-20",
          time: "10:00",
          type: "home_visit",
          service: "Blood pressure monitoring and medication administration guidance",
          status: "upcoming",
          notes: "Weekly BP check, insulin injection technique review, medication adherence counseling"
        },
        {
          id: "NB002",
          nurseId: "NUR001",
          nurseName: "Patricia Williams",
          date: "2025-02-03",
          time: "14:30",
          type: "clinic",
          service: "Diabetes education and nutrition counseling",
          status: "upcoming",
          notes: "Review carbohydrate counting and meal planning"
        }
      ],
      
      emergencyServiceContacts: [
        {
          id: "ES001",
          date: "2024-11-15",
          time: "22:30",
          reason: "Severe hypoglycemia episode with confusion",
          serviceName: "MediCare Emergency Services",
          responseTime: 12,
          status: "resolved",
          notes: "Patient found unconscious by husband. Glucose administered by paramedics. Transported to ER, stabilized and discharged next morning."
        }
      ],
      
      chatHistory: {
        doctors: [
          {
            doctorId: "DOC001",
            doctorName: "Dr. Sarah Johnson",
            specialty: "Endocrinology",
            lastMessage: "That's excellent progress! Keep monitoring your levels and we'll review at your next appointment.",
            lastMessageTime: "2024-12-14 17:15",
            unreadCount: 0,
            messages: [
              {
                id: "MSG001",
                senderId: "PAT001",
                senderName: "Emma Johnson",
                senderType: "patient",
                message: "Good morning Dr. Johnson! I wanted to update you on my blood sugar readings from this week.",
                timestamp: "2024-12-14 16:00",
                read: true,
                messageType: "text"
              }
            ]
          }
        ],
        nurses: [
          {
            nurseId: "NUR001",
            nurseName: "Patricia Williams",
            lastMessage: "Perfect! Your medication adherence is excellent. See you next week for the home visit!",
            lastMessageTime: "2024-12-19 15:30",
            unreadCount: 0,
            messages: []
          }
        ],
        nannies: [],
        emergencyServices: []
      },
      
      botHealthAssistant: {
        sessions: [
          {
            id: "BOT001",
            date: "2024-12-10",
            topic: "Diabetes Management and Nutritional Optimization",
            recommendations: {
              diet: [
                "Focus on complex carbohydrates with low glycemic index",
                "Include lean proteins with every meal",
                "Increase soluble fiber intake to 25-30g daily",
                "Limit refined sugars and processed foods",
                "Practice portion control using the plate method"
              ],
              exercise: [
                "30 minutes moderate cardio 5 days per week",
                "Resistance training 2-3 times weekly",
                "Post-meal walks to improve glucose uptake",
                "Monitor blood glucose before and after exercise"
              ],
              supplements: [
                "Vitamin D 2000 IU daily (deficiency noted in recent labs)",
                "Omega-3 fatty acids 1000mg daily for heart health",
                "Chromium picolinate 200mcg for glucose metabolism",
                "Magnesium 400mg for muscle and nerve function"
              ],
              lifestyle: [
                "Maintain consistent meal timing",
                "Achieve 7-8 hours quality sleep nightly",
                "Practice stress management techniques",
                "Regular blood glucose monitoring",
                "Annual eye and foot exams"
              ]
            },
            bookingSuggestions: [
              {
                type: "nutritionist",
                specialist: "Dr. Amanda Chen, RD",
                reason: "Advanced diabetic meal planning and carbohydrate counting education"
              },
              {
                type: "physio",
                specialist: "Sarah Mitchell, DPT",
                reason: "Exercise program design for diabetic patients"
              }
            ],
            hydrationReminders: [
              "Target 8-10 glasses of water daily",
              "Avoid high-sugar beverages",
              "Monitor for signs of dehydration",
              "Increase intake during exercise"
            ],
            mealPlan: {
              breakfast: "Steel-cut oatmeal with cinnamon, chopped almonds, and fresh berries",
              lunch: "Grilled salmon with quinoa and roasted vegetables",
              dinner: "Lean turkey breast with sweet potato and steamed broccoli",
              snacks: ["Greek yogurt with mixed nuts", "Apple slices with almond butter", "Hummus with vegetable sticks"]
            }
          }
        ],
        dietHistory: [],
        currentMealPlan: {
          startDate: "2024-12-01",
          endDate: "2024-12-31",
          meals: [],
          calorieTarget: 1800,
          proteinTarget: 100,
          carbTarget: 180,
          fatTarget: 60
        },
        hydrationTracking: [],
        exerciseSuggestions: []
      },
      
      labTests: [
        {
          id: "LAB001",
          testName: "Comprehensive Metabolic Panel",
          date: "2024-12-01",
          facility: "Central Lab Services",
          orderedBy: "Dr. Sarah Johnson",
          results: [
            {
              parameter: "HbA1c",
              value: "6.8%",
              normalRange: "<7.0% (diabetic target)",
              status: "normal"
            },
            {
              parameter: "Fasting Glucose",
              value: "128 mg/dL",
              normalRange: "70-130 mg/dL (diabetic target)",
              status: "normal"
            }
          ],
          reportUrl: "/reports/lab/CMP_20241201.pdf",
          notes: "Excellent diabetes control, kidney function normal"
        }
      ],
      
      healthMetrics: {
        cholesterol: {
          total: 195,
          ldl: 115,
          hdl: 55,
          triglycerides: 125,
          date: "2024-12-01"
        },
        bloodPressure: {
          systolic: 135,
          diastolic: 85,
          date: "2024-12-14"
        },
        bmi: {
          value: 25.1,
          category: "Slightly Overweight",
          date: "2024-12-01"
        },
        heartRateVariability: 35,
        sleepQuality: {
          averageHours: 7.2,
          quality: "good"
        },
        stressLevel: "moderate",
        bodyAge: 42,
        metabolicAge: 41,
        visceralFat: 9,
        muscleMass: 45.2,
        boneDensity: 2.8
      },
      
      insuranceCoverage: {
        provider: "Swan Life Assurance",
        policyNumber: "SWN-2024-001234",
        subscriberId: "PAT001SWN",
        validFrom: "2024-01-01",
        validUntil: "2024-12-31",
        copay: 500,
        deductible: 2000,
        coverageType: "family",
        emergencyCoverage: true,
        pharmacyCoverage: true,
        dentalCoverage: true,
        visionCoverage: false
      },
      
      subscriptionPlan: {
        type: "premium",
        planName: "HealthWyz Premium Plus",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        features: [
          "Unlimited video consultations",
          "Priority appointments",
          "24/7 emergency support",
          "Free lab tests quarterly",
          "Nutrition counseling",
          "Home nurse visits",
          "Medication delivery",
          "Health monitoring devices"
        ],
        price: 2500,
        billingCycle: "monthly"
      },
      
      notificationPreferences: {
        appointments: true,
        medications: true,
        testResults: true,
        healthTips: true,
        emergencyAlerts: true,
        chatMessages: true,
        videoCallReminders: true,
        dietReminders: true,
        exerciseReminders: true,
        notificationTime: "09:00",
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true
      },
      
      securitySettings: {
        twoFactorEnabled: true,
        biometricEnabled: true,
        loginHistory: [
          {
            date: "2024-12-15",
            time: "08:30",
            device: "iPhone 14",
            location: "Rose Hill, Mauritius",
            ipAddress: "196.192.110.45"
          }
        ],
        securityQuestions: [
          {
            question: "What is your mother's maiden name?",
            answer: "***encrypted***"
          },
          {
            question: "What was your first pet's name?",
            answer: "***encrypted***"
          }
        ],
        lastPasswordChange: "2024-10-15"
      },
      
      documents: [
        {
          id: "DOC001",
          type: "medical_report",
          name: "Annual_Health_Report_2024.pdf",
          uploadDate: "2024-12-01",
          url: "/documents/medical/annual_2024.pdf",
          size: "2.3 MB"
        }
      ],
      
      medicineOrders: [
        {
          id: "ORDER001",
          orderDate: "2024-12-05",
          medicines: [
            {
              name: "Metformin 500mg",
              quantity: 60,
              price: 450
            },
            {
              name: "Lisinopril 10mg",
              quantity: 30,
              price: 380
            }
          ],
          totalAmount: 830,
          status: "delivered",
          deliveryDate: "2024-12-07",
          deliveryAddress: "Rose Hill, Mauritius"
        }
      ],
      
      lastCheckupDate: "2024-12-01",
      nextScheduledCheckup: "2025-03-01",
      registrationDate: "2023-08-15",
      lastLogin: "2024-12-15",
      verified: true,
      profileCompleteness: 98
    }
  })

  const doctor1 = await prisma.doctor.create({
    data: {
      id: "DOC001",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@healthwyz.mu",
      password: await bcrypt.hash("SecurePass123!", 10),
      profileImage: "/images/doctors/1.jpg",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJET0MwMDEiLCJpYXQiOjE2MzQyMzQ1Njd9.abc123",
      
      category: "Specialist",
      specialty: ["Cardiology"],
      subSpecialties: ["Interventional Cardiology", "Cardiac Catheterization", "Coronary Angioplasty"],
      licenseNumber: "MED-2009-CAR-1234",
      licenseExpiryDate: "2026-12-31",
      clinicAffiliation: "Apollo Bramwell Hospital",
      hospitalPrivileges: ["Apollo Bramwell Hospital", "Wellkin Hospital", "Victoria Hospital"],
      
      rating: 4.8,
      reviews: 342,
      
      patientComments: [
        {
          id: "PC001",
          patientFirstName: "Marie",
          patientLastName: "Dupont",
          patientProfileImage: "/images/patients/1.jpg",
          comment: "Dr. Johnson saved my life with her quick diagnosis and treatment.",
          starRating: 5,
          date: "2024-08-15",
          time: "14:30"
        },
        {
          id: "PC002",
          patientFirstName: "Jean",
          patientLastName: "Baptiste",
          patientProfileImage: "/images/patients/2.jpg",
          comment: "Very professional and caring doctor, explains everything clearly.",
          starRating: 5,
          date: "2024-08-10",
          time: "09:15"
        },
        {
          id: "PC003",
          patientFirstName: "Priya",
          patientLastName: "Sharma",
          patientProfileImage: "/images/patients/3.jpg",
          comment: "Excellent bedside manner, highly recommend for heart issues.",
          starRating: 4,
          date: "2024-07-28",
          time: "16:45"
        }
      ],
      
      performanceMetrics: {
        averageRating: 4.8,
        totalReviews: 342,
        patientSatisfaction: 94.5,
        responseTime: 12,
        appointmentCompletionRate: 98.2,
        prescriptionAccuracy: 99.1,
        returnPatientRate: 78.3
      },
      
      experience: "15 years",
      
      education: [
        {
          degree: "MBBS",
          institution: "University of Mauritius",
          year: "2009"
        },
        {
          degree: "MD Cardiology",
          institution: "King's College London",
          year: "2013"
        },
        {
          degree: "Fellowship in Interventional Cardiology",
          institution: "Harvard Medical School",
          year: "2015"
        }
      ],
      
      workHistory: [
        {
          position: "Senior Cardiologist",
          organization: "Apollo Bramwell Hospital",
          period: "2015-present",
          current: true
        },
        {
          position: "Consultant Cardiologist",
          organization: "SSR Hospital",
          period: "2010-2015",
          current: false
        },
        {
          position: "Resident Cardiologist",
          organization: "Victoria Hospital",
          period: "2008-2010",
          current: false
        }
      ],
      
      certifications: [
        {
          name: "FESC - Fellow of European Society of Cardiology",
          issuingBody: "European Society of Cardiology",
          dateObtained: "2016-03-15",
          certificateUrl: "/certificates/fesc_sarah_johnson.pdf"
        },
        {
          name: "FACC - Fellow of American College of Cardiology",
          issuingBody: "American College of Cardiology",
          dateObtained: "2017-06-20",
          certificateUrl: "/certificates/facc_sarah_johnson.pdf"
        },
        {
          name: "Board Certified Cardiologist",
          issuingBody: "Mauritius Medical Council",
          dateObtained: "2014-01-10",
          expiryDate: "2025-01-10",
          certificateUrl: "/certificates/board_cert_sarah_johnson.pdf"
        }
      ],
      
      publications: [
        "Novel Approaches in Interventional Cardiology - Journal of Cardiac Medicine, 2023",
        "Risk Factors in Coronary Artery Disease in Mauritius - International Heart Journal, 2022",
        "Minimally Invasive Cardiac Procedures - Medical Review Quarterly, 2021"
      ],
      
      awards: [
        "Best Cardiologist Award - Mauritius Medical Association, 2023",
        "Excellence in Patient Care - Apollo Bramwell Hospital, 2022",
        "Research Excellence Award - Cardiac Society of Mauritius, 2021"
      ],
      
      location: "Port Louis",
      address: "Apollo Bramwell Hospital, Moka Road, Port Louis, Mauritius",
      phone: "+230 5123 4567",
      alternatePhone: "+230 5123 4568",
      website: "www.drsarahjohnson.mu",
      
      socialMedia: {
        linkedin: "linkedin.com/in/dr-sarah-johnson",
        twitter: "@DrSarahCardio",
        facebook: "facebook.com/DrSarahJohnsonCardiology"
      },
      
      languages: ["English", "French", "Creole"],
      availability: "Mon-Fri, 8:00 AM - 6:00 PM",
      
      detailedAvailability: {
        monday: { start: "08:00", end: "18:00", isAvailable: true },
        tuesday: { start: "08:00", end: "18:00", isAvailable: true },
        wednesday: { start: "08:00", end: "18:00", isAvailable: true },
        thursday: { start: "08:00", end: "18:00", isAvailable: true },
        friday: { start: "08:00", end: "18:00", isAvailable: true },
        saturday: { start: "09:00", end: "13:00", isAvailable: true },
        sunday: { start: "00:00", end: "00:00", isAvailable: false },
        slotDuration: 30,
        breakTime: { start: "13:00", end: "14:00" },
        vacationDates: [
          { start: "2025-03-15", end: "2025-03-25" },
          { start: "2025-08-10", end: "2025-08-20" }
        ]
      },
      
      nextAvailable: "Tomorrow, 10:00 AM",
      consultationDuration: 30,
      
      consultationFee: 2500,
      videoConsultationFee: 2000,
      emergencyConsultationFee: 4000,
      consultationTypes: ["In-Person", "Video Consultation", "Emergency"],
      emergencyAvailable: true,
      homeVisitAvailable: false,
      telemedicineAvailable: true,
      
      age: 42,
      gender: "Female",
      dateOfBirth: "1982-03-15",
      nationality: "Mauritian",
      bio: "Experienced cardiologist with over 15 years of practice, specializing in interventional procedures and heart disease prevention.",
      philosophy: "I believe in treating not just the disease, but the whole person. Every patient deserves personalized care.",
      specialInterests: ["Preventive Cardiology", "Women's Heart Health", "Cardiac Rehabilitation"],
      
      verified: true,
      verificationDate: "2024-01-15",
      
      verificationDocuments: [
        {
          id: "DOC001",
          type: "license",
          name: "Medical License",
          uploadDate: "2024-01-10",
          url: "/documents/license_sarah_johnson.pdf",
          size: "2.3 MB",
          verified: true,
          verifiedDate: "2024-01-15"
        },
        {
          id: "DOC002",
          type: "degree",
          name: "MD Cardiology Certificate",
          uploadDate: "2024-01-10",
          url: "/documents/md_sarah_johnson.pdf",
          size: "1.8 MB",
          verified: true,
          verifiedDate: "2024-01-15"
        }
      ],
      
      insuranceCoverage: {
        provider: "Medical Protection Society",
        policyNumber: "MPS-2024-001234",
        validUntil: "2025-12-31",
        coverageAmount: 10000000
      },
      
      patients: {
        current: [
          {
            id: "PAT001",
            firstName: "Emma",
            lastName: "Johnson",
            email: "emma.johnson@email.com",
            phone: "+230 5789 1234",
            dateOfBirth: "1985-03-15",
            gender: "Female",
            profileImage: "/images/patients/emma.jpg",
            bloodType: "A+",
            allergies: ["Penicillin", "Shellfish"],
            chronicConditions: ["Hypertension", "Type 2 Diabetes"],
            status: "active",
            lastVisit: "2024-12-01",
            nextAppointment: "2025-01-15",
            totalVisits: 12,
            totalPrescriptions: 8,
            roomId: "emma_sarah_20250115",
            medicalRecordUrl: "/records/PAT001_medical_history.pdf",
            insuranceProvider: "Swan Life",
            insurancePolicyNumber: "SWN-001234"
          }
        ],
        past: []
      },
      
      patientChats: [
        {
          patientId: "PAT001",
          patientName: "Emma Johnson",
          patientImage: "/images/patients/emma.jpg",
          lastMessage: "Thank you Doctor, my blood pressure readings are much better now!",
          lastMessageTime: "2024-12-14 17:15",
          unreadCount: 0,
          status: "offline",
          messages: [
            {
              id: "MSG001",
              senderId: "PAT001",
              senderName: "Emma Johnson",
              senderType: "patient",
              message: "Good morning Dr. Johnson! I wanted to update you on my blood pressure readings.",
              timestamp: "2024-12-14 09:00",
              read: true,
              messageType: "text"
            },
            {
              id: "MSG002",
              senderId: "DOC001",
              senderName: "Dr. Sarah Johnson",
              senderType: "doctor",
              message: "Good morning Emma! Please share your readings, I'd like to review them.",
              timestamp: "2024-12-14 09:15",
              read: true,
              messageType: "text"
            }
          ]
        }
      ],
      
      upcomingAppointments: [
        {
          id: "APP001",
          patientId: "PAT001",
          patientName: "Emma Johnson",
          patientImage: "/images/patients/emma.jpg",
          date: "2025-01-15",
          time: "10:00",
          duration: 30,
          type: "video",
          status: "scheduled",
          reason: "Quarterly diabetes and hypertension review",
          roomId: "emma_sarah_20250115",
          payment: {
            amount: 2000,
            status: "pending",
            method: "insurance"
          },
          followUpRequired: true
        }
      ],
      
      pastAppointments: [
        {
          id: "APP003",
          patientId: "PAT001",
          patientName: "Emma Johnson",
          patientImage: "/images/patients/emma.jpg",
          date: "2024-12-01",
          time: "09:00",
          duration: 45,
          type: "in-person",
          status: "completed",
          reason: "Annual cardiac assessment",
          location: "Apollo Bramwell Hospital",
          notes: "Patient shows good control of hypertension. Continue current medication.",
          payment: {
            amount: 2500,
            status: "paid",
            method: "insurance"
          },
          followUpRequired: true
        }
      ],
      
      todaySchedule: {
        date: "2024-12-15",
        slots: [
          { time: "08:00", available: false, appointmentId: "APP004" },
          { time: "08:30", available: false, appointmentId: "APP005" },
          { time: "09:00", available: true },
          { time: "09:30", available: false, appointmentId: "APP006" },
          { time: "10:00", available: true },
          { time: "10:30", available: true }
        ],
        totalAppointments: 7,
        availableSlots: 9
      },
      
      weeklySchedule: [],
      
      prescriptions: [
        {
          id: "RX001",
          patientId: "PAT001",
          patientName: "Emma Johnson",
          date: "2024-12-01",
          time: "10:00",
          diagnosis: "Essential Hypertension, Type 2 Diabetes",
          medicines: [
            {
              name: "Lisinopril",
              dosage: "10mg",
              frequency: "Once daily",
              duration: "3 months",
              instructions: "Take in the morning with water",
              quantity: 90
            }
          ],
          notes: "Continue lifestyle modifications. Monitor BP daily.",
          nextRefill: "2025-03-01",
          isActive: true,
          signatureUrl: "/signatures/sarah_johnson_sign.png"
        }
      ],
      
      prescriptionTemplates: [
        {
          id: "TEMP001",
          name: "Hypertension Standard",
          condition: "Essential Hypertension",
          medicines: ["Lisinopril 10mg", "Amlodipine 5mg", "Hydrochlorothiazide 25mg"]
        }
      ],
      
      billing: {
        receiveMethods: [
          {
            id: "PAY001",
            type: "credit_card",
            cardNumber: "****1234",
            cardHolder: "Dr. Sarah Johnson",
            expiryDate: "12/26",
            isDefault: true,
            addedDate: "2024-01-15"
          }
        ],
        bankAccounts: [
          {
            id: "BANK001",
            bankName: "Mauritius Commercial Bank",
            accountNumber: "000123456789",
            accountHolder: "Dr. Sarah Johnson",
            swift: "MCBLMUMU",
            iban: "MU17MCBL0001234567890123456789MUR",
            isDefault: true,
            addedDate: "2024-01-10"
          }
        ],
        transactions: [
          {
            id: "TRX001",
            date: "2024-12-01",
            time: "10:30",
            patientId: "PAT001",
            patientName: "Emma Johnson",
            amount: 2500,
            type: "consultation",
            paymentMethod: "insurance",
            status: "completed",
            invoiceUrl: "/invoices/INV-2024-12-001.pdf",
            receiptUrl: "/receipts/REC-2024-12-001.pdf"
          }
        ],
        earnings: {
          today: 7500,
          thisWeek: 35000,
          thisMonth: 145000,
          thisYear: 1850000,
          totalEarnings: 8500000,
          pendingPayouts: 25000,
          averageConsultationFee: 2500
        },
        taxId: "TAX-MU-123456",
        taxRate: 15
      },
      
      subscription: {
        type: "premium",
        planName: "HealthWyz Premium Plus",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        features: [
          "Unlimited consultations",
          "Video consultation platform",
          "Electronic prescriptions",
          "Patient management system",
          "Automated appointment reminders",
          "Revenue analytics dashboard",
          "24/7 technical support",
          "Custom branding"
        ],
        price: 5000,
        billingCycle: "monthly",
        autoRenew: true,
        nextBillingDate: "2025-01-01",
        usage: {
          consultations: { used: 287, limit: -1 },
          videoConsultations: { used: 98, limit: -1 },
          storage: { used: 12.5, limit: 100 },
          smsNotifications: { used: 450, limit: 1000 }
        }
      },
      
      notificationSettings: {
        appointments: true,
        newPatients: true,
        prescriptionRefills: true,
        labResults: true,
        emergencyAlerts: true,
        chatMessages: true,
        paymentReceived: true,
        reviewsReceived: true,
        systemUpdates: false,
        marketingEmails: false,
        notificationTime: "08:00",
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        soundEnabled: true,
        vibrationEnabled: true
      },
      
      privacySettings: {
        profileVisibility: "public",
        showContactInfo: true,
        showEducation: true,
        showExperience: true,
        allowReviews: true,
        shareDataForResearch: false,
        twoFactorAuth: true,
        sessionTimeout: 30
      },
      
      languageSettings: {
        preferredLanguage: "en",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12h",
        timezone: "Indian/Mauritius",
        currency: "MUR"
      },
      
      statistics: {
        totalPatients: 342,
        activePatients: 145,
        newPatientsThisMonth: 12,
        totalConsultations: 2854,
        consultationsThisMonth: 98,
        videoConsultations: 450,
        emergencyConsultations: 23,
        averageConsultationDuration: 28,
        totalPrescriptions: 1890,
        totalRevenue: 8500000,
        topConditionsTreated: [
          { condition: "Hypertension", count: 89 },
          { condition: "Coronary Artery Disease", count: 67 },
          { condition: "Cardiac Arrhythmia", count: 45 },
          { condition: "Heart Failure", count: 34 },
          { condition: "Diabetes with Cardiac Complications", count: 28 }
        ],
        patientDemographics: {
          ageGroups: [
            { range: "18-30", count: 45 },
            { range: "31-45", count: 89 },
            { range: "46-60", count: 134 },
            { range: "61+", count: 74 }
          ],
          gender: { male: 198, female: 144, other: 0 }
        }
      },
      
      registrationDate: "2015-06-15",
      lastLogin: "2024-12-15 07:45:00",
      lastPasswordChange: "2024-10-20",
      accountStatus: "active",
      
      loginHistory: [
        {
          date: "2024-12-15",
          time: "07:45",
          device: "MacBook Pro",
          location: "Port Louis, Mauritius",
          ipAddress: "196.192.110.45"
        },
        {
          date: "2024-12-14",
          time: "18:30",
          device: "iPhone 14 Pro",
          location: "Port Louis, Mauritius",
          ipAddress: "196.192.110.45"
        }
      ]
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })