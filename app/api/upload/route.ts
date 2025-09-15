import { NextRequest, NextResponse } from 'next/server';
import { getStorageClient } from '@/lib/google-auth';

export async function POST(request: NextRequest) {
  try {
    const storage = getStorageClient();
    const bucket = storage.bucket('healthwyz-uploads');
    const file = bucket.file('example.txt');
    await file.save('Hello World');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}