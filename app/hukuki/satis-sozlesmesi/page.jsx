export const metadata = {
  title: "Satış Özeti Sözleşmesi Şablonu",
  description: "Her eşleşmede otomatik üretilen Satış Özeti Sözleşmesi'nin herkese açık şablonu.",
};

export default function SatisSozlesmesi() {
  return (
    <main className="section">
      <div className="container legal" style={{ maxWidth: 760 }}>
        <p className="eyebrow">Hukuki bilgilendirme</p>
        <h1>Satış Özeti Sözleşmesi — Şablon</h1>
        <p style={{ background: "var(--amber-soft)", color: "var(--amber-koyu)", borderRadius: 10, padding: "10px 14px", fontWeight: 600 }}>
          TASLAK — avukat onayı öncesi taslaktır.
        </p>
        <p>
          Her eşleşmede aşağıdaki alanlarla otomatik üretilir ve iki tarafça
          uygulama içinde saat damgalı onaylanır:
        </p>
        <ol style={{ color: "var(--ink2)", paddingLeft: 20, fontSize: ".95rem", display: "grid", gap: 8 }}>
          <li><b>Taraflar:</b> satıcı ve alıcı unvanları, künye/vergi kimlikleri.</li>
          <li><b>Ürün:</b> ürün / çeşit / kalite sınıfı / kalibre (beyan bağlayıcıdır).</li>
          <li><b>Miktar ve fiyat:</b> ton, ₺/kg (eşleşme anında kilitli), toplam bedel.</li>
          <li><b>Teslimat seviyesi:</b> S0–S4, adres, kat/asansör beyanı ve hizmet bedeli; yanlış beyanda fark + %25, taahhüt ihlalinde iade + aynı tutar ceza.</li>
          <li><b>Tartı doğrulama planı:</b> kantar / örneklem yöntemi ve yol firesi toleransı.</li>
          <li><b>Sigorta durumu:</b> sevkiyat sigortası açık/feragat; feragatte yol riskinin alıcıda olduğu kaydı.</li>
          <li><b>Nakliye:</b> yöntem, bedel, ödeyen.</li>
          <li><b>İptal-ceza matrisi özeti:</b> Şeffaf Ticaret Kuralları B3 bu sözleşmenin ayrılmaz ekidir.</li>
          <li><b>Hakem şartı:</b> uyuşmazlıklar önce platform hakem sürecinde (24 saat kanıt + 48 saat gerekçeli karar + 1 üst itiraz) çözülür.</li>
          <li><b>Onaylar:</b> iki tarafın saat damgalı uygulama içi onayı; teslimde dijital irsaliye imzası kesin kabuldür.</li>
        </ol>
        <p style={{ marginTop: 14 }}>Bu şablon avukat onayı sonrası nihai halini alacaktır.</p>
      </div>
    </main>
  );
}
