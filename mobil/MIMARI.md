# patatesci mobil — mimari kararı

## Seçilen yol: Capacitor kabuk + canlı uç

Uygulama, native bir WebView kabuğudur ve `https://patatesci.vercel.app`
adresini yükler. Web kodu **kopyalanmaz**, mobil için ayrı bir derleme
yapılmaz. Kabuk yalnızca üç şey içerir: uygulama kimliği/ikonu, açılış
ekranı ve **bağlantı yoksa gösterilen yerel sayfa** (`www/index.html`).

## Neden statik export (`output: 'export'`) seçilmedi

Karar teknik zorunluluktan doğdu, tercihten değil:

1. **Fiyat verisi derleme anında donardı.** Canlı `/api/denetim` ucunun
   kendi çıktısı şunu söylüyor:
   `"halCesit ... günlük değişir ve sabit kabul edilmemelidir"`,
   `sonHalGuncelleme.canli: true`. Statik export, kataloğu APK'nın
   derlendiği günün fiyatlarıyla dondurur — kullanıcı dünkü fiyata bakar.
   Bu, ürünün temel vaadini (şeffaf güncel fiyat) bozar.
2. **`output: 'export'` route handler'ları desteklemez.** Projede
   `/api` altında çalışan uçlar var (`/api/market`, `/api/listings`,
   `/api/orders`, `/api/onkayit`, `/api/denetim`). Export modunda bunlar
   derleme hatası verir; çalışır hale getirmek için `app/api`'yi mobil
   derlemesinden dışlayan koşullu bir yapı gerekirdi.
3. **"Web build/güvenlik/E2E bozulmayacak" kısıtı.** `next.config` içine
   koşullu `output` eklemek, web derlemesiyle aynı dosyayı paylaşan bir
   risk noktası yaratır. Seçilen yolda web tarafında **tek satır bile**
   değişmez — dolayısıyla bozulma ihtimali sıfırdır, kanıt gerektirmez.
4. **Tek bakım noktası.** Sitede yapılan her düzeltme mobil uygulamaya
   anında yansır; APK'yı yeniden yayınlamak gerekmez.

## Bu yolun bilinen bedeli (dürüst kayıt)

- **Çevrimdışı çalışmaz.** Bağlantı yoksa `www/index.html` görünür.
  Ürün zaten canlı fiyat üzerine kurulu olduğu için çevrimdışı mod
  anlamlı değil.
- **App Store 4.2 riski.** Apple, yalnızca web sitesini saran uygulamaları
  reddedebilir ("minimum functionality"). Mağaza başvurusu **kuyrukta**
  olduğu için bu şimdilik engel değil; başvuru gündeme geldiğinde native
  katman (push bildirimi, kamera ile teslim fotoğrafı, konum) eklenerek
  aşılır. Google Play'de bu kural daha esnektir.
- Karar geri alınabilir: `capacitor.config.json` içindeki `server.url`
  kaldırılıp `webDir` gerçek bir statik çıktıya çevrilirse yol değişir.

## Klasör yerleşimi

`mobil/` alt-dizindir, ayrı repo değildir. Gerekçe: GitHub Actions
workflow'unun APK üretebilmesi için aynı repoda olması gerekir. Alt-dizinin
kendi `package.json` ve `node_modules`'i vardır; Next.js derlemesi yalnızca
`app/`, `public/` ve `lib/` okuduğu için web tarafını etkilemez.
