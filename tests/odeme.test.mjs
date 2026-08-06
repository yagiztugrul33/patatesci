// Soyut ödeme katmanı birim testleri — node tests/odeme.test.mjs
import { odemeSaglayici, tahsilat, guvence, split, iade, PLATFORM_KOMISYON_ORANI_TEMSILI } from "../lib/odeme.mjs";

let basarili = 0, hatali = 0;
function esit(ad, gercek, beklenen) {
  const ok = JSON.stringify(gercek) === JSON.stringify(beklenen);
  console.log(`${ok ? "GECTI" : "KALDI"}  ${ad}${ok ? "" : `  → beklenen ${JSON.stringify(beklenen)}, gelen ${JSON.stringify(gercek)}`}`);
  ok ? basarili++ : hatali++;
}

// --- Sağlayıcı seçimi ---
esit("Varsayılan sağlayıcı demo (sır yok)", odemeSaglayici().ad, "demo");

// --- Tahsilat ---
const t1 = tahsilat({ siparisId: 42, tutar: 195000 });
esit("Tahsilat ok", t1.ok, true);
esit("Tahsilat türü", t1.tur, "tahsilat");
esit("Tahsilat tutarı", t1.tutar, 195000);
esit("Tahsilat demo etiketi", t1.demo, true);
esit("İşlem no ön eki", t1.islemId.startsWith("tahsilat-"), true);
esit("Sıfır tutar reddi", tahsilat({ siparisId: 1, tutar: 0 }).ok, false);
esit("Negatif tutar reddi", tahsilat({ siparisId: 1, tutar: -5 }).ok, false);
esit("Sayı olmayan tutar reddi", tahsilat({ siparisId: 1, tutar: "abc" }).ok, false);

// --- Güvence ---
const g1 = guvence({ siparisId: 7, tutar: 39000 });
esit("Güvence ok + türü", g1.ok && g1.tur, "guvence");

// --- Split ---
const s1 = split({ siparisId: 7, tutar: 195000, komisyonOran: 0.02 });
esit("Split komisyon (195.000 × %2)", s1.komisyon, 3900);
esit("Split üretici payı", s1.saticiPay, 191100);
esit("Split toplam korunur", Math.round((s1.komisyon + s1.saticiPay) * 100) / 100, 195000);
const s2 = split({ siparisId: 7, tutar: 1234.57, komisyonOran: 0.02 });
esit("Küsuratta toplam korunur", Math.round((s2.komisyon + s2.saticiPay) * 100) / 100, 1234.57);
esit("Komisyon oranı 1 reddi", split({ siparisId: 1, tutar: 100, komisyonOran: 1 }).ok, false);
esit("Negatif komisyon reddi", split({ siparisId: 1, tutar: 100, komisyonOran: -0.1 }).ok, false);

// --- İade ---
const i1 = iade({ siparisId: 3, tutar: 500, sebep: "Eksik tartı farkı" });
esit("İade ok + sebep", i1.ok && i1.sebep, "Eksik tartı farkı");

// --- Sabitler / benzersizlik ---
esit("Temsilî komisyon %2 (finansal modelle tutarlı)", PLATFORM_KOMISYON_ORANI_TEMSILI, 0.02);
esit("İşlem numaraları benzersiz", tahsilat({ siparisId: 1, tutar: 10 }).islemId !== tahsilat({ siparisId: 1, tutar: 10 }).islemId, true);

console.log(`\nSONUC: ${basarili} gecti, ${hatali} kaldi`);
process.exit(hatali ? 1 : 0);
