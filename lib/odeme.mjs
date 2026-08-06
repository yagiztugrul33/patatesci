// Soyut ödeme katmanı — demo→gerçek PSP köprüsü.
//
// ARAYÜZ SABİTTİR: tahsilat → guvence → split → iade. Sipariş makinesi yalnız
// bu dört fonksiyonu çağırır; gerçek PSP (bkz. docs/ODEME-KARARI.md — birincil
// aday iyzico Pazaryeri) geldiğinde yalnız yeni bir sağlayıcı adaptörü yazılır,
// sipariş makinesi ve API sözleşmesi DEĞİŞMEZ.
//
// Sağlayıcı seçimi env ile: PSP_SAGLAYICI=iyzico + IYZICO_API_KEY/SECRET
// tanımlıysa (ileride yazılacak) iyzico adaptörü; aksi halde demo. SIR YOK:
// bu dosya hiçbir anahtar içermez, anahtar isimleri operatör kuyruğundadır.
//
// Her fonksiyon bir "hareket" kaydı döndürür; sipariş üzerinde
// order.odeme.hareketler dizisinde saat damgalı iz bırakılır (denetim izi).

let sayac = 0;
function islemId(onEk) {
  // Demo işlem numarası — gerçek PSP kendi işlem numarasını döndürür.
  return `${onEk}-${Date.now().toString(36)}-${++sayac}`;
}

function hareket(tur, { siparisId, tutar, aciklama }) {
  return {
    ok: true,
    tur, // "tahsilat" | "guvence" | "split" | "iade"
    islemId: islemId(tur),
    siparisId,
    tutar: Math.round(Number(tutar) * 100) / 100,
    aciklama: aciklama || "",
    saglayici: "demo",
    demo: true, // gerçek para hareketi YOK — arayüzde "demo" etiketi zorunlu
    ts: Date.now(),
  };
}

// ---- Demo sağlayıcı ----
// Gerçek adaptör aynı imzalarla yazılacak (async kalabilir; demo senkron
// çalışır ama Promise sözleşmesini bozmamak için değerler direkt döner —
// çağıran taraf await kullanmaz, saf ve test edilebilir kalır).
const demoSaglayici = {
  ad: "demo",
  /** Alıcıdan peşin tahsilat (kart/havale). */
  tahsilat({ siparisId, tutar }) {
    if (!(Number(tutar) > 0)) return { ok: false, reason: "Tutar pozitif olmalı." };
    return hareket("tahsilat", { siparisId, tutar, aciklama: "Alıcıdan peşin tahsilat (demo)" });
  },
  /** Tahsil edilen tutarın güvence (emanet) hesabına alınması. */
  guvence({ siparisId, tutar }) {
    if (!(Number(tutar) > 0)) return { ok: false, reason: "Tutar pozitif olmalı." };
    return hareket("guvence", { siparisId, tutar, aciklama: "Bedel güvence hesabında bloke (demo)" });
  },
  /**
   * Güvencedeki tutarın dağıtımı: üretici hakedişi + platform komisyonu.
   * komisyonOran 0-1 aralığında (örn. 0.02). Kuruş farkı üreticiye yazılır.
   */
  split({ siparisId, tutar, komisyonOran = 0 }) {
    const t = Number(tutar);
    const oran = Number(komisyonOran);
    if (!(t > 0)) return { ok: false, reason: "Tutar pozitif olmalı." };
    if (!(oran >= 0 && oran < 1)) return { ok: false, reason: "Komisyon oranı [0,1) aralığında olmalı." };
    const komisyon = Math.round(t * oran * 100) / 100;
    const saticiPay = Math.round((t - komisyon) * 100) / 100;
    const h = hareket("split", { siparisId, tutar: t, aciklama: "Güvenceden dağıtım: üretici + platform (demo)" });
    return { ...h, saticiPay, komisyon };
  },
  /** Kısmi/tam iade (iptal, eksik tartı, kalite indirimi). */
  iade({ siparisId, tutar, sebep }) {
    if (!(Number(tutar) > 0)) return { ok: false, reason: "Tutar pozitif olmalı." };
    return { ...hareket("iade", { siparisId, tutar, aciklama: sebep || "İade (demo)" }), sebep: sebep || "" };
  },
};

/** Aktif sağlayıcıyı döndürür. Gerçek PSP adaptörü eklenince burada seçilir. */
export function odemeSaglayici() {
  // İleride: if (process.env.PSP_SAGLAYICI === "iyzico" && process.env.IYZICO_API_KEY) return iyzicoSaglayici;
  return demoSaglayici;
}

// Kısa yollar — sipariş makinesinin kullandığı sabit arayüz.
export const tahsilat = (p) => odemeSaglayici().tahsilat(p);
export const guvence = (p) => odemeSaglayici().guvence(p);
export const split = (p) => odemeSaglayici().split(p);
export const iade = (p) => odemeSaglayici().iade(p);

/** Platform komisyon oranı (demo): finansal modeldeki temsilî %2. */
export const PLATFORM_KOMISYON_ORANI_TEMSILI = 0.02;
