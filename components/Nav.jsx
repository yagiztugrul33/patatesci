"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => setUser(d.user)).catch(() => {});
  }, []);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="dot" /> patatesçi
        </Link>
        <div className="nav-links">
          <Link href="/pazar">Pazar</Link>
          <Link href="/borsa">Borsa</Link>
          <Link href="/sat">Satıcı Paneli</Link>
          <Link href="/siparisler">Siparişler</Link>
        </div>
        <Link href="/giris" className="btn btn-primary" style={{ padding: "9px 20px" }}>
          {user ? user.ad.split(" ")[0] : "Giriş"}
        </Link>
      </div>
    </nav>
  );
}
