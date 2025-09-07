import { NextRequest, NextResponse } from 'next/server';
import { createAuthData } from '@/app/login/data/userData';
import { patientsData } from '@/lib/data/patients';

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
        // Merge patient data with auth properties
        fullUserData = {
          ...completePatientData,
          userType: user.userType,  // Add userType from auth data
          token: user.token,         // Ensure token is included
          password: undefined        // Remove password from response
        };
      } else {
        // Fallback to basic user data if patient not found
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
      // For non-patient users, return basic data
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