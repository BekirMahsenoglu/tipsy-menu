import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Vercel Blob private URL ise proxy uzerinden gosterir; degilse aynen dondurur */
export function getImageSrc(url: string | null | undefined): string {
  if (!url) return ''
  if (url.includes('blob.vercel-storage.com')) {
    return `/api/blob?url=${encodeURIComponent(url)}`
  }
  return url
}
