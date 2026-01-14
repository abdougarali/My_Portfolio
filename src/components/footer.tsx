import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/garaliabdesslem",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/garaliabdesslem",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/garaliabdesslem",
    icon: Twitter,
  },
  {
    name: "Email",
    href: "mailto:garali.abdesslem@example.com",
    icon: Mail,
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <p className="text-center text-xs sm:text-sm leading-relaxed text-muted-foreground md:text-left">
              Built with Next.js, TypeScript, and Tailwind CSS.
              <span className="block sm:inline"> © 2024 Garali Abdesslem.</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
