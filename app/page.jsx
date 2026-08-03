import Link from "next/link";
import Accordion from "../components/Accordion";
import Waitlist from "../components/Waitlist";
import {
  ProductIcon,
  IconKalkan,
  IconTarti,
  IconKamera,
  IconBelge,
  IconKamyon,
  IconKilit,
  IconKonum,
  IconKutu,
  IconOnay,
  IconYukari,
  IconAsagi,
} from "../components/icons";
import { fmtSayi, fmtTLkg } from "../lib/format";

export const metadata = {
  title: "patatesçi — Tarladan kapına, taksi çağırır gibi",
  description:
    "Sebze-meyvede yeni dönem: siparişini oluştur, en yakın üreticiyle eşleş, ürünü canlı görüntüyle doğrula, kapında teslim al. Mobil uygulama çok yakında.",
};

const FIYATLAR = [
  { id: "patates", nm: "Patates", pr: 18.2, chg: 2.1 },
  { id: "sogan", nm: "Soğan", pr: 14.6, chg: -1.4 },
  { id: "domates", nm: "Domates", pr: 32.5, chg: 4.8 },
  { id: "biber", nm: "Biber", pr: 41.0, chg: 0.6 },
  { id: "salatalik", nm: "Salatalık", pr: 27.3, chg: -2.2 },
  { id: "havuc", nm: "Havuç", pr: 21.8, chg: 1.1 },
];

const SSS = [
  { q: "Sipariş süreci nasıl işler?", a: "Siparişinizi oluşturursunuz; konumunuza en yakın satıcı ile saniyeler içinde eşleştirilirsiniz. Ürünü teslimattan önce canlı görüntülü bağlantı üzerinden doğrularsınız." },
  { q: "Ödeme güvenliği nasıl sağlanır?", a: "Ödemeniz peşin tahsil edilir ancak teslimat onaylanana kadar güvence hesabında tutulur. Uyuşmazlık durumunda bedel iade edilir." },
  { q: "Fiyat avantajı nereden kaynaklanır?", a: "Aracı katmanlar kalkar: üretici daha çok kazanır, siz daha az ödersiniz. Tüm fiyatlar PTX Endeksi ile herkese açıktır; pazarlık ve sürpriz yoktur." },
  { q: "Üretici kendi ürününü satabilir mi?", a: "Evet. Üretici ürününü doğrudan listeler; künye, Hal Kayıt Sistemi bildirimi, rüsum ve belge süreçleri platform tarafından otomatik yürütülür." },
  { q: "Mobil uygulama ne zaman geliyor?", a: "iOS ve Android uygulamaları geliştirme aşamasındadır. Ön kayıt oluşturursanız açılışta öncelikli erişim sizde olur." },
];

function TickerItem({ f }) {
  return (
    <span className="ticker-item num">
      <span className="ticker-ic"><ProductIcon id={f.id} size={16} /></span>
      <b>{f.nm}</b> {fmtSayi(f.pr)} ₺
      <span className={"chg " + (f.chg >= 0 ? "up" : "down")}>
        {f.chg >= 0 ? <IconYukari size={10} /> : <IconAsagi size={10} />}
        %{fmtSayi(Math.abs(f.chg), 1)}
      </span>
    </span>
  );
}

