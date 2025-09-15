import { NextResponse } from 'next/server';
import { getStorageClient } from '@/lib/google-auth';

export async function GET() {
  try {
    const storage = getStorageClient();
    const [buckets] = await storage.getBuckets();
    const bucket = storage.bucket('healthwyz-uploads');
    const [exists] = await bucket.exists();
    
    return NextResponse.json({
      success: true,
      message: 'Storage connection successful',
      buckets: buckets.map(b => b.name),
      uploadBucketExists: exists,
      environment: process.env.NODE_ENV,
      usingSecret: !!process.env.STORAGE_SERVICE_ACCOUNT
    });
  } catch (error) {
    console.error('Storage test error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}