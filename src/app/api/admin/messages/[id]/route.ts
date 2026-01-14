import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Message from '@/lib/models/Message'
import mongoose from 'mongoose'

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id)

// GET - Fetch single message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID' }, 
        { status: 400 }
      )
    }

    const message = await Message.findById(id).lean()

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: message._id.toString(),
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        read: message.read,
        replied: message.replied,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch message' }, 
      { status: 500 }
    )
  }
}

// PUT - Update message (mark as read/replied)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params
    const body = await request.json()

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID' }, 
        { status: 400 }
      )
    }

    // Only allow updating read and replied status
    const updateData: any = {}
    if (typeof body.read === 'boolean') updateData.read = body.read
    if (typeof body.replied === 'boolean') updateData.replied = body.replied

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean()

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, error: 'Message not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: updatedMessage._id.toString(),
        name: updatedMessage.name,
        email: updatedMessage.email,
        subject: updatedMessage.subject,
        message: updatedMessage.message,
        read: updatedMessage.read,
        replied: updatedMessage.replied,
        createdAt: updatedMessage.createdAt,
        updatedAt: updatedMessage.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update message' }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const { id } = params

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid message ID' }, 
        { status: 400 }
      )
    }

    const deletedMessage = await Message.findByIdAndDelete(id).lean()

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, error: 'Message not found' }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message deleted successfully',
      data: {
        id: deletedMessage._id.toString(),
      }
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' }, 
      { status: 500 }
    )
  }
}
