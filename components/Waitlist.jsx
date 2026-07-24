"use client";
import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("alici");
  const [bolge, setBolge] = useState("");
  const [msg, setMsg] = useState("");
  const [hata, setHata] = useState("");
  const [bekle, setBekle] = useState(false);

  const gonder = async () => {
    setMsg(""); setHata(""); setBekle(true);
    const r = await fetch("/api/onkayit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, rol, bolge }),
    });
    const d = await r.json();
    setBekle(false);
    if (!r.ok) { setHata(d.error || "İşlem tamamlanamadı. Lütfen tekrar deneyin."); return; }
    setMsg(`Ön kaydınız alınmıştır. Platform açılışında öncelikli olarak bilgilendirileceksiniz. (Toplam ${d.toplam} kayıt)`);
    setEmail(""); setBolge("");
  };

  return (
    <div className="panel" style={{ maxWidth: 560, margin: "0 auto" }}>
      <span className="tag">Erken erişim</span>
      <h3 style={{ fontSize: "1.2rem", margin: "12px 0 6px" }}>Ön kayıt</h3>
      <p className="muted" style={{ fontSize: ".92rem", marginBottom: 16 }}>
        Platform açılışından öncelikli olarak haberdar olmak için ön kayıt oluşturun.
      </p>
      <div className="row2">
        <div className="field">
          <label>E-posta adresi</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@sirket.com" />
        </div>
        <div className="field">
          <label>Hesap türü</label>
          <select className="select" value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="alici">Alıcı (işletme / bireysel)</option>
            <option value="satici">Satıcı (üretici / toptancı)</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>İl / ilçe (isteğe bağlı)</label>
        <input className="input" value={bolge} onChange={(e) => setBolge(e.target.value)} placeholder="Örn. İstanbul / Kadıköy" />
      </div>
      <button className="btn btn-primary full" onClick={gonder} disabled={bekle}>
        {bekle ? "Gönderiliyor…" : "Ön kayıt oluştur"}
      </button>
      {msg && <p className="hint ok" style={{ marginTop: 12 }}>{msg}</p>}
      {hata && <p className="hint bad" style={{ marginTop: 12 }}>{hata}</p>}
    </div>
  );
}
