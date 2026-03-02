'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { QuickOrderDialog } from './QuickOrderDialog'
import { useCart } from '@/context/CartContext'
import { Locale } from '@/lib/i18n'
import { getImageSrc } from '@/lib/utils'

interface Product {
  id: string
  nameTr: string
  nameEn: string
  descriptionTr: string | null
  descriptionEn: string | null
  price: number
  imageUrl: string | null
  inStock: boolean
}

interface ProductGridProps {
  products: Product[]
  locale: Locale
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  const { addItem } = useCart()
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null)
  if (products.length === 0) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">
          {locale === 'tr' ? 'Bu kategoride ürün bulunmamaktadır.' : 'No products in this category.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group flex h-full flex-col overflow-hidden border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-black/90 shadow-[0_18px_45px_rgba(0,0,0,0.7)] transition-transform transition-shadow hover:-translate-y-1 hover:border-lime-400/60 hover:shadow-[0_25px_60px_rgba(190,242,100,0.25)]"
        >
          {product.imageUrl && (
            <div className="relative h-44 w-full overflow-hidden bg-zinc-900/90">
              <Image
                src={getImageSrc(product.imageUrl)}
                alt={locale === 'tr' ? product.nameTr : product.nameEn}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <CardHeader className="space-y-2 pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-semibold text-zinc-50 sm:text-xl">
                  {locale === 'tr' ? product.nameTr : product.nameEn}
                </CardTitle>
              </div>
              {!product.inStock && (
                <span className="rounded-full bg-red-600/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                  {locale === 'tr' ? 'Tükendi' : 'Out of Stock'}
                </span>
              )}
            </div>
            {(product.descriptionTr || product.descriptionEn) && (
              <CardDescription className="line-clamp-3 text-sm text-zinc-400">
                {locale === 'tr' ? product.descriptionTr : product.descriptionEn}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="mt-auto pt-0">
            <p className="text-right text-xl font-bold tracking-tight text-lime-400 sm:text-2xl">
              {product.price.toFixed(2)} ₺
            </p>
            {product.inStock &&
              process.env.NEXT_PUBLIC_STATIC_BUILD !== 'true' && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 border-zinc-600 text-zinc-200 hover:border-lime-400/60 hover:bg-zinc-800 hover:text-lime-400"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      nameTr: product.nameTr,
                      nameEn: product.nameEn,
                      quantity: 1,
                      unitPrice: product.price,
                    })
                  }
                >
                  {locale === 'tr' ? 'Sepete Ekle' : 'Add to Cart'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 bg-lime-500 text-zinc-950 hover:bg-lime-400"
                  onClick={() => setQuickOrderProduct(product)}
                >
                  {locale === 'tr' ? 'Hemen Sipariş Ver' : 'Order Now'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {quickOrderProduct && (
        <QuickOrderDialog
          open={!!quickOrderProduct}
          onOpenChange={(open) => !open && setQuickOrderProduct(null)}
          product={quickOrderProduct}
          locale={locale}
        />
      )}
    </div>
  )
}
