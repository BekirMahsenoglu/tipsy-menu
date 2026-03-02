'use client'

import Image from 'next/image'
import { LanguageSwitcher } from './LanguageSwitcher'
import { CartLink } from './CartLink'
import { Locale } from '@/lib/i18n'

interface HeaderProps {
  locale: Locale
}

export function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-gradient-to-b from-black via-zinc-950 to-zinc-900/90 backdrop-blur-xl">
      <div className="relative container flex h-24 items-center justify-center px-4">
        {/* Mobilde sepet + dil: daha genis dokunma alani, ustte sabit */}
        <div className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 sm:right-6 sm:gap-2">
          {process.env.NEXT_PUBLIC_STATIC_BUILD !== 'true' && (
            <CartLink locale={locale} />
          )}
          <LanguageSwitcher currentLocale={locale} />
        </div>

        {/* Logo merkezde ve büyük */}
        <div className="relative flex max-w-full flex-col items-center gap-1">
          <div className="relative h-14 w-[230px] sm:h-20 sm:w-[320px] md:h-24 md:w-[380px]">
            <Image
              src="/logo.png"
              alt="Tipsy Monkey Logo"
              fill
              className="object-contain drop-shadow-[0_0_22px_rgba(0,0,0,0.95)]"
              priority
            />
          </div>
          <div className="text-center text-xl font-bold uppercase tracking-[0.35em] text-lime-400 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl md:tracking-[0.4em]">
            Tipsy Monkey
          </div>
        </div>
      </div>
    </header>
  )
}
