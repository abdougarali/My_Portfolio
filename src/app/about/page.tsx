"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Settings {
  siteName: string
  siteDescription: string
  ownerName: string
  ownerTitle: string
  ownerBio: string
  ownerLocation: string
  profileImage: string
  email: string
  github: string
  linkedin: string
  twitter: string
}

const skills = [
  { name: "JavaScript", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "React", level: 95 },
  { name: "Next.js", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "Python", level: 80 },
  { name: "PostgreSQL", level: 85 },
  { name: "MongoDB", level: 80 },
  { name: "AWS", level: 75 },
  { name: "Docker", level: 70 },
]

const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", 
  "MongoDB", "Redis", "AWS", "Docker", "Kubernetes", "GraphQL", 
  "Tailwind CSS", "Framer Motion", "Prisma", "tRPC"
]

export default function AboutPage() {
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
    <div className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl mb-4 sm:mb-6">
            About Me
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Passionate about creating digital experiences that make a difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center">
                  {settings?.profileImage ? (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden relative shadow-lg">
                      <Image
                        src={settings.profileImage}
                        alt={settings?.ownerName || "Profile"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 112px, 128px"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                      {(settings?.ownerName || "GA").split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{settings?.ownerName || "Garali Abdesslem"}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">{settings?.ownerTitle || "Full Stack Developer"}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{settings?.ownerLocation || "Tunisia"}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Available for work</span>
                    </div>
                  </div>

                  <Button className="mt-6 w-full" asChild>
                    <a href="/resume.pdf" download>
                      <Download className="mr-2 h-4 w-4" />
                      Download CV
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6 sm:space-y-8"
          >
            {/* Bio */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">My Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                {settings?.ownerBio ? (
                  settings.ownerBio.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      I'm a passionate full-stack developer with over 5 years of experience 
                      building modern web applications. My journey began with a curiosity 
                      about how websites work, and it has evolved into a deep love for 
                      creating digital experiences that make a real impact.
                    </p>
                    <p>
                      I specialize in React, Next.js, and Node.js, but I'm always eager 
                      to learn new technologies and frameworks. I believe in writing clean, 
                      maintainable code and following best practices to deliver high-quality 
                      solutions.
                    </p>
                    <p>
                      When I'm not coding, you can find me exploring new technologies, 
                      contributing to open-source projects, or sharing knowledge with 
                      the developer community.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Technical Skills</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Technologies and tools I work with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Technologies & Tools</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  A comprehensive list of technologies I work with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    >
                      <Badge variant="secondary">{tech}</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
