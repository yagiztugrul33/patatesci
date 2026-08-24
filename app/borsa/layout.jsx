import { JetBrains_Mono } from "next/font/google";
import "./terminal.css";

// Enstrüman sesi (kolon başlığı, etiket, durum) mono ile taşınır. Kaynak
// tasarımdaki Geist Mono yerine belgede önerilen ikame: JetBrains Mono.
// Yalnız bu rotanın layout'unda tanımlı — site genelinde indirilmez.
// latin-ext altkümesi Türkçe ş/ğ/İ için zorunlu.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: "Borsa | patatesci — Tarımsal Ürün Ticaret Platformu",
  description:
    "Tarımsal ürünlerde canlı piyasa fiyatları, PTX Endeksi, emir defteri ve teklif işlemleri. Şeffaf fiyat, güvenceli işlem.",
  robots: { index: false, follow: false },
};

export default function BorsaLayout({ children }) {
  return <div className={`trm ${mono.variable}`}>{children}</div>;
}
