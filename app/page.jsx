import { Suspense } from "react";
import Waitlist from "../components/Waitlist";
import ScrollFx from "../components/ScrollFx";
import TurkiyeHarita from "../components/TurkiyeHarita";
import {
  ProductIcon,
  IconTarti,
  IconKamera,
  IconKilit,
  IconOnay,
  IconKamyon,
  IconBelge,
  IconGrafik,
  IconKalkan,
  IconYukari,
  IconAsagi,
} from "../components/icons";
import {
  ToptanIlanPhone,
  UreticiIlanPhone,
  UreticiTekliflerPhone,
  UreticiOdemePhone,
  AliciPazarPhone,
  CanliVideoPhone,
  TasimaPhone,
  ToptanTeslimPhone,
  TopluAlimPhone,
  MusteriSiparisPhone,
} from "../components/Mockups";
import { fmtSayi } from "../lib/format";
import { halFiyatlariGetir } from "../lib/halFiyat";
import borsaRef from "../lib/borsa-referans.json";

// Ana sayfa bandı canlı kataloğa bağlı: 6 saatte bir yeniden üretilir (ISR).
export const revalidate = 21600;

export const metadata = {
  title: "patatesci — Tarladan işletmene, aracısız toptan tedarik",
  description:
    "Üreticiden esnafa, restorana, markete ve ihracatçıya doğrudan toptan sebze-meyve. Hasat ilanı, tarladan canlı video, peşin-güvenceli ödeme, künye/HKS uyumu. 81 ilde kuruluyor — uygulama yakında.",
};

const FIYATLAR = [
  { id: "patates", nm: "Patates", pr: 18.2, chg: 2.1 },
  { id: "sogan", nm: "Soğan", pr: 14.6, chg: -1.4 },
  { id: "domates", nm: "Domates", pr: 32.5, chg: 4.8 },
  { id: "biber", nm: "Biber", pr: 41.0, chg: 0.6 },
  { id: "salatalik", nm: "Salatalık", pr: 27.3, chg: -2.2 },
  { id: "havuc", nm: "Havuç", pr: 21.8, chg: 1.1 },
];

// SSS artık senaryo kataloğundan üretilen ortak kaynaktan gelir (lib/sss.mjs)
import { SSS } from "../lib/sss.mjs";

