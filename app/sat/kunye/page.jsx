"use client";
// Satıcı doğrulama (onboarding) başvurusu — künye/ÇKS/sertifika beyanı.
// DEMO: dosya yükleme yerine numara beyanı; platform doğrulaması yönetim
// panelinden onaylanır/reddedilir. Gerçek HKS eşleşmesi Faz 2.
import { useEffect, useState } from "react";

export default function KunyeBasvuru() {
  const [form, setForm] = useState({ kunyeNo: "", cksNo: "", bolge: "", sertifika: "" });
  const [durum, setDurum] = useState(null);
  const [mesaj, setMesaj] = useState("");
  const [girisli, setGirisli] = useState(true);

  const durumYukle = async () => {
    const r = await fetch("/api/onboarding");
    if (r.status === 401) { setGirisli(false); return; }
    setGirisli(true);
    setDurum(await r.json());
  };
  useEffect(() => { durumYukle(); }, []);

  const gonder = async (e) => {
    e.preventDefault();
    setMesaj("");
    const r = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kunyeNo: form.kunyeNo,
        cksNo: form.cksNo,
        bolge: form.bolge,
        sertifikalar: form.sertifika ? form.sertifika.split(",").map((s) => s.trim()).filter(Boolean) : [],
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setMesaj(d.error || "Başvuru gönderilemedi."); return; }
    setMesaj("Başvurunuz alındı — platform doğrulaması bekleniyor.");
    durumYukle();
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const alanStil = { width: "100%", padding: "11px 14px", border: "1px solid var(--line)", borderRadius: 10, marginBottom: 12, fontFamily: "inherit" };
  const b = durum?.basvuru;

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <p className="eyebrow">Satıcı doğrulama</p>
        <h1 style={{ fontSize: "1.6rem" }}>Künye / ÇKS Başvurusu</h1>
        <p className="muted" style={{ margin: "12px 0 20px" }}>
          İlanlarının "Onaylı Üretici" rozetiyle yayınlanması için künye veya
          ÇKS numaranı beyan et. Doğrulama platform ekibince yapılır (demo).
        </p>

        {!girisli && (
          <div className="card">
            <p>Başvuru için önce <a href="/giris">giriş yapman</a> gerekiyor.</p>
          </div>
        )}

        {girisli && b && (
          <div className="card" style={{ marginBottom: 18 }}>
            <b>Son başvurun</b>
            <p className="muted" style={{ fontSize: ".9rem", marginTop: 6 }}>
              Künye: {b.kunyeNo || "—"} · ÇKS: {b.cksNo || "—"} · Bölge: {b.bolge || "—"}
            </p>
            <p style={{ marginTop: 8 }}>
              Durum:{" "}
              <b>
                {b.durum === "dogrulama_bekliyor" && "Platform doğrulaması bekleniyor"}
                {b.durum === "onaylandi" && "Onaylandı — Onaylı Üye rozetin aktif"}
                {b.durum === "reddedildi" && "Reddedildi"}
              </b>
            </p>
            {b.karar?.gerekce && <p className="muted" style={{ fontSize: ".85rem", marginTop: 6 }}>Not: {b.karar.gerekce}</p>}
          </div>
        )}

        {girisli && (!b || b.durum === "reddedildi") && (
          <form onSubmit={gonder} className="card">
            <label>Künye numarası (HKS)</label>
            <input style={alanStil} value={form.kunyeNo} onChange={set("kunyeNo")} placeholder="Örn. KNY-2026-000000" />
            <label>ÇKS numarası</label>
            <input style={alanStil} value={form.cksNo} onChange={set("cksNo")} placeholder="Çiftçi Kayıt Sistemi no" />
            <label>Üretim bölgesi</label>
            <input style={alanStil} value={form.bolge} onChange={set("bolge")} placeholder="Örn. Polatlı / Ankara" />
            <label>Sertifikalar (virgülle: GlobalGAP, organik...)</label>
            <input style={alanStil} value={form.sertifika} onChange={set("sertifika")} placeholder="İsteğe bağlı" />
            <button className="btn btn-primary" style={{ width: "100%" }}>Doğrulamaya gönder</button>
          </form>
        )}
        {mesaj && <p style={{ marginTop: 14 }}>{mesaj}</p>}
      </div>
    </main>
  );
}
