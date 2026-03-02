import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductManager } from '@/components/admin/ProductManager'

export default async function ProductsPage() {
  if (process.env.NEXT_PUBLIC_STATIC_BUILD === 'true') return null

  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h2>
        <p className="text-muted-foreground">
          Ürünleri ekleyin, düzenleyin ve yönetin
        </p>
      </div>

      <ProductManager initialProducts={products} categories={categories} />
    </div>
  )
}
