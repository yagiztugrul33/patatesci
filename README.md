# patatesçi — Tarımsal Ürün Ticaret Platformu

Sebze-meyve toptan ticaretinin dijital altyapısı. Konum bazlı satıcı eşleştirme,
canlı görüntülü ürün doğrulama, peşin ve güvenceli (escrow) ödeme. Üretici kendi
ürününü doğrudan satar. Yasal uyum (künye / Hal Kayıt Sistemi / rüsum / belge)
platforma gömülüdür.

## Çalıştırma

Node.js 18+ gereklidir. Proje klasöründe:

```bash
npm install
npm run dev
```

Ardından tarayıcıda: http://localhost:3000

## Sayfalar
- `/` — Ana sayfa: güvence altyapısı, alıcı segmentleri, SSS, ön kayıt
- `/pazar` — Alıcı akışı: sepet, satıcı eşleşmesi, canlı görüntülü doğrulama, güvenceli ödeme
- `/borsa` — Şeffaf fiyat borsası: PTX Endeksi, emir defteri, piyasa bandı korumalı teklif (gerçek API)
- `/sat` — Satıcı Paneli: üretici/toptancı ürün listeleme (gerçek API) ve mevzuat uyum durumu
- `/giris`, `/siparisler` — hesap ve sipariş takibi
- `/hukuki/*` — KVKK, Kullanıcı Sözleşmesi, Mesafeli Satış Sözleşmesi, İletişim (placeholder)

## Backend (gerçek, çalışır)
Bağımlılıksız dosya tabanlı veri katmanı (`lib/db.js`, `data/store.json`). API route'ları:
- `GET/POST /api/listings` — ilanları listele / yeni ilan ekle (toptancı/manav için künye zorunlu)
- `GET/POST /api/offers` — teklifleri listele / teklif ver. **Piyasa bandı denetimi sunucudadır**:
  teklif, piyasa fiyatının %85–%115 bandında ve en az 10 kg olmalıdır; aksi halde 422 ile reddedilir.
- `GET /api/market` — borsa piyasa referansı
- `POST /api/auth`, `GET /api/me` — kayıt, giriş, oturum
- `GET/POST /api/orders` — sipariş listesi ve durum ilerletme
- `GET/POST /api/onkayit` — ön kayıt (bekleme listesi)

> Üretimde `lib/db.js` yerine PostgreSQL/Prisma kullanılır; API arayüzü değişmez.

## Teknoloji
- Next.js 14 (App Router), React 18, Route Handlers (API)
- El yapımı CSS tasarım sistemi (Tailwind gerektirmez) — beyaz zemin, tek yeşil vurgu, kurumsal nötr tonlar
- Emoji içermeyen, tek renk çizgi stilinde SVG ikon seti (`components/icons.jsx`)

## Sonraki adımlar (yol haritası)
1. Gerçek veritabanı (PostgreSQL + PostGIS konum sorguları)
2. Kimlik doğrulama + KYC/künye doğrulama
3. Ödeme entegrasyonu (iyzico/PayTR) + escrow (alıcı güvencesi)
4. Gerçek harita ve "en yakın satıcı" skor algoritması
5. HKS / e-Fatura entegrasyonu (uyum motoru)
6. WebRTC ile gerçek canlı görüntülü doğrulama
7. Mobil uygulamalar (React Native)

> Not: Hukuki/uyum akışları yol göstericidir; yayına almadan önce hal mevzuatına hakim
> bir hukuk danışmanı ve mali müşavir ile teyit edilmelidir.
