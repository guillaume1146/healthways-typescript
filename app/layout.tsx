import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import { CartProvider } from '@/app/search/medicines/contexts/CartContext'
import ToastProvider from '@/components/shared/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Healthwyz - Healthcare Platform Mauritius',
    template: '%s | Healthwyz',
  },
  description:
    'Connect with qualified doctors, nurses, and healthcare providers in Mauritius. Book video consultations, manage prescriptions, and access AI-powered health insights.',
  keywords: [
    'healthcare',
    'doctors',
    'nurses',
    'Mauritius',
    'telemedicine',
    'video consultation',
    'prescription',
    'pharmacy',
    'health platform',
    'medical appointments',
    'nanny',
    'lab technician',
    'emergency services',
    'health insurance',
  ],
  authors: [{ name: 'Healthwyz' }],
  creator: 'Healthwyz',
  publisher: 'Healthwyz',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://healthwyz.mu'),
  openGraph: {
    type: 'website',
    locale: 'en_MU',
    siteName: 'Healthwyz',
    title: 'Healthwyz - Healthcare Platform Mauritius',
    description:
      'Connect with qualified doctors, nurses, and healthcare providers in Mauritius. Book video consultations and manage your health online.',
    images: [
      {
        url: '/images/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Healthwyz - Healthcare Platform Mauritius',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthwyz - Healthcare Platform Mauritius',
    description:
      'Connect with qualified doctors, nurses, and healthcare providers in Mauritius.',
    images: ['/images/og-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalOrganization',
  name: 'Healthwyz',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://healthwyz.mu',
  logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://healthwyz.mu'}/images/logo.png`,
  description:
    'A full-stack healthcare platform for Mauritius connecting patients with doctors, nurses, pharmacists, and emergency services via video consultations and appointment booking.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MU',
    addressLocality: 'Mauritius',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Mauritius',
  },
  medicalSpecialty: [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Dermatology',
    'Orthopedic Surgery',
    'Emergency Medicine',
    'Psychiatry',
    'General Practice',
  ],
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'Video Consultation',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'In-Person Consultation',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Prescription Management',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Healthwyz" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
          <ToastProvider />
        </CartProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}