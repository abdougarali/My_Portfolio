import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Message from '@/lib/models/Message'
import { sendContactNotification, sendAutoReply, isEmailConfigured } from '@/lib/email'

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required: name, email, subject, message' }, 
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' }, 
        { status: 400 }
      )
    }

    // Basic spam protection - check for common spam patterns
    const spamPatterns = [
      /\b(viagra|casino|lottery|winner|bitcoin|crypto|investment)\b/i,
      /(http|https):\/\/[^\s]+/g, // Contains URLs
    ]
    
    const combinedText = `${name} ${subject} ${message}`
    const isSpam = spamPatterns.some(pattern => pattern.test(combinedText))
    
    if (isSpam) {
      // Silently reject spam but return success to not reveal detection
      console.log('🚫 Spam message detected and blocked')
      return NextResponse.json({ 
        success: true, 
        message: 'Your message has been sent successfully!',
      })
    }

    // Save message to database
    const newMessage = await Message.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      read: false,
      replied: false,
    })

    console.log('✅ Message saved to database:', newMessage._id)

    // Send email notifications (non-blocking)
    if (isEmailConfigured()) {
      // Run email sending in parallel, don't wait for them
      Promise.all([
        sendContactNotification({ name, email, subject, message }),
        sendAutoReply(email, name),
      ]).catch(error => {
        console.error('Error sending emails:', error)
      })
    } else {
      console.log('ℹ️ Email not configured. Skipping notifications.')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent successfully! I will get back to you soon.',
      data: {
        id: newMessage._id.toString(),
      }
    })
  } catch (error: any) {
    console.error('Error saving message:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' }, 
      { status: 500 }
    )
  }
}
