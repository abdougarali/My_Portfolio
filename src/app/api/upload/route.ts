import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, uploadProfileImage, uploadDocument, deleteImage } from '@/lib/cloudinary'

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type = data.get('type') as string || 'project' // 'project', 'profile', or 'document'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type based on upload type
    if (type === 'document' || type === 'resume') {
      // Allow PDF for documents and resumes
      if (!file.type.includes('pdf')) {
        return NextResponse.json(
          { success: false, error: 'Only PDF files are allowed' },
          { status: 400 }
        )
      }
    } else {
      // Validate image file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Only image files are allowed' },
          { status: 400 }
        )
      }
    }

    // Validate file size (max 10MB)
    const maxSize = type === 'document' ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File size must be less than ${type === 'document' ? '10MB' : '5MB'}` },
        { status: 400 }
      )
    }

    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      // Fallback to local storage for development
      console.warn('⚠️ Cloudinary not configured. Using local storage fallback.')
      return await handleLocalUpload(file, type)
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let result

    // Upload based on type
    switch (type) {
      case 'profile':
        result = await uploadProfileImage(buffer)
        break
      case 'document':
      case 'resume':
        result = await uploadDocument(buffer, file.name)
        break
      default:
        result = await uploadImage(buffer)
    }

    return NextResponse.json({ 
      success: true, 
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// DELETE - Remove image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No publicId provided' },
        { status: 400 }
      )
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary not configured' },
        { status: 500 }
      )
    }

    const deleted = await deleteImage(publicId)

    if (deleted) {
      return NextResponse.json({ 
        success: true, 
        message: 'Image deleted successfully' 
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete file' },
      { status: 500 }
    )
  }
}

// Fallback: Local file storage for development
async function handleLocalUpload(file: File, type: string) {
  const { writeFile, mkdir } = await import('fs/promises')
  const { join } = await import('path')

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Determine upload directory
  let subdir = 'projects'
  if (type === 'profile') subdir = 'profile'
  if (type === 'document' || type === 'resume') subdir = 'documents'

  const uploadsDir = join(process.cwd(), 'public', 'images', subdir)
  await mkdir(uploadsDir, { recursive: true })

  // Generate unique filename
  const timestamp = Date.now()
  const fileExtension = file.name.split('.').pop()
  const filename = `${type}-${timestamp}.${fileExtension}`
  const filepath = join(uploadsDir, filename)

  // Write the file
  await writeFile(filepath, buffer)

  // Return the public URL
  const publicUrl = `/images/${subdir}/${filename}`

  return NextResponse.json({ 
    success: true, 
    url: publicUrl,
    filename: filename,
    local: true, // Indicates this was stored locally
  })
}
