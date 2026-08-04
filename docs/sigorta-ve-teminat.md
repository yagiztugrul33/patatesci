# patatesci — Sigorta ve Teminat Sistemi

> **TASLAK — avukat ve sigorta brokeri onayı öncesi taslaktır.** İlke:
> "Hiçbir aşamada açıkta mal, para veya sorumluluk kalmasın." Her iddia
> kaynaklıdır; kaynaklanamayan her kalem aşağıdaki DOĞRULANAMADI listesindedir.
> Uydurma prim/oran kullanılmamıştır.

Sürüm 0.1 · 5 Ağustos 2026 · Ankara pilot

## A. Risk Haritası (işlem yaşam döngüsü)

| Aşama | Risk | Kim açıkta | Kapatan araç | Kim öder |
|---|---|---|---|---|
| İlan | Sahte ilan / sahte üretici | Alıcı | KYC + künye/HKS doğrulaması + satıcı teminatı (KK-B3) | Satıcı (teminat) |
| İlan | Hasat afeti (don/dolu/sel) → ilan boşa düşer | Üretici (geçim), alıcı (tedarik) | TARSİM (üretici) + mücbir sebep kuralı (KK-B3) | Üretici (devlet %50–70 destekli) |
| Eşleşme | Fiyat oynaması sonrası cayma | Her iki taraf | Fiyat kilidi + kademeli iptal cezaları (KK-B3/B5) | Cayan taraf |
| Eşleşme→Yükleme | Ödeme yapıldı, mal yüklenmedi | Alıcının parası | Güvence hesabı (para satıcıya geçmedi) + satıcı teminatı | — (yapısal) |
| Yükleme | Eksik tartı / kalite hilesi | Alıcı | TP protokolü + eksiğin 2 katı iade (teminattan) | Satıcı |
| Yol | Hasar / kaza / devrilme / yağmur | Mal bedeli (ödenmiş, güvencede ama mal riskte) | **Emtia nakliyat sigortası** (sevkiyat başına); kusur nakliyecideyse **taşıyıcı mali sorumluluk** poliçesine rücu | Prim: alıcı (maliyet dökümünde ayrı kalem) |
| Yol | Nakliyeci kusuru (uygunsuz araç, gecikme) | Alıcı + üretici | Taşıyıcı sorumluluk poliçesi (onboarding şartı) + KK-B4 tutanak | Nakliyeci |
| Teslim | Haksız red / katman itirazı | Üretici | TA protokolü + hakem + alıcı ceza matrisi; bedel güvencede | Haksız çıkan |
| Ödeme | Kart ters ibrazı (chargeback) | Üretici | İmzalı dijital irsaliye kanıt seti + platform güvence rezervi; rücu | Haksız alıcıdan rücu |
| Ödeme | Platform/banka arızası | Her iki taraf | Güvence hesabı ayrık tutulur + **siber sigorta** + S43 telafi kuralı | Platform |
| Veri | Veri ihlali (KVKK) | Kullanıcılar | **Siber sigorta** + 2 yıl saklama/silme politikası | Platform |
| Genel | Bozuk gıdadan üçüncü kişi zararı | Platform (dolaylı), üretici (asıl) | Üretici sorumluluğu esas; platform için genel sorumluluk poliçesi değerlendirmesi | Bkz. DOĞRULANAMADI |

**AÇIK KALAN RİSKLER (bilinçli, gerekçeli):**
1. **Gel-al'da yol riski** — alıcı kendi aracıyla taşıyorsa sigorta zorunlu
   tutulmaz; risk işlem ÖNCESİ yazılı uyarı + onay kutusuyla alıcıya geçer.
   Gerekçe: alıcının kendi taşımasına poliçe dayatmak uygulanabilir değil;
   isteyen alıcı kendi abonman poliçesini kullanır.
2. **Sigortayı bilinçli kapatan alıcının yol riski** — varsayılan AÇIK gelen
   sevkiyat sigortasını alıcı uyarıyı onaylayarak kapatabilir; risk kendisine
   yazılıdır. Gerekçe: zorunlu sigorta dayatması rekabetçi değil; varsayılan-açık
   + yazılı feragat adil denge.
Bunlar dışında "açıkta ve çözümsüz" satır yoktur.

## B. Sigorta Araçları

