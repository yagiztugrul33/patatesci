export const metadata = {
  title: "KVKK Aydınlatma Metni | patatesci — Tarımsal Ürün Ticaret Platformu",
  description: "patatesci platformu kişisel verilerin korunması aydınlatma metni.",
};

import TaslakUyari from "../TaslakUyari";

export default function Kvkk() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>KVKK Aydınlatma Metni</h1>
        <TaslakUyari />
        <p>
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
          m.10 uyarınca veri sorumlusu sıfatıyla patatesci platformunu işleten
          şirket (unvan ve adres, şirket kuruluşuyla eklenecek) tarafından yapılan
          aydınlatmadır.
        </p>
        <h2>1. İşlenen veriler ve amaçlar</h2>
        <p>
          <b>Ön kayıt:</b> e-posta, rol, il/ilçe — bölge açılışında bilgilendirme.{" "}
          <b>Üyelik:</b> ad-soyad/unvan, e-posta, rol, doğrulama belgeleri
          (künye/ÇKS/vergi) — üyeliğin kurulması ve mevzuat yükümlülükleri (HKS
          bildirimi dahil). <b>İşlem:</b> teklif, sipariş, ödeme hareket izi,
          tartı/teslim kayıtları — sözleşmenin ifası, uyuşmazlık çözümü.{" "}
          <b>Teknik:</b> IP ve erişim kayıtları — güvenlik ve 5651 sayılı Kanun
          yükümlülükleri.
        </p>
        <h2>2. Hukuki sebepler</h2>
        <p>
          Sözleşmenin kurulması/ifası (KVKK m.5/2-c), hukuki yükümlülük
          (m.5/2-ç), meşru menfaat (m.5/2-f) ve gerektiğinde açık rıza (bkz.{" "}
          <a href="/hukuki/acik-riza">Açık Rıza Metni</a>).
        </p>
        <h2>3. Aktarım</h2>
        <p>
          Veriler; barındırma sağlayıcısı (Vercel), ödeme akışı kurulduğunda
          lisanslı ödeme kuruluşu ve yasal zorunluluk halinde yetkili kurumlarla,
          amaçla sınırlı olarak paylaşılır. Yurt dışı aktarım (barındırma) için
          KVKK m.9 rejimi avukat teyidine tabidir (TASLAK).
        </p>
        <h2>4. Saklama</h2>
        <p>
          Ön kayıt verisi, bölge açılışı bilgilendirmesi sonrası veya talep
          üzerine silinir. İşlem ve fatura kayıtları vergi ve ticaret mevzuatındaki
          asgari sürelerce saklanır.
        </p>
        <h2>5. Haklarınız (KVKK m.11)</h2>
        <p>
          Verilerinize erişme, düzeltme, silme, aktarımı öğrenme ve itiraz
          haklarınızı <a href="/hukuki/iletisim">iletişim sayfası</a> üzerinden
          kullanabilirsiniz; başvurular 30 gün içinde yanıtlanır. VERBİS kaydı,
          yükümlülük doğduğu anda tamamlanacaktır (bkz. docs/KURULUS.md).
        </p>
      </div>
    </main>
  );
}
