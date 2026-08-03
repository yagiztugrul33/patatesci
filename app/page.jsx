import Accordion from "../components/Accordion";
import Waitlist from "../components/Waitlist";
import Reveal from "../components/Reveal";
import Parallax from "../components/Parallax";
import Sayac from "../components/Sayac";
import TurkiyeHarita from "../components/TurkiyeHarita";
import {
  ProductIcon,
  IconKalkan,
  IconTarti,
  IconKamera,
  IconKilit,
  IconOnay,
  IconKamyon,
  IconYukari,
  IconAsagi,
} from "../components/icons";
import {
  MusteriSiparisPhone,
  MusteriEslesmePhone,
  MusteriTakipPhone,
  MusteriTeslimPhone,
  EsnafKayitPhone,
  EsnafSiparisPhone,
  EsnafKazancPhone,
  OnayliEsnafKarti,
} from "../components/Mockups";
import { fmtSayi } from "../lib/format";

export const metadata = {
  title: "patatesçi — Türkiye'nin sebze-meyve ağı kuruluyor",
  description:
    "Mahallenin manavı, pazarcısı, üreticisi tek uygulamada. Sipariş ver; en yakın onaylı esnaf kapına getirsin. 81 ilde kuruluyoruz — uygulama yakında.",
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
  { q: "patatesçi nedir?", a: "Mahallenin manavını, pazarcısını ve üreticisini alıcıyla doğrudan buluşturan bir uygulamadır. Sipariş verirsin; sana en yakın onaylı esnaf kabul eder ve kapına getirir." },
  { q: "Neden daha ucuz?", a: "Aracı katmanlar kalkar: esnaf ve üretici daha çok kazanır, sen daha az ödersin. Fiyatlar herkese açık piyasa bandında oluşur; bandın dışına çıkan teklif sisteme giremez." },
  { q: "Esnaf olarak nasıl katılırım?", a: "Uygulama yayına girdiğinde uzmanlığınla (patatesçi, soğancı, manav…) kaydolursun; telefonun doğrulanır, araç plakan kaydedilir, künyen onaylanır. Bu sayfadaki esnaf ön kaydını bırakırsan açılışta ilk sıraya geçersin." },
  { q: "Güvenlik nasıl sağlanıyor?", a: "Yalnızca onaylı esnaf sipariş alabilir: plaka kayıtlı, telefon doğrulanmış, belge onaylı. Aramalar uygulama üzerinden bağlanır, numaran gizli kalır. Ödemen teslimatı onaylayana kadar güvence hesabında bekler." },
  { q: "Ne zaman geliyor?", a: "Uygulama iOS ve Android için geliştirme aşamasındadır; 81 ilde kademeli açılış planlıyoruz. Ön kayıt bırakanlara açılış sırası önceden bildirilecek." },
];

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
    <Reveal>
      <div className={"story" + (rev ? " rev" : "")}>
        <div>
          <span className="story-eyebrow" style={renk ? { color: renk } : undefined}>{eyebrow}</span>
          <h3>{baslik}</h3>
          <p>{metin}</p>
          {ekstra}
        </div>
        <Parallax className="phone-wrap">{phone}</Parallax>
      </div>
    </Reveal>
  );
}

