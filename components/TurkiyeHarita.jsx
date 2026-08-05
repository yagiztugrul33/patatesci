// Gerçek geometrili 81 il Türkiye haritası.
// Kaynak: dnomak/svg-turkiye-haritasi (GitHub, MIT Lisansı) — public/tr-81-il.svg
// içine palet stili ve il nabız animasyonu işlendi. Bildirim kartları dönüşümlü.
import { IconOnay } from "./icons";

const BILDIRIMLER = [
  { il: "Konya", stil: { left: "36%", top: "52%" }, gecikme: 0 },
  { il: "İzmir", stil: { left: "6%", top: "50%" }, gecikme: 4.6 },
  { il: "Trabzon", stil: { left: "62%", top: "12%" }, gecikme: 9.2 },
  { il: "Adana", stil: { left: "52%", top: "68%" }, gecikme: 13.8 },
];

export default function TurkiyeHarita() {
  return (
    <div className="harita-wrap">
      <img
        src="/tr-81-il.svg"
        alt="Türkiye haritası — 81 ilin gerçek sınır geometrisi"
        style={{ width: "100%", height: "auto", display: "block" }}
        loading="lazy"
      />
      {BILDIRIMLER.map((b) => (
        <div key={b.il} className="harita-bildirim" style={{ ...b.stil, animationDelay: b.gecikme + "s" }} aria-hidden="true">
          <span className="hb-ic"><IconOnay size={13} /></span>
          Yeni üretici katıldı · {b.il}
        </div>
      ))}
      <div className="harita-rozet">
        <b className="num">81 il</b>
        <span>gerçek sınır geometrisi</span>
      </div>
      <p className="muted" style={{ fontSize: ".7rem", textAlign: "right", marginTop: 6 }}>
        Harita verisi: dnomak/svg-turkiye-haritasi (MIT Lisansı)
      </p>
    </div>
  );
}
