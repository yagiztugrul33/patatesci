import Link from "next/link";

export const metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: false },
};

// Marka dilinde 404 — enerjik tanıtım tonu, çizgi stili ikon (emoji yasak).
export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ textAlign: "center", maxWidth: 560 }}>
        <svg
          width="72"
          height="72"
          viewBox="0 0 64 64"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ margin: "0 auto 18px", display: "block" }}
        >
          <path d="M32 59C32 59 13 42 13 28 13 17.5 21.5 9.5 32 9.5s19 8 19 18.5C51 42 32 59 32 59Z" />
          <path d="M26 26l4 4m0-4l-4 4M34 26l4 4m0-4l-4 4" />
          <path d="M26 38c2 2.4 4 3.5 6 3.5s4-1.1 6-3.5" transform="rotate(180 32 39.75)" />
        </svg>
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: "2rem", marginTop: 8 }}>Bu tarlada o ürün yok</h1>
        <p className="muted" style={{ margin: "14px auto 26px", maxWidth: 420 }}>
          Aradığın sayfa taşınmış ya da hiç ekilmemiş olabilir. Ana sayfadan
          taze olanlara bakabilir veya canlı kataloğa geçebilirsin.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">Ana sayfaya dön</Link>
          <Link href="/katalog" className="btn btn-outline">Canlı kataloğu aç</Link>
        </div>
      </div>
    </main>
  );
}
