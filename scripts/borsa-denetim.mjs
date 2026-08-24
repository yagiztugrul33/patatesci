// /borsa terminal yüzeyi — titiz denetim.
// Ölçülenler: WCAG kontrast (her görünür metin düğümü), dokunma hedefi,
// odak görünürlüğü, başlık hiyerarşisi, Türkçe büyük harf dönüşümü,
// tasarım sistemi kuralları (gölge, satır yüksekliği, yarıçap, font ağırlığı),
// yatay taşma — birden çok genişlik ve birden çok form durumunda.
import { chromium } from "playwright";

const URL = "http://localhost:3000/borsa";
const t = await chromium.launch({ headless: true });

// ---- sayfa içine enjekte edilecek denetim fonksiyonu ----
const DENETIM = () => {
  const srgb = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const lum = (rgb) => {
    const [r, g, b] = rgb;
    return 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
  };
  const ayrist = (s) => {
    const m = s && s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const kat = (ust, alt) => {
    // ust yarı saydamsa alt ile harmanla
    const a = ust.a;
    return ust.rgb.map((c, i) => c * a + alt.rgb[i] * (1 - a));
  };
  const etkinZemin = (el) => {
    let n = el, yigin = [];
    while (n && n.nodeType === 1) {
      const z = ayrist(getComputedStyle(n).backgroundColor);
      if (z && z.a > 0) { yigin.push(z); if (z.a === 1) break; }
      n = n.parentElement;
    }
    if (!yigin.length) return [255, 255, 255];
    let sonuc = yigin[yigin.length - 1].rgb;
    for (let i = yigin.length - 2; i >= 0; i--) sonuc = kat(yigin[i], { rgb: sonuc, a: 1 });
    return sonuc;
  };
  const oran = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  };

  const bulgular = [];
  const kok = document.querySelector(".trm");
  if (!kok) return { hata: "terminal kökü yok" };

  // ---- 1) KONTRAST: görünür metin taşıyan her eleman ----
  const gorunur = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0.05;
  };
  for (const el of kok.querySelectorAll("*")) {
    // yalnız doğrudan metin düğümü taşıyanlar (çocuklardaki metni iki kez sayma)
    const kendiMetin = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join("");
    if (!kendiMetin || !gorunur(el)) continue;
    const s = getComputedStyle(el);
    const on = ayrist(s.color);
    if (!on) continue;
    const zem = etkinZemin(el);
    const onRgb = on.a < 1 ? kat(on, { rgb: zem, a: 1 }) : on.rgb;
    const k = oran(onRgb, zem);
    const px = parseFloat(s.fontSize);
    const kalin = parseInt(s.fontWeight, 10) >= 700;
    const buyukMetin = px >= 24 || (px >= 18.66 && kalin);
    const esik = buyukMetin ? 3 : 4.5;
    if (k < esik) {
      bulgular.push({
        tur: "kontrast",
        secici: el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : el.tagName,
        metin: kendiMetin.slice(0, 40),
        olculen: +k.toFixed(2),
        esik,
        renk: s.color,
        zemin: `rgb(${zem.map(Math.round).join(", ")})`,
        boyut: px,
      });
    }
  }

  // ---- 2) DOKUNMA HEDEFİ: etkileşimli elemanlar ----
  for (const el of kok.querySelectorAll("button, a, input, select, [role=button]")) {
    if (!gorunur(el)) continue;
    const r = el.getBoundingClientRect();
    // onay kutusu native; 24px altını raporla, düğmeler için 44 hedefi
    const hedef = el.type === "checkbox" ? 20 : 40;
    if (r.height < hedef || r.width < 12) {
      bulgular.push({
        tur: "dokunma-hedefi",
        secici: (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : el.tagName),
        metin: (el.innerText || el.value || el.type || "").slice(0, 24),
        yukseklik: Math.round(r.height),
        genislik: Math.round(r.width),
        hedef,
      });
    }
  }

  // ---- 3) TASARIM SİSTEMİ KURALLARI ----
  for (const el of kok.querySelectorAll("*")) {
    if (!gorunur(el)) continue;
    const s = getComputedStyle(el);
    const golge = s.boxShadow;
    if (golge && golge !== "none" && !golge.includes("inset"))
      bulgular.push({ tur: "golge", secici: el.className || el.tagName, deger: golge.slice(0, 40) });
    const a = parseInt(s.fontWeight, 10);
    if (a >= 600 && el.closest(".trm"))
      bulgular.push({ tur: "font-agirligi", secici: el.className || el.tagName, deger: a, metin: (el.innerText || "").slice(0, 24) });
    // satır yüksekliği 1.5 üstü (metin taşıyanlarda)
    const kendi = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("");
    if (kendi) {
      const lh = parseFloat(s.lineHeight), fs = parseFloat(s.fontSize);
      if (lh && fs && lh / fs > 1.55)
        bulgular.push({ tur: "satir-yuksekligi", secici: el.className || el.tagName, deger: +(lh / fs).toFixed(2), metin: kendi.slice(0, 24) });
    }
  }

  // ---- 4) BAŞLIK HİYERARŞİSİ ----
  const basliklar = [...kok.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    seviye: +h.tagName[1], metin: h.innerText.trim().slice(0, 40),
  }));

  // ---- 5) TÜRKÇE BÜYÜK HARF ----
  // text-transform:uppercase Türkçe'de i→İ olmalı (lang=tr). Kontrol: mono etiketler.
  const trHatalari = [];
  for (const el of kok.querySelectorAll("*")) {
    const s = getComputedStyle(el);
    if (s.textTransform !== "uppercase") continue;
    const kendi = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("");
    if (/[iı]/.test(kendi)) trHatalari.push({ kaynak: kendi.trim().slice(0, 40) });
  }

  // ---- 6) ETİKET BAĞLARI ----
  const bagsiz = [];
  for (const g of kok.querySelectorAll("input, select, textarea")) {
    if (g.type === "hidden") continue;
    const id = g.id;
    const etiketli = (id && kok.querySelector(`label[for="${CSS.escape(id)}"]`)) || g.closest("label") || g.getAttribute("aria-label");
    if (!etiketli) bagsiz.push({ tur: g.tagName + (g.type ? ":" + g.type : ""), id: id || "(id yok)" });
  }

  // ---- 7) CANLI BÖLGE ----
  const durumMetinleri = [...kok.querySelectorAll(".trm-not")].map((e) => ({
    metin: e.innerText.trim().slice(0, 30),
    canliBolge: e.getAttribute("aria-live") || e.getAttribute("role") || null,
  }));

  return {
    bulgular,
    basliklar,
    trHatalari,
    bagsiz,
    durumMetinleri,
    yatayTasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    sayfaYuksekligi: Math.round(document.documentElement.scrollHeight),
  };
};

