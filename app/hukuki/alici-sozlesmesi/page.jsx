import TaslakUyari from "../TaslakUyari";

export const metadata = {
  title: "Alıcı Sözleşmesi",
  description:
    "Toptan alıcılar için teklif, ödeme, teslim alma, kontrol ve itiraz koşulları.",
};

export default function AliciSozlesmesi() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Alıcı Sözleşmesi</h1>
        <TaslakUyari />

        <h2>1. Kapsam</h2>
        <p>
          Bu sözleşme, Platformda teklif veren/satın alan işletmenin ("Alıcı")
          yükümlülüklerini düzenler; <a href="/hukuki/kullanici-sozlesmesi">Üyelik
          Sözleşmesi</a> ve <a href="/hukuki/ticaret-kurallari">Şeffaf Ticaret
          Kuralları</a> ile birlikte hüküm doğurur. Asgari işlem 1 tondur;
          tüketici işlemleri bu sözleşmenin değil{" "}
          <a href="/hukuki/mesafeli-satis">Mesafeli Satış Sözleşmesi</a>'nin konusudur.
        </p>

        <h2>2. Teklif ve bloke</h2>
        <p>
          Teklif bağlayıcıdır; teklif anında bedelin %5'i (yüksek skorlu üyede
          %2) bloke edilir. Eşleşen teklifin ödemesine geçilmemesi "yalandan
          teklif" cezasına (%2) tabidir.
        </p>

        <h2>3. Ödeme</h2>
        <p>
          Ödeme peşindir ve teslim onayına kadar güvence hesabında tutulur.
          Ton bazlı işlemlerde tahsilat havale/EFT ile yapılır (kart yalnız
          100.000 ₺ altı perakende istisnasında). Fiyat, ödemenin güvenceye
          alındığı anda mutlak kilitlenir; sonrasında piyasa itirazı geçersizdir.
        </p>

        <h2>4. Teslim alma ve kontrol</h2>
        <p>
          Alıcı, varışta tartı kontrolü ve gözle muayene yapmakla yükümlüdür.
          Teslim Anı Protokolü'nün 4 adımı tamamlanmadan dijital imza aktif
          olmaz; imza kesin kabul hükmündedir. İmza sonrası yalnız 6 saat içinde
          ve kesim/açma videosu kanıtıyla gizli ayıp bildirimi yapılabilir.
        </p>

        <h2>5. Haksız red ve cezalar</h2>
        <p>
          Varışta haklı gerekçesiz red, hakem sürecinde haksız bulunursa bedelin
          %5'i + çift yön nakliye Alıcıdan tahsil edilir ve mal bedeli satıcıya
          ödenir. Yanlış kat/asansör beyanında gerçek hizmet bedeli farkı + %25
          ceza uygulanır.
        </p>

        <h2>6. İtiraz ve hakem</h2>
        <p>
          Red halinde 24 saatlik kanıt penceresi açılır; hakem en geç 48 saatte
          gerekçeli karar verir. Kanıtı eksik olan taraf aleyhine karine uygulanır.
        </p>
      </div>
    </main>
  );
}
