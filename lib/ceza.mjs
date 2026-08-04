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

/* ================= TESLİMAT HİZMET SEVİYELERİ (TS) ================= */
// Tarife TEMSİLİDİR (₺/ton) — resmi hammaliye tarifesi bulunamadı,
// DOĞRULANAMADI listesindedir. S4 kat ücreti kat başına eklenir.
export const TESLIMAT_TARIFE = {
  S0: { ad: "Gel-al", tonBasi: 0 },
  S1: { ad: "Adres teslim (araç üstü)", tonBasi: 0 }, // varsayılan; boşaltma alıcıda
  S2: { ad: "+Boşaltma (kamyondan indirme)", tonBasi: 400 },
  S3: { ad: "+Depoya/içeri taşıma (zemin kat)", tonBasi: 1000 }, // 400 indirme + 600 hammaliye
  S4: { ad: "Kata taşıma (S3 + kat ücreti)", tonBasi: null }, // S3 kapsanır, kat ücreti eklenir
  S4katAsansorlu: 150, // ₺/ton, kat başına
  S4katAsansorsuz: 300,
  temsili: true,
};

export function teslimatBedeli({ seviye = "S1", ton, kat = 0, asansor = true }) {
  const t = TESLIMAT_TARIFE[seviye] ? TESLIMAT_TARIFE[seviye].tonBasi : 0;
  let bedel = t * ton;
  let katBedeli = 0;
  if (seviye === "S4") {
    bedel = TESLIMAT_TARIFE.S3.tonBasi * ton; // S4, S3'ü kapsar
    katBedeli = (asansor ? TESLIMAT_TARIFE.S4katAsansorlu : TESLIMAT_TARIFE.S4katAsansorsuz) * ton * Math.max(0, kat);
  }
  return { seviye, bedel: Math.round(bedel + katBedeli), katBedeli: Math.round(katBedeli), temsili: true };
}

// Yanlış kat/asansör beyanı: fark + %25 ceza alıcıdan (hamal kapıda sürprizle karşılaşmasın)
export function yanlisBeyanCezasi({ beyanBedel, gercekBedel }) {
  const fark = Math.max(0, gercekBedel - beyanBedel);
  const ceza = Math.round(fark * 0.25);
  return { fark, ceza, toplam: fark + ceza, skor: -5 };
}

// Taahhüt ihlali: seçilen seviye verilmedi → hizmet kaleminin iadesi + aynı tutar ceza (2 kat etkisi)
export function taahhutIhlali({ hizmetBedeli }) {
  return { iade: hizmetBedeli, ceza: hizmetBedeli, toplam: hizmetBedeli * 2, skor: -10 };
}

/* ================= TEKLİF CİDDİYETİ (BLOKE) ================= */

// Teklif tutarının %5'i bloke edilir (ödeme değil — eşleşmezse anında çözülür,
// eşleşirse bedele mahsup). Köklü üye indirimi: skor ≥ 90 VE ≥ 3 tamamlanmış
// işlem → %2 (yeni üye 100 skorla başladığı için tek başına skor yetmez).
export function blokeHesapla({ tutar, skor = 100, tamamlanmisIslem = 0 }) {
  const indirimli = skor >= 90 && tamamlanmisIslem >= 3;
  const oran = indirimli ? 0.02 : 0.05;
  return { oran, bloke: Math.round(tutar * oran), indirimli };
}

// Eşleşme anında ödemeyi tamamlamayan alıcı / stoksuz teklif veren satıcı: %2 + skor
export function yalanTeklifCezasi({ tutar }) {
  return { ceza: Math.round(tutar * 0.02), skor: -10 };
}

/* ================= SİGORTA (GK) ================= */

// Sevkiyat sigortası primi — TEMSİLİ oran (binde 2); gerçek oran broker
// teyidine tabidir (docs/sigorta-ve-teminat.md DOĞRULANAMADI listesi).
export const SIGORTA_ORANI_TEMSILI = 0.002;

export function sigortaPrimi({ tutar, oran = SIGORTA_ORANI_TEMSILI }) {
  return { prim: Math.round(tutar * oran), oran, temsili: true };
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
