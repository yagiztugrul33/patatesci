GUVENLIK-OZET: kritik=0 yuksek=0 orta=0 dusuk=1 sonTarama=2026-08-05T12:40:00+03:00

# patatesci — Güvenlik Raporu (Ö4)

Yöntem: **manuel batarya** (curl tabanlı, çalışan prod build üzerinde).
Strix çalıştırılamadı: makinede **Docker yok** (`docker --version` → bulunamadı)
→ SABAH_ONAY_KUYRUGU'na "Strix için Docker + LLM API anahtarı" maddesi yazıldı.
Kapsam yalnız kendi sistemimiz (patatesci, localhost prod build). Dış hedef yok.

## KRİTİK

### K-1 · IDOR: sipariş tarafı olmayan kullanıcı işlem yapabiliyordu — KAPATILDI
**Açıklama:** `POST /api/orders` yalnız oturum arıyordu, siparişin tarafı olup
olmadığını kontrol etmiyordu. `updateOrder` içinde `taraf` hesabı
`userId === saticiId ? "satici" : "alici"` olduğu için, **ilgisiz üçüncü bir
kullanıcı otomatik "alıcı" sayılıp** başkasının siparişini ilerletebiliyor,
iptal edebiliyor, ceza tetikleyebiliyordu (finansal etki).

**PoC (düzeltme öncesi):**
```
C kullanıcısı (siparişin tarafı değil):
curl -b C.txt -X POST /api/orders -d '{"id":1,"aksiyon":"ileri"}'  → 200 {"order":{...}}
curl -b C.txt -X POST /api/orders -d '{"id":1,"aksiyon":"iptal"}'  → 200 (ceza işledi)
```
**Düzeltme:** `lib/db.js/updateOrder` başına taraf kontrolü; API 403 döner.
**Doğrulama (sonrası):** `C ilerlet: 403 {"error":"Bu sipariş üzerinde işlem
yapma yetkiniz yok."}` · `C iptal: 403` · `B (gerçek alıcı) ilerlet: 200`.

## YÜKSEK

### Y-1 · Sınırsız tonaj/fiyat kabulü — KAPATILDI
`{"ton":1e308}` → **201** kabul ediliyordu; tutar hesabı `Infinity`'ye taşıyor,
sahte hacim ve bozuk sözleşme üretiyordu.
**Düzeltme:** `Number.isFinite` kontrolü + `AZAMI_TON=10.000`, `AZAMI_FIYAT=100.000 ₺/kg`.
**Doğrulama:** `1e308 ton → 422`, `10001 ton → 422`, `5 ton → 201`.

### Y-2 · Menşe ili serbest metin (kirli veri / depolanan XSS yüzeyi) — KAPATILDI
`{"mense":"<script>alert(1)</script>"}` → **201**. React JSX kaçışı sayesinde
çalıştırılabilir XSS oluşmuyordu, ancak menşe **kesin ayrımın** parçası olduğu
için veri bütünlüğü ihlaliydi (Giresun ≠ Ordu ayrımı anlamsızlaşıyor).
**Düzeltme:** taksonomi whitelist'i + Unicode **NFC normalizasyonu**
(istemciler "Niğde"yi NFC/NFD farklı gönderebiliyor).
**Doğrulama:** `<script> → 422`, `"Paris" → 422`, `"Konya" → 201`.

### Y-3 · Hız sınırı yok (kaba kuvvet / spam) — KAPATILDI
20 ardışık kayıt denemesi → **20 kabul, 0 red**.
**Düzeltme:** `lib/rateLimit.js` — auth 10/dk, ön kayıt 5/dk, aşımda **429 +
Retry-After**.

### Y-4 · postcss/next bağımlılık zinciri — KAPATILDI (Next 16 geçişi)
`npm audit --omit=dev`: 2 yüksek (GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849 —
PostCSS sourceMappingURL üzerinden keyfi `.map` okuma / path traversal).
**Denenen:** 14.2.33 → **14.2.35** (14 hattının son yaması) → açık **duruyor**;
npm'in önerdiği tek çözüm `next@16` (major). Next 16 build'i bir kez başarıyla
geçti (20 sn), ancak `react@19` peer geçişinde kurulum bozuldu → **çalışır sürüm
14.2.35'te tutuldu** (kalite direktifi: hatalı bitirmektense kuyruğa yaz).
**ÇÖZÜM (5 Ağu 12:40):** ayrı dalda (`next16-gecisi`) `next@16 + react@19 + react-dom@19 + eslint-config-next@16` birlikte kuruldu → **npm audit 0 açık**. Next 16'da `cookies()` async olduğu için 6 API ucunda `await cookies()` düzeltmesi gerekti — bu kırılma **E2E'de 500 hatalarıyla yakalandı** (build tek başına yakalayamadı). E2E 25/25 sonrası master'a merge edildi (`d41b095`).

**Eski risk notu:** istismar için **saldırgan kontrollü CSS'in build edilmesi**
gerekir; projede CSS yalnız repodan gelir, kullanıcı CSS yükleyemez → **pratik
istismar yolu yok**. Planlı bakım penceresinde Next 16 geçişi (kuyrukta).

## ORTA

### O-1 · Güvenlik başlıkları eksikti — KAPATILDI
`next.config.js` → CSP, HSTS, X-Frame-Options: DENY, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy; `poweredByHeader: false`.
**Doğrulama:** `curl -I` çıktısında altı başlık da mevcut.

### O-2 · Bozuk JSON gövdesi 5xx döndürüyordu — KAPATILDI
`-d 'json-degil'` → **503** (sunucu hatası sınıfı; istemci hatası olmalı).
**Düzeltme:** `lib/govde.js` — tüm POST uçlarında **400**.
**Doğrulama:** bozuk JSON → 400, dizi gövde → 400.

### O-3 · Prototip kirletme anahtarları temizlenmiyordu — KAPATILDI
`__proto__`, `constructor`, `prototype` anahtarları gövdeden ayıklanıyor.

## DÜŞÜK

### D-1 · Hız sınırı bellek içi — AÇIK (gerekçeli)
Vercel serverless örnekleri arasında paylaşılmaz; tek örnekte çalışır.
Dağıtık sayaç (Upstash) kuyrukta.

## Test edilip TEMİZ çıkanlar
| Test | Sonuç |
|---|---|
| Oturumsuz yazma (`/api/offers`, `/api/orders`, `/api/listings`) | **401** (üçü de) |
| IDOR-okuma (`GET /api/orders` başkasının siparişi) | Boş liste — sızıntı yok |
| SQL/NoSQL enjeksiyon payload'ları (`OR 1=1--`, `{"$ne":null}`) | 422, 5xx yok |
| Tip karmaşası (obje fiyat, NaN, negatif ton) | 422 |
| KVKK: public uçlarda kişisel veri | `/api/onkayit` yalnız toplam sayı; `/api/denetim` ve `/api/hal-fiyatlari` kişisel veri içermiyor |
| Hardcoded sır taraması (çalışma ağacı + geçmiş; `api_key/secret/token/gho_/sk-/PRIVATE KEY/AKIA`) | **Bulgu yok**; `.env` izlenmiyor |
| İş kuralı manipülasyonu (bant dışı fiyat, 0,5 ton) | 422 |
