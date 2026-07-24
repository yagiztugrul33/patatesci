// Basit, bağımlılıksız kalıcı veri katmanı (JSON dosyası).
// Gerçek üretimde PostgreSQL/Prisma ile değiştirilir; API arayüzü aynı kalır.
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "store.json");

const SEED = {
  market: [
    { id: "patates", e: "patates", nm: "Patates", last: 18.2, chg: 2.1 },
    { id: "sogan", e: "sogan", nm: "Soğan", last: 14.6, chg: -1.4 },
    { id: "domates", e: "domates", nm: "Domates", last: 32.5, chg: 4.8 },
    { id: "biber", e: "biber", nm: "Biber", last: 41.0, chg: 0.6 },
    { id: "salatalik", e: "salatalik", nm: "Salatalık", last: 27.3, chg: -2.2 },
    { id: "havuc", e: "havuc", nm: "Havuç", last: 21.8, chg: 1.1 },
  ],
  listings: [
    { id: 1, urun: "patates", nm: "Patates", e: "patates", fiyat: 18.2, stok: 500, kalite: "1. kalite", satici: "Ege Kooperatifi", uretici: true, muaf: true },
    { id: 2, urun: "domates", nm: "Domates", e: "domates", fiyat: 31.5, stok: 300, kalite: "1. kalite", satici: "Mehmet Çiftçi", uretici: true, muaf: true },
    { id: 3, urun: "sogan", nm: "Soğan", e: "sogan", fiyat: 14.4, stok: 800, kalite: "1. kalite", satici: "Hasan Manav", uretici: false, muaf: false },
  ],
  offers: [],
  orders: [],
  users: [],
  sessions: {},
  onkayit: [],
  seq: { listings: 4, offers: 1, orders: 1, users: 1, onkayit: 1 },
};

function ensure() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify(SEED, null, 2));
}

export function read() {
  ensure();
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  // eski store dosyalarına yeni alanları ekle (geriye uyum)
  for (const k of Object.keys(SEED)) if (db[k] === undefined) db[k] = SEED[k];
  for (const k of Object.keys(SEED.seq)) if (db.seq[k] === undefined) db.seq[k] = SEED.seq[k];
  return db;
}

