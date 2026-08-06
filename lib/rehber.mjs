// Programatik SEO rehber altyapısı — TEK KAYNAK.
// Yeni içerik = bu diziye bir kayıt; sayfa, sitemap ve iç bağlantılar
// kendiliğinden oluşur. İçerikler jenerik değil: platformun gerçek kuralları
// (band, tartı, güvence) ve canlı hal verisiyle bağlantılıdır.

export const REHBERLER = [
  {
    slug: "patates-toptan-fiyati",
    baslik: "Patates toptan fiyatı: hal referansı ve tarla fiyatı nasıl okunur?",
    ozet:
      "Toptan patates fiyatının bileşenleri: Ankara Hal referans bandı, kalite katsayıları, nakliye ve güvenceli ödemenin fiyata etkisi.",
    canliUrun: "patates",
    bolumler: [
      {
        b: "Referans nereden gelir?",
        m: "patatesci'de fiyat bandının merkezi, Ankara Büyükşehir Belediyesi toptancı halinin günlük yayımladığı listedir. Platform bu listeyi günde dört kez tazeler ve /katalog sayfasında asgari-azami-orta değerleriyle gösterir. İlan fiyatları bu referansın ±%15 bandı içinde kalmak zorundadır; band dışı ilan sistemce reddedilir.",
      },
      {
        b: "Kalite fiyatı nasıl değiştirir?",
        m: "Aynı ürünün Ekstra sınıfı referansın 1,15 katına kadar, Sanayilik sınıfı 0,60 katına kadar fiyatlanır. Yani '1. sınıf patates kaça?' sorusunun cevabı ile 'sanayilik patates kaça?' sorusunun cevabı arasında neredeyse iki kat fark olabilir. Sınıf beyanı damgalı kantar ve hakem süreciyle denetlenir.",
      },
      {
        b: "Tarla fiyatı neden halden farklı?",
        m: "Hal fiyatı; rüsum, komisyon, hamaliye ve halka sayısı kadar ara marj içerir. Tarladan doğrudan alımda bu kalemlerin çoğu düşer; alıcı aradaki farkın bir kısmını kazanır, üretici de hal kesintilerine uğramadan satar. patatesci'nin komisyonu %3'tür ve satıcıdan alınır; alıcı tarafındaki tek sabit kalem belge/uyum bedelidir.",
      },
      {
        b: "Fiyat ne zaman kilitlenir?",
        m: "Teklifler eşleşince değil, ödeme güvence hesabına alındığı anda fiyat mutlak kilitlenir. Eşleşme ile ödeme arasında referans %3'ten fazla oynarsa işlem iki taraflı yeniden onaya düşer — kimse eski fiyata mahkûm olmaz, kimse de 'piyasa oynadı' diye cayamaz.",
      },
    ],
  },
  {
    slug: "hal-fiyatlari-nasil-belirlenir",
    baslik: "Hal fiyatları nasıl belirlenir? Günlük listeyi doğru okuma rehberi",
    ozet:
      "Toptancı hali fiyat listesindeki asgari/azami aralığı ne anlatır, fiyatlar hangi saatte yayımlanır, patatesci bandı bu veriyi nasıl kullanır?",
    canliUrun: null,
    bolumler: [
      {
        b: "Listeyi kim, ne zaman yayımlar?",
        m: "Büyükşehir hal müdürlükleri her sabah (Ankara'da 06:15 civarı) o günün işlem gören ürünlerini asgari ve azami fiyatlarıyla ilan eder. patatesci bu listeyi sabah 06-08 arasında zorunlu tazeler; gün içinde 6 saatlik önbellekle sunar ve her ekranda kaynağı ve tarih damgasını gösterir.",
      },
      {
        b: "Asgari-azami aralığı neyi anlatır?",
        m: "Aralık tek bir 'doğru fiyat' değildir; aynı ürünün kalite, boy ve ambalaj farklarını yansıtır. patatesci band merkezini asgari ile azaminin ortalaması olarak alır, kalite katsayısıyla çarpar. Bu yüzden 'hal fiyatının üstünde/altında' tartışması yerine kalite sınıfı üzerinden konuşmak gerekir.",
      },
      {
        b: "Fiyat yoksa ne olur?",
        m: "Her ürün her gün işlem görmez; listede olmayan çeşit için son başarılı veri damgasıyla gösterilir, hiç veri yoksa elle güncellenen yedek liste devreye girer ve bu durum ekranda açıkça yazılır. Kaynağı belirsiz fiyat gösterilmez — bu, platformun kanıt disiplini kuralıdır.",
      },
      {
        b: "Bandın amacı ne?",
        m: "Band, pazarlığı yasaklamaz; piyasa bandı dışı teklifle (halk deyişiyle 'kolpo' fiyatla) çapa atmayı engeller. Üretici gerçekçi fiyata hızlı alıcı bulur, alıcı fahiş fiyattan korunur, platformda fiyat keşfi hal verisine çapalanmış kalır.",
      },
    ],
  },
  {
    slug: "tarladan-toptan-alim-rehberi",
    baslik: "İşletmeler için tarladan toptan alım rehberi: 7 adımda güvenli tedarik",
    ozet:
      "Restoran, market ve imalatçılar için tarladan doğrudan alımın adım adım süreci: ilan inceleme, canlı video, güvenceli ödeme, kantar kontrolü ve teslim onayı.",
    canliUrun: null,
    bolumler: [
      {
        b: "1-2: İhtiyacı tanımla, ilanları ele",
        m: "Aylık patates/soğan tüketimini ton olarak çıkar (asgari işlem 1 tondur). İlanlarda üç şeye bak: künye/HKS doğrulaması, kalite sınıfı beyanı ve hasat tarihi. 'Onaylı Üretici' rozeti, künye/ÇKS doğrulaması platformca yapılmış demektir.",
      },
      {
        b: "3-4: Canlı videoyla gör, taşımayı seç",
        m: "Satın almadan önce üreticiden tarladan canlı yayın iste — depodaki değil tarladaki malı gör. Taşımada üç seçenek var: üreticinin plakalı aracı, tarladan gel-al veya anlaşmalı nakliyeci (750 ₺ + km × tarife formülü ekranda hesaplanır). Kat/asansör beyanını doğru yap; yanlış beyanın farkı %25 cezayla tahsil edilir.",
      },
      {
        b: "5-6: Güvenceli öde, varışta tart",
        m: "Ödemen peşin tahsil edilir ama üreticiye geçmez; teslim onayına kadar güvence hesabında bekler. Varışta malı kantarda tart: ürün bazlı yol firesi toleransını (patateste binde 5) aşan eksik çıkarsa eksiğin İKİ KATI otomatik iade edilir.",
      },
      {
        b: "7: Teslim Anı Protokolü ile kapat",
        m: "Dört kontrol adımı (tartı, gözle muayene, belge, araç) tamamlanmadan dijital imza açılmaz. İmza kesin kabuldür; sonrasında yalnız 6 saat içinde ve kesim videosu kanıtıyla gizli ayıp bildirebilirsin. Sorun çıkarsa 24 saat kanıt penceresi + 48 saatte gerekçeli hakem kararı işler — iki yönde de.",
      },
    ],
  },
];

export function rehberBul(slug) {
  return REHBERLER.find((r) => r.slug === slug) || null;
}
