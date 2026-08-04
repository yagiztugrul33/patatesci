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
  // Hasat ilanları — ton bazlı toptan model (fiyat ₺/kg, miktar ton)
  listings: [
    { id: 1, urun: "patates", nm: "Patates", e: "patates", cesit: "Agria", fiyat: 14.0, stokTon: 5, ambalaj: "Dökme", hasat: "12 Ağustos", il: "Adana", minTon: 1, kantar: true, kalite: "1. kalite", satici: "Ali Çiftçi", uretici: true, muaf: true },
    { id: 2, urun: "patates", nm: "Patates", e: "patates", cesit: "Melody", fiyat: 13.6, stokTon: 8, ambalaj: "Çuval (25 kg)", hasat: "18 Ağustos", il: "Nevşehir", minTon: 1, kantar: true, kalite: "1. kalite", satici: "Kapadokya Kooperatifi", uretici: true, muaf: true },
    { id: 3, urun: "sogan", nm: "Soğan", e: "sogan", cesit: "Kuru soğan", fiyat: 11.2, stokTon: 12, ambalaj: "Çuval (25 kg)", hasat: "9 Ağustos", il: "Amasya", minTon: 1, kantar: false, kalite: "1. kalite", satici: "Yeşilırmak Tarım", uretici: true, muaf: true },
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
    cesit: String(input.cesit || "").trim() || null,
    fiyat: Number(input.fiyat),
    // geriye uyum: eski istemciler stok'u kg gönderir
    stokTon: input.stokTon !== undefined ? Number(input.stokTon) : Number(input.stok) / 1000,
    ambalaj: input.ambalaj || "Dökme",
    hasat: String(input.hasat || "").trim() || null,
    il: String(input.il || "").trim() || null,
    minTon: input.minTon !== undefined ? Number(input.minTon) : 1,
    kantar: !!input.kantar,
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

export function validateOffer({ urun, fiyat, ton, kg }) {
  const db = read();
  const m = db.market.find((x) => x.id === urun);
  if (!m) return { ok: false, reason: "Geçersiz ürün." };
  const f = Number(fiyat);
  // ton bazlı model; geriye uyum için kg gönderen eski istemci tona çevrilir
  const q = ton !== undefined ? Number(ton) : Number(kg) / 1000;
  const min = +(m.last * 0.85).toFixed(2);
  const max = +(m.last * 1.15).toFixed(2);
  if (isNaN(f) || isNaN(q)) return { ok: false, reason: "Fiyat ve miktar sayısal olmalıdır." };
  if (q < 1) return { ok: false, reason: "Asgari işlem miktarı 1 tondur. (Mahalle toplu alımları uygulama ile açılacaktır.)" };
  if (f < min) return { ok: false, reason: `Piyasa bandı dışı teklif: fiyat asgari sınırın altında. Asgari geçerli fiyat ${min} ₺/kg.` };
  if (f > max) return { ok: false, reason: `Piyasa bandı dışı teklif: fiyat azami sınırın üzerinde. Azami geçerli fiyat ${max} ₺/kg.` };
  return { ok: true, min, max, market: m.last, ton: q };
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
    ton: v.ton,
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
      const tonEs = Math.min(ask.ton, bid.ton);
      const m = db.market.find((x) => x.id === urun);
      const order = {
        id: db.seq.orders++,
        urun,
        nm: m ? m.nm : urun,
        e: m ? m.e : urun,
        ton: tonEs,
        fiyat: ask.fiyat, // işlem, satış fiyatından gerçekleşir (₺/kg)
        tutar: +(tonEs * 1000 * ask.fiyat).toFixed(2),
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
      ask.ton -= tonEs;
      bid.ton -= tonEs;
      if (ask.ton <= 0) ask.durum = "eslesti";
      if (bid.ton <= 0) bid.durum = "eslesti";
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
    // Belge adımları temsilidir; gerçek HKS / e-irsaliye / e-fatura
    // entegrasyonları Faz 2'de bağlanacaktır.
    const mesajlar = {
      odeme_guvencede: [
        "Görüntülü onay verildi — ödeme peşin alındı, güvencede",
        "HKS bildirimi ve künye eşleşmesi tamamlandı (demo)",
      ],
      yolda: [
        "Satıcı yola çıktı",
        "e-İrsaliye düzenlendi (demo)",
        "Yükleme kantar fişi yüklendi (demo)",
      ],
      teslim_edildi: ["Teslim edildi — varış kantar kontrolü bekleniyor"],
      tamamlandi: [
        "Alıcı onayladı — ödeme güvenceden satıcıya aktarıldı",
        "Müstahsil makbuzu / e-fatura kesildi (demo)",
      ],
    }[o.durum];
    for (const mesaj of mesajlar) o.gecmis.push(mesaj);
  } else {
    return { ok: false, reason: "Geçersiz aksiyon." };
  }
  write(db);
  return { ok: true, order: o };
}