// ---- durum kurulumları ----
const DURUMLAR = {
  async varsayilan() {},
  async mense(p) {
    const m = p.locator("#trm-mense");
    if (await m.count()) { const n = await m.locator("option").count(); if (n > 1) await m.selectOption({ index: 1 }); }
    const k = p.locator(".trm-onay input[type=checkbox]");
    if (await k.count()) await k.first().check();
  },
  async bandIhlali(p) {
    const m = p.locator("#trm-mense");
    if (await m.count()) { const n = await m.locator("option").count(); if (n > 1) await m.selectOption({ index: 1 }); }
    await p.fill("#trm-fiyat", "999");
  },
  async alisS4(p) {
    await p.locator(".trm-yon button", { hasText: "Alış" }).click();
    const s = p.locator("#trm-seviye");
    if (await s.count()) await s.selectOption("S4");
  },
};

const GENISLIKLER = [[320, "320px"], [375, "375px"], [768, "768px"], [1280, "1280px"]];
const ozet = {};

for (const [w, ad] of GENISLIKLER) {
  const b = await t.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await b.newPage();
  await p.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForSelector(".trm-tablo tbody tr", { timeout: 30000 });
  await p.waitForTimeout(700);

  for (const [durumAd, kur] of Object.entries(DURUMLAR)) {
    // her durum için taze sayfa (durumlar birbirine karışmasın)
    await p.reload({ waitUntil: "domcontentloaded" });
    await p.waitForSelector(".trm-tablo tbody tr", { timeout: 30000 });
    await p.waitForTimeout(600);
    await kur(p);
    await p.waitForTimeout(400);
    const r = await p.evaluate(DENETIM);
    ozet[`${ad}/${durumAd}`] = r;
  }
  await b.close();
}

// ---- odak görünürlüğü (tek genişlikte yeterli) ----
const b2 = await t.newContext({ viewport: { width: 1280, height: 900 } });
const p2 = await b2.newPage();
await p2.goto(URL, { waitUntil: "domcontentloaded" });
 await p2.waitForSelector(".trm-tablo tbody tr", { timeout: 30000 });
await p2.waitForTimeout(700);
const odak = [];
const odaklanabilir = await p2.locator(".trm button, .trm input, .trm select").all();
for (const el of odaklanabilir.slice(0, 14)) {
  await el.focus();
  const bilgi = await el.evaluate((e) => {
    const s = getComputedStyle(e);
    return {
      etiket: (e.innerText || e.id || e.type || e.tagName).slice(0, 22),
      anahat: s.outlineStyle === "none" ? null : `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`,
    };
  });
  if (!bilgi.anahat) odak.push(bilgi);
}
await b2.close();
await t.close();

// ---- RAPOR: yalnız bulgular ----
const say = {};
for (const [k, v] of Object.entries(ozet)) {
  if (v.hata) { console.log(k, "HATA", v.hata); continue; }
  for (const b of v.bulgular) say[b.tur] = (say[b.tur] || 0) + 1;
}
console.log("=== BULGU SAYILARI (tum genislik x durum) ===");
console.log(JSON.stringify(say, null, 2));

// benzersiz bulgular (secici+tur bazinda)
const benzersiz = new Map();
for (const v of Object.values(ozet)) {
  if (!v.bulgular) continue;
  for (const b of v.bulgular) {
    const anahtar = b.tur + "|" + b.secici + "|" + (b.metin || "");
    if (!benzersiz.has(anahtar)) benzersiz.set(anahtar, b);
  }
}
console.log("\n=== BENZERSIZ BULGULAR ===");
for (const b of benzersiz.values()) console.log(JSON.stringify(b));

const ilk = ozet["1280px/varsayilan"];
console.log("\n=== BASLIK HIYERARSISI ===");
console.log(JSON.stringify(ilk.basliklar));
console.log("\n=== TURKCE BUYUK HARF (uppercase icinde i/ı) ===");
console.log(JSON.stringify(ilk.trHatalari));
console.log("\n=== ETIKETSIZ GIRDI ===");
console.log(JSON.stringify(ilk.bagsiz));
console.log("\n=== DURUM METINLERI (canli bolge) ===");
console.log(JSON.stringify(ozet["1280px/mense"].durumMetinleri));
console.log("\n=== ODAK HALKASI OLMAYAN ===");
console.log(JSON.stringify(odak));
console.log("\n=== YATAY TASMA ===");
for (const [k, v] of Object.entries(ozet)) if (v.yatayTasma) console.log(`  ${k}: ${v.yatayTasma}px`);
console.log("  (yukarida satir yoksa hicbir genislikte tasma yok)");
