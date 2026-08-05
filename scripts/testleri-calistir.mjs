// Tüm test bataryasını koşar ve GERÇEK çıktılardan tests/sonuclar.json üretir.
// /api/denetim bu dosyayı okur — sahte sabit değer yasağının uygulamasıdır.
import { execSync } from "child_process";
import { writeFileSync } from "fs";

function kos(dosya) {
  const cikti = execSync(`node ${dosya}`, { encoding: "utf8" });
  const m = cikti.match(/SONUC: (\d+) gecti, (\d+) kaldi/);
  const k = cikti.match(/Toplam senaryo: (\d+)/);
  return {
    gecti: m ? +m[1] : null,
    kaldi: m ? +m[2] : cikti.includes("TAM") ? 0 : null,
    senaryo: k ? +k[1] : undefined,
    sonSatir: cikti.trim().split("\n").pop(),
  };
}

const ceza = kos("tests/ceza.test.mjs");
const finans = kos("tests/finans.test.mjs");
let kapsama;
try {
  const c = execSync("node tests/kapsama.test.mjs", { encoding: "utf8" });
  kapsama = { senaryo: +(c.match(/Toplam senaryo: (\d+)/)?.[1] || 0), bosSatir: c.includes("TAM") ? 0 : null, sonSatir: c.trim().split("\n").pop() };
} catch (e) {
  kapsama = { hata: true, sonSatir: String(e.stdout || e).trim().split("\n").pop() };
}

const ozet = {
  zaman: new Date().toISOString(),
  birim: { ceza: `${ceza.gecti}/${ceza.gecti + (ceza.kaldi || 0)}`, finans: `${finans.gecti}/${finans.gecti + (finans.kaldi || 0)}` },
  kapsama,
  e2e: "curl bataryası — son koşum kanıtları docs/DENETIM-KAYDI.md",
};
writeFileSync("tests/sonuclar.json", JSON.stringify(ozet, null, 2));
console.log(JSON.stringify(ozet));
if ((ceza.kaldi || 0) + (finans.kaldi || 0) > 0 || kapsama.bosSatir !== 0) process.exit(1);
