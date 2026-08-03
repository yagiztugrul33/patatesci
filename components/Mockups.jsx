// Tanıtım sitesindeki uygulama ekranı mockup'ları.
// Bunlar çalışan arayüz değil, lansman reklamındaki temsili ekranlardır.
import Phone from "./Phone";
import EtaChip from "./EtaChip";
import {
  ProductIcon,
  IconKamyon,
  IconKamera,
  IconKonum,
  IconOnay,
  IconTarti,
  IconYildiz,
  IconAhize,
  IconKalkan,
} from "./icons";
import { fmtSayi, fmtTLkg } from "../lib/format";

const URUNLER = [
  { id: "patates", nm: "Patates", pr: 18.2 },
  { id: "sogan", nm: "Soğan", pr: 14.6 },
  { id: "domates", nm: "Domates", pr: 32.5 },
];

/* ---------- ortak parçalar ---------- */

function MapMini({ h = 110 }) {
  return (
    <svg className="map-mini" viewBox={`0 0 280 ${h}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "block", width: "100%" }}>
      <rect width="280" height={h} fill="#edf2ed" />
      <g stroke="#dce4dc" strokeWidth="5">
        <path d={`M0 ${h * 0.55}h280M70 0v${h}M190 0v${h}`} />
      </g>
      <path d={`M20 ${h - 16} L70 ${h - 16} Q80 ${h - 16} 80 ${h - 26} L80 ${h * 0.55} L190 ${h * 0.55} L190 22 L252 22`} fill="none" stroke="#2e8b63" strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" />
      <circle cx="20" cy={h - 16} r="6" fill="#fff" stroke="#2e8b63" strokeWidth="2.5" />
      <g transform="translate(244 10)">
        <path d="M8 22s-8-6.4-8-12a8 8 0 0 1 16 0c0 5.6-8 12-8 12Z" fill="#1c2420" />
        <circle cx="8" cy="10" r="2.6" fill="#fff" />
      </g>
    </svg>
  );
}

function Yildizlar({ n = 5 }) {
  return (
    <span className="stars" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "star on" : "star"}><IconYildiz size={18} /></span>
      ))}
    </span>
  );
}

/* ================= MÜŞTERİ EKRANLARI ================= */

export function MusteriSiparisPhone({ matched = false }) {
  return (
    <Phone>
      <div className="app-ui">
        <div className="app-top">
          <span className="brand" style={{ fontSize: ".95rem" }}><span className="dot" /> patatesçi</span>
          <span className="app-pin"><IconKonum size={14} /> Kadıköy</span>
        </div>
        <div className="app-search">Bugün ne lazım?</div>
        {URUNLER.map((f) => (
          <div className="app-item" key={f.id}>
            <span className="app-thumb"><ProductIcon id={f.id} size={20} /></span>
            <span className="app-item-meta">
              <b>{f.nm}</b>
              <small className="num">{fmtTLkg(f.pr)}</small>
            </span>
            <span className="app-qty num">{f.id === "patates" ? "5 kg" : f.id === "sogan" ? "3 kg" : "—"}</span>
            <span className="app-add">+</span>
          </div>
        ))}
        <div className="app-cta" style={{ marginBottom: matched ? 52 : 8 }}>Sipariş oluştur</div>
      </div>
      {matched && (
        <div className="match-card">
          <span className="match-ic"><IconKamyon size={20} /></span>
          <span className="match-meta">
            <b>Mehmet Usta eşleşti</b>
            <small>Patatesçi · 1,2 km · 18 dk içinde kapında</small>
          </span>
          <span className="match-ok"><IconOnay size={18} /></span>
        </div>
      )}
    </Phone>
  );
}

export function MusteriEslesmePhone() {
  return (
    <Phone>
      <MapMini h={120} />
      <div className="app-ui" style={{ paddingTop: 12 }}>
        <div className="esnaf-card">
          <div className="esnaf-ust">
            <span className="avatar">MU</span>
            <span className="esnaf-meta">
              <b>Mehmet Usta</b>
              <small><span className="tag pos" style={{ padding: "2px 8px" }}>Patatesçi</span></small>
            </span>
            <span className="puan num"><IconYildiz size={13} /> 4,9</span>
          </div>
          <div className="esnaf-alt num">
            <span className="plaka">34 ABC 123</span>
            <span className="mesafe"><IconKonum size={13} /> 1,2 km</span>
          </div>
          <div className="ara-btn"><IconAhize size={16} /> Ara</div>
          <small className="gizli-not"><IconKalkan size={12} /> Numaran gizli kalır; arama uygulama üzerinden bağlanır.</small>
        </div>
      </div>
    </Phone>
  );
}

export function MusteriTakipPhone() {
  const rota = "M30 218 L55 218 Q64 218 64 209 L64 138 Q64 130 72 130 L150 130 L150 55 L236 55";
  return (
    <Phone>
      <div className="track-head">
        <b>Siparişin yolda</b>
        <EtaChip />
      </div>
      <div style={{ position: "relative" }}>
        <svg className="track-map" viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="280" height="250" fill="#edf2ed" />
          <g stroke="#dce4dc" strokeWidth="6">
            <path d="M0 55h280M0 130h280M0 205h280M55 0v250M150 0v250M228 0v250" />
          </g>
          <rect x="160" y="140" width="58" height="55" rx="8" fill="#e2ebe2" />
          <path d={rota} fill="none" stroke="#2e8b63" strokeWidth="3.5" strokeDasharray="7 6" strokeLinecap="round" />
          <circle cx="30" cy="218" r="7" fill="#fff" stroke="#2e8b63" strokeWidth="3" />
          {/* araç rota üzerinde ilerler (SMIL); reduced-motion'da statik kopya gösterilir */}
          <g className="arac-anim">
            <g transform="translate(-12 -12)">
              <rect width="24" height="24" rx="7" fill="#2e8b63" />
              <path d="M5 8h8v8H5zM13 10h3l2.5 2.5V16H13zM8 17.5a1.4 1.4 0 1 0 0 .01M15.5 17.5a1.4 1.4 0 1 0 0 .01" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </g>
            <animateMotion dur="12s" repeatCount="indefinite" path={rota} />
          </g>
          <g className="arac-statik" transform="translate(138 43)">
            <rect width="24" height="24" rx="7" fill="#2e8b63" />
            <path d="M5 8h8v8H5zM13 10h3l2.5 2.5V16H13zM8 17.5a1.4 1.4 0 1 0 0 .01M15.5 17.5a1.4 1.4 0 1 0 0 .01" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </g>
          <g transform="translate(228 39)">
            <path d="M8 22s-8-6.4-8-12a8 8 0 0 1 16 0c0 5.6-8 12-8 12Z" fill="#1c2420" />
            <circle cx="8" cy="10" r="2.6" fill="#fff" />
          </g>
        </svg>
        <div className="pip">
          <span className="pip-canli">CANLI</span>
          <IconKamera size={20} />
          <small>Ürünü canlı gör</small>
        </div>
      </div>
      <div className="track-card">
        <span className="match-ic"><IconKamyon size={20} /></span>
        <span className="match-meta">
          <b>Mehmet Usta · 34 ABC 123</b>
          <small>Canlı doğrulama tamamlandı · ödeme güvencede</small>
        </span>
      </div>
    </Phone>
  );
}

export function MusteriTeslimPhone() {
  return (
    <Phone>
      <div className="app-ui" style={{ textAlign: "center", paddingTop: 26 }}>
        <span className="big-check"><IconOnay size={40} /></span>
        <h4 className="teslim-baslik">Teslim edildi</h4>
        <div className="tarti-row">
          <IconTarti size={18} />
          <span><b className="num">5,02 kg</b> tartıldı — tam tartı</span>
        </div>
        <div className="puanla-kutu">
          <small>Esnafını puanla</small>
          <Yildizlar n={5} />
          <div className="app-cta" style={{ marginTop: 12, marginBottom: 0 }}>Gönder</div>
        </div>
      </div>
    </Phone>
  );
}

/* ================= ESNAF EKRANLARI ================= */

export function EsnafKayitPhone() {
  return (
    <Phone>
      <div className="app-ui">
        <div className="app-top" style={{ marginBottom: 10 }}>
          <b style={{ fontSize: ".95rem" }}>Esnaf kaydı</b>
          <span className="app-pin">Adım 2/3</span>
        </div>
        <small className="form-etiket">Uzmanlığın</small>
        <div className="chip-grid">
          <span className="chip on">Patatesçi</span>
          <span className="chip">Soğancı</span>
          <span className="chip">Domatesçi</span>
          <span className="chip">Manav (genel)</span>
        </div>
        <small className="form-etiket">Araç plakası</small>
        <div className="form-satir num"><span className="plaka">34 ABC 123</span><span className="ok-mini"><IconOnay size={15} /> Kayıtlı</span></div>
        <small className="form-etiket">Telefon</small>
        <div className="form-satir num"><span>+90 5•• ••• 44 12</span><span className="ok-mini"><IconOnay size={15} /> Doğrulandı</span></div>
        <small className="form-etiket">Künye / belge</small>
        <div className="form-satir"><span>Hal künyesi</span><span className="ok-mini"><IconOnay size={15} /> Onaylandı</span></div>
        <div className="app-cta" style={{ marginBottom: 4 }}>Başvuruyu gönder</div>
      </div>
    </Phone>
  );
}

export function OnayliEsnafKarti() {
  return (
    <div className="esnaf-kimlik">
      <div className="kimlik-ust">
        <span className="avatar buyuk">MU</span>
        <span>
          <b>Mehmet Usta</b>
          <small>Kadıköy, İstanbul</small>
        </span>
        <span className="kimlik-rozet"><IconKalkan size={14} /> ONAYLI ESNAF</span>
      </div>
      <div className="kimlik-satirlar">
        <div><small>Uzmanlık</small><b>Patatesçi</b></div>
        <div><small>Araç</small><b className="num">34 ABC 123</b></div>
        <div><small>Puan</small><b className="num"><IconYildiz size={13} /> 4,9</b></div>
      </div>
      <div className="kimlik-onaylar">
        <span><IconOnay size={13} /> Telefon doğrulandı</span>
        <span><IconOnay size={13} /> Künye onaylı</span>
      </div>
    </div>
  );
}

export function EsnafSiparisPhone() {
  return (
    <Phone>
      <MapMini h={100} />
      <div className="app-ui" style={{ paddingTop: 12 }}>
        <div className="gelen-siparis">
          <div className="gelen-ust">
            <b>Yeni sipariş</b>
            <span className="sayac num">12 sn</span>
          </div>
          <div className="gelen-konum"><IconKonum size={14} /> 2 km ötede · Caferağa Mah.</div>
          <div className="gelen-kalemler">
            <span><ProductIcon id="patates" size={16} /> 5 kg patates</span>
            <span><ProductIcon id="sogan" size={16} /> 3 kg soğan</span>
          </div>
          <div className="gelen-kazanc num">Kazanç: <b>145 ₺</b></div>
          <div className="gelen-butonlar">
            <span className="app-cta" style={{ margin: 0, flex: 1.4 }}>Kabul et</span>
            <span className="ret-btn">Reddet</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

export function EsnafKazancPhone() {
  const gunler = [34, 55, 42, 68, 50, 88, 74];
  return (
    <Phone>
      <div className="app-ui">
        <div className="app-top" style={{ marginBottom: 8 }}>
          <b style={{ fontSize: ".95rem" }}>Kazanç</b>
          <span className="app-pin">Bugün</span>
        </div>
        <div className="kazanc-buyuk num">2.840 ₺</div>
        <small className="kazanc-alt num">12 teslimat · 9,4 km yol</small>
        <div className="grafik" aria-hidden="true">
          {gunler.map((h, i) => (
            <i key={i} style={{ height: h + "%" }} className={i === 6 ? "on" : ""} />
          ))}
        </div>
        <div className="kazanc-satir num"><span>14:20 · 5 kg patates</span><b>145 ₺</b></div>
        <div className="kazanc-satir num"><span>13:05 · Sebze paketi</span><b>260 ₺</b></div>
        <div className="kazanc-satir num"><span>11:40 · 10 kg soğan</span><b>190 ₺</b></div>
      </div>
    </Phone>
  );
}
