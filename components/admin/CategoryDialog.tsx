'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  order: number
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (data: { nameTr: string; nameEn: string; order: number }) => void
  maxOrder: number
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
  maxOrder,
}: CategoryDialogProps) {
  const [nameTr, setNameTr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [order, setOrder] = useState(0)

  useEffect(() => {
    if (category) {
      setNameTr(category.nameTr)
      setNameEn(category.nameEn)
      setOrder(category.order)
    } else {
      setNameTr('')
      setNameEn('')
      setOrder(maxOrder + 1)
    }
  }, [category, maxOrder, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ nameTr, nameEn, order })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {category ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </DialogTitle>
            <DialogDescription>
              Kategori bilgilerini girin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nameTr">Kategori Adı (TR)</Label>
              <Input
                id="nameTr"
                value={nameTr}
                onChange={(e) => setNameTr(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameEn">Kategori Adı (EN)</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Sıra</Label>
              <Input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                min={0}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
