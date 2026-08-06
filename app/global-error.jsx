"use client";
// Kök layout dahi çökerse gösterilen son savunma hattı (kendi html/body'sini kurar).
export default function GlobalHata({ reset }) {
  return (
    <html lang="tr">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", margin: 0, background: "#fff", color: "#16211b" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ letterSpacing: ".14em", fontSize: 12, fontWeight: 700, color: "#b45309", textTransform: "uppercase" }}>Beklenmeyen hata</p>
          <h1 style={{ fontSize: 26, margin: "8px 0 12px" }}>Bir şeyler ters gitti</h1>
          <p style={{ color: "#4b5a52", maxWidth: 380, margin: "0 auto 20px" }}>
            Uygulama kabuğu yüklenemedi. Sayfayı yenilemeyi deneyin.
          </p>
          <button onClick={() => reset()} style={{ background: "#25714f", color: "#fff", border: 0, borderRadius: 10, padding: "12px 22px", fontWeight: 600, cursor: "pointer" }}>
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  );
}
