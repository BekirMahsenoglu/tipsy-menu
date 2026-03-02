# Vercel’e Yükleme — Tam Sürüm (Sipariş + Admin)

Bu dosya, projeyi **Vercel**’e yükleyip **kendi domain’inizden** (örn. tipsy.blackravenbar.com) çalıştırmanız için tek rehberdir.

---

## Vercel’de hangi özellikler açık olur?

Vercel’e **normal şekilde** (statik export olmadan) deploy ettiğinizde aşağıdakilerin hepsi **aktif** olur:

- **Müşteri menüsü:** Kategoriler, ürünler, TR/EN dil
- **Sepet:** Header’da sepet ikonu, sepet sayfası
- **Sepete Ekle** ve **Hemen Sipariş Ver** butonları (ürün kartlarında)
- **Sipariş gönderme:** Masa no + Siparişi Onayla
- **Admin paneli:** Giriş, Dashboard, Canlı Siparişler, Kategoriler, Ürünler, sipariş tamamlama

Yani sunucuya taşımadan önceki **tam sürüm** Vercel’de çalışır. Statik (cPanel) build için kullanılan `BUILD_STATIC=1` Vercel’de **kullanılmaz**.

---

## 1. Veritabanı (zorunlu)

Vercel’de **SQLite** (yerel dosya) çalışmaz. **Postgres** kullanmanız gerekir.

**Neon (ücretsiz):**

1. [neon.tech](https://neon.tech) → hesap açın
2. Yeni **Project** oluşturun
3. **Connection string**’i kopyalayın  
   Örnek: `postgresql://kullanici:sifre@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

Bu adresi **DATABASE_URL** olarak kullanacaksınız.

---

## 2. Projeyi Postgres’e geçirme

**Seçenek A — Hazır şemayı kullanma (önerilen):**

```bash
# prisma/schema.postgres.prisma zaten var; ana şemayı onunla değiştir
copy prisma\schema.postgres.prisma prisma\schema.prisma
# veya Linux/Mac: cp prisma/schema.postgres.prisma prisma/schema.prisma
```

**Seçenek B — Tek satır değiştirme:**

`prisma/schema.prisma` dosyasında:

- `provider = "sqlite"` → `provider = "postgresql"` yapın.

**Sonra tabloları oluşturun:**

```bash
npx prisma db push
```

veya migration kullanacaksanız:

```bash
npx prisma migrate dev --name init
```

**Admin kullanıcıyı oluşturun** (lokalde, Neon connection string ile):

```bash
set DATABASE_URL=postgresql://...   rem Windows
# veya Linux/Mac: export DATABASE_URL="postgresql://..."
npm run init-admin
```

İsterseniz `ADMIN_USERNAME` ve `ADMIN_PASSWORD` ortam değişkeni ile farklı kullanıcı/şifre verebilirsiniz.

---

## 3. Vercel’e deploy

1. [vercel.com](https://vercel.com) → Giriş (GitHub ile pratik).
2. **Add New** → **Project** → Repo’nuzu seçin.
3. **Environment Variables** ekleyin:

   | Değişken         | Değer |
   |------------------|--------|
   | `DATABASE_URL`   | Neon’dan kopyaladığınız connection string |
   | `NEXTAUTH_URL`   | `https://tipsy.blackravenbar.com` (veya Vercel’in verdiği adres) |
   | `NEXTAUTH_SECRET`| Rastgele güçlü anahtar (örn. `openssl rand -base64 32`) |

   İsteğe bağlı: `ADMIN_USERNAME`, `ADMIN_PASSWORD` (init-admin’da kullanılıyorsa).

4. **Deploy**’a tıklayın.

**Not:** Vercel’de `BUILD_STATIC` **tanımlamayın**. Böylece tam sürüm (sipariş, admin, sepet, Hemen Sipariş Ver) otomatik açık kalır.

**İsteğe bağlı — Build Command:**  
Migration kullanıyorsanız Vercel’de **Build Command**’ı şu yapabilirsiniz:

```text
prisma generate && prisma migrate deploy && next build
```

---

## 4. Kendi domain’inizi bağlama

1. Vercel projesinde **Settings** → **Domains** → **Add**.
2. `tipsy.blackravenbar.com` yazın.
3. Vercel’in gösterdiği **CNAME** (veya A) kaydını domain sağlayıcınızda (GoDaddy, Cloudflare, cPanel vb.) ekleyin.
4. Doğrulama bitince site `https://tipsy.blackravenbar.com` üzerinden açılır.

---

## 5. Özet

| Adım | Yapılacak |
|------|------------|
| 1 | Neon’da Postgres oluştur, **DATABASE_URL** al. |
| 2 | `prisma/schema.postgres.prisma` → `schema.prisma` kopyala (veya provider’ı `postgresql` yap). |
| 3 | `npx prisma db push` (veya migrate), sonra lokalde `npm run init-admin`. |
| 4 | Vercel’de projeyi ekle; **DATABASE_URL**, **NEXTAUTH_URL**, **NEXTAUTH_SECRET** tanımla. **BUILD_STATIC ekleme.** |
| 5 | Deploy et; Domains’e kendi domain’i ekleyip DNS’te CNAME’i ver. |

Bu adımlarla Vercel’de **admin paneli**, **siparişler**, **Sepete Ekle**, **Hemen Sipariş Ver** ve **Siparişi Onayla** tam çalışır; sunucuya taşımadan önceki tam sürüm domain’inizden yayında olur.
