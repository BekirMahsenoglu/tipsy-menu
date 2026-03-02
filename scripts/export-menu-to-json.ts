/**
 * Veritabanındaki kategorileri ve ürünleri data/menu.json dosyasına yazar.
 * Statik build öncesi bir kez çalıştırırsanız, güncel menü statik sitede kullanılır.
 * Kullanım: npx tsx scripts/export-menu-to-json.ts
 */
import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      products: {
        where: { inStock: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  const data = {
    categories: categories.map((c) => ({
      id: c.id,
      nameTr: c.nameTr,
      nameEn: c.nameEn,
      order: c.order,
      products: c.products.map((p) => ({
        id: p.id,
        nameTr: p.nameTr,
        nameEn: p.nameEn,
        descriptionTr: p.descriptionTr,
        descriptionEn: p.descriptionEn,
        price: p.price,
        imageUrl: p.imageUrl,
        inStock: p.inStock,
      })),
    })),
  }

  const path = join(process.cwd(), 'data', 'menu.json')
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
  console.log('data/menu.json güncellendi.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
