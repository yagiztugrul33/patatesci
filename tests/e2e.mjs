// E2E bataryası — Node fetch ile (Git Bash curl'ü Türkçe karakterleri bozuyor).
// Kullanım: sunucu çalışırken `node tests/e2e.mjs [taban-url]`
const B = process.argv[2] || "http://localhost:3000";
const R = Math.floor(Math.random() * 1e6);

let gecti = 0, kaldi = 0;
function esit(ad, gercek, beklenen) {
  const ok = String(gercek) === String(beklenen);
  console.log(`${ok ? "GECTI" : "KALDI"}  ${ad.padEnd(46)} ${gercek}${ok ? "" : ` (beklenen ${beklenen})`}`);
  ok ? gecti++ : kaldi++;
}

let sira = 0;
async function kayit(rol, tip) {
  const etiket = `${rol}${++sira}`; // her çağrı benzersiz e-posta almalı
  const r = await fetch(B + "/api/auth", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "kayit", email: `e2e${etiket}${R}@ornek.com`, sifre: "gizli123", ad: `E2E-${etiket}`, rol, tip }),
  });
  const c = r.headers.get("set-cookie")?.split(";")[0];
  if (!c) throw new Error(`kayıt başarısız (${etiket}): HTTP ${r.status}`);
  return c;
}
const J = (c, govde) => ({ method: "POST", headers: { "Content-Type": "application/json", ...(c ? { Cookie: c } : {}) }, body: typeof govde === "string" ? govde : JSON.stringify(govde) });

