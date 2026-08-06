"use client";
// Yönetim paneli (operasyon): ön kayıtlar, satıcı doğrulama kuyruğu, sipariş
// izleme. Erişim: YONETIM_ANAHTAR (env) — anahtar yalnız bu sekme oturumunda
// tutulur (sessionStorage), hiçbir yere yazılmaz. Birim ekonomisi: /yonetim/hesap.
import { useEffect, useState } from "react";

const TL = (n) => Number(n || 0).toLocaleString("tr-TR") + " ₺";

export default function YonetimPaneli() {
  const [anahtar, setAnahtar] = useState("");
  const [girildi, setGirildi] = useState(false);
  const [hata, setHata] = useState("");
  const [ozet, setOzet] = useState(null);
  const [sekme, setSekme] = useState("onkayit");
  const [veri, setVeri] = useState({});
  const [gerekceler, setGerekceler] = useState({});

  useEffect(() => {
    const s = sessionStorage.getItem("yonetimAnahtar");
    if (s) { setAnahtar(s); setGirildi(true); }
  }, []);

  const istek = async (yol, secenek = {}) => {
    const r = await fetch(yol, {
      ...secenek,
      headers: { "x-yonetim-anahtar": anahtar, "Content-Type": "application/json", ...(secenek.headers || {}) },
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
    return d;
  };

  const yukle = async (aktifSekme) => {
    setHata("");
    try {
      const o = await istek("/api/yonetim");
      setOzet(o.ozet);
      const b = aktifSekme || sekme;
      const d = await istek(`/api/yonetim?bolum=${b}`);
      setVeri((v) => ({ ...v, [b]: d.liste || [] }));
      setGirildi(true);
      sessionStorage.setItem("yonetimAnahtar", anahtar);
    } catch (e) {
      setGirildi(false);
      sessionStorage.removeItem("yonetimAnahtar");
      setHata(String(e.message || e));
    }
  };

  useEffect(() => {
    if (girildi && anahtar) yukle(sekme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sekme, girildi]);

  const kararVer = async (userId, karar) => {
    setHata("");
    try {
      await istek("/api/yonetim", {
        method: "POST",
        body: JSON.stringify({ islem: "onboarding-karar", userId, karar, gerekce: gerekceler[userId] || "" }),
      });
      yukle("onboarding");
    } catch (e) {
      setHata(String(e.message || e));
    }
  };

  const csvIndir = async () => {
    const r = await fetch("/api/yonetim?bolum=onkayit&format=csv", { headers: { "x-yonetim-anahtar": anahtar } });
    if (!r.ok) { setHata("CSV indirilemedi."); return; }
    const blob = await r.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "onkayitlar.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!girildi) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 420 }}>
          <p className="eyebrow">Yönetim</p>
          <h1 style={{ fontSize: "1.6rem" }}>Operasyon Paneli</h1>
          <p className="muted" style={{ margin: "12px 0 18px" }}>
            Bu panel yönetim anahtarıyla açılır. Anahtar yalnız bu sekmede tutulur.
          </p>
          <input
            type="password"
            value={anahtar}
            onChange={(e) => setAnahtar(e.target.value)}
            placeholder="Yönetim anahtarı"
            style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 10, marginBottom: 12 }}
          />
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => yukle()}>Panele gir</button>
          {hata && <p style={{ color: "var(--kirmizi-koyu)", marginTop: 12, fontSize: ".9rem" }}>{hata}</p>}
          <p className="muted" style={{ marginTop: 16, fontSize: ".8rem" }}>
            Birim ekonomisi paneli anahtarsızdır: <a href="/yonetim/hesap">/yonetim/hesap</a>
          </p>
        </div>
      </main>
    );
  }

  const liste = veri[sekme] || [];
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 960 }}>
        <p className="eyebrow">Yönetim</p>
        <h1 style={{ fontSize: "1.6rem" }}>Operasyon Paneli</h1>
        {ozet && (
          <div className="grid grid-3" style={{ margin: "18px 0" }}>
            <div className="card"><h3>{ozet.onkayit}</h3><p>ön kayıt</p></div>
            <div className="card"><h3>{ozet.bekleyenOnboarding}</h3><p>doğrulama bekleyen satıcı</p></div>
            <div className="card"><h3>{ozet.siparis}</h3><p>sipariş</p></div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {[["onkayit", "Ön kayıtlar"], ["onboarding", "Satıcı doğrulama"], ["siparisler", "Siparişler"]].map(([k, ad]) => (
            <button key={k} className={"btn " + (sekme === k ? "btn-primary" : "btn-outline")} onClick={() => setSekme(k)}>{ad}</button>
          ))}
          <a className="btn btn-outline" href="/yonetim/hesap">Birim ekonomisi</a>
          {sekme === "onkayit" && <button className="btn btn-outline" onClick={csvIndir}>CSV dışa aktar</button>}
        </div>
        {hata && <p style={{ color: "var(--kirmizi-koyu)", marginBottom: 12 }}>{hata}</p>}

        {sekme === "onkayit" && (
          <div style={{ overflowX: "auto" }}>
            <table className="tablo" style={{ width: "100%", fontSize: ".9rem" }}>
              <thead><tr><th style={{ textAlign: "left" }}>E-posta</th><th style={{ textAlign: "left" }}>Rol</th><th style={{ textAlign: "left" }}>Bölge</th></tr></thead>
              <tbody>
                {liste.map((k, i) => (
                  <tr key={i}><td>{k.email}</td><td>{k.rol}</td><td>{k.bolge || "—"}</td></tr>
                ))}
                {!liste.length && <tr><td colSpan={3} className="muted">Henüz ön kayıt yok.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {sekme === "onboarding" && (
          <div style={{ display: "grid", gap: 12 }}>
            {liste.map((b) => (
              <div key={b.userId + "-" + b.ts} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <b>{b.ad}</b> <span className="muted">({b.email})</span>
                    <p className="muted" style={{ fontSize: ".85rem", marginTop: 4 }}>
                      Künye: {b.kunyeNo || "—"} · ÇKS: {b.cksNo || "—"} · Bölge: {b.bolge || "—"}
                      {b.sertifikalar?.length ? ` · Sertifika: ${b.sertifikalar.join(", ")}` : ""}
                    </p>
                  </div>
                  <span className="tag">{b.durum}</span>
                </div>
                {b.durum === "dogrulama_bekliyor" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <input
                      placeholder="Gerekçe (redde zorunlu tutulur)"
                      value={gerekceler[b.userId] || ""}
                      onChange={(e) => setGerekceler((g) => ({ ...g, [b.userId]: e.target.value }))}
                      style={{ flex: 1, minWidth: 200, padding: "8px 12px", border: "1px solid var(--line)", borderRadius: 8 }}
                    />
                    <button className="btn btn-primary" onClick={() => kararVer(b.userId, "onay")}>Onayla</button>
                    <button className="btn btn-outline" onClick={() => kararVer(b.userId, "red")}>Reddet</button>
                  </div>
                )}
                {b.karar?.gerekce && <p className="muted" style={{ fontSize: ".85rem", marginTop: 8 }}>Karar notu: {b.karar.gerekce}</p>}
              </div>
            ))}
            {!liste.length && <p className="muted">Doğrulama kuyruğu boş.</p>}
          </div>
        )}

        {sekme === "siparisler" && (
          <div style={{ overflowX: "auto" }}>
            <table className="tablo" style={{ width: "100%", fontSize: ".9rem" }}>
              <thead><tr><th style={{ textAlign: "left" }}>No</th><th style={{ textAlign: "left" }}>Ürün</th><th style={{ textAlign: "right" }}>Ton</th><th style={{ textAlign: "right" }}>Tutar</th><th style={{ textAlign: "left" }}>Durum</th><th style={{ textAlign: "left" }}>Ödeme izi</th><th style={{ textAlign: "right" }}>Ceza</th></tr></thead>
              <tbody>
                {liste.map((o) => (
                  <tr key={o.id}>
                    <td className="num">#{o.id}</td><td>{o.urun}</td>
                    <td className="num" style={{ textAlign: "right" }}>{o.ton}</td>
                    <td className="num" style={{ textAlign: "right" }}>{TL(o.tutar)}</td>
                    <td>{o.durum}</td><td className="muted">{o.odemeHareket || "—"}</td>
                    <td className="num" style={{ textAlign: "right" }}>{o.cezaSayisi}</td>
                  </tr>
                ))}
                {!liste.length && <tr><td colSpan={7} className="muted">Sipariş yok.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