function PhoneOrder() {
  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="screen">
          <div className="notch"><i /></div>
          <div className="app-ui">
            <div className="app-top">
              <span className="brand" style={{ fontSize: ".95rem" }}><span className="dot" /> patatesçi</span>
              <span className="app-pin"><IconKonum size={14} /> Kadıköy</span>
            </div>
            <div className="app-search">Bugün ne lazım?</div>
            {FIYATLAR.slice(0, 3).map((f) => (
              <div className="app-item" key={f.id}>
                <span className="app-thumb"><ProductIcon id={f.id} size={20} /></span>
                <span className="app-item-meta">
                  <b>{f.nm}</b>
                  <small className="num">{fmtTLkg(f.pr)}</small>
                </span>
                <span className="app-add">+</span>
              </div>
            ))}
            <div className="app-cta">Sipariş ver</div>
          </div>
          <div className="match-card">
            <span className="match-ic"><IconKamyon size={20} /></span>
            <span className="match-meta">
              <b>Hasan Manav eşleşti</b>
              <small>0,8 km · 18 dk içinde kapında</small>
            </span>
            <span className="match-ok"><IconOnay size={18} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneTracking() {
  return (
    <div className="phone-wrap">
      <div className="phone">
        <div className="screen">
          <div className="notch"><i /></div>
          <div className="track-head">
            <b>Siparişin yolda</b>
            <span className="eta-chip num">18 dk</span>
          </div>
          <svg className="track-map" viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="280" height="300" fill="#edf2ed" />
            <g stroke="#dce4dc" strokeWidth="6">
              <path d="M0 60h280M0 140h280M0 225h280M55 0v300M150 0v300M228 0v300" />
            </g>
            <rect x="160" y="150" width="58" height="64" rx="8" fill="#e2ebe2" />
            <path d="M30 262 L55 262 Q64 262 64 253 L64 148 Q64 140 72 140 L150 140 L150 60 L236 60" fill="none" stroke="#2e8b63" strokeWidth="3.5" strokeDasharray="7 6" strokeLinecap="round" />
            <circle cx="30" cy="262" r="7" fill="#fff" stroke="#2e8b63" strokeWidth="3" />
            <g transform="translate(138 48)">
              <rect width="24" height="24" rx="7" fill="#2e8b63" />
              <path d="M5 8h8v8H5zM13 10h3l2.5 2.5V16H13zM8 17.5a1.4 1.4 0 1 0 0 .01M15.5 17.5a1.4 1.4 0 1 0 0 .01" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
            </g>
            <g transform="translate(228 44)">
              <path d="M8 22s-8-6.4-8-12a8 8 0 0 1 16 0c0 5.6-8 12-8 12Z" fill="#1c2420" />
              <circle cx="8" cy="10" r="2.6" fill="#fff" />
            </g>
          </svg>
          <div className="track-card">
            <span className="match-ic"><IconKamyon size={20} /></span>
            <span className="match-meta">
              <b>Hasan Manav · 34 PT 1919</b>
              <small>Canlı doğrulama tamamlandı · ödeme güvencede</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="promo-hero">
        <div className="container promo-grid">
          <div>
            <span className="pill"><IconTelefonMini /> Mobil uygulama çok yakında</span>
            <h1>Tarladan kapına. Taksi çağırır gibi.</h1>
            <p className="lead">
              Siparişini oluştur; patatesçi seni en yakın üreticiyle eşleştirsin.
              Ürünü canlı görüntüyle gör, onayla, kapında teslim al. Ödemen
              teslimata kadar güvencede.
            </p>
            <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
              <a href="#onkayit" className="btn btn-primary">Ön kayıt ol</a>
              <a href="#nasil" className="btn btn-outline">Nasıl çalışır?</a>
            </div>
            <div className="stat-row">
              <div className="stat"><b className="num">18 dk</b><span>ortalama eşleşme</span></div>
              <div className="stat"><b className="num">%15</b><span>aracısız fiyat avantajı</span></div>
              <div className="stat"><b className="num">%100</b><span>güvenceli ödeme</span></div>
            </div>
          </div>
          <PhoneOrder />
        </div>
      </section>

      {/* ============ FİYAT BANDI ============ */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          {[...FIYATLAR, ...FIYATLAR].map((f, i) => <TickerItem f={f} key={i} />)}
        </div>
      </div>

      {/* ============ NASIL ÇALIŞIR ============ */}
      <section className="section" id="nasil">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Nasıl çalışır</p>
            <h2>Dört adımda kapında</h2>
          </div>
          <div className="steps">
            <div className="step">
              <span className="no">01</span>
              <div className="icon"><IconKutu /></div>
              <h3>Sipariş ver</h3>
              <p>Ürünleri seç, miktarı belirle. Fiyatlar herkese açık, pazarlık yok.</p>
            </div>
            <div className="step">
              <span className="no">02</span>
              <div className="icon"><IconKonum /></div>
              <h3>Eşleş</h3>
              <p>Konumuna en yakın üretici veya satıcı saniyeler içinde atanır.</p>
            </div>
            <div className="step">
              <span className="no">03</span>
              <div className="icon"><IconKamera /></div>
              <h3>Canlı gör</h3>
              <p>Teslimden önce ürünü kamerayla gör, kaliteyi kendin onayla.</p>
            </div>
            <div className="step">
              <span className="no">04</span>
              <div className="icon"><IconKamyon /></div>
              <h3>Teslim al</h3>
              <p>Araç kapına gelir. Ödeme, onayınla birlikte satıcıya geçer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CANLI TAKİP (koyu) ============ */}
      <section className="dark-section">
        <div className="container promo-grid">
          <PhoneTracking />
          <div>
            <p className="eyebrow" style={{ color: "#7fd0ab" }}>Canlı takip</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 10 }}>Siparişin nerede, her an gör</h2>
            <p className="muted" style={{ marginTop: 14, maxWidth: 480 }}>
              Taksi uygulamasından alışık olduğun deneyim, sebze-meyvede: aracın
              konumu ve tahmini varış süresi canlı; ürün kalitesi teslimden önce
              kamerada.
            </p>
            <ul className="dark-list">
              <li><span className="ic"><IconKonum size={20} /></span><span><b>Canlı konum ve varış süresi</b><br /><small>Araç yola çıktığı andan kapına kadar haritada.</small></span></li>
              <li><span className="ic"><IconTarti size={20} /></span><span><b>Tartı garantisi</b><br /><small>Eksik tartı tespitinde bedel farkı anında iade edilir.</small></span></li>
              <li><span className="ic"><IconKilit size={20} /></span><span><b>Güvenceli ödeme</b><br /><small>Bedel, teslimatı onaylayana kadar güvence hesabında bekler.</small></span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ ŞEFFAF FİYAT ============ */}
      <section className="section">
        <div className="container promo-grid">
          <div>
            <p className="eyebrow">Şeffaf fiyat</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 10 }}>Fiyatlar herkese açık</h2>
            <p className="muted" style={{ marginTop: 14, maxWidth: 460 }}>
              PTX Endeksi tüm alım-satımların ortak referansıdır. Piyasa bandı
              dışındaki teklifler sistem tarafından otomatik reddedilir; kimse
              kimseyi kandıramaz.
            </p>
            <div style={{ marginTop: 22 }}>
              <Link href="/borsa" className="btn btn-outline">Canlı borsayı incele</Link>
            </div>
          </div>
          <div className="price-board panel">
            <div className="eyebrow">PTX Endeksi · ₺/kg</div>
            {FIYATLAR.map((f) => (
              <div className="price-row num" key={f.id}>
                <span className="ticker-ic"><ProductIcon id={f.id} size={18} /></span>
                <b>{f.nm}</b>
                <span className="price-val">{fmtSayi(f.pr)}</span>
                <span className={"chg " + (f.chg >= 0 ? "up" : "down")}>
                  {f.chg >= 0 ? <IconYukari size={10} /> : <IconAsagi size={10} />}
                  %{fmtSayi(Math.abs(f.chg), 1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GÜVENCE ============ */}
      <section className="section" style={{ background: "var(--bg-soft)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Güvence altyapısı</p>
            <h2>Her siparişin arkasında dört güvence</h2>
          </div>
          <div className="grid grid-4">
            <div className="card"><div className="icon"><IconKalkan /></div><h3>Alıcı Güvencesi</h3><p>Ödeme, teslimat onaylanana kadar güvence hesabında tutulur; uyuşmazlıkta iade edilir.</p></div>
            <div className="card"><div className="icon"><IconTarti /></div><h3>Tartı Garantisi</h3><p>Teslim edilen miktar kayıt altındadır; eksik tartıda bedel farkı tazmin edilir.</p></div>
            <div className="card"><div className="icon"><IconKamera /></div><h3>Canlı Görüntülü Doğrulama</h3><p>Ürün kalitesini teslimattan önce canlı görüntülü bağlantıyla doğrularsın.</p></div>
            <div className="card"><div className="icon"><IconBelge /></div><h3>Yasal Uyum</h3><p>HKS bildirimi, künye takibi, rüsum ve belgelendirme otomatik yürütülür.</p></div>
          </div>
        </div>
      </section>

      {/* ============ SSS ============ */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Sık sorulan sorular</p>
            <h2>Merak edilenler</h2>
          </div>
          <Accordion items={SSS} />
        </div>
      </section>

      {/* ============ UYGULAMA + ÖN KAYIT ============ */}
      <section className="section" id="onkayit" style={{ background: "var(--bg-soft)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p className="eyebrow">Erken erişim</p>
          <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>Uygulama yolda</h2>
          <p className="muted" style={{ maxWidth: 480, margin: "14px auto 24px" }}>
            Bugün web'de tanıtımdayız; iOS ve Android uygulamaları geliştirme
            aşamasında. Ön kayıt oluştur, açılışta öncelik senin olsun.
          </p>
          <div className="store-badges">
            <span className="store-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15.5 7.5c1.8 0 3 .9 3.8 2.1-2 1.2-2.4 4.3.4 5.6-.7 1.9-2.1 4.3-3.9 4.3-1.1 0-1.5-.7-2.9-.7s-1.9.7-2.9.7c-1.9 0-4.5-4-4.5-7.4 0-3 1.9-4.6 3.9-4.6 1.1 0 2 .7 2.7.7.7 0 1.9-.7 3.4-.7Z" /><path d="M14.8 4.2c.6-.8.9-1.7.8-2.7-1 .1-1.9.6-2.6 1.4-.6.7-1 1.7-.8 2.6 1 0 1.9-.5 2.6-1.3Z" /></svg>
              <span><small>YAKINDA</small><b>App Store</b></span>
            </span>
            <span className="store-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M5 3.5v17L18.5 12 5 3.5Z" /><path d="M5 3.5 14.8 14M5 20.5 14.8 10" /></svg>
              <span><small>YAKINDA</small><b>Google Play</b></span>
            </span>
          </div>
          <div style={{ marginTop: 32 }}>
            <Waitlist />
          </div>
        </div>
      </section>
    </main>
  );
}

function IconTelefonMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2.4" />
      <path d="M11 18.4h2" />
    </svg>
  );
}
