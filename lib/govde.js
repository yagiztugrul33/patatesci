// İstek gövdesi okuma yardımcısı (Ö4/ORTA bulgusu):
// Bozuk JSON istemci hatasıdır → 400 döner, 5xx DEĞİL.
// Ayrıca prototip kirletme anahtarları gövdeden temizlenir.
const TEHLIKELI = ["__proto__", "constructor", "prototype"];

function temizle(o) {
  if (!o || typeof o !== "object") return o;
  if (Array.isArray(o)) return o.map(temizle);
  const c = {};
  for (const [k, v] of Object.entries(o)) {
    if (TEHLIKELI.includes(k)) continue;
    c[k] = temizle(v);
  }
  return c;
}

export async function govdeOku(req) {
  try {
    const ham = await req.json();
    if (ham === null || typeof ham !== "object" || Array.isArray(ham)) {
      return { ok: false, hata: "Geçersiz istek gövdesi: JSON nesnesi bekleniyor." };
    }
    return { ok: true, body: temizle(ham) };
  } catch {
    return { ok: false, hata: "Geçersiz JSON gövdesi." };
  }
}
