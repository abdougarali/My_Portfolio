"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, ArrowRight, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 lg:h-24 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg"
            >
              <Code2 className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight">
                Garali <span className="text-primary">Abdesslem</span>
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Full Stack Developer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-5 py-2.5 group"
              >
                <span className={cn(
                  "text-base font-semibold transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.name}
                </span>
                {/* Active indicator */}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {/* Hover effect */}
                <span className="absolute inset-0 rounded-lg bg-accent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            {/* CTA Button - Desktop */}
            <Button asChild className="hidden lg:flex gap-2 shadow-lg text-sm lg:text-base font-semibold px-4 lg:px-6" size="default">
              <Link href="/contact">
                Let's Talk
                <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsOpen(!isOpen)}
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden overflow-hidden border-t bg-background/95 backdrop-blur-lg"
      >
        <nav className="container py-6 space-y-2">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isOpen ? 1 : 0, 
                x: isOpen ? 0 : -20 
              }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 text-lg font-semibold rounded-xl transition-all",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </Link>
            </motion.div>
          ))}
          
          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isOpen ? 1 : 0, 
              y: isOpen ? 0 : 10 
            }}
            transition={{ delay: 0.4 }}
            className="pt-4"
          >
            <Button asChild className="w-full gap-2" size="lg">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Let's Talk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </nav>
      </motion.div>
    </motion.header>
  )
}
