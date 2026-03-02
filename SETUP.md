# Kurulum Rehberi

## Hızlı Başlangıç

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Veritabanını Oluşturun

```bash
npx prisma db push
```

### 3. İlk Admin Kullanıcısını Oluşturun

```bash
npm run init-admin
```

Veya manuel olarak:
- `ADMIN_USERNAME=admin ADMIN_PASSWORD=admin123 npm run init-admin`

### 4. Logo Ekleyin

`/public/logo.png` dosyasını ekleyin (önerilen boyut: 240x80px veya benzer oran).

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Docker ile Kurulum

### 1. Ortam Değişkenlerini Ayarlayın

`.env` dosyası oluşturun:

```env
DATABASE_URL=file:./data/dev.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 2. Docker Container'ları Başlatın

```bash
docker-compose up -d --build
```

### 3. Veritabanını Başlatın

```bash
docker-compose exec app npx prisma db push
```

### 4. Admin Kullanıcısını Oluşturun

```bash
docker-compose exec app npm run init-admin
```

### 5. Uygulamaya Erişin

- Müşteri Menüsü: [http://localhost](http://localhost)
- Admin Paneli: [http://localhost/admin](http://localhost/admin)

## Üretim Ortamı

### Nginx Yapılandırması

1. `nginx.conf` dosyasında HTTPS server bloğunun yorumlarını kaldırın
2. SSL sertifikalarınızı `./ssl/` dizinine yerleştirin
3. `server_name` değerini kendi domain'inizle değiştirin
4. `docker-compose.yml` dosyasında port yapılandırmasını güncelleyin

### Güvenlik

- `NEXTAUTH_SECRET` değerini güçlü bir rastgele string ile değiştirin
- Admin şifresini güçlü bir şifre ile değiştirin
- SSL sertifikaları kullanın
- Firewall kurallarını yapılandırın

## Sorun Giderme

### Veritabanı Hatası

Eğer veritabanı hatası alıyorsanız:

```bash
npx prisma db push --force-reset
```

### Logo Görünmüyor

Logo dosyasının `/public/logo.png` konumunda olduğundan emin olun.

### Admin Giriş Yapamıyorum

Admin kullanıcısının oluşturulduğundan emin olun:

```bash
npm run init-admin
```

Veya Prisma Studio ile kontrol edin:

```bash
npm run db:studio
```
