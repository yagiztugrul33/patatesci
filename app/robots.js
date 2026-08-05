import { SITE_URL } from "../lib/site";

// Demo sayfaları ve API taranmasın; tanıtım sayfaları açık.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        // /api/denetim dış denetçiye açıktır (kamuya açık doğrulama ucu);
        // Allow, daha uzun eşleşme olduğu için /api/ yasağını ezer.
        allow: ["/", "/api/denetim"],
        disallow: ["/pazar", "/borsa", "/sat", "/giris", "/siparisler", "/api/", "/yonetim/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
