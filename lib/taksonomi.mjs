// Ürün → Çeşit → Kalite → Kalibre taksonomisi + dara ve kalite katsayıları.
// Kural kaynağı: docs/seffaf-ticaret-kurallari.md (B1, B2).

export const KALITELER = ["Ekstra", "1. Sınıf", "2. Sınıf", "Sanayilik"];

// Piyasa bandı merkez katsayıları (hal referansı 1. Sınıf kabul edilir)
export const KALITE_KATSAYI = {
  "Ekstra": 1.15,
  "1. Sınıf": 1.0,
  "2. Sınıf": 0.85,
  "Sanayilik": 0.6,
};

export const TAKSONOMI = {
  patates: {
    ad: "Patates",
    cesitler: ["Agria", "Granola", "Melody", "Lady Olympia"],
    kalibreler: ["28–35 mm", "35–55 mm", "55+ mm"],
    standart: "UNECE FFV-52, TS 1222",
  },
  sogan: {
    ad: "Soğan",
    cesitler: ["Sarı kuru", "Mor", "Taze"],
    kalibreler: ["40–60 mm", "60–80 mm", "80+ mm"],
    standart: "UNECE FFV-25, TS 794",
  },
  domates: {
    ad: "Domates",
    cesitler: ["Pembe", "Beef", "Salkım", "Kokteyl", "Salçalık"],
    kalibreler: ["47–57 mm", "57–67 mm", "67–82 mm"],
    standart: "UNECE FFV-36",
  },
  biber: {
    ad: "Biber",
    cesitler: ["Çarliston", "Sivri", "Dolma", "Kapya", "Kıl"],
    kalibreler: ["9–14 cm", "14–19 cm"],
    standart: "UNECE FFV-28",
  },
  salatalik: {
    ad: "Salatalık",
    cesitler: ["Silor", "Badem", "Sera"],
    kalibreler: ["14–19 cm", "19–25 cm"],
    standart: "UNECE FFV-15",
  },
  havuc: {
    ad: "Havuç",
    cesitler: ["Beypazarı", "Nantes"],
    kalibreler: ["20–35 mm", "35–45 mm"],
    standart: "UNECE FFV-10",
  },
};

// Kusur toleransları (kalite beyanı denetimi)
export const KUSUR_TOLERANSI = { "Ekstra": 3, "1. Sınıf": 8, "2. Sınıf": 12, "Sanayilik": 20 };

// Standart dara tablosu (ambalaj başına, kg)
export const DARA_TABLOSU = {
  "Dökme": 0,
  "Polipropilen çuval (50 kg)": 0.25,
  "File çuval (25 kg)": 0.15,
  "Plastik kasa": 1.8,
  "Tahta kasa": 2.5,
  "Karton kutu": 0.6,
};

// Zorunlu fotoğraf standardı (ilan + yükleme videosu)
export const FOTO_STANDARDI = [
  "Yığın geneli (gün ışığında)",
  "Yığın kesiti (kürek/el dalışıyla)",
  "Tekil ürün yakın çekim",
  "Kasa/çuval içi üstten",
];
