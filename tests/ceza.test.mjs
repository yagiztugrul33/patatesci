// Ceza-nakliye birim testleri — node tests/ceza.test.mjs
import { nakliyeHesapla, eksikTartiCezasi, iptalCezasi, haksizRedCezasi, kaliteIhlali, komisyonHesapla, skorUygula, yolFiresiToleransi, kismiIade, orneklemNet } from "../lib/ceza.mjs";

let basarili = 0, hatali = 0;
function esit(ad, gercek, beklenen) {
  const ok = JSON.stringify(gercek) === JSON.stringify(beklenen);
  console.log(`${ok ? "GECTI" : "KALDI"}  ${ad}${ok ? "" : `  → beklenen ${JSON.stringify(beklenen)}, gelen ${JSON.stringify(gercek)}`}`);
  ok ? basarili++ : hatali++;
}

// --- Nakliye (B4): 750 + km × 11.7 × katsayı ---
esit("Polatlı→Çankaya 5t (kamyon 1.6): 750+80×11.7×1.6", nakliyeHesapla({ km: 80, ton: 5 }).tutar, 750 + Math.round(80 * 11.7 * 1.6 * 10) / 10 === 2247.6 ? 2248 : Math.round(750 + 80 * 11.7 * 1.6));
esit("Beypazarı→Keçiören 2t (kamyonet 1.0)", nakliyeHesapla({ km: 95, ton: 2 }).tutar, Math.round(750 + 95 * 11.7 * 1.0));
esit("Nallıhan→Sincan 15t (tır 2.4)", nakliyeHesapla({ km: 132, ton: 15 }).tutar, Math.round(750 + 132 * 11.7 * 2.4));
esit("Gel-al = 0", nakliyeHesapla({ km: 80, ton: 5, gelAl: true }).tutar, 0);
esit("Araç sınıfı 15t = Tır", nakliyeHesapla({ km: 10, ton: 15 }).arac, "Tır");

// --- Yol firesi toleransları (TP-2, ürün bazlı) ---
esit("Yol firesi patates %0,5", yolFiresiToleransi("patates"), 0.005);
esit("Yol firesi domates %1,5", yolFiresiToleransi("domates"), 0.015);
esit("Yol firesi yeşillik %3", yolFiresiToleransi("yesillik"), 0.03);

// --- Eksik tartı (B2/B3): ürün bazlı tolerans; aşan eksiğin 2 katı iade ---
const t1 = eksikTartiCezasi({ beyanTon: 5, gelenTon: 4.9, fiyat: 39, urun: "patates" }); // 100 kg eksik, tolerans 25 kg
esit("Eksik tartı ihlal (patates 5t→4.9t)", t1.ihlal, true);
esit("Eksik tartı iade = 100kg × 39₺ × 2", t1.iade, 7800);
const t2 = eksikTartiCezasi({ beyanTon: 5, gelenTon: 4.98, fiyat: 39, urun: "patates" }); // 20 kg < 25 kg tolerans
esit("Patates tolerans içi (20 kg) ihlal degil", t2.ihlal, false);
const t3 = eksikTartiCezasi({ beyanTon: 5, gelenTon: 4.93, fiyat: 40, urun: "domates" }); // 70 kg < 75 kg tolerans
esit("Domates tolerans içi (70 kg) ihlal degil", t3.ihlal, false);

// --- Kısmi iade formülü (%20 çürük) ---
esit("Kısmi iade %20 × 195.000", kismiIade({ tutar: 195000, bozukOran: 0.2 }).iade, 39000);

// --- Örneklem protokolü (TP-3): 5 çuval, 25kg çuval, dara 0.15 ---
const on = orneklemNet({ olcumlerKg: [25.2, 24.9, 25.1, 25.0, 24.8], toplamAmbalaj: 200, daraKg: 0.15 });
esit("Örneklem net = (ort 25.0 − 0.15) × 200", on.netKg, Math.round((25.0 - 0.15) * 200));

// --- İptal kademeleri (B3) ---
esit("Satıcı yükleme öncesi iptal %2 (70.000)", iptalCezasi({ taraf: "satici", asama: "yukleme_oncesi", tutar: 70000 }).ceza, 1400);
esit("Satıcı yolda iptal %5 + nakliye", iptalCezasi({ taraf: "satici", asama: "yolda", tutar: 70000, nakliye: 2246 }).toplam, 3500 + 2246);
esit("Alıcı yükleme öncesi iptal %1", iptalCezasi({ taraf: "alici", asama: "yukleme_oncesi", tutar: 70000 }).ceza, 700);
esit("Alıcı yolda iptal %5 + gidiş nakliyesi", iptalCezasi({ taraf: "alici", asama: "yolda", tutar: 70000, nakliye: 2246 }).toplam, 5746);
esit("Mücbir sebep cezasız", iptalCezasi({ taraf: "satici", asama: "yolda", tutar: 70000, nakliye: 999, mucbir: true }).toplam, 0);

// --- Haksız red (B3): %5 + çift yön nakliye; bedel satıcıya ---
const hr = haksizRedCezasi({ tutar: 70000, nakliye: 2246 });
esit("Haksız red toplam = 3500 + 2×2246", hr.toplam, 3500 + 4492);
esit("Haksız redde bedel satıcıya", hr.bedelSaticiya, true);

// --- Kalite ihlali: 1. Sınıf (1.0) beyan → 2. Sınıf (0.85) teslim = %15 indirim ---
esit("Kalite ihlali indirimi (70.000)", kaliteIhlali({ tutar: 70000, beyanKatsayi: 1.0, gercekKatsayi: 0.85 }).indirim, 10500);

// --- Komisyon (B5): %3 satıcı + 250₺ alıcı ---
esit("Komisyon %3", komisyonHesapla({ tutar: 70000 }).komisyon, 2100);
esit("Hizmet bedeli 250", komisyonHesapla({ tutar: 70000 }).hizmetBedeli, 250);

// --- Skor eşikleri ---
esit("Skor 100-15=85", skorUygula(100, -15).yeni, 85);
esit("Skor 62-5=57 askıda", skorUygula(62, -5).askida, true);
esit("Skor 42-10=32 ihraç", skorUygula(42, -10).ihrac, true);
esit("Skor tavan 100", skorUygula(95, 10).yeni, 100);

console.log(`\nSONUC: ${basarili} gecti, ${hatali} kaldi`);
process.exit(hatali ? 1 : 0);
