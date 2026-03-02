'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CategoryDialog } from './CategoryDialog'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  nameTr: string
  nameEn: string
  order: number
  _count: {
    products: number
  }
}

interface CategoryManagerProps {
  initialCategories: Category[]
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
        setCategories(categories.filter((c) => c.id !== id))
      } else {
        alert('Kategori silinirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const handleSave = async (data: { nameTr: string; nameEn: string; order: number }) => {
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.refresh()
        setIsDialogOpen(false)
        setEditingCategory(null)
      } else {
        alert('Kategori kaydedilirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>Yeni Kategori Ekle</Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{category.nameTr}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.nameEn}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Sıra: {category.order} | Ürün: {category._count.products}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Sil
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={editingCategory}
        onSave={handleSave}
        maxOrder={categories.length}
      />
    </div>
  )
}
