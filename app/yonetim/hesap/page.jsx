"use client";
// Yönetim hesap makinesi — Şeffaf Maliyet Dökümü ile AYNI motordan (lib/finans.mjs).
import { useState } from "react";
import { FINANS, islemAnatomisi, posEtkisi, aylikModel, basabas } from "../../../lib/finans.mjs";

const TL = (n) => n.toLocaleString("tr-TR") + " ₺";

export default function Hesap() {
  const [g, setG] = useState({ islemGun: 6.5, ortTon: 5, ortFiyat: 39, teslimat: 2000, sabit: FINANS.sabitGiderAy, kademeli: false });
  const set = (k) => (e) => setG((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : parseFloat(e.target.value) || 0 }));

  const ay = aylikModel({ islemGun: g.islemGun, ortTon: g.ortTon, ortFiyat: g.ortFiyat, teslimatHizmetBedeli: g.teslimat, sabit: g.sabit, kademeliHizmet: g.kademeli });
  const bb = basabas({ ortTon: g.ortTon, ortFiyat: g.ortFiyat, teslimatHizmetBedeli: g.teslimat, sabit: g.sabit, kademeliHizmet: g.kademeli });
  const pos = posEtkisi({ ton: g.ortTon, fiyat: g.ortFiyat });
  const bir = islemAnatomisi({ ton: 1, fiyat: g.ortFiyat, kademeliHizmet: g.kademeli });
  const bes = islemAnatomisi({ ton: 5, fiyat: g.ortFiyat, kademeliHizmet: g.kademeli });

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="section-head" style={{ marginBottom: 24 }}>
          <p className="eyebrow">Yönetim — finans motoru</p>
          <h2>İşlem Ekonomisi Hesap Makinesi</h2>
          <p className="muted" style={{ marginTop: 8, fontSize: ".85rem" }}>
            Tek motor: lib/finans.mjs. Havale kesintisi %1 TEMSİLİ (DOĞRULANAMADI);
            POS %2,5 kaynaklı piyasa bandı. Ayrıntı: docs/finansal-model.md
          </p>
        </div>

        <div className="panel" style={{ marginBottom: 18 }}>
          <div className="row2">
            <div className="field"><label>Günlük işlem (26 gün/ay)</label><input className="input num" type="number" step="0.5" value={g.islemGun} onChange={set("islemGun")} /></div>
            <div className="field"><label>Ortalama tonaj (ton)</label><input className="input num" type="number" step="0.5" value={g.ortTon} onChange={set("ortTon")} /></div>
          </div>
          <div className="row2">
            <div className="field"><label>Ortalama fiyat (₺/kg)</label><input className="input num" type="number" value={g.ortFiyat} onChange={set("ortFiyat")} /></div>
            <div className="field"><label>Ort. teslimat hizmeti (₺, S2-S4)</label><input className="input num" type="number" value={g.teslimat} onChange={set("teslimat")} /></div>
          </div>
          <div className="row2">
            <div className="field"><label>Aylık sabit gider (₺)</label><input className="input num" type="number" value={g.sabit} onChange={set("sabit")} /></div>
            <div className="field" style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: ".85rem" }}>
                <input type="checkbox" checked={g.kademeli} onChange={set("kademeli")} /> Kademeli hizmet bedeli (Faz 2 önerisi: 250/400/600)
              </label>
            </div>
          </div>
        </div>

        <div className="panel num" style={{ marginBottom: 18 }}>
          <span className="tag">Sonuçlar (havale/EFT — ana yöntem)</span>
          <div className="kimlik-satirlar" style={{ marginTop: 12 }}>
            <div><small>İşlem başı net</small><b>{TL(ay.birim.net)}</b></div>
            <div><small>Net ₺/kg</small><b>{ay.birim.netKg.toLocaleString("tr-TR")} ₺</b></div>
            <div><small>Aylık kâr/zarar</small><b style={{ color: ay.kar >= 0 ? "var(--accent-strong)" : "var(--kirmizi-koyu)" }}>{TL(ay.kar)}</b></div>
          </div>
          <p style={{ fontSize: ".85rem", marginTop: 10 }}>
            Başabaş: <b>{bb.imkansiz ? "bu parametrelerle imkânsız (işlem başı net ≤ 0)" : `${bb.islemAy} işlem/ay = günde ${bb.islemGun} işlem (${bb.tonAy} ton/ay)`}</b>
          </p>
          <p className="muted" style={{ fontSize: ".8rem" }}>
            Döküm (işlem başı): komisyon {TL(ay.birim.gelir.komisyon)} + hizmet {TL(ay.birim.gelir.hizmet)} + teslimat marjı {TL(ay.birim.gelir.teslimatMarj)} − ödeme kesintisi {TL(ay.birim.gider.odemeKesinti)} − ceza rezervi {TL(ay.birim.gider.cezaRezerv)}
          </p>
        </div>

        <div className="panel num" style={{ marginBottom: 18 }}>
          <span className="tag neg">Kart (POS) neden YASAK — kanıt</span>
          <p style={{ fontSize: ".85rem", margin: "10px 0" }}>
            {g.ortTon} ton işlemde net: havale {TL(pos.havaleNet)} → POS {TL(pos.posNet)}
            {pos.erimeYuzde !== null ? ` (marjın %${pos.erimeYuzde.toLocaleString("tr-TR")}'i eriyor)` : ""}.
            POS %2,5 kesinti, %3 komisyonun neredeyse tamamını yutuyor — ton işlemlerinde kart kapalı, üst sınır 100.000 ₺ perakende istisnası için.
          </p>
        </div>

        <div className="panel num" style={{ marginBottom: 18 }}>
          <span className="tag">1 ton vs 5 ton marj karşılaştırması</span>
          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ marginTop: 8 }}>
              <thead><tr><th>Tonaj</th><th className="num">Ciro</th><th className="num">Brüt gelir</th><th className="num">Net</th><th className="num">Net ₺/kg</th></tr></thead>
              <tbody>
                <tr><td>1 ton</td><td className="num">{TL(bir.tutar)}</td><td className="num">{TL(bir.brutGelir)}</td><td className="num">{TL(bir.net)}</td><td className="num">{bir.netKg.toLocaleString("tr-TR")}</td></tr>
                <tr><td>5 ton</td><td className="num">{TL(bes.tutar)}</td><td className="num">{TL(bes.brutGelir)}</td><td className="num">{TL(bes.net)}</td><td className="num">{bes.netKg.toLocaleString("tr-TR")}</td></tr>
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: ".8rem", marginTop: 8 }}>
            1 tonluk işlem sabit 250 ₺ bedelle zayıf kalıyor — kademeli bedel önerisinin gerekçesi (kutucuğu işaretleyip farkı gör).
          </p>
        </div>

        <div className="panel" style={{ fontSize: ".85rem" }}>
          <span className="tag sirada">Nakliye pazaryeri geliri — YASAL ONAY ÖNCESİ AÇILMAZ</span>
          <p className="muted" style={{ marginTop: 10 }}>
            Yük panosu + %{FINANS.nakliye.payOran * 100} platform payı modeli hazır ancak
            {" "}{FINANS.nakliye.not} Bu satır gelir modeline ancak belge alındığında eklenir.
          </p>
        </div>
      </div>
    </main>
  );
}
