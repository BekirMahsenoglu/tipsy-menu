'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Locale } from '@/lib/i18n'

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (locale: Locale) => {
    const newPath = pathname.replace(/^\/(tr|en)/, '') || '/'
    router.push(`/${locale}${newPath}`)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={currentLocale === 'tr' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLocale('tr')}
      >
        TR
      </Button>
      <Button
        variant={currentLocale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLocale('en')}
      >
        EN
      </Button>
    </div>
  )
}
