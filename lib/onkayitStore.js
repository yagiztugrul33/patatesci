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

export async function onkayitEkle(girdi) {
  const email = String(girdi?.email || "").trim().toLowerCase();
  const rol = girdi?.rol === "satici" ? "satici" : "alici";
  const bolge = String(girdi?.bolge || "").trim();

  if (!email.includes("@")) {
    return { ok: false, reason: "Lütfen geçerli bir e-posta adresi girin." };
  }

  if (!redisAktif) return dosyaEkle({ email, rol, bolge });

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
