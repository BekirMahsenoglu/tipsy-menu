# Vercel ile Yayınlama (Sipariş + Admin Dahil)

Projeyi **Vercel**'e deploy edip kendi domain'inizden (örn. tipsy.blackravenbar.com) sunabilirsiniz. Sipariş ve admin paneli tam çalışır.

---

## Önemli: Veritabanı

Şu an proje **SQLite** (yerel dosya) kullanıyor. Vercel'in sunucuları **stateless** olduğu için dosya tabanlı SQLite **kalıcı çalışmaz**. Bu yüzden veritabanını **bulut tabanlı** bir servise taşımanız gerekir.

**Seçenekler (ücretsiz katmanı olan):**

| Servis        | Tür     | Not |
|---------------|--------|-----|
| **Neon**      | Postgres | Ücretsiz tier, Vercel ile sık kullanılır. |
| **Vercel Postgres** | Postgres | Vercel panelinden tek tıkla açılır. |
| **PlanetScale** | MySQL  | Ücretsiz tier; şema biraz farklı. |

En az değişiklikle ilerlemek için **Neon** veya **Vercel Postgres** (Postgres) önerilir; Prisma şemanızı Postgres'e çevirirsiniz.

---

## 1. Veritabanı hazırlığı (Neon örneği)

1. [neon.tech](https://neon.tech) → Ücretsiz hesap açın.
2. Yeni bir **Project** oluşturun.
3. **Connection string**'i kopyalayın (örnek: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`).
4. Bu adresi **DATABASE_URL** olarak kullanacaksınız (Vercel'de ortam değişkeni olarak gireceksiniz).

---

## 2. Projeyi Postgres'e uyarlama

Prisma şemasını SQLite'tan Postgres'e çevirin:

**prisma/schema.prisma** içinde:

- `provider = "sqlite"` → `provider = "postgresql"`
- `url = env("DATABASE_URL")` aynı kalır (Neon/Vercel Postgres connection string gelecek).

SQLite'ta olup Postgres'te farklı olan tek şey: **`String` (JSON için)** alanlar aynen kullanılabilir; gerekirse ileride `Json` tipine geçebilirsiniz. Şimdilik `items String` bırakılabilir.

Değişiklik sonrası:

```bash
npx prisma migrate dev --name init
```

veya ilk kez kuruyorsanız:

```bash
npx prisma db push
```

Böylece tablolar Neon'da oluşur. Ardından `npm run init-admin` ile admin kullanıcısını oluşturun (lokalde DATABASE_URL'i Neon connection string yaparak).

---

## 3. Vercel'e deploy

1. [vercel.com](https://vercel.com) → Giriş (GitHub ile önerilir).
2. **Add New** → **Project**.
3. Projenizin **GitHub** (veya Git) repo'sunu bağlayın; Vercel otomatik Next.js olarak algılar.
4. **Environment Variables** bölümüne girin ve ekleyin:
   - `DATABASE_URL` = Neon (veya Vercel Postgres) connection string
   - `NEXTAUTH_URL` = `https://tipsy.blackravenbar.com` (veya Vercel'in verdiği adres, domain'i ekleyince güncellersiniz)
   - `NEXTAUTH_SECRET` = Güçlü rastgele bir anahtar (örn. `openssl rand -base64 32`)
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` = İsterseniz; yoksa lokalde `npm run init-admin` ile oluşturduğunuz kullanıcıyı kullanırsınız.
5. **Deploy** ile ilk yayını yapın.

**İsteğe bağlı:** Production’da migration kullanacaksanız Vercel’de **Build Command**’ı şu yapabilirsiniz: `prisma generate && prisma migrate deploy && next build`. (Ortam değişkeninde `DATABASE_URL` tanımlı olmalı.)

İlk deploy'dan sonra veritabanı boş olacaktır. **Neon** (veya seçtiğiniz DB) üzerinde migration'ları çalıştırdıysanız tablolar hazırdır. Admin kullanıcıyı ya lokalde `DATABASE_URL=neon_url npm run init-admin` ile ya da Vercel'de bir kez çalışacak bir script/route ile oluşturabilirsiniz.

---

## 4. Kendi domain'inizi ekleme (tipsy.blackravenbar.com)

1. Vercel projesinde **Settings** → **Domains**.
2. **Add** → `tipsy.blackravenbar.com` yazın.
3. Vercel size **CNAME** (veya A record) bilgisini gösterir. Örnek:
   - **CNAME** → `cname.vercel-dns.com` (veya projenize özel bir adres).
4. Domain'i aldığınız yerde (GoDaddy, Cloudflare, cPanel DNS vb.):
   - **tipsy.blackravenbar.com** için bir **CNAME** kaydı ekleyin; hedefi Vercel'in söylediği adres yapın (örn. `cname.vercel-dns.com` veya proje adresi).
5. DNS yayılımı 5–30 dakika sürebilir. Vercel panelinde domain yanında onay işareti çıkınca hazır olur.

Bundan sonra **https://tipsy.blackravenbar.com** adresinden projenize erişirsiniz; sipariş ve admin paneli çalışır.

---

## 5. Özet

| Adım | Ne yapıyorsunuz? |
|------|-------------------|
| 1 | Neon (veya Vercel Postgres) ile Postgres veritabanı oluşturup **DATABASE_URL** alıyorsunuz. |
| 2 | Prisma şemasında `provider = "postgresql"` yapıp migration / `db push` çalıştırıyorsunuz. |
| 3 | Vercel'de projeyi repo'dan ekleyip **DATABASE_URL**, **NEXTAUTH_URL**, **NEXTAUTH_SECRET** (ve isteğe bağlı ADMIN_*) tanımlıyorsunuz. |
| 4 | Deploy ediyorsunuz; ardından Domains'e **tipsy.blackravenbar.com** ekleyip DNS'te CNAME'i veriyorsunuz. |

Bu sayede hem Vercel üzerinden hem de kendi domain'inizden sipariş ve admin paneli olan tam projeyi sunabilirsiniz.
