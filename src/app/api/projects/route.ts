import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/lib/models/Project'

// GET - Fetch all projects
export async function GET() {
  try {
    await dbConnect()
    
    const projects = await Project.find({})
      .sort({ featured: -1, createdAt: -1 })
      .lean()
    
    // Transform _id to id for frontend compatibility
    const transformedProjects = projects.map((project) => ({
      id: project._id.toString(),
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      content: project.content,
      date: project.date,
      category: project.category,
      featured: project.featured,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      image: project.image,
      stack: project.stack,
      tags: project.tags,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }))
    
    return NextResponse.json({ success: true, data: transformedProjects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' }, 
      { status: 500 }
    )
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const projectData = await request.json()
    
    // Validate required fields
    if (!projectData.title || !projectData.summary || !projectData.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, summary, and content are required' }, 
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = projectData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug })
    if (existingProject) {
      return NextResponse.json(
        { success: false, error: 'A project with this title already exists' }, 
        { status: 400 }
      )
    }

    // Create new project
    const newProject = await Project.create({
      slug,
      title: projectData.title,
      summary: projectData.summary,
      content: projectData.content,
      date: projectData.date || new Date(),
      category: projectData.category || 'Web Development',
      featured: projectData.featured || false,
      liveUrl: projectData.liveUrl,
      githubUrl: projectData.githubUrl,
      image: projectData.image,
      stack: projectData.stack || [],
      tags: projectData.tags || [],
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        id: newProject._id.toString(),
        slug: newProject.slug,
        title: newProject.title,
        summary: newProject.summary,
        content: newProject.content,
        date: newProject.date,
        category: newProject.category,
        featured: newProject.featured,
        liveUrl: newProject.liveUrl,
        githubUrl: newProject.githubUrl,
        image: newProject.image,
        stack: newProject.stack,
        tags: newProject.tags,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
      }
    })
  } catch (error: any) {
    console.error('Error creating project:', error)
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create project' }, 
      { status: 500 }
    )
  }
}
