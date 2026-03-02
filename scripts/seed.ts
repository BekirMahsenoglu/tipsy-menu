import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding bar menu...')

  // Clear existing data
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  await prisma.category.createMany({
    data: [
      { nameTr: 'İmza Kokteyller', nameEn: 'Signature Cocktails', order: 1 },
      { nameTr: 'Klasik Kokteyller', nameEn: 'Classic Cocktails', order: 2 },
      { nameTr: 'Viski', nameEn: 'Whisky', order: 3 },
      { nameTr: 'Bira', nameEn: 'Beer', order: 4 },
      { nameTr: 'Aperatifler', nameEn: 'Aperitifs', order: 5 },
      { nameTr: 'Alkolsüz', nameEn: 'Non‑Alcoholic', order: 6 },
    ],
  })

  const allCategories = await prisma.category.findMany()
  const byNameTr = (name: string) =>
    allCategories.find((c) => c.nameTr === name) as { id: string }

  await prisma.product.createMany({
    data: [
      // İmza Kokteyller
      {
        nameTr: 'Golden Sunset',
        nameEn: 'Golden Sunset',
        descriptionTr: 'Bourbon, portakal likörü, bal şurubu, limon suyu, portakal bitters',
        descriptionEn: 'Bourbon, orange liqueur, honey syrup, lemon juice, orange bitters',
        price: 340,
        categoryId: byNameTr('İmza Kokteyller').id,
        inStock: true,
      },
      {
        nameTr: 'Smoky Negroni',
        nameEn: 'Smoky Negroni',
        descriptionTr: 'İsli viski, campari, tatlı vermut, portakal kabuğu',
        descriptionEn: 'Smoky whisky, campari, sweet vermouth, orange peel',
        price: 360,
        categoryId: byNameTr('İmza Kokteyller').id,
        inStock: true,
      },
      // Klasik Kokteyller
      {
        nameTr: 'Margarita',
        nameEn: 'Margarita',
        descriptionTr: 'Tekila, triple sec, lime suyu, tuz kenarlı bardak',
        descriptionEn: 'Tequila, triple sec, lime juice, salt rim',
        price: 310,
        categoryId: byNameTr('Klasik Kokteyller').id,
        inStock: true,
      },
      {
        nameTr: 'Old Fashioned',
        nameEn: 'Old Fashioned',
        descriptionTr: 'Bourbon, esmer şeker, Angostura bitters, portakal kabuğu',
        descriptionEn: 'Bourbon, brown sugar, Angostura bitters, orange peel',
        price: 330,
        categoryId: byNameTr('Klasik Kokteyller').id,
        inStock: true,
      },
      {
        nameTr: 'Dry Martini',
        nameEn: 'Dry Martini',
        descriptionTr: 'Cin, dry vermut, zeytin veya limon kabuğu',
        descriptionEn: 'Gin, dry vermouth, olive or lemon peel',
        price: 320,
        categoryId: byNameTr('Klasik Kokteyller').id,
        inStock: true,
      },
      // Viski
      {
        nameTr: 'Single Malt 12 Yıl',
        nameEn: 'Single Malt 12 Years',
        descriptionTr: 'İskoç single malt viski, sek veya buzlu servis',
        descriptionEn: 'Scottish single malt whisky, served neat or on the rocks',
        price: 420,
        categoryId: byNameTr('Viski').id,
        inStock: true,
      },
      {
        nameTr: 'Blended Scotch',
        nameEn: 'Blended Scotch',
        descriptionTr: 'Karışım İskoç viskisi, sek / buzlu veya kola ile',
        descriptionEn: 'Blended Scotch whisky, neat / on the rocks or with cola',
        price: 360,
        categoryId: byNameTr('Viski').id,
        inStock: true,
      },
      // Bira
      {
        nameTr: 'Lager Bira Şişe',
        nameEn: 'Bottle Lager Beer',
        descriptionTr: 'Yerel veya ithal lager bira, 33 cl şişe',
        descriptionEn: 'Local or imported lager beer, 33 cl bottle',
        price: 190,
        categoryId: byNameTr('Bira').id,
        inStock: true,
      },
      {
        nameTr: 'Craft IPA',
        nameEn: 'Craft IPA',
        descriptionTr: 'Meyvemsi ve aromatik el yapımı IPA bira',
        descriptionEn: 'Fruity and aromatic craft IPA beer',
        price: 240,
        categoryId: byNameTr('Bira').id,
        inStock: true,
      },
      // Aperatifler
      {
        nameTr: 'Peynir & Şarküteri Tabağı',
        nameEn: 'Cheese & Charcuterie Board',
        descriptionTr: 'Seçili olgun peynirler, şarküteri ürünleri, zeytin ve kuru meyveler',
        descriptionEn: 'Selection of aged cheeses, charcuterie, olives and dried fruits',
        price: 420,
        categoryId: byNameTr('Aperatifler').id,
        inStock: true,
      },
      {
        nameTr: 'Trüf Patates Kızartması',
        nameEn: 'Truffle Fries',
        descriptionTr: 'Trüf yağı, parmesan ve deniz tuzu ile servis edilen çıtır patates',
        descriptionEn: 'Crispy fries with truffle oil, parmesan and sea salt',
        price: 210,
        categoryId: byNameTr('Aperatifler').id,
        inStock: true,
      },
      // Alkolsüz
      {
        nameTr: 'İmza Limonata',
        nameEn: 'Signature Lemonade',
        descriptionTr: 'Taze limon suyu, nane, esmer şeker, soda',
        descriptionEn: 'Fresh lemon juice, mint, brown sugar, soda',
        price: 170,
        categoryId: byNameTr('Alkolsüz').id,
        inStock: true,
      },
      {
        nameTr: 'Berry Cooler',
        nameEn: 'Berry Cooler',
        descriptionTr: 'Yaban mersini, ahududu, nar suyu ve soda',
        descriptionEn: 'Blueberry, raspberry, pomegranate juice and soda',
        price: 185,
        categoryId: byNameTr('Alkolsüz').id,
        inStock: true,
      },
    ],
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

