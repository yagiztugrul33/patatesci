# patatesci — Finansal Model (v2, gece vardiyası)

> TASLAK. Tek hesap motoru: `lib/finans.mjs` — /yonetim/hesap ve Şeffaf Maliyet
> Dökümü aynı sabitleri kullanır. Kaynaklı/temsili ayrımı zorunludur.

## 1 kg / 1 işlem anatomisi (baz: 5 ton × 39 ₺/kg = 195.000 ₺, havale)

| Kalem | Tutar | Not |
|---|---|---|
| Komisyon (%3, satıcıdan) | +5.850 ₺ | kural kitabı B5 |
| Belge/uyum bedeli (alıcıdan) | +250 ₺ | Faz 1 sabit |
| Teslimat marjı (%10) | +0–800 ₺ | S2-S4 seçilirse |
| Ödeme kesintisi (havale %1) | −1.950 ₺ | **TEMSİLİ — DOĞRULANAMADI** (PSP teklifi alınacak) |
| Ceza/hakem rezervi (%10 brüt) | −610 ₺ | ihtiyat |
| **Net (teslimatsız)** | **≈3.540 ₺** | **net ≈ 0,71 ₺/kg** |

## Kart (POS) neden YASAK — kanıt tablosu
Tek çekim sanal POS piyasa bandı ~%1,95–2,5+ (kaynaklar:
[deltaweb.com.tr karşılaştırma](https://deltaweb.com.tr/blog/sanal-pos-karsilastirmasi-2026-iyzico-paytr-param-craftgate/),
[moyduz.com 2026 oranları](https://www.moyduz.com/blog/sanal-pos-komisyon-oranlari-2026),
[poskomisyon.com](https://poskomisyon.com/)). %2,5 senaryosu:

| Tonaj | Havale net | POS net | Marj erimesi |
|---|---|---|---|
| 1 ton (39 ₺/kg) | 888 ₺ | 303 ₺ | %66 |
| 5 ton | 3.540 ₺ | 615 ₺ | **%83** |
| 10 ton | 6.855 ₺ | 1.005 ₺ | **%85** |

Sonuç: %2,5 POS kesintisi %3 komisyonun neredeyse tamamını yutar → **ton
işlemlerinde kart tahsilatı YASAK varsayımı**; kart yalnız ≤100.000 ₺ perakende
istisnasında (B5) yaşar.

## Sabit giderler — 2026 bandı: 300–350 bin ₺/ay
Dayanak: 2026 asgari ücret brüt 33.030 ₺; **işveren maliyeti teşviksiz
40.874,63 ₺/ay**, imalat dışı teşvikli ~40.214 ₺ (kaynaklar:
[ÇSGB resmi PDF](https://www.csgb.gov.tr/Media/gm2fekds/asgari-%C3%BCcret-2026.pdf),
[Alomaliye](https://www.alomaliye.com/2025/12/23/2026-yili-asgari-ucreti-2026-yili-asgari-ucret-bilgilendirme/),
[PwC](https://www.pwc.com.tr/tr/medya/kose-yazilari/celal-ozcan/2026-yili-asgari-ucreti-ve-sektorlere-gore-isveren-maliyeti.html)).
Not: operatör brifingindeki "~38.800 ₺" değeri 2026 için eskimiş — güncel
teşviksiz rakam 40.875 ₺ olarak kullanıldı.

| Kalem | Aylık (₺) | Not |
|---|---|---|
| 4 kişilik çekirdek ekip (asgari üstü karma) | 200.000–230.000 | 40.875 taban × çarpanlar — TEMSİLİ dağılım |
| Muhasebe + hukuk danışmanlığı | 30.000–40.000 | TEMSİLİ (teklif alınacak) |
| Sunucu/altyapı (Vercel+Upstash+izleme) | 5.000–10.000 | TEMSİLİ |
| Pazarlama (pilot saha + dijital) | 50.000–60.000 | TEMSİLİ |
| Ofis/genel | 15.000–20.000 | TEMSİLİ |
| **Toplam** | **300.000–350.000** | motor varsayılanı 325.000 |

## Başabaş (motor çıktısı)
- Baz işlem (5 t × 39 ₺, havale, teslimatsız) net 3.540 ₺ →
  **başabaş 92 işlem/ay = günde 3,6 işlem (460 ton/ay)**.
- Operatör beklentisi günde 6–7 büyük işlem → **motor bunu doğruluyor:**
  6,5 işlem/gün × 26 = 169 işlem → net 598 bin − 325 bin = **+273 bin ₺/ay**.

## Senaryolar
| Senaryo | Varsayım | Aylık sonuç |
|---|---|---|
| Kötümser | günde 3 × 1 t × 30 ₺ (net 735 ₺/işlem), sabit 300k | **−243 bin ₺** — 1 tonluk işlemler tek başına taşımaz |
| Baz | günde 6,5 × 5 t × 39 ₺, sabit 325k | **+273 bin ₺** |
| İyimser | günde 10 × 10 t × 39 ₺ (net 6.855 ₺), sabit 350k | **+1,43 milyon ₺** |

## Stres testi
- **Fiyat çöküşü −%40** (39→23,4 ₺): işlem neti 2.214 ₺ → başabaş 147 işlem/ay
  (günde 5,7) — baz hacimle hâlâ artıda ama tampon incelir.
- **Mevsim dibi** (hacim yarıya, 3,25/gün): 85 işlem × 3.540 = 300k ≈ sabit
  gider — **sıfır noktası**; iyi ayların rezerviyle geçilir (ceza rezervi ayrı).
- İkisi birlikte: zarar ~−140k/ay → 3 aylık dip için ~500k işletme rezervi şartı.

## Kademeli hizmet bedeli önerisi (Faz 2)
1 tonluk işlemin neti 888 ₺ (sabit 250 ile) — öneri: **1–3 t: 250 ₺ · 3–10 t:
400 ₺ · 10 t+: 600 ₺** (motorda `kademeliHizmet` bayrağıyla hesaplı). Büyük
tonajda belge/operasyon yükü de büyür; bedelin tonajla kademelenmesi adildir.

## Gelir katmanları
- **Faz 1:** giriş ücretsiz + **Onaylı Üye 500 ₺** (tek seferlik, KYC/künye
  doğrulama karşılığı) + %3 komisyon + işlem başı hizmet bedeli.
- **Faz 2:** Satıcı Pro / Alıcı Pro abonelikleri — açılış eşiği: aylık ≥500
  aktif işlem; fiyat önerisi: satıcı 750 ₺/ay (vitrin + analitik), alıcı
  1.000 ₺/ay (talep önceliği + rapor). ÖNERİDİR; eşik dolmadan açılmaz.
- **Nakliye pazaryeri (%8 pay): YASAL ONAY ÖNCESİ AÇILMAZ.** TİO bulgusu:
  Taşıma İşleri Organizatörlüğü Yönetmeliği (RG 27.08.2022, 31936 — resmi:
  [UHDGM](https://uhdgm.uab.gov.tr/duyurular/tasima-isleri-organizatorlugu-yonetmeligi-27-agustos-2022-tarih-ve-31936-sayili-resmi-gazete-de-yayimlanmistir),
  [yönetmelik PDF](https://uhdgm.uab.gov.tr/uploads/undefined/tio-yonetmelik.pdf))
  taşıma işi organize eden platformları kapsar; **TİO yetki belgesi ücreti
  273.244 ₺** ve ÜDY3+ODY3 istihdam şartı var (kaynak:
  [Bilecik TSO duyurusu](https://bileciktso.org.tr/B%C4%B0LD%C4%B0R%C4%B0LER/Duyurular/tabid/9049/articleType/ArticleView/articleId/54157/TIO-Tasima-Isleri-Organizatoru-Belgesi-Basvuru-sartlari-ve-K-turu-yetki-belgesi-sahiplerine-uygulanan-indirimler.aspx>).
  Modelde koşullu satır olarak durur; belge maliyeti alınırsa yatırım kalemine eklenir.

## DOĞRULANAMADI (güncel)
- Havale/EFT tahsilatında PSP kesintisi %1 (temsili) — sanal hesap/pay-by-bank
  fiyat teklifi alınacak.
- Ekip/muhasebe/pazarlama kalemlerinin kesin tutarları (aralıklar temsili).
- Önceki listedeki 8 sigorta/tarife maddesi geçerliliğini koruyor
  (docs/sigorta-ve-teminat.md).
