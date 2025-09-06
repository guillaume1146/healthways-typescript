import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    appName: process.env.APP_NAME || "Healthwyz",
    appTagline: process.env.APP_TAGLINE || "Your trusted healthcare companion in Mauritius",
    heroTitle: process.env.HERO_TITLE || "Your Health, Our Priority",
    platformDescription: process.env.PLATFORM_DESC || "Mauritius's Leading Healthcare Platform"
  }
  
  await new Promise(resolve => setTimeout(resolve, 100))
  return NextResponse.json(config)
}