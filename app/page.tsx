'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { defaultLocale } from '@/lib/i18n'

export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/${defaultLocale}`)
  }, [router])
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
      Yönlendiriliyor…
    </div>
  )
}
