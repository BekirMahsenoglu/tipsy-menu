import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  if (process.env.NEXT_PUBLIC_STATIC_BUILD === 'true') {
    return null
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [categoryCount, productCount, recentProducts] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h2>
        <p className="text-zinc-400">
          Bar menüsü yönetim paneline hoş geldiniz
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader>
            <CardTitle className="text-zinc-100">Kategoriler</CardTitle>
            <CardDescription className="text-zinc-400">Toplam kategori sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lime-400">{categoryCount}</div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader>
            <CardTitle className="text-zinc-100">Ürünler</CardTitle>
            <CardDescription className="text-zinc-400">Toplam ürün sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lime-400">{productCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/80">
        <CardHeader>
          <CardTitle className="text-zinc-100">Son Eklenen Ürünler</CardTitle>
          <CardDescription className="text-zinc-400">En son eklenen 5 ürün</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <p className="text-zinc-500">Henüz ürün eklenmemiş.</p>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950/50 p-3"
                >
                  <div>
                    <p className="font-medium text-zinc-200">{product.nameTr}</p>
                    <p className="text-sm text-zinc-500">
                      {product.category.nameTr}
                    </p>
                  </div>
                  <p className="font-semibold text-lime-400">{product.price.toFixed(2)} ₺</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
