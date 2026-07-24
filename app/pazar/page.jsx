"use client";
import { useState } from "react";
import { ProductIcon, IconKamera, IconKilit, IconKamyon } from "../../components/icons";
import { fmtTL, fmtTLkg } from "../../lib/format";

const PRODUCTS = [
  { id: "patates", nm: "Patates", pr: 18 },
  { id: "sogan", nm: "Soğan", pr: 15 },
  { id: "domates", nm: "Domates", pr: 32 },
  { id: "biber", nm: "Biber", pr: 40 },
  { id: "salatalik", nm: "Salatalık", pr: 28 },
  { id: "havuc", nm: "Havuç", pr: 22 },
];

export default function Pazar() {
  const [cart, setCart] = useState({});
  const [stage, setStage] = useState("sepet"); // sepet | eslesme | onay

  const toggle = (id) =>
    setCart((c) => {
      const n = { ...c };
      if (n[id]) delete n[id];
      else n[id] = 5;
      return n;
    });
  const chg = (id, d) =>
    setCart((c) => ({ ...c, [id]: Math.max(1, c[id] + d) }));

  const items = Object.keys(cart);
  const total =
    items.reduce((s, id) => s + PRODUCTS.find((p) => p.id === id).pr * cart[id], 0) +
    (items.length ? 30 : 0);

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <p className="eyebrow">Toptan tedarik</p>
          <h2>Pazar</h2>
        </div>

        {stage === "sepet" && (
          <div className="panel">
            <span className="tag">Adım 1 · Sepet</span>
            <h3 style={{ fontSize: "1.3rem", margin: "12px 0 18px" }}>Sipariş kalemlerinizi seçin</h3>
            <div className="grid grid-3">
              {PRODUCTS.map((p) => (
                <div
                  key={p.id}
                  className="card"
                  onClick={() => toggle(p.id)}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    borderColor: cart[p.id] ? "var(--accent)" : "var(--line)",
                    padding: 20,
                  }}
                >
                  <div style={{ color: "var(--slate)", marginBottom: 8 }}><ProductIcon id={p.id} size={32} /></div>
                  <b>{p.nm}</b>
                  <p className="num">{fmtTLkg(p.pr, 0)}</p>
                </div>
              ))}
            </div>

            {items.map((id) => {
              const p = PRODUCTS.find((x) => x.id === id);
              return (
                <div className="listing" key={id}>
                  <div className="thumb"><ProductIcon id={id} size={26} /></div>
                  <div className="meta">
                    <b>{p.nm}</b>
                    <div className="muted num">{fmtTLkg(p.pr, 0)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button className="btn btn-outline" style={{ padding: "8px 14px" }} onClick={() => chg(id, -1)} aria-label="Azalt">−</button>
                    <b className="num">{cart[id]} kg</b>
                    <button className="btn btn-outline" style={{ padding: "8px 14px" }} onClick={() => chg(id, 1)} aria-label="Artır">+</button>
                  </div>
                </div>
              );
            })}

            <button
              className="btn btn-primary full"
              style={{ marginTop: 24 }}
              disabled={!items.length}
              onClick={() => setStage("eslesme")}
            >
              En uygun satıcıyı bul
            </button>
          </div>
        )}

        {stage === "eslesme" && (
          <div className="panel">
            <span className="tag">Adım 2 · Eşleşme</span>
            <h3 style={{ fontSize: "1.3rem", margin: "12px 0 18px" }}>Satıcınız belirlendi</h3>
            <div className="listing">
              <div className="thumb"><IconKamyon size={26} /></div>
              <div className="meta">
                <b>Hasan Manav <span className="tag pos" style={{ marginLeft: 6 }}>En yakın</span></b>
                <div className="muted">4,9 / 5 puan · %98 tam tartı · 0,8 km · tahmini 18 dk</div>
              </div>
              <div className="price num">{fmtTL(total, 0)}</div>
            </div>
            <div style={{ marginTop: 18 }} className="pill-note">
              <IconKilit size={16} />
              Toplam tutar peşin tahsil edilir ve güvence hesabında tutulur;
              teslimat onaylandığında satıcıya aktarılır.
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
              <button className="btn btn-outline" onClick={() => setStage("sepet")}>Geri dön</button>
              <button className="btn btn-primary" onClick={() => setStage("onay")}>Canlı görüntülü doğrulamaya geç</button>
            </div>
          </div>
        )}

        {stage === "onay" && (
          <div className="panel" style={{ textAlign: "center" }}>
            <span className="tag">Adım 3 · Canlı doğrulama</span>
            <h3 style={{ fontSize: "1.3rem", margin: "12px 0 8px" }}>Ürünü teslimat öncesi doğrulayın</h3>
            <p className="muted" style={{ marginBottom: 18 }}>
              Satıcı, ürünü canlı görüntülü bağlantı üzerinden size gösterir.
              Kaliteyi onaylamadan ödeme aktarılmaz.
            </p>
            <div className="cam-wait">
              <div className="inner">
                <IconKamera size={36} />
                <span><span className="status-dot" />Kamera bağlantısı bekleniyor</span>
                <span className="muted" style={{ fontSize: ".8rem" }}>Satıcı bağlantı kurduğunda görüntü burada başlayacaktır.</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button className="btn btn-outline full" onClick={() => setStage("sepet")}>Sorun bildir</button>
              <button className="btn btn-primary full" onClick={() => alert("Doğrulama onaylandı. Sipariş güvenceli ödeme ile ilerliyor; bedel teslimat onayına kadar güvence hesabında tutulacaktır.")}>Onayla ve öde</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
