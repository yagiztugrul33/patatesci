# patatesci — DEMO DURUM (gece vardiyası kapanışı)
Tarih: 5 Ağustos 2026 · Son commit: bf34d4a sonrası (bkz. git log)

## DEMO TAMAMLANDI beyanı — ŞARTLAR SAĞLANDI
- Kapsama: **86 senaryo, boş satır 0** (tests/kapsama.test.mjs TAM)
- Birim testler: ceza 41/41 · finans 11/11 · build 0 hata
- Canlı senkron: patatesci.vercel.app'te bu gecenin rotaları yayında
  (/katalog içerik doğrulamalı 200, /yonetim/hesap 200) → Vercel son
  commit'leri deploy ediyor
- DOĞRULANAMADI listeleri güncel ve dürüst (sigorta-ve-teminat.md 8 madde +
  finansal-model.md: havale PSP kesintisi, gider kalemleri)

## Tamamlanan modüller
Tanıtım sitesi (ton bazlı toptan konumlandırma, logo/marka, SEO) · Canlı
Katalog (hal tam listesi — çeşit/ürün sayısı GÜNLÜK DEĞİŞİR, canlı sayı için
`/api/denetim` → `katalogSayilari`; ilk ölçümde 84, 5 Ağu'da 85 hal çeşidi +
9 borsa çeşidi, damga + dünkü-liste rozeti, sabah
06-08 tazeleme) · kalite bazlı hal-referanslı kolpo bandı (+bayat referans
%20) · Bilyoner fiyat kilidi (snapshot → %3 tazelik kontrolü → çift onay →
ödemeyle mutlak kilit) · istisnasız 1,0 ton · teklif blokesi (%5/%2) ·
teslimat seviyeleri S0-S4 + taahhüt ihlali · Satış Özeti Sözleşmesi (çift
ts-onay) · teslim anı sihirbazı + gizli ayıp 6 saat · itiraz sihirbazı +
hakem akışı · ceza-adalet matrisi + skor/teminat · tartı doğrulama (kantar
ağı/örneklem/yol firesi) · sigorta-teminat katmanları · nakliye API (km
tablosu) · finans motoru + /yonetim/hesap · kural kitabı + 86 senaryo + SSS.

## Bilinçli DEMO-etiketli entegrasyonlar (canlıya Faz 2'de bağlanır)
HKS/künye bildirimi · e-irsaliye/e-fatura/müstahsil · kantar fişi yükleme ·
ödeme kuruluşu (güvence hesabı) tahsilatı · sigorta poliçe kesimi (acente
ortaklığı) · hakem paneli (şimdilik simülasyon butonları) · canlı video ·
kart tahsilat istisnası · nakliye pazaryeri (TİO belgesi ÖNCESİ kapalı).

## Mobil faza devir notları
- Çekirdek modeller (taksonomi, ceza, finans, teslimat, bloke) .mjs saf
  modüller — RN/Expo'ya aynen taşınır; API sözleşmeleri (auth/offers/orders/
  hal-fiyatlari/nakliye) mobilin backend'i olarak kalır (lib/db.js →
  PostgreSQL'e geçiş API'yi değiştirmez).
- Ekran eşleşmesi: teslim sihirbazı + itiraz sihirbazı → mobil kamera
  (konum+saat damgası ZORUNLU, galeriden yükleme yok) — web'de checkbox olan
  her adım mobilde gerçek kamera akışı olur. Katalog → mobil ana ekran.
- Sipariş durum makinesi (odeme_bekliyor → … → tamamlandi + hakem/iptal
  dalları) push bildirimlerinin tetik listesidir.
- Tanıtım sitesindeki mockup ekranları (components/Mockups.jsx) mobil UI'nin
  onaylı tasarım referansıdır.
