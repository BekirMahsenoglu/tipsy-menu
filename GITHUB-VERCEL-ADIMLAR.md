# GitHub'a Gönderme ve Vercel'e Yükleme

Proje Git'e commit edildi. Aşağıdaki adımlarla GitHub'a gönderip Vercel'e bağlayabilirsiniz.

---

## 1. GitHub'da yeni depo oluşturma

1. [github.com](https://github.com) → giriş yapın.
2. Sağ üst **+** → **New repository**.
3. **Repository name:** örn. `tipsy-menu` veya `menu`.
4. **Public** seçin.
5. **"Add a README"** veya **".gitignore"** eklemeyin (projede zaten var).
6. **Create repository** tıklayın.

Oluşan sayfada depo adresi görünür, örn:  
`https://github.com/KULLANICI_ADINIZ/tipsy-menu.git`

---

## 2. Projeyi GitHub'a gönderme

Terminalde (VS Code terminal veya PowerShell), proje klasöründe:

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADI.git
git branch -M main
git push -u origin main
```

**KULLANICI_ADINIZ** ve **REPO_ADI** yerine kendi GitHub kullanıcı adınızı ve oluşturduğunuz depo adını yazın.

Örnek:
```bash
git remote add origin https://github.com/bekir/tipsy-menu.git
git branch -M main
git push -u origin main
```

Giriş isterse GitHub kullanıcı adı ve şifre (veya Personal Access Token) kullanın.

---

## 3. Vercel'e yükleme

1. [vercel.com](https://vercel.com) → **Login** → **Continue with GitHub**.
2. **Add New** → **Project**.
3. **Import** kısmında az önce push ettiğiniz depoyu (örn. `tipsy-menu`) seçin → **Import**.
4. **Configure Project** ekranında:
   - **Framework Preset:** Next.js (otomatik seçili olabilir).
   - **Root Directory:** boş bırakın.
   - **Environment Variables** bölümüne tıklayıp şunları ekleyin:

   | Name             | Value |
   |------------------|--------|
   | `DATABASE_URL`   | Neon’dan aldığınız Postgres connection string |
   | `NEXTAUTH_URL`   | İlk deploy’da `https://proje-adiniz.vercel.app` (sonra domain ekleyince güncellersiniz) |
   | `NEXTAUTH_SECRET`| Rastgele güçlü anahtar (PowerShell’de: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])`) |

5. **Deploy** tıklayın.

**Önemli:** Vercel’de çalışması için veritabanı **Postgres** olmalı (Neon ücretsiz).  
Şema değişikliği için **VERCEL-YUKLEME.md** dosyasındaki “Projeyi Postgres’e geçirme” adımlarını uygulayın (veya `prisma/schema.postgres.prisma` içeriğini `prisma/schema.prisma` yapıp lokalde `npx prisma db push` + `npm run init-admin` çalıştırın).

---

## 4. Deploy sonrası

- Site adresi: `https://proje-adiniz.vercel.app`
- Kendi domain’inizi eklemek için: Vercel projesinde **Settings** → **Domains** → **Add** (örn. tipsy.blackravenbar.com).

Detaylı Vercel ve domain adımları: **VERCEL-YUKLEME.md**
