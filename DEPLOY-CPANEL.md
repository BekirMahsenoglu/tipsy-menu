# cPanel Node.js App ile Bar Menü Uygulamasını Çalıştırma Rehberi

Bu rehber, projeyi cPanel’deki **Setup Node.js App** (Node.js Uygulaması) ile nasıl çalıştıracağınızı adım adım anlatır.

---

## Ön koşullar

- cPanel hesabı (Node.js desteği açık olan bir hosting)
- SSH erişimi veya cPanel **Terminal** / **Setup Node.js App** arayüzü
- Projeyi sunucuya yüklemiş olmanız (FTP, Git veya cPanel Dosya Yöneticisi)

---

## Adım 1: Projeyi sunucuya yükleyin

1. Bilgisayarınızda projeyi **zip**leyin (veya Git ile sunucuda clone edin).
2. cPanel → **Dosya Yöneticisi** ile giriş yapın.
3. Uygun bir klasöre gidin (örn. `bar-menu` veya `menu`). Genelde `public_html` dışında bir klasör kullanılır; örnek: `/home/kullaniciadi/bar-menu`.
4. Zip’i yükleyip bu klasörde açın. Klasör yapısı kabaca şöyle olmalı:
   ```
   bar-menu/
   ├── app/
   ├── components/
   ├── lib/
   ├── prisma/
   ├── public/
   ├── package.json
   ├── next.config.js
   ├── .env
   └── ...
   ```

---

## Adım 2: .env dosyasını oluşturun

1. cPanel Dosya Yöneticisi’nde proje kökünde (örn. `bar-menu`) **+ Dosya** ile yeni dosya oluşturun.
2. Adını **`.env`** yapın (başındaki noktaya dikkat edin).
3. Düzenleyin ve aşağıdaki satırları ekleyin (değerleri kendinize göre değiştirin):

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="https://siteniz.com"
NEXTAUTH_SECRET="buraya-guclu-rastgele-bir-anahtar-yazin"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="guclu-sifreniz"
```

- **NEXTAUTH_URL**: Sitenizin tam adresi (örn. `https://menu.siteniz.com` veya `https://siteniz.com`). HTTP değil, **HTTPS** kullanın.
- **NEXTAUTH_SECRET**: En az 32 karakter rastgele bir metin (şifre üretici veya `openssl rand -base64 32` ile oluşturabilirsiniz).

---

## Adım 3: cPanel’de Node.js uygulamasını oluşturun

1. cPanel ana sayfasında **Yazılım (Software)** bölümüne gidin.
2. **Setup Node.js App** (veya **Node.js Selector** / **Create Node.js App**) tıklayın.
3. **Create Application** (Uygulama Oluştur) seçin.
4. Alanları şöyle doldurun:

| Alan | Örnek / Açıklama |
|------|-------------------|
| **Node.js version** | 18.x veya 20.x (sunucuda hangisi varsa) |
| **Application root** | Projenin tam yolu, örn. `bar-menu` veya `menu`. Tam path genelde `/home/kullaniciadi/bar-menu` gibi görünür. |
| **Application URL** | Sadece domain kısmı veya boş bırakın (alt alan kullanacaksanız subdomain seçin). |
| **Application startup file** | Boş bırakılabilir; başka bir seçenek yoksa **Run Script** kısmında `npm start` kullanacağız. |

5. **Create** ile uygulamayı oluşturun.

Oluşturduktan sonra ekranda **Application root**, **Port** (örn. 3000 veya atanmış bir port) ve bazen **Script** alanı görünür. Bunları not alın.

---

## Adım 4: Bağımlılıkları yükleyin ve projeyi derleyin

Sunucuda komut çalıştırmak için **cPanel Terminal** veya **SSH** kullanın.

1. cPanel → **Terminal** (veya SSH ile bağlanın).
2. Proje klasörüne gidin:

```bash
cd ~/bar-menu
```

(Klasör adını kendi Application root’unuza göre yazın.)

3. Node.js ortamını etkinleştirin (cPanel’de “Enter to the virtual environment” veya benzeri bir link/komut varsa onu kullanın; yoksa doğrudan devam edin):

```bash
source /home/kullaniciadi/nodevenv/bar-menu/18/bin/activate
```

(Path’i cPanel’in Setup Node.js App sayfasında gösterdiği virtualenv path ile değiştirin. Bazı panellerde bu adım otomatik veya farklı olabilir.)

4. Bağımlılıkları yükleyin:

```bash
npm install
```

5. Prisma client’ı üretin ve veritabanını oluşturun:

```bash
npx prisma generate
npx prisma db push
```

6. Admin kullanıcısını oluşturun:

```bash
npm run init-admin
```

7. Projeyi production için derleyin:

```bash
npm run build
```

