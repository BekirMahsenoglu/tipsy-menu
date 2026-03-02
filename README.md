# Bar Menü ve Yönetim Paneli

Profesyonel bir bar menüsü ve yönetim paneli web uygulaması.

## Özellikler

- 🌐 **Çoklu Dil Desteği**: Türkçe ve İngilizce
- 🎨 **Modern Dark Mode Tasarım**: Lüks ve profesyonel görünüm
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🔐 **Güvenli Admin Paneli**: NextAuth ile kimlik doğrulama
- 📊 **Dashboard**: İstatistikler ve özet bilgiler
- 🗂️ **Kategori Yönetimi**: CRUD işlemleri ve sıralama
- 🍸 **Ürün Yönetimi**: CRUD işlemleri, görsel yükleme ve stok yönetimi
- 🐳 **Docker Desteği**: Kolay dağıtım ve çalıştırma

## Teknolojiler

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** (SQLite)
- **NextAuth.js**
- **Radix UI**

## Kurulum

### Geliştirme Ortamı

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Veritabanını oluşturun:
```bash
npx prisma db push
```

3. İlk admin kullanıcısını oluşturun (scripts/init-admin.ts dosyasını çalıştırın veya manuel olarak):
```bash
npm run db:studio
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcıda açın: [http://localhost:3000](http://localhost:3000)

### Docker ile Çalıştırma

1. `.env` dosyasını oluşturun:
```bash
DATABASE_URL=file:./data/dev.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this
```

2. Docker container'ları oluşturun ve başlatın:
```bash
docker-compose up -d --build
```

3. Veritabanını başlatın (ilk kez):
```bash
docker-compose exec app npx prisma db push
```

4. Uygulama [http://localhost](http://localhost) adresinde çalışacaktır.

### cPanel’de Node.js App ile Çalıştırma

cPanel’deki **Setup Node.js App** ile sunucuya kurulum için adım adım rehber:

**[DEPLOY-CPANEL.md](./DEPLOY-CPANEL.md)** dosyasına bakın.

## Yapılandırma

### Logo

Logo dosyasını `/public/logo.png` konumuna yerleştirin.

### İlk Admin Kullanıcısı

İlk admin kullanıcısını oluşturmak için:

1. Prisma Studio'yu açın:
```bash
npm run db:studio
```

2. User tablosuna yeni bir kayıt ekleyin:
   - `username`: İstediğiniz kullanıcı adı
   - `password`: bcrypt ile hashlenmiş şifre (örnek: `$2a$10$...`)

Veya bir script ile oluşturabilirsiniz (scripts/init-admin.ts).

### Nginx Yapılandırması

SSL sertifikaları kullanmak için:

1. `nginx.conf` dosyasında HTTPS server bloğunun yorumlarını kaldırın
2. SSL sertifikalarınızı `./ssl/` dizinine yerleştirin:
   - `cert.pem`
   - `key.pem`
3. `server_name` değerini kendi domain'inizle değiştirin

## Kullanım

### Müşteri Menüsü

- Ana sayfa: `/tr` veya `/en`
- Kategoriler arasında gezinme
- Ürünleri görüntüleme
- Dil değiştirme

### Admin Paneli

- Giriş: `/admin/login`
- Dashboard: `/admin`
- Kategori Yönetimi: `/admin/categories`
- Ürün Yönetimi: `/admin/products`

## Veritabanı

SQLite veritabanı kullanılmaktadır. Docker ile çalıştırırken veritabanı `./data/dev.db` konumunda saklanır.

## Lisans

Bu proje özel kullanım içindir.
