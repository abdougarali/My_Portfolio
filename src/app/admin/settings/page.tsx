"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Save, 
  Upload,
  User,
  Globe,
  Briefcase,
  Plus,
  X,
  Loader2
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Settings {
  siteName: string
  ownerName: string
  title: string
  bio: string
  location: string
  email: string
  phone: string
  availability: boolean
  profileImage: string
  resumeUrl: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
  }
  skills: Array<{ name: string; level: number }>
  technologies: string[]
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [newSkill, setNewSkill] = useState({ name: '', level: 50 })
  const [newTech, setNewTech] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    
    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')
    
    console.log('Saving settings:', settings)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      const result = await response.json()
      
      console.log('Save response:', result)
      
      if (result.success) {
        // Reload settings from server to ensure we have the latest data
        await loadSettings()
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
        setErrorMessage(result.error || 'Failed to save settings')
        console.error('Error saving settings:', result.error)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setErrorMessage('Network error: Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSocialChange = (platform: string, value: string) => {
    setSettings(prev => prev ? {
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    } : null)
  }

  const handleAddSkill = () => {
    if (newSkill.name.trim() && settings) {
      setSettings({
        ...settings,
        skills: [...settings.skills, { name: newSkill.name.trim(), level: newSkill.level }]
      })
      setNewSkill({ name: '', level: 50 })
    }
  }

  const handleRemoveSkill = (index: number) => {
    if (settings) {
      setSettings({
        ...settings,
        skills: settings.skills.filter((_, i) => i !== index)
      })
    }
  }

  const handleAddTech = () => {
    if (newTech.trim() && settings && !settings.technologies.includes(newTech.trim())) {
      setSettings({
        ...settings,
        technologies: [...settings.technologies, newTech.trim()]
      })
      setNewTech('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    if (settings) {
      setSettings({
        ...settings,
        technologies: settings.technologies.filter(t => t !== tech)
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'profile')

    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      console.log('Uploading image...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      console.log('Upload response:', result)
      
      if (result.success) {
        // Update settings with new image URL
        const updatedSettings = { ...settings, profileImage: result.url }
        
        console.log('Saving updated settings with new image...')
        
        // Save to database immediately
        const saveResponse = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSettings),
        })
        
        const saveResult = await saveResponse.json()
        
        console.log('Save result:', saveResult)
        
        if (saveResult.success) {
          await loadSettings()
          setSaveStatus('success')
          setTimeout(() => setSaveStatus('idle'), 3000)
        } else {
          setSaveStatus('error')
          setErrorMessage(saveResult.error || 'Failed to save image')
        }
      } else {
        setSaveStatus('error')
        setErrorMessage(result.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setSaveStatus('error')
      setErrorMessage('Failed to upload image')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setSaveStatus('error')
      setErrorMessage('Please upload a PDF file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'resume')

    setIsUploadingResume(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      console.log('Uploading resume...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const result = await response.json()
      
      console.log('Upload response:', result)
      
      if (result.success) {
        // Update settings with new resume URL
        const updatedSettings = { ...settings, resumeUrl: result.url }
        
        console.log('Saving updated settings with new resume...')
        
        // Save to database immediately
        const saveResponse = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSettings),
        })
        
        const saveResult = await saveResponse.json()
        
        console.log('Save result:', saveResult)
        
        if (saveResult.success) {
          await loadSettings()
          setSaveStatus('success')
          setTimeout(() => setSaveStatus('idle'), 3000)
        } else {
          setSaveStatus('error')
          setErrorMessage(saveResult.error || 'Failed to save resume')
        }
      } else {
        setSaveStatus('error')
        setErrorMessage(result.error || 'Failed to upload resume')
      }
    } catch (error) {
      console.error('Error uploading resume:', error)
      setSaveStatus('error')
      setErrorMessage('Failed to upload resume')
    } finally {
      setIsUploadingResume(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load settings</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Site Settings</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="container py-8 max-w-4xl">
        {saveStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
          >
            <p className="text-green-800 dark:text-green-200">Settings saved successfully!</p>
          </motion.div>
        )}
        
        {saveStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-800 dark:text-red-200 font-semibold">Failed to save settings</p>
            {errorMessage && <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errorMessage}</p>}
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {settings.profileImage ? (
                    <img
                      src={settings.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {settings.ownerName?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    name="ownerName"
                    value={settings.ownerName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    name="title"
                    value={settings.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea
                  name="bio"
                  value={settings.bio}
                  onChange={handleInputChange}
                  placeholder="Tell visitors about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    name="location"
                    value={settings.location}
                    onChange={handleInputChange}
                    placeholder="Your location"
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="availability"
                    checked={settings.availability}
                    onChange={(e) => setSettings({ ...settings, availability: e.target.checked })}
                  />
                  <label htmlFor="availability" className="text-sm font-medium">
                    Available for new projects
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Resume/CV</label>
                <div className="flex gap-2">
                  <Input
                    name="resumeUrl"
                    value={settings.resumeUrl}
                    onChange={handleInputChange}
                    placeholder="Or paste a URL manually"
                    className="flex-1"
                  />
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={isUploadingResume}
                  >
                    {isUploadingResume ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                </div>
                {settings.resumeUrl && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>✓ Resume uploaded:</span>
                    <a 
                      href={settings.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate max-w-xs"
                    >
                      {settings.resumeUrl}
                    </a>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a PDF file (recommended) or paste a public URL
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Contact & Social
              </CardTitle>
              <CardDescription>
                How people can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <Input
                    value={settings.socialLinks.github}
                    onChange={(e) => handleSocialChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                  <Input
                    value={settings.socialLinks.linkedin}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter URL</label>
                  <Input
                    value={settings.socialLinks.twitter}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Skills & Technologies
              </CardTitle>
              <CardDescription>
                Your technical skills and proficiency levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Skills */}
              <div className="space-y-3">
                {settings.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-32 text-sm font-medium">{skill.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-muted-foreground">{skill.level}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Skill */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Input
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-40"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="w-12 text-sm">{newSkill.level}%</span>
                <Button onClick={handleAddSkill} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Technologies */}
              <div className="pt-6 border-t">
                <label className="block text-sm font-medium mb-3">Technologies</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {settings.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTech(tech)}
                    >
                      {tech} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add technology..."
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                    className="w-48"
                  />
                  <Button onClick={handleAddTech} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