Hata alırsanız (örn. bellek), şu komutla deneyin:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## Adım 5: Uygulamayı başlatın

**Setup Node.js App** sayfasında:

1. Oluşturduğunuz uygulamayı seçin.
2. **Run NPM Install** benzeri bir buton varsa bir kez çalıştırın (zaten yaptıysanız atlayın).
3. **Start Application** / **Run** ile uygulamayı başlatın.

Alternatif olarak Terminal’den:

```bash
cd ~/bar-menu
npm start
```

Uygulama genelde **3000** veya cPanel’in atadığı portta çalışır. cPanel arayüzünde bu port numarası yazar.

---

## Adım 6: Domain’i uygulamaya yönlendirin (Reverse Proxy)

Sitenize `https://menu.siteniz.com` veya `https://siteniz.com` ile girildiğinde Node uygulamasına gitmesi için Apache’yi proxy ile kullanmanız gerekir.

1. **Application root** klasöründe (veya domain’in **Document Root**’unda) bir **.htaccess** dosyası oluşturun / düzenleyin.
2. Aşağıdaki kuralları ekleyin (port numarasını cPanel’de gördüğünüz port ile değiştirin):

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

Port **3000** değilse (örn. 38472), `3000` yerine o numarayı yazın.

- Eğer uygulama **alt klasörde** çalışıyorsa (örn. `/bar-menu`), Document Root’u o klasöre ayarlamak veya proxy kuralını buna göre yazmak gerekir. Çoğu cPanel kurulumunda Application root’u doğrudan subdomain veya domain’e bağlarsınız.

3. **Subdomain** kullanıyorsanız (örn. `menu.siteniz.com`): cPanel → **Subdomains** ile subdomain’i oluşturup Document Root’u proje klasörüne (veya .htaccess’in olduğu yere) verin; aynı .htaccess’i orada kullanın.

---

## Adım 7: Ortam değişkenlerini cPanel’den vermek (isteğe bağlı)

**Setup Node.js App** ekranında **Environment Variables** / **Ortam Değişkenleri** alanı varsa şunları ekleyebilirsiniz:

- `NODE_ENV` = `production`
- `DATABASE_URL` = `file:./prisma/dev.db` (veya tam path: `file:/home/kullaniciadi/bar-menu/prisma/dev.db`)
- `NEXTAUTH_URL` = `https://menu.siteniz.com`
- `NEXTAUTH_SECRET` = (güçlü rastgele anahtar)

Zaten `.env` kullandıysanız, Next.js bunları otomatik okur; cPanel’deki alanlar aynı değerleri tekrar tanımlamak için kullanılabilir.

---

## Adım 8: Kontrol listesi

- [ ] Proje dosyaları doğru klasörde (Application root).
- [ ] `.env` dosyası var ve `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL` doğru.
- [ ] `npm install`, `npx prisma generate`, `npx prisma db push`, `npm run init-admin`, `npm run build` hatasız bitti.
- [ ] Setup Node.js App’ten uygulama **Start** edildi.
- [ ] .htaccess ile 127.0.0.1:PORT’a proxy yapıldı.
- [ ] Tarayıcıda `https://siteniz.com` (veya subdomain) açılıyor; menü ve admin paneli çalışıyor.

---

## Sık karşılaşılan sorunlar

**1. “Application failed to start” / uygulama başlamıyor**  
- Terminal’de `npm start` çalıştırıp hata mesajına bakın.  
- `npm run build` tekrar çalıştırın.  
- Port’un başka bir uygulama tarafından kullanılmadığından emin olun.

**2. 502 Bad Gateway**  
- Node uygulaması gerçekten çalışıyor mu kontrol edin (Start Application).  
- .htaccess’teki port numarası, cPanel’deki uygulama portu ile aynı mı kontrol edin.

**3. “Environment variable not found: DATABASE_URL”**  
- `.env` proje kökünde mi (Application root ile aynı klasör)?  
- `DATABASE_URL="file:./prisma/dev.db"` satırında tırnak ve yol doğru mu?

**4. Admin panele giremiyorum**  
- `npm run init-admin` çalıştırıldı mı?  
- .env’deki `ADMIN_USERNAME` ve `ADMIN_PASSWORD` ile giriş yapıyor musunuz?

**5. Build sırasında bellek hatası**  
- `NODE_OPTIONS=--max-old-space-size=4096 npm run build` deneyin.  
- Hosting’in Node.js / bellek limitlerini kontrol edin.

---

## Özet komutlar (SSH / Terminal)

```bash
cd ~/bar-menu
npm install
npx prisma generate
npx prisma db push
npm run init-admin
npm run build
npm start
```

Uygulama çalıştıktan sonra tarayıcıda sitenizi açıp menüyü ve `/admin` girişini test edin.
