export const metadata = {
  title: "Şeffaf Ticaret Kuralları",
  description:
    "patatesci ürün-kalite taksonomisi, tartı ve dara dürüstlüğü, çift taraflı ceza-adalet matrisi, nakliye hesabı ve ödeme düzeni — herkese açık kural kitabı.",
};

function T({ children }) {
  return <div style={{ overflowX: "auto", margin: "12px 0 20px" }}><table className="table">{children}</table></div>;
}

export default function TicaretKurallari() {
  return (
    <main className="section">
      <div className="container legal" style={{ maxWidth: 820 }}>
        <p className="eyebrow">Herkese açık kural kitabı</p>
        <h1>Şeffaf Ticaret Kuralları</h1>
        <p style={{ background: "var(--amber-soft)", color: "var(--amber-koyu)", borderRadius: 10, padding: "10px 14px", fontWeight: 600 }}>
          TASLAK — avukat onayı öncesi taslaktır. Yayına alınmadan önce hal
          mevzuatına hakim bir hukuk danışmanı tarafından incelenecektir.
        </p>
        <p>
          Sürüm 0.1 · 4 Ağustos 2026 · Ankara pilot bölgesi. Platformdaki her
          karar bu kurallara dayanır ve gerekçesiyle yazılır. Kurallar; mevcut
          pazar yerlerinin (Dolap, sahibinden, Getir, Trendyol, Uber/BiTaksi)
          iptal-iade-itiraz politikalarının ve kullanıcı şikayetlerinin
          incelenmesiyle kalibre edilmiştir: ölçülebilir eşik olmadan ceza yok,
          yaptırım kademeli, her ceza hakem kararıyla iade edilebilir, itiraz
          kanıt temelli, karar süreleri tanımlı — ve ceza matrisi iki tarafa da
          eşit işler. Tek tarafı koruyan sistem çöker.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>1. Ürün ve kalite taksonomisi</h2>
        <p>
          Hiyerarşi: <b>Ürün → Çeşit → Kalite → Kalibre</b>. Örnek: Patates →
          Agria → 1. Sınıf → 35–55 mm. Kalite sınıfları: Ekstra, 1. Sınıf,
          2. Sınıf, Sanayilik (UNECE tazelik standartlarına paralel; çürük ve
          küf hiçbir sınıfta tolere edilmez).
        </p>
        <T>
          <thead><tr><th>Ürün</th><th>Başlıca çeşitler</th><th>Standart</th><th className="num">Kusur tol. (E/1/2)</th><th>Kalibre</th></tr></thead>
          <tbody>
            <tr><td>Patates</td><td>Agria, Granola, Melody, Lady Olympia</td><td>UNECE FFV-52, TS 1222</td><td className="num">%3 / %8 / %12</td><td>28–35 / 35–55 / 55+ mm</td></tr>
            <tr><td>Soğan (kuru)</td><td>Sarı kuru, mor, taze</td><td>UNECE FFV-25, TS 794</td><td className="num">%3 / %8 / %12</td><td>40–60 / 60–80 / 80+ mm</td></tr>
            <tr><td>Domates</td><td>Pembe, beef, salkım, kokteyl, salçalık</td><td>UNECE FFV-36</td><td className="num">%3 / %8 / %12</td><td>47–57 / 57–67 / 67–82 mm</td></tr>
            <tr><td>Biber</td><td>Çarliston, sivri, dolma, kapya, kıl</td><td>UNECE FFV-28</td><td className="num">%3 / %8 / %12</td><td>boy 9–14 / 14–19 cm</td></tr>
            <tr><td>Salatalık</td><td>Silor, badem, sera</td><td>UNECE FFV-15</td><td className="num">%3 / %8 / %12</td><td>boy 14–19 / 19–25 cm</td></tr>
            <tr><td>Havuç</td><td>Beypazarı, Nantes</td><td>UNECE FFV-10</td><td className="num">%3 / %8 / %12</td><td>çap 20–35 / 35–45 mm</td></tr>
          </tbody>
        </T>
        <p>
          <b>Fotoğraf standardı (zorunlu):</b> (1) yığın geneli, (2) yığın
          kesiti — kürek/el dalışıyla, (3) tekil ürün yakın çekim, (4)
          kasa/çuval içi üstten. Yükleme videosunda ek olarak kantar ekranı ve
          araç plakası okunur olmalıdır. <b>Kalite beyanı bağlayıcıdır:</b>
          beyan edilen sınıf teslimde tolerans tablosuyla denetlenir (örn.
          1. Sınıf beyanında kusurlu oranı en çok %8).
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>2. Tartı ve dara dürüstlüğü</h2>
        <p>
          Brüt–dara–net ayrımı zorunludur; ödeme net üzerinden yapılır.
          Yüklemede damgalı kantar fişi zorunludur; alıcının varışta karşı
          tartı hakkı vardır. Tolerans <b>±%1</b> (yol firesi dahil); aşan
          eksik, "eksik tartı ihlali"dir.
        </p>
        <T>
          <thead><tr><th>Ambalaj</th><th className="num">Standart dara</th></tr></thead>
          <tbody>
            <tr><td>Dökme</td><td className="num">0</td></tr>
            <tr><td>Polipropilen çuval (50 kg)</td><td className="num">250 g</td></tr>
            <tr><td>File çuval (25 kg)</td><td className="num">150 g</td></tr>
            <tr><td>Plastik kasa</td><td className="num">1,8 kg</td></tr>
            <tr><td>Tahta kasa</td><td className="num">2,5 kg</td></tr>
            <tr><td>Karton kutu</td><td className="num">600 g</td></tr>
          </tbody>
        </T>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>3. Ceza-adalet matrisi (çift taraflı)</h2>
        <p><b>Satıcı ihlalleri:</b></p>
        <T>
          <thead><tr><th>İhlal</th><th>Yaptırım</th></tr></thead>
          <tbody>
            <tr><td>Eksik tartı (&gt;%1)</td><td>Eksiğin 2 katı alıcıya iade (teminattan) + skor −15; 3. tekrarda kalıcı ihraç</td></tr>
            <tr><td>Kalite düşük beyanı</td><td>Alıcı seçer: sınıf farkı kadar indirim VEYA ücretsiz iade (nakliye satıcıdan) + skor −10</td></tr>
            <tr><td>İptal — yükleme öncesi</td><td>Bedelin %2'si (alıcıya tazminat) + skor −5</td></tr>
            <tr><td>İptal — yükleme/yol sonrası</td><td>%5 + nakliye + skor −10</td></tr>
            <tr><td>Mücbir sebep (belgeli afet)</td><td>Cezasız; belge 24 saat içinde</td></tr>
          </tbody>
        </T>
        <p><b>Alıcı ihlalleri:</b></p>
        <T>
          <thead><tr><th>İhlal</th><th>Yaptırım</th></tr></thead>
          <tbody>
            <tr><td>Yükleme öncesi iptal</td><td>%1 kesinti (üreticiye hazırlık tazminatı) + skor −3</td></tr>
            <tr><td>Mal yoldayken iptal</td><td>%5 + gidiş nakliyesi + skor −10</td></tr>
            <tr><td>Varışta haksız red (hakem kararıyla)</td><td>Çift yön nakliye + %5 + skor −15; bedel satıcıya ödenir, mal ikinci el ilana düşer</td></tr>
            <tr><td>Teslim almama (ortada yokluk)</td><td>Haksız red hükümleri</td></tr>
          </tbody>
        </T>
        <p>
          <b>Hakem süreci:</b> itirazda 24 saatlik kanıt penceresi
          (foto/video/kantar fişi/tutanak) → hakem kararı en geç 48 saatte →
          karar gerekçeli ve iki tarafa yazılı. Zorunlu kanıtı eksik olan taraf
          aleyhine karine işler.
        </p>
        <p>
          <b>Teminat ve skor:</b> satıcı teminatı min 5.000 ₺ veya işlem
          bedelinin %5'i (büyüğü); alıcıdan ek teminat istenmez (ödeme zaten
          peşin güvencede). Skor 100'den başlar; 60 altı askıya alma, 40 altı
          ihraç; 6 ay temiz sicil +10. Cezalar önce güvence tutarından, sonra
          teminattan, sonra bakiye borçtan tahsil edilir; borçluyken yeni işlem
          açılamaz.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>4. Nakliye ve km hesabı</h2>
        <p>
          <b>nakliye = 750 ₺ sabit yükleme bedeli + (km × ₺/km ×
          tonaj katsayısı)</b>. Katsayılar: ≤3 t = 1,0 (kamyonet) · 3–10 t =
          1,6 (kamyon) · 10–25 t = 2,4 (tır). ₺/km mazot fiyatına endeksli
          yönetici parametresidir (başlangıç: tır ~28 ₺/km). Varsayılan ödeyen
          alıcıdır; gel-al'da nakliye sıfırdır. Sorumluluk yüklemeden teslim
          onayına dek taşıyıcıdadır; hasar tutanakla belgelenir (Faz 2: emtia
          sigortası). Mesafeler Ankara pilot km tablosundan alınır (Polatlı,
          Beypazarı, Nallıhan, Haymana, Kızılcahamam ve merkez ilçeler).
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>5. Ödeme düzeni</h2>
        <p>
          (1) Kredi kartı — küçük tutarlar (üst sınır 100.000 ₺, lisanslı ödeme
          kuruluşu, taksit yok). (2) Havale/EFT → güvence hesabı — ana yöntem;
          bedel teslim onayına kadar güvencede. (3) Banka teminat mektubu —
          büyük düzenli alıcılara limitli; <b>vade yok ilkesi korunur</b>:
          mektup ödemeyi garanti eder, geciktirmez. Komisyon: toptan %3
          (satıcıdan) + belge/uyum hizmet bedeli işlem başına 250 ₺ (alıcıdan)
          — faturalı ve sipariş özetinde kalem kalem görünür. Belgeler
          (müstahsil makbuzu/e-fatura, e-irsaliye, kantar fişi, rüsum satırı)
          sipariş dosyasında arşivlenir.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>6. Tartı doğrulama protokolü (üç katman)</h2>
        <p>
          Tartı planı <b>işlem öncesi</b> sipariş özetinde yazılıdır. <b>TP-1 —
          Anlaşmalı kantar ağı</b> (tam yüklerde): rotadaki son anlaşmalı kantar
          teslim tartısıdır; damgalı fiş + konum/saat damgalı video zorunlu,
          alıcı isterse hazır bulunur. İlke: "Platform kantar taşımaz, kantar
          ağını sertifikalar." Ücret: fark toleranstaysa satıcı, aşıldıysa
          itiraz eden öder; uyuşmazlıkta üçüncü karar kantarı kesindir. 3516
          sayılı Ölçüler ve Ayar Kanunu gereği kantarlar damgalıdır; damgasız
          tartım yok hükmündedir. <b>TP-2 — Yol firesi (ürün bazlı):</b>
          patates/soğan/havuç %0,5 · domates/biber/salatalık %1,5 · yeşillik
          %3; tolerans içi fark doğal firedir, aşan eksikte eksiğin 2 katı
          iade. Islanmayla YÜKSEK çıkan tartıda net = min(beyan, varış).
          <b> TP-3 — Örneklem:</b> çuvallı malda sürücüdeki damgalı asma
          kantarla rastgele 5 çuval; uygulama ortalama × adet − dara hesaplar.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>7. İtiraz sihirbazı ve boşaltım videosu</h2>
        <p>
          İtiraz 3 dokunuştur: sorun tipi → kanıt adımları → gönder. Kanıt
          yalnız uygulama içi kamerayla alınır (konum+saat damgalı;
          <b> galeriden yükleme yok</b>). Pencere boşaltımdan 6 saattir;
          kullanılmış mala itiraz reddedilir. Hakem 48 saatte gerekçeli yazılı
          karar verir; 1 kez üst itiraz hakkı vardır (yeni kanıt şartıyla);
          süre aşarsa platform hesap verir. <b>Boşaltım videosu:</b> 1 tondan
          büyük teslimlerde kesintisiz video zorunludur (katman hilesine
          karşı); çekilmezse katman itirazı hakkı düşer.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>8. Teslim anı protokolü</h2>
        <p>
          Zorunlu kontrol sihirbazı: <b>plaka doğrula → boşaltım videosu →
          tartı kontrolü → 3 rastgele kasa açımı → dijital irsaliye imzası</b>
          (konum+saat damgalı). Adımlar tamamlanmadan imza etkinleşmez.
          <b> İmza, görünür her şeyin kesin kabulüdür; ödeme imzayla üreticiye
          geçer.</b> İmzalanmadan araç ayrılırsa teslim geçersizdir (sürücü
          ihlali). Tek istisna gizli ayıptır (TTK ayıp ihbarına paralel):
          imzadan itibaren 6 saat, yalnız uygulama kamerası kesim/açma
          videosuyla.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>9. Çift taraflı görünür skor</h2>
        <p>
          Satıcıda tam-tartı + kalite skoru; alıcıda haklı-itiraz + teslim-alma
          skoru. Herkes 100'den başlar; 60 altı askı, 40 altı ihraç; 6 ay temiz
          sicil +10. Skorlar profilde <b>herkese görünür</b>.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>10. Hal fiyat referansı (Ankara pilot)</h2>
        <p>
          Piyasa bandının merkezi, Ankara Büyükşehir Belediyesi Toptancı Hal
          Müdürlüğü günlük listesindeki eşleşen ürünün asgari-azami orta
          değeridir; band ürün + kalite bazındadır (katsayılar: Ekstra 1,15 ·
          1. Sınıf 1,00 · 2. Sınıf 0,85 · Sanayilik 0,60; ±%15). Fiyat
          panolarında kaynak ibaresi zorunludur: "Kaynak: Ankara BB Hal
          Müdürlüğü · liste tarihi". Kaynağa erişilemezse son başarılı veri
          "son güncelleme" damgasıyla gösterilir.
        </p>
      </div>
    </main>
  );
}
