export const metadata = {
  title: "Güvenceli Ödeme Şartları",
  description: "Peşin-güvenceli ödeme modelinin işleyişine ilişkin şartlar.",
};

import TaslakUyari from "../TaslakUyari";

export default function GuvenceliOdeme() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Güvenceli Ödeme Şartları</h1>
        <TaslakUyari />
        <h2>1. Model</h2>
        <p>
          Alıcının ödemesi işlem kesinleştiği anda <b>peşin</b> tahsil edilir ve
          teslim onayına (veya hakem kararına) kadar <b>güvence hesabında</b>{" "}
          bekletilir. patatesci ödeme kuruluşu değildir; tahsilat ve emanet, 6493
          sayılı Kanun kapsamında lisanslı bir ödeme kuruluşunun pazaryeri/emanet
          altyapısı üzerinden yürütülür (sağlayıcı sözleşmesi imzalandığında bu
          sayfada unvanıyla ilan edilir; değerlendirme: iyzico Pazaryeri —
          taslak notu).
        </p>
        <h2>2. Akış</h2>
        <p>
          Tahsilat → güvence blokesi → teslim onayı → komisyon düşülerek
          satıcıya aktarım. Her adım sipariş geçmişinde saat damgalı işlem
          numarasıyla görünür. Demo ortamında bu hareketler "demo" etiketlidir ve
          gerçek para içermez.
        </p>
        <h2>3. Fiyat kilidi</h2>
        <p>
          Bedel güvenceye alındığı anda birim fiyat mutlak kilitlenir; sonraki
          piyasa hareketleri işlem bedelini değiştirmez.
        </p>
        <h2>4. Tahsilat yöntemleri</h2>
        <p>
          Ton bazlı işlemlerde havale/EFT esastır; kart yalnız 100.000 ₺ altı
          perakende istisnasında kullanılabilir. Ödeme kuruluşu kesintisi işlem
          özetinde ayrı satır olarak gösterilir.
        </p>
        <h2>5. İade halleri</h2>
        <p>
          İptal (kademeli ceza mahsuplu), eksik tartı (eksiğin 2 katı), kalite
          ihlali (sınıf farkı indirimi) ve hakem kararıyla belirlenen diğer
          hallerde iade güvence hesabından yapılır. İade süresi hedefi hakem
          kararını izleyen 3 iş günüdür (PSP sözleşmesiyle netleşecek — TASLAK).
        </p>
        <h2>6. Sevkiyat sigortası</h2>
        <p>
          1 ton üzeri işlemlerde sevkiyat sigortası varsayılan açıktır; prim
          temsilîdir ve broker teyidine tabidir. Ayrıntı:{" "}
          <a href="/hukuki/guvence-sistemi">Güvence Sistemi</a>.
        </p>
      </div>
    </main>
  );
}
