import { NextRequest, NextResponse } from 'next/server';
import { createAuthData } from '@/app/login/data/userData';
import { BaseAuthenticatedUser } from '@/app/login/types/auth';

const authData: Record<string, BaseAuthenticatedUser> = createAuthData();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;
    if (!email || !password || !userType) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email, password, and user type are required' 
        },
        { status: 400 }
      );
    }

    const user = authData[email.toLowerCase()];
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid credentials' 
        },
        { status: 401 }
      );
    }

    if (user.userType !== userType) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid user type for this account' 
        },
        { status: 401 }
      );
    }

    const authenticatedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: user.token,
      userType: user.userType,
      profileImage: user.profileImage
    };

    return NextResponse.json(
      { 
        success: true,
        user: authenticatedUser,
        message: 'Login successful'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred during login' 
      },
      { status: 500 }
    );
  }
}