export function write(data) {
  ensure();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/* ================= KULLANICI & OTURUM ================= */

function hash(pw, salt) {
  return crypto.createHash("sha256").update(salt + ":" + pw).digest("hex");
}

export function registerUser({ email, sifre, ad, rol, tip }) {
  const db = read();
  email = String(email || "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, reason: "Lütfen geçerli bir e-posta adresi girin." };
  if (!sifre || sifre.length < 6) return { ok: false, reason: "Şifre en az 6 karakter olmalıdır." };
  if (db.users.find((u) => u.email === email)) return { ok: false, reason: "Bu e-posta zaten kayıtlı." };
  const salt = crypto.randomBytes(8).toString("hex");
  const user = {
    id: db.seq.users++,
    email,
    ad: ad || email.split("@")[0],
    rol: rol === "satici" ? "satici" : "alici",
    tip: rol === "satici" ? (tip || "uretici") : null, // uretici|orgut|toptanci|manav
    salt,
    hash: hash(sifre, salt),
  };
  db.users.push(user);
  write(db);
  return { ok: true, user: publicUser(user), token: createSession(user.id) };
}

export function loginUser({ email, sifre }) {
  const db = read();
  email = String(email || "").trim().toLowerCase();
  const user = db.users.find((u) => u.email === email);
  if (!user || user.hash !== hash(sifre || "", user.salt)) {
    return { ok: false, reason: "E-posta ya da şifre hatalı." };
  }
  return { ok: true, user: publicUser(user), token: createSession(user.id) };
}

function createSession(userId) {
  const db = read();
  const token = crypto.randomBytes(24).toString("hex");
  db.sessions[token] = { userId, ts: 0 };
  write(db);
  return token;
}

export function logout(token) {
  const db = read();
  delete db.sessions[token];
  write(db);
}

export function getUserByToken(token) {
  if (!token) return null;
  const db = read();
  const s = db.sessions[token];
  if (!s) return null;
  const user = db.users.find((u) => u.id === s.userId);
  return user ? publicUser(user) : null;
}

function publicUser(u) {
  return { id: u.id, email: u.email, ad: u.ad, rol: u.rol, tip: u.tip };
}

/* ================= PİYASA & İLANLAR ================= */

export function getMarket() {
  return read().market;
}

export function getListings(urun) {
  const all = read().listings;
  return urun ? all.filter((l) => l.urun === urun) : all;
}

export function addListing(input) {
  const db = read();
  const m = db.market.find((x) => x.id === input.urun);
  const muaf = input.tip === "uretici" || input.tip === "orgut" || !!input.organik;
  const listing = {
    id: db.seq.listings++,
    urun: input.urun,
    nm: m ? m.nm : input.urun,
    e: m ? m.e : input.urun,
    fiyat: Number(input.fiyat),
    stok: Number(input.stok),
    kalite: input.kalite || "1. kalite",
    satici: input.satici || "Satıcı",
    saticiId: input.saticiId || null,
    uretici: input.tip === "uretici",
    muaf,
  };
  db.listings.unshift(listing);
  write(db);
  return listing;
}

/* ================= TEKLİFLER & KOLPO ENGELİ ================= */

export function validateOffer({ urun, fiyat, kg }) {
  const db = read();
  const m = db.market.find((x) => x.id === urun);
  if (!m) return { ok: false, reason: "Geçersiz ürün." };
  const f = Number(fiyat);
  const q = Number(kg);
  const min = +(m.last * 0.85).toFixed(2);
  const max = +(m.last * 1.15).toFixed(2);
  if (isNaN(f) || isNaN(q)) return { ok: false, reason: "Fiyat ve miktar sayısal olmalıdır." };
  if (q < 10) return { ok: false, reason: "Asgari işlem miktarı 10 kg'dır." };
  if (f < min) return { ok: false, reason: `Piyasa bandı dışı teklif: fiyat asgari sınırın altında. Asgari geçerli fiyat ${min} ₺/kg.` };
  if (f > max) return { ok: false, reason: `Piyasa bandı dışı teklif: fiyat azami sınırın üzerinde. Azami geçerli fiyat ${max} ₺/kg.` };
  return { ok: true, min, max, market: m.last };
}

export function addOffer(input) {
  const v = validateOffer(input);
  if (!v.ok) return { ok: false, reason: v.reason };
  const db = read();
  const offer = {
    id: db.seq.offers++,
    yon: input.yon === "sat" ? "sat" : "al",
    urun: input.urun,
    fiyat: Number(input.fiyat),
    kg: Number(input.kg),
    kim: input.kim || (input.yon === "sat" ? "Satıcı" : "Alıcı"),
    userId: input.userId || null,
    durum: "acik",
  };
  db.offers.unshift(offer);
  write(db);
  const eslesme = matchOffers(input.urun);
  return { ok: true, offer, eslesme };
}

export function getOffers(urun) {
  const all = read().offers;
  return urun ? all.filter((o) => o.urun === urun) : all;
}

/* ================= EŞLEŞME MOTORU ================= */
// Aynı üründe: en yüksek alış >= en düşük satış ise eşleştir ve sipariş oluştur.
export function matchOffers(urun) {
  const db = read();
  const created = [];
  let changed = true;
  while (changed) {
    changed = false;
    const asks = db.offers
      .filter((o) => o.urun === urun && o.yon === "sat" && o.durum === "acik")
      .sort((a, b) => a.fiyat - b.fiyat);
    const bids = db.offers
      .filter((o) => o.urun === urun && o.yon === "al" && o.durum === "acik")
      .sort((a, b) => b.fiyat - a.fiyat);
    if (!asks.length || !bids.length) break;
    const ask = asks[0];
    const bid = bids[0];
    if (bid.fiyat >= ask.fiyat && bid.userId !== ask.userId) {
      const kgEs = Math.min(ask.kg, bid.kg);
      const m = db.market.find((x) => x.id === urun);
      const order = {
        id: db.seq.orders++,
        urun,
        nm: m ? m.nm : urun,
        e: m ? m.e : urun,
        kg: kgEs,
        fiyat: ask.fiyat, // işlem, satış fiyatından gerçekleşir
        tutar: +(kgEs * ask.fiyat).toFixed(2),
        satici: ask.kim,
        saticiId: ask.userId,
        alici: bid.kim,
        aliciId: bid.userId,
        durum: "goruntulu_onay_bekliyor",
        gecmis: ["Teklifler eşleşti"],
      };
      db.orders.unshift(order);
      created.push(order);
      // teklif miktarlarını düş; sıfırlanan teklif kapanır
      ask.kg -= kgEs;
      bid.kg -= kgEs;
      if (ask.kg <= 0) ask.durum = "eslesti";
      if (bid.kg <= 0) bid.durum = "eslesti";
      changed = true;
    }
  }
  if (created.length) write(db);
  return created;
}

/* ================= ÖN KAYIT (BEKLEME LİSTESİ) ================= */

export function addOnkayit({ email, rol, bolge }) {
  const db = read();
  email = String(email || "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, reason: "Lütfen geçerli bir e-posta adresi girin." };
  if (db.onkayit.find((k) => k.email === email))
    return { ok: false, reason: "Bu e-posta adresi için zaten bir ön kayıt bulunmaktadır." };
  const kayit = {
    id: db.seq.onkayit++,
    email,
    rol: rol === "satici" ? "satici" : "alici",
    bolge: (bolge || "").trim(),
  };
  db.onkayit.push(kayit);
  write(db);
  return { ok: true, kayit, toplam: db.onkayit.length };
}

export function getOnkayitSayisi() {
  return read().onkayit.length;
}

/* ================= SİPARİŞ AKIŞI ================= */

const DURUMLAR = [
  "goruntulu_onay_bekliyor",
  "odeme_guvencede",
  "yolda",
  "teslim_edildi",
  "tamamlandi",
];

export function getOrders(userId) {
  const all = read().orders;
  if (!userId) return all;
  return all.filter((o) => o.saticiId === userId || o.aliciId === userId);
}

export function updateOrder(id, aksiyon) {
  const db = read();
  const o = db.orders.find((x) => x.id === Number(id));
  if (!o) return { ok: false, reason: "Sipariş bulunamadı." };
  if (aksiyon === "itiraz") {
    o.durum = "itiraz";
    o.gecmis.push("Sorun bildirildi — ödeme donduruldu, inceleme başladı");
  } else if (aksiyon === "ileri") {
    const i = DURUMLAR.indexOf(o.durum);
    if (i === -1 || i === DURUMLAR.length - 1) return { ok: false, reason: "Bu sipariş ilerletilemez." };
    o.durum = DURUMLAR[i + 1];
    const mesaj = {
      odeme_guvencede: "Görüntülü onay verildi — ödeme peşin alındı, güvencede",
      yolda: "Satıcı yola çıktı",
      teslim_edildi: "Teslim edildi — alıcı kontrolü bekleniyor",
      tamamlandi: "Alıcı onayladı — ödeme güvenceden satıcıya aktarıldı",
    }[o.durum];
    o.gecmis.push(mesaj);
  } else {
    return { ok: false, reason: "Geçersiz aksiyon." };
  }
  write(db);
  return { ok: true, order: o };
}