(async () => {
  await fetch(B + "/api/hal-fiyatlari"); // hal önbelleğini doldur

  // --- Katalog ve canlı veri ---
  const d = await (await fetch(B + "/api/denetim")).json();
  esit("katalog: hal çeşidi > 0", d.katalogSayilari.halCesit > 0, true);
  esit("katalog: kategori sayısı", d.katalogSayilari.kategori, 5);
  esit("katalog: borsa ürünü", d.katalogSayilari.borsaUrun, 3);
  esit("güvenlik: kritik açık", d.guvenlik.kritikAcik, 0);
  const ana = await (await fetch(B + "/")).text();
  esit("ana sayfa: hal tarih damgası", /Ankara Hal · \d{2}\.\d{2}\.\d{4}/.test(ana), true);
  esit("ana sayfa: borsa ürünü (fındık)", ana.includes("Fındık"), true);
  const harita = await (await fetch(B + "/tr-81-il.svg")).text();
  esit("81 il haritası: gerçek geometri", (harita.match(/<path/g) || []).length > 80, true);

  // --- Oturumlar ---
  const cS = await kayit("satici", "uretici");
  const cA = await kayit("alici");
  const cC = await kayit("alici"); // ilgisiz üçüncü kullanıcı

  // --- Menşe kuralı (NFC ve NFD) ---
  esit("menşesiz satış reddi", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 39, ton: 5 }))).status, 422);
  esit("uydurma menşe reddi", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 39, ton: 5, mense: "Paris" }))).status, 422);
  esit("menşe NFD kabulü", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 39, ton: 5, mense: "Niğde".normalize("NFD") }))).status, 201);

  // --- Sınır değerler ---
  esit("sınırsız tonaj reddi", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 39, ton: 1e308, mense: "Konya" }))).status, 422);
  esit("asgari 1 ton kuralı", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 39, ton: 0.5, mense: "Konya" }))).status, 422);
  esit("bant dışı fiyat reddi", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 999, ton: 5, mense: "Konya" }))).status, 422);

  // --- Eşleşme ve yetki ---
  esit("geçerli satış teklifi", (await fetch(B + "/api/offers", J(cS, { yon: "sat", urun: "patates", kalite: "1. Sınıf", fiyat: 39, ton: 5, mense: "Nevşehir" }))).status, 201);
  esit("alış teklifi (eşleşme)", (await fetch(B + "/api/offers", J(cA, { yon: "al", urun: "patates", kalite: "1. Sınıf", fiyat: 39.5, ton: 5 }))).status, 201);
  const emir = await (await fetch(B + "/api/orders", { headers: { Cookie: cA } })).json();
  const id = emir.orders?.[0]?.id;
  esit("sipariş oluştu", typeof id === "number", true);
  esit("IDOR: yabancı kullanıcı 403", (await fetch(B + "/api/orders", J(cC, { id, aksiyon: "ileri" }))).status, 403);
  esit("gerçek taraf işlem yapabiliyor", (await fetch(B + "/api/orders", J(cA, { id, aksiyon: "ileri" }))).status, 200);

  // --- Ödeme izi (DEMO soyut katman): tahsilat → güvence → split ---
  // "ileri" bir kez yukarıda çağrıldı (goruntulu_onay_bekliyor = tahsilat).
  await fetch(B + "/api/orders", J(cA, { id, aksiyon: "ileri" })); // odeme_guvencede = güvence
  await fetch(B + "/api/orders", J(cA, { id, aksiyon: "ileri" })); // yolda
  await fetch(B + "/api/orders", J(cA, { id, aksiyon: "ileri" })); // teslim_edildi
  await fetch(B + "/api/orders", J(cA, { id, aksiyon: "ileri" })); // tamamlandi = split
  const son = await (await fetch(B + "/api/orders", { headers: { Cookie: cA } })).json();
  const sip = son.orders?.find((o) => o.id === id);
  const hareketTurleri = (sip?.odeme?.hareketler || []).map((h) => h.tur).join(">");
  esit("ödeme izi: tahsilat>guvence>split", hareketTurleri, "tahsilat>guvence>split");
  esit("ödeme izi: hepsi demo etiketli", (sip?.odeme?.hareketler || []).every((h) => h.demo === true), true);
  const splitH = sip?.odeme?.hareketler?.find((h) => h.tur === "split");
  esit("ödeme izi: split toplamı tutara eşit", splitH ? Math.round((splitH.saticiPay + splitH.komisyon) * 100) / 100 === sip.tutar : false, true);

  // --- Kimlik ve gövde doğrulama ---
  esit("oturumsuz teklif 401", (await fetch(B + "/api/offers", J(null, { yon: "al", urun: "patates", fiyat: 39, ton: 5 }))).status, 401);
  esit("oturumsuz sipariş 401", (await fetch(B + "/api/orders", J(null, { id: 1, aksiyon: "ileri" }))).status, 401);
  esit("bozuk JSON 400 (5xx değil)", (await fetch(B + "/api/onkayit", J(null, "bozuk-json"))).status, 400);
  esit("dizi gövde 400", (await fetch(B + "/api/onkayit", J(null, [1, 2, 3]))).status, 400);

  // --- Satıcı onboarding + yönetim paneli yetkisi ---
  esit("onboarding: oturumsuz 401", (await fetch(B + "/api/onboarding", J(null, { kunyeNo: "KNY-1" }))).status, 401);
  esit("onboarding: eksik numara 422", (await fetch(B + "/api/onboarding", J(cS, { bolge: "Polatlı" }))).status, 422);
  esit("onboarding: geçerli başvuru 201", (await fetch(B + "/api/onboarding", J(cS, { kunyeNo: "KNY-2026-1234", bolge: "Polatlı", sertifikalar: ["GlobalGAP"] }))).status, 201);
  esit("onboarding: çift başvuru 422", (await fetch(B + "/api/onboarding", J(cS, { kunyeNo: "KNY-2026-1234" }))).status, 422);
  const obDurum = await (await fetch(B + "/api/onboarding", { headers: { Cookie: cS } })).json();
  esit("onboarding: durum dogrulama_bekliyor", obDurum.basvuru?.durum, "dogrulama_bekliyor");

  const Y = "e2e-yonetim-anahtari";
  const yDurum = (await fetch(B + "/api/yonetim")).status;
  if (yDurum === 503) {
    // Anahtar tanımsız ortam (soğuk klon): kasa kapalı — bu da doğrulanan bir davranıştır.
    esit("yönetim: anahtar tanımsızken kasa kapalı (503)", yDurum, 503);
  } else {
    esit("yönetim: anahtarsız istek 401", yDurum, 401);
    esit("yönetim: yanlış anahtar 401", (await fetch(B + "/api/yonetim", { headers: { "x-yonetim-anahtar": "yanlis" } })).status, 401);
    esit("yönetim: oturum çerezi anahtar yerine GEÇMEZ", (await fetch(B + "/api/yonetim", { headers: { Cookie: cS } })).status, 401);
    const yOzet = await (await fetch(B + "/api/yonetim", { headers: { "x-yonetim-anahtar": Y } })).json();
    esit("yönetim: doğru anahtarla özet", typeof yOzet.ozet?.onkayit, "number");
    const yListe = await (await fetch(B + "/api/yonetim?bolum=onboarding", { headers: { "x-yonetim-anahtar": Y } })).json();
    const bekleyen = yListe.liste?.find((b) => b.durum === "dogrulama_bekliyor" && b.kunyeNo === "KNY-2026-1234");
    esit("yönetim: kuyrukta başvuru görünüyor", !!bekleyen, true);
    const kararR = await fetch(B + "/api/yonetim", { method: "POST", headers: { "x-yonetim-anahtar": Y, "Content-Type": "application/json" }, body: JSON.stringify({ islem: "onboarding-karar", userId: bekleyen?.userId, karar: "onay" }) });
    esit("yönetim: onay kararı 200", kararR.status, 200);
    const obSon = await (await fetch(B + "/api/onboarding", { headers: { Cookie: cS } })).json();
    esit("onboarding: onay sonrası onaylı üye", obSon.onayliUye, true);
  }

  // --- Güvenlik başlıkları ---
  const h = (await fetch(B + "/")).headers;
  esit("başlık: X-Frame-Options", h.get("x-frame-options"), "DENY");
  esit("başlık: CSP var", !!h.get("content-security-policy"), true);
  esit("başlık: nosniff", h.get("x-content-type-options"), "nosniff");

  console.log(`\nE2E SONUC: ${gecti} gecti, ${kaldi} kaldi`);
  process.exit(kaldi ? 1 : 0);
})();
