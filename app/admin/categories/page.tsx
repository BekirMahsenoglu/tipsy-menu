import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategoryManager } from '@/components/admin/CategoryManager'

export default async function CategoriesPage() {
  if (process.env.NEXT_PUBLIC_STATIC_BUILD === 'true') return null

  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kategori Yönetimi</h2>
        <p className="text-muted-foreground">
          Kategorileri ekleyin, düzenleyin ve sıralayın
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  )
}
