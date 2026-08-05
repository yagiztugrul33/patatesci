"use client";
import { useEffect, useState, useCallback } from "react";
import { ProductIcon, IconYukari, IconAsagi, IconKalkan } from "../../components/icons";
import { fmtSayi, fmtTL } from "../../lib/format";
import { TAKSONOMI } from "../../lib/taksonomi.mjs";

const KATSAYI = { "Ekstra": 1.15, "1. Sınıf": 1.0, "2. Sınıf": 0.85, "Sanayilik": 0.6 };
const KALITELER = Object.keys(KATSAYI);

export default function Borsa() {
  const [market, setMarket] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hal, setHal] = useState(null);
  const [sel, setSel] = useState("patates");
  const [kalite, setKalite] = useState("1. Sınıf");
  const [yon, setYon] = useState("sat"); // sat | al
  const [fiyat, setFiyat] = useState("");
  const [ton, setTon] = useState("5");
  const [kim, setKim] = useState("");
  const [seviye, setSeviye] = useState("S1");
  const [mense, setMense] = useState("");
  const [kat, setKat] = useState("0");
  const [asansor, setAsansor] = useState(true);
  const [blokeOnay, setBlokeOnay] = useState(false);
  const [msg, setMsg] = useState("");
  const [hata, setHata] = useState("");

  const SEVIYELER = [
    ["S0", "S0 · Gel-al (0 ₺)"],
    ["S1", "S1 · Adres teslim, araç üstü (varsayılan)"],
    ["S2", "S2 · +Boşaltma (400 ₺/ton, temsili)"],
    ["S3", "S3 · +Depoya taşıma, zemin kat (1.000 ₺/ton, temsili)"],
    ["S4", "S4 · Kata taşıma (S3 + kat ücreti)"],
  ];

  const load = useCallback(async () => {
    const [m, o, h] = await Promise.all([
      fetch("/api/market").then((r) => r.json()),
      fetch("/api/offers").then((r) => r.json()),
      fetch("/api/hal-fiyatlari").then((r) => r.json()).catch(() => null),
    ]);
    setMarket(m.market || []);
    setOffers(o.offers || []);
    setHal(h && !h.error ? h : null);
  }, []);
  useEffect(() => { load(); }, [load]);

  const cur = market.find((m) => m.id === sel);
  const endeks = market.length ? market.reduce((s, m) => s + m.last, 0) / market.length : null;
  const book = offers.filter((o) => o.urun === sel && (o.kalite || "1. Sınıf") === kalite);
  const asks = book.filter((o) => o.yon === "sat").sort((a, b) => a.fiyat - b.fiyat);
  const bids = book.filter((o) => o.yon === "al").sort((a, b) => b.fiyat - a.fiyat);

  const halBul = (id) => hal?.fiyatlar?.find((x) => x.id === id) || null;

  // istemci tarafı ön kontrol (sunucu ayrıca doğrular) — band ürün+kalite bazlı,
  // merkez Ankara hal referansı (varsa)
  const f = parseFloat(fiyat);
  const halOrta = halBul(sel)?.orta ?? null;
  const merkez = cur ? +(((halOrta ?? cur.last)) * KATSAYI[kalite]).toFixed(2) : 0;
  const min = cur ? +(merkez * 0.85).toFixed(1) : 0;
  const max = cur ? +(merkez * 1.15).toFixed(1) : 0;
  useEffect(() => { if (merkez) setFiyat(String(merkez)); }, [sel, kalite, merkez]);
  const gecerli = cur && !isNaN(f) && f >= min && f <= max && parseFloat(ton) >= 1 && (yon !== "sat" || !!mense);
  const bandKaynak = halOrta !== null ? "Ankara Hal referansı" : "platform referansı";
  const bandNot = !cur ? "" : isNaN(f)
    ? `${kalite} band merkezi ${fmtTL(merkez)} (${bandKaynak}) · geçerli aralık ${fmtTL(min)} – ${fmtTL(max)}`
    : parseFloat(ton) < 1 ? "Asgari işlem miktarı 1 tondur."
    : f < min ? `Teklif ${kalite} bandının altında. Asgari geçerli fiyat: ${fmtTL(min)}.`
    : f > max ? `Teklif ${kalite} bandının üzerinde. Azami geçerli fiyat: ${fmtTL(max)}.`
    : `Teklif geçerli aralıkta (${kalite} merkezi ${fmtTL(merkez)}, ${bandKaynak}).`;

  const submit = async () => {
    setMsg(""); setHata("");
    const r = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yon, urun: sel, kalite, fiyat, ton, mense: yon === "sat" ? mense : undefined, seviye: yon === "al" ? seviye : "S1", kat: Number(kat) || 0, asansor, kim: kim || (yon === "sat" ? "Satıcı" : "Alıcı") }),
    });
    const d = await r.json();
    if (!r.ok) { setHata(d.error || "Teklif kabul edilmedi."); return; }
    setMsg(`${yon === "sat" ? "Satış" : "Alış"} teklifiniz kaydedildi: ${ton} ton ${cur.nm} (${kalite}), ${fmtTL(fiyat)}/kg.`);
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
                  <th className="num">Ankara Hal (orta)</th>
                  <th className="num">Fark</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {market.map((m) => {
                  const h = halBul(m.id);
                  const fark = h ? ((m.last - h.orta) / h.orta) * 100 : null;
                  return (
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
                    <td className="num">{h ? fmtSayi(h.orta) : "—"}</td>
                    <td className="num">{fark === null ? "—" : (
                      <span className={"chg " + (fark <= 0 ? "up" : "down")}>%{fmtSayi(Math.abs(fark), 1)} {fark <= 0 ? "ucuz" : "pahalı"}</span>
                    )}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-outline" style={{ padding: "6px 16px", fontSize: ".8rem" }} onClick={() => setSel(m.id)}>Seç</button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {hal && (
            <p className="muted num" style={{ fontSize: ".76rem", padding: "10px 16px", borderTop: "1px solid var(--line)", margin: 0 }}>
              Kaynak: {hal.kaynak} · {hal.tarih}{hal.canli ? "" : hal.guncelleme ? ` · son güncelleme: ${new Date(hal.guncelleme).toLocaleString("tr-TR")}` : ` · ${hal.not || "yedek liste"}`}
            </p>
          )}
        </div>

        <div className="grid grid-2">
          <div className="panel">
            <span className="tag">{cur ? cur.nm : ""} · {kalite} · Emir defteri</span>
            <div className="grid grid-2" style={{ marginTop: 16, gap: 14 }}>
              <div>
                <div className="eyebrow">Satış emirleri</div>
                {asks.length ? asks.map((a) => (
                  <div key={a.id} className="num" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".88rem" }}>
                    <span>{fmtSayi(a.fiyat)} ₺ · {fmtSayi(a.ton, 1)} ton</span><span className="muted" style={{ fontSize: ".76rem" }}>{a.kim}</span>
                  </div>
                )) : <p className="muted" style={{ fontSize: ".84rem", marginTop: 8 }}>Açık satış emri bulunmuyor.</p>}
              </div>
              <div>
                <div className="eyebrow">Alış emirleri</div>
                {bids.length ? bids.map((b) => (
                  <div key={b.id} className="num" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".88rem" }}>
                    <span>{fmtSayi(b.fiyat)} ₺ · {fmtSayi(b.ton, 1)} ton</span><span className="muted" style={{ fontSize: ".76rem" }}>{b.kim}</span>
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
            <div className="row2">
              <div className="field"><label>Ürün</label>
                <select className="select" value={sel} onChange={(e) => setSel(e.target.value)}>
                  {market.map((m) => <option key={m.id} value={m.id}>{m.nm}</option>)}
                </select>
              </div>
              <div className="field"><label>Kalite sınıfı</label>
                <select className="select" value={kalite} onChange={(e) => setKalite(e.target.value)}>
                  {KALITELER.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <div className="row2">
              <div className="field"><label>Birim fiyat (₺/kg)</label><input className="input num" value={fiyat} onChange={(e) => setFiyat(e.target.value)} placeholder="Örn. 18.20" /></div>
              <div className="field"><label>Miktar (ton)</label><input className="input num" value={ton} onChange={(e) => setTon(e.target.value)} placeholder="Asgari 1" /></div>
            </div>
            <div className="field"><label>Ad / unvan (isteğe bağlı)</label><input className="input" value={kim} onChange={(e) => setKim(e.target.value)} placeholder={yon === "sat" ? "Üretici veya işletme unvanı" : "İşletme unvanı"} /></div>
            {yon === "sat" && (
              <div className="field"><label>Menşe ili (zorunlu)</label>
                <select className="select" value={mense} onChange={(e) => setMense(e.target.value)}>
                  <option value="">Seçin</option>
                  {(TAKSONOMI[sel]?.mense || []).map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            )}
            {yon === "al" && (
              <>
                <div className="field"><label>Teslimat seviyesi (işlem öncesi seçilir, sözleşmeye yazılır)</label>
                  <select className="select" value={seviye} onChange={(e) => setSeviye(e.target.value)}>
                    {SEVIYELER.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                {seviye === "S4" && (
                  <div className="row2">
                    <div className="field"><label>Kat beyanı</label><input className="input num" value={kat} onChange={(e) => setKat(e.target.value)} placeholder="Örn. 2" /></div>
                    <div className="field"><label>Asansör</label>
                      <select className="select" value={asansor ? "var" : "yok"} onChange={(e) => setAsansor(e.target.value === "var")}>
                        <option value="var">Var</option><option value="yok">Yok (asansörsüz tarife)</option>
                      </select>
                    </div>
                  </div>
                )}
                {seviye === "S4" && <p className="hint bad" style={{ marginBottom: 8 }}>Yanlış kat/asansör beyanında fark + %25 ceza alıcıya yazılır.</p>}
              </>
            )}
            <div className={"hint " + (gecerli ? "ok" : "bad")} style={{ marginBottom: 8 }}>{bandNot}</div>
            {gecerli && (
              <label className="num" style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: ".8rem", color: "var(--ink2)", marginBottom: 12 }}>
                <input type="checkbox" checked={blokeOnay} onChange={(e) => setBlokeOnay(e.target.checked)} />
                <span>Teklifim için <b>{Math.round(f * parseFloat(ton) * 1000 * 0.05).toLocaleString("tr-TR")} ₺</b> (tutarın %5'i) güvence hesabımda bloke edilecek — ödeme değildir; eşleşmezse anında çözülür, eşleşirse bedele mahsup edilir. Eşleşme sonrası cayma cezaları blokeden tahsil edilir. Onaylıyorum.</span>
              </label>
            )}
            <button className="btn btn-primary full" onClick={submit} disabled={!gecerli || !blokeOnay}>Teklifi yayınla</button>
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
