"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Settings {
  email: string
  phone: string
  location: string
  availability: boolean
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
  }
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Reset status when user starts typing again
    if (submitStatus !== "idle") {
      setSubmitStatus("idle")
      setErrorMessage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
        setErrorMessage(result.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
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
          Get In Touch
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
          Have a project in mind or just want to chat? I&apos;d love to hear from you. 
          Send me a message and I&apos;ll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Send me a message</CardTitle>
              <CardDescription>
                Fill out the form below and I&apos;ll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your project or just say hello..."
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">
                        Message sent successfully!
                      </p>
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                        Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 dark:text-red-200 font-medium">
                        Failed to send message
                      </p>
                      <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                        {errorMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out to me through any of these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.email && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </motion.div>
              )}
              
              {settings?.location && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.location}
                    </p>
                  </div>
                </motion.div>
              )}
              
              {settings?.phone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Follow Me</CardTitle>
              <CardDescription>
                Connect with me on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings?.socialLinks?.github && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <a
                    href={settings.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        GitHub
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Check out my code and projects
                      </p>
                    </div>
                  </a>
                </motion.div>
              )}
              
              {settings?.socialLinks?.linkedin && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        LinkedIn
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Connect with me professionally
                      </p>
                    </div>
                  </a>
                </motion.div>
              )}
              
              {settings?.socialLinks?.twitter && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <a
                    href={settings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        Twitter
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Follow me for updates
                      </p>
                    </div>
                  </a>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>
                When I&apos;m available for new projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${settings?.availability ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">
                    {settings?.availability ? 'Available for new projects' : 'Not available at the moment'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {settings?.availability 
                    ? "I'm currently accepting new projects and collaborations. Let's discuss how we can work together!"
                    : "I'm currently focused on existing projects. Feel free to reach out for future opportunities!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
