// Finans motoru birim testleri — node tests/finans.test.mjs
import { islemAnatomisi, posEtkisi, basabas, aylikModel, hizmetBedeliKademeli } from "../lib/finans.mjs";

let ok = 0, kalan = 0;
const esit = (ad, g, b) => {
  const t = JSON.stringify(g) === JSON.stringify(b);
  console.log(`${t ? "GECTI" : "KALDI"}  ${ad}${t ? "" : ` → beklenen ${JSON.stringify(b)}, gelen ${JSON.stringify(g)}`}`);
  t ? ok++ : kalan++;
};

// Baz işlem: 5t × 39₺ havale → brüt 6100, kesinti 1950, rezerv 610, net 3540
const b = islemAnatomisi({ ton: 5, fiyat: 39 });
esit("5t@39 havale net", b.net, 3540);
esit("5t@39 net ₺/kg", b.netKg, 0.708);
esit("5t@39 POS net (yasak kanıtı)", islemAnatomisi({ ton: 5, fiyat: 39, yontem: "pos" }).net, 615);
esit("POS erime %83+", posEtkisi({ ton: 5, fiyat: 39 }).erimeYuzde >= 82, true);
esit("1t@39 havale net", islemAnatomisi({ ton: 1, fiyat: 39 }).net, 888);
esit("Başabaş 325k/3540 = 92 işlem/ay", basabas({ ortTon: 5, ortFiyat: 39 }).islemAy, 92);
esit("Başabaş günde ~3.5", basabas({ ortTon: 5, ortFiyat: 39 }).islemGun, 3.5);
esit("Baz ay (6.5/gün) kâr +273.260", aylikModel({ islemGun: 6.5, ortTon: 5, ortFiyat: 39 }).kar, 3540 * 169 - 325000);
esit("Kademeli bedel 5t→400", hizmetBedeliKademeli(5), 400);
esit("Kademeli bedel 12t→600", hizmetBedeliKademeli(12), 600);
esit("Teslimat marjı %10 (2000₺→200)", islemAnatomisi({ ton: 5, fiyat: 39, teslimatHizmetBedeli: 2000 }).gelir.teslimatMarj, 200);

console.log(`\nSONUC: ${ok} gecti, ${kalan} kaldi`);
process.exit(kalan ? 1 : 0);
