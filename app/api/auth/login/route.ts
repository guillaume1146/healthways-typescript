// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { doctorsData } from '@/lib/data/doctors'
import { nursesData } from '@/lib/data/nurses'
import { nanniesData } from '@/lib/data/nannies'
import { patientsData } from '@/lib/data/patients'

// Demo users for other types
const demoUsers = [
  {
    id: 'PHARM001',
    firstName: 'John',
    lastName: 'Pharmacist',
    email: 'pharmacy@healthwyz.mu',
    password: 'PharmacyPass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.pharmacy.token',
    userType: 'pharmacy',
    profileImage: '/images/pharmacy/1.jpg'
  },
  {
    id: 'LAB001',
    firstName: 'Sarah',
    lastName: 'Lab Tech',
    email: 'lab@healthwyz.mu',
    password: 'LabPass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.lab.token',
    userType: 'lab',
    profileImage: '/images/lab/1.jpg'
  },
  {
    id: 'AMB001',
    firstName: 'Mike',
    lastName: 'Emergency',
    email: 'ambulance@healthwyz.mu',
    password: 'AmbulancePass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ambulance.token',
    userType: 'ambulance',
    profileImage: '/images/ambulance/1.jpg'
  },
  {
    id: 'ADM001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@healthwyz.mu',
    password: 'AdminPass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.token',
    userType: 'admin',
    profileImage: '/images/admin/1.jpg'
  },
  {
    id: 'CORP001',
    firstName: 'Corporate',
    lastName: 'Admin',
    email: 'corporate@healthwyz.mu',
    password: 'CorporatePass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.corporate.token',
    userType: 'corporate',
    profileImage: '/images/corporate/1.jpg'
  },
  {
    id: 'INS001',
    firstName: 'Insurance',
    lastName: 'Rep',
    email: 'insurance@healthwyz.mu',
    password: 'InsurancePass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.insurance.token',
    userType: 'insurance',
    profileImage: '/images/insurance/1.jpg'
  },
  {
    id: 'REF001',
    firstName: 'Partner',
    lastName: 'Referral',
    email: 'partner@healthwyz.mu',
    password: 'PartnerPass123!',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.partner.token',
    userType: 'referral-partner',
    profileImage: '/images/referral/1.jpg'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, userType } = body
    
    let user
    let fullUserData
    
    if (userType === 'patient') {
      // Try database first
      user = await prisma.patient.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          medicalRecords: true,
          prescriptions: true,
          vitalSigns: true,
          appointments: true,
          childcareBookings: true,
          videoCallHistory: true,
          billingInformation: true,
          pillReminders: true,
          emergencyContacts: true,
          nutritionAnalyses: true
        }
      })
      
      if (user) {
        // Database user found
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        
        // Type the filter parameters explicitly
        const activePrescriptions = user.prescriptions.filter((p: { isActive: boolean }) => p.isActive)
        const prescriptionHistory = user.prescriptions.filter((p: { isActive: boolean }) => !p.isActive)
        
        const upcomingAppointments = user.appointments.filter((a: { status: string }) => a.status === 'upcoming')
        const pastAppointments = user.appointments.filter((a: { status: string }) => 
          a.status === 'completed' || a.status === 'cancelled'
        )
        
        const { password: _, prescriptions, appointments, ...restPatient } = user
        
        fullUserData = {
          ...restPatient,
          activePrescriptions,
          prescriptionHistory,
          upcomingAppointments,
          pastAppointments,
          userType: 'patient'
        }
      } else {
        // Fall back to static data
        const staticUser = patientsData.find(p => p.email.toLowerCase() === email.toLowerCase())
        if (!staticUser || staticUser.password !== password) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        fullUserData = { ...staticUser, userType: 'patient' }
      }
      
    } else if (userType === 'doctor') {
      // Try database first
      user = await prisma.doctor.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (user) {
        // Database user found
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        
        const { password: _, ...userData } = user
        fullUserData = {
          ...userData,
          userType: 'doctor'
        }
      } else {
        // Fall back to static data
        const staticUser = doctorsData.find(d => d.email.toLowerCase() === email.toLowerCase())
        if (!staticUser || staticUser.password !== password) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        fullUserData = { ...staticUser, userType: 'doctor' }
      }
      
    } else if (userType === 'nurse') {
      // Try database first
      user = await prisma.nurse.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        
        const { password: _, ...userData } = user
        fullUserData = {
          ...userData,
          userType: 'nurse'
        }
      } else {
        // Fall back to static data
        const staticUser = nursesData.find(n => n.email.toLowerCase() === email.toLowerCase())
        if (!staticUser || staticUser.password !== password) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        fullUserData = { ...staticUser, userType: 'nurse' }
      }
      
    } else if (userType === 'child-care-nurse') {
      // Try database first  
      user = await prisma.nanny.findUnique({
        where: { email: email.toLowerCase() }
      })
      
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        
        const { password: _, ...userData } = user
        fullUserData = {
          ...userData,
          userType: 'child-care-nurse'
        }
      } else {
        // Fall back to static data
        const staticUser = nanniesData.find(n => n.email.toLowerCase() === email.toLowerCase())
        if (!staticUser || staticUser.password !== password) {
          return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
          )
        }
        fullUserData = { ...staticUser, userType: 'child-care-nurse' }
      }
      
    } else {
      // For other user types (pharmacy, lab, ambulance, admin, etc.), use demo users
      const demoUser = demoUsers.find(u => 
        u.userType === userType && u.email.toLowerCase() === email.toLowerCase()
      )
      
      if (!demoUser || demoUser.password !== password) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
      
      fullUserData = demoUser
    }
    
    return NextResponse.json({
      success: true,
      user: fullUserData,
      message: 'Login successful'
    })
    
  } catch (error) {
    console.error('Database login error:', error)
    return NextResponse.json(
      { success: false, message: 'Database error' },
      { status: 500 }
    )
  }
}