// Sunucuda canlı hal verisiyle üretilen band — tarih damgası curl ile doğrulanabilir.
async function CanliBant() {
  let hal = null;
  try { hal = await halFiyatlariGetir(); } catch { hal = null; }
  const halItems = (hal?.fiyatlar || FIYATLAR.map((f) => ({ id: f.id, halAdi: f.nm, orta: f.pr }))).map((f) => ({
    id: f.id, nm: f.halAdi || f.id, pr: f.orta,
  }));
  const borsaItems = borsaRef.urunler.map((u) => ({ id: u.id, nm: `${u.ad} (${u.cesitler.join("/")})`, pr: u.referans }));
  const damga = hal ? `Ankara Hal · ${hal.tarih}` : "Ankara Hal · yedek liste";
  // PERFORMANS: band kayan bir şerit; tüm katalog (85+ çeşit) DOM'a basılınca
  // her biri SVG ikonlu ~176 öğe oluşuyor ve Style & Layout maliyeti patlıyordu.
  // Şerit zaten döngüsel aktığı için ilk 10 kalem görsel olarak yeterli;
  // tam katalog /katalog sayfasında (ve /api/hal-fiyatlari'nda) duruyor.
  const items = [...halItems.slice(0, 10), ...borsaItems];
  return (
    <div className="ticker cv-serit" aria-hidden="true">
      <div className="ticker-inner">
        {[0, 1].map((tur) => (
          <span key={tur} style={{ display: "inline-flex", gap: 40 }}>
            <span className="ticker-item num"><b>{damga}</b></span>
            {items.map((f, i) => (
              <span className="ticker-item num" key={i}>
                <span className={"ticker-ic tic-" + f.id}><ProductIcon id={f.id} size={16} /></span>
                <b>{f.nm}</b> {fmtSayi(f.pr)} ₺
              </span>
            ))}
            <span className="ticker-item num">TMO / GTB / Bakanlık referanslı</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function TickerItem({ f }) {
  return (
    <span className="ticker-item num">
      <span className={"ticker-ic tic-" + f.id}><ProductIcon id={f.id} size={16} /></span>
      <b>{f.nm}</b> {fmtSayi(f.pr)} ₺
      <span className={"chg " + (f.chg >= 0 ? "up" : "down")}>
        {f.chg >= 0 ? <IconYukari size={10} /> : <IconAsagi size={10} />}
        %{fmtSayi(Math.abs(f.chg), 1)}
      </span>
    </span>
  );
}

function Story({ eyebrow, baslik, metin, phone, rev = false, ekstra = null, renk }) {
  return (
    <div className="reveal">
      <div className={"story" + (rev ? " rev" : "")}>
        <div>
          <span className="story-eyebrow" style={renk ? { color: renk } : undefined}>{eyebrow}</span>
          <h3>{baslik}</h3>
          <p>{metin}</p>
          {ekstra}
        </div>
        <div className="phone-wrap" data-parallax="12" style={{ willChange: "transform" }}>{phone}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <ScrollFx />
      {/* ================= HERO — TOPTAN ================= */}
      <section className="promo-hero">
        <div className="blob blob-yesil" aria-hidden="true" />
        <div className="blob blob-amber" aria-hidden="true" />
        <div className="container promo-grid">
          <div>
            <span className="pill">Yakında · iOS ve Android — ön kayıt açık</span>
            <h1>Tarladan işletmene. <span style={{ color: "var(--accent)" }}>Tonuyla, aracısız.</span></h1>
            <p className="lead">
              Esnaf, restoran, market, sanayici ve ihracatçı için üreticiden
              doğrudan toptan tedarik. Hasat ilanını gör, tarladan canlı videoyla
              malı incele, peşin-güvenceli öde.
            </p>
            <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
              <a href="#onkayit" className="btn btn-primary btn-shine">Uygulama çıkınca haber ver</a>
              <a href="#esnaf-katil" className="btn btn-outline">Üretici veya işletmeysen katıl</a>
            </div>
            <div className="stat-row">
              <div className="stat"><b className="num">81 il</b><span>hedef kapsama</span></div>
              <div className="stat"><b className="num">0</b><span>komisyoncu, vade, çek</span></div>
              <div className="stat"><b className="num">%100</b><span>güvenceli ödeme</span></div>
            </div>
          </div>
          <ToptanIlanPhone />
        </div>
      </section>

      {/* ================= CANLI FİYAT BANDI (hal + borsa referansları) =================
          Suspense: soğuk başlangıçta hal kaynağına giden POST sayfanın ilk boyamasını
          BEKLETMESİN — kabuk hemen akar, band hazır olunca yerine oturur. */}
      <Suspense fallback={<div className="ticker cv-serit" aria-hidden="true" style={{ minHeight: 46 }} />}>
        <CanliBant />
      </Suspense>

      {/* ================= TÜRKİYE HARİTASI ================= */}
      <section className="section cv" id="harita">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Lansman planı</p>
              <h2>81 ilde toptan ağı kuruluyor</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Üretim bölgelerinden başlayıp kademeli olarak tüm Türkiye'ye
                açılıyoruz. Bölgen listede — ön kayıt bırakan ilk haber alır.
              </p>
            </div>
            <TurkiyeHarita />
          </div>
        </div>
      </section>

      {/* ================= ÜRETİCİ HİKAYESİ (başrol) ================= */}
      <section className="section cv" id="uretici" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Üretici için</p>
              <h2>Hasadını tarladan sat, paran güvencede</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Komisyoncu yok, vade yok, çek yok. İlanını koy, teklifini seç;
                teslim onayında paran hesabında.
              </p>
            </div>
          </div>

          <Story
            renk="var(--amber-koyu)"
            eyebrow="Üretici · Adım 1"
            baslik="Hasadını 2 dakikada ilana koy"
            metin="Çeşit, ton, ₺/kg, hasat tarihi, ambalaj (dökme/çuval/kasa) — ve tarladan canlı video çekimi. İlanın künye/HKS bilgilerinle birlikte tüm Türkiye'deki alıcılara açılır."
            phone={<UreticiIlanPhone />}
          />

          <Story
            rev
            renk="var(--mor)"
            eyebrow="Üretici · Adım 2"
            baslik="Teklifler sana gelsin, en iyisini seç"
            metin="Market, restoran, ihracatçı — kim talip olduysa teklifi ekranında. Kabul ettiğin anda alıcının ödemesi peşin tahsil edilir ve güvence hesabına alınır."
            phone={<UreticiTekliflerPhone />}
          />

          <Story
            renk="var(--kirmizi-koyu)"
            eyebrow="Üretici · Adım 3"
            baslik="Yükle, teslim et — paran hesabında"
            metin="Yüklemede kantar fişi sisteme işlenir; teslim onaylandığı an bedel güvence hesabından doğrudan hesabına geçer. Kimsenin çekini beklemezsin, kimseye vade açmazsın."
            phone={<UreticiOdemePhone />}
          />
        </div>
      </section>

      {/* ================= TOPTAN ALICI HİKAYESİ ================= */}
      <section className="section cv" id="toptan">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Toptan alıcı için</p>
              <h2>Malı tarladan al, aradaki farkı sen kazan</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Esnaf, restoran, market, ihracatçı — hal fiyatı değil, tarla
                fiyatı.
              </p>
            </div>
          </div>

          <Story
            renk="var(--amber-koyu)"
            eyebrow="Alıcı · Adım 1"
            baslik="İhtiyacını yaz veya ilanları gez"
            metin="2 ton patates mi lazım? Talebini yaz ya da bölge bölge hasat ilanlarını incele: miktar, tarla fiyatı, kalite, künye durumu — hepsi açık."
            phone={<AliciPazarPhone />}
          />

          <Story
            rev
            renk="var(--mor)"
            eyebrow="Alıcı · Adım 2"
            baslik="Malı tarladan canlı videoyla gör"
            metin="Üretici sana tarladan canlı yayın açar; kaliteyi kendi gözünle doğrularsın. Görmediğin mala ödeme yapmazsın."
            phone={<CanliVideoPhone />}
          />

          <Story
            renk="var(--kirmizi-koyu)"
            eyebrow="Alıcı · Adım 3"
            baslik="Taşımayı seç, peşin-güvenceli öde"
            metin="Üreticinin plakalı aracı, tarladan gel-al veya anlaşmalı nakliyeci — sana uyanı seç. Ödemen teslim onayına kadar güvence hesabında bekler."
            phone={<TasimaPhone />}
          />

          <Story
            rev
            eyebrow="Alıcı · Adım 4"
            baslik="Teslimde tartı kontrolü, sonra onay"
            metin="Mal kapında tartılır, beyanla karşılaştırılır; eksik çıkarsa fark otomatik iade edilir. Sen onayladığında ödeme üreticiye geçer."
            phone={<ToptanTeslimPhone />}
          />
        </div>
      </section>

      {/* ================= BELGE OTOMASYONU ================= */}
      <section className="section cv" id="belge" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Belge otomasyonu</p>
              <h2>Evrak işini biz hallederiz</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Sen malına bak; künyeden rüsuma bürokrasi platformda otomatik yürür.
              </p>
            </div>
            <div className="grid grid-3 stagger">
              <div className="card"><div className="icon ik-yesil"><IconOnay /></div><h3>HKS Bildirimi & Künye</h3><p>Her işlemin Hal Kayıt Sistemi bildirimi ve künye eşleşmesi otomatik yapılır.</p></div>
              <div className="card"><div className="icon ik-mor"><IconKamyon /></div><h3>e-İrsaliye Takibi</h3><p>Sevkiyatın e-irsaliyesi düzenlenir, plaka kaydıyla eşleştirilir ve arşivlenir.</p></div>
              <div className="card"><div className="icon ik-amber"><IconBelge /></div><h3>Müstahsil / e-Fatura</h3><p>Üreticiye müstahsil makbuzu, işletmeye e-fatura — satış kapanışında otomatik kesilir.</p></div>
              <div className="card"><div className="icon ik-kirmizi"><IconTarti /></div><h3>Kantar Fişi Arşivi</h3><p>Yükleme ve varış kantar fişleri siparişe iliştirilir; tartı uyuşmazlığında kanıt hazırdır.</p></div>
              <div className="card"><div className="icon ik-yesil"><IconGrafik /></div><h3>Rüsum Hesabı & Muafiyeti</h3><p>Rüsum otomatik hesaplanır; üretici kanalı muafiyetleri kuruşu kuruşuna uygulanır.</p></div>
              <div className="card"><div className="icon ik-mor"><IconKalkan /></div><h3>Teslim Tutanağı & İtiraz</h3><p>Her teslim tutanakla kapanır; itiraz süreci kayıtlı belgeler üzerinden yürür.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAHALLE ŞERİDİ ================= */}
      <div className="reveal mahalle-serit">
        <img src="/illus/mahalle.svg" alt="Mahalle sokağında manav dükkanları illüstrasyonu" loading="lazy" />
      </div>

      {/* ================= MAHALLE TOPLU ALIMI (köprü) ================= */}
      <section className="section cv" id="toplu" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <Story
            renk="var(--amber-koyu)"
            eyebrow="Mahalle toplu alımı"
            baslik="10 komşu, tek tarla siparişi"
            metin="Komşular 10'ar kiloluk taleplerini havuzda toplar; sistem bunları TEK tarla siparişinde birleştirir ve sipariş ancak 1,0 tonu doldurunca işleme dönüşür (asgari ton kuralı istisnasızdır — dolmayan köprü işleme girmez). Mahalle esnafı dağıtımı üstlenir ve dağıtım ücretini kazanır."
            phone={<TopluAlimPhone />}
          />
        </div>
      </section>

      {/* ================= KAPIYA TESLİMAT — SIRADA ================= */}
      <section className="section cv" id="kapiya">
        <div className="container">
          <Story
            rev
            eyebrow="Yol haritası"
            baslik="Kapına teslimat"
            metin="Toptan ağ kurulduğunda sıra buna gelecek: taksi çağırır gibi sebze-meyve siparişi, en yakın esnaftan kapına. Ön kayıt bırak; bölgende açıldığı gün ilk sen dene."
            ekstra={
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                <span className="tag sirada">Sırada</span>
                <a href="#onkayit" className="btn btn-outline">Ön kayıt bırak</a>
              </div>
            }
            phone={<MusteriSiparisPhone matched />}
          />
        </div>
      </section>

      {/* ================= GÜVENCE (toptan dili) ================= */}
      <section className="section cv" id="guvence" style={{ background: "var(--bg-soft)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Güvence altyapısı</p>
              <h2>Ton ton mal, kuruş kuruş güvence</h2>
            </div>
            <div className="grid grid-3 stagger">
              <div className="card"><div className="icon ik-yesil"><IconOnay /></div><h3>Onaylı Üretici</h3><p>Yalnızca künyesi ve HKS kaydı doğrulanmış üretici ilan verebilir; kimden aldığını bilirsin.</p></div>
              <div className="card"><div className="icon ik-mor"><IconKamyon /></div><h3>Plaka Kaydı</h3><p>Sevkiyatı yapan aracın plakası sipariş kaydındadır; yükün nerede, kimde — bellidir.</p></div>
              <div className="card"><div className="icon ik-amber"><IconTarti /></div><h3>Tartı Garantisi</h3><p>Ton bazında beyan-teslim karşılaştırması yapılır; eksik tartıda bedel farkı iade edilir.</p></div>
              <div className="card"><div className="icon ik-kirmizi"><IconKamera /></div><h3>Tarladan Canlı Video</h3><p>Malı satın almadan önce tarladan canlı yayında görür, kaliteyi kendin onaylarsın.</p></div>
              <div className="card"><div className="icon ik-yesil"><IconKilit /></div><h3>Ödeme Güvencesi</h3><p>Peşin-güvenceli model: alıcı vade beklemez, üretici çek riski taşımaz; bedel teslim onayında aktarılır.</p></div>
              <div className="card"><div className="icon ik-mor"><IconBelge /></div><h3>Künye & HKS Uyumu</h3><p>Künye, Hal Kayıt Sistemi bildirimi, rüsum ve belgelendirme platformda otomatik yürütülür.</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ŞEFFAF TİCARET ================= */}
      <section className="section cv" id="seffaf">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Şeffaf ticaret</p>
              <h2>Üç kağıda yer yok</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Her tartı kanıtlı, her ceza iki taraflı, her karar gerekçeli.
                Kural kitabımız herkese açık.
              </p>
            </div>
            <div className="grid grid-3 stagger">
              <div className="card"><div className="icon ik-amber"><IconTarti /></div><h3>Kanıtlı Tartı</h3><p>Damgalı kantar fişi zorunlu, tolerans ±%1; eksik tartıda eksiğin 2 katı alıcıya iade edilir.</p></div>
              <div className="card"><div className="icon ik-yesil"><IconKalkan /></div><h3>İki Taraflı Ceza Matrisi</h3><p>Haksız iptal de haksız red de bedel öder — satıcıya da alıcıya da aynı adalet, kademeli ve skorlu.</p></div>
              <div className="card"><div className="icon ik-mor"><IconBelge /></div><h3>Gerekçeli Hakem Kararı</h3><p>İtirazda 24 saat kanıt penceresi, 48 saatte yazılı ve gerekçeli karar; kanıtı eksik olan aleyhine karine.</p></div>
            </div>
            <div style={{ textAlign: "center", marginTop: 26 }}>
              <a href="/hukuki/ticaret-kurallari" className="btn btn-outline">Kural kitabını oku</a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RAKAMLAR ŞERİDİ ================= */}
      <div className="rakamlar">
        <div className="container rakamlar-ic">
          <div className="rakam"><b className="num" data-sayac="81" data-sonek=" il" style={{ display: "inline-block", minWidth: "3.1em" }}>81 il</b><span>hedef kapsama alanı</span></div>
          <div className="rakam"><b className="num" data-sayac="100000" data-sonek=" ton" style={{ display: "inline-block", minWidth: "6.9em" }}>100.000 ton</b><span>ilk yıl işlem hacmi hedefi</span></div>
          <div className="rakam"><b className="num" data-sayac="25" data-onek="%" style={{ display: "inline-block", minWidth: "1.9em" }}>%25</b><span>tarla fiyatı avantajı hedefi (azami)</span></div>
        </div>
      </div>

      {/* ================= ESNAF ÇAĞRISI (çift rol) ================= */}
      <section className="section cagri cv" id="esnaf-katil">
        <div className="container cagri-grid">
          <div className="reveal">
            <img src="/illus/esnaf-arac.svg" alt="Üç tekerlekli aracıyla mahalle esnafı illüstrasyonu" className="illus-yan" loading="lazy" />
          </div>
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <p className="eyebrow">Üretici ve işletme çağrısı</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>Mahallenin patatesci'si ol</h2>
            <p className="muted" style={{ margin: "14px 0 22px", maxWidth: 460 }}>
              Esnafsan iki kazanç kapın var: malını halden değil tarladan al —
              aradaki farkı sen kazan. Üstüne mahalle toplu alımlarının
              dağıtımını üstlen, dağıtım ücretini de sen al. Üreticiysen hasadını
              aracısız sat. Ön kayıt ücretsizdir, bağlayıcı değildir.
            </p>
            <Waitlist
              defaultRol="toptan"
              etiket="Üretici / işletme ön kaydı"
              baslik="Aramıza katıl"
              aciklama="Uygulama bölgende açıldığında ilk davet sana gelsin."
              buton="Ön kayıt bırak"
            />
          </div>
        </div>
      </section>

      {/* ================= SSS ================= */}
      <section className="section cv" id="sss">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <p className="eyebrow">Sık sorulan sorular</p>
              <h2>Merak edilenler</h2>
            </div>
            <div className="acc">
              {SSS.map((it, i) => (
                <details key={i} className="acc-item" name="sss" open={i === 0 || undefined}>
                  <summary className="acc-head">{it.q}<span className="acc-icon">+</span></summary>
                  <div className="acc-body"><p>{it.a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= UYGULAMA YOLDA + ÖN KAYIT ================= */}
      <section className="section cv" id="onkayit" style={{ background: "var(--bg-soft)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <img src="/illus/kasalar.svg" alt="Kasalarda taze sebze illüstrasyonu" style={{ width: 260, maxWidth: "70%" }} loading="lazy" />
            </div>
            <p className="eyebrow">Erken erişim</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>Uygulama yolda</h2>
            <p className="muted" style={{ maxWidth: 500, margin: "14px auto 24px" }}>
              iOS ve Android uygulamaları geliştirme aşamasında; toptan ağ önce
              üretici ve işletmelere açılacak. E-postanı bırak, yayına girdiği
              gün ilk haberi sen al.
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
              <Waitlist defaultRol="toptan" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
