export const metadata = {
  title: "Nakliye Sorumluluk Özeti",
  description: "Taşıma seçeneklerine göre sorumluluk dağılımına ilişkin özet şartlar.",
};

export default function NakliyeSorumluluk() {
  return (
    <main className="section">
      <div className="container legal">
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Nakliye Sorumluluk Özeti</h1>
        <p>
          Üreticinin aracı, tarladan gel-al ve anlaşmalı nakliyeci seçeneklerinde
          taşıma sırasındaki hasar, gecikme ve sigorta sorumluluklarının dağılımı
          bu sayfada yer alacaktır.
        </p>
        <p>Bu metin avukat onayı sonrası yayınlanacaktır.</p>
      </div>
    </main>
  );
}
