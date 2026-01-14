import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Message from '@/lib/models/Message'

// GET - Fetch all messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const read = searchParams.get('read')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build query
    let query: any = {}
    if (read === 'true') query.read = true
    if (read === 'false') query.read = false

    // Fetch messages with pagination
    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments(query)
    ])

    // Get unread count
    const unreadCount = await Message.countDocuments({ read: false })

    // Transform messages
    const transformedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      read: msg.read,
      replied: msg.replied,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }))

    return NextResponse.json({ 
      success: true, 
      data: transformedMessages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' }, 
      { status: 500 }
    )
  }
}
