'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { ProductGrid } from './ProductGrid'
import { Locale } from '@/lib/i18n'

interface Category {
  id: string
  nameTr: string
  nameEn: string
  order: number
  products: Product[]
}

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

interface CategoryTabsProps {
  categories: Category[]
  locale: Locale
}

export function CategoryTabs({ categories, locale }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  if (categories.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Henüz kategori eklenmemiş.</p>
      </div>
    )
  }

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
      <div className="sticky top-24 z-40 mb-6 bg-gradient-to-b from-black/90 via-black/80 to-transparent pb-3">
        <TabsList className="mx-auto flex h-auto max-w-full justify-start gap-1 overflow-x-auto rounded-full border border-zinc-800/80 bg-zinc-950/70 p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.7)] sm:justify-center">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-all data-[state=active]:bg-lime-400 data-[state=active]:text-zinc-950 data-[state=active]:shadow-[0_0_18px_rgba(190,242,100,0.6)] sm:px-6 sm:text-base"
            >
              {locale === 'tr' ? category.nameTr : category.nameEn}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-0">
          <ProductGrid products={category.products} locale={locale} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