### B1. Emtia (Yurtiçi) Nakliyat Sigortası
- **Ne:** Taşınan malın yoldaki hasar/kayıp riskini teminat altına alır; tek
  sefer poliçesi veya yıl boyu tüm sevkiyatları kapsayan **abonman (blok)
  poliçe** olarak yapılabilir — abonman yapısı sigorta şirketlerince
  tanımlıdır. Kaynak: [MAPFRE Nakliyat Emtia](https://www.mapfre.com.tr/sigorta-tr/kurumsal/nakliyat-emtia-sigortasi/),
  [Orient Sigorta](https://www.orientsigorta.com.tr/nakliyat-emtia-sigortasi),
  [sigortam.net rehber](https://www.sigortam.net/nakliyat-sigortasi-nedir).
- **Kimi korur:** mal bedelini (fiilen alıcıyı ve güvencedeki işlemi).
- **Kurgu:** platformda "sevkiyat başına sigorta" seçeneği; **1 tondan büyük
  işlemlerde VARSAYILAN AÇIK**, alıcı yazılı uyarıyla kapatabilir. Prim,
  Şeffaf Maliyet Dökümü'nde ayrı kalemdir; platform abonman poliçeyi anlaşmalı
  acente üzerinden yürütür (bkz. B7 lisans notu).
- **Prim aralığı:** "mal bedelinin binde 1–3'ü" yaygın söylemdir ancak resmi
  tarife bulunamadı → **DOĞRULANAMADI listesinde** (demo'da temsili binde 2
  kullanılır, "temsili" etiketiyle).

### B2. Taşıyıcı Mali Sorumluluk Sigortası
- **Ne:** Nakliyecinin kusurundan doğan hasarda taşıyıcının sorumluluğunu
  karşılar; yurtiçi taşımacı sorumluluk ürünleri piyasada mevcuttur (nakliyat
  ürün aileleri içinde listelenir — Orient/MAPFRE ürün sayfaları).
- **Kurgu:** nakliyeci onboarding ŞARTI: **K1 yetki belgesi** (4925 sayılı
  Karayolu Taşıma Kanunu düzeni) + geçerli sorumluluk poliçesi ibrazı; poliçe
  numarası sipariş dosyasına yazılır. Prim nakliyecinindir.
- Teminat limitleri/prim → DOĞRULANAMADI listesinde.

### B3. TARSİM (Devlet Destekli Tarım Sigortası)
- **Ne:** Üreticinin hasadını don/dolu/sel vb. risklere karşı korur. Devlet
  prim desteği 2026'da **genel %50**; açıkta yetiştirilen meyveler ile
  **patates, domates, biber** dahil sayılı ürünlerde ve kışlık don riskinde
  **%70**. Kaynak: [TARSİM 2026 Bitkisel Ürün Tarife ve Talimatları (PDF)](https://www.tarsim.gov.tr/staticweb/krm-web/mevzuatlar/tarife-ve-talimatlar/2026/bus-tarife-ve-talimatlar.pdf),
  [TSB tarife metni](https://www.tsb.org.tr/content/Legislations/Devlet%20Destekli%20Bitkisel%20%C3%9Cr%C3%BCn%20Sigortas%C4%B1%20Tarife%20ve%20Talimatlar%C4%B1%202026.pdf),
  [AA haberi](https://www.aa.com.tr/tr/ekonomi/tarsim-tarafindan-2026te-teminat-altina-alinacak-urun-ve-riskler-belirlendi/3786508).
- **Kurgu:** işlemimizi doğrudan korumaz; mücbir sebep iptalinde üreticiyi
  ayakta tutar. Onboarding'de teşvik: **"TARSİM'li üretici" rozeti** + ilanda
  görünürlük; rozetli üreticinin mücbir iptali alıcı gözünde daha güvenilirdir.

### B4. Ürün Sorumluluğu / Gıda Güvenliği
- Aracı platformun gıda zararından sorumluluğu sınırlıdır; asıl sorumluluk
  üretici/satıcıdadır. Platform için **genel sorumluluk poliçesi** ihtiyacı
  brokerle netleştirilecek → DOĞRULANAMADI listesinde. Kural tarafında künye
  takibi geri çağırma (recall) izini zaten sağlar.

### B5. Siber + İşyeri Paketi
- Veri ihlali, ödeme sistemi kesintisi için **siber sigorta**; ofis/donanım
  için işyeri paketi. Küçük kalemlerdir; kapsam/prim brokerle → DOĞRULANAMADI.

### B6. Ticari Alacak Sigortası — GEREKMEZ (bilinçli tercih)
- Alacak sigortası vadeli satış alacağını korur. patatesci'de **vade yok**:
  bedel peşin tahsil edilip güvence hesabında tutulur; teminat mektubu bile
  ödemeyi geciktirmez, garanti eder. Korunacak açık alacak oluşmadığı için
  alacak sigortası maliyeti gereksizdir. Bu, bilinçli bir mimari tercihtir ve
  vade isteyen taleplere verilecek cevabın dayanağıdır.

### B7. Sigorta aracılık payı — LİSANSSIZ ALINMAZ
- 5684 sayılı Sigortacılık Kanunu ve Sigorta Acenteleri Yönetmeliği uyarınca
  acentelik faaliyeti **TOBB levha kaydı + uygunluk belgesi** ve mesleki
  sorumluluk sigortası şartına bağlıdır; lisanssız aracılık yapılamaz.
  Kaynak: [5684 (TSB PDF)](https://www.tsb.org.tr/content/Legislations/1.5.5684.pdf),
  [Sigorta Acenteleri Yönetmeliği (TSB)](https://www.tsb.org.tr/content/Legislations/Sigorta_Acenteleri_Yonetmeligi.pdf).
- **Karar:** platform prim üzerinden pay ALMAZ; model **anlaşmalı acente
  ortaklığı**dır (poliçeyi acente keser, platform yalnız veri akışı sağlar).
  Acentelik tesis edilirse ancak lisans sonrası gelir modeli değerlendirilir.

## C. Teminat Araçları

### C1. Banka Teminat Mektubu
- Türler: **kesin** (tercihimiz) ve süreli/süresiz. Bankalar yıllık komisyon
  alır: kesin mektuplarda yaygın aralık **%1,25–2,5** (genel piyasa %0,1–3)
  + %5 BSMV. Kaynak: [maliyeti.com.tr](https://www.maliyeti.com.tr/banka-teminat-mektubu-masrafi-2025/),
  [finanszone rehber](https://finanszone.com/teminat-mektubu/),
  [teklifimgelsin](https://teklifimgelsin.com/banka/blog/teminat-mektubu-nedir).
- **İbraz/doğrulama:** mektup aslı + veren şubeden **banka teyidi** alınmadan
  geçerli sayılmaz; teyit kaydı sipariş/profil dosyasına eklenir.
- **Eşdeğerlik kuralı:** mektup tutarı ≥ gereken nakit teminat; süresiz veya
  işlem vadesini +60 gün aşan süreli olmalıdır.

### C2. Nakit Teminat ile Birlikte Çalışma
- Mevcut kural sürer: satıcı teminatı min 5.000 ₺ veya işlem bedelinin %5'i
  (büyüğü). Mektup, nakit teminatın yerine tam ikame olabilir (C1 şartlarıyla).
- **İade koşulu:** üyelik çıkışında teminat, son teslimden **30 gün** sonra ve
  açık itiraz/borç yoksa iade edilir.

### C3. DBS / Açık Hesap Talepleri — RET (gerekçeli)
- Doğrudan Borçlandırma Sistemi ve açık hesap, vadeli çalışma biçimleridir.
  patatesci ilkesi **"vade yok"**: üretici çek/vade riski taşımaz. Büyük
  alıcıya esneklik, ödemeyi geciktirmeyen teminat mektubuyla sağlanır.
  Bu madde kural kitabına ret gerekçesi olarak işlenmiştir.

## DOĞRULANAMADI — sigorta brokerine sorulacaklar
1. Yurtiçi emtia nakliyat priminin güncel aralığı (binde 1–3 söylemi resmi
   kaynakla doğrulanamadı) ve sebze-meyve için istisna/muafiyet şartları
   (bozulabilir mal klozları).
2. Abonman (blok) poliçede platformun "sigorta ettiren", alıcının "sigortalı"
   olduğu kurgunun hukuki uygunluğu.
3. Taşıyıcı mali sorumluluk poliçesi asgari teminat limiti ve K1 sahipleri
   için piyasa primi.
4. Platform için genel sorumluluk (ürün/işletme) poliçesi gerekliliği ve primi.
5. Siber sigorta kapsam/limit/prim (ödeme sistemi kesintisi dahil mi).
6. Güvence hesabındaki bakiyenin sigortalanabilirliği / emanet hesabı statüsü.
7. Boşaltım-yükleme sırasındaki hasarın (araç üstü vinç/forklift) hangi
   poliçeye girdiği.
8. Hammaliye/boşaltma piyasa tarifesi (₺/ton indirme, ₺/ton-kat taşıma):
   resmi/oda tarifesi bulunamadı; nakliyat firmalarının kat/asansörün fiyatı
   etkilediği bilgisi dışında sayısal dayanak yok — demo tarifesi TEMSİLİDİR
   (S2 400 ₺/ton, S3 1.000 ₺/ton, kat başına 150/300 ₺/ton). Brokere değil,
   yerel hammaliye/nakliye esnaf odalarına sorulacak.
