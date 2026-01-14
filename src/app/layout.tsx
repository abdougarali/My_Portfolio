import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Garali Abdesslem - Full Stack Developer",
    template: "%s | Garali Abdesslem - Full Stack Developer",
  },
  description: "Professional portfolio showcasing my projects, skills, and experience as a full-stack developer.",
  keywords: ["portfolio", "developer", "full-stack", "web development", "react", "nextjs"],
  authors: [{ name: "Garali Abdesslem" }],
  creator: "Garali Abdesslem",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    title: "Garali Abdesslem - Full Stack Developer",
    description: "Professional portfolio showcasing my projects, skills, and experience as a full-stack developer.",
    siteName: "Garali Abdesslem Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Garali Abdesslem - Full Stack Developer",
    description: "Professional portfolio showcasing my projects, skills, and experience as a full-stack developer.",
    creator: "@garaliabdesslem",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
