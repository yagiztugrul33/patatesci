import Link from "next/link";
import Accordion from "../components/Accordion";
import Waitlist from "../components/Waitlist";
import { IconKalkan, IconTarti, IconKamera, IconBelge } from "../components/icons";

export const metadata = {
  title: "patatesçi — Tarımsal Ürün Ticaret Platformu",
  description:
    "Üretici ile alıcıyı doğrudan buluşturan B2B tarımsal ürün ticaret platformu. Şeffaf piyasa fiyatı, güvenceli ödeme ve canlı görüntülü doğrulama.",
};

const SSS = [
  { q: "Sipariş süreci nasıl işler?", a: "Talebinizi oluşturursunuz; konumunuza en uygun satıcı ile otomatik eşleştirilirsiniz. Ürünü teslimattan önce canlı görüntülü bağlantı üzerinden doğrularsınız." },
  { q: "Ödeme güvenliği nasıl sağlanır?", a: "Ödemeniz peşin tahsil edilir ancak teslimat onaylanana kadar güvence hesabında tutulur. Uyuşmazlık durumunda bedel iade edilir." },
  { q: "Teklif verebilir miyim?", a: "Evet. Hem alıcı hem satıcı tarafı teklif verebilir. Piyasa bandı dışındaki teklifler sistem tarafından otomatik olarak reddedilir; yalnızca makul aralıktaki teklifler yayınlanır." },
  { q: "Üretici kendi ürününü satabilir mi?", a: "Evet. Üretici kendi ürününü doğrudan listeler; künye, Hal Kayıt Sistemi bildirimi, rüsum ve belge süreçleri platform tarafından otomatik yönetilir. Üretici kanalında rüsum muafiyeti uygulanır." },
  { q: "Fiyat avantajı nereden kaynaklanır?", a: "Aracı katmanların kaldırılmasıyla üretici daha yüksek gelir elde eder, alıcı daha uygun fiyata erişir. Platform, işlem başına şeffaf bir hizmet bedeli uygular." },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Tarımsal ürün ticaret platformu</p>
          <h1>Üreticiden alıcıya, doğrudan ticaret.</h1>
          <p className="lead">
            Tarımsal ürünler üreticiden alıcıya aracısız ulaşır. Şeffaf piyasa
            fiyatı, güvenceli ödeme ve canlı görüntülü doğrulama ile kurumsal
            standartta ticaret.
          </p>
          <div className="hero-actions">
            <Link href="/pazar" className="btn btn-primary">Sipariş oluşturun</Link>
            <Link href="/sat" className="btn btn-outline">Satıcı Paneli</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-soft)", paddingTop: 56, paddingBottom: 56 }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Güvence altyapısı</p>
            <h2>İşleminizin her adımı güvence altında</h2>
          </div>
          <div className="grid grid-4">
            <div className="card">
              <div className="icon"><IconKalkan /></div>
              <h3>Alıcı Güvencesi</h3>
              <p>Ödeme, teslimat onaylanana kadar güvence hesabında tutulur; uyuşmazlıkta iade edilir.</p>
            </div>
            <div className="card">
              <div className="icon"><IconTarti /></div>
              <h3>Tartı Garantisi</h3>
              <p>Teslim edilen miktar kayıt altına alınır; eksik tartı tespitinde bedel farkı tazmin edilir.</p>
            </div>
            <div className="card">
              <div className="icon"><IconKamera /></div>
              <h3>Canlı Görüntülü Doğrulama</h3>
              <p>Ürün kalitesini teslimattan önce canlı görüntülü bağlantı üzerinden doğrularsınız.</p>
            </div>
            <div className="card">
              <div className="icon"><IconBelge /></div>
              <h3>Yasal Uyum</h3>
              <p>HKS bildirimi, künye takibi, rüsum ve belgelendirme süreçleri otomatik yürütülür.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Alıcı segmentleri</p>
            <h2>Her ölçekte alım için tek platform</h2>
          </div>
          <div className="grid grid-2">
            <div className="card"><h3>Bireysel ve toplu alım</h3><p>Bireyler ve toplu alım grupları — aracı maliyeti olmadan uygun fiyatlı tedarik.</p></div>
            <div className="card"><h3>Toptan işletme</h3><p>Restoran, market ve kurumsal mutfaklar için hacimli, düzenli ve güvenceli tedarik.</p></div>
            <div className="card"><h3>İhracatçı</h3><p>Standartlara uygun, sertifikalı ürünlerin tek noktadan tedariki; ihracatta rüsum muafiyeti.</p></div>
            <div className="card"><h3>Yurt dışı talepler</h3><p>Yurt dışı alım talepleri talep havuzuna iletilir; uygun üretici ile eşleştirilir.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-soft)" }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Sık sorulan sorular</p>
            <h2>Platform nasıl çalışır?</h2>
          </div>
          <Accordion items={SSS} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Waitlist />
        </div>
      </section>
    </main>
  );
}
