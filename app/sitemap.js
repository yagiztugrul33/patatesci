import { SITE_URL } from "../lib/site";

// Yalnızca tanıtım ve hukuki sayfalar; demo sayfaları bilinçli olarak dışarıda.
export default function sitemap() {
  const simdi = new Date();
  const sayfalar = [
    { yol: "", oncelik: 1, siklik: "weekly" },
    { yol: "/hukuki/kvkk", oncelik: 0.3, siklik: "monthly" },
    { yol: "/hukuki/kullanici-sozlesmesi", oncelik: 0.3, siklik: "monthly" },
    { yol: "/hukuki/mesafeli-satis", oncelik: 0.3, siklik: "monthly" },
    { yol: "/hukuki/iletisim", oncelik: 0.3, siklik: "monthly" },
  ];
  return sayfalar.map((s) => ({
    url: SITE_URL + s.yol,
    lastModified: simdi,
    changeFrequency: s.siklik,
    priority: s.oncelik,
  }));
}
