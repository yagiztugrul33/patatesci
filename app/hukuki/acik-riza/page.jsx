import TaslakUyari from "../TaslakUyari";

export const metadata = {
  title: "Açık Rıza Metni",
  description:
    "KVKK kapsamında açık rızaya tabi işleme faaliyetleri için rıza metni.",
};

export default function AcikRiza() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Açık Rıza Metni</h1>
        <TaslakUyari />
        <p>
          Aşağıdaki işleme faaliyetleri sözleşmenin ifası için zorunlu değildir
          ve yalnız <b>ayrıca ve özgürce verilmiş açık rızanızla</b> yürütülür.
          Rıza vermemeniz platform hizmetlerinden yararlanmanıza engel değildir;
          rızanızı dilediğiniz an <a href="/hukuki/iletisim">iletişim sayfası</a>{" "}
          üzerinden geri alabilirsiniz.
        </p>
        <h2>Rızaya tabi faaliyetler</h2>
        <p>
          <b>(a) Ticari elektronik ileti:</b> kampanya, bölge açılışı ve ürün
          duyurularının e-posta/SMS ile gönderimi (6563 sayılı Kanun ve Ticari
          İletişim Yönetmeliği kapsamında; İYS kaydıyla birlikte yürütülür).
        </p>
        <p>
          <b>(b) Tanıtım içeriklerinde görünürlük:</b> üreticinin tarladan canlı
          video/fotoğraf içeriklerinin, üretici hikayesi olarak tanıtımda
          kullanılması.
        </p>
        <p>
          <b>(c) İsteğe bağlı analitik çerezler:</b>{" "}
          <a href="/hukuki/cerez-politikasi">Çerez Politikası</a>'nda açıklanan,
          zorunlu olmayan ölçüm çerezleri.
        </p>
        <p>
          Rıza kayıtları saat damgasıyla saklanır; geri alma ileriye etkilidir.
        </p>
      </div>
    </main>
  );
}
