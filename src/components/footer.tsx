"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

interface Settings {
  ownerName: string
  email: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
  }
}

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const result = await response.json()
        if (result.success) {
          setSettings(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }
    fetchSettings()
  }, [])
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <p className="text-center text-xs sm:text-sm leading-relaxed text-muted-foreground md:text-left">
              Built with Next.js, TypeScript, and Tailwind CSS.
              <span className="block sm:inline"> © {new Date().getFullYear()} {settings?.ownerName || 'Garali Abdesslem'}.</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {settings?.socialLinks?.github && (
              <Link
                href={settings.socialLinks.github}
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            )}
            {settings?.socialLinks?.linkedin && (
              <Link
                href={settings.socialLinks.linkedin}
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            )}
            {settings?.socialLinks?.twitter && (
              <Link
                href={settings.socialLinks.twitter}
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            )}
            {settings?.email && (
              <Link
                href={`mailto:${settings.email}`}
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
