import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Test creating a user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'patient'
      }
    });

    // Get all users
    const users = await prisma.user.findMany();

    return NextResponse.json({
      success: true,
      message: 'Database working!',
      testUser,
      totalUsers: users.length,
      users
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database error'
    }, { status: 500 });
  }
}