import { notFound } from "next/navigation";
import { REHBERLER, rehberBul } from "../../../lib/rehber.mjs";
import { halFiyatlariGetir } from "../../../lib/halFiyat";
import { fmtSayi } from "../../../lib/format";

// Programatik SEO rehberleri: içerik lib/rehber.mjs'ten gelir; yeni kayıt
// eklemek yeni sayfa açar (sitemap dahil). 6 saatlik ISR ana sayfayla uyumlu.
export const revalidate = 21600;

export function generateStaticParams() {
  return REHBERLER.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = rehberBul(slug);
  if (!r) return {};
  return { title: r.baslik, description: r.ozet };
}

export default async function RehberSayfasi({ params }) {
  const { slug } = await params;
  const r = rehberBul(slug);
  if (!r) notFound();

  // Canlı fiyat kutusu: rehber bir ürüne bağlıysa güncel hal bandını göster
  let canli = null;
  if (r.canliUrun) {
    try {
      const hal = await halFiyatlariGetir();
      const f = hal?.fiyatlar?.find((x) => x.id === r.canliUrun);
      if (f) canli = { ...f, tarih: hal.tarih };
    } catch {
      canli = null;
    }
  }

  const digerleri = REHBERLER.filter((x) => x.slug !== r.slug);

  return (
    <main className="section">
      <div className="container legal" style={{ maxWidth: 760 }}>
        <p className="eyebrow">Rehber</p>
        <h1 style={{ fontSize: "1.9rem", lineHeight: 1.2 }}>{r.baslik}</h1>
        <p className="muted" style={{ marginTop: 12 }}>{r.ozet}</p>

        {canli && (
          <div className="card" style={{ margin: "22px 0" }}>
            <b>Bugünkü referans — {canli.halAdi}</b>
            <p className="num" style={{ fontSize: "1.3rem", margin: "6px 0" }}>
              {fmtSayi(canli.asgari)} – {fmtSayi(canli.azami)} ₺/kg{" "}
              <span className="muted" style={{ fontSize: ".85rem" }}>(orta: {fmtSayi(canli.orta)} ₺)</span>
            </p>
            <p className="muted" style={{ fontSize: ".8rem" }}>
              Kaynak: Ankara BB Hal Müdürlüğü · {canli.tarih} · tam liste: <a href="/katalog">canlı katalog</a>
            </p>
          </div>
        )}

        {r.bolumler.map((b, i) => (
          <section key={i}>
            <h2>{b.b}</h2>
            <p>{b.m}</p>
          </section>
        ))}

        <div className="card" style={{ marginTop: 30 }}>
          <b>Uygulamada gör</b>
          <p className="muted" style={{ margin: "8px 0 14px" }}>
            Bu rehberdeki kurallar sitede çalışır durumda: canlı katalog, band
            denetimi ve güvenceli sipariş akışı demoda açık.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="/katalog" className="btn btn-primary">Canlı kataloğu aç</a>
            <a href="/hukuki/ticaret-kurallari" className="btn btn-outline">Kural kitabı</a>
          </div>
        </div>

        <section style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: "1.1rem" }}>Diğer rehberler</h2>
          <ul>
            {digerleri.map((d) => (
              <li key={d.slug}>
                <a href={`/rehber/${d.slug}`}>{d.baslik}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
