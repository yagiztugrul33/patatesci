// Basit IP tabanlı hız sınırı (Ö4/YÜKSEK-3): kaba kuvvet giriş denemesi ve
// ön kayıt spam'ine karşı. Bellek içidir — tek örnekli sunucuda çalışır.
// NOT: Vercel serverless'ta örnekler arasında paylaşılmaz; üretimde Upstash
// tabanlı sayaç gerekir (SABAH_ONAY_KUYRUGU'nda madde olarak duruyor).
const pencereler = new Map();

export function ipAl(req) {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "bilinmeyen"
  );
}

// limit: pencere başına izin verilen istek; pencereMs: pencere süresi
export function hizSiniri(anahtar, limit = 10, pencereMs = 60000) {
  const simdi = Date.now();
  const kayit = pencereler.get(anahtar);
  if (!kayit || simdi - kayit.baslangic > pencereMs) {
    pencereler.set(anahtar, { baslangic: simdi, sayac: 1 });
    return { izin: true, kalan: limit - 1 };
  }
  kayit.sayac++;
  if (kayit.sayac > limit) {
    return { izin: false, kalan: 0, bekleSaniye: Math.ceil((pencereMs - (simdi - kayit.baslangic)) / 1000) };
  }
  return { izin: true, kalan: limit - kayit.sayac };
}
