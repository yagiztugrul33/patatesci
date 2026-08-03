import Link from "next/link";
import "./globals.css";
import Nav from "../components/Nav";
import { SITE_URL } from "../lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "patatesçi — Türkiye'nin sebze-meyve ağı kuruluyor",
    template: "%s | patatesçi",
  },
  description:
    "Mahallenin manavı, pazarcısı, üreticisi tek uygulamada. Sipariş ver; en yakın onaylı esnaf kapına getirsin. 81 ilde kuruluyoruz — uygulama yakında.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "patatesçi",
    title: "patatesçi — Türkiye'nin sebze-meyve ağı kuruluyor",
    description:
      "Mahallenin esnafı tek uygulamada. En yakın onaylı esnaf, canlı görüntülü doğrulama, tartı garantisi. 81 ilde — uygulama yakında.",
  },
  twitter: {
    card: "summary_large_image",
    title: "patatesçi — Türkiye'nin sebze-meyve ağı kuruluyor",
    description:
      "Mahallenin esnafı tek uygulamada. 81 ilde kuruluyoruz — uygulama yakında.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        {children}
        <footer>
          <div className="container">
            <div className="footer-grid">
              <div>
                <b style={{ color: "var(--ink)" }}>patatesçi</b>
                <p style={{ marginTop: 6, maxWidth: 320 }}>
                  Türkiye'nin sebze-meyve ağı. Mahallenin esnafı ile alıcısını
                  doğrudan, güvenceli ve mevzuata uygun şekilde buluşturur.
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
