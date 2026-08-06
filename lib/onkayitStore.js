// Ön kayıt deposu — yayında kalıcı, lokalde bağımsız:
// Vercel KV veya Upstash Redis ortam değişkenleri tanımlıysa kayıtlar Redis'te
// tutulur (deploy'larda kaybolmaz). Değilse mevcut dosya moduna (lib/db.js)
// düşülür; lokal geliştirme aynen çalışır. Diğer API'ler bu depoyu kullanmaz.
import { addOnkayit as dosyaEkle, getOnkayitSayisi as dosyaSayisi } from "./db";

const REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redisAktif = Boolean(REST_URL && REST_TOKEN);

const EPOSTA_SETI = "onkayit:epostalar";
const KAYIT_LISTESI = "onkayit:kayitlar";

async function redis(...komut) {
  const r = await fetch(REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(komut),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Redis istegi basarisiz: HTTP ${r.status}`);
  const d = await r.json();
  if (d.error) throw new Error(`Redis hatasi: ${d.error}`);
  return d.result;
}

// Yeni konumlandırma rolleri + geriye uyumluluk (eski istemciler satici/alici gönderir)
const GECERLI_ROLLER = new Set(["uretici", "toptan", "nakliyeci", "tuketici", "satici", "alici"]);

export async function onkayitEkle(girdi) {
  const email = String(girdi?.email || "").trim().toLowerCase();
  const rol = GECERLI_ROLLER.has(girdi?.rol) ? girdi.rol : "tuketici";
  const bolge = String(girdi?.bolge || "").trim();

  if (!email.includes("@")) {
    return { ok: false, reason: "Lütfen geçerli bir e-posta adresi girin." };
  }

  if (!redisAktif) {
    // Dosya modu (lokal): lib/db.js yalnızca satici/alici tanır; en yakın role indirgenir.
    // Üretimde (Redis) rol tam haliyle saklanır.
    const dosyaRol = rol === "uretici" || rol === "satici" || rol === "nakliyeci" ? "satici" : "alici";
    return dosyaEkle({ email, rol: dosyaRol, bolge });
  }

  // SADD atomiktir: 0 dönerse e-posta zaten kayıtlı demektir.
  const yeni = await redis("SADD", EPOSTA_SETI, email);
  if (Number(yeni) === 0) {
    return { ok: false, reason: "Bu e-posta adresi için zaten bir ön kayıt bulunmaktadır." };
  }
  await redis(
    "RPUSH",
    KAYIT_LISTESI,
    JSON.stringify({ email, rol, bolge, ts: Date.now() })
  );
  const toplam = Number(await redis("SCARD", EPOSTA_SETI));
  return { ok: true, toplam };
}

export async function onkayitSayisi() {
  if (!redisAktif) return dosyaSayisi();
  return Number(await redis("SCARD", EPOSTA_SETI));
}

// Yönetim paneli için tam liste (yalnız /api/yonetim — anahtar korumalı — çağırır).
export async function onkayitListesi() {
  if (!redisAktif) {
    const { read } = await import("./db");
    return (read().onkayit || []).map((k) => ({ email: k.email, rol: k.rol, bolge: k.bolge || "", ts: k.ts || null }));
  }
  const ham = (await redis("LRANGE", KAYIT_LISTESI, 0, -1)) || [];
  return ham.map((s) => {
    try { return JSON.parse(s); } catch { return null; }
  }).filter(Boolean);
}
