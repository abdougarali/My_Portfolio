"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  ArrowLeft, 
  RefreshCw,
  ExternalLink,
  Search,
  Filter
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  replied: boolean
  createdAt: string
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMessages()
  }, [filter])

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      let url = '/api/admin/messages'
      if (filter === 'unread') url += '?read=false'
      if (filter === 'read') url += '?read=true'
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setMessages(result.data)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === id ? { ...msg, read } : msg
          )
        )
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, read } : null)
        }
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessages(prev => prev.filter(msg => msg.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      handleMarkAsRead(message.id, true)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredMessages = messages.filter(msg => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      msg.name.toLowerCase().includes(search) ||
      msg.email.toLowerCase().includes(search) ||
      msg.subject.toLowerCase().includes(search)
    )
  })

  const unreadCount = messages.filter(m => !m.read).length

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
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <Button variant="outline" size="sm" onClick={loadMessages}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Inbox
                    {unreadCount > 0 && (
                      <Badge variant="destructive">{unreadCount}</Badge>
                    )}
                  </CardTitle>
                </div>
                <CardDescription>
                  {messages.length} total messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filter === 'read' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('read')}
                  >
                    Read
                  </Button>
                </div>

                {/* Messages */}
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-sm">Loading messages...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No messages found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-accent'
                        } ${!message.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {!message.read ? (
                                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                              ) : (
                                <MailOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <p className={`text-sm truncate ${!message.read ? 'font-semibold' : ''}`}>
                                {message.name}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {message.subject}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedMessage.subject}</CardTitle>
                        <CardDescription className="mt-2">
                          From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                          <br />
                          Received: {formatDate(selectedMessage.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.read)}
                        >
                          {selectedMessage.read ? (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              Mark Unread
                            </>
                          ) : (
                            <>
                              <MailOpen className="h-4 w-4 mr-2" />
                              Mark Read
                            </>
                          )}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(selectedMessage.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="bg-muted/50 rounded-lg p-6 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <Button asChild>
                        <a 
                          href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Reply to {selectedMessage.name}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Mail className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a message to view its contents
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
