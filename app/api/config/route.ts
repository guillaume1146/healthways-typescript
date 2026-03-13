import { NextRequest, NextResponse } from 'next/server'
import { rateLimitPublic } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = rateLimitPublic(request)
  if (limited) return limited

  try {
    const config = {
      appName: process.env.APP_NAME || 'Healthwyz',
      appTagline: process.env.APP_TAGLINE || 'Your trusted healthcare companion in Mauritius',
      heroTitle: process.env.HERO_TITLE || 'Your Health, Our Priority',
      platformDescription: process.env.PLATFORM_DESC || "Mauritius's Leading Healthcare Platform",
    }

    return NextResponse.json(config)
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to load configuration' },
      { status: 500 }
    )
  }
}
