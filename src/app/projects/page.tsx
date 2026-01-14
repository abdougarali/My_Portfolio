"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('Loading projects from API...')
        const response = await fetch('/api/projects')
        console.log('API response status:', response.status)
        
        const result = await response.json()
        console.log('API response data:', result)
        
        if (result.success) {
          console.log('Projects loaded successfully:', result.data.length, 'projects')
          setProjects(result.data)
        } else {
          console.error('Failed to load projects:', result.error)
        }
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Get unique categories from projects
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(projects.map(p => p.category))]
    return cats
  }, [projects])

  // Handle image loading errors
  const handleImageError = (projectId: string) => {
    setImageErrors(prev => new Set(prev).add(projectId))
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [projects, selectedCategory, searchTerm])

  if (loading) {
    return (
      <div className="container py-24 md:py-32">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-16"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl mb-4 sm:mb-6">
          My Projects
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
          A collection of projects that showcase my skills and passion for creating 
          innovative digital solutions.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 sm:mb-12"
      >
        <div className="flex flex-col gap-4 items-center justify-center">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-base"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center px-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/projects/${project.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                {project.image && !imageErrors.has(project.id) ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => handleImageError(project.id)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                    <div className="text-6xl font-bold text-primary/30">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                {project.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(project.date)}</span>
                  <Tag className="h-4 w-4 ml-2" />
                  <span>{project.category}</span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {project.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1">
                  {project.stack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.stack.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.stack.length - 4} more
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                {project.tags && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/projects/${project.slug}`} onClick={(e) => e.stopPropagation()}>
                      View Details
                    </Link>
                  </Button>
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" 
                         onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                         onClick={(e) => e.stopPropagation()}>
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          {projects.length === 0 ? (
            <div>
              <p className="text-muted-foreground text-lg mb-4">
                No projects have been added yet.
              </p>
              <p className="text-muted-foreground text-sm">
                Check back later or contact me to learn about my work!
              </p>
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground text-lg">
                No projects found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All")
                  setSearchTerm("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}



