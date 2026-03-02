import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.NEXT_PUBLIC_STATIC_BUILD === 'true') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-bold text-white mb-2">Admin Paneli</h1>
          <p className="text-zinc-400">
            Sipariş ve yönetim özellikleri statik yayında çalışmaz. Tam sürüm için sunucuda Node.js ile çalıştırın (DEPLOY-CPANEL.md).
          </p>
        </div>
      </div>
    )
  }

  const user = await getCurrentUser()

  // Allow access to login page without auth
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="container flex h-16 flex-wrap items-center justify-between gap-4 px-4 py-3">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/admin"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="/admin/orders"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Canlı Siparişler
            </a>
            <a
              href="/admin/categories"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Kategoriler
            </a>
            <a
              href="/admin/products"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Ürünler
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{(user as { username?: string }).username}</span>
            <a
              href="/api/auth/signout"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              Çıkış
            </a>
          </div>
        </div>
      </nav>
      <main className="container px-4 py-8">{children}</main>
    </div>
  )
}
