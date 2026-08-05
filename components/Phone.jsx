// Telefon mockup çerçevesi — gerçek uygulama ekranı hissi:
// durum çubuğu (saat, sinyal, wifi, pil) ve çentik dahil.

function SinyalSvg() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true" fill="currentColor">
      <rect x="0" y="7" width="2.4" height="4" rx="0.8" />
      <rect x="4" y="5" width="2.4" height="6" rx="0.8" />
      <rect x="8" y="2.5" width="2.4" height="8.5" rx="0.8" />
      <rect x="12" y="0" width="2.4" height="11" rx="0.8" opacity="0.35" />
    </svg>
  );
}

function WifiSvg() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1.5 4A8.5 8.5 0 0 1 12.5 4" />
      <path d="M3.6 6.4a5.5 5.5 0 0 1 6.8 0" />
      <circle cx="7" cy="9" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PilSvg() {
  return (
    <svg width="20" height="11" viewBox="0 0 20 11" aria-hidden="true">
      <rect x="0.5" y="0.5" width="16" height="10" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <rect x="2" y="2" width="11" height="7" rx="1.4" fill="currentColor" />
      <rect x="18" y="3.5" width="2" height="4" rx="1" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

// PERFORMANS: durum çubuğundaki üç ikon (sinyal/wifi/pil) her mockup'ta
// tekrarlanıyordu — 10 mockup × 3 SVG ≈ 30 gereksiz SVG. Hero'daki mockup
// (ürün anlatımının kalbi) TAM kalır; fold altındakiler `sade` moduyla
// ikonları CSS çubuklarıyla temsil eder: aynı görsel etki, ~0 DOM maliyeti.
export default function Phone({ children, dark = false, className = "", sade = false }) {
  return (
    <div className={"phone " + className}>
      <div className={"screen" + (dark ? " screen-dark" : "")}>
        <div className="sb">
          <span className="sb-time num">09:41</span>
          <span className="notch-pill" aria-hidden="true" />
          {sade ? (
            <span className="sb-icons sb-sade" aria-hidden="true" />
          ) : (
            <span className="sb-icons">
              <SinyalSvg />
              <WifiSvg />
              <PilSvg />
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
