import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Vercel Blob webpack/undici uyumsuzlugu icin Node.js runtime zorla
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Vercel: dosya sistemi salt okunur; sadece Blob kullanilir
    if (process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN) {
      const token = process.env.BLOB_READ_WRITE_TOKEN
      if (!token) {
        return NextResponse.json(
          { error: 'Resim yukleme icin Vercel Blob storage ekleyin: Proje > Storage > Blob olustur, BLOB_READ_WRITE_TOKEN otomatik eklenir.' },
          { status: 503 }
        )
      }
      const { put } = require('@vercel/blob') as { put: (pathname: string, body: Blob | File | ArrayBuffer | string, options?: { access: 'public' | 'private' }) => Promise<{ url: string }> }
      const blob = await put(filename, file, { access: 'public' })
      return NextResponse.json({ url: blob.url })
    }

    // Lokal: public/uploads klasörüne yaz
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
