import { Header } from '@/components/Header'
import { CategoryTabs } from '@/components/CategoryTabs'
import { ProductGrid } from '@/components/ProductGrid'
import { Locale } from '@/lib/i18n'
import staticMenu from '@/data/menu.json'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    locale: Locale
  }>
}

export function generateStaticParams() {
  return [{ locale: 'tr' as const }, { locale: 'en' as const }]
}

async function getCategoriesFromDb() {
  return prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { inStock: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params

  const categories =
    process.env.NEXT_PUBLIC_STATIC_BUILD === 'true'
      ? (staticMenu as { categories: typeof staticMenu.categories }).categories
      : await getCategoriesFromDb()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-foreground">
      <Header locale={locale} />
      <main className="container pb-10 pt-6 sm:pt-10">
        <section className="mb-8 text-center sm:mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
            {locale === 'tr' ? 'Bar Menümüz' : 'Our Bar Menu'}
          </h1>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            {locale === 'tr'
              ? 'İmza kokteyller, seçili viskiler ve atıştırmalıklar ile geceyi keşfedin.'
              : 'Discover signature cocktails, curated whiskies and small bites for your night.'}
          </p>
        </section>

        <CategoryTabs categories={categories} locale={locale} />
      </main>
    </div>
  )
}
