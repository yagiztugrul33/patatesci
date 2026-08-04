import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import { SITE_URL } from "../lib/site";

// Yazı tipi self-host edilir (next/font): render bloklayan istek ve font-swap
// kaynaklı layout kayması (CLS) ortadan kalkar.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "patatesçi — Tarladan işletmene, aracısız toptan tedarik",
    template: "%s | patatesçi",
  },
  description:
    "Üreticiden esnafa, restorana, markete ve ihracatçıya doğrudan toptan sebze-meyve. Hasat ilanı, tarladan canlı video, peşin-güvenceli ödeme, künye/HKS uyumu. 81 ilde kuruluyor.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "patatesçi",
    title: "patatesçi — Tarladan işletmene, aracısız toptan tedarik",
    description:
      "Hasat ilanı, tarladan canlı video, peşin-güvenceli ödeme. Komisyoncu yok, vade yok. 81 ilde kuruluyor — uygulama yakında.",
  },
  twitter: {
    card: "summary_large_image",
    title: "patatesçi — Tarladan işletmene, aracısız toptan tedarik",
    description:
      "Üreticiden işletmeye doğrudan toptan tedarik. 81 ilde kuruluyor — uygulama yakında.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <Nav />
        {children}
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div>
                <b style={{ color: "var(--ink)" }}>patatesçi</b>
                <p style={{ marginTop: 6, maxWidth: 320 }}>
                  Tarladan işletmeye toptan tedarik ağı. Üretici ile toptan
                  alıcıyı doğrudan, güvenceli ve mevzuata uygun şekilde buluşturur.
                </p>
              </div>
              <div className="footer-links">
                <Link href="/hukuki/kvkk">KVKK Aydınlatma Metni</Link>
                <Link href="/hukuki/kullanici-sozlesmesi">Kullanıcı Sözleşmesi</Link>
                <Link href="/hukuki/mesafeli-satis">Mesafeli Satış Sözleşmesi</Link>
                <Link href="/hukuki/iletisim">İletişim</Link>
                <Link href="/borsa">Demo</Link>
              </div>
            </div>
            <div className="footer-note">
              Uygulama geliştirme aşamasındadır; bu site tanıtım amaçlıdır. Tüm
              işlemler Hal Kayıt Sistemi (HKS) bildirimi ve künye takibi ile
              yürütülecek, ödemeler teslimat onaylanana kadar güvence hesabında
              tutulacaktır.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
