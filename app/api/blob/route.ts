import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Private Vercel Blob resimlerini proxy'ler.
 * Menüde product.imageUrl blob URL ise bu route uzerinden gosterilir.
 */
export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url')
  if (!urlParam) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob not configured' }, { status: 503 })
  }

  try {
    const blobUrl = decodeURIComponent(urlParam)
    if (!blobUrl.includes('blob.vercel-storage.com')) {
      return NextResponse.json({ error: 'Invalid blob url' }, { status: 400 })
    }
    const pathname = new URL(blobUrl).pathname.replace(/^\//, '')
    if (!pathname) {
      return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 })
    }

    const { get } = require('@vercel/blob') as {
      get: (pathname: string, opts: { access: 'private' }) => Promise<{
        statusCode: number
        stream: ReadableStream
        blob: { contentType?: string }
      } | null>
    }
    const result = await get(pathname, { access: 'private' })

    if (!result || result.statusCode !== 200) {
      return new NextResponse('Not found', { status: 404 })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('Blob proxy error:', err)
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 })
  }
}
