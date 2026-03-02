'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  categoryId: string
  inStock: boolean
}

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  categories: Category[]
  onSave: () => void
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSave,
}: ProductDialogProps) {
  const [nameTr, setNameTr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [descriptionTr, setDescriptionTr] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [inStock, setInStock] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setNameTr(product.nameTr)
      setNameEn(product.nameEn)
      setDescriptionTr(product.descriptionTr || '')
      setDescriptionEn(product.descriptionEn || '')
      setPrice(product.price.toString())
      setCategoryId(product.categoryId)
      setImageUrl(product.imageUrl || '')
      setInStock(product.inStock)
    } else {
      setNameTr('')
      setNameEn('')
      setDescriptionTr('')
      setDescriptionEn('')
      setPrice('')
      setCategoryId(categories[0]?.id || '')
      setImageUrl('')
      setInStock(true)
    }
  }, [product, categories, open])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.url)
      } else {
        alert('Görsel yüklenirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameTr,
          nameEn,
          descriptionTr: descriptionTr || null,
          descriptionEn: descriptionEn || null,
          price: parseFloat(price),
          categoryId,
          imageUrl: imageUrl || null,
          inStock,
        }),
      })

      if (response.ok) {
        onSave()
      } else {
        alert('Ürün kaydedilirken bir hata oluştu.')
      }
    } catch (error) {
      alert('Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </DialogTitle>
            <DialogDescription>
              Ürün bilgilerini girin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nameTr">Ürün Adı (TR)</Label>
              <Input
                id="nameTr"
                value={nameTr}
                onChange={(e) => setNameTr(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameEn">Ürün Adı (EN)</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descriptionTr">Açıklama (TR)</Label>
              <Textarea
                id="descriptionTr"
                value={descriptionTr}
                onChange={(e) => setDescriptionTr(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descriptionEn">Açıklama (EN)</Label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Fiyat (₺)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Kategori</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameTr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Görsel</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
              {imageUrl && (
                <div className="relative h-32 w-32 overflow-hidden rounded-md">
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="inStock">Stokta var</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
