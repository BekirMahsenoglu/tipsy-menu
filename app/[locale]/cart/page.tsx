'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Locale } from '@/lib/i18n'

export default function CartPage() {
  const params = useParams()
  const locale = (params?.locale as Locale) ?? 'tr'
  const [tableNumber, setTableNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { items, totalPrice, clearCart } = useCart()

  if (process.env.NEXT_PUBLIC_STATIC_BUILD === 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900">
        <Header locale={locale} />
        <main className="container mx-auto max-w-2xl px-4 py-12 text-center">
          <p className="mb-6 text-zinc-400">
            {locale === 'tr'
              ? 'Sipariş özelliği statik yayında kapalıdır. Sipariş için bar personeline ulaşın.'
              : 'Ordering is disabled in static view. Please contact bar staff.'}
          </p>
          <Link href={`/${locale}`}>
            <Button className="bg-lime-500 text-zinc-950 hover:bg-lime-400">
              {locale === 'tr' ? 'Menüye Dön' : 'Back to Menu'}
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tableNumber.trim() || items.length === 0) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: tableNumber.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            nameTr: i.nameTr,
            nameEn: i.nameEn,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        }),
      })
      if (res.ok) {
        clearCart()
        setSuccess(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900">
      <Header locale={locale} />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-100">
          {locale === 'tr' ? 'Sepetim' : 'My Cart'}
        </h1>

        {success && (
          <div className="mb-6 rounded-lg border border-lime-400/50 bg-lime-400/10 p-4 text-center text-lime-400">
            {locale === 'tr'
              ? 'Siparişiniz alındı. Afiyet olsun!'
              : 'Order received. Enjoy!'}
            <div className="mt-4">
              <Link href={`/${locale}`}>
                <Button className="bg-lime-500 text-zinc-950 hover:bg-lime-400">
                  {locale === 'tr' ? 'Anasayfaya Dön' : 'Back to Home'}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {items.length === 0 && !success && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
            <p className="mb-4">
              {locale === 'tr' ? 'Sepetiniz boş.' : 'Your cart is empty.'}
            </p>
            <Link href={`/${locale}`}>
              <Button variant="outline" className="border-zinc-600 text-zinc-300">
                {locale === 'tr' ? 'Menüye Dön' : 'Back to Menu'}
              </Button>
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <>
            <ul className="mb-6 space-y-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3"
                >
                  <span className="font-medium text-zinc-200">
                    {locale === 'tr' ? item.nameTr : item.nameEn} × {item.quantity}
                  </span>
                  <span className="text-lime-400">
                    {(item.quantity * item.unitPrice).toFixed(2)} ₺
                  </span>
                </li>
              ))}
            </ul>
            <p className="mb-6 text-right text-xl font-bold text-lime-400">
              {locale === 'tr' ? 'Toplam' : 'Total'}: {totalPrice.toFixed(2)} ₺
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="table" className="text-zinc-300">
                  {locale === 'tr' ? 'Masa Adı / Numarası' : 'Table Name / Number'}
                </Label>
                <Input
                  id="table"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder={locale === 'tr' ? 'Örn: Masa 5' : 'e.g. Table 5'}
                  className="mt-2 border-zinc-700 bg-zinc-900 text-zinc-100"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-lime-500 text-zinc-950 hover:bg-lime-400"
                >
                  {isSubmitting
                    ? locale === 'tr'
                      ? 'Gönderiliyor...'
                      : 'Sending...'
                    : locale === 'tr'
                      ? 'Siparişi Onayla'
                      : 'Confirm Order'}
                </Button>
                <Link href={`/${locale}`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-600 text-zinc-300"
                  >
                    {locale === 'tr' ? 'Alışverişe Devam' : 'Continue Shopping'}
                  </Button>
                </Link>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  )
}
