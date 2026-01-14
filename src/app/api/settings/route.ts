import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Settings from '@/lib/models/Settings'

// Default settings for initial setup
const defaultSettings = {
  siteName: 'My Portfolio',
  ownerName: 'Garali Abdesslem',
  title: 'Full Stack Developer',
  bio: "I'm a passionate full-stack developer with over 5 years of experience building modern web applications.",
  location: 'Tunisia',
  email: '',
  phone: '',
  availability: true,
  profileImage: '',
  resumeUrl: '/resume.pdf',
  socialLinks: {
    github: 'https://github.com/garaliabdesslem',
    linkedin: 'https://linkedin.com/in/garaliabdesslem',
    twitter: 'https://twitter.com/garaliabdesslem',
  },
  skills: [
    { name: 'JavaScript', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'React', level: 95 },
    { name: 'Next.js', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'PostgreSQL', level: 85 },
    { name: 'MongoDB', level: 80 },
  ],
  technologies: [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 
    'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker',
    'Tailwind CSS', 'Framer Motion', 'Prisma'
  ],
}

// GET - Fetch site settings (Public)
export async function GET() {
  try {
    await dbConnect()
    
    // Find settings or create default
    let settings = await Settings.findOne().lean()
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create(defaultSettings)
      settings = settings.toObject()
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: settings._id.toString(),
        siteName: settings.siteName,
        ownerName: settings.ownerName,
        title: settings.title,
        bio: settings.bio,
        location: settings.location,
        email: settings.email,
        phone: settings.phone,
        availability: settings.availability,
        profileImage: settings.profileImage,
        resumeUrl: settings.resumeUrl,
        socialLinks: settings.socialLinks,
        skills: settings.skills,
        technologies: settings.technologies,
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' }, 
      { status: 500 }
    )
  }
}

// PUT - Update site settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()

    // Find existing settings or create new
    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = await Settings.create({ ...defaultSettings, ...body })
    } else {
      // Update settings
      Object.assign(settings, body)
      await settings.save()
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: settings._id.toString(),
        siteName: settings.siteName,
        ownerName: settings.ownerName,
        title: settings.title,
        bio: settings.bio,
        location: settings.location,
        email: settings.email,
        phone: settings.phone,
        availability: settings.availability,
        profileImage: settings.profileImage,
        resumeUrl: settings.resumeUrl,
        socialLinks: settings.socialLinks,
        skills: settings.skills,
        technologies: settings.technologies,
      }
    })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' }, 
      { status: 500 }
    )
  }
}
