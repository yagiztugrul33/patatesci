// Ankara BB Toptancı Hal günlük fiyat listesi — canlı çekme + 6 saat önbellek + yedek.
// Kaynak yapısı (araştırma notu): ankara.bel.tr/hal-fiyatlari POST formu
// (date=GG.AA.YYYY, type=vegetable) → HTML tablo, satır başına 6 hücre:
// Ürün / Tür / Birim / Asgari / Azami / Tarih.
import { read, write } from "./db";
import fallback from "./hal-fallback.json";

const KAYNAK_URL = "https://www.ankara.bel.tr/hal-fiyatlari";
const CACHE_SURESI_MS = 6 * 60 * 60 * 1000; // 6 saat

// Bizim ürün kimliklerimiz ↔ hal listesindeki ürün adları (tercih sırasıyla)
const ESLEME = {
  patates: ["Patates (Kumpir)", "Patates II (Taze)"],
  sogan: ["Soğan Kuru (Taze)", "Soğan Kuru II"],
  domates: ["Domates (Pembe)", "Domates (Beef)"],
  biber: ["Biber Çarliston", "Biber Sivri"],
  salatalik: ["Salatalık", "Salatalık (Silor)"],
  havuc: ["Havuç Beypazarı"],
};

function sayi(tr) {
  return parseFloat(String(tr).replace(/\./g, "").replace(",", "."));
}

function tabloAyikla(html) {
  const hucreler = [...html.matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((m) => m[1].trim());
  const satirlar = [];
  for (let i = 0; i + 5 < hucreler.length; i += 6) {
    satirlar.push({
      ad: hucreler[i],
      birim: hucreler[i + 2],
      asgari: sayi(hucreler[i + 3]),
      azami: sayi(hucreler[i + 4]),
      tarih: hucreler[i + 5],
    });
  }
  return satirlar.filter((s) => !isNaN(s.asgari) && !isNaN(s.azami));
}

function esle(satirlar) {
  const fiyatlar = [];
  let tarih = null;
  for (const [id, adaylar] of Object.entries(ESLEME)) {
    for (const aday of adaylar) {
      const s = satirlar.find((x) => x.ad === aday);
      if (s) {
        fiyatlar.push({ id, halAdi: s.ad, asgari: s.asgari, azami: s.azami, orta: +((s.asgari + s.azami) / 2).toFixed(2) });
        tarih = s.tarih || tarih;
        break;
      }
    }
  }
  return { fiyatlar, tarih };
}

async function canliCek() {
  const bugun = new Date();
  const gg = String(bugun.getDate()).padStart(2, "0");
  const aa = String(bugun.getMonth() + 1).padStart(2, "0");
  const govde = new URLSearchParams({ date: `${gg}.${aa}.${bugun.getFullYear()}`, type: "vegetable" });
  const r = await fetch(KAYNAK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) patatesci-hal-referans",
    },
    body: govde.toString(),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error(`Hal kaynağı HTTP ${r.status}`);
  const { fiyatlar, tarih } = esle(tabloAyikla(await r.text()));
  if (fiyatlar.length < 4) throw new Error("Hal tablosu ayrıştırılamadı");
  return { fiyatlar, tarih };
}

function fallbackVeri() {
  return {
    kaynak: "Ankara BB Hal Müdürlüğü",
    tarih: fallback.tarih,
    canli: false,
    not: "Kaynağa erişilemedi — elle güncellenen yedek liste gösteriliyor.",
    guncelleme: null,
    fiyatlar: fallback.fiyatlar.map((f) => ({ ...f, orta: +((f.asgari + f.azami) / 2).toFixed(2) })),
  };
}

// zorlaFallback: test amaçlı; canlı çekmeyi atlar.
export async function halFiyatlariGetir({ zorlaFallback = false } = {}) {
  const db = read();
  const simdi = Date.now();
  if (!zorlaFallback && db.halCache && simdi - db.halCache.ts < CACHE_SURESI_MS) {
    return { ...db.halCache.veri, onbellekten: true };
  }
  if (!zorlaFallback) {
    try {
      const { fiyatlar, tarih } = await canliCek();
      const veri = {
        kaynak: "Ankara BB Hal Müdürlüğü",
        tarih,
        canli: true,
        guncelleme: new Date(simdi).toISOString(),
        fiyatlar,
      };
      const guncel = read();
      guncel.halCache = { ts: simdi, veri };
      write(guncel);
      return veri;
    } catch {
      // canlı erişilemedi → son başarılı veri varsa onu damgayla döndür
      if (db.halCache?.veri) {
        return { ...db.halCache.veri, canli: false, not: "Kaynağa şu an erişilemiyor — son başarılı veri gösteriliyor." };
      }
    }
  }
  return fallbackVeri();
}

// Piyasa bandı merkezi: hal referansı (önbellekteki) → yoksa null
export function halOrtaBul(urunId) {
  const db = read();
  const f = db.halCache?.veri?.fiyatlar?.find((x) => x.id === urunId);
  return f ? f.orta : null;
}
