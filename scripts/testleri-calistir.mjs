// Tüm test bataryasını koşar ve GERÇEK çıktılardan tests/sonuclar.json üretir.
// /api/denetim bu dosyayı okur — sahte sabit değer yasağının uygulamasıdır.
import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";

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

// E2E yalnız sunucu ayaktayken koşar; kapalıysa son bilinen sonuç korunur.
// ANCAK korunan sonuç TAZE DEĞİLDİR ve öyle raporlanamaz: aksi halde bu dosya
// yeni bir zaman damgasıyla eski bir "25/25"i taze gibi gösterir ve /api/denetim
// üzerinden dış denetçiyi yanıltır. Bu yüzden tazelik ayrı bir alanla işaretlenir.
let e2e = "koşulmadı (sunucu kapalı)";
let e2eTaze = false;
try {
  const c = execSync("node tests/e2e.mjs", { encoding: "utf8", timeout: 60000 });
  const m = c.match(/E2E SONUC: (\d+) gecti, (\d+) kaldi/);
  if (m) { e2e = `${m[1]}/${+m[1] + +m[2]}`; e2eTaze = true; }
} catch (e) {
  const m = String(e.stdout || "").match(/E2E SONUC: (\d+) gecti, (\d+) kaldi/);
  if (m) {
    // E2E koştu ama bazı senaryolar kaldı — bu taze bir sonuçtur.
    e2e = `${m[1]}/${+m[1] + +m[2]} (hatalı)`;
    e2eTaze = true;
  } else {
    // E2E hiç koşamadı (sunucu kapalı / çöktü). Son bilinen değeri taşı ama
    // BAYAT olduğunu etikete yaz — sessizce taze gibi görünmesin.
    try {
      const onceki = JSON.parse(readFileSync("tests/sonuclar.json", "utf8")).e2e;
      const sade = String(onceki).replace(/ \(bayat.*\)$/, "");
      e2e = `${sade} (bayat — bu koşuda E2E çalışmadı)`;
    } catch {}
  }
}

const ozet = {
  zaman: new Date().toISOString(),
  birim: { ceza: `${ceza.gecti}/${ceza.gecti + (ceza.kaldi || 0)}`, finans: `${finans.gecti}/${finans.gecti + (finans.kaldi || 0)}` },
  kapsama,
  e2e,
  // Dış denetçi için: e2e alanı bu koşuda mı üretildi, yoksa taşınan eski değer mi?
  e2eTaze,
};
writeFileSync("tests/sonuclar.json", JSON.stringify(ozet, null, 2));
console.log(JSON.stringify(ozet));
// Çıkış kodu: birim testler, kapsama tablosu VE koşabilmişse E2E.
// E2E koşup senaryo kaldıysa bu bir başarısızlıktır — daha önce exit 0 dönüyordu.
// E2E hiç koşamadıysa (bayat) çıkış kodu bozulmaz: sunucusuz ortamda birim
// testleri koşabilmek bilinçli bir tercih, ama sonuç "bayat" diye işaretlenir.
const e2eKaldi = /\(hatalı\)/.test(e2e);
if ((ceza.kaldi || 0) + (finans.kaldi || 0) > 0 || kapsama.bosSatir !== 0 || e2eKaldi) process.exit(1);
