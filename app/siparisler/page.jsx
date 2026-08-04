"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProductIcon, IconKamera, IconKilit, IconKamyon, IconKutu, IconOnay, IconUyari } from "../../components/icons";
import { fmtTL, fmtTLkg } from "../../lib/format";

const DURUM_ETIKET = {
  goruntulu_onay_bekliyor: { t: "Görüntülü doğrulama bekleniyor", n: 1, I: IconKamera },
  odeme_guvencede: { t: "Ödeme güvencede — hazırlanıyor", n: 2, I: IconKilit },
  yolda: { t: "Sevkiyatta", n: 3, I: IconKamyon },
  teslim_edildi: { t: "Teslim edildi — kantar kontrolü bekleniyor", n: 4, I: IconKutu },
  tamamlandi: { t: "Tamamlandı — ödeme satıcıya aktarıldı", n: 5, I: IconOnay },
  itiraz: { t: "İtiraz — ödeme donduruldu", n: 0, I: IconUyari },
  hakem_incelemede: { t: "Hakem incelemesinde — kanıt penceresi açık", n: 0, I: IconUyari },
  karar: { t: "Hakem kararı verildi (gerekçeli)", n: 0, I: IconOnay },
  iptal_yukleme_oncesi: { t: "İptal edildi — yükleme öncesi", n: 0, I: IconUyari },
  yolda_iptal: { t: "İptal edildi — mal yoldayken", n: 0, I: IconUyari },
};

const AKSIYON_ETIKET = {
  goruntulu_onay_bekliyor: "Ürünü doğruladım, onayla ve öde",
  odeme_guvencede: "Sevkiyata çıktım (satıcı)",
  yolda: "Teslim ettim (satıcı)",
  teslim_edildi: "Kantar uyumlu — teslim aldım, ödemeyi aktar",
};

// İptal cezası ön bilgisi (kural kitabı B3) — işlem yapılmadan ÖNCE gösterilir
function iptalOnBilgi(o, userId) {
  const taraf = userId === o.saticiId ? "satici" : "alici";
  let oran, asama;
  if (o.durum === "goruntulu_onay_bekliyor" || o.durum === "odeme_guvencede") {
    asama = "yükleme öncesi"; oran = taraf === "satici" ? 0.02 : 0.01;
  } else if (o.durum === "yolda") {
    asama = "mal yoldayken"; oran = 0.05;
  } else return null;
  const ceza = Math.round(o.tutar * oran) + (o.durum === "yolda" ? (o.nakliye || 0) : 0);
  return { taraf, asama, oran, ceza };
}

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

  const [iptalPaneli, setIptalPaneli] = useState(null); // sipariş id
  const [iptalOnay, setIptalOnay] = useState(false);

  const aksiyon = async (id, aks) => {
    setHata("");
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aksiyon: aks }),
    });
    const d = await r.json();
    if (!r.ok) { setHata(d.error || "İşlem gerçekleştirilemedi."); return; }
    setIptalPaneli(null); setIptalOnay(false);
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
                <span className={"tag" + (["itiraz", "hakem_incelemede", "iptal_yukleme_oncesi", "yolda_iptal"].includes(o.durum) ? " neg" : ["tamamlandi", "karar"].includes(o.durum) ? " pos" : "")}>
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

              {o.durum === "hakem_incelemede" && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btn-outline" onClick={() => aksiyon(o.id, "karar-alici-hakli")}>Hakem simülasyonu: alıcı haklı (demo)</button>
                  <button className="btn btn-outline" onClick={() => aksiyon(o.id, "karar-alici-haksiz")}>Hakem simülasyonu: alıcı haksız (demo)</button>
                </div>
              )}

              {aks && !["itiraz", "tamamlandi", "hakem_incelemede", "karar", "iptal_yukleme_oncesi", "yolda_iptal"].includes(o.durum) && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={() => aksiyon(o.id, "ileri")}>{aks}</button>
                  {o.durum === "teslim_edildi" ? (
                    <button className="btn btn-outline" onClick={() => aksiyon(o.id, "itiraz")}>Varışta reddet (hakem süreci)</button>
                  ) : (
                    <button className="btn btn-outline" onClick={() => { setIptalPaneli(iptalPaneli === o.id ? null : o.id); setIptalOnay(false); }}>İptal et</button>
                  )}
                </div>
              )}

              {iptalPaneli === o.id && (() => {
                const on = iptalOnBilgi(o, user?.id);
                if (!on) return null;
                return (
                  <div style={{ marginTop: 12, border: "1px solid var(--danger)", borderRadius: 12, padding: 14, background: "var(--danger-soft)" }}>
                    <b style={{ fontSize: ".9rem" }}>İptal cezası ön bilgisi (kural kitabı B3)</b>
                    <p className="num" style={{ fontSize: ".85rem", margin: "6px 0 10px" }}>
                      Şu an ({on.asama}) iptal edersen bedelin %{(on.oran * 100).toLocaleString("tr-TR")}'i
                      {o.durum === "yolda" ? " + gidiş nakliyesi" : ""} = <b>{on.ceza.toLocaleString("tr-TR")} ₺ kesinti</b> uygulanır
                      ve karşı tarafa tazminat olarak ödenir. Skorun düşer.
                    </p>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".84rem", marginBottom: 10 }}>
                      <input type="checkbox" checked={iptalOnay} onChange={(e) => setIptalOnay(e.target.checked)} />
                      Cezayı okudum, kabul ediyorum.
                    </label>
                    <button className="btn btn-primary" disabled={!iptalOnay} onClick={() => aksiyon(o.id, "iptal")}>İptali onayla</button>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </main>
  );
}
