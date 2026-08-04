# patatesci — Senaryo Kataloğu (işin sigortası)

> TASLAK — avukat onayı öncesi taslaktır. Her senaryo: durum → kim haklı nasıl
> belirlenir → kural referansı → ceza/tazminat → uygulamada hangi ekran.
> Kural referansları: KK-B1..B5 (kural kitabı bölümleri), TP (tartı doğrulama
> protokolü), İS (itiraz sihirbazı), BV (boşaltım videosu), TA (teslim anı
> protokolü), SK (skor), HK (hakem süreci).

Sürüm 0.2 · Toplam 64 senaryo. Boş hücre = bitmemiş iş (kapsama testi düşürür).

## TARTI

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S01 | Alıcının kantarı yok | Tartı planı işlem ÖNCESİ bellidir: rotadaki son anlaşmalı kantar teslim tartısıdır | TP-1, TA | Fişteki net geçerli; fark toleransta ise kantar ücreti satıcıdan, aşıyorsa itiraz edenden | Sipariş özeti "Tartı Doğrulama Planı" satırı |
| S02 | İki kantar farklı gösteriyor (yükleme 5.000 kg, varış 4.900 kg) | Ürün bazlı yol firesi toleransı uygulanır: patates %0,5, domates %1,5, yeşillik %3; tolerans içindeyse fark = doğal fire | TP-2 | Tolerans içi: ihlal yok, net = varış tartısı. Aşıyorsa eksik tartı: eksiğin 2 katı iade + skor −15 | İtiraz sihirbazı → tartı |
| S03 | Kantar fişi sahte şüphesi | Damgalı kantar zorunludur (3516 ÖAK); fiş üzerindeki damga no + kantar ağı kaydı çapraz kontrol edilir | TP-1, KK-B2 | Sahtecilik tespitinde kalıcı ihraç + teminattan tazmin + resmi makama bildirim | Hakem paneli |
| S04 | Ambalajlı (çuvallı) malda tam tartı imkânsız | Örneklem protokolü: sürücüdeki damgalı asma kantarla 5 çuval tartılır, uygulama ortalama × çuval sayısı hesaplar | TP-3 | Örneklem neti beyanın %1 altındaysa eksik tartı hükümleri | Teslim sihirbazı → örneklem adımı |
| S05 | Dara tablosu ihtilafı (satıcı "çuval 150 g" diyor, alıcı "300 g") | Standart dara tablosu bağlayıcıdır; özel ambalaj ilanda ÖNCEDEN beyan edilmemişse standart uygulanır | KK-B2 | Tablo dışı dara iddiası reddedilir; ilan beyanı varsa beyan geçerli | İlan formu (dara beyanı) |
| S06 | Alıcı tartıma gelmedi (haber verildiği halde) | Kantar fişi + konum/saat damgalı video tek taraflı delil sayılır | TP-1, HK | Alıcının tartı itiraz hakkı düşer; fişteki net kesindir | Teslim sihirbazı |
| S07 | Tartı cihazı damgasız çıktı | 3516 ÖAK: damgasız ölçü aleti geçersizdir | TP-1 | O tartım yok hükmünde; anlaşmalı kantara gidilir, gecikme damgasız cihazı getiren tarafa yazılır | Hakem paneli |
| S08 | Yağmurda çuval su çekti — varış tartısı YÜKSEK çıktı | Fazla tartı alıcı aleyhine değildir; net = min(beyan, varış) — kimse ıslak ağırlığa para ödemez | TP-2 | Fark ücretlendirilmez; ambalaj koruması satıcı sorumluluğunda ise skor −5 | İtiraz sihirbazı |
| S09 | Tartı anlaşmazlığında taraflar iki farklı kantarda ısrarlı | Üçüncü "karar kantarı" kuralı: ağdaki en yakın üçüncü kantar kesin sonucu verir | TP-1 | Karar kantarı ücreti haksız çıkan tarafa | Hakem paneli |
| S10 | Anlaşmalı kantar ücretini normalde kim öder | Ücret kuralı işlem öncesi yazılıdır | TP-1 | Fark toleransta: satıcı öder (yük onun beyanı); tolerans aşıldıysa itiraz eden öder | Sipariş özeti |

