"use client";
import { useId, useState } from "react";

export default function Waitlist({
  defaultRol = "toptan",
  etiket = "Erken erişim",
  baslik = "Uygulama çıkınca haber ver",
  aciklama = "E-postanı bırak; uygulama yayına girdiğinde ilk sen haberdar ol.",
  buton = "Haber ver",
}) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(defaultRol);
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
    setMsg(`Ön kaydın alındı. Uygulama yayına girdiğinde öncelik sende. (Toplam ${d.toplam} kayıt)`);
    setEmail(""); setBolge("");
  };

  return (
    <div className="panel" style={{ maxWidth: 560, margin: "0 auto", textAlign: "left" }}>
      <span className="tag">{etiket}</span>
      <h3 style={{ fontSize: "1.2rem", margin: "12px 0 6px" }}>{baslik}</h3>
      <p className="muted" style={{ fontSize: ".92rem", marginBottom: 16 }}>{aciklama}</p>
      <div className="row2">
        <div className="field">
          <label htmlFor={uid + "-eposta"}>E-posta adresi</label>
          <input id={uid + "-eposta"} className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@eposta.com" />
        </div>
        <div className="field">
          <label htmlFor={uid + "-rol"}>Seni nasıl tanıyalım?</label>
          <select id={uid + "-rol"} className="select" value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="uretici">Üreticiyim (çiftçi / kooperatif)</option>
            <option value="toptan">Toptan alıcıyım (esnaf / işletme)</option>
            <option value="nakliyeci">Nakliyeciyim</option>
            <option value="tuketici">Son tüketiciyim</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor={uid + "-bolge"}>İl / ilçe (isteğe bağlı)</label>
        <input id={uid + "-bolge"} className="input" value={bolge} onChange={(e) => setBolge(e.target.value)} placeholder="Örn. İstanbul / Kadıköy" />
      </div>
      <button className="btn btn-primary full" onClick={gonder} disabled={bekle}>
        {bekle ? "Gönderiliyor…" : buton}
      </button>
      {msg && <p className="hint ok" style={{ marginTop: 12 }}>{msg}</p>}
      {hata && <p className="hint bad" style={{ marginTop: 12 }}>{hata}</p>}
    </div>
  );
}
