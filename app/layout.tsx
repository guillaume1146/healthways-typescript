import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import ConditionalFooter from '@/components/layout/ConditionalFooter'
import { CartProvider } from '@/app/search/medicines/contexts/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Healthwyz - Your Health, Our Priority',
  description: 'Connect with qualified doctors, get AI-powered health insights, and access medicines across Mauritius.',
  keywords: 'healthcare, doctors, medicines, AI health, Mauritius',
  authors: [{ name: 'Healthwyz' }],
  openGraph: {
    title: 'Healthwyz - Your Health, Our Priority',
    description: 'Connect with qualified doctors and access medicines across Mauritius.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
        </CartProvider>
      </body>
    </html>
  )
}