## KALİTE

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S11 | Üst kasa iyi, alt kasa kötü (katman hilesi) | 1 tondan büyük teslimlerde kesintisiz BOŞALTIM VİDEOSU zorunlu; video katmanı gösteriyorsa satıcı haksız | BV, KK-B1 | Kalite ihlali: sınıf farkı indirim VEYA ücretsiz iade (nakliye satıcıdan) + skor −10; kasıt tekrarında ihraç | Teslim sihirbazı → boşaltım videosu |
| S12 | Alıcı boşaltım videosu çekmedi ama katman hilesi iddia ediyor | Zorunlu kanıt eksik — kanıt zinciri karinesi alıcı aleyhine | BV, HK | Katman itirazı hakkı düşer; görünür kısım için genel kalite itirazı kalır | İtiraz sihirbazı |
| S13 | Kısmi bozuk (%20'si çürük) | Uygulama içi kamerayla örnek kasa açımı; bozuk oran hakem onaylı belirlenir | KK-B3, İS | Kısmi iade formülü: iade = tutar × bozuk oran; kalan mal kalır; satıcı skor −10 | İtiraz sihirbazı → kısmi iade |
| S14 | Yolda bozulma | Araç uygunluğu kontrol edilir: ürüne uygun araç seçilmemişse satıcı/nakliyeci kusuru; uygunsa doğal fire | KK-B4, TP-2 | Kusurluysa bozuk kısım tazmini sorumludan; uygunsa yol firesi toleransı içinde değerlendirilir | Hakem paneli |
| S15 | Kalite sınıfı sınırda (1. Sınıf mı 2. Sınıf mı belirsiz) | Foto standardı kareleri + kusur toleransı tablosu (%8 eşiği) hakemce sayım/örneklemle uygulanır | KK-B1, HK | Eşik aşılmışsa kalite ihlali hükümleri; aşılmamışsa itiraz reddi (haksız red DEĞİL, dürüst sınır vakası: cezasız ret) | İtiraz sihirbazı |
| S16 | Alıcı malı kullandıktan/işledikten sonra itiraz etti | Kanıt penceresi boşaltımdan 6 saattir; kullanılmış/işlenmiş mala itiraz kabul edilmez | İS, TA | İtiraz otomatik red; ödeme satıcıya | İtiraz sihirbazı (pencere sayacı) |
| S17 | Satıcı ilandakinden farklı ÇEŞİT getirdi (Agria yerine Melody) | İlan beyanı bağlayıcı; çeşit etiket/görsel karşılaştırma + hakem | KK-B1 | Alıcı seçer: fiyat farkıyla kabul veya ücretsiz iade (nakliye satıcıdan) + skor −10 | İtiraz sihirbazı |
| S18 | Soğukta bekletilmesi gereken mal alıcı geç teslim aldığı için bozuldu | Teslim randevusuna geç kalan taraf sorumludur; saat damgalı kayıtlar esas | TA, KK-B4 | Alıcı gecikmesiyse bedel ödenir, itiraz reddi; satıcı/nakliyeci gecikmesiyse bozulan kısım tazmini | Hakem paneli |

## İPTAL / İADE

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S19 | Satıcı yükleme ÖNCESİ iptal etti | Aşama sipariş durumundan otomatik belirlenir | KK-B3 | Bedelin %2'si alıcıya tazminat + skor −5 | Siparişler → iptal onayı (ceza önden gösterilir) |
| S20 | Satıcı mal YOLDAYKEN iptal etti | Aşama otomatik | KK-B3 | %5 + nakliye + skor −10 | Siparişler → iptal onayı |
| S21 | Alıcı yükleme ÖNCESİ iptal etti | Aşama otomatik | KK-B3 | %1 kesinti (üreticiye hazırlık tazminatı) + skor −3 | Siparişler → iptal onayı |
| S22 | Alıcı mal YOLDAYKEN iptal etti | Aşama otomatik | KK-B3 | %5 + gidiş nakliyesi + skor −10 | Siparişler → iptal onayı |
| S23 | Üretici hasadı platform dışında başkasına sattı (çifte satış) | Yükleme gerçekleşmedi + üretici stok beyanı kayıtlı; hakem tespiti | KK-B3, SK | Ağır ihlal: %5 tazminat + teminattan mahsup + skor −40 → ihraç eşiği; tekrarında kalıcı ihraç | Hakem paneli |
| S24 | Alıcı teslim adresini yanlış verdi | Adres sipariş kaydında; ek km oluştuysa rota kaydı delildir | KK-B4 | Ek nakliye + bekleme bedeli alıcıdan; bozulma riski alıcıya geçer | Sipariş özeti |
| S25 | Alıcı ödedi, satıcı hiç yüklemedi ve iptal de etmedi | Yükleme penceresi (hasat tarihi + 48 saat) aşımı otomatik tespit | KK-B3 | Yükleme öncesi satıcı iptali sayılır: %2 + skor −5; bedel anında iade; tekrarında ihraç | Siparişler (otomatik) |
| S26 | Mücbir sebep (don, sel, yol kapanması) | Belge şartı: resmi kurum raporu/meteoroloji kaydı 24 saat içinde yüklenir | KK-B3 | Cezasız iptal; bedel iade; skor etkilenmez | İtiraz sihirbazı → mücbir sebep |
| S27 | Araç arızası | Nakliyeci sorumluluğu; ikame araç süresi 6 saat | KK-B4 | 6 saatte ikame gelirse cezasız (gecikme bildirimi); gelmezse taşıyıcı nakliye bedelini kaybeder + bozulma tazmini | Sipariş takip |
| S28 | Reddedilen malın akıbeti (bozulabilir, bekleyemez) | 24 saat kuralı: mal ikinci el ilana düşer → en yakın alıcıya indirimli → bağış seçeneği | KK-B3 | Satış farkı haksız çıkan taraftan mahsup edilir; bağışta belge düzenlenir | Hakem paneli → akıbet seçimi |
| S29 | Kısmi teslim (5 ton yerine 3 ton geldi) | Kantar fişi + irsaliye karşılaştırması | KK-B2, KK-B3 | Gelmeyen kısım satıcı yükleme-öncesi iptali sayılır (%2 o kısım üzerinden); gelen kısım normal akışta | Teslim sihirbazı |
| S30 | Gel-al: alıcı gelmedi | Randevu + konum kaydı | TA, KK-B3 | Teslim almama = haksız red hükümleri (%5 + bedel satıcıya; mal ikinci el) | Siparişler |
| S31 | Gel-al: satıcı hazır değildi, alıcı boş döndü | Alıcının konum+saat damgalı kaydı delil | KK-B3 | Satıcı yükleme sonrası iptal hükmü: %5 + alıcının belgeli yol masrafı | İtiraz sihirbazı |
| S32 | Nakliyeci malı yanlış yere indirdi | Rota + teslim konum kaydı | KK-B4 | Düzeltme taşıması nakliyeciden; gecikme bozulması nakliyeciden; alıcı-satıcı cezasız | Hakem paneli |
| S33 | Hakem kararına itiraz (üst itiraz) | 1 kez üst itiraz hakkı; yeni kanıt şartı | HK, İS | Üst hakem 48 saat; karar kesindir; haksız üst itiraz skor −5 | İtiraz sihirbazı → üst itiraz |
| S34 | Hakem 48 saati aştı (platform gecikmesi) | Süre aşımı otomatik tespit — platform hesap verir | HK | Taraflara işlem puanı iadesi (komisyondan); bedel bloke kalmaz: teminatlar korunarak hızlandırılmış karar zorunlu | Hakem paneli |

## FİYAT

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S35 | Sipariş ile teslim arasında piyasa ÇÖKTÜ (alıcı vazgeçmek istiyor) | Fiyat KİLİTLİDİR: eşleşme anındaki fiyat geçerli | KK-B5, KK-B3 | Cayan taraf aşamasına göre iptal cezasına tabi; fiyat revizyonu yok | Siparişler → iptal onayı |
| S36 | Piyasa UÇTU (satıcı daha pahalıya satmak istiyor) | Fiyat kilidi satıcıyı da bağlar | KK-B5, KK-B3 | Satıcı iptali: aşamaya göre %2/%5 + skor; çifte satışa dönerse S23 | Siparişler |
| S37 | Hal referans fiyatı erişilemez | Son başarılı veri "son güncelleme" damgasıyla; o da yoksa elle yedek liste | KK hal bölümü | Band son geçerli merkezle çalışır; kaynak ibaresi durumu açıkça yazar | Borsa (kaynak satırı) |
| S38 | Fiyat manipülasyonu: kendi kendine teklif / sahte hesapla şişirme | Aynı IP-cihaz-ödeme izi + eşleşmeden iptal örüntüsü tespiti | KK-B3, SK | Tespit edilen teklifler iptal; hesaplar bağlantılı sayılır ve birlikte ihraç; teminat irat kaydedilir | Yönetim (arka plan) |
| S39 | Eşleşme bekleyen teklife rağmen satıcı ilan fiyatını değiştirdi | Teklif eşleşme anına kadar serbestçe geri çekilebilir; eşleşmiş fiyat kilitli | KK-B5 | Eşleşme öncesi değişiklik serbest (geri çek + yeni teklif); eşleşme sonrası S36 | Borsa |
| S40 | Aynı ilana iki alıcı aynı anda "satın al" dedi | Sunucu tarafında ilk kilitleyen kazanır; ikinciye anında bilgi | KK-B5 | İkinci alıcıya ceza yok; bedeli alınmadı ya da anında iade | Borsa |

## ÖDEME

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S41 | Kart chargeback (ters ibraz) — mal teslim edilmişken | İmzalı dijital irsaliye + konum damgalı teslim kaydı bankaya ibraz edilir | KK-B5, TA | Satıcı güvencededir: bedel platform güvencesinden ödenir; chargeback haksızsa alıcıdan rücu + skor −20 + kart yöntemi kapatılır | Hakem paneli |
| S42 | Havale yanlış tutarda / üçüncü kişi hesabından geldi | Güvence hesabı mutabakatı; kimlik eşleşmesi zorunlu (MASAK uyumu) | KK-B5 | Eksikse tamamlanana dek sipariş beklemede; üçüncü kişi havalesi iade edilir, işlem alıcı kimliğinden yeniden | Ödeme ekranı |
| S43 | Para güvencedeyken platform-banka arızası | Teslim onayı kayıtlı; aktarım gecikmesi platform sorumluluğu | KK-B5 | Satıcıya gecikme bildirimi + gecikme süresi için komisyon iadesi; ödeme önceliklendirilir | Siparişler (durum notu) |
| S44 | Ceza, güvence + teminatı aştı | Tahsil sırası: güvence → teminat → bakiye borç | KK-B5 | Bakiye borç; ödenmeden yeni işlem YOK; 30 gün sonra yasal takip | Profil (borç uyarısı) |
| S45 | Alıcı faturayı/müstahsili reddetti | Belgeler işlem kaydından otomatik üretilir; itiraz ancak maddi hata için | KK-B5 | Maddi hata düzeltilir; keyfi red işlemi durdurmaz — vergi belgesi işlemin sonucudur | Sipariş dosyası |

## İNSAN

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S46 | Satıcı telefona çıkmıyor (yükleme günü) | Uygulama içi arama kayıtları (3 deneme + bildirim) | KK-B3 | 4 saat yanıtsızlık = yükleme öncesi satıcı iptali karinesi (%2 + skor −5) | Sipariş takip |
| S47 | Sürücü/araç farklı çıktı (plaka-kimlik uyuşmazlığı) | Teslim sihirbazının 1. adımı plaka doğrulamadır | TA | TESLİM EDİLMEZ; satıcıya anında bildirim; doğrulanmadan teslim alan alıcı sonraki itiraz haklarını kaybeder | Teslim sihirbazı → plaka |
| S48 | Hakaret / tehdit | Uygulama içi mesaj kayıtları; harici iletişim şikayeti ekran görüntüsüyle | SK | İlk ihlal skor −20 + yazılı uyarı; tehditte anında askı + gerekirse resmi makama bildirim | Profil / bildir |
| S49 | Sahte hesap / çalıntı kimlik | KYC: kimlik + vergi/çiftçi kaydı doğrulaması; cihaz-IP izi | KK-B3, SK | Hesap kapatılır, teminat bloke, bağlantılı hesaplar taranır; resmi bildirim | Yönetim |
| S50 | Yorum/puan şantajı ("iyi puan ver yoksa itiraz ederim") | Mesaj kayıtları hakeme delildir | SK, HK | Şantaj yapan skor −20; şantajla açılmış itiraz otomatik red; puan kaydı silinir | Bildir → hakem |
| S51 | İhraç edilen kullanıcı yeni hesapla döndü | Kimlik-cihaz-IBAN eşleşmesi taraması | SK | Yeni hesap kapatılır; ihraç kalıcıdır | Yönetim |

## VERİ / HUKUK

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S52 | Canlı video + konum verisinin KVKK durumu | Açık rıza kayıtta alınır; amaç sınırlı (işlem kanıtı); saklama 2 yıl, sonra otomatik silme | KK-B5, KVKK metni | Rızasız kayıt yok; rıza geri çekilirse yeni işlem açılamaz (kanıt zorunluluğu) | Kayıt ekranı + KVKK sayfası |
| S53 | Kayıtların delil olarak paylaşımı | Yalnız hakem süreci ve resmi makam talebi; taraflara kendi işlem kayıtları verilir | KK-B5 | Üçüncü kişiyle paylaşım yok; ihlalde platform sorumluluğu | Sipariş dosyası |
| S54 | Karşı taraf video çekimine izin vermiyor | Ticari işlem kanıtı sözleşme şartıdır (üyelikte kabul edilir) | İS, TA | Çekimi engelleyen taraf kanıt karinesi aleyhine; itiraz hakları düşer | Teslim sihirbazı |

## TESLİM ANI PROTOKOLÜ

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S55 | Alıcı dijital irsaliyeyi imzaladı, sonra fikrini değiştirdi | İMZA = görünür her şeyin KESİN KABULÜ (konum+saat damgalı) | TA | Red: itiraz açılamaz; yalnız gizli ayıp istisnası (S57) | Teslim sihirbazı |
| S56 | Alıcı imzalamadan araç ayrıldı | Teslim tamamlanmadı — sürücü/satıcı ihlali; konum kayıtları delil | TA | Teslim geçersiz; dönüş ve yeniden teslim satıcı/nakliyeciden; alıcı cezasız | Teslim sihirbazı |
| S57 | Gizli ayıp: imza sonrası 6 saat içinde, uygulama kamerasıyla kesim/açma videosu | TTK ayıp ihbarına paralel: dışarıdan görünmeyen ayıp, yalnız damgalı uygulama kamerası kanıtıyla | TA, İS | Hakem onaylarsa kısmi iade formülü; galeriden yükleme kabul edilmez | İtiraz sihirbazı → gizli ayıp |
| S58 | Gizli ayıp 6 saatlik pencereyi kaçırdı | Pencere sayacı imza anından işler | TA | İtiraz otomatik red; ödeme satıcıda kalır | İtiraz sihirbazı (sayaç) |
| S59 | Rotadaki anlaşmalı kantara uğramayı satıcı/sürücü reddetti | Tartı planı sipariş kaydında bağlayıcıdır | TP-1, TA | Yükleme ihlali: alıcının tartı itirazında karine satıcı aleyhine + skor −10 | Sipariş takip |
| S60 | Alıcı 3 rastgele kasa açımını yapmadan imzaladı | Kontrol listesi tamamlanmadan imza butonu açılmaz (uygulama zorlar) | TA | Uygulama akışı gereği oluşamaz; oluştuysa (çevrimdışı istisna) imza yine kesin kabuldür | Teslim sihirbazı |

## EK (kendi bulduğumuz sınır durumlar)

| No | Senaryo (durum) | Kim haklı — nasıl belirlenir | Kural | Yaptırım / sonuç | Ekran |
|---|---|---|---|---|---|
| S61 | İlan fotoğrafları sonradan değiştirildi (teklif aldıktan sonra) | İlan sürüm geçmişi saklanır; teklif anındaki sürüm bağlayıcı | KK-B1 | Teklif sahipleri eski beyana güvenir; kalite ihtilafında eski fotolar esas | İlan geçmişi |
| S62 | Teslim randevusunda alıcının deposu kapalı | Konum+saat damgalı bekleme kaydı (sürücü) | TA, KK-B4 | 2 saat bekleme sonrası teslim almama hükümleri; bekleme ücreti alıcıdan | Teslim sihirbazı |
| S63 | Kısmi iade sonrası kalan malın yeniden fiyatlanması talebi | Kısmi iade bozuk ORANI kadar bedeli düşürür; kalan mal fiyatı kilitli kalır | KK-B3 | Ek pazarlık yok; istemeyen alıcı kalanı da S28 akıbet seçenekleriyle iade edebilir (nakliye kendinden) | Hakem paneli |
| S64 | Skoru 60 altına düşen satıcının AÇIK siparişleri | Askı yeni işlem açmayı durdurur; mevcut yükümlülükler sürer | SK | Açık siparişler tamamlanmak zorundadır; tamamlamazsa iptal cezaları + ihraç | Profil (askı bildirimi) |
