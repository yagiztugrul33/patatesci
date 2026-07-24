"use client";
import { useEffect, useState, useCallback } from "react";
import { ProductIcon, IconYukari, IconAsagi, IconKalkan } from "../../components/icons";
import { fmtSayi, fmtTL } from "../../lib/format";

export default function Borsa() {
  const [market, setMarket] = useState([]);
  const [offers, setOffers] = useState([]);
  const [sel, setSel] = useState("patates");
  const [yon, setYon] = useState("sat"); // sat | al
  const [fiyat, setFiyat] = useState("18.2");
  const [kg, setKg] = useState("500");
  const [kim, setKim] = useState("");
  const [msg, setMsg] = useState("");
  const [hata, setHata] = useState("");

  const load = useCallback(async () => {
    const [m, o] = await Promise.all([
      fetch("/api/market").then((r) => r.json()),
      fetch("/api/offers").then((r) => r.json()),
    ]);
    setMarket(m.market || []);
    setOffers(o.offers || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const cur = market.find((m) => m.id === sel);
  const endeks = market.length ? market.reduce((s, m) => s + m.last, 0) / market.length : null;
  const book = offers.filter((o) => o.urun === sel);
  const asks = book.filter((o) => o.yon === "sat").sort((a, b) => a.fiyat - b.fiyat);
  const bids = book.filter((o) => o.yon === "al").sort((a, b) => b.fiyat - a.fiyat);

  // istemci tarafı ön kontrol (sunucu ayrıca doğrular)
  const f = parseFloat(fiyat);
  const min = cur ? +(cur.last * 0.85).toFixed(1) : 0;
  const max = cur ? +(cur.last * 1.15).toFixed(1) : 0;
  const gecerli = cur && !isNaN(f) && f >= min && f <= max && parseInt(kg) >= 10;
  const bandNot = !cur ? "" : isNaN(f)
    ? `Piyasa fiyatı ${fmtTL(cur.last)} · geçerli aralık ${fmtTL(min)} – ${fmtTL(max)}`
    : parseInt(kg) < 10 ? "Asgari işlem miktarı 10 kg'dır."
    : f < min ? `Teklif piyasa bandının altında. Asgari geçerli fiyat: ${fmtTL(min)}.`
    : f > max ? `Teklif piyasa bandının üzerinde. Azami geçerli fiyat: ${fmtTL(max)}.`
    : `Teklif geçerli aralıkta (piyasa fiyatı ${fmtTL(cur.last)}).`;

  const submit = async () => {
    setMsg(""); setHata("");
    const r = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yon, urun: sel, fiyat, kg, kim: kim || (yon === "sat" ? "Satıcı" : "Alıcı") }),
    });
    const d = await r.json();
    if (!r.ok) { setHata(d.error || "Teklif kabul edilmedi."); return; }
    setMsg(`${yon === "sat" ? "Satış" : "Alış"} teklifiniz kaydedildi: ${kg} kg ${cur.nm}, ${fmtTL(fiyat)}/kg.`);
    load();
  };

  return (
    <main className="section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 26 }}>
          <p className="eyebrow">Canlı piyasa verileri</p>
          <h2>Borsa</h2>
          <p className="muted" style={{ marginTop: 10 }}>
            Fiyatlar açık teklif usulüyle oluşur ve tüm katılımcılar tarafından
            görülür. Eşleşen her işlem güvenceli ödeme ile tamamlanır.
          </p>
        </div>

        <div className="panel" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div className="eyebrow">PTX Endeksi</div>
            <div className="num" style={{ fontSize: "1.9rem", fontWeight: 700 }}>
              {endeks === null ? "—" : fmtTL(endeks)}
            </div>
          </div>
          <div className="muted" style={{ fontSize: ".87rem", maxWidth: 380 }}>
            Temel ürünlerin kilogram başına ortalama günlük fiyatı. Üretici ve
            alıcı için tarafsız referans değeridir.
          </div>
        </div>

        <div className="panel" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th className="num">Son fiyat (₺/kg)</th>
                  <th className="num">Günlük değişim</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {market.map((m) => (
                  <tr key={m.id} style={{ background: sel === m.id ? "var(--bg-soft)" : "transparent" }}>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--ink)" }}>
                        <span style={{ color: "var(--slate)", display: "inline-flex" }}><ProductIcon id={m.id} size={20} /></span>
                        <b style={{ fontWeight: 600 }}>{m.nm}</b>
                      </span>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{fmtSayi(m.last)}</td>
                    <td className="num">
                      <span className={"chg " + (m.chg >= 0 ? "up" : "down")}>
                        {m.chg >= 0 ? <IconYukari size={12} /> : <IconAsagi size={12} />}
                        %{fmtSayi(Math.abs(m.chg), 1)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-outline" style={{ padding: "6px 16px", fontSize: ".8rem" }} onClick={() => { setSel(m.id); setFiyat(String(m.last)); }}>Seç</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <span className="tag">{cur ? cur.nm : ""} · Emir defteri</span>
            <div className="grid grid-2" style={{ marginTop: 16, gap: 14 }}>
              <div>
                <div className="eyebrow">Satış emirleri</div>
                {asks.length ? asks.map((a) => (
                  <div key={a.id} className="num" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".88rem" }}>
                    <span>{fmtSayi(a.fiyat)} ₺ · {a.kg} kg</span><span className="muted" style={{ fontSize: ".76rem" }}>{a.kim}</span>
                  </div>
                )) : <p className="muted" style={{ fontSize: ".84rem", marginTop: 8 }}>Açık satış emri bulunmuyor.</p>}
              </div>
              <div>
                <div className="eyebrow">Alış emirleri</div>
                {bids.length ? bids.map((b) => (
                  <div key={b.id} className="num" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".88rem" }}>
                    <span>{fmtSayi(b.fiyat)} ₺ · {b.kg} kg</span><span className="muted" style={{ fontSize: ".76rem" }}>{b.kim}</span>
                  </div>
                )) : <p className="muted" style={{ fontSize: ".84rem", marginTop: 8 }}>Açık alış emri bulunmuyor.</p>}
              </div>
            </div>
          </div>

          <div className="panel">
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button className={yon === "sat" ? "btn btn-primary" : "btn btn-outline"} style={{ flex: 1, padding: "10px" }} onClick={() => setYon("sat")}>Satış teklifi</button>
              <button className={yon === "al" ? "btn btn-primary" : "btn btn-outline"} style={{ flex: 1, padding: "10px" }} onClick={() => setYon("al")}>Alış teklifi</button>
            </div>
            <div className="field"><label>Ürün</label>
              <select className="select" value={sel} onChange={(e) => setSel(e.target.value)}>
                {market.map((m) => <option key={m.id} value={m.id}>{m.nm}</option>)}
              </select>
            </div>
            <div className="row2">
              <div className="field"><label>Birim fiyat (₺/kg)</label><input className="input num" value={fiyat} onChange={(e) => setFiyat(e.target.value)} placeholder="Örn. 18.20" /></div>
              <div className="field"><label>Miktar (kg)</label><input className="input num" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="Asgari 10" /></div>
            </div>
            <div className="field"><label>Ad / unvan (isteğe bağlı)</label><input className="input" value={kim} onChange={(e) => setKim(e.target.value)} placeholder={yon === "sat" ? "Üretici veya işletme unvanı" : "İşletme unvanı"} /></div>
            <div className={"hint " + (gecerli ? "ok" : "bad")} style={{ marginBottom: 12 }}>{bandNot}</div>
            <button className="btn btn-primary full" onClick={submit} disabled={!gecerli}>Teklifi yayınla</button>
            {msg && <p className="hint ok" style={{ marginTop: 12 }}>{msg}</p>}
            {hata && <p className="hint bad" style={{ marginTop: 12 }}>{hata}</p>}
          </div>
        </div>

        <div className="pill-note" style={{ marginTop: 20 }}>
          <IconKalkan size={16} />
          Eşleşen her işlem canlı görüntülü doğrulama, güvenceli ödeme ve otomatik
          HKS/rüsum bildirimi ile tamamlanır.
        </div>
      </div>
    </main>
  );
}
