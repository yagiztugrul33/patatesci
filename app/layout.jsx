import Link from "next/link";
import "./globals.css";
import Nav from "../components/Nav";

export const metadata = {
  title: "patatesçi — Tarımsal Ürün Ticaret Platformu",
  description:
    "Üretici ile alıcıyı doğrudan buluşturan B2B tarımsal ürün ticaret platformu. Şeffaf piyasa fiyatı, güvenceli ödeme, canlı görüntülü doğrulama ve HKS uyumu.",
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
                  Tarımsal ürün ticaret platformu. Üretici ve alıcıyı doğrudan,
                  güvenceli ve mevzuata uygun şekilde buluşturur.
                </p>
              </div>
              <div className="footer-links">
                <Link href="/hukuki/kvkk">KVKK Aydınlatma Metni</Link>
                <Link href="/hukuki/kullanici-sozlesmesi">Kullanıcı Sözleşmesi</Link>
                <Link href="/hukuki/mesafeli-satis">Mesafeli Satış Sözleşmesi</Link>
                <Link href="/hukuki/iletisim">İletişim</Link>
              </div>
            </div>
            <div className="footer-note">
              Tüm işlemler Hal Kayıt Sistemi (HKS) bildirimi ve künye takibi ile
              yürütülür. Ödemeler, teslimat onaylanana kadar güvence hesabında tutulur.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
