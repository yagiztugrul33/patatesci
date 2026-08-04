// Senaryo kapsama testi — node tests/kapsama.test.mjs
// docs/senaryolar.md'deki her senaryo satırında kural referansı, yaptırım ve
// ekran alanı DOLU olmalıdır. Boş hücre = bitmemiş iş → test düşer.
import { readFileSync } from "fs";

const md = readFileSync(new URL("../docs/senaryolar.md", import.meta.url), "utf8");
const satirlar = md.split("\n").filter((s) => /^\|\s*S\d+\s*\|/.test(s));

let hatali = 0;
const kategoriler = {};
for (const s of satirlar) {
  const hucre = s.split("|").map((x) => x.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
  // [No, Senaryo, Karar, Kural, Yaptırım, Ekran]
  const [no, senaryo, karar, kural, yaptirim, ekran] = hucre;
  const eksikler = [];
  if (!senaryo) eksikler.push("senaryo");
  if (!karar) eksikler.push("karar");
  if (!kural) eksikler.push("kural referansı");
  if (!yaptirim) eksikler.push("yaptırım");
  if (!ekran) eksikler.push("ekran");
  if (eksikler.length) {
    console.log(`KALDI  ${no}: eksik alanlar → ${eksikler.join(", ")}`);
    hatali++;
  }
  const ref = (kural || "").split(",")[0].trim().replace(/-.*$/, "");
  kategoriler[ref] = (kategoriler[ref] || 0) + 1;
}

console.log(`\nToplam senaryo: ${satirlar.length} (hedef ≥ 60)`);
console.log("Kural referansı dağılımı:", JSON.stringify(kategoriler));
if (satirlar.length < 60) { console.log("KALDI: senaryo sayısı 60'ın altında"); hatali++; }

// Zorunlu kapsam anahtar kelimeleri kataloğun bir yerinde geçmeli
const zorunlu = ["katman", "kısmi", "çifte satış", "mücbir", "chargeback", "şantaj", "KVKK", "gizli ayıp", "karar kantarı", "örneklem", "yol firesi", "fikrini değiştirdi", "imzalamadan araç", "6 saat", "kantara uğramayı"];
for (const z of zorunlu) {
  if (!md.toLowerCase().includes(z.toLowerCase())) { console.log(`KALDI: zorunlu kapsam eksik → "${z}"`); hatali++; }
}

console.log(hatali ? `\nSONUC: ${hatali} eksik — KAPSAMA TAMAMLANMADI` : "\nSONUC: kapsama tablosunda boş satır yok — TAM");
process.exit(hatali ? 1 : 0);
