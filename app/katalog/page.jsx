"use client";
// Tam canlı katalog: hal listesinden OTOMATİK türetilir (statik ürün listesi yok).
// Fiyatlar sabah-akşam değişebilir; damga ve tazelik rozeti bu yüzden zorunludur.
import { useEffect, useMemo, useState } from "react";
import { fmtSayi } from "../../lib/format";

function bugunStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export default function Katalog() {
  const [hal, setHal] = useState(null);
  const [hata, setHata] = useState("");
  const [grup, setGrup] = useState(null);

  useEffect(() => {
    fetch("/api/hal-fiyatlari")
      .then((r) => r.json())
      .then((d) => (d.error ? setHata(d.error) : setHal(d)))
      .catch(() => setHata("Katalog şu anda yüklenemedi."));
  }, []);

  const gruplar = useMemo(() => {
    if (!hal?.katalog) return [];
    const m = new Map();
    for (const k of hal.katalog) {
      if (!m.has(k.grup)) m.set(k.grup, []);
      m.get(k.grup).push(k);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0], "tr"));
  }, [hal]);

  const secili = gruplar.find(([g]) => g === grup) || null;
  const dunku = hal && hal.tarih !== bugunStr();

  return (
    <main className="section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 24 }}>
          <p className="eyebrow">Canlı katalog</p>
          <h2>Ankara Hal Listesi — Tam Katalog</h2>
          <p className="muted" style={{ marginTop: 10 }}>
            Katalog hal listesinden otomatik türetilir; yeni çeşit yayınlanırsa
            kendiliğinden düşer. Ürüne dokun, çeşit fiyatlarını gör.
          </p>
        </div>

        {hata && <p className="hint bad" style={{ textAlign: "center" }}>{hata}</p>}
        {!hal && !hata && <p className="muted" style={{ textAlign: "center" }}>Yükleniyor…</p>}

        {hal && (
          <>
            <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
              <span className="tag">{hal.katalog.length} çeşit · {gruplar.length} ürün</span>
              <span className="tag num">Liste tarihi: {hal.tarih}</span>
              {dunku && <span className="tag sirada">Dünkü liste — hal bugün yayınlamadı</span>}
              {!hal.canli && <span className="tag neg">{hal.guncelleme ? "Son başarılı veri" : "Yedek liste"}</span>}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
              {gruplar.map(([g, items]) => (
                <button key={g} className={grup === g ? "btn btn-primary" : "btn btn-outline"} style={{ padding: "8px 16px", fontSize: ".85rem" }} onClick={() => setGrup(grup === g ? null : g)}>
                  {g} ({items.length})
                </button>
              ))}
            </div>

            {secili && (
              <div className="panel" style={{ padding: 0, overflow: "hidden", maxWidth: 760, margin: "0 auto" }}>
                <div style={{ overflowX: "auto" }}>
                  <table className="table">
                    <thead><tr><th>Çeşit</th><th>Tür</th><th>Birim</th><th className="num">Asgari</th><th className="num">Azami</th><th className="num">Orta</th></tr></thead>
                    <tbody>
                      {secili[1].map((k) => (
                        <tr key={k.ad}>
                          <td>{k.ad}</td><td>{k.tur}</td><td>{k.birim}</td>
                          <td className="num">{fmtSayi(k.asgari)}</td>
                          <td className="num">{fmtSayi(k.azami)}</td>
                          <td className="num" style={{ fontWeight: 700 }}>{fmtSayi(k.orta)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="muted num" style={{ fontSize: ".76rem", padding: "10px 16px", borderTop: "1px solid var(--line)", margin: 0 }}>
                  Kaynak: {hal.kaynak} · {hal.tarih}
                  {hal.guncelleme ? ` · son güncelleme: ${new Date(hal.guncelleme).toLocaleString("tr-TR")}` : ""}
                </p>
              </div>
            )}

            <p className="muted" style={{ fontSize: ".78rem", textAlign: "center", maxWidth: 640, margin: "22px auto 0" }}>
              Kural: halde bulunmayan çeşit, üst ürün bandına "referanssız çeşit"
              etiketiyle bağlanır; son 30 gün referansı olmayan ürün "sezon dışı —
              hakem onaylı fiyat" kuralına tabidir (Şeffaf Ticaret Kuralları).
            </p>
          </>
        )}
      </div>
    </main>
  );
}
