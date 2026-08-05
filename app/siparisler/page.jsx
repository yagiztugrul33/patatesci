"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProductIcon, IconKamera, IconKilit, IconKamyon, IconKutu, IconOnay, IconUyari } from "../../components/icons";
import { fmtTL, fmtTLkg } from "../../lib/format";
import { FINANS } from "../../lib/finans.mjs";

const DURUM_ETIKET = {
  odeme_bekliyor: { t: "Onay tamam — ödeme bekleniyor (fiyat HENÜZ kilitli değil)", n: 1, I: IconKilit },
  yeniden_onay_gerekli: { t: "Fiyat tazelik kontrolü — yeniden onay gerekli (cezasız)", n: 0, I: IconUyari },
  onay_dusustu: { t: "Eşleşme düştü — cezasız (fiyat oynadı, blokeler çözüldü)", n: 0, I: IconUyari },
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
  odeme_bekliyor: "Ödemeyi güvenceye yatır — fiyatı MUTLAK kilitle",
  goruntulu_onay_bekliyor: "Ürünü doğruladım, onayla ve öde",
  odeme_guvencede: "Sevkiyata çıktım (satıcı)",
  yolda: "Teslim ettim (satıcı)",
  teslim_edildi: "Kantar uyumlu — teslim aldım, ödemeyi aktar",
};

