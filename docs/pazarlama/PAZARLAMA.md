# patatesci — Büyüme/Pazarlama Paketi

> 2026-08-06 · Bütçe rakamları TEMSİLİ; reklam harcaması operatör kararı
> (OPERATOR-YAPILACAKLAR bloğu). Görseller: `docs/pazarlama/gorsel/*.svg`
> (1080×1080, marka dili: açık zemin + yeşil/amber; emoji yok).

## 1) Kanal ve lansman sırası

| Sıra | Kanal | Neden önce |
|---|---|---|
| 1 | Saha (Polatlı pilotu — bkz. docs/PITCH.md §8) | ilk 10+10 kullanıcı reklamla değil yüz yüze gelir |
| 2 | Facebook/Instagram (üretici tarafı) | üretici yaş profili FB'de; il/ilçe hedefleme güçlü |
| 3 | Google Arama (alıcı tarafı) | "toptan patates", "hal fiyatları" niyetli trafik |
| 4 | LinkedIn (ihracatçı/sanayici) | kurumsal alıcı; düşük hacim, yüksek tutar |

Reklam ancak PİLOT İLK İŞLEMİ tamamlandıktan sonra açılır — boş pazaryerine
trafik satın alınmaz (iki taraflı pazar kuralı).

## 2) Reklam metinleri

**Üretici (FB/IG, görsel: gorsel/uretici.svg)**
- Başlık: "Hasadını tarladan sat, paran teslim günü hesabında."
- Metin: "Komisyoncu yok, vade yok, çek yok. İlanını koy, teklifler gelsin;
  ödeme teslim onayında doğrudan hesabına. Ön kayıt ücretsiz."
- CTA: "Ön kayıt bırak" → patatesci.vercel.app/#onkayit
- Hedefleme: 30-65 yaş, il: Ankara/Konya/Niğde/Nevşehir, ilgi: tarım,
  çiftçilik, traktör; davranış: sayfa yöneticileri hariç.

**Toptan alıcı (Google Arama, görsel: gorsel/alici.svg)**
- Anahtar kelimeler: "toptan patates fiyatları", "hal fiyatları ankara",
  "toptan sebze tedarik", "tarladan patates" (+ negatif: "tohum", "cips").
- Başlık 1: "Tarladan Toptan Sebze" · Başlık 2: "Hal Fiyatı Değil, Tarla Fiyatı"
- Açıklama: "Malı canlı videoyla görün, güvenceli ödeyin. Damgalı kantar,
  eksik tartıda 2 kat iade. Ankara hal referanslı şeffaf fiyat."

**Güvence mesajı (remarketing, görsel: gorsel/guvence.svg)**
- "Ödemeniz teslim onayına kadar güvence hesabında. Kural kitabı herkese açık."

## 3) Sosyal içerik ritmi (lansman ayı)

Hafta 1-2: rehber içeriklerinin karta dönüşmüş halleri (/rehber/* — 3 adet hazır).
Hafta 3: pilot sahadan gerçek fotoğraf + üretici hikayesi (izinli — açık rıza metni).
Hafta 4: canlı katalog ekran görüntüsü + "bugünkü referans" serisi (günlük).

## 4) E-posta

Şablonlar: `docs/eposta/hosgeldin.html` (ön kayıt anında) ve
`docs/eposta/lansman.html` (bölge açılışında). Gönderim sağlayıcısı önerisi:
Resend (ücretsiz katman 100/gün) — env yuvası: `RESEND_API_KEY` +
`EPOSTA_GONDEREN` (operatör kuracak; kod bağlanışı anahtar geldikten sonra).
KVKK: lansman duyurusu yalnız ön kayıt bırakan adreslere gider (sözleşme
ilişkisi); pazarlama niteliğindeki ek gönderimler İYS kaydı + açık rıza ister.

## 5) Ölçüm

Hedefler (pilot ayı): ön kayıt 200, ilk işlem 10, CAC < 250 ₺ (TEMSİLİ).
Kaynak ölçümü: Plausible UTM (cerezsiz) — env açılınca çalışır.
