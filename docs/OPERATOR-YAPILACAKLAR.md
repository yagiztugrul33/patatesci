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

## 5. İleride (aciliyeti yok, sırayla)

**a) Mobil imzalama sırları (ihaleal):**
Apple Developer hesabı → sertifika + provisioning profile; Android için
keystore. Bunlar GitHub Secrets'a eklendikten sonra iOS/Android CI
workflow'ları yazılabilir. Şu an `ios/` platformu hiç eklenmemiş
(`npx cap add ios` gerekiyor), Android tarafı hazır ama imzasız.

**b) Hukuki ve mali teyit (patatesci):**
Kural kitabı, sözleşme şablonları ve sigorta/teminat metinleri **taslak
ibaresiyle** yayında. Bir avukat (hal mevzuatına hakim) + mali müşavir teyidi
gerekiyor. Ayrıca `docs/sigorta-ve-teminat.md` içindeki **8 maddelik
DOĞRULANAMADI listesi** bir sigorta brokerine sorulmalı (nakliyat primi,
taşıyıcı sorumluluk limitleri, hammaliye tarifesi).

**c) TİO/R2 yetki belgesi kararı:**
Nakliye pazaryeri geliri (%8 pay) bu belge olmadan **açılmıyor**. Belge ücreti
273.244 ₺ + ÜDY3/ODY3 istihdam şartı. Karar verilene kadar model koşullu satır
olarak duruyor.

**d) OmniRoute kararı:**
`docs/MOTOR-KARARI.md` — önerim **kurulmasın** (tüm LLM trafiği tek geçitten
akar, sağlayıcı anahtarları tek yerde toplanır). claude-mem yerel modda
kuruldu ve çalışıyor; OmniRoute senin kararını bekliyor.
