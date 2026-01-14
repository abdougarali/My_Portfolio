import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '../components/analytics/GoogleAnalytics'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AutoFlowAI - AI-Powered Business Automation Platform | Streamline Your Workflow',
  description: 'Transform your business with AutoFlowAI\'s AI-powered automation platform. Get 99.9% uptime, 200+ integrations, and enterprise-grade security. Trusted by 10,000+ companies worldwide. Start your free 14-day trial today!',
  keywords: [
    'business automation',
    'AI automation',
    'workflow automation',
    'process automation',
    'SaaS platform',
    'enterprise automation',
    'productivity tools',
    'business intelligence',
    'workflow management',
    'automation software',
    'AI-powered tools',
    'business efficiency',
    'team collaboration',
    'project management',
    'task automation'
  ],
  authors: [{ name: 'AutoFlowAI Team' }],
  creator: 'AutoFlowAI',
  publisher: 'AutoFlowAI Inc.',
  applicationName: 'AutoFlowAI',
  category: 'Business Automation Software',
  classification: 'Business Software',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://autoflowai.com',
    title: 'AutoFlowAI - AI-Powered Business Automation Platform',
    description: 'Revolutionize your workflow with AI-powered automation, real-time analytics, and seamless integrations. Join 10,000+ companies scaling with AutoFlowAI.',
    siteName: 'AutoFlowAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AutoFlowAI - Business Automation Platform',
        type: 'image/png',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AutoFlowAI - AI-Powered Business Automation Platform',
    description: 'Transform your business with AI-powered automation. 99.9% uptime, 200+ integrations, enterprise security. Start free trial today!',
    creator: '@autoflowai',
    site: '@autoflowai',
    images: ['/twitter-image.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },
  
  alternates: {
    canonical: 'https://autoflowai.com',
  },
  
  other: {
    'theme-color': '#2563eb',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
  },
  
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}