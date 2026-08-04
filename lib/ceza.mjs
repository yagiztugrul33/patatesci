// Ceza-adalet ve nakliye hesapları — saf fonksiyonlar (bkz. kural kitabı B3, B4).
// Bu modül bilinçli olarak bağımlılıksızdır: node ile doğrudan test edilir.

/* ================= NAKLİYE (B4) ================= */

export function tonajKatsayisi(ton) {
  if (ton <= 3) return { katsayi: 1.0, arac: "Kamyonet" };
  if (ton <= 10) return { katsayi: 1.6, arac: "Kamyon" };
  return { katsayi: 2.4, arac: "Tır" };
}

// nakliye = sabit_yükleme_bedeli + (km × ₺/km × tonaj_katsayısı)
export function nakliyeHesapla({ km, ton, tlKm = 11.7, sabit = 750, gelAl = false }) {
  if (gelAl) return { tutar: 0, arac: "Gel-al", katsayi: 0, km, tlKm, sabit: 0 };
  const { katsayi, arac } = tonajKatsayisi(Number(ton));
  const tutar = Math.round(sabit + Number(km) * tlKm * katsayi);
  return { tutar, arac, katsayi, km: Number(km), tlKm, sabit };
}

/* ================= CEZALAR (B3, TP) ================= */

// Ürün bazlı yol firesi toleransı (TP-2)
export const YOL_FIRESI = {
  patates: 0.005, sogan: 0.005, havuc: 0.005, // dayanıklı
  domates: 0.015, biber: 0.015, salatalik: 0.015,
  yesillik: 0.03,
};

export function yolFiresiToleransi(urun) {
  return YOL_FIRESI[urun] ?? 0.01;
}

// Eksik tartı: ürün bazlı yol firesi toleransı; aşan eksiğin bedeli 2 katıyla iade.
export function eksikTartiCezasi({ beyanTon, gelenTon, fiyat, urun }) {
  const beyanKg = beyanTon * 1000;
  const gelenKg = gelenTon * 1000;
  const toleransOran = yolFiresiToleransi(urun);
  const toleransKg = beyanKg * toleransOran;
  // Islanma vb. ile YÜKSEK çıkan tartı alıcı aleyhine değildir: net = min(beyan, varış)
  const eksikKg = Math.max(0, beyanKg - gelenKg);
  if (eksikKg <= toleransKg) {
    return { ihlal: false, eksikKg, toleransKg, toleransOran, iade: 0, skor: 0 };
  }
  const iade = Math.round(eksikKg * fiyat * 2);
  return { ihlal: true, eksikKg, toleransKg, toleransOran, iade, skor: -15 };
}

// Kısmi iade formülü: iade = tutar × bozuk oran (örn. %20 çürük → bedelin %20'si)
export function kismiIade({ tutar, bozukOran }) {
  const oran = Math.max(0, Math.min(1, bozukOran));
  return { iade: Math.round(tutar * oran), oran, skor: -10 };
}

// Örneklem protokolü (TP-3): 5 çuval brüt ölçümünden toplam net tahmini
export function orneklemNet({ olcumlerKg, toplamAmbalaj, daraKg }) {
  const ortBrut = olcumlerKg.reduce((s, x) => s + x, 0) / olcumlerKg.length;
  const ortNet = ortBrut - daraKg;
  const netKg = Math.round(ortNet * toplamAmbalaj);
  return { ortBrut: +ortBrut.toFixed(2), ortNet: +ortNet.toFixed(2), netKg };
}

// İptal kademeleri (taraf + aşamaya göre; oranlar kural kitabından)
export function iptalCezasi({ taraf, asama, tutar, nakliye = 0, mucbir = false }) {
  if (mucbir) return { oran: 0, ceza: 0, nakliyeCezasi: 0, toplam: 0, skor: 0, aciklama: "Mücbir sebep (belgeli) — cezasız" };
  let oran, nakliyeCezasi = 0, skor;
  if (taraf === "satici") {
    if (asama === "yukleme_oncesi") { oran = 0.02; skor = -5; }
    else { oran = 0.05; nakliyeCezasi = nakliye; skor = -10; }
  } else {
    if (asama === "yukleme_oncesi") { oran = 0.01; skor = -3; }
    else { oran = 0.05; nakliyeCezasi = nakliye; skor = -10; }
  }
  const ceza = Math.round(tutar * oran);
  return { oran, ceza, nakliyeCezasi, toplam: ceza + nakliyeCezasi, skor };
}

// Varışta haksız red (hakem alıcıyı haksız bulursa): çift yön nakliye + %5.
// Mal bedeli yine de satıcıya ödenir; mal ikinci el ilana düşer.
export function haksizRedCezasi({ tutar, nakliye = 0 }) {
  const ceza = Math.round(tutar * 0.05);
  return { ceza, nakliyeCezasi: 2 * nakliye, toplam: ceza + 2 * nakliye, skor: -15, bedelSaticiya: true };
}

// Kalite ihlali (beyan > teslim): alıcı seçer — sınıf farkı indirimi veya ücretsiz iade.
export function kaliteIhlali({ tutar, beyanKatsayi, gercekKatsayi }) {
  const oran = Math.max(0, (beyanKatsayi - gercekKatsayi) / beyanKatsayi);
  const indirim = Math.round(tutar * oran);
  return { indirim, oran, skor: -10 };
}

/* ================= ÖDEME KALEMLERİ (B5) ================= */

export function komisyonHesapla({ tutar }) {
  return {
    komisyon: Math.round(tutar * 0.03), // satıcıdan %3
    hizmetBedeli: 250, // alıcıdan, işlem başına belge/uyum bedeli
  };
}

/* ================= SKOR (B3) ================= */

export function skorUygula(mevcut, degisim) {
  const yeni = Math.max(0, Math.min(100, (mevcut ?? 100) + degisim));
  return { yeni, askida: yeni < 60, ihrac: yeni < 40 };
}
