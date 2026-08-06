# patatesci — Mağaza Metadata Paketi (Play Store / App Store)

> TASLAK · 2026-08-06. Metinler yayına hazır; mağaza hesapları ve imzalama
> operatörde (bkz. IMZA-REHBERI.md + OPERATOR-YAPILACAKLAR.md).

## Kimlik

| Alan | Değer |
|---|---|
| Uygulama adı | **patatesci — Tarladan Toptan** |
| Paket adı (Android) | `com.patatesci.app` (mobil/ Capacitor config ile eşleşmeli — kontrol et) |
| Bundle ID (iOS) | `com.patatesci.app` |
| Kategori (Play) | İş / Business |
| Kategori (App Store) | Business |
| Fiyat | Ücretsiz |
| Yaş sınırı | Herkes (3+) — kullanıcı içeriği: ilanlar → Play'de "Kullanıcı tarafından oluşturulan içerik" beyanı işaretlenecek |

## Kısa açıklama (Play ≤80 karakter)

> Tarladan işletmene ton bazlı toptan sebze-meyve. Güvenceli ödeme, canlı video.

(78 karakter)

## Uzun açıklama (Play ≤4000 / App Store)

patatesci, üreticiyi esnaf, restoran, market, sanayici ve ihracatçıyla
doğrudan buluşturan ton bazlı toptan tedarik platformudur.

ÜRETİCİYSEN
• Hasadını 2 dakikada ilana koy: çeşit, ton, ₺/kg, hasat tarihi, künye.
• Teklifler sana gelsin; kabul ettiğin anda alıcının ödemesi peşin tahsil
  edilir ve güvence hesabına alınır.
• Teslim onaylandığı an para hesabında. Komisyoncu yok, vade yok, çek yok.

TOPTAN ALICIYSAN
• İhtiyacını yaz veya bölge bölge hasat ilanlarını gez.
• Malı tarladan canlı videoyla gör; görmediğin mala ödeme yapma.
• Taşımayı seç, peşin-güvenceli öde; ödemen teslim onayına kadar güvencede.

ŞEFFAF TİCARET SİSTEMİ
• Fiyatlar Ankara Hal referanslı bantta oluşur (kalite katsayılı, ±%15).
• Damgalı kantar fişi zorunlu; eksik tartıda eksiğin 2 katı iade.
• İki taraflı ceza matrisi, 48 saatte gerekçeli hakem kararı, açık kural kitabı.
• HKS bildirimi, künye, e-irsaliye ve müstahsil/e-fatura otomasyonu.

Uygulama önce üretici ve işletmelere açılır; mahalle toplu alımı ve kapıya
teslimat yol haritasındadır. Ön kayıt bırakan, bölgesi açıldığında ilk haberi alır.

## Anahtar kelimeler (App Store ≤100 karakter)

`toptan,sebze,meyve,hal,tarla,üretici,patates,tedarik,çiftçi,pazaryeri,ihracat`

## Bağlantılar

| Alan | URL |
|---|---|
| Gizlilik politikası | https://patatesci.vercel.app/hukuki/kvkk |
| Kullanıcı sözleşmesi | https://patatesci.vercel.app/hukuki/kullanici-sozlesmesi |
| Destek | https://patatesci.vercel.app/hukuki/iletisim |
| Web sitesi | https://patatesci.vercel.app (alan adı gelince güncellenecek) |

## Görseller

- Ekran görüntüleri: `docs/magaza/ekran/01-ana.png … 04-pazar.png`
  (1080×2340, canlı siteden Playwright ile üretildi — mağaza limiti: Play
  2-8 adet; App Store 6.7"/6.5" setleri ayrıca üretilmeli, iPhone çerçeveli).
- Uygulama ikonu: `public/brand/mark.svg` → 512×512 PNG (Play) ve 1024×1024
  PNG (App Store) dışa aktarımı gerekli (SVG→PNG; köşe yuvarlatma mağazaya bırakılır).
- Öne çıkan görsel (Play, 1024×500): brand.md paletiyle üretilecek — KUYRUK.

## Veri güvenliği formu (Play) — beyan taslağı

- Toplanan: e-posta (ön kayıt/hesap), ad, rol, il/ilçe. Konum HAYIR. Reklam kimliği HAYIR.
- Amaç: hesap yönetimi, işlem kaydı. Üçüncü tarafla paylaşım: yok (PSP entegrasyonu gelince güncellenecek).
- Silme talebi: /hukuki/iletisim üzerinden.
