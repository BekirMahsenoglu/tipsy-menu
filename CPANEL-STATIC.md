# cPanel Statik Yayın (Sadece Menü – Tek Klasör)

Bu rehber, **sadece menüyü** statik dosyalar olarak cPanel’e (örn. `tipsy.blackravenbar.com`) yüklemeniz için hazırlanmıştır. Terminalde sadece **tek bir komut** çalıştırıp çıkan **tek klasörü** sürükleyip bırakmanız yeterlidir.

---

## 1. Statik export nedir?

- **next.config.js** içinde `output: 'export'` kullanıldığında Next.js projeyi **sadece HTML, CSS, JS** dosyalarına çevirir.
- Sunucuda **Node.js çalıştırmanız gerekmez**; sadece bu dosyaları (genelde **`out`** klasörü) cPanel’deki ilgili alan adı klasörüne (örn. `tipsy.blackravenbar.com`) atarsınız.

---

## 2. Sipariş ve admin statik yayında çalışır mı?

**Hayır.** Statik export’ta:

- **Sunucu/API yoktur** → `/api/orders` vb. çalışmaz.
- **Veritabanı yoktur** → Sipariş kaydı, admin girişi, canlı sipariş listesi **çalışmaz**.

Bu yüzden statik yayında:

- **Menü (TR/EN)** → Çalışır (içerik `data/menu.json` dosyasından gelir).
- **Sepete Ekle / Hemen Sipariş Ver** → Görünmez (sipariş özelliği kapalı).
- **Sepet sayfası** → Açılır ama “Sipariş özelliği statik yayında kapalı” mesajı gösterilir.
- **Admin paneli** → “Statik yayında kullanılamaz” mesajı gösterilir.

**Sipariş ve admin istiyorsanız** Node.js ile çalışan tam sürümü kullanmanız gerekir → **DEPLOY-CPANEL.md** (Node.js App ile kurulum).

---

## 3. Tek klasörü hazırlama (tek komut)

Bilgisayarınızda proje klasöründe **tek bir komut** çalıştırın:

```bash
npm run build:static
```

- Bu komut projeyi **statik export** ile derler (API route’lar geçici olarak hariç tutulur, derleme bitince geri gelir).
- Bittiğinde proje kökünde **`out`** klasörü oluşur.

**Yüklemeniz gereken tek klasör:** `out`

- **`out` klasörünün içeriğini** (içindeki tüm dosya ve klasörleri) cPanel’de **tipsy.blackravenbar.com** (veya ilgili alan adı) için ayarladığınız **kök dizine** (genelde `public_html` veya alan adı klasörü) sürükleyip bırakın.
- Yani `out` içindeki `tr`, `en`, `admin`, `_next`, `logo.png` vb. hepsi bu kök dizinin içinde olmalı.

---

## 4. Menü içeriğini değiştirmek

Statik sitede menü **`data/menu.json`** dosyasından okunur.

- **Seçenek A:** Projede `data/menu.json` dosyasını elle düzenleyin.
- **Seçenek B:** Veritabanında güncel menünüz varsa, bir kez `npm run export-menu` çalıştırın; bu komut veritabanındaki kategorileri ve ürünleri `data/menu.json` dosyasına yazar.

Ardından tekrar:

```bash
npm run build:static
```

çalıştırıp yeni çıkan **`out`** klasörünü cPanel’e yüklemeniz gerekir.

---

## 5. Özet

| Ne yapıyorsunuz? | Komut / Klasör |
|------------------|-----------------|
| Statik menü sitesi oluşturmak | `npm run build:static` |
| cPanel’e yüklenecek tek klasör | **`out`** (içeriği ilgili alan adı köküne atın) |
| Sipariş + admin istiyorsanız | **DEPLOY-CPANEL.md** ile Node.js App kurun |

Bu sayede terminalde sadece `npm run build:static` çalıştırıp **`out`** klasörünü cPanel’e sürükleyip bırakmanız yeterli; Node.js veya ekstra sunucu ayarı gerekmez.

---

## Zip yükleyip çıkartamıyorsanız

Zip’i yüklediniz ama cPanel’de **Extract (Çıkart)** çalışmıyor veya hata veriyorsa:

### Zip’i doğru oluşturun

- **`out` klasörünün içine** girin (out’u açın).
- İçindeki **tüm öğeleri** seçin: `tr`, `en`, `admin`, `_next`, `index.html` vb. (**out klasörünü seçmeyin.**)
- Sağ tık → **Sıkıştırılmış klasöre gönder** → İsim: `menu.zip`.
- Böylece zip açıldığında doğrudan `tr`, `en`, `admin` görünür; içinde ekstra bir `out` klasörü olmaz.

### cPanel’de çıkartma

- Zip dosyasına **sağ tık** → **Extract** (veya Extract to…).
- Çıkartma hedefinin **şu an bulunduğunuz klasör** olduğundan emin olun (örn. `public_html` veya `tipsy.blackravenbar.com`). Alt klasöre çıkartmayın.

### Hâlâ çıkartamıyorsanız: Sürükle-bırak

- Zip kullanmayın. Bilgisayarınızda **`out`** klasörünü açın.
- İçindeki **tüm dosya ve klasörleri** seçin (Ctrl+A).
- cPanel Dosya Yöneticisi’nde hedef klasörü açın.
- Seçtiğiniz öğeleri **sürükleyip** cPanel penceresine bırakın. Tarayıcı bunları yükleyecektir (dosya sayısı çoksa birkaç seferde yapabilirsiniz).

### Alternatif: FTP

- FileZilla gibi bir FTP programı kullanın. cPanel’den FTP bilgilerinizi alın.
- Sunucuda `public_html` (veya alan adı klasörünü) açın.
- Bilgisayarınızda **`out`** içeriğini seçip sunucuya sürükleyin. Zip’e gerek kalmaz.
