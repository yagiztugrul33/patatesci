"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Giris() {
  const router = useRouter();
  const [mod, setMod] = useState("giris"); // giris | kayit
  const [rol, setRol] = useState("alici");
  const [tip, setTip] = useState("uretici");
  const [form, setForm] = useState({ email: "", sifre: "", ad: "" });
  const [hata, setHata] = useState("");
  const [bekle, setBekle] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const gonder = async () => {
    setHata(""); setBekle(true);
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: mod, ...form, rol, tip }),
    });
    const d = await r.json();
    setBekle(false);
    if (!r.ok) { setHata(d.error || "İşlem tamamlanamadı. Lütfen tekrar deneyin."); return; }
    router.push(d.user.rol === "satici" ? "/sat" : "/borsa");
    router.refresh();
  };

  const cikis = async () => {
    await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cikis" }) });
    setUser(null);
    router.refresh();
  };

  if (user) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 440 }}>
          <div className="panel" style={{ textAlign: "center" }}>
            <span className="tag">Hesabınız</span>
            <h2 style={{ margin: "14px 0 6px" }}>{user.ad}</h2>
            <p className="muted">{user.email} · {user.rol === "satici" ? `Satıcı (${user.tip})` : "Alıcı"}</p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn btn-outline full" onClick={cikis}>Oturumu kapat</button>
              <button className="btn btn-primary full" onClick={() => router.push("/siparisler")}>Siparişlerim</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="section-head" style={{ marginBottom: 26 }}>
          <p className="eyebrow">Hesap</p>
          <h2>{mod === "giris" ? "Giriş yapın" : "Hesap oluşturun"}</h2>
        </div>
        <div className="panel">
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <button className={mod === "giris" ? "btn btn-primary" : "btn btn-outline"} style={{ flex: 1, padding: "10px" }} onClick={() => setMod("giris")}>Giriş</button>
            <button className={mod === "kayit" ? "btn btn-primary" : "btn btn-outline"} style={{ flex: 1, padding: "10px" }} onClick={() => setMod("kayit")}>Kayıt</button>
          </div>

          {mod === "kayit" && (
            <>
              <div className="field"><label>Ad / işletme unvanı</label>
                <input className="input" value={form.ad} onChange={set("ad")} placeholder="Örn. Mehmet Yılmaz / Lezzet Restoran" /></div>
              <div className="field"><label>Hesap türü</label>
                <select className="select" value={rol} onChange={(e) => setRol(e.target.value)}>
                  <option value="alici">Alıcı (işletme / bireysel)</option>
                  <option value="satici">Satıcı (üretici / toptancı)</option>
                </select></div>
              {rol === "satici" && (
                <div className="field"><label>Satıcı türü</label>
                  <select className="select" value={tip} onChange={(e) => setTip(e.target.value)}>
                    <option value="uretici">Üretici (çiftçi)</option>
                    <option value="orgut">Üretici örgütü / kooperatif</option>
                    <option value="toptanci">Toptancı</option>
                    <option value="manav">Manav</option>
                  </select></div>
              )}
            </>
          )}

          <div className="field"><label>E-posta adresi</label>
            <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="ornek@sirket.com" /></div>
          <div className="field"><label>Şifre</label>
            <input className="input" type="password" value={form.sifre} onChange={set("sifre")} placeholder="En az 6 karakter" /></div>

          <button className="btn btn-primary full" onClick={gonder} disabled={bekle}>
            {bekle ? "Gönderiliyor…" : mod === "giris" ? "Giriş yap" : "Hesap oluştur"}
          </button>
          {hata && <p className="hint bad" style={{ marginTop: 12 }}>{hata}</p>}
        </div>
      </div>
    </main>
  );
}
