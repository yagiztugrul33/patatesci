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

  // Band konum rayı — girilen fiyatın ±%15 bandı içindeki yeri (gerçek veri;
  // zaman serisi olmadığı için sparkline yerine bu gösterilir).
  const bandOran = !cur || isNaN(f) || max === min ? null : (f - min) / (max - min);
  const bandDisi = bandOran !== null && (bandOran < 0 || bandOran > 1);
  const raySol = bandOran === null ? 50 : Math.min(100, Math.max(0, bandOran * 100));

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
    <main className="trm-kabuk">
      {/* Üst şerit — enstrüman başlığı */}
      <div className="trm-serit">
        <span className="trm-serit__ad">
          <span className="trm-nabiz" />
          patatesci · gıda borsası
        </span>
        <span className="trm-serit__ara" />
        <span className="trm-mono">
          {hal?.tarih ? hal.tarih : "referans yükleniyor"}
        </span>
      </div>

      <p className="trm-mono trm-mono--yesil">Canlı piyasa verileri</p>
      <h1 className="trm-baslik">Gıda borsası</h1>
      <p className="trm-alt">
        Fiyatlar açık teklif usulüyle oluşur ve tüm katılımcılar tarafından
        görülür. Eşleşen her işlem güvenceli ödeme ile tamamlanır.
      </p>

      {/* Gösterge paneli — metrik kutucukları */}
      <div className="trm-cerceve">
        <div className="trm-cerceve__ust">
          <span className="trm-lamba"><i /><i /><i /></span>
          <span className="trm-mono trm-mono--koyu">
            ptx · {cur ? cur.nm.toLocaleLowerCase("tr") : "—"} · {kalite}
          </span>
        </div>

        <div className="trm-kutular">
          <div className="trm-kutu trm-kutu--vurgu">
            <div className="trm-mono">PTX endeksi</div>
            <div className="trm-kutu__deger trm-kutu__deger--yesil">
              {endeks === null ? "—" : fmtTL(endeks)}
            </div>
            <p className="trm-kutu__not">
              Temel ürünlerin kilogram başına ortalama günlük fiyatı. Üretici ve
              alıcı için tarafsız referans değeridir.
            </p>
          </div>

          <div className="trm-kutu">
            <div className="trm-mono">Son fiyat · {cur ? cur.nm : "—"}</div>
            <div className="trm-kutu__deger">{cur ? fmtSayi(cur.last) : "—"}</div>
            <p className="trm-kutu__not">
              {cur ? (
                <span className={"trm-degisim " + (cur.chg >= 0 ? "trm-degisim--yukari" : "trm-degisim--asagi")}>
                  {cur.chg >= 0 ? <IconYukari size={12} /> : <IconAsagi size={12} />}
                  %{fmtSayi(Math.abs(cur.chg), 1)} günlük değişim
                </span>
              ) : "—"}
            </p>
          </div>

          <div className="trm-kutu">
            <div className="trm-mono">Band konumu · {kalite}</div>
            <div className="trm-kutu__deger">{cur ? fmtSayi(merkez) : "—"}</div>
            {/* Ray: bandın tamamı zemin, çentik merkez, işaret girilen fiyat */}
            <div className="trm-ray">
              <span className="trm-ray__merkez" />
              <span
                className={"trm-ray__isaret" + (bandDisi ? " trm-ray__isaret--disarida" : "")}
                style={{ left: `${raySol}%` }}
              />
            </div>
            <div className="trm-ray__uc">
              <span className="trm-mono">{cur ? fmtSayi(min) : "—"}</span>
              <span className="trm-mono">{cur ? fmtSayi(max) : "—"}</span>
            </div>
            <p className="trm-kutu__not">
              Merkez {bandKaynak.toLocaleLowerCase("tr")}, ±%15 geçerli aralık.
            </p>
          </div>

          <div className="trm-kutu">
            <div className="trm-mono">Açık emir</div>
            <div className="trm-kutu__deger">{book.length}</div>
            <p className="trm-kutu__not">
              {asks.length} satış · {bids.length} alış emri, seçili ürün ve
              kalite sınıfında.
            </p>
          </div>
        </div>
      </div>

      {/* Piyasa tablosu */}
      <section className="trm-bolum">
        <h2 className="trm-mono trm-mono--koyu">Piyasa</h2>
        <div className="trm-kart" style={{ padding: 0, marginTop: 16 }}>
          <div className="trm-tablo-sar">
            <table className="trm-tablo">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th className="trm-rakam">Son fiyat (₺/kg)</th>
                  <th className="trm-rakam">Günlük değişim</th>
                  <th className="trm-rakam">Ankara Hal (orta)</th>
                  <th className="trm-rakam">Fark</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {market.map((m) => {
                  const h = halBul(m.id);
                  const fark = h ? ((m.last - h.orta) / h.orta) * 100 : null;
                  return (
                  <tr key={m.id} className={sel === m.id ? "secili" : undefined}>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "var(--tr-granite)", display: "inline-flex" }}><ProductIcon id={m.id} size={20} /></span>
                        {m.nm}
                      </span>
                    </td>
                    <td className="trm-rakam">{fmtSayi(m.last)}</td>
                    <td className="trm-rakam">
                      <span className={"trm-degisim " + (m.chg >= 0 ? "trm-degisim--yukari" : "trm-degisim--asagi")}>
                        {m.chg >= 0 ? <IconYukari size={12} /> : <IconAsagi size={12} />}
                        %{fmtSayi(Math.abs(m.chg), 1)}
                      </span>
                    </td>
                    <td className="trm-rakam">{h ? fmtSayi(h.orta) : "—"}</td>
                    <td className="trm-rakam">{fark === null ? "—" : (
                      <span className={"trm-degisim " + (fark <= 0 ? "trm-degisim--yukari" : "trm-degisim--asagi")}>%{fmtSayi(Math.abs(fark), 1)} {fark <= 0 ? "ucuz" : "pahalı"}</span>
                    )}</td>
                    <td className="sag">
                      <button className="trm-dugme trm-dugme--hayalet trm-dugme--kucuk" onClick={() => setSel(m.id)}>Seç</button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {hal && (
            <p className="trm-kaynak">
              Kaynak: {hal.kaynak} · {hal.tarih}{hal.canli ? "" : hal.guncelleme ? ` · son güncelleme: ${new Date(hal.guncelleme).toLocaleString("tr-TR")}` : ` · ${hal.not || "yedek liste"}`}
            </p>
          )}
        </div>
      </section>

      {/* Emir defteri + teklif */}
      <div className="trm-ikili">
        <div className="trm-kart">
          <div className="trm-kart__ust">
            <span className="trm-nabiz" />
            <h2 className="trm-mono trm-mono--koyu">
              {cur ? cur.nm : ""} · {kalite} · emir defteri
            </h2>
          </div>
          <div className="trm-emir">
            <div>
              <div className="trm-mono">Satış emirleri</div>
              <div className="trm-emir__liste">
                {asks.length ? asks.map((a) => (
                  <div key={a.id} className="trm-satir">
                    <span>{fmtSayi(a.fiyat)} ₺ · {fmtSayi(a.ton, 1)} ton</span>
                    <span className="trm-satir__kim">{a.kim}</span>
                  </div>
                )) : <p className="trm-bos">Açık satış emri bulunmuyor.</p>}
              </div>
            </div>
            <div>
              <div className="trm-mono">Alış emirleri</div>
              <div className="trm-emir__liste">
                {bids.length ? bids.map((b) => (
                  <div key={b.id} className="trm-satir">
                    <span>{fmtSayi(b.fiyat)} ₺ · {fmtSayi(b.ton, 1)} ton</span>
                    <span className="trm-satir__kim">{b.kim}</span>
                  </div>
                )) : <p className="trm-bos">Açık alış emri bulunmuyor.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="trm-kart">
          <div className="trm-kart__ust">
            <h2 className="trm-mono trm-mono--koyu">Teklif ver</h2>
          </div>
          <div className="trm-yon">
            <button
              className={"trm-dugme " + (yon === "sat" ? "trm-yon__aktif" : "trm-dugme--sade")}
              onClick={() => setYon("sat")}
            >Satış teklifi</button>
            <button
              className={"trm-dugme " + (yon === "al" ? "trm-yon__aktif" : "trm-dugme--sade")}
              onClick={() => setYon("al")}
            >Alış teklifi</button>
          </div>

          <div className="trm-cift">
            <div className="trm-alan"><label htmlFor="trm-urun">Ürün</label>
              <select id="trm-urun" className="trm-girdi" value={sel} onChange={(e) => setSel(e.target.value)}>
                {market.map((m) => <option key={m.id} value={m.id}>{m.nm}</option>)}
              </select>
            </div>
            <div className="trm-alan"><label htmlFor="trm-kalite">Kalite sınıfı</label>
              <select id="trm-kalite" className="trm-girdi" value={kalite} onChange={(e) => setKalite(e.target.value)}>
                {KALITELER.map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className="trm-cift">
            <div className="trm-alan"><label htmlFor="trm-fiyat">Birim fiyat (₺/kg)</label>
              <input id="trm-fiyat" className="trm-girdi trm-rakam" value={fiyat} onChange={(e) => setFiyat(e.target.value)} placeholder="Örn. 18.20" />
            </div>
            <div className="trm-alan"><label htmlFor="trm-ton">Miktar (ton)</label>
              <input id="trm-ton" className="trm-girdi trm-rakam" value={ton} onChange={(e) => setTon(e.target.value)} placeholder="Asgari 1" />
            </div>
          </div>
          <div className="trm-alan"><label htmlFor="trm-kim">Ad / unvan (isteğe bağlı)</label>
            <input id="trm-kim" className="trm-girdi" value={kim} onChange={(e) => setKim(e.target.value)} placeholder={yon === "sat" ? "Üretici veya işletme unvanı" : "İşletme unvanı"} />
          </div>
          {yon === "sat" && (
            <div className="trm-alan"><label htmlFor="trm-mense">Menşe ili (zorunlu)</label>
              <select id="trm-mense" className="trm-girdi" value={mense} onChange={(e) => setMense(e.target.value)}>
                <option value="">Seçin</option>
                {(TAKSONOMI[sel]?.mense || []).map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          )}
          {yon === "al" && (
            <>
              <div className="trm-alan"><label htmlFor="trm-seviye">Teslimat seviyesi (işlem öncesi seçilir, sözleşmeye yazılır)</label>
                <select id="trm-seviye" className="trm-girdi" value={seviye} onChange={(e) => setSeviye(e.target.value)}>
                  {SEVIYELER.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              {seviye === "S4" && (
                <div className="trm-cift">
                  <div className="trm-alan"><label htmlFor="trm-kat">Kat beyanı</label>
                    <input id="trm-kat" className="trm-girdi trm-rakam" value={kat} onChange={(e) => setKat(e.target.value)} placeholder="Örn. 2" />
                  </div>
                  <div className="trm-alan"><label htmlFor="trm-asansor">Asansör</label>
                    <select id="trm-asansor" className="trm-girdi" value={asansor ? "var" : "yok"} onChange={(e) => setAsansor(e.target.value === "var")}>
                      <option value="var">Var</option><option value="yok">Yok (asansörsüz tarife)</option>
                    </select>
                  </div>
                </div>
              )}
              {seviye === "S4" && <p className="trm-not trm-not--olumsuz">Yanlış kat/asansör beyanında fark + %25 ceza alıcıya yazılır.</p>}
            </>
          )}
          <div className={"trm-not " + (gecerli ? "trm-not--olumlu" : "trm-not--olumsuz")} role="status">{bandNot}</div>
          {gecerli && (
            <label className="trm-onay">
              <input type="checkbox" checked={blokeOnay} onChange={(e) => setBlokeOnay(e.target.checked)} />
              <span>Teklifim için <b>{Math.round(f * parseFloat(ton) * 1000 * 0.05).toLocaleString("tr-TR")} ₺</b> (tutarın %5&apos;i) güvence hesabımda bloke edilecek — ödeme değildir; eşleşmezse anında çözülür, eşleşirse bedele mahsup edilir. Eşleşme sonrası cayma cezaları blokeden tahsil edilir. Onaylıyorum.</span>
            </label>
          )}
          <button className="trm-dugme trm-dugme--yesil trm-dugme--tam" onClick={submit} disabled={!gecerli || !blokeOnay}>Teklifi yayınla</button>
          {msg && <p className="trm-not trm-not--olumlu" role="status" style={{ marginTop: 12, marginBottom: 0 }}>{msg}</p>}
          {hata && <p className="trm-not trm-not--olumsuz" role="alert" style={{ marginTop: 12, marginBottom: 0 }}>{hata}</p>}
        </div>
      </div>

      {/* Açık kart — koyu zemine düşen tek parlak nesne */}
      <div className="trm-vurgu">
        <p className="trm-mono">
          <span className="trm-nabiz" />
          Güvence
        </p>
        <h2 className="trm-vurgu__baslik">Eşleşen her işlem güvenceye alınır.</h2>
        <p className="trm-vurgu__metin">
          Canlı görüntülü doğrulama, güvenceli ödeme ve otomatik HKS/rüsum
          bildirimi ile tamamlanır. Teklif blokesi ödeme değildir; eşleşme
          olmazsa anında çözülür.
        </p>
        <p style={{ marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8, color: "#2f5026" }}>
          <IconKalkan size={16} />
          <span style={{ fontSize: 14 }}>Şeffaf Ticaret Kuralları kapsamındadır.</span>
        </p>
      </div>
    </main>
  );
}
