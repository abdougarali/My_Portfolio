"use client"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Plus, Save, Eye, Trash2, Upload, X, Image as ImageIcon, LogOut, LayoutDashboard, FolderOpen, Mail, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  summary: string
  date: string
  stack: string[]
  category: string
  featured: boolean
  liveUrl: string
  githubUrl: string
  image: string
  tags: string[]
  content: string
}

interface DashboardStats {
  totalProjects: number
  featuredProjects: number
  totalMessages: number
  unreadMessages: number
}

const categories = ["Web Development", "AI/ML", "Data Visualization", "Mobile Development", "DevOps"]
const techStack = ["React", "Next.js", "TypeScript", "Node.js", "Python", "MongoDB", "PostgreSQL", "Tailwind CSS", "Framer Motion"]

export default function AdminPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    date: new Date().toISOString().split('T')[0],
    stack: [] as string[],
    category: "Web Development",
    featured: false,
    liveUrl: "",
    githubUrl: "",
    image: "",
    tags: [] as string[],
    content: ""
  })

  // Load projects and stats on mount
  useEffect(() => {
    loadProjects()
    loadStats()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()
      
      if (result.success) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setUploadedImage(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      try {
        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('type', 'project')
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })
        
        const result = await response.json()
        
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            image: result.url
          }))
        } else {
          alert(`Upload failed: ${result.error}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload image')
      }
    }
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
    setImagePreview("")
    setFormData(prev => ({
      ...prev,
      image: ""
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleStackAdd = (tech: string) => {
    if (!formData.stack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        stack: [...prev.stack, tech]
      }))
    }
  }

  const handleStackRemove = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      stack: prev.stack.filter(t => t !== tech)
    }))
  }

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const projectData = { ...formData }

      let response
      if (editingProject) {
        response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        })
      } else {
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        })
      }

      const result = await response.json()
      
      if (result.success) {
        await loadProjects()
        await loadStats()
        resetForm()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      date: new Date().toISOString().split('T')[0],
      stack: [],
      category: "Web Development",
      featured: false,
      liveUrl: "",
      githubUrl: "",
      image: "",
      tags: [],
      content: ""
    })
    setUploadedImage(null)
    setImagePreview("")
    setEditingProject(null)
    setIsAddingProject(false)
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      summary: project.summary,
      date: project.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      stack: project.stack || [],
      category: project.category,
      featured: project.featured,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      image: project.image || "",
      tags: project.tags || [],
      content: project.content || ""
    })
    setEditingProject(project)
    setIsAddingProject(true)
    if (project.image) {
      setImagePreview(project.image)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        await loadProjects()
        await loadStats()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, Admin
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">{stats.totalProjects}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-yellow-500" />
                  <span className="text-3xl font-bold">{stats.featuredProjects}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="text-3xl font-bold">{stats.totalMessages}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unread Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-red-500" />
                  <span className="text-3xl font-bold">{stats.unreadMessages}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setIsAddingProject(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/messages">
              <Mail className="mr-2 h-4 w-4" />
              View Messages
              {stats?.unreadMessages ? (
                <Badge variant="destructive" className="ml-2">
                  {stats.unreadMessages}
                </Badge>
              ) : null}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>

        {/* Add/Edit Project Form */}
        {isAddingProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </CardTitle>
                <CardDescription>
                  Fill out the form to {editingProject ? "update the" : "add a new"} project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Title *
                      </label>
                      <Input
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="My Awesome Project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Date *
                      </label>
                      <Input
                        name="date"
                        type="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Summary *
                    </label>
                    <Textarea
                      name="summary"
                      required
                      rows={3}
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder="Brief description of your project..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      <label htmlFor="featured" className="text-sm font-medium">
                        Featured Project
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Live URL
                      </label>
                      <Input
                        name="liveUrl"
                        type="url"
                        value={formData.liveUrl}
                        onChange={handleInputChange}
                        placeholder="https://your-project.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        GitHub URL
                      </label>
                      <Input
                        name="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project Image
                    </label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      {!imagePreview && !formData.image ? (
                        <div>
                          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={imagePreview || formData.image}
                              alt="Preview"
                              className="max-h-48 rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeUploadedImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tech Stack
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.stack.map(tech => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => handleStackRemove(tech)}
                        >
                          {tech} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.filter(t => !formData.stack.includes(t)).map(tech => (
                        <Button
                          key={tech}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleStackAdd(tech)}
                        >
                          + {tech}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="cursor-pointer"
                          onClick={() => handleTagRemove(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add a tag and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleTagAdd((e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content (Markdown) *
                    </label>
                    <Textarea
                      name="content"
                      required
                      rows={10}
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your project description in Markdown format..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      {editingProject ? "Update Project" : "Add Project"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Projects List */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage your portfolio projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No projects yet. Add your first project!
                </p>
                <Button onClick={() => setIsAddingProject(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    {project.image && (
                      <div className="h-32 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {project.summary}
                          </CardDescription>
                        </div>
                        {project.featured && (
                          <Badge>Featured</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.stack?.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
