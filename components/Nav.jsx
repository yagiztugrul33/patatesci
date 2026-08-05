import Link from "next/link";
import Logo from "./Logo";

// Tanıtım sitesi navigasyonu — işlem yok, sadece bölümlere yönlendirme.
export default function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" aria-label="patatesci ana sayfa" style={{ display: "inline-flex" }}>
          <Logo variant="compact" size={26} />
        </Link>
        <div className="nav-links">
          <a href="/katalog">Canlı Katalog</a>
          <a href="/#uretici">Üretici için</a>
          <a href="/#toptan">Toptan alım</a>
          <a href="/#guvence">Güvence</a>
          <a href="/#sss">SSS</a>
        </div>
        <a href="/#onkayit" className="btn btn-primary" style={{ padding: "9px 20px" }}>
          Haber ver
        </a>
      </div>
    </nav>
  );
}
