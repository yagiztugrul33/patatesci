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

/* ================= CEZALAR (B3) ================= */

// Eksik tartı: ±%1 tolerans; aşan eksiğin bedeli 2 katıyla alıcıya iade edilir.
export function eksikTartiCezasi({ beyanTon, gelenTon, fiyat }) {
  const beyanKg = beyanTon * 1000;
  const gelenKg = gelenTon * 1000;
  const eksikKg = Math.max(0, beyanKg - gelenKg);
  const toleransKg = beyanKg * 0.01;
  if (eksikKg <= toleransKg) {
    return { ihlal: false, eksikKg, toleransKg, iade: 0, skor: 0 };
  }
  const iade = Math.round(eksikKg * fiyat * 2);
  return { ihlal: true, eksikKg, toleransKg, iade, skor: -15 };
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
