"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProductIcon, IconKamera, IconKilit, IconKamyon, IconKutu, IconOnay, IconUyari } from "../../components/icons";
import { fmtTL, fmtTLkg } from "../../lib/format";

const DURUM_ETIKET = {
  goruntulu_onay_bekliyor: { t: "Görüntülü doğrulama bekleniyor", n: 1, I: IconKamera },
  odeme_guvencede: { t: "Ödeme güvencede — hazırlanıyor", n: 2, I: IconKilit },
  yolda: { t: "Sevkiyatta", n: 3, I: IconKamyon },
  teslim_edildi: { t: "Teslim edildi — kontrol bekleniyor", n: 4, I: IconKutu },
  tamamlandi: { t: "Tamamlandı — ödeme satıcıya aktarıldı", n: 5, I: IconOnay },
  itiraz: { t: "İtiraz — ödeme donduruldu", n: 0, I: IconUyari },
};

const AKSIYON_ETIKET = {
  goruntulu_onay_bekliyor: "Ürünü doğruladım, onayla ve öde",
  odeme_guvencede: "Sevkiyata çıktım (satıcı)",
  yolda: "Teslim ettim (satıcı)",
  teslim_edildi: "Teslim aldım, ödemeyi aktar",
};

export default function Siparisler() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [user, setUser] = useState(null);
  const [hata, setHata] = useState("");

  const load = useCallback(async () => {
    const r = await fetch("/api/orders");
    if (r.status === 401) { router.push("/giris"); return; }
    const d = await r.json();
    setOrders(d.orders || []);
    setUser(d.user);
  }, [router]);
  useEffect(() => { load(); }, [load]);

  const aksiyon = async (id, aks) => {
    setHata("");
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aksiyon: aks }),
    });
    const d = await r.json();
    if (!r.ok) { setHata(d.error || "İşlem gerçekleştirilemedi."); return; }
    load();
  };

  if (orders === null) return <main className="section"><div className="container"><p className="muted">Yükleniyor…</p></div></main>;

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-head" style={{ marginBottom: 26 }}>
          <p className="eyebrow">{user ? user.ad : ""}</p>
          <h2>Siparişlerim</h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Eşleşen teklifler burada siparişe dönüşür. Süreç: görüntülü doğrulama,
            güvenceli ödeme, sevkiyat ve teslimat onayı.
          </p>
          <p className="muted" style={{ marginTop: 6, fontSize: ".78rem" }}>
            Belge adımları (HKS, e-irsaliye, kantar fişi) temsilidir; gerçek
            entegrasyonlar Faz 2'de bağlanacaktır.
          </p>
        </div>

        {hata && <p className="hint bad" style={{ marginBottom: 14 }}>{hata}</p>}

        {!orders.length && (
          <div className="panel" style={{ textAlign: "center" }}>
            <p className="muted">Henüz eşleşmiş bir siparişiniz bulunmuyor. Borsadan teklif verin; uygun karşı teklif oluştuğunda otomatik eşleştirilirsiniz.</p>
            <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => router.push("/borsa")}>Borsaya git</button>
          </div>
        )}

        {orders.map((o) => {
          const d = DURUM_ETIKET[o.durum] || { t: o.durum, n: 0, I: null };
          const aks = AKSIYON_ETIKET[o.durum];
          const DurumIkon = d.I;
          return (
            <div className="panel" key={o.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div className="listing" style={{ margin: 0, border: "none", padding: 0, flex: 1, minWidth: 240 }}>
                  <div className="thumb"><ProductIcon id={o.urun} size={26} /></div>
                  <div className="meta">
                    <b>Sipariş {o.id} · {o.nm} · {o.ton} ton</b>
                    <div className="muted num" style={{ fontSize: ".84rem" }}>
                      {o.satici} · {o.alici} · {fmtTLkg(o.fiyat)}
                    </div>
                  </div>
                  <div className="price num">{fmtTL(o.tutar, 0)}</div>
                </div>
                <span className={"tag" + (o.durum === "itiraz" ? " neg" : o.durum === "tamamlandi" ? " pos" : "")}>
                  {DurumIkon && <DurumIkon size={13} />}
                  {d.t}
                </span>
              </div>

              {o.durum !== "itiraz" && (
                <div className="progress">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} className={i <= d.n ? "on" : ""} />
                  ))}
                </div>
              )}

              <ul style={{ listStyle: "none", fontSize: ".84rem", color: "var(--ink2)", marginBottom: 12 }}>
                {o.gecmis.map((g, i) => <li key={i}>· {g}</li>)}
              </ul>

              {aks && o.durum !== "itiraz" && o.durum !== "tamamlandi" && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={() => aksiyon(o.id, "ileri")}>{aks}</button>
                  <button className="btn btn-outline" onClick={() => aksiyon(o.id, "itiraz")}>Sorun bildir</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
