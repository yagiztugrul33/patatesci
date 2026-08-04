"use client";
import { useState } from "react";
import { ProductIcon, IconOnay } from "../../components/icons";
import { fmtTL } from "../../lib/format";

const URUNLER = [
  { id: "patates", nm: "Patates" },
  { id: "sogan", nm: "Soğan" },
  { id: "domates", nm: "Domates" },
  { id: "biber", nm: "Biber" },
  { id: "salatalik", nm: "Salatalık" },
  { id: "havuc", nm: "Havuç" },
];

export default function Sat() {
  const [type, setType] = useState("uretici");
  const [organik, setOrganik] = useState(false);
  const [kantar, setKantar] = useState(true);
  const [kunye, setKunye] = useState("");
  const [satici, setSatici] = useState("");
  const [form, setForm] = useState({ urun: "patates", cesit: "Agria", fiyat: "14", stokTon: "5", kalite: "1. kalite", ambalaj: "Dökme", hasat: "12 Ağustos", il: "Adana", minTon: "1" });
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState("");
  const [bekle, setBekle] = useState(false);

  const muaf = type === "uretici" || type === "orgut" || organik;
  const kunyeGerekli = type === "toptanci" || type === "manav";
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const yayinla = async () => {
    setHata(""); setSonuc(null); setBekle(true);
    try {
      const r = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tip: type, organik, kantar, kunye, satici: satici || "Üretici" }),
      });
      const d = await r.json();
      if (!r.ok) setHata(d.error || "İşlem tamamlanamadı. Lütfen tekrar deneyin.");
      else setSonuc(d.listing);
    } catch (e) {
      setHata("Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.");
    }
    setBekle(false);
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <p className="eyebrow">Doğrudan satış</p>
          <h2>Satıcı Paneli</h2>
          <p className="muted" style={{ marginTop: 10 }}>
            Ürünlerinizi doğrudan listeleyin. Künye, HKS bildirimi, rüsum ve
            belgelendirme süreçleri platform tarafından otomatik yönetilir.
          </p>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <span className="tag">Satıcı bilgileri</span>
            <div className="field" style={{ marginTop: 16 }}>
              <label>Satıcı türü</label>
              <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="uretici">Üretici (çiftçi)</option>
                <option value="orgut">Üretici örgütü / kooperatif</option>
                <option value="toptanci">Toptancı</option>
                <option value="manav">Manav</option>
              </select>
            </div>
            <div className="field"><label>Ad / işletme unvanı</label><input className="input" value={satici} onChange={(e) => setSatici(e.target.value)} placeholder="Adınız veya işletme unvanınız" /></div>
            {kunyeGerekli && (
              <div className="field"><label>Hal künye numarası (zorunlu)</label><input className="input" value={kunye} onChange={(e) => setKunye(e.target.value)} placeholder="Örn. 34-XXXXXX" /></div>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".88rem", color: "var(--ink2)" }}>
              <input type="checkbox" checked={organik} onChange={(e) => setOrganik(e.target.checked)} /> Organik tarım sertifikası mevcut
            </label>

            <div style={{ borderTop: "1px solid var(--line)", margin: "22px 0" }} />

            <span className="tag">Ürün bilgileri</span>
            <div className="field" style={{ marginTop: 16 }}>
              <label>Ürün</label>
              <select className="select" value={form.urun} onChange={set("urun")}>
                {URUNLER.map((u) => <option key={u.id} value={u.id}>{u.nm}</option>)}
              </select>
            </div>
            <div className="row2">
              <div className="field"><label>Çeşit</label><input className="input" value={form.cesit} onChange={set("cesit")} placeholder="Örn. Agria" /></div>
              <div className="field"><label>Kalite sınıfı</label>
                <select className="select" value={form.kalite} onChange={set("kalite")}>
                  <option>1. kalite</option><option>2. kalite</option><option>Salçalık</option>
                </select>
              </div>
            </div>
            <div className="row2">
              <div className="field"><label>Birim fiyat (₺/kg)</label><input className="input num" value={form.fiyat} onChange={set("fiyat")} placeholder="Örn. 14.00" /></div>
              <div className="field"><label>Stok (ton)</label><input className="input num" value={form.stokTon} onChange={set("stokTon")} placeholder="Örn. 5" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Ambalaj</label>
                <select className="select" value={form.ambalaj} onChange={set("ambalaj")}>
                  <option>Dökme</option><option>Çuval (25 kg)</option><option>Kasa</option>
                </select>
              </div>
              <div className="field"><label>Hasat tarihi</label><input className="input" value={form.hasat} onChange={set("hasat")} placeholder="Örn. 12 Ağustos" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>İl / ilçe</label><input className="input" value={form.il} onChange={set("il")} placeholder="Örn. Adana" /></div>
              <div className="field"><label>Asgari sipariş (ton)</label><input className="input num" value={form.minTon} onChange={set("minTon")} placeholder="1" /></div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".88rem", color: "var(--ink2)", marginBottom: 10 }}>
              <input type="checkbox" checked={kantar} onChange={(e) => setKantar(e.target.checked)} /> Tarlada / yakında kantar var
            </label>
            <button className="btn btn-primary full" onClick={yayinla} disabled={bekle}>
              {bekle ? "Yayınlanıyor…" : "İlanı yayınla"}
            </button>
            {hata && <div className="hint bad" style={{ marginTop: 10 }}>{hata}</div>}
          </div>

          <div>
            <div className="panel">
              <span className="tag">Mevzuat uyum durumu</span>
              <ul style={{ listStyle: "none", marginTop: 14, fontSize: ".92rem" }}>
                <li style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--line)" }}><span>Künye</span><b>{kunyeGerekli ? (kunye ? "Girildi" : "Zorunlu") : "Gerekli değil"}</b></li>
                <li style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--line)" }}><span>HKS bildirimi</span><b>Otomatik</b></li>
                <li style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--line)" }}><span>Rüsum (hal dışı)</span><b style={{ color: muaf ? "var(--accent)" : "var(--ink)" }}>{muaf ? "Muaf (%0)" : "%2 (alıcıdan)"}</b></li>
                <li style={{ display: "flex", justifyContent: "space-between", padding: "7px 0" }}><span>Belge</span><b>{type === "uretici" ? "Müstahsil makbuzu" : "e-Fatura"}</b></li>
              </ul>
              {muaf && (
                <div className="pill-note" style={{ marginTop: 14 }}>
                  <IconOnay size={16} />
                  Rüsum muafiyeti kapsamında fiyatınız daha rekabetçi konumlanır.
                </div>
              )}
            </div>

            {sonuc && (
              <>
                <div className="listing" style={{ marginTop: 18 }}>
                  <div className="thumb"><ProductIcon id={sonuc.urun} size={26} /></div>
                  <div className="meta">
                    <b>{sonuc.nm}{sonuc.cesit ? ` (${sonuc.cesit})` : ""} <span className="tag" style={{ marginLeft: 6 }}>{sonuc.kalite}</span></b>
                    <div className="muted num">{sonuc.stokTon} ton · {sonuc.ambalaj}{sonuc.il ? ` · ${sonuc.il}` : ""} · {sonuc.satici}{sonuc.muaf ? " · rüsum muaf" : ""}</div>
                  </div>
                  <div className="price num">{fmtTL(sonuc.fiyat)}</div>
                </div>
                <p className="hint ok" style={{ marginTop: 10, textAlign: "center" }}>İlanınız kaydedildi ve Pazar bölümünde yayına alındı (ilan no: {sonuc.id}).</p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
