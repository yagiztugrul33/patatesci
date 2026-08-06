"use client";
// Yakalanmamış istemci/render hatasında marka dilinde zarif düşüş sayfası.
export default function Hata({ error, reset }) {
  return (
    <main className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 520 }}>
        <p className="eyebrow">Beklenmeyen hata</p>
        <h1 style={{ fontSize: "1.8rem", marginTop: 8 }}>Bir şeyler ters gitti</h1>
        <p className="muted" style={{ margin: "14px auto 24px", maxWidth: 400 }}>
          Sayfa yüklenirken bir sorun oluştu. Tekrar deneyebilir veya ana
          sayfaya dönebilirsin; sorun kayda geçti.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => reset()}>Tekrar dene</button>
          <a href="/" className="btn btn-outline">Ana sayfa</a>
        </div>
      </div>
    </main>
  );
}
