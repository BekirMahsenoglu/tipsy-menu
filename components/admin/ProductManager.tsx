'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ProductDialog } from './ProductDialog'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils'

interface Category {
  id: string
  nameTr: string
  nameEn: string
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
  category: Category
}

interface ProductManagerProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProducts = products.filter(
    (product) =>
      product.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert('Ürün silinirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    router.refresh()
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleToggleStock = async (id: string, currentStock: boolean) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStock }),
      })

      if (response.ok) {
        router.refresh()
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, inStock: !currentStock } : p
          )
        )
      } else {
        alert('Stok durumu güncellenirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleCreate}>Yeni Ürün Ekle</Button>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{product.nameTr}</CardTitle>
                    {!product.inStock && (
                      <span className="rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
                        Tükendi
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {product.price.toFixed(2)} ₺
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Kategori: {product.category.nameTr}
                  </p>
                </div>
                {product.imageUrl && (
                  <div className="relative h-24 w-24 overflow-hidden rounded-md">
                    <Image
                      src={getImageSrc(product.imageUrl)}
                      alt={product.nameTr}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  Düzenle
                </Button>
                <Button
                  variant={product.inStock ? 'secondary' : 'default'}
                  size="sm"
                  onClick={() => handleToggleStock(product.id, product.inStock)}
                >
                  {product.inStock ? 'Stokta Yok' : 'Stokta Var'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">
            {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz ürün eklenmemiş.'}
          </p>
        </div>
      )}

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={editingProduct ? { ...editingProduct, categoryId: editingProduct.category.id } : null}
        categories={categories}
        onSave={handleSave}
      />
    </div>
  )
}
