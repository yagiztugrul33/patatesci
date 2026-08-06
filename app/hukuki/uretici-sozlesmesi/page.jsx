import TaslakUyari from "../TaslakUyari";

export const metadata = {
  title: "Satıcı / Üretici Sözleşmesi",
  description:
    "Üretici ve satıcılar için ilan, beyan, tartı, teslim ve hakediş koşulları.",
};

export default function UreticiSozlesmesi() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Satıcı / Üretici Sözleşmesi</h1>
        <TaslakUyari />

        <h2>1. Kapsam</h2>
        <p>
          Bu sözleşme, Platformda ilan veren üretici/satıcının ("Satıcı")
          yükümlülüklerini düzenler; <a href="/hukuki/kullanici-sozlesmesi">Üyelik
          Sözleşmesi</a>'nin ve <a href="/hukuki/ticaret-kurallari">Şeffaf Ticaret
          Kuralları</a>'nın ekidir.
        </p>

        <h2>2. İlan ve beyan doğruluğu</h2>
        <p>
          Satıcı; çeşit, kalite sınıfı, menşe, tonaj, hasat tarihi ve ambalaj
          beyanlarının doğruluğundan sorumludur. Kalite sınıfı beyanı hakem
          sürecinde çürütülürse sınıf farkı indirimi satıcı güvencesinden ödenir.
          Menşe beyanı zorunludur; uydurma menşe ilan reddi sebebidir.
        </p>

        <h2>3. Fiyat bandı</h2>
        <p>
          İlan fiyatı, Ankara hal referanslı ürün + kalite bazlı bandın (±%15,
          kalite katsayılı) içinde olmalıdır. Bant dışı ilan sistemce reddedilir.
          Eşleşme anında referans %3'ten fazla oynadıysa işlem iki taraflı
          yeniden onaya düşer; onaylamayan cezasız cayar.
        </p>

        <h2>4. Tartı ve teslim</h2>
        <p>
          Yükleme kantar fişi damgalı olmak zorundadır. Varış tartısında ürün
          bazlı yol firesi toleransı aşan eksik çıkarsa, eksiğin iki katı alıcıya
          iade edilir. Teslimat hizmet seviyesi (S0–S4) taahhüdü verilip
          yerine getirilmezse hizmet bedeli iadesi + aynı tutarda ceza uygulanır.
        </p>

        <h2>5. Hakediş ve ödeme</h2>
        <p>
          Alıcının ödemesi peşin tahsil edilip güvence hesabında bekletilir;
          teslim onayı (veya hakem kararı) ile komisyon düşülerek Satıcıya
          aktarılır. Ödeme akışının ayrıntısı{" "}
          <a href="/hukuki/guvenceli-odeme">Güvenceli Ödeme Şartları</a>'ndadır.
          Satıcıya vade, çek veya açık hesap riski yansıtılmaz.
        </p>

        <h2>6. Belgeler</h2>
        <p>
          HKS bildirimi, künye eşleşmesi, e-irsaliye ve müstahsil makbuzu/e-fatura
          süreçleri Platform üzerinden yürütülür; Satıcı istenen bilgileri doğru
          ve zamanında sağlamakla yükümlüdür. (Gerçek entegrasyonlar Faz 2 —
          o tarihe kadar adımlar temsilî yürür ve ekranda böyle etiketlenir.)
        </p>

        <h2>7. İptal ve cezalar</h2>
        <p>
          Yükleme öncesi iptalde bedelin %2'si, mal yoldayken iptalde %5'i +
          nakliye bedeli karşı tarafa tazminat olarak satıcı güvencesinden
          ödenir; skor düşer. Ceza matrisi iki taraflıdır ve kural kitabında
          herkese açıktır.
        </p>

        <h2>8. Vergisel durum</h2>
        <p>
          Satıcının müstahsil/mükellef statüsüne göre stopaj ve belge düzeni
          uygulanır. Kesin vergi rejimi mali müşavir teyidine tabidir (TASLAK —
          bkz. docs/KURULUS.md soru listesi).
        </p>
      </div>
    </main>
  );
}
