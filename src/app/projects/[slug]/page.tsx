"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Project {
  id: string
  slug: string
  title: string
  summary: string
  date: string
  stack: string[]
  category: string
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  image?: string
  tags: string[]
  content: string
}

interface ProjectDetailPageProps {
  params: {
    slug: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await fetch('/api/projects')
        const result = await response.json()
        
        if (result.success) {
          const foundProject = result.data.find((p: Project) => p.slug === params.slug)
          if (foundProject) {
            setProject(foundProject)
          } else {
            setNotFound(true)
          }
        } else {
          console.error('Failed to load projects:', result.error)
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error loading project:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
        <div className="flex items-center justify-center min-h-[50vh] sm:min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !project) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
        <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-96 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Project Not Found</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <Button variant="ghost" asChild className="text-sm sm:text-base">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Project Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-48 sm:h-64 lg:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-blue-600/20">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl sm:text-8xl font-bold text-primary/30">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                {project.featured && (
                  <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-xs sm:text-sm">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                  {project.title}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>{project.category}</span>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.stack.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                {project.liveUrl && (
                  <Button asChild className="w-full sm:w-auto">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none">
                {project.content.split('\n').map((paragraph: string, index: number) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 mt-6 sm:mt-8 first:mt-0">
                        {paragraph.replace('# ', '')}
                      </h1>
                    )
                  } else if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 mt-4 sm:mt-6">
                        {paragraph.replace('## ', '')}
                      </h2>
                    )
                  } else if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-base sm:text-lg lg:text-xl font-medium mb-2 sm:mb-3 mt-3 sm:mt-4">
                        {paragraph.replace('### ', '')}
                      </h3>
                    )
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="mb-1.5 sm:mb-2 text-sm sm:text-base">
                        {paragraph.replace('- ', '')}
                      </li>
                    )
                  } else if (paragraph.trim() === '') {
                    return <br key={index} />
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                        {paragraph}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}



