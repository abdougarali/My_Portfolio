import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const filename = searchParams.get('filename') || 'Resume.pdf'

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'No URL provided' },
        { status: 400 }
      )
    }

    // Fetch the file from the URL
    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch file' },
        { status: 500 }
      )
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()

    // Return the file with proper headers
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    })

  } catch (error: any) {
    console.error('Download error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to download file' },
      { status: 500 }
    )
  }
}