// İptal cezası ön bilgisi (kural kitabı B3) — işlem yapılmadan ÖNCE gösterilir
function iptalOnBilgi(o, userId) {
  const taraf = userId === o.saticiId ? "satici" : "alici";
  let oran, asama;
  if (o.durum === "odeme_bekliyor" || o.durum === "goruntulu_onay_bekliyor" || o.durum === "odeme_guvencede") {
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
  // Teslim Anı Protokolü sihirbazı (TA): adımlar tamamlanmadan imza aktifleşmez
  const [teslimPaneli, setTeslimPaneli] = useState(null);
  const [teslimAdim, setTeslimAdim] = useState([false, false, false, false, false]);
  const [sozlesmePaneli, setSozlesmePaneli] = useState(null);
  // İtiraz sihirbazı (İS): sorun tipi → kanıt kontrol listesi → sonuç uyarısı → gönder
  const [itirazPaneli, setItirazPaneli] = useState(null);
  const [itirazTip, setItirazTip] = useState("Kalite (sınıf/kusur)");
  const [itirazKanit, setItirazKanit] = useState([false, false, false]);
  const [itirazOnay, setItirazOnay] = useState(false);

  const TESLIM_ADIMLARI = [
    "Plaka ve sürücü kimliği doğrulandı (uyuşmazsa TESLİM ETME)",
    "Boşaltım kesintisiz videoya alındı (katman itirazı hakkı için zorunlu)",
    "Tartı kontrolü yapıldı (siparişteki Tartı Doğrulama Planı'na göre)",
    "3 rastgele kasa/çuval açıldı ve uygulama kamerasıyla kaydedildi",
    "Boşaltma/taşımayı KİMİN yaptığı videoda görünüyor (teslimat seviyesi taahhüdünün kanıtı)",
  ];
  const ITIRAZ_KANITLARI = [
    "Uygulama kamerasıyla foto çekildi (konum+saat damgalı — galeriden yükleme yok)",
    "Boşaltım videosu mevcut (katman iddiasında zorunlu)",
    "Kantar fişi / örneklem kaydı eklendi (tartı iddiasında zorunlu)",
  ];

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
                <span className={"tag" + (["itiraz", "hakem_incelemede", "iptal_yukleme_oncesi", "yolda_iptal", "yeniden_onay_gerekli", "onay_dusustu"].includes(o.durum) ? " neg" : ["tamamlandi", "karar"].includes(o.durum) ? " pos" : "")}>
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

              {o.sozlesme && !["iptal_yukleme_oncesi", "yolda_iptal", "onay_dusustu", "yeniden_onay_gerekli"].includes(o.durum) && (
                <div style={{ marginBottom: 12 }}>
                  <button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: ".8rem" }} onClick={() => setSozlesmePaneli(sozlesmePaneli === o.id ? null : o.id)}>
                    Satış Özeti Sözleşmesi {o.sozlesme.onaySatici && o.sozlesme.onayAlici ? "(iki taraf onaylı)" : "(onay bekliyor)"}
                  </button>
                  {sozlesmePaneli === o.id && (
                    <div className="num" style={{ marginTop: 8, border: "1px solid var(--line)", borderRadius: 12, padding: 14, fontSize: ".8rem", color: "var(--ink2)" }}>
                      <b style={{ color: "var(--ink)" }}>SATIŞ ÖZETİ SÖZLEŞMESİ (demo — avukat onayı öncesi taslak şablon)</b><br />
                      Taraflar: {o.satici} (satıcı) — {o.alici} (alıcı) · Ürün: {o.nm} ({o.kalite}) · Miktar: {o.ton} ton · Birim: {o.fiyat} ₺/kg · Toplam: {o.tutar.toLocaleString("tr-TR")} ₺<br />
                      Teslimat seviyesi: {o.teslimat?.ad || "S1"} ({(o.teslimat?.bedel || 0).toLocaleString("tr-TR")} ₺{o.teslimat?.kat ? `, ${o.teslimat.kat}. kat, asansör ${o.teslimat.asansor ? "var" : "yok"}` : ""}) ·
                      Tartı planı: {o.tartiPlani || "—"}<br />
                      Sigorta: {o.sigorta?.aktif ? `açık (${o.sigorta.prim.toLocaleString("tr-TR")} ₺)` : "kapalı/feragat"} · Nakliye: {(o.nakliye || 0).toLocaleString("tr-TR")} ₺<br />
                      İptal-ceza matrisi ve hakem şartı: Şeffaf Ticaret Kuralları (B3, İS, TA) bu sözleşmenin ayrılmaz ekidir.<br />
                      Onay: satıcı {o.sozlesme.onaySatici ? new Date(o.sozlesme.onaySatici).toLocaleString("tr-TR") : "—"} · alıcı {o.sozlesme.onayAlici ? new Date(o.sozlesme.onayAlici).toLocaleString("tr-TR") : "—"}
                      <div style={{ marginTop: 10 }}>
                        {((user?.id === o.saticiId && !o.sozlesme.onaySatici) || (user?.id === o.aliciId && !o.sozlesme.onayAlici)) && (
                          <button className="btn btn-primary" style={{ padding: "6px 16px", fontSize: ".8rem" }} onClick={() => aksiyon(o.id, "sozlesme-onay")}>Sözleşmeyi onayla (saat damgalı)</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {o.durum === "yeniden_onay_gerekli" && (
                <div style={{ marginBottom: 12, border: "1px solid var(--amber)", borderRadius: 12, padding: 14, background: "var(--amber-soft)" }}>
                  <b style={{ fontSize: ".88rem" }}>Bilyoner kuralı: kabul anında fiyat tazeliği bozuldu</b>
                  <p className="num" style={{ fontSize: ".82rem", margin: "6px 0 10px" }}>
                    Hal referansı teklif anından bu yana %{o.yenidenOnay?.sapmaYuzde} oynadı
                    (eski ref {o.yenidenOnay?.eskiRef ?? "—"} → güncel {o.yenidenOnay?.yeniRef ?? "—"} ₺/kg).
                    İşlem fiyatı: {o.fiyat} ₺/kg. İkiniz de onaylarsanız devam; onaylamayan CEZASIZ cayar.
                    Onaylar: satıcı {o.yenidenOnay?.onaySatici ? "onaylı" : "bekliyor"} · alıcı {o.yenidenOnay?.onayAlici ? "onaylı" : "bekliyor"}
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="btn btn-primary" onClick={() => aksiyon(o.id, "yeniden-onay")}>Güncel fiyatı gördüm — onaylıyorum</button>
                    <button className="btn btn-outline" onClick={() => aksiyon(o.id, "yeniden-onay-red")}>Vazgeç (cezasız)</button>
                  </div>
                </div>
              )}

              {o.durum === "hakem_incelemede" && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="btn btn-outline" onClick={() => aksiyon(o.id, "karar-alici-hakli")}>Hakem simülasyonu: alıcı haklı (demo)</button>
                  <button className="btn btn-outline" onClick={() => aksiyon(o.id, "karar-alici-haksiz")}>Hakem simülasyonu: alıcı haksız (demo)</button>
                </div>
              )}

              {o.tartiPlani && !["tamamlandi", "karar", "iptal_yukleme_oncesi", "yolda_iptal"].includes(o.durum) && (
                <p className="muted" style={{ fontSize: ".78rem", background: "var(--bg-soft)", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
                  <b>Tartı Doğrulama Planı:</b> {o.tartiPlani}
                </p>
              )}

              {/* Şeffaf Maliyet Dökümü (GK/B5): her kalem işlem öncesi görünür */}
              <div className="num" style={{ fontSize: ".78rem", color: "var(--ink2)", background: "var(--bg-soft)", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
                <b style={{ color: "var(--ink)" }}>Şeffaf Maliyet Dökümü:</b>{" "}
                Mal bedeli {o.tutar.toLocaleString("tr-TR")} ₺ · Komisyon (%{FINANS.komisyonOran * 100}, satıcıdan) {Math.round(o.tutar * FINANS.komisyonOran).toLocaleString("tr-TR")} ₺ ·
                Belge/uyum bedeli (alıcıdan) {FINANS.hizmetBedeli} ₺ · Nakliye {(o.nakliye || 0).toLocaleString("tr-TR")} ₺ ·
                Sevkiyat sigortası {o.sigorta?.aktif ? `${o.sigorta.prim.toLocaleString("tr-TR")} ₺ (temsili binde ${o.sigorta.oran * 1000}, alıcıdan)` : o.sigorta?.feragat ? "KAPATILDI — yol riski alıcıda" : "—"} ·
                Teslimat: {o.teslimat ? `${o.teslimat.ad} — ${o.teslimat.bedel.toLocaleString("tr-TR")} ₺${o.teslimat.kat ? ` (${o.teslimat.kat}. kat, asansör ${o.teslimat.asansor ? "var" : "yok"})` : ""} (temsili tarife)` : "S1 (araç üstü)"}
                {o.sigorta?.aktif && ["goruntulu_onay_bekliyor", "odeme_guvencede"].includes(o.durum) && (
                  <>
                    {" "}
                    <button
                      className="btn btn-outline"
                      style={{ padding: "3px 10px", fontSize: ".7rem", marginLeft: 6 }}
                      onClick={() => {
                        if (window.confirm("UYARI: Sevkiyat sigortasını kapatırsan yoldaki hasar/kayıp riski SANA geçer; hasar durumunda bedel iade edilmez (yalnız nakliyeci kusuru kanıtlanırsa rücu mümkündür). Kapatmayı onaylıyor musun?")) {
                          aksiyon(o.id, "sigorta-kapat");
                        }
                      }}
                    >Sigortayı kapat</button>
                  </>
                )}
              </div>

              {aks && !["itiraz", "tamamlandi", "hakem_incelemede", "karar", "iptal_yukleme_oncesi", "yolda_iptal"].includes(o.durum) && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {o.durum === "teslim_edildi" ? (
                    <>
                      <button className="btn btn-primary" onClick={() => { setTeslimPaneli(teslimPaneli === o.id ? null : o.id); setTeslimAdim([false, false, false, false, false]); }}>Teslim sihirbazını başlat</button>
                      <button className="btn btn-outline" onClick={() => { setItirazPaneli(itirazPaneli === o.id ? null : o.id); setItirazKanit([false, false, false]); setItirazOnay(false); }}>İtiraz sihirbazı (imza öncesi)</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={() => aksiyon(o.id, "ileri")}>{aks}</button>
                      <button className="btn btn-outline" onClick={() => { setIptalPaneli(iptalPaneli === o.id ? null : o.id); setIptalOnay(false); }}>İptal et</button>
                    </>
                  )}
                </div>
              )}

              {teslimPaneli === o.id && o.durum === "teslim_edildi" && (
                <div style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 12, padding: 14 }}>
                  <b style={{ fontSize: ".9rem" }}>Teslim Anı Protokolü (TA) — zorunlu kontrol sihirbazı</b>
                  <div style={{ margin: "10px 0" }}>
                    {TESLIM_ADIMLARI.map((adim, i) => (
                      <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: ".82rem", color: "var(--ink2)", marginBottom: 6 }}>
                        <input type="checkbox" checked={teslimAdim[i]} onChange={(e) => setTeslimAdim((a) => a.map((x, j) => (j === i ? e.target.checked : x)))} />
                        <span>{i + 1}. {adim}</span>
                      </label>
                    ))}
                  </div>
                  <p className="muted" style={{ fontSize: ".78rem", marginBottom: 10 }}>
                    İmza = görünür her şeyin KESİN KABULÜ (konum+saat damgalı); ödeme imzayla
                    üreticiye geçer. İmza sonrası yalnız gizli ayıp itirazı (6 saat) açılabilir.
                  </p>
                  <button className="btn btn-primary" disabled={!teslimAdim.every(Boolean)} onClick={() => aksiyon(o.id, "ileri")}>
                    {teslimAdim.every(Boolean) ? "Dijital irsaliyeyi imzala — kesin kabul" : "Önce tüm adımları tamamla"}
                  </button>
                </div>
              )}

              {itirazPaneli === o.id && o.durum === "teslim_edildi" && (
                <div style={{ marginTop: 12, border: "1px solid var(--amber)", borderRadius: 12, padding: 14, background: "var(--amber-soft)" }}>
                  <b style={{ fontSize: ".9rem" }}>İtiraz Sihirbazı (İS) — 3 dokunuş</b>
                  <div className="field" style={{ margin: "10px 0" }}>
                    <label>1. Sorun tipi</label>
                    <select className="select" value={itirazTip} onChange={(e) => setItirazTip(e.target.value)}>
                      <option>Kalite (sınıf/kusur)</option>
                      <option>Tartı (eksik)</option>
                      <option>Katman hilesi (üst iyi, alt kötü)</option>
                      <option>Farklı çeşit/ürün</option>
                    </select>
                  </div>
                  <label style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--ink2)" }}>2. Kanıt kontrol listesi</label>
                  <div style={{ margin: "6px 0 10px" }}>
                    {ITIRAZ_KANITLARI.map((k, i) => (
                      <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: ".8rem", color: "var(--ink2)", marginBottom: 5 }}>
                        <input type="checkbox" checked={itirazKanit[i]} onChange={(e) => setItirazKanit((a) => a.map((x, j) => (j === i ? e.target.checked : x)))} />
                        <span>{k}</span>
                      </label>
                    ))}
                  </div>
                  <p className="num" style={{ fontSize: ".8rem", color: "var(--kirmizi-koyu)", marginBottom: 8 }}>
                    3. Sonuç uyarısı: hakem seni HAKSIZ bulursa %5 ceza ({Math.round(o.tutar * 0.05).toLocaleString("tr-TR")} ₺)
                    + çift yön nakliye ödersin, bedel üreticiye geçer ve skorun 15 puan düşer.
                    Kanıtı eksik taraf aleyhine karine işler. Pencere: boşaltımdan 6 saat.
                  </p>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".82rem", marginBottom: 10 }}>
                    <input type="checkbox" checked={itirazOnay} onChange={(e) => setItirazOnay(e.target.checked)} />
                    Sonuçları okudum, kabul ediyorum.
                  </label>
                  <button className="btn btn-primary" disabled={!itirazOnay || !itirazKanit[0]} onClick={() => aksiyon(o.id, "itiraz")}>İtirazı gönder — hakeme git</button>
                </div>
              )}

              {o.durum === "tamamlandi" && o.imzaTs && (Date.now() - o.imzaTs) < 6 * 3600000 && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-outline" onClick={() => aksiyon(o.id, "gizli-ayip")}>Gizli ayıp bildir (yalnız uygulama kamerası kanıtıyla)</button>
                  <span className="muted num" style={{ fontSize: ".78rem" }}>
                    Kalan pencere: ~{Math.max(0, Math.ceil(6 - (Date.now() - o.imzaTs) / 3600000))} saat (imzadan itibaren 6 saat)
                  </span>
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
