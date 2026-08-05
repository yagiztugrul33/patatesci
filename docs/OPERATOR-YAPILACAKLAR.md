# OPERATÖR YAPILACAKLAR — sıralı

Bunlar **panel/hesap erişimi** gerektirdiği için bende yapılamayan işler.
Sıra önemli: yukarıdakiler aşağıdakilerin önünü açıyor.

---

## 1. Upstash Redis bağla (patatesci) — EN ÖNCELİKLİ

**Nereye tıkla:**
Vercel → **patatesci** projesi → üstteki **Storage** sekmesi → **Create Database**
(veya *Browse Marketplace*) → **Upstash** → **Redis** → **Free** planı seç →
bölge **Frankfurt (eu-central-1)** → **Connect Project** ile patatesci'ye bağla →
sonra **Deployments** sekmesi → en üstteki dağıtım → **⋯ → Redeploy**.

**Neden:**
Şu an ön kayıtlar Vercel'in geçici `/tmp` dizininde tutuluyor — **sunucu
örneği yenilendiğinde siliniyorlar.** Yani formdan gelen e-postalar kalıcı
değil. Aynı zamanda tek açık güvenlik bulgusu (D-1: hız sınırı her sunucu
örneğinde ayrı sayıyor) bu bağlantıyla kapanıyor.

