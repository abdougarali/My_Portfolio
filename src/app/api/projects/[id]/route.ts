import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/lib/models/Project'
import mongoose from 'mongoose'

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id)

// GET - Fetch single project by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params
    let project

    // Try to find by ObjectId first, then by slug
    if (isValidObjectId(id)) {
      project = await Project.findById(id).lean()
    }
    
    if (!project) {
      project = await Project.findOne({ slug: id }).lean()
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: {
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
      }
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' }, 
      { status: 500 }
    )
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params
    const projectData = await request.json()

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' }, 
        { status: 400 }
      )
    }

    // Check if project exists
    const existingProject = await Project.findById(id)
    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' }, 
        { status: 404 }
      )
    }

    // If title is being changed, update slug
    let updateData = { ...projectData }
    if (projectData.title && projectData.title !== existingProject.title) {
      updateData.slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      // Check if new slug already exists (for a different project)
      const slugExists = await Project.findOne({ 
        slug: updateData.slug, 
        _id: { $ne: id } 
      })
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A project with this title already exists' }, 
          { status: 400 }
        )
      }
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Failed to update project' }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: updatedProject._id.toString(),
        slug: updatedProject.slug,
        title: updatedProject.title,
        summary: updatedProject.summary,
        content: updatedProject.content,
        date: updatedProject.date,
        category: updatedProject.category,
        featured: updatedProject.featured,
        liveUrl: updatedProject.liveUrl,
        githubUrl: updatedProject.githubUrl,
        image: updatedProject.image,
        stack: updatedProject.stack,
        tags: updatedProject.tags,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt,
      }
    })
  } catch (error: any) {
    console.error('Error updating project:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update project' }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' }, 
        { status: 400 }
      )
    }

    const deletedProject = await Project.findByIdAndDelete(id).lean()

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: deletedProject._id.toString(),
        title: deletedProject.title,
        message: 'Project deleted successfully'
      }
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' }, 
      { status: 500 }
    )
  }
}
