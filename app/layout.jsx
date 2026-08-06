import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";
import Logo from "../components/Logo";
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
    default: "patatesci — Tarladan işletmene, aracısız toptan tedarik",
    template: "%s | patatesci",
  },
  description:
    "Üreticiden esnafa, restorana, markete ve ihracatçıya doğrudan toptan sebze-meyve. Hasat ilanı, tarladan canlı video, peşin-güvenceli ödeme, künye/HKS uyumu. 81 ilde kuruluyor.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "patatesci",
    title: "patatesci — Tarladan işletmene, aracısız toptan tedarik",
    description:
      "Hasat ilanı, tarladan canlı video, peşin-güvenceli ödeme. Komisyoncu yok, vade yok. 81 ilde kuruluyor — uygulama yakında.",
  },
  twitter: {
    card: "summary_large_image",
    title: "patatesci — Tarladan işletmene, aracısız toptan tedarik",
    description:
      "Üreticiden işletmeye doğrudan toptan tedarik. 81 ilde kuruluyor — uygulama yakında.",
  },
  // Search Console doğrulaması: operatör Vercel'e GOOGLE_SITE_VERIFICATION
  // env değişkenini ekleyince meta etiketi kendiliğinden basılır; kod değişmez.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
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
                <Logo variant="full" slogan="eve" size={24} />
                <p style={{ marginTop: 10, maxWidth: 320 }}>
                  Tarladan işletmeye toptan tedarik ağı. Üretici ile toptan
                  alıcıyı doğrudan, güvenceli ve mevzuata uygun şekilde buluşturur.
                </p>
              </div>
              <div className="footer-links">
                <Link href="/hukuki/ticaret-kurallari">Şeffaf Ticaret Kuralları</Link>
                <Link href="/hukuki/sss">SSS</Link>
                <Link href="/hukuki/kvkk">KVKK</Link>
                <Link href="/hukuki/kullanici-sozlesmesi">Kullanıcı Sözleşmesi</Link>
                <Link href="/hukuki/mesafeli-satis">Mesafeli Satış</Link>
                <Link href="/hukuki/satis-sozlesmesi">Satış Sözleşmesi Şablonu</Link>
                <Link href="/hukuki/guvence-sistemi">Güvence Sistemi (Sigorta & Teminat)</Link>
                <Link href="/hukuki/guvenceli-odeme">Güvenceli Ödeme Şartları</Link>
                <Link href="/hukuki/tarti-tolerans">Tartı Toleransı ve İtiraz</Link>
                <Link href="/hukuki/nakliye-sorumluluk">Nakliye Sorumluluğu</Link>
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
