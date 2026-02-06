import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { Providers } from '@/components/providers'
import { MobileNav } from '@/components/mobile-nav'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'

import { Inter, Cormorant_Garamond } from 'next/font/google'

// Initialize fonts

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hakeem Mohsin | Premium Natural & Herbal Products',
  description: 'Discover the finest natural and herbal products at Hakeem Mohsin. Shop adaptogens, immunity boosters, digestive wellness, sleep aids, beauty supplements, and energy vitality products.',
  keywords: ['herbal products', 'natural supplements', 'botanical wellness', 'adaptogens', 'immunity boosters', 'organic health'],
  authors: [{ name: 'Hakeem Mohsin' }],
  creator: 'Hakeem Mohsin',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Hakeem Mohsin Store | Premium Natural & Herbal Products',
    description: 'Discover the finest natural and herbal products. Clinical luxury meets botanical wellness.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hakeem Mohsin Store',
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8B7355',
}

import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden pb-24 md:pb-0" suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
          <Toaster />
          <MobileNav />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}

