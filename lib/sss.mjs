// Senaryo kataloğundan (docs/senaryolar.md) üretilen en kritik 20 soru-cevap.
// Ana sayfa SSS'si ve /hukuki/sss aynı kaynaktan beslenir.

export const SSS = [
  { q: "patatesci nedir?", a: "Üreticiyi toptan alıcıyla (esnaf, restoran, market, ihracatçı) doğrudan buluşturan tarladan tedarik platformudur. Fiyatlar Ankara hal referanslı bantta oluşur; ödeme teslim onayına kadar güvencededir." },
  { q: "Tartıya nasıl güveneceğim?", a: "Tartı planı işlem ÖNCESİ sipariş özetinde yazar: tam yüklerde rotadaki son anlaşmalı kantar (damgalı fiş + video), çuvallı malda sürücüdeki damgalı asma kantarla 5 ambalaj örneklemi. Damgasız cihazla tartım yok hükmündedir (3516 sayılı kanun)." },
  { q: "Yükleme 5.000 kg, varışta 4.900 kg çıktı — kim haklı?", a: "Ürün bazlı yol firesi toleransı uygulanır: patates/soğan %0,5, domates/biber %1,5, yeşillik %3. Tolerans içi fark doğal firedir; aşan eksikte satıcı, eksiğin 2 KATINI iade eder." },
  { q: "Üstü iyi altı kötü çıkarsa (katman hilesi)?", a: "1 tondan büyük teslimlerde boşaltım kesintisiz videoyla kaydedilir. Video katmanı gösterirse satıcı kalite ihlali cezası alır. Videoyu çekmeyen alıcının katman itirazı hakkı düşer." },
  { q: "Malın %20'si çürük çıktı — hepsini iade mi edeceğim?", a: "Hayır: kısmi iade formülü uygulanır — bozuk oran hakem onayıyla belirlenir, bedelin o kadarı iade edilir, kalan mal sende kalır." },
  { q: "İmzaladıktan sonra fikrim değişirse?", a: "Dijital irsaliye imzası, görünür her şeyin KESİN KABULÜDÜR; ödeme imzayla üreticiye geçer. Tek istisna gizli ayıptır: imzadan itibaren 6 saat içinde, yalnız uygulama kamerasının kesim/açma videosuyla." },
  { q: "Teslimde neleri kontrol etmek zorundayım?", a: "Uygulama sırayla zorlar: plaka doğrulama → boşaltım videosu → tartı kontrolü → 3 rastgele kasa açımı → dijital imza. Adımlar tamamlanmadan imza butonu açılmaz." },
  { q: "Sürücü veya plaka kayıtlıdan farklı çıkarsa?", a: "Teslim ETME. Plaka-kimlik doğrulaması teslim sihirbazının ilk adımıdır; doğrulamadan teslim alan alıcı sonraki itiraz haklarını kaybeder." },
  { q: "Sipariş verdikten sonra piyasa değişirse fiyat değişir mi?", a: "Bilyoner kuralı işler: teklif anında fiyat + hal referansı damgalanır. Kabul anında referans %3'ten fazla oynadıysa işlem kesinleşmez — iki taraf güncel fiyatı görüp yeniden onaylar (onaylamayan CEZASIZ cayar). Ödeme güvenceye yattığı an fiyat MUTLAK kilitlenir; 'ama akşam düştü' itirazı geçersizdir." },
  { q: "İptal edersem ne öderim?", a: "Aşamaya ve tarafa göre kademeli: alıcı yükleme öncesi %1, satıcı yükleme öncesi %2, mal yoldayken her iki taraf için %5 + nakliye. Ceza, işlemden ÖNCE ekranda net gösterilir ve onayın alınır." },
  { q: "Üretici malı benden habersiz başkasına satarsa (çifte satış)?", a: "Ağır ihlaldir: tazminat + teminattan mahsup + skor −40 (ihraç eşiği); tekrarında kalıcı ihraç. Bedelin anında iadesi garantidir." },
  { q: "Don, sel gibi afette üretici ceza öder mi?", a: "Hayır — mücbir sebep cezasızdır; şartı 24 saat içinde resmi belge (ör. meteoroloji kaydı) yüklemektir." },
  { q: "Reddedilen mal ne olur? Bozulur gitmez mi?", a: "Bozulabilir mal bekleyemez — 24 saat kuralı: ikinci el ilana düşer, olmazsa en yakın alıcıya indirimli satılır, olmazsa bağışlanır. Satış farkı haksız çıkan taraftan mahsup edilir." },
  { q: "İtiraz nasıl açılır?", a: "3 dokunuş: sorun tipini seç → kanıt adımlarını tamamla → gönder. Kanıt yalnız uygulama içi kamerayla alınır (konum+saat damgalı); galeriden yükleme yoktur. Pencere boşaltımdan 6 saattir." },
  { q: "Hakem kararı ne kadar sürede çıkar, adil mi?", a: "En geç 48 saatte, gerekçeli ve iki tarafa yazılı. Kanıtı eksik olan taraf aleyhine karine işler; 1 kez üst itiraz hakkın var. Hakem geç kalırsa platform hesap verir (işlem puanı iadesi)." },
  { q: "Haksız yere reddedersem ne olur?", a: "Hakem kanıtla haksız bulursa: %5 ceza + çift yön nakliye ödersin; malı almak zorunda değilsin ama bedel üreticiye ödenir ve mal ikinci el ilana düşer. Skorun düşer." },
  { q: "Karşı tarafın güvenilir olduğunu nereden bileceğim?", a: "Çift taraflı görünür skor: satıcıda tam-tartı ve kalite skoru, alıcıda haklı-itiraz ve teslim-alma skoru — profilde HERKESE açık. 60 altı askıya alınır, 40 altı ihraç edilir." },
  { q: "Ödemem gerçekten güvende mi?", a: "Bedel teslim onayına (dijital imzana) kadar güvence hesabında bekler. Kart ters ibrazında satıcı, imzalı teslim kaydıyla platform güvencesindedir; haksız ters ibraz alıcıdan rücu edilir." },
  { q: "Nakliye ücreti nasıl hesaplanır, kim öder?", a: "Formül şeffaftır: 750 ₺ sabit + km × ₺/km × tonaj katsayısı (kamyonet 1,0 / kamyon 1,6 / tır 2,4). Varsayılan ödeyen alıcıdır; gel-al'da sıfırdır. Sipariş özetinde kalem kalem görünür." },
  { q: "Canlı video ve konum verilerim ne olacak (KVKK)?", a: "Açık rızayla, yalnız işlem kanıtı amacıyla alınır; 2 yıl saklanır, sonra otomatik silinir. Kayıtlar yalnız hakem sürecinde ve resmi makam talebinde paylaşılır." },
];
