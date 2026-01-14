import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/lib/models/Project'
import Message from '@/lib/models/Message'

// GET - Fetch dashboard stats (Admin only)
export async function GET() {
  try {
    await dbConnect()
    
    // Get counts
    const [
      totalProjects,
      featuredProjects,
      totalMessages,
      unreadMessages,
      recentProjects,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Project.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title slug category createdAt')
        .lean(),
      Message.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email subject read createdAt')
        .lean(),
    ])

    // Get projects by category
    const projectsByCategory = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    return NextResponse.json({ 
      success: true, 
      data: {
        stats: {
          totalProjects,
          featuredProjects,
          totalMessages,
          unreadMessages,
        },
        projectsByCategory: projectsByCategory.map(cat => ({
          category: cat._id,
          count: cat.count,
        })),
        recentProjects: recentProjects.map(p => ({
          id: p._id.toString(),
          title: p.title,
          slug: p.slug,
          category: p.category,
          createdAt: p.createdAt,
        })),
        recentMessages: recentMessages.map(m => ({
          id: m._id.toString(),
          name: m.name,
          email: m.email,
          subject: m.subject,
          read: m.read,
          createdAt: m.createdAt,
        })),
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' }, 
      { status: 500 }
    )
  }
}
