import TaslakUyari from "../TaslakUyari";

export const metadata = {
  title: "Çerez Politikası",
  description:
    "patatesci platformunda kullanılan çerezler ve yönetim seçenekleri.",
};

export default function CerezPolitikasi() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Çerez Politikası</h1>
        <TaslakUyari />
        <h2>1. Mevcut durum</h2>
        <p>
          patatesci bugün <b>yalnız zorunlu çerez</b> kullanır: oturum çerezi
          (güvenli, HttpOnly — demo hesabınızın açık kalması için). Reklam,
          takip veya üçüncü taraf pazarlama çerezi <b>yoktur</b>; bu nedenle
          sitede çerez onay bandı gösterilmez (zorunlu çerezler KVKK ve Kurul
          rehberine göre rızaya tabi değildir).
        </p>
        <h2>2. İleride eklenirse</h2>
        <p>
          Gizlilik dostu, kimliksizleştirilmiş ölçüm (analitik) eklenmesi
          planlanmaktadır. Çerez kullanan bir analitik araç seçilirse bu sayfa
          güncellenir ve zorunlu olmayan çerezler yalnız{" "}
          <a href="/hukuki/acik-riza">açık rıza</a> ile (onay bandı üzerinden)
          çalışır.
        </p>
        <h2>3. Yönetim</h2>
        <p>
          Zorunlu oturum çerezini tarayıcı ayarlarından silebilirsiniz; bu
          durumda oturumunuz kapanır. Çerez tablosu (ad, amaç, süre) gerçek PSP
          ve analitik entegrasyonlarıyla birlikte bu sayfada yayımlanacaktır.
        </p>
      </div>
    </main>
  );
}
