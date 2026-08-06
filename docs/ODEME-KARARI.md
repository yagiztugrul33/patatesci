# Ödeme Sağlayıcı (PSP) Kararı — Pazaryeri / Güvenceli Ödeme

*Son güncelleme: 2026-08-06. Kanıt disiplini: her satırın kaynağı var;
kaynağı olmayan her rakam **DOĞRULANAMADI** bölümünde.*

## İhtiyaç tanımı

patatesci modeli şunu şart koşar (kural kitabı + güvenceli ödeme şartları):

1. **Alt üye işyeri**: her üretici, platformun altında ayrı satıcı hesabı
   (hakediş, iade ve vergi izi üretici bazında ayrışmalı).
2. **Güvence (emanet) akışı**: alıcıdan peşin tahsilat → teslim onayına kadar
   bloke → onayla üreticiye aktarım. 6493 sayılı Kanun kapsamında lisanslı
   kuruluş üzerinden (patatesci ödeme kuruluşu DEĞİLDİR ve olmayacaktır).
3. **Split**: tek tahsilattan platform komisyonu + üretici hakedişi + (varsa)
   nakliyeci payının otomatik ayrışması.
4. **Havale/EFT desteği**: ton bazlı işlemlerde tutarlar kart limitlerini aşar;
   kartsız tahsilat kanalı şart.
5. **Parçalı iade**: eksik tartı/kalite indirimlerinde kısmi iade.

## Karşılaştırma

| Kriter | iyzico Pazaryeri | PayTR iFrame/Pazaryeri | Craftgate |
|---|---|---|---|
| Alt üye işyeri (üretici başına) | VAR — "alt üye" API'si, hakediş/komisyon otomatik ([docs.iyzico.com](https://docs.iyzico.com/urunler/pazaryeri), [alt üye oluşturma](https://docs.iyzico.com/urunler/pazaryeri/pazaryeri-entegrasyonu/alt-uye-olusturma)) | VAR — sub-merchant, satıcı başına farklı komisyon ([paytr.com](https://www.paytr.com/blog/pazaryeri-komisyon-oranlari)) | VAR — "sub-merchant & para dağıtımı" modeli ([developer.craftgate.io](https://developer.craftgate.io/en/marketplace/)) |
| Emanet/bloke (teslim onayına kadar) | VAR — tahsilat korumalı havuz hesabında bekler, ürün onayı verilince satıcıya geçer; 6493 kapsamında ([Onay API](https://docs.iyzico.com/urunler/pazaryeri/pazaryeri-entegrasyonu/onay), [Pazaryeri Anlaşma](https://www.iyzico.com/pazaryeri-anlasma/)) | KISMİ — Transfer API ile mağaza istediği tarihte gönderim başlatır (bloke süresini platform yönetir) ([paytr postman](https://github.com/paytr/paytr-postman)) | VAR (beyan) — "onay vererek para gönderimi" ([craftgate.io](https://craftgate.io/urunler/craftgate-odeme-gecidi)); sözleşme detayı teyitsiz |
| Split (tek tahsilat → çok taraf) | VAR — sepet kırılımı bazında ([Pazaryeri Ödemesi](https://docs.iyzico.com/urunler/pazaryeri/pazaryeri-entegrasyonu/pazaryeri-odemesi)) | VAR — aynı sepette çok satıcı, parçalı iade ([paytr.com](https://www.paytr.com/blog/pazaryeri-komisyon-oranlari)) | VAR ([developer.craftgate.io](https://developer.craftgate.io/en/marketplace/)) |
| Parçalı iade | VAR (kırılım iadesi) | VAR (resmî blog beyanı) | VAR (API dokümanı) |
| Havale/EFT | VAR (iyzico ödeme yöntemleri içinde; pazaryeri akışına dahli sözleşmeye tabi — teyit gerek) | VAR (PayTR havale/EFT modülü bilinir; pazaryeri akışıyla birleşimi teyit gerek) | VAR — "alternatif ödeme yöntemleri" orkestrasyonu ([developer.craftgate.io](https://developer.craftgate.io/en/alternative-payment-methods/)) |
| Komisyon oranı | AÇIKLANMIYOR — başvuruya özel teklif ([iyzico destek](https://www.iyzico.com/destek/yardim-merkezi/urunler-ve-ozellikler/pazaryeri-odeme-cozumu)) | Resmî sabit tarife yok; 3. taraf kaynaklar tek çekim ~%1,49–1,99 + 0,25₺ yazıyor ([eticaretradari](https://eticaretradari.com/odeme/paytr/), [ideasoft](https://www.ideasoft.com.tr/paytr-komisyon-oranlari/)) — **resmî teyit yok** | AÇIKLANMIYOR — orkestrasyon modeli; üstüne PSP komisyonları biner |
| Niteliği | Doğrudan PSP (6493 lisanslı) | Doğrudan PSP (6493 lisanslı) | Orkestrasyon katmanı (PSP'lerin üstünde) |

## Öneri (gerekçeli)

**Birincil aday: iyzico Pazaryeri.** Gerekçe: emanet akışı (tahsilat → korumalı
havuz → onayla aktarım) bizim "teslim onayında para üreticiye geçer" kuralımızın
birebir karşılığı ve **6493 dayanağı sözleşme metninde açık**. Alt üye +
otomatik hakediş modeli üretici başına ayrışmayı hazır veriyor.

**İkincil aday: PayTR** — komisyonda pazarlık payı ve esnek transfer takvimi;
emanet blokesinin sözleşmesel sınırı netleşmeden birincil yapılmaz.

**Craftgate**: tek PSP'ye kilitlenmemek için ileride orkestrasyon katmanı olarak
yeniden değerlendirilebilir; bugün için gereksiz karmaşıklık.

Karar operatöründür; kod tarafı sağlayıcıdan bağımsızdır (`lib/odeme.js`
soyut katmanı — env anahtarları gelince sağlayıcı adaptörü yazılıp takılır).

## DOĞRULANAMADI (operatör/başvuru ile netleşecek)

1. iyzico pazaryeri **komisyon oranı** — başvuruya özel; resmî oran yok.
2. PayTR pazaryeri komisyonu — 3. taraf blog rakamları resmî teyitsiz.
3. Craftgate fiyatlandırması — açık kaynak yok.
4. Havale/EFT tahsilatının **pazaryeri emanet akışına** dahil olup olmadığı
   (üç sağlayıcıda da sözleşme sorusu; ton bazlı yüksek tutarlar için kritik).
5. Emanet blokesinin azami süresi (mevzuat + sözleşme sınırı) — "teslim +
   6 saat gizli ayıp penceresi" kadar bekletilebilir mi?
6. Alt üye işyeri açılışında üreticiden istenen belge seti (vergi/müstahsil
   ayrımı) ve onay süresi.
7. İade işlem ücreti / chargeback maliyeti.
8. Tarımsal ürün satışında MCC/faaliyet kodu kısıtı olup olmadığı.

Bu 8 madde `OPERATOR-YAPILACAKLAR.md` PSP başvuru bloğuna kopyalandı.
