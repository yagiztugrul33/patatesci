export const metadata = {
  title: "Mesafeli Satış Sözleşmesi | patatesci — Tarımsal Ürün Ticaret Platformu",
  description: "patatesci platformu mesafeli satış sözleşmesi.",
};

import TaslakUyari from "../TaslakUyari";

export default function MesafeliSatis() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Mesafeli Satış Sözleşmesi</h1>
        <TaslakUyari />
        <h2>1. Kapsam ayrımı</h2>
        <p>
          Bu sözleşme yalnız <b>tüketici</b> sıfatıyla yapılan işlemler (6502
          sayılı Kanun kapsamı — "kapıya teslimat" ve mahalle toplu alımındaki
          tüketici bacağı) için geçerlidir. İki tarafı da ticari/mesleki amaçla
          hareket eden ton bazlı toptan işlemler tüketici mevzuatına değil,{" "}
          <a href="/hukuki/alici-sozlesmesi">Alıcı Sözleşmesi</a> ve TTK
          hükümlerine tabidir.
        </p>
        <h2>2. Satıcı kimliği</h2>
        <p>
          Tüketici işlemlerinde satıcı, ilanda kimliği gösterilen üretici/esnaftır;
          Platform aracı hizmet sağlayıcıdır. Satıcının unvan ve iletişim bilgisi
          sipariş özetinde ve faturada yer alır.
        </p>
        <h2>3. Cayma hakkı</h2>
        <p>
          Mesafeli Sözleşmeler Yönetmeliği uyarınca <b>çabuk bozulabilen ve son
          kullanma tarihi geçebilecek malların teslimine ilişkin sözleşmelerde
          cayma hakkı kullanılamaz</b>; yaş sebze-meyve bu kapsamdadır. Ayıplı
          ifa halinde tüketicinin 6502 kapsamındaki seçimlik hakları saklıdır ve
          platformun tartı/kalite güvence mekanizmaları tüketici lehine ek olarak
          uygulanır.
        </p>
        <h2>4. Teslimat ve bedel iadesi</h2>
        <p>
          Teslim süresi ve bedeli sipariş ekranında gösterilir. İade gereken
          hallerde bedel, güvence hesabından ödeme yapılan yönteme iade edilir
          (hedef: hakem kararını izleyen 3 iş günü — avukat teyidiyle netleşecek).
        </p>
        <h2>5. Uyuşmazlık</h2>
        <p>
          Tüketici, Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvuru
          hakkına sahiptir; platform içi hakem süreci bu hakları ortadan kaldırmaz.
        </p>
      </div>
    </main>
  );
}
