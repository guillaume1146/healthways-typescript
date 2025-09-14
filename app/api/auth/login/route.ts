import { NextRequest, NextResponse } from 'next/server';
import { createAuthData } from '@/app/login/data/userData';
import { patientsData } from '@/lib/data/patients';
import { doctorsData } from '@/lib/data/doctors';  // Add this import

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;
    
    const authData = createAuthData();
    const user = authData[email.toLowerCase()];
    
    if (!user || user.password !== password || user.userType !== userType) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    let fullUserData;

    if (userType === 'patient') {
      // Find the complete patient data
      const completePatientData = patientsData.find(
        patient => patient.id === user.id
      );
      
      if (completePatientData) {
        fullUserData = {
          ...completePatientData,
          userType: user.userType,
          token: user.token,
          password: undefined  // Remove password from response
        };
      } else {
        fullUserData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: user.token,
          userType: user.userType,
          profileImage: user.profileImage
        };
      }
    } else if (userType === 'doctor') {
      // Add complete doctor data handling
      const completeDoctorData = doctorsData.find(
        doctor => doctor.id === user.id
      );
      
      if (completeDoctorData) {
        fullUserData = {
          ...completeDoctorData,  // All doctor fields
          userType: user.userType,
          token: user.token,
          password: undefined  // Remove password from response
        };
      } else {
        fullUserData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: user.token,
          userType: user.userType,
          profileImage: user.profileImage
        };
      }
    } else {
      // For other user types, return basic data
      fullUserData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: user.token,
        userType: user.userType,
        profileImage: user.profileImage
      };
    }

    return NextResponse.json(
      { 
        success: true,
        user: fullUserData,
        message: 'Login successful'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}