# patatesci — Yatırımcı Sunumu (PITCH)

> TASLAK · 2026-08-06 · Kanıt disiplini: rakamların kaynağı satırında;
> kaynağı olmayan her değer **TEMSİLİ/DOĞRULANAMADI** etiketlidir.
> Canlı demo: https://patatesci.vercel.app · Kural kitabı:
> https://patatesci.vercel.app/hukuki/ticaret-kurallari

## 1) Problem — tarladan tabağa kadar el değiştiren marj

- Türkiye 2025'te ~33,3 milyon ton sebze + ~19,6 milyon ton meyve üretti
  (kaynak: TÜİK 2025 bitkisel üretim istatistikleri —
  [ekonomim.com aktarımı](https://www.ekonomim.com/ekonomi/tuikten-2025-bitkisel-uretim-tahminleri-tahil-sebze-ve-meyve-uretiminde-azalma-bekleniyor-haberi-850873),
  [CNN Türk](https://www.cnnturk.com/ekonomi/turkiye-2025-bitkisel-uretim-rakamlari-aciklandi-2377488)).
- Ürün tarladan işletmeye tipik olarak komisyoncu → hal → toptancı → dağıtıcı
  zincirinden geçer; her halka marj, fire ve zaman ekler. Üretici çek/vade
  riski taşır, alıcı malı görmeden alır. (Zincir yapısı 5957 sayılı Hal
  Kanunu'nun düzenlediği pazardır; halka sayısı ürüne/bölgeye göre değişir —
  ortalama marj yüzdesi için **güvenilir tek kaynak yok → iddia edilmiyor**.)
- Üreticinin iki kronik yarası: **vadeli satış + karşılıksız çek riski** ve
  **fiyatı komisyoncunun kurması.** Alıcının yarası: **kalitesini görmediği
  mala hal fiyatı üstü ödeme.**

## 2) Çözüm — tarladan işletmeye, ton bazlı, güvenceli

patatesci üreticiyi toptan alıcıyla (esnaf, restoran, market, sanayici,
ihracatçı) **doğrudan** buluşturur:

1. Üretici hasat ilanını verir (çeşit, ton, ₺/kg, künye/HKS).
2. Alıcı **tarladan canlı video** ile malı gözüyle görür.
3. Ödeme **peşin tahsil edilir, teslim onayına kadar güvence hesabında** kalır
   (6493 kapsamında lisanslı PSP üzerinden — bkz. docs/ODEME-KARARI.md).
4. Tartı damgalı kantar fişiyle kanıtlanır; eksik tartıda **eksiğin 2 katı**
   otomatik iade (kural kitabı, ceza motoru `lib/ceza.mjs` — 41 birim test).
5. HKS bildirimi, künye, e-irsaliye, müstahsil/e-fatura otomasyonu platformda.

**Fark: kural kitabı koddur.** 86 senaryoluk kapsama tablosu, iki taraflı ceza
matrisi, hakem süreci ve skor sistemi yayında ve herkese açık.

## 3) Pazar

- Toplam üretim tabanı: ~53 milyon ton/yıl yaş meyve-sebze (TÜİK 2025, yukarıda).
- Hedef dikey (Faz 1): depolanabilir sebzeler — patates/soğan/havuç odaklı
  ton bazlı toptan. Patates tek başına yıllık ~6+ milyon ton bandında
  (TÜİK bitkisel üretim; çeşit kırılımı raporda —
  [istatistik.tarimorman.gov.tr](https://istatistik.tarimorman.gov.tr/Sayfa/Detay/2197)).
- Erişilebilir pazar (SAM) hesabı **bilinçli olarak verilmiyor**: hal dışı
  doğrudan ticaret oranına dair güvenilir yayın bulunamadı (DOĞRULANAMADI).
  Yatırımcıya sunulan tek somut taban: **ilk yıl 100.000 ton işlem hacmi
  hedefi** (site metriğiyle tutarlı) = üretimin on binde ~2'si.

## 4) İş modeli ve gelir (motor: lib/finans.mjs — /yonetim/hesap canlıda)

| Gelir kalemi | Değer | Not |
|---|---|---|
| Komisyon | **%3 (satıcıdan)** | kural kitabı B5 |
| Belge/uyum bedeli | 250 ₺/işlem (alıcıdan) | Faz 1 sabit; Faz 2 kademeli 250/400/600 ₺ |
| Onaylı Üye | 500 ₺ tek seferlik | KYC/künye doğrulama karşılığı |
| Teslimat hizmet marjı | %10 | S2–S4 seçilirse |
| Nakliye pazaryeri (%8) | **KAPALI** | TİO yetki belgesi (273.244 ₺) alınana dek — mevzuat gereği |

**Birim ekonomisi (baz işlem: 5 ton × 39 ₺/kg = 195.000 ₺, havale):**
işlem başına net ≈ **3.540 ₺ ≈ 0,71 ₺/kg** (kalemler docs/finansal-model.md;
havale kesintisi %1 TEMSİLİ — PSP teklifi bekleniyor).

**Başabaş: 92 işlem/ay (günde 3,6).** Baz senaryo (günde 6,5 işlem):
**+273 bin ₺/ay.** Kötümser (günde 3 × 1 ton): −243 bin ₺/ay — model küçük
tonajla dönmüyor, bu yüzden asgari işlem 1 ton ve hedef segment 5 ton+.
Sabit gider bandı 300–350 bin ₺/ay (2026 işveren maliyeti 40.875 ₺
kaynaklı — ÇSGB; kalem dağılımı temsili).

## 5) Rakip farkı

| | Hal/komisyoncu düzeni | İlan siteleri (sahibinden vb.) | patatesci |
|---|---|---|---|
| Fiyat oluşumu | kapalı, aracı kurar | pazarlık, referanssız | Ankara Hal referanslı şeffaf bant (±%15, kalite katsayılı) |
| Ödeme güvenliği | çek/vade riski | yok | peşin + güvence hesabı, teslim onayında aktarım |
| Kalite kanıtı | yerinde görme | foto | tarladan canlı video + damgalı kantar + hakem |
| Belge/uyum | manuel | yok | HKS/künye/e-irsaliye/müstahsil otomasyonu |
| Yaptırım | ilişkisel | yok | kodlanmış iki taraflı ceza matrisi + skor |

## 6) Ürün durumu (bugün, kanıtlı)

- Web tanıtım + çalışan demo **canlı**: borsa, pazar, sipariş makinesi,
  ceza motoru, sigorta/teminat akışı, ödeme izi (demo PSP katmanı).
- Test bataryası: **41+11+19 birim, 86 senaryo kapsama TAM, e2e 28/28** —
  dış denetim ucu: https://patatesci.vercel.app/api/denetim
- Mobil: Capacitor kabuğu hazır; imzasız debug APK workflow'u operatör
  onayı bekliyor. Kardeş dikey (ihaleal.com) aynı fabrika düzeniyle canlı.

## 7) Yol haritası

| Faz | Kapsam | Eşik |
|---|---|---|
| 0 (şimdi) | Tanıtım + demo + ön kayıt | canlı |
| 1 | Ankara pilotu: gerçek PSP + 10 üretici / 10 alıcı | PSP sözleşmesi + şirket |
| 2 | Belge otomasyonunun gerçek entegrasyonları (HKS/e-irsaliye/e-fatura), kademeli hizmet bedeli | pilot 100 işlem |
| 3 | Bölge genişlemesi (Konya-Niğde-Nevşehir hattı), Pro abonelikler | aylık ≥500 işlem |
| 4 | Nakliye pazaryeri (TİO belgesi alınırsa) + kapıya teslimat | yasal onay |

## 8) Pilot planı — Ankara + Polatlı (patates)

**Neden Polatlı:** Ankara'nın tahıl-sebze üssü; patates/soğan üretim bölgesi;
merkeze ~80 km (nakliye motoru km tablosunda mevcut, 5 t ≈ 2.248 ₺).

**İlk 10 üretici nasıl bulunur:**
1. Polatlı Ziraat Odası + ilçe tarım müdürlüğü ziyareti (ÇKS kayıtlı
   patates üreticisi listesi üzerinden randevu).
2. Polatlı hal komisyoncularına DEĞİL, doğrudan köy kahvesi turu: Karayavşan,
   Şıhali, Yenimehmetli hattı (patates ekim alanları — saha teyidi gerek).
3. "İlk 3 işlemde komisyon %0" kampanyası + Onaylı Üye ücretinin pilotta
   alınmaması.

**İlk 10 alıcı nasıl bulunur:**
1. Ankara Hali çevresindeki sebze-meyve toptancıları (fiyat farkını en iyi
   onlar bilir) — 20 kapı ziyareti hedefi.
2. Zincir olmayan 5+ şubeli yerel marketler (Altunbilekler tipi) satın alma
   birimleri.
3. Büyük restoran/lokanta mutfakları + patates işleyen sanayiciler (cips,
   közleme) — Ankara OSTİM/Sincan gıda imalatçıları.

**İlk işlem senaryosu (uçtan uca prova):**
Polatlı'dan 5 ton 1. sınıf patates → canlı video ile Ankara'daki toptancıya →
havale ile güvenceye tahsilat → üretici plakalı araçla sevk → varış kantarı →
teslim onayı → aynı gün üreticiye ödeme. Hedef süre: ilan→para 48 saat.
Başarı ölçütü: iki taraf da ikinci işlemi kendiliğinden açıyor mu?

**Pilot bütçesi:** saha 2 kişi × 2 ay + kampanya ≈ 250–350 bin ₺ (TEMSİLİ;
finansal modeldeki pazarlama kalemiyle uyumlu).

## 9) Ekip / durum

Kurucu-operatör + yapay zeka ajan fabrikası (bu repo düzeni): üç kapılı
doğrulama (soğuk klon build, canlı curl kanıtı, dış denetim ucu), push
disiplini, kanıtsız iddia yasağı. İnsan istihdamı Faz 1 ile başlar
(finansal modeldeki 4 kişilik çekirdek).

## 10) Talep (yatırım turu için taslak)

Rakam **bilinçli boş** — tur büyüklüğü ve değerleme operatör kararıdır.
Kullanım planı şablonu: 12 aylık sabit gider (≈4,2 milyon ₺, temsili bant) +
pilot bütçesi + TİO belgesi opsiyonu (273.244 ₺) + 500 bin ₺ işletme rezervi
(stres testi gereği).

---
*Bu doküman docs/finansal-model.md, docs/seffaf-ticaret-kurallari.md,
docs/ODEME-KARARI.md ve docs/sigorta-ve-teminat.md'den derlenmiştir;
çelişki halinde kaynak dokümanlar esastır.*
