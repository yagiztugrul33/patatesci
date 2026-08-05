"use client";
import { useState } from "react";
import { ProductIcon, IconOnay } from "../../components/icons";
import { fmtTL } from "../../lib/format";
import { TAKSONOMI, KALITELER, DARA_TABLOSU, FOTO_STANDARDI } from "../../lib/taksonomi.mjs";

const URUNLER = Object.entries(TAKSONOMI).map(([id, t]) => ({ id, nm: t.ad }));

export default function Sat() {
  const [type, setType] = useState("uretici");
  const [organik, setOrganik] = useState(false);
  const [kantar, setKantar] = useState(true);
  const [tarsim, setTarsim] = useState(false);
  const SERTIFIKALAR = ["ÇKS", "İTU", "Organik", "GLOBALG.A.P."];
  const [sertifikalar, setSertifikalar] = useState([]);
  const [tohumBeyani, setTohumBeyani] = useState("");
  // Alıcı filtresi demo: son ilanlar + sertifika süzgeci
  const [ilanlar, setIlanlar] = useState([]);
  const [filtre, setFiltre] = useState("");
  const ilanlariYukle = (f) =>
    fetch("/api/listings" + (f ? `?sertifika=${encodeURIComponent(f)}` : ""))
      .then((r) => r.json()).then((d) => setIlanlar(d.listings || [])).catch(() => {});
  // Nakliyeci başvuru demosu (onboarding şartları: K1 + sorumluluk poliçesi)
  const [nakForm, setNakForm] = useState({ plaka: "", k1: "", police: "" });
  const [nakMsg, setNakMsg] = useState("");
  const [kunye, setKunye] = useState("");
  const [satici, setSatici] = useState("");
  const [form, setForm] = useState({ urun: "patates", cesit: "Agria", fiyat: "14", stokTon: "5", kalite: "1. Sınıf", kalibre: "35–55 mm", ambalaj: "Dökme", hasat: "12 Ağustos", il: "Polatlı", minTon: "1" });
  const [foto, setFoto] = useState(FOTO_STANDARDI.map(() => false));
  const fotoTamam = foto.every(Boolean);
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
        body: JSON.stringify({ ...form, tip: type, organik, kantar, tarsim, sertifikalar: [...sertifikalar, ...(tarsim ? ["TARSİM"] : [])], tohumBeyani, mense: form.il, kunye, satici: satici || "Üretici" }),
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
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".88rem", color: "var(--ink2)", marginTop: 6 }}>
              <input type="checkbox" checked={tarsim} onChange={(e) => setTarsim(e.target.checked)} /> TARSİM poliçem var (rozet + mücbir sebepte güven avantajı)
            </label>

            <div style={{ borderTop: "1px solid var(--line)", margin: "22px 0" }} />

            <span className="tag">Ürün bilgileri</span>
            <div className="field" style={{ marginTop: 16 }}>
              <label>Ürün</label>
              <select className="select" value={form.urun} onChange={(e) => setForm((f) => ({ ...f, urun: e.target.value, cesit: TAKSONOMI[e.target.value].cesitler[0], kalibre: TAKSONOMI[e.target.value].kalibreler[0] }))}>
                {URUNLER.map((u) => <option key={u.id} value={u.id}>{u.nm}</option>)}
              </select>
            </div>
            <div className="row2">
              <div className="field"><label>Çeşit</label>
                <select className="select" value={form.cesit} onChange={set("cesit")}>
                  {TAKSONOMI[form.urun].cesitler.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>Kalite sınıfı</label>
                <select className="select" value={form.kalite} onChange={set("kalite")}>
                  {KALITELER.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div className="field"><label>Kalibre</label>
              <select className="select" value={form.kalibre} onChange={set("kalibre")}>
                {TAKSONOMI[form.urun].kalibreler.map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="row2">
              <div className="field"><label>Birim fiyat (₺/kg)</label><input className="input num" value={form.fiyat} onChange={set("fiyat")} placeholder="Örn. 14.00" /></div>
              <div className="field"><label>Stok (ton)</label><input className="input num" value={form.stokTon} onChange={set("stokTon")} placeholder="Örn. 5" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Ambalaj (standart dara)</label>
                <select className="select" value={form.ambalaj} onChange={set("ambalaj")}>
                  {Object.entries(DARA_TABLOSU).map(([a, d]) => (
                    <option key={a} value={a}>{a} — dara {d >= 1 ? `${d} kg` : `${Math.round(d * 1000)} g`}</option>
                  ))}
                </select>
              </div>
              <div className="field"><label>Hasat tarihi</label><input className="input" value={form.hasat} onChange={set("hasat")} placeholder="Örn. 12 Ağustos" /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Menşe ili (zorunlu — künyeyle eşleşir)</label>
                <select className="select" value={form.il} onChange={set("il")}>
                  {(TAKSONOMI[form.urun].mense || []).map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="field"><label>Asgari sipariş (ton — min 1,0, istisnasız)</label><input className="input num" value={form.minTon} onChange={set("minTon")} placeholder="1" /></div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".88rem", color: "var(--ink2)", marginBottom: 10 }}>
              <input type="checkbox" checked={kantar} onChange={(e) => setKantar(e.target.checked)} /> Tarlada / yakında kantar var
            </label>

            <div style={{ borderTop: "1px solid var(--line)", margin: "16px 0" }} />
            <span className="tag">Sertifika ve tohum beyanı</span>
            <div style={{ margin: "10px 0" }}>
              {SERTIFIKALAR.map((s) => (
                <label key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".84rem", color: "var(--ink2)", marginRight: 14 }}>
                  <input type="checkbox" checked={sertifikalar.includes(s)} onChange={(e) => setSertifikalar((a) => e.target.checked ? [...a, s] : a.filter((x) => x !== s))} /> {s}
                </label>
              ))}
            </div>
            <div className="field"><label>Tohum/fide beyanı (çeşit kaynağı)</label>
              <input className="input" value={tohumBeyani} onChange={(e) => setTohumBeyani(e.target.value)} placeholder="Örn. Sertifikalı Agria tohumu — X Tohumculuk, 2026" />
            </div>

            <div style={{ borderTop: "1px solid var(--line)", margin: "16px 0" }} />
            <span className="tag">Fotoğraf standardı (zorunlu)</span>
            <p className="muted" style={{ fontSize: ".8rem", margin: "8px 0 10px" }}>
              Kalite beyanınız bağlayıcıdır; dört zorunlu kare olmadan ilan yayınlanamaz
              (bkz. Şeffaf Ticaret Kuralları).
            </p>
            {FOTO_STANDARDI.map((madde, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".84rem", color: "var(--ink2)", marginBottom: 6 }}>
                <input type="checkbox" checked={foto[i]} onChange={(e) => setFoto((f) => f.map((x, j) => (j === i ? e.target.checked : x)))} /> {madde} — çekildi
              </label>
            ))}

            <button className="btn btn-primary full" style={{ marginTop: 12 }} onClick={yayinla} disabled={bekle || !fotoTamam}>
              {bekle ? "Yayınlanıyor…" : fotoTamam ? "İlanı yayınla" : "Önce 4 zorunlu kareyi çekin"}
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
                <p className="hint ok" style={{ marginTop: 10, textAlign: "center" }}>
                  İlanınız kaydedildi ve yayına alındı (ilan no: {sonuc.id}).
                  {sonuc.tarsim ? " TARSİM'li üretici rozeti eklendi." : ""}
                </p>
              </>
            )}

            <div className="panel" style={{ marginTop: 18 }}>
              <span className="tag">Son ilanlar — alıcı sertifika filtresi</span>
              <div className="field" style={{ marginTop: 10 }}>
                <label>Sertifikaya göre süz</label>
                <select className="select" value={filtre} onChange={(e) => { setFiltre(e.target.value); ilanlariYukle(e.target.value); }}>
                  <option value="">Tümü</option>
                  {["ÇKS", "İTU", "Organik", "GLOBALG.A.P.", "TARSİM"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="btn btn-outline full" onClick={() => ilanlariYukle(filtre)}>İlanları getir</button>
              {ilanlar.slice(0, 5).map((l) => (
                <div key={l.id} className="listing" style={{ padding: 12 }}>
                  <div className="thumb"><ProductIcon id={l.urun} size={22} /></div>
                  <div className="meta">
                    <b style={{ fontSize: ".9rem" }}>{l.nm}{l.cesit ? ` (${l.cesit})` : ""} · {l.kalite}</b>
                    <div className="muted num" style={{ fontSize: ".76rem" }}>
                      {l.stokTon} ton · {l.mense || l.il || "—"}
                      {(l.sertifikalar || []).map((s) => <span key={s} className="tag pos" style={{ marginLeft: 5, padding: "1px 6px", fontSize: ".56rem" }}>{s}</span>)}
                    </div>
                  </div>
                  <div className="price num">{fmtTL(l.fiyat)}</div>
                </div>
              ))}
              {ilanlar.length === 0 && <p className="muted" style={{ fontSize: ".8rem", marginTop: 8 }}>Filtreye uyan ilan yok (önce "İlanları getir").</p>}
            </div>

            <div className="panel" style={{ marginTop: 18 }}>
              <span className="tag">Nakliyeci başvurusu (demo)</span>
              <p className="muted" style={{ fontSize: ".82rem", margin: "10px 0" }}>
                Onboarding şartları: K1 yetki belgesi + taşıyıcı mali sorumluluk
                poliçesi ibrazı. Poliçesiz nakliyeci sevkiyat alamaz.
              </p>
              <div className="field"><label>Araç plakası</label><input className="input" value={nakForm.plaka} onChange={(e) => setNakForm((f) => ({ ...f, plaka: e.target.value }))} placeholder="06 ABC 123" /></div>
              <div className="row2">
                <div className="field"><label>K1 belge no</label><input className="input" value={nakForm.k1} onChange={(e) => setNakForm((f) => ({ ...f, k1: e.target.value }))} placeholder="K1-XXXXXX" /></div>
                <div className="field"><label>Sorumluluk poliçe no</label><input className="input" value={nakForm.police} onChange={(e) => setNakForm((f) => ({ ...f, police: e.target.value }))} placeholder="Poliçe no" /></div>
              </div>
              <button
                className="btn btn-outline full"
                disabled={!nakForm.plaka || !nakForm.k1 || !nakForm.police}
                onClick={() => setNakMsg("Başvurunuz alındı (demo). Belgeler doğrulandıktan sonra sevkiyat alabilirsiniz; poliçe teyidi sigorta şirketinden yapılır.")}
              >
                {nakForm.plaka && nakForm.k1 && nakForm.police ? "Başvuruyu gönder (demo)" : "K1 ve poliçe ibrazı zorunlu"}
              </button>
              {nakMsg && <p className="hint ok" style={{ marginTop: 10 }}>{nakMsg}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
