# Kurumsal Kuruluş Checklist — patatesci

> TASLAK · 2026-08-06 · Kanıt disiplini: resmî portal linkleri verildi;
> tutar/har&ccedil; gibi değişken kalemler **DOĞRULANAMADI** işaretli (mali
> müşavir güncel tarifeyle teyit edecek). Sıra önemlidir.

## 0. Karar: Limited (Ltd.) mi Anonim (A.Ş.) mi?

| Kriter | Ltd. | A.Ş. |
|---|---|---|
| Asgari sermaye (2024+ rejimi) | 50.000 ₺ | 250.000 ₺ |
| Yatırım turu / hisse devri | devir noter şartlı, ağır | pay devri serbest, yatırımcı standardı |
| Kurucu ortak sorumluluğu | kamu borçlarında müdür sorumluluğu | YK üyeliğiyle sınırlı düzen |
| Ödeme kuruluşu sözleşmeleri | çoğu PSP kabul eder | kurumsal algı daha güçlü |

**Öneri: A.Ş.** — pitch yatırım turu hedefliyor; pay devri esnekliği ve
PSP/banka ilişkilerinde kurumsallık belirleyici. (Asgari sermaye tutarları
7887 sayılı Cumhurbaşkanı Kararı sonrası rejim — güncel teyit: mali müşavir;
DOĞRULANAMADI işareti kaldırılana kadar temsilî kabul et.)

## 1. Kuruluş adımları (sıralı)

1. **Unvan + NACE kodları** — MERSİS üzerinden (https://mersis.ticaret.gov.tr).
   Öneri faaliyet kodları (mali müşavir teyidiyle):
   - 63.12 — Web portalları (ana faaliyet: platform)
   - 46.31 — Sebze ve meyve toptan ticareti (komisyonculuk DEĞİL —
     platformun kendi nam/hesabına satış yapmadığı yapı korunacak; hangi
     kodun HKS kaydıyla uyumlu olduğu AVUKAT sorusu)
   - 82.99 / 74.90 — destekleyici iş hizmetleri
2. **Ana sözleşme + kuruluş** — MERSİS başvuru → ticaret sicili randevu →
   tescil + ilan. Maliyet kalemleri (sicil harcı, noter, rekabet kurumu payı,
   defter tasdiki): **DOĞRULANAMADI — 2026 tarifesiyle mali müşavir çıkaracak.**
3. **Vergi levhası + e-tebligat + KEP adresi** (kep.tr sağlayıcıları).
4. **Banka hesabı + şirket IBAN'ı** (PSP başvurusunun ön şartı).

## 2. Faaliyete özel kayıtlar (platform yayına gerçek işlem almadan ÖNCE)

5. **ETBİS kaydı** — e-ticaret platformları için zorunlu bildirim
   (https://www.eticaret.gov.tr → ETBİS). Aracı hizmet sağlayıcı statüsü
   burada beyan edilir.
6. **VERBİS kaydı** — KVKK veri sorumluları sicili (https://verbis.kvkk.gov.tr).
   Yıllık çalışan/bilanço eşiği altındaysa muafiyet olabilir — eşik kontrolü
   mali müşavirde (DOĞRULANAMADI).
7. **e-Fatura / e-Arşiv + e-Müstahsil** — entegratör seçimi (öneri kriterleri:
   müstahsil makbuzu API'si + hacim fiyatı; adaylar: Logo, Foriba, Uyumsoft —
   fiyat teklifi alınacak, DOĞRULANAMADI). GİB portal kaydı entegratör üzerinden.
8. **HKS (Hal Kayıt Sistemi) kaydı** — 5957 sayılı Kanun rejimi. **Kritik
   AVUKAT sorusu:** platformun HKS'deki statüsü ne olacak (tüccar? komisyoncu?
   sadece bildirim aracısı?) ve bildirim yükümlüsü hangi taraf? Ürün künye
   akışı bu cevaba göre bağlanacak (bkz. AVUKATA-SORULACAKLAR.md).
9. **İYS (İleti Yönetim Sistemi) kaydı** — ticari e-posta/SMS gönderimi öncesi
   (https://iys.org.tr).

## 3. Sonraki faz (gelir kalemlerine bağlı)

10. **PSP sözleşmesi** — OPERATOR-YAPILACAKLAR.md madde 6 (şirket + IBAN şart).
11. **TİO yetki belgesi kararı** — nakliye pazaryeri (%8) açılacaksa: 273.244 ₺
    + ÜDY3/ODY3 istihdam (kaynaklar finansal-model.md'de). Karar bekliyor.
12. **Mağaza hesapları** — Play 25 USD, Apple 99 USD/yıl + D-U-N-S
    (docs/magaza/IMZA-REHBERI.md).
13. **Marka tescili** — "patatesci" kelime + logo, TÜRKPATENT
    (https://www.turkpatent.gov.tr); sınıf önerisi 35/36/39/42 — vekil teyidi.

## Tek bakışta sıra

Şirket (A.Ş.) → banka/IBAN → ETBİS + VERBİS + İYS → e-fatura entegratörü →
HKS statüsü (avukat) → PSP sözleşmesi → gerçek işlem açılışı → mağazalar → marka.