**Kod tarafı hazır:** `lib/onkayitStore.js` env değişkenlerini görür görmez
otomatik Redis'e geçer; tek satır kod değişmeyecek. Bağlantı sonrası env
(`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) kendiliğinden gelir.

**Nasıl doğrularsın:** yayındaki formdan bir test e-postası gönder, sonra aynı
e-postayla tekrar dene — "zaten ön kayıt var" hatası gelirse Redis çalışıyor.

---

### 1-EK. Upstash bağlandıktan sonra Redeploy şart

Env değişkenleri **mevcut dağıtıma geriye dönük uygulanmaz.** Bağladıktan sonra
Vercel → **patatesci** → **Deployments** → en üstteki → **⋯ → Redeploy**.

**Bugün ölçülen durum (2026-08-06):** `/api/onkayit`'a test POST atıldı →
**HTTP 201**, `{"toplam":1}`; aynı e-posta tekrar gönderilince **422 "zaten
ön kayıt var"** döndü. Yani yazma ve tekrar kontrolü **çalışıyor**, ancak
istek öncesi `toplam` **0**'dı — Redis bağlı olsaydı önceki kayıtlar
görünürdü. Sonuç: uç şu an **`/tmp` dosya modunda**; sunucu örneği
yenilendiğinde ön kayıtlar **silinir**.

Kod tarafında yapılacak bir şey yok — `lib/onkayitStore.js` şu satırla
env'i zaten okuyor ve bulduğu anda Redis'e geçer:
`process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL`

---

## 2. Deployment Protection'ı kapat (ihaleal + remaxboss)

**Nereye tıkla (her iki proje için ayrı ayrı):**
Vercel → **ihaleal** → **Settings** → **Deployment Protection** →
*Vercel Authentication* seçeneğini **Disabled** yap (veya **Protection Bypass
for Automation** açıp üretilen token'ı bana ilet).
Aynısını **remax-boss-v2** için tekrarla.

**Neden:**
Her iki projenin staging preview'ı `state: success` ama URL'ler
`302 → vercel.com/sso-api` veriyor — yani **yapılan iş canlıda doğrulanamıyor.**
Üç kapılı doğrulama rejiminin "canlı eşlik" ayağı bu iki projede kanıtsız
kalıyor. Ajanlar hesabına giriş yapmadı (yetkileri yok, doğru davranış).
patatesci'de bu sorun yok — public ve `/api/denetim` açık.

**Not:** Bu ayar yalnız **preview** dağıtımlarını etkiler; production'ı
korumak istiyorsan "Only Preview Deployments" seçeneğini kapatman yeterli.

---

## 3. remaxboss PR'ını incele ve merge et

**Nereye tıkla:**
https://github.com/yagiztugrul33/remax-boss-v2/pull/1 → **Files changed**
sekmesinden gözden geçir → uygun görürsen **Merge pull request**.

**Neden:**
`staging` dalındaki 8 commit master'a alınmayı bekliyor. **Tasarım değişikliği
sıfır** — içerik: `tel:` bağlantılarındaki RFC ihlali (386 örnek düzeltildi,
görünen telefon metni 127 sayfada korundu), SEO `openGraph` kaybı
(`og:site_name` 78 eksik → 0), 3 sayfanın EN metin ayrımı.
Doğrulama: GitHub'dan çekilen temiz klonda build **exit 0**, test **40/40**.

Merge = **canlı siteye çıkar**; bu yüzden karar sende, ben merge etmedim.

---

## 4. Alan adı + Google Search Console (patatesci)

**Nereye tıkla:**
(a) Alan adını al (ör. patatesci.com) → Vercel → **patatesci** → **Settings** →
**Domains** → **Add** → alan adını gir → DNS kayıtlarını sağlayıcında uygula.
(b) https://search.google.com/search-console → **Add property** → alan adını
gir → doğrulama yöntemi olarak **HTML tag** seç → verilen içeriği bana ilet
(ben `app/layout.jsx`'e eklerim) veya DNS TXT kaydıyla doğrula →
**Sitemaps** bölümüne `https://<alanadi>/sitemap.xml` ekle.

**Neden:**
Site şu an `patatesci.vercel.app` üzerinde. Gerçek alan adı gelince
`lib/site.js` içindeki **tek satır** güncellenecek (metadataBase, robots.txt ve
sitemap oradan besleniyor). Search Console olmadan arama görünürlüğü ölçülemez.

---

## 5. Mobil — CI'yi açan tek komut (ENGELLEYİCİ)

**Neyi çalıştır:** Herhangi bir terminalde:

```
gh auth refresh -h github.com -s workflow
```

Tarayıcı açılır, çıkan kodu yapıştırıp onaylarsın. Sonra bana haber ver;
iki repodaki workflow dosyalarını ben push ederim.

**Bu komut denendi ve tarayıcı onayında durdu (2026-08-06).** Komutu
etkileşimsiz çalıştırmayı denedim; GitHub cihaz akışı başlattı ve tarayıcıda
onay bekledi — bu adım tasarımı gereği bir insanın tıklamasını istiyor,
otomatikleştirilemez. **Tek tık yeterli**, ardından iş bende devam eder.

**Neden:**
Mevcut GitHub token'ının yetkileri `gist, read:org, repo` — **`workflow`
yok.** Bu yüzden GitHub, `.github/workflows/` altına dosya ekleyen push'u
reddediyor (`refusing to allow an OAuth App to create or update workflow
... without workflow scope`). Mobil kodun tamamı push edildi, yalnızca
**CI dosyaları bekliyor**:

- `patatesci` → `.github/workflows/mobil-apk.yml` (yerelde hazır, commit'siz)
- `ihaleal` → `.github/workflows/mobil-apk.yml` (yerelde hazır, commit'siz)

Bu yetki verilmeden **APK üretilemez** — dolayısıyla APK artifact linki de
yok. Yetki verildiği anda her iki repoda staging'e push, Actions çalışır ve
APK artifact olarak iner.

**Not:** Bu yetki yalnızca workflow dosyası yazmayı açar; sır (secret)
okuma/yazma yetkisi değildir.

---

## 6. Mobil yayın — mağaza adımları (sırayla)

Bunların hiçbiri şu an gerekli değil; **debug APK bunlarsız üretilir.**
Ancak mağazaya çıkmak istendiğinde sıra budur.

**a) Android imzalı sürüm (önce bu — daha ucuz ve hızlı):**
1. **Google Play Console** hesabı aç: **25 $ tek seferlik**
   (https://play.google.com/console). Kimlik doğrulama 1–2 gün sürebilir.
2. Keystore üret (bu komutu **sen** çalıştır, dosyayı bana verme —
   kaybolursa uygulama bir daha güncellenemez, yedekle):
   ```
   keytool -genkey -v -keystore patatesci-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias patatesci
   ```
3. GitHub → repo → **Settings → Secrets and variables → Actions** →
   şu dört secret'ı ekle: `ANDROID_KEYSTORE_BASE64` (jks dosyasının
   base64'ü), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
   `ANDROID_KEY_PASSWORD`.
4. Bana haber ver: imzalı `bundleRelease` (AAB) workflow'unu yazarım.

**b) iOS (daha uzun, D-U-N-S numarası 4–6 hafta sürebilir):**
1. **Apple Developer Program**: **99 $/yıl**
   (https://developer.apple.com/programs). Şirket hesabı için **D-U-N-S**
   numarası şart; bireysel hesapta gerekmez.
2. Sertifika (Distribution) + provisioning profile üret.
3. GitHub Secrets: `IOS_CERTIFICATE_BASE64`, `IOS_CERTIFICATE_PASSWORD`,
   `IOS_PROVISIONING_PROFILE_BASE64`, `APPSTORE_ISSUER_ID`,
   `APPSTORE_KEY_ID`, `APPSTORE_PRIVATE_KEY`.
4. Bana haber ver: `macos-latest` runner ile iOS workflow'unu yazarım.
   Kod tarafı **hazır** — her iki projede `ios/` platformu eklendi,
   yalnızca `pod install` + imzalama eksik (ikisi de macOS ister).

**c) patatesci için App Store özel riski:**
Uygulama canlı siteyi saran bir kabuk (gerekçesi `mobil/MIMARI.md`).
Apple **Guideline 4.2 (minimum functionality)** ile reddedebilir. Google
Play'de bu kural daha esnek. Çözüm: başvurudan önce native katman
eklemek (push bildirimi, teslim fotoğrafı için kamera, konum). Karar
gerektiğinde alınacak — şimdi iş yapılmadı.

---

## 7. ihaleal logosu — karar senin (marka işi)

**Ne gördüm:** Playwright ile ilk kez ekran görüntüsü alınabildi
(`_dogrulama/ekran/`). Sayfanın tamamı açık-minimal: beyaz zemin, koyu
metin, lacivert yalnızca eylemde. **Tek istisna logo:** sol üstteki
`ihaleal-logo-lockup.png` koyu lacivert zeminli, altın gradyanlı bir blok
ve açık sayfada tek koyu ada olarak duruyor. Mobil menü açıkken de aynı.

**Neden şimdiye kadar görülmedi:** logo bir PNG. Bugüne kadarki denetim
DOM ve hesaplanmış CSS üzerinden yapılıyordu; görselin içindeki renkleri
o yöntem göremez. Görsel kanıt alınabildiği ilk turda ortaya çıktı.

**Neden ben değiştirmedim:** logo bir marka varlığı; yeniden çizmek
tasarım değil kimlik kararıdır. Mobil uygulama ikonu için aynı sembolün
(çatı + kapı) gradyansız, düz lacivert sürümünü zaten ürettim
(`ihaleal/assets/icon.svg`) — web logosu da istenirse aynı dile
çekilebilir. **Tek cümlelik onayın yeterli.**

---

## 8. İleride (aciliyeti yok, sırayla)

**a) Hukuki ve mali teyit (patatesci):**
Kural kitabı, sözleşme şablonları ve sigorta/teminat metinleri **taslak
ibaresiyle** yayında. Bir avukat (hal mevzuatına hakim) + mali müşavir teyidi
gerekiyor. Ayrıca `docs/sigorta-ve-teminat.md` içindeki **8 maddelik
DOĞRULANAMADI listesi** bir sigorta brokerine sorulmalı (nakliyat primi,
taşıyıcı sorumluluk limitleri, hammaliye tarifesi).

**b) TİO/R2 yetki belgesi kararı:**
Nakliye pazaryeri geliri (%8 pay) bu belge olmadan **açılmıyor**. Belge ücreti
273.244 ₺ + ÜDY3/ODY3 istihdam şartı. Karar verilene kadar model koşullu satır
olarak duruyor.

**c) OmniRoute kararı:**
`docs/MOTOR-KARARI.md` — önerim **kurulmasın** (tüm LLM trafiği tek geçitten
akar, sağlayıcı anahtarları tek yerde toplanır). claude-mem yerel modda
kuruldu ve çalışıyor; OmniRoute senin kararını bekliyor.
