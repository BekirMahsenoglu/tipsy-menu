'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Locale } from '@/lib/i18n'

export function CartLink({ locale }: { locale: Locale }) {
  const { totalCount } = useCart()

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/80 text-zinc-200 transition hover:border-lime-400/60 hover:bg-zinc-800 hover:text-lime-400"
      aria-label={locale === 'tr' ? 'Sepet' : 'Cart'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {totalCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-xs font-bold text-zinc-950">
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </Link>
  )
}
