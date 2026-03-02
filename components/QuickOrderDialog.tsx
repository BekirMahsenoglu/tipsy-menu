'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Locale } from '@/lib/i18n'

interface Product {
  id: string
  nameTr: string
  nameEn: string
  price: number
}

interface QuickOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  locale: Locale
}

export function QuickOrderDialog({
  open,
  onOpenChange,
  product,
  locale,
}: QuickOrderDialogProps) {
  const [tableNumber, setTableNumber] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!tableNumber.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: tableNumber.trim(),
          items: [
            {
              productId: product.id,
              nameTr: product.nameTr,
              nameEn: product.nameEn,
              quantity: Number(quantity),
              unitPrice: Number(product.price),
            },
          ],
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        onOpenChange(false)
        setTableNumber('')
        setQuantity(1)
      } else {
        setError(
          (data.error as string) ||
            (locale === 'tr' ? 'Sipariş gönderilemedi. Lütfen tekrar deneyin.' : 'Could not send order. Please try again.')
        )
      }
    } catch (err) {
      setError(
        locale === 'tr'
          ? 'Bağlantı hatası. Lütfen tekrar deneyin.'
          : 'Connection error. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const name = locale === 'tr' ? product.nameTr : product.nameEn

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-lime-400">
            {locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {name} — {product.price.toFixed(2)} ₺
          </DialogDescription>
        </DialogHeader>
        <form
          id="quick-order-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <p className="rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          <div>
            <Label htmlFor="quick-table" className="text-zinc-300">
              {locale === 'tr' ? 'Masa Adı / Numarası' : 'Table Name / Number'}
            </Label>
            <Input
              id="quick-table"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder={locale === 'tr' ? 'Örn: Masa 5' : 'e.g. Table 5'}
              className="mt-2 border-zinc-700 bg-zinc-900"
              required
            />
          </div>
          <div>
            <Label htmlFor="quick-qty" className="text-zinc-300">
              {locale === 'tr' ? 'Adet' : 'Quantity'}
            </Label>
            <Input
              id="quick-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="mt-2 border-zinc-700 bg-zinc-900"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-zinc-600 text-zinc-300"
            >
              {locale === 'tr' ? 'İptal' : 'Cancel'}
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault()
                handleSubmit(e as unknown as React.FormEvent)
              }}
              className="bg-lime-500 text-zinc-950 hover:bg-lime-400"
            >
              {isSubmitting
                ? locale === 'tr'
                  ? 'Gönderiliyor...'
                  : 'Sending...'
                : locale === 'tr'
                  ? 'Siparişi Gönder'
                  : 'Send Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
