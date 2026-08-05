// patatesci FİNANS MOTORU — tek kaynak. Şeffaf Maliyet Dökümü ve /yonetim/hesap
// AYNI sabitlerden beslenir. Kaynaklı/temsili ayrımı zorunludur (uydurma yasak).

export const FINANS = {
  komisyonOran: 0.03, // satıcıdan (kural kitabı B5)
  hizmetBedeli: 250, // alıcıdan, işlem başı belge/uyum bedeli
  // Kademeli hizmet bedeli ÖNERİSİ (Faz 2): 1 tonluk işlemin neti sabit 250 ile taşımıyor
  hizmetKademe: [
    { maxTon: 3, bedel: 250 },
    { maxTon: 10, bedel: 400 },
    { maxTon: Infinity, bedel: 600 },
  ],
  odeme: {
    // Ana yöntem: havale/EFT → güvence hesabı. %1 TEMSİLİDİR (ödeme kuruluşu
    // sanal hesap/pay-by-bank ücreti — DOĞRULANAMADI, brokere/PSP'ye sorulacak).
    havale: { oran: 0.01, etiket: "temsili" },
    // Kart: tek çekim piyasa oranı ~%1,95-2,5+ (kaynaklı: deltaweb.com.tr,
    // moyduz.com, poskomisyon.com 2026 karşılaştırmaları). TON İŞLEMLERİNDE
    // KART YASAK varsayımı — aşağıdaki posEtkisi() tablosu gerekçesidir.
    pos: { oran: 0.025, etiket: "kaynaklı (piyasa bandı üst)" },
  },
  teslimatMarjOran: 0.1, // S2-S4 hizmet bedelinden platform payı
  onayliUyeBedeli: 500, // tek seferlik, KYC karşılığı (Faz 1)
  cezaRezervOran: 0.1, // brüt gelirin %10'u hakem/iade rezervi
  sabitGiderAy: 325000, // 2026 bandı 300-350k ₺/ay (docs/finansal-model.md)
  nakliye: {
    payOran: 0.08,
    aktif: false, // TİO/R2 yetki belgesi onayı ÖNCESİ AÇILMAZ (yasal şart)
    not: "Taşıma İşleri Organizatörlüğü Yönetmeliği (RG 27.08.2022/31936) kapsamında TİO yetki belgesi gerekir; belge ücreti 273.244 ₺ + ÜDY3/ODY3 istihdam şartı.",
  },
};

export function hizmetBedeliKademeli(ton) {
  return FINANS.hizmetKademe.find((k) => ton <= k.maxTon).bedel;
}

// 1 işlem anatomisi (ve dolayısıyla 1 kg anatomisi)
export function islemAnatomisi({ ton, fiyat, teslimatHizmetBedeli = 0, yontem = "havale", kademeliHizmet = false }) {
  const tutar = ton * 1000 * fiyat;
  const hizmet = kademeliHizmet ? hizmetBedeliKademeli(ton) : FINANS.hizmetBedeli;
  const gelir = {
    komisyon: Math.round(tutar * FINANS.komisyonOran),
    hizmet,
    teslimatMarj: Math.round(teslimatHizmetBedeli * FINANS.teslimatMarjOran),
  };
  const brutGelir = gelir.komisyon + gelir.hizmet + gelir.teslimatMarj;
  const gider = {
    odemeKesinti: Math.round(tutar * FINANS.odeme[yontem].oran),
    cezaRezerv: Math.round(brutGelir * FINANS.cezaRezervOran),
  };
  const net = brutGelir - gider.odemeKesinti - gider.cezaRezerv;
  return { tutar, gelir, brutGelir, gider, net, netKg: +(net / (ton * 1000)).toFixed(3), yontem };
}

// Kart tahsilatının marjı nasıl erittiğinin kanıt tablosu (yasak varsayımının gerekçesi)
export function posEtkisi({ ton, fiyat }) {
  const havale = islemAnatomisi({ ton, fiyat, yontem: "havale" });
  const pos = islemAnatomisi({ ton, fiyat, yontem: "pos" });
  const erime = havale.net > 0 ? +(((havale.net - pos.net) / havale.net) * 100).toFixed(1) : null;
  return { havaleNet: havale.net, posNet: pos.net, erimeYuzde: erime };
}

export function aylikModel({ islemGun, gunSayisi = 26, ortTon, ortFiyat, teslimatHizmetBedeli = 0, yontem = "havale", sabit = FINANS.sabitGiderAy, kademeliHizmet = false }) {
  const birim = islemAnatomisi({ ton: ortTon, fiyat: ortFiyat, teslimatHizmetBedeli, yontem, kademeliHizmet });
  const islemAy = Math.round(islemGun * gunSayisi);
  const netAy = birim.net * islemAy;
  return { birim, islemAy, tonAy: +(ortTon * islemAy).toFixed(1), netAy, kar: netAy - sabit, sabit };
}

export function basabas({ ortTon, ortFiyat, teslimatHizmetBedeli = 0, yontem = "havale", sabit = FINANS.sabitGiderAy, gunSayisi = 26, kademeliHizmet = false }) {
  const birim = islemAnatomisi({ ton: ortTon, fiyat: ortFiyat, teslimatHizmetBedeli, yontem, kademeliHizmet });
  if (birim.net <= 0) return { imkansiz: true, birim };
  const islemAy = Math.ceil(sabit / birim.net);
  return { islemAy, islemGun: +(islemAy / gunSayisi).toFixed(1), tonAy: +(ortTon * islemAy).toFixed(0), birim };
}