export default function Home() {
  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="promo-hero">
        <div className="blob blob-yesil" aria-hidden="true" />
        <div className="blob blob-amber" aria-hidden="true" />
        <div className="container promo-grid">
          <div>
            <span className="pill">Yakında · iOS ve Android</span>
            <h1>Türkiye'nin sebze-meyve ağı kuruluyor. <span style={{ color: "var(--accent)" }}>81 ilde.</span></h1>
            <p className="lead">
              Mahallenin manavı, pazarcısı, üreticisi tek uygulamada. Sen sipariş
              ver; en yakın onaylı esnaf kabul etsin, canlı görüntüyle göster,
              kapına getirsin.
            </p>
            <div className="hero-actions" style={{ justifyContent: "flex-start" }}>
              <a href="#onkayit" className="btn btn-primary btn-shine">Uygulama çıkınca haber ver</a>
              <a href="#esnaf-katil" className="btn btn-outline">Esnaf mısın? Aramıza katıl</a>
            </div>
            <div className="stat-row">
              <div className="stat"><b className="num">81 il</b><span>hedef kapsama</span></div>
              <div className="stat"><b className="num">%15</b><span>aracısız fiyat hedefi</span></div>
              <div className="stat"><b className="num">%100</b><span>güvenceli ödeme</span></div>
            </div>
          </div>
          <MusteriSiparisPhone matched />
        </div>
      </section>

      {/* ================= FİYAT BANDI ================= */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-inner">
          {[...FIYATLAR, ...FIYATLAR].map((f, i) => <TickerItem f={f} key={i} />)}
        </div>
      </div>

      {/* ================= TÜRKİYE HARİTASI ================= */}
      <section className="section cv" id="harita">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Lansman planı</p>
              <h2>81 ilde kuruluyoruz</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Büyük şehirlerden başlayıp kademeli olarak tüm Türkiye'ye
                açılıyoruz. Mahallen listede — ön kayıt bırakan ilk haber alır.
              </p>
            </div>
            <TurkiyeHarita />
          </Reveal>
        </div>
      </section>

      {/* ================= MAHALLE ŞERİDİ ================= */}
      <Reveal className="mahalle-serit">
        <img src="/illus/mahalle.svg" alt="Mahalle sokağında manav dükkanları illüstrasyonu" loading="lazy" />
      </Reveal>

      {/* ================= ESNAF HİKAYESİ ================= */}
      <section className="section cv" id="esnaf" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Esnaf için</p>
              <h2>Dükkanında bekleme, mahallen seni bulsun</h2>
              <p className="muted" style={{ marginTop: 10 }}>
                Taksi uygulaması şoföre nasıl yolcu bulursa, patatesçi de esnafa
                sipariş bulur. Başrol sende.
              </p>
            </div>
          </Reveal>

          <Story
            renk="var(--amber-koyu)"
            eyebrow="Esnaf · Adım 1"
            baslik="Uzmanlığınla kaydol"
            metin="Patatesçi misin, soğancı mı, genel manav mı? Kendini uzmanlığınla tanıt. Telefonun doğrulanır, araç plakan kaydedilir, künyen onaylanır — ve sana kimseye verilmeyen şey verilir: Onaylı Esnaf kimliği."
            phone={
              <div className="kayit-gorsel">
                <EsnafKayitPhone />
                <OnayliEsnafKarti />
              </div>
            }
          />

          <Story
            rev
            renk="var(--kirmizi-koyu)"
            eyebrow="Esnaf · Adım 2"
            baslik="Sipariş sana düşer"
            metin="Mahallenden biri sipariş verdiğinde telefonun çalar: ne istendiği, kaç kilo olduğu, ne kazanacağın ve kaç km ötede olduğu ekranda. Uygunsan kabul et; değilsen reddet, sipariş sıradaki esnafa geçsin."
            phone={<EsnafSiparisPhone />}
          />

          <Story
            renk="var(--mor)"
            eyebrow="Esnaf · Adım 3"
            baslik="Kazancın gün gün cebinde"
            metin="Kaç teslimat yaptın, ne kazandın, hafta nasıl gidiyor — hepsi tek ekranda. Ödemeler güvence hesabından doğrudan hesabına aktarılır; kimseye bağlı kalmazsın."
            phone={<EsnafKazancPhone />}
          />
        </div>
      </section>

      {/* ================= MÜŞTERİ HİKAYESİ ================= */}
      <section className="section cv" id="musteri">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Nasıl çalışır</p>
              <h2>Sen sipariş ver, gerisini mahallen halletsin</h2>
            </div>
          </Reveal>

          <Story
            renk="var(--amber-koyu)"
            eyebrow="Müşteri · Adım 1"
            baslik="Siparişini oluştur"
            metin="Ne lazımsa seç: 5 kilo patates, 3 kilo soğan… Fiyatlar herkese açık piyasa bandından; pazarlık yok, sürpriz yok."
            phone={<MusteriSiparisPhone />}
          />

          <Story
            rev
            renk="var(--mor)"
            eyebrow="Müşteri · Adım 2"
            baslik="En yakın onaylı esnafla eşleş"
            metin="Sipariş, sana en yakın onaylı esnafa düşer. Kim olduğunu görürsün: adı, uzmanlığı, plakası, puanı, mesafesi. Gerekirse tek dokunuşla ararsın — numaran gizli kalır, arama uygulama üzerinden bağlanır."
            phone={<MusteriEslesmePhone />}
          />

          <Story
            renk="var(--kirmizi-koyu)"
            eyebrow="Müşteri · Adım 3"
            baslik="Canlı takip et, canlı gör"
            metin="Araç yola çıktığı andan itibaren haritada; varış süresi ekranda. Üstelik ürünü teslimden önce canlı görüntüyle görür, kaliteyi kendin onaylarsın."
            phone={<MusteriTakipPhone />}
          />

          <Story
            rev
            eyebrow="Müşteri · Adım 4"
            baslik="Kapında teslim al, puanla"
            metin="Teslimatta miktar tartıyla kayıt altına alınır; eksik çıkarsa fark iade edilir. Ödemen ancak sen onayladığında esnafa geçer. Son söz: esnafını puanla, mahallenin en iyileri öne çıksın."
            phone={<MusteriTeslimPhone />}
          />
        </div>
      </section>

      {/* ================= GÜVENCE ================= */}
      <section className="section cv" id="guvence" style={{ background: "var(--bg-soft)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Güvence altyapısı</p>
              <h2>Tanımadığın kimse kapına gelmez</h2>
            </div>
            <div className="grid grid-3 stagger">
              <div className="card"><div className="icon ik-yesil"><IconOnay /></div><h3>Onaylı Esnaf</h3><p>Yalnızca kimliği, belgesi ve künyesi onaylanmış esnaf sipariş alabilir.</p></div>
              <div className="card"><div className="icon ik-mor"><IconKamyon /></div><h3>Plaka Kaydı</h3><p>Teslimatı yapan aracın plakası sistemde kayıtlıdır; kapına kimin geldiğini bilirsin.</p></div>
              <div className="card"><div className="icon ik-amber"><IconTarti /></div><h3>Tartı Garantisi</h3><p>Teslim edilen miktar kayıt altındadır; eksik tartıda bedel farkı iade edilir.</p></div>
              <div className="card"><div className="icon ik-kirmizi"><IconKamera /></div><h3>Canlı Görüntü</h3><p>Ürünü teslimden önce canlı görüntüyle görür, kaliteyi kendin onaylarsın.</p></div>
              <div className="card"><div className="icon ik-yesil"><IconKilit /></div><h3>Ödeme Güvencesi</h3><p>Ödemen teslimatı onaylayana kadar güvence hesabında bekler; sorun olursa iade edilir.</p></div>
              <div className="card"><div className="icon ik-mor"><IconKalkan /></div><h3>Gizli Numara</h3><p>Aramalar uygulama üzerinden bağlanır; telefon numaran kimseyle paylaşılmaz.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= RAKAMLAR ŞERİDİ ================= */}
      <div className="rakamlar">
        <div className="container rakamlar-ic">
          <div className="rakam"><Sayac hedef={81} sonek=" il" /><span>hedef kapsama alanı</span></div>
          <div className="rakam"><Sayac hedef={10000} sonek="+" /><span>ilk yıl esnaf hedefi</span></div>
          <div className="rakam"><Sayac hedef={15} onek="%" /><span>aracısız fiyat avantajı hedefi</span></div>
        </div>
      </div>

      {/* ================= ESNAF ÇAĞRISI ================= */}
      <section className="section cagri cv" id="esnaf-katil">
        <div className="container cagri-grid">
          <Reveal>
            <img src="/illus/esnaf-arac.svg" alt="Üç tekerlekli aracıyla mahalle esnafı illüstrasyonu" className="illus-yan" loading="lazy" />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Esnaf çağrısı</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>Mahallenin patatesçisi ol</h2>
            <p className="muted" style={{ margin: "14px 0 22px", maxWidth: 460 }}>
              Manav, pazarcı, seyyar satıcı, üretici — mahallende ilk kaydolan
              esnaf ol, açılışta bölgenin siparişleri önce sana düşsün. Ön kayıt
              ücretsizdir, bağlayıcı değildir.
            </p>
            <Waitlist
              defaultRol="satici"
              etiket="Esnaf ön kaydı"
              baslik="Aramıza katıl"
              aciklama="Uygulama bölgende açıldığında ilk davet sana gelsin."
              buton="Esnaf ön kaydı bırak"
            />
          </Reveal>
        </div>
      </section>

      {/* ================= SSS ================= */}
      <section className="section cv" id="sss">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <p className="eyebrow">Sık sorulan sorular</p>
              <h2>Merak edilenler</h2>
            </div>
            <Accordion items={SSS} />
          </Reveal>
        </div>
      </section>

      {/* ================= UYGULAMA YOLDA + ÖN KAYIT ================= */}
      <section className="section cv" id="onkayit" style={{ background: "var(--bg-soft)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <img src="/illus/kasalar.svg" alt="Kasalarda taze sebze illüstrasyonu" style={{ width: 260, maxWidth: "70%" }} loading="lazy" />
            </div>
            <p className="eyebrow">Erken erişim</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>Uygulama yolda</h2>
            <p className="muted" style={{ maxWidth: 480, margin: "14px auto 24px" }}>
              iOS ve Android uygulamaları geliştirme aşamasında. E-postanı bırak,
              yayına girdiği gün ilk haberi sen al.
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
          </Reveal>
        </div>
      </section>
    </main>
  );
}
