import { SSS } from "../../../lib/sss.mjs";

export const metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "patatesci şeffaf ticaret sistemi hakkında en kritik 20 soru: tartı doğrulama, kalite itirazı, iptal cezaları, teslim anı protokolü, hakem süreci, ödeme güvencesi.",
};

export default function SssSayfasi() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-head">
          <p className="eyebrow">Senaryo kataloğundan üretildi</p>
          <h1 style={{ fontSize: "1.8rem" }}>Sık Sorulan Sorular</h1>
          <p className="muted" style={{ marginTop: 10 }}>
            Bu 20 cevabın her biri, herkese açık Şeffaf Ticaret Kuralları'na ve
            64 senaryoluk kataloğa dayanır.
          </p>
        </div>
        <div className="acc">
          {SSS.map((it, i) => (
            <details key={i} className="acc-item" name="sss" open={i === 0 || undefined}>
              <summary className="acc-head">{it.q}<span className="acc-icon">+</span></summary>
              <div className="acc-body"><p>{it.a}</p></div>
            </details>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/hukuki/ticaret-kurallari" className="btn btn-outline">Kural kitabının tamamını oku</a>
        </p>
      </div>
    </main>
  );
}
