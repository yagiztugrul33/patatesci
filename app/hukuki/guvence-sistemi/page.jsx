export const metadata = {
  title: "Güvence Sistemi — Sigorta ve Teminat",
  description:
    "patatesci güvence katmanları: emtia nakliyat sigortası, taşıyıcı sorumluluğu, TARSİM teşviki, teminat mektubu ve nakit teminat — hiçbir aşamada açıkta mal, para veya sorumluluk kalmaz.",
};

export default function GuvenceSistemi() {
  return (
    <main className="section">
      <div className="container legal" style={{ maxWidth: 820 }}>
        <p className="eyebrow">Herkese açık</p>
        <h1>Güvence Sistemi — Sigorta ve Teminat</h1>
        <p style={{ background: "var(--amber-soft)", color: "var(--amber-koyu)", borderRadius: 10, padding: "10px 14px", fontWeight: 600 }}>
          TASLAK — avukat ve sigorta brokeri onayı öncesi taslaktır. Prim ve
          kapsam kalemleri broker teyidine kadar "temsili" etiketlidir.
        </p>
        <p>
          İlkemiz: <b>hiçbir aşamada açıkta mal, para veya sorumluluk kalmasın.</b>
          Bir işlemin her adımı (ilan → eşleşme → yükleme → yol → teslim → ödeme)
          için riski kapatan araç önceden bellidir ve maliyeti Şeffaf Maliyet
          Dökümü'nde ayrı kalem olarak görünür.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>Güvence katmanları</h2>
        <div style={{ overflowX: "auto", margin: "12px 0 20px" }}>
          <table className="table">
            <thead><tr><th>Aşama</th><th>Risk</th><th>Kapatan araç</th><th>Kim öder</th></tr></thead>
            <tbody>
              <tr><td>İlan</td><td>Sahte ilan / hasat afeti</td><td>KYC + künye + satıcı teminatı; üretici tarafında TARSİM (devlet destekli, patates dahil bazı ürünlerde %70 prim desteği)</td><td>Satıcı / üretici</td></tr>
              <tr><td>Eşleşme</td><td>Cayma, mal yüklenmemesi</td><td>Fiyat kilidi + güvence hesabı + kademeli cezalar</td><td>Cayan taraf</td></tr>
              <tr><td>Yol</td><td>Hasar, kayıp, kaza</td><td>Sevkiyat başına emtia nakliyat sigortası (1 ton üzeri varsayılan AÇIK); nakliyeci kusurunda taşıyıcı sorumluluk poliçesine rücu</td><td>Prim: alıcı (ayrı kalem)</td></tr>
              <tr><td>Teslim</td><td>Haksız red / hile</td><td>Teslim Anı Protokolü + hakem + ceza matrisi</td><td>Haksız çıkan</td></tr>
              <tr><td>Ödeme</td><td>Ters ibraz, arıza</td><td>Güvence hesabı + imzalı irsaliye kanıt seti + siber sigorta</td><td>Platform / haksız taraf</td></tr>
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>Sevkiyat sigortası kuralı</h2>
        <p>
          1 tondan büyük işlemlerde sevkiyat sigortası <b>varsayılan olarak
          açıktır</b>; alıcı, "yol riski bana geçer" uyarısını onaylayarak
          kapatabilir. Gel-al'da sigorta zorunlu değildir ve risk alıcıdadır —
          bu iki durum, sistemin bilinçli ve yazılı tek açık riskidir. Hasar
          yolda oluşursa önce nakliyat poliçesi öder; kusur nakliyecideyse
          taşıyıcı sorumluluk poliçesine rücu edilir. Nakliyeciler platforma
          K1 yetki belgesi ve sorumluluk poliçesi ibrazıyla kabul edilir.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>Teminat araçları</h2>
        <p>
          Satıcı teminatı: min 5.000 ₺ veya işlem bedelinin %5'i. Büyük ve
          düzenli çalışanlar için <b>kesin banka teminat mektubu</b> nakit
          teminata tam ikamedir (banka teyidi şart; tutar ≥ nakit teminat;
          bankaların yıllık komisyonu piyasada yaklaşık %1,25–2,5 + BSMV).
          Teminat, üyelik çıkışında son teslimden 30 gün sonra ve açık
          itiraz/borç yoksa iade edilir. <b>Vade yok ilkesi:</b> DBS ve açık
          hesap talepleri reddedilir; teminat mektubu ödemeyi geciktirmez,
          garanti eder. Alacak sigortasına bu yüzden ihtiyaç yoktur — vadeli
          alacak hiç doğmaz.
        </p>

        <h2 style={{ fontSize: "1.3rem", margin: "26px 0 8px" }}>Sigorta aracılığı hakkında dürüst not</h2>
        <p>
          5684 sayılı Sigortacılık Kanunu gereği sigorta aracılığı lisansa
          (TOBB levha kaydı + uygunluk belgesi) tabidir. patatesci lisanssız
          hiçbir prim payı almaz; poliçeler anlaşmalı acente ortaklığıyla
          düzenlenir. Ayrıntılar ve kaynaklar: docs/sigorta-ve-teminat.md
          (depoda herkese açık).
        </p>
      </div>
    </main>
  );
}
